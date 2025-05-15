// ===== SYSTEM SZAFY PTAKA =====
console.log("Inicjalizacja systemu szafy ptaka");

// Główny obiekt zarządzający szafą
const WardrobeModule = {
    // Inicjalizacja modułu
    init: function() {

        // Sprawdź czy trwa ekspedycja
        const isExpeditionActive = localStorage.getItem('isExpeditionActive') === 'true' || window.isExpeditionActive;
        if (isExpeditionActive) {
            console.log("Aktywna ekspedycja wykryta - blokuję zmianę skina");
            
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
            
            expeditionMessage.textContent = 'Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji.';
            expeditionMessage.style.display = 'block';
            
            // Zablokuj wszystkie przyciski wyboru skina
            const skinButtons = document.querySelectorAll('.skin-select-button');
            skinButtons.forEach(button => {
                if (!button.classList.contains('selected')) {
                    button.disabled = true;
                    button.style.backgroundColor = '#cccccc';
                    button.style.cursor = 'not-allowed';
                    button.style.opacity = '0.6';
                    button.textContent = 'Niedostępny';
                }
            });
        } else {
            console.log("Brak aktywnej ekspedycji - odblokowuję przyciski skina");
            
            // Usuń komunikat o ekspedycji jeśli istnieje
            const expeditionMessage = document.querySelector('.expedition-message');
            if (expeditionMessage) {
                expeditionMessage.style.display = 'none';
            }
            
            // Odblokuj wszystkie przyciski wyboru skina
            const skinButtons = document.querySelectorAll('.skin-select-button');
            skinButtons.forEach(button => {
                if (!button.classList.contains('selected')) {
                    button.disabled = false;
                    button.style.backgroundColor = '#2196F3';
                    button.style.cursor = 'pointer';
                    button.style.opacity = '1';
                    button.textContent = 'Wybierz';
                }
            });
        }
        // Najpierw sprawdź, czy istnieje komunikat o ekspedycji i usuń go
        const expeditionMessage = document.querySelector('.expedition-message');
        if (expeditionMessage) {
            expeditionMessage.style.display = 'none';
        }

        // Odblokuj wszystkie przyciski wyboru skina
        const skinButtons = document.querySelectorAll('.skin-select-button');
        skinButtons.forEach(button => {
            if (!button.classList.contains('selected')) {
                button.disabled = false;
                button.style.backgroundColor = '#2196F3';
                button.style.cursor = 'pointer';
                button.style.opacity = '1';
                button.textContent = 'Wybierz';
            }
        });

        console.log("Inicjalizacja modułu szafy ptaka");
        
        // Dodaj obiekt skinów do gameState, jeśli nie istnieje
        if (!gameState.skins) {
            gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default"] // ZMIANA: Usunięto "lesny" z domyślnych skinów
            };
            
            // Zapisz stan gry
            saveGame();
        }
        
        // Sprawdź czy gracz odblokował skin Master Recruiter
        if (gameState.referral && gameState.referral.totalInvites >= 100) {
            if (!gameState.skins.unlockedSkins.includes("master")) {
                gameState.skins.unlockedSkins.push("master");
                showNotification("Gratulacje! Odblokowałeś skin Master Recruiter!");
                saveGame();
            }
        }
        
        // Upewnij się, że wartości currentSkin i unlockedSkins istnieją i są poprawne
        if (!gameState.skins.currentSkin) {
            gameState.skins.currentSkin = "default";
        }
        
        if (!Array.isArray(gameState.skins.unlockedSkins) || gameState.skins.unlockedSkins.length === 0) {
            gameState.skins.unlockedSkins = ["default"]; // ZMIANA: Usunięto "lesny" z domyślnych skinów
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
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
            
            // Dodajemy nowy listener - ZAWSZE pozwalamy na otwarcie ekranu
            newButton.addEventListener('click', () => {
                console.log("Przycisk szafy kliknięty");
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
    
   // Zmodyfikuj funkcję showWardrobeScreen:
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
        
        // DODANE: Sprawdź, czy ekspedycja jest aktywna i zablokuj przyciski zmiany skina jeśli tak
        this.checkAndDisableSkinButtons();
    }
},
// NOWA FUNKCJA: Sprawdź i zablokuj przyciski zmiany skina
checkAndDisableSkinButtons: function() {
    console.log("Sprawdzanie, czy należy zablokować przyciski zmiany skina");
    
    // Sprawdź czy trwa ekspedycja - używaj różnych źródeł dla pewności
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
        
        expeditionMessage.textContent = 'Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji.';
        expeditionMessage.style.display = 'block';
        
        // Zablokuj wszystkie przyciski wyboru skina
        const skinButtons = document.querySelectorAll('.skin-select-button');
        skinButtons.forEach(button => {
            if (!button.classList.contains('selected')) {
                button.disabled = true;
                button.style.backgroundColor = '#cccccc';
                button.style.cursor = 'not-allowed';
                button.style.opacity = '0.6';
                button.textContent = 'Niedostępny';
            }
        });
    } else {
        // Usuń komunikat o ekspedycji jeśli istnieje
        const expeditionMessage = document.querySelector('.expedition-message');
        if (expeditionMessage) {
            expeditionMessage.style.display = 'none';
        }
        
        // Odblokuj wszystkie przyciski wyboru skina
        const skinButtons = document.querySelectorAll('.skin-select-button');
        skinButtons.forEach(button => {
            if (!button.classList.contains('selected')) {
                button.disabled = false;
                button.style.backgroundColor = '#2196F3';
                button.style.cursor = 'pointer';
                button.style.opacity = '1';
                button.textContent = 'Wybierz';
            }
        });
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
            
            // Sprawdź czy skin jest odblokowany
            const isUnlocked = gameState.skins.unlockedSkins && gameState.skins.unlockedSkins.includes(skinId);
            
            if (skinId === currentSkin) {
                // Ten skin jest wybrany
                item.style.border = '3px solid #4CAF50';
                item.classList.remove('locked');
                
                if (selectButton) {
                    selectButton.textContent = 'Wybrany';
                    selectButton.classList.add('selected');
                    selectButton.style.backgroundColor = '#4CAF50';
                    selectButton.disabled = false;
                }
            } else if (!isUnlocked) {
                // Ten skin jest zablokowany
                item.style.border = 'none';
                item.classList.add('locked');
                
                if (selectButton) {
                    selectButton.textContent = 'Zablokowany';
                    selectButton.classList.remove('selected');
                    selectButton.style.backgroundColor = '#666666';
                    selectButton.disabled = true;
                    selectButton.style.cursor = 'not-allowed';
                }
            } else {
                // Ten skin nie jest wybrany, ale jest odblokowany
                item.style.border = 'none';
                item.classList.remove('locked');
                
                if (selectButton) {
                    selectButton.textContent = 'Wybierz';
                    selectButton.classList.remove('selected');
                    selectButton.style.backgroundColor = '#2196F3';
                    selectButton.disabled = false;
                }
            }
        });
    },
    
    // Wybór skina
    selectSkin: function(skinId) {
        console.log("Wybór skina:", skinId);
        
        // Sprawdź czy skin jest odblokowany
        if (!gameState.skins.unlockedSkins.includes(skinId)) {
            console.log("Ten skin jest zablokowany");
            if (skinId === 'master') {
                showNotification("Musisz zaprosić 100 znajomych, aby odblokować skin Master Recruiter!");
            } else if (skinId === 'lesny') {
                showNotification("Osiągnij 1100m w ekspedycji, aby odblokować skin Leśnego Zwiadowcy!");
            }
            return;
        }
        
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
                unlockedSkins: ["default"]
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
        } else if (skinId === 'master') {
            showNotification("Wybrano skin Master Recruiter! Dumnie noś symbol mistrza rekrutacji!");
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
            } else if (skinId === 'master') {
                breedingBirdImage.style.backgroundImage = 'url(./assets/images/skins/master-skin.png)';
            }
        }
        
        // 2. Ekran zabawy (play)
        const playBirdImage = document.getElementById('play-bird-image');
        if (playBirdImage) {
            if (skinId === 'default') {
                playBirdImage.style.backgroundImage = 'url(./assets/images/bird-adult.png)';
            } else if (skinId === 'lesny') {
                playBirdImage.style.backgroundImage = 'url(./assets/images/skins/lesny-skin.png)';
            } else if (skinId === 'master') {
                playBirdImage.style.backgroundImage = 'url(./assets/images/skins/master-skin.png)';
            }
        }
        
        // 3. Ekran przepustki nagród (reward-pass)
        const rewardPassBird = document.getElementById('reward-pass-bird');
        if (rewardPassBird) {
            if (skinId === 'default') {
                rewardPassBird.style.backgroundImage = 'url(./assets/images/bird-adult-pass.png)';
            } else if (skinId === 'lesny') {
                rewardPassBird.style.backgroundImage = 'url(./assets/images/skins/lesny-skin.png)';
            } else if (skinId === 'master') {
                rewardPassBird.style.backgroundImage = 'url(./assets/images/skins/master-skin.png)';
            }
        }
        
        // 4. Ekran ekspedycji - obrazek latającego ptaka
        const flyingBird = document.querySelector('.flying-bird');
        if (flyingBird) {
            if (skinId === 'default') {
                flyingBird.style.backgroundImage = 'url(./assets/images/forest-expedition.png)';
            } else if (skinId === 'lesny') {
                flyingBird.style.backgroundImage = 'url(./assets/images/skins/lesny-expedition.png)';
            } else if (skinId === 'master') {
                flyingBird.style.backgroundImage = 'url(./assets/images/skins/master-expedition.png)';
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
                    unlockedSkins: ["default"]
                };
            } else {
                gameState.skins.currentSkin = savedSkin;
            }
            
            console.log("Przywrócono skin:", savedSkin);
            
            // Sprawdź czy gracz ma odblokowany skin Master Recruiter
            if (gameState.referral && gameState.referral.totalInvites >= 100) {
                if (!gameState.skins.unlockedSkins.includes("master")) {
                    gameState.skins.unlockedSkins.push("master");
                }
            }
            
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

// Dodatkowe wywołania funkcji sprawdzania stanu ekspedycji
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (WardrobeModule && typeof WardrobeModule.checkAndDisableSkinButtons === 'function') {
            WardrobeModule.checkAndDisableSkinButtons();
        }
    }, 1500);
});

document.addEventListener('gameLoaded', function() {
    setTimeout(function() {
        if (WardrobeModule && typeof WardrobeModule.checkAndDisableSkinButtons === 'function') {
            WardrobeModule.checkAndDisableSkinButtons();
        }
    }, 1000);
});

// Eksportuj moduł do globalnego zakresu
window.WardrobeModule = WardrobeModule;