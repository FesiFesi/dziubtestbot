// unlock-skins.js - Natychmiastowe odblokowanie skinów
(function() {
    console.log("BEZPOŚREDNIA INTERWENCJA - ODBLOKOWYWANIE SKINÓW");
    
    // Funkcja wymuszająca odblokowanie skinów
    function forceUnlockSkins() {
        if (!window.gameState) return false;
        
        // Upewnij się, że struktura istnieje
        if (!window.gameState.skins) {
            window.gameState.skins = {
                currentSkin: "default",
                unlockedSkins: ["default", "lesny", "master"]
            };
        } else if (!window.gameState.skins.unlockedSkins) {
            window.gameState.skins.unlockedSkins = ["default", "lesny", "master"];
        } else {
            // Dodaj skiny, jeśli ich nie ma
            if (!window.gameState.skins.unlockedSkins.includes("lesny")) {
                window.gameState.skins.unlockedSkins.push("lesny");
            }
            if (!window.gameState.skins.unlockedSkins.includes("master")) {
                window.gameState.skins.unlockedSkins.push("master");
            }
        }
        
        // Zapisz stan gry
        if (typeof window.saveGame === 'function') {
            window.saveGame();
        } else {
            // Bezpośredni zapis do localStorage
            try {
                localStorage.setItem('dziubCoinsGame', JSON.stringify(window.gameState));
                localStorage.setItem('lesnyUnlocked', 'true');
                localStorage.setItem('masterUnlocked', 'true');
            } catch (e) {
                console.error("Błąd podczas zapisu odblokowanych skinów", e);
            }
        }
        
        return true;
    }
    
    // Wykonuj tę funkcję regularnie, dopóki nie zadziała
    const unlockInterval = setInterval(function() {
        if (window.gameState) {
            const result = forceUnlockSkins();
            if (result) {
                console.log("Skiny zostały odblokowane!");
                clearInterval(unlockInterval);
            }
        }
    }, 500);
    
    // Zatrzymaj interwał po 30 sekundach
    setTimeout(function() {
        clearInterval(unlockInterval);
    }, 30000);
    
    // Próbuj również po załadowaniu DOM
    document.addEventListener('DOMContentLoaded', forceUnlockSkins);
    
    // I po pełnym załadowaniu strony
    window.addEventListener('load', forceUnlockSkins);
    
    // Oraz po załadowaniu gry
    document.addEventListener('gameLoaded', forceUnlockSkins);
})();