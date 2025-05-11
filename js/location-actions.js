/**
 * System obsługi akcji zbiorczych dla lokacji w grze DziubCoins
 * 
 * Ten plik zawiera funkcje odpowiedzialne za obsługę przycisków "Nakarm wszystkie" 
 * i "Odbierz wszystkie" dla poszczególnych lokacji, niezależnie od tego, 
 * która lokacja jest aktualnie aktywna.
 */







// Zmodyfikowana funkcja karmienia wszystkich ptaków - skopiuj tę funkcję do location-actions.js
function feedAllBirdsInLocation(locationId) {
    console.log(`Karmienie wszystkich ptaków w lokacji ${locationId} (nowa wersja)`);
    
    // Sprawdź, czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        showNotification("Ta lokacja jest zablokowana!");
        return;
    }
    
    // Pobierz sloty dla danej lokacji
    const slots = gameState.locationSlots[locationId];
    if (!slots) {
        console.error(`Nie znaleziono slotów dla lokacji ${locationId}`);
        return;
    }
    
    // Liczniki dla standardowych ptaków (ziarenka) i mitycznych ptaków (owoce)
    let standardFeedsCount = 0;
    let mythicalFeedsCount = 0;
    let seedsRequired = 0;
    let fruitsRequired = 0;
    
    // Najpierw oblicz, ile zasobów będzie potrzebnych
    slots.forEach((slot, index) => {
        if (gameState.locationUnlockedSlots[locationId][index] && 
            slot.isActive && !slot.isFeeding && !slot.needsCollection) {
            
            if (slot.birdType === 'mythical') {
                // Mityczny ptak - wymaga owoców
                mythicalFeedsCount++;
                
                // Koszt w owocach zależy od lokacji
                if (locationId === 'park') {
                    fruitsRequired += 1; // 1 owoc dla parku
                } else if (locationId === 'lake') {
                    fruitsRequired += 3; // 3 owoce dla jeziora
                } else if (locationId === 'forest') {
                    fruitsRequired += 5; // 5 owoców dla lasu
                } else {
                    fruitsRequired += 1; // domyślnie 1 owoc
                }
            } else {
                // Standardowy ptak - wymaga ziarenek
                standardFeedsCount++;
                
                // Pobierz koszt z konfiguracji i zastosuj bonusy
                let cost = gameState.locations.configs[locationId].birdCosts[slot.birdType];
                
                // Wcześniejsze logowanie przed sprawdzeniem jakichkolwiek bonusów
                console.log(`[KARMIENIE ZBIORCZE] Oryginalny koszt przed bonusami: ${cost} dla ptaka typu ${slot.birdType}`);
                
                // Zastosuj bonusy z dekoracji - używamy bezpośrednio funkcji, nie przez window
                if (typeof applyDecorationBonusesToFeedCost === 'function') {
                    let newCost = applyDecorationBonusesToFeedCost(locationId, cost);
                    console.log(`[KARMIENIE ZBIORCZE] Koszt po zastosowaniu bonusów: z ${cost} na ${newCost} (lokacja: ${locationId})`);
                    cost = newCost; // JAWNIE przypisujemy nową wartość
                } else {
                    console.log(`[KARMIENIE ZBIORCZE] Funkcja bonusów niedostępna!`);
                }
                
                seedsRequired += cost;
                console.log(`[KARMIENIE ZBIORCZE] Dodano koszt ${cost}, łączny wymagany koszt: ${seedsRequired}`);
            }
        }
    });
    
    // Sprawdź, czy mamy wystarczająco zasobów
    let canFeedAll = true;
    let errorMessage = "";
    
    if (seedsRequired > gameState.resources.seeds) {
        canFeedAll = false;
        errorMessage = `Za mało ziarenek! Potrzebujesz ${seedsRequired} ziarenek.`;
    }
    
    if (fruitsRequired > gameState.resources.fruits) {
        canFeedAll = false;
        if (errorMessage) {
            errorMessage = `Za mało zasobów! Potrzebujesz ${seedsRequired} ziarenek i ${fruitsRequired} owoców.`;
        } else {
            errorMessage = `Za mało owoców! Potrzebujesz ${fruitsRequired} owoców.`;
        }
    }
    
    if (!canFeedAll) {
        showNotification(errorMessage);
        return;
    }
    
    // Jeśli mamy wystarczająco zasobów, odejmij je od stanu gracza
    gameState.resources.seeds -= seedsRequired;
    gameState.resources.fruits -= fruitsRequired;
    
    // Natychmiastowa aktualizacja liczników zasobów
    requestAnimationFrame(() => {
        document.getElementById('seed-count').textContent = gameState.resources.seeds;
        document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
    });
    
    // Karm ptaki
    let successfulStandardFeeds = 0;
    let successfulMythicalFeeds = 0;
    
    slots.forEach((slot, index) => {
        if (gameState.locationUnlockedSlots[locationId][index] && 
            slot.isActive && !slot.isFeeding && !slot.needsCollection) {
            
            // Pobierz czasy karmienia z konfiguracji lokacji
            const locationConfig = gameState.locations.configs[locationId];
            
            if (slot.birdType === 'mythical') {
                // Nakarm mitycznego ptaka
                slot.isFeeding = true;
                
                // Zastosuj bonusy do czasu karmienia również dla mitycznych ptaków
                let feedTime = locationConfig.birdTimes[slot.birdType];
                if (typeof applyDecorationBonusesToFeedTime === 'function') {
                    feedTime = applyDecorationBonusesToFeedTime(locationId, feedTime);
                    console.log(`[KARMIENIE ZBIORCZE] Czas karmienia mitycznego ptaka po zastosowaniu bonusów: ${feedTime} (lokacja: ${locationId})`);
                } else {
                    // Awaryjne bezpośrednie obliczenie bonusu
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
                            console.log(`[KARMIENIE ZBIORCZE] Czas mitycznego ptaka po bonusie: ${feedTime} (lokacja: ${locationId})`);
                        }
                    }
                }
                slot.remainingTime = feedTime;
                
                // Aktualizacja postępu misji "Nakarm ptaki"
                updateMissionProgress('feedBirds', 1);
                
                // Aktualizacja statystyk
                gameState.stats.totalBirdsFed += 1;
                
                successfulMythicalFeeds++;
            
            } else {
                // Nakarm standardowego ptaka
                slot.isFeeding = true;
                
                // Zastosuj bonusy do czasu karmienia - bezpośrednio przez funkcję, nie przez window
                let feedTime = locationConfig.birdTimes[slot.birdType];
                if (typeof applyDecorationBonusesToFeedTime === 'function') {
                    feedTime = applyDecorationBonusesToFeedTime(locationId, feedTime);
                    console.log(`[KARMIENIE ZBIORCZE] Czas karmienia po zastosowaniu bonusów: ${feedTime} (lokacja: ${locationId})`);
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
                
                successfulStandardFeeds++;
            }
        }
    });
    
  
    



// Pokaż powiadomienie o wyniku
const locationName = gameState.locations.configs[locationId].name;
let notificationText = "";

// Sprawdź czy zastosowano bonusy czasu karmienia
let feedTimeBonus = 0;
if (gameState.decorations && gameState.decorations[locationId]) {
    Object.keys(gameState.decorations[locationId]).forEach(decId => {
        const decoration = gameState.decorations[locationId][decId];
        if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedTime") {
            feedTimeBonus += decoration.bonus.value;
        }
    });
}

// Przygotuj tekst o bonusie czasu karmienia, jeśli jest aktywny
let bonusText = "";
if (feedTimeBonus > 0) {
    bonusText = ` (-${feedTimeBonus}% czas karmienia)`;
}

if (successfulStandardFeeds > 0 && successfulMythicalFeeds > 0) {
    notificationText = `Nakarmiono ${successfulStandardFeeds} ptaków (${seedsRequired} ziarenek) i ${successfulMythicalFeeds} mitycznych ptaków (${fruitsRequired} owoców) w lokacji ${locationName}!${bonusText}`;
} else if (successfulStandardFeeds > 0) {
    notificationText = `Nakarmiono ${successfulStandardFeeds} ptaków w lokacji ${locationName}! Zużyto ${seedsRequired} ziarenek.${bonusText}`;
} else if (successfulMythicalFeeds > 0) {
    notificationText = `Nakarmiono ${successfulMythicalFeeds} mitycznych ptaków w lokacji ${locationName}! Zużyto ${fruitsRequired} owoców.${bonusText}`;
} else {
    notificationText = `Brak ptaków do nakarmienia w lokacji ${locationName}!`;
}

showNotification(notificationText);






    
    // Zapisz stan gry
    saveGame();
    
    // Aktualizuj UI
    updateUI();
    
    // Jeśli to aktualna lokacja, zaktualizuj również UI slotów
    if (locationId === gameState.locations.currentLocation) {
        updateBirdSlotsUI();
    }
    
    // Aktualizuj wszystkie przyciski akcji
    updateAllLocationActionButtons();
    
    return successfulStandardFeeds + successfulMythicalFeeds;
}










// Funkcja do odbierania wszystkich nagród w określonej lokacji
function collectAllRewardsInLocation(locationId) {
    console.log(`Odbieranie wszystkich nagród w lokacji ${locationId} (nowa wersja)`);
    
    // Sprawdź, czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        showNotification("Ta lokacja jest zablokowana!");
        return;
    }
    
    // Pobierz sloty dla danej lokacji
    const slots = gameState.locationSlots[locationId];
    if (!slots) {
        console.error(`Nie znaleziono slotów dla lokacji ${locationId}`);
        return;
    }
    
    // Oblicz najpierw wszystkie nagrody
    let totalRewards = {
        coins: 0,
        ton: 0
    };
    
    // Najpierw sprawdź wszystkie możliwe nagrody
    slots.forEach((slot, index) => {
        if (gameState.locationUnlockedSlots[locationId][index] && 
            slot.isActive && slot.needsCollection) {
            // Pobierz nagrodę z konfiguracji konkretnej lokacji
            const coinReward = gameState.locations.configs[locationId].birdRewards[slot.birdType];
            totalRewards.coins += coinReward;
            
            // Sprawdź, czy to mityczny ptak i dodaj nagrodę TON
            if (slot.birdType === 'mythical') {
                // Zaktualizowane wartości TON dla różnych lokacji
                switch(locationId) {
                    case 'park':
                        totalRewards.ton += 0.003; // 0.003 TON za mitycznego ptaka w parku
                        break;
                    case 'lake':
                        totalRewards.ton += 0.008; // 0.008 TON za mitycznego ptaka w jeziorze
                        break;
                    case 'forest':
                        totalRewards.ton += 0.012; // 0.012 TON za mitycznego ptaka w lesie
                        break;
                    default:
                        totalRewards.ton += 0.003; // Domyślna wartość
                }
            }
        }
    });
    
    // Aktualizuj zasoby naraz - mityczne ptaki nie dają monet, więc musimy zliczyć tylko te normalne
    let nonMythicalCoins = 0;
    slots.forEach((slot, index) => {
        if (gameState.locationUnlockedSlots[locationId][index] && 
            slot.isActive && slot.needsCollection && slot.birdType !== 'mythical') {
            // Pobierz bazową nagrodę
            let reward = gameState.locations.configs[locationId].birdRewards[slot.birdType];
            
            // Zastosuj bonus z dekoracji - sprawdź czy funkcja istnieje
            if (typeof applyDecorationBonusesToReward === 'function') {
                reward = applyDecorationBonusesToReward(locationId, reward);
                console.log(`Nagroda ptaka w slocie ${index} po zastosowaniu bonusów: ${reward} (lokacja: ${locationId})`);
            }
            
            nonMythicalCoins += reward;
        }
    });
    
    // Dodaj monety tylko za nie-mityczne ptaki
    gameState.resources.coins += nonMythicalCoins;
    totalRewards.coins = nonMythicalCoins;

    if (totalRewards.ton > 0) {
        // Zabezpieczenie przed NaN i undefined
        const currentTon = parseFloat(gameState.resources.ton || 0);
        if (isNaN(currentTon)) {
            console.error("Wartość TON jest NaN! Resetuję do 0.");
            gameState.resources.ton = 0;
        }
        gameState.resources.ton = parseFloat((currentTon + totalRewards.ton).toFixed(3));
        console.log("Zaktualizowano TON:", totalRewards.ton, "Nowy stan:", gameState.resources.ton);
    }
    
    // Natychmiastowa aktualizacja liczników zasobów przed dalszą obróbką
    requestAnimationFrame(() => {
        document.getElementById('coin-count').textContent = formatNumber(gameState.resources.coins, 1);
        if (totalRewards.ton > 0) {
            const balanceAmount = document.getElementById('ton-count');
            if (balanceAmount) {
                balanceAmount.textContent = formatNumber(gameState.resources.ton || 0.000, 3, true);
            }
        }
    });
    
    // Licznik odebranych nagród
    let successfulCollects = 0;
    let totalCoins = 0;
    let totalTON = 0;
    
    // Dla każdego slotu spróbuj odebrać nagrodę (teraz już bez aktualizacji zasobów)
    slots.forEach((slot, index) => {
        if (gameState.locationUnlockedSlots[locationId][index] && 
            slot.isActive && slot.needsCollection) {
            
            // Pobierz nagrodę z konfiguracji konkretnej lokacji
            const reward = gameState.locations.configs[locationId].birdRewards[slot.birdType];
            
            // Aktualnie monety i TON dodaliśmy już wcześniej, więc nie dodajemy ich tutaj
            // Natomiast zwiększamy liczniki dla statystyk
            gameState.stats.totalCoinsEarned += reward;

            // Sprawdź, czy to mityczny ptak i dodaj nagrodę TON
            let tonReward = 0;
            if (slot.birdType === 'mythical') {
                // Różne wartości TON dla różnych lokacji
                switch(locationId) {
                    case 'park':
                        tonReward = 0.003; // 0.003 TON za mitycznego ptaka w parku
                        break;
                    case 'lake':
                        tonReward = 0.008; // 0.008 TON za mitycznego ptaka w jeziorze
                        break;
                    case 'forest':
                        tonReward = 0.012; // 0.012 TON za mitycznego ptaka w lesie
                        break;
                    default:
                        tonReward = 0.003; // Domyślna wartość
                }
                
                // NIE dodajemy TON tutaj - zostało już dodane wcześniej
                // Tylko zwiększamy licznik dla statystyk
                totalTON += tonReward;
            }
            
            // Resetuj slot
            slot.needsCollection = false;
            slot.isActive = false;
            slot.birdType = null;
            
            // Aktualizuj misję tygodniową collectCurrency
            updateWeeklyMissionProgress('collectCurrency', reward);
            
            successfulCollects++;
            totalCoins += reward;
            
            // Po 3 sekundach spróbuj wygenerować nowego ptaka, ale tylko dla bieżącej lokacji
            if (locationId === gameState.locations.currentLocation) {
                setTimeout(() => {
                    trySpawnBirdInSlot(index, locationId);
                }, 3000);
            } else {
                // Dla innych lokacji generuj ptaka od razu, bez animacji
                trySpawnBirdInSlot(index, locationId);
            }
        }
    });
    
    // Pokaż powiadomienie o wyniku
    if (successfulCollects > 0) {
        const locationName = gameState.locations.configs[locationId]?.name || locationId;
        
        // Użyj prawidłowej zmiennej z nagrodami i zastosuj formatowanie
        const formattedCoins = formatNumber(nonMythicalCoins, 1);
        
        if (totalTON > 0) {
            // Zaokrąglij wartość TON do trzech miejsc po przecinku dla wyświetlania
            const formattedTON = formatNumber(totalTON, 3, true);
            showNotification(`Odebrano nagrody od ${successfulCollects} ptaków w lokacji ${locationName}: +${formattedCoins} DziubCoinów i +${formattedTON} TON!`);
            
            // Wymuś natychmiastową aktualizację UI
            requestAnimationFrame(() => {
                document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton, 3);
            });
        } else {
            showNotification(`Odebrano nagrody od ${successfulCollects} ptaków w lokacji ${locationName}: +${formattedCoins} DziubCoinów!`);
        }
        
        // NAPRAWIONE: Pokaż animację nagrody w prawidłowym miejscu
        // Znajdź właściwy przycisk dla tej lokacji
        let button = document.querySelector(`.action-all-button[data-location="${locationId}"]`);
        
        // Jeśli przycisk nie istnieje, stwórz tymczasowy element do wyświetlenia animacji
        if (!button) {
            console.log(`Przycisk dla lokacji ${locationId} nie znaleziony - tworzę tymczasowy element`);
            
            // Stwórz tymczasowy element
            const tempButton = document.createElement('div');
            tempButton.style.position = 'fixed';
            tempButton.style.zIndex = '9999';
            tempButton.style.left = '50%';
            tempButton.style.top = '40%';
            tempButton.style.transform = 'translate(-50%, -50%)';
            tempButton.style.width = '100px';
            tempButton.style.height = '40px';
            tempButton.style.pointerEvents = 'none'; // Nie przechwytuje kliknięć
            
            // Dodaj do DOM
            document.body.appendChild(tempButton);
            
            // Użyj tego elementu do animacji
            button = tempButton;
            
            // Usuń tymczasowy element po animacjach
            setTimeout(() => {
                if (tempButton.parentNode) {
                    tempButton.parentNode.removeChild(tempButton);
                }
            }, 3000);
        }
        
        // Pokaż animację nagrody (monety)
        if (button && typeof showRewardAnimation === 'function' && nonMythicalCoins > 0) {
            showRewardAnimation(`+${formatNumber(nonMythicalCoins, 1)} 💰`, button);
        }
        
        // Jeśli była nagroda TON, pokaż dodatkową animację
        if (button && totalTON > 0 && typeof showRewardAnimation === 'function') {
            setTimeout(() => {
                showRewardAnimation(`+${formatNumber(totalTON, 3, true)} TON`, button);
            }, 1500);
        }
    } else {
        const locationName = gameState.locations.configs[locationId]?.name || locationId;
        showNotification(`Brak nagród do odebrania w lokacji ${locationName}!`);
    }
    
    // Aktualizuj UI
    updateUI();
    
    // Jeśli to aktualna lokacja, zaktualizuj również UI slotów
    if (locationId === gameState.locations.currentLocation) {
        updateBirdSlotsUI();
    }
    
    // Aktualizuj ekran portfela, jeśli jest otwarty
    if (document.querySelector('.game-screen.active#wallet-screen')) {
        const balanceDisplay = document.getElementById('ton-balance-display');
        if (balanceDisplay) {
            balanceDisplay.textContent = formatNumber(gameState.resources.ton || 0.000, 3) + ' TON';
            console.log("Zaktualizowano saldo TON na ekranie portfela po zbiorczym odbiorze:", gameState.resources.ton);
        }
    }
    
    // Zapisz stan gry
    saveGame();
    
    // Aktualizuj wszystkie przyciski akcji
    updateAllLocationActionButtons();
    
    return successfulCollects;
}











// Funkcja do sprawdzania, czy w danej lokacji są ptaki do karmienia lub nagrody do odbioru
function checkLocationStatus(locationId) {
    console.log(`Sprawdzanie statusu lokacji ${locationId}`);
    
    // Sprawdź czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        return { canFeed: false, canCollect: false, isLocked: true };
    }
    
    // Pobierz sloty dla danej lokacji
    const slots = gameState.locationSlots[locationId];
    if (!slots) {
        console.error(`Nie znaleziono slotów dla lokacji ${locationId}`);
        return { canFeed: false, canCollect: false, isLocked: false };
    }
    
    let canFeed = false;
    let canCollect = false;
    
    // Sprawdź każdy slot
    slots.forEach((slot, index) => {
        // Sprawdź, czy slot jest odblokowany
        if (!gameState.locationUnlockedSlots[locationId][index]) {
            return; // Slot zablokowany, przejdź do następnego
        }
        
        // Sprawdź stan ptaka w slocie
        if (slot.isActive) {
            if (slot.needsCollection) {
                canCollect = true;
            } else if (!slot.isFeeding) {
                canFeed = true;
            }
        }
    });
    
    return { canFeed, canCollect, isLocked: false };
}

// Funkcja aktualizująca stan wszystkich przycisków akcji dla wszystkich lokacji
function updateAllLocationActionButtons() {
    console.log("Aktualizacja wszystkich przycisków akcji dla wszystkich lokacji");
    
    // Dla każdej lokacji aktualizuj przycisk
    Object.keys(gameState.locations.configs).forEach(locationId => {
        // Sprawdź, czy lokacja jest odblokowana
        if (!gameState.locations.unlockedLocations[locationId]) {
            // Lokacja zablokowana - ukryj przycisk akcji
            const button = document.querySelector(`.action-all-button[data-location="${locationId}"]`);
            if (button) {
                button.style.display = 'none';
            }
            return;
        }
        
        // Znajdź przyciski dla tej lokacji
        const buttons = document.querySelectorAll(`.action-all-button[data-location="${locationId}"]`);
        if (buttons.length === 0) {
            console.log(`Nie znaleziono przycisków akcji dla lokacji ${locationId}`);
            return; // Przyciski nie istnieją, przejdź do następnej lokacji
        }
        
        // Sprawdź stan ptaków w lokacji
        const status = checkLocationStatus(locationId);
        console.log(`Status lokacji ${locationId}:`, status);
        
        // Aktualizuj wszystkie przyciski dla tej lokacji
        buttons.forEach(button => {
            // Aktualizuj wygląd i działanie przycisku w zależności od jego typu
            const actionType = button.getAttribute('data-action');
            
            if (actionType === 'feed' && status.canFeed) {
                // Są ptaki do karmienia
                button.textContent = "Nakarm wszystkie";
                button.setAttribute('data-action', 'feed');
                button.classList.remove('disabled');
                button.style.backgroundColor = "#4CAF50"; // zielony
                button.style.display = 'block';
            } else if (actionType === 'collect' && status.canCollect) {
                // Są nagrody do odebrania
                button.textContent = "Odbierz wszystkie";
                button.setAttribute('data-action', 'collect');
                button.classList.remove('disabled');
                button.style.backgroundColor = "#4CAF50"; // zielony
                button.style.display = 'block';
            } else {
                // Nie ma nic do zrobienia
                if (actionType === 'feed') {
                    button.textContent = "Nakarm wszystkie";
                } else {
                    button.textContent = "Odbierz wszystkie";
                }
                button.classList.add('disabled');
                button.style.backgroundColor = "#cccccc"; // szary
                button.style.display = 'block';
            }
        });
    });
}

// Funkcja obsługująca kliknięcie przycisku akcji
function handleLocationActionButton(event) {
    console.log("Kliknięto przycisk akcji zbiorczej (nowa wersja)");
    
    const button = event.target;
    const locationId = button.getAttribute('data-location');
    const action = button.getAttribute('data-action');
    
    console.log(`Akcja: ${action}, Lokacja: ${locationId}`);
    
    if (!locationId) {
        console.error("Brak atrybutu data-location na przycisku");
        return;
    }
    
    // Sprawdź, czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        showNotification("Ta lokacja jest zablokowana!");
        return;
    }
    
    // Wykonaj odpowiednią akcję
    if (action === 'feed') {
        feedAllBirdsInLocation(locationId);
    } else if (action === 'collect') {
        collectAllRewardsInLocation(locationId);
    } else {
        // Akcja 'none' - nic do zrobienia
        const locationName = gameState.locations.configs[locationId]?.name || locationId;
        showNotification(`W lokacji ${locationName} wszystkie ptaki są w trakcie karmienia lub nie ma tam ptaków. Odblokuj więcej slotów lub poczekaj.`);
    }
}

// Funkcja aktualizująca wygląd slotów z ptakami
function updateBirdSlotsUI() {
    console.log("Aktualizacja UI slotów z ptakami dla aktualnej lokacji");
    
    // Aktualizuj tylko dla aktualnej lokacji
    const locationId = gameState.locations.currentLocation;
    
    // Pobierz wszystkie sloty
    const birdSlots = document.querySelectorAll('.bird-slot');
    
    birdSlots.forEach((slot) => {
        const slotIndex = slot.getAttribute('data-slot');
        if (slotIndex !== null) {
            updateBirdSlotUI(slot, slotIndex, locationId);
        }
    });
}

// Inicjalizacja systemu akcji zbiorczych
function initLocationActions() {
    console.log("Inicjalizacja systemu akcji zbiorczych dla lokacji");
    
    // Dodaj event listenery do przycisków akcji
    document.querySelectorAll('.action-all-button').forEach(button => {
        // Usuń poprzednie event listenery
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Dodaj nowy event listener
        newButton.addEventListener('click', handleLocationActionButton);
    });
    
    // Aktualizuj stan wszystkich przycisków
    updateAllLocationActionButtons();
}

// Inicjalizacja systemu po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Daj czas na załadowanie innych skryptów
    setTimeout(initLocationActions, 1500);
});

// Inicjalizacja po zdarzeniu gameLoaded
document.addEventListener('gameLoaded', function() {
    // Daj czas na załadowanie innych skryptów
    setTimeout(initLocationActions, 500);
});




// Funkcja do szybkiej aktualizacji liczników zasobów
function updateResourceCountersImmediately() {
    // Użyj requestAnimationFrame aby wymusić szybszą aktualizację UI
    requestAnimationFrame(() => {
        document.getElementById('seed-count').textContent = gameState.resources.seeds;
        document.getElementById('coin-count').textContent = formatNumber(gameState.resources.coins, 1);
        document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
        document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton || 0.000, 3);
    });
}

// Dodaj do globalnego zakresu
window.updateResourceCountersImmediately = updateResourceCountersImmediately;


// Eksportuj funkcje do globalnego zakresu
window.feedAllBirdsInLocation = feedAllBirdsInLocation;
window.collectAllRewardsInLocation = collectAllRewardsInLocation;
window.updateAllLocationActionButtons = updateAllLocationActionButtons;
window.handleLocationActionButton = handleLocationActionButton;
window.initLocationActions = initLocationActions;