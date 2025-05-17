








// Funkcja do dodawania ziarenek
function addSeedManually() {
    console.log(t('notifications.addingSeedManually'));
    gameState.resources.seeds += 1;
    gameState.stats.totalSeedsCollected += 1;
    
    // Aktualizuj misje związane ze zbieraniem ziarenek
    updateMissionProgress('collectSeeds', 1);
    
    // Dodaj XP
    addExperience(1);
    updateUI();
    saveGame();
    

    // Pokaż animację +1 przy kliknięciu
    showRewardAnimation(t('notifications.seedAdded'), document.getElementById('collect-button'));
    
    // Aktualizuj znacznik misji
    updateMissionBadge();
}

// Funkcja do zbierania auto-ziarenek (poprawiona)
function collectAutoSeeds() {
    if (gameState.resources.autoSeedAmount >= 1) {
        gameState.resources.seeds += gameState.resources.autoSeedAmount;
        gameState.stats.totalSeedsCollected += gameState.resources.autoSeedAmount;
        
        // Aktualizacja postępu misji "Zbierz ziarenka"
        updateMissionProgress('collectSeeds', gameState.resources.autoSeedAmount);
        
        // Aktualizacja postępu misji "Zbierz auto-zbiór"
        updateMissionProgress('autoCollect', 1);

        // Natychmiastowa aktualizacja UI misji
        if (typeof updateMissionsUI === 'function') {
            updateMissionsUI();
        }
        
        // Pokaż animację
        showRewardAnimation(`+${gameState.resources.autoSeedAmount} ${t('resources.seeds')}`, document.getElementById('collect-auto-button'));
        
        gameState.resources.autoSeedAmount = 0;
        updateUI();
        saveGame();
        
        // Aktualizuj znacznik misji
        updateMissionBadge();
    } else {
        showNotification(t('notifications.noSeedsToCollect'));
    }
}

// Funkcja dodająca doświadczenie graczowi
function addExperience(amount) {
    gameState.player.xp += amount;
    
    // Sprawdź, czy gracz awansował na wyższy poziom
    while (gameState.player.xp >= gameState.player.nextLevelXp) {
        gameState.player.xp -= gameState.player.nextLevelXp;
        gameState.player.level += 1;
        
        // Zwiększ wymagane XP na następny poziom
        gameState.player.nextLevelXp = Math.floor(gameState.player.nextLevelXp * 1.5);
        
        // Daj nagrodę za level up
        gameState.resources.coins += 10 * gameState.player.level;
        
        // Pokaż powiadomienie o nowym poziomie
        showNotification(t('notifications.levelUp', {level: gameState.player.level, amount: 10 * gameState.player.level}));
    }
}



// Funkcja do formatowania czasu z sekund na format "h min s"
function formatTime(seconds) {
    seconds = Math.ceil(seconds); // Zaokrąglamy w górę, aby uniknąć wyświetlania "0s"
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let formattedTime = "";
    
    if (hours > 0) {
        formattedTime += hours + "h ";
    }
    
    if (hours > 0 || minutes > 0) {
        formattedTime += minutes + "min ";
    }
    
    formattedTime += secs + "s";
    
    return formattedTime;
}











// Funkcja do karmienia ptaka
function feedBird(slotIndex, locationId) {
    console.log("Próba karmienia ptaka w slocie:", slotIndex);
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    // Pobierz slot z konkretnej lokacji
    const slot = gameState.locationSlots[locationId][slotIndex];
    
    if (!slot.isActive || slot.isFeeding || slot.needsCollection) {
        console.log("Slot nie spełnia warunków do karmienia:", slot);
        return false;
    }
    
    // Pobierz konfigurację lokacji
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
                    console.log(`Czas karmienia mitycznego ptaka po zastosowaniu bonusów: ${feedTime} (lokacja: ${locationId})`);
                    // Pokaż komunikat o bonusie
                    showNotification(t('notifications.mythicalBirdFeedingBonus', {bonus: timeBonus}));
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
            showNotification(t('notifications.notEnoughFruits', {amount: fruitCost}));
            return false;
        }
    } else {
        // Dla zwykłych ptaków - używamy ziarenek z bonusami
        
        // Pobierz oryginalny koszt z konfiguracji
        const originalCost = locationConfig.birdCosts[slot.birdType];
        
        // POPRAWIONE: Bezpośrednie obliczanie bonusu kosztu karmienia
        let finalCost = originalCost;
        
        console.log(`Oryginalny koszt karmienia: ${originalCost} dla lokacji: ${locationId}`);
        
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
        
        // Sprawdź czy mamy wystarczająco ziarenek
        if (gameState.resources.seeds >= finalCost) {
            // Odejmij ziarenka z zastosowanym bonusem
            gameState.resources.seeds -= finalCost;
            
            // Aktualizacja licznika ziarenek
            requestAnimationFrame(() => {
                document.getElementById('seed-count').textContent = gameState.resources.seeds;
            });
            
            // Ustaw ptaka w trybie karmienia
            slot.isFeeding = true;
            
            // TUTAJ DODAJEMY ZASTOSOWANIE BONUSÓW CZASU KARMIENIA
            let feedTime = locationConfig.birdTimes[slot.birdType];
            // Bezpośrednie obliczanie bonusu czasu karmienia
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
        
        showNotification(t('notifications.notEnoughSeeds'));
        return false;
    }
}




















// Funkcja do przepędzania ptaka
function scareBird(slotIndex, locationId) {
    console.log("Próba przepędzenia ptaka w slocie:", slotIndex);
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    // Pobierz slot z konkretnej lokacji
    const slot = gameState.locationSlots[locationId][slotIndex];
    if (!slot.isActive) return;
    
    // Resetuj slot
    slot.isActive = false;
    slot.birdType = null;
    slot.isFeeding = false;
    slot.needsCollection = false;
    
    // Aktualizacja postępu misji "Przepędź ptaki"
    updateMissionProgress('scareBirds', 1);

    // Natychmiastowa aktualizacja UI misji
        if (typeof updateMissionsUI === 'function') {
            updateMissionsUI();
        }
    
    // Aktualizacja statystyk
    gameState.stats.totalBirdsScared += 1;
    
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
    
    // Aktualizuj UI slotu natychmiast po przepędzeniu - tylko jeśli jest to bieżąca lokacja
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
    
    // Aktualizuj znacznik misji
    updateMissionBadge();
}







// Funkcja do zbierania nagrody za karmienie ptaka
function collectBirdReward(slotIndex, locationId) {
    console.log("Próba zebrania nagrody w slocie:", slotIndex);
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    // Pobierz slot z konkretnej lokacji
    const slot = gameState.locationSlots[locationId][slotIndex];
    if (!slot.needsCollection) return 0;
    
    // Pobierz nagrodę z konfiguracji konkretnej lokacji
    const locationConfig = gameState.locations.configs[locationId];
    let reward = locationConfig.birdRewards[slot.birdType];

    // Zapamiętaj typ ptaka przed resetowaniem slotu
    const birdType = slot.birdType;

    // Sprawdź, czy to mityczny ptak i dodaj nagrodę TON
    if (birdType === 'mythical') {
        // Zaktualizowane wartości TON dla różnych lokacji
        let tonReward = 0;
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
        showNotification(t('notifications.receivedTon', {amount: tonReward.toFixed(3)}));
        
        // Zapamiętaj przycisk przed aktualizacją, żeby wyświetlić animację
        const rewardButton = document.querySelector(`.bird-slot[data-slot="${slotIndex}"] .collect-reward-button`);
        
        // Natychmiastowa aktualizacja licznika TON
        requestAnimationFrame(() => {
            document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton, 3, true);
            
            // Aktualizuj ekran portfela, jeśli jest aktualnie otwarty
            if (document.querySelector('.game-screen.active#wallet-screen')) {
                const balanceDisplay = document.getElementById('ton-balance-display');
                if (balanceDisplay) {
                    balanceDisplay.textContent = formatNumber(gameState.resources.ton, 3, true) + ' TON';
                }
            }
        });
        
        // Aktualizuj UI i zapisz stan gry
        updateUI();
        saveGame();
        
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
                    animation.textContent = `+${tonReward} TON`;
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
    }

    else {
        // Zapisz oryginalną wartość nagrody przed bonusami
        let baseReward = reward;
        
        // Użyj funkcji applyDecorationBonusesToReward aby obliczyć finalną nagrodę z bonusem
        if (typeof applyDecorationBonusesToReward === 'function') {
            console.log(`Próba zastosowania bonusu do nagrody ${baseReward} w lokacji ${locationId}`);
            reward = applyDecorationBonusesToReward(locationId, baseReward);
            console.log(`Nagroda po zastosowaniu funkcji bonusowej: ${reward}`);
        } else {
            console.warn("Funkcja applyDecorationBonusesToReward jest niedostępna!");
            
            // Zastosuj bonusy bezpośrednio jako fallback
            if (gameState.decorations && gameState.decorations[locationId]) {
                let totalBonusPercent = 0;
                
                Object.keys(gameState.decorations[locationId]).forEach(decId => {
                    const decoration = gameState.decorations[locationId][decId];
                    if (decoration.owned && decoration.bonus && decoration.bonus.type === "reward") {
                        totalBonusPercent += decoration.bonus.value;
                    }
                });
                
                if (totalBonusPercent > 0) {
                    reward = parseFloat((baseReward * (1 + totalBonusPercent / 100)).toFixed(1));
                    console.log(`Bezpośrednio obliczony bonus +${totalBonusPercent}%: ${baseReward} → ${reward}`);
                }
            }
        }
        
        // Dodaj monety z bonusem
        gameState.resources.coins += reward;
        gameState.stats.totalCoinsEarned += reward;
    }





    
    // Aktualizuj misję tygodniową collectCurrency
    updateWeeklyMissionProgress('collectCurrency', reward);
    
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
    
    return reward;
}






// Funkcja pokazująca animację nagrody TON
function showTonRewardAnimation(amount, element) {
    if (!element) return;
    
    // Utwórz element animacji
    const animation = document.createElement('div');
    animation.className = 'ton-reward-animation'; // Użyj dedykowanej klasy
    animation.textContent = `+${amount} TON`;
    animation.style.color = '#0088CC'; // Kolor TON - niebieski
    animation.style.fontWeight = 'bold';
    animation.style.fontSize = '24px';
    animation.style.textShadow = '0 0 5px rgba(0, 136, 204, 0.7)'; // Lekki blur dla lepszej widoczności
    
    // Pozycjonuj animację nad elementem
    const rect = element.getBoundingClientRect();
    animation.style.position = 'fixed';
    animation.style.left = rect.left + rect.width / 2 + 'px';
    animation.style.top = rect.top + 'px';
    animation.style.transform = 'translate(-50%, -50%)';
    animation.style.zIndex = '1001'; // Wyższa wartość dla lepszej widoczności
    
    // Dodaj element do DOM
    document.body.appendChild(animation);
    
    // Wymuszenie natychmiastowej aktualizacji UI
    requestAnimationFrame(() => {
        document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton || 0.000, 3, true);
    });
    
    // Usuń element po zakończeniu animacji
    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 2000);




    
    // Wymuszenie aktualizacji UI natychmiast
    if (typeof updateResourceCountersImmediately === 'function') {
        updateResourceCountersImmediately();
    } else {
        // Użyj requestAnimationFrame do wymuszenia aktualizacji
        requestAnimationFrame(() => {
            document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton, 3, true);
        });
    }
}










// Funkcja próbująca wygenerować ptaka w danym slocie
function trySpawnBirdInSlot(slotIndex, locationId) {
    console.log("Próba wygenerowania ptaka w slocie:", slotIndex);
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    // Sprawdź czy slot jest odblokowany w tej lokacji
    if (!gameState.locationUnlockedSlots[locationId][slotIndex]) {
        console.log(`Slot ${slotIndex} zablokowany w lokacji ${locationId}`);
        return;
    }
    
    // Pobierz slot z konkretnej lokacji
    const slot = gameState.locationSlots[locationId][slotIndex];
    
    if (slot.isActive) {
        console.log(`Slot ${slotIndex} w lokacji ${locationId} już ma aktywnego ptaka`);
        return;
    }

    // Ustaw prawidłowe szanse dla każdej lokacji

    const correctChances = {
        park: {
            common: 0.50,
            rare: 0.30,
            epic: 0.154,
            legendary: 0.04,
            mythical: 0.006
        },
        lake: {
            common: 0.40,
            rare: 0.35,
            epic: 0.185,
            legendary: 0.064,
            mythical: 0.001
        },
        forest: {
            common: 0.37,
            rare: 0.33,
            epic: 0.20,
            legendary: 0.098,
            mythical: 0.002
        }

    };
    
    // Pobierz konfigurację dla danej lokacji lub użyj domyślnej
    const chances = correctChances[locationId] || correctChances.park;
    
    // Wygeneruj losową liczbę
    const rand = Math.random();
    
    // Inicjalizuj zmienną na typ ptaka
    let birdType;
    
    // Obliczamy przedziały dla każdego typu ptaka
    let cumulativeChance = 0;
    
    // Sprawdzamy po kolei każdy typ ptaka
    if (rand < (cumulativeChance += chances.common)) {
        birdType = 'common';
    } else if (rand < (cumulativeChance += chances.rare)) {
        birdType = 'rare';
    } else if (rand < (cumulativeChance += chances.epic)) {
        birdType = 'epic';
    } else if (rand < (cumulativeChance += chances.legendary)) {
        birdType = 'legendary';
    } else {
        birdType = 'mythical';
    }
    
    console.log(`Wylosowano ptaka typu ${birdType} w slocie ${slotIndex} lokacji ${locationId} (rand=${rand})`);
    
    // Ustaw ptaka w slocie
    slot.birdType = birdType;
    slot.isActive = true;
    slot.isFeeding = false;
    slot.needsCollection = false;
    
    // Odkryj ptaka w katalogu
    console.log(`Próba odkrycia ptaka typu: ${birdType} w lokacji: ${locationId}`);

    // Manualne mapowanie typów na identyfikatory
    let birdId = null;
    if (locationId === 'park') {
        if (birdType === 'common') birdId = 'common_sparrow';
        else if (birdType === 'rare') birdId = 'rare_robin';
        else if (birdType === 'epic') birdId = 'epic_cardinal';
        else if (birdType === 'legendary') birdId = 'legendary_phoenix';
        else if (birdType === 'mythical') birdId = 'mythical_eagle';
    } else if (locationId === 'lake') {
        if (birdType === 'common') birdId = 'common_duck';
        else if (birdType === 'rare') birdId = 'rare_heron';
        else if (birdType === 'epic') birdId = 'epic_swan';
        else if (birdType === 'legendary') birdId = 'legendary_pelican';
        else if (birdType === 'mythical') birdId = 'mythical_kraken';
    } else if (locationId === 'forest') {
        if (birdType === 'common') birdId = 'common_woodpecker';
        else if (birdType === 'rare') birdId = 'rare_owl';
        else if (birdType === 'epic') birdId = 'epic_hawk';
        else if (birdType === 'legendary') birdId = 'legendary_griffin';
        else if (birdType === 'mythical') birdId = 'mythical_phoenix';
    }

    if (birdId && typeof window.discoverBird === 'function') {
        // Korzystamy z ujednoliconej funkcji z bird-catalog-unified.js
        window.discoverBird(birdId, locationId);
    }

    // Aktualizuj UI slotu - tylko jeśli jest to bieżąca lokacja
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
    
    return birdType;
}













// Funkcja odblokowująca nowy slot na ptaki (zaktualizowana dla wielu lokacji)
function unlockBirdSlot(slotIndex, locationId) {
    console.log("Próba odblokowania slotu:", slotIndex);
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    // Jeśli nie podano lokacji, użyj bieżącej
    locationId = locationId || gameState.locations.currentLocation;
    
    console.log(`Stan slotu ${slotIndex} w lokacji ${locationId} przed odblokowaniem:`, 
                gameState.locationUnlockedSlots[locationId][slotIndex]);
    console.log("Dostępne monety:", gameState.resources.coins);
    
    // Sprawdź czy slot jest już odblokowany
    if (gameState.locationUnlockedSlots[locationId][slotIndex]) {
        console.log(`Slot ${slotIndex} w lokacji ${locationId} już odblokowany`);
        return false;
    }
    
    // Pobierz konfigurację kosztów dla danej lokacji
    const locationConfig = gameState.locations.configs[locationId];
    const slotUnlockCosts = locationConfig.slotUnlockCosts || [0, 15, 50, 200, 500];
    
    // Koszt odblokowania slotu
    const unlockCost = slotUnlockCosts[slotIndex] || 50;
    
    if (gameState.resources.coins >= unlockCost) {
        gameState.resources.coins -= unlockCost;
        gameState.locationUnlockedSlots[locationId][slotIndex] = true;
        
        console.log(`Slot ${slotIndex} w lokacji ${locationId} odblokowany pomyślnie!`);
        
        // Dodaj XP za odblokowanie
        addExperience(20);
        
        // Aktualizacja postępu misji tygodniowej unlockSlots
        updateWeeklyMissionProgress('unlockSlots', 1);
        
        // Pokaż powiadomienie
        showNotification(t('birdSlots.newSlotUnlocked'));
        
        // Aktualizuj wygląd slotu - tylko jeśli jest to bieżąca lokacja
        if (locationId === gameState.locations.currentLocation) {
            const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
            if (slotElement) {
                slotElement.classList.remove('locked');
                
                const lockIcon = slotElement.querySelector('.lock-icon');
                const unlockButton = slotElement.querySelector('.unlock-button');
                const unlockText = slotElement.querySelector('p');
                
                if (lockIcon) lockIcon.style.display = 'none';
                if (unlockButton) unlockButton.style.display = 'none';
                if (unlockText) unlockText.style.display = 'none';
                
                // NAPRAWIONE: Najpierw aktualizujemy UI, potem generujemy ptaka
                updateBirdSlotUI(slotElement, slotIndex, locationId);
                
                // ZMODYFIKOWANE: Bardziej szczegółowa reinicjalizacja
                setTimeout(() => {
                    // Spróbuj wygenerować ptaka w nowym slocie
                    trySpawnBirdInSlot(slotIndex, locationId);
                    
                    // Aktualizuj UI konkretnego slotu po wygenerowaniu ptaka - tylko dla bieżącej lokacji
                    updateBirdSlotUI(slotElement, slotIndex, locationId);
                    
                    // Dodatkowe sprawdzenie dla reinicjalizacji przycisków w tym konkretnym slocie
                    const feedButton = slotElement.querySelector('.feed-button');
                    const scareButton = slotElement.querySelector('.scare-button');
                    const collectButton = slotElement.querySelector('.collect-reward-button');
                    
                    if (feedButton) {
                        feedButton.addEventListener('click', function() {
                            console.log(`Karmienie ptaka w slocie ${slotIndex} w lokacji ${locationId}`);
                            feedBird(slotIndex, locationId);
                        });
                    }
                    
                    if (scareButton) {
                        scareButton.addEventListener('click', function() {
                            console.log(`Przepędzanie ptaka w slocie ${slotIndex} w lokacji ${locationId}`);
                            scareBird(slotIndex, locationId);
                        });
                    }
                    
                    if (collectButton) {
                        collectButton.addEventListener('click', function() {
                            console.log(`Zbieranie nagrody w slocie ${slotIndex} w lokacji ${locationId}`);
                            collectBirdReward(slotIndex, locationId);
                        });
                    }
                    
                    // Reinicjalizacja wszystkich przycisków (dla pewności)
                    if (typeof setupBirdSlots === 'function') {
                        setupBirdSlots();
                    }
                    
                    console.log(`Zaktualizowano stan slotu ${slotIndex} w lokacji ${locationId} po odblokowaniu:`, 
                                gameState.locationUnlockedSlots[locationId][slotIndex]);
                    console.log(`Slot ${slotIndex} w lokacji ${locationId} po odblokowaniu:`, 
                                gameState.locationSlots[locationId][slotIndex]);
                    
                    // Aktualizuj UI jeszcze raz po inicjalizacji przycisków
                    updateBirdSlotUI(slotElement, slotIndex, locationId);
                    
                }, 300); // Zwiększony timeout dla pewności
            }
        }
        
        updateUI();
        saveGame();
        
        return true;
    }
    
    showNotification(t('notifications.notEnoughCoins'));
    return false;
}








// Funkcja kupująca ulepszenia
function purchaseUpgrade(upgradeType) {
    let cost;
    let description;
    
    switch (upgradeType) {
        case 'auto-capacity':
            cost = 20 + (gameState.upgrades.autoCapacity * 10);
            if (gameState.resources.coins >= cost) {
                gameState.resources.coins -= cost;
                gameState.upgrades.autoCapacity += 1;
                gameState.resources.autoCollectLimit += 10;
                description = t('production.autoCapacityIncreased');
                
                // Aktualizuj przycisk ulepszenia
                const capacityButton = document.querySelector('.upgrade-button[data-upgrade="auto-capacity"]');
                if (capacityButton) {
                    const newCost = cost + 10;
                    capacityButton.textContent = t('production.upgradeButton', {amount: newCost});
                }
            } else {
                showNotification(t('notifications.notEnoughCoins'));
                return false;
            }
            break;
            
        case 'auto-speed':
            cost = 30 + (gameState.upgrades.autoSpeed * 15);
            if (gameState.resources.coins >= cost) {
                gameState.resources.coins -= cost;
                gameState.upgrades.autoSpeed += 1;
                gameState.resources.autoCollectInterval = Math.max(1, gameState.resources.autoCollectInterval - 1);
                description = t('production.autoSpeedIncreased');
                
                // Aktualizuj przycisk ulepszenia
                const speedButton = document.querySelector('.upgrade-button[data-upgrade="auto-speed"]');
                if (speedButton) {
                    const newCost = cost + 15;
                    speedButton.textContent = t('production.upgradeButton', {amount: newCost});
                }
            } else {
                showNotification(t('notifications.notEnoughCoins'));
                return false;
            }
            break;
    }
    
    // Dodaj XP za ulepszenie
    addExperience(10);
    
    // Pokaż powiadomienie
    if (description) {
        showNotification(description);
    }
    
    updateUI();
    saveGame();
    
    return true;
}




// Funkcja aktualizująca stan gry co sekundę
function updateGameState() {
    // Aktualizuj auto-zbieranie
    if (gameState.resources.autoSeedAmount < gameState.resources.autoCollectLimit) {
        gameState.resources.autoCollectTimer += 1;
        
        if (gameState.resources.autoCollectTimer >= gameState.resources.autoCollectInterval) {
            gameState.resources.autoCollectTimer = 0;
            gameState.resources.autoSeedAmount++;
            updateUI();
        }
    }
    
    // Aktualizuj czas karmienia ptaków we wszystkich lokacjach
    Object.keys(gameState.locationSlots).forEach(locationId => {
        const isCurrentLocation = (locationId === gameState.locations.currentLocation);
        
        gameState.locationSlots[locationId].forEach((slot, index) => {
            if (slot.isActive && slot.isFeeding) {
                slot.remainingTime -= 1;
                
                if (slot.remainingTime <= 0) {
                    slot.remainingTime = 0;
                    slot.isFeeding = false;
                    slot.needsCollection = true;
                    
                    // Powiadomienie tylko dla bieżącej lokacji
                    if (isCurrentLocation) {
                        // Powiadomienie o gotowości do odbioru
                        showNotification(t('notifications.birdReadyToCollect'));
                        
                        // Aktualizuj znacznik misji, jeśli są nagrody do odebrania
                        updateMissionBadge();
                    }
                }
                
                // Aktualizuj UI slotu z ptakiem tylko dla bieżącej lokacji
                if (isCurrentLocation) {
                    const slotElement = document.querySelector(`.bird-slot[data-slot="${index}"]`);
                    if (slotElement) {
                        updateBirdSlotUI(slotElement, index);
                    }
                }



                // Dodatkowa aktualizacja przycisków akcji dla wszystkich lokacji
if (typeof updateAllActionButtons === 'function') {
    updateAllActionButtons();
}
            }
        });
    });
}





// Funkcja inicjalizująca ptaki we wszystkich lokacjach
function initializeAllLocations() {
    console.log("Inicjalizacja ptaków we wszystkich lokacjach");
    
    // Dla każdej odblokowanej lokacji
    Object.keys(gameState.locations.unlockedLocations).forEach(locationId => {
        // Sprawdź, czy lokacja jest odblokowana
        if (!gameState.locations.unlockedLocations[locationId]) {
            return; // Lokacja zablokowana, przejdź do następnej
        }
        
        console.log(`Inicjalizacja lokacji: ${locationId}`);
        
        // Sprawdź każdy slot w lokacji
        gameState.locationSlots[locationId].forEach((slot, index) => {
            // Sprawdź, czy slot jest odblokowany
            if (!gameState.locationUnlockedSlots[locationId][index]) {
                return; // Slot zablokowany, przejdź do następnego
            }
            
            // Jeśli slot jest pusty, spróbuj wygenerować ptaka
            if (!slot.isActive) {
                console.log(`Próba wygenerowania ptaka w lokacji ${locationId}, slot ${index}`);
                trySpawnBirdInSlot(index, locationId);
            }
        });
    });
    
    // Aktualizuj stan przycisków po inicjalizacji
    if (typeof updateAllActionButtons === 'function') {
        updateAllActionButtons();
    }
}

// Dodaj funkcję do globalnego zakresu
window.initializeAllLocations = initializeAllLocations;


    
  





// Funkcja aktualizująca postęp misji (poprawiona)
function updateMissionProgress(missionType, amount) {
    console.log(`Aktualizacja postępu misji: ${missionType}, +${amount}`);
    
    // Sprawdź czy misje istnieją
    if (!gameState.missions || !Array.isArray(gameState.missions)) {
        console.warn("Brak misji, inicjalizuję domyślne");
        initDefaultMissions();
    }
    
    // Sprawdź wszystkie misje tego typu
    let updated = false;
    
    gameState.missions.forEach(mission => {
        if (mission.type === missionType && !mission.completed) {
            mission.progress += amount;
            
            console.log(`Zaktualizowano postęp misji "${mission.title}": ${mission.progress}/${mission.target}`);
            
            // Sprawdź czy misja została ukończona
            if (mission.progress >= mission.target) {
                mission.progress = mission.target;
                mission.completed = true;
                
                // Upewnij się, że pole rewarded istnieje i jest ustawione na false
                if (mission.rewarded === undefined) {
                    mission.rewarded = false;
                }
                
                console.log(`Misja "${mission.title}" została ukończona, oczekuje na odebranie nagrody`);
                
                // Powiadom gracza
                showNotification(t('missions.completed', {title: mission.title}));
                
                updated = true;
            }
        }
    });
    
    // ZMIANA: Zawsze aktualizuj UI misji natychmiast
    if (typeof updateMissionsUI === 'function') {
        updateMissionsUI();
    }
    

    
   // DODANE: Aktualizuj znacznik misji - dodajemy wywołanie
    if (typeof updateMissionBadge === 'function') {
        updateMissionBadge();
    }



    
    saveGame();
    
    // Sprawdź również osiągnięcia
    updateAchievementProgress(missionType, amount);
};







// Funkcja do odbierania nagrody za ukończoną misję (globalna)
window.claimMissionReward = function(missionIndex) {
    console.log(`Próba odebrania nagrody za misję o indeksie: ${missionIndex}`);
    
    // Konwersja na liczbę
    missionIndex = parseInt(missionIndex, 10);
    
    // Sprawdź poprawność indeksu
    if (missionIndex < 0 || missionIndex >= gameState.missions.length) {
        console.error(`Nieprawidłowy indeks misji: ${missionIndex}`);
        return false;
    }
    
    // Pobierz misję z tablicy
    const mission = gameState.missions[missionIndex];
    
    console.log("Misja do odebrania:", mission);
    
    // Sprawdź, czy misja jest zakończona i nagroda nie została jeszcze odebrana
    if (mission.completed && mission.rewarded !== true) {
        console.log("Misja kwalifikuje się do odebrania nagrody");
        
        // Przyznaj nagrodę
        gameState.resources.coins += mission.reward;
        
        console.log(`Dodano ${mission.reward} monet, nowy stan: ${gameState.resources.coins}`);
        
        // Dodaj XP za ukończenie misji
        addExperience(5);
        
        // Oznacz, że nagroda została odebrana
        mission.rewarded = true;
        
        // Powiadom gracza - tutaj nie wyświetlamy DziubCoinów, bo animacja to zrobi
        showNotification(t('missions.rewardClaimed'));
        
        // Spróbuj pokazać animację - tutaj używamy liczby + DziubCoinów
        const button = document.querySelector(`.mission-item[data-index="${missionIndex}"] .claim-reward-button`);
        if (button) {
            console.log("Znaleziono przycisk do animacji");
            showRewardAnimation(`+${mission.reward} ${t('resources.coins')}`, button);
        }
        
        // Aktualizuj misję bonusową po odebraniu nagrody
        updateBonusMission();
        
        // Aktualizuj UI
        updateUI();
        
        if (typeof updateMissionsUI === 'function') {
            updateMissionsUI();
        }
        


// Dodaj przed saveGame():
if (typeof updateMissionBadge === 'function') {
    updateMissionBadge();
    console.log("FORCE-UPDATE: Aktualizacja badge po odebraniu nagrody");
}
        

        // Zapisz stan gry
        saveGame();
        
        console.log("Nagroda za misję odebrana pomyślnie");
        
        return true;
    } else {
        console.warn("Misja nie kwalifikuje się do odebrania nagrody:",
                     "completed =", mission.completed,
                     "rewarded =", mission.rewarded);
        return false;
    }
};













   

// Funkcja aktualizująca postęp misji bonusowej
function updateBonusMission() {
    console.log("Sprawdzanie postępu misji bonusowej...");
    
    // Znajdź misję bonusową
    const bonusMissionIndex = gameState.missions.findIndex(mission => mission.isBonus === true);
    
    if (bonusMissionIndex === -1) {
        console.warn("Nie znaleziono misji bonusowej!");
        return;
    }
    
    const bonusMission = gameState.missions[bonusMissionIndex];
    
    // Licznik ukończonych i odebranych misji
    let completedAndRewardedCount = 0;
    
    // Sprawdź wszystkie misje oprócz bonusowej
    gameState.missions.forEach((mission, index) => {
        if (!mission.isBonus && mission.completed && mission.rewarded) {
            completedAndRewardedCount++;
        }
    });
    
    // Aktualizuj postęp misji bonusowej
    bonusMission.progress = completedAndRewardedCount;
    
    console.log(`Zaktualizowano postęp misji bonusowej: ${bonusMission.progress}/${bonusMission.target}`);
    
    // Sprawdź, czy misja bonusowa została ukończona
    if (bonusMission.progress >= bonusMission.target && !bonusMission.completed) {
        bonusMission.completed = true;
        console.log("Misja bonusowa ukończona!");
        showNotification(t('missions.bonusCompleted'));
        
        // Aktualizuj znacznik misji
        updateMissionBadge();
    }
    
    // Aktualizuj UI misji
    if (typeof updateMissionsUI === 'function') {
        updateMissionsUI();
    } else if (typeof setupMissions === 'function') {
        setupMissions();
    }
}



function updateMissionBadge() {
    console.log("Aktualizacja znacznika misji...");
    
    const badge = document.getElementById('missions-badge');
    
    if (!badge) {
        console.warn("Nie znaleziono elementu znacznika misji");
        return;
    }
    
    // Sprawdź, czy są misje gotowe do odebrania nagrody
    const hasClaimableMissions = gameState.missions && Array.isArray(gameState.missions) && 
                                gameState.missions.some(mission => mission.completed && !mission.rewarded);
    
    // Sprawdź, czy są misje tygodniowe do odebrania
    const hasWeeklyClaimable = gameState.weeklyMissions && Array.isArray(gameState.weeklyMissions) && 
                              gameState.weeklyMissions.some(mission => mission.completed && !mission.rewarded);
    
    // Pokaż/ukryj znacznik
    if (hasClaimableMissions || hasWeeklyClaimable) {
        console.log("Są misje do odebrania - pokazuję znacznik");
        badge.style.display = 'block';
    } else {
        console.log("Brak misji do odebrania - ukrywam znacznik");
        badge.style.display = 'none';
    }
}




// Funkcja sprawdzająca, czy wszystkie misje zostały ukończone
function checkAllMissionsCompleted() {
    if (!gameState.missions || !Array.isArray(gameState.missions) || gameState.missions.length === 0) {
        return false;
    }
    
    // Sprawdź, czy wszystkie misje są ukończone i nagrody odebrane
    const allCompleted = gameState.missions.every(mission => mission.completed && mission.rewarded);
    
    if (allCompleted) {
        console.log("Wszystkie misje zostały ukończone i nagrody odebrane!");
        // Tutaj można dodać jakąś dodatkową nagrodę za wykonanie wszystkich misji
    }
    
    return allCompleted;
}





// Funkcja migrująca z starego formatu gameState do nowego
function migrateGameState(oldState) {
    console.log("Migracja stanu gry do nowego formatu z obsługą wielu lokacji");
    
    // ZMIANA #1: Zapewnij, że obiekt locations istnieje i zachowaj istniejące dane
    if (!oldState.locations) {
        oldState.locations = {};
        console.log("Utworzono nowy obiekt locations w migracji");
    }
    
    // ZMIANA #2: Zachowaj dane o odblokowanych lokacjach, jeśli istnieją
    if (!oldState.locations.unlockedLocations) {
        oldState.locations.unlockedLocations = {
            park: true,
            lake: false
        };
        console.log("Inicjalizacja domyślnych odblokowanych lokacji w migracji");
    } else {
        console.log("Zachowano istniejące dane o odblokowanych lokacjach:", oldState.locations.unlockedLocations);
    }
    
    // ZMIANA #3: Zachowaj informację o bieżącej lokacji, jeśli istnieje
    if (!oldState.locations.currentLocation) {
        oldState.locations.currentLocation = "park";
        console.log("Ustawiono domyślną bieżącą lokację w migracji");
    } else {
        console.log("Zachowano bieżącą lokację:", oldState.locations.currentLocation);
    }
    
    // Dodanie konfiguracji lokacji, jeśli nie istnieje
    if (!oldState.locations.configs) {
        console.log("Dodaję konfiguracje lokacji w migracji");
        oldState.locations.configs = {
            park: {
                name: t('locations.parkName'),
                background: "assets/images/feed-bg.jpg",
                unlockCost: 0,
                slotUnlockCosts: [0, 15, 50, 200, 500],
                birdImages: {
                    common: "assets/images/common-bird.png",
                    rare: "assets/images/rare-bird.png",
                    epic: "assets/images/epic-bird.png",
                    legendary: "assets/images/legendary-bird.png",
                    mythical: "assets/images/mythical-bird.png"
                },
                birdCosts: oldState.birdCosts || {
                    common: 2,
                    rare: 5,
                    epic: 10,
                    legendary: 50,
                    mythical: 0 // Koszt 0, bo mityczne ptaki używają owoców zamiast ziarenek
                },
                birdTimes: oldState.birdTimes || {
                    common: 30,
                    rare: 60,
                    epic: 120,
                    legendary: 600,
                    mythical: 1200
                },
                birdRewards: oldState.birdRewards || {
                    common: 1,
                    rare: 3,
                    epic: 5,
                    legendary: 15,
                    mythical: 40
                },
                spawnChances: {
                   common: 0.50,
                   rare: 0.30,
                   epic: 0.154,
                   legendary: 0.04,
                   mythical: 0.006
                },
                birdCatalogMapping: {
                    common: "common_sparrow",
                    rare: "rare_robin",
                    epic: "epic_cardinal",
                    legendary: "legendary_phoenix",
                    mythical: "mythical_eagle"
                }
            },
            lake: {
                name: t('locations.lakeName'),
                background: "assets/images/lake-bg.jpg",
                unlockCost: 10,
                slotUnlockCosts: [0, 30, 75, 300, 750],
                birdImages: {
                    common: "assets/images/lake-common.png",
                    rare: "assets/images/lake-rare.png",
                    epic: "assets/images/lake-epic.png",
                    legendary: "assets/images/lake-legendary.png",
                    mythical: "assets/images/lake-mythical.png"
                },
                birdCosts: {
                    common: 3,
                    rare: 7,
                    epic: 15,
                    legendary: 75,
                    mythical: 0 // Koszt 0, bo mityczne ptaki używają owoców zamiast ziarenek
                },
                birdTimes: {
                    common: 40,
                    rare: 80,
                    epic: 160,
                    legendary: 800,
                    mythical: 1600
                },
                birdRewards: {
                    common: 2,
                    rare: 5,
                    epic: 10,
                    legendary: 25,
                    mythical: 60
                },
                spawnChances: {
                    common: 0.40,
                    rare: 0.35,
                    epic: 0.185,
                    legendary: 0.064,
                    mythical: 0.001
                },
                birdCatalogMapping: {
                    common: "common_duck",
                    rare: "rare_heron",
                    epic: "epic_swan",
                    legendary: "legendary_pelican",
                    mythical: "mythical_kraken"
                },
                
                forest: {
                    name: t('locations.forestName'),
                    background: "assets/images/forest-bg.jpg",
                    unlockCost: 50,
                    slotUnlockCosts: [0, 100, 350, 500, 1000],
                    birdImages: {
                        common: "./assets/images/forest-common.png",
                        rare: "./assets/images/forest-rare.png",
                        epic: "./assets/images/forest-epic.png",
                        legendary: "./assets/images/forest-legendary.png",
                        mythical: "./assets/images/forest-mythical.png"
                    },
                    birdCosts: {
                        common: 30,
                        rare: 100,
                        epic: 175,
                        legendary: 300,
                       mythical: 0 // Koszt 0, bo mityczne ptaki używają owoców zamiast ziarenek
                    },
                    birdTimes: {
                        common: 45,
                        rare: 90,
                        epic: 180,
                        legendary: 900,
                        mythical: 1800
                    },
                    birdRewards: {
                        common: 5,
                        rare: 12,
                        epic: 25,
                        legendary: 45,
                        mythical: 80
                    },
                    spawnChances: {
                        common: 0.37,
                        rare: 0.33,
                        epic: 0.20,
                        legendary: 0.098,
                        mythical: 0.002
                    },
                    birdCatalogMapping: {
                        common: "common_woodpecker",
                        rare: "rare_owl",
                        epic: "epic_hawk",
                        legendary: "legendary_griffin",
                        mythical: "mythical_phoenix"
                    }
                }
            }
        };
    }
    
    // Migracja slotów
    if (!oldState.locationSlots) {
        oldState.locationSlots = {
            park: oldState.birdSlots ? [...oldState.birdSlots] : [
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0}
            ],
            lake: [
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0}
            ],
            forest: [
                    {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                    {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                    {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                    {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0},
                    {isActive: false, birdType: null, isFeeding: false, needsCollection: false, remainingTime: 0}
                ]
            }
    }
    
    // Migracja odblokowanych slotów
    if (!oldState.locationUnlockedSlots) {
        oldState.locationUnlockedSlots = {
            park: oldState.unlockedSlots ? [...oldState.unlockedSlots] : [true, true, false, false, false],
            lake: [true, true, false, false, false],
            forest: [true, true, false, false, false]
        };
    }
    
    // Migracja odkrytych ptaków
    if (!oldState.discoveredBirds || typeof oldState.discoveredBirds !== 'object' || !oldState.discoveredBirds.park) {
        const tempDiscoveredBirds = oldState.discoveredBirds || {
            common_sparrow: true,
            rare_robin: false,
            epic_cardinal: false,
            legendary_phoenix: false,
            mythical_eagle: false,
            common_duck: false,
            rare_heron: false,
            epic_swan: false
        };
        
        oldState.discoveredBirds = {
            park: {
                common_sparrow: tempDiscoveredBirds.common_sparrow || false,
                rare_robin: tempDiscoveredBirds.rare_robin || false,
                epic_cardinal: tempDiscoveredBirds.epic_cardinal || false,
                legendary_phoenix: tempDiscoveredBirds.legendary_phoenix || false,
                mythical_eagle: tempDiscoveredBirds.mythical_eagle || false
            },
            lake: {
                common_duck: tempDiscoveredBirds.common_duck || false,
                rare_heron: tempDiscoveredBirds.rare_heron || false,
                epic_swan: tempDiscoveredBirds.epic_swan || false,
                legendary_pelican: false,
                mythical_kraken: false
            },
            forest: {
                common_woodpecker: false,
                rare_owl: false,
                epic_hawk: false,
                legendary_griffin: false,
                mythical_phoenix: false
            }
        };
    }


// Aktualizuj statystyki ptaka co sekundę
if (typeof updatePetStats === 'function') {
    updatePetStats();
}

    // ZMIANA #4: Dodanie debugowania na końcu migracji
    console.log("Po migracji - stan lokacji:", oldState.locations);
    console.log("Po migracji - odblokowane lokacje:", oldState.locations.unlockedLocations);
    
    // Dodaj gettery dla kompatybilności z istniejącym kodem
    Object.defineProperties(oldState, {
        birdSlots: {
            get: function() {
                return this.locationSlots[this.locations.currentLocation] || this.locationSlots.park;
            }
        },
        unlockedSlots: {
            get: function() {
                return this.locationUnlockedSlots[this.locations.currentLocation] || this.locationUnlockedSlots.park;
            }
        },
        birdCosts: {
            get: function() {
                return this.locations.configs[this.locations.currentLocation]?.birdCosts || this.locations.configs.park.birdCosts;
            }
        },
        birdTimes: {
            get: function() {
                return this.locations.configs[this.locations.currentLocation]?.birdTimes || this.locations.configs.park.birdTimes;
            }
        },
        birdRewards: {
            get: function() {
                return this.locations.configs[this.locations.currentLocation]?.birdRewards || this.locations.configs.park.birdRewards;
            }
        }
    });
    
    return oldState;
}













// Funkcja wczytująca stan gry (rozszerzona o obsługę modułu hodowli)
function loadGame() {
    console.log("Wczytywanie stanu gry");

    // DODANE: Sprawdź dodatkowy zapis lokacji
    const savedLocations = localStorage.getItem('dziubCoins_locations');
    let locationsBackup = null;
    if (savedLocations) {
        try {
            locationsBackup = JSON.parse(savedLocations);
            console.log("Znaleziono dodatkowy zapis lokacji:", locationsBackup);
        } catch (e) {
            console.error("Błąd parsowania dodatkowego zapisu lokacji:", e);
        }
    }

    const savedGame = localStorage.getItem('dziubCoinsGame');
    if (savedGame) {
        try {
            const loadedState = JSON.parse(savedGame);
            
            // DODANE: Sprawdź czy lokacja lake jest odblokowana w zapisanym stanie






const lakeLockState = loadedState.locations?.unlockedLocations?.lake;
            console.log("Wczytywanie - Stan LAKE w zapisanym stanie:", lakeLockState);
            
            // Najpierw przeprowadź migrację, aby mieć pewność, że wszystkie pola są zainicjalizowane
            const migratedState = migrateGameState(loadedState);
            console.log("Stan po migracji:", migratedState.locations);
            
            // NOWY KOD: Zapisz czasowo obecny stan odblokowanych lokacji do porównania
            const previousUnlockedLocations = gameState.locations && gameState.locations.unlockedLocations ? 
                {...gameState.locations.unlockedLocations} : { park: true, lake: false };
            
            const now = Date.now();
            const lastSave = loadedState.lastSaveTime || now;
            const offlineSeconds = Math.floor((now - lastSave) / 1000);
            
            console.log(`Czas offline: ${offlineSeconds} sekund`);
            
            // Przenieś dane gracza
            if (loadedState.player) Object.assign(gameState.player, loadedState.player);
            
            // Zasoby
            if (loadedState.resources) Object.assign(gameState.resources, loadedState.resources);
            
            // Ulepszenia
            if (loadedState.upgrades) Object.assign(gameState.upgrades, loadedState.upgrades);
            
            // ZMIANA: Wczytaj dane lokacji bardziej bezpośrednio i z lepszym loggingiem
            if (loadedState.locations) {
                console.log("Wczytano dane lokacji z zapisu. Stan przed wczytaniem:", 
                           JSON.stringify(gameState.locations?.unlockedLocations || "brak"));
                
                // Inicjalizuj obiekt locations, jeśli nie istnieje
                if (!gameState.locations) {
                    gameState.locations = {};
                }
                
                // Zapisz bieżącą lokację
                gameState.locations.currentLocation = loadedState.locations.currentLocation || "park";
                
                // Wczytaj odblokowane lokacje - WAŻNE!
                if (loadedState.locations.unlockedLocations) {
                    gameState.locations.unlockedLocations = {...loadedState.locations.unlockedLocations};
                    console.log("Wczytano odblokowane lokacje:", gameState.locations.unlockedLocations);
                    
                    // DODANE: Specjalne sprawdzenie dla lokacji lake z dodatkowego zapisu
                    if (locationsBackup && locationsBackup.unlockedLocations && 
                        locationsBackup.unlockedLocations.lake === true && 
                        gameState.locations.unlockedLocations.lake !== true) {
                        console.log("KOREKTA! Lokacja lake powinna być odblokowana - przywracam z dodatkowego zapisu");
                        gameState.locations.unlockedLocations.lake = true;
                    }
                } else if (locationsBackup && locationsBackup.unlockedLocations) {
                    // Jeśli brak danych w głównym zapisie, użyj zapasowego
                    console.log("Brak informacji o odblokowanych lokacjach w głównym zapisie - używam dodatkowego zapisu");
                    gameState.locations.unlockedLocations = {...locationsBackup.unlockedLocations};
                } else {
                    console.log("Brak zapisanych danych o odblokowanych lokacjach - inicjalizuję domyślne");
                    gameState.locations.unlockedLocations = { park: true, lake: false };
                }
                
                // Wczytaj konfiguracje, jeśli istnieją
                if (loadedState.locations.configs) {
                    gameState.locations.configs = loadedState.locations.configs;
                }
                
                console.log("Stan po wczytaniu:", JSON.stringify(gameState.locations.unlockedLocations));
                
                // Porównaj stan przed i po wczytaniu
                const locationChanges = {};
                Object.keys(gameState.locations.unlockedLocations).forEach(locId => {
                    if (previousUnlockedLocations[locId] !== gameState.locations.unlockedLocations[locId]) {
                        locationChanges[locId] = gameState.locations.unlockedLocations[locId];
                    }
                });
                
                if (Object.keys(locationChanges).length > 0) {
                    console.log("Wykryto zmiany w odblokowanych lokacjach:", locationChanges);
                }
            } else {
                console.log("Brak zapisanych danych lokacji, używam domyślnych");
                
                // Inicjalizuj struktury, jeśli nie istnieją
                if (!gameState.locations) {
                    gameState.locations = {
                        currentLocation: "park",
                        unlockedLocations: { park: true, 
                            lake: false, 
                            forest: false }
                    };
                }
                
                // DODANE: Sprawdź dodatkowy zapis lokacji
                if (locationsBackup) {
                    console.log("Znaleziono dodatkowy zapis lokacji - przywracam...");
                    gameState.locations.currentLocation = locationsBackup.currentLocation || "park";
                    gameState.locations.unlockedLocations = {...locationsBackup.unlockedLocations};
                    console.log("Przywrócono dane lokacji z dodatkowego zapisu:", gameState.locations.unlockedLocations);
                }
            }
            
            // NOWA SEKCJA - Korekta szans losowania ptaków
            // Dodajemy tę sekcję bez względu na to, czy konfiguracje istnieją czy nie
            if (gameState.locations && gameState.locations.configs) {
                console.log("Korekta szans losowania ptaków dla wszystkich lokacji...");
                
                // Koryguj szanse dla Parku Miejskiego
                if (gameState.locations.configs.park) {
                    gameState.locations.configs.park.spawnChances = {
                        common: 0.50,
                        rare: 0.30,
                        epic: 0.154,
                        legendary: 0.04,
                        mythical: 0.006
                    };
                    console.log("Skorygowano szanse dla Parku Miejskiego");
                }
                
                // Koryguj szanse dla Brzegu Jeziora
                if (gameState.locations.configs.lake) {
                    gameState.locations.configs.lake.spawnChances = {
                        common: 0.40,
                        rare: 0.35,
                        epic: 0.185,
                        legendary: 0.064,
                        mythical: 0.001
                    };
                    console.log("Skorygowano szanse dla Brzegu Jeziora");
                }
                
                // Koryguj szanse dla Tajemniczego Lasu
                if (gameState.locations.configs.forest) {
                    gameState.locations.configs.forest.spawnChances = {
                        common: 0.37,
                        rare: 0.33,
                        epic: 0.20,
                        legendary: 0.098,
                        mythical: 0.002
                    };
                    console.log("Skorygowano szanse dla Tajemniczego Lasu");
                }
                
                console.log("Zakończono korektę szans losowania ptaków");
            }
            
            // Sloty ptaków w lokacjach
            if (loadedState.locationSlots) {
                gameState.locationSlots = loadedState.locationSlots;
                
                // Przeliczenie karmienia offline we wszystkich lokacjach
                Object.keys(gameState.locationSlots).forEach(locationId => {
                    gameState.locationSlots[locationId].forEach(slot => {
                        if (slot.isActive && slot.isFeeding) {
                            slot.remainingTime -= offlineSeconds;
                            if (slot.remainingTime <= 0) {
                                slot.remainingTime = 0;
                                slot.isFeeding = false;
                                slot.needsCollection = true;
                            }
                        }
                    });
                });
            }
            
            // Odblokowane sloty w lokacjach
            if (loadedState.locationUnlockedSlots) {
                gameState.locationUnlockedSlots = loadedState.locationUnlockedSlots;
            }
            
            // Odkryte ptaki
            if (loadedState.discoveredBirds) {
                gameState.discoveredBirds = loadedState.discoveredBirds;
                console.log("Wczytano odkryte ptaki:", gameState.discoveredBirds);
            } else {
                console.log("Brak zapisanych odkrytych ptaków, inicjalizacja domyślna");
                // Inicjalizacja domyślna, jeśli nie ma zapisanych danych
                gameState.discoveredBirds = {
                    park: {
                        common_sparrow: true,  // Na start odkryty jest wróbel
                        rare_robin: false,
                        epic_cardinal: false,
                        legendary_phoenix: false,
                        mythical_eagle: false
                    },
                    lake: {
                        common_duck: false,
                        rare_heron: false,
                        epic_swan: false,
                        legendary_pelican: false,
                        mythical_kraken: false
                    }
                };
            }



// NOWA SEKCJA - Wczytywanie stanu dekoracji
if (loadedState.decorations) {
    console.log("Wczytywanie zapisanych dekoracji:", loadedState.decorations);
    // Używamy głębokiej kopii, aby zachować wszystkie właściwości
    gameState.decorations = JSON.parse(JSON.stringify(loadedState.decorations));
    console.log("Stan dekoracji po wczytaniu:", gameState.decorations);
} else {
    console.log("Brak zapisanych dekoracji - inicjalizacja domyślna nastąpi w initShop()");
}


            
            // Statystyki
            if (loadedState.stats) Object.assign(gameState.stats, loadedState.stats);
            
            // Dodatkowe daty
            gameState.lastDailyBonus = loadedState.lastDailyBonus;
            gameState.lastMissionsCheck = loadedState.lastMissionsCheck;
            gameState.lastWeeklyCheck = loadedState.lastWeeklyCheck;

            console.log("Wczytano daty kontrolne:", {
                lastDailyBonus: gameState.lastDailyBonus,
                lastMissionsCheck: gameState.lastMissionsCheck,
                lastWeeklyCheck: gameState.lastWeeklyCheck
            });
            
            // ====== Wczytaj dane ptaka domowego ======
            if (loadedState.petBird) {
                gameState.petBird = loadedState.petBird;
                
                // MIGRACJA ze starego systemu na nowy
                if (loadedState.petBird.age !== undefined && loadedState.petBird.level === undefined) {
                    // Konwertuj stary age na nowy level
                    gameState.petBird.level = Math.max(1, loadedState.petBird.age + 1);
                    // Konwertuj stary growth na nowy experience
                    gameState.petBird.experience = loadedState.petBird.growth || 0;
                    // Usuń stare pola
                    delete gameState.petBird.age;
                    delete gameState.petBird.growth;
                    console.log("Zmigrowano ptaka z systemu age/growth na level/experience");
                }
                
                // Reszta kodu...
                
                // Przeliczenie zmian offline dla ptaka
                if (gameState.petBird.exists) {
                    const petElapsedSeconds = offlineSeconds;
                    
                    // Określ współczynniki spadku statystyk w zależności od etapu rozwoju
                    const stage = gameState.petBird.stage;
                    const rates = {
                        egg: { hunger: 1.0, happiness: 0.05, cleanliness: 0.05 },
                        chick: { hunger: 1.0, happiness: 0.15, cleanliness: 0.2 },
                        young: { hunger: 0.5, happiness: 0.2, cleanliness: 0.15 },
                        adult: { hunger: 0.3, happiness: 0.1, cleanliness: 0.1 }
                    };
                    
                    // Zmniejsz statystyki na podstawie czasu offline
                    const stageRates = rates[stage] || rates.egg;
                    gameState.petBird.hunger = Math.max(0, gameState.petBird.hunger - (stageRates.hunger * petElapsedSeconds));
                    gameState.petBird.happiness = Math.max(0, gameState.petBird.happiness - (stageRates.happiness * petElapsedSeconds));
                    gameState.petBird.cleanliness = Math.max(0, gameState.petBird.cleanliness - (stageRates.cleanliness * petElapsedSeconds));
                    
              
                    
                    // Aktualizuj lastUpdate
                    gameState.petBird.lastUpdate = now;
                }
            }
            
            // ====== Auto-zbieranie offline ======
            const autoCollects = Math.floor(offlineSeconds / gameState.resources.autoCollectInterval);
            const toAdd = Math.min(autoCollects, gameState.resources.autoCollectLimit - gameState.resources.autoSeedAmount);
            
            if (toAdd > 0) {
                gameState.resources.autoSeedAmount += toAdd;
                console.log(`Dodano ${toAdd} auto-ziarenek offline.`);
            }
            
            // ZMIANA: Dodaj dodatkowe sprawdzenie po wczytaniu stanu
            console.log('Gra wczytana pomyślnie! Stan lokacji po wczytaniu:', gameState.locations);
            console.log('Odblokowane lokacje po wczytaniu:', gameState.locations.unlockedLocations);
            
            // Wczytaj misje dzienne - ZMIANA: dodano sprawdzanie długości tablicy
            if (loadedState.missions && Array.isArray(loadedState.missions) && loadedState.missions.length > 0) {
                console.log("Wczytano misje dzienne:", loadedState.missions.length);
                gameState.missions = loadedState.missions;
            } else {
                console.log("Brak zapisanych misji dziennych, inicjalizacja domyślna");
                initDefaultMissions();
            }
            
            // Wczytaj misje tygodniowe - ZMIANA: dodano sprawdzanie długości tablicy
            if (loadedState.weeklyMissions && Array.isArray(loadedState.weeklyMissions) && loadedState.weeklyMissions.length > 0) {
                console.log("Wczytano misje tygodniowe:", loadedState.weeklyMissions.length);
                gameState.weeklyMissions = loadedState.weeklyMissions;
            } else {
                console.log("Brak zapisanych misji tygodniowych, inicjalizacja domyślna");
                initDefaultWeeklyMissions();
            }
            
        } catch (error) {
            console.error('Błąd podczas wczytywania gry:', error);
            initDefaultMissions();
            initDefaultWeeklyMissions();
        }
    } else {
        console.log("Brak zapisanej gry, inicjalizuję nową grę");
        initDefaultMissions();
        initDefaultWeeklyMissions();
    }
    
    // Upewnij się, że mamy misje i sprawdź resety
    if (!gameState.missions || !Array.isArray(gameState.missions) || gameState.missions.length === 0) {
        console.log("Brak misji po wczytaniu, inicjalizuję domyślne");
        initDefaultMissions();
    } else {
        // Sprawdź, czy należy zresetować misje dzienne (nowy dzień)
        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split('T')[0];
        
        if (gameState.lastMissionsCheck) {
            const lastCheckDate = new Date(gameState.lastMissionsCheck);
            const lastCheckUTC = new Date(Date.UTC(lastCheckDate.getUTCFullYear(), lastCheckDate.getUTCMonth(), lastCheckDate.getUTCDate())).toISOString().split('T')[0];
            
            if (lastCheckUTC !== todayUTC) {
                console.log("Wykryto nowy dzień przy wczytywaniu gry, resetuję misje dzienne");
                initDefaultMissions();
            }
        } else {
            // Jeśli nie ma zapisanej daty sprawdzenia, zapisz obecną
            gameState.lastMissionsCheck = now.toISOString();
        }
    }

    if (!gameState.weeklyMissions || !Array.isArray(gameState.weeklyMissions) || gameState.weeklyMissions.length === 0) {
        console.log("Brak misji tygodniowych po wczytaniu, inicjalizuję domyślne");
        initDefaultWeeklyMissions();
    } else {
        // Sprawdź, czy należy zresetować misje tygodniowe (po sobocie o północy)
        const now = new Date();
        
        if (gameState.lastWeeklyCheck) {
            const lastCheck = new Date(gameState.lastWeeklyCheck);
            
            // Funkcja pomocnicza: sprawdza czy data jest po ostatniej sobocie o północy UTC
            const isAfterLastSaturdayMidnight = () => {
                // Oblicz datę ostatniej soboty o północy UTC
                const lastSaturdayMidnight = new Date(Date.UTC(
                    now.getUTCFullYear(),
                    now.getUTCMonth(),
                    now.getUTCDate() - ((now.getUTCDay() + 1) % 7), // Cofnij do ostatniej soboty
                    0, 0, 0, 0 // Ustaw czas na północ
                ));
                
                // Sprawdź czy ostatni reset był przed tą datą
                return lastCheck < lastSaturdayMidnight;
            };
            
            // Jeśli minęła sobota o północy od ostatniego sprawdzenia
            if (isAfterLastSaturdayMidnight()) {
                console.log("Wykryto, że minęła sobota o północy przy wczytywaniu gry - resetuję misje tygodniowe");
                initDefaultWeeklyMissions();
            }
        } else {
            // Jeśli nie ma zapisanej daty sprawdzenia, zapisz obecną
            gameState.lastWeeklyCheck = now.toISOString();
        }
    }
    
    // ZMIANA: Sprawdź poprawność lokacji po wszystkich operacjach
    if (!gameState.locations || !gameState.locations.unlockedLocations) {
        console.error("BŁĄD KRYTYCZNY: Brak informacji o lokacjach po wczytaniu!");
        
        // Napraw awaryjnie
        gameState.locations = gameState.locations || {};
        gameState.locations.unlockedLocations = gameState.locations.unlockedLocations || {
            park: true,
            lake: false
        };
        
        // DODANE: Sprawdź dodatkowy zapis lokacji
        if (locationsBackup && locationsBackup.unlockedLocations) {
            console.log("NAPRAWA: Przywracam dane lokacji z dodatkowego zapisu");
            gameState.locations.unlockedLocations = {...locationsBackup.unlockedLocations};
        }
    } else {
        // DODANE: Dodatkowe sprawdzenie stanu lokacji lake
        console.log("WERYFIKACJA: Stan lokacji lake po wszystkich operacjach:", 
                   gameState.locations.unlockedLocations.lake);
        
        // Sprawdź, czy stan lokacji lake w głównym obiekcie zgadza się z dodatkowym zapisem
        if (locationsBackup && locationsBackup.unlockedLocations) {
            if (locationsBackup.unlockedLocations.lake === true && 
                gameState.locations.unlockedLocations.lake !== true) {
                console.log("OSTATECZNA KOREKTA: Lokacja lake powinna być odblokowana - przywracam");
                gameState.locations.unlockedLocations.lake = true;
            }
        }
    }
    
    console.log("Kończenie wczytywania - odblokowane lokacje:", gameState.locations.unlockedLocations);
    
    // Spróbuj wygenerować ptaki w pustych slotach aktualnej lokacji
    const currentLocation = gameState.locations.currentLocation;
    
    if (gameState.locationSlots && gameState.locationSlots[currentLocation]) {
        gameState.locationSlots[currentLocation].forEach((slot, index) => {
            if (!slot.isActive && gameState.locationUnlockedSlots[currentLocation][index]) {
                trySpawnBirdInSlot(index, currentLocation);
            }
        });
    }
    
    // Aktualizuj UI po załadowaniu
    updateUI();
    
    // Jeśli moduł hodowli jest aktywny, zaktualizuj UI ptaka
    if (typeof updatePetBirdUI === 'function') {
        updatePetBirdUI();
    }

    // Zastosuj dekoracje dla bieżącej lokacji po wczytaniu gry
if (typeof applyDecorations === 'function' && gameState && gameState.locations) {
    console.log("Stosowanie dekoracji po wczytaniu gry dla lokacji:", gameState.locations.currentLocation);
    applyDecorations(gameState.locations.currentLocation);
}
    
    // Wywołaj funkcje UI po załadowaniu
    if (typeof updateMissionsUI === 'function') {
        updateMissionsUI();
    }
    
    // Aktualizuj przycisk bonusu dziennego
    if (typeof updateDailyBonusButton === 'function') {
        updateDailyBonusButton();
    }
    
    // Aktualizuj misję bonusową przy starcie
    setTimeout(function() {
        if (typeof updateBonusMission === 'function') {
            updateBonusMission();
        }
    }, 1000);
    
    // Aktualizuj znacznik misji po załadowaniu
    updateMissionBadge();
    
    // ZMIANA: Zapisz stan po wczytaniu, aby upewnić się, że wszystkie migracje są zapisane
    saveGame();
    
    // Wyemituj zdarzenie załadowania gry dla innych modułów
    const gameLoadedEvent = new Event('gameLoaded');
    document.dispatchEvent(gameLoadedEvent);
}









function initDefaultMissions() {
    console.log("=== INICJALIZACJA DOMYŚLNYCH MISJI ===");
    
    // Upewnij się, że gameState.missions istnieje
    if (!gameState.missions) {
        gameState.missions = [];
    }
    
    // Sprawdź datę ostatniej inicjalizacji misji
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split('T')[0];
    
    // Jeśli sprawdziliśmy już dzisiaj i mamy misje, nie inicjalizuj ponownie
    if (gameState.lastMissionsCheck === todayUTC && gameState.missions.length > 0) {
        console.log("Misje już zostały zainicjalizowane dzisiaj");
        return;
    }
    
    // Zapisz datę sprawdzenia
    gameState.lastMissionsCheck = todayUTC;
    
    // Oblicz poziom gracza
    const playerLevel = gameState.player.level || 1;
    
    // Stwórz nowe misje
    const newMissions = [
        { 
            type: 'collectSeeds', 
            title: t('missions.collectSeeds', {amount: 30 + playerLevel * 10}), 
            progress: 0, 
            target: 30 + playerLevel * 10, 
            reward: 5 + playerLevel, 
            completed: false, 
            rewarded: false, 
            date: now.toISOString() 
        },
        { 
            type: 'feedBirds', 
            title: t('missions.feedBirds', {amount: 2 + Math.floor(playerLevel/2)}), 
            progress: 0, 
            target: 2 + Math.floor(playerLevel/2), 
            reward: 8 + playerLevel, 
            completed: false, 
            rewarded: false, 
            date: now.toISOString() 
        },
        { 
            type: 'scareBirds', 
            title: t('missions.scareBirds', {amount: 3 + Math.floor(playerLevel/2)}), 
            progress: 0, 
            target: 3 + Math.floor(playerLevel/2), 
            reward: 10 + playerLevel, 
            completed: false, 
            rewarded: false, 
            date: now.toISOString() 
        },
        { 
            type: 'autoCollect', 
            title: t('missions.autoCollect', {amount: 5 + playerLevel}), 
            progress: 0, 
            target: 5 + playerLevel, 
            reward: 12 + playerLevel, 
            completed: false, 
            rewarded: false, 
            date: now.toISOString() 
        },
        { 
            type: 'dailyBonus', 
            title: t('missions.dailyBonus'), 
            progress: 0, 
            target: 4, 
            reward: 25 + playerLevel * 2, 
            completed: false, 
            rewarded: false, 
            date: now.toISOString(), 
            isBonus: true 
        }
    ];
    
    // Wpisz nowe misje do gameState
    gameState.missions = newMissions;
    
    console.log("Zainicjalizowano misje dzienne:", gameState.missions);
    console.log("Liczba misji:", gameState.missions.length);
    
    // Zapisz stan gry
    if (typeof saveGame === 'function') {
        saveGame();
    }
    
    // Pokazuj powiadomienie o nowych misjach
    if (typeof showNotification === 'function') {
        showNotification(t('missions.newMissionsAvailable'));
    }
    
    // Aktualizuj znacznik misji
    if (typeof updateMissionBadge === 'function') {
        updateMissionBadge();
    }
}






// Funkcja zapisująca stan gry
function saveGame() {


    ensureCoinPrecision();

    gameState.lastSaveTime = Date.now(); // Dodaj znacznik czasu ostatniego zapisu
    
    // Sprawdzenie poprawności obiektu locations przed zapisem
    if (!gameState.locations) {
        console.error("UWAGA: Brak obiektu locations przed zapisem! Tworzę nowy.");
        gameState.locations = {
            currentLocation: "park",
            unlockedLocations: {
                park: true,
                lake: false
            }
        };
    }
    
    if (!gameState.locations.unlockedLocations) {
        console.error("UWAGA: Brak właściwości unlockedLocations przed zapisem! Tworzę nową.");
        gameState.locations.unlockedLocations = {
            park: true,
            lake: false
        };
    }
    
    // DODANE: Dodatkowe sprawdzenie specjalnie dla lokacji lake
    if (gameState.locations && gameState.locations.unlockedLocations) {
        const lakeLockState = gameState.locations.unlockedLocations.lake;
        console.log("Zapisywanie stanu gry - Stan LAKE przed zapisem:", lakeLockState);
    }
    
    // Dodatkowe logowanie przed zapisem
    console.log("Zapisuję stan gry. Stan odblokowanych lokacji przed zapisem:", gameState.locations.unlockedLocations);
    
    // Zapisz kopię obiektu, a nie referencję, aby uniknąć błędów z circular references
    const gameStateToSave = JSON.parse(JSON.stringify(gameState));
    
    try {
        // Użyj try-catch, aby przechwycić ewentualne błędy podczas zapisywania
        const gameStateString = JSON.stringify(gameStateToSave);
        localStorage.setItem('dziubCoinsGame', gameStateString);
        
        // DODANE: Dodatkowy zapis tylko informacji o lokacjach jako zabezpieczenie
        if (gameStateToSave.locations && gameStateToSave.locations.unlockedLocations) {
            localStorage.setItem('dziubCoins_locations', JSON.stringify({
                currentLocation: gameStateToSave.locations.currentLocation,
                unlockedLocations: gameStateToSave.locations.unlockedLocations
            }));
            console.log("Zapisano dodatkową kopię informacji o lokacjach");
        }
        
        // Dodatkowe sprawdzenie po zapisie
        const savedState = localStorage.getItem('dziubCoinsGame');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                
                // Weryfikuj, czy odblokowane lokacje zostały poprawnie zapisane
                if (parsedState.locations && parsedState.locations.unlockedLocations) {
                    console.log("Zapis pomyślny. Odblokowane lokacje w zapisanym stanie:", parsedState.locations.unlockedLocations);
                    
                    // Sprawdź, czy wszystkie zmiany zostały zapisane
                    let allSaved = true;
                    Object.keys(gameState.locations.unlockedLocations).forEach(locId => {
                        if (gameState.locations.unlockedLocations[locId] !== parsedState.locations.unlockedLocations[locId]) {
                            console.error(`Błąd: Lokacja ${locId} ma inny stan w zapisie (${parsedState.locations.unlockedLocations[locId]}) niż w pamięci (${gameState.locations.unlockedLocations[locId]})`);
                            allSaved = false;
                        }
                    });
                    
                    // DODANE: Specjalne sprawdzenie dla lokacji lake
                    if (gameState.locations.unlockedLocations.lake === true && 
                        (!parsedState.locations.unlockedLocations.lake || 
                         parsedState.locations.unlockedLocations.lake !== true)) {
                        console.error("KRYTYCZNY BŁĄD: Lokacja LAKE nie została zapisana poprawnie!");
                        
                        // Spróbuj naprawić zapis
                        try {
                            parsedState.locations.unlockedLocations.lake = true;
                            localStorage.setItem('dziubCoinsGame', JSON.stringify(parsedState));
                            console.log("Wykonano naprawę zapisu LAKE");
                            
                            // Dodatkowy zapis informacji o lokacjach jako zabezpieczenie
                            localStorage.setItem('dziubCoins_locations', JSON.stringify({
                                currentLocation: parsedState.locations.currentLocation,
                                unlockedLocations: parsedState.locations.unlockedLocations
                            }));
                        } catch (repairErr) {
                            console.error("Błąd podczas naprawy zapisu LAKE:", repairErr);
                        }
                    }
                    
                    if (allSaved) {
                        console.log("Wszystkie odblokowane lokacje zapisane poprawnie.");
                    }
                } else {
                    console.error("Błąd: Zapisany stan nie zawiera informacji o odblokowanych lokacjach!");
                    
                    // DODANE: Próba naprawy brakujących informacji o lokacjach
                    if (gameState.locations && gameState.locations.unlockedLocations) {
                        try {
                            parsedState.locations = {
                                currentLocation: gameState.locations.currentLocation,
                                unlockedLocations: {...gameState.locations.unlockedLocations}
                            };
                            localStorage.setItem('dziubCoinsGame', JSON.stringify(parsedState));
                            console.log("Naprawiono brakujące informacje o lokacjach w zapisie");
                        } catch (repairErr) {
                            console.error("Błąd podczas naprawy brakujących informacji o lokacjach:", repairErr);
                        }
                    }
                }
            } catch (e) {
                console.error("Błąd parsowania zapisanego stanu:", e);
            }
        } else {
            console.error("Błąd: Nie można odczytać zapisanego stanu!");
        }
    } catch (err) {
        console.error("Błąd podczas zapisywania stanu gry:", err);
        
        // Próba awaryjnego zapisu bez circular references
        try {
            const simpleState = JSON.stringify(gameStateToSave, (key, value) => {
                // Pomiń funkcje i circular references
                return (typeof value === 'function') ? undefined : value;
            });
            
            localStorage.setItem('dziubCoinsGame', simpleState);
            console.log("Wykonano awaryjny zapis gry");
            
            // DODANE: Dodatkowy awaryjny zapis tylko informacji o lokacjach
            if (gameStateToSave.locations && gameStateToSave.locations.unlockedLocations) {
                localStorage.setItem('dziubCoins_locations', JSON.stringify({
                    currentLocation: gameStateToSave.locations.currentLocation,
                    unlockedLocations: gameStateToSave.locations.unlockedLocations
                }));
                console.log("Wykonano awaryjny zapis informacji o lokacjach");
            }
        } catch (backupErr) {
            console.error("Nawet awaryjny zapis nie zadziałał:", backupErr);
            
            // Ostateczna próba - zapisz tylko najważniejsze elementy stanu
            try {
                const minimalState = {
                    resources: gameState.resources,
                    player: gameState.player,
                    locations: {
                        currentLocation: gameState.locations.currentLocation,
                        unlockedLocations: gameState.locations.unlockedLocations
                    }
                };
                
                localStorage.setItem('dziubCoinsGame_minimal', JSON.stringify(minimalState));
                console.log("Wykonano minimalny awaryjny zapis gry");
                
                // DODANE: Dodatkowy minimalny zapis informacji o lokacjach
                localStorage.setItem('dziubCoins_locations', JSON.stringify({
                    currentLocation: gameState.locations.currentLocation,
                    unlockedLocations: gameState.locations.unlockedLocations
                }));
                console.log("Wykonano minimalny awaryjny zapis informacji o lokacjach");
            } catch (minimalErr) {
                console.error("Wszystkie próby zapisu zawiodły:", minimalErr);
            }
        }
    }
}


// Funkcja pomocnicza zapewniająca, że DziubCoiny są przechowywane z precyzją
function ensureCoinPrecision() {
    // Upewnij się, że monety są przechowywane z jednym miejscem po przecinku
    if (typeof gameState.resources.coins === 'number') {
        gameState.resources.coins = parseFloat(gameState.resources.coins.toFixed(1));
    }
}






// Eksportujemy funkcję globalnie
window.saveGame = saveGame;









// Funkcja pokazująca animację nagrody
function showRewardAnimation(text, element) {
    if (!element) return;
    
    const animation = document.createElement('div');
    animation.className = 'reward-animation';
    
    // Rozdziel tekst na części (np. "+10" i typ nagrody)
    const parts = text.match(/([+\-]?\d+[,.]?\d*)\s*(.*)/);
    
    if (parts) {
        const amount = parts[1];
        const type = parts[2].trim();
        
        // Sprawdź typ nagrody i utwórz odpowiednią zawartość
        let iconHtml = '';
        
        if (type === '💰' || type.includes(t('resources.coins')) || type.includes(t('resources.coinsIcon'))) {
            // DziubCoiny
            iconHtml = `<img src="assets/images/coin-icon.png" class="coin-icon" alt="${t('resources.coinsIcon')}">`;
        } else if (type.includes(t('resources.seeds')) || type.includes(t('resources.seedsIcon'))) {
            // Ziarenka
            iconHtml = `<img src="assets/images/seed-icon.png" class="coin-icon" alt="${t('resources.seedsIcon')}">`;
        } else if (type.includes(t('resources.fruits')) || type.includes(t('resources.fruitsIcon'))) {
            // Owoce
            iconHtml = `<img src="assets/images/fruit-icon.png" class="coin-icon" alt="${t('resources.fruitsIcon')}">`;
        } else if (type.includes('TON')) {
            // TON
            iconHtml = `<img src="assets/images/ton-icon.png" class="coin-icon" alt="${t('resources.tonIcon')}">`;
        } else {
            // Domyślnie - DziubCoiny
            iconHtml = `<img src="assets/images/coin-icon.png" class="coin-icon" alt="${t('resources.coinsIcon')}">`;
        }
        
        animation.innerHTML = `<span>${amount}</span>${iconHtml}`;
    } else {
        // Jeśli nie udało się sparsować tekstu, wyświetl oryginalny
        animation.textContent = text;
    }
    
    // Pozycjonuj animację nad elementem
    const rect = element.getBoundingClientRect();
    animation.style.position = 'fixed';
    animation.style.left = rect.left + rect.width / 2 + 'px';
    animation.style.top = rect.top + 'px';
    animation.style.transform = 'translate(-50%, -50%)';
    animation.style.zIndex = '1000';
    
    document.body.appendChild(animation);
    
    // Usuń element po zakończeniu animacji
    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 1500);
}









// Funkcja pokazująca animację nagrody TON
function showTonRewardAnimation(amount, element) {
    if (!element) return;
    
    // Utwórz element animacji
    const animation = document.createElement('div');
    animation.className = 'ton-reward-animation'; // Użyj dedykowanej klasy
    animation.innerHTML = `<span>+${amount}</span> <img src="assets/images/ton-icon.png" style="width: 24px; height: 24px; vertical-align: middle; margin-left: 5px;">`;
    animation.style.color = '#0088CC'; // Kolor TON - niebieski
    animation.style.fontWeight = 'bold';
    animation.style.fontSize = '24px';
    animation.style.textShadow = '0 0 5px rgba(0, 136, 204, 0.7)'; // Lekki blur dla lepszej widoczności
    
    // Pozycjonuj animację nad elementem
    const rect = element.getBoundingClientRect();
    animation.style.position = 'fixed';
    animation.style.left = rect.left + rect.width / 2 + 'px';
    animation.style.top = rect.top + 'px';
    animation.style.transform = 'translate(-50%, -50%)';
    animation.style.zIndex = '1001'; // Wyższa wartość dla lepszej widoczności
    
    // Dodaj element do DOM
    document.body.appendChild(animation);
    
    // Wymuszenie natychmiastowej aktualizacji UI
    requestAnimationFrame(() => {
        document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton || 0.000, 3, true);
    });
    
    // Usuń element po zakończeniu animacji
    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 2000);




    
    // Wymuszenie aktualizacji UI natychmiast
    if (typeof updateResourceCountersImmediately === 'function') {
        updateResourceCountersImmediately();
    } else {
        // Użyj requestAnimationFrame do wymuszenia aktualizacji
        requestAnimationFrame(() => {
            document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton, 3, true);
        });
    }
}


// Inicjalizacja gry przy starcie
window.addEventListener('DOMContentLoaded', () => {
    console.log("Inicjalizacja game.js");
    
    // Załaduj zapisaną grę
    loadGame();

    // Inicjalizacja ptaków we wszystkich lokacjach
setTimeout(() => {
    if (typeof initializeAllLocations === 'function') {
        initializeAllLocations();
        console.log("Zainicjalizowano ptaki we wszystkich lokacjach");
    } else {
        console.error("Funkcja initializeAllLocations nie jest dostępna!");
    }
}, 1500);
    
    // Aktualizuj znacznik misji
    updateMissionBadge();
    
    // Uruchom aktualizację stanu gry co sekundę
    setInterval(updateGameState, 1000);


    // Co sekundę aktualizuj statystyki ptaka
setInterval(() => {
    if (typeof updatePetStats === 'function') {
        updatePetStats();
    }
}, 1000);



// Regularnie aktualizuj przyciski akcji dla wszystkich lokacji
setInterval(() => {
    if (typeof updateAllActionButtons === 'function') {
        updateAllActionButtons();
    }
}, 3000); // Co 3 sekund


    
    // Dodaj dodatkowy timeout dla reinicjalizacji slotów
    setTimeout(() => {
        setupBirdSlots();
        console.log("Reinicjalizacja slotów ptaków");
        
        // Dodatkowe sprawdzenie i próba naprawy odblokowanych slotów
        gameState.unlockedSlots.forEach((isUnlocked, slotIndex) => {
            if (isUnlocked) {
                const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
                if (slotElement) {
                    console.log(`Sprawdzanie odblokowanego slotu ${slotIndex}`);
                    
                    // Upewnij się, że slot nie ma klasy locked
                    slotElement.classList.remove('locked');
                    
                    // Ukryj elementy odblokowania
                    const lockIcon = slotElement.querySelector('.lock-icon');
                    const unlockButton = slotElement.querySelector('.unlock-button');
                    const unlockText = slotElement.querySelector('p');
                    
                    if (lockIcon) lockIcon.style.display = 'none';
                    if (unlockButton) unlockButton.style.display = 'none';
                    if (unlockText) unlockText.style.display = 'none';
                    
                    // Jeśli slot jest pusty, spróbuj wygenerować ptaka
                    const slot = gameState.birdSlots[slotIndex];
                    if (!slot.isActive) {
                        console.log(`Próba naprawy slotu ${slotIndex} - generowanie ptaka`);
                        trySpawnBirdInSlot(slotIndex);
                    }
                    
                    // Aktualizuj UI
                    updateBirdSlotUI(slotElement, slotIndex);
                }
            }
        });
    }, 500);
    
    // Dodaj dodatkowy timeout dla reinicjalizacji misji i osiągnięć
    setTimeout(() => {
        console.log("Ponowna inicjalizacja misji i osiągnięć");
        
        // Upewnij się, że misje są zainicjalizowane
        if (!gameState.missions || !Array.isArray(gameState.missions) || gameState.missions.length === 0) {
            initDefaultMissions();
        }
        
        
        // Zaktualizuj UI
        if (typeof updateMissionsUI === 'function') {
            updateMissionsUI();
        }
        

        
        // Aktualizuj misję bonusową na początku
        if (typeof updateBonusMission === 'function') {
            updateBonusMission();
        }
        
        // Aktualizuj znacznik misji
        updateMissionBadge();
    }, 1000);





// Aktualizuj statystyki ptaka co sekundę
if (typeof updatePetStats === 'function') {
    setInterval(updatePetStats, 1000);
} else {
    console.error("updatePetStats nie jest dostępne!");
}



});



function initDefaultWeeklyMissions() {
    console.log("=== INICJALIZACJA DOMYŚLNYCH MISJI TYGODNIOWYCH ===");
    
    // Upewnij się, że gameState.weeklyMissions istnieje
    if (!gameState.weeklyMissions) {
        gameState.weeklyMissions = [];
    }
    
    // Aktualna data w UTC
    const now = new Date();
    let shouldResetMissions = false;
    
    // Sprawdzenie, czy mamy zapisaną datę ostatniego sprawdzenia
    if (gameState.lastWeeklyCheck) {
        const lastCheck = new Date(gameState.lastWeeklyCheck);
        
        // Funkcja pomocnicza: sprawdza czy data jest po ostatniej sobocie o północy UTC
        const isAfterLastSaturdayMidnight = () => {
            const lastSaturdayMidnight = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - ((now.getUTCDay() + 1) % 7),
                0, 0, 0, 0
            ));
            
            return lastCheck < lastSaturdayMidnight;
        };
        
        // Jeśli minęła sobota o północy
        if (isAfterLastSaturdayMidnight()) {
            console.log("Minęła sobota o północy - resetuję misje tygodniowe");
            shouldResetMissions = true;
        } else {
            // Jeśli mamy już misje tygodniowe, nie resetuj
            if (gameState.weeklyMissions.length > 0) {
                console.log("Misje tygodniowe już istnieją, nie resetuję");
                return;
            }
        }
    } else {
        // Jeśli nie ma zapisanej daty, inicjalizuj nowe misje
        console.log("Brak zapisanej daty - inicjalizuję nowe misje tygodniowe");
        shouldResetMissions = true;
    }
    
    // Jeśli nie ma misji tygodniowych, inicjalizujemy nowe
    if (gameState.weeklyMissions.length === 0) {
        shouldResetMissions = true;
    }
    
    // Tylko jeśli powinniśmy zresetować misje
    if (shouldResetMissions) {
        gameState.lastWeeklyCheck = now.toISOString();
        console.log("Ustawiono lastWeeklyCheck na:", gameState.lastWeeklyCheck);
        
        const playerLevel = gameState.player.level || 1;
        
        const newWeeklyMissions = [
            { 
                type: 'unlockSlots', 
                title: t('missions.weekly.unlockSlots.title'), 
                description: t('missions.weekly.unlockSlots.description'),
                progress: 0, 
                target: 1, 
                reward: 50 + playerLevel * 5, 
                completed: false, 
                rewarded: false,
                date: now.toISOString(),
                isWeekly: true
            },
            { 
                type: 'feedEpicBirds', 
                title: t('missions.weekly.feedEpicBirds.title', {amount: 3 + Math.floor(playerLevel/2)}), 
                description: t('missions.weekly.feedEpicBirds.description', {amount: 3 + Math.floor(playerLevel/2)}),
                progress: 0, 
                target: 3 + Math.floor(playerLevel/2), 
                reward: 35 + playerLevel * 3, 
                completed: false, 
                rewarded: false,
                date: now.toISOString(),
                isWeekly: true
            },
            { 
                type: 'collectCurrency', 
                title: t('missions.weekly.collectCurrency.title', {amount: 50 + playerLevel * 5}), 
                description: t('missions.weekly.collectCurrency.description', {amount: 50 + playerLevel * 5}),
                progress: 0, 
                target: 50 + playerLevel * 5, 
                reward: 25 + playerLevel * 2, 
                completed: false, 
                rewarded: false,
                date: now.toISOString(),
                isWeekly: true
            },
            { 
                type: 'completeDailyMissions', 
                title: t('missions.weekly.completeDailyMissions.title'), 
                description: t('missions.weekly.completeDailyMissions.description'),
                progress: 0, 
                target: 5, 
                reward: 40 + playerLevel * 4, 
                completed: false, 
                rewarded: false,
                date: now.toISOString(),
                isWeekly: true
            }
        ];
        
        gameState.weeklyMissions = newWeeklyMissions;
        
        console.log("Zainicjalizowano misje tygodniowe:", gameState.weeklyMissions);
        console.log("Liczba misji tygodniowych:", gameState.weeklyMissions.length);
        
        // Zapisz stan gry
        if (typeof saveGame === 'function') {
            saveGame();
        }
        
        // Pokazuj powiadomienie o nowych misjach tygodniowych
        if (typeof showNotification === 'function') {
            showNotification(t('missions.newWeeklyMissionsAvailable'));
        }
    }
}





// Funkcja aktualizująca postęp misji tygodniowych
function updateWeeklyMissionProgress(missionType, amount) {
    console.log(`Aktualizacja postępu misji tygodniowej: ${missionType}, +${amount}`);
    
    // Sprawdź czy misje tygodniowe istnieją
    if (!gameState.weeklyMissions || !Array.isArray(gameState.weeklyMissions)) {
        console.warn("Brak misji tygodniowych, inicjalizuję domyślne");
        initDefaultWeeklyMissions();
    }
    
    // Sprawdź wszystkie misje tygodniowe tego typu
    let updated = false;
    
    gameState.weeklyMissions.forEach(mission => {
        if (mission.type === missionType && !mission.completed) {
            mission.progress += amount;
            console.log(`Zaktualizowano postęp misji tygodniowej "${mission.title}": ${mission.progress}/${mission.target}`);
            
            // Sprawdź czy misja została ukończona
            if (mission.progress >= mission.target) {
                mission.progress = mission.target;
                mission.completed = true;
                
                // Upewnij się, że pole rewarded istnieje i jest ustawione na false
                if (mission.rewarded === undefined) {
                    mission.rewarded = false;
                }
                
                console.log(`Misja tygodniowa "${mission.title}" została ukończona, oczekuje na odebranie nagrody`);
                
                // Powiadom gracza
                showNotification(t('missions.completed', {title: mission.title}));
                
                updated = true;
            }
        }
    });
    
   // Aktualizuj UI misji natychmiast
    if (typeof updateMissionsUI === 'function') {
        updateMissionsUI();
    }
    
    // Aktualizuj badge dla misji
    updateMissionBadge();
    
    saveGame();
}












// Funkcja do odbierania nagrody za ukończoną misję tygodniową
window.claimWeeklyMissionReward = function(missionIndex) {
    console.log(`Próba odebrania nagrody za misję tygodniową o indeksie: ${missionIndex}`);
    
    // Sprawdź poprawność indeksu
    if (missionIndex < 0 || missionIndex >= gameState.weeklyMissions.length) {
        console.error(`Nieprawidłowy indeks misji tygodniowej: ${missionIndex}`);
        return false;
    }
    
    // Pobierz misję z tablicy
    const mission = gameState.weeklyMissions[missionIndex];
    console.log("Misja tygodniowa do odebrania:", mission);
    
    // Sprawdź, czy misja jest zakończona i nagroda nie została jeszcze odebrana
    if (mission.completed && mission.rewarded !== true) {
        console.log("Misja tygodniowa kwalifikuje się do odebrania nagrody");
        
        // Przyznaj nagrodę
        gameState.resources.coins += mission.reward;
        console.log(`Dodano ${mission.reward} monet, nowy stan: ${gameState.resources.coins}`);
        
        // Dodaj XP za ukończenie misji tygodniowej (więcej niż za dzienną)
        addExperience(10);
        
        // Oznacz, że nagroda została odebrana
        mission.rewarded = true;
        
        // Powiadom gracza
        showNotification(t('missions.weeklyRewardClaimed'));
        
        // Spróbuj pokazać animację
        const button = document.querySelector(`.weekly-mission-item[data-index="${missionIndex}"] .claim-reward-button`);
        
        if (button) {
            console.log("Znaleziono przycisk do animacji");
            showRewardAnimation(`+${mission.reward} ${t('resources.coins')}`, button);
        }
        
        // Aktualizuj UI
        updateUI();
        if (typeof updateMissionsUI === 'function') {
            updateMissionsUI();
        }
        
         // Aktualizuj znacznik misji po odebraniu nagrody - upewnij się, że funkcja istnieje
    if (typeof updateMissionBadge === 'function') {
        updateMissionBadge();
    }
        
        // Zapisz stan gry
        saveGame();
        
        console.log("Nagroda za misję tygodniową odebrana pomyślnie");
        return true;
    } else {
        console.warn("Misja tygodniowa nie kwalifikuje się do odebrania nagrody:", 
                     "completed =", mission.completed, 
                     "rewarded =", mission.rewarded);
        return false;
    }
};






// Aktualizacja funkcji updateMissionProgress aby uwzględniać misje tygodniowe
function updateMissionProgress(missionType, amount) {
    console.log(`Aktualizacja postępu misji: ${missionType}, +${amount}`);
    
    // Sprawdź czy misje istnieją
    if (!gameState.missions || !Array.isArray(gameState.missions)) {
        console.warn("Brak misji, inicjalizuję domyślne");
        initDefaultMissions();
    }
    
    // Sprawdź wszystkie misje tego typu
    let updated = false;
    
    gameState.missions.forEach(mission => {
        if (mission.type === missionType && !mission.completed) {
            mission.progress += amount;
            console.log(`Zaktualizowano postęp misji "${mission.title}": ${mission.progress}/${mission.target}`);
            
            // Sprawdź czy misja została ukończona
            if (mission.progress >= mission.target) {
                mission.progress = mission.target;
                mission.completed = true;
                
                // Upewnij się, że pole rewarded istnieje i jest ustawione na false
                if (mission.rewarded === undefined) {
                    mission.rewarded = false;
                }
                
                console.log(`Misja "${mission.title}" została ukończona, oczekuje na odebranie nagrody`);
                
                // Powiadom gracza
                showNotification(t('missions.completed', {title: mission.title}));
                
                updated = true;
                
                // Jeśli ukończono dzienną misję, aktualizuj również postęp misji tygodniowej o typie completeDailyMissions
                updateWeeklyMissionProgress('completeDailyMissions', 1);
            }
        }
    });
    
    // Aktualizuj UI misji
    if (updated && typeof updateMissionsUI === 'function') {
        updateMissionsUI();
    }
    

   // Dodaj po aktualizacji UI misji:
if (typeof updateMissionBadge === 'function') {
    updateMissionBadge();
    console.log("FORCE-UPDATE: Aktualizacja badge po aktualizacji postępu misji");
}



    saveGame();
    
    // Osiągnięcia zostały usunięte - nie ma potrzeby aktualizacji
    
    // Sprawdź misje tygodniowe dotyczące tego typu
    updateWeeklyMissionProgress(missionType, amount);
}

// Zmodyfikowana funkcja updateMissionBadge
function updateMissionBadge() {
    const badge = document.getElementById('missions-badge');
    if (!badge) return;
    
    // Sprawdź, czy są jakiekolwiek misje (dzienne lub tygodniowe) do odebrania
    const hasDailyClaimable = gameState.missions && gameState.missions.some(m => m.completed && !m.rewarded);
    const hasWeeklyClaimable = gameState.weeklyMissions && gameState.weeklyMissions.some(m => m.completed && !m.rewarded);
    
    badge.style.display = (hasDailyClaimable || hasWeeklyClaimable) ? 'block' : 'none';
}

// Dodaj obsługę zbierania DziubCoinów do misji tygodniowych
// Rozszerz funkcję collectBirdReward
function collectBirdReward(slotIndex) {
    console.log("Próba zebrania nagrody w slocie:", slotIndex);
    
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    const slot = gameState.birdSlots[slotIndex];
    if (!slot.needsCollection) return 0;
    
    // Oblicz nagrodę
    const reward = gameState.birdRewards[slot.birdType];
    
 // Dodaj monety, ale tylko jeśli to nie jest mityczny ptak
if (slot.birdType !== 'mythical') {
    gameState.resources.coins += reward;
    gameState.stats.totalCoinsEarned += reward;
}
    
    // Resetuj slot
    slot.needsCollection = false;
    slot.isActive = false;
    slot.birdType = null;
    
    // Aktualizuj misję tygodniową collectCurrency
    updateWeeklyMissionProgress('collectCurrency', reward);
    
    // Po 3 sekundach spróbuj wygenerować nowego ptaka
    setTimeout(() => {
        trySpawnBirdInSlot(slotIndex);
        
        // Aktualizuj UI slotu
        const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
        if (slotElement) {
            updateBirdSlotUI(slotElement, slotIndex);
        }
    }, 3000);
    
    // Aktualizuj UI slotu natychmiast po odebraniu nagrody
    const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
    if (slotElement) {
        updateBirdSlotUI(slotElement, slotIndex);
    }
    
    updateUI();
    saveGame();
    
    return reward;
}

// Modyfikacja funkcji feedBird
function feedBird(slotIndex) {
    console.log("Próba karmienia ptaka w slocie:", slotIndex);
    
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    const slot = gameState.birdSlots[slotIndex];
    
    if (!slot.isActive || slot.isFeeding || slot.needsCollection) {
        console.log("Slot nie spełnia warunków do karmienia:", slot);
        return;
    }
    
    const cost = gameState.birdCosts[slot.birdType];
    
    if (gameState.resources.seeds >= cost) {
        gameState.resources.seeds -= cost;
        slot.isFeeding = true;
        slot.remainingTime = gameState.birdTimes[slot.birdType];
        
        // Aktualizacja postępu misji "Nakarm ptaki"
        updateMissionProgress('feedBirds', 1);

        // Natychmiastowa aktualizacja UI misji
        if (typeof updateMissionsUI === 'function') {
            updateMissionsUI();
        }
        
        // Jeśli ptak jest epickim ptakiem, aktualizuj również misję tygodniową
        if (slot.birdType === 'epic') {
            updateWeeklyMissionProgress('feedEpicBirds', 1);
        }
        
        updateMissionBadge();
        
        // Aktualizacja statystyk
        gameState.stats.totalBirdsFed += 1;
        
        updateUI();
        saveGame();
        
        // Aktualizuj UI slotu z ptakiem
        const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
        if (slotElement) {
            updateBirdSlotUI(slotElement, slotIndex);
        }
        
        return true;
    }
    
    showNotification(t('notifications.notEnoughSeeds'));
    return false;
}

// Modyfikacja funkcji unlockBirdSlot
function unlockBirdSlot(slotIndex) {
    console.log("Próba odblokowania slotu:", slotIndex);
    
    slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
    
    console.log("Stan slotu przed odblokowaniem:", gameState.unlockedSlots[slotIndex]);
    console.log("Dostępne monety:", gameState.resources.coins);
    
    if (gameState.unlockedSlots[slotIndex]) {
        console.log("Slot już odblokowany");
        return false;
    }
    
    // Różne koszty dla różnych slotów
    let unlockCost;
    
    if (slotIndex === 2) {
        unlockCost = 50; // Trzeci slot (index 2) kosztuje 50
    } else if (slotIndex === 3) {
        unlockCost = 200; // Czwarty slot (index 3) kosztuje 200
    } else if (slotIndex === 4) {
        unlockCost = 500; // Piąty slot (index 4) kosztuje 500
    } else {
        unlockCost = 50; // Domyślna wartość dla bezpieczeństwa
    }
    
    if (gameState.resources.coins >= unlockCost) {
        gameState.resources.coins -= unlockCost;
        gameState.unlockedSlots[slotIndex] = true;
        
        console.log("Slot odblokowany pomyślnie!");
        
        // Dodaj XP za odblokowanie
        addExperience(20);
        
        // Pokaż powiadomienie
        showNotification(t('birdSlots.newSlotUnlocked'));
        
        // Aktualizuj postęp misji tygodniowej unlockSlots
        updateWeeklyMissionProgress('unlockSlots', 1);
        
        // Aktualizuj wygląd slotu
        const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
        
        if (slotElement) {
            slotElement.classList.remove('locked');
            
            const lockIcon = slotElement.querySelector('.lock-icon');
            const unlockButton = slotElement.querySelector('.unlock-button');
            const unlockText = slotElement.querySelector('p');
            
            if (lockIcon) lockIcon.style.display = 'none';
            if (unlockButton) unlockButton.style.display = 'none';
            if (unlockText) unlockText.style.display = 'none';
            
            // NAPRAWIONE: Najpierw aktualizujemy UI, potem generujemy ptaka
            updateBirdSlotUI(slotElement, slotIndex);
            
            // ZMODYFIKOWANE: Bardziej szczegółowa reinicjalizacja
            setTimeout(() => {
                // Spróbuj wygenerować ptaka w nowym slocie
                trySpawnBirdInSlot(slotIndex);
                
                // Aktualizuj UI konkretnego slotu po wygenerowaniu ptaka
                updateBirdSlotUI(slotElement, slotIndex);
                
                // Dodatkowe sprawdzenie dla reinicjalizacji przycisków w tym konkretnym slocie
                const feedButton = slotElement.querySelector('.feed-button');
                const scareButton = slotElement.querySelector('.scare-button');
                const collectButton = slotElement.querySelector('.collect-reward-button');
                
                if (feedButton) {
                    feedButton.addEventListener('click', function() {
                        console.log(`Karmienie ptaka w slocie ${slotIndex}`);
                        feedBird(slotIndex);
                    });
                }
                
                if (scareButton) {
                    scareButton.addEventListener('click', function() {
                        console.log(`Przepędzanie ptaka w slocie ${slotIndex}`);
                        scareBird(slotIndex);
                    });
                }
                
                if (collectButton) {
                    collectButton.addEventListener('click', function() {
                        console.log(`Zbieranie nagrody w slocie ${slotIndex}`);
                        collectBirdReward(slotIndex);
                    });
                }
                
                // Reinicjalizacja wszystkich przycisków (dla pewności)
                setupBirdSlots();
                
                console.log("Zaktualizowano stan slotu po odblokowaniu:", gameState.unlockedSlots[slotIndex]);
                console.log("Slot po odblokowaniu:", gameState.birdSlots[slotIndex]);
                
                // Aktualizuj UI jeszcze raz po inicjalizacji przycisków
                updateBirdSlotUI(slotElement, slotIndex);
            }, 300); // Zwiększony timeout dla pewności
        }
        
        updateUI();
        saveGame();
        
        return true;
    }
    
    showNotification(t('notifications.notEnoughCoins'));
    return false;
}






// Funkcja do karmienia wszystkich ptaków w danej lokacji
function feedAllBirds(locationId) {
    console.log(`Przekierowuję do nowej funkcji feedAllBirdsInLocation dla lokacji ${locationId}`);
    
    // Jeśli dostępna jest nowa funkcja, użyj jej
    if (typeof window.feedAllBirdsInLocation === 'function') {
        return window.feedAllBirdsInLocation(locationId);
    }
    
    // W przeciwnym razie użyj starej implementacji dla kompatybilności
    console.log(`Używam starej wersji funkcji feedAllBirds dla lokacji ${locationId}`);
    
    // Sprawdź, czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        showNotification(t('locations.unlockInfo', {location: t(`locations.${locationId}Name`)}));
        return;
    }
    
    // Pobierz sloty dla danej lokacji
    const slots = gameState.locationSlots[locationId];
    if (!slots) {
        console.error(`Nie znaleziono slotów dla lokacji ${locationId}`);
        return;
    }
    
    // Licznik udanych karmień i zużytych ziarenek
    let successfulFeeds = 0;
    let seedsUsed = 0;
    
    // Najpierw sprawdź, ile ziarenek będzie potrzebnych
    let requiredSeeds = 0;
    slots.forEach((slot, index) => {
        if (gameState.locationUnlockedSlots[locationId][index] && 
            slot.isActive && !slot.isFeeding && !slot.needsCollection) {


            // Pobierz koszt karmienia z konfiguracji lokacji
            const cost = gameState.locations.configs[locationId].birdCosts[slot.birdType];
            requiredSeeds += cost;
        }
    });
    
    // Sprawdź, czy mamy wystarczająco ziarenek
    if (requiredSeeds > gameState.resources.seeds) {
        showNotification(t('notifications.notEnoughSeedsForAllBirds', {amount: requiredSeeds}));
        return;
    }
    
    // Karm ptaki
    slots.forEach((slot, index) => {
        if (gameState.locationUnlockedSlots[locationId][index] && 
            slot.isActive && !slot.isFeeding && !slot.needsCollection) {
            // Karm ptaka
            if (feedBird(index, locationId)) {
                successfulFeeds++;
                // Zliczamy użyte ziarenka z tej lokacji
                seedsUsed += gameState.locations.configs[locationId].birdCosts[slot.birdType];
            }
        }
    });
    
    // Pokaż powiadomienie o wyniku
    if (successfulFeeds > 0) {
        showNotification(t('notifications.birdsFeeded', {
            count: successfulFeeds, 
            location: t(`locations.${locationId}Name`), 
            seeds: seedsUsed
        }));
    } else {
        showNotification(t('notifications.noBirdsToFeed', {location: t(`locations.${locationId}Name`)}));
    }
    
    // Zapisz stan gry
    saveGame();
    
    // Aktualizuj wszystkie przyciski akcji
    updateAllActionButtons();
}





// Funkcja do odbierania wszystkich nagród w danej lokacji
function collectAllRewards(locationId) {
    console.log(`Przekierowuję do nowej funkcji collectAllRewardsInLocation dla lokacji ${locationId}`);
    
    // Jeśli dostępna jest nowa funkcja, użyj jej
    if (typeof window.collectAllRewardsInLocation === 'function') {
        return window.collectAllRewardsInLocation(locationId);
    }
    
    // W przeciwnym razie użyj starej implementacji dla kompatybilności
    console.log(`Używam starej wersji funkcji collectAllRewards dla lokacji ${locationId}`);
    
    // Pobierz sloty dla danej lokacji
    const slots = gameState.locationSlots[locationId];
    if (!slots) {
        console.error(`Nie znaleziono slotów dla lokacji ${locationId}`);
        return;
    }
    
    // Licznik odebranych nagród i suma monet
    let successfulCollects = 0;
    let totalCoins = 0;
    
    // Dla każdego slotu spróbuj odebrać nagrodę
    slots.forEach((slot, index) => {
        // Sprawdź, czy slot jest odblokowany
        if (!gameState.locationUnlockedSlots[locationId][index]) {
            return; // Slot zablokowany, przejdź do następnego
        }
        
        // Sprawdź, czy slot ma nagrodę do odebrania
        if (slot.isActive && slot.needsCollection) {
            // Odbierz nagrodę
            const reward = collectBirdReward(index, locationId);
            if (reward > 0) {
                successfulCollects++;
                totalCoins += reward;
            }
        }
    });
    
    // Pokaż powiadomienie o wyniku
    if (successfulCollects > 0) {
        showNotification(t('notifications.rewardsCollected', {count: successfulCollects, coins: totalCoins}));
        
        // Pokaż animację nagrody
        const button = document.querySelector(`.action-all-button[data-location="${locationId}"]`);
        if (button) {
            showRewardAnimation(`+${totalCoins} ${t('resources.coins')}`, button);
        }
    } else {
        showNotification(t('notifications.noRewardsToCollect'));
    }
    
    // Aktualizuj stan przycisków po odbieraniu
    updateAllActionButtons();
}




// Funkcja aktualizująca stan wszystkich przycisków akcji
function updateAllActionButtons() {
    console.log("Aktualizacja wszystkich przycisków akcji");
    
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
        
        // Znajdź przycisk dla tej lokacji
        const button = document.querySelector(`.action-all-button[data-location="${locationId}"]`);
        if (!button) {
            console.log(`Nie znaleziono przycisku akcji dla lokacji ${locationId}`);
            return; // Przycisk nie istnieje, przejdź do następnej lokacji
        }
        
        // Sprawdź stan ptaków w lokacji
        const status = checkLocationStatus(locationId);
        console.log(`Status lokacji ${locationId}:`, status);
        
        // Aktualizuj wygląd i działanie przycisku
        if (status.canFeed) {
            // Są ptaki do karmienia
            button.textContent = t('locations.buttons.feedAll');
            button.setAttribute('data-action', 'feed');
            button.classList.remove('disabled');
            button.style.backgroundColor = "#4CAF50"; // zielony
            button.style.display = 'block';
        } else if (status.canCollect) {
            // Są nagrody do odebrania
            button.textContent = t('locations.buttons.collectAll');
            button.setAttribute('data-action', 'collect');
            button.classList.remove('disabled');
            button.style.backgroundColor = "#4CAF50"; // zielony
            button.style.display = 'block';
        } else {
            // Nie ma nic do zrobienia
            button.textContent = t('locations.buttons.collectAll');
            button.setAttribute('data-action', 'none');
            button.classList.add('disabled');
            button.style.backgroundColor = "#cccccc"; // szary
            button.style.display = 'block';
        }
    });
}








// Funkcja obsługująca kliknięcie przycisku akcji
function handleActionAllButton(event) {
    console.log(`Przekierowuję do nowej funkcji handleLocationActionButton`);
    
    // Jeśli dostępna jest nowa funkcja, użyj jej
    if (typeof window.handleLocationActionButton === 'function') {
        return window.handleLocationActionButton(event);
    }
    
    // W przeciwnym razie użyj starej implementacji dla kompatybilności
    console.log(`Używam starej wersji funkcji handleActionAllButton`);
    
    const button = event.target;
    const locationId = button.getAttribute('data-location');
    const action = button.getAttribute('data-action');
    
    console.log(`Kliknięto przycisk akcji dla lokacji ${locationId}, akcja: ${action}`);
    
    if (!locationId) {
        console.error("Brak atrybutu data-location na przycisku");
        return;
    }
    
    // Sprawdź, czy lokacja jest odblokowana
    if (!gameState.locations.unlockedLocations[locationId]) {
        showNotification(t('locations.unlockInfo', {location: t(`locations.${locationId}Name`)}));
        return;
    }
    
    // Wykonaj odpowiednią akcję
    if (action === 'feed') {
        feedAllBirds(locationId);
    } else if (action === 'collect') {
        collectAllRewards(locationId);
    } else {
        // Akcja 'none' - nic do zrobienia
        const locationName = gameState.locations.configs[locationId]?.name || t(`locations.${locationId}Name`);
        showNotification(t('notifications.allBirdsFeeding', {location: locationName}));
    }
    
    // Ostatecznie zaktualizuj wszystkie przyciski
    setTimeout(() => {
        if (typeof updateAllActionButtons === 'function') {
            updateAllActionButtons();
        }
    }, 500);
}






// Inicjalizacja po zdarzeniu gameLoaded
document.addEventListener('gameLoaded', () => {
    console.log("Zdarzenie gameLoaded wykryte - inicjalizacja lokacji i przycisków");
    
    // Opóźniona inicjalizacja ptaków we wszystkich lokacjach
    setTimeout(() => {
        if (typeof initializeAllLocations === 'function') {
            initializeAllLocations();
        }
    }, 1000);
    
    // Opóźniona aktualizacja wszystkich przycisków akcji
    setTimeout(() => {
        if (typeof updateAllActionButtons === 'function') {
            updateAllActionButtons();
        }
    }, 1500);
});





// Funkcja do szybkiej aktualizacji liczników zasobów
function updateResourceCounters() {
    requestAnimationFrame(() => {
        document.getElementById('seed-count').textContent = gameState.resources.seeds;
        document.getElementById('coin-count').textContent = formatNumber(gameState.resources.coins, 1);
        document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
        document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton || 0.000, 3);
    });
}







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







// Funkcja do natychmiastowej aktualizacji liczników zasobów
function updateResourceCountersImmediately() {
    requestAnimationFrame(() => {
        if (document.getElementById('ton-count')) {
            document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton || 0.000, 3);
        }
        if (document.getElementById('coin-count')) {
            document.getElementById('coin-count').textContent = formatNumber(gameState.resources.coins, 1);
        }
        if (document.getElementById('seed-count')) {
            document.getElementById('seed-count').textContent = gameState.resources.seeds;
        }
        if (document.getElementById('fruit-count')) {
            document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
        }
    });
}








// Upewnij się, że funkcja applyDecorationBonuses jest dostępna globalnie
if (typeof window.applyDecorationBonuses !== 'function') {
    window.applyDecorationBonuses = function(location, value, bonusType) {
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
    };
}




// Funkcja zastosowania bonusów z dekoracji do kosztu karmienia
function applyDecorationBonusesToFeedCost(location, value) {
    // Zaawansowane logowanie dla debugowania
    console.log(`[BONUSY-GAME.JS] Początkowy koszt karmienia: ${value} dla lokacji: ${location}`);
    
    // Sprawdź, czy mamy dekoracje dla tej lokacji
    if (!gameState.decorations?.[location]) {
        console.log(`[BONUSY-GAME.JS] Brak dekoracji dla lokacji ${location}`);
        return value;
    }
    
    // Oblicz całkowity bonus procentowy
    let totalBonusPercent = 0;
    
    Object.keys(gameState.decorations[location]).forEach(decId => {
        const decoration = gameState.decorations[location][decId];
        if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedCost") {
            totalBonusPercent += decoration.bonus.value;
            console.log(`[BONUSY-GAME.JS] Znaleziono dekorację ${decId} z bonusem ${decoration.bonus.value}%`);
        }
    });
    
    // Zastosuj zniżkę do kosztu karmienia
    if (totalBonusPercent > 0) {
        console.log(`[BONUSY-GAME.JS] Całkowity bonus do kosztu karmienia: -${totalBonusPercent}%`);
        let newValue = Math.max(1, Math.floor(value * (1 - totalBonusPercent / 100)));
        console.log(`[BONUSY-GAME.JS] Nowy koszt po zastosowaniu bonusu: ${newValue} (stary: ${value})`);
        return newValue;
    }
    
    return value;
}

// Eksportuj funkcję do globalnego zakresu
window.applyDecorationBonusesToFeedCost = applyDecorationBonusesToFeedCost;







function applyDecorationBonusesToFeedTime(location, value) {
    // Sprawdź, czy mamy dekoracje dla tej lokacji
    if (!gameState.decorations?.[location]) return value;
    
    // Oblicz całkowity bonus procentowy
    let totalBonusPercent = 0;
    
    Object.keys(gameState.decorations[location]).forEach(decId => {
        const decoration = gameState.decorations[location][decId];
        if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedTime") {
            totalBonusPercent += decoration.bonus.value;
        }
    });
    
    // Zastosuj zniżkę do czasu karmienia
    if (totalBonusPercent > 0) {
        console.log(`Bonus do czasu karmienia: -${totalBonusPercent}%`);
        return Math.max(1, Math.floor(value * (1 - totalBonusPercent / 100)));
    }
    
    return value;
}







// Funkcja do zastosowania bonusów z dekoracji do nagród
function applyDecorationBonusesToReward(location, value) {
    console.log(`[REWARD BONUS] Początkowa wartość nagrody: ${value} dla lokacji: ${location}`);
    
    // Sprawdź, czy mamy dekoracje dla tej lokacji
    if (!gameState.decorations?.[location]) {
        console.log(`[REWARD BONUS] Brak dekoracji dla lokacji ${location}`);
        return value;
    }
    
    // Oblicz całkowity bonus procentowy
    let totalBonusPercent = 0;
    
    Object.keys(gameState.decorations[location]).forEach(decId => {
        const decoration = gameState.decorations[location][decId];
        if (decoration.owned && decoration.bonus && decoration.bonus.type === "reward") {
            totalBonusPercent += decoration.bonus.value;
            console.log(`[REWARD BONUS] Znaleziono dekorację ${decId} z bonusem nagrody +${decoration.bonus.value}%`);
        }
    });
    
    // Zastosuj bonus do nagrody
    if (totalBonusPercent > 0) {
        console.log(`[REWARD BONUS] Całkowity bonus do nagrody: +${totalBonusPercent}%`);
        // Zachowaj jedno miejsce po przecinku
        const finalReward = parseFloat((value * (1 + totalBonusPercent / 100)).toFixed(1));
        console.log(`[REWARD BONUS] Nagroda przed bonusem: ${value}, po bonusie: ${finalReward}`);
        return finalReward;
    }
    
    return value;
}

// Dodaj funkcję do globalnego zakresu, aby była dostępna w innych plikach
window.applyDecorationBonusesToReward = applyDecorationBonusesToReward;






// Dodajemy funkcje do globalnego zakresu
window.applyDecorationBonusesToFeedCost = applyDecorationBonusesToFeedCost;
window.applyDecorationBonusesToFeedTime = applyDecorationBonusesToFeedTime;
window.applyDecorationBonusesToReward = applyDecorationBonusesToReward;








// Eksportuj funkcję do globalnego zakresu
window.updateResourceCountersImmediately = updateResourceCountersImmediately;









// Dodajemy funkcję bonusową, która będzie dostępna globalnie i niezależnie od kolejności ładowania skryptów
window.applyDecorationBonusesToFeedCost = function(location, value) {
    console.log(`[GAME.JS] Bezpośrednie wywołanie bonusu kosztu karmienia: ${value} dla lokacji: ${location}`);
    
    // DODANE: Wyświetl szczegóły gameState dla dekoracji
    console.log(`[GAME.JS] Stan gameState.decorations:`, JSON.stringify(gameState.decorations));
    
    // Sprawdź, czy mamy dekoracje dla tej lokacji
    if (!gameState.decorations?.[location]) {
        console.log(`[GAME.JS] Brak dekoracji dla lokacji ${location}`);
        return value;
    }
    
    // DODANE: Szczegółowe sprawdzenie dekoracji dla danej lokacji
    console.log(`[GAME.JS] Dekoracje dla lokacji ${location}:`, JSON.stringify(gameState.decorations[location]));
    
    // Oblicz całkowity bonus procentowy
    let totalBonusPercent = 0;
    
    Object.keys(gameState.decorations[location]).forEach(decId => {
        const decoration = gameState.decorations[location][decId];
        console.log(`[GAME.JS] Sprawdzam dekorację ${decId}:`, decoration);
        
        if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedCost") {
            totalBonusPercent += decoration.bonus.value;
            console.log(`[GAME.JS] Znaleziono dekorację ${decId} z bonusem ${decoration.bonus.value}%`);
        } else if (decoration.owned) {
            console.log(`[GAME.JS] Dekoracja ${decId} jest posiadana, ale nie ma odpowiedniego bonusu`);
        } else {
            console.log(`[GAME.JS] Dekoracja ${decId} nie jest posiadana`);
        }
    });
    
    
    

// Zastosuj zniżkę do kosztu karmienia
    if (totalBonusPercent > 0) {
        console.log(`[GAME.JS] Całkowity bonus do kosztu karmienia: -${totalBonusPercent}%`);
        let newValue = Math.max(1, Math.floor(value * (1 - totalBonusPercent / 100)));
        console.log(`[GAME.JS] Nowy koszt po zastosowaniu bonusu: ${newValue} (stary: ${value})`);
        return newValue;
    }
    
    return value;
};
















// Dodaj funkcję do bezpośredniego testowania karmienia ptaków z bonusami
window.testFeedBird = function(slotIndex) {
    console.log("=== TEST KARMIENIA PTAKA Z BONUSAMI ===");
    const locationId = gameState.locations.currentLocation;
    slotIndex = parseInt(slotIndex, 10) || 0;
    
    // Zapisz aktualną liczbę ziarenek przed testem
    const startingSeeds = gameState.resources.seeds;
    console.log(`Początkowa liczba ziarenek: ${startingSeeds}`);
    
    // Znajdź slot i sprawdź typ ptaka
    const slot = gameState.locationSlots[locationId][slotIndex];
    if (!slot || !slot.isActive) {
        console.log("Błąd: Slot jest pusty lub nieaktywny");
        return false;
    }
    
    // Pobierz koszt karmienia
    const originalCost = gameState.locations.configs[locationId].birdCosts[slot.birdType];
    console.log(`Oryginalny koszt karmienia ptaka typu ${slot.birdType}: ${originalCost}`);
    
    // Wykonaj karmienie
    const result = feedBird(slotIndex, locationId);
    
    // Sprawdź rezultat
    if (result) {
        const seedsAfter = gameState.resources.seeds;
        const seedsUsed = startingSeeds - seedsAfter;
        console.log(`Karmienie udane! Użyto ${seedsUsed} ziarenek`);
        console.log(`Oczekiwano użycia ${originalCost} ziarenek bez bonusu`);
        
        if (seedsUsed < originalCost) {
            console.log(`SUKCES! Bonus działa poprawnie! Zaoszczędzono ${originalCost - seedsUsed} ziarenek`);
        } else {
            console.log(`BŁĄD! Bonus nie działa! Użyto pełnego kosztu ${originalCost} ziarenek`);
        }
    } else {
        console.log("Karmienie nieudane");
    }
    
    console.log("===============================");
    return result;
};




// Funkcja nadpisująca koszt karmienia ptaków dla testów
window.forceFeedDiscount = function() {
    // Nadpisz oryginalną funkcję karmienia
    const originalFeedBird = window.feedBird;
    
    window.feedBird = function(slotIndex, locationId) {
        console.log("WYMUSZONY BONUS: Używam funkcji z wymuszonym bonusem -10%");
        
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
        
        // Dla mitycznych ptaków używamy oryginalnej funkcji
        if (slot.birdType === 'mythical') {
            return originalFeedBird(slotIndex, locationId);
        }
        
        // Pobierz oryginalny koszt karmienia
        const originalCost = locationConfig.birdCosts[slot.birdType];
        console.log(`WYMUSZONY BONUS: Oryginalny koszt karmienia: ${originalCost}`);
        
        // Sprawdź, czy gracz ma ławkę w Parku Miejskim
        let hasBench = false;
        if (gameState.decorations && 
            gameState.decorations.park && 
            gameState.decorations.park.bench && 
            gameState.decorations.park.bench.owned === true) {
            hasBench = true;
        }
        
        // Zastosuj zniżkę, jeśli gracz ma ławkę i jest w parku
        let finalCost = originalCost;
        if (hasBench && locationId === 'park') {
            // WYMUSZENIE ZNIŻKI 10%
            finalCost = Math.max(1, Math.floor(originalCost * 0.9));
            console.log(`WYMUSZONY BONUS: Gracz ma ławkę, stosujemy zniżkę 10%`);
            console.log(`WYMUSZONY BONUS: Nowy koszt po zniżce: ${finalCost}`);
        }
        
        // Sprawdź czy mamy wystarczająco ziarenek
        if (gameState.resources.seeds >= finalCost) {
            // Odejmij ziarenka z zastosowanym bonusem
            gameState.resources.seeds -= finalCost;
            console.log(`WYMUSZONY BONUS: Pobrano ${finalCost} ziarenek (oryginalny koszt: ${originalCost})`);
            
            // Aktualizacja licznika ziarenek
            requestAnimationFrame(() => {
                document.getElementById('seed-count').textContent = gameState.resources.seeds;
            });
            
            // Ustaw ptaka w trybie karmienia
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
    };
    
    // Zaktualizuj UI guzików i slotów
    document.querySelectorAll('.bird-slot').forEach((slot) => {
        const slotIndex = slot.getAttribute('data-slot');
        if (slotIndex !== null) {
            updateBirdSlotUI(slot, slotIndex);
        }
    });
    
    showNotification(t('feeding.forcedFeedDiscount'));
    console.log("Funkcja karmienia nadpisana z wymuszonym bonusem -10%");
    
    return t('feeding.forcedFeedDiscountActivated');
};



// Dodaj funkcję do globalnego zakresu
window.updateResourceCounters = updateResourceCounters;





// Implementacja bezpośrednia funkcji bonusowej zapasowej
window.applyDecorationBonusesToFeedCost = function(location, value) {
    console.log(`[GAME.JS] Bezpośrednie wywołanie bonusu kosztu karmienia: ${value} dla lokacji: ${location}`);
    
    // DODANE: Wyświetl szczegóły gameState dla dekoracji
    console.log(`[GAME.JS] Stan gameState.decorations:`, JSON.stringify(gameState.decorations));
    
    // Sprawdź, czy mamy dekoracje dla tej lokacji
    if (!gameState.decorations?.[location]) {
        console.log(`[GAME.JS] Brak dekoracji dla lokacji ${location}`);
        return value;
    }
    
    // DODANE: Szczegółowe sprawdzenie dekoracji dla danej lokacji
    console.log(`[GAME.JS] Dekoracje dla lokacji ${location}:`, JSON.stringify(gameState.decorations[location]));
    
    // Oblicz całkowity bonus procentowy
    let totalBonusPercent = 0;
    
    Object.keys(gameState.decorations[location]).forEach(decId => {
        const decoration = gameState.decorations[location][decId];
        console.log(`[GAME.JS] Sprawdzam dekorację ${decId}:`, decoration);
        
        if (decoration.owned && decoration.bonus && decoration.bonus.type === "feedCost") {
            totalBonusPercent += decoration.bonus.value;
            console.log(`[GAME.JS] Znaleziono dekorację ${decId} z bonusem ${decoration.bonus.value}%`);
        } else if (decoration.owned) {
            console.log(`[GAME.JS] Dekoracja ${decId} jest posiadana, ale nie ma odpowiedniego bonusu`);
        } else {
            console.log(`[GAME.JS] Dekoracja ${decId} nie jest posiadana`);
        }
    });
    
    // Zastosuj zniżkę do kosztu karmienia
    if (totalBonusPercent > 0) {
        console.log(`[GAME.JS] Całkowity bonus do kosztu karmienia: -${totalBonusPercent}%`);
        let newValue = Math.max(1, Math.floor(value * (1 - totalBonusPercent / 100)));
        console.log(`[GAME.JS] Nowy koszt po zastosowaniu bonusu: ${newValue} (stary: ${value})`);
        return newValue;
    }
    
    return value;
};
    





window.fixFeedButtons = function() {
    console.log("Naprawiam przyciski karmienia z uwzględnieniem bonusów");
    
    // Znajdź wszystkie przyciski karmienia
    document.querySelectorAll('.feed-button').forEach(button => {
        // Usuń stare event listenery
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Dodaj nowy event listener
        newButton.addEventListener('click', function() {
            // Znajdź slot i jego indeks
            const slotElement = this.closest('.bird-slot');
            if (!slotElement) return;
            
            const slotIndex = slotElement.getAttribute('data-slot');
            if (slotIndex === null) return;
            
            const locationId = gameState.locations.currentLocation;
            
            // Pobierz slot i typ ptaka
            const slot = gameState.locationSlots[locationId][slotIndex];
            if (!slot || !slot.isActive || slot.isFeeding || slot.needsCollection) {
                return;
            }
            
            // SPRAWDŹ CZY PTAK JEST MITYCZNY
            if (slot.birdType === 'mythical') {
                console.log("Karmienie mitycznego ptaka - używam owoców zamiast ziarenek");
                
                // Koszt w owocach zależy od lokacji
                let fruitCost = 1; // domyślnie 1 owoc dla parku
                if (locationId === 'lake') {
                    fruitCost = 3; // 3 owoce dla jeziora
                } else if (locationId === 'forest') {
                    fruitCost = 5; // 5 owoców dla lasu
                }
                
                // Sprawdź czy mamy wystarczająco owoców
                if (gameState.resources.fruits >= fruitCost) {
                    // Odejmij owoce
                    gameState.resources.fruits -= fruitCost;
                    
                    // Aktualizacja licznika owoców
                    requestAnimationFrame(() => {
                        document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
                    });
                    
                    // Ustaw ptaka w trybie karmienia
                    slot.isFeeding = true;
                    
                    // Zastosuj bonusy do czasu karmienia również dla mitycznych ptaków
                    let feedTime = gameState.locations.configs[locationId].birdTimes[slot.birdType];
                    
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
                            console.log(`Czas karmienia mitycznego ptaka po bonusach: ${feedTime} (lokacja: ${locationId})`);
                            // Pokaż komunikat o bonusie
                            showNotification(t('feeding.feedingBonus', {bonus: timeBonus}));
                        }
                    }
                    
                    slot.remainingTime = feedTime;
                    
                    // Aktualizacja postępu misji i statystyki
                    updateMissionProgress('feedBirds', 1);
                    gameState.stats.totalBirdsFed += 1;
                    
                    // Aktualizuj UI i zapisz stan
                    updateUI();
                    saveGame();
                    
                    // Aktualizuj UI slotu
                    updateBirdSlotUI(slotElement, slotIndex);
                    
                    // Aktualizuj przyciski akcji zbiorowych
                    if (typeof updateAllActionButtons === 'function') {
                        updateAllActionButtons();
                    }
                    
                    // Aktualizuj znacznik misji
                    updateMissionBadge();
                    
                    console.log("Karmienie mitycznego ptaka zakończone powodzeniem");
                } else {
                    showNotification(t('notifications.notEnoughFruits', {amount: fruitCost}));
                }
            } else {
                // ZWYKŁY PTAK - UŻYJ ZIARENEK
                
                // Pobierz koszt z uwzględnieniem bonusów
                const originalCost = gameState.locations.configs[locationId].birdCosts[slot.birdType];
                let finalCost = originalCost;
                
                if (typeof window.applyDecorationBonusesToFeedCost === 'function') {
                    finalCost = window.applyDecorationBonusesToFeedCost(locationId, originalCost);
                }
                
                console.log(`Karmienie ptaka w slocie ${slotIndex}, typ: ${slot.birdType}, koszt: ${finalCost} (oryginalny: ${originalCost})`);
                
                // Sprawdź, czy mamy wystarczająco ziarenek
                if (gameState.resources.seeds >= finalCost) {
                    // Odejmij ziarenka
                    gameState.resources.seeds -= finalCost;
                    
                    // Aktualizuj licznik ziarenek
                    requestAnimationFrame(() => {
                        document.getElementById('seed-count').textContent = gameState.resources.seeds;
                    });
                    
                    // Ustaw ptaka w trybie karmienia
                    slot.isFeeding = true;
                    
                    // Zastosuj czas karmienia z uwzględnieniem bonusów
                    let feedTime = gameState.locations.configs[locationId].birdTimes[slot.birdType];
                    if (typeof window.applyDecorationBonusesToFeedTime === 'function') {
                        feedTime = window.applyDecorationBonusesToFeedTime(locationId, feedTime);
                    }
                    slot.remainingTime = feedTime;
                    
                    // Aktualizuj postęp misji i statystyki
                    updateMissionProgress('feedBirds', 1);
                    if (slot.birdType === 'epic') {
                        updateWeeklyMissionProgress('feedEpicBirds', 1);
                    }
                    gameState.stats.totalBirdsFed += 1;
                    
                    // Aktualizuj UI i zapisz stan
                    updateUI();
                    saveGame();
                    
                    // Aktualizuj UI slotu
                    updateBirdSlotUI(slotElement, slotIndex);
                    
                    // Aktualizuj przyciski akcji zbiorowych
                    if (typeof updateAllActionButtons === 'function') {
                        updateAllActionButtons();
                    }
                    
                    // Aktualizuj znacznik misji
                    updateMissionBadge();
                    
                    console.log("Karmienie z ręcznym handlerem zakończone powodzeniem");
                } else {
                    showNotification(t('notifications.notEnoughSeeds'));
                }
            }
        });
    });
    
    console.log("Naprawiono wszystkie przyciski karmienia");
    return "Przyciski naprawione!";
};









// Uruchamiaj naprawę przy każdym uruchomieniu setupBirdSlots
const originalSetupBirdSlots = window.setupBirdSlots;
if (typeof originalSetupBirdSlots === 'function') {
    window.setupBirdSlots = function() {
        // Wywołaj oryginalną funkcję
        originalSetupBirdSlots.apply(this, arguments);
        
        // Uruchom naprawę - najpierw ogólną, potem dla mitycznych ptaków
        setTimeout(function() {
            window.fixFeedButtons();
            window.fixMythicalFeedButtons();
        }, 100);
    };
    
    // Uruchom natychmiast
    setTimeout(function() {
        window.fixFeedButtons();
        window.fixMythicalFeedButtons();
    }, 500);
}


// Bezpośrednia funkcja bonusowa dostępna dla wszystkich
window.getRewardWithBonus = function(locationId, baseReward) {
    console.log(`[getRewardWithBonus] Prośba o bonus dla lokacji ${locationId} i nagrody ${baseReward}`);
    
    // Sprawdź, czy mamy dekoracje dla tej lokacji
    if (!gameState.decorations?.[locationId]) {
        console.log("[getRewardWithBonus] Brak dekoracji dla lokacji");
        return baseReward;
    }
    
    // Oblicz całkowity bonus procentowy
    let totalBonusPercent = 0;
    
    Object.keys(gameState.decorations[locationId]).forEach(decId => {
        const decoration = gameState.decorations[locationId][decId];
        if (decoration.owned && decoration.bonus && decoration.bonus.type === "reward") {
            totalBonusPercent += decoration.bonus.value;
            console.log(`[getRewardWithBonus] Znaleziono dekorację ${decId} z bonusem +${decoration.bonus.value}%`);
        }
    });
    
    // Zastosuj bonus
    if (totalBonusPercent > 0) {
        console.log(`[getRewardWithBonus] Całkowity bonus: +${totalBonusPercent}%`);
        const newReward = Math.ceil(baseReward * (1 + totalBonusPercent / 100));
        console.log(`[getRewardWithBonus] Nagroda po bonusie: ${newReward} (bazowa: ${baseReward})`);
        return newReward;
    }
    
    return baseReward;
};



// Funkcja aktualizująca wygląd elementów misji zgodnie z nowym designem
function updateMissionItemsAppearance() {
    // Pobierz wszystkie elementy misji
    const missionItems = document.querySelectorAll('.mission-item');
    
    missionItems.forEach(item => {
        // Sprawdź, czy element ma już nowy wygląd
        if (item.querySelector('.mission-header')) return;
        
        // Pobierz istniejące elementy
        const title = item.querySelector('.mission-title');
        const status = item.querySelector('.mission-status');
        const progress = item.querySelector('.mission-progress');
        const progressBar = item.querySelector('.mission-progress-bar');
        const reward = item.querySelector('.mission-reward');
        const claimButton = item.querySelector('.claim-reward-button');
        
        if (!title || !status || !progress || !progressBar) return;
        
        // Zachowaj oryginalne wartości
        const titleText = title.textContent;
        const statusText = status.textContent;
        const progressBarWidth = progressBar.style.width;
        const rewardText = reward ? reward.textContent : '';
        
        // Utwórz nową strukturę
        const newHTML = `
            <div class="mission-header">
                <h4 class="mission-title">${titleText}</h4>
                ${item.classList.contains('mission-complete') ? 
                  `<div class="mission-badge">${t('missions.status.completed')}</div>` : 
                  item.classList.contains('mission-rewarded') ? 
                  `<div class="mission-badge">${t('missions.status.rewarded')}</div>` : 
                  item.classList.contains('mission-bonus') ? 
                  `<div class="mission-badge">${t('missions.status.bonus')}</div>` : ''}
            </div>
            <div class="mission-status">${statusText}</div>
            <div class="mission-progress-container">
                <div class="mission-progress">
                    <div class="mission-progress-bar" style="width: ${progressBarWidth}"></div>
                </div>
            </div>
            <div class="mission-reward-section">
                <div class="mission-reward"><span class="reward-icon">🎁</span> ${rewardText}</div>
                ${claimButton ? '<div class="claim-button-container"></div>' : ''}
            </div>
        `;
        
        // Zastąp zawartość elementu misji
        item.innerHTML = newHTML;
        
        // Jeśli był przycisk odbioru, dodaj go ponownie
        if (claimButton) {
            const buttonContainer = item.querySelector('.claim-button-container');
            if (buttonContainer) {
                buttonContainer.appendChild(claimButton);
            }
        }
    });
}

// Uruchom funkcję po załadowaniu misji
document.addEventListener('DOMContentLoaded', function() {
    // Opóźnione uruchomienie, aby dać czas na wygenerowanie misji
    setTimeout(updateMissionItemsAppearance, 1000);
});

// Uruchom również po przełączeniu na ekran misji
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.getAttribute('data-screen') === 'missions-screen') {
            setTimeout(updateMissionItemsAppearance, 300);
        }
    });
});



// Dodaj te funkcje do globalnego zakresu
window.feedAllBirds = feedAllBirds;
window.collectAllRewards = collectAllRewards;
window.updateAllActionButtons = updateAllActionButtons;
window.handleActionAllButton = handleActionAllButton;

// Eksportuj funkcje inicjalizujące misje
window.initDefaultMissions = initDefaultMissions;
window.initDefaultWeeklyMissions = initDefaultWeeklyMissions;

