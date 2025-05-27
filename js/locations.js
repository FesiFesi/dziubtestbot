/**
 * System lokacji w grze DziubCoins
 */

// Ta konfiguracja zostanie zastąpiona przez szczegółową konfigurację w gameState
// Zachowujemy ją dla kompatybilności z istniejącym kodem
const LOCATIONS_CONFIG = {
    // Park miejski (odblokowany domyślnie)
    park: {
        name: t('locations.parkName'),
        unlocked: true,
        cost: 0,
        birdTypes: ["common_sparrow", "rare_robin", "epic_cardinal", "legendary_phoenix", "mythical_eagle"]
    },
    // Brzeg jeziora (do odblokowania)
    lake: {
        name: t('locations.lakeName'),
        unlocked: false,
        cost: 300,
        birdTypes: ["common_duck", "rare_heron", "epic_swan", "legendary_pelican", "mythical_kraken"]
    },
    forest: {
        name: t('locations.forestName'),
        unlocked: false,
        cost: 1000,
        birdTypes: ["common_woodpecker", "rare_owl", "epic_hawk", "legendary_griffin", "mythical_phoenix"]
    }
};

// Funkcja do pobierania aktualnej konfiguracji lokacji
function getLocationConfig(locationId) {
    // Pobieranie z nowej struktury gameState
    if (gameState.locations && gameState.locations.configs && gameState.locations.configs[locationId]) {
        return gameState.locations.configs[locationId];
    }
    
    // Fallback do starej struktury
    return LOCATIONS_CONFIG[locationId];
}

// Inicjalizacja systemu lokacji
function initLocations() {
    console.log(t('locations.logs.initSystem'));
    
    // ZMIANA #1: Zapisz stan lokacji przed inicjalizacją do debugowania
    const preInitLocationsState = gameState.locations ? JSON.stringify(gameState.locations.unlockedLocations) : "brak";
    console.log(t('locations.logs.preInitState'), preInitLocationsState);
    
    // ZMIANA #2: Upewnij się, że w gameState istnieje sekcja na lokacje, ale ZACHOWAJ istniejące wartości
    if (!gameState.locations) {
        console.log(t('locations.logs.noLocationsObject'));
        gameState.locations = {
            currentLocation: "park", // Domyślna lokacja
            unlockedLocations: {
                park: true,
                lake: false
            }
        };
    } else {
        // ZMIANA #3: Upewnij się, że mamy wszystkie potrzebne pola, zachowując istniejące wartości
        if (!gameState.locations.currentLocation) {
            console.log(t('locations.logs.noCurrentLocation'));
            gameState.locations.currentLocation = "park";
        }
        
        if (!gameState.locations.unlockedLocations) {
            console.log(t('locations.logs.noUnlockedLocations'));
            gameState.locations.unlockedLocations = {
                park: true,
                lake: false
            };
        } else {
            console.log(t('locations.logs.usingExistingValues'), gameState.locations.unlockedLocations);
        }
    }
    
    // Sprawdź, czy aktualna lokacja jest odblokowana, jeśli nie - przywróć do park
    if (!gameState.locations.unlockedLocations[gameState.locations.currentLocation]) {
        console.warn(t('locations.logs.currentLocationLocked', {location: gameState.locations.currentLocation}));
        gameState.locations.currentLocation = "park";
    }
    
    // ZMIANA #4: Sprawdź czy lokacje są dodane w unlockedLocations - dla bezpieczeństwa
    if (!('park' in gameState.locations.unlockedLocations)) {
        console.log(t('locations.logs.addingParkLocation'));
        gameState.locations.unlockedLocations.park = true;
    }
    
    if (!('lake' in gameState.locations.unlockedLocations)) {
        console.log(t('locations.logs.addingLakeLocation'));
        gameState.locations.unlockedLocations.lake = false;
    }
    
    // Upewnij się, że mamy struktury danych dla wszystkich lokacji
    if (!gameState.locationSlots) {
        gameState.locationSlots = {};
    }
    
    if (!gameState.locationUnlockedSlots) {
        gameState.locationUnlockedSlots = {};
    }
    
    // Upewnij się, że mamy struktury dla każdej lokacji w konfiguracji
    Object.keys(gameState.locations.configs).forEach(locId => {
        // Inicjalizuj sloty dla lokacji, jeśli nie istnieją
        if (!gameState.locationSlots[locId]) {
            gameState.locationSlots[locId] = [
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0}
            ];
        }
        
        // Inicjalizuj odblokowane sloty dla lokacji, jeśli nie istnieją
        if (!gameState.locationUnlockedSlots[locId]) {
            gameState.locationUnlockedSlots[locId] = [true, true, false, false, false];
        }
        
        // Inicjalizuj struktury odkrytych ptaków dla lokacji
        if (!gameState.discoveredBirds) {
            gameState.discoveredBirds = {};
        }
        
        if (!gameState.discoveredBirds[locId]) {
            gameState.discoveredBirds[locId] = {};
            
            // Domyślnie pierwszy ptak w parku jest odkryty
            if (locId === "park" && gameState.locations.configs[locId].birdCatalogMapping) {
                const firstBirdId = gameState.locations.configs[locId].birdCatalogMapping.common;
                if (firstBirdId) {
                    gameState.discoveredBirds[locId][firstBirdId] = true;
                }
            }
        }
    });
    
    // ZMIANA #5: Zapisz stan gry po inicjalizacji, tylko jeśli wykryto zmiany
    const postInitLocationsState = JSON.stringify(gameState.locations.unlockedLocations);
    if (preInitLocationsState !== postInitLocationsState) {
        console.log(t('locations.logs.stateChangesDetected'));
        console.log(t('locations.logs.stateBefore'), preInitLocationsState);
        console.log(t('locations.logs.stateAfter'), postInitLocationsState);
        if (typeof saveGame === 'function') {
            saveGame();
        }
    }
    
    // Dodaj obsługę przycisku mapy
    const mapButton = document.getElementById('map-button');
    if (mapButton) {
        mapButton.onclick = function() {
            showMapScreen();
        };
    }
    
    // Dodaj obsługę przycisku powrotu
    const backButton = document.getElementById('map-back-button');
    if (backButton) {
        backButton.onclick = function() {
            hideAndShowScreen('feed-screen');
        };
    }

    // Inicjalizacja przycisków "Nakarm wszystkie"/"Odbierz wszystkie"
    const actionAllButtons = document.querySelectorAll('.action-all-button');
    actionAllButtons.forEach(button => {
        // Usuń poprzednie event listenery
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Dodaj nowy event listener
        newButton.addEventListener('click', function(event) {
            if (typeof handleActionAllButton === 'function') {
                handleActionAllButton(event);
            }
        });
    });

    // Pierwsza aktualizacja stanu przycisków
    if (typeof updateAllActionButtons === 'function') {
        updateAllActionButtons();
    }
        
    // Dodaj obsługę przycisków odblokowania lokacji
    setupUnlockLocationButtons();
    
    // Aktualizuj tło ekranu karmienia dla aktualnej lokacji
    const feedScreen = document.getElementById('feed-screen');
    const locationConfig = gameState.locations.configs[gameState.locations.currentLocation];
    if (feedScreen && locationConfig && locationConfig.background) {
        feedScreen.style.backgroundImage = `url('${locationConfig.background}')`;
    }
    
 
    
// Aktualizuj nazwę lokacji w UI
const locationNameElement = document.getElementById('current-location-name');
if (locationNameElement && locationConfig) {
    // Użyj klucza tłumaczeniowego zamiast bezpośredniej nazwy
    const locationKey = `locations.${gameState.locations.currentLocation}Name`;
    locationNameElement.textContent = t(locationKey);
}

    
    // ZMIANA #6: Dodaj dodatkowe logowanie na koniec inicjalizacji
    console.log(t('locations.logs.initComplete'), gameState.locations.unlockedLocations);
}

// Pokazywanie ekranu mapy
function showMapScreen() {
    console.log(t('locations.logs.showingMapScreen'));
    
    // Ukryj aktualny ekran i pokaż mapę
    hideAndShowScreen('map-screen');
    
    // Aktualizuj interfejs mapy
    updateMapUI();
    
    // Aktualizuj obrazki wszystkich lokacji na mapie
    if (gameState.locations && gameState.locations.configs) {
        Object.keys(gameState.locations.configs).forEach(locationId => {
            updateLocationImage(locationId);
        });
    }

    // Upewnij się, że przyciski wyboru lokacji działają
    setupUnlockLocationButtons();
}

// Funkcja ukrywająca aktualny ekran i pokazująca inny
function hideAndShowScreen(screenId) {
    // Ukryj wszystkie ekrany
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Pokaż wybrany ekran
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Jeśli pokazujemy ekran karmienia, zastosuj dekoracje
        if (screenId === 'feed-screen' && typeof applyDecorations === 'function' && 
            gameState && gameState.locations) {
            console.log(t('locations.logs.feedScreenTransition'));
            applyDecorations(gameState.locations.currentLocation);


// Synchronizuj timery po przejściu na ekran karmienia
setTimeout(synchronizeTimers, 100);
// Dodatkowa synchronizacja po dłuższej chwili
setTimeout(synchronizeTimers, 500);

             // Dodaj te linie - zawsze aktualizuj nazwę lokacji po zastosowaniu dekoracji
    setTimeout(() => {
        const locationNameElement = document.getElementById('current-location-name');
        if (locationNameElement) {
            const locationKey = `locations.${gameState.locations.currentLocation}Name`;
            locationNameElement.textContent = t(locationKey);
        }
    }, 10); // Małe opóźnienie, aby funkcja applyDecorations zdążyła się wykonać

        }
    }
}

// Aktualizacja interfejsu mapy
function updateMapUI() {
    console.log(t('locations.logs.updatingMapUI'), gameState.locations.unlockedLocations);
    
    // ZMIANA #1: Zabezpieczenie przed brakiem obiektu locations
    if (!gameState.locations || !gameState.locations.unlockedLocations) {
        console.error(t('locations.logs.missingLocationsObject'));
        
        // Napraw awaryjnie
        if (!gameState.locations) {
            gameState.locations = {
                currentLocation: "park",
                unlockedLocations: { park: true, lake: false }
            };
        }
        
        if (!gameState.locations.unlockedLocations) {
            gameState.locations.unlockedLocations = { park: true, lake: false };
        }
    }
    
    // Pobierz wszystkie elementy lokacji
    const locationItems = document.querySelectorAll('.location-item');
    
    // ZMIANA #2: Dodaj logowanie liczby znalezionych elementów
    console.log(t('locations.logs.foundLocationElements', {count: locationItems.length}));
    
    // Zaktualizuj stan wszystkich lokacji
    locationItems.forEach(locationItem => {
        const button = locationItem.querySelector('.unlock-location-button, .location-button');
        if (!button) {
            console.warn(t('locations.logs.buttonNotFound'), locationItem);
            return;
        }
        
        const locationId = button.getAttribute('data-location');
        if (!locationId) {
            console.warn(t('locations.logs.dataLocationMissing'), button);
            return;
        }
        
        // ZMIANA #3: Dodaj logowanie dla każdej lokacji
        console.log(t('locations.logs.updatingLocationUI', {
            location: locationId, 
            unlocked: gameState.locations.unlockedLocations[locationId]
        }));
        
        // Sprawdź czy lokacja jest już odblokowana
        if (gameState.locations.unlockedLocations[locationId]) {
            // ZMIANA #4: Dodaj logowanie dla odblokowanych lokacji
            console.log(t('locations.logs.locationUnlocked', {location: locationId}));
            
            // Usuń klasę locked z elementu lokacji
            locationItem.classList.remove('locked');
            
            // Zmień status na "Odblokowane"
            const statusElement = locationItem.querySelector('.location-status');
            if (statusElement) {
                statusElement.textContent = t('locations.unlocked');
            }
            
            // Podświetl aktualnie wybraną lokację
            if (locationId === gameState.locations.currentLocation) {
                locationItem.classList.add('selected-location');
            } else {
                locationItem.classList.remove('selected-location');
            }
            
            // Zaktualizuj wygląd przycisku dla odblokowanej lokacji
            button.classList.remove('unlock-location-button');
            button.classList.add('location-button');
            button.classList.add('select-location-button');
            
            // Usuń ikonę blokady, jeśli istnieje
            const lockIcon = button.querySelector('.lock-icon');
            if (lockIcon) {
                button.removeChild(lockIcon);
            }
            
            // Dla przycisku "Wybrano"
            if (locationId === gameState.locations.currentLocation) {
                button.textContent = t('locations.buttons.selected');
                
                // Wymuszamy styl inline
                button.style.backgroundColor = "#f57c00"; // Pomarańczowy jak nawigacja
                button.style.color = "#ffffff";
                button.style.border = "none";
                button.style.fontWeight = "bold";
                
                // Dodaj event listener również dla aktualnie wybranej lokacji
                button.onclick = function() {
                    console.log(t('locations.logs.selectedButtonClicked', {location: locationId}));
                    changeLocation(locationId);
                    hideAndShowScreen('feed-screen');
                };
            } else {
                button.classList.remove('active');
                button.textContent = t('locations.buttons.select');

                // Dodaj event listener dla wyboru lokacji
                button.onclick = function() {
                    changeLocation(locationId);
                    hideAndShowScreen('feed-screen');
                };
            }
            
            // Dodaj informację o odkrytych ptakach
            let birdInfoElement = locationItem.querySelector('.location-birds-info');
            if (!birdInfoElement) {
                birdInfoElement = document.createElement('div');
                birdInfoElement.className = 'location-birds-info';
                locationItem.appendChild(birdInfoElement);
            }
            
            // Licz odkryte ptaki w tej lokacji
            let discoveredCount = 0;
            let totalBirds = 0;
            
            const locationConfig = gameState.locations.configs[locationId];
            if (gameState.discoveredBirds && gameState.discoveredBirds[locationId] && locationConfig) {
                const birdMapping = locationConfig.birdCatalogMapping;
                if (birdMapping) {
                    totalBirds = Object.keys(birdMapping).length;
                    
                    // Policz odkryte ptaki
                    Object.values(birdMapping).forEach(birdId => {
                        if (gameState.discoveredBirds[locationId][birdId]) {
                            discoveredCount++;
                        }
                    });
                }
            }
            
            // Aktualizuj informację o odkrytych ptakach
            birdInfoElement.innerHTML = t('locations.birdsDiscovery', {discovered: discoveredCount, total: totalBirds});
            
        } else {
            // ZMIANA #6: Dodaj logowanie dla zablokowanych lokacji
            console.log(t('locations.logs.locationLocked', {location: locationId}));
            
            // Lokacja zablokowana
            locationItem.classList.add('locked');
            
            // Pobierz koszt odblokowania
            const locationConfig = gameState.locations.configs[locationId];
            const locationCost = locationConfig ? locationConfig.unlockCost : 10;
            
            // Zaktualizuj tekst przycisku
            if (button.classList.contains('unlock-location-button')) {
                button.innerHTML = `<i class="lock-icon">🔒</i> ${t('locations.unlockFor', {amount: locationCost})}`;
                
                // Ustaw aktywność przycisku w zależności od posiadanych monet
                if (gameState.resources.coins >= locationCost) {
                    button.disabled = false;
                } else {
                    button.disabled = true;
                }
                
                // ZMIANA #7: Sprawdź czy event listener został dodany
                if (!button.onclick) {
                    console.log(t('locations.logs.addingUnlockListener', {location: locationId}));
                    button.onclick = function() {
                        console.log(t('locations.logs.unlockButtonClicked', {location: locationId}));
                        
                        // Sprawdź, czy funkcja setupUnlockLocationButtons została już wywołana
                        if (typeof setupUnlockLocationButtons === 'function') {
                            setupUnlockLocationButtons();
                        }
                        
                        // Symuluj kliknięcie przycisku, aby uruchomić właściwy listener
                        button.click();
                    };
                }
            }
        }
    });
    
    // ZMIANA #8: Sprawdź po aktualizacji, czy UI odpowiada stanowi w pamięci
    locationItems.forEach(locationItem => {
        const button = locationItem.querySelector('.unlock-location-button, .location-button');
        if (!button) return;
        
        const locationId = button.getAttribute('data-location');
        if (!locationId) return;
        
        const isUnlocked = gameState.locations.unlockedLocations[locationId];
        const hasLockedClass = locationItem.classList.contains('locked');
        
        if (isUnlocked && hasLockedClass) {
            console.warn(t('locations.logs.uiMemoryMismatch1', {location: locationId}));
            // Napraw UI
            locationItem.classList.remove('locked');
        } else if (!isUnlocked && !hasLockedClass) {
            console.warn(t('locations.logs.uiMemoryMismatch2', {location: locationId}));
            // Napraw UI
            locationItem.classList.add('locked');
        }
    });

    // Aktualizuj przyciski "Nakarm wszystkie"/"Odbierz wszystkie" - ZMIENIONE
    // Użyj nowej funkcji, jeśli jest dostępna
    if (typeof window.updateAllLocationActionButtons === 'function') {
        window.updateAllLocationActionButtons();
    } else if (typeof updateAllActionButtons === 'function') {
        updateAllActionButtons();
    }
}

// Ustawienie przycisków odblokowania lokacji
function setupUnlockLocationButtons() {
    console.log(t('locations.logs.setupUnlockButtons'), gameState.locations.unlockedLocations);
    
    // Pobierz wszystkie przyciski odblokowania lokacji
    const unlockButtons = document.querySelectorAll('.unlock-location-button');
    
    // Dodaj obsługę kliknięcia
    unlockButtons.forEach(button => {
        // Usuń poprzednie event listenery
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Dodaj nowy event listener
        newButton.addEventListener('click', function() {
            const locationId = this.getAttribute('data-location');
            
            // ZMIANA #1: Dodatkowe logowanie przy kliknięciu
            console.log(t('locations.logs.unlockButtonClicked', {location: locationId}));
            console.log(t('locations.logs.stateBeforeUnlock'), gameState.locations.unlockedLocations);
            
            // Pobierz koszt z konfiguracji lokacji
            console.log(t('locations.logs.tryingToUnlock', {location: locationId}));
            console.log(t('locations.logs.availableConfigs'), Object.keys(gameState.locations.configs));
            const locationConfig = gameState.locations.configs[locationId];
            if (!locationConfig) {
                console.error(t('locations.logs.configNotFound', {location: locationId}));
                // Pobierz koszt bezpośrednio z atrybutu przycisku jako rozwiązanie awaryjne
                const cost = parseInt(this.getAttribute('data-cost') || 50);
                console.log(t('locations.logs.usingFallbackCost', {cost: cost}));
                
                // Odejmij monety
                if (gameState.resources.coins >= cost) {
                    gameState.resources.coins -= cost;
                    
                    // Upewnij się, że structures istnieją
                    if (!gameState.locations.unlockedLocations) {
                        gameState.locations.unlockedLocations = { park: true };
                    }
                    
                    // Odblokuj lokację
                    gameState.locations.unlockedLocations[locationId] = true;
                    
                    // Pokaż powiadomienie
                    showNotification(t('locations.notifications.locationUnlocked', {location: locationId}));
                    
                    // Zapisz i aktualizuj UI
                    saveGame();
                    updateMapUI();
                    
                    return;
                } else {
                    showNotification(t('locations.notifications.notEnoughCoins', {amount: cost}));
                    return;
                }
            }
            
            const locationCost = locationConfig.unlockCost;
            
            console.log(t('locations.logs.unlockAttempt', {location: locationId, cost: locationCost}));
            
            // Sprawdź czy mamy wystarczająco monet
            if (gameState.resources.coins >= locationCost) {
                // Odejmij monety
                gameState.resources.coins -= locationCost;
                
                // ZMIANA #2: Dodatkowe kroki bezpieczeństwa przed odblokowaniem
                if (!gameState.locations) {
                    console.error(t('locations.logs.missingLocationsError'));
                    gameState.locations = {
                        currentLocation: "park",
                        unlockedLocations: { park: true }
                    };
                }
                
                if (!gameState.locations.unlockedLocations) {
                    console.error(t('locations.logs.missingUnlockedLocationsError'));
                    gameState.locations.unlockedLocations = { park: true };
                }
                
                // ZMIANA #3: Ustaw odblokowanie lokacji z odpowiednim logowaniem
                console.log(t('locations.logs.unlockingLocation', {location: locationId}));
                gameState.locations.unlockedLocations[locationId] = true;
                
                console.log(t('locations.logs.stateAfterUnlock'), gameState.locations.unlockedLocations);
                
                // Dodaj XP za odblokowanie lokacji
                if (typeof addExperience === 'function') {
                    addExperience(50);
                }
                
                // Dodaj efekt odblokowania
                const locationItem = this.closest('.location-item');
                if (locationItem) {
                    locationItem.classList.add('location-unlocking');
                    
                    // Usuń efekt po zakończeniu animacji
                    setTimeout(() => {
                        locationItem.classList.remove('location-unlocking');
                    }, 1000);
                }
                
                // Pokaż powiadomienie
                showNotification(t('locations.notifications.locationUnlocked', {location: locationConfig.name}));
                
                // Pokaż animację nagrody
                if (typeof showRewardAnimation === 'function') {
                    showRewardAnimation(t('locations.newLocation'), this);
                }
                
                // ZMIANA #4: Sprawdź po odblokowaniu, czy faktycznie lokacja jest odblokowana
                if (!gameState.locations.unlockedLocations[locationId]) {
                    console.error(t('locations.logs.criticalUnlockError', {location: locationId}));
                    gameState.locations.unlockedLocations[locationId] = true;
                }
                
                // ZMIANA #5: Najpierw zapisz stan gry
                console.log(t('locations.logs.savingGameAfterUnlock'));
                if (typeof saveGame === 'function') {
                    saveGame();
                } else if (typeof window.saveGame === 'function') {
                    window.saveGame();
                } else {
                    console.error(t('locations.logs.saveGameUnavailable'));
                    try {
                        localStorage.setItem('dziubCoinsGame', JSON.stringify(gameState));
                    } catch(e) {
                        console.error(t('locations.logs.localStorageError'), e);
                    }
                }
                
                // ZMIANA #6: Dopiero potem aktualizuj UI
                updateMapUI();
                updateUI();
                
                // Zaktualizuj także katalog ptaków, jeśli jest otwarty
                if (document.querySelector('.game-screen.active#bird-catalog-screen') && typeof populateBirdCatalog === 'function') {
                    populateBirdCatalog();
                }
                
                // Po chwili dodaj event listener do wyboru lokacji
                setTimeout(() => {
                    // Znajdź nowy przycisk po zmianie
                    const selectButton = locationItem.querySelector('.select-location-button');
                    if (selectButton) {
                        selectButton.onclick = function() {
                            changeLocation(locationId);
                            hideAndShowScreen('feed-screen');
                        };
                    }
                    
                    // ZMIANA #7: Dodatkowe sprawdzenie po timeout
                    console.log(t('locations.logs.stateAfterTimeout'), gameState.locations.unlockedLocations);
                }, 500);
            } else {
                // Za mało monet
                showNotification(t('locations.notifications.notEnoughCoins', {amount: locationCost}));
            }
        });
    });
    
    // Pobierz już odblokowane przyciski wyboru lokacji
    const selectButtons = document.querySelectorAll('.select-location-button, .location-button:not(.unlock-location-button)');
    selectButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        const locationId = newButton.getAttribute('data-location');
        
        // Ustaw odpowiedni wygląd przycisku
        if (locationId === gameState.locations.currentLocation) {
            newButton.textContent = t('locations.buttons.selected');
            newButton.classList.add('active');
            
            // Dodaj bezpośrednie style inline - to zadziała na pewno
            newButton.style.backgroundColor = "#f57c00";
            newButton.style.color = "#ffffff";
            newButton.style.fontWeight = "bold";
            newButton.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.2)";

            // Dodaj event listener również dla aktualnie wybranej lokacji
            newButton.onclick = function() {
                console.log(t('locations.logs.selectedButtonClicked', {location: locationId}));
                changeLocation(locationId);
                hideAndShowScreen('feed-screen');
            };
        }
        else {
            newButton.textContent = t('locations.buttons.select');
            
            // Resetujemy style inline, żeby działy standardowe style z CSS
            newButton.style.backgroundColor = "";
            newButton.style.color = "";
            newButton.style.fontWeight = "";
            newButton.style.border = "";
            
            // Dodaj event listener dla wyboru lokacji
            newButton.onclick = function() {
                console.log(t('locations.logs.selectButtonClicked', {location: locationId}));
                changeLocation(locationId);
                hideAndShowScreen('feed-screen');
            };
        }
    });
}

// Zmiana aktualnej lokacji
function changeLocation(locationId) {
    console.log(t('locations.logs.changingLocation', {location: locationId}));
    
    // Sprawdź czy lokacja jest zdefiniowana
    if (!gameState.locations.configs[locationId]) {
        console.error(t('locations.logs.locationNotDefined', {location: locationId}));
        showNotification(t('locations.notifications.locationError'));
        return false;
    }
    
    // Sprawdź czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        showNotification(t('locations.notifications.locationLocked'));
        return false;
    }
    
    const prevLocation = gameState.locations.currentLocation;
    if (prevLocation === locationId) {
        console.log(t('locations.logs.alreadyInLocation'));
        return true; // Nie ma potrzeby zmiany lokacji
    }
    
    // Pobierz konfigurację lokacji
    const locationConfig = getLocationConfig(locationId);
    
    // Pokazuj efekt przejścia
    const feedScreen = document.getElementById('feed-screen');
    if (feedScreen) {
        // Dodaj klasę dla animacji przejścia
        feedScreen.classList.add('location-transition');
        
        // Po krótkiej chwili zmień lokację i zaktualizuj UI
        setTimeout(() => {
            // Ustaw nową lokację
            gameState.locations.currentLocation = locationId;

            // Zawsze używaj applyDecorations dla nowej lokacji
            if (typeof applyDecorations === 'function') {
                console.log(t('locations.logs.applyingDecorations', {location: locationId}));
                applyDecorations(locationId);
            } else {
                console.error(t('locations.logs.decorationsFunctionUnavailable'));
                // Awaryjnie, jeśli funkcja nie jest dostępna
                if (locationConfig.background) {
                    feedScreen.style.backgroundImage = `url('${locationConfig.background}')`;
                }
            }
            
           
            

// Aktualizuj nazwę lokacji w UI
const locationNameElement = document.getElementById('current-location-name');
if (locationNameElement) {
    // Użyj klucza tłumaczeniowego zamiast bezpośredniej nazwy
    const locationKey = `locations.${locationId}Name`;
    locationNameElement.textContent = t(locationKey);
    locationNameElement.classList.add('location-name-highlight');
    
    // Usuń klasę podświetlenia po chwili
    setTimeout(() => {
        locationNameElement.classList.remove('location-name-highlight');
    }, 2000);
}






            
            // Odśwież sloty dla nowej lokacji
            if (typeof setupBirdSlots === 'function') {
                setupBirdSlots(locationId);
            }
            
            // Spróbuj wygenerować ptaki w pustych slotach nowej lokacji
            if (gameState.locationSlots && gameState.locationSlots[locationId]) {
                gameState.locationSlots[locationId].forEach((slot, index) => {
                    if (!slot.isActive && gameState.locationUnlockedSlots[locationId][index]) {
                        if (typeof trySpawnBirdInSlot === 'function') {
                            trySpawnBirdInSlot(index, locationId);
                        }
                    }
                });
            }
            
            // Zaktualizuj UI mapy
            if (typeof updateMapUI === 'function') {
                updateMapUI();
            }
            
            // Aktualizuj katalog ptaków, jeśli jest otwarty
            if (document.querySelector('.game-screen.active#bird-catalog-screen')) {
                console.log(t('locations.logs.updatingCatalog'));
                if (typeof window.updateCatalogUI === 'function') {
                    window.updateCatalogUI();
                }
            }
            
            // Pokaż powiadomienie
           // Pokaż powiadomienie o wybranej lokacji z użyciem tłumaczenia
const locationKey = `locations.${locationId}Name`;
showNotification(t('locations.notifications.locationSelected', {name: t(locationKey)}));
        }, 300);
    } else {
        // Jeśli ekran nie istnieje, po prostu zmień lokację bez animacji
        gameState.locations.currentLocation = locationId;
        
        // Pokaż powiadomienie
    // Pokaż powiadomienie o wybranej lokacji z użyciem tłumaczenia
const locationKey = `locations.${locationId}Name`;
showNotification(t('locations.notifications.locationSelected', {name: t(locationKey)}));
        
        // Odśwież sloty dla nowej lokacji
        if (typeof setupBirdSlots === 'function') {
            setupBirdSlots(locationId);
        }
        
        // Próba wygenerowania ptaków
        if (gameState.locationSlots && gameState.locationSlots[locationId]) {
            gameState.locationSlots[locationId].forEach((slot, index) => {
                if (!slot.isActive && gameState.locationUnlockedSlots[locationId][index]) {
                    if (typeof trySpawnBirdInSlot === 'function') {
                        trySpawnBirdInSlot(index, locationId);
                    }
                }
            });
        }
        
        // Aktualizuj UI mapy
        if (typeof updateMapUI === 'function') {
            updateMapUI();
        }
        
        // Zapisz stan gry
        if (typeof saveGame === 'function') {
            saveGame();
        }

        // Aktualizuj przyciski akcji zbiorowych
        if (typeof updateAllActionButtons === 'function') {
            updateAllActionButtons();
        }
    }
    
    return true;
}

// Funkcja diagnostyczna do debugowania stanu lokacji
function debugLocations() {
    console.log(t('locations.logs.diagnosticsHeader'));
    
    // Sprawdź podstawową strukturę gameState
    console.log(t('locations.logs.gameStateExists'), !!window.gameState);
    
    if (!window.gameState) {
        console.error(t('locations.logs.gameStateMissingError'));
        return;
    }
    
    // Sprawdź obiekt locations
    console.log(t('locations.logs.locationsObjectExists'), !!window.gameState.locations);
    
    if (!window.gameState.locations) {
        console.error(t('locations.logs.locationsMissingError'));
        return;
    }
    
    // Sprawdź właściwość unlockedLocations
    console.log(t('locations.logs.unlockedLocationsExists'), !!window.gameState.locations.unlockedLocations);
    
    if (!window.gameState.locations.unlockedLocations) {
        console.error(t('locations.logs.unlockedLocationsMissingError'));
        return;
    }
    
    // Wyświetl szczegóły odblokowanych lokacji
    console.log(t('locations.logs.unlockedLocations'), JSON.stringify(window.gameState.locations.unlockedLocations));
    
    // Sprawdź aktualne lokacje
    Object.keys(window.gameState.locations.unlockedLocations).forEach(locationId => {
        console.log(t('locations.logs.locationStatus', {
            location: locationId, 
            status: window.gameState.locations.unlockedLocations[locationId] ? 
                t('locations.unlocked') : t('locations.locked')
        }));
    });
    
    // Sprawdź aktualną lokację
    console.log(t('locations.logs.currentLocation'), window.gameState.locations.currentLocation);
    
    // Sprawdź czy aktualnie wybrana lokacja jest odblokowana
    const currentLocationId = window.gameState.locations.currentLocation;
    const isCurrentLocationUnlocked = window.gameState.locations.unlockedLocations[currentLocationId];
    console.log(t('locations.logs.currentLocationUnlocked', {
        location: currentLocationId, 
        unlocked: isCurrentLocationUnlocked
    }));
    
    // Sprawdź elementy UI na mapie
    const locationItems = document.querySelectorAll('.location-item');
    console.log(t('locations.logs.uiLocationElements'), locationItems.length);
    
    // Sprawdź zgodność UI z pamięcią
    locationItems.forEach(locationItem => {
        const button = locationItem.querySelector('.unlock-location-button, .location-button');
        if (!button) return;
        
        const locationId = button.getAttribute('data-location');
        if (!locationId) return;
        
        const isUnlocked = window.gameState.locations.unlockedLocations[locationId];
        const hasLockedClass = locationItem.classList.contains('locked');
        
        console.log(t('locations.logs.locationUiMemoryStatus', {
            location: locationId,
            uiStatus: hasLockedClass ? t('locations.locked') : t('locations.unlocked'),
            memoryStatus: isUnlocked ? t('locations.unlocked') : t('locations.locked')
        }));
        
        if (isUnlocked && hasLockedClass) {
            console.warn(t('locations.logs.uiMemoryMismatch1', {location: locationId}));
        } else if (!isUnlocked && !hasLockedClass) {
            console.warn(t('locations.logs.uiMemoryMismatch2', {location: locationId}));
        }
    });
    
    // Sprawdź LocalStorage
    const savedGame = localStorage.getItem('dziubCoinsGame');
    if (savedGame) {
        try {
            const parsedSave = JSON.parse(savedGame);
            console.log(t('locations.logs.savedStateExists'));
            
            if (parsedSave.locations && parsedSave.locations.unlockedLocations) {
                console.log(t('locations.logs.savedUnlockedLocations'), parsedSave.locations.unlockedLocations);
                
                // Porównaj stan w localStorage z aktualnym stanem w pamięci
                let differences = false;
                Object.keys(window.gameState.locations.unlockedLocations).forEach(locationId => {
                    const memoryState = window.gameState.locations.unlockedLocations[locationId];
                    const savedState = parsedSave.locations.unlockedLocations[locationId];
                    
                    if (memoryState !== savedState) {
                        console.warn(t('locations.logs.stateDifference', {
                            location: locationId, 
                            memoryState: memoryState, 
                            savedState: savedState
                        }));
                        differences = true;
                    }
                });
                
                if (!differences) {
                    console.log(t('locations.logs.statesMatch'));
                }
            } else {
                console.error(t('locations.logs.noSavedUnlockedLocations'));
            }
        } catch (e) {
            console.error(t('locations.logs.parseSaveError'), e);
        }
    } else {
        console.log(t('locations.logs.noSavedState'));
    }
    
    // Sprawdź dostępność funkcji zapisu i wczytywania
    console.log(t('locations.logs.saveGameAvailable'), typeof window.saveGame === 'function');
    console.log(t('locations.logs.loadGameAvailable'), typeof window.loadGame === 'function');
    
    console.log(t('locations.logs.diagnosticsFooter'));
    
    // Zwróć raport
    return {
        locationsExist: !!window.gameState.locations,
        unlockedLocationsExist: !!window.gameState.locations?.unlockedLocations,
        currentLocation: window.gameState.locations?.currentLocation,
        unlockedLocations: window.gameState.locations?.unlockedLocations,
        uiElementsCount: locationItems.length,
        savedGameExists: !!savedGame
    };
}

// Eksportuj funkcję do globalnego zakresu
window.debugLocations = debugLocations;

// Dodaj funkcję naprawczą
window.fixLocations = function() {
    console.log(t('locations.logs.startingRepair'));
    
    // Upewnij się, że struktury istnieją
    if (!window.gameState) {
        console.error(t('locations.logs.creatingGameState'));
        window.gameState = {};
    }
    
    if (!window.gameState.locations) {
        console.error(t('locations.logs.creatingLocations'));
        window.gameState.locations = {};
    }
    
    if (!window.gameState.locations.unlockedLocations) {
        console.error(t('locations.logs.creatingUnlockedLocations'));
        window.gameState.locations.unlockedLocations = {
            park: true,
            lake: false
        };
    }
    
    if (!window.gameState.locations.currentLocation) {
        console.error(t('locations.logs.settingDefaultLocation'));
        window.gameState.locations.currentLocation = "park";
    }
    
    // Sprawdź zapisany stan
    const savedGame = localStorage.getItem('dziubCoinsGame');
    if (savedGame) {
        try {
            const parsedSave = JSON.parse(savedGame);
            
            if (parsedSave.locations && parsedSave.locations.unlockedLocations) {
                console.log(t('locations.logs.restoringFromSave'));
                window.gameState.locations.unlockedLocations = {...parsedSave.locations.unlockedLocations};
            }
        } catch (e) {
            console.error(t('locations.logs.restoreError'), e);
        }
    }
    
    // Aktualizuj UI
    if (typeof updateMapUI === 'function') {
        console.log(t('locations.logs.updatingMapUI'));
        updateMapUI();
    }
    
    // Zapisz naprawiony stan
    if (typeof saveGame === 'function') {
        console.log(t('locations.logs.savingRepairedState'));
        saveGame();
    }
    
    console.log(t('locations.logs.repairComplete'), window.gameState.locations.unlockedLocations);
    return window.gameState.locations.unlockedLocations;
};

// Dodaj listener dla załadowanej gry
document.addEventListener('DOMContentLoaded', function() {
    // Daj czas na załadowanie innych skryptów
    setTimeout(function() {
        initLocations();
    }, 1000);
});

// Obsługa zdarzenia załadowania gry
document.addEventListener('gameLoaded', function() {
    initShop();
    
    // Zawsze używaj applyDecorations dla nowej lokacji
    if (typeof applyDecorations === 'function') {
        console.log(t('locations.logs.applyingDecorations', {location: locationId}));
        applyDecorations(locationId);
    } else {
        console.error(t('locations.logs.decorationsFunctionUnavailable'));
        // Awaryjnie, jeśli funkcja nie jest dostępna
        if (locationConfig.background) {
            feedScreen.style.backgroundImage = `url('${locationConfig.background}')`;
        }
    }
});


// Nowa funkcja do aktualizacji nazwy lokacji
function updateLocationNameUI(locationId) {
    locationId = locationId || gameState.locations.currentLocation;
    const locationNameElement = document.getElementById('current-location-name');
    if (locationNameElement) {
        const locationKey = `locations.${locationId}Name`;
        locationNameElement.textContent = t(locationKey);
    }
}

// Eksportuj funkcję globalnie
window.updateLocationNameUI = updateLocationNameUI;

// Eksportuj funkcje do globalnego zakresu
window.showMapScreen = showMapScreen;
window.changeLocation = changeLocation;
window.updateMapUI = updateMapUI;