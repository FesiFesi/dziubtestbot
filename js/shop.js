/**
 * System sklepu z dekoracjami dla gry DziubCoins
 */

// Funkcja pokazująca ekran sklepu
function showShopScreen() {
    console.log("Pokazuję ekran sklepu");
    
    // Ukryj aktualny ekran i pokaż sklep
    hideAndShowScreen('shop-screen');
    
    // Napraw przycisk powrotu za każdym razem gdy otwieramy sklep
    fixShopBackButton();
    
    // Aktualizuj interfejs sklepu
    updateShopUI();



// Napraw przycisk powrotu za każdym razem gdy otwieramy sklep
    setTimeout(function() {
        const backButton = document.getElementById('shop-back-button');
        if (backButton) {
            backButton.onclick = function() {
                hideAndShowScreen('feed-screen');
                return false;
            };
        }
    }, 100);

}

// NOWA FUNKCJA: Naprawia przycisk powrotu w sklepie
function fixShopBackButton() {
    console.log("Naprawiam przycisk powrotu w sklepie");
    
    const backButton = document.getElementById('shop-back-button');
    if (backButton) {
        // Usuń wszystkie poprzednie event listenery
        const newBackButton = backButton.cloneNode(true);
        backButton.parentNode.replaceChild(newBackButton, backButton);
        
        // Dodaj nowy event listener z różnymi metodami dla pewności
        newBackButton.onclick = function(e) {
            console.log("Kliknięto przycisk powrotu (onclick)");
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Powrót do ekranu karmienia
            hideAndShowScreen('feed-screen');
            return false;
        };
        
        newBackButton.addEventListener('click', function(e) {
            console.log("Kliknięto przycisk powrotu (addEventListener)");
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Powrót do ekranu karmienia
            hideAndShowScreen('feed-screen');
        });
        
        console.log("Przycisk powrotu naprawiony!");
    } else {
        console.error("Nie znaleziono przycisku powrotu w sklepie!");
    }
}

// Aktualizacja interfejsu sklepu
function updateShopUI() {
    console.log("Aktualizuję UI sklepu");
    
    // Aktualizuj przyciski zakupu
    updateBuyButtons();
    
    // Aktualizuj sekcje lokacji - pokaż tylko odblokowane lokacje
    const shopSections = document.querySelectorAll('.shop-section');
    shopSections.forEach(section => {
        const locationId = section.id.split('-')[0]; // Zakładamy, że id sekcji to "[locationId]-decorations"
        
        if (locationId && gameState.locations.unlockedLocations) {
            const isUnlocked = gameState.locations.unlockedLocations[locationId];
            
            if (isUnlocked) {
                section.classList.remove('locked');
            } else {
                section.classList.add('locked');
            }
        }
    });
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
      
      // Jeśli pokazujemy ekran karmienia, zawsze aktualizuj dekoracje
      if (screenId === 'feed-screen' && typeof applyDecorations === 'function' && 
          gameState && gameState.locations) {
        console.log("Przejście do ekranu karmienia przez hideAndShowScreen - aktualizuję dekoracje");
        applyDecorations(gameState.locations.currentLocation);
        
        // Dodano: Pokaż informację o aktywnych bonusach
        displayActiveBonuses(gameState.locations.currentLocation);
      }
    }
  }

// Inicjalizacja systemu sklepu
function initShop() {
    console.log("Inicjalizacja systemu sklepu");
    
    // Dodaj obsługę przycisku sklepu z pewniejszym podejściem
    const shopButton = document.getElementById('shop-button');
    if (shopButton) {
        // Usuń poprzednie event listenery jeśli istnieją
        const newButton = shopButton.cloneNode(true);
        shopButton.parentNode.replaceChild(newButton, shopButton);
        
        // Dodaj nowy event listener
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Kliknięto przycisk sklepu");
            showShopScreen();
        });
        
        console.log("Przycisk sklepu zainicjalizowany");
    } else {
        console.error("Nie znaleziono przycisku sklepu!");
    }

    // Aktualizuj obrazki wszystkich lokacji na mapie
    if (gameState.locations && gameState.locations.configs) {
        Object.keys(gameState.locations.configs).forEach(locationId => {
            updateLocationImage(locationId);
        });
    }
    
    // NOWY KOD: Napraw przycisk powrotu przy inicjalizacji
    fixShopBackButton();
    
    // Dodaj obsługę przycisków zakupu
    setupBuyButtons();
    
    // Zapewnij, że struktura dekoracji istnieje
    ensureDecorationsExist();
    
    // Dodano: Pokaż informację o aktywnych bonusach na ekranie karmienia
    displayActiveBonuses(gameState.locations.currentLocation);
}

// NOWA FUNKCJA: Wyświetlanie aktywnych bonusów na ekranie karmienia
function displayActiveBonuses(location) {
    console.log(`Wyświetlanie aktywnych bonusów dla lokacji: ${location}`);
    
    // Usuń poprzedni kontener bonusów, jeśli istnieje
    const oldBonusContainer = document.getElementById('active-bonuses-container');
    if (oldBonusContainer) {
        oldBonusContainer.remove();
    }
    
    // Sprawdź czy mamy jakiekolwiek dekoracje dla tej lokacji
    if (!gameState.decorations || !gameState.decorations[location]) {
        return;
    }
    
    // Znajdź wszystkie aktywne bonusy
    const activeBonus = {
        feedCost: 0,
        reward: 0,
        feedTime: 0
    };
    
    let hasAnyBonus = false;
    
    Object.keys(gameState.decorations[location]).forEach(decId => {
        const decoration = gameState.decorations[location][decId];
        if (decoration.owned && decoration.bonus) {
            activeBonus[decoration.bonus.type] += decoration.bonus.value;
            hasAnyBonus = true;
        }
    });
    
    // Jeśli nie ma żadnych aktywnych bonusów, nie twórz kontenera
    if (!hasAnyBonus) {
        return;
    }
    
    // Utwórz kontener dla bonusów
    const bonusContainer = document.createElement('div');
    bonusContainer.id = 'active-bonuses-container';
    bonusContainer.style.position = 'absolute';
    bonusContainer.style.top = '70px';
    bonusContainer.style.left = '10px';
    bonusContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    bonusContainer.style.padding = '10px';
    bonusContainer.style.borderRadius = '10px';
    bonusContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    bonusContainer.style.zIndex = '50';
    bonusContainer.style.maxWidth = '180px';
    
    // Dodaj tytuł
    const title = document.createElement('div');
    title.textContent = t('shop.bonuses.activeTitle');
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    title.style.textAlign = 'center';
    bonusContainer.appendChild(title);
    
    // Dodaj listę aktywnych bonusów
    if (activeBonus.feedCost > 0) {
        const costBonus = document.createElement('div');
        costBonus.textContent = t('shop.bonuses.feedCostBonus', { value: activeBonus.feedCost });
        costBonus.style.color = '#4CAF50';
        bonusContainer.appendChild(costBonus);
    }
    
    if (activeBonus.reward > 0) {
        const rewardBonus = document.createElement('div');
        rewardBonus.textContent = t('shop.bonuses.rewardBonus', { value: activeBonus.reward });
        rewardBonus.style.color = '#FFC107';
        bonusContainer.appendChild(rewardBonus);
    }
    
    if (activeBonus.feedTime > 0) {
        const timeBonus = document.createElement('div');
        timeBonus.textContent = t('shop.bonuses.feedTimeBonus', { value: activeBonus.feedTime });
        timeBonus.style.color = '#2196F3';
        bonusContainer.appendChild(timeBonus);
    }
    
    // Dodaj kontener do ekranu karmienia
    const feedScreen = document.getElementById('feed-screen');
    if (feedScreen) {
        feedScreen.appendChild(bonusContainer);
    }
}

// Funkcja upewniająca się, że struktura dekoracji istnieje w gameState
function ensureDecorationsExist() {
    console.log("Sprawdzanie struktury dekoracji w gameState");
    
    // Inicjowanie głównego obiektu decorations, jeśli nie istnieje
    if (!gameState.decorations) {
        console.log("Brak obiektu dekoracji - tworzę nowy");
        gameState.decorations = {};
    }
    
    // Inicjowanie obiektu dekoracji dla parku
    if (!gameState.decorations.park) {
        console.log("Brak dekoracji parku - tworzę nowe");
        gameState.decorations.park = {};
    }
    
    // Inicjowanie obiektu dekoracji dla jeziora
    if (!gameState.decorations.lake) {
        console.log("Brak dekoracji jeziora - tworzę nowe");
        gameState.decorations.lake = {};
    }
    
    // Domyślne dekoracje parku
    const defaultParkDecorations = {
        bench: { 
            owned: false, 
            id: "bench",
            name: t('shop.decorations.benchName'),
            description: t('shop.decorations.benchDesc'),
            price: 0.01, 
            image: "assets/images/decorations/park-bench.png",
            thumbnailImage: "assets/images/decorations/park-bench-small.png",
            bonus: { type: "feedCost", value: 10 }
        },
        fountain: { 
            owned: false, 
            id: "fountain",
            name: t('shop.decorations.fountainName'),
            description: t('shop.decorations.fountainDesc'),
            price: 0.01, 
            image: "assets/images/decorations/park-fountain.png",
            thumbnailImage: "assets/images/decorations/park-fountain-small.png",
            bonus: { type: "reward", value: 10 }
        },
        balloon: { 
            owned: false, 
            id: "balloon",
            name: t('shop.decorations.balloonName'),
            description: t('shop.decorations.balloonDesc'),
            price: 0.05, 
            image: "assets/images/decorations/park-balloon.png",
            thumbnailImage: "assets/images/decorations/park-balloon-small.png",
            bonus: { type: "feedTime", value: 10 }
        }
    };
    
    // NOWE: Domyślne dekoracje jeziora
    const defaultLakeDecorations = {
        boat: { 
            owned: false, 
            id: "boat",
            name: t('shop.decorations.boatName'),
            description: t('shop.decorations.boatDesc'),
            price: 0.01, 
            image: "assets/images/decorations/lake-boat.png",
            thumbnailImage: "assets/images/decorations/lake-boat-small.png",
            bonus: { type: "feedCost", value: 12 }
        },
        kite: { 
            owned: false, 
            id: "kite",
            name: t('shop.decorations.kiteName'),
            description: t('shop.decorations.kiteDesc'),
            price: 0.01, 
            image: "assets/images/decorations/lake-kite.png",
            thumbnailImage: "assets/images/decorations/lake-kite-small.png",
            bonus: { type: "reward", value: 12 }
        },
        paraglider: { 
            owned: false, 
            id: "paraglider",
            name: t('shop.decorations.paragliderName'),
            description: t('shop.decorations.paragliderDesc'),
            price: 0.05, 
            image: "assets/images/decorations/lake-paraglider.png",
            thumbnailImage: "assets/images/decorations/lake-paraglider-small.png",
            bonus: { type: "feedTime", value: 12 }
        }
    };
    
    // Sprawdź i uzupełnij brakujące dekoracje parku, zachowując ich stan
    Object.keys(defaultParkDecorations).forEach(decorationId => {
        if (!gameState.decorations.park[decorationId]) {
            console.log(`Dodaję brakującą dekorację ${decorationId} do parku`);
            gameState.decorations.park[decorationId] = defaultParkDecorations[decorationId];
        } else {
            // Jeśli dekoracja już istnieje, upewnij się, że ma wszystkie potrzebne właściwości
            console.log(`Aktualizuję metadane dekoracji ${decorationId} w parku`);
            const ownedStatus = gameState.decorations.park[decorationId].owned || false;
            Object.assign(gameState.decorations.park[decorationId], defaultParkDecorations[decorationId]);
            // Przywróć oryginalny stan posiadania
            gameState.decorations.park[decorationId].owned = ownedStatus;
        }
    });
    
    // NOWE: Sprawdź i uzupełnij brakujące dekoracje jeziora, zachowując ich stan
    Object.keys(defaultLakeDecorations).forEach(decorationId => {
        if (!gameState.decorations.lake[decorationId]) {
            console.log(`Dodaję brakującą dekorację ${decorationId} do jeziora`);
            gameState.decorations.lake[decorationId] = defaultLakeDecorations[decorationId];
        } else {
            // Jeśli dekoracja już istnieje, upewnij się, że ma wszystkie potrzebne właściwości
            console.log(`Aktualizuję metadane dekoracji ${decorationId} w jeziorze`);
            const ownedStatus = gameState.decorations.lake[decorationId].owned || false;
            Object.assign(gameState.decorations.lake[decorationId], defaultLakeDecorations[decorationId]);
            // Przywróć oryginalny stan posiadania
            gameState.decorations.lake[decorationId].owned = ownedStatus;
        }
    });
    
    // Zapisz stan po inicjalizacji lub aktualizacji
    saveGame();
    
    console.log("Stan dekoracji po inicjalizacji:", gameState.decorations);
}

// Funkcja ustawiająca przyciski zakupu
function setupBuyButtons() {
    console.log("Konfiguracja przycisków zakupu");
    
    // Pobierz wszystkie przyciski zakupu
    const buyButtons = document.querySelectorAll('.buy-decoration-button');
    
    // Dodaj obsługę kliknięcia
    buyButtons.forEach(button => {
        // Usuń poprzednie event listenery
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Dodaj nowy event listener
        newButton.addEventListener('click', function() {
            const decorationItem = this.closest('.decoration-item');
            if (!decorationItem) return;
            
            const location = decorationItem.getAttribute('data-location');
            const decoration = decorationItem.getAttribute('data-decoration');
            
            console.log(`Próba zakupu dekoracji: ${decoration} dla lokacji: ${location}`);
            
            // Spróbuj kupić dekorację
            buyDecoration(location, decoration);
        });
    });
    
    // Aktualizuj stan przycisków na podstawie posiadanych przedmiotów
    updateBuyButtons();
}

// Aktualizacja wyglądu przycisków zakupu
function updateBuyButtons() {
    console.log("Aktualizacja wyglądu przycisków zakupu");
    
    // Pobierz wszystkie przyciski zakupu
    const decorationItems = document.querySelectorAll('.decoration-item');
    
    // Aktualizuj każdy element
    decorationItems.forEach(item => {
        const location = item.getAttribute('data-location');
        const decoration = item.getAttribute('data-decoration');
        
        // Pomiń, jeśli brakuje atrybutów
        if (!location || !decoration) return;
        
        // Sprawdź, czy dekoracja jest już posiadana
        const isOwned = gameState.decorations?.[location]?.[decoration]?.owned;
        
        // Pobierz przycisk
        const button = item.querySelector('.buy-decoration-button');
        if (!button) return;
        
        // Usuń poprzednie elementy informacji o wymaganiach
        const oldRequirement = item.querySelector('.decoration-requirement');
        if (oldRequirement) {
            oldRequirement.remove();
        }
        
        if (isOwned) {
            // Jeśli dekoracja jest już posiadana
            item.classList.add('owned');
            button.textContent = t('shop.buttons.purchased');
            button.disabled = true;
            button.classList.remove('locked-button');
            
            // Usuń ikonę kłódki, jeśli istnieje
            const lockIcon = button.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.remove();
            }
        } else {
            // Jeśli dekoracja nie jest posiadana
            item.classList.remove('owned');
            
            // Sprawdź warunki dla balonu (dekoracja C)
            let isLocked = false;
            if (decoration === 'balloon') {
                const hasBench = gameState.decorations?.[location]?.bench?.owned || false;
                const hasFountain = gameState.decorations?.[location]?.fountain?.owned || false;
                
                isLocked = !hasBench || !hasFountain;
                
                // Dodaj informację o wymaganiach dla balonu
                if (isLocked) {
                    const requirementInfo = document.createElement('div');
                    requirementInfo.className = 'decoration-requirement';
                    requirementInfo.textContent = t('shop.requirements.parkPremium');
                    requirementInfo.style.color = "#FF5722";
                    requirementInfo.style.fontStyle = "italic";
                    requirementInfo.style.fontSize = "12px";
                    requirementInfo.style.marginTop = "5px";
                    
                    // Dodaj element po opisie bonusu
                    const bonusElement = item.querySelector('.decoration-bonus');
                    if (bonusElement) {
                        bonusElement.parentNode.insertBefore(requirementInfo, bonusElement.nextSibling);
                    } else {
                        // Jeśli nie ma elementu bonusu, dodaj na końcu zawartości
                        const contentElement = item.querySelector('.decoration-content');
                        if (contentElement) {
                            contentElement.appendChild(requirementInfo);
                        }
                    }
                }
            }
            
            // NOWE: Sprawdź warunki dla paralotni (dekoracja C dla jeziora)
            if (decoration === 'paraglider') {
                const hasBoat = gameState.decorations?.[location]?.boat?.owned || false;
                const hasKite = gameState.decorations?.[location]?.kite?.owned || false;
                
                isLocked = !hasBoat || !hasKite;
                
                // Dodaj informację o wymaganiach dla paralotni
                if (isLocked) {
                    const requirementInfo = document.createElement('div');
                    requirementInfo.className = 'decoration-requirement';
                    requirementInfo.textContent = t('shop.requirements.lakePremium');
                    requirementInfo.style.color = "#FF5722";
                    requirementInfo.style.fontStyle = "italic";
                    requirementInfo.style.fontSize = "12px";
                    requirementInfo.style.marginTop = "5px";
                    
                    // Dodaj element po opisie bonusu
                    const bonusElement = item.querySelector('.decoration-bonus');
                    if (bonusElement) {
                        bonusElement.parentNode.insertBefore(requirementInfo, bonusElement.nextSibling);
                    } else {
                        // Jeśli nie ma elementu bonusu, dodaj na końcu zawartości
                        const contentElement = item.querySelector('.decoration-content');
                        if (contentElement) {
                            contentElement.appendChild(requirementInfo);
                        }
                    }
                }
            }
            
            // Sprawdź, czy gracz ma wystarczająco TON
            const price = gameState.decorations?.[location]?.[decoration]?.price || 0;
            const hasEnoughTON = gameState.resources.ton >= price;
            
            // Aktualizuj wygląd przycisku
            if (isLocked) {
                // Dla zablokowanej dekoracji
                button.innerHTML = `<i class="lock-icon">🔒</i> <span>${price.toFixed(3)} TON</span>`;
                button.disabled = true;
                button.classList.add('locked-button');
            } else {
                // Dla odblokowanej ale niekupionej dekoracji
                button.innerHTML = `<img src="assets/images/ton-icon.png" alt="TON" class="currency-icon-small"> <span>${price.toFixed(3)} TON</span>`;
                button.disabled = !hasEnoughTON;
                button.classList.remove('locked-button');
            }
        }
    });
    
    // Aktualizuj wyświetlane saldo TON w sklepie
    const shopBalance = document.getElementById('shop-ton-balance');
    if (shopBalance) {
        shopBalance.textContent = formatNumber(gameState.resources.ton || 0, 3) + " TON";
    }
}

// Funkcja zakupu dekoracji
function buyDecoration(location, decoration) {
    console.log(`Zakup dekoracji: ${decoration} dla lokacji: ${location}`);
    
    // Sprawdź, czy dekoracja istnieje
    if (!gameState.decorations?.[location]?.[decoration]) {
        console.error(`Dekoracja ${decoration} dla lokacji ${location} nie istnieje!`);
        showNotification(t('shop.notifications.decorationNotExist'));
        return false;
    }
    
    // Pobierz dekorację
    const decorationObj = gameState.decorations[location][decoration];
    
    // Sprawdź, czy dekoracja jest już posiadana
    if (decorationObj.owned) {
        showNotification(t('shop.notifications.alreadyOwned'));
        return false;
    }
    
    // Sprawdź warunki zakupu dla balonu (dekoracja C)
    if (decoration === 'balloon') {
        const hasBench = gameState.decorations?.[location]?.bench?.owned || false;
        const hasFountain = gameState.decorations?.[location]?.fountain?.owned || false;
        
        if (!hasBench || !hasFountain) {
            showNotification(t('shop.notifications.requiresParkBasic'));
            return false;
        }
    }
    
    // NOWE: Sprawdź warunki zakupu dla paralotni (dekoracja C dla jeziora)
    if (decoration === 'paraglider') {
        const hasBoat = gameState.decorations?.[location]?.boat?.owned || false;
        const hasKite = gameState.decorations?.[location]?.kite?.owned || false;
        
        if (!hasBoat || !hasKite) {
            showNotification(t('shop.notifications.requiresLakeBasic'));
            return false;
        }
    }
    
    // Sprawdź, czy gracz ma wystarczająco TON
    const price = decorationObj.price || 0;
    if (gameState.resources.ton < price) {
        showNotification(t('shop.notifications.notEnoughTon', { amount: price.toFixed(3) }));
        return false;
    }
    
    // Odejmij TON
    gameState.resources.ton = parseFloat((gameState.resources.ton - price).toFixed(3));
    
    // Oznacz dekorację jako posiadaną
    decorationObj.owned = true;
    
    // Zapisz stan gry
    saveGame();
    
    // Aktualizuj UI
    updateUI();
    updateBuyButtons();
    
    // Aktualizuj tło lokacji, jeśli jesteśmy w tej lokacji
    if (location === gameState.locations.currentLocation) {
        applyDecorations(location);
        
        // Dodano: Pokaż informację o aktywnych bonusach
        displayActiveBonuses(location);
    }

    // Zawsze aktualizuj obrazek na mapie - niezależnie od aktualnej lokacji
    updateLocationImage(location);

    // Aktualizuj cały UI mapy
    if (typeof updateMapUI === 'function') {
        updateMapUI();
    }
    
    // Pokaż powiadomienie
    const bonusType = decorationObj.bonus.type;
    let bonusText = '';
    
    if (bonusType === 'feedCost') {
        bonusText = t('shop.notifications.feedCostBonus', { value: decorationObj.bonus.value });
    } else if (bonusType === 'reward') {
        bonusText = t('shop.notifications.rewardBonus', { value: decorationObj.bonus.value });
    } else if (bonusType === 'feedTime') {
        bonusText = t('shop.notifications.feedTimeBonus', { value: decorationObj.bonus.value });
    }
    
    showNotification(t('shop.notifications.decorationPurchased', { name: decorationObj.name }) + bonusText);
    
    // Pokaż animację
    const button = document.querySelector(`.decoration-item[data-location="${location}"][data-decoration="${decoration}"] .buy-decoration-button`);
    if (button && typeof showRewardAnimation === 'function') {
        showRewardAnimation(t('shop.notifications.newDecoration'), button);
    }
    
    return true;
}

// Funkcja nakładająca dekoracje na lokację
function applyDecorations(location) {
    console.log(`Nakładanie dekoracji dla lokacji: ${location}`);
    
    // Pobierz ekran karmienia
    const feedScreen = document.getElementById('feed-screen');
    if (!feedScreen) return;
    
    // Pobierz konfigurację lokacji
    const locationConfig = gameState.locations.configs[location];
    if (!locationConfig) return;
    
    // Sprawdź posiadane dekoracje
    const hasDecorationA = gameState.decorations?.[location]?.bench?.owned || false;
    const hasDecorationB = gameState.decorations?.[location]?.fountain?.owned || false;
    const hasDecorationC = gameState.decorations?.[location]?.balloon?.owned || false;
    
    // Sprawdź dodatkowe dekoracje dla lokacji jeziora
    const hasLakeDecorationA = gameState.decorations?.lake?.boat?.owned || false;
    const hasLakeDecorationB = gameState.decorations?.lake?.kite?.owned || false;
    const hasLakeDecorationC = gameState.decorations?.lake?.paraglider?.owned || false;
    
    // Wybierz odpowiednie tło na podstawie kombinacji posiadanych dekoracji
    let bgSuffix = "";
    
    // Dla parku
    if (location === 'park') {
        // A + B + C
        if (hasDecorationA && hasDecorationB && hasDecorationC) {
            bgSuffix = "-abc";
        }
        // A + B
        else if (hasDecorationA && hasDecorationB) {
            bgSuffix = "-ab";
        }
        // Tylko A
        else if (hasDecorationA) {
            bgSuffix = "-a";
        }
        // Tylko B
        else if (hasDecorationB) {
            bgSuffix = "-b";
        }
    } 
    // Dla jeziora
    else if (location === 'lake') {
        // A + B + C
        if (hasLakeDecorationA && hasLakeDecorationB && hasLakeDecorationC) {
            bgSuffix = "-abc";
        }
        // A + B
        else if (hasLakeDecorationA && hasLakeDecorationB) {
            bgSuffix = "-ab";
        }
        // Tylko A
        else if (hasLakeDecorationA) {
            bgSuffix = "-a";
        }
        // Tylko B
        else if (hasLakeDecorationB) {
            bgSuffix = "-b";
        }
    }
    
    // Pobierz podstawową ścieżkę do tła
    let baseBackground = locationConfig.background;
    let newBackground = baseBackground;
    
    // Jeśli mamy jakieś dekoracje, zmodyfikuj ścieżkę do tła
    if (bgSuffix) {
        // Podziel ścieżkę na części, aby dodać sufiks przed rozszerzeniem
        const parts = baseBackground.split('.');
        const extension = parts.pop(); // pobierz rozszerzenie (.jpg, .png, itp.)
        const path = parts.join('.'); // złącz pozostałe części ścieżki
        
        // Utwórz nową ścieżkę z sufiksem
        newBackground = path + bgSuffix + '.' + extension;
    }
    
    // Ustaw nowe tło
    feedScreen.style.backgroundImage = `url('${newBackground}')`;
    console.log(`Ustawiono tło: ${newBackground} dla lokacji ${location}`);
    
    // Aktualizuj mapę lokacji
    updateLocationImage(location);
    
    // Dodatkowe sprawdzenie po ustawieniu
    setTimeout(() => {
        if (feedScreen.style.backgroundImage !== `url('${newBackground}')`) {
            console.warn(`UWAGA: Tło zostało nadpisane po ustawieniu w applyDecorations!`);
            // Próba ponownego ustawienia
            feedScreen.style.backgroundImage = `url('${newBackground}')`;
            // Aktualizuj mapę lokacji
            updateLocationImage(location);
        }
    }, 100);
    
    // Dodano: Wizualne dekoracje na ekranie (opcjonalne)
    addVisualDecorations(location, feedScreen);
}

// NOWA FUNKCJA: Dodawanie wizualnych dekoracji do ekranu karmienia
function addVisualDecorations(location, feedScreen) {
    // Usuń najpierw wszystkie istniejące dekoracje
    const existingDecorations = feedScreen.querySelectorAll('.screen-decoration');
    existingDecorations.forEach(dec => dec.remove());
    
    // Sprawdź lokację
    if (location === 'park') {
        // Dla parku
        const decorations = gameState.decorations?.park || {};
        
        // Dodaj ławkę
        if (decorations.bench?.owned) {
            const benchDeco = document.createElement('div');
            benchDeco.className = 'screen-decoration decoration-bench';
            benchDeco.style.backgroundImage = "url('assets/images/decorations/park-bench.png')";
            feedScreen.appendChild(benchDeco);
        }
        
        // Dodaj fontannę
        if (decorations.fountain?.owned) {
            const fountainDeco = document.createElement('div');
            fountainDeco.className = 'screen-decoration decoration-fountain';
            fountainDeco.style.backgroundImage = "url('assets/images/decorations/park-fountain.png')";
            feedScreen.appendChild(fountainDeco);
        }
        
        // Dodaj balon
        if (decorations.balloon?.owned) {
            const balloonDeco = document.createElement('div');
            balloonDeco.className = 'screen-decoration decoration-balloon';
            balloonDeco.style.backgroundImage = "url('assets/images/decorations/park-balloon.png')";
            feedScreen.appendChild(balloonDeco);
        }
    } else if (location === 'lake') {
        // Dla jeziora
        const decorations = gameState.decorations?.lake || {};
        
        // Dodaj łódkę
        if (decorations.boat?.owned) {
            const boatDeco = document.createElement('div');
            boatDeco.className = 'screen-decoration decoration-boat';
            boatDeco.style.backgroundImage = "url('assets/images/decorations/lake-boat.png')";
            feedScreen.appendChild(boatDeco);
        }
        
        // Dodaj latawiec
        if (decorations.kite?.owned) {
            const kiteDeco = document.createElement('div');
            kiteDeco.className = 'screen-decoration decoration-kite';
            kiteDeco.style.backgroundImage = "url('assets/images/decorations/lake-kite.png')";
            feedScreen.appendChild(kiteDeco);
        }
        
        // Dodaj paralotnię
        if (decorations.paraglider?.owned) {
            const paragliderDeco = document.createElement('div');
            paragliderDeco.className = 'screen-decoration decoration-paraglider';
            paragliderDeco.style.backgroundImage = "url('assets/images/decorations/lake-paraglider.png')";
            feedScreen.appendChild(paragliderDeco);
        }
    }
}

// Aktualizacja obrazka lokacji na mapie
function updateLocationImage(location) {
    console.log(`=== Aktualizacja obrazka lokacji na mapie: ${location} ===`);
    
    // Pobierz element obrazka lokacji na mapie
    const locationImage = document.querySelector(`.location-item[data-location="${location}"] .location-image-container img`);
    
    // Sprawdź czy element został znaleziony
    if (!locationImage) {
        console.error(`Nie znaleziono obrazka dla lokacji ${location} na mapie!`);
        console.log(`Selektor: .location-item[data-location="${location}"] .location-image-container img`);
        return;
    }
    
    console.log(`Znaleziono element obrazka: ${locationImage.src}`);
    
    // Sprawdź posiadane dekoracje
    let hasDecorationA, hasDecorationB, hasDecorationC;
    
    if (location === 'park') {
        hasDecorationA = gameState.decorations?.[location]?.bench?.owned || false;
        hasDecorationB = gameState.decorations?.[location]?.fountain?.owned || false;
        hasDecorationC = gameState.decorations?.[location]?.balloon?.owned || false;
    } else if (location === 'lake') {
        hasDecorationA = gameState.decorations?.[location]?.boat?.owned || false;
        hasDecorationB = gameState.decorations?.[location]?.kite?.owned || false;
        hasDecorationC = gameState.decorations?.[location]?.paraglider?.owned || false;
    } else {
        hasDecorationA = false;
        hasDecorationB = false;
        hasDecorationC = false;
    }
    
    console.log(`Stan dekoracji dla ${location}: A=${hasDecorationA}, B=${hasDecorationB}, C=${hasDecorationC}`);
    
    // Podstawowa nazwa pliku obrazka
    let imageName = `${location}-image`;
    
    // Ustal sufiks na podstawie posiadanych dekoracji
    if (hasDecorationA && hasDecorationB && hasDecorationC) {
        imageName = `${location}-decorated-abc`;
    } else if (hasDecorationA && hasDecorationB) {
        imageName = `${location}-decorated-ab`;
    } else if (hasDecorationA) {
        imageName = `${location}-decorated-a`;
    } else if (hasDecorationB) {
        imageName = `${location}-decorated-b`;
    }
    
    // Ustaw nowy obrazek
    const newSrc = `assets/images/locations/${imageName}.jpg`;
    locationImage.src = newSrc;
    console.log(`Ustawiono obrazek mapy: ${newSrc}`);
    
    // Sprawdź czy obrazek istnieje
    const testImg = new Image();
    testImg.onerror = () => console.error(`BŁĄD: Obrazek ${newSrc} nie istnieje!`);
    testImg.onload = () => console.log(`OK: Obrazek ${newSrc} załadowany pomyślnie`);
    testImg.src = newSrc;
}

// Funkcja do zastosowania bonusów z dekoracji
function applyDecorationBonuses(location, value, bonusType) {
    console.log(`Aplikowanie bonusów dekoracji dla lokacji ${location}, typ: ${bonusType}`);
    
    // Sprawdź, czy mamy dekoracje dla tej lokacji
    if (!gameState.decorations?.[location]) return value;
    
    // Oblicz całkowity bonus procentowy dla danego typu
    let totalBonusPercent = 0;
    
    Object.keys(gameState.decorations[location]).forEach(decId => {
        const decoration = gameState.decorations[location][decId];
        if (decoration.owned && decoration.bonus && decoration.bonus.type === bonusType) {
            totalBonusPercent += decoration.bonus.value;
        }
    });
    
    // Zastosuj bonus w zależności od typu
    switch(bonusType) {
        case "feedCost":
            // Zmniejszenie kosztu karmienia (np. o 10%)
            return Math.max(1, Math.floor(value * (1 - totalBonusPercent / 100)));
        case "reward":
            // Zwiększenie nagrody (np. o 10%)
            return Math.ceil(value * (1 + totalBonusPercent / 100));
        case "feedTime":
            // Zmniejszenie czasu karmienia (np. o 10%)
            return Math.max(1, Math.floor(value * (1 - totalBonusPercent / 100)));
        default:
            return value;
    }
}

// Modyfikacja funkcji karmienia ptaka, aby uwzględniała bonusy z dekoracji
// i poprawnie obsługiwała mityczne ptaki
const originalFeedBird = window.feedBird || function() {};
window.feedBird = function(slotIndex, locationId) {
    console.log("Zmodyfikowana funkcja feedBird z bonusami dekoracji");
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    slotIndex = parseInt(slotIndex, 10);
    
    // Pobierz slot z konkretnej lokacji
    const slot = gameState.locationSlots[locationId][slotIndex];
    
    if (!slot.isActive || slot.isFeeding || slot.needsCollection) {
        console.log("Slot nie spełnia warunków do karmienia:", slot);
        return false;
    }
    
    // Pobierz konfigurację lokacji
    const locationConfig = gameState.locations.configs[locationId];
    
    // Własna implementacja dla mitycznych ptaków
    if (slot.birdType === 'mythical') {
        console.log("Karmienie mitycznego ptaka - używamy owoców!");
        
        // Koszt w owocach zależy od lokacji
        let fruitCost = 1; // domyślnie 1 owoc
        if (locationId === 'lake') {
            fruitCost = 3; // 3 owoce dla jeziora
        } else if (locationId === 'forest') {
            fruitCost = 5; // 5 owoców dla lasu
        }
        
        console.log(`Koszt karmienia mitycznego ptaka: ${fruitCost} owoców w lokacji ${locationId}`);
        
        // Sprawdź czy mamy wystarczająco owoców
        if (gameState.resources.fruits >= fruitCost) {
            // Odejmij owoce
            gameState.resources.fruits -= fruitCost;
            
            // Aktualizacja licznika owoców
            requestAnimationFrame(() => {
                document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
            });
            
            // Kontynuuj karmienie
            slot.isFeeding = true;
            
            // NAPRAWIONE: Zastosuj bonusy czasu karmienia również dla mitycznych ptaków
            let feedTime = locationConfig.birdTimes[slot.birdType];
            
            // Sprawdź bonus z dekoracji do czasu karmienia
            if (gameState.decorations && gameState.decorations[locationId]) {
                let timeBonus = 0;
                Object.keys(gameState.decorations[locationId]).forEach(decId => {
                    const decoration = gameState.decorations[locationId][decId];
                    if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedTime") {
                        timeBonus += decoration.bonus.value;
                    }
                });
                
                if (timeBonus > 0) {
                    feedTime = Math.max(1, Math.floor(feedTime * (1 - timeBonus / 100)));
                    console.log(`[SHOP.JS] Czas karmienia mitycznego ptaka po zastosowaniu bonusów: ${feedTime} (lokacja: ${locationId})`);
                    // Pokaż komunikat o bonusie
                    showNotification(t('shop.notifications.mythicalBirdBonus', { bonus: timeBonus }));
                }
            }
            
            slot.remainingTime = feedTime;
            
            // Aktualizacja postępu misji "Nakarm ptaki"
            updateMissionProgress('feedBirds', 1);
            
            // Aktualizacja statystyk
            gameState.stats.totalBirdsFed += 1;
            
            updateUI();
            saveGame();
            
            // Aktualizuj UI slotu z ptakiem - tylko jeśli jest to bieżąca lokacja
            if (locationId === gameState.locations.currentLocation) {
                const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
                if (slotElement) {
                    updateBirdSlotUI(slotElement, slotIndex);
                }
            }
            
            // Aktualizuj przyciski akcji zbiorowych
            if (typeof updateAllActionButtons === 'function') {
                updateAllActionButtons();
            }
            
            // Aktualizuj znacznik misji
            updateMissionBadge();
            
            return true;
        } else {
            showNotification(t('notifications.notEnoughFruitsForMythical', { amount: fruitCost }));
            return false;
        }
    } else {
        // Dla zwykłych ptaków - używamy ziarenek z bonusami
        // Pobierz oryginalny koszt z konfiguracji
        const originalCost = locationConfig.birdCosts[slot.birdType];
        
        // Zastosuj bonusy z dekoracji do kosztu karmienia - POPRAWIONA WERSJA
        // Najpierw sprawdźmy czy dekoracja jest faktycznie zakupiona
        let finalCost = originalCost;
        
        console.log(`Początkowy koszt karmienia: ${originalCost} dla lokacji: ${locationId}`);
        
        // Sprawdź, czy mamy dekoracje dla tej lokacji
        if (gameState.decorations && gameState.decorations[locationId]) {
            let totalBonusPercent = 0;
            
            Object.keys(gameState.decorations[locationId]).forEach(decId => {
                const decoration = gameState.decorations[locationId][decId];
                if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedCost") {
                    totalBonusPercent += decoration.bonus.value;
                    console.log(`Znaleziono dekorację ${decId} z bonusem ${decoration.bonus.value}%`);
                }
            });
            
            // Zastosuj zniżkę do kosztu karmienia
            if (totalBonusPercent > 0) {
                console.log(`Całkowity bonus do kosztu karmienia: -${totalBonusPercent}%`);
                finalCost = Math.max(1, Math.floor(originalCost * (1 - totalBonusPercent / 100)));
                console.log(`Nowy koszt po zastosowaniu bonusu: ${finalCost} (stary: ${originalCost})`);
            }
        }
        
        console.log(`Sprawdzam wystarczającą ilość ziarenek: ${gameState.resources.seeds} >= ${finalCost}`);
        
        if (gameState.resources.seeds >= finalCost) {
            // Odejmij ziarenka z FINALNYM kosztem (zmniejszonym o bonus)
            gameState.resources.seeds -= finalCost;
            
            // Natychmiastowa aktualizacja licznika ziarenek
            requestAnimationFrame(() => {
                document.getElementById('seed-count').textContent = gameState.resources.seeds;
            });
            
            slot.isFeeding = true;
            
            // Zastosuj bonusy z dekoracji do czasu karmienia
            let feedTime = locationConfig.birdTimes[slot.birdType];
            
            // Oblicz bezpośrednio bonus do czasu karmienia
            if (gameState.decorations && gameState.decorations[locationId]) {
                let timeBonus = 0;
                Object.keys(gameState.decorations[locationId]).forEach(decId => {
                    const decoration = gameState.decorations[locationId][decId];
                    if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedTime") {
                        timeBonus += decoration.bonus.value;
                    }
                });
                
                if (timeBonus > 0) {
                    feedTime = Math.max(1, Math.floor(feedTime * (1 - timeBonus / 100)));
                    console.log(`Czas karmienia po zastosowaniu bonusów: ${feedTime} (lokacja: ${locationId})`);
                }
            }
            
            slot.remainingTime = feedTime;
            
            // Aktualizacja postępu misji "Nakarm ptaki"
            updateMissionProgress('feedBirds', 1);
            
            // Jeśli ptak jest epickim ptakiem, aktualizuj również misję tygodniową
            if (slot.birdType === 'epic') {
                updateWeeklyMissionProgress('feedEpicBirds', 1);
            }
            
            // Aktualizacja statystyk
            gameState.stats.totalBirdsFed += 1;
            
            updateUI();
            saveGame();
            
            // Aktualizuj UI slotu z ptakiem - tylko jeśli jest to bieżąca lokacja
            if (locationId === gameState.locations.currentLocation) {
                const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
                if (slotElement) {
                    updateBirdSlotUI(slotElement, slotIndex);
                }
            }
            
            // Aktualizuj przyciski akcji zbiorowych
            if (typeof updateAllActionButtons === 'function') {
                updateAllActionButtons();
            }
            
            // Aktualizuj znacznik misji
            updateMissionBadge();
            
            return true;
        }
        
        showNotification(t('notifications.notEnoughSeeds', { amount: finalCost }));
        return false;
    }
};

// UWAGA: Funkcja została przeniesiona do game.js
// Aby uniknąć konfliktów, ta funkcja tylko wywołuje oryginalną funkcję
const originalCollectBirdReward = window.collectBirdReward;
window.collectBirdReward = function(slotIndex, locationId) {
    console.log("Przekierowuję do oryginalnej funkcji collectBirdReward");
    return originalCollectBirdReward(slotIndex, locationId);
};

// Bezpośrednia inicjalizacja przycisku - ZWIĘKSZONA KOMPATYBILNOŚĆ
window.addEventListener('load', function() {
    console.log("=== Inicjalizacja sklepu po załadowaniu strony ===");
    
    // Funkcja pomocnicza do naprawy przycisku sklepu
    const fixShopButton = function() {
        console.log("Naprawiam przycisk sklepu...");
        
        const shopButton = document.getElementById('shop-button');
        if (shopButton) {
            // Usuń wszystkie poprzednie handlery
            const newButton = shopButton.cloneNode(true);
            shopButton.parentNode.replaceChild(newButton, shopButton);
            
            // Dodaj bezpośredni handler
            newButton.onclick = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                console.log("Kliknięto przycisk sklepu (onclick)");
                showShopScreen();
                return false;
            };
            
            // Dodaj również addEventListener
            newButton.addEventListener('click', function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                console.log("Kliknięto przycisk sklepu (addEventListener)");
                showShopScreen();
            });
            
            console.log("Przycisk sklepu naprawiony!");
        } else {
            console.error("Nie znaleziono przycisku sklepu!");
        }
    };
    
    // Uruchom naprawę natychmiast i co 2 sekundy
    fixShopButton();
    setInterval(fixShopButton, 2000);
    
    // Dodaj też globalną funkcję do ręcznego naprawienia
    window.fixShopButton = fixShopButton;
    
    // NOWA FUNKCJA: Naprawa przycisku powrotu
    const fixShopBackButton = function() {
        const backButton = document.getElementById('shop-back-button');
        if (backButton) {
            // Usuń wszystkie poprzednie handlery
            const newButton = backButton.cloneNode(true);
            backButton.parentNode.replaceChild(newButton, backButton);
            
            // Dodaj bezpośredni handler
            newButton.onclick = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                console.log("Kliknięto przycisk powrotu w sklepie (onclick)");
                hideAndShowScreen('feed-screen');
                return false;
            };
            
            // Dodaj również addEventListener
            newButton.addEventListener('click', function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                console.log("Kliknięto przycisk powrotu w sklepie (addEventListener)");
                hideAndShowScreen('feed-screen');
            });
            
            console.log("Przycisk powrotu w sklepie naprawiony!");
        }
    };
    
    // Uruchom naprawę przycisków co 2 sekundy
    setInterval(function() {
        fixShopButton();
        fixShopBackButton();
    }, 2000);
    
    // Dodaj globalną funkcję naprawy
    window.fixShopBackButton = fixShopBackButton;
});

// Dodaj listener dla załadowanej gry
document.addEventListener('DOMContentLoaded', function() {
    // Daj czas na załadowanie innych skryptów
    setTimeout(function() {
        console.log("DOMContentLoaded - inicjalizacja sklepu");
        initShop();
        
        // Dodatkowe wywołanie dla pewności
        ensureDecorationsExist();
        
        // Zastosuj dekoracje dla bieżącej lokacji
        if (typeof applyDecorations === 'function' && gameState && gameState.locations) {
            console.log("Stosowanie dekoracji po DOMContentLoaded");
            applyDecorations(gameState.locations.currentLocation);
            
            // Dodano: Pokaż informację o aktywnych bonusach
            displayActiveBonuses(gameState.locations.currentLocation);
        }
    }, 1000);
});

// Obsługa zdarzenia załadowania gry
document.addEventListener('gameLoaded', function() {
    initShop();


// Napraw przycisk powrotu po załadowaniu
    setTimeout(function() {
        const backButton = document.getElementById('shop-back-button');
        if (backButton) {
            backButton.onclick = function() {
                hideAndShowScreen('feed-screen');
                return false;
            };
        }
    }, 500);


    
    // NOWY KOD: Napraw przycisk powrotu po załadowaniu gry
    setTimeout(function() {
        fixShopBackButton();
    }, 500);
    
    // Zastosuj dekoracje na aktualną lokację
    applyDecorations(gameState.locations.currentLocation);
    
    // Dodano: Pokaż informację o aktywnych bonusach
    displayActiveBonuses(gameState.locations.currentLocation);
});

// Obsługa zmiany lokacji
const originalChangeLocation = window.changeLocation || function() {};
window.changeLocation = function(locationId) {
    const result = originalChangeLocation(locationId);
    
    // Po zmianie lokacji, zastosuj dekoracje
    if (result) {
        setTimeout(() => {
            applyDecorations(locationId);
            
            // Dodano: Pokaż informację o aktywnych bonusach
            displayActiveBonuses(locationId);
        }, 500);
    }
    
    return result;
};

// Funkcja pomocnicza do debugowania ładowania obrazków
window.debugLocationImages = function() {
    console.log("=== DEBUG OBRAZKÓW LOKACJI ===");
    // Sprawdź podstawowe obrazki
    ['park-image.jpg', 'lake-image.jpg', 'forest-image.jpg'].forEach(filename => {
        const img = new Image();
        img.onload = () => console.log(`✓ Obrazek assets/images/locations/${filename} załadowany poprawnie`);
        img.onerror = () => console.error(`✗ Błąd ładowania obrazka assets/images/locations/${filename}`);
        img.src = `assets/images/locations/${filename}`;
    });
    
    // Sprawdź dekorowane obrazki parku
    ['park-decorated-a.jpg', 'park-decorated-b.jpg', 'park-decorated-ab.jpg', 'park-decorated-abc.jpg'].forEach(filename => {
        const img = new Image();
        img.onload = () => console.log(`✓ Obrazek assets/images/locations/${filename} załadowany poprawnie`);
        img.onerror = () => console.error(`✗ Błąd ładowania obrazka assets/images/locations/${filename}`);
        img.src = `assets/images/locations/${filename}`;
    });
    
    console.log("==============================");
    
    // Sprawdź aktualny stan elementów UI
    const parkImage = document.querySelector('.location-item[data-location="park"] .location-image-container img');
    if (parkImage) {
        console.log("Aktualny src obrazka parku:", parkImage.src);
    } else {
        console.error("Nie znaleziono elementu obrazka parku w DOM");
    }
};

// Eksportuj funkcje do globalnego zakresu
window.showShopScreen = showShopScreen;
window.applyDecorations = applyDecorations;
window.buyDecoration = buyDecoration;
window.displayActiveBonuses = displayActiveBonuses;
window.applyDecorationBonusesToFeedCost = applyDecorationBonusesToFeedCost;
window.applyDecorationBonusesToFeedTime = applyDecorationBonusesToFeedTime;
window.applyDecorationBonusesToReward = applyDecorationBonusesToReward;
window.fixShopBackButton = fixShopBackButton;