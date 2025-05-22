// skin-grayscale.js - Zmodyfikowana wersja - WSPÓŁPRACA Z WARDROBE
(function() {
    console.log("Inicjalizacja ulepszonego systemu wyszarzania skinów");

    // ====== KONFIGURACJA ======
    const SPECIAL_SKINS = {
        "default": {
            id: "default",
            name: "Default",
            nameEn: "Default",
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

    let isInitialized = false;

    // ====== GŁÓWNE FUNKCJE ======
    
    function initSkinSystem() {
        if (isInitialized) {
            console.log("System skinów już zainicjalizowany, pomijam.");
            return;
        }
        
        console.log("Inicjalizacja systemu skinów...");
        
        ensureSkinsStructureExists();
        
        Object.values(SPECIAL_SKINS).forEach(skin => {
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
        
        grayscaleLockedSkins();
        setupDOMObserver();
        
        document.addEventListener('skinUnlocked', function(e) {
            console.log("Wykryto zdarzenie odblokowania skina:", e.detail?.skinId || "unknown");
            grayscaleLockedSkins();
        });
        
        window.SkinsSystem = {
            checkSkinUnlocked: function(skinId) {
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
        
        isInitialized = true;
        console.log("System skinów zainicjalizowany pomyślnie");
    }
    
    function ensureSkinsStructureExists() {
        if (!window.gameState) {
            console.warn("gameState nie istnieje!");
            return false;
        }
        
        if (Object.keys(window.gameState).length <= 1 && !window.gameState.resources) {
            console.warn("gameState wydaje się niekompletny.");
            return false;
        }
        
        if (!window.gameState.skins) {
            window.gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default"]
            };
        } else {
            if (!Array.isArray(window.gameState.skins.unlockedSkins)) {
                window.gameState.skins.unlockedSkins = ["default"];
            } else if (!window.gameState.skins.unlockedSkins.includes("default")) {
                window.gameState.skins.unlockedSkins.push("default");
            }
        }
        
        return true;
    }
    
    function checkSkinUnlocked(skin) {
        if (skin.alwaysUnlocked) {
            return true;
        }
        
        if (localStorage.getItem(skin.localStorageKey) === 'true') {
            return true;
        }
        
        if (skin.checkFunction && skin.checkFunction()) {
            markSkinAsUnlocked(skin);
            return true;
        }
        
        if (window.gameState && window.gameState.skins && 
            window.gameState.skins.unlockedSkins && 
            window.gameState.skins.unlockedSkins.includes(skin.id)) {
            markSkinAsUnlocked(skin);
            return true;
        }
        
        return false;
    }
    
    function markSkinAsUnlocked(skin) {
        if (skin.localStorageKey) {
            localStorage.setItem(skin.localStorageKey, 'true');
            console.log(`Zapisano odblokowanie skina ${skin.name} w localStorage`);
        }
    }
    
    function unlockSkinInGameState(skinId) {
        if (!window.gameState) {
            console.error("gameState nie istnieje!");
            return false;
        }
        
        if (Object.keys(window.gameState).length <= 1 && !window.gameState.resources) {
            console.warn("gameState wydaje się niekompletny.");
            return false;
        }
        
        if (!window.gameState.skins) {
            window.gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default"]
            };
        }
        
        if (!Array.isArray(window.gameState.skins.unlockedSkins)) {
            window.gameState.skins.unlockedSkins = ["default"];
        }
        
        if (!window.gameState.skins.unlockedSkins.includes(skinId)) {
            window.gameState.skins.unlockedSkins.push(skinId);
            console.log(`Dodano skin ${skinId} do odblokowanych w gameState`);
            
            if (typeof window.saveGame === 'function') {
                window.saveGame();
                console.log("Zapisano stan gry po odblokowaniu skina");
            }
            
            const event = new CustomEvent('skinUnlocked', { 
                detail: { skinId: skinId } 
            });
            document.dispatchEvent(event);
            
            return true;
        }
        
        return false;
    }

    // ====== FUNKCJE SPRAWDZAJĄCE WARUNKI ======
    
    function checkForestSkinRequirements() {
        if (window.gameState && window.gameState.rewardPass && 
            window.gameState.rewardPass.distance >= SPECIAL_SKINS.lesny.requiredDistance) {
            console.log(`Wymagany dystans ${SPECIAL_SKINS.lesny.requiredDistance}m osiągnięty!`);
            return true;
        }
        
        if (window.gameState && window.gameState.rewardPass && 
            window.gameState.rewardPass.claimedRewards && 
            window.gameState.rewardPass.claimedRewards.free && 
            window.gameState.rewardPass.claimedRewards.free.includes(SPECIAL_SKINS.lesny.requiredDistance)) {
            console.log(`Nagroda na dystansie ${SPECIAL_SKINS.lesny.requiredDistance}m została już odebrana!`);
            return true;
        }
        
        return false;
    }
    
    function checkMasterSkinRequirements() {
        if (window.gameState && window.gameState.referral && 
            window.gameState.referral.totalInvites >= SPECIAL_SKINS.master.requiredInvites) {
            console.log(`Wymagana liczba zaproszeń (${SPECIAL_SKINS.master.requiredInvites}) osiągnięta!`);
            return true;
        }
        
        if (window.gameState && window.gameState.referral && 
            window.gameState.referral.rewardsClaimed && 
            window.gameState.referral.rewardsClaimed.tier100) {
            console.log("Nagroda za 100 zaproszeń została już odebrana!");
            return true;
        }
        
        if (window.gameState && window.gameState.referral && 
            window.gameState.referral.specialSkins && 
            window.gameState.referral.specialSkins.includes("skin_recruiter")) {
            console.log("Skin Master Recruiter jest już w specialSkins!");
            return true;
        }
        
        return false;
    }

    // ====== FUNKCJE UI ======
    
    // KLUCZOWE: Tylko wyszarzanie, nie obsługa kliknięć
    function grayscaleLockedSkins() {
        const skinItems = document.querySelectorAll('.skin-item');
        console.log(`Znaleziono ${skinItems.length} elementów skinów`);
        
        if (skinItems.length === 0) {
            return;
        }
        
        skinItems.forEach(skinItem => {
            const skinId = skinItem.getAttribute('data-skin-id') || '';
            const button = skinItem.querySelector('button');
            if (!button) return;
            
            const imgContainer = skinItem.querySelector('.skin-image');
            const img = imgContainer ? imgContainer.querySelector('img') : null;
            
            const isSpecialSkin = SPECIAL_SKINS[skinId] !== undefined;
            
            let isUnlocked = false;
            
            if (skinId === "default") {
                isUnlocked = true;
            } else if (isSpecialSkin) {
                isUnlocked = checkSkinUnlocked(SPECIAL_SKINS[skinId]);
            } else {
                isUnlocked = window.gameState && window.gameState.skins && 
                            window.gameState.skins.unlockedSkins && 
                            window.gameState.skins.unlockedSkins.includes(skinId);
            }
            
            if (isUnlocked) {
                unlockSkinInUI(skinItem, button, img, skinId);
            } else {
                grayscaleSkinInUI(skinItem, button, img);
            }
        });
    }
    
    // TYLKO ODBLOKOWANIE WYGLĄDU - BEZ OBSŁUGI KLIKNIĘĆ
    function unlockSkinInUI(skinItem, button, img, skinId) {
        console.log(`Odblokowuję wygląd skina: ${skinId}`);
        
        if (img) {
            img.style.filter = 'none';
            img.style.opacity = '1';
        }
        
        skinItem.classList.remove('locked');
        
        // USUNIĘTE: Obsługa kliknięć - to robi WardrobeModule
        // TYLKO aktualizacja wyglądu przycisków z tłumaczeniami
        const currentSkin = window.gameState?.skins?.currentSkin || 'default';
        const isSelected = (skinId === currentSkin);
        
        if (isSelected) {
            button.style.backgroundColor = '#4CAF50';
            button.disabled = false;
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            button.textContent = window.t ? window.t('wardrobe.buttons.selected') : 'Wybrany';
            button.classList.add('selected');
        } else {
            button.disabled = false;
            button.style.backgroundColor = '#2196F3';
            button.style.cursor = 'pointer';
            button.style.opacity = '1';
            button.textContent = window.t ? window.t('wardrobe.buttons.select') : 'Wybierz';
            button.classList.remove('selected');
        }
    }
    
    function grayscaleSkinInUI(skinItem, button, img) {
        if (img) {
            img.style.filter = 'grayscale(100%)';
            img.style.opacity = '0.5';
        }
        
        button.disabled = true;
        button.style.backgroundColor = '#666666';
        button.style.cursor = 'not-allowed';
        button.style.opacity = '0.7';
        button.textContent = window.t ? window.t('wardrobe.buttons.locked') : 'Zablokowany';
        
        skinItem.classList.add('locked');
    }

    function setupDOMObserver() {
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
        
        const observer = new MutationObserver(debounce(function(mutations) {
            const wardrobeScreen = document.getElementById('wardrobe-screen');
            if (wardrobeScreen && wardrobeScreen.classList.contains('active')) {
                grayscaleLockedSkins();
            }
        }, 300));
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true, 
            attributes: true,
            attributeFilter: ['class']
        });
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('wardrobe-button') || 
                e.target.closest('.wardrobe-button')) {
                console.log("Wykryto kliknięcie przycisku szafy");
                
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
                
                setTimeout(grayscaleLockedSkins, 300);
                setTimeout(grayscaleLockedSkins, 600);
                setTimeout(grayscaleLockedSkins, 1000);
            }
        });
        
        document.addEventListener('languageChanged', function() {
            console.log("Wykryto zmianę języka w systemie skinów");
            setTimeout(() => {
                grayscaleLockedSkins();
            }, 100);
        });
    }
    
    function addSkinStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .skin-item.locked .skin-image img {
                filter: grayscale(100%) !important;
                opacity: 0.5 !important;
                transition: filter 0.3s, opacity 0.3s;
            }
            
            .skin-item.locked button {
                background-color: #666666 !important;
                cursor: not-allowed !important;
                opacity: 0.8 !important;
            }
            
            .skin-item:not(.locked) button:not(.selected):not([disabled]) {
                background-color: #2196F3 !important;
                cursor: pointer !important;
            }
            
            .skin-item button.selected {
                background-color: #4CAF50 !important;
            }
            
            .skin-item:not(.locked):hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
        console.log("Dodano style CSS dla skinów");
    }
    
    // Funkcja alternatywnej aktualizacji grafik (używana przez WardrobeModule)
    function applySelectedSkin(skinId) {
        console.log("SkinsSystem: Alternatywna aktualizacja grafik dla skina:", skinId);
        
        let skinPath, expeditionPath;
        
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
        
        // Backup dla aplikowania grafik (jeśli WardrobeModule zawiedzie)
        const breedingBirdImage = document.getElementById('pet-bird-image');
        if (breedingBirdImage) {
            breedingBirdImage.style.backgroundImage = `url('${skinPath}')`;
        }
        
        const playBirdImage = document.getElementById('play-bird-image');
        if (playBirdImage) {
            playBirdImage.style.backgroundImage = `url('${skinPath}')`;
        }
        
        const rewardPassBird = document.getElementById('reward-pass-bird');
        if (rewardPassBird) {
            rewardPassBird.style.backgroundImage = `url('${skinPath}')`;
        }
        
        const flyingBird = document.querySelector('.flying-bird');
        if (flyingBird) {
            flyingBird.style.backgroundImage = `url('${expeditionPath}')`;
        }
        
        const wardrobeBirdImage = document.getElementById('wardrobe-bird-image');
        if (wardrobeBirdImage) {
            wardrobeBirdImage.src = skinPath;
        }
        
        localStorage.setItem('currentSkin', skinId);
    }

    window.applySelectedSkin = applySelectedSkin;
    
    // ====== INICJALIZACJA ======
    
    function safeInitialize() {
        console.log("Uruchamiam bezpieczną inicjalizację systemu skinów");
        
        addSkinStyles();
        
        if (window.gameState && typeof window.gameState === 'object' && Object.keys(window.gameState).length > 1) {
            if (window.gameState.resources) {
                console.log("gameState wydaje się być w pełni załadowany. Inicjalizuję system skinów.");
                initSkinSystem();
            } else {
                console.log("gameState nie zawiera wszystkich danych. Czekam na zdarzenie gameLoaded.");
                document.addEventListener('gameLoaded', function() {
                    setTimeout(initSkinSystem, 1000);
                });
            }
        } else {
            console.log("gameState nie jest jeszcze dostępny. Czekam na zdarzenie gameLoaded.");
            document.addEventListener('gameLoaded', function() {
                setTimeout(initSkinSystem, 1000);
            });
        }
        
        setTimeout(function() {
            if (!isInitialized) {
                console.log("System skinów nie został jeszcze zainicjalizowany. Próbuję ponownie.");
                initSkinSystem();
            }
        }, 3000);
    }
    
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(safeInitialize, 500);
        });
    } else {
        setTimeout(safeInitialize, 500);
    }
    
    document.addEventListener('gameLoaded', function() {
        console.log("Wykryto zdarzenie gameLoaded");
        if (!isInitialized) {
            setTimeout(initSkinSystem, 1000);
        } else {
            setTimeout(grayscaleLockedSkins, 500);
        }
    });
})();