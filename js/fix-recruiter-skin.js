// master-recruiter-fix.js - Kompleksowa naprawa odblokowania skina Master Recruiter
(function() {
    console.log("Inicjalizacja zaawansowanego systemu naprawy skina Master Recruiter");
    
    // NOWE: Najpierw usuń wszelkie istniejące przyciski naprawy
    function removeExistingFixButtons() {
        // Usuń przyciski z różnymi identyfikatorami, które mogą istnieć
        const buttonIds = [
            'fix-master-button', 
            'master-skin-fix-button', 
            'unlock-master-button',
            'fix-recruiter-button'
        ];
        
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                console.log(`Usuwam istniejący przycisk: ${id}`);
                button.remove();
            }
        });
        
        // Szukaj również przycisków po tekście
        document.querySelectorAll('button').forEach(button => {
            const text = button.textContent.toLowerCase();
            if (text.includes('fix master') || 
                text.includes('napraw skin') || 
                text.includes('odblokuj master') ||
                text.includes('master recruiter')) {
                console.log("Usuwam znaleziony przycisk naprawy");
                button.remove();
            }
        });
        
        // Dodatkowo usuń przyciski po stylach
        document.querySelectorAll('button').forEach(button => {
            const styles = window.getComputedStyle(button);
            if (styles.position === 'fixed' && 
                (styles.bottom === '10px' || styles.bottom === '15px') &&
                (styles.right === '10px' || styles.right === '15px')) {
                console.log("Usuwam przycisk naprawy po stylu");
                button.remove();
            }
        });
    }
    
    // Główna funkcja naprawiająca - wykonaj od razu i przy każdym załadowaniu ekranu
    function fixMasterRecruiterSkin() {
        console.log("Uruchamiam naprawę skina Master Recruiter");
        
        // Najpierw usuń przyciski
        removeExistingFixButtons();
        
        // 1. Upewnij się, że skin jest odblokowany w gameState
        ensureSkinUnlocked();
        
        // 2. Napraw wygląd skina w szafie
        fixSkinAppearance();
        
        // 3. Napraw przycisk wyboru skina
        fixSelectButton();
        
        console.log("Naprawa skina Master Recruiter zakończona");
    }
    
    // Funkcja upewniająca się, że skin jest odblokowany w danych gry
    function ensureSkinUnlocked() {
        if (!window.gameState) {
            console.error("Brak obiektu gameState - nie można naprawić skina");
            return;
        }
        
        // Upewnij się, że obiekt skins istnieje
        if (!window.gameState.skins) {
            window.gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default"]
            };
        }
        
        // Upewnij się, że tablica unlockedSkins istnieje
        if (!Array.isArray(window.gameState.skins.unlockedSkins)) {
            window.gameState.skins.unlockedSkins = ["default"];
        }
        
        // Dodaj skin rekrutera do odblokowanych skinów
        if (!window.gameState.skins.unlockedSkins.includes("master")) {
            window.gameState.skins.unlockedSkins.push("master");
            console.log("Dodano skin rekrutera do odblokowanych skinów");
        }
        
        // Upewnij się, że system poleceń zawiera odpowiednie dane
        if (!window.gameState.referral) {
            window.gameState.referral = {
                totalInvites: 100,
                specialSkins: [],
                rewardsClaimed: {}
            };
        }
        
        if (!window.gameState.referral.specialSkins) {
            window.gameState.referral.specialSkins = [];
        }
        
        if (!window.gameState.referral.specialSkins.includes("skin_recruiter")) {
            window.gameState.referral.specialSkins.push("skin_recruiter");
        }
        
        if (!window.gameState.referral.rewardsClaimed) {
            window.gameState.referral.rewardsClaimed = {};
        }
        
        window.gameState.referral.rewardsClaimed.tier100 = true;
        
        // Zapisz zmiany
        if (typeof window.saveGame === 'function') {
            window.saveGame();
            console.log("Zapisano stan gry z odblokowanym skinem Master Recruiter");
        }
    }
    
    // Funkcja naprawiająca wygląd skina w szafie
    function fixSkinAppearance() {
        // Znajdź element skina Master Recruiter
        const skinItems = document.querySelectorAll('.skin-item');
        
        skinItems.forEach(item => {
            const titleElement = item.querySelector('.skin-title');
            if (!titleElement) return;
            
            const title = titleElement.textContent;
            
            // Sprawdź czy to skin Master Recruiter
            if (title.includes('Master') || title.includes('Mistrz') || title.includes('rekrut')) {
                console.log("Naprawiam wygląd skina Master Recruiter");
                
                // Usuń klasę locked
                item.classList.remove('locked');
                
                // Przypisz ID skina, jeśli nie ma
                if (!item.hasAttribute('data-skin-id')) {
                    item.setAttribute('data-skin-id', 'master');
                }
                
                // Znajdź obrazek i usuń szarość
                const skinImage = item.querySelector('.skin-image img');
                if (skinImage) {
                    skinImage.style.filter = 'none';
                    skinImage.style.opacity = '1';
                }
                
                // Usuń ikony kłódki
                const lockIcons = item.querySelectorAll('.locked-badge');
                lockIcons.forEach(icon => icon.remove());
            }
        });
    }
    
    // Funkcja naprawiająca przycisk wyboru skina
    function fixSelectButton() {
        // Znajdź element skina Master Recruiter
        const skinItems = document.querySelectorAll('.skin-item');
        
        skinItems.forEach(item => {
            const titleElement = item.querySelector('.skin-title');
            if (!titleElement) return;
            
            const title = titleElement.textContent;
            
            // Sprawdź czy to skin Master Recruiter
            if (title.includes('Master') || title.includes('Mistrz') || title.includes('rekrut')) {
                const button = item.querySelector('button');
                if (!button) return;
                
                // Odblokuj przycisk
                button.disabled = false;
                button.classList.remove('locked');
                button.classList.remove('locked-button');
                
                // Ustaw styl przycisku
                button.style.backgroundColor = '#2196F3';
                button.style.color = 'white';
                button.style.cursor = 'pointer';
                button.style.opacity = '1';
                
                // Ustaw tekst przycisku w zależności od języka
                const currentLang = localStorage.getItem('gameLanguage') || 'pl';
                const isMasterSelected = window.gameState.skins && window.gameState.skins.currentSkin === 'master';
                
                if (isMasterSelected) {
                    // Jeśli skin jest już wybrany
                    button.textContent = currentLang === 'pl' ? 'Wybrany' : 'Selected';
                    button.style.backgroundColor = '#4CAF50';
                } else {
                    // Jeśli skin można wybrać
                    button.textContent = currentLang === 'pl' ? 'Wybierz' : 'Select';
                }
                
                // Dodaj event listener do przycisku
                button.onclick = function() {
                    // Zapobiegaj wielokrotnemu kliknięciu
                    if (this.getAttribute('data-processing') === 'true') return;
                    this.setAttribute('data-processing', 'true');
                    
                    console.log("Kliknięto przycisk wyboru skina Master Recruiter");
                    
                    // Ustaw skin jako aktualny
                    if (window.gameState && window.gameState.skins) {
                        window.gameState.skins.currentSkin = 'master';
                        
                        // Zapisz zmiany
                        if (typeof window.saveGame === 'function') {
                            window.saveGame();
                        }
                        
                        // Pokaż powiadomienie
                        if (typeof window.showNotification === 'function') {
                            const msg = currentLang === 'pl' ? 
                                "Wybrano skin Master Recruiter!" : 
                                "Master Recruiter skin selected!";
                            window.showNotification(msg);
                        }
                        
                        // Aktualizuj wygląd przycisku
                        this.textContent = currentLang === 'pl' ? 'Wybrany' : 'Selected';
                        this.style.backgroundColor = '#4CAF50';
                        
                        // Aktualizuj inne przyciski
                        document.querySelectorAll('.skin-select-button').forEach(btn => {
                            if (btn !== this) {
                                btn.textContent = currentLang === 'pl' ? 'Wybierz' : 'Select';
                                if (!btn.disabled) {
                                    btn.style.backgroundColor = '#2196F3';
                                }
                            }
                        });
                        
                        // Zastosuj skin na wszystkich ekranach
                        applySkinToScreens();
                    }
                    
                    // Usuń blokadę po 500ms
                    setTimeout(() => {
                        this.removeAttribute('data-processing');
                    }, 500);
                };
            }
        });
    }
    
    // Funkcja do zastosowania skina na wszystkich ekranach
    function applySkinToScreens() {
        console.log("Zastosowanie skina Master Recruiter na wszystkich ekranach");
        
        // 1. Ekran hodowli (breeding)
        const breedingBirdImage = document.getElementById('pet-bird-image');
        if (breedingBirdImage) {
            breedingBirdImage.style.backgroundImage = 'url(./assets/images/skins/master-skin.png)';
        }
        
        // 2. Ekran zabawy (play)
        const playBirdImage = document.getElementById('play-bird-image');
        if (playBirdImage) {
            playBirdImage.style.backgroundImage = 'url(./assets/images/skins/master-skin.png)';
        }
        
        // 3. Ekran przepustki nagród (reward-pass)
        const rewardPassBird = document.getElementById('reward-pass-bird');
        if (rewardPassBird) {
            rewardPassBird.style.backgroundImage = 'url(./assets/images/skins/master-skin.png)';
        }
        
        // 4. Ekran ekspedycji - obrazek latającego ptaka
        const flyingBird = document.querySelector('.flying-bird');
        if (flyingBird) {
            flyingBird.style.backgroundImage = 'url(./assets/images/skins/master-expedition.png)';
        }
    }
    
    // Dodaj style CSS, które wymuszą poprawny wygląd skina
    function addForcedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Style wymuszające odblokowanie skina Master Recruiter */
            .skin-item[data-skin-id="master"] .skin-image img,
            .skin-item:has(.skin-title:contains("Master")) .skin-image img,
            .skin-item:has(.skin-title:contains("Mistrz")) .skin-image img {
                filter: none !important;
                opacity: 1 !important;
            }
            
            .skin-item[data-skin-id="master"],
            .skin-item:has(.skin-title:contains("Master")),
            .skin-item:has(.skin-title:contains("Mistrz")) {
                opacity: 1 !important;
            }
            
            .skin-item[data-skin-id="master"] button,
            .skin-item:has(.skin-title:contains("Master")) button,
            .skin-item:has(.skin-title:contains("Mistrz")) button {
                background-color: #2196F3 !important;
                cursor: pointer !important;
                opacity: 1 !important;
                color: white !important;
                pointer-events: auto !important;
            }
            
            /* Ukryj wszelkie elementy blokady */
            .skin-item[data-skin-id="master"]::after,
            .skin-item:has(.skin-title:contains("Master"))::after,
            .skin-item:has(.skin-title:contains("Mistrz"))::after {
                display: none !important;
            }
            
            /* Ukryj wszystkie przyciski naprawy */
            #fix-master-button, 
            #master-skin-fix-button, 
            #unlock-master-button,
            #fix-recruiter-button {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ustaw obserwator MutationObserver, aby natychmiast naprawiać wszelkie zmiany
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            let needsFix = false;
            let buttonAdded = false;
            
            mutations.forEach(function(mutation) {
                // Sprawdź czy dodano przycisk naprawy
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'BUTTON' && 
                                (node.id === 'fix-master-button' || 
                                 node.id === 'master-skin-fix-button' ||
                                 node.id === 'unlock-master-button' ||
                                 node.id === 'fix-recruiter-button')) {
                                buttonAdded = true;
                            }
                        }
                    }
                }
                
                // Sprawdź czy zmieniono klasę skina Master Recruiter
                if (mutation.target && mutation.target.classList) {
                    const skinItem = mutation.target.closest('.skin-item');
                    if (skinItem) {
                        const title = skinItem.querySelector('.skin-title');
                        if (title && (title.textContent.includes('Master') || 
                                     title.textContent.includes('Mistrz') || 
                                     title.textContent.includes('rekrut'))) {
                            needsFix = true;
                        }
                    }
                }
            });
            
            // Usuń przycisk naprawy, jeśli został dodany
            if (buttonAdded) {
                removeExistingFixButtons();
            }
            
            // Napraw skin, jeśli potrzeba
            if (needsFix) {
                fixMasterRecruiterSkin();
            }
        });
        
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class', 'style', 'disabled']
        });
    }
    
    // Ustaw interwał, który będzie regularnie usuwał przycisk
    function setupButtonRemovalInterval() {
        // Usuń przyciski od razu
        removeExistingFixButtons();
        
        // Ustaw interwał, który będzie regularnie usuwał przycisk
        const buttonRemovalInterval = setInterval(removeExistingFixButtons, 2000);
        
        // Po 2 minutach zmniejsz częstotliwość usuwania do raz na 10 sekund
        setTimeout(() => {
            clearInterval(buttonRemovalInterval);
            setInterval(removeExistingFixButtons, 10000);
        }, 120000);
    }
    
    // Funkcje do wykonania przy inicjalizacji
    addForcedStyles();
    fixMasterRecruiterSkin();
    setupObserver();
    setupButtonRemovalInterval();
    
    // Uruchom naprawę po załadowaniu strony
    window.addEventListener('load', function() {
        removeExistingFixButtons();
        setTimeout(fixMasterRecruiterSkin, 500);
        setTimeout(fixMasterRecruiterSkin, 1500);
        setTimeout(removeExistingFixButtons, 2000);
    });
    
    // Uruchom naprawę przy każdej aktywacji ekranu szafy
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target && (target.classList.contains('wardrobe-button') || target.closest('.wardrobe-button'))) {
            removeExistingFixButtons();
            setTimeout(fixMasterRecruiterSkin, 200);
            setTimeout(fixMasterRecruiterSkin, 500);
            setTimeout(fixMasterRecruiterSkin, 1000);
            setTimeout(removeExistingFixButtons, 1200);
        }
    });
    
    // Uruchom naprawę przy każdej zmianie języka
    document.addEventListener('languageChanged', function() {
        removeExistingFixButtons();
        setTimeout(fixMasterRecruiterSkin, 300);
        setTimeout(removeExistingFixButtons, 500);
    });
    
    // Wystaw funkcje do globalnego zakresu
    window.MasterRecruiterFix = {
        fix: fixMasterRecruiterSkin,
        applySkin: applySkinToScreens,
        removeButtons: removeExistingFixButtons
    };
})();