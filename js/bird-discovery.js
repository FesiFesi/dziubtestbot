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
    console.log("Inicjalizacja systemu odkrywania ptaków");
    
    // Zachowaj oryginalną funkcję
    const originalSpawnFunction = window.trySpawnBirdInSlot;
    
    // Zastąp funkcję wersją, która również odkrywa ptaki
    window.trySpawnBirdInSlot = function(slotIndex, locationId) {
        console.log(`[ODKRYWANIE] Próba generowania ptaka w slocie ${slotIndex}, lokacja ${locationId}`);
        
        // Wywołaj oryginalną funkcję
        const birdType = originalSpawnFunction.apply(this, arguments);
        
        // Jeśli ptak został wygenerowany, odkryj go w katalogu
        if (birdType && locationId) {
            console.log(`[ODKRYWANIE] Wygenerowano ptaka typu ${birdType} w lokacji ${locationId}`);
            
            // Znajdź ID ptaka na podstawie typu i lokacji
            const birdId = BIRD_TYPE_TO_ID[locationId]?.[birdType];
            
            if (birdId) {
                console.log(`[ODKRYWANIE] Odkrywam ptaka ${birdId} w lokacji ${locationId}`);
                discoverBirdAndUpdateUI(birdId, locationId);
            } else {
                console.warn(`[ODKRYWANIE] Nie znaleziono ID dla ptaka typu ${birdType} w lokacji ${locationId}`);
            }
        }
        
        return birdType;
    };

    // Dodaj globalne zdarzenie aktualizacji katalogu
    window.addEventListener('catalogOpened', function() {
        console.log("[ODKRYWANIE] Wykryto otwarcie katalogu - aktualizuję UI");
        updateCatalogUI();
    });
    
    console.log("System odkrywania ptaków zainicjalizowany");
}

// Ulepszona funkcja odkrywania ptaków
function discoverBirdAndUpdateUI(birdId, locationId) {
    console.log(`[ODKRYWANIE] Odkrywanie ptaka ${birdId} w lokacji ${locationId}`);
    
    // Sprawdź, czy struktury danych istnieją
    if (!gameState.discoveredBirds) {
        gameState.discoveredBirds = {};
    }
    
    if (!gameState.discoveredBirds[locationId]) {
        gameState.discoveredBirds[locationId] = {};
    }
    
    // Sprawdź, czy ptak już został odkryty
    if (gameState.discoveredBirds[locationId][birdId]) {
        console.log(`[ODKRYWANIE] Ptak ${birdId} już odkryty w lokacji ${locationId}`);
        return false;
    }
    
    // Odkryj ptaka
    gameState.discoveredBirds[locationId][birdId] = true;
    console.log(`[ODKRYWANIE] Ptak ${birdId} został odkryty w lokacji ${locationId}!`);
    
    // Pokaż powiadomienie
    showNotification("Nowy ptak dodany do katalogu!");
    
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
    console.log("[ODKRYWANIE] Aktualizacja UI katalogu ptaków");
    
    // Aktualizuj UI dla wszystkich lokacji
    updateLocationCatalog('park');
    updateLocationCatalog('lake');
    updateLocationCatalog('forest');
}

// Funkcja aktualizująca katalog dla konkretnej lokacji
function updateLocationCatalog(locationId) {
    console.log(`[ODKRYWANIE] Aktualizacja katalogu dla lokacji: ${locationId}`);
    
    // Znajdź kontener lokacji w katalogu
    const catalogElement = document.getElementById(`${locationId}-catalog`);
    if (!catalogElement) {
        console.warn(`[ODKRYWANIE] Nie znaleziono elementu #${locationId}-catalog w DOM`);
        return;
    }
    
    // Sprawdź, czy lokacja powinna mieć odkryte ptaki
    if (!gameState.discoveredBirds || !gameState.discoveredBirds[locationId]) {
        console.warn(`[ODKRYWANIE] Brak danych o odkrytych ptakach dla lokacji ${locationId}`);
        return;
    }
    
    // Znajdź wszystkie elementy ptaków w lokacji
    const birdItems = catalogElement.querySelectorAll('.catalog-bird-item');
    console.log(`[ODKRYWANIE] Znaleziono ${birdItems.length} elementów ptaków w lokacji ${locationId}`);
    
    // Zaktualizuj stan każdego ptaka
    birdItems.forEach(birdItem => {
        const birdId = birdItem.getAttribute('data-bird-id');
        if (!birdId) {
            console.warn("[ODKRYWANIE] Element ptaka bez data-bird-id");
            return;
        }
        
        // Sprawdź, czy ptak jest odkryty
        const isDiscovered = gameState.discoveredBirds[locationId][birdId] === true;
        
        // Aktualizuj klasę CSS w zależności od odkrycia
        if (isDiscovered) {
            console.log(`[ODKRYWANIE] Oznaczam ptaka ${birdId} jako odkryty w UI`);
            
            // Użyj kilku metod usunięcia klasy dla pewności
            birdItem.classList.remove('bird-undiscovered');
            
            // Metoda 2: ustaw bezpośrednio classList na string bez klasy bird-undiscovered
            if (birdItem.classList.contains('bird-undiscovered')) {
                let classes = Array.from(birdItem.classList).filter(cls => cls !== 'bird-undiscovered');
                birdItem.className = classes.join(' ');
            }
            
            // Metoda 3: używając setAttribute bezpośrednio
            if (birdItem.classList.contains('bird-undiscovered')) {
                let currentClass = birdItem.getAttribute('class') || '';
                let newClass = currentClass.replace(/\bbird-undiscovered\b/g, '').trim();
                birdItem.setAttribute('class', newClass);
            }
            
            console.log(`[ODKRYWANIE] Klasy po aktualizacji: ${birdItem.className}`);
        } else {
            // Ptak nieodkryty - upewnij się, że ma klasę bird-undiscovered
            if (!birdItem.classList.contains('bird-undiscovered')) {
                birdItem.classList.add('bird-undiscovered');
            }
        }
    });
}

// Monitorowanie otwarcia katalogu
function monitorCatalogOpening() {
    console.log("[ODKRYWANIE] Dodawanie monitorowania otwarcia katalogu");
    
    // Przycisk katalogu
    const catalogButton = document.getElementById('bird-catalog-button');
    if (catalogButton) {
        const originalOnClick = catalogButton.onclick;
        
        catalogButton.onclick = function() {
            console.log("[ODKRYWANIE] Kliknięto przycisk katalogu");
            
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
                        console.log("[ODKRYWANIE] Wykryto aktywację ekranu katalogu");
                        
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
    console.log(`[ODKRYWANIE] Bezpośrednie odkrywanie ptaka typu ${birdType} w lokacji ${locationId}`);
    
    const birdId = BIRD_TYPE_TO_ID[locationId]?.[birdType];
    
    if (birdId) {
        const result = discoverBirdAndUpdateUI(birdId, locationId);
        
        // Pokaż powiadomienie o wyniku
        if (result) {
            showNotification(`Odkryto nowego ptaka: ${birdId} w lokacji ${locationId}!`);
        } else {
            showNotification(`Ptak ${birdId} w lokacji ${locationId} był już odkryty.`);
        }
        
        return result;
    } else {
        console.error(`[ODKRYWANIE] Błąd: nieprawidłowy typ ptaka ${birdType} dla lokacji ${locationId}`);
        showNotification("Nie można odkryć ptaka: nieprawidłowy typ lub lokacja");
        return false;
    }
}

// Inicjalizacja systemu
function initBirdDiscoverySystem() {
    console.log("[ODKRYWANIE] Inicjalizacja systemu odkrywania ptaków");
    
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
    
    console.log("[ODKRYWANIE] System odkrywania ptaków zainicjalizowany pomyślnie");
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
    console.log("Uruchamiam naprawę wyświetlania ptaków w katalogu...");
    
    // Funkcja do sprawdzania i naprawiania stanu lokacji w katalogu
    function updateLocationInCatalog(locationId) {
        console.log(`Sprawdzanie i naprawa lokacji ${locationId} w katalogu...`);
        
        // Sprawdź, czy lokacja jest odblokowana w gameState
        const isLocationUnlocked = window.gameState && 
                                  window.gameState.locations && 
                                  window.gameState.locations.unlockedLocations && 
                                  window.gameState.locations.unlockedLocations[locationId] === true;
        
        // Znajdź element lokacji w katalogu
        const catalogElement = document.getElementById(`${locationId}-catalog`);
        if (!catalogElement) {
            console.error(`Nie znaleziono elementu ${locationId}-catalog!`);
            return;
        }
        
        // Pobierz elementy do modyfikacji
        const lockInfo = catalogElement.querySelector('.location-lock-info');
        const birdGrid = catalogElement.querySelector('.bird-grid');
        const statusElement = catalogElement.querySelector('.location-status');
        
        console.log(`Lokacja ${locationId} jest odblokowana: ${isLocationUnlocked}`);
        console.log(`Elementy katalog: lockInfo=${!!lockInfo}, birdGrid=${!!birdGrid}, status=${!!statusElement}`);
        
        if (isLocationUnlocked) {
            // Jeśli lokacja jest odblokowana
            console.log(`Pokazuję ptaki z lokacji ${locationId}`);
            
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
                statusElement.textContent = 'Odblokowane';
            }
            
            // Napraw obrazki ptaków w tej lokacji
            fixBirdImagesInLocation(locationId);
        }
    }
    
    // Funkcja naprawiająca obrazki ptaków w danej lokacji
    function fixBirdImagesInLocation(locationId) {
        console.log(`Naprawa obrazków ptaków w lokacji ${locationId}...`);
        
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
            console.log(`Brak mapowania obrazków dla lokacji ${locationId}`);
            return;
        }
        
        // Znajdź wszystkie elementy ptaków w katalogu dla tej lokacji
        const catalogElement = document.getElementById(`${locationId}-catalog`);
        if (!catalogElement) {
            console.error(`Nie znaleziono elementu ${locationId}-catalog!`);
            return;
        }
        
        // Pobierz wszystkie elementy ptaków
        const birdItems = catalogElement.querySelectorAll('.catalog-bird-item');
        console.log(`Znaleziono ${birdItems.length} elementów ptaków w lokacji ${locationId}`);
        
        // Napraw obrazki dla każdego ptaka
        birdItems.forEach(birdItem => {
            // Pobierz id ptaka
            const birdId = birdItem.getAttribute('data-bird-id');
            if (!birdId) {
                console.warn("Element ptaka bez data-bird-id");
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
                console.warn(`Nie można określić typu ptaka dla id: ${birdId}`);
                return;
            }
            
            // Pobierz element obrazka
            const imageElement = birdItem.querySelector('.catalog-bird-image');
            if (!imageElement) {
                console.warn(`Nie znaleziono elementu obrazka dla ptaka ${birdId}`);
                return;
            }
            
            // Ustaw poprawną ścieżkę obrazka
            const imagePath = imagePathMapping[locationId][birdType];
            if (imagePath) {
                console.log(`Ustawiam obrazek dla ptaka ${birdId}: ${imagePath}`);
                imageElement.style.backgroundImage = `url('${imagePath}')`;
            }
            
            // Sprawdź, czy ptak jest odkryty w gameState
            const isDiscovered = window.gameState && 
                              window.gameState.discoveredBirds && 
                              window.gameState.discoveredBirds[locationId] && 
                              window.gameState.discoveredBirds[locationId][birdId] === true;
            
            // Aktualizuj klasę w zależności od odkrycia
            if (isDiscovered) {
                console.log(`Ptak ${birdId} jest odkryty - usuwam klasę bird-undiscovered`);
                birdItem.classList.remove('bird-undiscovered');
            } else {
                // Upewnij się, że nieodkryte ptaki mają klasę bird-undiscovered
                if (!birdItem.classList.contains('bird-undiscovered')) {
                    birdItem.classList.add('bird-undiscovered');
                }
            }
        });
    }
    
    // Napraw wszystkie lokacje
    updateLocationInCatalog('lake');
    updateLocationInCatalog('forest');
    
    console.log("Zakończono naprawę wyświetlania ptaków w katalogu");
}

// Funkcja do wywołania naprawy w odpowiednich momentach
function setupCatalogFixListeners() {
    console.log("Konfiguracja nasłuchiwania zdarzeń dla naprawy katalogu...");
    
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
            console.log("Kliknięto przycisk katalogu ptaków - uruchamiam naprawę");
            
            // Wywołaj oryginalną funkcję (jeśli istnieje)
            if (typeof originalOnClick === 'function') {
                originalOnClick.apply(this, arguments);
            }
            
            // Napraw katalog po chwili
            setTimeout(fixBirdCatalogDisplay, 300);
        };
        console.log("Dodano nasłuchiwanie kliknięcia przycisku katalogu");
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
        console.log("Dodano nasłuchiwanie zdarzenia saveGame");
    }
    
    console.log("Zakończono konfigurację nasłuchiwania zdarzeń");
}






/**
 * Naprawa katalogu ptaków dla lokacji Brzeg Jeziora
 * Ten plik rozwiązuje problem ukrytych ptaków w katalogu po odblokowaniu lokacji
 */




function fixLakeBirdCatalog() {
    console.log("Naprawa katalogu ptaków dla Brzegu Jeziora...");
    
    // Znajdź element katalogu dla lokacji Jezioro
    const lakeCatalog = document.getElementById('lake-catalog');
    if (!lakeCatalog) {
        console.error("Nie znaleziono elementu lake-catalog!");
        return;
    }
    
    // Sprawdź czy lokacja jest odblokowana
    const isLakeUnlocked = window.gameState && 
                           window.gameState.locations && 
                           window.gameState.locations.unlockedLocations && 
                           window.gameState.locations.unlockedLocations.lake === true;
    
    console.log("Stan odblokowania Brzegu Jeziora:", isLakeUnlocked);
    
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
            
            console.log("Naprawiono siatkę ptaków w katalogu Jeziora");
        } else {
            console.error("Nie znaleziono siatki ptaków w katalogu Jeziora!");
            
            // Jeśli nie znaleziono siatki, stwórz ją
            const newBirdGrid = document.createElement('div');
            newBirdGrid.className = 'bird-grid';
            newBirdGrid.style.display = 'grid';
            
            // Dodaj siatkę do katalogu
            lakeCatalog.appendChild(newBirdGrid);
            console.log("Utworzono nową siatkę ptaków dla katalogu Jeziora");
            
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
            statusElement.textContent = 'Odblokowane';
        }
    }
}

// Nowa funkcja do wypełniania ptaków jeziora
function populateLakeBirds(container) {
    // Definicje ptaków z Jeziora (takie same jak w HTML)
    const lakebirds = [
        {
            id: "common_duck",
            name: "Kaczka krzyżówka",
            image: "assets/images/lake-common.png",
            type: "Pospolity",
            chance: "60%",
            time: "40s",
            cost: "3 ziarenka",
            reward: "2 DziubCoiny"
        },
        {
            id: "rare_heron",
            name: "Łabędź krzykliwy",
            image: "assets/images/lake-rare.png",
            type: "Rzadki",
            chance: "30%",
            time: "80s",
            cost: "7 ziarenka",
            reward: "5 DziubCoinów"
        },
        {
            id: "epic_swan",
            name: "Pelikan różowy",
            image: "assets/images/lake-epic.png",
            type: "Epicki",
            chance: "9%",
            time: "160s",
            cost: "15 ziarenka",
            reward: "10 DziubCoinów"
        },
        {
            id: "legendary_pelican",
            name: "Czapla jeziorna",
            image: "assets/images/lake-legendary.png",
            type: "Legendarny",
            chance: "0.95%",
            time: "800s",
            cost: "75 ziarenka",
            reward: "25 DziubCoinów"
        },
        {
            id: "mythical_kraken",
            name: "Błękitny Widmoptak",
            image: "assets/images/lake-mythical.png",
            type: "Mityczny",
            chance: "0.05%",
            time: "1600s",
            cost: "150 ziarenka",
            reward: "60 DziubCoinów i 0,02 TON"
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
            <div class="catalog-bird-name">${bird.name}</div>
            <div class="catalog-bird-stats">
                <div class="catalog-bird-stat">Typ: ${bird.type}</div>
                <div class="catalog-bird-stat">Szansa: ${bird.chance}</div>
                <div class="catalog-bird-stat">Czas: ${bird.time}</div>
                <div class="catalog-bird-stat">Koszt: ${bird.cost}</div>
                <div class="catalog-bird-stat">Nagroda: ${bird.reward}</div>
            </div>
        `;
        
        // Dodaj ptaka do kontenera
        container.appendChild(birdItem);
    });
    
    console.log(`Dodano ${lakebirds.length} ptaków do katalogu Jeziora.`);
}




// Funkcja aktualizująca stan odkrycia ptaków w lokacji Jezioro
function updateLakeBirdsDiscovery() {
    console.log("Aktualizowanie stanu odkrycia ptaków w lokacji Jezioro...");
    
    // Sprawdź czy struktura danych istnieje
    if (!window.gameState || !window.gameState.discoveredBirds || !window.gameState.discoveredBirds.lake) {
        console.error("Brak struktury danych dla odkrytych ptaków!");
        return;
    }
    
    // Znajdź wszystkie elementy ptaków w katalogu Jeziora
    const lakeCatalog = document.getElementById('lake-catalog');
    if (!lakeCatalog) {
        console.error("Nie znaleziono elementu lake-catalog!");
        return;
    }
    
    const birdItems = lakeCatalog.querySelectorAll('.catalog-bird-item');
    console.log(`Znaleziono ${birdItems.length} elementów ptaków w katalogu Jeziora`);
    
    // Aktualizuj stan odkrycia dla każdego ptaka
    birdItems.forEach(birdItem => {
        const birdId = birdItem.getAttribute('data-bird-id');
        if (!birdId) {
            console.warn("Element ptaka bez data-bird-id");
            return;
        }
        
        // Sprawdź, czy ptak jest odkryty
        const isDiscovered = window.gameState.discoveredBirds.lake[birdId] === true;
        
        // Aktualizuj klasę CSS w zależności od odkrycia
        if (isDiscovered) {
            console.log(`Ptak ${birdId} jest odkryty - usuwam klasę bird-undiscovered`);
            birdItem.classList.remove('bird-undiscovered');
        } else {
            // Upewnij się, że nieodkryte ptaki mają klasę bird-undiscovered
            if (!birdItem.classList.contains('bird-undiscovered')) {
                birdItem.classList.add('bird-undiscovered');
            }
        }
    });
}

// Dodaj nasłuchiwanie na zdarzenia
function setupLakeCatalogFixListeners() {
    console.log("Konfiguracja nasłuchiwania zdarzeń dla naprawy katalogu Jeziora...");
    
    // 1. Nasłuchuj na zdarzenie kliknięcia przycisku katalogu
    const catalogButton = document.getElementById('bird-catalog-button');
    if (catalogButton) {
        const originalOnClick = catalogButton.onclick;
        catalogButton.onclick = function() {
            console.log("Kliknięto przycisk katalogu ptaków - uruchamiam naprawę");
            
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
                        console.log("Wykryto otwarcie ekranu katalogu - uruchamiam naprawę");
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
    
    console.log("Zakończono konfigurację nasłuchiwania zdarzeń");
}

// Funkcja naprawcza dostępna globalnie
window.fixLakeBirdCatalog = fixLakeBirdCatalog;

// Uruchom konfigurację nasłuchiwania zdarzeń
setupLakeCatalogFixListeners();

// Uruchom naprawę od razu
setTimeout(fixLakeBirdCatalog, 500);

console.log("Załadowano moduł naprawy katalogu Jeziora");





// Funkcja bezpośrednio aktualizująca wygląd ptaków w katalogu
window.updateBirdAppearanceDirectly = function() {
    console.log("Bezpośrednia aktualizacja wyglądu ptaków w katalogu");
    
    // Napraw wygląd ptaków w lokacji Park
    const parkCatalog = document.getElementById('park-catalog');
    if (parkCatalog) {
        const parkBirds = parkCatalog.querySelectorAll('.catalog-bird-item');
        parkBirds.forEach(bird => {
            const birdId = bird.getAttribute('data-bird-id');
            const isDiscovered = gameState.discoveredBirds && 
                               gameState.discoveredBirds.park && 
                               gameState.discoveredBirds.park[birdId] === true;
            
            if (isDiscovered) {
                bird.classList.remove('bird-undiscovered');
            } else {
                bird.classList.add('bird-undiscovered');
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
                    
                    if (isDiscovered) {
                        bird.classList.remove('bird-undiscovered');
                    } else {
                        bird.classList.add('bird-undiscovered');
                    }
                });
            } else {
                console.error("Siatka ptaków jeziora nie znaleziona - uruchamiam naprawę");
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
                    
                    if (isDiscovered) {
                        bird.classList.remove('bird-undiscovered');
                    } else {
                        bird.classList.add('bird-undiscovered');
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