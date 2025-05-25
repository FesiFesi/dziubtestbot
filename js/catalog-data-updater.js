/**
 * Aktualizator danych w katalogu ptaków
 * Pobiera rzeczywiste dane z gameState i aktualizuje katalog
 */

// Funkcja do formatowania czasu z sekund na format "1h 25m 15s"
function formatTimeForCatalog(seconds) {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (secs > 0) result += `${secs}s`;
    
    return result.trim();
}

// Funkcja do formatowania szansy jako procent
function formatChanceForCatalog(chance) {
    return `${(chance * 100).toFixed(1)}%`;
}

// Funkcja do aktualizacji danych ptaka w katalogu
function updateBirdDataInCatalog(birdElement, locationId, birdType) {
    const locationConfig = gameState.locations.configs[locationId];
    if (!locationConfig) return;
    
    const stats = birdElement.querySelector('.catalog-bird-stats');
    if (!stats) return;
    
    // Pobierz rzeczywiste dane
    const cost = locationConfig.birdCosts[birdType];
    const time = locationConfig.birdTimes[birdType];
    const reward = locationConfig.birdRewards[birdType];
    const chance = locationConfig.spawnChances[birdType];
    
    // Aktualizuj HTML
    const formattedTime = formatTimeForCatalog(time);
    const formattedChance = formatChanceForCatalog(chance);
    
    let costText, rewardText;
    
    if (birdType === 'mythical') {
        // Mityczne ptaki używają owoców
        let fruitCost = 1;
        if (locationId === 'lake') fruitCost = 3;
        if (locationId === 'forest') fruitCost = 5;
        
        costText = `${fruitCost} ${t('resources.fruits')}`;
        
        // Nagroda TON dla mitycznych ptaków
        let tonReward = 0.003;
        if (locationId === 'lake') tonReward = 0.008;
        if (locationId === 'forest') tonReward = 0.012;
        
        rewardText = `${tonReward.toFixed(3)} TON`;
    } else {
        costText = `${cost} ${t('resources.seeds')}`;
        rewardText = `${reward} ${t('resources.coins')}`;
    }
    
    // Znajdź i zaktualizuj poszczególne statystyki
    const statElements = stats.querySelectorAll('.catalog-bird-stat');
    statElements.forEach(stat => {
        const text = stat.textContent;
        
        if (text.includes(t('catalog.birdStats.chance')) || text.includes('Szansa:')) {
            stat.innerHTML = `<span data-i18n="catalog.birdStats.chance">Szansa:</span> ${formattedChance}`;
        }
        else if (text.includes(t('catalog.birdStats.time')) || text.includes('Czas:')) {
            stat.innerHTML = `<span data-i18n="catalog.birdStats.time">Czas:</span> ${formattedTime}`;
        }
        else if (text.includes(t('catalog.birdStats.cost')) || text.includes('Koszt:')) {
            stat.innerHTML = `<span data-i18n="catalog.birdStats.cost">Koszt:</span> ${costText}`;
        }
        else if (text.includes(t('catalog.birdStats.reward')) || text.includes('Nagroda:')) {
            stat.innerHTML = `<span data-i18n="catalog.birdStats.reward">Nagroda:</span> ${rewardText}`;
        }
    });
}

// Funkcja do mapowania ID ptaka na typ
function getBirdTypeFromId(birdId) {
    if (birdId.includes('common')) return 'common';
    if (birdId.includes('rare')) return 'rare';
    if (birdId.includes('epic')) return 'epic';
    if (birdId.includes('legendary')) return 'legendary';
    if (birdId.includes('mythical')) return 'mythical';
    return null;
}

// Główna funkcja aktualizacji całego katalogu
function updateCatalogData() {
    console.log("Aktualizuję dane w katalogu ptaków...");
    
    // Aktualizuj każdą lokację
    ['park', 'lake', 'forest'].forEach(locationId => {
        const catalogSection = document.getElementById(`${locationId}-catalog`);
        if (!catalogSection) return;
        
        const birdItems = catalogSection.querySelectorAll('.catalog-bird-item');
        birdItems.forEach(birdItem => {
            const birdId = birdItem.getAttribute('data-bird-id');
            const birdType = getBirdTypeFromId(birdId);
            
            if (birdType) {
                updateBirdDataInCatalog(birdItem, locationId, birdType);
            }
        });
    });
    
    console.log("Aktualizacja danych katalogu zakończona");
}

// Uruchom aktualizację przy otwarciu katalogu
document.addEventListener('DOMContentLoaded', function() {
    const catalogButton = document.getElementById('bird-catalog-button');
    if (catalogButton) {
        catalogButton.addEventListener('click', function() {
            setTimeout(updateCatalogData, 300);
        });
    }
    
    // Uruchom również przy zdarzeniu gameLoaded
    document.addEventListener('gameLoaded', function() {
        setTimeout(updateCatalogData, 500);
    });
});

// Dodaj funkcję do globalnego zakresu
window.updateCatalogData = updateCatalogData;