/**
 * System odkrywania ptaków i aktualizacji katalogu
 * Ten plik rozwiązuje problem nieaktualizowania się katalogu ptaków po ich odkryciu
 */

// Obiekt mapujący typy ptaków na identyfikatory w katalogu dla każdej lokacji
const BIRD_TYPE_TO_ID = {
    park: {
        common: "common_sparrow",
        rare: "rare_robin",
        epic: "epic_cardinal",
        legendary: "legendary_phoenix",
        mythical: "mythical_eagle"
    },
    lake: {
        common: "common_duck",
        rare: "rare_heron",
        epic: "epic_swan",
        legendary: "legendary_pelican",
        mythical: "mythical_kraken"
    },
    forest: {
        common: "common_woodpecker",
        rare: "rare_owl",
        epic: "epic_hawk",
        legendary: "legendary_griffin",
        mythical: "mythical_phoenix"
    }
};

// Ustawienie zdarzenia odkrycia ptaka dla trySpawnBirdInSlot
function setupBirdDiscovery() {
    console.log(t('birdDiscovery.systemInitialization'));
    
    // Zachowaj oryginalną funkcję
    const originalSpawnFunction = window.trySpawnBirdInSlot;
    
    // Zastąp funkcję wersją, która również odkrywa ptaki
    window.trySpawnBirdInSlot = function(slotIndex, locationId) {
        console.log(t('birdDiscovery.attemptGeneration', { slotIndex: slotIndex, locationId: locationId }));
        
        // Wywołaj oryginalną funkcję
        const birdType = originalSpawnFunction.apply(this, arguments);
        
        // Jeśli ptak został wygenerowany, odkryj go w katalogu
        if (birdType && locationId) {
            console.log(t('birdDiscovery.birdGenerated', { birdType: birdType, locationId: locationId }));
            
            // Znajdź ID ptaka na podstawie typu i lokacji
            const birdId = BIRD_TYPE_TO_ID[locationId]?.[birdType];
            
            if (birdId) {
                console.log(t('birdDiscovery.discoveringBird', { birdId: birdId, locationId: locationId }));
                discoverBirdAndUpdateUI(birdId, locationId);
            } else {
                console.warn(t('birdDiscovery.idNotFound', { birdType: birdType, locationId: locationId }));
            }
        }
        
        return birdType;
    };

    // Dodaj globalne zdarzenie aktualizacji katalogu
    window.addEventListener('catalogOpened', function() {
        console.log(t('birdDiscovery.catalogOpenDetected'));
        updateCatalogUI();
    });
    
    console.log(t('birdDiscovery.systemInitialized'));
}

// Ulepszona funkcja odkrywania ptaków
function discoverBirdAndUpdateUI(birdId, locationId) {
    console.log(t('birdDiscovery.discovering', { birdId: birdId, locationId: locationId }));
    
    // Sprawdź, czy struktury danych istnieją
    if (!gameState.discoveredBirds) {
        gameState.discoveredBirds = {};
    }
    
    if (!gameState.discoveredBirds[locationId]) {
        gameState.discoveredBirds[locationId] = {};
    }
    
    // Sprawdź, czy ptak już został odkryty
    if (gameState.discoveredBirds[locationId][birdId]) {
        console.log(t('birdDiscovery.birdAlreadyDiscovered', { birdId: birdId, locationId: locationId }));
        return false;
    }
    
    // Odkryj ptaka
    gameState.discoveredBirds[locationId][birdId] = true;
    console.log(t('birdDiscovery.birdDiscovered', { birdId: birdId, locationId: locationId }));
    
    // Pokaż powiadomienie
    showNotification(t('birdDiscovery.newBirdAdded'));
    
    // Zapisz stan gry
    saveGame();
    

// Emituj zdarzenie odkrycia ptaka, aby powiadomić system naprawy
const birdDiscoveredEvent = new CustomEvent('birdDiscovered', {
    detail: { birdId, locationId }
});
window.dispatchEvent(birdDiscoveredEvent);

    // Aktualizuj UI katalogu, jeśli jest otwarty
    if (document.querySelector('.game-screen.active#bird-catalog-screen')) {
        updateCatalogUI();
    }
    
    return true;
}

// Funkcja aktualizująca UI katalogu
function updateCatalogUI() {
    console.log(t('birdDiscovery.catalogUpdateStarted'));
    
    // Aktualizuj UI dla wszystkich lokacji
    updateLocationCatalog('park');
    updateLocationCatalog('lake');
    updateLocationCatalog('forest');
}

// Funkcja aktualizująca katalog dla konkretnej lokacji
function updateLocationCatalog(locationId) {
    console.log(t('birdDiscovery.locationCatalogUpdate', { locationId: locationId }));
    
    // Znajdź kontener lokacji w katalogu
    const catalogElement = document.getElementById(`${locationId}-catalog`);
    if (!catalogElement) {
        console.warn(t('birdDiscovery.catalogElementNotFound', { locationId: locationId }));
        return;
    }
    
    // Sprawdź, czy lokacja powinna mieć odkryte ptaki
    if (!gameState.discoveredBirds || !gameState.discoveredBirds[locationId]) {
        console.warn(t('birdDiscovery.noDiscoveredBirdsData', { locationId: locationId }));
        return;
    }
    
    // Znajdź wszystkie elementy ptaków w lokacji
    const birdItems = catalogElement.querySelectorAll('.catalog-bird-item');
    console.log(t('birdDiscovery.foundBirdItems', { count: birdItems.length, locationId: locationId }));
    
    // Zaktualizuj stan każdego ptaka
    birdItems.forEach(birdItem => {
        const birdId = birdItem.getAttribute('data-bird-id');
        if (!birdId) {
            console.warn(t('birdDiscovery.noBirdId'));
            return;
        }
        
        // Sprawdź, czy ptak jest odkryty
        const isDiscovered = gameState.discoveredBirds[locationId][birdId] === true;
        
        // Znajdź elementy nazwy ptaka
        const normalName = birdItem.querySelector('.catalog-bird-name');
        const undiscoveredName = birdItem.querySelector('.catalog-bird-name-undiscovered');
        
        // Aktualizuj klasę CSS i widoczność nazw w zależności od odkrycia
        if (isDiscovered) {
            console.log(t('birdDiscovery.markingBirdAsDiscovered', { birdId: birdId }));
            
            // Usuń klasę bird-undiscovered różnymi metodami
            birdItem.classList.remove('bird-undiscovered');
            
            // Pokaż prawdziwą nazwę, ukryj "nieodkryty"
            if (normalName) normalName.style.display = 'block';
            if (undiscoveredName) undiscoveredName.style.display = 'none';
            
            // Dodatkowe usunięcie klasy bird-undiscovered
            if (birdItem.classList.contains('bird-undiscovered')) {
                let classes = Array.from(birdItem.classList).filter(cls => cls !== 'bird-undiscovered');
                birdItem.className = classes.join(' ');
            }
            
            console.log(t('birdDiscovery.classesAfterUpdate', { classes: birdItem.className }));
        } else {
            // Ptak nieodkryty - ukryj prawdziwą nazwę, pokaż "nieodkryty"
            if (!birdItem.classList.contains('bird-undiscovered')) {
                birdItem.classList.add('bird-undiscovered');
            }
            
            if (normalName) normalName.style.display = 'none';
            if (undiscoveredName) undiscoveredName.style.display = 'block';
        }
    });
}

// Monitorowanie otwarcia katalogu
function monitorCatalogOpening() {
    console.log(t('birdDiscovery.catalogMonitoringAdded'));
    
    // Przycisk katalogu
    const catalogButton = document.getElementById('bird-catalog-button');
    if (catalogButton) {
        const originalOnClick = catalogButton.onclick;
        
        catalogButton.onclick = function() {
            console.log(t('birdDiscovery.catalogButtonClicked'));
            
            // Wywołaj oryginalną funkcję (jeśli istnieje)
            if (typeof originalOnClick === 'function') {
                originalOnClick.apply(this, arguments);
            } else {
                // Ukryj wszystkie ekrany
                document.querySelectorAll('.game-screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                
                // Pokaż ekran katalogu
                const catalogScreen = document.getElementById('bird-catalog-screen');
                if (catalogScreen) {
                    catalogScreen.classList.add('active');
                }
            }
            
            // Emituj zdarzenie otwarcia katalogu
            setTimeout(() => {
                const catalogOpenEvent = new Event('catalogOpened');
                window.dispatchEvent(catalogOpenEvent);
            }, 100);
        };
    }
    
    // Monitoruj zmiany class atrybutu ekranu katalogu
    const catalogScreen = document.getElementById('bird-catalog-screen');
    if (catalogScreen) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (catalogScreen.classList.contains('active')) {
                        console.log(t('birdDiscovery.catalogScreenActivated'));
                        
                        // Emituj zdarzenie otwarcia katalogu
                        const catalogOpenEvent = new Event('catalogOpened');
                        window.dispatchEvent(catalogOpenEvent);
                    }
                }
            });
        });
        
        observer.observe(catalogScreen, { attributes: true });
    }
}

// Funkcja pomocnicza do bezpośredniego odkrywania ptaków (do testów)
function directlyDiscoverBird(birdType, locationId) {
    console.log(t('birdDiscovery.directDiscovery', { birdType: birdType, locationId: locationId }));
    
    const birdId = BIRD_TYPE_TO_ID[locationId]?.[birdType];
    
    if (birdId) {
        const result = discoverBirdAndUpdateUI(birdId, locationId);
        
        // Pokaż powiadomienie o wyniku
        if (result) {
            showNotification(t('birdDiscovery.directBirdDiscovered', { birdId: birdId, locationId: locationId }));
        } else {
            showNotification(t('birdDiscovery.directBirdAlreadyDiscovered', { birdId: birdId, locationId: locationId }));
        }
        
        return result;
    } else {
        console.error(t('birdDiscovery.discoveryError', { birdType: birdType, locationId: locationId }));
        showNotification(t('birdDiscovery.cannotDiscover'));
        return false;
    }
}

// Inicjalizacja systemu
function initBirdDiscoverySystem() {
    console.log(t('birdDiscovery.systemInitialization'));
    
    // Ustaw przechwytywanie generowania ptaków
    setupBirdDiscovery();
    
    // Dodaj monitorowanie otwarcia katalogu
    monitorCatalogOpening();
    
    // Dodaj funkcje do globalnego zakresu
    window.updateCatalogUI = updateCatalogUI;
    window.discoverBird = function(birdId, locationId) {
        return discoverBirdAndUpdateUI(birdId, locationId);
    };
    window.discoverBirdByType = directlyDiscoverBird;
    
    console.log(t('birdDiscovery.systemInitialized'));
}

// Inicjalizuj system przy załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Daj czas na załadowanie innych skryptów
    setTimeout(initBirdDiscoverySystem, 1000);
});

// Inicjalizuj system również po zdarzeniu gameLoaded
document.addEventListener('gameLoaded', function() {
    // Również daj czas na załadowanie innych skryptów
    setTimeout(initBirdDiscoverySystem, 500);
});




/**
 * Skrypt naprawiający wyświetlanie ptaków w katalogu dla odblokowanych lokacji
 */

// Funkcja naprawiająca wyświetlanie ptaków w katalogu
function fixBirdCatalogDisplay() {
    console.log(t('catalogFix.startingRepair'));
    
    // Funkcja do sprawdzania i naprawiania stanu lokacji w katalogu
    function updateLocationInCatalog(locationId) {
        console.log(t('catalogFix.repairingLocation', { locationId: locationId }));
        
        // Sprawdź, czy lokacja jest odblokowana w gameState
        const isLocationUnlocked = window.gameState && 
                                  window.gameState.locations && 
                                  window.gameState.locations.unlockedLocations && 
                                  window.gameState.locations.unlockedLocations[locationId] === true;
        
        // Znajdź element lokacji w katalogu
        const catalogElement = document.getElementById(`${locationId}-catalog`);
        if (!catalogElement) {
            console.error(t('birdDiscovery.catalogElementNotFound', { locationId: locationId }));
            return;
        }
        
        // Pobierz elementy do modyfikacji
        const lockInfo = catalogElement.querySelector('.location-lock-info');
        const birdGrid = catalogElement.querySelector('.bird-grid');
        const statusElement = catalogElement.querySelector('.location-status');
        
        console.log(t('catalogFix.locationUnlockStatus', { locationId: locationId, status: isLocationUnlocked }));
        console.log(t('catalogFix.catalogElements', { 
            lockInfo: !!lockInfo, 
            birdGrid: !!birdGrid, 
            statusElement: !!statusElement 
        }));
        
        if (isLocationUnlocked) {
            // Jeśli lokacja jest odblokowana
            console.log(t('catalogFix.showingBirds', { locationId: locationId }));
            
            // Usuń klasę która blokuje wyświetlanie
            catalogElement.classList.remove('location-locked');
            
            // Ukryj informację o odblokowaniu
            if (lockInfo) {
                lockInfo.style.display = 'none';
            }
            
            // Pokaż siatkę ptaków
            if (birdGrid) {
                // Usuń inline style display: none
                birdGrid.style.removeProperty('display');
                // Ustaw display: grid
                birdGrid.style.display = 'grid';
            }
            
            // Zaktualizuj status
            if (statusElement) {
                statusElement.textContent = t('locations.unlocked');
            }
            
            // Napraw obrazki ptaków w tej lokacji
            fixBirdImagesInLocation(locationId);
        }
    }
    
    // Funkcja naprawiająca obrazki ptaków w danej lokacji
    function fixBirdImagesInLocation(locationId) {
        console.log(t('catalogFix.repairingBirdImages', { locationId: locationId }));
        
        // Mapowanie typów ptaków na ścieżki obrazków
        const imagePathMapping = {
            'lake': {
                'common': './assets/images/lake-common.png',
                'rare': './assets/images/lake-rare.png',
                'epic': './assets/images/lake-epic.png',
                'legendary': './assets/images/lake-legendary.png',
                'mythical': './assets/images/lake-mythical.png'
            },
            'forest': {
                'common': './assets/images/forest-common.png',
                'rare': './assets/images/forest-rare.png',
                'epic': './assets/images/forest-epic.png',
                'legendary': './assets/images/forest-legendary.png',
                'mythical': './assets/images/forest-mythical.png'
            }
        };
        
        // Sprawdź, czy mamy mapowanie dla tej lokacji
        if (!imagePathMapping[locationId]) {
            console.log(t('catalogFix.noImageMapping', { locationId: locationId }));
            return;
        }
        
        // Znajdź wszystkie elementy ptaków w katalogu dla tej lokacji
        const catalogElement = document.getElementById(`${locationId}-catalog`);
        if (!catalogElement) {
            console.error(t('birdDiscovery.catalogElementNotFound', { locationId: locationId }));
            return;
        }
        
        // Pobierz wszystkie elementy ptaków
        const birdItems = catalogElement.querySelectorAll('.catalog-bird-item');
        console.log(t('catalogFix.foundBirdElements', { count: birdItems.length, locationId: locationId }));
        
        // Napraw obrazki dla każdego ptaka
        birdItems.forEach(birdItem => {
            // Pobierz id ptaka
            const birdId = birdItem.getAttribute('data-bird-id');
            if (!birdId) {
                console.warn(t('birdDiscovery.noBirdId'));
                return;
            }
            
            // Określ typ ptaka na podstawie id
            let birdType = '';
            if (birdId.includes('common')) birdType = 'common';
            else if (birdId.includes('rare')) birdType = 'rare';
            else if (birdId.includes('epic')) birdType = 'epic';
            else if (birdId.includes('legendary')) birdType = 'legendary';
            else if (birdId.includes('mythical')) birdType = 'mythical';
            
            if (!birdType) {
                console.warn(t('catalogFix.cannotDetermineBirdType', { birdId: birdId }));
                return;
            }
            
            // Pobierz element obrazka
            const imageElement = birdItem.querySelector('.catalog-bird-image');
            if (!imageElement) {
                console.warn(t('catalogFix.imageElementNotFound', { birdId: birdId }));
                return;
            }
            
            // Ustaw poprawną ścieżkę obrazka
            const imagePath = imagePathMapping[locationId][birdType];
            if (imagePath) {
                console.log(t('catalogFix.settingBirdImage', { birdId: birdId, path: imagePath }));
                imageElement.style.backgroundImage = `url('${imagePath}')`;
            }
            
            // Sprawdź, czy ptak jest odkryty w gameState
            const isDiscovered = window.gameState && 
                              window.gameState.discoveredBirds && 
                              window.gameState.discoveredBirds[locationId] && 
                              window.gameState.discoveredBirds[locationId][birdId] === true;
            
            // Znajdź elementy nazwy ptaka
            const normalName = birdItem.querySelector('.catalog-bird-name');
            const undiscoveredName = birdItem.querySelector('.catalog-bird-name-undiscovered');
            
            // Aktualizuj klasę i widoczność nazw w zależności od odkrycia
            if (isDiscovered) {
                console.log(t('catalogFix.removingUndiscoveredClass', { birdId: birdId }));
                birdItem.classList.remove('bird-undiscovered');
                
                // Pokaż prawdziwą nazwę, ukryj "nieodkryty"
                if (normalName) normalName.style.display = 'block';
                if (undiscoveredName) undiscoveredName.style.display = 'none';
            } else {
                // Upewnij się, że nieodkryte ptaki mają klasę bird-undiscovered
                if (!birdItem.classList.contains('bird-undiscovered')) {
                    birdItem.classList.add('bird-undiscovered');
                }
                
                // Ukryj prawdziwą nazwę, pokaż "nieodkryty"
                if (normalName) normalName.style.display = 'none';
                if (undiscoveredName) undiscoveredName.style.display = 'block';
            }
        });
    }
    
    // Napraw wszystkie lokacje
    updateLocationInCatalog('lake');
    updateLocationInCatalog('forest');
    
    console.log(t('catalogFix.repairCompleted'));
}

// Funkcja do wywołania naprawy w odpowiednich momentach
function setupCatalogFixListeners() {
    console.log(t('lakeBirdCatalog.setupEventListeners'));
    
    // Uruchom naprawę przy załadowaniu strony
    window.addEventListener('load', function() {
        setTimeout(fixBirdCatalogDisplay, 1000);
    });
    
    // Uruchom naprawę przy zdarzeniu gameLoaded
    document.addEventListener('gameLoaded', function() {
        setTimeout(fixBirdCatalogDisplay, 500);
    });
    
    // Uruchom naprawę przy kliknięciu przycisku katalogu
    const catalogButton = document.getElementById('bird-catalog-button');
    if (catalogButton) {
        const originalOnClick = catalogButton.onclick;
        catalogButton.onclick = function() {
            console.log(t('lakeBirdCatalog.catalogButtonClicked'));
            
            // Wywołaj oryginalną funkcję (jeśli istnieje)
            if (typeof originalOnClick === 'function') {
                originalOnClick.apply(this, arguments);
            }
            
            // Napraw katalog po chwili
            setTimeout(fixBirdCatalogDisplay, 300);
        };
        console.log(t('lakeBirdCatalog.setupCompleted'));
    }
    
    // Uruchom naprawę przy zdarzeniu saveGame
    if (typeof window.saveGame === 'function') {
        const originalSaveGame = window.saveGame;
        window.saveGame = function() {
            // Wywołaj oryginalną funkcję
            originalSaveGame.apply(this, arguments);
            
            // Napraw katalog
            setTimeout(fixBirdCatalogDisplay, 300);
        };
        console.log(t('lakeBirdCatalog.setupCompleted'));
    }
    
    console.log(t('lakeBirdCatalog.setupCompleted'));
}






/**
 * Naprawa katalogu ptaków dla lokacji Brzeg Jeziora
 * Ten plik rozwiązuje problem ukrytych ptaków w katalogu po odblokowaniu lokacji
 */




function fixLakeBirdCatalog() {
    console.log(t('lakeBirdCatalog.repairStarting'));
    
    // Znajdź element katalogu dla lokacji Jezioro
    const lakeCatalog = document.getElementById('lake-catalog');
    if (!lakeCatalog) {
        console.error(t('lakeBirdCatalog.catalogNotFound'));
        return;
    }
    
    // Sprawdź czy lokacja jest odblokowana
    const isLakeUnlocked = window.gameState && 
                           window.gameState.locations && 
                           window.gameState.locations.unlockedLocations && 
                           window.gameState.locations.unlockedLocations.lake === true;
    
    console.log(t('lakeBirdCatalog.unlockStatus', { status: isLakeUnlocked }));
    
    if (isLakeUnlocked) {
        // Lokacja jest odblokowana - napraw katalog
        
        // 1. Usuń klasę location-locked
        lakeCatalog.classList.remove('location-locked');
        
        // 2. Znajdź siatkę ptaków
        const birdGrid = lakeCatalog.querySelector('.bird-grid');
        if (birdGrid) {
            // 3. Usuń inline style display: none
            birdGrid.style.removeProperty('display');
            
            // 4. Ustaw display: grid - wymusza wyświetlanie siatki
            birdGrid.style.display = 'grid';
            
            // 5. Dodatkowe usunięcie atrybutu style, jeśli istnieje
            birdGrid.removeAttribute('style');
            birdGrid.setAttribute('style', 'display: grid !important');
            
            console.log(t('lakeBirdCatalog.gridRepaired'));
        } else {
            console.error(t('lakeBirdCatalog.gridNotFound'));
            
            // Jeśli nie znaleziono siatki, stwórz ją
            const newBirdGrid = document.createElement('div');
            newBirdGrid.className = 'bird-grid';
            newBirdGrid.style.display = 'grid';
            
            // Dodaj siatkę do katalogu
            lakeCatalog.appendChild(newBirdGrid);
            console.log(t('lakeBirdCatalog.gridCreated'));
            
            // Utwórz ptaki na podstawie danych z gameState
            if (window.gameState && window.gameState.discoveredBirds && window.gameState.discoveredBirds.lake) {
                populateLakeBirds(newBirdGrid);
            }
        }
        
        // Ukryj informację o odblokowaniu
        const lockInfo = lakeCatalog.querySelector('.location-lock-info');
        if (lockInfo) {
            lockInfo.style.display = 'none';
        }
        
        // Zaktualizuj status
        const statusElement = lakeCatalog.querySelector('.location-status');
        if (statusElement) {
            statusElement.textContent = t('locations.unlocked');
        }
    }
}

// Nowa funkcja do wypełniania ptaków jeziora
function populateLakeBirds(container) {
    // Definicje ptaków z Jeziora (takie same jak w HTML)
    const lakebirds = [
        {
            id: "common_duck",
            name: t('catalog.birdNames.commonDuck'),
            image: "assets/images/lake-common.png",
            type: t('catalog.birdTypes.common'),
            chance: "60%",
            time: "40s",
            cost: "3 " + t('resources.seeds'),
            reward: "2 " + t('resources.coins')
        },
        {
            id: "rare_heron",
            name: t('catalog.birdNames.rareHeron'),
            image: "assets/images/lake-rare.png",
            type: t('catalog.birdTypes.rare'),
            chance: "30%",
            time: "80s",
            cost: "7 " + t('resources.seeds'),
            reward: "5 " + t('resources.coins')
        },
        {
            id: "epic_swan",
            name: t('catalog.birdNames.epicSwan'),
            image: "assets/images/lake-epic.png",
            type: t('catalog.birdTypes.epic'),
            chance: "9%",
            time: "160s",
            cost: "15 " + t('resources.seeds'),
            reward: "10 " + t('resources.coins')
        },
        {
            id: "legendary_pelican",
            name: t('catalog.birdNames.legendaryPelican'),
            image: "assets/images/lake-legendary.png",
            type: t('catalog.birdTypes.legendary'),
            chance: "0.95%",
            time: "800s",
            cost: "75 " + t('resources.seeds'),
            reward: "25 " + t('resources.coins')
        },
        {
            id: "mythical_kraken",
            name: t('catalog.birdNames.mythicalKraken'),
            image: "assets/images/lake-mythical.png",
            type: t('catalog.birdTypes.mythical'),
            chance: "0.05%",
            time: "1600s",
            cost: "150 " + t('resources.seeds'),
            reward: "60 " + t('resources.coins') + " " + t('general.and') + " 0,02 " + t('resources.ton')
        }
    ];
    
    // Dodaj wszystkie ptaki do kontenera
    lakebirds.forEach(bird => {
        // Sprawdź, czy ptak został odkryty
        const isDiscovered = window.gameState && 
                            window.gameState.discoveredBirds && 
                            window.gameState.discoveredBirds.lake && 
                            window.gameState.discoveredBirds.lake[bird.id] === true;
        
        // Utwórz element ptaka
        const birdItem = document.createElement('div');
        birdItem.className = 'catalog-bird-item' + (isDiscovered ? '' : ' bird-undiscovered');
        birdItem.setAttribute('data-bird-id', bird.id);
        
        // Dodaj zawartość
        birdItem.innerHTML = `
            <div class="catalog-bird-image" style="background-image: url('${bird.image}')"></div>
            <div class="catalog-bird-name" ${isDiscovered ? '' : 'style="display: none;"'}>${bird.name}</div>
            <div class="catalog-bird-name-undiscovered" data-i18n="catalog.undiscovered" ${isDiscovered ? 'style="display: none;"' : ''}>Nieodkryty</div>
            <div class="catalog-bird-stats">
                <div class="catalog-bird-stat"><span data-i18n="catalog.birdStats.type">Typ:</span> ${bird.type}</div>
                <div class="catalog-bird-stat"><span data-i18n="catalog.birdStats.chance">Szansa:</span> ${bird.chance}</div>
                <div class="catalog-bird-stat"><span data-i18n="catalog.birdStats.time">Czas:</span> ${bird.time}</div>
                <div class="catalog-bird-stat"><span data-i18n="catalog.birdStats.cost">Koszt:</span> ${bird.cost}</div>
                <div class="catalog-bird-stat"><span data-i18n="catalog.birdStats.reward">Nagroda:</span> ${bird.reward}</div>
            </div>
        `;
        
        // Dodaj ptaka do kontenera
        container.appendChild(birdItem);
    });
    
    console.log(t('lakeBirdCatalog.birdsAdded', { count: lakebirds.length }));
}




// Funkcja aktualizująca stan odkrycia ptaków w lokacji Jezioro
function updateLakeBirdsDiscovery() {
    console.log(t('lakeBirdCatalog.updatingDiscoveryState'));
    
    // Sprawdź czy struktura danych istnieje
    if (!window.gameState || !window.gameState.discoveredBirds || !window.gameState.discoveredBirds.lake) {
        console.error(t('lakeBirdCatalog.noDiscoveryData'));
        return;
    }
    
    // Znajdź wszystkie elementy ptaków w katalogu Jeziora
    const lakeCatalog = document.getElementById('lake-catalog');
    if (!lakeCatalog) {
        console.error(t('lakeBirdCatalog.catalogNotFound'));
        return;
    }
    
    const birdItems = lakeCatalog.querySelectorAll('.catalog-bird-item');
    console.log(t('lakeBirdCatalog.foundBirdElements', { count: birdItems.length }));
    
    // Aktualizuj stan odkrycia dla każdego ptaka
    birdItems.forEach(birdItem => {
        const birdId = birdItem.getAttribute('data-bird-id');
        if (!birdId) {
            console.warn(t('birdDiscovery.noBirdId'));
            return;
        }
        
        // Sprawdź, czy ptak jest odkryty
        const isDiscovered = window.gameState.discoveredBirds.lake[birdId] === true;
        
        // Znajdź elementy nazwy ptaka
        const normalName = birdItem.querySelector('.catalog-bird-name');
        const undiscoveredName = birdItem.querySelector('.catalog-bird-name-undiscovered');
        
        // Aktualizuj klasę CSS i widoczność nazw w zależności od odkrycia
        if (isDiscovered) {
            console.log(t('lakeBirdCatalog.removingUndiscoveredClass', { birdId: birdId }));
            birdItem.classList.remove('bird-undiscovered');
            
            // Pokaż prawdziwą nazwę, ukryj "nieodkryty"
            if (normalName) normalName.style.display = 'block';
            if (undiscoveredName) undiscoveredName.style.display = 'none';
        } else {
            // Upewnij się, że nieodkryte ptaki mają klasę bird-undiscovered
            if (!birdItem.classList.contains('bird-undiscovered')) {
                birdItem.classList.add('bird-undiscovered');
            }
            
            // Ukryj prawdziwą nazwę, pokaż "nieodkryty"
            if (normalName) normalName.style.display = 'none';
            if (undiscoveredName) undiscoveredName.style.display = 'block';
        }
    });
}

// Dodaj nasłuchiwanie na zdarzenia
function setupLakeCatalogFixListeners() {
    console.log(t('lakeBirdCatalog.setupEventListeners'));
    
    // 1. Nasłuchuj na zdarzenie kliknięcia przycisku katalogu
    const catalogButton = document.getElementById('bird-catalog-button');
    if (catalogButton) {
        const originalOnClick = catalogButton.onclick;
        catalogButton.onclick = function() {
            console.log(t('lakeBirdCatalog.catalogButtonClicked'));
            
            // Wywołaj oryginalną funkcję (jeśli istnieje)
            if (typeof originalOnClick === 'function') {
                originalOnClick.apply(this, arguments);
            }
            
            // Napraw katalog po krótkim opóźnieniu
            setTimeout(fixLakeBirdCatalog, 300);
        };
    }
    
    // 2. Nasłuchuj na zdarzenie gameLoaded
    document.addEventListener('gameLoaded', function() {
        setTimeout(fixLakeBirdCatalog, 500);
    });
    
    // 3. Nasłuchuj na zdarzenie otwarcia ekranu katalogu
    const catalogScreen = document.getElementById('bird-catalog-screen');
    if (catalogScreen) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (catalogScreen.classList.contains('active')) {
                        console.log(t('lakeBirdCatalog.catalogScreenOpened'));
                        setTimeout(fixLakeBirdCatalog, 100);
                    }
                }
            });
        });
        
        observer.observe(catalogScreen, { attributes: true });
    }
    
    // 4. Nasłuchuj na zdarzenie odkrycia ptaka
    window.addEventListener('catalogOpened', function() {
        setTimeout(fixLakeBirdCatalog, 200);
    });
    
    console.log(t('lakeBirdCatalog.setupCompleted'));
}

// Funkcja naprawcza dostępna globalnie
window.fixLakeBirdCatalog = fixLakeBirdCatalog;

// Uruchom konfigurację nasłuchiwania zdarzeń
setupLakeCatalogFixListeners();

// Uruchom naprawę od razu
setTimeout(fixLakeBirdCatalog, 500);

console.log(t('lakeBirdCatalog.moduleLoaded'));





// Funkcja bezpośrednio aktualizująca wygląd ptaków w katalogu
window.updateBirdAppearanceDirectly = function() {
    console.log(t('birdAppearance.directUpdate'));
    
    // Napraw wygląd ptaków w lokacji Park
    const parkCatalog = document.getElementById('park-catalog');
    if (parkCatalog) {
        const parkBirds = parkCatalog.querySelectorAll('.catalog-bird-item');
        parkBirds.forEach(bird => {
            const birdId = bird.getAttribute('data-bird-id');
            const isDiscovered = gameState.discoveredBirds && 
                               gameState.discoveredBirds.park && 
                               gameState.discoveredBirds.park[birdId] === true;
            
            // Znajdź elementy nazwy ptaka
            const normalName = bird.querySelector('.catalog-bird-name');
            const undiscoveredName = bird.querySelector('.catalog-bird-name-undiscovered');
            
            if (isDiscovered) {
                bird.classList.remove('bird-undiscovered');
                if (normalName) normalName.style.display = 'block';
                if (undiscoveredName) undiscoveredName.style.display = 'none';
            } else {
                bird.classList.add('bird-undiscovered');
                if (normalName) normalName.style.display = 'none';
                if (undiscoveredName) undiscoveredName.style.display = 'block';
            }
        });
    }
    
    // Napraw wygląd ptaków w lokacji Jezioro
    const lakeCatalog = document.getElementById('lake-catalog');
    if (lakeCatalog) {
        // Sprawdź czy lokacja jest odblokowana
        const isLakeUnlocked = gameState.locations && 
                             gameState.locations.unlockedLocations && 
                             gameState.locations.unlockedLocations.lake === true;
        
        if (isLakeUnlocked) {
            // Usuń klasę location-locked
            lakeCatalog.classList.remove('location-locked');
            
            // Znajdź siatkę ptaków
            let birdGrid = lakeCatalog.querySelector('.bird-grid');
            if (birdGrid) {
                // Wymuś wyświetlanie
                birdGrid.style.display = 'grid';
                
                // Aktualizuj wygląd ptaków
                const lakeBirds = birdGrid.querySelectorAll('.catalog-bird-item');
                lakeBirds.forEach(bird => {
                    const birdId = bird.getAttribute('data-bird-id');
                    const isDiscovered = gameState.discoveredBirds && 
                                       gameState.discoveredBirds.lake && 
                                       gameState.discoveredBirds.lake[birdId] === true;
                    
                    // Znajdź elementy nazwy ptaka
                    const normalName = bird.querySelector('.catalog-bird-name');
                    const undiscoveredName = bird.querySelector('.catalog-bird-name-undiscovered');
                    
                    if (isDiscovered) {
                        bird.classList.remove('bird-undiscovered');
                        if (normalName) normalName.style.display = 'block';
                        if (undiscoveredName) undiscoveredName.style.display = 'none';
                    } else {
                        bird.classList.add('bird-undiscovered');
                        if (normalName) normalName.style.display = 'none';
                        if (undiscoveredName) undiscoveredName.style.display = 'block';
                    }
                });
            } else {
                console.error(t('birdAppearance.lakeGridNotFound'));
                fixLakeBirdCatalog();
            }
        }
    }
    
    // Napraw wygląd ptaków w lokacji Las
    const forestCatalog = document.getElementById('forest-catalog');
    if (forestCatalog) {
        // Sprawdź czy lokacja jest odblokowana
        const isForestUnlocked = gameState.locations && 
                               gameState.locations.unlockedLocations && 
                               gameState.locations.unlockedLocations.forest === true;
        
        if (isForestUnlocked) {
            // Usuń klasę location-locked
            forestCatalog.classList.remove('location-locked');
            
            // Znajdź siatkę ptaków
            const birdGrid = forestCatalog.querySelector('.bird-grid');
            if (birdGrid) {
                // Wymuś wyświetlanie
                birdGrid.style.display = 'grid';
                
                // Aktualizuj wygląd ptaków
                const forestBirds = birdGrid.querySelectorAll('.catalog-bird-item');
                forestBirds.forEach(bird => {
                    const birdId = bird.getAttribute('data-bird-id');
                    const isDiscovered = gameState.discoveredBirds && 
                                       gameState.discoveredBirds.forest && 
                                       gameState.discoveredBirds.forest[birdId] === true;
                    
                    // Znajdź elementy nazwy ptaka
                    const normalName = bird.querySelector('.catalog-bird-name');
                    const undiscoveredName = bird.querySelector('.catalog-bird-name-undiscovered');
                    
                    if (isDiscovered) {
                        bird.classList.remove('bird-undiscovered');
                        if (normalName) normalName.style.display = 'block';
                        if (undiscoveredName) undiscoveredName.style.display = 'none';
                    } else {
                        bird.classList.add('bird-undiscovered');
                        if (normalName) normalName.style.display = 'none';
                        if (undiscoveredName) undiscoveredName.style.display = 'block';
                    }
                });
            }
        }
    }
};

// Wywołaj funkcję przy załadowaniu strony
window.addEventListener('load', function() {
    setTimeout(window.updateBirdAppearanceDirectly, 2000);
});

// Uruchom naprawę przy kliknięciu przycisku katalogu
document.addEventListener('DOMContentLoaded', function() {
    const catalogButton = document.getElementById('bird-catalog-button');
    if (catalogButton) {
        catalogButton.addEventListener('click', function() {
            setTimeout(window.updateBirdAppearanceDirectly, 500);
        });
    }
});




// Uruchom konfigurację nasłuchiwania zdarzeń
setupCatalogFixListeners();

// Wywołaj naprawę od razu
setTimeout(fixBirdCatalogDisplay, 500);