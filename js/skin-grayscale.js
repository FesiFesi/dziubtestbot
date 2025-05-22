// skin-grayscale.js - Zmodyfikowana wersja
(function() {
    console.log("Inicjalizacja ulepszonego systemu wyszarzania skinów");

    // ====== KONFIGURACJA ======
    // Lista skinów, które mają specjalne warunki odblokowania
    const SPECIAL_SKINS = {
        "default": {
            id: "default",
            name: "Default",
            nameEn: "Default",
            // Domyślny skin jest zawsze odblokowany
            alwaysUnlocked: true
        },
        "lesny": {
            id: "lesny",
            name: "Leśny Zwiadowca",
            nameEn: "Forest Scout",
            requiredDistance: 1100,
            localStorageKey: "forestSkinUnlocked",
            checkFunction: checkForestSkinRequirements
        },
        "master": {
            id: "master",
            name: "Master Recruiter",
            nameEn: "Master Recruiter",
            requiredInvites: 100,
            localStorageKey: "masterSkinUnlocked",
            checkFunction: checkMasterSkinRequirements
        }
    };

    // Flaga wskazująca, czy system skinów został zainicjalizowany
    let isInitialized = false;

    // ====== GŁÓWNE FUNKCJE ======
    
    // Inicjalizacja systemu skinów przy starcie
    function initSkinSystem() {
        // Upewnij się, że nie inicjalizujemy systemu wielokrotnie
        if (isInitialized) {
            console.log("System skinów już zainicjalizowany, pomijam.");
            return;
        }
        
        console.log("Inicjalizacja systemu skinów...");
        
        // Upewnij się, że struktura skinów istnieje w gameState
        ensureSkinsStructureExists();
        
        // Sprawdź odblokowanie wszystkich specjalnych skinów
        Object.values(SPECIAL_SKINS).forEach(skin => {
            // Default zawsze odblokowany
            if (skin.alwaysUnlocked) {
                unlockSkinInGameState(skin.id);
                return;
            }
            
            const isUnlocked = checkSkinUnlocked(skin);
            if (isUnlocked) {
                console.log(`Skin ${skin.name} jest odblokowany!`);
                unlockSkinInGameState(skin.id);
            }
        });
        
        // Uruchom funkcję wyszarzania
        grayscaleLockedSkins();
        
        // Dodaj obserwatora DOM dla dynamicznych zmian
        setupDOMObserver();
        
        // Dodaj nasłuchiwanie na zdarzenie odblokowania skina
        document.addEventListener('skinUnlocked', function(e) {
            console.log("Wykryto zdarzenie odblokowania skina:", e.detail?.skinId || "unknown");
            grayscaleLockedSkins();
        });
        
        // Dodaj funkcje do globalnego zakresu
        window.SkinsSystem = {
            checkSkinUnlocked: function(skinId) {
                // Default zawsze odblokowany
                if (skinId === "default") return true;
                
                const skin = SPECIAL_SKINS[skinId];
                return skin ? checkSkinUnlocked(skin) : false;
            },
            unlockSkin: function(skinId) {
                const skin = SPECIAL_SKINS[skinId];
                if (skin) {
                    markSkinAsUnlocked(skin);
                    unlockSkinInGameState(skinId);
                    grayscaleLockedSkins();
                    return true;
                }
                return false;
            },
            getSkinInfo: function(skinId) {
                return SPECIAL_SKINS[skinId] || null;
            },
            updateSkinsDisplay: grayscaleLockedSkins
        };
        
        // Oznacz system jako zainicjalizowany
        isInitialized = true;
        console.log("System skinów zainicjalizowany pomyślnie");
    }
    
    // NAPRAWIONE: Ulepszona funkcja sprawdzająca strukturę skinów
    function ensureSkinsStructureExists() {
        if (!window.gameState) {
            console.warn("gameState nie istnieje! Nie mogę inicjalizować systemu skinów.");
            return false;
        }
        
        // NAPRAWIONE: Sprawdź czy gameState nie jest pustym obiektem (co wskazywałoby na niekompletne ładowanie)
        if (Object.keys(window.gameState).length <= 1 && !window.gameState.resources) {
            console.warn("gameState wydaje się niekompletny. Odkładam inicjalizację systemu skinów.");
            return false;
        }
        
        // Bezpiecznie utwórz strukturę skinów, jeśli nie istnieje
        if (!window.gameState.skins) {
            window.gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default"]
            };
        } else {
            // Upewnij się, że tablica unlockedSkins istnieje
            if (!Array.isArray(window.gameState.skins.unlockedSkins)) {
                window.gameState.skins.unlockedSkins = ["default"];
            } else if (!window.gameState.skins.unlockedSkins.includes("default")) {
                // Upewnij się, że default jest zawsze odblokowany
                window.gameState.skins.unlockedSkins.push("default");
            }
        }
        
        // NAPRAWIONE: Nie zapisuj stanu gry podczas inicjalizacji, ponieważ stan gry może nie być w pełni załadowany
        // Jeśli konieczny jest zapis, powinien być wywołany dopiero po pełnym załadowaniu gry
        return true;
    }
    
    // Sprawdź, czy skin jest odblokowany
    function checkSkinUnlocked(skin) {
        // Jeśli skin jest zawsze odblokowany (np. default)
        if (skin.alwaysUnlocked) {
            return true;
        }
        
        // Najpierw sprawdź localStorage
        if (localStorage.getItem(skin.localStorageKey) === 'true') {
            return true;
        }
        
        // Następnie użyj funkcji sprawdzającej warunki
        if (skin.checkFunction && skin.checkFunction()) {
            markSkinAsUnlocked(skin);
            return true;
        }
        
        // Sprawdź, czy skin jest już odblokowany w gameState
        if (window.gameState && window.gameState.skins && 
            window.gameState.skins.unlockedSkins && 
            window.gameState.skins.unlockedSkins.includes(skin.id)) {
            markSkinAsUnlocked(skin);
            return true;
        }
        
        return false;
    }
    
    // Oznacz skin jako odblokowany w localStorage
    function markSkinAsUnlocked(skin) {
        if (skin.localStorageKey) {
            localStorage.setItem(skin.localStorageKey, 'true');
            console.log(`Zapisano odblokowanie skina ${skin.name} w localStorage`);
        }
    }
    
    // Dodaj skin do odblokowanych w gameState
    function unlockSkinInGameState(skinId) {
        if (!window.gameState) {
            console.error("gameState nie istnieje!");
            return false;
        }
        
        // NAPRAWIONE: sprawdź czy gameState jest w pełni załadowany
        if (Object.keys(window.gameState).length <= 1 && !window.gameState.resources) {
            console.warn("gameState wydaje się niekompletny. Nie mogę dodać skina.");
            return false;
        }
        
        // Upewnij się, że struktura skins istnieje
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
        
        // Dodaj skin do odblokowanych, jeśli jeszcze go tam nie ma
        if (!window.gameState.skins.unlockedSkins.includes(skinId)) {
            window.gameState.skins.unlockedSkins.push(skinId);
            console.log(`Dodano skin ${skinId} do odblokowanych w gameState`);
            
            // Zapisz stan gry tylko jeśli skin został faktycznie dodany i gra jest w pełni załadowana
            if (typeof window.saveGame === 'function') {
                window.saveGame();
                console.log("Zapisano stan gry po odblokowaniu skina");
            }
            
            // Wyzwól zdarzenie odblokowania skina
            const event = new CustomEvent('skinUnlocked', { 
                detail: { skinId: skinId } 
            });
            document.dispatchEvent(event);
            
            return true;
        }
        
        return false;
    }

    // ====== FUNKCJE SPRAWDZAJĄCE WARUNKI ODBLOKOWANIA ======
    
    // Sprawdź warunki odblokowania skina Leśny Zwiadowca
    function checkForestSkinRequirements() {
        // Sprawdź dystans w przepustce
        if (window.gameState && window.gameState.rewardPass && 
            window.gameState.rewardPass.distance >= SPECIAL_SKINS.lesny.requiredDistance) {
            console.log(`Wymagany dystans ${SPECIAL_SKINS.lesny.requiredDistance}m osiągnięty!`);
            return true;
        }
        
        // Sprawdź, czy nagroda została już odebrana
        if (window.gameState && window.gameState.rewardPass && 
            window.gameState.rewardPass.claimedRewards && 
            window.gameState.rewardPass.claimedRewards.free && 
            window.gameState.rewardPass.claimedRewards.free.includes(SPECIAL_SKINS.lesny.requiredDistance)) {
            console.log(`Nagroda na dystansie ${SPECIAL_SKINS.lesny.requiredDistance}m została już odebrana!`);
            return true;
        }
        
        return false;
    }
    
    // Sprawdź warunki odblokowania skina Master Recruiter
    function checkMasterSkinRequirements() {
        // Sprawdź liczbę zaproszeń
        if (window.gameState && window.gameState.referral && 
            window.gameState.referral.totalInvites >= SPECIAL_SKINS.master.requiredInvites) {
            console.log(`Wymagana liczba zaproszeń (${SPECIAL_SKINS.master.requiredInvites}) osiągnięta!`);
            return true;
        }
        
        // Sprawdź, czy nagroda została już odebrana
        if (window.gameState && window.gameState.referral && 
            window.gameState.referral.rewardsClaimed && 
            window.gameState.referral.rewardsClaimed.tier100) {
            console.log("Nagroda za 100 zaproszeń została już odebrana!");
            return true;
        }
        
        // Sprawdź, czy skin jest już w specialSkins
        if (window.gameState && window.gameState.referral && 
            window.gameState.referral.specialSkins && 
            window.gameState.referral.specialSkins.includes("skin_recruiter")) {
            console.log("Skin Master Recruiter jest już w specialSkins!");
            return true;
        }
        
        return false;
    }

    // ====== FUNKCJE UI ======
    
    // Funkcja wyszarzająca zablokowane skiny
    function grayscaleLockedSkins() {
        // Znajdź wszystkie elementy skinów
        const skinItems = document.querySelectorAll('.skin-item');
        console.log(`Znaleziono ${skinItems.length} elementów skinów`);
        
        if (skinItems.length === 0) {
            // Prawdopodobnie ekran szafy nie jest jeszcze załadowany
            return;
        }
        
        // Dla każdego skina
        skinItems.forEach(skinItem => {
            // Pobierz ID skina
            const skinId = skinItem.getAttribute('data-skin-id') || '';
            
            // Znajdź button
            const button = skinItem.querySelector('button');
            if (!button) return;
            
            // Znajdź obrazek
            const imgContainer = skinItem.querySelector('.skin-image');
            const img = imgContainer ? imgContainer.querySelector('img') : null;
            
            // Sprawdź, czy to specjalny skin
            const isSpecialSkin = SPECIAL_SKINS[skinId] !== undefined;
            
            // Sprawdź czy skin powinien być odblokowany
            let isUnlocked = false;
            
            if (skinId === "default") {
                // Domyślny skin jest zawsze odblokowany
                isUnlocked = true;
            } else if (isSpecialSkin) {
                // Dla specjalnych skinów sprawdź warunki odblokowania
                isUnlocked = checkSkinUnlocked(SPECIAL_SKINS[skinId]);
            } else {
                // Dla zwykłych skinów sprawdź gameState
                isUnlocked = window.gameState && window.gameState.skins && 
                            window.gameState.skins.unlockedSkins && 
                            window.gameState.skins.unlockedSkins.includes(skinId);
            }
            
            if (isUnlocked) {
                // Odblokuj skin w UI
                unlockSkinInUI(skinItem, button, img, skinId);
            } else {
                // Wyszarz skin w UI
                grayscaleSkinInUI(skinItem, button, img);
            }
        });
    }
    
    // Odblokuj skin w UI
    function unlockSkinInUI(skinItem, button, img, skinId) {
        // Odblokowujemy wygląd skina
        console.log(`Odblokowuję wygląd skina: ${skinId}`);
        
        if (img) {
            img.style.filter = 'none';
            img.style.opacity = '1';
        }
        
        // Sprawdź, czy przycisk jest już wybrany
        const isSelected = button.textContent === 'Wybrany' || button.textContent === 'Selected' || 
                          (window.gameState && window.gameState.skins && window.gameState.skins.currentSkin === skinId);
        
        if (isSelected) {
            // Dla wybranego skina ustaw zielony przycisk
            button.style.backgroundColor = '#4CAF50';
            button.disabled = false;
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            
            // Ustaw tekst przycisku w zależności od języka
            const currentLang = localStorage.getItem('gameLanguage') || 'pl';
            button.textContent = currentLang === 'en' ? 'Selected' : 'Wybrany';
        } else {
            // Dla odblokowanego, ale nie wybranego skina
            button.disabled = false;
            button.style.backgroundColor = '#2196F3';
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            
            // Ustaw tekst przycisku w zależności od języka
            const currentLang = localStorage.getItem('gameLanguage') || 'pl';
            button.textContent = currentLang === 'en' ? 'Select' : 'Wybierz';
        }
        
        // Usuń klasę locked
        skinItem.classList.remove('locked');
        
        // Odblokuj skin w UI - fragment funkcji unlockSkinInUI, który modyfikujemy
        button.onclick = function() {
            if (window.gameState && window.gameState.skins) {
                // Zapisz poprzedni skin dla sprawdzenia czy zmiana nastąpiła
                const previousSkin = window.gameState.skins.currentSkin;
                
                // Zmień aktualny skin
                window.gameState.skins.currentSkin = skinId;
                
                // Zapisz również w localStorage dla dodatkowego zabezpieczenia
                localStorage.setItem('currentSkin', skinId);
                
                // Zapisz stan gry
                if (typeof window.saveGame === 'function') {
                    window.saveGame();
                }
                
                // Pokaż powiadomienie
                if (typeof window.showNotification === 'function') {
                    let msg;
                    const currentLang = localStorage.getItem('gameLanguage') || 'pl';
                    
                    if (skinId === "lesny") {
                        msg = currentLang === 'en' 
                            ? "Forest Scout skin selected! You get a +10% seeds bonus from expeditions!" 
                            : "Wybrano skin Leśny Zwiadowca! Zyskujesz bonus +10% ziarenek z ekspedycji!";
                    } else if (skinId === "master") {
                        msg = currentLang === 'en' 
                            ? "Master Recruiter skin selected!" 
                            : "Wybrano skin Master Recruiter!";
                    } else {
                        msg = currentLang === 'en' 
                            ? `Default skin selected!` 
                            : `Wybrano domyślny skin!`;
                    }
                    
                    window.showNotification(msg);
                }
                
                // Aktualizuj wygląd przycisków
                document.querySelectorAll('.skin-select-button').forEach(btn => {
                    if (btn === this) {
                        const currentLang = localStorage.getItem('gameLanguage') || 'pl';
                        btn.textContent = currentLang === 'en' ? 'Selected' : 'Wybrany';
                        btn.style.backgroundColor = '#4CAF50';
                        btn.classList.add('selected');
                    } else {
                        // Nie zmieniaj przycisków dla zablokowanych skinów
                        if (!btn.disabled) {
                            const currentLang = localStorage.getItem('gameLanguage') || 'pl';
                            btn.textContent = currentLang === 'en' ? 'Select' : 'Wybierz';
                            btn.style.backgroundColor = '#2196F3';
                            btn.classList.remove('selected');
                        }
                    }
                });
                
                // WAŻNE: Zastosuj skin we wszystkich miejscach - wywołaj funkcję z modułu szafy
                console.log("Aplikuję nowy skin:", skinId);
                
                // Sprawdź czy skin faktycznie się zmienił
                if (previousSkin !== skinId) {
                    if (window.WardrobeModule && typeof window.WardrobeModule.applySkinToAllScreens === 'function') {
                        try {
                            console.log("Wywołuję WardrobeModule.applySkinToAllScreens()");
                            window.WardrobeModule.applySkinToAllScreens();
                        } catch (error) {
                            console.error("Błąd podczas wywoływania applySkinToAllScreens:", error);
                        }
                    } else {
                        console.warn("Funkcja applySkinToAllScreens nie jest dostępna!");
                        
                        // Alternatywna aktualizacja grafik - bezpośrednio
                        console.log("Próbuję alternatywną aktualizację grafik");
                        applySelectedSkin(skinId);
                    }
                }
            }
        };
    }
    
    // Wyszarz skin w UI
    function grayscaleSkinInUI(skinItem, button, img) {
        // Wyszarzamy wygląd skina
        if (img) {
            img.style.filter = 'grayscale(100%)';
            img.style.opacity = '0.5';
        }
        
        // Ustaw styl przycisku
        button.disabled = true;
        button.style.backgroundColor = '#666666';
        button.style.cursor = 'not-allowed';
        button.style.opacity = '0.7';
        
        // Ustaw tekst przycisku w zależności od języka
        const currentLang = localStorage.getItem('gameLanguage') || 'pl';
        button.textContent = currentLang === 'en' ? 'Locked' : 'Zablokowany';
        
        // Dodaj klasę locked
        skinItem.classList.add('locked');
        
        // Usuń handler kliknięcia
        button.onclick = null;
    }

    // Ustawienie obserwatora DOM
    function setupDOMObserver() {
        // Funkcja pomocnicza do debounce
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        }
        
        // Obserwator zmian w DOM
        const observer = new MutationObserver(debounce(function(mutations) {
            // Sprawdź, czy ekran szafy jest aktywny
            const wardrobeScreen = document.getElementById('wardrobe-screen');
            if (wardrobeScreen && wardrobeScreen.classList.contains('active')) {
                grayscaleLockedSkins();
            }
        }, 300));
        
        // Obserwuj cały dokument
        observer.observe(document.body, { 
            childList: true, 
            subtree: true, 
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Nasłuchiwanie na kliknięcie przycisku szafy
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('wardrobe-button') || 
                e.target.closest('.wardrobe-button')) {
                console.log("Wykryto kliknięcie przycisku szafy");
                
                // Sprawdź ponownie wszystkie skiny
                Object.values(SPECIAL_SKINS).forEach(skin => {
                    if (skin.alwaysUnlocked) {
                        unlockSkinInGameState(skin.id);
                    } else {
                        const isUnlocked = checkSkinUnlocked(skin);
                        if (isUnlocked) {
                            unlockSkinInGameState(skin.id);
                        }
                    }
                });
                
                // Uruchom wyszarzanie z opóźnieniem
                setTimeout(grayscaleLockedSkins, 300);
                setTimeout(grayscaleLockedSkins, 600);
                setTimeout(grayscaleLockedSkins, 1000);
            }
        });
    }
    
    // Dodaj style CSS dla skinów
    function addSkinStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Style dla wyszarzonych skinów */
            .skin-item.locked .skin-image img {
                filter: grayscale(100%) !important;
                opacity: 0.5 !important;
                transition: filter 0.3s, opacity 0.3s;
            }
            
            /* Style dla przycisków zablokowanych skinów */
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
            
            /* Style dla wybranych skinów */
            .skin-item button.selected,
            .skin-item button:contains("Wybrany"),
            .skin-item button:contains("Selected") {
                background-color: #4CAF50 !important;
            }
            
            /* Efekty hover */
            .skin-item:not(.locked):hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
        console.log("Dodano style CSS dla skinów");
    }
    
    // Funkcja alternatywnej aktualizacji grafik dla skina
    function applySelectedSkin(skinId) {
        console.log("Alternatywna aktualizacja grafik dla skina:", skinId);
        
        // Przygotuj ścieżki do grafik
        let skinPath;
        let expeditionPath;
        
        switch (skinId) {
            case 'lesny':
                skinPath = './assets/images/skins/lesny-skin.png';
                expeditionPath = './assets/images/skins/lesny-expedition.png';
                break;
            case 'master':
                skinPath = './assets/images/skins/master-skin.png';
                expeditionPath = './assets/images/skins/master-expedition.png';
                break;
            default:
                skinPath = './assets/images/bird-adult.png';
                expeditionPath = './assets/images/forest-expedition.png';
        }
        
        // 1. Ekran hodowli (breeding)
        const breedingBirdImage = document.getElementById('pet-bird-image');
        if (breedingBirdImage) {
            breedingBirdImage.style.backgroundImage = `url('${skinPath}')`;
        }
        
        // 2. Ekran zabawy (play)
        const playBirdImage = document.getElementById('play-bird-image');
        if (playBirdImage) {
            playBirdImage.style.backgroundImage = `url('${skinPath}')`;
        }
        
        // 3. Ekran przepustki nagród (reward-pass)
        const rewardPassBird = document.getElementById('reward-pass-bird');
        if (rewardPassBird) {
            rewardPassBird.style.backgroundImage = `url('${skinPath}')`;
        }
        
        // 4. Ekran ekspedycji - obrazek latającego ptaka
        const flyingBird = document.querySelector('.flying-bird');
        if (flyingBird) {
            flyingBird.style.backgroundImage = `url('${expeditionPath}')`;
        }
        
        // 5. Ekran szafy - podgląd ptaka
        const wardrobeBirdImage = document.getElementById('wardrobe-bird-image');
        if (wardrobeBirdImage) {
            wardrobeBirdImage.src = skinPath;
        }
        
        // Zapisz skin w localStorage dla dodatkowego zabezpieczenia
        localStorage.setItem('currentSkin', skinId);
    }

    // Dodaj funkcję do globalnego zakresu
    window.applySelectedSkin = applySelectedSkin;
    
    // ====== INICJALIZACJA ======
    
    // NAPRAWIONE: Opóźniona inicjalizacja po pełnym załadowaniu gry
    function safeInitialize() {
        console.log("Uruchamiam bezpieczną inicjalizację systemu skinów");
        
        // Dodaj style CSS (można to zrobić od razu)
        addSkinStyles();
        
        // NAPRAWIONE: Sprawdź, czy gameState jest w pełni załadowany
        if (window.gameState && typeof window.gameState === 'object' && Object.keys(window.gameState).length > 1) {
            // Sprawdź, czy ważne pola jak resources istnieją, co świadczy o poprawnym ładowaniu
            if (window.gameState.resources) {
                console.log("gameState wydaje się być w pełni załadowany. Inicjalizuję system skinów.");
                initSkinSystem();
            } else {
                console.log("gameState nie zawiera wszystkich danych. Czekam na zdarzenie gameLoaded.");
                // Poczekaj na zdarzenie gameLoaded
                document.addEventListener('gameLoaded', function() {
                    setTimeout(initSkinSystem, 1000);
                });
            }
        } else {
            console.log("gameState nie jest jeszcze dostępny. Czekam na zdarzenie gameLoaded.");
            // Poczekaj na zdarzenie gameLoaded
            document.addEventListener('gameLoaded', function() {
                setTimeout(initSkinSystem, 1000);
            });
        }
        
        // Dodatkowe wywołanie z opóźnieniem jako zabezpieczenie
        setTimeout(function() {
            if (!isInitialized) {
                console.log("System skinów nie został jeszcze zainicjalizowany. Próbuję ponownie.");
                initSkinSystem();
            }
        }, 3000);
    }
    
    // NAPRAWIONE: Opóźniona inicjalizacja
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', function() {
            // Poczekaj trochę po załadowaniu DOM, by dać czas na załadowanie gameState
            setTimeout(safeInitialize, 500);
        });
    } else {
        // Poczekaj trochę, by dać czas na załadowanie gameState
        setTimeout(safeInitialize, 500);
    }
    
    // NAPRAWIONE: Dodatkowe nasłuchiwanie na zdarzenie gameLoaded
    document.addEventListener('gameLoaded', function() {
        console.log("Wykryto zdarzenie gameLoaded");
        if (!isInitialized) {
            setTimeout(initSkinSystem, 1000);
        } else {
            // Jeśli system już zainicjalizowany, odśwież wygląd skinów
            setTimeout(grayscaleLockedSkins, 500);
        }
    });
})();