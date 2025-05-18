
// ===== SYSTEM EKSPEDYCJI =====
console.log(t('expeditions.logs.initialization'));

// Główny obiekt zarządzający ekspedycjami
const ExpeditionsModule = {
    // Inicjalizacja modułu
    init: function() {
        console.log(t('expeditions.logs.moduleInit'));
        this.setupEventListeners();
        
        // Dodajemy style CSS dla ekspedycji
        this.addExpeditionStyles();
        
        // Stan aktywnej ekspedycji
        this.activeExpedition = null;
        
        // Flaga informująca o oczekujących nagrodach
        this.pendingRewards = false;
        
        // Sprawdź, czy mamy zapisaną ekspedycję w localStorage
        this.checkPendingExpedition();
        
        // Ustaw obsługę nawigacji - DODANE
        this.setupNavigationHandlers();
        
        // Dodaj obserwator zmian ekranu - NOWE
        this.setupScreenChangeObserver();
        
        // Dodaj style dla odznaki powiadomień
        this.addNotificationBadgeStyles();

        // DODANE: Poprawka dla przycisku szafy - zawsze działa
        this.ensureWardrobeButtonWorks();
    },
    
    // NOWA FUNKCJA: Zapewnienie działania przycisku szafy
    ensureWardrobeButtonWorks: function() {
        console.log(t('expeditions.logs.wardrobeButtonCheck'));
        
        // Znajdź wszystkie przyciski szafy
        const wardrobeButtons = document.querySelectorAll('.wardrobe-button');
        
        if (wardrobeButtons.length > 0) {
            wardrobeButtons.forEach(button => {
                // Usuń istniejące listenery
                const newButton = button.cloneNode(true);
                if (button.parentNode) {
                    button.parentNode.replaceChild(newButton, button);
                }
                
                // Dodaj nowy listener
                newButton.addEventListener('click', function() {
                    console.log(t('expeditions.logs.wardrobeButtonClicked'));
                    
                    // Pokazuj ekran szafy ZAWSZE, blokowanie zmiany skinów nastąpi w samym ekranie
                    if (typeof window.WardrobeModule !== 'undefined' && 
                        typeof window.WardrobeModule.showWardrobeScreen === 'function') {
                        window.WardrobeModule.showWardrobeScreen();
                    } else {
                        // Backup - jeśli moduł szafy nie jest dostępny
                        const wardrobeScreen = document.getElementById('wardrobe-screen');
                        if (wardrobeScreen) {
                            document.querySelectorAll('.game-screen').forEach(screen => {
                                screen.classList.remove('active');
                            });
                            wardrobeScreen.classList.add('active');
                        }
                    }
                });
            });
        }
    },

    // Dodanie stylów dla odznaki powiadomień
    addNotificationBadgeStyles: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .nav-badge {
               position: absolute;
    top: 4px;
    right: 6px;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    display: none;
    z-index: 10;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Dodanie stylów CSS dla ekspedycji
    addExpeditionStyles: function() {
        const styles = document.createElement('style');
        styles.innerHTML = `
            .expedition-item {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                margin-bottom: 20px !important;
                overflow: hidden;
            }
            
            .expedition-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
            }
            
            .expedition-image-container::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%);
            }
            
            .start-expedition-button {
                transition: background-color 0.2s ease;
            }
            
            .start-expedition-button:hover {
                background-color: #7B1FA2 !important;
            }
            
            .rewards-tag {
                background-color: #9C27B0;
                color: white;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .cost-badge {
                background-color: #f5f5f5;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 4px 8px;
                display: flex;
                align-items: center;
                margin-top: 8px;
                justify-content: center;
            }
            
            .expedition-title {
                color: #9C27B0 !important;
                font-weight: bold !important;
                text-shadow: 0px 1px 2px rgba(0,0,0,0.1);
            }
            
            .expedition-rewards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 5px;
                width: 100%;
                margin-top: 5px;
            }
            
            .expedition-reward-item {
                background-color: #f9f9f9;
                border-radius: 5px;
                padding: 3px 5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
         /* Style dla ekranu aktywnej ekspedycji */

#active-expedition-screen {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: url('assets/images/breeding-bg.jpg');
    background-size: cover;
    background-position: center;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
   
    
    box-sizing: border-box;
}

#active-expedition-screen.show {
    display: flex !important;
}

/* Upewnij się, że pasek nawigacji jest zawsze widoczny */
#active-expedition-screen #navigation-bar,
body > #navigation-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1020; /* Wyższy z-index niż ekran ekspedycji */
}

     .expedition-home-button {
        position: fixed;
        top: 63px; /* Pozycja pod resource barem, który ma około 60px wysokości */
        left: 15px;
        background-color: #408cc7;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1050; /* Wysoki z-index, aby był ponad innymi elementami */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        font-size: 14px;
    }

    .expedition-home-button:hover {
        background-color: #2a6ea8;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
/* Poprawione style dla kontenera ekspedycji - NAPRAWIONE WYŚRODKOWANIE */
.expedition-progress-container {
    margin: 25px auto !important;
    position: relative;
    width: calc(100% - 40px) !important;
    max-width: 500px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-sizing: border-box !important;
}
            
            .expedition-title {
                font-size: 22px;
                color: #9C27B0;
                margin-bottom: 5px;
                text-align: center;
            }
            
            .expedition-description {
                color: #555;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .expedition-timer {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
            }
            
            .bird-animation-container {
                width: 100%;
                height: 80px;
                position: relative;
                margin-bottom: 10px;
            }
            
            .flying-bird {
                width: 140px;
                height: 70px;
                background-image: url('./assets/images/forest-expedition.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                position: absolute;
                top: 5px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .expedition-progress-bar-container {
                width: 100%;
                height: 20px;
                background-color: #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 20px;
            }
            
            .expedition-progress-bar {
                width: 0%;
                height: 100%;
                background: linear-gradient(to right, #9C27B0, #E040FB);
                transition: width 1s linear;
            }
            
            .expedition-cancel-button {
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
                margin-top: 15px;
            }
            
            .expedition-cancel-button:hover {
                background-color: #d32f2f;
            }
            
            .expedition-rewards-preview {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
                justify-content: center;
            }
            
            .expedition-reward-preview {
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 8px;
                padding: 5px 10px;
                display: flex;
                align-items: center;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .expedition-reward-preview img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }
            
            /* Style dla ekranu nagród */
            .expedition-rewards-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1100;
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .expedition-rewards-container {
                background-color: white;
                border-radius: 15px;
                padding: 25px;
                max-width: 80%;
                width: 350px;
                text-align: center;
                box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
            }
            
            .expedition-rewards-title {
                font-size: 24px;
                color: #9C27B0;
                margin-bottom: 20px;
                font-weight: bold;
            }
            
            .expedition-rewards-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 25px;
            }
            
            .expedition-reward-item-large {
                display: flex;
                align-items: center;
                background-color: #f5f5f5;
                padding: 12px 15px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .expedition-reward-icon {
                width: 40px;
                height: 40px;
                margin-right: 15px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
            
            .expedition-reward-details {
                flex: 1;
                text-align: left;
            }
            
            .expedition-reward-amount {
                font-size: 18px;
                font-weight: bold;
                color: #333;
            }
            
            .expedition-reward-label {
                font-size: 14px;
                color: #666;
            }
            
            .collect-rewards-button {
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 10px;
                padding: 12px 25px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;
            }
            
            .collect-rewards-button:hover {
                background-color: #45a049;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(styles);
    },
    
    // Ustawienie obsługi zdarzeń
    setupEventListeners: function() {
        console.log(t('expeditions.logs.eventListeners'));
        
        // Obsługa przycisku powrotu
        const backButton = document.getElementById('expeditions-back-button');
        if (backButton) {
            backButton.addEventListener('click', function() {
                // Ukryj ekran ekspedycji
                const expeditionsScreen = document.getElementById('expeditions-screen');
                if (expeditionsScreen) {
                    expeditionsScreen.classList.remove('active');
                }
                
                // Pokaż ekran hodowli
                const breedingScreen = document.getElementById('breeding-screen');
                if (breedingScreen) {
                    breedingScreen.classList.add('active');
                }
                
                // Sprawdź czy powinna być pokazana aktywna ekspedycja zamiast ekranu hodowli
                setTimeout(() => {
                    ExpeditionsModule.checkAndShowActiveExpedition();
                }, 100);
            });
        }
        
        // Obsługa przycisku ekspedycji
        const expeditionsButton = document.getElementById('expeditions-button');
        if (expeditionsButton) {
            expeditionsButton.addEventListener('click', function() {
                // Ukryj ekran hodowli
                const breedingScreen = document.getElementById('breeding-screen');
                if (breedingScreen) {
                    breedingScreen.classList.remove('active');
                }
                
                // Pokaż ekran ekspedycji
                const expeditionsScreen = document.getElementById('expeditions-screen');
                if (expeditionsScreen) {
                    expeditionsScreen.classList.add('active');
                    
                    // Aktualizuj informacje o ptaku
                    ExpeditionsModule.updateExpeditionUI();
                }
            });
        }
        
        // Dodajemy obserwator mutacji, który będzie przechwytywał dodanie przycisku ekspedycji
        this.setupExpeditionButtonsObserver();
    },
    
    // Obserwator dla zmian ekranu - NOWA FUNKCJA
    setupScreenChangeObserver: function() {
        // Obserwuj zmiany aktywnego ekranu
        const gameScreens = document.querySelectorAll('.game-screen');
        
        gameScreens.forEach(screen => {
            // Obserwuj zmiany klasy (wykrywanie aktywacji ekranu)
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        // Sprawdź czy ekran stał się aktywny
                        if (screen.classList.contains('active')) {
                            // Jeśli aktywowano ekran hodowli, sprawdź czy nie powinien być pokazany ekran ekspedycji
                            if (screen.id === 'breeding-screen') {
                                this.checkAndShowActiveExpedition();
                            }
                        }
                    }
                });
            });
            
            observer.observe(screen, { attributes: true });
        });
        
        console.log("Ustawiono obserwator zmian ekranu");
    },
    
    // Sprawdź czy powinna być pokazana aktywna ekspedycja - NOWA FUNKCJA
    checkAndShowActiveExpedition: function() {
        // Sprawdź czy istnieje aktywna ekspedycja
        if (this.activeExpedition) {
            console.log("Wykryto aktywną ekspedycję - pokazuję ekran ekspedycji zamiast ekranu hodowli");
            
            // Sprawdź czy ekspedycja nie zakończyła się już
            if (this.activeExpedition.endTime <= Date.now()) {
                // Ekspedycja zakończona - ustaw flagę oczekujących nagród
                this.pendingRewards = true;
                
                // Zapisz informację o oczekujących nagrodach w localStorage
                try {
                    localStorage.setItem('pendingExpeditionRewards', 'true');
                } catch (e) {
                    console.error(t('expeditions.errors.errorSavingState', { error: e }));
                }
                
                // Pokaż odznakę powiadomień przy przycisku Gniazdo
                this.showNavigationBadge(true);
                
                // Pokaż powiadomienie dla gracza
                showNotification(t('expeditions.notifications.expeditionCompleted'), 5000);
                
                // Pokaż ekran nagród tylko jeśli kliknięto bezpośrednio na przycisk Gniazdo
                const clickedButton = event?.target?.closest('.nav-button[data-screen="breeding-screen"]');
                if (clickedButton) {
                    // Przygotuj ekran nagród
                    this.prepareRewardsScreen();
                    
                    // Pokaż ekran nagród
                    const rewardsScreen = document.getElementById('expedition-rewards-screen');
                    if (rewardsScreen) {
                        rewardsScreen.style.display = 'flex';
                    }
                    
                    return true;
                }
                
                return false;
            } else {
                // Ekspedycja w trakcie - pokaż ekran aktywnej ekspedycji
                this.showActiveExpeditionScreen();
                return true;
            }
        }
        
        // Sprawdź, czy są oczekujące nagrody (ekspedycja się zakończyła, ale nagrody nie zostały odebrane)
        if (this.pendingRewards || localStorage.getItem('pendingExpeditionRewards') === 'true') {
            // Pokaż odznakę powiadomień przy przycisku Gniazdo
            this.showNavigationBadge(true);
            
            // Pokaż ekran nagród tylko jeśli kliknięto bezpośrednio na przycisk Gniazdo
            const clickedButton = event?.target?.closest('.nav-button[data-screen="breeding-screen"]');
            if (clickedButton) {
                // Przygotuj ekran nagród
                this.prepareRewardsScreen();
                
                // Pokaż ekran nagród
                const rewardsScreen = document.getElementById('expedition-rewards-screen');
                if (rewardsScreen) {
                    rewardsScreen.style.display = 'flex';
                }
                
                return true;
            }
        }
        
        return false;
    },
    





    
    // Obserwator dla dynamicznie dodawanych przycisków ekspedycji
    setupExpeditionButtonsObserver: function() {
        // Tworzymy obserwator dla zmian w DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Przeszukaj dodane węzły w poszukiwaniu nowych przycisków ekspedycji
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const startButtons = node.querySelectorAll('.start-expedition-button');
                            if (startButtons.length > 0) {
                                startButtons.forEach((button) => {
                                    // Ustawienie przycisku ekspedycji
                                    this.setupExpeditionButton(button);
                                });
                            }
                        }
                    });
                }
            });
        });
        
        // Rozpocznij obserwację kontenera ekspedycji
        const expeditionsList = document.querySelector('.expeditions-list');
        if (expeditionsList) {
            observer.observe(expeditionsList, { childList: true, subtree: true });
        }
    },
    












    
    // Konfiguracja przycisku ekspedycji - POPRAWIONA FUNKCJA
    setupExpeditionButton: function(button) {
        // Dodajemy bezpośrednio onclick, bez klonowania elementu
        console.log(t('expeditions.logs.buttonSetup', { button: button }));
        
        // Najpierw usuwamy istniejące listenery poprzez ustawienie pustego onclick
        button.onclick = null;
        
        // Dodajemy nowy listener
        const self = this; // Zapisujemy referencję do this
        button.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Pobierz ID ekspedycji bezpośrednio z przycisku lub z nadrzędnego elementu
            const expeditionItem = this.closest('.expedition-item');
            if (!expeditionItem) {
                console.error(t('expeditions.errors.expeditionNotFound', { id: 'unknown' }));
                return;
            }
            
            const expeditionId = expeditionItem.getAttribute('data-expedition-id');
            console.log(t('expeditions.logs.buttonClicked', { id: expeditionId }));
            
            // Wywołaj metodę rozpoczęcia ekspedycji z poprawnym kontekstem
            self.startExpedition(expeditionId);
        };
    },
    
    // Aktualizacja UI ekspedycji
    updateExpeditionUI: function() {
        console.log(t('expeditions.logs.uiUpdate'));
        
        // Aktualizuj poziom ptaka
        const petLevelSpan = document.getElementById('expedition-pet-level');
        if (petLevelSpan && gameState.petBird) {
            petLevelSpan.textContent = gameState.petBird.level || 0;
        }
        
        // Sprawdź dostępność ekspedycji
        const availabilityStatus = this.checkAvailability();
        console.log(t('expeditions.logs.availabilityStatus', { status: availabilityStatus.available ? 'available' : 'unavailable' }));
        
        // Pobierz kontener listy ekspedycji
        const expeditionsList = document.querySelector('.expeditions-list');
        if (!expeditionsList) {
            console.error("Nie znaleziono kontenera listy ekspedycji!");
            return;
        }
        
        // Wyczyść istniejące elementy
        expeditionsList.innerHTML = '';
        
        if (availabilityStatus.available) {
            // Ekspedycje są dostępne, pokaż listę ekspedycji
            
            // 1. Krótka ekspedycja (2h) - Bezpłatna
            const shortExpedition = this.createExpeditionElement({
                id: 'short',
                title: t('expeditions.expeditionTypes.short.title'),
                description: t('expeditions.expeditionTypes.short.description'),
                duration: t('expeditions.expeditionTypes.short.duration'),
                durationInSeconds: 120, // 2 godziny
                imageSrc: 'assets/images/expeditions/forest-expedition.png',
                rewards: [
                    { type: 'seeds', amount: '500-800', guaranteed: true },
                    { type: 'coins', amount: '10-50', guaranteed: true },
                    { type: 'distance', amount: '10m', guaranteed: true }
                ],
                cost: { type: 'free' } // Bezpłatna
            });
            expeditionsList.appendChild(shortExpedition);
            
            // 2. Średnia ekspedycja (6h) - 2 owoce
            const mediumExpedition = this.createExpeditionElement({
                id: 'medium',
                title: t('expeditions.expeditionTypes.medium.title'),
                description: t('expeditions.expeditionTypes.medium.description'),
                duration: t('expeditions.expeditionTypes.medium.duration'),
                durationInSeconds: 240, // 6 godzin
                imageSrc: 'assets/images/expeditions/cave-expedition.png',
                rewards: [
                    { type: 'seeds', amount: '900-1500', guaranteed: true },
                    { type: 'coins', amount: '200-300', guaranteed: true },
                    { type: 'fruit', amount: '0-1', guaranteed: false },
                    { type: 'distance', amount: '50m', guaranteed: true }
                ],
                cost: { type: 'fruit', amount: 2 } // Koszt: 2 owoce
            });
            expeditionsList.appendChild(mediumExpedition);
            
            // 3. Długa ekspedycja (14h) - 5 owoców
            const longExpedition = this.createExpeditionElement({
                id: 'long',
                title: t('expeditions.expeditionTypes.long.title'),
                description: t('expeditions.expeditionTypes.long.description'),
                duration: t('expeditions.expeditionTypes.long.duration'),
                durationInSeconds: 480, // 14 godzin
                imageSrc: 'assets/images/expeditions/mountains-expedition.png',
                rewards: [
                    { type: 'fruit', amount: '0-2', guaranteed: false },
                    { type: 'ton', amount: '0.001-0.005', guaranteed: true },
                    { type: 'distance', amount: '100-200m', guaranteed: true }
                ],
                cost: { type: 'fruit', amount: 5 } // Koszt: 5 owoców
            });
            expeditionsList.appendChild(longExpedition);
            
            // Dodaj listenery do przycisków ekspedycji - WAŻNE!
            console.log("Ustawiam listenery dla przycisków ekspedycji");
            const buttons = expeditionsList.querySelectorAll('.start-expedition-button');
            buttons.forEach(button => {
                this.setupExpeditionButton(button);
            });
        } else {
            // Ekspedycje nie są dostępne, pokaż komunikat z powodem
            const messageElement = document.createElement('div');
            messageElement.className = 'expedition-unavailable-message';
            messageElement.style.textAlign = 'center';
            messageElement.style.padding = '20px';
            messageElement.style.backgroundColor = 'rgba(255, 235, 235, 0.8)';
            messageElement.style.borderRadius = '15px';
            messageElement.style.border = '1px solid #FF9800';
            messageElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            
            // Ikona w zależności od przyczyny
            let icon = '⚠️';
            if (availabilityStatus.reason === 'hunger') icon = '🍽️';
            else if (availabilityStatus.reason === 'happiness') icon = '😢';
            else if (availabilityStatus.reason === 'cleanliness') icon = '🧹';
            else if (availabilityStatus.reason === 'level') icon = '⬆️';
            
            messageElement.innerHTML = `<p style="font-size: 38px; margin-bottom: 15px;">${icon}</p><p style="font-weight: bold; margin-bottom: 10px; font-size: 18px; color: #FF5722;">${availabilityStatus.message}</p>`;
            
            // Dodaj wskazówkę dotyczącą parametrów
            if (availabilityStatus.reason !== 'level') {
                messageElement.innerHTML += `<p style="font-size: 14px; margin-top: 15px; color: #555;">${t('expeditions.statusMessages.birdParameters')}</p>`;
                
                // Dodaj wizualizację parametrów
                const statsDiv = document.createElement('div');
                statsDiv.style.margin = '20px auto';
                statsDiv.style.maxWidth = '280px';
                statsDiv.style.backgroundColor = 'white';
                statsDiv.style.padding = '15px';
                statsDiv.style.borderRadius = '10px';
                statsDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                
                // Dodaj pasek głodu
                const hungerValue = gameState.petBird.hunger;
                const hungerColor = hungerValue > 75 ? '#4CAF50' : '#FF9800';
                statsDiv.innerHTML += `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: bold; color: #333;">${t('expeditions.stats.hunger')}</span>
                            <span style="font-weight: bold; color: ${hungerColor};">${Math.round(hungerValue)}%</span>
                        </div>
                        <div style="width: 100%; height: 12px; background-color: #e0e0e0; border-radius: 6px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                            <div style="width: ${hungerValue}%; height: 100%; background-color: ${hungerColor}; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
                
                // Dodaj pasek szczęścia
                const happinessValue = gameState.petBird.happiness;
                const happinessColor = happinessValue > 75 ? '#4CAF50' : '#FF9800';
                statsDiv.innerHTML += `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: bold; color: #333;">${t('expeditions.stats.happiness')}</span>
                            <span style="font-weight: bold; color: ${happinessColor};">${Math.round(happinessValue)}%</span>
                        </div>
                        <div style="width: 100%; height: 12px; background-color: #e0e0e0; border-radius: 6px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                            <div style="width: ${happinessValue}%; height: 100%; background-color: ${happinessColor}; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
                
                // Dodaj pasek czystości
                const cleanlinessValue = gameState.petBird.cleanliness;
                const cleanlinessColor = cleanlinessValue > 75 ? '#4CAF50' : '#FF9800';
                statsDiv.innerHTML += `
                    <div style="margin-bottom: 5px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: bold; color: #333;">${t('expeditions.stats.cleanliness')}</span>
                            <span style="font-weight: bold; color: ${cleanlinessColor};">${Math.round(cleanlinessValue)}%</span>
                        </div>
                        <div style="width: 100%; height: 12px; background-color: #e0e0e0; border-radius: 6px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                            <div style="width: ${cleanlinessValue}%; height: 100%; background-color: ${cleanlinessColor}; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
                
                messageElement.appendChild(statsDiv);
                
                // Dodaj przycisk powrotu do opieki nad ptakiem
                const careButton = document.createElement('button');
                careButton.textContent = t('expeditions.ui.takeCare');
                careButton.style.backgroundColor = '#9C27B0';
                careButton.style.color = 'white';
                careButton.style.border = 'none';
                careButton.style.borderRadius = '10px';
                careButton.style.padding = '12px 20px';
                careButton.style.margin = '15px auto';
                careButton.style.display = 'block';
                careButton.style.cursor = 'pointer';
                careButton.style.fontWeight = 'bold';
                careButton.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.2)';
                careButton.style.transition = 'all 0.2s ease';
                
                // Dodaj efekt hover
                careButton.onmouseover = function() {
                    this.style.backgroundColor = '#7B1FA2';
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.3)';
                };
                
                careButton.onmouseout = function() {
                    this.style.backgroundColor = '#9C27B0';
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.2)';
                };
                
                careButton.onclick = function() {
                    // Ukryj ekran ekspedycji
                    const expeditionsScreen = document.getElementById('expeditions-screen');
                    if (expeditionsScreen) {
                        expeditionsScreen.classList.remove('active');
                    }
                    
                    // Pokaż ekran hodowli
                    const breedingScreen = document.getElementById('breeding-screen');
                    if (breedingScreen) {
                        breedingScreen.classList.add('active');
                    }
                };
                
                messageElement.appendChild(careButton);
            }
            
            expeditionsList.appendChild(messageElement);
        }
    },

    // Dodaj nową funkcję do tworzenia elementu ekspedycji
    createExpeditionElement: function(expeditionData) {
        // Główny kontener ekspedycji
        const expeditionElement = document.createElement('div');
        expeditionElement.className = 'expedition-item';
        expeditionElement.setAttribute('data-expedition-id', expeditionData.id);
        expeditionElement.style.display = 'flex';
        expeditionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        expeditionElement.style.borderRadius = '12px';
        expeditionElement.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.1)';
        expeditionElement.style.overflow = 'hidden';
        expeditionElement.style.marginBottom = '15px';
        expeditionElement.style.border = '1px solid #e0e0e0';
        
        // Tworzenie elementu z obrazkiem
        const imageContainer = document.createElement('div');
        imageContainer.className = 'expedition-image-container';
        imageContainer.style.width = '120px';
        imageContainer.style.minWidth = '120px';
        imageContainer.style.height = '120px';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.position = 'relative';
        imageContainer.style.borderTopLeftRadius = '12px';
        imageContainer.style.borderBottomLeftRadius = '12px';
        
        // Spróbuj załadować oryginalny obraz, ale dodaj fallback
        const expeditionImage = document.createElement('img');
        expeditionImage.src = expeditionData.imageSrc;
        expeditionImage.alt = expeditionData.title;
        expeditionImage.style.width = '100%';
        expeditionImage.style.height = '100%';
        expeditionImage.style.objectFit = 'cover';
        
        // Dodaj obsługę błędu ładowania obrazu
        expeditionImage.onerror = function() {
            // Ustaw domyślny obraz w przypadku błędu
            this.src = `assets/images/bird-${expeditionData.id === 'short' ? 'adult' : expeditionData.id === 'medium' ? 'young' : 'chick'}.png`;
            console.log(`Nie można załadować obrazu ekspedycji: ${expeditionData.imageSrc}, używam domyślnego.`);
        };
        
        imageContainer.appendChild(expeditionImage);
        expeditionElement.appendChild(imageContainer);
        
        // Tworzenie kontenera z informacjami
        const infoContainer = document.createElement('div');
        infoContainer.style.flex = '1';
        infoContainer.style.padding = '12px 15px';
        infoContainer.style.display = 'flex';
        infoContainer.style.flexDirection = 'column';
        infoContainer.style.justifyContent = 'space-between';
        
        // Tytuł ekspedycji
        const titleElement = document.createElement('h3');
        titleElement.textContent = expeditionData.title;
        titleElement.className = 'expedition-title';
        titleElement.style.margin = '0 0 5px 0';
        titleElement.style.fontSize = '17px';
        infoContainer.appendChild(titleElement);
        
        // Czas trwania i dystans
        const metaContainer = document.createElement('div');
        metaContainer.style.display = 'flex';
        metaContainer.style.alignItems = 'center';
        metaContainer.style.gap = '12px';
        metaContainer.style.marginBottom = '8px';
        
        const durationElement = document.createElement('div');
        durationElement.innerHTML = `<span style="color: #555; font-size: 12px; font-weight: 500;">⏱️ ${expeditionData.duration}</span>`;
        metaContainer.appendChild(durationElement);
        
        // Dodaj dystans
        const distanceReward = expeditionData.rewards.find(r => r.type === 'distance');
        if (distanceReward) {
            const distanceElement = document.createElement('div');
            distanceElement.innerHTML = `<span style="color: #555; font-size: 12px; font-weight: 500;">📏 ${distanceReward.amount}</span>`;
            metaContainer.appendChild(distanceElement);
        }
        
        infoContainer.appendChild(metaContainer);
        
        // Opis
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = expeditionData.description;
        descriptionElement.style.margin = '0 0 10px 0';
        descriptionElement.style.fontSize = '13px';
        descriptionElement.style.color = '#555';
        descriptionElement.style.lineHeight = '1.4';
        infoContainer.appendChild(descriptionElement);
        
        // Kontener nagród
        const rewardsContainer = document.createElement('div');
        rewardsContainer.style.marginTop = '5px';
        
        // Nagłówek nagród
        const rewardsHeader = document.createElement('div');
        rewardsHeader.style.display = 'flex';
        rewardsHeader.style.alignItems = 'center';
        rewardsHeader.style.marginBottom = '5px';
        
        const rewardsTag = document.createElement('span');
        rewardsTag.textContent = t('expeditions.ui.rewardsLabel');
        rewardsTag.className = 'rewards-tag';
        rewardsHeader.appendChild(rewardsTag);
        
        rewardsContainer.appendChild(rewardsHeader);
        
        // Siatka nagród
        const rewardsGrid = document.createElement('div');
        rewardsGrid.className = 'expedition-rewards-grid';
        
        // Ikony i wartości nagród
        expeditionData.rewards.forEach(reward => {
            // Pomijamy typ 'distance' bo jest już wyświetlany
            if (reward.type === 'distance') return;
            
            const rewardElement = document.createElement('div');
            rewardElement.className = 'expedition-reward-item';
            
            let iconUrl, iconStyle, rewardLabel;
            if (reward.type === 'seeds') {
                iconUrl = 'assets/images/seed-icon.png';
                iconStyle = '';
                rewardLabel = t('expeditions.rewardTypes.seeds');
            } else if (reward.type === 'coins') {
                iconUrl = 'assets/images/coin-icon.png';
                iconStyle = '';
                rewardLabel = t('expeditions.rewardTypes.coins');
            } else if (reward.type === 'ton') {
                iconUrl = 'assets/images/ton-icon.png';
                iconStyle = 'color: #0088CC;';
                rewardLabel = t('expeditions.rewardTypes.ton');
            } else if (reward.type === 'fruit') {
                iconUrl = 'assets/images/fruit-icon.png';
                iconStyle = '';
                rewardLabel = t('expeditions.rewardTypes.fruits');
            }
            
            rewardElement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; margin-bottom: 2px;">
                        <img src="${iconUrl}" style="width: 16px; height: 16px; margin-right: 4px;">
                        <span style="font-size: 13px; font-weight: bold; ${iconStyle}">${reward.amount}</span>
                    </div>
                    <span style="font-size: 10px; color: #666;">${rewardLabel}</span>
                </div>
            `;
            
            rewardsGrid.appendChild(rewardElement);
        });
        
        rewardsContainer.appendChild(rewardsGrid);
        infoContainer.appendChild(rewardsContainer);
        
        expeditionElement.appendChild(infoContainer);
        
        // Przycisk "Rozpocznij" i koszt ekspedycji
        const startButtonContainer = document.createElement('div');
        startButtonContainer.style.display = 'flex';
        startButtonContainer.style.flexDirection = 'column';
        startButtonContainer.style.alignItems = 'center';
        startButtonContainer.style.justifyContent = 'center';
        startButtonContainer.style.padding = '10px 15px';
        startButtonContainer.style.borderLeft = '1px solid #eee';
        
        const startButton = document.createElement('button');
        startButton.textContent = t('expeditions.ui.startButton');
        startButton.className = 'start-expedition-button';
        startButton.style.backgroundColor = '#9C27B0';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '8px';
        startButton.style.padding = '10px 15px';
        startButton.style.cursor = 'pointer';
        startButton.style.fontWeight = 'bold';
        startButton.style.fontSize = '14px';
        startButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        
        // Dodaj dane ekspedycji jako atrybuty do przycisku
        startButton.setAttribute('data-expedition-id', expeditionData.id);
        startButton.setAttribute('data-duration', expeditionData.durationInSeconds);
        
        startButtonContainer.appendChild(startButton);
        
        // Koszt ekspedycji pod przyciskiem
        if (expeditionData.cost && expeditionData.cost.type !== 'free') {
            const costBadge = document.createElement('div');
            costBadge.className = 'cost-badge';
            costBadge.style.marginTop = '8px';
            
            let costIconUrl;
            if (expeditionData.cost.type === 'fruit') {
                costIconUrl = 'assets/images/fruit-icon.png';
            }
            
            costBadge.innerHTML = `
                <span style="font-size: 11px; color: #666; margin-right: 4px;">${t('expeditions.ui.costLabel')}</span>
                <img src="${costIconUrl}" style="width: 16px; height: 16px; margin-right: 4px;">
                <span style="font-size: 12px; font-weight: bold;">${expeditionData.cost.amount}</span>
            `;
            
            startButtonContainer.appendChild(costBadge);
        } else {
            // Jeśli bezpłatna, pokaż odpowiednią informację
            const freeBadge = document.createElement('div');
            freeBadge.className = 'cost-badge';
            freeBadge.style.marginTop = '8px';
            freeBadge.style.backgroundColor = '#E8F5E9';
            freeBadge.style.border = '1px solid #C8E6C9';
            freeBadge.innerHTML = `
                <span style="color: #4CAF50; font-weight: bold; font-size: 11px;">${t('expeditions.ui.freeLabel')}</span>
            `;
            startButtonContainer.appendChild(freeBadge);
        }
        
        expeditionElement.appendChild(startButtonContainer);
        
        return expeditionElement;
    },
    
    // Sprawdzenie czy ekspedycje są dostępne
    checkAvailability: function() {
        // Sprawdź czy ptak istnieje i ma poziom 4 lub wyższy
        if (!gameState.petBird || !gameState.petBird.exists || gameState.petBird.level < 4) {
            return {
                available: false,
                reason: "level",
                message: t('expeditions.statusMessages.lowLevel')
            };
        }
        
        // Sprawdź parametr głodu (czy jest powyżej 75%)
        if (gameState.petBird.hunger <= 75) {
            return {
                available: false,
                reason: "hunger",
                message: t('expeditions.statusMessages.hungryBird')
            };
        }
        
        // Sprawdź parametr szczęścia (czy jest powyżej 75%)
        if (gameState.petBird.happiness <= 75) {
            return {
                available: false,
                reason: "happiness",
                message: t('expeditions.statusMessages.sadBird')
            };
        }
        
        // Sprawdź parametr czystości (czy jest powyżej 75%)
        if (gameState.petBird.cleanliness <= 75) {
            return {
                available: false,
                reason: "cleanliness",
                message: t('expeditions.statusMessages.dirtyBird')
            };
        }
        
        // Wszystkie warunki spełnione
        return {
            available: true,
            reason: null,
            message: null
        };
    },
    
    // Rozpoczęcie ekspedycji - ZNACZNIE POPRAWIONA FUNKCJA
    startExpedition: function(expeditionId) {
        console.log(t('expeditions.logs.startingExpedition', { id: expeditionId }));
        
        try {
            // Pobierz dane ekspedycji
            const expeditionItem = document.querySelector(`.expedition-item[data-expedition-id="${expeditionId}"]`);
            if (!expeditionItem) {
                console.error(t('expeditions.errors.expeditionNotFound', { id: expeditionId }));
                return;
            }
            
            // Pobierz informacje o ekspedycji
            const title = expeditionItem.querySelector('.expedition-title').textContent;
            const description = expeditionItem.querySelector('p').textContent;
            const startButton = expeditionItem.querySelector('.start-expedition-button');
            const durationInSeconds = parseInt(startButton.getAttribute('data-duration'), 10);
            
            // Pobierz koszt ekspedycji
            let cost = { type: 'free', amount: 0 };
            const costBadge = expeditionItem.querySelector('.cost-badge');
            if (costBadge) {
                const costText = costBadge.textContent.trim();
                if (costText.includes(t('expeditions.ui.freeLabel'))) {
                    cost = { type: 'free', amount: 0 };
                } else {
                    // Znajdź liczbę w tekście
                    const match = costText.match(/\d+/);
                    if (match) {
                        const costAmount = parseInt(match[0], 10);
                        cost = { type: 'fruit', amount: costAmount };
                    }
                }
            }
            
            console.log("Koszt ekspedycji:", cost);
            
            // Sprawdź czy gracz ma wystarczającą ilość zasobów
            if (cost.type === 'fruit' && cost.amount > 0) {
                if (gameState.resources.fruits < cost.amount) {
                    showNotification(t('expeditions.notifications.notEnoughFruits', { amount: cost.amount }));
                    return;
                }
            }
            
            // Pobierz nagrody ekspedycji
            const rewards = [];
            expeditionItem.querySelectorAll('.expedition-reward-item').forEach(rewardItem => {
                // Znajdź typ nagrody na podstawie obrazka
                let rewardType = 'seeds'; // Domyślny typ
                const imgElement = rewardItem.querySelector('img');
                if (imgElement) {
                    const imgSrc = imgElement.src;
                    if (imgSrc.includes('seed')) rewardType = 'seeds';
                    else if (imgSrc.includes('coin')) rewardType = 'coins';
                    else if (imgSrc.includes('ton')) rewardType = 'ton';
                    else if (imgSrc.includes('fruit')) rewardType = 'fruit';
                }
                
                // Znajdź ilość nagrody
                let rewardAmount = '0';
                const amountElement = rewardItem.querySelector('span');
                if (amountElement) {
                    rewardAmount = amountElement.textContent.trim();
                }
                
                rewards.push({
                    type: rewardType,
                    amount: rewardAmount
                });
            });
            
            // Dodaj nagrodę dystansu
            const distanceElement = expeditionItem.querySelector('span');
            let distance = "0";
            if (distanceElement && distanceElement.textContent.includes('📏')) {
                distance = distanceElement.textContent.replace('📏', '').trim();
            }
            
            // Pobierz opłatę
            if (cost.type === 'fruit' && cost.amount > 0) {
                gameState.resources.fruits -= cost.amount;
                showNotification(t('expeditions.notifications.fruitsSpent', { amount: cost.amount }));
            }
            
            // Stwórz obiekt ekspedycji
            this.activeExpedition = {
                id: expeditionId,
                title: title,
                description: description,
                startTime: Date.now(),
                endTime: Date.now() + (durationInSeconds * 1000),
                duration: durationInSeconds,
                rewards: rewards,
                distance: distance
            };
            
            // Zapisz aktywną ekspedycję w localStorage - DODANE!
            localStorage.setItem('activeExpedition', JSON.stringify(this.activeExpedition));
            console.log("Zapisano ekspedycję w localStorage:", this.activeExpedition);
            
            // Stwórz albo znajdź ekran aktywnej ekspedycji
            this.createActiveExpeditionScreen();
            
            // Zapisz stan gry
            saveGame();
            
            // Aktualizuj UI
            updateUI();
            
            // Pokaż ekran aktywnej ekspedycji
            this.showActiveExpeditionScreen();
            
            // Rozpocznij aktualizację timera
            this.startExpeditionTimer();
            
            // Pokaż powiadomienie
            showNotification(t('expeditions.notifications.expeditionStarted', { title: title }));
            
        } catch (error) {
            console.error("Błąd podczas rozpoczynania ekspedycji:", error);
            showNotification(t('expeditions.notifications.expeditionError'));
        }
    },
    
    // Tworzenie ekranu aktywnej ekspedycji
    createActiveExpeditionScreen: function() {
        console.log("Tworzenie ekranu aktywnej ekspedycji");
        
        try {
            // Sprawdź czy ekran już istnieje
            let expeditionScreen = document.getElementById('active-expedition-screen');
            
            // Jeśli nie istnieje, stwórz go
            if (!expeditionScreen) {
                expeditionScreen = document.createElement('div');
                expeditionScreen.id = 'active-expedition-screen';
                document.body.appendChild(expeditionScreen);
            }
            
            // Pobierz dane aktywnej ekspedycji
            const expedition = this.activeExpedition;
            if (!expedition) {
                console.error(t('expeditions.errors.noExpeditionData'));
                return;
            }
            
            // Utwórz zawartość ekranu
            expeditionScreen.innerHTML = `
                <!-- Przycisk Nagrody -->
                <div class="reward-pass-button" style="position: fixed; top: 70px; right: 15px; width: 50px; height: 50px; background-color: #43b5e2; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); cursor: pointer; z-index: 1000; border: 2px solid #FFC107;">
                    <img src="assets/images/rewards-icon.png" alt="Nagrody" style="width: 59px; height: 59px;">
                </div>

                <!-- Przycisk Szafa -->
                <div class="wardrobe-button" style="position: fixed; top: 140px; right: 15px; width: 50px; height: 50px; background-color: #43b5e2; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); cursor: pointer; z-index: 1000; border: 2px solid #FFC107;">
                    <img src="assets/images/wardrobe-icon.png" alt="Szafa" style="width: 55px; height: 55px;">
                </div>
                
                <!-- Najpierw przycisk powrotu, poza kontenerem, aby był na stałej pozycji -->
                <button id="expedition-home-button" class="expedition-home-button">${t('expeditions.ui.backToMain')}</button>
                <div class="expedition-progress-container">
                    <div class="expedition-title">${expedition.title}</div>
                    <div class="expedition-description">${expedition.description}</div>
                    
                    <!-- Dodana grafika ekspedycji -->
                    <div class="expedition-image">
                        <img src="assets/images/expeditions/${expedition.id}-expedition.png" alt="${expedition.title}" 
                             style="max-width: 220px; max-height: 147px; margin-bottom: 25px; display: block; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.2);">
                    </div>
                    <div class="expedition-timer" id="expedition-timer">${t('expeditions.ui.expeditionTimer')}</div>
                    <div class="expedition-progress-bar-container">
                        <div class="expedition-progress-bar" id="expedition-progress-bar"></div>
                    </div>
                    <div class="expedition-rewards-preview">
                        ${this.generateRewardsPreviewHTML(expedition.rewards)}
                    </div>
                    <button class="expedition-cancel-button" id="expedition-cancel-button">${t('activeExpedition.cancel')}</button>
                </div>
            `;
            
            // Dodaj listener do przycisku powrotu
            const homeButton = expeditionScreen.querySelector('#expedition-home-button');
            if (homeButton) {
                homeButton.onclick = function() {
                    // Ukryj ekran ekspedycji (ale nie anuluj jej)
                    const expeditionScreen = document.getElementById('active-expedition-screen');
                    if (expeditionScreen) {
                        expeditionScreen.classList.remove('show');
                        expeditionScreen.style.display = 'none';
                    }
                    
                    // Przywróć scrollowanie dokumentu
                    document.body.style.overflow = '';
                    
                    // Pokaż ekran główny
                    const mainScreen = document.getElementById('main-screen');
                    if (mainScreen) {
                        // Ukryj wszystkie inne ekrany
                        document.querySelectorAll('.game-screen').forEach(screen => {
                            screen.classList.remove('active');
                        });
                        
                        // Pokaż ekran główny
                        mainScreen.classList.add('active');
                    }
                };
            }
            
            // Dodaj listener do przycisku anulowania
            const cancelButton = expeditionScreen.querySelector('#expedition-cancel-button');
            if (cancelButton) {
                const self = this;
                cancelButton.onclick = function() {
                    self.cancelExpedition();
                };
            }
            
            // Dodaj listener do przycisku nagród
            const rewardButton = expeditionScreen.querySelector('.reward-pass-button');
            if (rewardButton) {
                rewardButton.onclick = function() {
                    // Najpierw ukryj ekran aktywnej ekspedycji
                    expeditionScreen.classList.remove('show');
                    expeditionScreen.style.display = 'none';
                    
                    // Przywróć scrollowanie dokumentu
                    document.body.style.overflow = '';
                    
                    // Następnie pokaż ekran nagród
                    if (typeof window.RewardPassModule !== 'undefined' && typeof window.RewardPassModule.showRewardPassScreen === 'function') {
                        window.RewardPassModule.showRewardPassScreen();
                    } else {
                        console.error(t('expeditions.errors.rewardPassModuleUnavailable'));
                    }
                };
            }
            
           
            
// Dodaj listener do przycisku szafy
const wardrobeButton = expeditionScreen.querySelector('.wardrobe-button');
if (wardrobeButton) {
    wardrobeButton.onclick = function() {
        // Tymczasowo oznaczamy ekspedycję jako ukrytą, aby inne ekrany mogły być wyświetlane
        window.expeditionTemporarilyHidden = true;
        
        // Ukryj ekran aktywnej ekspedycji
        expeditionScreen.classList.remove('show');
        expeditionScreen.style.display = 'none';
        
        // Przywróć scrollowanie dokumentu
        document.body.style.overflow = '';
        
        // Pokaż ekran szafy z informacją o trwającej ekspedycji
        const wardrobeScreen = document.getElementById('wardrobe-screen');
        if (wardrobeScreen) {
            document.querySelectorAll('.game-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            wardrobeScreen.classList.add('active');
            
            // Dodaj informację o trwającej ekspedycji i zablokuj przyciski
            if (typeof disableWardrobeDuringExpedition === 'function') {
                disableWardrobeDuringExpedition(wardrobeScreen);
            } else {
                // Blokuj przyciski bezpośrednio jeśli funkcja nie jest dostępna
                const skinButtons = wardrobeScreen.querySelectorAll('.skin-select-button');
                skinButtons.forEach(button => {
                    if (!button.classList.contains('selected')) {
                        button.disabled = true;
                        button.style.backgroundColor = '#cccccc';
                        button.style.cursor = 'not-allowed';
                        button.style.opacity = '0.6';
                        const currentLang = localStorage.getItem('gameLanguage') || 'pl';
                        button.textContent = currentLang === 'pl' ? "Niedostępny" : "Unavailable";
                    }
                });
                
                // Dodaj komunikat o ekspedycji jeśli nie istnieje
                let expeditionMessage = wardrobeScreen.querySelector('.expedition-message');
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
                    
                    const wardrobe = wardrobeScreen.querySelector('.wardrobe-container');
                    if (wardrobe) {
                        wardrobe.insertBefore(expeditionMessage, wardrobe.firstChild);
                    }
                }
                
                const currentLang = localStorage.getItem('gameLanguage') || 'pl';
                expeditionMessage.textContent = currentLang === 'pl' ? 
                    "Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji." : 
                    "Your bird is on an expedition! You cannot change skins during an active expedition.";
                expeditionMessage.style.display = 'block';
            }
        }
    };
}


            
            // Dodaj ekran nagród (ukryty)
            this.createRewardsScreen();
        } catch (error) {
            console.error("Błąd podczas tworzenia ekranu ekspedycji:", error);
        }
    },
    
    // Funkcja resetująca stan szafy
    resetWardrobeState: function() {
        // Usuń komunikat o ekspedycji
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
                button.textContent = t('wardrobe.skins.selected');
            }
        });
        
        // Ustaw globalną flagę ekspedycji
        window.isExpeditionActive = false;
        localStorage.setItem('isExpeditionActive', 'false');
        console.log("Zresetowano stan szafy - ekspedycja nieaktywna");
    },
    
    // Tworzenie ekranu nagród
    createRewardsScreen: function() {
        // Sprawdź czy ekran już istnieje
        let rewardsScreen = document.getElementById('expedition-rewards-screen');
        
        // Jeśli nie istnieje, stwórz go
        if (!rewardsScreen) {
            rewardsScreen = document.createElement('div');
            rewardsScreen.id = 'expedition-rewards-screen';
            rewardsScreen.className = 'expedition-rewards-screen';
            document.body.appendChild(rewardsScreen);
        }
        
        // Domyślna treść zostanie zaktualizowana dynamicznie przy zakończeniu ekspedycji
        rewardsScreen.innerHTML = `
            <div class="expedition-rewards-container">
                <div class="expedition-rewards-title">${t('expeditions.ui.expeditionCompleted')}</div>
                <div class="expedition-rewards-list" id="expedition-rewards-list">
                    <!-- Nagrody będą dodane dynamicznie -->
                </div>
                <button class="collect-rewards-button" id="collect-rewards-button">${t('expeditions.ui.collectRewards')}</button>
            </div>
        `;
        
        // Dodaj listener do przycisku odbioru nagród
        const collectButton = rewardsScreen.querySelector('#collect-rewards-button');
        if (collectButton) {
            const self = this;
            collectButton.onclick = function() {
                self.collectRewards();
            };
        }
    },
    
    // Generowanie HTML dla podglądu nagród
    generateRewardsPreviewHTML: function(rewards) {
        let html = '';
        
        rewards.forEach(reward => {
            let iconUrl, labelText;
            
            if (reward.type === 'seeds') {
                iconUrl = 'assets/images/seed-icon.png';
                labelText = t('expeditions.rewardTypes.seeds');
            } else if (reward.type === 'coins') {
                iconUrl = 'assets/images/coin-icon.png';
                labelText = t('expeditions.rewardTypes.coins');
            } else if (reward.type === 'ton') {
                iconUrl = 'assets/images/ton-icon.png';
                labelText = t('expeditions.rewardTypes.ton');
            } else if (reward.type === 'fruit') {
                iconUrl = 'assets/images/fruit-icon.png';
                labelText = t('expeditions.rewardTypes.fruits');
            } else if (reward.type === 'distance') {
                iconUrl = 'assets/images/map-icon.png'; // Użyj ikony mapy dla dystansu
                labelText = t('expeditions.rewardTypes.distance');
            }
            
            html += `
                <div class="expedition-reward-preview">
                    <img src="${iconUrl}" alt="${reward.type}">
                    <span>${reward.amount} ${labelText}</span>
                </div>
            `;
        });
        
        return html;
    },
    
    // Pokazanie ekranu aktywnej ekspedycji - POPRAWIONA FUNKCJA
    showActiveExpeditionScreen: function() {
        console.log("Pokazywanie ekranu aktywnej ekspedycji");
        
        try {
            // Ukryj wszystkie inne ekrany
            document.querySelectorAll('.game-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Pokaż ekran ekspedycji
            const expeditionScreen = document.getElementById('active-expedition-screen');
            if (expeditionScreen) {
                // Upewnij się, że ekran będzie widoczny - NAPRAWIONE
                expeditionScreen.style.display = 'flex';
                expeditionScreen.classList.add('show');
                
                // Dodaj znacznik do body, aby uniknąć scrollowania i innych problemów
                document.body.style.overflow = 'hidden';
            } else {
                console.error("Nie znaleziono ekranu aktywnej ekspedycji!");
            }
        } catch (error) {
            console.error("Błąd podczas pokazywania ekranu ekspedycji:", error);
        }
    },
    
    // Rozpoczęcie timera ekspedycji
    startExpeditionTimer: function() {
        console.log("Rozpoczęcie timera ekspedycji");
        
        if (!this.activeExpedition) {
            console.error(t('expeditions.errors.timerError'));
            return;
        }
        
        // Zaktualizuj timer i pasek postępu od razu
        this.updateExpeditionTimer();
        
        // Wyczyść poprzedni interwał (jeśli istnieje)
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Ustaw interwał aktualizacji timera co sekundę




// Ustaw interwał aktualizacji timera co sekundę
        this.timerInterval = setInterval(() => {
            this.updateExpeditionTimer();
        }, 1000);
    },
    
    // Aktualizacja timera ekspedycji
    updateExpeditionTimer: function() {
        if (!this.activeExpedition) {
            clearInterval(this.timerInterval);
            return;
        }
        
        const now = Date.now();
        const endTime = this.activeExpedition.endTime;
        const elapsedTime = now - this.activeExpedition.startTime;
        const totalDuration = endTime - this.activeExpedition.startTime;
        
        // Oblicz pozostały czas
        let remainingTime = endTime - now;
        
        if (remainingTime <= 0) {
            // Ekspedycja zakończona
            clearInterval(this.timerInterval);
            remainingTime = 0;
            
            // Zakończ ekspedycję
            this.completeExpedition();
            return;
        }
        
        // Aktualizuj timer
        const timerElement = document.getElementById('expedition-timer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(remainingTime / 1000);
        }
        
        // Aktualizuj pasek postępu
        const progressBar = document.getElementById('expedition-progress-bar');
        if (progressBar) {
            const progressPercent = (elapsedTime / totalDuration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        
        // Aktualizuj pozycję ptaka
        this.updateBirdPosition(elapsedTime / totalDuration);
    },
    
    // Aktualizacja pozycji ptaka
    updateBirdPosition: function(progress) {
        const birdElement = document.querySelector('.flying-bird');
        if (birdElement) {
            // Dostosuj pozycję ptaka w zależności od postępu
            const containerWidth = birdElement.parentElement.offsetWidth;
            const birdWidth = birdElement.offsetWidth;
            const maxLeft = containerWidth - birdWidth;
            
            // Ustaw pozycję ptaka w zależności od postępu ekspedycji
            const left = progress * maxLeft;
            
            // Ustaw pozycję ptaka
            birdElement.style.left = `${left}px`;
        }
    },
    
    // Formatowanie czasu w formacie HH:MM:SS
    formatTime: function(seconds) {
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
   // Zakończenie ekspedycji - ZAKTUALIZOWANE
    completeExpedition: function() {
        console.log("Zakończenie ekspedycji");
        
        // Przygotuj nagrody do wyświetlenia
        this.prepareRewardsScreen();
        
        // Ukryj ekran aktywnej ekspedycji
        const expeditionScreen = document.getElementById('active-expedition-screen');
        if (expeditionScreen) {
            expeditionScreen.classList.remove('show');
            expeditionScreen.style.display = 'none';
        }
        
        // Ustaw flagę oczekujących nagród
        this.pendingRewards = true;
        
        // Zapisz informację o oczekujących nagrodach w localStorage
        try {
            localStorage.setItem('pendingExpeditionRewards', 'true');
        } catch (e) {
            console.error(t('expeditions.errors.errorSavingState', { error: e }));
        }
        
        // Pokaż odznakę powiadomień przy przycisku Gniazdo
        this.showNavigationBadge(true);
        
        // Pokaż powiadomienie dla gracza
        showNotification(t('expeditions.notifications.expeditionCompleted'), 5000);
        
        // Przywróć normalny widok gry - pokaż ekran główny, jeśli żaden inny nie jest aktywny
        const activeScreen = document.querySelector('.game-screen.active');
        if (!activeScreen) {
            const mainScreen = document.getElementById('main-screen');
            if (mainScreen) {
                mainScreen.classList.add('active');
            }
        }
    },

    // Nowa funkcja do pokazywania/ukrywania odznaki powiadomień
    showNavigationBadge: function(show) {
        // Znajdź przycisk Gniazdo w nawigacji
        const breedingButton = document.querySelector('.nav-button[data-screen="breeding-screen"]');
        if (!breedingButton) return;
        
        // Sprawdź czy odznaka już istnieje
        let badge = breedingButton.querySelector('.nav-badge');
        
        if (!badge && show) {
            // Stwórz odznakę, jeśli nie istnieje
            badge = document.createElement('div');
            badge.className = 'nav-badge';
            breedingButton.style.position = 'relative'; // Upewnij się, że przycisk ma pozycję względną
            breedingButton.appendChild(badge);
        }
        
        // Pokaż lub ukryj odznakę
        if (badge) {
            badge.style.display = show ? 'block' : 'none';
        }
    },
    
    // Przygotowanie ekranu nagród
    prepareRewardsScreen: function() {
        // Znajdź kontener listy nagród
        const rewardsList = document.getElementById('expedition-rewards-list');
        if (!rewardsList || !this.activeExpedition) return;
        
        // Wyczyść istniejące nagrody
        rewardsList.innerHTML = '';
        
        // Najpierw dodaj tytuł ekspedycji i informację o sukcesie
        const titleElement = document.querySelector('.expedition-rewards-title');
        if (titleElement) {
            titleElement.innerHTML = `<span style="color: #4CAF50;">✓</span> ${t('expeditions.ui.expeditionCompleted')}`;
        }
        
        // NAPRAWIONE: Dodaj dystans jako specjalną nagrodę wyróżnioną na górze
        if (this.activeExpedition.distance) {
            let distanceValue = 0;
            
            // Ekstrakcja liczby z tekstu dystansu (np. "10km" -> 10)
            if (this.activeExpedition.distance.includes('-')) {
                const matches = this.activeExpedition.distance.match(/(\d+)-(\d+)/);
                if (matches && matches.length >= 3) {
                    const min = parseInt(matches[1], 10);
                    const max = parseInt(matches[2], 10);
                    distanceValue = Math.floor(Math.random() * (max - min + 1)) + min;
                }
            } else {
                const matches = this.activeExpedition.distance.match(/(\d+)/);
                if (matches && matches.length >= 2) {
                    distanceValue = parseInt(matches[1], 10);
                }
            }
            
            // Dodaj specjalny element dystansu na górze listy nagród
            if (distanceValue > 0) {
                const distanceBanner = document.createElement('div');
                distanceBanner.className = 'distance-reward-banner';
                distanceBanner.style.backgroundColor = 'rgba(156, 39, 176, 0.15)';
                distanceBanner.style.padding = '15px';
                distanceBanner.style.borderRadius = '12px';
                distanceBanner.style.marginBottom = '20px';
                distanceBanner.style.border = '2px dashed #9C27B0';
                distanceBanner.style.textAlign = 'center';
                
                distanceBanner.innerHTML = `
                    <div style="font-size: 18px; margin-bottom: 5px; font-weight: bold; color: #9C27B0;">
                        ${t('expeditions.ui.birdReachedDistance')}
                    </div>
                    <div style="font-size: 36px; font-weight: bold; color: #7B1FA2; margin: 10px 0;">
                        ${distanceValue} ${t('expeditions.ui.meters')}
                    </div>
                    <div style="font-size: 14px; color: #666;">
                        ${t('expeditions.ui.distanceAdded')}
                    </div>
                `;
                
                rewardsList.appendChild(distanceBanner);
                
                // Zapisz dystans jako atrybut do pobrania później
                rewardsList.setAttribute('data-distance-reward', distanceValue);
            }
        }
        
        // Dodaj pozostałe nagrody do listy
        this.activeExpedition.rewards.forEach(reward => {
            let amount = 0;
            
            // Pomijamy dystans, ponieważ został już wyświetlony wyżej
            if (reward.type === 'distance') return;
            
            // Oblicz ostateczną wartość nagrody
            if (reward.amount.includes('-')) {
                // Zakres nagród (np. "500-800")
                const [min, max] = reward.amount.split('-').map(n => parseFloat(n));
                amount = Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
                // Stała nagroda
                amount = parseFloat(reward.amount);
            }
            
            // Zaokrąglij do 3 miejsc po przecinku dla TON
            if (reward.type === 'ton') {
                amount = parseFloat(amount.toFixed(3));
            } else {
                amount = Math.floor(amount);
            }
            
            // Tworzy element nagrody
            const rewardElement = document.createElement('div');
            rewardElement.className = 'expedition-reward-item-large';
            rewardElement.setAttribute('data-reward-type', reward.type);
            rewardElement.setAttribute('data-reward-amount', amount);
            
            // Dodaj ikonę
            let iconUrl, rewardLabel;
            if (reward.type === 'seeds') {
                iconUrl = 'assets/images/seed-icon.png';
                rewardLabel = t('expeditions.rewardTypes.seeds');
            } else if (reward.type === 'coins') {
                iconUrl = 'assets/images/coin-icon.png';
                rewardLabel = t('expeditions.rewardTypes.coins');
            } else if (reward.type === 'ton') {
                iconUrl = 'assets/images/ton-icon.png';
                rewardLabel = t('expeditions.rewardTypes.ton');
            } else if (reward.type === 'fruit') {
                iconUrl = 'assets/images/fruit-icon.png';
                rewardLabel = t('expeditions.rewardTypes.fruits');
            }
            
            rewardElement.innerHTML = `
                <div class="expedition-reward-icon" style="background-image: url('${iconUrl}')"></div>
                <div class="expedition-reward-details">
                    <div class="expedition-reward-amount">${amount}</div>
                    <div class="expedition-reward-label">${rewardLabel}</div>
                </div>
            `;
            
            rewardsList.appendChild(rewardElement);

            // Sprawdź, czy mamy aktywny bonus ze skina Leśnego Zwiadowcy
            if (gameState.skins && gameState.skins.currentSkin === 'lesny' && reward.type === 'seeds') {
                // Dodaj informację o bonusie w UI
                const bonusElement = document.createElement('div');
                bonusElement.className = 'expedition-bonus-message';
                bonusElement.style.marginTop = '5px';
                bonusElement.style.color = '#4CAF50';
                bonusElement.style.fontSize = '12px';
                bonusElement.style.fontStyle = 'italic';
                bonusElement.textContent = `(${t('wardrobe.skins.forestScoutBonus')})`;
                rewardElement.appendChild(bonusElement);
            }
        });
        
        // NAPRAWIONE: Dodaj klasyczny element dystansu na końcu listy (do zachowania kompatybilności)
        if (this.activeExpedition.distance) {
            let distanceValue = parseInt(rewardsList.getAttribute('data-distance-reward') || '0');
            
            if (distanceValue > 0) {
                const distanceElement = document.createElement('div');
                distanceElement.className = 'expedition-reward-item-large';
                distanceElement.setAttribute('data-reward-type', 'distance');
                distanceElement.setAttribute('data-reward-amount', distanceValue);
                
                distanceElement.innerHTML = `
                    <div class="expedition-reward-icon" style="background-image: url('assets/images/map-icon.png')"></div>
                    <div class="expedition-reward-details">
                        <div class="expedition-reward-amount">${distanceValue}m</div>
                        <div class="expedition-reward-label">${t('expeditions.rewardTypes.distance')}</div>
                    </div>
                `;
                
                rewardsList.appendChild(distanceElement);
            }
        }
    },

    // Odbiór nagród
    collectRewards: function() {
        console.log("Odbiór nagród z ekspedycji");
        
        // Przygotuj puste tablice do przechowania nagród
        const collectedRewards = {
            seeds: 0,
            coins: 0,
            ton: 0,
            fruit: 0,
            distance: 0
        };
        
        // Zbierz wszystkie nagrody
        const rewardElements = document.querySelectorAll('.expedition-reward-item-large');
        rewardElements.forEach(element => {
            const type = element.getAttribute('data-reward-type');
            const amount = parseFloat(element.getAttribute('data-reward-amount'));
            
            if (type && !isNaN(amount)) {
                collectedRewards[type] += amount;
            }
        });
        
        // Pobierz dystans bezpośrednio z atrybutu danych
        const rewardsList = document.getElementById('expedition-rewards-list');
        if (rewardsList && rewardsList.hasAttribute('data-distance-reward')) {
            const distanceFromAttribute = parseInt(rewardsList.getAttribute('data-distance-reward') || '0');
            if (distanceFromAttribute > 0) {
                console.log(`Znaleziono dystans z atrybutu: ${distanceFromAttribute}m`);
                collectedRewards.distance = distanceFromAttribute;
            }
        }
        
        // Jeśli nadal brak dystansu, sprawdź bezpośrednio z aktywnej ekspedycji
        if (collectedRewards.distance === 0 && this.activeExpedition && this.activeExpedition.distance) {
            console.log("Próba pobrania dystansu bezpośrednio z obiektu ekspedycji");
            let distanceValue = 0;
            
            // Parsuj wartość dystansu z aktywnej ekspedycji
            const distanceText = this.activeExpedition.distance;
            if (distanceText.includes('-')) {
                // Format "100-200km" - losowa wartość z zakresu
                const matches = distanceText.match(/(\d+)-(\d+)/);
                if (matches && matches.length >= 3) {
                    const min = parseInt(matches[1], 10);
                    const max = parseInt(matches[2], 10);
                    distanceValue = Math.floor(Math.random() * (max - min + 1)) + min;
                    console.log(`Wylosowano dystans z zakresu ${min}-${max}: ${distanceValue}`);
                }
            } else {
                // Format "50km" - stała wartość
                const matches = distanceText.match(/(\d+)/);
                if (matches && matches.length >= 2) {
                    distanceValue = parseInt(matches[1], 10);
                    console.log(`Pobrano stały dystans: ${distanceValue}`);
                }
            }
            
            if (distanceValue > 0) {
                collectedRewards.distance = distanceValue;
            }
        }
        
        console.log("Zebrane nagrody:", collectedRewards);
        
        // Dodaj nagrody do zasobów gracza
        gameState.resources.seeds += collectedRewards.seeds;
        gameState.resources.coins += collectedRewards.coins;
        gameState.resources.ton += collectedRewards.ton;
        gameState.resources.fruits += collectedRewards.fruit;
        
        // Sprawdzamy, czy mamy przepustkę nagród
        const hasRewardPass = window.RewardPassModule && typeof window.RewardPassModule.updateDistance === 'function';
        
        // Zapamiętaj stan przepustki przed aktualizacją
        let previousDistance = 0;
        if (hasRewardPass && gameState.rewardPass) {
            previousDistance = gameState.rewardPass.distance || 0;
        }
        
        // NAPRAWIONE: Zwiększ dystans w przepustce nagród - ZAWSZE próbuj dodać dystans
        if (hasRewardPass) {
            // Upewnij się, że mamy jakiś dystans do dodania
            if (collectedRewards.distance <= 0) {
                // Jeśli nadal nie mamy dystansu, przyznaj przynajmniej minimalną wartość na podstawie typu ekspedycji
                if (this.activeExpedition) {
                    if (this.activeExpedition.id === 'short') {
                        collectedRewards.distance = 10; // Łatwa ekspedycja: +10m
                        console.log("Dodano domyślny dystans dla łatwej ekspedycji: 10m");
                    } else if (this.activeExpedition.id === 'medium') {
                        collectedRewards.distance = 50; // Średnia ekspedycja: +50m
                        console.log("Dodano domyślny dystans dla średniej ekspedycji: 50m");
                    } else if (this.activeExpedition.id === 'long') {
                        collectedRewards.distance = 100 + Math.floor(Math.random() * 101); // Trudna ekspedycja: +100-200m
                        console.log(`Dodano domyślny dystans dla trudnej ekspedycji: ${collectedRewards.distance}m`);
                    }
                }
            }
            
            // Mamy teraz pewność, że jest jakiś dystans do dodania
            if (collectedRewards.distance > 0) {
                // Pokazuj animację aktualizacji tylko jeśli dystans jest znaczący
                if (collectedRewards.distance >= 10) {
                    // Pokaż specjalne powiadomienie o zwiększonym dystansie
                    showNotification(t('expeditions.notifications.distanceTraveled', { distance: collectedRewards.distance }), 5000);
                    
                    // Dodaj animację powiadomienia o postępie
                    const notification = document.createElement('div');
                    notification.className = 'distance-animation';
                    notification.style.position = 'fixed';
                    notification.style.top = '40%';
                    notification.style.left = '50%';
                    notification.style.transform = 'translate(-50%, -50%)';
                    notification.style.zIndex = '10000';
                    notification.style.backgroundColor = 'rgba(156, 39, 176, 0.85)';
                    notification.style.color = 'white';
                    notification.style.padding = '20px 30px';
                    notification.style.borderRadius = '10px';
                    notification.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
                    notification.style.textAlign = 'center';
                    notification.style.animation = 'zoomFadeIn 3s forwards';
                    
                    notification.innerHTML = `
                        <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${t('expeditions.ui.birdReachedDistance')}:</div>
                        <div style="font-size: 48px; font-weight: bold; margin: 15px 0; color: gold;">+${collectedRewards.distance}m</div>
                        <div style="font-size: 14px;">${t('expeditions.ui.distanceAdded')}</div>
                    `;
                    
                    // Dodaj styl animacji, jeśli nie istnieje
                    if (!document.getElementById('distance-animation-style')) {
                        const style = document.createElement('style');
                        style.id = 'distance-animation-style';
                        style.textContent = `
                            @keyframes zoomFadeIn {
                                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                                30% { transform: translate(-50%, -50%) scale(1); }
                                80% { opacity: 1; }
                                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    document.body.appendChild(notification);
                    
                    // Usuń animację po 3 sekundach
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 3000);
                }
                
                // NAPRAWIONE: Aktualizuj dystans
                window.RewardPassModule.updateDistance(collectedRewards.distance);
                console.log(`Zaktualizowano dystans w przepustce nagród: +${collectedRewards.distance}m`);
                
                // Zapisz stan gry po aktualizacji dystansu
                saveGame();
            }
        }
        
        // Po kodzie dodania nagród do zasobów, przed pokazaniem powiadomienia, dodaj:
        this.resetWardrobeState();
        
        // Pokaż powiadomienie o nagrodach
        let rewardMessage = t('expeditions.notifications.rewardsReceived') + "\n";
        if (collectedRewards.seeds > 0) rewardMessage += `- ${collectedRewards.seeds} ${t('expeditions.rewardTypes.seeds')}\n`;
        if (collectedRewards.coins > 0) rewardMessage += `- ${collectedRewards.coins} ${t('expeditions.rewardTypes.coins')}\n`;
        if (collectedRewards.ton > 0) rewardMessage += `- ${collectedRewards.ton.toFixed(3)} ${t('expeditions.rewardTypes.ton')}\n`;
        if (collectedRewards.fruit > 0) rewardMessage += `- ${collectedRewards.fruit} ${t('expeditions.rewardTypes.fruits')}\n`;
        
        // Dystans pokazany jest w osobnym powiadomieniu, więc tutaj pomijamy
        
        showNotification(rewardMessage);
        
        // Ukryj ekran nagród
        const rewardsScreen = document.getElementById('expedition-rewards-screen');
        if (rewardsScreen) {
            rewardsScreen.style.display = 'none';
        }
        
        // Wyczyść aktywną ekspedycję
        this.activeExpedition = null;
        
        // Wyczyść flagę oczekujących nagród
        this.pendingRewards = false;
        localStorage.removeItem('pendingExpeditionRewards');
        
        // Ukryj odznakę powiadomień
        this.showNavigationBadge(false);
        
        // Usuń dane ekspedycji z localStorage
        localStorage.removeItem('activeExpedition');
        localStorage.setItem('isExpeditionActive', 'false');
        
        // Zresetuj stan szafy
        this.resetWardrobeState();
        
        // Zapisz stan gry
        saveGame();
        
        // Aktualizuj UI
        updateUI();
        
        // Sprawdź, czy pokazać ekran przepustki nagród czy ekran hodowli
        if (collectedRewards.distance >= 50 && hasRewardPass) {
            // Jeśli dystans jest znaczący, pokaż ekran przepustki nagród
            setTimeout(() => {
                if (typeof window.RewardPassModule.showRewardPassScreen === 'function') {
                    window.RewardPassModule.showRewardPassScreen();
                } else {
                    // Jeśli funkcja pokazywania przepustki nie jest dostępna, pokaż ekran hodowli
                    const breedingScreen = document.getElementById('breeding-screen');
                    if (breedingScreen) {
                        document.querySelectorAll('.game-screen').forEach(screen => {
                            screen.classList.remove('active');
                        });
                        breedingScreen.classList.add('active');
                    }
                }
            }, 500);
        } else {
            // W przeciwnym razie pokaż ekran hodowli
            const breedingScreen = document.getElementById('breeding-screen');
            if (breedingScreen) {
                document.querySelectorAll('.game-screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                breedingScreen.classList.add('active');
            }
        }
    },
    
    // Funkcja resetująca stan szafy
    resetWardrobeState: function() {
        console.log(t('expeditions.logs.wardrobeResetExpeditionCompleted'));
        
        // Ustawiamy globalną flagę ekspedycji
        window.isExpeditionActive = false;
        localStorage.setItem('isExpeditionActive', 'false');
        
        // Znajdujemy wszystkie ekrany szafy
        const wardrobeScreens = document.querySelectorAll('#wardrobe-screen');
        if (wardrobeScreens.length > 0) {
            wardrobeScreens.forEach(screen => {
                // Usuń komunikat o ekspedycji
                const expeditionMessage = screen.querySelector('.expedition-message');
                if (expeditionMessage) {
                    expeditionMessage.style.display = 'none';
                }
                
                // Odblokuj wszystkie przyciski wyboru skina
                const skinButtons = screen.querySelectorAll('.skin-select-button');
                skinButtons.forEach(button => {
                    if (!button.classList.contains('selected')) {
                        button.disabled = false;
                        button.style.backgroundColor = '#2196F3';
                        button.style.cursor = 'pointer';
                        button.style.opacity = '1';
                        button.textContent = t('wardrobe.skins.selected');
                    }
                });
            });
        }
        
        console.log(t('expeditions.logs.wardrobeResetButtonsUnlocked'));
    },
    
    // Funkcja wyświetlająca animację zdobytego dystansu
    showRewardPassDistance: function(distance) {
        // Jeśli dystans jest zbyt mały, nie pokazuj animacji
        if (distance < 10) return;
        
        // Utwórz element animacji
        const animation = document.createElement('div');
        animation.className = 'distance-gain-animation';
        animation.style.position = 'fixed';
        animation.style.top = '40%';
        animation.style.left = '50%';
        animation.style.transform = 'translate(-50%, -50%)';
        animation.style.zIndex = '10000';
        animation.style.backgroundColor = 'rgba(156, 39, 176, 0.85)';
        animation.style.color = 'white';
        animation.style.padding = '20px 30px';
        animation.style.borderRadius = '10px';
        animation.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        animation.style.textAlign = 'center';
        animation.style.animation = 'zoomFadeIn 3s forwards';
        
        animation.innerHTML = `
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${t('expeditions.ui.birdReachedDistance')}:</div>
            <div style="font-size: 48px; font-weight: bold; margin: 15px 0; color: gold;">+${distance}m</div>
            <div style="font-size: 14px;">${t('expeditions.ui.distanceAdded')}</div>
        `;
        
        // Dodaj animację do body
        document.body.appendChild(animation);
        
        // Dodaj styl animacji
        const style = document.createElement('style');
        style.textContent = `
            @keyframes zoomFadeIn {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                30% { transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        // Usuń animację po zakończeniu
        setTimeout(() => {
            if (animation.parentNode) {
                animation.parentNode.removeChild(animation);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 3000);
    },
    
    // Anulowanie ekspedycji
    cancelExpedition: function() {
        console.log("Anulowanie ekspedycji");
        
        // Pokaż komunikat z potwierdzeniem
        if (confirm(t('expeditions.notifications.confirmCancel'))) {
            // Ukryj ekran ekspedycji
            const expeditionScreen = document.getElementById('active-expedition-screen');
            if (expeditionScreen) {
                expeditionScreen.classList.remove('show');
                expeditionScreen.style.display = 'none';
            }
            
            // Przywróć scrollowanie dokumentu
            document.body.style.overflow = '';
            
            // Wyczyść timer
            clearInterval(this.timerInterval);
            
            // Wyczyść aktywną ekspedycję
            this.activeExpedition = null;
            
            // Usuń dane ekspedycji z localStorage
            localStorage.removeItem('activeExpedition');
            localStorage.setItem('isExpeditionActive', 'false');
            
            // Zresetuj stan szafy
            this.resetWardrobeState();
            
            // Pokaż powiadomienie
            showNotification(t('expeditions.notifications.expeditionCancelled'));
            
            // Zapisz stan gry
            saveGame();
            
            // Aktualizuj UI
            updateUI();
            
            // Pokaż ekran hodowli
            const breedingScreen = document.getElementById('breeding-screen');
            if (breedingScreen) {
                document.querySelectorAll('.game-screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                breedingScreen.classList.add('active');
            }
        }
    },
    
    // Kontrola uruchomionej ekspedycji po załadowaniu gry
    checkPendingExpedition: function() {
        console.log(t('expeditions.logs.pendingExpedition'));
        
        // Sprawdź czy mamy oczekujące nagrody z ekspedycji
        if (localStorage.getItem('pendingExpeditionRewards') === 'true') {
            console.log(t('expeditions.logs.foundPendingRewards'));
            this.pendingRewards = true;
            
            // Pokaż odznakę powiadomień
            this.showNavigationBadge(true);
            
            // Stwórz ekrany, ale ich nie pokazuj
            this.createActiveExpeditionScreen();
            this.createRewardsScreen();
            this.prepareRewardsScreen();
        }
        
        // Sprawdź czy mamy zapisaną ekspedycję w localStorage
        try {
            const savedExpedition = localStorage.getItem('activeExpedition');
            if (savedExpedition) {
                console.log(t('expeditions.logs.foundSavedExpedition'), savedExpedition);
                
                this.activeExpedition = JSON.parse(savedExpedition);
                
                // Sprawdź czy ekspedycja nie jest już zakończona
                if (this.activeExpedition.endTime <= Date.now()) {
                    // Ekspedycja zakończona
                    console.log(t('expeditions.logs.expeditionEndTime'));
                    
                    // Zapisz informację o oczekujących nagrodach
                    this.pendingRewards = true;
                    localStorage.setItem('pendingExpeditionRewards', 'true');
                    
                    // Pokaż odznakę powiadomień
                    this.showNavigationBadge(true);
                    
                    // Tworzymy ekrany, ale ich nie pokazujemy (dopóki gracz nie kliknie na przycisk Gniazdo)
                    this.createActiveExpeditionScreen();
                    this.createRewardsScreen();
                    this.prepareRewardsScreen();
                    
                    // Wyczyść aktywną ekspedycję, ponieważ się zakończyła
                    this.activeExpedition = null;
                    localStorage.removeItem('activeExpedition');
                    localStorage.setItem('isExpeditionActive', 'false');
                    
                    // Upewnij się, że stan szafy jest normalny
                    this.resetWardrobeState();
                } else {
                    // Ekspedycja w trakcie
                    console.log(t('expeditions.logs.expeditionInProgress'));
                    this.createActiveExpeditionScreen();
                    this.startExpeditionTimer();
                    
                    // Ustaw globalny stan ekspedycji
                    window.isExpeditionActive = true;
                    localStorage.setItem('isExpeditionActive', 'true');
                }
            } else {
                console.log(t('expeditions.logs.noPendingExpedition'));
                // Resetujemy stan ekspedycji
                window.isExpeditionActive = false;
                localStorage.setItem('isExpeditionActive', 'false');
                this.resetWardrobeState();
            }
        } catch (e) {
            console.error("Błąd podczas ładowania aktywnej ekspedycji:", e);
            localStorage.removeItem('activeExpedition');
            window.isExpeditionActive = false;
            localStorage.setItem('isExpeditionActive', 'false');
            this.resetWardrobeState();
        }
    },
    
    // Obsługa przycisków nawigacji - POPRAWIONA FUNKCJA
    setupNavigationHandlers: function() {
        console.log("Ustawianie obsługi przycisków nawigacyjnych");
        
        // Znajdź przycisk "Gniazdo" w nawigacji
        const breedingNavButton = document.querySelector('.nav-button[data-screen="breeding-screen"]');
        
        if (breedingNavButton) {
            // Dodaj odznakę powiadomień do przycisku Gniazdo
            if (!breedingNavButton.querySelector('.nav-badge')) {
                const badge = document.createElement('div');
                badge.className = 'nav-badge';
                breedingNavButton.style.position = 'relative'; // Upewnij się, że przycisk ma pozycję względną
                breedingNavButton.appendChild(badge);
            }
            
            // Usuń wszystkie poprzednie event listenery (utwórz nowy element)
            const newBreedingButton = breedingNavButton.cloneNode(true);
            breedingNavButton.parentNode.replaceChild(newBreedingButton, breedingNavButton);
            
            // Dodaj nowy event listener
            newBreedingButton.addEventListener('click', (event) => {
                console.log("Kliknięto przycisk Gniazdo w nawigacji");
                
                // Zatrzymaj domyślne zachowanie
                event.preventDefault();
                event.stopPropagation();
                
                // Sprawdź, czy są oczekujące nagrody (poprzednio zakończona ekspedycja)
                if (this.pendingRewards || localStorage.getItem('pendingExpeditionRewards') === 'true') {
                    console.log("Wykryto oczekujące nagrody - pokazuję ekran nagród");
                    
                    // Przygotuj ekran nagród
                    this.prepareRewardsScreen();
                    
                    // Ukryj wszystkie ekrany
                    document.querySelectorAll('.game-screen').forEach(screen => {
                        screen.classList.remove('active');
                    });
                    
                    // Pokaż ekran nagród
                    const rewardsScreen = document.getElementById('expedition-rewards-screen');
                    if (rewardsScreen) {
                        rewardsScreen.style.display = 'flex';
                    }
                    
                    return;
                }
                
                // Sprawdź, czy trwa ekspedycja
                if (this.activeExpedition) {
                    // Sprawdź czy nie zakończyła się już
                    if (this.activeExpedition.endTime <= Date.now()) {
                        // Ekspedycja zakończona - pokaż ekran nagród
                        this.prepareRewardsScreen();
                        
                        // Ukryj wszystkie ekrany
                        document.querySelectorAll('.game-screen').forEach(screen => {
                            screen.classList.remove('active');
                        });
                        
                        // Pokaż ekran nagród
                        const rewardsScreen = document.getElementById('expedition-rewards-screen');
                        if (rewardsScreen) {
                            rewardsScreen.style.display = 'flex';
                        }
                        
                        // Wyczyść flagę aktywnej ekspedycji, ale ustaw flagę oczekujących nagród
                        this.activeExpedition = null;
                        this.pendingRewards = true;
                        
                        // Zapisz informację o oczekujących nagrodach w localStorage
                        try {
                            localStorage.setItem('pendingExpeditionRewards', 'true');
                            localStorage.setItem('isExpeditionActive', 'false');
                        } catch (e) {
                            console.error(t('expeditions.errors.errorSavingState', { error: e }));
                        }
                        
                        // Zresetuj stan szafy
                        this.resetWardrobeState();
                        
                        return;
                    } else {
                        // Ekspedycja w trakcie - pokaż ekran aktywnej ekspedycji
                        this.showActiveExpeditionScreen();
                        return;
                    }
                }
                
                // Jeśli nie ma aktywnej ekspedycji ani oczekujących nagród, po prostu pokaż ekran hodowli
                document.querySelectorAll('.game-screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                
                const breedingScreen = document.getElementById('breeding-screen');
                if (breedingScreen) {
                    breedingScreen.classList.add('active');
                }
            });
            
            console.log("Dodano nowy handler dla przycisku Gniazdo w nawigacji");
            
            // Sprawdź, czy są oczekujące nagrody i pokaż odznakę, jeśli tak
            if (this.pendingRewards || localStorage.getItem('pendingExpeditionRewards') === 'true') {
                this.showNavigationBadge(true);
            }
        }
        
        // Znajdź inne przyciski nawigacji i upewnij się, że nie pokazują aktywnej ekspedycji po kliknięciu
        document.querySelectorAll('.nav-button:not([data-screen="breeding-screen"])').forEach(button => {
            const screenId = button.getAttribute('data-screen');
            if (!screenId) return;
            
            // Usuń wszystkie poprzednie event listenery
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Dodaj nowy, "bezpieczny" event listener
            newButton.addEventListener('click', (event) => {
                console.log(`Kliknięto przycisk ${screenId} w nawigacji`);
                
                // Zatrzymaj domyślne zachowanie
                event.preventDefault();
                event.stopPropagation();
                
                // Sprawdź, czy jest ekran z nagrodami - nie pozwól zmienić ekranu
                const rewardsScreen = document.getElementById('expedition-rewards-screen');
                if (rewardsScreen && rewardsScreen.style.display === 'flex') {
                    console.log("Ekran nagród jest aktywny - zabraniam przejścia do innego ekranu");
                    return;
                }
                
                // Ukryj ekran aktywnej ekspedycji (jeśli jest pokazany)
                const expeditionScreen = document.getElementById('active-expedition-screen');
                if (expeditionScreen) {
                    expeditionScreen.classList.remove('show');
                    expeditionScreen.style.display = 'none';
                }
                
                // Przywróć scrollowanie
                document.body.style.overflow = '';
                
                // Pokaż żądany ekran
                document.querySelectorAll('.game-screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                
                const targetScreen = document.getElementById(screenId);
                if (targetScreen) {
                    targetScreen.classList.add('active');
                }
            });
        });
    },




  returnToExpeditionScreen: function() {
        console.log("Powrót do ekranu ekspedycji z ekranu szafy");
        
        // Sprawdź czy ekspedycja jest aktywna i była tymczasowo ukryta
        if (window.expeditionTemporarilyHidden && this.activeExpedition) {
            // Ukryj wszystkie ekrany
            document.querySelectorAll('.game-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Pokaż ekran ekspedycji
            const expeditionScreen = document.getElementById('active-expedition-screen');
            if (expeditionScreen) {
                expeditionScreen.style.display = 'flex';
                expeditionScreen.classList.add('show');
                
                // Zablokuj scrollowanie dokumentu
                document.body.style.overflow = 'hidden';
                
                // Zresetuj flagę ukrycia
                window.expeditionTemporarilyHidden = false;
            }
        }
    }





};

// Funkcja do aktualizacji UI ekspedycji w czasie rzeczywistym
function updateExpeditionStatsInRealTime() {
    // Sprawdź, czy ekran ekspedycji jest aktualnie widoczny
    const expeditionsScreen = document.getElementById('expeditions-screen');
    if (expeditionsScreen && expeditionsScreen.classList.contains('active')) {
        // Aktualizuj UI ekspedycji
        ExpeditionsModule.updateExpeditionUI();
    }
    
    // Sprawdź, czy powinniśmy pokazać ekran ekspedycji zamiast ekranu hodowli
    const breedingScreen = document.getElementById('breeding-screen');
    if (breedingScreen && breedingScreen.classList.contains('active')) {
        ExpeditionsModule.checkAndShowActiveExpedition();
    }
}

// Ustaw interwał aktualizacji co 3 sekundy
setInterval(updateExpeditionStatsInRealTime, 3000);

// Automatyczna inicjalizacja modułu po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        ExpeditionsModule.init();
    }, 1000);
});

// Dodatkowe wywołanie setupNavigationHandlers po pełnym załadowaniu dokumentu
window.addEventListener('load', function() {
    setTimeout(function() {
        ExpeditionsModule.setupNavigationHandlers();
    }, 2000);
});

// Funkcja blokująca wybór skina podczas aktywnej ekspedycji
function disableWardrobeDuringExpedition(wardrobeScreen) {
    // Dodaj komunikat o trwającej ekspedycji
    let expeditionMessage = wardrobeScreen.querySelector('.expedition-message');
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
        
        const wardrobe = wardrobeScreen.querySelector('.wardrobe-container');
        if (wardrobe) {
            wardrobe.insertBefore(expeditionMessage, wardrobe.firstChild);
        }
    }
    
    expeditionMessage.textContent = t('expeditions.notifications.expeditionInProgress');
    expeditionMessage.style.display = 'block';
    
    // Zablokuj wszystkie przyciski wyboru skina
    const skinButtons = wardrobeScreen.querySelectorAll('.skin-select-button');
    skinButtons.forEach(button => {
        if (!button.classList.contains('selected')) {
            button.disabled = true;
            button.style.backgroundColor = '#cccccc';
            button.style.cursor = 'not-allowed';
            button.style.opacity = '0.6';
            button.textContent = t('activeExpedition.skinUnavailable');
        }
    });
}

// Funkcja sprawdzająca, czy ekspedycja jest aktywna
function isExpeditionActive() {
    // Sprawdź storage
    const storedState = localStorage.getItem('isExpeditionActive');
    if (storedState === 'true') return true;
    
    // Sprawdź obiekt ekspedycji
    if (ExpeditionsModule.activeExpedition) return true;
    
    // Sprawdź localStorage bezpośrednio
    const savedExpedition = localStorage.getItem('activeExpedition');
    if (savedExpedition) {
        try {
            const expedition = JSON.parse(savedExpedition);
            if (expedition && expedition.endTime > Date.now()) {
                return true;
            }
        } catch (e) {
            console.error("Błąd podczas sprawdzania stanu ekspedycji:", e);
        }
    }
    
    return false;
}

// Sprawdź stan ekspedycji zaraz po załadowaniu
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Sprawdź stan ekspedycji
        const active = isExpeditionActive();
        console.log("Stan ekspedycji przy starcie:", active ? "Aktywna" : "Nieaktywna");
        
        // Ustaw globalną flagę
        window.isExpeditionActive = active;
        localStorage.setItem('isExpeditionActive', active ? 'true' : 'false');
    }, 500);
});





// Funkcja do poprawy z-index ekranu ekspedycji
function fixExpeditionScreenStyles() {
    console.log("Naprawa stylów ekranu ekspedycji");
    const expeditionScreen = document.getElementById('active-expedition-screen');
    if (expeditionScreen) {
        // Ustaw ekran ekspedycji na najwyższym poziomie z-index
        expeditionScreen.style.zIndex = '1500';
        
        // Dodaj styl dla kontenera, aby być pewnym że jest poprawnie wyświetlany
        const container = expeditionScreen.querySelector('.expedition-progress-container');
        if (container) {
            container.style.zIndex = '1501';
            container.style.position = 'relative';
        }
    }
}

// Wywołaj tę funkcję po stworzeniu ekranu ekspedycji
setTimeout(fixExpeditionScreenStyles, 1000);
document.addEventListener('gameLoaded', fixExpeditionScreenStyles);



// Wywołanie poprawek dla przycisku szafy po załadowaniu
window.addEventListener('load', function() {
    setTimeout(function() {
        if (ExpeditionsModule && typeof ExpeditionsModule.ensureWardrobeButtonWorks === 'function') {
            ExpeditionsModule.ensureWardrobeButtonWorks();
        }
    }, 2500);
});

// Wywołanie również przy zdarzeniu gameLoaded
document.addEventListener('gameLoaded', function() {
    setTimeout(function() {
        if (ExpeditionsModule && typeof ExpeditionsModule.ensureWardrobeButtonWorks === 'function') {
            ExpeditionsModule.ensureWardrobeButtonWorks();
        }
    }, 1000);
});




window.returnToExpeditionScreen = function() {
    ExpeditionsModule.returnToExpeditionScreen();
};

// Dodaj funkcję do globalnego zakresu
window.isExpeditionActive = isExpeditionActive;

// Dodaj funkcję do globalnego zakresu
window.disableWardrobeDuringExpedition = disableWardrobeDuringExpedition;

// Dodaj do globalnego zakresu
window.setupNavigationHandlers = ExpeditionsModule.setupNavigationHandlers.bind(ExpeditionsModule);
window.ExpeditionsModule = ExpeditionsModule;
window.updateExpeditionUI = ExpeditionsModule.updateExpeditionUI.bind(ExpeditionsModule);
window.isExpeditionActive = isExpeditionActive; // Dodajemy nowy eksport