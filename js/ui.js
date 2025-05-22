// System przełączania ekranów

function setupScreens() {
    console.log("Inicjalizacja przełączania ekranów");
  
    // Najpierw usuń wszystkie istniejące listenery z przycisków
    // (aby uniknąć zduplikowanych event listenerów)
    document.querySelectorAll('.nav-button').forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });
  
    // Dodaj obsługę przycisków nawigacji
    document.querySelectorAll('.nav-button').forEach(button => {
      button.addEventListener('click', function() {
        const screenId = this.getAttribute('data-screen');
        console.log("Przełączam na ekran: " + screenId);
        
        // Ukryj wszystkie ekrany
        document.querySelectorAll('.game-screen').forEach(screen => {
          screen.classList.remove('active');
        });
        
        // Pokaż wybrany ekran
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
          targetScreen.classList.add('active');
          console.log("Aktywowano ekran: " + screenId);
          

// Jeśli przechodzimy do ekranu karmienia, zaktualizuj dekoracje
if (screenId === 'feed-screen' && typeof applyDecorations === 'function') {
  console.log("Przejście do ekranu karmienia - aktualizuję dekoracje");
  // Zastosuj dekoracje dla aktualnej lokacji
  applyDecorations(gameState.locations.currentLocation);
}


// Usuń klasę 'active' ze wszystkich przycisków
document.querySelectorAll('.nav-button').forEach(btn => {
  btn.classList.remove('active');
});

// Dodaj klasę 'active' do klikniętego przycisku
button.classList.add('active');

          


// Jeśli przejście do ekranu ptaków, upewnij się że sloty są zaktualizowane dla aktualnej lokacji
if (screenId === 'feed-screen') {
  setupBirdSlots(gameState.locations.currentLocation);
}





// Jeśli przejście do ekranu hodowli ptaków, inicjalizuj UI hodowli
if (screenId === 'breeding-screen') {
  console.log("Inicjalizacja ekranu hodowli z ui.js");
  
  // Dajemy ekranowi czas na aktywację i renderowanie
  setTimeout(function() {
    // Aktualizuj UI hodowli natychmiast po pokazaniu ekranu
    if (typeof window.updatePetBirdUI === 'function') {
      console.log("Wymuszam aktualizację UI hodowli");
      window.updatePetBirdUI();
}});




  
  // Dajemy ekranowi czas na aktywację i renderowanie
  setTimeout(function() {
    // Spróbuj użyć BreedingModule (nowy system)
    if (typeof window.BreedingModule !== 'undefined') {
      console.log("Używam modułu BreedingModule");
      window.BreedingModule.init();
      window.BreedingModule.setupBreedingScreen();
      // Dodatkowe sprawdzenie obrazka
      if (typeof window.BreedingModule.fixPetBirdImage === 'function') {
        window.BreedingModule.fixPetBirdImage();
      }
    } 
    // Alternatywnie spróbuj użyć starszych funkcji
    else if (typeof setupBreedingScreen === 'function') {
      console.log("Używam funkcji setupBreedingScreen");
      setupBreedingScreen();
    } else {
      console.warn("Żadna funkcja hodowli nie jest dostępna!");
    }
  }, 300);
}



          
          // Jeśli przejście do ekranu misji, zaktualizuj misje
          if (screenId === 'missions-screen') {
            setupMissions();
            updateMissionBadge();
          }
          
         
          


          // Jeśli przejście do ekranu portfela (dawniej osiągnięć)
          if (screenId === 'wallet-screen') {
            setupWalletScreen();
            
            // Dodatkowo zaktualizuj wyświetlane saldo TON
            const balanceDisplay = document.getElementById('ton-balance-display');
            if (balanceDisplay) {
              balanceDisplay.textContent = formatNumber(gameState.resources.ton || 0.000, 3) + ' TON';
              console.log("Zaktualizowano saldo TON na ekranie portfela:", gameState.resources.ton);
            }
          }





          // Zawsze upewnij się, że przyciski zbierania działają
          setupCollectionButtons();
        } else {
          console.error("Nie znaleziono ekranu o ID: " + screenId);
        }
      });
    });
    // DODAJ w odpowiednim miejscu w ui.js:

    





// DODAJ w odpowiednim miejscu w ui.js:
function setupBreedingButtons() {
  console.log("Inicjalizacja przycisków hodowli");
  
  const hatchButton = document.getElementById('hatch-pet-button');
  if (hatchButton) {
      console.log("Znaleziono przycisk kupna jajka");
      // Usunięcie poprzednich event listenerów
      const newHatchButton = hatchButton.cloneNode(true);
      hatchButton.parentNode.replaceChild(newHatchButton, hatchButton);
      
      // Dodanie nowego event listenera
      newHatchButton.addEventListener('click', function() {
          console.log("Kliknięto przycisk Zdobądź jajko (z ui.js)");
          if (typeof window.buyNewEgg === 'function') {
              window.buyNewEgg();
          } else if (typeof window.getNewEgg === 'function') {
              window.getNewEgg();
          } else {
              console.error("Funkcje kupna jajka niedostępne!");
              window.showNotification(t('notifications.eggPurchaseFunctionUnavailable'));
          }
      });
  } else {
      console.warn("Nie znaleziono przycisku kupna jajka");
  }
}

// Wywołanie funkcji przy inicjalizacji
window.addEventListener('DOMContentLoaded', () => {
  // (...istniejący kod...)
  setTimeout(() => {
      // (...istniejący kod...)
      setupBreedingButtons();
  }, 200);
});



  }
  

  
  

  
// Zmodyfikowana funkcja formatNumber z obsługą TON i DziubCoinów
function formatNumber(number, decimals = 1, isTON = false) {
  // Upewnij się, że mamy liczbę
  if (typeof number !== 'number') {
      number = parseFloat(number) || 0;
  }
  
  // Określ liczbę miejsc po przecinku w zależności od typu
  if (isTON) {
      // Dla TON zawsze używaj 3 miejsc po przecinku
      decimals = 3;
  } else if (decimals === undefined || decimals === null) {
      // Dla DziubCoinów domyślnie używaj 1 miejsca po przecinku
      decimals = 1;
  }
  
  // Formatuj liczbę z odpowiednią liczbą miejsc po przecinku
  const formatted = number.toFixed(decimals);
  
  // Zamień kropkę na przecinek (format polski)
  return formatted.replace('.', ',');
}






// Aktualizacja wyglądu slotu z ptakiem (zaktualizowana dla wielu lokacji)
function updateBirdSlotUI(slotElement, slotIndex, locationId) {
  console.log("Aktualizacja UI slotu:", slotIndex);
  slotIndex = parseInt(slotIndex, 10); // Konwersja na liczbę
  
  // Jeśli nie podano lokacji, użyj bieżącej
  locationId = locationId || gameState.locations.currentLocation;
  console.log(`Aktualizacja UI slotu ${slotIndex} dla lokacji ${locationId}`);
  
  // Sprawdzamy, czy slot istnieje w gameState dla tej lokacji
  if (!gameState.locationSlots[locationId] || !gameState.locationSlots[locationId][slotIndex]) {
    console.error(`Nie znaleziono slotu o indeksie ${slotIndex} w lokacji ${locationId}`);
    return;
  }
  
  // Pobierz konfigurację lokacji i slot
  const locationConfig = gameState.locations.configs[locationId];
  const slot = gameState.locationSlots[locationId][slotIndex];
  console.log("Stan slotu:", slot);
  
  // Sprawdź, czy elementy slotu istnieją
  if (!slotElement) {
    console.error("Element slotu nie istnieje:", slotIndex);
    return;
  }
  
  // Znajdź elementy UI
  const birdImage = slotElement.querySelector('.bird-image');
  const birdTimer = slotElement.querySelector('.bird-timer');
  const feedButton = slotElement.querySelector('.feed-button');
  const scareButton = slotElement.querySelector('.scare-button');
  const collectButton = slotElement.querySelector('.collect-reward-button');
  const unlockButton = slotElement.querySelector('.unlock-button');
  const lockIcon = slotElement.querySelector('.lock-icon');
  const unlockText = slotElement.querySelector('p:not(.bird-timer)'); // To jest tekst "Odblokuj za X DziubCoinów"
  
  // Sprawdź, czy slot jest odblokowany dla tej lokacji
  if (!gameState.locationUnlockedSlots[locationId][slotIndex]) {
    console.log(`Slot ${slotIndex} zablokowany w lokacji ${locationId}`);
    slotElement.classList.add('locked');
    
    // Pokazujemy tylko elementy związane z odblokowaniem
    if (birdImage) birdImage.style.display = 'none';
    if (birdTimer) birdTimer.textContent = '';
    if (feedButton) feedButton.style.display = 'none';
    if (scareButton) scareButton.style.display = 'none';
    if (collectButton) collectButton.style.display = 'none';
    
    // Pokaż elementy odblokowania
    if (lockIcon) lockIcon.style.display = 'block';
    if (unlockButton) {
      unlockButton.style.display = 'block';
      
      // Aktualizuj koszt odblokowania na przycisku
      const unlockCost = locationConfig.slotUnlockCosts[slotIndex] || 50;
      unlockButton.textContent = `${t('birdSlots.unlock')} (${unlockCost})`;
    }
    if (unlockText) {
      unlockText.style.display = 'block';
      // Aktualizuj tekst kosztu odblokowania
      const unlockCost = locationConfig.slotUnlockCosts[slotIndex] || 50;
      unlockText.textContent = t('birdSlots.lockInfo', { amount: unlockCost });
    }
    return;
  }
  
  // Dodatkowe logowanie dla slotów 3 i 4
  if (slotIndex == 3 || slotIndex == 4) {
    console.log(`Aktualizacja UI odblokowanego slotu ${slotIndex} w lokacji ${locationId}:`, slot);
    console.log(`Stan przycisku karmienia: ${feedButton ? 'istnieje' : 'brak'}`);
    console.log(`Stan przycisku przepędzania: ${scareButton ? 'istnieje' : 'brak'}`);
    console.log(`Stan przycisku nagrody: ${collectButton ? 'istnieje' : 'brak'}`);
  }
  
  // Jeśli slot jest odblokowany, ukryj elementy odblokowania
  slotElement.classList.remove('locked');
  if (lockIcon) lockIcon.style.display = 'none';
  if (unlockButton) unlockButton.style.display = 'none';
  if (unlockText) unlockText.style.display = 'none';
  
  if (slot.isActive) {
    // Dodaj klasę has-bird dla slotów z aktywnym ptakiem
    slotElement.classList.add('has-bird');
    console.log(`Slot ${slotIndex} w lokacji ${locationId} ma aktywnego ptaka typu: ${slot.birdType}`);
    
    // Pokaż obrazek ptaka
    if (birdImage) {
      birdImage.style.display = 'flex';
      
      // ZMIANA 1: Usuń wszystkie możliwe klasy ptaków, zarówno z Parku jak i z Jeziora
      birdImage.classList.remove(
        'common-bird', 'rare-bird', 'epic-bird', 'legendary-bird', 'mythical-bird',
        'lake-common', 'lake-rare', 'lake-epic', 'lake-legendary', 'lake-mythical'
      );
      
      // Pobierz URL obrazka z konfiguracji lokacji
      const imageUrl = locationConfig.birdImages[slot.birdType];
      
      // ZMIANA 2: Ustaw klasy w zależności od lokacji
      if (locationId === 'lake') {
        // Dla Brzegu Jeziora używamy klas 'lake-[typ]'
        birdImage.classList.add(`lake-${slot.birdType}`);
        console.log(`Dodano klasę lake-${slot.birdType} dla ptaka w lokacji Brzeg Jeziora`);
      } else {
        // Dla Parku Miejskiego używamy klas '[typ]-bird'
        birdImage.classList.add(`${slot.birdType}-bird`);
        console.log(`Dodano klasę ${slot.birdType}-bird dla ptaka w lokacji Park Miejski`);
      }
      
      birdImage.innerHTML = ''; // Usunięto emotikony, teraz używamy tła CSS
      
      // ZMIANA 3: Ustawienie tła z poprawioną ścieżką dla systemu plików
      if (imageUrl) {
        birdImage.style.backgroundImage = `url('./${imageUrl}')`;
        console.log(`Ustawiono tło obrazka: ./${imageUrl}`);
      }
      
      // ZMIANA 4: Dodatkowe sprawdzenie - wyświetl bezpośrednio obrazek, jeśli tło nie działa
      if (birdImage.style.backgroundImage === '' || birdImage.style.backgroundImage === 'none') {
        console.log("Tło nie zadziałało, próbuję bezpośredniego obrazka");
        birdImage.innerHTML = '';
        const imgElement = document.createElement('img');
        imgElement.style.width = '100%';
        imgElement.style.height = '100%';
        imgElement.style.objectFit = 'contain';
        
        if (locationId === 'lake') {
          if (slot.birdType === 'common') imgElement.src = './assets/images/lake-common.png';
          else if (slot.birdType === 'rare') imgElement.src = './assets/images/lake-rare.png';
          else if (slot.birdType === 'epic') imgElement.src = './assets/images/lake-epic.png';
          else if (slot.birdType === 'legendary') imgElement.src = './assets/images/lake-legendary.png';
          else if (slot.birdType === 'mythical') imgElement.src = './assets/images/lake-mythical.png';
        } else {
          if (slot.birdType === 'common') imgElement.src = './assets/images/common-bird.png';
          else if (slot.birdType === 'rare') imgElement.src = './assets/images/rare-bird.png';
          else if (slot.birdType === 'epic') imgElement.src = './assets/images/epic-bird.png';
          else if (slot.birdType === 'legendary') imgElement.src = './assets/images/legendary-bird.png';
          else if (slot.birdType === 'mythical') imgElement.src = './assets/images/mythical-bird.png';
        }
        
        birdImage.appendChild(imgElement);
      }
    } else {
      console.error(`Nie znaleziono elementu birdImage w slocie ${slotIndex} lokacji ${locationId}`);
    }
    
    // Obsługa stanu karmienia
    if (slot.needsCollection) {
      if (birdTimer) {
        birdTimer.textContent = '';
        birdTimer.style.color = '#4CAF50';
      }
      if (feedButton) feedButton.style.display = 'none';
      if (scareButton) scareButton.style.display = 'none';
      if (collectButton) collectButton.style.display = 'block';
    } else if (slot.isFeeding) {
      if (birdTimer) {
        // TUTAJ JEST ZMIANA - używamy funkcji formatTime zamiast prostego dodawania 's'
        birdTimer.textContent = formatTime(slot.remainingTime);
        birdTimer.style.color = '#000000';
      }
      if (feedButton) feedButton.style.display = 'none';
      if (scareButton) scareButton.style.display = 'none';
      if (collectButton) collectButton.style.display = 'none';
    } else {
      if (birdTimer) birdTimer.textContent = '';
    
      
     
      




      if (feedButton) {
        feedButton.style.display = 'block';
        
        // NAPRAWIONE: Sprawdź czy ptak jest mityczny i pokaż odpowiedni koszt
        if (slot.birdType === 'mythical') {
            // Dla mitycznych ptaków: pokaż koszt w owocach
            let fruitCost = 1; // domyślnie 1 owoc dla parku
            if (locationId === 'lake') {
                fruitCost = 3; // 3 owoce dla jeziora
            } else if (locationId === 'forest') {
                fruitCost = 5; // 5 owoców dla lasu
            }
            feedButton.textContent = `${t('birdSlots.feedBird')} (${fruitCost} 🍎)`;
            
            // Zmień styl przycisku dla mitycznych ptaków
            feedButton.style.backgroundColor = '#8a2be2'; // Fioletowy kolor dla mitycznych ptaków
            feedButton.style.color = 'white';
        } else {
            // Dla zwykłych ptaków: pokaż koszt w ziarenkach
            let cost = locationConfig.birdCosts[slot.birdType];
            
            // Sprawdź dostępność funkcji bonusowej
            if (typeof window.applyDecorationBonusesToFeedCost === 'function') {
                cost = window.applyDecorationBonusesToFeedCost(locationId, cost);
            } else {
                // Sprawdź, czy gracz ma ławkę w Parku Miejskim i czy jest w parku
                let hasBench = false;
                if (gameState.decorations && 
                    gameState.decorations.park && 
                    gameState.decorations.park.bench && 
                    gameState.decorations.park.bench.owned === true) {
                    hasBench = true;
                }
                
                // Zastosuj zniżkę bezpośrednio
                if (hasBench && locationId === 'park') {
                    cost = Math.max(1, Math.floor(cost * 0.9));
                    console.log(`[UI] Stosujemy zniżkę -10% na karmienie: ${cost}`);
                }
            }
            
            // Przywróć standardowy styl przycisku
            feedButton.style.backgroundColor = '';
            feedButton.style.color = '';
            
            // Aktualizuj koszt karmienia na przycisku
            feedButton.textContent = `${t('birdSlots.feedBird')} (${cost})`;
        }
    }









      if (scareButton) scareButton.style.display = 'block';
      if (collectButton) collectButton.style.display = 'none';
    }
  } else {
    // Usuń klasę has-bird dla pustych slotów
    slotElement.classList.remove('has-bird');
    console.log(`Slot ${slotIndex} w lokacji ${locationId} pusty - czekamy na ptaka`);
    
    // Slot pusty - ukryj elementy
    if (birdImage) {
      birdImage.style.display = 'none';
      birdImage.style.backgroundImage = 'none';
    }
    if (birdTimer) {
      birdTimer.textContent = t('birdSlots.waitingForBird');
      birdTimer.style.color = '#999999';
    }
    if (feedButton) feedButton.style.display = 'none';
    if (scareButton) scareButton.style.display = 'none';
    if (collectButton) collectButton.style.display = 'none';
  }
}






// Inicjalizacja slotów na ptaki (zaktualizowana dla wielu lokacji)
function setupBirdSlots(locationId) {
  // Jeśli nie podano lokacji, użyj bieżącej
  locationId = locationId || gameState.locations.currentLocation;
  
  console.log(`Inicjalizacja slotów na ptaki dla lokacji ${locationId}`);
  
  // Pobierz konfigurację lokacji
  const locationConfig = gameState.locations.configs[locationId];
  if (!locationConfig) {
      console.error(`Nie znaleziono konfiguracji dla lokacji ${locationId}`);
      return;
  }
  
  const birdSlots = document.querySelectorAll('.bird-slot');
  console.log("Znaleziono slotów:", birdSlots.length);
  
  // DODANE: Sprawdzenie ilości slotów
  if (birdSlots.length < 5) {
    console.warn("Uwaga: Znaleziono mniej niż 5 slotów!");
  }
  
  // Upewnij się, że sloty dla tej lokacji istnieją
  if (!gameState.locationSlots[locationId]) {
      console.error(`Brak zdefiniowanych slotów dla lokacji ${locationId}!`);
      return;
  }
  
  // Ustawienie tekstu informacyjnego lokacji
  const locationNameElement = document.getElementById('current-location-name');
  if (locationNameElement) {
      locationNameElement.textContent = locationConfig.name;
  }
  
  birdSlots.forEach((slot) => {
    const slotIndex = slot.getAttribute('data-slot');
    console.log(`Konfiguracja slotu ${slotIndex} w lokacji ${locationId}`);
    
    // Sprawdź, czy slot istnieje w gameState dla tej lokacji
    if (!gameState.locationSlots[locationId][slotIndex]) {
      console.error(`Nie znaleziono slotu o indeksie ${slotIndex} w lokacji ${locationId}`);
      return;
    }
    
    // Weryfikacja - czy slot ma wszystkie potrzebne elementy
    const hasBirdImage = !!slot.querySelector('.bird-image');
    const hasBirdTimer = !!slot.querySelector('.bird-timer');
    const hasButtons = !!slot.querySelector('.bird-buttons');
    
    console.log(`Slot ${slotIndex} - elementy: obrazek: ${hasBirdImage}, timer: ${hasBirdTimer}, przyciski: ${hasButtons}`);
    
    // Jeśli brakuje elementów UI, dodaj je
    if (!hasBirdImage) {
      const birdImage = document.createElement('div');
      birdImage.className = 'bird-image';
      slot.appendChild(birdImage);
      console.log(`Dodano brakujący element bird-image do slotu ${slotIndex}`);
    }
    
    if (!hasBirdTimer) {
      const birdTimer = document.createElement('div');
      birdTimer.className = 'bird-timer';
      slot.appendChild(birdTimer);
      console.log(`Dodano brakujący element bird-timer do slotu ${slotIndex}`);
    }
    
    if (!hasButtons) {
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'bird-buttons';
      
      // Dodaj przycisk karmienia
      const feedButton = document.createElement('button');
      feedButton.className = 'feed-button';
      feedButton.textContent = t('birdSlots.feedBird');
      
      // Dodaj przycisk przepędzania
      const scareButton = document.createElement('button');
      scareButton.className = 'scare-button';
      scareButton.textContent = t('birdSlots.scareBird');
      
      // Dodaj przycisk zbierania nagrody
      const collectButton = document.createElement('button');
      collectButton.className = 'collect-reward-button';
      collectButton.textContent = t('birdSlots.collectReward');
      
      // Dodaj przyciski do kontenera
      buttonsDiv.appendChild(feedButton);
      buttonsDiv.appendChild(scareButton);
      buttonsDiv.appendChild(collectButton);
      
      // Dodaj kontener przycisków do slotu
      slot.appendChild(buttonsDiv);
      console.log(`Dodano brakujące przyciski do slotu ${slotIndex}`);
    }
    
    // Sprawdź czy slot ma tekst informacyjny o koszcie odblokowania
    const hasUnlockText = !!slot.querySelector('p:not(.bird-timer)');
    if (!hasUnlockText && !gameState.locationUnlockedSlots[locationId][slotIndex]) {
      const unlockText = document.createElement('p');
      const unlockCost = locationConfig.slotUnlockCosts[slotIndex] || 50;
      unlockText.textContent = t('birdSlots.lockInfo', { amount: unlockCost });
      slot.appendChild(unlockText);
    }
    
    // Sprawdź czy slot ma przycisk odblokowania
    const hasUnlockButton = !!slot.querySelector('.unlock-button');
    if (!hasUnlockButton && !gameState.locationUnlockedSlots[locationId][slotIndex]) {
      const unlockButton = document.createElement('button');
      unlockButton.className = 'unlock-button';
      const unlockCost = locationConfig.slotUnlockCosts[slotIndex] || 50;
      unlockButton.textContent = `${t('birdSlots.unlock')} (${unlockCost})`;
      slot.appendChild(unlockButton);
    }
    
    // Znajdź przyciski w slocie
    const feedButton = slot.querySelector('.feed-button');
    const scareButton = slot.querySelector('.scare-button');
    const collectButton = slot.querySelector('.collect-reward-button');
    const unlockButton = slot.querySelector('.unlock-button');
    
    // Usuń poprzednie event listenery (w razie reinicjalizacji)
    if (feedButton) {
      const newFeedButton = feedButton.cloneNode(true);
      feedButton.parentNode.replaceChild(newFeedButton, feedButton);
    }
    
    if (scareButton) {
      const newScareButton = scareButton.cloneNode(true);
      scareButton.parentNode.replaceChild(newScareButton, scareButton);
    }
    
    if (collectButton) {
      const newCollectButton = collectButton.cloneNode(true);
      collectButton.parentNode.replaceChild(newCollectButton, collectButton);
    }
    
    if (unlockButton) {
      const newUnlockButton = unlockButton.cloneNode(true);
      unlockButton.parentNode.replaceChild(newUnlockButton, unlockButton);
    }
    
    // Dodaj nowe event listenery - z przekazaniem aktualnej lokacji
const updatedFeedButton = slot.querySelector('.feed-button');
if (updatedFeedButton) {
  updatedFeedButton.addEventListener('click', function() {
    console.log(`Kliknięto przycisk karmienia w slocie ${slotIndex} w lokacji ${locationId}`);
    
    // Sprawdź, czy to mityczny ptak i użyj specjalnej obsługi
    const slotData = gameState.locationSlots[locationId][slotIndex];
    if (slotData && slotData.isActive && slotData.birdType === 'mythical') {
      console.log("Wykryto mitycznego ptaka - używam specjalnej obsługi karmienia");
      
      // Koszt w owocach zależy od lokacji
      let fruitCost = 1; // domyślnie 1 owoc dla parku
      if (locationId === 'lake') {
          fruitCost = 3; // 3 owoce dla jeziora
      } else if (locationId === 'forest') {
          fruitCost = 5; // 5 owoców dla lasu
      }
      
      // Sprawdź, czy mamy wystarczająco owoców
      if (gameState.resources.fruits >= fruitCost) {
          // Odejmij owoce
          gameState.resources.fruits -= fruitCost;
          
          // Aktualizacja licznika owoców
          requestAnimationFrame(() => {
              document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
          });
          
          // Kontynuuj karmienie
          feedBird(slotIndex, locationId);
      } else {
          showNotification(t('notifications.notEnoughFruitsForMythical', { amount: fruitCost }));
      }
    } else {
      // Dla zwykłych ptaków użyj normalnej funkcji
      feedBird(slotIndex, locationId);
    }
  });
}
    
    const updatedScareButton = slot.querySelector('.scare-button');
    if (updatedScareButton) {
      updatedScareButton.addEventListener('click', function() {
        console.log(`Kliknięto przycisk przepędzania w slocie ${slotIndex} w lokacji ${locationId}`);
        scareBird(slotIndex, locationId);
});
    }
    
    
    // Dodaj tę funkcję poza funkcją setupBirdSlots, gdziekolwiek w pliku ui.js
function updateMythicalBirdButtons(locationId) {
  const birdSlots = document.querySelectorAll('.bird-slot');
  birdSlots.forEach((slot) => {
    const slotIndex = slot.getAttribute('data-slot');
    if (slotIndex !== null) {
      const slotData = gameState.locationSlots[locationId][slotIndex];
      if (slotData && slotData.isActive && slotData.birdType === 'mythical') {
        console.log(`Znaleziono mitycznego ptaka w slocie ${slotIndex} - aktualizuję koszt`);
        updateBirdSlotUI(slot, slotIndex, locationId);
      }
    }



// Dodatkowo napraw przyciski karmienia mitycznych ptaków
if (typeof fixMythicalFeedButtons === 'function') {
  setTimeout(fixMythicalFeedButtons, 100);
}


  });




// Zastosuj dekoracje dla aktualnej lokacji
if (typeof applyDecorations === 'function') {
  applyDecorations(locationId);
  console.log(`Zastosowano dekoracje dla lokacji ${locationId} w setupBirdSlots`);
}

// DODANE: Naprawa przycisków dla mitycznych ptaków
if (typeof fixMythicalFeedButtons === 'function') {
  setTimeout(() => {
    fixMythicalFeedButtons();
    console.log("Naprawiono przyciski dla mitycznych ptaków w setupBirdSlots");
  }, 200);
}




}

// Potem dodaj to wywołanie na końcu funkcji setupBirdSlots, przed nawiasem zamykającym
updateMythicalBirdButtons(locationId);





const updatedCollectButton = slot.querySelector('.collect-reward-button');
if (updatedCollectButton) {
  updatedCollectButton.addEventListener('click', function() {
    console.log(`Kliknięto przycisk zbierania nagrody w slocie ${slotIndex} w lokacji ${locationId}`);
    
    // Zbierz nagrodę i zapisz wynik
    const reward = collectBirdReward(slotIndex, locationId);
    
    // Pokaż animację nagrody dla zwykłych ptaków
    if (reward > 0) {
      // Sprawdź typ ptaka przed zebraniem nagrody (dla zwykłych ptaków)
      showRewardAnimation(`+${reward} 💰`, updatedCollectButton);
    }
  });
}





    
    const updatedUnlockButton = slot.querySelector('.unlock-button');
    if (updatedUnlockButton) {
      updatedUnlockButton.addEventListener('click', function() {
        console.log(`Kliknięto przycisk odblokowania slotu ${slotIndex} w lokacji ${locationId}`);
        console.log("Stan monet przed odblokowaniem:", gameState.resources.coins);
        
        // Odblokuj slot i aktualizuj UI
        if (unlockBirdSlot(slotIndex, locationId)) {
          console.log(`Slot ${slotIndex} w lokacji ${locationId} został odblokowany, aktualizuję UI`);
          // Daj czas na aktualizację stanu gry
          setTimeout(() => {
            // Znajdź slot ponownie w przypadku, gdyby DOM się zmienił
            const updatedSlotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
            if (updatedSlotElement) {
              updateBirdSlotUI(updatedSlotElement, slotIndex, locationId);
              console.log("UI slotu zaktualizowane po odblokowaniu");
            }
          }, 100);
        }
      });
    }
    
    // DODANE: Dodatkowe sprawdzenie dla nowych slotów (4-ty i 5-ty)
    if (slotIndex == 3 || slotIndex == 4) {
      console.log(`Specjalna inicjalizacja dla slotu ${slotIndex} w lokacji ${locationId}`);
      // Sprawdź stan odblokowania
      if (gameState.locationUnlockedSlots[locationId][slotIndex]) {
        console.log(`Slot ${slotIndex} w lokacji ${locationId} jest odblokowany - upewniam się, że działa poprawnie`);
        // Usuń klasę locked
        slot.classList.remove('locked');
        
        // Ukryj elementy odblokowania
        const lockIcon = slot.querySelector('.lock-icon');
        const unlockButton = slot.querySelector('.unlock-button');
        const unlockText = slot.querySelector('p:not(.bird-timer)');
        
        if (lockIcon) lockIcon.style.display = 'none';
        if (unlockButton) unlockButton.style.display = 'none';
        if (unlockText) unlockText.style.display = 'none';
        
        // Sprawdź czy slot ma ptaka, jeśli nie, spróbuj go wygenerować
        if (!gameState.locationSlots[locationId][slotIndex].isActive) {
          console.log(`Slot ${slotIndex} w lokacji ${locationId} nie ma aktywnego ptaka - generuję ptaka`);
          trySpawnBirdInSlot(slotIndex, locationId);
        }
      }
    }
    
    // Zaktualizuj wygląd slotu
    updateBirdSlotUI(slot, slotIndex, locationId);
  });
  
  // Dodatkowo, sprawdź i napraw sloty odblokowane w bieżącej lokacji
  gameState.locationUnlockedSlots[locationId].forEach((isUnlocked, index) => {
    if (isUnlocked) {
      const slotElement = document.querySelector(`.bird-slot[data-slot="${index}"]`);
      if (slotElement && slotElement.classList.contains('locked')) {
        console.log(`Naprawiam UI odblokowanego slotu ${index} w lokacji ${locationId}`);
        slotElement.classList.remove('locked');
        
        const lockIcon = slotElement.querySelector('.lock-icon');
        const unlockButton = slotElement.querySelector('.unlock-button');
        const unlockText = slotElement.querySelector('p:not(.bird-timer)');
        
        if (lockIcon) lockIcon.style.display = 'none';
        if (unlockButton) unlockButton.style.display = 'none';
        if (unlockText) unlockText.style.display = 'none';
        
        // Sprawdź, czy slot ma aktywnego ptaka
        const slot = gameState.locationSlots[locationId][index];
        if (!slot.isActive) {
          console.log(`Slot ${index} w lokacji ${locationId} odblokowany, ale bez ptaka - generuję ptaka`);
          trySpawnBirdInSlot(index, locationId);
        }
      }
    }
  });
  
 // Zastosuj dekoracje dla aktualnej lokacji
if (typeof applyDecorations === 'function') {
  applyDecorations(locationId);
  console.log(`Zastosowano dekoracje dla lokacji ${locationId} w setupBirdSlots`);
}
}

  



// Dodaj zmienną globalną dla kontroli inicjalizacji
window.missionsInitialized = false;

function setupMissions() {
  console.log("=== PRÓBA INICJALIZACJI MISJI ===");
  
  // Zapobiegnij wielokrotnej inicjalizacji
  if (window.missionsInitializing) {
    console.log("Inicjalizacja już w toku - przerywam");
    return;
  }
  
  window.missionsInitializing = true;
  

  // Wymuś inicjalizację misji, jeśli nie istnieją
  if (!gameState.missions || gameState.missions.length === 0) {
    console.log("Brak misji - wymuszam inicjalizację!");
    if (typeof window.initDefaultMissions === 'function') {
      window.initDefaultMissions();
    }
  }
  
  if (!gameState.weeklyMissions || gameState.weeklyMissions.length === 0) {
    console.log("Brak misji tygodniowych - wymuszam inicjalizację!");
    if (typeof window.initDefaultWeeklyMissions === 'function') {
      window.initDefaultWeeklyMissions();
    }
  }



  // Sprawdź, czy gameState jest dostępny
  if (!window.gameState) {
    console.error("gameState nie jest dostępny");
    window.missionsInitializing = false;
    return;
  }
  
  console.log("Sprawdzam stan misji:", {
    gameState: !!window.gameState,
    dailyMissions: window.gameState?.missions,
    weeklyMissions: window.gameState?.weeklyMissions
  });
  
  // Znajdź kontenery
  const dailyContainer = document.getElementById('daily-missions-list');
  const weeklyContainer = document.getElementById('weekly-missions-list');
  
  if (!dailyContainer || !weeklyContainer) {
    console.error("Nie znaleziono kontenerów misji");
    window.missionsInitializing = false;
    return;
  }
  
  // Inicjalizuj misje jeśli nie istnieją
  if (!gameState.missions || gameState.missions.length === 0) {
    console.log("Inicjalizuję domyślne misje dzienne");
    if (typeof window.initDefaultMissions === 'function') {
      window.initDefaultMissions();
    }
  }
  
  if (!gameState.weeklyMissions || gameState.weeklyMissions.length === 0) {
    console.log("Inicjalizuję domyślne misje tygodniowe");
    if (typeof window.initDefaultWeeklyMissions === 'function') {
      window.initDefaultWeeklyMissions();
    }
  }
  
  // Wyczyść kontenery
  dailyContainer.innerHTML = '';
  weeklyContainer.innerHTML = '';
  
  // Renderuj misje dzienne
  if (gameState.missions && gameState.missions.length > 0) {
    console.log(`Renderuję ${gameState.missions.length} misji dziennych`);
    gameState.missions.forEach((mission, index) => {
      const missionDiv = createMissionElement(mission, index, false);
      dailyContainer.appendChild(missionDiv);
    });
  } else {
    console.warn("Brak misji dziennych do wyświetlenia");
    dailyContainer.innerHTML = '<div class="mission-item">Brak misji dziennych</div>';
  }
  
  // Renderuj misje tygodniowe
  if (gameState.weeklyMissions && gameState.weeklyMissions.length > 0) {
    console.log(`Renderuję ${gameState.weeklyMissions.length} misji tygodniowych`);
    gameState.weeklyMissions.forEach((mission, index) => {
      const missionDiv = createMissionElement(mission, index, true);
      weeklyContainer.appendChild(missionDiv);
    });
  } else {
    console.warn("Brak misji tygodniowych do wyświetlenia");
    weeklyContainer.innerHTML = '<div class="mission-item">Brak misji tygodniowych</div>';
  }
  
  // Aktualizuj timery
  updateMissionTimers();

      updateMissionBadge();
  
  window.missionsInitialized = true;
  window.missionsInitializing = false;
  console.log("=== INICJALIZACJA MISJI ZAKOŃCZONA ===");


// Dodaj na końcu funkcji setupMissions:
updateMissionBadge();
console.log("FORCE-UPDATE: Wywołano aktualizację badge z setupMissions");


}

// Funkcja pomocnicza do tworzenia elementu misji
function createMissionElement(mission, index, isWeekly) {
  const missionDiv = document.createElement('div');
  missionDiv.className = 'mission-item' + (isWeekly ? ' weekly-mission-item' : '');
  missionDiv.setAttribute('data-index', index);
  
  if (mission.completed && mission.rewarded) {
    missionDiv.classList.add('mission-rewarded');
  } else if (mission.completed) {
    missionDiv.classList.add('mission-complete', 'claimable');
  }
  
  const progressPercent = Math.floor((mission.progress / mission.target) * 100);
  
  let html = `
    <div class="mission-title">${mission.title}</div>
    ${mission.description ? `<div class="mission-description">${mission.description}</div>` : ''}
    <div class="mission-progress">
      <div class="mission-progress-bar" style="width: ${progressPercent}%"></div>
    </div>
    <div class="mission-status">${mission.progress}/${mission.target}</div>
    <div class="mission-reward">${t('missions.rewardLabel', { reward: mission.reward })}</div>
  `;
  
  missionDiv.innerHTML = html;
  
  if (mission.completed && !mission.rewarded) {
    const claimButton = document.createElement('button');
    claimButton.className = 'claim-reward-button';
    claimButton.textContent = t('missions.claim');
    claimButton.onclick = function() {
      if (isWeekly) {
        window.claimWeeklyMissionReward?.(index);
      } else {
        window.claimMissionReward?.(index);
      }
    };
    missionDiv.appendChild(claimButton);
  } else if (mission.completed && mission.rewarded) {
    const completedSpan = document.createElement('span');
    completedSpan.className = 'mission-completed';
    completedSpan.textContent = t('missions.status.completed');
    missionDiv.appendChild(completedSpan);
  }
  
  return missionDiv;
}

// Funkcja aktualizująca timery
function updateMissionTimers() {
  const dailyTimer = document.getElementById('daily-missions-timer');
  const weeklyTimer = document.getElementById('weekly-missions-timer');
  
  if (dailyTimer) {
    const now = new Date();
    const hoursToReset = 23 - now.getUTCHours();
    const minutesToReset = 59 - now.getUTCMinutes();
    dailyTimer.textContent = t('missions.resetTimerWithTime', { hours: hoursToReset, minutes: minutesToReset });
  }
  
  if (weeklyTimer) {
    weeklyTimer.textContent = t('missions.weeklyResetTimer');
  }
}



function addSeedCollectEffect(buttonElement) {
  // Utwórz element efektu
  const effect = document.createElement('div');
  effect.className = 'seed-effect';
  
  // Zamiast samego tekstu, dodaj tekst i ikonę ziarenka
  effect.innerHTML = '+1 <img src="assets/images/seed-icon.png" alt="Ziarenko" style="width: 16px; height: 16px; vertical-align: middle;">';
  
  // Dodaj do przycisku
  buttonElement.appendChild(effect);
  
  // Usuń po zakończeniu animacji
  setTimeout(() => {
      if (effect.parentNode) {
          effect.parentNode.removeChild(effect);
      }
  }, 1000);
}
  


// Funkcja obsługująca przyciski zbierania
function setupCollectionButtons() {
  console.log("Inicjalizacja przycisków zbierania - wersja kompatybilna z Chrome");
  
  // ============= PRZYCISK RĘCZNEGO ZBIERANIA =============
  // Znajdź przycisk ręcznego zbierania
  const collectButton = document.getElementById('collect-button');
  
  if (collectButton) {
      console.log("Znaleziono przycisk ręcznego zbierania - dodaję listenery");
      
      // Usuń wszystkie istniejące listenery, tworząc kopię przycisku
      const newCollectButton = collectButton.cloneNode(true);
      if (collectButton.parentNode) {
          collectButton.parentNode.replaceChild(newCollectButton, collectButton);
      }
      
      // Dodaj nowe listenery na 3 sposoby (dla maksymalnej kompatybilności)
      
      // 1. EventListener - Metoda addEventListener
      newCollectButton.addEventListener('click', function(e) {
          e.preventDefault(); // Zapobiega domyślnej akcji
          console.log("Kliknięto przycisk zbierania (addEventListener)");
          
          if (typeof window.addSeedManually === 'function') {
              window.addSeedManually();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else if (typeof addSeedManually === 'function') {
              addSeedManually();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else {
              console.error("Funkcja addSeedManually niedostępna!");
              showNotification(t('notifications.functionUnavailable', { functionName: 'addSeedManually' }));
          }
          
          return false;
      });
      
      // 2. Bezpośredni atrybut onclick
      newCollectButton.setAttribute('onclick', "event.preventDefault(); console.log('Kliknięto przycisk zbierania (onclick)'); if(typeof window.addSeedManually === 'function') {window.addSeedManually();} else if(typeof addSeedManually === 'function') {addSeedManually();} else {console.error('Funkcja addSeedManually niedostępna!'); showNotification('" + t('notifications.functionUnavailable', { functionName: 'addSeedManually' }) + "');}; return false;");
      
      // 3. Bezpośrednia właściwość onclick
      newCollectButton.onclick = function(e) {
          if (e) e.preventDefault();
          console.log("Kliknięto przycisk zbierania (właściwość onclick)");
          
          if (typeof window.addSeedManually === 'function') {
              window.addSeedManually();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else if (typeof addSeedManually === 'function') {
              addSeedManually();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else {
              console.error("Funkcja addSeedManually niedostępna!");
              showNotification(t('notifications.functionUnavailable', { functionName: 'addSeedManually' }));
          }
          
          return false;
      };
      
      // Sprawdź czy funkcja addSeedManually istnieje w globalnym scope
      console.log("Status funkcji addSeedManually w window:", typeof window.addSeedManually);
      console.log("Status funkcji addSeedManually bez window:", typeof addSeedManually);
  } else {
      console.error("Nie znaleziono przycisku zbierania (collect-button)");
  }
  
  // ============= PRZYCISK AUTO-ZBIERANIA =============
  // Znajdź przycisk auto-zbierania
  const collectAutoButton = document.getElementById('collect-auto-button');
  
  if (collectAutoButton) {
      console.log("Znaleziono przycisk auto-zbierania - dodaję listenery");
      
      // Usuń wszystkie istniejące listenery, tworząc kopię przycisku
      const newCollectAutoButton = collectAutoButton.cloneNode(true);
      if (collectAutoButton.parentNode) {
          collectAutoButton.parentNode.replaceChild(newCollectAutoButton, collectAutoButton);
      }
      
      // Dodaj nowe listenery na 3 sposoby (dla maksymalnej kompatybilności)
      
      // 1. EventListener - Metoda addEventListener
      newCollectAutoButton.addEventListener('click', function(e) {
          e.preventDefault();
          console.log("Kliknięto przycisk auto-zbierania (addEventListener)");
          
          if (typeof window.collectAutoSeeds === 'function') {
              window.collectAutoSeeds();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else if (typeof collectAutoSeeds === 'function') {
              collectAutoSeeds();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else {
              console.error("Funkcja collectAutoSeeds niedostępna!");
              showNotification(t('notifications.functionUnavailable', { functionName: 'collectAutoSeeds' }));
          }
          
          return false;
      });
      
      // 2. Bezpośredni atrybut onclick
      newCollectAutoButton.setAttribute('onclick', "event.preventDefault(); console.log('Kliknięto przycisk auto-zbierania (onclick)'); if(typeof window.collectAutoSeeds === 'function') {window.collectAutoSeeds();} else if(typeof collectAutoSeeds === 'function') {collectAutoSeeds();} else {console.error('Funkcja collectAutoSeeds niedostępna!'); showNotification('" + t('notifications.functionUnavailable', { functionName: 'collectAutoSeeds' }) + "');}; return false;");
      
      // 3. Bezpośrednia właściwość onclick
      newCollectAutoButton.onclick = function(e) {
          if (e) e.preventDefault();
          console.log("Kliknięto przycisk auto-zbierania (właściwość onclick)");
          
          if (typeof window.collectAutoSeeds === 'function') {
              window.collectAutoSeeds();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else if (typeof collectAutoSeeds === 'function') {
              collectAutoSeeds();
              // NIE wywołujemy addSeedCollectEffect tutaj
          } else {
              console.error("Funkcja collectAutoSeeds niedostępna!");
              showNotification(t('notifications.functionUnavailable', { functionName: 'collectAutoSeeds' }));
          }
          
          return false;
      };
      
      // Sprawdź czy funkcja collectAutoSeeds istnieje w globalnym scope
      console.log("Status funkcji collectAutoSeeds w window:", typeof window.collectAutoSeeds);
      console.log("Status funkcji collectAutoSeeds bez window:", typeof collectAutoSeeds);
  } else {
      console.error("Nie znaleziono przycisku auto-zbierania (collect-auto-button)");
  }
  
  // Aktualizuj pasek postępu
  updateAutoCollectProgressBar();
}

// Poprawione globalne funkcje dla przycisków - BEZ wywoływania efektów
window.manualCollect = function() {
  console.log("Wywołano globalną funkcję manualCollect");
  if (typeof window.addSeedManually === 'function') {
      window.addSeedManually();
      // NIE wywołujemy addSeedCollectEffect tutaj
  } else if (typeof addSeedManually === 'function') {
      addSeedManually();
      // NIE wywołujemy addSeedCollectEffect tutaj
  } else {
      console.error("Funkcja addSeedManually niedostępna!");
  }

// Dodatkowe zabezpieczenie - naprawa przycisków mitycznych ptaków
if (typeof fixMythicalFeedButtons === 'function') {
  setTimeout(fixMythicalFeedButtons, 100);
}


};

window.autoCollect = function() {
  console.log("Wywołano globalną funkcję autoCollect");
  if (typeof window.collectAutoSeeds === 'function') {
      window.collectAutoSeeds();
      // NIE wywołujemy addSeedCollectEffect tutaj
  } else if (typeof collectAutoSeeds === 'function') {
      collectAutoSeeds();
      // NIE wywołujemy addSeedCollectEffect tutaj
  } else {
      console.error("Funkcja collectAutoSeeds niedostępna!");
  }
};



// Całkowicie przepisana funkcja aktualizująca badge misji
function updateMissionBadge() {
    console.log("FORCE-UPDATE: Uruchamiam wymuszoną aktualizację badge misji");
    
    // 1. Sprawdź stan misji dziennych i tygodniowych
    const hasDailyClaimable = gameState.missions && 
        gameState.missions.some(m => m.completed === true && m.rewarded !== true);
    
    const hasWeeklyClaimable = gameState.weeklyMissions && 
        gameState.weeklyMissions.some(m => m.completed === true && m.rewarded !== true);
    
    console.log("FORCE-UPDATE: Misje dzienne do odebrania:", hasDailyClaimable);
    console.log("FORCE-UPDATE: Misje tygodniowe do odebrania:", hasWeeklyClaimable);
    
    // 2. Znajdź przycisk misji - spróbuj różne selektory 
    const missionButtons = [
        document.querySelector('.nav-button[data-screen="missions-screen"]'),
        document.querySelector('a[href="#missions-screen"]'),
        document.querySelector('.missions-button'),
        document.querySelector('button[data-screen="missions-screen"]'),
        document.querySelector('.nav-button:nth-child(5)'), // Zakładając, że to 5. przycisk
        document.getElementById('missions-nav-button'),
        // Dolny pasek nawigacji na zrzucie ekranu
        document.querySelector('.nav-button:contains("Misje")'),
        document.querySelector('button:contains("Misje")'),
        document.querySelector('a:contains("Misje")')
    ].filter(button => button !== null);
    
    if (missionButtons.length === 0) {
        console.error("FORCE-UPDATE: Nie znaleziono przycisku misji!");
        
        // Ostatnia deska ratunku - znajdź wszystkie przyciski i dodaj do 5. z nich
        const allButtons = document.querySelectorAll('.nav-button, button, a');
        if (allButtons.length >= 5) {
            missionButtons.push(allButtons[4]); // 5. przycisk
        } else {
            return; // Nie znaleziono przycisku
        }
    }
    
    console.log("FORCE-UPDATE: Znaleziono przyciski misji:", missionButtons.length);
    
    // 3. Dla każdego znalezionego przycisku dodaj czerwoną kropkę
    missionButtons.forEach(button => {
        // Usuń stare kropki z tego przycisku
        const oldBadges = button.querySelectorAll('.mission-badge, .badge, #missions-badge, .mission-badge-dot');
        oldBadges.forEach(badge => badge.remove());
        
        if (hasDailyClaimable || hasWeeklyClaimable) {
            console.log("FORCE-UPDATE: Dodaję czerwoną kropkę do przycisku");
            
            // Dodaj nową czerwoną kropkę
            const badge = document.createElement('div');
            badge.className = 'mission-badge-dot';
            badge.id = 'missions-badge-forced';
            badge.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
                width: 12px !important;
                height: 12px !important;
                background-color: red !important;
                border-radius: 50% !important;
                z-index: 9999 !important;
                display: block !important;
                visibility: visible !important;
                pointer-events: none !important;
            `;
            
            // Upewnij się, że przycisk ma position relative
            const currentPosition = window.getComputedStyle(button).position;
            if (currentPosition === 'static') {
                button.style.position = 'relative';
            }
            
            button.appendChild(badge);
        }
    });
    
    // 4. Dodaj badge do elementu body jako rozwiązanie awaryjne
    if ((hasDailyClaimable || hasWeeklyClaimable) && missionButtons.length > 0) {
        const bodyBadge = document.getElementById('mission-body-badge');
        if (!bodyBadge) {
            const button = missionButtons[0];
            const rect = button.getBoundingClientRect();
            
            const badge = document.createElement('div');
            badge.id = 'mission-body-badge';
            badge.style.cssText = `
                position: fixed !important;
                top: ${rect.top}px !important;
                left: ${rect.right - 10}px !important;
                width: 15px !important;
                height: 15px !important;
                background-color: red !important;
                border-radius: 50% !important;
                z-index: 10000 !important;
                display: block !important;
                visibility: visible !important;
                pointer-events: none !important;
            `;
            
            document.body.appendChild(badge);
        }
    } else {
        const bodyBadge = document.getElementById('mission-body-badge');
        if (bodyBadge) {
            bodyBadge.remove();
        }
    }
}

// Wywołaj funkcję regularnie
setInterval(updateMissionBadge, 2000);

// Wywołaj przy każdym kliknięciu
document.addEventListener('click', function() {
    setTimeout(updateMissionBadge, 300);
});

// Wywołaj przy ładowaniu
window.addEventListener('load', function() {
    setTimeout(updateMissionBadge, 1000);
    setTimeout(updateMissionBadge, 3000);
    setTimeout(updateMissionBadge, 5000);
});

// Wywołaj po każdej zmianie ekranu
document.querySelectorAll('.nav-button, a, button').forEach(button => {
    button.addEventListener('click', function() {
        setTimeout(updateMissionBadge, 500);
    });
});

  
  // Aktualizacja przycisków ulepszeń
  function updateUpgradeButtons() {
    // Aktualizuj przycisk ulepszenia pojemności
    const capacityButton = document.querySelector('.upgrade-button[data-upgrade="auto-capacity"]');
    if (capacityButton) {
      const cost = 20 + (gameState.upgrades.autoCapacity * 10);
      capacityButton.textContent = t('production.upgradeButton', { amount: cost });
    }
    
    // Aktualizuj przycisk ulepszenia szybkości
    const speedButton = document.querySelector('.upgrade-button[data-upgrade="auto-speed"]');
    if (speedButton) {
      const cost = 30 + (gameState.upgrades.autoSpeed * 15);
      speedButton.textContent = t('production.upgradeButton', { amount: cost });
    }
  }
  
  
  
  // Funkcja do ponownej inicjalizacji przycisków ulepszeń
  function setupUpgradeButtons() {
    console.log("Inicjalizacja przycisków ulepszeń");
    
    // Usuń poprzednie event listenery
    document.querySelectorAll('.upgrade-button').forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });
    
    // Dodaj nowe event listenery
    document.querySelectorAll('.upgrade-button').forEach(button => {
      button.addEventListener('click', function() {
        const upgradeType = this.getAttribute('data-upgrade');
        console.log("Kliknięto ulepszenie: " + upgradeType);
        purchaseUpgrade(upgradeType);
      });
    });
    
    // Aktualizuj koszty
    updateUpgradeButtons();
  }
  
  


// Obsługa ekranu portfela
function setupWalletScreen() {
  console.log("Inicjalizacja ekranu portfela - NOWA WERSJA");
  
  // ===== KONWERSJA DZIUBCOINÓW NA OWOCE =====
  setupCoinsToFruitsConversion();
  
  // ===== KONWERSJA OWOCÓW NA DZIUBCOINY =====
  setupFruitsToCoinsConversion();
  
  // ===== POZOSTAŁE ELEMENTY EKRANU PORTFELA =====
  setupOtherWalletElements();
}

// Funkcja ustawiająca konwersję DziubCoinów na owoce
function setupCoinsToFruitsConversion() {
  console.log("Ustawianie konwersji DziubCoinów na owoce");
  
  // Pobierz elementy UI
  const coinsInput = document.getElementById('coins-input');
  const fruitsFromCoins = document.getElementById('fruits-from-coins');
  const convertCoinsButton = document.getElementById('convert-coins-button');
  
  // Sprawdź czy wszystkie elementy zostały znalezione
  if (!coinsInput || !fruitsFromCoins || !convertCoinsButton) {
      console.error("Nie znaleziono elementów konwersji DziubCoinów na owoce:", {
          coinsInput, fruitsFromCoins, convertCoinsButton
      });
      return;
  }
  
  console.log("Znaleziono wszystkie elementy konwersji DC->owoce");
  
  // Obsługa aktualizacji wartości przy wpisywaniu
  coinsInput.oninput = function() {
      const coins = parseFloat(this.value) || 0;
      const fruits = coins / 100; // 100 DC = 1 owoc
      fruitsFromCoins.textContent = formatNumber(fruits, 2);
      
 
      



// Podświetl przycisk, jeśli wartość jest prawidłowa
      if (coins > 0 && coins <= gameState.resources.coins) {
          convertCoinsButton.classList.add('highlight');
          convertCoinsButton.disabled = false;
      } else {
          convertCoinsButton.classList.remove('highlight');
          convertCoinsButton.disabled = true;
      }
  };
  
  // Obsługa kliknięcia przycisku konwersji
  convertCoinsButton.onclick = function() {
      console.log("Kliknięto przycisk konwersji DC->owoce");
      
      // Pobierz wartość
      const coins = parseFloat(coinsInput.value) || 0;
      
      // Sprawdź poprawność
      if (coins <= 0) {
          showNotification(t('notifications.enterValidValue'));
          return false;
      }
      
      if (coins > gameState.resources.coins) {
          showNotification(t('notifications.notEnoughCoins'));
          return false;
      }
      
      // Oblicz ilość owoców
      const fruits = coins / 100;
      
      // Aktualizuj stan gry
      gameState.resources.coins -= coins;
      gameState.resources.fruits += fruits;
      
      // Formatuj wartości do wyświetlenia
      const formattedFruits = formatNumber(fruits, 2);
      
      // Pokaż komunikat
      showNotification(t('notifications.convertedCoinsToFruits', { amount: coins, fruits: formattedFruits }));
      
      // Pokaż animację
      showNotification(t('notifications.receivedFruitsForCoins', { fruits: fruits, coins: coins }));


      // Pokaż animację nagrody
      const convertButton = document.getElementById('convert-coins-button');
      if (convertButton) {
          showRewardAnimation(`+${fruits} ${t('resources.fruitsIcon')}`, convertButton);
      }


      
      // Wyczyść pola
      coinsInput.value = "";
      fruitsFromCoins.textContent = "0,00";
      
      // Aktualizuj UI i zapisz stan gry
      updateUI();
      saveGame();
      
      return false;
  };
}

// Funkcja ustawiająca konwersję owoców na DziubCoiny
function setupFruitsToCoinsConversion() {
  console.log("Ustawianie konwersji owoców na DziubCoiny");
  
  // Pobierz elementy UI
  const fruitsInput = document.getElementById('fruits-input');
  const coinsFromFruits = document.getElementById('coins-from-fruits');
  const convertFruitsButton = document.getElementById('convert-fruits-button');
  
  // Sprawdź czy wszystkie elementy zostały znalezione
  if (!fruitsInput || !coinsFromFruits || !convertFruitsButton) {
      console.error("Nie znaleziono elementów konwersji owoców na DziubCoiny:", {
          fruitsInput, coinsFromFruits, convertFruitsButton
      });
      return;
  }
  
  console.log("Znaleziono wszystkie elementy konwersji owoce->DC");
  
  // Obsługa aktualizacji wartości przy wpisywaniu
  fruitsInput.oninput = function() {
      const fruits = parseFloat(this.value) || 0;
      const coins = fruits * 90; // 1 owoc = 90 DziubCoinów
      coinsFromFruits.textContent = Math.floor(coins);
      
      // Podświetl przycisk, jeśli wartość jest prawidłowa
      if (fruits > 0 && fruits <= gameState.resources.fruits) {
          convertFruitsButton.classList.add('highlight');
          convertFruitsButton.disabled = false;
      } else {
          convertFruitsButton.classList.remove('highlight');
          convertFruitsButton.disabled = true;
      }
  };
  
  // Obsługa kliknięcia przycisku konwersji
  convertFruitsButton.onclick = function() {
      console.log("Kliknięto przycisk konwersji owoce->DC");
      
      // Pobierz wartość
      const fruits = parseFloat(fruitsInput.value) || 0;
      
      // Sprawdź poprawność
      if (fruits <= 0) {
          showNotification(t('notifications.enterValidValue'));
          return false;
      }
      
      if (fruits > gameState.resources.fruits) {
          showNotification(t('notifications.notEnoughFruits'));
          return false;
      }
      
      // Oblicz ilość monet i zaokrąglij w dół do pełnych wartości
      const coins = Math.floor(fruits * 90);
      
      // Aktualizuj stan gry
      gameState.resources.fruits = parseFloat((gameState.resources.fruits - fruits).toFixed(2));
      gameState.resources.coins += coins;
      
      // Formatuj wartości do wyświetlenia
      const formattedFruits = formatNumber(fruits, 2);
      
      // Pokaż komunikat
      showNotification(t('notifications.convertedFruitsToCoins', { amount: formattedFruits, coins: coins }));
      
      // Pokaż animację
      showRewardAnimation(`+${coins} 💰`, convertFruitsButton);
      
      // Wyczyść pola
      fruitsInput.value = "";
      coinsFromFruits.textContent = "0";
      
      // Aktualizuj UI i zapisz stan gry
      updateUI();
      saveGame();
      
      return false;
  };
}


// Funkcja ustawiająca pozostałe elementy ekranu portfela
function setupOtherWalletElements() {
  // Przycisk oglądania reklamy
  const watchAdButton = document.getElementById('watch-ad-button');
  if (watchAdButton) {
      watchAdButton.onclick = function() {
          showNotification(t('notifications.adsFeatureSoon'));
          return false;
      };
  }
  
  // Przycisk wypłaty
  const withdrawButton = document.querySelector('.withdraw-button');
  if (withdrawButton) {
      withdrawButton.onclick = function() {
          showNotification(t('notifications.withdrawFeatureSoon'));
          return false;
      };
  }
  
  // Aktualizuj wyświetlane saldo TON
  const balanceAmount = document.querySelector('.balance-amount');
  if (balanceAmount) {
      balanceAmount.textContent = formatNumber(gameState.resources.ton || 0.000, 3) + ' TON';
      console.log("Zaktualizowano saldo TON na ekranie portfela:", gameState.resources.ton);
  } else {
      console.error("Nie znaleziono elementu .balance-amount na ekranie portfela!");
  }
}
    



  
  // Dodanie bezpośrednich listenerów do przycisków nawigacji dla misji i portfela
  function setupMissionsAndAchievementsTabs() {
    console.log("Konfiguracja zakładek misji i portfela");
  
    // Dodaj bezpośredni listener do przycisku misji
    const missionsButton = document.querySelector('.nav-button[data-screen="missions-screen"]');
    if (missionsButton) {
      missionsButton.addEventListener('click', function() {
        console.log("Kliknięto przycisk misji");
        // Wyczyść i skonfiguruj UI misji
        setupMissions();
      });
    } else {
      console.error("Nie znaleziono przycisku misji");
    }
  
    // Dodaj bezpośredni listener do przycisku portfela (zmieniony z osiągnięć)
    const walletButton = document.querySelector('.nav-button[data-screen="wallet-screen"]');
    if (walletButton) {
      walletButton.addEventListener('click', function() {
        console.log("Kliknięto przycisk portfela");
        // Wywołaj funkcję konfigurującą ekran portfela
        setupWalletScreen();
      });
    } else {
      console.error("Nie znaleziono przycisku portfela");
    }
  }
  
  // Inicjalizacja UI przy starcie
  window.addEventListener('DOMContentLoaded', () => {
    console.log("Inicjalizacja ui.js - DOMContentLoaded");
    
    // Sprawdź dostępność funkcji zbierania
    console.log("Sprawdzanie dostępności funkcji zbierania:");
    console.log("addSeedManually:", typeof addSeedManually);
    console.log("collectAutoSeeds:", typeof collectAutoSeeds);
  
    // Poczekaj krótko, aby upewnić się, że DOM jest w pełni gotowy
    setTimeout(() => {
      // Konfiguracja ekranów i slotów
      setupScreens();
      setupBirdSlots();
      setupMissions();
      setupUpgradeButtons();
      setupMissionsAndAchievementsTabs();
      setupWalletScreen();
      setupCollectionButtons(); // Dodana inicjalizacja przycisków zbierania
   
      
  
    
  
      // Dodatkowa weryfikacja trzeciego, czwartego i piątego slotu
      setTimeout(() => {
        [2, 3, 4].forEach(slotIndex => {
          const slot = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
          if (slot && gameState.unlockedSlots[slotIndex]) {
            console.log(`Weryfikacja slotu ${slotIndex} - powinien być odblokowany`);
            // Sprawdź, czy slot ma wszystkie potrzebne elementy
            updateBirdSlotUI(slot, slotIndex);
            
            // Sprawdź, czy slot ma ptaka, jeśli nie, spróbuj go wygenerować
            if (!gameState.birdSlots[slotIndex].isActive) {
              console.log(`Slot ${slotIndex} nie ma ptaka - generuję`);
              trySpawnBirdInSlot(slotIndex);
              // Aktualizuj UI jeszcze raz
              setTimeout(() => {
                updateBirdSlotUI(slot, slotIndex);
              }, 200);
            }
          }
        });
      }, 500);
    }, 100);
  
  
    
  
   


// Co 30 sekund aktualizuj timery misji
setInterval(() => {
  if (document.querySelector('.game-screen.active#missions-screen')) {
    const dailyTimer = document.getElementById('daily-missions-timer');
    const weeklyTimer = document.getElementById('weekly-missions-timer');
    
    if (dailyTimer) {
      const now = new Date();
      const hoursToReset = 23 - now.getUTCHours();
      const minutesToReset = 59 - now.getUTCMinutes();
      dailyTimer.textContent = t('missions.resetTimerWithTime', { hours: hoursToReset, minutes: minutesToReset });
    }
    
    if (weeklyTimer) {
      const now = new Date();
      // Obliczamy czas do następnej soboty o północy UTC
      const currentDay = now.getUTCDay(); // 0 = niedziela, 6 = sobota
      
      // Obliczamy dni do następnej soboty
      // Jeśli dziś jest sobota, dodajemy 7 dni, w przeciwnym razie obliczamy dni do soboty
      const daysToReset = currentDay === 6 ? 
          // Jeśli dziś sobota, sprawdzamy czy minęła północ UTC
          (now.getUTCHours() === 0 && now.getUTCMinutes() === 0 && now.getUTCSeconds() === 0) ? 7 : 7 : 
          // W przeciwnym razie, obliczamy dni do soboty
          (6 - currentDay) % 7;
      
      // Obliczamy godziny i minuty do północy UTC
      const hoursToReset = (daysToReset === 0 && currentDay === 6) ? 0 : 23 - now.getUTCHours();
      const minutesToReset = 59 - now.getUTCMinutes();
      
      weeklyTimer.textContent = t('missions.weeklyResetTimerWithTime', { days: daysToReset, hours: hoursToReset, minutes: minutesToReset });
    }
  }
}, 30000);






  });
  
  // Dodaj również obsługę zdarzenia load (na wypadek, gdyby DOMContentLoaded już wystąpił)
  window.addEventListener('load', () => {
    console.log("Inicjalizacja ui.js - load event");
  
    // Zabezpieczenie - sprawdź czy elementy UI istnieją i czy nawigacja działa
    setTimeout(() => {
      const activeScreen = document.querySelector('.game-screen.active');
      if (!activeScreen) {
        console.log("Brak aktywnego ekranu - próba naprawy");
        // Pokaż domyślny ekran
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
          mainScreen.classList.add('active');
          console.log("Aktywowano ekran główny");
        }
      }
      
      // Reinicjalizacja slotów ptaków
      setupBirdSlots();
      
      // Spróbuj zainicjalizować misje i ekran portfela ponownie
      setupMissions();
      setupWalletScreen();
      
      // Ważne: inicjalizacja przycisków zbierania
      setupCollectionButtons();
    }, 500);
  
    // Drugi timeout dla przypisania bezpośrednich onclick, jeśli event listenery nie działają
    setTimeout(() => {
      console.log("Dodaję bezpośrednie onclick na przyciski nawigacji");
      
      document.querySelectorAll('.nav-button').forEach(button => {
        button.onclick = function() {
          const screenId = this.getAttribute('data-screen');
          console.log("Kliknięto przycisk nawigacji (onclick): " + screenId);
          
          // Ukryj wszystkie ekrany
          document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
          });
          
          // Pokaż wybrany ekran
          const targetScreen = document.getElementById(screenId);
          if (targetScreen) {
            targetScreen.classList.add('active');
            
            // Jeśli przejście do ekranu ptaków, aktualizuj sloty
            if (screenId === 'feed-screen') {
              setupBirdSlots();
            }
            
            // Jeśli przejście do ekranu misji, zaktualizuj misje
            if (screenId === 'missions-screen') {
              setupMissions();
            }
            
            // Jeśli przejście do ekranu portfela, zaktualizuj portfel
            if (screenId === 'wallet-screen') {
              setupWalletScreen();
            }
            
            // Zawsze reinicjalizuj przyciski zbierania
            setupCollectionButtons();
          }
        };
      });
  
      // Dodaj bezpośrednie onclick na przyciski odblokowania slotów
      document.querySelectorAll('.unlock-button').forEach(button => {
        button.onclick = function() {
          const slot = this.closest('.bird-slot');
          if (slot) {
            const slotIndex = slot.getAttribute('data-slot');
            console.log("Kliknięto przycisk odblokowania slotu (onclick):", slotIndex);
            // Odblokuj slot i zaktualizuj UI
            if (unlockBirdSlot(slotIndex)) {
              // Dodatkowy timeout dla pewności
              setTimeout(() => {
                setupBirdSlots();
              }, 200);
            }
          }
        };
      });
      
      // Bezpośrednie przypisanie onClick dla przycisków zbierania
      const collectButton = document.getElementById('collect-button');
      if (collectButton) {
        collectButton.onclick = function() {
          console.log("Bezpośrednie kliknięcie przycisku zbierania");
          if (typeof window.addSeedManually === 'function') {
            window.addSeedManually();
          } else if (typeof addSeedManually === 'function') {
            addSeedManually();
          } else {
            console.error("Funkcja addSeedManually niedostępna!");
          }
        };
      }
      
      const collectAutoButton = document.getElementById('collect-auto-button');
      if (collectAutoButton) {
        collectAutoButton.onclick = function() {
          console.log("Bezpośrednie kliknięcie przycisku auto-zbierania");
          if (typeof window.collectAutoSeeds === 'function') {
            window.collectAutoSeeds();
          } else if (typeof collectAutoSeeds === 'function') {
            collectAutoSeeds();
          } else {
            console.error("Funkcja collectAutoSeeds niedostępna!");
          }
        };
      }
    }, 1000);
  });
  
  // Aktualizacja UI misji
  function updateMissionsUI() {
    console.log("Aktualizacja UI misji");
    setupMissions();
  }
  
  // Testowe funkcje pomocnicze dostępne globalnie
  window.testAddSeed = function() {
    console.log("Test zbierania ziarenek");
    if (typeof addSeedManually === 'function') {
      addSeedManually();
    } else {
      console.error("Funkcja addSeedManually nie jest dostępna!");
      showNotification(t('notifications.functionUnavailable', { functionName: 'addSeedManually' }));
    }
  };
  
  window.testCollectAuto = function() {
    console.log("Test zbierania auto-ziarenek");
    if (typeof collectAutoSeeds === 'function') {
      collectAutoSeeds();
    } else {
      console.error("Funkcja collectAutoSeeds nie jest dostępna!");
      showNotification(t('notifications.functionUnavailable', { functionName: 'collectAutoSeeds' }));
    }
  };
  
  // Debugowanie globalne - funkcja pomocnicza do wywołania z konsoli przeglądarki
  window.debugUI = function() {
    console.log("=== DEBUG UI ===");
    console.log("Aktywny ekran:", document.querySelector('.game-screen.active')?.id);
    console.log("Przycisk zbierania:", document.getElementById('collect-button'));
    console.log("Przycisk auto-zbierania:", document.getElementById('collect-auto-button'));
    console.log("Funkcja addSeedManually:", typeof addSeedManually);
    console.log("Funkcja collectAutoSeeds:", typeof collectAutoSeeds);
    console.log("===============");
  };


  // Dodaj poniższe funkcje do pliku ui.js

// Funkcja aktualizująca pasek postępu auto-zbierania
function updateAutoCollectProgressBar() {
  const progressBar = document.getElementById('auto-collect-progress-bar');
  if (!progressBar) return;
  
  const currentAmount = gameState.resources.autoSeedAmount || 0;
  const maxAmount = gameState.resources.autoCollectLimit || 20;
  
  // Oblicz procent wypełnienia
  const fillPercentage = (currentAmount / maxAmount) * 100;
  
  // Ustaw szerokość paska
  progressBar.style.width = `${fillPercentage}%`;
  
  // Dodaj klasę pulsowania, gdy zbieracz jest pełny
  if (currentAmount >= maxAmount) {
      document.getElementById('collect-auto-button').classList.add('pulse-animation');
  } else {
      document.getElementById('collect-auto-button').classList.remove('pulse-animation');
  }
}






// Funkcja dodająca efekt wizualny przy zbieraniu ziarenek
function addSeedCollectEffect(buttonElement) {
  // Utwórz element efektu
  const effect = document.createElement('div');
  effect.className = 'seed-effect';
  effect.textContent = '+1';
  
  // Dodaj do przycisku
  buttonElement.appendChild(effect);
  
  // Usuń po zakończeniu animacji
  setTimeout(() => {
      if (effect.parentNode) {
          effect.parentNode.removeChild(effect);
      }
  }, 1000);
  
}







// Zmodyfikowana funkcja inicjalizująca przyciski zbierania
function setupCollectionButtons() {
  console.log("Inicjalizacja przycisków zbierania - nowa wersja");
  
  // Przycisk ręcznego zbierania
  const collectButton = document.getElementById('collect-button');
  if (collectButton) {
      collectButton.onclick = function() {
          console.log("Kliknięto przycisk ręcznego zbierania");
          if (typeof addSeedManually === 'function') {
              // Dodaj efekt wizualny przed wywołaniem głównej funkcji
              addSeedCollectEffect(collectButton);
              addSeedManually();
          } else {
              console.error("Funkcja addSeedManually nie jest dostępna!");
          }
      };
  } else {
      console.error("Nie znaleziono przycisku zbierania (collect-button)");
  }
  
  // Przycisk auto-zbierania
  const collectAutoButton = document.getElementById('collect-auto-button');
  if (collectAutoButton) {
      collectAutoButton.onclick = function() {
          console.log("Kliknięto przycisk auto-zbierania");
          if (typeof collectAutoSeeds === 'function') {
              collectAutoSeeds();
              
              // Sprawdź czy faktycznie zebrano jakieś ziarenka
              if (gameState.resources.autoSeedAmount > 0) {
                  // Odtwórz animację tylko jeśli było co zbierać
                  addSeedCollectEffect(collectAutoButton);
              }
          } else {
              console.error("Funkcja collectAutoSeeds nie jest dostępna!");
          }
      };
  } else {
      console.error("Nie znaleziono przycisku auto-zbierania (collect-auto-button)");
  }
  
  // Aktualizuj pasek postępu
  updateAutoCollectProgressBar();
}

// Dodawanie pulsowania do przycisków, gdy można wykonać ulepszenie
function updateUpgradeButtonsState() {
  const capacityButton = document.querySelector('.upgrade-button[data-upgrade="auto-capacity"]');
  const speedButton = document.querySelector('.upgrade-button[data-upgrade="auto-speed"]');
  
  if (capacityButton) {
      const capacityCost = 20 + (gameState.upgrades.autoCapacity * 10);
      capacityButton.textContent = t('production.upgradeButton', { amount: capacityCost });
      
      // Dodaj/usuń pulsowanie w zależności od dostępności środków
      if (gameState.resources.coins >= capacityCost) {
          capacityButton.classList.add('pulse-animation');
          capacityButton.disabled = false;
      } else {
          capacityButton.classList.remove('pulse-animation');
          capacityButton.disabled = true;
      }
  }
  
  if (speedButton) {
      const speedCost = 30 + (gameState.upgrades.autoSpeed * 15);
      speedButton.textContent = t('production.upgradeButton', { amount: speedCost });
      
      // Dodaj/usuń pulsowanie w zależności od dostępności środków
      if (gameState.resources.coins >= speedCost) {
          speedButton.classList.add('pulse-animation');
          speedButton.disabled = false;
      } else {
          speedButton.classList.remove('pulse-animation');
          speedButton.disabled = true;
      }
  }
}





// Rozszerz funkcję updateUI o nowe elementy
function updateProductionScreenUI() {
  // Aktualizuj liczniki auto-zbieracza
  const autoCountElement = document.getElementById('auto-count');
  const autoLimitElement = document.getElementById('auto-limit');
  
  if (autoCountElement && autoLimitElement) {
      autoCountElement.textContent = gameState.resources.autoSeedAmount;
      autoLimitElement.textContent = gameState.resources.autoCollectLimit;
  }
  
  // Aktualizuj pasek postępu
  updateAutoCollectProgressBar();
  
  // Aktualizuj stan przycisków ulepszeń
  updateUpgradeButtonsState();
}

// Dodaj nową funkcję do istniejącej updateUI
const originalUpdateUI = window.updateUI || function() {};
window.updateUI = function() {
  // Wywołaj oryginalną funkcję
  originalUpdateUI();
  
  // Dodaj nowe funkcjonalności
  updateProductionScreenUI();
};

// Inicjalizuj nowe elementy UI na ekranie produkcji
function initProductionScreen() {
  console.log("Inicjalizacja nowego ekranu produkcji");
  
 
  
  // Inicjalizuj przyciski
  setupCollectionButtons();
  setupUpgradeButtons();
  
  // Napraw problem podwójnych animacji
  fixAnimations();
  
  // Aktualizuj UI
  updateProductionScreenUI();
}

// Dodaj wywołanie inicjalizacji do istniejących eventów
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initProductionScreen, 500);
});

// Dodaj event na przełączenie do ekranu produkcji
document.querySelectorAll('.nav-button[data-screen="production-screen"]').forEach(button => {
  button.addEventListener('click', function() {
      setTimeout(initProductionScreen, 100);
  });


// Funkcja aktualizująca pasek postępu auto-zbierania
function updateAutoCollectProgressBar() {
  const progressBar = document.getElementById('auto-collect-progress-bar');
  if (!progressBar) return;
  
  const currentAmount = gameState.resources.autoSeedAmount || 0;
  const maxAmount = gameState.resources.autoCollectLimit || 20;
  
  // Oblicz procent wypełnienia
  const fillPercentage = (currentAmount / maxAmount) * 100;
  
  // Ustaw szerokość paska
  progressBar.style.width = `${fillPercentage}%`;
  
  // Dodaj klasę pulsowania, gdy zbieracz jest pełny
  if (currentAmount >= maxAmount) {
      document.getElementById('collect-auto-button').classList.add('pulse-animation');
  } else {
      document.getElementById('collect-auto-button').classList.remove('pulse-animation');
  }
}


// Dodawanie pulsowania do przycisków, gdy można wykonać ulepszenie
function updateUpgradeButtonsState() {
  const capacityButton = document.querySelector('.upgrade-button[data-upgrade="auto-capacity"]');
  const speedButton = document.querySelector('.upgrade-button[data-upgrade="auto-speed"]');
  
  if (capacityButton) {
      const capacityCost = 20 + (gameState.upgrades.autoCapacity * 10);
      capacityButton.textContent = t('production.upgradeButton', { amount: capacityCost });
      
      // Dodaj/usuń pulsowanie w zależności od dostępności środków
      if (gameState.resources.coins >= capacityCost) {
          capacityButton.classList.add('pulse-animation');
          capacityButton.disabled = false;
      } else {
          capacityButton.classList.remove('pulse-animation');
          capacityButton.disabled = true;
      }
  }
  
  if (speedButton) {
      const speedCost = 30 + (gameState.upgrades.autoSpeed * 15);
      speedButton.textContent = t('production.upgradeButton', { amount: speedCost });
      
      // Dodaj/usuń pulsowanie w zależności od dostępności środków
      if (gameState.resources.coins >= speedCost) {
          speedButton.classList.add('pulse-animation');
          speedButton.disabled = false;
      } else {
          speedButton.classList.remove('pulse-animation');
          speedButton.disabled = true;
      }
  }
}

// Rozszerz funkcję updateUI o nowe elementy
function updateProductionScreenUI() {
  // Aktualizuj liczniki auto-zbieracza
  const autoCountElement = document.getElementById('auto-count');
  const autoLimitElement = document.getElementById('auto-limit');
  
  if (autoCountElement && autoLimitElement) {
      autoCountElement.textContent = gameState.resources.autoSeedAmount;
      autoLimitElement.textContent = gameState.resources.autoCollectLimit;
  }
  
  // Aktualizuj pasek postępu
  updateAutoCollectProgressBar();
  
  // Aktualizuj stan przycisków ulepszeń
  updateUpgradeButtonsState();
}

// Dodaj nową funkcję do istniejącej updateUI
const originalUpdateUI = window.updateUI || function() {};
window.updateUI = function() {
  // Wywołaj oryginalną funkcję
  originalUpdateUI();
  
  // Dodaj nowe funkcjonalności
  updateProductionScreenUI();

 
};

// Inicjalizuj nowe elementy UI na ekranie produkcji
function initProductionScreen() {
  console.log("Inicjalizacja nowego ekranu produkcji");
  
  // Usuń przycisk odświeżania zasobów gry
  const refreshButton = document.getElementById('force-refresh-button');
  if (refreshButton && refreshButton.parentNode) {
      refreshButton.parentNode.removeChild(refreshButton);
      console.log("Usunięto przycisk odświeżania zasobów gry");
  }
  
  // Inicjalizuj przyciski
  setupCollectionButtons();
  setupUpgradeButtons();
  
  // Aktualizuj UI
  updateProductionScreenUI();
  
  // Modyfikujemy oryginalne funkcje
  enhanceAddSeedManually();
}

// Dodaj wywołanie inicjalizacji do istniejących eventów
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initProductionScreen, 500);
});

// Dodaj event na przełączenie do ekranu produkcji
document.querySelectorAll('.nav-button[data-screen="production-screen"]').forEach(button => {
  button.addEventListener('click', function() {
      setTimeout(initProductionScreen, 100);
  });
});



// Zastąp oryginalną showRewardAnimation żeby było tylko jedno źródło animacji
function fixAnimations() {
  console.log("Naprawianie problemu podwójnych animacji");

  // Jeśli istnieje oryginalna funkcja showRewardAnimation (w game.js)
  if (typeof window.showRewardAnimation === 'function') {
      console.log("Znaleziono oryginalną funkcję showRewardAnimation - przechwytywanie");
      
      // Zachowaj referencję do oryginalnej funkcji
      const originalShowRewardAnimation = window.showRewardAnimation;
      
      // Zastąp funkcję naszą wersją, która tylko loguje wywołanie
      window.showRewardAnimation = function(text, element) {
          console.log("Przechwycono wywołanie showRewardAnimation - nie tworzymy duplikatu animacji");
          // NIE tworzymy drugiej animacji, nasz addSeedCollectEffect to zrobi
      };
  } else {
      console.log("Nie znaleziono oryginalnej funkcji showRewardAnimation");
  }
}

// Uproszczone globalne funkcje do wywołania z przycisków
window.manualCollect = function() {
  console.log("Wywołano globalną funkcję manualCollect");
  if (typeof window.addSeedManually === 'function') {
      window.addSeedManually();
  } else if (typeof addSeedManually === 'function') {
      addSeedManually();
  } else {
      console.error("Funkcja addSeedManually niedostępna!");
  }
};

window.autoCollect = function() {
  console.log("Wywołano globalną funkcję autoCollect");
  if (typeof window.collectAutoSeeds === 'function') {
      window.collectAutoSeeds();
  } else if (typeof collectAutoSeeds === 'function') {
      collectAutoSeeds();
  } else {
      console.error("Funkcja collectAutoSeeds niedostępna!");
  }
};



// Funkcja pomocnicza do debugowania ładowania obrazków
window.debugBirdImages = function() {
  console.log("=== DEBUG OBRAZKÓW PTAKÓW ===");
  
  // Sprawdź Park Miejski
  console.log("Sprawdzanie obrazków Parku Miejskiego:");
  ['common-bird.png', 'rare-bird.png', 'epic-bird.png', 'legendary-bird.png', 'mythical-bird.png'].forEach(filename => {
    const img = new Image();
    img.onload = () => console.log(`✅ Obrazek /assets/images/${filename} załadowany poprawnie`);
    img.onerror = () => console.error(`❌ Błąd ładowania obrazka /assets/images/${filename}`);
    img.src = `/assets/images/${filename}`;
  });
  
  // Sprawdź Brzeg Jeziora
  console.log("Sprawdzanie obrazków Brzegu Jeziora:");
  ['lake-common.png', 'lake-rare.png', 'lake-epic.png', 'lake-legendary.png', 'lake-mythical.png'].forEach(filename => {
    const img = new Image();
    img.onload = () => console.log(`✅ Obrazek /assets/images/${filename} załadowany poprawnie`);
    img.onerror = () => console.error(`❌ Błąd ładowania obrazka /assets/images/${filename}`);
    img.src = `/assets/images/${filename}`;
  });
  
  console.log("==============================");
};



// Dodaj wywołanie przy inicjalizacji
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    console.log("Inicjalizacja breeding.js przy starcie");
    if (typeof setupBreedingScreen === 'function') {
      setupBreedingScreen();
    }
  }, 1500); // Dajemy więcej czasu na załadowanie wszystkich skryptów
});


// Funkcja awaryjna na wypadek braku setupBreedingScreen
if (typeof window.setupBreedingScreen !== 'function') {
  window.setupBreedingScreen = function() {
    console.log("Używam awaryjnej funkcji setupBreedingScreen");
    
    // Aktualizacja UI ekranu hodowli
    const petBirdImage = document.getElementById('pet-bird-image');
    const petBirdName = document.getElementById('pet-bird-name');
    const petStatus = document.getElementById('pet-status');
    
    if (petBirdImage && petBirdName && petStatus) {
      // Próba aktualizacji UI
      if (gameState.petBird && gameState.petBird.exists) {
        // Ptak istnieje, aktualizuj UI
        const stage = gameState.petBird.stage || 'egg';
        petBirdImage.className = '';
        petBirdImage.classList.add(`pet-${stage}`);
        petBirdName.textContent = gameState.petBird.name || t('breeding.chickName');
        petStatus.textContent = t('breeding.statusGood', { type: stage === 'egg' ? t('breeding.egg') : t('breeding.bird') });
      } else {
        // Brak ptaka
        petBirdImage.className = '';
        petBirdName.textContent = t('breeding.noBird');
        petStatus.textContent = t('breeding.startBreeding');
      }
    }
    
    // Inicjalizacja przycisków
    const hatchButton = document.getElementById('hatch-pet-button');
    if (hatchButton) {
      hatchButton.onclick = function() {
        console.log("Kliknięto przycisk Zdobądź jajko (funkcja awaryjna)");
        if (typeof window.buyNewEgg === 'function') {
          window.buyNewEgg();
        } else {
          showNotification(t('notifications.eggPurchaseFunctionUnavailable'));
        }
      };
    }
  };
}


// Zmodyfikowana funkcja formatNumber z obsługą TON - skopiuj tę funkcję do ui.js
function formatNumber(number, decimals = 3, isTON = false) {
  // Upewnij się, że mamy liczbę
  if (typeof number !== 'number') {
      number = parseFloat(number) || 0;
  }
  
  // Dla TON zawsze używaj 3 miejsc po przecinku
  if (isTON || decimals === 3) {
      decimals = 3;
  }
  
  // Formatuj liczbę z odpowiednią liczbą miejsc po przecinku
  const formatted = decimals > 0 ? number.toFixed(decimals) : number.toString();
  
  // Zamień kropkę na przecinek (format polski)
  return formatted.replace('.', ',');
}









// Specjalna funkcja do naprawy obsługi przycisków zbierania nagrody z poprawnym uwzględnieniem bonusów
function fixRewardButtons() {
  console.log("=== NAPRAWA PRZYCISKÓW ZBIERANIA NAGRODY ===");
  
  // Pobierz wszystkie przyciski zbierania nagrody
  const collectButtons = document.querySelectorAll('.collect-reward-button');
  console.log(`Znaleziono ${collectButtons.length} przycisków zbierania nagrody`);
  
  // Zamień event listenery dla każdego przycisku
  collectButtons.forEach(button => {
      // Znajdź slot, do którego należy przycisk
      const slotElement = button.closest('.bird-slot');
      if (!slotElement) return;
      
      // Pobierz indeks slotu
      const slotIndex = slotElement.getAttribute('data-slot');
      if (!slotIndex) return;
      
      // Pobierz aktualną lokację
      const locationId = gameState.locations.currentLocation;
      
      // Usuń wszystkie dotychczasowe event listenery
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Dodaj nowy event listener z prawidłową obsługą bonusów
      newButton.addEventListener('click', function(e) {
          console.log(`NAPRAWIONE: Kliknięto przycisk zbierania nagrody w slocie ${slotIndex}, lokacja: ${locationId}`);
          
          // Zapobiegaj domyślnej akcji i propagacji
          e.preventDefault();
          e.stopPropagation();
          
          // Pobierz slot z gameState
          const slot = gameState.locationSlots[locationId][slotIndex];
          if (!slot || !slot.needsCollection) {
              console.log("Slot nie jest gotowy do zebrania");
              return;
          }
          
          // Zapamiętaj typ ptaka przed resetem slotu
          const birdType = slot.birdType;
          
          // Pobierz konfigurację lokacji
          const locationConfig = gameState.locations.configs[locationId];
          
          // Bazowa wartość nagrody z konfiguracji
          const baseReward = locationConfig.birdRewards[birdType];
          console.log(`Bazowa nagroda dla ptaka ${birdType}: ${baseReward}`);
          
          let finalReward = baseReward;
          
  
          




          // Dla zwykłych ptaków (nie mitycznych) - aplikuj bonus z dekoracji
if (birdType !== 'mythical') {
  // Zapisz wartość bazową nagrody przed bonusem
  console.log(`Bazowa nagroda przed bonusem: ${baseReward}`);
  
  // Użyj funkcji applyDecorationBonusesToReward jeśli dostępna
  if (typeof window.applyDecorationBonusesToReward === 'function') {
      console.log("Używam funkcji applyDecorationBonusesToReward");
      finalReward = window.applyDecorationBonusesToReward(locationId, baseReward);
      console.log(`Finalna nagroda po bonusie: ${finalReward}`);
  } else {
      console.warn("Funkcja applyDecorationBonusesToReward niedostępna!");
      
      // Zastosuj bonusy bezpośrednio jako fallback
      if (gameState.decorations && gameState.decorations[locationId]) {
          let bonusPercent = 0;
          
          // Iteruj przez wszystkie dekoracje i sumuj bonusy typu "reward"
          Object.keys(gameState.decorations[locationId]).forEach(decorId => {
              const decoration = gameState.decorations[locationId][decorId];
              if (decoration.owned && decoration.bonus && decoration.bonus.type === "reward") {
                  bonusPercent += decoration.bonus.value;
                  console.log(`Znaleziono bonus +${decoration.bonus.value}% z dekoracji ${decorId}`);
              }
          });
          
          // Zastosuj zsumowany bonus
          if (bonusPercent > 0) {
              finalReward = parseFloat((baseReward * (1 + bonusPercent / 100)).toFixed(1));
              console.log(`Zastosowano bonus +${bonusPercent}%: ${baseReward} → ${finalReward}`);
          }
      }
  }
  
 





              // Dodaj monety z uwzględnieniem bonusu
              gameState.resources.coins += finalReward;
              gameState.stats.totalCoinsEarned += finalReward;
              
              // Wyświetl animację nagrody
              showRewardAnimation(`+${formatNumber(finalReward, 1)} 💰`, newButton);
              
              // Pokaż powiadomienie z informacją o bonusie, jeśli został zastosowany
              if (finalReward > baseReward) {
                  const bonus = finalReward - baseReward;
                  showNotification(t('notifications.receivedCoinsWithBonus', { baseAmount: formatNumber(baseReward, 1), bonusAmount: formatNumber(bonus, 1) }));
                } else {
                  showNotification(t('notifications.receivedCoins', { amount: formatNumber(finalReward, 1) }));
              }
              
              // Aktualizuj misję tygodniową collectCurrency 
              updateWeeklyMissionProgress('collectCurrency', finalReward);
          } else {
              // Dla mitycznych ptaków - dodaj TON
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
              
              // Dodaj TON do zasobów gracza
              const currentTon = parseFloat(gameState.resources.ton || 0);
              gameState.resources.ton = parseFloat((currentTon + tonReward).toFixed(3));
              
              // Pokaż powiadomienie
              showNotification(t('notifications.receivedTon', { amount: tonReward.toFixed(3) }));
              
              // Pokaż animację nagrody TON
              if (typeof showTonRewardAnimation === 'function') {
                  showTonRewardAnimation(tonReward, newButton);
              } else {
                  showRewardAnimation(`+${tonReward} TON`, newButton);
              }
              
              // Aktualizuj UI licznika TON
              requestAnimationFrame(() => {
                  if (document.getElementById('ton-count')) {
                      document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton, 3, true);
                  }
                  
                  // Aktualizuj ekran portfela, jeśli jest otwarty
                  if (document.querySelector('.game-screen.active#wallet-screen')) {
                      const balanceDisplay = document.getElementById('ton-balance-display');
                      if (balanceDisplay) {
                          balanceDisplay.textContent = formatNumber(gameState.resources.ton, 3, true) + ' TON';
                      }
                  }
              });
          }
          
          // Resetuj slot - wspólna część dla wszystkich typów ptaków
          slot.needsCollection = false;
          slot.isActive = false;
          slot.birdType = null;
          
          // Po 3 sekundach spróbuj wygenerować nowego ptaka
          setTimeout(() => {
              trySpawnBirdInSlot(slotIndex, locationId);
              
              // Aktualizuj UI slotu
              const updatedSlotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
              if (updatedSlotElement) {
                  updateBirdSlotUI(updatedSlotElement, slotIndex);
              }
          }, 3000);
          
          // Aktualizuj UI slotu natychmiast po odebraniu nagrody
          updateBirdSlotUI(slotElement, slotIndex);
          
          // Aktualizuj przyciski akcji zbiorowych
          if (typeof updateAllActionButtons === 'function') {
              updateAllActionButtons();
          }
          
          // Aktualizuj UI i zapisz stan gry
          updateUI();
          saveGame();
          
          return false;
      });
  });
  
  console.log("=== ZAKOŃCZONO NAPRAWĘ PRZYCISKÓW ZBIERANIA NAGRODY ===");
  return "Naprawiono przyciski zbierania nagrody!";
}

// Naprawa przycisków karmienia mitycznych ptaków
function fixMythicalFeedButtons() {
  console.log("=== NAPRAWA PRZYCISKÓW KARMIENIA MITYCZNYCH PTAKÓW ===");
  
  // Pobierz wszystkie przyciski karmienia
  const feedButtons = document.querySelectorAll('.feed-button');
  console.log(`Znaleziono ${feedButtons.length} przycisków karmienia`);
  
  // Zamień event listenery dla każdego przycisku
  feedButtons.forEach(button => {
      // Znajdź slot, do którego należy przycisk
      const slotElement = button.closest('.bird-slot');
      if (!slotElement) return;
      
      // Pobierz indeks slotu
      const slotIndex = slotElement.getAttribute('data-slot');
      if (!slotIndex) return;
      
      // Pobierz aktualną lokację
      const locationId = gameState.locations.currentLocation;
      
      // Pobierz slot z gameState
      const slot = gameState.locationSlots[locationId][slotIndex];
      if (!slot || !slot.isActive || slot.isFeeding || slot.needsCollection) return;
      
      // Sprawdź, czy to mityczny ptak
      if (slot.birdType === 'mythical') {
          console.log(`Znaleziono mitycznego ptaka w slocie ${slotIndex}, naprawiam przycisk karmienia`);
          
          // Usuń wszystkie dotychczasowe event listenery
          const newButton = button.cloneNode(true);
          button.parentNode.replaceChild(newButton, button);
          
          // Określ koszt w owocach
          let fruitCost = 1; // domyślnie 1 owoc
          if (locationId === 'lake') {
              fruitCost = 3; // 3 owoce dla jeziora
          } else if (locationId === 'forest') {
              fruitCost = 5; // 5 owoców dla lasu
          }
          
          // Zmień tekst przycisku, aby pokazywał koszt w owocach
          newButton.textContent = `${t('birdSlots.feedBird')} (${fruitCost} 🍎)`;
          
          // Dodaj nowy event listener z prawidłową obsługą karmienia mitycznych ptaków
          newButton.addEventListener('click', function(e) {
              console.log(`NAPRAWIONE: Kliknięto przycisk karmienia mitycznego ptaka w slocie ${slotIndex}`);
              
              // Zapobiegaj domyślnej akcji i propagacji
              e.preventDefault();
              e.stopPropagation();
              
              // Sprawdź, czy mamy wystarczająco owoców
              if (gameState.resources.fruits >= fruitCost) {
                  // Odejmij owoce
                  gameState.resources.fruits -= fruitCost;
                  
                  // Aktualizacja licznika owoców
                  requestAnimationFrame(() => {
                      document.getElementById('fruit-count').textContent = formatNumber(gameState.resources.fruits, 2);
                  });
                  
                
                  


// Ustaw ptaka w trybie karmienia
slot.isFeeding = true;

// Pobierz konfigurację lokacji
const locationConfig = gameState.locations.configs[locationId];

// NAPRAWIONE: Zastosuj bonusy czasu karmienia dla mitycznych ptaków
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
        console.log(`[UI.JS Fix] Czas karmienia mitycznego ptaka po bonusach: ${feedTime} (lokacja: ${locationId})`);
        // Pokaż komunikat o bonusie
        showNotification(t('notifications.mythicalBirdFeedingBonus', { bonus: timeBonus }));
    }
}

slot.remainingTime = feedTime;

// Aktualizacja postępu misji "Nakarm ptaki"
updateMissionProgress('feedBirds', 1);



                  
                  // Aktualizacja statystyk
                  gameState.stats.totalBirdsFed += 1;
                  
                  // Aktualizuj UI slotu
                  updateBirdSlotUI(slotElement, slotIndex);
                  
                  // Aktualizuj przyciski akcji zbiorowych
                  if (typeof updateAllActionButtons === 'function') {
                      updateAllActionButtons();
                  }
                  
                  // Aktualizuj znacznik misji
                  updateMissionBadge();
                  
                  // Aktualizuj UI i zapisz stan gry
                  updateUI();
                  saveGame();
              } else {
                  showNotification(t('notifications.notEnoughFruitsForMythical', { amount: fruitCost }));
              }
              
              return false;
          });
      }
  });
  
  console.log("=== ZAKOŃCZONO NAPRAWĘ PRZYCISKÓW KARMIENIA MITYCZNYCH PTAKÓW ===");
  return "Naprawiono przyciski karmienia mitycznych ptaków!";
}

// Uruchom funkcje naprawiające przy przełączaniu ekranów
document.addEventListener('click', function(e) {
  // Jeśli kliknięto przycisk prowadzący do ekranu karmienia
  if (e.target.matches('.nav-button[data-screen="feed-screen"]')) {
      // Daj czas na załadowanie ekranu, potem napraw przyciski
      setTimeout(function() {
          fixRewardButtons();
          fixFeedButtons(); // Najpierw napraw wszystkie przyciski
          fixMythicalFeedButtons(); // Potem specjalnie napraw mityczne ptaki
      }, 300);
  }
});

// Wywołaj funkcje naprawiające po załadowaniu gry
document.addEventListener('gameLoaded', function() {
  setTimeout(function() {
      fixRewardButtons();
      fixMythicalFeedButtons();
  }, 500);
});

// Dodaj wywołanie funkcji naprawiających po załadowaniu strony
window.addEventListener('load', function() {
  setTimeout(function() {
      fixRewardButtons();
      fixMythicalFeedButtons();
  }, 1000);
});

// Dodaj naprawę po zmianie lokacji
const originalChangeLocation = window.changeLocation || function() {};
window.changeLocation = function(locationId) {
  const result = originalChangeLocation(locationId);
  
  if (result) {
      setTimeout(function() {
          fixRewardButtons();
          fixMythicalFeedButtons();
      }, 500);
  }
  
  return result;
};






// Funkcja do aktualizacji XP i poziomu
function updatePlayerXpInfo() {
    // Aktualizuj pasek postępu XP
    const xpPercentage = (gameState.player.xp / gameState.player.nextLevelXp) * 100;
    const progressBar = document.getElementById('main-xp-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${xpPercentage}%`;
    }
    
    // Aktualizuj informacje o poziomie
    const levelBadgeSpan = document.querySelector('.main-level-badge span');
    if (levelBadgeSpan) {
        levelBadgeSpan.textContent = t('mainScreen.level', {level: gameState.player.level});
        levelBadgeSpan.setAttribute('data-i18n-values', JSON.stringify({level: gameState.player.level}));
    }
    
    // Aktualizuj informacje o XP
    const xpTextSpan = document.querySelector('.main-xp-text span');
    if (xpTextSpan) {
        xpTextSpan.textContent = t('mainScreen.xp', {current: gameState.player.xp, next: gameState.player.nextLevelXp});
        xpTextSpan.setAttribute('data-i18n-values', JSON.stringify({current: gameState.player.xp, next: gameState.player.nextLevelXp}));
    }
}

// Dodaj wywołanie funkcji przy każdej zmianie ekranu
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function() {
        setTimeout(updatePlayerXpInfo, 300);
    });
});

// Aktualizuj info o XP co 2 sekundy (dodatkowe zabezpieczenie)
setInterval(updatePlayerXpInfo, 2000);








// Dodaj funkcję naprawy do globalnego zakresu, aby można było ją wywołać ręcznie
window.fixRewardButtons = fixRewardButtons;
window.fixMythicalFeedButtons = fixMythicalFeedButtons;



});