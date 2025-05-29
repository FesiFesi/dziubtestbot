// Funkcje integracji z Telegram Mini App API
document.addEventListener('DOMContentLoaded', function() {
    console.log(t('telegram.initialization'));
    
    // Sprawdź, czy mamy dostęp do Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        console.log(t('telegram.webAppAvailable'));
        initTelegramApp();
    } else {
        console.log(t('telegram.webAppUnavailable'));
    }
});

// Funkcja inicjalizująca Telegram Mini App
function initTelegramApp() {
    try {
        // Pozyskaj referencję do API Telegrama
        const tg = window.Telegram.WebApp;
        
        // Informujemy Telegram, że aplikacja jest gotowa
        tg.ready();
        
        // Ustawiamy tryb rozszerzony - wyższy kontrast dla widoczności
        tg.expand();
        
        // Dodajemy obsługę przycisków głównych Telegrama (jeśli są potrzebne)
        setupTelegramButtons(tg);
        
        // Przechwytujemy zdarzenie ponownej aktywacji mini-aplikacji (powrót po zminimalizowaniu)
        tg.onEvent('viewportChanged', function() {
            console.log(t('telegram.viewportChanged'));
            updateUI();
        });
        
        console.log(t('telegram.initSuccess'));
    } catch (error) {
        console.error(t('telegram.initError'), error);
    }
}

// Konfiguracja przycisków Telegram (opcjonalne)
function setupTelegramButtons(tg) {
    // Telegram pozwala na dodanie jednego głównego przycisku na dole ekranu
    
    // Możemy dodać np. przycisk zakupu dodatkowych monet (przykład na przyszłość)
    /*
    tg.MainButton.setText('Kup DziubCoiny');
    tg.MainButton.onClick(function() {
        // Tutaj kod do obsługi zakupu - w przyszłości integracja z płatnościami
        showNotification("Funkcja zakupu wkrótce dostępna!");
    });
    */
    
    // Ukrywamy przyciski, które nie są jeszcze używane
    if (tg.MainButton) tg.MainButton.hide();
    
    // Obsługa eventu zamknięcia aplikacji - zapisujemy stan
    tg.onEvent('backButtonClicked', function() {
        console.log(t('telegram.backButtonPressed'));
        saveGame();
        tg.close();
    });
}

// Funkcja wysyłająca dane do Telegrama (statystyki, osiągnięcia itp.)
function sendStatsToTelegram() {
    if (!window.Telegram || !window.Telegram.WebApp) return;
    
    try {
        const tg = window.Telegram.WebApp;
        
        // Podsumowanie statystyk gracza
        const statsData = {
            level: gameState.player.level,
            seeds: gameState.resources.seeds,
            coins: gameState.resources.coins,
            totalSeedsCollected: gameState.stats.totalSeedsCollected,
            totalBirdsFed: gameState.stats.totalBirdsFed,
            achievementsCompleted: gameState.achievements.filter(a => a.completed).length
        };
        
        // Wysyłanie wiadomości do bota/aplikacji
        if (tg.sendData) {
            tg.sendData(JSON.stringify(statsData));
            console.log(t('telegram.statsSent'), statsData);
        }
    } catch (error) {
        console.error(t('telegram.statsError'), error);
    }
}

// Funkcja obsługująca udostępnianie osiągnięć
function shareAchievement(achievementTitle) {
    if (!window.Telegram || !window.Telegram.WebApp) {
        showNotification(t('telegram.sharingUnavailable'));
        return;
    }
    
    try {
        const tg = window.Telegram.WebApp;
        
        if (tg.shareUrl) {
            // Tutaj należy dodać adres URL do udostępnienia (w przyszłości)
            const shareUrl = "https://t.me/DziubCoinsBot";
            tg.shareUrl({
                url: shareUrl,
                text: t('telegram.achievementShare', { achievementTitle: achievementTitle })
            });
        } else {
            console.log(t('telegram.sharingFunctionUnavailable'));
        }
    } catch (error) {
        console.error(t('telegram.sharingError'), error);
    }
}

// Funkcja przygotowująca obraz do udostępnienia (możliwe w przyszłości)
function prepareShareImage() {
    // Przygotowanie kanwy do generowania obrazu do udostępnienia
    // Ta funkcja będzie zaimplementowana w przyszłości
    console.log(t('telegram.imagePreparation'));
}

// Funkcja dostosowująca kolorystykę do motywu Telegrama
function adjustTelegramTheme() {
    if (!window.Telegram || !window.Telegram.WebApp) return;
    
    try {
        const tg = window.Telegram.WebApp;
        
        // Pobierz kolory motywu
        const themeParams = tg.themeParams;
        
        if (themeParams) {
            // Dostosowanie kolorów aplikacji do kolorów Telegrama
            document.documentElement.style.setProperty('--theme-bg-color', themeParams.bg_color);
            document.documentElement.style.setProperty('--theme-text-color', themeParams.text_color);
            document.documentElement.style.setProperty('--theme-button-color', themeParams.button_color);
            document.documentElement.style.setProperty('--theme-button-text-color', themeParams.button_text_color);
            
            console.log(t('telegram.colorsAdjusted'));
        }
    } catch (error) {
        console.error(t('telegram.colorError'), error);
    }
}

// Funkcja zapisująca stan gry przy zamykaniu
window.addEventListener('beforeunload', function() {
    console.log(t('telegram.gameClosing'));
    saveGame();
});

// Eksportuj funkcje, aby były dostępne dla innych skryptów
window.shareAchievement = shareAchievement;
window.sendStatsToTelegram = sendStatsToTelegram;