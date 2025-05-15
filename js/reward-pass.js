// ===== SYSTEM PRZEPUSTKI NAGRÓD =====
console.log("Inicjalizacja systemu przepustki nagród");

// Główny obiekt zarządzający przepustką nagród
const RewardPassModule = {
    // Stała data zakończenia sezonu - ustawiona na 30 czerwca 2025
    SEASON_END_DATE: new Date(2025, 5, 30, 23, 59, 59).getTime(),
    

 
    










// Inicjalizacja modułu
init: function() {
    console.log("Inicjalizacja modułu przepustki nagród");
    
    // Pobierz zapisaną grę, jeśli istnieje
    const savedGame = localStorage.getItem('dziubCoinsGame');
    let hasSavedRewardPass = false;
    
    if (savedGame) {
        try {
            const parsedGame = JSON.parse(savedGame);
            // Sprawdź czy w zapisanej grze istnieje przepustka nagród
            if (parsedGame.rewardPass) {
                console.log("Znaleziono zapisaną przepustkę nagród:", parsedGame.rewardPass);
                hasSavedRewardPass = true;
                
                // Sprawdzamy, czy gameState ma już obiekt rewardPass
                if (!gameState.rewardPass) {
                    // Jeśli nie, kopiujemy cały obiekt z zapisanej gry
                    gameState.rewardPass = JSON.parse(JSON.stringify(parsedGame.rewardPass));
                    console.log("Odtworzono przepustkę z zapisanej gry:", gameState.rewardPass);
                } else {
                    // Jeśli tak, aktualizujemy tylko niektóre pola, zachowując distance i hasPremium
                    gameState.rewardPass.distance = parsedGame.rewardPass.distance || 0;
                    gameState.rewardPass.hasPremium = parsedGame.rewardPass.hasPremium || false;
                    
                    // NAPRAWIONE: Upewnij się, że claimedRewards jest poprawnie skopiowane
                    if (parsedGame.rewardPass.claimedRewards) {
                        gameState.rewardPass.claimedRewards = JSON.parse(JSON.stringify(parsedGame.rewardPass.claimedRewards));
                    } else {
                        gameState.rewardPass.claimedRewards = {
                            free: [],
                            premium: []
                        };
                    }
                    
                    console.log("Zaktualizowano przepustkę z zapisanej gry:", gameState.rewardPass);
                }
            }
        } catch (e) {
            console.error("Błąd podczas wczytywania zapisanej gry:", e);
        }
    }
    
    // Inicjalizuj obiekt rewardPass, jeśli nie został odtworzony z zapisanej gry
    if (!gameState.rewardPass) {
        console.log("Tworzenie nowego obiektu przepustki nagród");
        gameState.rewardPass = {
            distance: 0,
            hasPremium: false,
            lastUpdate: Date.now(),
            endTime: this.SEASON_END_DATE,
            claimedRewards: {
                free: [],
                premium: []
            }
        };
    } else {
        // Aktualizujemy datę końcową, ale zachowujemy inne wartości
        console.log("Aktualizacja daty końcowej przepustki nagród");
        gameState.rewardPass.endTime = this.SEASON_END_DATE;
        
        // NAPRAWIONE: Upewnij się, że struktura claimedRewards istnieje
        if (!gameState.rewardPass.claimedRewards) {
            gameState.rewardPass.claimedRewards = {
                free: [],
                premium: []
            };
        }
    }
    
    // NAPRAWIONE: Dodatkowe sprawdzenie i konwersja typów dla claimedRewards
    if (typeof gameState.rewardPass.claimedRewards !== 'object') {
        gameState.rewardPass.claimedRewards = {
            free: [],
            premium: []
        };
    }
    
    if (!Array.isArray(gameState.rewardPass.claimedRewards.free)) {
        gameState.rewardPass.claimedRewards.free = [];
    }
    
    if (!Array.isArray(gameState.rewardPass.claimedRewards.premium)) {
        gameState.rewardPass.claimedRewards.premium = [];
    }
    
    // Zapisz stan gry
    saveGame();
    console.log("Zapisano stan przepustki nagród:", gameState.rewardPass);
    
    // Dodatkowy zapis dla bezpieczeństwa
    try {
        localStorage.setItem('rewardPassClaimedRewards', JSON.stringify(gameState.rewardPass.claimedRewards));
    } catch (e) {
        console.error("Nie udało się zapisać dodatkowej kopii claimedRewards:", e);
    }
    
    // Ustaw listenery zdarzeń
    this.setupEventListeners();
    
    // Popraw pozycję przycisku przepustki
    this.fixRewardButtonPosition();
    
    // Generuj nagrody
    this.generateRewards();
    
    // Aktualizuj UI
    this.updateRewardPassUI();
},













    
    // Poprawienie pozycji przycisku przepustki
    fixRewardButtonPosition: function() {
        // Znajdź wszystkie przyciski przepustki
        document.querySelectorAll('.reward-pass-button').forEach(button => {
            // Ustaw niższą pozycję
            button.style.top = '70px';  // Zmienione z 15px na 70px, aby było niżej
            
            // Dodaj dodatkowe style dla lepszego wyglądu
            button.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
            button.style.width = '50px';
            button.style.height = '50px';
          button.style.backgroundColor = '#43b5e2';
            button.style.border = '2px solid gold';
            button.style.borderRadius = '50%';
            button.style.display = 'flex';
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';
            button.style.cursor = 'pointer';
            button.style.zIndex = '100';
            
            // Usuń emoji i dodaj grafikę
            button.innerHTML = '<img src="assets/images/rewards-icon.png" alt="Nagrody" style="width: 65px; height: 65px;">';
            
            // Dodaj listener
            button.addEventListener('click', () => {
                this.showRewardPassScreen();
            });
        });
    },
    
    // Ustawienie obsługi zdarzeń
    setupEventListeners: function() {
        console.log("Ustawianie listenerów dla przepustki nagród");
        
        // Przycisk powrotu
        const backButton = document.getElementById('reward-pass-back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.hideRewardPassScreen();
            });
        }
        
        // Przycisk Premium Pass
        const premiumButton = document.getElementById('premium-pass-button');
        if (premiumButton) {
            // Usuwamy stary listener, aby uniknąć podwójnych wywołań
            const newButton = premiumButton.cloneNode(true);
            if (premiumButton.parentNode) {
                premiumButton.parentNode.replaceChild(newButton, premiumButton);
            }
            
            // Dodajemy nowy listener
            newButton.addEventListener('click', () => {
                console.log("Kliknięto przycisk Premium Pass");
                this.purchasePremiumPass();
            });
        }
    },
    
    // Generowanie nagród
    generateRewards: function() {
        console.log("Generowanie nagród przepustki");
        
        // Pobierz kontenery nagród
        const freeContainer = document.getElementById('rewards-free-container');
        const premiumContainer = document.getElementById('rewards-premium-container');
        
        if (!freeContainer || !premiumContainer) {
            console.error("Nie znaleziono kontenerów nagród");
            return;
        }
        
        // Wyczyść kontenery
        freeContainer.innerHTML = '';
        premiumContainer.innerHTML = '';
        
        // Rozciągnij ścieżkę na większą szerokość
        const pathContainer = document.querySelector('.reward-path-container');
        const pathElement = document.querySelector('.reward-path');
        
        if (pathElement) {
            // Zwiększ szerokość ścieżki na 3500px (znacznie większa niż poprzednie 1400px)
            pathElement.style.minWidth = '3500px';
        }
        
        if (pathContainer) {
            // Dodaj przewijanie poziome
            pathContainer.style.overflowX = 'auto';
            pathContainer.style.WebkitOverflowScrolling = 'touch'; // Dla płynnego przewijania na iOS
            pathContainer.style.scrollbarWidth = 'thin'; // Cienki scrollbar w Firefox
            pathContainer.style.scrollBehavior = 'smooth'; // Płynne przewijanie
            
            // Style dla scrollbara
            const style = document.createElement('style');
            style.textContent = `
                .reward-path-container::-webkit-scrollbar {
                    height: 8px;
                }
                .reward-path-container::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                }
                .reward-path-container::-webkit-scrollbar-thumb {
                    background: rgba(156, 39, 176, 0.6);
                    border-radius: 10px;
                }
                .reward-path-container::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 39, 176, 0.8);
                }
            `;
            document.head.appendChild(style);
        }
        
      
        

// Nagrody darmowe - ZMIENIONE: Pierwsza nagroda na 100m, potem co 200m (300, 500, 700, itd.)
const freeRewards = [
    { distance: 100, type: 'seeds', amount: 1000 },
    { distance: 300, type: 'coins', amount: 50 },
    { distance: 500, type: 'fruit', amount: 2 },
    { distance: 700, type: 'seeds', amount: 2000 },
    { distance: 900, type: 'coins', amount: 100 },
    { distance: 1100, type: 'skin', id: 'lesny' }, // ZMIANA: Zamiast owoców teraz skin
    { distance: 1300, type: 'seeds', amount: 3000 },
    { distance: 1500, type: 'ton', amount: 0.003 },
    { distance: 1700, type: 'coins', amount: 150 },
    { distance: 1900, type: 'seeds', amount: 4000 },
    { distance: 2100, type: 'fruit', amount: 5 },
    { distance: 2300, type: 'seeds', amount: 5000 },
    { distance: 2500, type: 'coins', amount: 200 },
    { distance: 2700, type: 'fruit', amount: 7 },
    { distance: 2900, type: 'ton', amount: 0.005 },
    { distance: 3100, type: 'seeds', amount: 8000 },
    { distance: 3300, type: 'coins', amount: 300 },
    { distance: 3500, type: 'fruit', amount: 10 },
    { distance: 3700, type: 'seeds', amount: 10000 },
    { distance: 3900, type: 'ton', amount: 0.01 },
    { distance: 4100, type: 'coins', amount: 400 },
    { distance: 4300, type: 'seeds', amount: 12000 },
    { distance: 4500, type: 'fruit', amount: 15 },
    { distance: 4700, type: 'ton', amount: 0.02 },
    { distance: 4900, type: 'seeds', amount: 15000 },
    { distance: 5100, type: 'coins', amount: 500 },
    { distance: 5300, type: 'fruit', amount: 20 },
    { distance: 5500, type: 'seeds', amount: 20000 },
    { distance: 5700, type: 'ton', amount: 0.03 },
    { distance: 5900, type: 'coins', amount: 1000 }
];



        
        // Nagrody premium - ZMIENIONE: Pierwsza nagroda na 200m, potem co 200m (400, 600, 800, itd.)
        const premiumRewards = [
            { distance: 200, type: 'fruit', amount: 1 },
            { distance: 400, type: 'seeds', amount: 1500 },
            { distance: 600, type: 'coins', amount: 75 },
            { distance: 800, type: 'ton', amount: 0.001 },
            { distance: 1000, type: 'seeds', amount: 2500 },
            { distance: 1200, type: 'coins', amount: 120 },
            { distance: 1400, type: 'fruit', amount: 4 },
            { distance: 1600, type: 'ton', amount: 0.002 },
            { distance: 1800, type: 'seeds', amount: 3500 },
            { distance: 2000, type: 'coins', amount: 180 },
            { distance: 2200, type: 'ton', amount: 0.003 },
            { distance: 2400, type: 'fruit', amount: 6 },
            { distance: 2600, type: 'seeds', amount: 6000 },
            { distance: 2800, type: 'coins', amount: 250 },
            { distance: 3000, type: 'ton', amount: 0.004 },
            { distance: 3200, type: 'fruit', amount: 8 },
            { distance: 3400, type: 'seeds', amount: 9000 },
            { distance: 3600, type: 'ton', amount: 0.007 },
            { distance: 3800, type: 'coins', amount: 350 },
            { distance: 4000, type: 'fruit', amount: 12 },
            { distance: 4200, type: 'ton', amount: 0.015 },
            { distance: 4400, type: 'seeds', amount: 12000 },
            { distance: 4600, type: 'coins', amount: 450 },
            { distance: 4800, type: 'fruit', amount: 18 },
            { distance: 5000, type: 'ton', amount: 0.025 },
            { distance: 5200, type: 'seeds', amount: 18000 },
            { distance: 5400, type: 'coins', amount: 600 },
            { distance: 5600, type: 'ton', amount: 0.035 },
            { distance: 5800, type: 'fruit', amount: 25 },
            { distance: 6000, type: 'ton', amount: 0.1 }
        ];
        
        // Dodaj nagrody do kontenerów
        freeRewards.forEach(reward => {
            const marker = this.createRewardMarker(reward, 'free');
            marker.style.left = `${(reward.distance / 6000) * 100}%`;
            freeContainer.appendChild(marker);
        });
        
        premiumRewards.forEach(reward => {
            const marker = this.createRewardMarker(reward, 'premium');
            marker.style.left = `${(reward.distance / 6000) * 100}%`;
            premiumContainer.appendChild(marker);
        });
        
        // Dodaj znaczniki dystansu (co 500m zamiast co 1000m dla większej czytelności)
        const distanceMarkers = document.querySelectorAll('.distance-marker');
        distanceMarkers.forEach(marker => marker.remove());
        
        const pathLine = document.querySelector('.path-line');
        if (pathLine && pathLine.parentNode) {
            for (let i = 0; i <= 12; i++) {
                const distance = i * 500;
                const marker = document.createElement('div');
                marker.className = 'distance-marker';
                marker.style.position = 'absolute';
                marker.style.top = '50%';
                marker.style.transform = 'translateY(-50%)';
                marker.style.left = `${(distance / 6000) * 100}%`;
                marker.style.fontSize = '12px';
                marker.style.fontWeight = 'bold';
                marker.style.color = 'white';
                marker.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                marker.style.borderRadius = '10px';
                marker.style.padding = '2px 8px';
                marker.style.zIndex = '2';
                marker.textContent = `${distance}m`;
                
                pathLine.parentNode.appendChild(marker);
            }
        }
    },
    
  
    





// Tworzenie znacznika nagrody
createRewardMarker: function(reward, type) {
    const marker = document.createElement('div');
    marker.className = `reward-marker ${type}`;
    marker.setAttribute('data-distance', reward.distance);
    marker.setAttribute('data-type', type);
    marker.setAttribute('data-reward-type', reward.type);
    marker.setAttribute('data-reward-amount', reward.amount);
    marker.style.position = 'absolute';
    marker.style.width = '65px';
    marker.style.height = '80px';
    marker.style.marginLeft = '-32px'; // Wyśrodkowanie względem pozycji
    marker.style.backgroundColor = 'white';
    marker.style.borderRadius = '10px';
    marker.style.display = 'flex';
    marker.style.flexDirection = 'column';
    marker.style.alignItems = 'center';
    marker.style.justifyContent = 'center';
    marker.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    marker.style.cursor = 'pointer';
    marker.style.transition = 'transform 0.2s, box-shadow 0.2s';
    marker.style.border = type === 'free' ? '2px solid #4CAF50' : '2px solid #FFC107';
    
    // Efekt hover
    marker.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    });
    
    marker.addEventListener('mouseout', function() {
        this.style.transform = '';
        this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    });
    
    // Dodaj ikonę nagrody
    const icon = document.createElement('div');
    icon.className = 'reward-icon';
    icon.style.width = '40px';
    icon.style.height = '40px';
    icon.style.marginBottom = '5px';
    icon.style.backgroundSize = 'contain';
    icon.style.backgroundRepeat = 'no-repeat';
    icon.style.backgroundPosition = 'center';
    
    // Wybierz odpowiednią ikonę
    switch (reward.type) {
        case 'seeds':
            icon.style.backgroundImage = 'url("assets/images/seed-icon.png")';
            break;
        case 'coins':
            icon.style.backgroundImage = 'url("assets/images/coin-icon.png")';
            break;
        case 'fruit':
            icon.style.backgroundImage = 'url("assets/images/fruit-icon.png")';
            break;
        case 'ton':
            icon.style.backgroundImage = 'url("assets/images/ton-icon.png")';
            break;
        case 'skin': // DODANE: Nowy przypadek dla skina
            icon.style.backgroundImage = 'url("assets/images/skins/lesny-skin.png")';
            icon.style.backgroundSize = 'cover';
            break;
    }
    
    marker.appendChild(icon);
    
    // Dodaj ilość nagrody
    const amount = document.createElement('div');
    amount.className = 'reward-amount';
    amount.style.fontSize = '12px';
    amount.style.fontWeight = 'bold';
    amount.style.textAlign = 'center';
    
    // Formatuj ilość nagrody
    let displayAmount = '';
    if (reward.type === 'ton') {
        displayAmount = reward.amount.toFixed(3);
    } else if (reward.type === 'skin') { // DODANE: Specjalne formatowanie dla skina
        displayAmount = 'Skin';
    } else {
        displayAmount = reward.amount.toString();
    }
    
    amount.textContent = displayAmount;
    marker.appendChild(amount);
    
    // Dodaj znacznik "Do odebrania" (widoczny tylko dla dostępnych nagród)
    const collectBadge = document.createElement('div');
    collectBadge.className = 'collect-badge';
    collectBadge.style.position = 'absolute';
    collectBadge.style.bottom = '5px';
    collectBadge.style.width = '55px';
    collectBadge.style.textAlign = 'center';
    collectBadge.style.fontSize = '10px';
    collectBadge.style.fontWeight = 'bold';
    collectBadge.style.color = 'white';
    collectBadge.style.backgroundColor = '#ff5722';
    collectBadge.style.borderRadius = '10px';
    collectBadge.style.padding = '2px 0';
    collectBadge.style.display = 'none'; // Domyślnie ukryty
    collectBadge.textContent = 'Odbierz!';
    marker.appendChild(collectBadge);
    
    // Dodaj obsługę kliknięcia
    marker.addEventListener('click', () => {
        this.claimReward(reward, type);
    });
    
    return marker;
},










    
    // Pokazanie ekranu przepustki nagród
    showRewardPassScreen: function() {
        // Ukryj wszystkie ekrany
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Pokaż ekran przepustki
        const rewardScreen = document.getElementById('reward-pass-screen');
        if (rewardScreen) {
            rewardScreen.classList.add('active');
            
            // Aktualizuj UI
            this.updateRewardPassUI();
            
            // Przewiń do aktualnej pozycji ptaka (z małym opóźnieniem, aby dać czas na renderowanie)
            setTimeout(() => {
                const pathContainer = document.querySelector('.reward-path-container');
                const birdElement = document.getElementById('reward-pass-bird');
                if (pathContainer && birdElement) {
                    const distance = gameState.rewardPass.distance;
                    const position = Math.min(1, distance / 6000);
                    const scrollPosition = pathContainer.scrollWidth * position - (pathContainer.clientWidth / 2);
                    pathContainer.scrollTo({
                        left: Math.max(0, scrollPosition),
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    },
    
    // Ukrycie ekranu przepustki nagród
    hideRewardPassScreen: function() {
        // Ukryj ekran przepustki
        const rewardScreen = document.getElementById('reward-pass-screen');
        if (rewardScreen) {
            rewardScreen.classList.remove('active');
        }
        
        // Pokaż poprzedni ekran (domyślnie breeding)
        const breedingScreen = document.getElementById('breeding-screen');
        if (breedingScreen) {
            breedingScreen.classList.add('active');
        }
    },
    
    // Aktualizacja UI przepustki nagród
    updateRewardPassUI: function() {
        console.log("Aktualizacja UI przepustki nagród");
        
        // Aktualizuj timer
        this.updateTimer();
        
        // Aktualizuj pozycję ptaka
        this.updateBirdPosition();
        
        // Aktualizuj stan nagród
        this.updateRewardStates();
        
        // Aktualizuj wyświetlanie aktualnego dystansu
        this.updateCurrentDistance();
        
        // Aktualizuj stan premium, jeśli jest aktywny
        if (gameState.rewardPass.hasPremium) {
            const premiumButton = document.getElementById('premium-pass-button');
            if (premiumButton) {
                premiumButton.textContent = "Premium Pass Aktywny";
                premiumButton.style.backgroundColor = "#4CAF50";
                premiumButton.disabled = true;
                premiumButton.style.cursor = "default";
            }
            
            // Dodaj informację o aktywnym premium
            const premiumContainer = document.querySelector('.premium-pass-container');
            if (premiumContainer) {
                // Sprawdź czy informacja o premium już istnieje
                if (!document.getElementById('premium-active-badge')) {
                    const premiumBadge = document.createElement('div');
                    premiumBadge.id = 'premium-active-badge';
                    premiumBadge.style.backgroundColor = '#FFC107';
                    premiumBadge.style.color = '#333';
                    premiumBadge.style.padding = '5px 15px';
                    premiumBadge.style.borderRadius = '20px';
                    premiumBadge.style.fontWeight = 'bold';
                    premiumBadge.style.marginBottom = '10px';
                    premiumBadge.style.display = 'inline-block';
                    premiumBadge.textContent = '✨ PREMIUM AKTYWNE ✨';
                    
                    // Wstaw na początek kontenera
                    premiumContainer.insertBefore(premiumBadge, premiumContainer.firstChild);
                }
            }
        }
    },
    
    




// Aktualizacja wyświetlania aktualnego dystansu
updateCurrentDistance: function() {
    // Znajdź element z tytułem nagrody (będziemy dodawać informację o dystansie przed nim)
    const titleElement = document.querySelector('.reward-pass-title');
    if (!titleElement) return;
    
    // Sprawdź czy już istnieje element z dystansem
    let distanceElement = document.getElementById('current-distance-info');
    if (!distanceElement) {
        // Utwórz nowy element
        distanceElement = document.createElement('div');
        distanceElement.id = 'current-distance-info';
        distanceElement.style.textAlign = 'center';
        distanceElement.style.fontSize = '18px';
        distanceElement.style.fontWeight = 'bold';
        distanceElement.style.marginBottom = '10px';
        distanceElement.style.color = '#333';
        distanceElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        distanceElement.style.padding = '8px';
        distanceElement.style.borderRadius = '8px';
        distanceElement.style.display = 'inline-block';
        
        // Wstaw przed tytułem
        titleElement.parentNode.insertBefore(distanceElement, titleElement);
    }
    
    // Aktualizuj tekst
    distanceElement.textContent = `Aktualny dystans: ${Math.floor(gameState.rewardPass.distance)}m`;
},




    
    // Aktualizacja timera
    updateTimer: function() {
        const timerElement = document.getElementById('reward-pass-timer');
        if (!timerElement) return;
        
        // Oblicz pozostały czas
        const now = Date.now();
        const end = gameState.rewardPass.endTime;
        const timeLeft = Math.max(0, end - now);
        
        // Oblicz dni, godziny, minuty
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        // Aktualizuj tekst
        timerElement.textContent = `Pozostało: ${days}d ${hours}h ${minutes}m`;
        
        // Jeśli czas się skończył, rozpocznij nowy sezon
        if (timeLeft <= 0) {
            this.startNewSeason();
        }
    },
    
    // Aktualizacja pozycji ptaka
    updateBirdPosition: function() {
        const birdElement = document.getElementById('reward-pass-bird');
        if (!birdElement) return;
        
        // Oblicz pozycję ptaka na podstawie dystansu
        const distance = gameState.rewardPass.distance;
        const position = Math.min(100, (distance / 6000) * 100);
        
        // Aktualizuj pozycję
        birdElement.style.left = `${position}%`;
        
        // Dodaj styl do ptaka (pulsowanie, gdy jest blisko nagrody)
        const isNearReward = this.isNearReward(distance);
        if (isNearReward) {
            if (!birdElement.classList.contains('pulsing')) {
                birdElement.classList.add('pulsing');
                birdElement.style.animation = 'birdPulse 1.5s infinite';
            }
        } else {
            birdElement.classList.remove('pulsing');
            birdElement.style.animation = 'none';
        }
    },
    
    // Sprawdź czy ptak jest blisko jakiejś nagrody do odbioru
    isNearReward: function(distance) {
        // Pobierz wszystkie nagrody
        const rewards = document.querySelectorAll('.reward-marker');
        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];
            const rewardDistance = parseInt(reward.getAttribute('data-distance'));
            const rewardType = reward.getAttribute('data-type');
            
            // Sprawdź czy nagroda jest w pobliżu (w obrębie 20m)
            if (Math.abs(distance - rewardDistance) <= 20) {
                // Sprawdź czy nagroda może być odebrana
                const isAvailable = rewardDistance <= distance;
                const isClaimed = gameState.rewardPass.claimedRewards[rewardType] && 
                                  gameState.rewardPass.claimedRewards[rewardType].includes(rewardDistance);
                const isLocked = rewardType === 'premium' && !gameState.rewardPass.hasPremium;
                
                if (isAvailable && !isClaimed && !isLocked) {
                    return true;
                }
            }
        }
        
        return false;
    },
    
    // Aktualizacja stanu nagród
    updateRewardStates: function() {
        // Pobierz wszystkie znaczniki nagród
        const markers = document.querySelectorAll('.reward-marker');
        
        // Aktualizuj stan każdego znacznika
        markers.forEach(marker => {
            const distance = parseInt(marker.getAttribute('data-distance'));
            const type = marker.getAttribute('data-type');
            
            // Sprawdź czy nagroda jest dostępna
            const isAvailable = distance <= gameState.rewardPass.distance;
            
            // NAPRAWIONE: Lepsze sprawdzanie czy nagroda została odebrana
            const isClaimed = Array.isArray(gameState.rewardPass.claimedRewards[type]) && 
                             gameState.rewardPass.claimedRewards[type].includes(distance);
            
            // Sprawdź czy nagroda jest zablokowana (premium)
            const isLocked = type === 'premium' && !gameState.rewardPass.hasPremium;
            
            // Aktualizuj styl znacznika
            marker.classList.remove('available', 'claimed', 'locked');
            
            // Znajdź znacznik "do odebrania"
            const collectBadge = marker.querySelector('.collect-badge');
            
            // Znajdź znacznik kłódki
            const lockedBadge = marker.querySelector('.locked-badge');
            
            if (isClaimed) {
                marker.classList.add('claimed');
                marker.style.backgroundColor = '#f5f5f5';
                marker.style.opacity = '0.7';
                marker.style.border = type === 'free' ? '2px solid #A5D6A7' : '2px solid #FFE082';
                
                // Dodaj symbol checkmark dla odebranych nagród
                if (!marker.querySelector('.claimed-badge')) {
                    const claimedBadge = document.createElement('div');
                    claimedBadge.className = 'claimed-badge';
                    claimedBadge.style.position = 'absolute';
                    claimedBadge.style.top = '-10px';
                    claimedBadge.style.right = '-10px';
                    claimedBadge.style.width = '25px';
                    claimedBadge.style.height = '25px';
                    claimedBadge.style.backgroundColor = '#4CAF50';
                    claimedBadge.style.color = 'white';
                    claimedBadge.style.borderRadius = '50%';
                    claimedBadge.style.display = 'flex';
                    claimedBadge.style.justifyContent = 'center';
                    claimedBadge.style.alignItems = 'center';
                    claimedBadge.style.fontWeight = 'bold';
                    claimedBadge.style.fontSize = '14px';
                    claimedBadge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                    claimedBadge.innerHTML = '✓';
                    marker.appendChild(claimedBadge);
                }
                
                // Usuń znacznik kłódki, jeśli istnieje
                if (lockedBadge) {
                    lockedBadge.remove();
                }
                
                // Ukryj znacznik "do odebrania"
                if (collectBadge) collectBadge.style.display = 'none';
            } else if (isLocked) {
                marker.classList.add('locked');
                marker.style.opacity = '0.6';
                marker.style.cursor = 'default';
                
                // Dodaj symbol kłódki dla zablokowanych nagród premium
                if (!marker.querySelector('.locked-badge')) {
                    const lockedBadge = document.createElement('div');
                    lockedBadge.className = 'locked-badge';
                    lockedBadge.style.position = 'absolute';
                    lockedBadge.style.top = '-10px';
                    lockedBadge.style.right = '-10px';
                    lockedBadge.style.width = '25px';
                    lockedBadge.style.height = '25px';
                    lockedBadge.style.backgroundColor = '#757575';
                    lockedBadge.style.color = 'white';
                    lockedBadge.style.borderRadius = '50%';
                    lockedBadge.style.display = 'flex';
                    lockedBadge.style.justifyContent = 'center';
                    lockedBadge.style.alignItems = 'center';
                    lockedBadge.style.fontWeight = 'bold';
                    lockedBadge.style.fontSize = '12px';
                    lockedBadge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                    lockedBadge.innerHTML = '🔒';
                    marker.appendChild(lockedBadge);
                }
                
                // Ukryj znacznik "do odebrania"
                if (collectBadge) collectBadge.style.display = 'none';
            } else if (isAvailable) {
                marker.classList.add('available');
                marker.style.borderColor = '#ff5722';
                marker.style.boxShadow = '0 0 10px rgba(255, 87, 34, 0.7)';
                
                // Usuń znacznik kłódki, jeśli istnieje
                if (lockedBadge) {
                    lockedBadge.remove();
                }
                
                // Pokaż znacznik "do odebrania"
                if (collectBadge) collectBadge.style.display = 'block';
            } else {
                // Usuń znacznik kłódki, jeśli istnieje i premium jest aktywne
                if (lockedBadge && type === 'premium' && gameState.rewardPass.hasPremium) {
                    lockedBadge.remove();
                }
                
                // Ukryj znacznik "do odebrania" dla niedostępnych nagród
                if (collectBadge) collectBadge.style.display = 'none';
            }
        });
    },
    

    




// Odbiór nagrody
claimReward: function(reward, type) {
    console.log("Próba odebrania nagrody:", reward, "typ:", type);
    
    // Sprawdź czy nagroda jest dostępna
    if (reward.distance > gameState.rewardPass.distance) {
        showNotification("Musisz przejść większy dystans, aby odebrać tę nagrodę!");
        return;
    }
    
    // Sprawdź czy nagroda premium jest odblokowana
    if (type === 'premium' && !gameState.rewardPass.hasPremium) {
        showNotification("Musisz kupić Premium Pass, aby odebrać tę nagrodę!");
        return;
    }
    
    // NAPRAWIONE: Lepsze sprawdzanie czy nagroda została już odebrana
    if (Array.isArray(gameState.rewardPass.claimedRewards[type]) && 
        gameState.rewardPass.claimedRewards[type].includes(reward.distance)) {
        showNotification("Ta nagroda została już odebrana!");
        return;
    }
    
    // Dodaj nagrodę do zasobów gracza
    switch (reward.type) {
        case 'seeds':
            gameState.resources.seeds += reward.amount;
            break;
        case 'coins':
            gameState.resources.coins += reward.amount;
            break;
        case 'fruit':
            gameState.resources.fruits += reward.amount;
            break;
        case 'ton':
            gameState.resources.ton += reward.amount;
            break;
        case 'skin': // DODANE: Nowy przypadek dla odblokowywania skina
            if (!gameState.skins) {
                gameState.skins = {
                    currentSkin: 'default',
                    unlockedSkins: ['default']
                };
            }
            if (!gameState.skins.unlockedSkins.includes(reward.id)) {
                gameState.skins.unlockedSkins.push(reward.id);
                showNotification(`Odblokowano skin: Leśny Zwiadowca!`);
            }
            break;
    }
    
    // Oznacz nagrodę jako odebraną
    if (!Array.isArray(gameState.rewardPass.claimedRewards[type])) {
        gameState.rewardPass.claimedRewards[type] = [];
    }
    
    // Dodaj dystans nagrody do listy odebranych
    gameState.rewardPass.claimedRewards[type].push(reward.distance);
    
    // NAPRAWIONE: Dodatkowy backup stanu odebranych nagród
    try {
        localStorage.setItem('rewardPassClaimedRewards', JSON.stringify(gameState.rewardPass.claimedRewards));
    } catch (e) {
        console.error("Nie udało się zapisać dodatkowej kopii claimedRewards:", e);
    }
    
    // Zapisz stan gry
    saveGame();
    
    // Pokaż powiadomienie
    let rewardText = '';
    switch (reward.type) {
        case 'seeds':
            rewardText = `${reward.amount} ziarenek`;
            break;
        case 'coins':
            rewardText = `${reward.amount} DziubCoinów`;
            break;
        case 'fruit':
            rewardText = `${reward.amount} owoców`;
            break;
        case 'ton':
            rewardText = `${reward.amount.toFixed(3)} TON`;
            break;
        case 'skin': // DODANE: Nowy przypadek
            rewardText = 'Skin: Leśny Zwiadowca';
            break;
    }
    
    showNotification(`Odebrano nagrodę: ${rewardText}!`);
    
    // Aktualizuj UI
    this.updateRewardStates();
    updateUI();
},





    
   
    



// Zakup Premium Pass
purchasePremiumPass: function() {
    console.log("Próba zakupu Premium Pass, stan TON:", gameState.resources.ton);
    
    // Sprawdź czy gracz ma wystarczająco TON
    if (gameState.resources.ton < 2) {
        showNotification("Nie masz wystarczająco TON! Potrzebujesz 2 TON, aby kupić Premium Pass.");
        return;
    }
    
    // Odejmij TON
    gameState.resources.ton -= 2;
    
    // Aktywuj Premium Pass
    gameState.rewardPass.hasPremium = true;
    
    // Dodaj bonus +500m
    gameState.rewardPass.distance += 500;
    
    // Zapisz stan gry
    saveGame();
    
    // Zapisz również w dodatkowym kluczu
    try {
        localStorage.setItem('rewardPassPremium', '1');
        localStorage.setItem('rewardPassDistance', gameState.rewardPass.distance.toString());
    } catch (e) {
        console.error("Błąd podczas zapisywania stanu premium:", e);
    }
    
    // Pokaż powiadomienie
    showNotification("Gratulacje! Aktywowano Premium Pass i dodano bonus +500m!");
    
    // Aktualizuj UI
    this.updateRewardPassUI();
    
    // Usuń kłódki ze wszystkich nagród premium
    document.querySelectorAll('.reward-marker[data-type="premium"] .locked-badge').forEach(badge => {
        badge.remove();
    });
    
    // Zaktualizuj dostępność nagród premium
    document.querySelectorAll('.reward-marker[data-type="premium"]').forEach(marker => {
        marker.classList.remove('locked');
        marker.style.opacity = '1';
        marker.style.cursor = 'pointer';
        
        // Sprawdź czy nagroda jest w zasięgu i nie została odebrana
        const distance = parseInt(marker.getAttribute('data-distance'));
        const isClaimed = gameState.rewardPass.claimedRewards.premium && 
                         gameState.rewardPass.claimedRewards.premium.includes(distance);
        
        if (distance <= gameState.rewardPass.distance && !isClaimed) {
            marker.classList.add('available');
            marker.style.borderColor = '#ff5722';
            marker.style.boxShadow = '0 0 10px rgba(255, 87, 34, 0.7)';
            
            // Pokaż znacznik "do odebrania"
            const collectBadge = marker.querySelector('.collect-badge');
            if (collectBadge) collectBadge.style.display = 'block';
        }
    });
    
    updateUI();
},


    
    // Rozpoczęcie nowego sezonu
    startNewSeason: function() {
        // Ustawienie nowej daty końcowej (3 miesiące od teraz)
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + 3);
        
        // Resetuj przepustkę, zachowując dystans
        const previousDistance = gameState.rewardPass.distance;
        gameState.rewardPass = {
            distance: previousDistance, // Zachowaj dystans
            hasPremium: false,
            lastUpdate: Date.now(),
            endTime: newEndDate.getTime(),
            claimedRewards: {
                free: [],
                premium: []
            }
        };
        
        // Zapisz stan gry
        saveGame();
        
        // Pokaż powiadomienie
        showNotification("Rozpoczął się nowy sezon przepustki nagród! Twój dystans został zachowany, ale możesz zdobyć nowe nagrody.");
        
        // Aktualizuj UI
        this.updateRewardPassUI();
    },
    

    


    // Aktualizacja odległości na podstawie ekspedycji
updateDistance: function(distanceGained) {
    if (!gameState.rewardPass) {
        // Jeśli obiekt rewardPass nie istnieje, utwórz go
        gameState.rewardPass = {
            distance: 0,
            hasPremium: false,
            lastUpdate: Date.now(),
            endTime: this.SEASON_END_DATE,
            claimedRewards: {
                free: [],
                premium: []
            }
        };
    }
    
    console.log("Aktualizacja dystansu przepustki:", distanceGained);
    
    // Dodaj odległość
    gameState.rewardPass.distance += distanceGained;
    
    // Zapisz stan gry natychmiast
    saveGame();
    console.log("Zapisano nowy dystans:", gameState.rewardPass.distance);
    
    // Dodatkowo zapisz dystans w osobnym kluczu (jako zabezpieczenie)
    try {
        localStorage.setItem('rewardPassDistance', gameState.rewardPass.distance.toString());
        localStorage.setItem('rewardPassPremium', gameState.rewardPass.hasPremium ? '1' : '0');
    } catch (e) {
        console.error("Błąd podczas zapisywania dystansu:", e);
    }
    
    // Aktualizuj UI jeśli ekran jest aktywny
    const rewardScreen = document.getElementById('reward-pass-screen');
    if (rewardScreen && rewardScreen.classList.contains('active')) {
        this.updateRewardPassUI();
    }
    
    // Sprawdź czy są nowe nagrody do odebrania
    this.checkNewRewards();
    
    // Dodaj animację ptaka po zdobyciu dystansu
    const birdElement = document.getElementById('reward-pass-bird');
    if (birdElement) {
        birdElement.style.animation = 'birdFly 0.5s';
        setTimeout(() => {
            birdElement.style.animation = '';
        }, 500);
    }
    
    // Pokaż animację nagrody dystansu, jeśli zysk jest znaczący
    if (distanceGained >= 50) {
        this.showRewardPassDistance(distanceGained);
    }
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
    animation.style.animation = 'zoomFadeIn 6s forwards';
    
    animation.innerHTML = `
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Twój ptak przebył dystans:</div>
        <div style="font-size: 48px; font-weight: bold; margin: 15px 0; color: gold;">+${distance}m</div>
        <div style="font-size: 14px;">Sprawdź przepustkę nagród</div>
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





// Funkcja bezpieczeństwa do odzyskiwania dystansu w przypadku błędów
recoverSavedDistance: function() {
    try {
        // Sprawdź czy mamy zapisany dystans w dodatkowym kluczu
        const savedDistance = localStorage.getItem('rewardPassDistance');
        const savedPremium = localStorage.getItem('rewardPassPremium');
        const savedClaimedRewards = localStorage.getItem('rewardPassClaimedRewards');
        
        if (savedDistance) {
            const parsedDistance = parseFloat(savedDistance);
            if (!isNaN(parsedDistance) && parsedDistance > 0) {
                // Jeśli zapisany dystans jest większy niż aktualny, przywróć go
                if (!gameState.rewardPass || parsedDistance > gameState.rewardPass.distance) {
                    console.log("Odzyskiwanie zapisanego dystansu:", parsedDistance);
                    if (!gameState.rewardPass) {
                        gameState.rewardPass = {
                            distance: parsedDistance,
                            hasPremium: savedPremium === '1',
                            lastUpdate: Date.now(),
                            endTime: this.SEASON_END_DATE,
                            claimedRewards: {
                                free: [],
                                premium: []
                            }
                        };
                    } else {
                        gameState.rewardPass.distance = parsedDistance;
                        if (savedPremium === '1') {
                            gameState.rewardPass.hasPremium = true;
                        }
                    }
                }
            }
        }
        
        // NAPRAWIONE: Odzyskiwanie stanu odebranych nagród
        if (savedClaimedRewards) {
            try {
                const parsedClaimedRewards = JSON.parse(savedClaimedRewards);
                if (parsedClaimedRewards && typeof parsedClaimedRewards === 'object') {
                    if (!gameState.rewardPass) {
                        gameState.rewardPass = {
                            distance: 0,
                            hasPremium: false,
                            lastUpdate: Date.now(),
                            endTime: this.SEASON_END_DATE,
                            claimedRewards: parsedClaimedRewards
                        };
                    } else {
                        gameState.rewardPass.claimedRewards = parsedClaimedRewards;
                    }
                    console.log("Odzyskano status odebranych nagród:", parsedClaimedRewards);
                }
            } catch (e) {
                console.error("Błąd podczas parsowania savedClaimedRewards:", e);
            }
        }
        
        // Po odzyskaniu stanu, zapisz stan gry
        saveGame();
    } catch (e) {
        console.error("Błąd podczas odzyskiwania stanu przepustki:", e);
    }
},





    // Sprawdzenie czy są nowe nagrody do odebrania
    checkNewRewards: function() {
        // Pobierz wszystkie znaczniki nagród
        const markers = document.querySelectorAll('.reward-marker');
        let hasNewRewards = false;
        
        // Sprawdź każdy znacznik
        markers.forEach(marker => {
            const distance = parseInt(marker.getAttribute('data-distance'));
            const type = marker.getAttribute('data-type');
            
            // Sprawdź czy nagroda jest dostępna, ale nie odebrana
            const isAvailable = distance <= gameState.rewardPass.distance;
            const isClaimed = gameState.rewardPass.claimedRewards[type] && 
                             gameState.rewardPass.claimedRewards[type].includes(distance);
            const isLocked = type === 'premium' && !gameState.rewardPass.hasPremium;
            
            if (isAvailable && !isClaimed && !isLocked) {
                hasNewRewards = true;
            }
        });
        
        // Dodaj efekt pulsowania do przycisku przepustki jeśli są nowe nagrody
        if (hasNewRewards) {
            document.querySelectorAll('.reward-pass-button').forEach(button => {
                button.style.boxShadow = '0 0 10px rgba(255, 87, 34, 0.7)';
                button.style.animation = 'pulse 1.5s infinite';
            });
        } else {
            document.querySelectorAll('.reward-pass-button').forEach(button => {
                button.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
                button.style.animation = 'none';
            });
        }
    }
};






// Dodaj styl animacji pulsowania
(function addPulseAnimation() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(255, 87, 34, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0); }
        }
        
        @keyframes birdPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes birdFly {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-15px) scale(1.1); }
            100% { transform: translateY(0) scale(1); }
        }
        
        .reward-marker {
            z-index: 10;
        }
        
        .reward-marker:hover {
            z-index: 20;
        }
        
        /* Stylizacja tła ścieżki */
        .reward-path {
            background: linear-gradient(45deg, rgba(230, 240, 255, 0.7), rgba(200, 220, 240, 0.8)) !important;
            box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.8);
        }
        
        /* Stylizacja linii ścieżki */
        .path-line {
            background: linear-gradient(90deg, #8B4513, #A0522D) !important;
            height: 15px !important;
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
})();

// Inicjalizacja modułu przepustki nagród po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Najpierw próbujemy odzyskać zapisany dystans (w przypadku błędów)
        RewardPassModule.recoverSavedDistance();
        // Następnie inicjalizujemy moduł
        RewardPassModule.init();
    }, 1000);
});

// Dodatkowe nasłuchiwanie na zdarzenie gameLoaded
document.addEventListener('gameLoaded', function() {
    setTimeout(function() {
        // Upewnij się, że zapisany dystans jest zachowany przy pełnym załadowaniu gry
        RewardPassModule.recoverSavedDistance();
        RewardPassModule.updateRewardPassUI();
    }, 2000);
});

// Eksportuj moduł do globalnego zakresu
window.RewardPassModule = RewardPassModule;