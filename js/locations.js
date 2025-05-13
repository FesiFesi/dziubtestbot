/**
 * System lokacji w grze DziubCoins
 */



// Ta konfiguracja zostanie zastąpiona przez szczegółową konfigurację w gameState
// Zachowujemy ją dla kompatybilności z istniejącym kodem
const LOCATIONS_CONFIG = {
    // Park miejski (odblokowany domyślnie)
    park: {
        name: "Park Miejski",
        unlocked: true,
        cost: 0,
        birdTypes: ["common_sparrow", "rare_robin", "epic_cardinal", "legendary_phoenix", "mythical_eagle"]
    },
    // Brzeg jeziora (do odblokowania)
    lake: {
        name: "Brzeg Jeziora",
        unlocked: false,
        cost: 10,
        birdTypes: ["common_duck", "rare_heron", "epic_swan", "legendary_pelican", "mythical_kraken"]
    },
    forest: {
        name: "Tajemniczy Las",
        unlocked: false,
        cost: 50,
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
    console.log("Inicjalizacja systemu lokacji");
    
    // ZMIANA #1: Zapisz stan lokacji przed inicjalizacją do debugowania
    const preInitLocationsState = gameState.locations ? JSON.stringify(gameState.locations.unlockedLocations) : "brak";
    console.log("Stan odblokowanych lokacji przed inicjalizacją:", preInitLocationsState);
    
    // ZMIANA #2: Upewnij się, że w gameState istnieje sekcja na lokacje, ale ZACHOWAJ istniejące wartości
    if (!gameState.locations) {
        console.log("Brak obiektu locations - tworzę nowy");
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
            console.log("Brak currentLocation - ustawiam domyślną wartość");
            gameState.locations.currentLocation = "park";
        }
        
        if (!gameState.locations.unlockedLocations) {
            console.log("Brak unlockedLocations - ustawiam domyślne wartości");
            gameState.locations.unlockedLocations = {
                park: true,
                lake: false
            };
        } else {
            console.log("Używam istniejących wartości dla unlockedLocations:", gameState.locations.unlockedLocations);
        }
    }
    
    // Sprawdź, czy aktualna lokacja jest odblokowana, jeśli nie - przywróć do park
    if (!gameState.locations.unlockedLocations[gameState.locations.currentLocation]) {
        console.warn(`Bieżąca lokacja ${gameState.locations.currentLocation} nie jest odblokowana, przywracam do park`);
        gameState.locations.currentLocation = "park";
    }
    
    // ZMIANA #4: Sprawdź czy lokacje są dodane w unlockedLocations - dla bezpieczeństwa
    if (!('park' in gameState.locations.unlockedLocations)) {
        console.log("Dodaję brakującą lokację 'park' do unlockedLocations");
        gameState.locations.unlockedLocations.park = true;
    }
    
    if (!('lake' in gameState.locations.unlockedLocations)) {
        console.log("Dodaję brakującą lokację 'lake' do unlockedLocations");
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
        console.log("Wykryto zmiany w stanie lokacji podczas inicjalizacji - zapisuję stan gry");
        console.log("Stan przed:", preInitLocationsState);
        console.log("Stan po:", postInitLocationsState);
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
        locationNameElement.textContent = locationConfig.name;
    }
    
    // ZMIANA #6: Dodaj dodatkowe logowanie na koniec inicjalizacji
    console.log("Zakończono inicjalizację systemu lokacji. Stan odblokowanych lokacji:", gameState.locations.unlockedLocations);
}









// Pokazywanie ekranu mapy
function showMapScreen() {
    console.log("Pokazuję ekran mapy");
    
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
            console.log("Przejście do ekranu karmienia przez hideAndShowScreen - aktualizuję dekoracje");
            applyDecorations(gameState.locations.currentLocation);
        }
    }
}






// Aktualizacja interfejsu mapy
function updateMapUI() {
    console.log("Aktualizuję UI mapy. Stan odblokowanych lokacji:", gameState.locations.unlockedLocations);
    
    // ZMIANA #1: Zabezpieczenie przed brakiem obiektu locations
    if (!gameState.locations || !gameState.locations.unlockedLocations) {
        console.error("BŁĄD: Brak obiektu locations lub unlockedLocations podczas aktualizacji UI mapy!");
        
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
    console.log(`Znaleziono ${locationItems.length} elementów lokacji na mapie`);
    
    // Zaktualizuj stan wszystkich lokacji
    locationItems.forEach(locationItem => {
        const button = locationItem.querySelector('.unlock-location-button, .location-button');
        if (!button) {
            console.warn("Nie znaleziono przycisku w elemencie lokacji:", locationItem);
            return;
        }
        
        const locationId = button.getAttribute('data-location');
        if (!locationId) {
            console.warn("Przycisk nie ma atrybutu data-location:", button);
            return;
        }
        
        // ZMIANA #3: Dodaj logowanie dla każdej lokacji
        console.log(`Aktualizuję UI dla lokacji ${locationId}, stan odblokowania:`, gameState.locations.unlockedLocations[locationId]);
        
        // Sprawdź czy lokacja jest już odblokowana
        if (gameState.locations.unlockedLocations[locationId]) {
            // ZMIANA #4: Dodaj logowanie dla odblokowanych lokacji
            console.log(`Lokacja ${locationId} jest odblokowana - aktualizuję UI`);
            
            // Usuń klasę locked z elementu lokacji
            locationItem.classList.remove('locked');
            
            // Zmień status na "Odblokowane"
            const statusElement = locationItem.querySelector('.location-status');
            if (statusElement) {
                statusElement.textContent = "Odblokowane";
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
    button.textContent = "Wybrano";
                
                // Wymuszamy styl inline
                button.style.backgroundColor = "#f57c00"; // Pomarańczowy jak nawigacja
                button.style.color = "#ffffff";
                button.style.border = "none";
                button.style.fontWeight = "bold";
                
            
                
  // Dodaj event listener również dla aktualnie wybranej lokacji
  button.onclick = function() {
    console.log(`Kliknięto przycisk "Wybrano" dla lokacji ${locationId}`);
    changeLocation(locationId);
    hideAndShowScreen('feed-screen');
};
} else {
button.classList.remove('active');
button.textContent = "Wybierz";

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
            birdInfoElement.innerHTML = `Ptaki: ${discoveredCount}/${totalBirds}`;
            
        } else {
            // ZMIANA #6: Dodaj logowanie dla zablokowanych lokacji
            console.log(`Lokacja ${locationId} jest zablokowana - aktualizuję UI`);
            
            // Lokacja zablokowana
            locationItem.classList.add('locked');
            
            // Pobierz koszt odblokowania
            const locationConfig = gameState.locations.configs[locationId];
            const locationCost = locationConfig ? locationConfig.unlockCost : 10;
            
            // Zaktualizuj tekst przycisku
            if (button.classList.contains('unlock-location-button')) {
                button.innerHTML = `<i class="lock-icon">🔒</i> Odblokuj za ${locationCost} DziubCoinów`;
                
                // Ustaw aktywność przycisku w zależności od posiadanych monet
                if (gameState.resources.coins >= locationCost) {
                    button.disabled = false;
                } else {
                    button.disabled = true;
                }
                
                // ZMIANA #7: Sprawdź czy event listener został dodany
                if (!button.onclick) {
                    console.log(`Dodaję event listener dla przycisku odblokowania lokacji ${locationId}`);
                    button.onclick = function() {
                        console.log(`Kliknięto przycisk odblokowania lokacji ${locationId} (z updateMapUI)`);
                        
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
            console.warn(`Niezgodność: Lokacja ${locationId} jest odblokowana w pamięci, ale ma klasę 'locked' w UI`);
            // Napraw UI
            locationItem.classList.remove('locked');
        } else if (!isUnlocked && !hasLockedClass) {
            console.warn(`Niezgodność: Lokacja ${locationId} jest zablokowana w pamięci, ale nie ma klasy 'locked' w UI`);
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
    console.log("Ustawiam przyciski odblokowania lokacji. Stan odblokowanych lokacji:", gameState.locations.unlockedLocations);
    
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
            console.log(`Kliknięto przycisk odblokowania lokacji: ${locationId}`);
            console.log(`Stan przed odblokowaniem:`, gameState.locations.unlockedLocations);
            
          // Pobierz koszt z konfiguracji lokacji
console.log("Próba odblokowania lokacji:", locationId);
console.log("Dostępne konfiguracje:", Object.keys(gameState.locations.configs));
const locationConfig = gameState.locations.configs[locationId];
if (!locationConfig) {
    console.error(`Nie znaleziono konfiguracji dla lokacji ${locationId}`);
    // Pobierz koszt bezpośrednio z atrybutu przycisku jako rozwiązanie awaryjne
    const cost = parseInt(this.getAttribute('data-cost') || 50);
    console.log(`Używam awaryjnego kosztu z atrybutu data-cost: ${cost}`);
    
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
        showNotification(`Odblokowano nową lokację: ${locationId}!`);
        
        // Zapisz i aktualizuj UI
        saveGame();
        updateMapUI();
        
        return;
    } else {
        showNotification(`Za mało DziubCoinów! Potrzebujesz ${cost} monet.`);
        return;
    }
}
            
            const locationCost = locationConfig.unlockCost;
            
            console.log(`Próba odblokowania lokacji: ${locationId}, koszt: ${locationCost}`);
            
            // Sprawdź czy mamy wystarczająco monet
            if (gameState.resources.coins >= locationCost) {
                // Odejmij monety
                gameState.resources.coins -= locationCost;
                
                // ZMIANA #2: Dodatkowe kroki bezpieczeństwa przed odblokowaniem
                if (!gameState.locations) {
                    console.error("BŁĄD: Brak obiektu locations! Tworzę nowy.");
                    gameState.locations = {
                        currentLocation: "park",
                        unlockedLocations: { park: true }
                    };
                }
                
                if (!gameState.locations.unlockedLocations) {
                    console.error("BŁĄD: Brak obiektu unlockedLocations! Tworzę nowy.");
                    gameState.locations.unlockedLocations = { park: true };
                }
                
                // ZMIANA #3: Ustaw odblokowanie lokacji z odpowiednim logowaniem
                console.log(`Odblokowuję lokację ${locationId}...`);
                gameState.locations.unlockedLocations[locationId] = true;
                
                console.log(`Stan po odblokowaniu:`, gameState.locations.unlockedLocations);
                
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
                showNotification(`Odblokowano nową lokację: ${locationConfig.name}!`);
                
                // Pokaż animację nagrody
                if (typeof showRewardAnimation === 'function') {
                    showRewardAnimation(`Nowa lokacja!`, this);
                }
                
                // ZMIANA #4: Sprawdź po odblokowaniu, czy faktycznie lokacja jest odblokowana
                if (!gameState.locations.unlockedLocations[locationId]) {
                    console.error(`BŁĄD KRYTYCZNY: Lokacja ${locationId} nie została odblokowana poprawnie!`);
                    gameState.locations.unlockedLocations[locationId] = true;
                }
                
                // ZMIANA #5: Najpierw zapisz stan gry
                console.log("Zapisuję stan gry po odblokowaniu lokacji");
                if (typeof saveGame === 'function') {
                    saveGame();
                } else if (typeof window.saveGame === 'function') {
                    window.saveGame();
                } else {
                    console.error("Funkcja saveGame niedostępna! Próbuję użyć localStorage bezpośrednio.");
                    try {
                        localStorage.setItem('dziubCoinsGame', JSON.stringify(gameState));
                    } catch(e) {
                        console.error("Błąd podczas zapisu do localStorage:", e);
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
                    console.log(`Stan lokacji po timeout:`, gameState.locations.unlockedLocations);
                }, 500);
            } else {
                // Za mało monet
                showNotification(`Za mało DziubCoinów! Potrzebujesz ${locationCost} monet.`);
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
            newButton.textContent = "Wybrano";
            newButton.classList.add('active');
            
            // Dodaj bezpośrednie style inline - to zadziała na pewno
            newButton.style.backgroundColor = "#f57c00";
            newButton.style.color = "#ffffff";
            newButton.style.fontWeight = "bold";
            newButton.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.2)";

// Dodaj event listener również dla aktualnie wybranej lokacji
newButton.onclick = function() {
    console.log(`Kliknięto przycisk wyboru lokacji ${locationId} (aktualnie wybrana)`);
    changeLocation(locationId);
    hideAndShowScreen('feed-screen');
};

        }
        else {
            newButton.textContent = "Wybierz";
            
            // Resetujemy style inline, żeby działy standardowe style z CSS
            newButton.style.backgroundColor = "";
            newButton.style.color = "";
            newButton.style.fontWeight = "";
            newButton.style.border = "";
            
            // Dodaj event listener dla wyboru lokacji
            newButton.onclick = function() {
                console.log(`Kliknięto przycisk wyboru lokacji ${locationId}`);
                changeLocation(locationId);
                hideAndShowScreen('feed-screen');
            };
        }
    });
}







// Zmiana aktualnej lokacji
function changeLocation(locationId) {
    console.log(`Zmiana lokacji na: ${locationId}`);
    
    // Sprawdź czy lokacja jest zdefiniowana
    if (!gameState.locations.configs[locationId]) {
        console.error(`Lokacja ${locationId} nie jest zdefiniowana!`);
        showNotification("Błąd: Lokacja nie istnieje!");
        return false;
    }
    
    // Sprawdź czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        showNotification("Ta lokacja jest zablokowana!");
        return false;
    }
    
    const prevLocation = gameState.locations.currentLocation;
    if (prevLocation === locationId) {
        console.log("Już jesteś w tej lokacji");
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
    console.log(`Stosowanie dekoracji dla lokacji ${locationId} w changeLocation`);
    applyDecorations(locationId);
} else {
    console.error("Funkcja applyDecorations nie jest dostępna!");
    // Awaryjnie, jeśli funkcja nie jest dostępna
    if (locationConfig.background) {
        feedScreen.style.backgroundImage = `url('${locationConfig.background}')`;
    }
}
            
           



            // Aktualizuj nazwę lokacji w UI
            const locationNameElement = document.getElementById('current-location-name');
            if (locationNameElement) {
                locationNameElement.textContent = locationConfig.name;
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
    console.log("Aktualizuję katalog ptaków po zmianie lokacji");
    if (typeof window.updateCatalogUI === 'function') {
        window.updateCatalogUI();
    }
}




            
            // Pokaż powiadomienie
            showNotification(`Wybrano lokację: ${locationConfig.name}`);
        }, 300);
    } else {
        // Jeśli ekran nie istnieje, po prostu zmień lokację bez animacji
        gameState.locations.currentLocation = locationId;
        
        // Pokaż powiadomienie
        showNotification(`Wybrano lokację: ${locationConfig.name}`);
        
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
    console.log("=== DIAGNOSTYKA STANU LOKACJI ===");
    
    // Sprawdź podstawową strukturę gameState
    console.log("Obiekt gameState istnieje:", !!window.gameState);
    
    if (!window.gameState) {
        console.error("BŁĄD KRYTYCZNY: Brak obiektu gameState!");
        return;
    }
    
    // Sprawdź obiekt locations
    console.log("Obiekt locations istnieje:", !!window.gameState.locations);
    
    if (!window.gameState.locations) {
        console.error("BŁĄD KRYTYCZNY: Brak obiektu locations w gameState!");
        return;
    }
    
    // Sprawdź właściwość unlockedLocations
    console.log("Obiekt unlockedLocations istnieje:", !!window.gameState.locations.unlockedLocations);
    
    if (!window.gameState.locations.unlockedLocations) {
        console.error("BŁĄD KRYTYCZNY: Brak obiektu unlockedLocations w gameState.locations!");
        return;
    }
    
    // Wyświetl szczegóły odblokowanych lokacji
    console.log("Odblokowane lokacje:", JSON.stringify(window.gameState.locations.unlockedLocations));
    
    // Sprawdź aktualne lokacje
    Object.keys(window.gameState.locations.unlockedLocations).forEach(locationId => {
        console.log(`Lokacja ${locationId}: ${window.gameState.locations.unlockedLocations[locationId] ? 'odblokowana' : 'zablokowana'}`);
    });
    
    // Sprawdź aktualną lokację
    console.log("Aktualna lokacja:", window.gameState.locations.currentLocation);
    
    // Sprawdź czy aktualnie wybrana lokacja jest odblokowana
    const currentLocationId = window.gameState.locations.currentLocation;
    const isCurrentLocationUnlocked = window.gameState.locations.unlockedLocations[currentLocationId];
    console.log(`Czy aktualna lokacja (${currentLocationId}) jest odblokowana:`, isCurrentLocationUnlocked);
    
    // Sprawdź elementy UI na mapie
    const locationItems = document.querySelectorAll('.location-item');
    console.log(`Liczba elementów lokacji w UI:`, locationItems.length);
    
    // Sprawdź zgodność UI z pamięcią
    locationItems.forEach(locationItem => {
        const button = locationItem.querySelector('.unlock-location-button, .location-button');
        if (!button) return;
        
        const locationId = button.getAttribute('data-location');
        if (!locationId) return;
        
        const isUnlocked = window.gameState.locations.unlockedLocations[locationId];
        const hasLockedClass = locationItem.classList.contains('locked');
        
        console.log(`Lokacja ${locationId} w UI: ${hasLockedClass ? 'zablokowana' : 'odblokowana'}, w pamięci: ${isUnlocked ? 'odblokowana' : 'zablokowana'}`);
        
        if (isUnlocked && hasLockedClass) {
            console.warn(`Niezgodność: Lokacja ${locationId} jest odblokowana w pamięci, ale ma klasę 'locked' w UI`);
        } else if (!isUnlocked && !hasLockedClass) {
            console.warn(`Niezgodność: Lokacja ${locationId} jest zablokowana w pamięci, ale nie ma klasy 'locked' w UI`);
        }
    });
    
    // Sprawdź LocalStorage
    const savedGame = localStorage.getItem('dziubCoinsGame');
    if (savedGame) {
        try {
            const parsedSave = JSON.parse(savedGame);
            console.log("Zapisany stan istnieje w localStorage");
            
            if (parsedSave.locations && parsedSave.locations.unlockedLocations) {
                console.log("Odblokowane lokacje w zapisanym stanie:", parsedSave.locations.unlockedLocations);
                
                // Porównaj stan w localStorage z aktualnym stanem w pamięci
                let differences = false;
                Object.keys(window.gameState.locations.unlockedLocations).forEach(locationId => {
                    const memoryState = window.gameState.locations.unlockedLocations[locationId];
                    const savedState = parsedSave.locations.unlockedLocations[locationId];
                    
                    if (memoryState !== savedState) {
                        console.warn(`Niezgodność dla lokacji ${locationId}: w pamięci=${memoryState}, w zapisie=${savedState}`);
                        differences = true;
                    }
                });
                
                if (!differences) {
                    console.log("Stan lokacji w pamięci zgodny z zapisanym stanem");
                }
            } else {
                console.error("Brak informacji o odblokowanych lokacjach w zapisanym stanie!");
            }
        } catch (e) {
            console.error("Błąd podczas parsowania zapisanego stanu:", e);
        }
    } else {
        console.log("Brak zapisanego stanu w localStorage");
    }
    
    // Sprawdź dostępność funkcji zapisu i wczytywania
    console.log("Funkcja saveGame dostępna:", typeof window.saveGame === 'function');
    console.log("Funkcja loadGame dostępna:", typeof window.loadGame === 'function');
    
    console.log("=== KONIEC DIAGNOSTYKI ===");
    
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
    console.log("Rozpoczynam naprawę systemu lokacji...");
    
    // Upewnij się, że struktury istnieją
    if (!window.gameState) {
        console.error("Tworzę nowy obiekt gameState");
        window.gameState = {};
    }
    
    if (!window.gameState.locations) {
        console.error("Tworzę nowy obiekt locations");
        window.gameState.locations = {};
    }
    
    if (!window.gameState.locations.unlockedLocations) {
        console.error("Tworzę nowy obiekt unlockedLocations");
        window.gameState.locations.unlockedLocations = {
            park: true,
            lake: false
        };
    }
    
    if (!window.gameState.locations.currentLocation) {
        console.error("Ustawiam domyślną bieżącą lokację");
        window.gameState.locations.currentLocation = "park";
    }
    
    // Sprawdź zapisany stan
    const savedGame = localStorage.getItem('dziubCoinsGame');
    if (savedGame) {
        try {
            const parsedSave = JSON.parse(savedGame);
            
            if (parsedSave.locations && parsedSave.locations.unlockedLocations) {
                console.log("Przywracam odblokowane lokacje z zapisu");
                window.gameState.locations.unlockedLocations = {...parsedSave.locations.unlockedLocations};
            }
        } catch (e) {
            console.error("Błąd podczas przywracania z zapisu:", e);
        }
    }
    
    // Aktualizuj UI
    if (typeof updateMapUI === 'function') {
        console.log("Aktualizuję UI mapy");
        updateMapUI();
    }
    
    // Zapisz naprawiony stan
    if (typeof saveGame === 'function') {
        console.log("Zapisuję naprawiony stan");
        saveGame();
    }
    
    console.log("Naprawa zakończona. Aktualny stan odblokowanych lokacji:", window.gameState.locations.unlockedLocations);
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
    console.log(`Stosowanie dekoracji dla lokacji ${locationId} w changeLocation`);
    applyDecorations(locationId);
} else {
    console.error("Funkcja applyDecorations nie jest dostępna!");
    // Awaryjnie, jeśli funkcja nie jest dostępna
    if (locationConfig.background) {
        feedScreen.style.backgroundImage = `url('${locationConfig.background}')`;
    }
}
});

// Eksportuj funkcje do globalnego zakresu
window.showMapScreen = showMapScreen;
window.changeLocation = changeLocation;
window.updateMapUI = updateMapUI;