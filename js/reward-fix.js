// final-reward-fix.js - Absolutnie finalne rozwiązanie

(function() {
  // Główna funkcja nadpisująca - będzie wywoływana co 100ms
  function overrideFunctions() {
    // 1. Nadpisz podstawową funkcję collectBirdReward
    window.collectBirdReward = function(slotIndex, locationId) {
      // Konwersja na liczbę
      slotIndex = parseInt(slotIndex, 10);
      locationId = locationId || gameState.locations.currentLocation;
      
      // Pobierz slot
      const slot = gameState.locationSlots[locationId][slotIndex];
      if (!slot.needsCollection) return 0;
      
      // Pobierz konfigurację lokacji
      const locationConfig = gameState.locations.configs[locationId];
      
      // Zapisz typ ptaka przed resetowaniem slotu
      const birdType = slot.birdType;
      
      // Jeśli to mityczny ptak, użyj standardowej obsługi dla nagrody TON
      if (birdType === 'mythical') {
        // Kod obsługujący mityczne ptaki - dodaje TON
        let tonReward = 0;
        switch(locationId) {
          case 'park': tonReward = 0.003; break;
          case 'lake': tonReward = 0.008; break;
          case 'forest': tonReward = 0.012; break;
          default: tonReward = 0.003;
        }
        
        // Dodaj TON
        const currentTon = parseFloat(gameState.resources.ton || 0);
        gameState.resources.ton = parseFloat((currentTon + tonReward).toFixed(3));
        
        // Pokaż powiadomienie
        showNotification(`Otrzymałeś ${tonReward.toFixed(3)} TON za mitycznego ptaka!`);
        
        // Aktualizuj licznik TON
        requestAnimationFrame(() => {
          if (document.getElementById('ton-count')) {
            document.getElementById('ton-count').textContent = formatNumber(gameState.resources.ton, 3, true);
          }
        });
      } else {
        // Kod obsługujący zwykłe ptaki
        // WAŻNE: Używamy let zamiast const
        let baseReward = locationConfig.birdRewards[birdType];
        let finalReward = baseReward;
        
        // Flagi na bonusy z różnych dekoracji
        let hasFountain = false; // dla parku
        let hasKite = false;     // dla jeziora
        let bonusAmount = 0;     // do wyświetlenia w powiadomieniu
        let bonusSource = "";    // nazwa dekoracji dającej bonus
        
        // Sprawdź bonus z dekoracji - PARK
        if (locationId === 'park' && 
            gameState.decorations && 
            gameState.decorations.park && 
            gameState.decorations.park.fountain && 
            gameState.decorations.park.fountain.owned === true) {
          // Zastosuj 10% bonus z fontanny w parku
          finalReward = parseFloat((baseReward * 1.1).toFixed(1));
          hasFountain = true;
          bonusAmount = finalReward - baseReward;
          bonusSource = "fontanny";
        }
        
        // Sprawdź bonus z dekoracji - JEZIORO
        else if (locationId === 'lake' && 
                 gameState.decorations && 
                 gameState.decorations.lake && 
                 gameState.decorations.lake.kite && 
                 gameState.decorations.lake.kite.owned === true) {
          // Zastosuj 12% bonus z latawca w jeziorze
          finalReward = parseFloat((baseReward * 1.12).toFixed(1));
          hasKite = true;
          bonusAmount = finalReward - baseReward;
          bonusSource = "latawca";
        }
        
        // Dodaj monety z bonusem
        gameState.resources.coins += finalReward;
        gameState.stats.totalCoinsEarned += finalReward;
        
        // Pokaż powiadomienie z informacją o bonusie
        if (hasFountain || hasKite) {
          showNotification(`Otrzymałeś ${baseReward} + ${bonusAmount.toFixed(1)} DziubCoinów (bonus z ${bonusSource})!`);
        } else {
          showNotification(`Otrzymałeś ${finalReward} DziubCoinów!`);
        }
        
        // Pokaż animację
        const button = document.querySelector(`.bird-slot[data-slot="${slotIndex}"] .collect-reward-button`);
        if (button && typeof showRewardAnimation === 'function') {
          showRewardAnimation(`+${finalReward} 💰`, button);
        }
        
        // Aktualizuj misję tygodniową collectCurrency
        if (typeof updateWeeklyMissionProgress === 'function') {
          updateWeeklyMissionProgress('collectCurrency', finalReward);
        }
      }
      
      // Resetuj slot - wspólne dla wszystkich typów ptaków
      slot.needsCollection = false;
      slot.isActive = false;
      slot.birdType = null;
      
      // Po 3 sekundach spróbuj wygenerować nowego ptaka
      setTimeout(() => {
        trySpawnBirdInSlot(slotIndex, locationId);
        
        // Aktualizuj UI slotu
        const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
        if (slotElement) {
          updateBirdSlotUI(slotElement, slotIndex);
        }
      }, 3000);
      
      // Aktualizuj UI slotu natychmiast
      const slotElement = document.querySelector(`.bird-slot[data-slot="${slotIndex}"]`);
      if (slotElement) {
        updateBirdSlotUI(slotElement, slotIndex);
      }
      
      // Aktualizuj przyciski akcji zbiorowych
      if (typeof updateAllActionButtons === 'function') {
        updateAllActionButtons();
      }
      
      // Aktualizuj UI i zapisz stan gry
      updateUI();
      saveGame();
      
      return finalReward || 0;
    };
  }
  
  // Wywołaj funkcję nadpisującą natychmiast
  overrideFunctions();
  
  // Ustaw interwał, który będzie stale nadpisywał funkcje (na wypadek, gdyby inne skrypty je nadpisały)
  setInterval(overrideFunctions, 100);
  
  // Dodatkowo, załóżmy listener na zdarzenie DOMContentLoaded, aby nadpisać funkcję po załadowaniu DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', overrideFunctions);
  }
  
  // Załóżmy listener na zdarzenie load, aby nadpisać funkcję po załadowaniu całej strony
  window.addEventListener('load', overrideFunctions);
  
  // Wyświetl komunikat w konsoli
  console.log("🔨 Ostateczny skrypt naprawczy załadowany - nadpisuję funkcję collectBirdReward co 100ms");
})();