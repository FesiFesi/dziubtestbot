// ===== SYSTEM SZAFY PTAKA =====
console.log("Inicjalizacja systemu szafy ptaka");

// Główny obiekt zarządzający szafą
const WardrobeModule = {
    // Inicjalizacja modułu
    init: function() {
        console.log("Inicjalizacja modułu szafy ptaka");
        
        // Dodaj obiekt skinów do gameState, jeśli nie istnieje
        if (!gameState.skins) {
            gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default", "lesny"]
            };
            
            // Zapisz stan gry
            saveGame();
        }
        
        // Upewnij się, że wartości currentSkin i unlockedSkins istnieją i są poprawne
        if (!gameState.skins.currentSkin) {
            gameState.skins.currentSkin = "default";
        }
        
        if (!Array.isArray(gameState.skins.unlockedSkins) || gameState.skins.unlockedSkins.length === 0) {
            gameState.skins.unlockedSkins = ["default", "lesny"];
        }
        
        // Dodaj dodatkowy zapis dla bezpieczeństwa
        localStorage.setItem('currentSkin', gameState.skins.currentSkin);
        
        // Ustaw listenery zdarzeń
        this.setupEventListeners();
        
        // Dodaj style CSS dla szafy
        this.addWardrobeStyles();
        
        // Zastosuj aktualny skin na wszystkich ekranach
        this.applySkinToAllScreens();
        
        // Ustaw obserwowanie zmian ekranów
        this.setupScreenChangeObserver();
    },
    
    // Dodanie stylów CSS dla szafy
    addWardrobeStyles: function() {
        const styles = document.createElement('style');
        styles.innerHTML = `
            .wardrobe-button {
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .wardrobe-button:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4) !important;
            }
            
            .wardrobe-container {
                transition: opacity 0.3s;
            }
            
            .wardrobe-bird-preview {
                transition: transform 0.3s;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .wardrobe-bird-preview:hover {
                transform: scale(1.05);
            }
            
            #wardrobe-back-button {
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 8px 15px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            #wardrobe-back-button:hover {
                background-color: #1976D2;
            }
            
            .skin-item {
                transition: transform 0.2s, box-shadow 0.2s;
                position: relative;
            }
            
            .skin-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
            }
            
            .skin-select-button {
                transition: background-color 0.2s;
            }
            
            .skin-select-button:hover {
                opacity: 0.9;
            }
            
            .skin-selected-badge {
                position: absolute;
                top: -10px;
                right: -10px;
                background-color: #4CAF50;
                color: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(styles);
    },
    
    // NOWA FUNKCJA: Ustawienie obserwatora zmian ekranów
    setupScreenChangeObserver: function() {
        console.log("Ustawianie obserwatora zmian ekranów");
        
        // Obserwuj wszystkie ekrany gry
        const gameScreens = document.querySelectorAll('.game-screen');
        gameScreens.forEach(screen => {
            // Obserwuj zmiany klasy (aktywacja/deaktywacja ekranu)
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isActive = screen.classList.contains('active');
                        if (isActive) {
                            console.log(`Ekran ${screen.id} został aktywowany - aktualizuję skin`);
                            setTimeout(() => this.applySkinToAllScreens(), 50);
                        }
                    }
                });
            });
            
            // Rozpocznij obserwowanie zmian atrybutu class
            observer.observe(screen, { attributes: true });
        });
    },
    
    // Ustawienie obsługi zdarzeń - ZMODYFIKOWANE
    setupEventListeners: function() {
        console.log("Ustawianie listenerów dla szafy ptaka");
        
        // Przyciski otwierania szafy - ZMIENIONE z querySelector na querySelectorAll
        const wardrobeButtons = document.querySelectorAll('.wardrobe-button');
        if (wardrobeButtons.length > 0) {
            wardrobeButtons.forEach(button => {
                // Usuwamy istniejące listenery przez klonowanie
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Dodajemy nowy listener
                newButton.addEventListener('click', () => {
                    this.showWardrobeScreen();
                });
            });
        }
        
        // Przycisk powrotu
        const backButton = document.getElementById('wardrobe-back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.hideWardrobeScreen();
            });
        }
        
        // Przyciski wyboru skinów
        const selectButtons = document.querySelectorAll('.skin-select-button');
        selectButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const skinId = event.target.getAttribute('data-skin-id');
                this.selectSkin(skinId);
            });
        });
        
        // Dodaj handler do przycisków nawigacji - odświeżaj skin przy zmianie ekranu
        document.querySelectorAll('.nav-button').forEach(button => {
            const originalOnClick = button.onclick;
            button.onclick = (event) => {
                // Wywołaj oryginalne zachowanie
                if (typeof originalOnClick === 'function') {
                    originalOnClick.call(button, event);
                }
                
                // Po zmianie ekranu odśwież skin
                setTimeout(() => this.applySkinToAllScreens(), 100);
            };
        });
    },
    
    // Pokazanie ekranu szafy
    showWardrobeScreen: function() {
        console.log("Pokazywanie ekranu szafy");
        
        // Ukryj wszystkie ekrany
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Pokaż ekran szafy
        const wardrobeScreen = document.getElementById('wardrobe-screen');
        if (wardrobeScreen) {
            wardrobeScreen.classList.add('active');
            
            // Aktualizuj podgląd ptaka z aktualnym skinem
            this.updateBirdPreview();
            
            // Aktualizuj stan przycisków i obramowań skinów
            this.updateSkinsUIState();
        }
    },
    
    // Ukrycie ekranu szafy
    hideWardrobeScreen: function() {
        console.log("Ukrywanie ekranu szafy");
        
        // Ukryj ekran szafy
        const wardrobeScreen = document.getElementById('wardrobe-screen');
        if (wardrobeScreen) {
            wardrobeScreen.classList.remove('active');
        }
        
        // Pokaż ekran hodowli
        const breedingScreen = document.getElementById('breeding-screen');
        if (breedingScreen) {
            breedingScreen.classList.add('active');
            
            // Upewnij się, że skin jest zastosowany po powrocie
            setTimeout(() => this.applySkinToAllScreens(), 50);
        }
    },
    
    // Aktualizacja podglądu ptaka z aktualnym skinem
    updateBirdPreview: function() {
        console.log("Aktualizacja podglądu ptaka w szafie");
        
        const birdImage = document.getElementById('wardrobe-bird-image');
        if (!birdImage) return;
        
        // Odzyskaj skin z localStorage, jeśli gameState nie ma skinu
        if (!gameState.skins || !gameState.skins.currentSkin) {
            const savedSkin = localStorage.getItem('currentSkin');
            if (savedSkin) {
                if (!gameState.skins) gameState.skins = {};
                gameState.skins.currentSkin = savedSkin;
            } else {
                if (!gameState.skins) gameState.skins = {};
                gameState.skins.currentSkin = 'default';
            }
        }
        
        // Sprawdź czy ptak istnieje
        if (gameState.petBird && gameState.petBird.exists) {
            // Pobierz etap rozwoju ptaka
            const stage = gameState.petBird.stage || 'egg';
            
            if (stage === 'adult') {
                // Jeśli ptak jest dorosły, pokaż aktywny skin
                const skinId = gameState.skins?.currentSkin || 'default';
                if (skinId === 'default') {
                    birdImage.src = 'assets/images/bird-adult.png';
                } else if (skinId === 'lesny') {
                    birdImage.src = 'assets/images/skins/lesny-skin.png';
                }
            } else {
                // Dla niedorosłych ptaków pokaż standardowy obrazek
                birdImage.src = `assets/images/bird-${stage}.png`;
            }
        } else {
            // Brak ptaka - pokaż placeholder
            birdImage.src = 'assets/images/bird-egg.png';
        }
    },
    
    // Aktualizacja stanu UI skinów
    updateSkinsUIState: function() {
        console.log("Aktualizacja stanu UI skinów");
        
        // Odzyskaj skin z localStorage, jeśli gameState nie ma skinu
        if (!gameState.skins || !gameState.skins.currentSkin) {
            const savedSkin = localStorage.getItem('currentSkin');
            if (savedSkin) {
                if (!gameState.skins) gameState.skins = {};
                gameState.skins.currentSkin = savedSkin;
            } else {
                if (!gameState.skins) gameState.skins = {};
                gameState.skins.currentSkin = 'default';
            }
        }
        
        // Pobierz aktualny skin
        const currentSkin = gameState.skins?.currentSkin || 'default';
        
        // Zaktualizuj stan wszystkich elementów skinów
        document.querySelectorAll('.skin-item').forEach(item => {
            const skinId = item.getAttribute('data-skin-id');
            const selectButton = item.querySelector('.skin-select-button');
            
            if (skinId === currentSkin) {
                // Ten skin jest wybrany
                item.style.border = '3px solid #4CAF50';
                
                if (selectButton) {
                    selectButton.textContent = 'Wybrany';
                    selectButton.classList.add('selected');
                    selectButton.style.backgroundColor = '#4CAF50';
                }
            } else {
                // Ten skin nie jest wybrany
                item.style.border = 'none';
                
                if (selectButton) {
                    selectButton.textContent = 'Wybierz';
                    selectButton.classList.remove('selected');
                    selectButton.style.backgroundColor = '#2196F3';
                }
            }
        });
    },
    
    // Wybór skina
    selectSkin: function(skinId) {
        console.log("Wybór skina:", skinId);
        
        // Sprawdź czy skin jest już wybrany
        if (gameState.skins?.currentSkin === skinId) {
            console.log("Ten skin jest już wybrany");
            return;
        }
        
        // Sprawdź czy ptak istnieje i jest dorosły
        if (!gameState.petBird || !gameState.petBird.exists || gameState.petBird.stage !== 'adult') {
            showNotification("Tylko dorosły ptak może zmienić wygląd!");
            return;
        }
        
        // Ustaw nowy skin
        if (!gameState.skins) {
            gameState.skins = {
                currentSkin: skinId,
                unlockedSkins: ["default", "lesny"]
            };
        } else {
            gameState.skins.currentSkin = skinId;
        }
        
        // Dodatkowy zapis do localStorage
        localStorage.setItem('currentSkin', skinId);
        
        // Zapisz stan gry
        saveGame();
        
        // Aktualizuj UI
        this.updateSkinsUIState();
        
        // Aktualizuj podgląd ptaka
        this.updateBirdPreview();
        
        // Zastosuj skin na wszystkich ekranach
        this.applySkinToAllScreens();
        
        // Pokaż powiadomienie
        if (skinId === 'default') {
            showNotification("Wybrano domyślny wygląd ptaka!");
        } else if (skinId === 'lesny') {
            showNotification("Wybrano skin Leśnego Zwiadowcy! Zyskujesz bonus +10% ziarenek z ekspedycji!");
            
            // Dodaj informację o bonusie na ekranie ekspedycji
            this.addExpeditionBonusInfo();
        }
    },
    
    // Zastosowanie aktualnego skina na wszystkich ekranach
    applySkinToAllScreens: function() {
        console.log("Zastosowanie aktualnego skina na wszystkich ekranach");
        
        // Odzyskaj skin z localStorage, jeśli gameState nie ma skinu
        if (!gameState.skins || !gameState.skins.currentSkin) {
            const savedSkin = localStorage.getItem('currentSkin');
            if (savedSkin) {
                if (!gameState.skins) gameState.skins = {};
                gameState.skins.currentSkin = savedSkin;
            } else {
                if (!gameState.skins) gameState.skins = {};
                gameState.skins.currentSkin = 'default';
            }
        }
        
        // Pobierz aktualny skin
        const skinId = gameState.skins?.currentSkin || 'default';
        
        // Sprawdź czy ptak istnieje i jest dorosły
        if (!gameState.petBird || !gameState.petBird.exists || gameState.petBird.stage !== 'adult') {
            console.log("Ptak nie jest dorosły, nie stosuję skinu");
            return;
        }
        
        console.log("Zastosowanie skinu:", skinId);
        
        // 1. Ekran hodowli (breeding)
        const breedingBirdImage = document.getElementById('pet-bird-image');
        if (breedingBirdImage) {
            if (skinId === 'default') {
                breedingBirdImage.style.backgroundImage = 'url(./assets/images/bird-adult.png)';
            } else if (skinId === 'lesny') {
                breedingBirdImage.style.backgroundImage = 'url(./assets/images/skins/lesny-skin.png)';
            }
        }
        
        // 2. Ekran zabawy (play)
        const playBirdImage = document.getElementById('play-bird-image');
        if (playBirdImage) {
            if (skinId === 'default') {
                playBirdImage.style.backgroundImage = 'url(./assets/images/bird-adult.png)';
            } else if (skinId === 'lesny') {
                playBirdImage.style.backgroundImage = 'url(./assets/images/skins/lesny-skin.png)';
            }
        }
        
        // 3. Ekran przepustki nagród (reward-pass)
        const rewardPassBird = document.getElementById('reward-pass-bird');
        if (rewardPassBird) {
            if (skinId === 'default') {
                rewardPassBird.style.backgroundImage = 'url(./assets/images/bird-adult-pass.png)';
            } else if (skinId === 'lesny') {
                rewardPassBird.style.backgroundImage = 'url(./assets/images/skins/lesny-skin.png)';
            }
        }
        
        // 4. Ekran ekspedycji - obrazek latającego ptaka
        const flyingBird = document.querySelector('.flying-bird');
        if (flyingBird) {
            if (skinId === 'default') {
                flyingBird.style.backgroundImage = 'url(./assets/images/forest-expedition.png)';
            } else if (skinId === 'lesny') {
                flyingBird.style.backgroundImage = 'url(./assets/images/skins/lesny-expedition.png)';
            }
        }
        
        // 5. Ekran ekspedycji - dodaj informację o bonusie
        if (skinId === 'lesny') {
            this.addExpeditionBonusInfo();
        } else {
            this.removeExpeditionBonusInfo();
        }
    },
    
    // Dodanie informacji o bonusie na ekranie ekspedycji
    addExpeditionBonusInfo: function() {
        console.log("Dodawanie informacji o bonusie ekspedycji");
        
        // Sprawdź czy element informacji o bonusie już istnieje
        let bonusInfo = document.getElementById('expedition-bonus-info');
        
        if (!bonusInfo) {
            // Stwórz nowy element
            bonusInfo = document.createElement('div');
            bonusInfo.id = 'expedition-bonus-info';
            bonusInfo.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            bonusInfo.style.border = '1px solid #4CAF50';
            bonusInfo.style.borderRadius = '10px';
            bonusInfo.style.padding = '10px 15px';
            bonusInfo.style.marginBottom = '15px';
            bonusInfo.style.textAlign = 'center';
            bonusInfo.style.fontSize = '14px';
            bonusInfo.style.fontWeight = 'bold';
            bonusInfo.style.color = '#4CAF50';
            bonusInfo.textContent = 'Aktywny bonus: +10% ziarenek z ekspedycji';
            
            // Dodaj do ekranu ekspedycji
            const expeditionsInfo = document.querySelector('.expedition-info');
            if (expeditionsInfo) {
                expeditionsInfo.appendChild(bonusInfo);
            }
        } else {
            // Aktualizuj istniejący element
            bonusInfo.style.display = 'block';
        }
    },
    
    // Usunięcie informacji o bonusie z ekranu ekspedycji
    removeExpeditionBonusInfo: function() {
        console.log("Usuwanie informacji o bonusie ekspedycji");
        
        const bonusInfo = document.getElementById('expedition-bonus-info');
        if (bonusInfo) {
            bonusInfo.style.display = 'none';
        }
    },
    
    // Funkcja sprawdzająca czy skin daje bonus dla ekspedycji
    getExpeditionSeedsBonus: function() {
        // Odzyskaj skin z localStorage, jeśli gameState nie ma skinu
        if (!gameState.skins || !gameState.skins.currentSkin) {
            const savedSkin = localStorage.getItem('currentSkin');
            if (savedSkin && savedSkin === 'lesny') {
                return 0.1; // 10% bonus
            }
        } else if (gameState.skins && gameState.skins.currentSkin === 'lesny') {
            return 0.1; // 10% bonus
        }
        return 0; // Brak bonusu
    },
    
    // NOWA FUNKCJA: Przywrócenie stanu skinu po załadowaniu gry
    recoverSkinState: function() {
        console.log("Przywracanie stanu skinu z localStorage");
        
        // Sprawdź czy mamy zapisany skin w localStorage
        const savedSkin = localStorage.getItem('currentSkin');
        if (savedSkin) {
            // Przywróć skin do gameState
            if (!gameState.skins) {
                gameState.skins = {
                    currentSkin: savedSkin,
                    unlockedSkins: ["default", "lesny"]
                };
            } else {
                gameState.skins.currentSkin = savedSkin;
            }
            
            console.log("Przywrócono skin:", savedSkin);
            
            // Zapisz stan gry
            saveGame();
            
            // Zastosuj skin na wszystkich ekranach
            this.applySkinToAllScreens();
        }
    }
};

// Automatyczna inicjalizacja modułu po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        WardrobeModule.init();
        
        // Dodatkowe przywrócenie stanu skinu na wypadek, gdyby coś poszło nie tak
        WardrobeModule.recoverSkinState();
    }, 1000);
});

// Dodatkowe wywołanie setupEventListeners po pełnym załadowaniu dokumentu
window.addEventListener('load', function() {
    setTimeout(function() {
        WardrobeModule.setupEventListeners();
        
        // Dodatkowe przywrócenie stanu skinu
        WardrobeModule.recoverSkinState();
        
        // Zastosuj skiny na wszystkich ekranach
        WardrobeModule.applySkinToAllScreens();
    }, 2000);
});

// Dodatkowe nasłuchiwanie na zdarzenie gameLoaded
document.addEventListener('gameLoaded', function() {
    setTimeout(function() {
        WardrobeModule.setupEventListeners();
        
        // Dodatkowe przywrócenie stanu skinu
        WardrobeModule.recoverSkinState();
        
        // Zastosuj skiny na wszystkich ekranach
        WardrobeModule.applySkinToAllScreens();
    }, 2000);
});

// Nasłuchiwanie na zdarzenie aktualizacji UI dla innych ekranów
document.addEventListener('updateUI', function() {
    WardrobeModule.applySkinToAllScreens();
});

// Rozszerzamy funkcję aktualizacji UI hodowli, aby stosowała aktualny skin
const originalUpdatePetBirdUI = window.updatePetBirdUI || function() {};
window.updatePetBirdUI = function() {
    // Wywołaj oryginalną funkcję
    originalUpdatePetBirdUI.apply(this, arguments);
    
    // Zastosuj aktualny skin
    WardrobeModule.applySkinToAllScreens();
};

// DODANE: Przechwycenie oryginalnej funkcji saveGame
const originalSaveGame = window.saveGame || function() {};
window.saveGame = function() {
    // Wywołaj oryginalną funkcję
    originalSaveGame.apply(this, arguments);
    
    // Dodatkowo zapisz skin w localStorage
    if (gameState.skins && gameState.skins.currentSkin) {
        localStorage.setItem('currentSkin', gameState.skins.currentSkin);
    }
};

// DODANE: Przechwycenie oryginalnej funkcji loadGame
const originalLoadGame = window.loadGame || function() {};
window.loadGame = function() {
    // Wywołaj oryginalną funkcję
    originalLoadGame.apply(this, arguments);
    
    // Po załadowaniu gry przywróć stan skinu
    setTimeout(function() {
        WardrobeModule.recoverSkinState();
        WardrobeModule.applySkinToAllScreens();
    }, 500);
};

// Eksportuj moduł do globalnego zakresu
window.WardrobeModule = WardrobeModule;