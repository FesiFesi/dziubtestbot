// ===== SYSTEM SZAFY PTAKA - WERSJA UPROSZCZONA =====
console.log("Inicjalizacja systemu szafy ptaka");

// Główny obiekt zarządzający szafą
const WardrobeModule = {
    // Inicjalizacja modułu
    init: function() {
        console.log("Inicjalizacja modułu szafy");
        
        // Dodaj obiekt skinów do gameState, jeśli nie istnieje
        if (!gameState.skins) {
            gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default"]
            };
            saveGame();
        }
        
        // Upewnij się, że wartości currentSkin i unlockedSkins istnieją i są poprawne
        if (!gameState.skins.currentSkin) {
            gameState.skins.currentSkin = "default";
        }
        
        if (!Array.isArray(gameState.skins.unlockedSkins) || gameState.skins.unlockedSkins.length === 0) {
            gameState.skins.unlockedSkins = ["default"];
        }
        
        // Dodaj dodatkowy zapis dla bezpieczeństwa
        localStorage.setItem('currentSkin', gameState.skins.currentSkin);
        
        // Dodaj style CSS
        this.addWardrobeStyles();
        
        // Ustaw listenery zdarzeń
        this.setupEventListeners();
        
        // Zastosuj aktualny skin na wszystkich ekranach
        this.applySkinToAllScreens();
        
        // Ustaw obserwowanie zmian ekranów
        this.setupScreenChangeObserver();
    },
    
    addWardrobeStyles: function() {
        const styles = document.createElement('style');
        styles.innerHTML = `
            .wardrobe-button {
                position: fixed;
                top: 136px;
                right: 15px;
                width: 50px;
                height: 50px;
                background-color: #43b5e2;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                z-index: 1000;
                border: 2px solid #FFC107;
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

            /* Style dla obrazków skinów */
            .skin-item.locked .skin-image img {
                filter: grayscale(100%);
                opacity: 0.6;
                transition: filter 0.3s, opacity 0.3s;
            }

            .skin-item:not(.locked) .skin-image img {
                filter: none;
                opacity: 1;
                transition: filter 0.3s, opacity 0.3s;
            }
            
            .skin-item {
                transition: transform 0.2s, box-shadow 0.2s;
                position: relative;
            }
            
            .skin-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
            }
            
            .skin-item.locked {
                opacity: 0.7;
                position: relative;
            }
            
            .skin-item.locked::after {
                content: "🔒";
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 24px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            
            .skin-select-button {
                transition: background-color 0.2s;
            }
            
            .skin-select-button:hover {
                opacity: 0.9;
            }
            
            .skin-select-button:disabled {
                background-color: #666666 !important;
                cursor: not-allowed !important;
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
    
    // Ustawienie obserwatora zmian ekranów
    setupScreenChangeObserver: function() {
        console.log("Ustawianie obserwatora zmian ekranów");
        
        // Obserwuj wszystkie ekrany gry
        const gameScreens = document.querySelectorAll('.game-screen');
        gameScreens.forEach(screen => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isActive = screen.classList.contains('active');
                        if (isActive) {
                            console.log(`Ekran ${screen.id} został aktywowany - aktualizuję skin`);
                            setTimeout(() => {
                                this.applySkinToAllScreens();
                            }, 50);
                        }
                    }
                });
            });
            
            observer.observe(screen, { attributes: true });
        });
    },
    
    // Ustawienie obsługi zdarzeń
    setupEventListeners: function() {
        console.log("Ustawianie listenerów dla szafy ptaka");
        
        // Przyciski otwierania szafy
        const wardrobeButtons = document.querySelectorAll('.wardrobe-button');
        if (wardrobeButtons.length > 0) {
            wardrobeButtons.forEach(button => {
                // Usuwamy istniejące listenery przez klonowanie
                const newButton = button.cloneNode(true);
                if (button.parentNode) {
                    button.parentNode.replaceChild(newButton, button);
                }
                
                // Dodajemy nowy listener
                newButton.addEventListener('click', () => {
                    console.log("Przycisk szafy kliknięty");
                    this.showWardrobeScreen();
                });
            });
        }
        
        // Przycisk powrotu
        this.setupBackButton();
        
        // KLUCZOWE: Przyciski wyboru skinów obsługiwane przez WardrobeModule
        this.setupSkinSelectionButtons();
    },
    
    // NOWA FUNKCJA: Konfiguracja przycisków wyboru skinów
    setupSkinSelectionButtons: function() {
        console.log("Konfiguracja przycisków wyboru skinów w WardrobeModule");
        
        // Obserwator dla nowych przycisków skinów
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('skin-select-button')) {
                            this.setupSingleSkinButton(node);
                        }
                        
                        // Sprawdź też dzieci nowego węzła
                        if (node.querySelectorAll) {
                            const skinButtons = node.querySelectorAll('.skin-select-button');
                            skinButtons.forEach(button => this.setupSingleSkinButton(button));
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Skonfiguruj istniejące przyciski
        document.querySelectorAll('.skin-select-button').forEach(button => {
            this.setupSingleSkinButton(button);
        });
    },
    
    // NOWA FUNKCJA: Konfiguracja pojedynczego przycisku skina
    setupSingleSkinButton: function(button) {
        if (button.hasWardrobeListener) return; // Unikaj duplikowania listenerów
        
        const skinId = button.getAttribute('data-skin-id') || 
                       button.closest('.skin-item')?.getAttribute('data-skin-id');
        
        if (!skinId) return;
        
        console.log("Konfiguracja przycisku dla skina:", skinId);
        
        // Usuń poprzedni listener (jeśli istnieje)
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Dodaj nowy listener
        newButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("WardrobeModule: Kliknięto przycisk skina:", skinId);
            this.selectSkin(skinId);
        });
        
        newButton.hasWardrobeListener = true;
    },
    
    // Ustawienie przycisku powrotu
    setupBackButton: function() {
        console.log("Konfiguracja przycisku powrotu z szafy");
        
        const backButton = document.getElementById('wardrobe-back-button');
        if (!backButton) {
            console.error("Przycisk powrotu nie znaleziony!");
            return;
        }
        
        // Usuń stare event listenery
        const newBackButton = backButton.cloneNode(true);
        if (backButton.parentNode) {
            backButton.parentNode.replaceChild(newBackButton, backButton);
        }
        
        const self = this;
        newBackButton.addEventListener('click', function(e) {
            console.log("Przycisk powrotu kliknięty");
            e.preventDefault();
            e.stopPropagation();
            self.hideWardrobeScreen();
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
            
            // Upewnij się, że przycisk powrotu jest widoczny i działa
            const backButton = document.getElementById('wardrobe-back-button');
            if (backButton) {
                backButton.style.display = 'block';
                this.setupBackButton();
            }
            
            // Aktualizuj UI skinów
            setTimeout(() => {
                this.updateBirdPreview();
                this.updateSkinsUIState();
                this.checkAndDisableSkinButtons();
                
                // Wywołaj system skinów jeśli istnieje
                if (window.SkinsSystem && typeof window.SkinsSystem.updateSkinsDisplay === 'function') {
                    window.SkinsSystem.updateSkinsDisplay();
                }
            }, 100);
        }
    },
    
    // Sprawdź i zablokuj przyciski zmiany skina podczas ekspedycji
    checkAndDisableSkinButtons: function() {
        console.log("Sprawdzanie, czy należy zablokować przyciski zmiany skina");
        
        // Sprawdź czy trwa ekspedycja
        const isActive = (
            localStorage.getItem('isExpeditionActive') === 'true' || 
            window.isExpeditionActive === true || 
            localStorage.getItem('activeExpedition') !== null
        );
        
        console.log("Status ekspedycji:", isActive ? "Aktywna" : "Nieaktywna");
        
        if (isActive) {
            // Dodaj komunikat o trwającej ekspedycji
            let expeditionMessage = document.querySelector('.expedition-message');
            if (!expeditionMessage) {
                expeditionMessage = document.createElement('div');
                expeditionMessage.className = 'expedition-message';
                expeditionMessage.style.backgroundColor = 'rgba(255, 87, 34, 0.9)';
                expeditionMessage.style.color = 'white';
                expeditionMessage.style.padding = '15px';
                expeditionMessage.style.borderRadius = '10px';
                expeditionMessage.style.textAlign = 'center';
                expeditionMessage.style.fontWeight = 'bold';
                expeditionMessage.style.margin = '15px 0';
                expeditionMessage.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
                
                const wardrobe = document.querySelector('.wardrobe-container');
                if (wardrobe) {
                    wardrobe.insertBefore(expeditionMessage, wardrobe.firstChild);
                }
            }
            
            // Użyj tłumaczenia dla komunikatu o ekspedycji
            expeditionMessage.textContent = window.t ? window.t('wardrobe.notifications.expeditionActive') : "Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji.";
            expeditionMessage.style.display = 'block';
            
            // Zablokuj wszystkie przyciski wyboru skina
            const skinButtons = document.querySelectorAll('.skin-select-button');
            skinButtons.forEach(button => {
                if (!button.classList.contains('selected')) {
                    button.disabled = true;
                    button.style.backgroundColor = '#cccccc';
                    button.style.cursor = 'not-allowed';
                    button.style.opacity = '0.6';
                    button.textContent = window.t ? window.t('wardrobe.buttons.unavailable') : "Niedostępny";
                }
            });
        } else {
            // Usuń komunikat o ekspedycji jeśli istnieje
            const expeditionMessage = document.querySelector('.expedition-message');
            if (expeditionMessage) {
                expeditionMessage.style.display = 'none';
            }
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
        
        // Sprawdź, czy powinniśmy wrócić do ekspedycji
        if (window.expeditionTemporarilyHidden && typeof window.returnToExpeditionScreen === 'function') {
            window.returnToExpeditionScreen();
        } else {
            // Pokaż ekran hodowli
            const breedingScreen = document.getElementById('breeding-screen');
            if (breedingScreen) {
                breedingScreen.classList.add('active');
                
                // Upewnij się, że skin jest zastosowany po powrocie
                setTimeout(() => {
                    this.applySkinToAllScreens();
                }, 50);
            }
        }
    },
    
    // Aktualizacja podglądu ptaka z aktualnym skinem
    updateBirdPreview: function() {
        console.log("Aktualizacja podglądu ptaka w szafie");
        
        const birdImage = document.getElementById('wardrobe-bird-image');
        if (!birdImage) return;
        
        // Odzyskaj skin z localStorage, jeśli gameState nie ma skina
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
            const stage = gameState.petBird.stage || 'egg';
            
            if (stage === 'adult') {
                // Jeśli ptak jest dorosły, pokaż aktywny skin
                const skinId = gameState.skins?.currentSkin || 'default';
                if (skinId === 'default') {
                    birdImage.src = 'assets/images/bird-adult.png';
                } else if (skinId === 'lesny') {
                    birdImage.src = 'assets/images/skins/lesny-skin.png';
                } else if (skinId === 'master') {
                    birdImage.src = 'assets/images/skins/master-skin.png';
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
        console.log("Aktualizacja stanu UI skinów w WardrobeModule");
        
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
        
        const currentSkin = gameState.skins?.currentSkin || 'default';
        
        document.querySelectorAll('.skin-item').forEach(item => {
            const skinId = item.getAttribute('data-skin-id');
            const selectButton = item.querySelector('.skin-select-button');
            const skinImage = item.querySelector('.skin-image img');
            
            const isUnlocked = gameState.skins.unlockedSkins && gameState.skins.unlockedSkins.includes(skinId);
            
            if (skinId === currentSkin) {
                // Ten skin jest wybrany
                item.style.border = '3px solid #4CAF50';
                item.classList.remove('locked');
                
                if (skinImage) {
                    skinImage.style.filter = 'none';
                    skinImage.style.opacity = '1';
                }
                
                if (selectButton) {
                    selectButton.textContent = window.t ? window.t('wardrobe.buttons.selected') : 'Wybrany';
                    selectButton.classList.add('selected');
                    selectButton.style.backgroundColor = '#4CAF50';
                    selectButton.disabled = false;
                }
            } else if (!isUnlocked) {
                // Ten skin jest zablokowany
                item.style.border = 'none';
                item.classList.add('locked');
                
                if (skinImage) {
                    skinImage.style.filter = 'grayscale(100%)';
                    skinImage.style.opacity = '0.5';
                }
                
                if (selectButton) {
                    selectButton.textContent = window.t ? window.t('wardrobe.buttons.locked') : 'Zablokowany';
                    selectButton.classList.remove('selected');
                    selectButton.style.backgroundColor = '#666666';
                    selectButton.disabled = true;
                    selectButton.style.cursor = 'not-allowed';
                }
            } else {
                // Ten skin nie jest wybrany, ale jest odblokowany
                item.style.border = 'none';
                item.classList.remove('locked');
                
                if (skinImage) {
                    skinImage.style.filter = 'none';
                    skinImage.style.opacity = '1';
                }
                
                if (selectButton) {
                    selectButton.textContent = window.t ? window.t('wardrobe.buttons.select') : 'Wybierz';
                    selectButton.classList.remove('selected');
                    selectButton.style.backgroundColor = '#2196F3';
                    selectButton.disabled = false;
                }
            }
        });
    },
    
    // GŁÓWNA FUNKCJA: Wybór skina
    selectSkin: function(skinId) {
        console.log("WardrobeModule: Wybór skina:", skinId);
        
        // Sprawdź czy skin jest odblokowany
        if (!gameState.skins.unlockedSkins.includes(skinId)) {
            console.log("Ten skin jest zablokowany");
            if (skinId === 'master') {
                showNotification(window.t ? window.t('wardrobe.notifications.masterSkinRequirement') : "Odblokuj ten skin zapraszając 100 znajomych!");
            } else if (skinId === 'lesny') {
                showNotification(window.t ? window.t('wardrobe.notifications.forestSkinRequirement') : "Odblokuj ten skin osiągając 1100m dystansu w przepustce nagród!");
            }
            return;
        }
        
        // Sprawdź czy ptak istnieje i jest dorosły
        if (!gameState.petBird || !gameState.petBird.exists || gameState.petBird.stage !== 'adult') {
            showNotification(window.t ? window.t('wardrobe.notifications.adultBirdRequired') : "Możesz zmieniać skiny tylko gdy ptak jest dorosły!");
            return;
        }
        
        // Ustaw nowy skin
        const previousSkin = gameState.skins.currentSkin;
        gameState.skins.currentSkin = skinId;
        localStorage.setItem('currentSkin', skinId);
        
     // Zapisz stan gry
saveGame();

// DODATKOWE ZABEZPIECZENIE: Upewnij się, że skin zostanie zapisany w localStorage
localStorage.setItem('currentSkin', skinId);
console.log("Zapisano skin w localStorage:", skinId);
        
        // KLUCZOWE: Natychmiast zastosuj grafikę
        this.applySkinToAllScreens();
        
        // Aktualizuj UI
        this.updateSkinsUIState();
        this.updateBirdPreview();
        
        // Pokaż powiadomienie
        if (skinId === 'default') {
            showNotification(window.t ? window.t('wardrobe.notifications.defaultSkinSelected') : "Wybrano domyślny skin!");
        } else if (skinId === 'lesny') {
            showNotification(window.t ? window.t('wardrobe.notifications.forestSkinSelected') : "Wybrano skin Leśny Zwiadowca! +10% ziarenek z ekspedycji!");
        } else if (skinId === 'master') {
            showNotification(window.t ? window.t('wardrobe.notifications.masterSkinSelected') : "Wybrano skin Master Recruiter!");
        }
        
        // Aktualizuj wszystkie przyciski
        document.querySelectorAll('.skin-select-button').forEach(btn => {
            const btnSkinId = btn.getAttribute('data-skin-id') || 
                              btn.closest('.skin-item')?.getAttribute('data-skin-id');
            
            if (btnSkinId === skinId) {
                btn.textContent = window.t ? window.t('wardrobe.buttons.selected') : 'Wybrany';
                btn.style.backgroundColor = '#4CAF50';
                btn.classList.add('selected');
            } else if (!btn.disabled) {
                btn.textContent = window.t ? window.t('wardrobe.buttons.select') : 'Wybierz';
                btn.style.backgroundColor = '#2196F3';
                btn.classList.remove('selected');
            }
        });
        
        console.log("Zmieniono skin z", previousSkin, "na", skinId);
    },
    
    // KLUCZOWA FUNKCJA: Zastosowanie aktualnego skina na wszystkich ekranach
    applySkinToAllScreens: function() {
        console.log("WardrobeModule: Zastosowanie aktualnego skina na wszystkich ekranach");
        
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
        
        const skinId = gameState.skins?.currentSkin || 'default';
        console.log("Aktualny skin do zastosowania:", skinId);
        
        // Sprawdź czy ptak istnieje i jest dorosły
        if (!gameState.petBird || !gameState.petBird.exists || gameState.petBird.stage !== 'adult') {
            console.log("Ptak nie jest dorosły, nie stosuję skina");
            return;
        }
        
        // Przygotuj ścieżki do grafik skina
        let skinImagePath = '';
        let skinExpeditionPath = '';
        
        switch(skinId) {
            case 'default':
                skinImagePath = './assets/images/bird-adult.png';
                skinExpeditionPath = './assets/images/forest-expedition.png';
                break;
            case 'lesny':
                skinImagePath = './assets/images/skins/lesny-skin.png';
                skinExpeditionPath = './assets/images/skins/lesny-expedition.png';
                break;
            case 'master':
                skinImagePath = './assets/images/skins/master-skin.png';
                skinExpeditionPath = './assets/images/skins/master-expedition.png';
                break;
            default:
                skinImagePath = './assets/images/bird-adult.png';
                skinExpeditionPath = './assets/images/forest-expedition.png';
        }
        
        console.log("Aplikuję grafiki skina:", skinImagePath);
        
        // Aktualizuj grafiki na wszystkich ekranach
        const breedingBirdImage = document.getElementById('pet-bird-image');
        if (breedingBirdImage) {
            breedingBirdImage.style.backgroundImage = `url(${skinImagePath})`;
            console.log("Zaktualizowano obrazek hodowli");
        }
        
        const playBirdImage = document.getElementById('play-bird-image');
        if (playBirdImage) {
            playBirdImage.style.backgroundImage = `url(${skinImagePath})`;
            console.log("Zaktualizowano obrazek zabawy");
        }
        
        const rewardPassBird = document.getElementById('reward-pass-bird');
        if (rewardPassBird) {
            if (skinId === 'default') {
                rewardPassBird.style.backgroundImage = 'url(./assets/images/bird-adult-pass.png)';
            } else {
                rewardPassBird.style.backgroundImage = `url(${skinImagePath})`;
            }
            console.log("Zaktualizowano obrazek przepustki nagród");
        }
        
        const flyingBird = document.querySelector('.flying-bird');
        if (flyingBird) {
            flyingBird.style.backgroundImage = `url(${skinExpeditionPath})`;
            console.log("Zaktualizowano obrazek ekspedycji");
        }
        
        const wardrobeBirdImage = document.getElementById('wardrobe-bird-image');
        if (wardrobeBirdImage) {
            wardrobeBirdImage.src = skinImagePath;
            console.log("Zaktualizowano obrazek szafy");
        }
        
        // NOWE: Wywołaj także alternatywną funkcję z skin-grayscale.js
        if (window.applySelectedSkin && typeof window.applySelectedSkin === 'function') {
            window.applySelectedSkin(skinId);
        }
    },
    
    // Funkcja sprawdzająca czy skin daje bonus dla ekspedycji
    getExpeditionSeedsBonus: function() {
        const currentSkin = gameState.skins?.currentSkin;
        if (currentSkin === 'lesny') {
            return 0.1; // 10% bonus za skin Leśnego Zwiadowcy
        }
        return 0;
    },
    
    // Przywrócenie stanu skinu po załadowaniu gry
    recoverSkinState: function() {
        console.log("Przywracanie stanu skinu z localStorage");
        
        const savedSkin = localStorage.getItem('currentSkin');
        if (savedSkin) {
            if (!gameState.skins) {
                gameState.skins = {
                    currentSkin: savedSkin,
                    unlockedSkins: ["default"]
                };
            } else {
                gameState.skins.currentSkin = savedSkin;
            }
            
            console.log("Przywrócono skin:", savedSkin);
            saveGame();
            
            this.applySkinToAllScreens();
        }
    }
};

// Globalne funkcje pomocnicze
function fixExpeditionButtons() {
    console.log("Wykonuję naprawę przycisków ekspedycji...");
    
    const isExpeditionActive = (
        localStorage.getItem('isExpeditionActive') === 'true' || 
        window.isExpeditionActive === true || 
        localStorage.getItem('activeExpedition') !== null
    );
    
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent === 'activeExpedition.skinUnavailable') {
            button.textContent = window.t ? window.t('wardrobe.buttons.unavailable') : "Niedostępny";
        }
    });
    
    document.querySelectorAll('.skin-select-button').forEach(button => {
        if (button.disabled && isExpeditionActive) {
            if (button.textContent === 'activeExpedition.skinUnavailable' || 
                button.textContent === 'wardrobe.buttons.unavailable' ||
                button.textContent.trim() === '') {
                
                button.textContent = window.t ? window.t('wardrobe.buttons.unavailable') : "Niedostępny";
            }
        } else if (!button.classList.contains('selected')) {
            button.textContent = window.t ? window.t('wardrobe.buttons.select') : "Wybierz";
        }
    });
}

function updateWardrobeTexts() {
    console.log("Aktualizacja tekstów w szafie po zmianie języka");
    
    const isExpeditionActive = (
        localStorage.getItem('isExpeditionActive') === 'true' || 
        window.isExpeditionActive === true || 
        localStorage.getItem('activeExpedition') !== null
    );
    
    const expeditionMessage = document.querySelector('.expedition-message');
    if (expeditionMessage && isExpeditionActive) {
        expeditionMessage.textContent = window.t ? window.t('wardrobe.notifications.expeditionActive') : "Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji.";
    }
    
    document.querySelectorAll('.skin-select-button').forEach(button => {
        if (button.disabled && isExpeditionActive) {
            button.textContent = window.t ? window.t('wardrobe.buttons.unavailable') : "Niedostępny";
        } else if (button.classList.contains('selected')) {
            button.textContent = window.t ? window.t('wardrobe.buttons.selected') : "Wybrany";
        } else if (!button.disabled) {
            button.textContent = window.t ? window.t('wardrobe.buttons.select') : "Wybierz";
        }
    });
}

// Nasłuchiwanie na zdarzenie zmiany języka
document.addEventListener('languageChanged', function() {
    console.log("Wykryto zmianę języka w module szafy");
    setTimeout(() => {
        updateWardrobeTexts();
        fixExpeditionButtons();
        
        // Jeśli ekran szafy jest aktywny, odśwież UI
        const wardrobeScreen = document.getElementById('wardrobe-screen');
        if (wardrobeScreen && wardrobeScreen.classList.contains('active')) {
            WardrobeModule.updateSkinsUIState();
            WardrobeModule.checkAndDisableSkinButtons();
        }
    }, 100);
});

// Globalne obsługi zdarzeń
document.addEventListener('click', function(e) {
    const target = e.target;
    if (target && target.id === 'wardrobe-back-button') {
        console.log("Wykryto kliknięcie przycisku powrotu (globalny handler)");
        const wardrobeScreen = document.getElementById('wardrobe-screen');
        if (wardrobeScreen && wardrobeScreen.classList.contains('active')) {
            wardrobeScreen.classList.remove('active');
            
            const breedingScreen = document.getElementById('breeding-screen');
            if (breedingScreen) {
                breedingScreen.classList.add('active');
                
                setTimeout(function() {
                    WardrobeModule.applySkinToAllScreens();
                }, 50);
            }
        }
    }
});

// Automatyczna inicjalizacja modułu
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        WardrobeModule.init();
        WardrobeModule.recoverSkinState();
        fixExpeditionButtons();
        updateWardrobeTexts();
    }, 1000);
});

window.addEventListener('load', function() {
    setTimeout(function() {
        WardrobeModule.setupEventListeners();
        WardrobeModule.recoverSkinState();
        WardrobeModule.applySkinToAllScreens();
        fixExpeditionButtons();
        updateWardrobeTexts();
    }, 2000);
});

document.addEventListener('gameLoaded', function() {
    setTimeout(function() {
        WardrobeModule.setupEventListeners();
        WardrobeModule.recoverSkinState();
        WardrobeModule.applySkinToAllScreens();
        fixExpeditionButtons();
        updateWardrobeTexts();
    }, 2000);
});

// Eksportuj moduł do globalnego zakresu
window.WardrobeModule = WardrobeModule;
window.updateWardrobeTexts = updateWardrobeTexts;
window.fixExpeditionButtons = fixExpeditionButtons;