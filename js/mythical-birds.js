/**
 * Plik odpowiedzialny za obsługę mitycznych ptaków w grze
 * Implementuje specjalną logikę dla karmienia mitycznych ptaków (owocami) 
 * i zbierania nagród (tylko TON)
 */

// Funkcja do karmienia ptaka
function feedBirdImproved(slotIndex, locationId) {
    console.log("Używam ulepszonej funkcji karmienia ptaka:", slotIndex, locationId);
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    // Pobierz slot z konkretnej lokacji
    const slot = gameState.locationSlots[locationId][slotIndex];
    
    if (!slot.isActive || slot.isFeeding || slot.needsCollection) {
        console.log("Slot nie spełnia warunków do karmienia:", slot);
        return false;
    }
    
    // Pobierz konfigurację konkretnej lokacji
    const locationConfig = gameState.locations.configs[locationId];
    
    // Sprawdź czy ptak jest mityczny - wtedy używa owoców zamiast ziarenek
    if (slot.birdType === 'mythical') {
        // Koszt w owocach zależy od lokacji
        let fruitCost = 1; // domyślnie 1 owoc
        if (locationId === 'lake') {
            fruitCost = 3; // 3 owoce dla jeziora
        } else if (locationId === 'forest') {
            fruitCost = 5; // 5 owoców dla lasu
        }
        
        // Sprawdź czy mamy wystarczająco owoców
        if (gameState.resources.fruits >= fruitCost) {
            gameState.resources.fruits -= fruitCost;
            
            // Aktualizacja licznika owoców
            requestAnimationFrame(() => {
                document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
            });
            
            // Kontynuuj karmienie
            slot.isFeeding = true;
            slot.remainingTime = locationConfig.birdTimes[slot.birdType];
            
            // Powiadomienie o karmieniu mitycznego ptaka
            showNotification(t('notifications.mythicalBirdFed', { amount: fruitCost }));
            
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
        // Normalne ptaki - koszt w ziarenkach
        const cost = locationConfig.birdCosts[slot.birdType];
        
        if (gameState.resources.seeds >= cost) {
            gameState.resources.seeds -= cost;
            
            // Natychmiastowa aktualizacja licznika ziarenek
            requestAnimationFrame(() => {
                document.getElementById('seed-count').textContent = gameState.resources.seeds;
            });
            
            slot.isFeeding = true;
            slot.remainingTime = locationConfig.birdTimes[slot.birdType];
            
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
        
        showNotification(t('notifications.notEnoughSeeds'));
        return false;
    }
}

// Funkcja do zbierania nagrody za mitycznego ptaka
function collectBirdRewardImproved(slotIndex, locationId) {
    console.log("Używam ulepszonej funkcji zbierania nagrody:", slotIndex, locationId);
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    // Pobierz slot z konkretnej lokacji
    const slot = gameState.locationSlots[locationId][slotIndex];
    if (!slot.needsCollection) return 0;
    
    // Zapamiętaj typ ptaka przed resetowaniem slotu
    const birdType = slot.birdType;
    
    // Zmienna do przechowywania nagrody (monety lub TON)
    let coinReward = 0;
    let tonReward = 0;
    
    // Sprawdź, czy to mityczny ptak i dodaj nagrodę TON
    if (birdType === 'mythical') {
        // Zaktualizowane wartości TON dla różnych lokacji
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
        
        // Dodaj TON do zasobów gracza (upewnij się, że wartość jest liczbą)
        const currentTon = parseFloat(gameState.resources.ton || 0);
        gameState.resources.ton = parseFloat((currentTon + tonReward).toFixed(3));
        console.log("Dodano TON:", tonReward, "Nowy stan:", gameState.resources.ton);
        
        // Pokaż dodatkowe powiadomienie o nagrodzie TON
        showNotification(t('locations.notifications.receivedTon', { amount: tonReward.toFixed(3) }));
        
        // Zapamiętaj przycisk przed aktualizacją, żeby wyświetlić animację
        const rewardButton = document.querySelector(`.bird-slot[data-slot="${slotIndex}"] .collect-reward-button`);
        
        // Natychmiastowa aktualizacja licznika TON
        requestAnimationFrame(() => {
            document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton, 3);
            
            // Aktualizuj ekran portfela, jeśli jest aktualnie otwarty
            if (document.querySelector('.game-screen.active#wallet-screen')) {
                const balanceDisplay = document.getElementById('ton-balance-display');
                if (balanceDisplay) {
                    balanceDisplay.textContent = formatNumber(gameState.resources.ton, 3) + ' TON';
                }
            }
        });
        
        // Wyświetl animację TON z zachowaną referencją do przycisku
        if (rewardButton) {
            // Użyj setTimeout, żeby wyświetlić animację po innych aktualizacjach
            setTimeout(() => {
                if (typeof showTonRewardAnimation === 'function') {
                    showTonRewardAnimation(tonReward, rewardButton);
                } else {
                    // Ręczne tworzenie animacji jako fallback
                    const animation = document.createElement('div');
                    animation.className = 'ton-reward-animation';
                    animation.textContent = `+${tonReward.toFixed(3)} TON`;
                    animation.style.position = 'fixed';
                    
                    const rect = rewardButton.getBoundingClientRect();
                    animation.style.left = rect.left + rect.width / 2 + 'px';
                    animation.style.top = rect.top + 'px';
                    animation.style.color = '#0088CC';
                    animation.style.fontWeight = 'bold';
                    animation.style.fontSize = '24px';
                    animation.style.zIndex = '1000';
                    
                    document.body.appendChild(animation);
                    
                    setTimeout(() => {
                        if (animation.parentNode) {
                            animation.parentNode.removeChild(animation);
                        }
                    }, 2000);
                }
            }, 100);
        }
    } else {
        // Standardowe ptaki - nagroda w DziubCoinach
        // Pobierz nagrodę z konfiguracji konkretnej lokacji
        const locationConfig = gameState.locations.configs[locationId];
        coinReward = locationConfig.birdRewards[birdType];
        
        // Dodaj monety
        gameState.resources.coins += coinReward;
        gameState.stats.totalCoinsEarned += coinReward;
        
        // Aktualizuj misję tygodniową collectCurrency
        updateWeeklyMissionProgress('collectCurrency', coinReward);
    }
    
    // Resetuj slot
    slot.needsCollection = false;
    slot.isActive = false;
    slot.birdType = null;
    
    // Po 3 sekundach spróbuj wygenerować nowego ptaka
    setTimeout(() => {
        trySpawnBirdInSlot(slotIndex, locationId);
        
        // Aktualizuj UI slotu - tylko jeśli jest to bieżąca lokacja
        if (locationId === gameState.locations.currentLocation) {
            const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
            if (slotElement) {
                updateBirdSlotUI(slotElement, slotIndex);
            }
        }
    }, 3000);
    
    // Aktualizuj UI slotu natychmiast po odebraniu nagrody - tylko jeśli jest to bieżąca lokacja
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
    
    updateUI();
    saveGame();
    
    return coinReward;
}

// Zastąp oryginalne funkcje naszymi ulepszonymi wersjami
window.addEventListener('DOMContentLoaded', function() {
    console.log("Inicjalizacja ulepszonej obsługi mitycznych ptaków");
    
    // Zachowaj oryginalne funkcje (dla kompatybilności)
    window.originalFeedBird = window.feedBird || feedBird;
    window.originalCollectBirdReward = window.collectBirdReward || collectBirdReward;
    
    // Zastąp funkcje naszymi ulepszonymi wersjami
    window.feedBird = feedBirdImproved;
    window.collectBirdReward = collectBirdRewardImproved;
    
    // Dodaj opóźnioną reinicjalizację przycisków
    setTimeout(function() {
        console.log("Reinicjalizacja przycisków po załadowaniu funkcji mitycznych ptaków");
        if (typeof setupBirdSlots === 'function') {
            setupBirdSlots();
        }
    }, 1000);
});

// Eksportuj funkcje globalnie
window.feedBirdImproved = feedBirdImproved;
window.collectBirdRewardImproved = collectBirdRewardImproved;