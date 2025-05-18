// skin-grayscale-replacement.js - Zastępuje oryginalny skin-grayscale.js z naprawą dla Master Recruiter
(function() {
    console.log("Inicjalizacja zastępczego modułu wyszarzania skinów");

    // Funkcja do wyszarzania obrazków i przycisków niedostępnych skinów (z wyjątkiem Master Recruiter)
    function grayscaleLockedSkins() {
        // Znajdź wszystkie elementy skinów
        const skinItems = document.querySelectorAll('.skin-item');
        console.log(`Znaleziono ${skinItems.length} elementów skinów`);
        
        // Dla każdego skina
        skinItems.forEach(skinItem => {
            // Znajdź button
            const button = skinItem.querySelector('button');
            if (!button) return;
            
            // Sprawdź, czy to Master Recruiter
            const title = skinItem.querySelector('.skin-title');
            const isMasterRecruiter = title && (title.textContent.includes('Master') || 
                                          title.textContent.includes('Mistrz') || 
                                          title.textContent.includes('rekrut'));
            
            // Jeśli to Master Recruiter, zawsze go odblokuj
            if (isMasterRecruiter) {
                // Odblokuj przycisk
                button.disabled = false;
                button.textContent = localStorage.getItem('gameLanguage') === 'en' ? 'Select' : 'Wybierz';
                button.style.backgroundColor = '#2196F3';
                button.style.cursor = 'pointer';
                button.style.opacity = '1';
                
                // Odblokuj obrazek
                const img = skinItem.querySelector('.skin-image img');
                if (img) {
                    img.style.filter = 'none';
                    img.style.opacity = '1';
                }
                
                // Upewnij się, że skin jest odblokowany w gameState
                if (window.gameState) {
                    if (!window.gameState.skins) {
                        window.gameState.skins = {
                            currentSkin: "default",
                            unlockedSkins: ["default", "master"]
                        };
                    } else if (!window.gameState.skins.unlockedSkins.includes("master")) {
                        window.gameState.skins.unlockedSkins.push("master");
                    }
                    
                    if (typeof window.saveGame === 'function') {
                        window.saveGame();
                    }
                }
                
                // Usuń klasę locked
                skinItem.classList.remove('locked');
                
                // Dodaj onClick handler
                button.onclick = function() {
                    if (window.gameState && window.gameState.skins) {
                        window.gameState.skins.currentSkin = "master";
                        
                        if (typeof window.saveGame === 'function') {
                            window.saveGame();
                        }
                        
                        // Pokaż powiadomienie
                        if (typeof window.showNotification === 'function') {
                            const msg = localStorage.getItem('gameLanguage') === 'en' ? 
                                "Master Recruiter skin selected!" : 
                                "Wybrano skin Master Recruiter!";
                            window.showNotification(msg);
                        }
                        
                        // Aktualizuj wygląd przycisków
                        document.querySelectorAll('.skin-select-button').forEach(btn => {
                            if (btn === this) {
                                btn.textContent = localStorage.getItem('gameLanguage') === 'en' ? 'Selected' : 'Wybrany';
                                btn.style.backgroundColor = '#4CAF50';
                            } else {
                                btn.textContent = localStorage.getItem('gameLanguage') === 'en' ? 'Select' : 'Wybierz';
                                btn.style.backgroundColor = '#2196F3';
                            }
                        });
                        
                        // Zastosuj skin na wszystkich ekranach
                        applyMasterSkin();
                    }
                };
                
                return; // Przerwij przetwarzanie tego skina
            }
            
            // Dla pozostałych skinów - standardowa logika
            // Sprawdź, czy skin jest zablokowany
            const isLocked = button.textContent === 'Zablokowany' || 
                            button.textContent === 'Locked' ||
                            button.style.backgroundColor === 'rgb(102, 102, 102)' ||
                            button.disabled;
            
            // Znajdź bezpośrednio obraz
            let img = skinItem.querySelector('img');
            
            if (isLocked) {
                // Wyszarz obrazek
                if (img) {
                    img.style.filter = 'grayscale(100%)';
                    img.style.opacity = '0.5';
                }
                
                // Wyszarz przycisk - upewnij się, że jest szary
                button.style.backgroundColor = '#666666';
                button.style.cursor = 'not-allowed';
                button.disabled = true;
                
                // Upewnij się, że tekst na przycisku to "Zablokowany" lub "Locked"
                if (document.documentElement.lang === 'en' || 
                    localStorage.getItem('gameLanguage') === 'en') {
                    button.textContent = 'Locked';
                } else {
                    button.textContent = 'Zablokowany';
                }
                
                console.log("Wyszarzono obrazek i przycisk zablokowanego skina");
            } else {
                // Upewnij się, że odblokowane skiny mają normalne kolory
                if (img) {
                    img.style.filter = 'none';
                    img.style.opacity = '1';
                }
                
                // Sprawdź, czy przycisk jest wybrany
                const isSelected = button.textContent === 'Wybrany' || 
                                  button.textContent === 'Selected';
                
                // Jeśli przycisk nie jest wybrany, upewnij się, że ma niebieski kolor
                if (!isSelected) {
                    button.style.backgroundColor = '#2196F3';
                    button.style.cursor = 'pointer';
                    button.disabled = false;
                    
                    // Ustaw odpowiedni tekst na przycisku
                    if (document.documentElement.lang === 'en' || 
                        localStorage.getItem('gameLanguage') === 'en') {
                        button.textContent = 'Select';
                    } else {
                        button.textContent = 'Wybierz';
                    }
                }
            }
        });
    }

    // Funkcja zastosowująca skin Master Recruiter na wszystkich ekranach
    function applyMasterSkin() {
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

    // Uruchamiaj funkcję regularnie, aby obsługiwać dynamicznie ładowane elementy
    function startGrayscaleInterval() {
        // Natychmiast uruchom raz
        grayscaleLockedSkins();
        
        // Następnie uruchamiaj w regularnych odstępach
        setInterval(grayscaleLockedSkins, 5000);
        console.log("Uruchomiono interwał wyszarzania skinów");
    }

    // Uruchom po załadowaniu DOMu
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', startGrayscaleInterval);
    } else {
        startGrayscaleInterval();
    }

    // Dodatkowe nasłuchiwanie na otwarcie szafy
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('wardrobe-button') || 
            e.target.closest('.wardrobe-button')) {
            console.log("Wykryto kliknięcie przycisku szafy");
            
            // Uruchom wyszarzanie z opóźnieniem, aby DOM miał czas się załadować
            setTimeout(grayscaleLockedSkins, 300);
            setTimeout(grayscaleLockedSkins, 600);
            setTimeout(grayscaleLockedSkins, 1000);
        }
    });

    // Nasłuchuj na zmiany klas w ekranie szafy
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const wardrobeScreen = document.getElementById('wardrobe-screen');
                if (wardrobeScreen && wardrobeScreen.classList.contains('active')) {
                    console.log("Wykryto aktywację ekranu szafy przez MutationObserver");
                    setTimeout(grayscaleLockedSkins, 300);
                }
            }
        });
    });

    // Obserwuj cały dokument pod kątem zmian
    observer.observe(document.body, { attributes: true, subtree: true });

    // Dodaj style CSS bezpośrednio do dokumentu
    const style = document.createElement('style');
    style.innerHTML = `
        /* Style dla wyszarzonych skinów */
        .skin-item button[disabled] + .skin-image img,
        .skin-item button.locked + .skin-image img,
        .skin-item.locked .skin-image img {
            filter: grayscale(100%) !important;
            opacity: 0.5 !important;
            transition: filter 0.3s, opacity 0.3s;
        }
        
        /* Style dla przycisków zablokowanych skinów */
        .skin-item button[disabled],
        .skin-item.locked button {
            background-color: #666666 !important;
            cursor: not-allowed !important;
            opacity: 0.8 !important;
        }
        
        /* Style dla przycisków odblokowanych skinów */
        .skin-item:not(.locked) button:not(.selected):not([disabled]) {
            background-color: #2196F3 !important;
            cursor: pointer !important;
        }
        
        /* SPECJALNE STYLE DLA MASTER RECRUITER - ZAWSZE ODBLOKOWANY */
        .skin-item[data-skin-id="master"] .skin-image img,
        .skin-item:has(.skin-title:contains("Master")) .skin-image img,
        .skin-item:has(.skin-title:contains("Mistrz")) .skin-image img {
            filter: none !important;
            opacity: 1 !important;
        }
        
        .skin-item[data-skin-id="master"] button,
        .skin-item:has(.skin-title:contains("Master")) button,
        .skin-item:has(.skin-title:contains("Mistrz")) button {
            background-color: #2196F3 !important;
            cursor: pointer !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);
    console.log("Dodano style CSS dla wyszarzania skinów");

    
    // Dodatkowe sprawdzanie przy zmianach w DOM
    document.addEventListener('DOMSubtreeModified', function() {
        // Uruchom tylko jeśli ekran szafy jest aktywny
        const wardrobeScreen = document.getElementById('wardrobe-screen');
        if (wardrobeScreen && wardrobeScreen.classList.contains('active')) {
            // Używaj throttle, aby nie obciążać przeglądarki
            clearTimeout(window.domChangeTimeout);
            window.domChangeTimeout = setTimeout(grayscaleLockedSkins, 300);
        }
    });

    // Reaguj również na zmianę języka
    document.addEventListener('languageChanged', function() {
        console.log("Wykryto zmianę języka - aktualizuję interfejs skinów");
        setTimeout(grayscaleLockedSkins, 300);
    });

    // Funkcja publiczna do ręcznego wymuszenia wyszarzenia
    window.updateSkinGrayscale = grayscaleLockedSkins;
    
    // Dodatkowe wywołanie z opóźnieniem dla lepszej kompatybilności
    setTimeout(grayscaleLockedSkins, 2000);
    setTimeout(grayscaleLockedSkins, 5000);
})();