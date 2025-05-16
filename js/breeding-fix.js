// ===== SYSTEM HODOWLI PTAKÓW - WERSJA FINALNA ======
console.log(t('breeding.initialization'));

// Dodaj CSS style
(function addBreedingStyles() {
    const style = document.createElement('style');
    style.id = 'breeding-fix-styles';
    style.textContent = `
        /* NOWE STYLE - NAPRAWIAJĄ BIAŁY PASEK */
        #breeding-screen {
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            padding: 0 !important;
            margin: 0 !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            overflow-y: auto !important;
            box-sizing: border-box !important;
        }
        
        /* NAPRAWIA ZNIKAJĄCY PASEK NAD BUTTONAMI */
        #breeding-screen::before,
        #breeding-screen::after {
            content: none !important;
        }
        
        /* ZMIEŃ PADDING KONTENERÓW WEWNĘTRZNYCH - TUTAJ ZMIANA */
        #breeding-screen > h2 {
            margin-top: 65px !important; 
            margin-bottom: 10px !important;
            padding: 0 !important;
        }
        
        #breeding-area {
            margin-top: 0 !important;
            padding-top: 10px !important;
        }
        
        /* Kontener na obrazek ptaka - zwiększony rozmiar */
        #pet-bird-image {
            width: 150px !important;
            height: 150px !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: #F5DEB3 !important;
        }
        
        /* Style dla parametrów */
        .pet-stat {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .pet-stat > span {
            color: #000000 !important; /* Czarny kolor dla parametrów */
            font-weight: bold;
            width: 100px;
        }
        
        #breeding-screen .pet-stat:last-child > span {
            color: #9C27B0 !important; /* Fioletowy kolor dla poziomu */
            font-weight: bold;
        }
        
        .stat-bar {
            width: 70%;
            height: 15px;
            background-color: #e0e0e0;
            border-radius: 7px;
            overflow: hidden;
        }
        
        .stat-progress {
            height: 100%;
            width: 0%;
            transition: width 0.3s ease-in-out;
            border-radius: 7px;
        }
        
        /* Kolory dla parametrów Głód, Szczęście, Czystość */
        .stat-progress.green {
            background-color: #4CAF50 !important;
        }
        
        .stat-progress.orange {
            background-color: #FF9800 !important;
        }
        
        .stat-progress.red {
            background-color: #F44336 !important;
        }
        
        /* Fioletowy progress bar dla doświadczenia */
        #experience-bar {
            background-color: #9C27B0 !important;
            transition: width 0.3s ease-in-out;
        }
        
        /* Style dla przycisków */
        #feed-pet-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 25px;
            margin: 0 5px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
        }
        
     
        



#play-pet-button:disabled,
#clean-pet-button:disabled {
    background-color: #cccccc !important;
    color: #666666 !important;
    border: none;
    border-radius: 8px;
    padding: 12px 25px;
    margin: 0 5px;
    font-size: 16px;
    cursor: not-allowed !important;
    font-weight: bold;
    opacity: 0.7 !important;
    position: relative;
}

#play-pet-button:not(:disabled),
#clean-pet-button:not(:disabled) {
    background-color: #4CAF50 !important;
    color: white !important;
    border: none;
    border-radius: 8px;
    padding: 12px 25px;
    margin: 0 5px;
    font-size: 16px;
    cursor: pointer !important;
    font-weight: bold;
    opacity: 1 !important;
}

#play-pet-button:disabled::before,
#clean-pet-button:disabled::before {
    content: "🔒 ";
}






        
        #hatch-pet-button,
        #expeditions-button {
            background-color: #9C27B0;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 15px;
        }
        
        #expeditions-button:disabled {
            background-color: #cccccc;
            color: #666666;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        #expeditions-button:disabled::before {
            content: "🔒 ";
        }
        
        /* Style dla ekranu zabawy */
        #play-bird-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #8FBC8F;
            background-image: url('assets/images/breeding-bg.jpg');
            background-size: cover;
            background-position: center;
            display: none;
            flex-direction: column;
            align-items: center;
            z-index: 1000;
        }
        
        #play-bird-screen.active {
            display: flex;
        }
        
        #play-back-button {
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: #408cc7;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 16px;
        }
        
        #play-bird-image {
            width: 300px;
            height: 300px;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            cursor: pointer;
            transition: transform 0.1s;
            margin-top: 150px;
        }
        
        #play-bird-image:active {
            transform: scale(0.95);
        }
        
        .hop-animation {
            animation: hop 0.5s ease;
        }
        
        @keyframes hop {
            0% { transform: translateY(0); }
            50% { transform: translateY(-50px); }
            100% { transform: translateY(0); }
        }
        
        #play-happiness-container {
            margin-top: 20px;
            width: 300px;
        }
        
        #play-happiness-container .stat-bar {
            width: 100%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 5px;
        }
    `;
    
    document.head.appendChild(style);
})();







// Funkcja aktualizująca kolory pasków
function updateStatBarColor(barElement, value) {
    if (!barElement) return;
    
    barElement.classList.remove('green', 'orange', 'red');
    
    if (value >= 76) {
        barElement.classList.add('green');
    } else if (value >= 36) {
        barElement.classList.add('orange');
    } else {
        barElement.classList.add('red');
    }
}

// Funkcja aktualizująca UI ekranu hodowli
function updatePetBirdUI() {
    const petBirdImage = document.getElementById('pet-bird-image');
    const petBirdName = document.getElementById('pet-bird-name');
    const petStatus = document.getElementById('pet-status');
    const hungerBar = document.getElementById('hunger-bar');
    const happinessBar = document.getElementById('happiness-bar');
    const cleanlinessBar = document.getElementById('cleanliness-bar');
    const experienceBar = document.getElementById('experience-bar');
    const petLevel = document.getElementById('pet-level-value');
    
    const feedButton = document.getElementById('feed-pet-button');
    const playButton = document.getElementById('play-pet-button');
    const cleanButton = document.getElementById('clean-pet-button');
    const hatchButton = document.getElementById('hatch-pet-button');
    const expeditionsButton = document.getElementById('expeditions-button');
    
    if (!gameState.petBird || !gameState.petBird.exists) {
        if (petBirdImage) petBirdImage.style.backgroundImage = "none";
        if (petBirdName) petBirdName.textContent = t('breeding.noBird');
        if (petStatus) petStatus.textContent = t('breeding.startBreeding');
        
        if (hungerBar) hungerBar.style.width = "0%";
        if (happinessBar) happinessBar.style.width = "0%";
        if (cleanlinessBar) cleanlinessBar.style.width = "0%";
        if (experienceBar) experienceBar.style.width = "0%";
        if (petLevel) petLevel.textContent = t('breeding.stats.level', { level: 0 });
        
        if (feedButton) feedButton.style.display = "none";
        if (playButton) playButton.style.display = "none";
        if (cleanButton) cleanButton.style.display = "none";
        
        if (hatchButton) {
            hatchButton.style.display = "block";
            hatchButton.textContent = t('breeding.ui.getEggButton');
        }
        
        if (expeditionsButton) expeditionsButton.style.display = "none";
        
        return;
    }
    
    const level = gameState.petBird.level;
    const experience = gameState.petBird.experience || 0;
    const stage = gameState.petBird.stage || "egg";
    
    if (petBirdImage) {
        petBirdImage.style.backgroundImage = `url('./assets/images/bird-${stage}.png')`;
        petBirdImage.style.backgroundSize = 'contain';
        petBirdImage.style.backgroundPosition = 'center';
        petBirdImage.style.backgroundRepeat = 'no-repeat';
    }

    if (petBirdName) {
        petBirdName.textContent = gameState.petBird.name || t('breeding.bird');
    }
    
    if (petStatus) {
        if (gameState.petBird.hunger < 30) {
            petStatus.textContent = t('breeding.birdStatus.hungry', { name: gameState.petBird.name });
        } else if (gameState.petBird.happiness < 30) {
            petStatus.textContent = t('breeding.birdStatus.sad', { name: gameState.petBird.name });
        } else if (gameState.petBird.cleanliness < 30) {
            petStatus.textContent = t('breeding.birdStatus.dirty', { name: gameState.petBird.name });
        } else {
            petStatus.textContent = t('breeding.birdStatus.good', { name: gameState.petBird.name });
        }
    }
    
    if (petLevel) {
        petLevel.textContent = t('breeding.stats.level', { level: level });
    }
    
    const hunger = Math.max(1, gameState.petBird.hunger || 1);
    const happiness = Math.max(1, gameState.petBird.happiness || 1);
    const cleanliness = Math.max(1, gameState.petBird.cleanliness || 1);
    
    if (hungerBar) {
        hungerBar.style.width = `${hunger}%`;
        updateStatBarColor(hungerBar, hunger);
    }
    
    if (happinessBar) {
        happinessBar.style.width = `${happiness}%`;
        updateStatBarColor(happinessBar, happiness);
    }
    
    if (cleanlinessBar) {
        cleanlinessBar.style.width = `${cleanliness}%`;
        updateStatBarColor(cleanlinessBar, cleanliness);
    }
    
  

    let experienceNeeded;
    if (level === 1) experienceNeeded = 150;
    else if (level === 2) experienceNeeded = 250;
    else if (level === 3) experienceNeeded = 500;
    else if (level >= 4) experienceNeeded = 1000;
    else experienceNeeded = 150; // wartość domyślna



    
    if (experienceBar) {
        const experiencePercent = (experience / experienceNeeded) * 100;
        experienceBar.style.width = `${experiencePercent}%`;
    }
    
    if (feedButton) {
        feedButton.style.display = "block";
        let feedCost = 10;
        if (level >= 2) feedCost = 20;
        if (level >= 3) feedCost = 50;
        if (level >= 4) feedCost = 100;
        
        feedButton.innerHTML = `${t('breeding.feed')} (${feedCost} <img src="assets/images/seed-icon.png" style="height: 27px; vertical-align: middle; margin-bottom: 2px;">)`;
        
        if (hunger >= 95) {
            // NIE używamy disabled, tylko zmieniamy wygląd
            feedButton.style.opacity = "0.5";
            feedButton.style.cursor = "not-allowed";
            feedButton.style.backgroundColor = "#999999";
        } else {
            feedButton.style.opacity = "1";
            feedButton.style.cursor = "pointer";
            feedButton.style.backgroundColor = "#4CAF50";
        }
    
    }
    
    if (playButton) {
        playButton.style.display = "block";
        if (level >= 2) {
            playButton.disabled = false;
            playButton.classList.remove('locked-button');
        } else {
            playButton.disabled = true;
            playButton.classList.add('locked-button');
        }
    }
    
    if (cleanButton) {
        cleanButton.style.display = "block";
        if (level >= 3) {
            cleanButton.disabled = false;
            cleanButton.classList.remove('locked-button');
        } else {
            cleanButton.disabled = true;
            cleanButton.classList.add('locked-button');
        }
    }
    
    if (hatchButton) {
        hatchButton.style.display = "none";
    }
    
  
    
// Dodaj ciut więcej miejsca dla ikony
feedButton.style.paddingRight = "15px";
feedButton.style.paddingLeft = "15px";


if (expeditionsButton) {
    if (level >= 4) {
        // Sprawdź parametry ptaka
        const hungerOK = gameState.petBird.hunger > 75;
        const happinessOK = gameState.petBird.happiness > 75;
        const cleanlinessOK = gameState.petBird.cleanliness > 75;
        
        if (hungerOK && happinessOK && cleanlinessOK) {
            // Wszystkie parametry są OK
            expeditionsButton.style.display = "block";
            expeditionsButton.textContent = t('breeding.expeditions');
            expeditionsButton.disabled = false;
            expeditionsButton.style.backgroundColor = "#9C27B0";
        } else {
            // Parametry nie są wystarczające, ale przycisk jest dostępny
            expeditionsButton.style.display = "block";
            expeditionsButton.textContent = t('breeding.expeditions');
            expeditionsButton.disabled = false;
            // Zmień kolor na pomarańczowy (ostrzeżenie)
            expeditionsButton.style.backgroundColor = "#FF9800";
        }
    } else {
        // Ptak nie osiągnął jeszcze poziomu 4
        expeditionsButton.style.display = "block";
        expeditionsButton.textContent = t('breeding.ui.lockedExpeditionsButton');
        expeditionsButton.disabled = true;
        expeditionsButton.style.backgroundColor = "#cccccc";
    }
}
}

// Funkcja dodawania doświadczenia
function addPetExperience(amount) {
    if (!gameState.petBird || !gameState.petBird.exists) return;
    
    const currentExperience = gameState.petBird.experience || 0;
    const currentLevel = gameState.petBird.level || 1;
    
    let experienceNeeded = 150;
    if (currentLevel === 2) experienceNeeded = 250;
    else if (currentLevel === 3) experienceNeeded = 500;
    else if (currentLevel >= 4) experienceNeeded = 1000;
    
    gameState.petBird.experience = currentExperience + amount;
    
    if (gameState.petBird.experience >= experienceNeeded && currentLevel < 4) {
        gameState.petBird.level += 1;
        gameState.petBird.experience = 0;
        
        if (gameState.petBird.level === 2) {
            gameState.petBird.stage = "chick";
            showNotification(t('breeding.birdEvents.eggHatched'));
        } else if (gameState.petBird.level === 3) {
            gameState.petBird.stage = "young";
            showNotification(t('breeding.birdEvents.chickGrown'));
        } else if (gameState.petBird.level === 4) {
            gameState.petBird.stage = "adult";
            showNotification(t('breeding.birdEvents.birdAdult'));
            gameState.resources.coins += 100;
            showNotification(t('breeding.birdEvents.adultReward'));
        }
        
        saveGame();
    }
    
    updatePetBirdUI();
}

// Funkcja karmienia
function feedPet() {
    if (!gameState.petBird || !gameState.petBird.exists) return;
    
    const currentLevel = gameState.petBird.level || 1;
    
    let feedCost = 10;
    if (currentLevel >= 2) feedCost = 20;
    if (currentLevel >= 3) feedCost = 50;
    if (currentLevel >= 4) feedCost = 100;
    
    if (gameState.petBird.hunger >= 95) {
        showNotification(t('breeding.feeding.birdFull'));
        return;
    }
    
    if (gameState.resources.seeds >= feedCost) {
        gameState.resources.seeds -= feedCost;
        gameState.petBird.hunger = Math.min(100, gameState.petBird.hunger + 10);
        addPetExperience(10);
        showNotification(t('breeding.feeding.birdFed', { amount: feedCost }));
        updateUI();
        saveGame();
    } else {
        showNotification(t('breeding.feeding.notEnoughSeeds', { amount: feedCost }));
    }
}







// Obsługa ekranu zabawy z ptakiem
function setupPlayScreen() {
    const playBackButton = document.getElementById('play-back-button');
    const playBirdImage = document.getElementById('play-bird-image');
    
    if (playBackButton) {
        playBackButton.onclick = function() {
            console.log(t('breeding.backToBreeding'));
            // Ukryj ekran zabawy
            const playScreen = document.getElementById('play-screen');
            if (playScreen) {
                playScreen.classList.remove('active');
            }
            // Pokaż ekran hodowli
            const breedingScreen = document.getElementById('breeding-screen');
            if (breedingScreen) {
                breedingScreen.classList.add('active');
                // Aktualizuj UI hodowli
                if (typeof updatePetBirdUI === 'function') {
                    updatePetBirdUI();
                }
            }
        };
    }
    
    
    // W funkcji setupPlayScreen, zaktualizuj tylko tę część z kliknięciem ptaka:
if (playBirdImage) {
    playBirdImage.onclick = function() {


   



        if (!gameState.petBird || !gameState.petBird.exists) return;
        
        console.log(t('breeding.increaseHappiness'));
        
        // Zwiększ szczęście
        const happiness = Math.min(100, gameState.petBird.happiness + 10);
        gameState.petBird.happiness = happiness;
        
        // Wybierz losową animację dla ptaka
        const animations = ['bird-jump', 'bird-happy', 'bird-flip'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        
        // Dodaj animację
        playBirdImage.className = '';
        playBirdImage.classList.add(randomAnimation);
        
        // NOWE: Dodaj efekty fajerwerków i gwiazdek
        createHappinessEffects();
        
        // Usuń klasę animacji po jej zakończeniu
        setTimeout(() => {
            playBirdImage.className = '';
        }, 1000);
        
        // Aktualizuj pasek szczęścia na ekranie zabawy
        const happinessProgress = document.getElementById('play-happiness-bar');
        if (happinessProgress) {
            happinessProgress.style.width = `${happiness}%`;
            
            // Zmień kolor paska w zależności od poziomu szczęścia
            if (happiness >= 80) {
                happinessProgress.style.backgroundColor = '#4CAF50'; // Zielony
            } else if (happiness >= 50) {
                happinessProgress.style.backgroundColor = '#8BC34A'; // Jasnozielony
            } else {
                happinessProgress.style.backgroundColor = '#FFC107'; // Żółty
            }
        }
        
        const happinessText = document.getElementById('play-happiness-text');
        if (happinessText) {
            happinessText.textContent = `${t('breeding.stats.happiness')} ${Math.round(happiness)}%`;
        }
        
        // Dodaj XP tylko jeśli szczęście nie jest maksymalne
        if (happiness < 100) {
            addPetExperience(5);
        }
        
        // Pokaż powiadomienie
        showNotification(t('breeding.playing.happinessIncreased', { amount: Math.round(happiness) }));
        
        // Aktualizuj również ekran hodowli
        updatePetBirdUI();
        updateUI();
        saveGame();
    };
}





}










// Wywołaj przy ładowaniu strony
window.addEventListener('load', function() {
    setupPlayScreen();
});





// Funkcja zabawy z ptakiem
function playWithPet() {
    if (!gameState.petBird || !gameState.petBird.exists) return;
    if (gameState.petBird.level < 1) {  // Zabawa dostępna od poziomu 1
        showNotification(t('breeding.youngBird'));
        return;
    }
    
    console.log(t('breeding.startPlayScreen'));
    
    // Sprawdź czy ekrany istnieją
    const breedingScreen = document.getElementById('breeding-screen');
    const playScreen = document.getElementById('play-screen');
    
    if (!breedingScreen || !playScreen) {
        console.error("Nie znaleziono ekranów hodowli lub zabawy!");
        return;
    }
    
    // Ukryj ekran hodowli
    breedingScreen.classList.remove('active');
    
    // Pokaż ekran zabawy
    playScreen.classList.add('active');
    
    // Ustaw tło ekranu
    playScreen.style.backgroundImage = "url('assets/images/breeding-bg.jpg')";
    
    // Sprawdź czy element obrazka istnieje
    const playBirdImage = document.getElementById('play-bird-image');
    if (playBirdImage) {
        // Ustaw obrazek ptaka na podstawie jego stadium rozwoju
        const stage = gameState.petBird.stage || 'egg';
        playBirdImage.style.backgroundImage = `url('./assets/images/bird-${stage}.png')`;
        playBirdImage.style.backgroundSize = 'contain';
        playBirdImage.style.backgroundPosition = 'center';
        playBirdImage.style.backgroundRepeat = 'no-repeat';
        console.log(t('breeding.birdImageSet', { path: `./assets/images/bird-${stage}.png` }));
    } else {
        console.error("Nie znaleziono elementu #play-bird-image!");
    }
    
    // Aktualizuj pasek szczęścia
    const happinessBar = document.getElementById('play-happiness-bar');
    const happinessText = document.getElementById('play-happiness-text');
    if (happinessBar) {
        happinessBar.style.width = `${gameState.petBird.happiness}%`;
    } else {
        console.error("Nie znaleziono elementu #play-happiness-bar!");
    }
    if (happinessText) {
        happinessText.textContent = `${t('breeding.stats.happiness')} ${Math.round(gameState.petBird.happiness)}%`;
    } else {
        console.error("Nie znaleziono elementu #play-happiness-text!");
    }
}




// Funkcja sprzątania
function cleanPet() {
    if (!gameState.petBird || !gameState.petBird.exists) return;
    if (gameState.petBird.level < 3) return;
    
    const clean = Math.min(100, gameState.petBird.cleanliness + 20);
    gameState.petBird.cleanliness = clean;
    addPetExperience(5);
    showNotification(t('breeding.birdCleaned', { name: gameState.petBird.name }));
    updatePetBirdUI();
    updateUI();
    saveGame();
}






// Funkcja kupna jajka  
function getNewEgg() {
    if (gameState.petBird && gameState.petBird.exists) {
        showNotification(t('breeding.alreadyHaveEgg'));
        return;
    }
    
    const eggCost = 50;
    
    if (gameState.resources.coins >= eggCost) {
        gameState.resources.coins -= eggCost;
        
        const prefixes = t('breeding.birdNames.prefixes', {}, true);
        const suffixes = t('breeding.birdNames.suffixes', {}, true);
        
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomName = `${randomPrefix} ${randomSuffix}`;
        
        gameState.petBird = {
            exists: true,
            name: randomName,
            stage: "egg",
            level: 1,           // Ptak zaczyna od poziomu 1 (nie 0)
            experience: 0,
            hunger: 10,         // Zmień głód z 0 na 10
            happiness: 10,
            cleanliness: 10,
            lastUpdate: Date.now()
        };
        
        showNotification(t('breeding.egg.purchased', { name: randomName }));
        updatePetBirdUI();
        updateUI();
        saveGame();
    } else {
        showNotification(t('breeding.egg.notEnoughCoins', { amount: eggCost }));
    }
}




// Aktualizacja statystyk ptaka z czasem
function updatePetStats() {
    if (!gameState.petBird || !gameState.petBird.exists) return;
    
    const now = Date.now();
    const lastUpdate = gameState.petBird.lastUpdate || now;
    const elapsed = (now - lastUpdate) / 1000;
    
    // Określ współczynniki spadku statystyk w zależności od etapu rozwoju
    const stage = gameState.petBird.stage;
    const rates = {
        egg: { hunger: 1.0, happiness: 0.1, cleanliness: 0.1 },
        chick: { hunger: 0.5, happiness: 0.2, cleanliness: 0.3 },
        young: { hunger: 0.5, happiness: 0.2, cleanliness: 0.2 },
        adult: { hunger: 0.1, happiness: 0.08, cleanliness: 0.08 }
    };
    
    const currentRates = rates[stage] || rates.egg;
    
    gameState.petBird.hunger = Math.max(0, gameState.petBird.hunger - (currentRates.hunger * elapsed));
    gameState.petBird.happiness = Math.max(0, gameState.petBird.happiness - (currentRates.happiness * elapsed));
    gameState.petBird.cleanliness = Math.max(0, gameState.petBird.cleanliness - (currentRates.cleanliness * elapsed));
    
    gameState.petBird.lastUpdate = now;
    
    if (document.querySelector('#breeding-screen.active')) {
        updatePetBirdUI();
    }
    
    // Aktualizuj ekran zabawy, jeśli jest aktywny
    if (document.querySelector('#play-screen.active')) {
        const happinessBar = document.getElementById('play-happiness-bar');
        const happinessText = document.getElementById('play-happiness-text');
        
        if (happinessBar) {
            happinessBar.style.width = `${gameState.petBird.happiness}%`;
        }
        
        if (happinessText) {
            happinessText.textContent = `${t('breeding.stats.happiness')} ${Math.round(gameState.petBird.happiness)}%`;
        }
    }
}




// Inicjalizacja ekranu hodowli
function setupBreedingScreen() {
    console.log(t('breeding.screenInitialized'));
    
    const feedButton = document.getElementById('feed-pet-button');
    const playButton = document.getElementById('play-pet-button');
    const cleanButton = document.getElementById('clean-pet-button');
    const hatchButton = document.getElementById('hatch-pet-button');
    
    if (feedButton) {
        feedButton.onclick = feedPet;
    }
    
    if (playButton) {
        playButton.onclick = playWithPet;
    }
    
    if (cleanButton) {
        cleanButton.onclick = function() {
            console.log("Kliknięto przycisk czyszczenia");
            if (gameState.petBird.level >= 3) {
                startSortingGame();
            } else {
                showNotification(t('breeding.needsHigherLevel'));
            }
        };
    }
    
    if (hatchButton) {
        hatchButton.onclick = getNewEgg;
    }
    
    updatePetBirdUI();
    console.log(t('breeding.screenInitialized'));
}









// Funkcja tworząca efekty radości
function createHappinessEffects() {
    const playScreen = document.getElementById('play-screen');
    if (!playScreen) return;
    
    // Twórz gwiazdki - dodaj do play-screen, nie do body
    for (let i = 0; i < 8; i++) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.textContent = '⭐';
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${window.innerHeight / 2 + Math.random() * 100 - 50}px`;
        playScreen.appendChild(star); // zmiana z body na playScreen
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
    
    // Twórz serduszka
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = '❤️';
        heart.style.left = `${Math.random() * window.innerWidth}px`;
        heart.style.top = `${window.innerHeight / 2 + Math.random() * 100 - 50}px`;
        playScreen.appendChild(heart); // zmiana z body na playScreen
        
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
    
    // Twórz konfetti - POPRAWKA!
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${window.innerWidth / 2}px`;
        confetti.style.top = `${window.innerHeight / 2}px`;
        
        // Losowy ruch konfetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        // NAPRAWIONO: używamy bezpośrednio transform zamiast zmiennych CSS
        confetti.style.animation = `none`; // wyłączamy animację CSS
        confetti.style.transition = 'all 1s ease-out';
        
        playScreen.appendChild(confetti); // zmiana z body na playScreen
        
        // Rozpoczynamy animację
        setTimeout(() => {
            confetti.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = '0';
        }, 0);
        
        setTimeout(() => {
            confetti.remove();
        }, 1000);
    }
    
    // Fajerwerki
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${window.innerWidth / 2 - 50}px`;
    firework.style.top = `${window.innerHeight / 2 - 50}px`;
    firework.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,100,100,0.7) 40%, rgba(255,255,0,0.7) 60%, rgba(0,255,0,0.7) 80%, rgba(0,255,255,0) 100%)';
    firework.style.borderRadius = '50%';
    
    playScreen.appendChild(firework); // zmiana z body na playScreen
    
    setTimeout(() => {
        firework.remove();
    }, 700);
}












// Eksportuj funkcje do globalnego zakresu
window.updatePetBirdUI = updatePetBirdUI;
window.getNewEgg = getNewEgg;
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.cleanPet = cleanPet;
window.setupBreedingScreen = setupBreedingScreen;
window.addPetExperience = addPetExperience;
window.updatePetStats = updatePetStats;