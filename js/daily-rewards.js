// Plik: js/daily-rewards.js

// Konfiguracja nagród dziennych
const DAILY_REWARDS = [
    { day: 1, type: 'seeds', value: 50, icon: 'assets/images/seed-icon.png' },
    { day: 2, type: 'coins', value: 5, icon: 'assets/images/coin-icon.png' },
    { day: 3, type: 'seeds', value: 100, icon: 'assets/images/seed-icon.png' },
    { day: 4, type: 'coins', value: 10, icon: 'assets/images/coin-icon.png' },
    { day: 5, type: 'fruits', value: 1, icon: 'assets/images/fruit-icon.png' },
    { day: 6, type: 'coins', value: 15, icon: 'assets/images/coin-icon.png' },
    { day: 7, type: 'ton', value: 0.01, icon: 'assets/images/ton-icon.png' },
];

// Klucz localStorage do śledzenia nagród
const DAILY_REWARDS_KEY = 'dziubCoinsGameDailyRewards';

// Klasa obsługująca system nagród dziennych
class DailyRewardsSystem {
    constructor() {
        this.rewards = DAILY_REWARDS;
        this.currentState = this.loadRewardState();
        this.initialized = false;
        this.timerInterval = null;
        
        // Przyrosty nagród dla kolejnych tygodni
        this.weeklyIncrements = {
            seeds: {
                1: 50,    // Dzień 1: +50 ziarenek z każdym tygodniem
                3: 50     // Dzień 3: +50 ziarenek z każdym tygodniem
            },
            coins: {
                2: 5,     // Dzień 2: +5 monet z każdym tygodniem
                4: 5,     // Dzień 4: +5 monet z każdym tygodniem
                6: 5      // Dzień 6: +5 monet z każdym tygodniem
            },
            fruits: {
                5: 0.5    // Dzień 5: +0.5 owoców z każdym tygodniem
            },
            ton: {
                7: 0.001  // Dzień 7: +0.001 TON z każdym tygodniem
            }
        };

        // Bazowe wartości nagród dla tygodnia 1
        this.baseRewards = {
            1: { // Dzień 1
                seeds: 50,
                coins: 0,
                fruits: 0,
                ton: 0
            },
            2: { // Dzień 2
                seeds: 0,
                coins: 5,
                fruits: 0,
                ton: 0
            },
            3: { // Dzień 3
                seeds: 100,
                coins: 0,
                fruits: 0,
                ton: 0
            },
            4: { // Dzień 4
                seeds: 0,
                coins: 10,
                fruits: 0,
                ton: 0
            },
            5: { // Dzień 5
                seeds: 0,
                coins: 0,
                fruits: 1,
                ton: 0
            },
            6: { // Dzień 6
                seeds: 0,
                coins: 15,
                fruits: 0,
                ton: 0
            },
            7: { // Dzień 7
                seeds: 0,
                coins: 0,
                fruits: 0,
                ton: 0.01
            }
        };
        
        console.log(t('dailyRewards.logs.constructor'), this.currentState);
    }

    // Funkcja do obliczania wartości nagrody na podstawie dnia i tygodnia
    getRewardValue(day, type, weekNumber) {
        // Pobierz bazową wartość nagrody dla tego dnia i typu
        const baseValue = this.baseRewards[day][type] || 0;
        
        // Jeśli to tydzień 1 lub brak przyrostu, zwróć wartość bazową
        if (weekNumber <= 1 || !this.weeklyIncrements[type] || !this.weeklyIncrements[type][day]) {
            return baseValue;
        }
        
        // Pobierz przyrost tygodniowy
        const increment = this.weeklyIncrements[type][day];
        
        // Oblicz finalną wartość
        let finalValue = baseValue + (increment * (weekNumber - 1));
        
        return finalValue;
    }

    // Inicjalizacja systemu nagród
    initialize() {
        try {
            if (this.initialized) return;
            
            console.log(t('dailyRewards.logs.initialization'));
            
            this.setupUI();
            this.updateUI();
            this.setupListeners();
            this.updateRewardNotificationIndicator();
            
            this.initialized = true;
            console.log(t('dailyRewards.logs.initialized'), this.currentState);
        } catch (error) {
            console.error(t('dailyRewards.logs.initError'), error);
        }
    }

    // Wczytywanie stanu nagród z localStorage
    loadRewardState() {
        const defaultState = {
            lastClaimDate: null,
            lastClaimDay: 0,
            claimedDays: [],
            streakComplete: false,
            streakReset: false,
            weekNumber: 1,
            completedWeeks: []
        };
        
        try {
            const savedState = localStorage.getItem(DAILY_REWARDS_KEY);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                // Dodaj brakujące pola, jeśli istnieją w defaultState a nie istnieją w parsedState
                return { ...defaultState, ...parsedState };
            }
        } catch (error) {
            console.error(t('dailyRewards.logs.loadError'), error);
        }
        
        return defaultState;
    }

    // Zapisywanie stanu nagród do localStorage
    saveRewardState() {
        try {
            localStorage.setItem(DAILY_REWARDS_KEY, JSON.stringify(this.currentState));
            console.log(t('dailyRewards.logs.stateSaved'), this.currentState);
        } catch (error) {
            console.error(t('dailyRewards.logs.saveError'), error);
        }
    }

    // Sprawdzanie czy nagroda jest dostępna do odebrania
    canClaimReward() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Jeśli nie ma ostatniej daty odbioru, nagroda jest dostępna
        if (!this.currentState.lastClaimDate) {
            return true;
        }
        
        const lastClaim = new Date(this.currentState.lastClaimDate);
        lastClaim.setHours(0, 0, 0, 0);
        
        // Sprawdź czy minął przynajmniej jeden dzień od ostatniego odbioru
        return today.getTime() > lastClaim.getTime();
    }

    // Sprawdzanie czy seria została przerwana (tylko resetuje postęp dni, nie tygodni)
    checkStreakReset() {
        if (!this.currentState.lastClaimDate) return false;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastClaim = new Date(this.currentState.lastClaimDate);
        lastClaim.setHours(0, 0, 0, 0);
        
        // Oblicz, ile dni minęło od ostatniego odbioru
        const timeDiff = today.getTime() - lastClaim.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        console.log(`${t('dailyRewards.logs.daysSinceLastClaim')} ${daysDiff}`);
        
        // Jeśli minął więcej niż 1 dzień, resetujemy postęp dni (nie tygodni)
        return daysDiff > 1;
    }

    // Sprawdza, czy aktualny tydzień został ukończony
    isWeekComplete() {
        // Tydzień jest ukończony, gdy ostatni odebrany dzień to 7
        return this.currentState.lastClaimDay === 7;
    }

    // Rozpoczyna nowy tydzień
    startNewWeek() {
        console.log(`${t('dailyRewards.logs.startingNewWeek')} ${this.currentState.weekNumber}`);
        
        // Dodaj ukończony tydzień do listy
        this.currentState.completedWeeks.push(this.currentState.weekNumber);
        
        // Zwiększ numer tygodnia
        this.currentState.weekNumber++;
        
        // Zresetuj stan dziennego postępu
        this.currentState.lastClaimDay = 0;
        this.currentState.claimedDays = [];
        
        // Zapisz nowy stan
        this.saveRewardState();
        
        showNotification(t('dailyRewards.notifications.weeklyBonus', { week: this.currentState.weekNumber - 1 }));
    }

    // Pobieranie następnego dnia do odebrania
    getNextClaimDay() {
        // Sprawdź czy seria bieżącego tygodnia jest kompletna
        if (this.isWeekComplete()) {
            // Jeśli tak, rozpocznij nowy tydzień
            this.startNewWeek();
            return 1; // Pierwszy dzień nowego tygodnia
        }
        
        // Sprawdź czy seria została przerwana (tylko dla dni, nie tygodni)
        if (this.checkStreakReset()) {
            console.log(t('dailyRewards.logs.streakReset'));
            // Resetujemy tylko postęp dni, ale zachowujemy tydzień
            this.currentState.lastClaimDay = 0;
            this.currentState.claimedDays = [];
            this.saveRewardState();
        }
        
        return this.currentState.lastClaimDay + 1;
    }

    // Odbieranie nagrody
    claimReward() {
        if (!this.canClaimReward()) {
            showNotification(t('dailyRewards.notifications.cantClaimNow'));
            return false;
        }
        
        // Ustal dzień nagrody do odebrania
        const nextDay = this.getNextClaimDay() || 1;
        if (nextDay > this.rewards.length) {
            showNotification(t('dailyRewards.notifications.allRewardsClaimed'));
            return false;
        }
        
        // Znajdź nagrodę na dany dzień
        const reward = this.rewards.find(r => r.day === nextDay);
        if (!reward) {
            showNotification(t('dailyRewards.notifications.rewardNotFound'));
            return false;
        }
        
        // Dodaj nagrodę do zasobów gracza
        this.addRewardToPlayer(reward);
        
        // Aktualizuj stan nagród
        this.currentState.lastClaimDate = new Date().toISOString();
        this.currentState.lastClaimDay = nextDay;
        this.currentState.claimedDays.push(nextDay);
        
        // Zapisz stan i aktualizuj UI
        this.saveRewardState();
        this.updateUI();
        
        // Pokaż powiadomienie o odebraniu nagrody
        this.showRewardNotification(reward);
        
        // Odtwórz animację
        this.playRewardAnimation(reward);
        
        // Aktualizuj wskaźnik powiadomień na przycisku
        this.updateRewardNotificationIndicator();
        
        return true;
    }

    // Dodawanie nagrody do zasobów gracza
    addRewardToPlayer(reward) {
        if (!window.gameState || !window.gameState.resources) {
            console.error('Nie można dodać nagrody: gameState nie jest dostępny');
            return;
        }
        
        // Oblicz wartość nagrody
        const weekNumber = this.currentState.weekNumber;
        const day = reward.day;
        let finalValue = this.getRewardValue(day, reward.type, weekNumber);
        
        console.log(`Nagroda ${reward.type} dzień ${day}: finalna=${finalValue} (tydzień ${weekNumber})`);
        
        switch (reward.type) {
            case 'seeds':
                window.gameState.resources.seeds += Math.floor(finalValue);
                break;
            case 'coins':
                window.gameState.resources.coins += Math.floor(finalValue);
                break;
            case 'fruits':
                window.gameState.resources.fruits += finalValue;
                break;
            case 'ton':
                window.gameState.resources.ton += finalValue;
                break;
            default:
                console.error('Nieznany typ nagrody:', reward.type);
        }
        
        // Zapisz stan gry
        if (typeof window.saveGame === 'function') {
            window.saveGame();
        } else {
            console.warn("Funkcja saveGame nie jest dostępna");
        }
        
        // Aktualizuj UI
        if (typeof window.updateUI === 'function') {
            window.updateUI();
        } else {
            console.warn("Funkcja updateUI nie jest dostępna");
        }
    }

    // Wyświetlanie powiadomienia o nagrodzie
    showRewardNotification(reward) {
        // Oblicz wartość nagrody
        const weekNumber = this.currentState.weekNumber;
        const day = reward.day;
        let finalValue = this.getRewardValue(day, reward.type, weekNumber);
        
        // Formatowanie wartości w zależności od typu
        let displayValue;
        if (reward.type === 'ton') {
            displayValue = finalValue.toFixed(3);
        } else if (reward.type === 'fruits') {
            displayValue = finalValue.toFixed(1);
        } else {
            displayValue = Math.floor(finalValue);
        }
        
        let message = `${t('notifications.rewardReceived', { week: weekNumber, value: displayValue })} `;
        
        switch (reward.type) {
            case 'seeds':
                // Obsługa polskiej gramatyki dla ziarenek
                if (finalValue === 1) {
                    message += t('dailyRewards.rewardTypes.seeds.one') + '!';
                } else if ((finalValue % 10 >= 2 && finalValue % 10 <= 4) && 
                          (finalValue % 100 < 10 || finalValue % 100 > 20)) {
                    message += t('dailyRewards.rewardTypes.seeds.few') + '!';
                } else {
                    message += t('dailyRewards.rewardTypes.seeds.many') + '!';
                }
                break;
            case 'coins':
                // Obsługa polskiej gramatyki dla DziubCoinów
                if (finalValue === 1) {
                    message += t('dailyRewards.rewardTypes.coins.one') + '!';
                } else if ((finalValue % 10 >= 2 && finalValue % 10 <= 4) && 
                          (finalValue % 100 < 10 || finalValue % 100 > 20)) {
                    message += t('dailyRewards.rewardTypes.coins.few') + '!';
                } else {
                    message += t('dailyRewards.rewardTypes.coins.many') + '!';
                }
                break;
            case 'fruits':
                // Obsługa liczb zmiennoprzecinkowych dla owoców
                if (finalValue === 1) {
                    message += t('dailyRewards.rewardTypes.fruits.one') + '!';
                } else if (finalValue > 1 && finalValue < 2) {
                    message += t('dailyRewards.rewardTypes.fruits.fraction') + '!';
                } else if ((finalValue % 10 >= 2 && finalValue % 10 <= 4) && 
                          (finalValue % 100 < 10 || finalValue % 100 > 20)) {
                    message += t('dailyRewards.rewardTypes.fruits.few') + '!';
                } else {
                    message += t('dailyRewards.rewardTypes.fruits.many') + '!';
                }
                break;
            case 'ton':
                message += t('dailyRewards.rewardTypes.ton') + '!';
                break;
            default:
                message += reward.type + '!';
        }
        
        if (typeof showNotification === 'function') {
            showNotification(message);
        } else {
            console.log(message);
            alert(message);
        }
    }

    // Animacja odbierania nagrody
    playRewardAnimation(reward) {
        try {
            // Znajdź element nagrody
            const rewardItem = document.querySelector(`.daily-reward-item[data-day="${reward.day}"]`);
            if (!rewardItem) {
                console.warn(`Nie znaleziono elementu nagrody dla dnia ${reward.day}`);
                return;
            }
            
            // Dodaj klasę animacji
            rewardItem.classList.add('reward-claimed-animation');
            
            // Pokaż ikonę zaznaczenia
            const claimedMark = rewardItem.querySelector('.reward-claimed-mark');
            if (claimedMark) {
                claimedMark.style.display = 'flex';
                claimedMark.classList.add('reward-claimed-mark-animation');
            }
            
            // Oblicz wartość nagrody
            const weekNumber = this.currentState.weekNumber;
            const day = reward.day;
            let finalValue = this.getRewardValue(day, reward.type, weekNumber);

            // Formatuj wartość dla wyświetlenia
            let displayValue;
            if (reward.type === 'ton') {
                displayValue = finalValue.toFixed(3);
            } else if (reward.type === 'fruits') {
                displayValue = finalValue.toFixed(1);
            } else {
                displayValue = Math.floor(finalValue);
            }
            
            // Utwórz element animacji "latających" zasobów
            const flyingReward = document.createElement('div');
            flyingReward.className = 'flying-reward';
            flyingReward.innerHTML = `
                <img src="${reward.icon}" alt="${reward.type}" style="width: 100%; height: 100%; object-fit: contain;">
                <span style="position: absolute; right: -5px; top: -5px; font-weight: bold; color: white; text-shadow: 0 0 3px rgba(0,0,0,0.8);">+${displayValue}</span>
            `;
            
            // Style dla animacji
            flyingReward.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                z-index: 3000;
                transition: all 1s ease-out;
                transform: scale(1);
                opacity: 1;
            `;
            
            // Dodaj element do strony
            document.body.appendChild(flyingReward);
            
            // Pobierz pozycje
            const rewardRect = rewardItem.getBoundingClientRect();
            const resourceBar = document.getElementById('resource-bar');
            const resourceBarRect = resourceBar ? resourceBar.getBoundingClientRect() : { top: 0, left: window.innerWidth / 2 };
            
            // Ustaw początkową pozycję
            flyingReward.style.left = `${rewardRect.left + rewardRect.width / 2 - 20}px`;
            flyingReward.style.top = `${rewardRect.top + rewardRect.height / 2 - 20}px`;
            
            // Wymuszenie ponownego obliczenia przez przeglądarkę
            void flyingReward.offsetWidth;
            
            // Animuj do paska zasobów
            setTimeout(() => {
                flyingReward.style.left = `${resourceBarRect.left + 50}px`;
                flyingReward.style.top = `${resourceBarRect.top + 20}px`;
                flyingReward.style.transform = 'scale(0.5)';
                flyingReward.style.opacity = '0';
            }, 50);
            
            // Usuń element po animacji
            setTimeout(() => {
                if (flyingReward.parentNode) {
                    flyingReward.parentNode.removeChild(flyingReward);
                }
                
                // Usuń klasę animacji
                rewardItem.classList.remove('reward-claimed-animation');
                if (claimedMark) {
                    claimedMark.classList.remove('reward-claimed-mark-animation');
                }
            }, 1500);
        } catch (error) {
            console.error("Błąd podczas animacji nagrody:", error);
        }
    }

    // Resetowanie streaka nagród (do testów)
    resetRewards() {
        this.currentState = {
            lastClaimDate: null,
            lastClaimDay: 0,
            claimedDays: [],
            streakComplete: false,
            streakReset: false,
            weekNumber: 1,
            completedWeeks: []
        };
        
        this.saveRewardState();
        this.updateUI();
        this.updateRewardNotificationIndicator();
        
        if (typeof showNotification === 'function') {
            showNotification(t('dailyRewards.notifications.rewardsReset'));
        } else {
            alert(t('dailyRewards.notifications.rewardsReset'));
        }
    }

    setupUI() {
        const container = document.querySelector('.daily-rewards-container');
        if (!container) {
            console.error("Nie znaleziono kontenera nagród dziennych!");
            return;
        }
        
        console.log("Tworzenie UI nagród dziennych...");
        
        // Wyczyść kontener
        container.innerHTML = '';
        
        // Dodaj style dla animacji
        const styleId = 'daily-rewards-styles';
        if (!document.getElementById(styleId)) {
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = `
                /* Animacje i efekty */
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                
                @keyframes starTwinkle {
                    0% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.9; }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .flying-reward {
                    position: absolute;
                    z-index: 9999;
                    pointer-events: none;
                    animation: float 2s infinite ease-in-out;
                }
                
                .reward-claimed-animation {
                    animation: pulse 0.5s ease-in-out;
                }
                
                .reward-claimed-mark-animation {
                    animation: fadeIn 0.5s ease-in-out;
                }
                
                /* Style kontenera głównego */
                .daily-rewards-container {
                    background: linear-gradient(135deg, #62b8ff, #89cfff);
                    border-radius: 18px;
                    padding: 20px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                }
                
                /* Style wskaźnika tygodnia */
                .week-indicator {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #ffb347, #ffcc5c);
                    padding: 12px 15px;
                    border-radius: 16px;
                    width: fit-content;
                    margin-left: auto;
                    margin-right: auto;
                    box-shadow: 0 4px 12px rgba(255, 179, 71, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.6);
                }
                
                .week-text {
                    background: rgba(255, 255, 255, 0.9);
                    padding: 5px 15px;
                    border-radius: 12px;
                    font-weight: bold !important;
                    font-size: 16px;
                    color: #ff9500 !important;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
                
                .week-stars {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                    margin-bottom: 5px;
                }
                
                .week-star {
                    font-size: 28px;
                    color: #ffdc00;
                    text-shadow: 0 0 5px rgba(255, 220, 0, 0.8);
                    filter: drop-shadow(0 0 5px rgba(255, 220, 0, 0.7));
                    animation: starTwinkle 2s infinite alternate;
                }
                
                .streak-info {
                    margin-top: 5px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #1e88e5;
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 4px 12px;
                    border-radius: 10px;
                }
                
                /* Style siatki nagród */
                .rewards-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-top: 20px;
                    width: 100%;
                }
                
                /* Specjalne umieszczenie ostatniego elementu w środku */
                .rewards-grid .daily-reward-item:nth-child(7) {
                    grid-column: 2;
                    grid-row: 3;
                    justify-self: center;
                }
                
                /* Style elementów nagród */
                .daily-reward-item {
                    position: relative;
                    width: 85px;
                    height: 110px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 10px 5px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .daily-reward-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
                }
                
                .daily-reward-item.next-reward {
                    border: 3px solid #4CAF50;
                    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
                    animation: bounce 2s infinite ease-in-out;
                    box-shadow: 0 8px 15px rgba(76, 175, 80, 0.3);
                }
                
                .daily-reward-item.claimed {
                    opacity: 0.8;
                    transform: scale(0.95);
                }
                
                .day-number {
                    font-weight: bold;
                    font-size: 14px;
                    margin-bottom: 5px;
                    color: #2196F3;
                    background-color: rgba(33, 150, 243, 0.1);
                    padding: 2px 8px;
                    border-radius: 10px;
                }
                
                .reward-icon {
                    width: 40px;
                    height: 40px;
                    margin: 5px 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    padding: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .reward-icon img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                
                .reward-value {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                    background: rgba(33, 150, 243, 0.1);
                    padding: 3px 8px;
                    border-radius: 8px;
                    margin-top: 5px;
                }
                
                .reward-claimed-mark {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    display: none;
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 15px;
                    justify-content: center;
                    align-items: center;
                }
                
                .reward-claimed-mark div {
                    background-color: #4CAF50;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-weight: bold;
                    font-size: 18px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                }
                
                /* Style specjalne dla dnia 7 */
                .daily-reward-item[data-day="7"] {
                    background: linear-gradient(135deg, #FFC107, #FF9800);
                    box-shadow: 0 6px 18px rgba(255, 152, 0, 0.4);
                    transform: scale(1.05);
                }
                
                .daily-reward-item[data-day="7"] .day-number,
                .daily-reward-item[data-day="7"] .reward-value {
                    color: white;
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .daily-reward-item[data-day="7"] .reward-icon {
                    background: rgba(255, 255, 255, 0.3);
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
                }
                
                /* Style przycisku odbioru nagrody */
                .claim-daily-reward-button {
                    background: linear-gradient(135deg, #4CAF50, #66BB6A);
                    color: white;
                    border: none;
                    border-radius: 15px;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                    transition: all 0.3s ease;
                }
                
                .claim-daily-reward-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
                }
                
                .claim-daily-reward-button:active {
                    transform: translateY(1px);
                    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
                }
                
                .claim-daily-reward-button:disabled {
                    background: linear-gradient(135deg, #9e9e9e, #bdbdbd);
                    cursor: not-allowed;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    transform: none;
                }
                
                /* Style timera nagrody */
                .daily-reward-timer {
                    background-color: rgba(33, 150, 243, 0.15);
                    color: #0d47a1;
                    padding: 10px 15px;
                    border-radius: 12px;
                    font-weight: bold;
                    text-align: center;
                    margin-top: 15px;
                    font-size: 16px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
            `;
            document.head.appendChild(styleElement);
        }

        // 1. Najpierw dodaj wskaźnik tygodnia jako oddzielny element
        const weekIndicator = document.createElement('div');
        weekIndicator.className = 'week-indicator';
        
        // Dodaj tekst wskazujący aktualny tydzień
        const weekText = document.createElement('div');
        weekText.className = 'week-text';
        weekText.textContent = t('dailyRewards.ui.weekIndicator', { week: this.currentState.weekNumber });
        weekIndicator.appendChild(weekText);
        
        // Dodaj gwiazdki dla ukończonych tygodni
        const starsContainer = document.createElement('div');
        starsContainer.className = 'week-stars';
        
        // Dodaj gwiazdki dla każdego ukończonego tygodnia
        for (let i = 0; i < this.currentState.completedWeeks.length; i++) {
            const star = document.createElement('div');
            star.className = 'week-star';
            star.innerHTML = '⭐';
            starsContainer.appendChild(star);
        }
        
        weekIndicator.appendChild(starsContainer);
        
        // Informacja o ciągłości nagród
        const streakInfo = document.createElement('div');
        streakInfo.className = 'streak-info';
        streakInfo.textContent = t('dailyRewards.ui.streakActive');
        weekIndicator.appendChild(streakInfo);
        
        // 2. Dodaj wskaźnik tygodnia do głównego kontenera
        container.appendChild(weekIndicator);
        
        // 3. Utwórz kontener na elementy nagród
        const rewardsGrid = document.createElement('div');
        rewardsGrid.className = 'rewards-grid';
        
        // 4. Dodaj nagrody do kontenera nagród
        this.rewards.forEach(reward => {
            const rewardItem = document.createElement('div');
            rewardItem.className = 'daily-reward-item';
            rewardItem.setAttribute('data-day', reward.day);
            
            // Oblicz wartość nagrody
            const weekNumber = this.currentState.weekNumber;
            const day = reward.day;
            let finalValue = this.getRewardValue(day, reward.type, weekNumber);
            
            // Formatuj wartość dla wyświetlenia
            let displayValue;
            if (reward.type === 'ton') {
                displayValue = finalValue.toFixed(3);
            } else if (reward.type === 'fruits') {
                displayValue = finalValue.toFixed(1);
            } else {
                displayValue = Math.floor(finalValue);
            }
            
            rewardItem.innerHTML = `
                <div class="day-number">${t('dailyRewards.ui.dayNumber', { day: reward.day })}</div>
                <div class="reward-icon">
                    <img src="${reward.icon}" alt="${reward.type}">
                </div>
                <div class="reward-value">+${displayValue}</div>
                <div class="reward-claimed-mark">
                    <div>✓</div>
                </div>
            `;
            
            // Dodaj element do kontenera nagród
            rewardsGrid.appendChild(rewardItem);
        });
        
        // 5. Dodaj kontener nagród do głównego kontenera
        container.appendChild(rewardsGrid);
        
        // Dodaj przycisk odbioru nagrody
        const claimButtonContainer = document.createElement('div');
        claimButtonContainer.style.textAlign = 'center';
        claimButtonContainer.innerHTML = `
            <button class="claim-daily-reward-button">${t('dailyRewards.ui.claimButton')}</button>
        `;
        container.appendChild(claimButtonContainer);
        
        // Dodaj informację o czasie do następnej nagrody
        const rewardTimer = document.createElement('div');
        rewardTimer.className = 'daily-reward-timer';
        rewardTimer.style.display = 'none';
        rewardTimer.textContent = t('dailyRewards.ui.timerNextReward', { hours: '00', minutes: '00', seconds: '00' });
        container.appendChild(rewardTimer);
    }

  
    



    // Aktualizacja UI na podstawie stanu nagród
updateUI() {
    try {
        // Aktualizuj wskaźnik tygodnia
        const weekText = document.querySelector('.week-text');
        if (weekText) {
            weekText.textContent = t('dailyRewards.ui.weekIndicator', { week: this.currentState.weekNumber });
        }
            
            // Aktualizuj gwiazdki ukończonych tygodni
            const starsContainer = document.querySelector('.week-stars');
            if (starsContainer) {
                starsContainer.innerHTML = '';
                
                // Dodaj gwiazdki dla każdego ukończonego tygodnia
                for (let i = 0; i < this.currentState.completedWeeks.length; i++) {
                    const star = document.createElement('div');
                    star.className = 'week-star';
                    star.innerHTML = '⭐';
                    starsContainer.appendChild(star);
                }
            }
            
            // Aktualizuj informację o ciągłości nagród
            const streakInfo = document.querySelector('.streak-info');
            if (streakInfo) {
                const nextDay = this.getNextClaimDay();
                if (nextDay === 1 && this.currentState.lastClaimDay !== 0) {
                    streakInfo.textContent = t('dailyRewards.ui.streakBroken');
                    streakInfo.style.color = '#FF9800';
                    streakInfo.style.backgroundColor = 'rgba(255, 152, 0, 0.2)';
                } else {
                    streakInfo.textContent = t('dailyRewards.ui.streakActive');
                    streakInfo.style.color = '#1e88e5';
                    streakInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                }
            }
            
            // Aktualizuj wygląd elementów nagród
            document.querySelectorAll('.daily-reward-item').forEach(item => {
                const day = parseInt(item.getAttribute('data-day'));
                const isClaimed = this.currentState.claimedDays.includes(day);
                const isNext = day === this.getNextClaimDay();
                const claimedMark = item.querySelector('.reward-claimed-mark');
                
                // Resetuj style
                item.classList.remove('next-reward', 'claimed');
                
                if (isClaimed) {
                    // Nagroda już odebrana
                    item.classList.add('claimed');
                    if (claimedMark) claimedMark.style.display = 'flex';
                } else {
                    // Nagroda nieodebrana
                    if (claimedMark) claimedMark.style.display = 'none';
                    
                    if (isNext) {
                        // Następna nagroda do odebrania
                        item.classList.add('next-reward');
                    } else if (day < this.getNextClaimDay()) {
                        // Przegapione nagrody (jeśli streak został przerwany)
                        item.style.opacity = '0.4';
                    }
                }
                
                // Aktualizuj wartość nagrody (może się zmienić gdy zmienia się tydzień)
                const valueElement = item.querySelector('.reward-value');
                if (valueElement) {
                    const reward = this.rewards.find(r => r.day === day);
                    if (reward) {
                        // Oblicz wartość nagrody
                        const weekNumber = this.currentState.weekNumber;
                        let finalValue = this.getRewardValue(day, reward.type, weekNumber);
                        
                        // Formatuj wartość dla wyświetlenia
                        if (reward.type === 'ton') {
                            valueElement.textContent = `+${finalValue.toFixed(3)}`;
                        } else if (reward.type === 'fruits') {
                            valueElement.textContent = `+${finalValue.toFixed(1)}`;
                        } else {
                            valueElement.textContent = `+${Math.floor(finalValue)}`;
                        }
                    }
                }
            });
            
            // Aktualizuj przycisk odbioru
            const claimButton = document.querySelector('.claim-daily-reward-button');
            if (claimButton) {
                if (this.canClaimReward()) {
                    claimButton.textContent = t('dailyRewards.ui.claimButton');
                    claimButton.disabled = false;
                    claimButton.style.opacity = '1';
                    claimButton.style.cursor = 'pointer';
                } else {
                    claimButton.textContent = t('dailyRewards.ui.comeBackTomorrow');
                    claimButton.disabled = true;
                    claimButton.style.opacity = '0.6';
                    claimButton.style.cursor = 'not-allowed';
                }
            }
            
            // Pokaż timer do następnej nagrody
            this.updateNextRewardTimer();

// Aktualizuj teksty dni - NOWY KOD
            document.querySelectorAll('.daily-reward-item').forEach(item => {
                const day = parseInt(item.getAttribute('data-day'));
                const dayNumberElement = item.querySelector('.day-number');
                if (dayNumberElement) {
                    dayNumberElement.textContent = t('dailyRewards.ui.dayNumber', { day: day });
                }
            });


        } catch (error) {
            console.error("Błąd podczas aktualizacji UI nagród:", error);
        }
    }

    // Aktualizacja timera do następnej nagrody
    updateNextRewardTimer() {
        try {
            const timerElement = document.querySelector('.daily-reward-timer');
            if (!timerElement) return;
            
            // Wyczyść poprzedni interwał
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            
            // Jeśli nagroda jest dostępna, nie pokazuj timera
            if (this.canClaimReward()) {
                timerElement.style.display = 'none';
                return;
            }
            
            // Pokaż timer do kolejnej nagrody
            timerElement.style.display = 'block';
            
            // Funkcja aktualizująca timer
            const updateTimer = () => {
                // Oblicz czas do północy
                const now = new Date();
                const midnight = new Date(now);
                midnight.setDate(midnight.getDate() + 1);
                midnight.setHours(0, 0, 0, 0);
                
                const timeRemaining = midnight.getTime() - now.getTime();
                const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                
                timerElement.textContent = t('dailyRewards.ui.timerNextReward', {
                    hours: hours.toString().padStart(2, '0'),
                    minutes: minutes.toString().padStart(2, '0'),
                    seconds: seconds.toString().padStart(2, '0')
                });
                
                // Jeśli czas upłynął, odśwież stronę
                if (timeRemaining <= 0) {
                    location.reload();
                }
            };
            
            // Natychmiastowa aktualizacja
            updateTimer();
            
            // Rozpocznij interwał aktualizacji co sekundę
            this.timerInterval = setInterval(updateTimer, 1000);
        } catch (error) {
            console.error("Błąd podczas aktualizacji timera nagród:", error);
        }
    }

    // Aktualizacja wskaźnika powiadomień na przycisku kalendarza
    updateRewardNotificationIndicator() {
        try {
            const indicator = document.querySelector('.kalendarz-button .reward-notification');
            if (!indicator) return;
            
            if (this.canClaimReward()) {
                indicator.style.display = 'flex';
            } else {
                indicator.style.display = 'none';
            }
        } catch (error) {
            console.error("Błąd podczas aktualizacji wskaźnika nagród:", error);
        }
    }




// Aktualizacja języka - NOWA METODA
    updateLanguage() {
        try {
            console.log("Aktualizacja języka w systemie nagród dziennych");
            
            // Aktualizuj wskaźnik tygodnia
            const weekText = document.querySelector('.week-text');
            if (weekText) {
                weekText.textContent = t('dailyRewards.ui.weekIndicator', { week: this.currentState.weekNumber });
            }
            
            // Aktualizuj informację o ciągłości nagród
            const streakInfo = document.querySelector('.streak-info');
            if (streakInfo) {
                const nextDay = this.getNextClaimDay();
                if (nextDay === 1 && this.currentState.lastClaimDay !== 0) {
                    streakInfo.textContent = t('dailyRewards.ui.streakBroken');
                } else {
                    streakInfo.textContent = t('dailyRewards.ui.streakActive');
                }
            }
            
            // Natychmiast aktualizuj teksty dni
            document.querySelectorAll('.daily-reward-item').forEach(item => {
                const day = parseInt(item.getAttribute('data-day'));
                const dayNumberElement = item.querySelector('.day-number');
                if (dayNumberElement) {
                    dayNumberElement.textContent = t('dailyRewards.ui.dayNumber', { day: day });
                }
            });
            
            // Aktualizuj przycisk odbioru
            const claimButton = document.querySelector('.claim-daily-reward-button');
            if (claimButton) {
                if (this.canClaimReward()) {
                    claimButton.textContent = t('dailyRewards.ui.claimButton');
                } else {
                    claimButton.textContent = t('dailyRewards.ui.comeBackTomorrow');
                }
            }
            
            // Aktualizuj timer
            const timerElement = document.querySelector('.daily-reward-timer');
            if (timerElement && timerElement.style.display !== 'none') {
                // Wymuś aktualizację timera
                this.updateNextRewardTimer();
            }
            
            console.log("Aktualizacja języka w systemie nagród dziennych zakończona");
        } catch (error) {
            console.error("Błąd podczas aktualizacji języka w systemie nagród:", error);
        }
    }







    // Konfiguracja listenerów
    setupListeners() {
        try {
            // Przycisk odbioru nagrody
            const claimButton = document.querySelector('.claim-daily-reward-button');
            if (claimButton) {
                // Usuń poprzednie event listenery (aby uniknąć duplikacji)
                const newClaimButton = claimButton.cloneNode(true);
                claimButton.parentNode.replaceChild(newClaimButton, claimButton);
                
                // Dodaj nowy event listener
                newClaimButton.addEventListener('click', () => this.claimReward());
                console.log("Dodano listener dla przycisku odbioru nagrody");
            }
            
            // Dodaj click listener na elementy nagród
            document.querySelectorAll('.daily-reward-item').forEach(item => {
                item.addEventListener('click', () => {
                    const day = parseInt(item.getAttribute('data-day'));
                    const isNext = day === this.getNextClaimDay();
                    const isClaimed = this.currentState.claimedDays.includes(day);
                    
                    if (isNext && !isClaimed && this.canClaimReward()) {
                        this.claimReward();
                    } else if (isClaimed) {
                        showNotification(t('dailyRewards.notifications.alreadyClaimed'));
                    } else if (!isNext) {
                        showNotification(t('dailyRewards.notifications.claimInOrder'));
                    } else {
                        showNotification(t('dailyRewards.notifications.cantClaimNow'));
                    }
                });
            });
        } catch (error) {
            console.error("Błąd podczas konfiguracji listenerów nagród:", error);
        }
    }
}

// Obsługa funkcji globalnej showNotification
window.showNotification = window.showNotification || function(message) {
    console.log("Powiadomienie:", message);
    alert(message);
};

// Inicjalizacja systemu nagród przy ładowaniu strony
let dailyRewardsSystem = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - inicjalizacja systemu nagród dziennych");
    
    try {
        dailyRewardsSystem = new DailyRewardsSystem();
        
        // Sprawdź, czy okno kalendarza już istnieje w DOM
        const kalendarzModal = document.getElementById('kalendarz-modal');
        if (kalendarzModal) {
            dailyRewardsSystem.initialize();
        } else {
            console.log("Okno kalendarza jeszcze nie istnieje - opóźniam inicjalizację");
            // Opóźniona inicjalizacja (po 1 sekundzie)
            setTimeout(() => {
                const kalendarzModal = document.getElementById('kalendarz-modal');
                if (kalendarzModal) {
                    dailyRewardsSystem.initialize();
                } else {
                    console.warn("Nie znaleziono okna kalendarza po opóźnieniu!");
                }
            }, 1000);
        }
        
        // Aktualizuj wskaźnik powiadomień
        updateRewardNotificationIndicator();
    } catch (error) {
        console.error("Błąd podczas inicjalizacji systemu nagród:", error);
    }
});

// Inicjalizacja po zdarzeniu gameLoaded dla pewności
document.addEventListener('gameLoaded', function() {
    console.log("Event gameLoaded - inicjalizacja systemu nagród dziennych");
    
    try {
        if (dailyRewardsSystem) {
            dailyRewardsSystem.initialize();
        } else {
            dailyRewardsSystem = new DailyRewardsSystem();
            dailyRewardsSystem.initialize();
        }
        
        // Aktualizuj wskaźnik powiadomień
        updateRewardNotificationIndicator();
    } catch (error) {
        console.error("Błąd podczas inicjalizacji systemu nagród (gameLoaded):", error);
    }
});

// Aktualizacja wskaźnika powiadomień na przycisku kalendarza
function updateRewardNotificationIndicator() {
    try {
        if (!dailyRewardsSystem) return;
        
        const indicator = document.querySelector('.kalendarz-button .reward-notification');
        if (!indicator) return;
        
        if (dailyRewardsSystem.canClaimReward()) {
            indicator.style.display = 'flex';
        } else {
            indicator.style.display = 'none';
        }
    } catch (error) {
        console.error("Błąd podczas aktualizacji wskaźnika powiadomień:", error);
    }
}

// Sprawdzaj wskaźnik co 5 minut
setInterval(updateRewardNotificationIndicator, 5 * 60 * 1000);

// Dodajemy obserwator dla przycisku kalendarza
window.addEventListener('load', function() {
    try {
        console.log("Dodawanie obserwatora dla przycisku kalendarza");
        
        const kalendarzButton = document.querySelector('.kalendarz-button');
        if (kalendarzButton) {
            // Usuń poprzednie event listenery
            const newButton = kalendarzButton.cloneNode(true);
            kalendarzButton.parentNode.replaceChild(newButton, kalendarzButton);
            
            // Dodaj nowy event listener
            newButton.addEventListener('click', function() {
                console.log("Kliknięto przycisk kalendarza");
                
                const kalendarzModal = document.getElementById('kalendarz-modal');
                if (kalendarzModal) {
                    kalendarzModal.style.display = 'flex';
                    
                    // Upewnij się, że system nagród jest zainicjalizowany
                    if (dailyRewardsSystem) {
                        dailyRewardsSystem.initialize();
                        dailyRewardsSystem.updateUI();
                    } else {
                        console.warn("System nagród nie jest dostępny przy kliknięciu przycisku kalendarza");
                        // Inicjalizuj system
                        dailyRewardsSystem = new DailyRewardsSystem();
                        dailyRewardsSystem.initialize();
                    }
                } else {
                    console.error("Nie znaleziono okna kalendarza!");
                }
            });
            
            // Dodaj obserwator dla przycisku zamknięcia kalendarza
            const closeButton = document.querySelector('#kalendarz-modal .close-button');
            if (closeButton) {
                // Usuń poprzednie event listenery
                const newCloseButton = closeButton.cloneNode(true);
                closeButton.parentNode.replaceChild(newCloseButton, closeButton);
                
                // Dodaj nowy event listener
                newCloseButton.addEventListener('click', function() {
                    const kalendarzModal = document.getElementById('kalendarz-modal');
                    if (kalendarzModal) {
                        kalendarzModal.style.display = 'none';
                    }
                });
            }
        } else {
            console.warn("Nie znaleziono przycisku kalendarza");
        }
    } catch (error) {
        console.error("Błąd podczas dodawania obserwatora przycisku kalendarza:", error);
    }
});

// Sprawdzenie przy starcie, czy jest nowa nagroda do odebrania
setTimeout(function() {
    try {
        if (dailyRewardsSystem && dailyRewardsSystem.canClaimReward()) {
            showNotification(t('dailyRewards.notifications.availableReward'));
            
            // Odśwież wskaźnik powiadomień
            updateRewardNotificationIndicator();
        }
    } catch (error) {
        console.error("Błąd podczas sprawdzania dostępności nagrody:", error);
    }
}, 5000);




// Funkcja aktualizująca język w systemie nagród dziennych
function updateDailyRewardsLanguage() {
    try {
        if (dailyRewardsSystem && dailyRewardsSystem.initialized) {
            console.log("Aktualizacja języka w systemie nagród dziennych");
            dailyRewardsSystem.updateLanguage();
        } else {
            console.log("System nagród dziennych nie jest jeszcze zainicjalizowany - nie można zaktualizować języka");
        }
    } catch (error) {
        console.error("Błąd podczas aktualizacji języka w systemie nagród dziennych:", error);
    }
}

// Obserwator zmiany języka
document.addEventListener('languageChanged', function() {
    console.log("Wykryto zdarzenie zmiany języka - aktualizuję UI nagród dziennych");
    updateDailyRewardsLanguage();
});