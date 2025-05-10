// ===== SYSTEM DŹWIĘKÓW FEED & FLAP =====
console.log("Inicjalizacja systemu dźwięków");

// Główny obiekt zarządzający dźwiękami
const SoundModule = {
    // Czy dźwięki są włączone (domyślnie tak)
    soundEnabled: true,
    
    // Oddzielne flagi dla muzyki i efektów
    backgroundMusicEnabled: true,
    soundEffectsEnabled: true,

    // Czy próbowano już uruchomić muzykę w tle
    backgroundMusicStarted: false,
    
    // Spróbuj odtworzyć muzykę w tle po pierwszej interakcji
    tryPlayBackgroundMusic: function() {
        if (this.backgroundMusicStarted) return;
        
        // Dodaj jednorazowy listener, który odtworzy muzykę przy pierwszej interakcji
        const playMusicOnInteraction = () => {
            console.log("Pierwsza interakcja, uruchamianie muzyki w tle...");
            
            // Odtwórz muzykę jeśli jesteśmy na ekranie głównym i dźwięki są włączone
            const mainScreen = document.getElementById('main-screen');
            if (mainScreen && mainScreen.classList.contains('active') && this.soundEnabled && this.backgroundMusicEnabled) {
                this.playSound('background');
            }
            
            // Oznacz jako uruchomione
            this.backgroundMusicStarted = true;
            
            // Usuń listenery po pierwszym uruchomieniu
            document.removeEventListener('click', playMusicOnInteraction);
            document.removeEventListener('touchstart', playMusicOnInteraction);
            document.removeEventListener('keydown', playMusicOnInteraction);
        };
        
        // Dodaj listenery na różne typy interakcji
        document.addEventListener('click', playMusicOnInteraction);
        document.addEventListener('touchstart', playMusicOnInteraction);
        document.addEventListener('keydown', playMusicOnInteraction);
        
        console.log("Przygotowano listenery na pierwszą interakcję dla muzyki w tle");
    },

    // Głośność dźwięków (0.0 - 1.0)
    volume: 0.5,
    backgroundMusicVolume: 0.3,
    soundEffectsVolume: 0.7,
    
    // Obiekt przechowujący załadowane dźwięki
    sounds: {},
    
    // Inicjalizacja modułu dźwięków
    init: function() {
        console.log("Inicjalizacja modułu dźwięków");
        
        // Ładowanie dźwięków do pamięci
        this.loadSounds();
        
        // Sprawdź zapisane ustawienia dźwięku
        this.loadSoundSettings();
        
        // Dodaj przycisk włączania/wyłączania dźwięku
        this.createSoundToggleButton();
        
        // Dodaj style CSS dla przycisku dźwięku
        this.addSoundStyles();
    },
    
    // Ładowanie dźwięków do pamięci
    loadSounds: function() {
        // Lista dźwięków do załadowania - ścieżki są względne do folderu głównego
        const soundsToLoad = {
            click: 'assets/sounds/click.mp3',
            collect: 'assets/sounds/collect.mp3',
            feed: 'assets/sounds/feed.mp3',
            success: 'assets/sounds/success.mp3',
            notification: 'assets/sounds/notification.mp3',
            background: 'assets/sounds/background.mp3'
        };
        
        // Załaduj każdy dźwięk
        for (const [name, path] of Object.entries(soundsToLoad)) {
            try {
                const sound = new Audio(path);
                sound.volume = this.volume;
                
                // Dla muzyki w tle ustaw specjalne opcje
                if (name === 'background') {
                    sound.loop = true;
                    sound.volume = this.volume * this.backgroundMusicVolume; // Użyj głośności muzyki w tle
                } else {
                    // Dla efektów dźwiękowych użyj głośności efektów
                    sound.volume = this.volume * this.soundEffectsVolume;
                }
                
                this.sounds[name] = sound;
                console.log(`Załadowano dźwięk: ${name}`);
            } catch (error) {
                console.error(`Błąd ładowania dźwięku ${name}: ${error.message}`);
            }
        }
    },
    
    // Ładowanie ustawień dźwięku z localStorage
    loadSoundSettings: function() {
        try {
            const savedSettings = localStorage.getItem('soundSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.soundEnabled = settings.enabled !== undefined ? settings.enabled : true;
                this.volume = settings.volume !== undefined ? settings.volume : 0.5;
                
                // Dodane nowe ustawienia
                this.backgroundMusicEnabled = settings.backgroundMusicEnabled !== undefined ? settings.backgroundMusicEnabled : true;
                this.soundEffectsEnabled = settings.soundEffectsEnabled !== undefined ? settings.soundEffectsEnabled : true;
                this.backgroundMusicVolume = settings.backgroundMusicVolume !== undefined ? settings.backgroundMusicVolume : 0.3;
                this.soundEffectsVolume = settings.soundEffectsVolume !== undefined ? settings.soundEffectsVolume : 0.7;
                
                console.log(`Załadowano ustawienia dźwięku: włączony=${this.soundEnabled}, głośność=${this.volume}, muzyka=${this.backgroundMusicEnabled}, efekty=${this.soundEffectsEnabled}`);
            }
        } catch (error) {
            console.error(`Błąd ładowania ustawień dźwięku: ${error.message}`);
        }
    },
    
    // Zapisywanie ustawień dźwięku do localStorage
    saveSoundSettings: function() {
        try {
            const settings = {
                enabled: this.soundEnabled,
                volume: this.volume,
                backgroundMusicEnabled: this.backgroundMusicEnabled,
                soundEffectsEnabled: this.soundEffectsEnabled,
                backgroundMusicVolume: this.backgroundMusicVolume,
                soundEffectsVolume: this.soundEffectsVolume
            };
            localStorage.setItem('soundSettings', JSON.stringify(settings));
            console.log(`Zapisano ustawienia dźwięku: włączony=${this.soundEnabled}, głośność=${this.volume}, muzyka=${this.backgroundMusicEnabled}, efekty=${this.soundEffectsEnabled}`);
        } catch (error) {
            console.error(`Błąd zapisywania ustawień dźwięku: ${error.message}`);
        }
    },
    
  
    

// Tworzenie przycisku włączania/wyłączania dźwięku
createSoundToggleButton: function() {
    // Wyłączone - teraz używamy kontrolek w panelu ustawień
    console.log("Przycisk dźwięku wyłączony - używaj ustawień w panelu");
    
    // Usuń istniejący przycisk, jeśli był wcześniej dodany
    const existingButton = document.getElementById('sound-toggle-button');
    if (existingButton && existingButton.parentNode) {
        existingButton.parentNode.removeChild(existingButton);
    }
},

    
    // Dodanie stylów CSS dla przycisku dźwięku
    addSoundStyles: function() {
        const styles = document.createElement('style');
        styles.innerHTML = `
            .sound-toggle-button {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #9C27B0;
                color: white;
                border: none;
                font-size: 18px;
                cursor: pointer;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
                transition: transform 0.2s, background-color 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }
            
            .sound-toggle-button:hover {
                transform: scale(1.1);
                background-color: #7B1FA2;
            }
            
            .sound-toggle-button:active {
                transform: scale(0.95);
            }
            
            /* Style dla suwaków w ustawieniach dźwięku */
            .sound-settings-container {
                padding: 10px 0;
            }
            
            .sound-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .sound-setting-label {
                font-weight: bold;
                font-size: 16px;
                color: #333;
            }
            
            .sound-toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .sound-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .sound-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }
            
            .sound-toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            input:checked + .sound-toggle-slider {
                background-color: #9C27B0;
            }
            
            input:focus + .sound-toggle-slider {
                box-shadow: 0 0 1px #9C27B0;
            }
            
            input:checked + .sound-toggle-slider:before {
                transform: translateX(26px);
            }
            
            .sound-volume-slider {
                flex: 1;
                margin: 0 15px;
                height: 8px;
                -webkit-appearance: none;
                appearance: none;
                background: #ddd;
                outline: none;
                border-radius: 10px;
            }
            
            .sound-volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #9C27B0;
                cursor: pointer;
            }
            
            .sound-volume-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #9C27B0;
                cursor: pointer;
                border: none;
            }
            
            .sound-volume-value {
                font-size: 14px;
                color: #666;
                width: 35px;
                text-align: center;
            }
            
            .sound-setting-divider {
                margin: 15px 0;
                border: 0;
                height: 1px;
                background-color: #e0e0e0;
            }
        `;
        document.head.appendChild(styles);
    },
    
 // Włączanie/wyłączanie dźwięku
toggleSound: function() {
    this.soundEnabled = !this.soundEnabled;
    
    // Główny przełącznik został usunięty, więc nie aktualizujemy go
    
    // Zapisz ustawienia
    this.saveSoundSettings();
        
        // Zapisz ustawienia
        this.saveSoundSettings();
        
        // Jeśli dźwięk jest wyłączony, zatrzymaj wszystkie dźwięki
        if (!this.soundEnabled) {
            this.stopAllSounds();
        } else {
            // Jeśli dźwięk został włączony, odtwórz dźwięk kliknięcia
            if (this.soundEffectsEnabled) {
                this.playSound('click');
            }
            
            // Jeśli jesteśmy na ekranie głównym, włącz muzykę w tle
            const mainScreen = document.getElementById('main-screen');
            if (mainScreen && mainScreen.classList.contains('active') && this.backgroundMusicEnabled) {
                this.playSound('background');
            }
        }
        
        // Pokaż powiadomienie
        if (typeof showNotification === 'function') {
            showNotification(this.soundEnabled ? "Dźwięki włączone" : "Dźwięki wyłączone");
        }
    },
    
    // Włączanie/wyłączanie muzyki w tle
    toggleBackgroundMusic: function() {
        this.backgroundMusicEnabled = !this.backgroundMusicEnabled;
        
        // Aktualizuj przełącznik w oknie ustawień
        const musicToggle = document.getElementById('sound-music-toggle');
        if (musicToggle) {
            musicToggle.checked = this.backgroundMusicEnabled;
        }
        
        // Zapisz ustawienia
        this.saveSoundSettings();
        
        // Jeśli muzyka jest wyłączona, zatrzymaj muzykę w tle
        if (!this.backgroundMusicEnabled) {
            this.stopSound('background');
        } else if (this.soundEnabled) {
            // Jeśli muzyka jest włączona i dźwięki są włączone, odtwórz muzykę w tle
            const mainScreen = document.getElementById('main-screen');
            if (mainScreen && mainScreen.classList.contains('active')) {
                this.playSound('background');
            }
        }
        
        // Pokaż powiadomienie
        if (typeof showNotification === 'function') {
            showNotification(this.backgroundMusicEnabled ? "Muzyka w tle włączona" : "Muzyka w tle wyłączona");
        }
    },
    
    // Włączanie/wyłączanie efektów dźwiękowych
    toggleSoundEffects: function() {
        this.soundEffectsEnabled = !this.soundEffectsEnabled;
        
        // Aktualizuj przełącznik w oknie ustawień
        const effectsToggle = document.getElementById('sound-effects-toggle');
        if (effectsToggle) {
            effectsToggle.checked = this.soundEffectsEnabled;
        }
        
        // Zapisz ustawienia
        this.saveSoundSettings();
        
        // Pokaż powiadomienie
        if (typeof showNotification === 'function') {
            showNotification(this.soundEffectsEnabled ? "Efekty dźwiękowe włączone" : "Efekty dźwiękowe wyłączone");
        }
    },
    
    // Ustawianie głośności dźwięków
    setVolume: function(value) {
        // Wartość powinna być między 0.0 a 1.0
        this.volume = Math.max(0, Math.min(1, value));
        
        // Aktualizuj głośność wszystkich załadowanych dźwięków
        this.updateAllSoundVolumes();
        
        // Aktualizuj suwak w oknie ustawień
        const mainVolumeSlider = document.getElementById('sound-main-volume');
        if (mainVolumeSlider) {
            mainVolumeSlider.value = this.volume * 100;
        }
        
        const mainVolumeValue = document.getElementById('sound-main-volume-value');
        if (mainVolumeValue) {
            mainVolumeValue.textContent = Math.round(this.volume * 100) + '%';
        }
        
        // Zapisz ustawienia
        this.saveSoundSettings();
        
        // Pokaż powiadomienie
        if (typeof showNotification === 'function') {
            showNotification(`Głośność: ${Math.round(this.volume * 100)}%`);
        }
    },
    
    // Ustawianie głośności muzyki w tle
    setBackgroundMusicVolume: function(value) {
        // Wartość powinna być między 0.0 a 1.0
        this.backgroundMusicVolume = Math.max(0, Math.min(1, value));
        
        // Aktualizuj głośność muzyki w tle
        if (this.sounds.background) {
            this.sounds.background.volume = this.volume * this.backgroundMusicVolume;
        }
        
        // Aktualizuj suwak w oknie ustawień
        const musicVolumeSlider = document.getElementById('sound-music-volume');
        if (musicVolumeSlider) {
            musicVolumeSlider.value = this.backgroundMusicVolume * 100;
        }
        
        const musicVolumeValue = document.getElementById('sound-music-volume-value');
        if (musicVolumeValue) {
            musicVolumeValue.textContent = Math.round(this.backgroundMusicVolume * 100) + '%';
        }
        
        // Zapisz ustawienia
        this.saveSoundSettings();
    },
    
    // Ustawianie głośności efektów dźwiękowych
    setSoundEffectsVolume: function(value) {
        // Wartość powinna być między 0.0 a 1.0
        this.soundEffectsVolume = Math.max(0, Math.min(1, value));
        
        // Aktualizuj głośność wszystkich efektów dźwiękowych
        for (const [name, sound] of Object.entries(this.sounds)) {
            if (name !== 'background' && sound) {
                sound.volume = this.volume * this.soundEffectsVolume;
            }
        }
        
        // Aktualizuj suwak w oknie ustawień
        const effectsVolumeSlider = document.getElementById('sound-effects-volume');
        if (effectsVolumeSlider) {
            effectsVolumeSlider.value = this.soundEffectsVolume * 100;
        }
        
        const effectsVolumeValue = document.getElementById('sound-effects-volume-value');
        if (effectsVolumeValue) {
            effectsVolumeValue.textContent = Math.round(this.soundEffectsVolume * 100) + '%';
        }
        
        // Zapisz ustawienia
        this.saveSoundSettings();
    },
    
    // Aktualizacja głośności wszystkich dźwięków
    updateAllSoundVolumes: function() {
        for (const [name, sound] of Object.entries(this.sounds)) {
            if (sound) {
                if (name === 'background') {
                    sound.volume = this.volume * this.backgroundMusicVolume;
                } else {
                    sound.volume = this.volume * this.soundEffectsVolume;
                }
            }
        }
    },
    
    // Odtwarzanie dźwięku
    playSound: function(name) {
        // Jeśli dźwięki są wyłączone, nie odtwarzaj
        if (!this.soundEnabled) return;
        
        // Sprawdź czy dźwięk istnieje
        if (!this.sounds[name]) {
            console.error(`Dźwięk "${name}" nie istnieje!`);
            return;
        }
        
        // Sprawdź czy dźwięk powinien być odtworzony
        if (name === 'background' && !this.backgroundMusicEnabled) return;
        if (name !== 'background' && !this.soundEffectsEnabled) return;
        
        try {
            // Jeśli dźwięk już jest odtwarzany, zacznij od początku
            const sound = this.sounds[name];
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn(`Nie można odtworzyć dźwięku ${name}: ${error.message}`);
            });
        } catch (error) {
            console.error(`Błąd odtwarzania dźwięku ${name}: ${error.message}`);
        }
    },
    
    // Zatrzymanie dźwięku
    stopSound: function(name) {
        // Sprawdź czy dźwięk istnieje
        if (!this.sounds[name]) {
            console.error(`Dźwięk "${name}" nie istnieje!`);
            return;
        }
        
        try {
            const sound = this.sounds[name];
            sound.pause();
            sound.currentTime = 0;
        } catch (error) {
            console.error(`Błąd zatrzymywania dźwięku ${name}: ${error.message}`);
        }
    },
    
    // Zatrzymanie wszystkich dźwięków
    stopAllSounds: function() {
        for (const sound of Object.values(this.sounds)) {
            if (sound) {
                try {
                    sound.pause();
                    sound.currentTime = 0;
                } catch (error) {
                    console.error(`Błąd zatrzymywania dźwięku: ${error.message}`);
                }
            }
        }
    },
    
  
    



// Inicjalizacja kontrolek dźwięku w oknie ustawień
initSoundSettings: function() {
    console.log("Inicjalizacja kontrolek dźwięku w oknie ustawień");
    
    // Usunięto sekcję głównego przełącznika dźwięku i głównego suwaka

        
        // Przełącznik muzyki w tle
        const musicToggle = document.getElementById('sound-music-toggle');
        if (musicToggle) {
            musicToggle.checked = this.backgroundMusicEnabled;
            musicToggle.addEventListener('change', () => {
                this.toggleBackgroundMusic();
            });
        }
        
        // Suwak głośności muzyki w tle
        const musicVolumeSlider = document.getElementById('sound-music-volume');
        const musicVolumeValue = document.getElementById('sound-music-volume-value');
        if (musicVolumeSlider) {
            musicVolumeSlider.value = this.backgroundMusicVolume * 100;
            musicVolumeSlider.addEventListener('input', () => {
                const value = parseFloat(musicVolumeSlider.value) / 100;
                this.setBackgroundMusicVolume(value);
                if (musicVolumeValue) {
                    musicVolumeValue.textContent = Math.round(value * 100) + '%';
                }
            });
        }
        if (musicVolumeValue) {
            musicVolumeValue.textContent = Math.round(this.backgroundMusicVolume * 100) + '%';
        }
        
        // Przełącznik efektów dźwiękowych
        const effectsToggle = document.getElementById('sound-effects-toggle');
        if (effectsToggle) {
            effectsToggle.checked = this.soundEffectsEnabled;
            effectsToggle.addEventListener('change', () => {
                this.toggleSoundEffects();
            });
        }
        
        // Suwak głośności efektów dźwiękowych
        const effectsVolumeSlider = document.getElementById('sound-effects-volume');
        const effectsVolumeValue = document.getElementById('sound-effects-volume-value');
        if (effectsVolumeSlider) {
            effectsVolumeSlider.value = this.soundEffectsVolume * 100;
            effectsVolumeSlider.addEventListener('input', () => {
                const value = parseFloat(effectsVolumeSlider.value) / 100;
                this.setSoundEffectsVolume(value);
                if (effectsVolumeValue) {
                    effectsVolumeValue.textContent = Math.round(value * 100) + '%';
                }
            });
        }
        if (effectsVolumeValue) {
            effectsVolumeValue.textContent = Math.round(this.soundEffectsVolume * 100) + '%';
        }
        
        console.log("Kontrolki dźwięku zainicjalizowane");
    },
  
    // Obsługa zmiany ekranu (odtwarzanie muzyki w tle)
    handleScreenChange: function(screenId) {
        // Zatrzymaj muzykę w tle
        this.stopSound('background');
        
        // Odtwórz muzykę w tle dla ekranu głównego (tylko jeśli dźwięki są włączone)
        if (screenId === 'main-screen' && this.soundEnabled && this.backgroundMusicEnabled) {
            this.playSound('background');
            // Oznacz jako uruchomione
            this.backgroundMusicStarted = true;
        }
    }
};

// Automatyczna inicjalizacja modułu dźwięków przy ładowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        SoundModule.init();
        
        // Inicjalizacja kontrolek dźwięku w oknie ustawień
        SoundModule.initSoundSettings();
        
        // Próba uruchomienia muzyki, ale najpierw sprawdź, czy główny ekran jest aktywny
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen && mainScreen.classList.contains('active')) {
            console.log("Ekran główny jest aktywny, próba odtworzenia muzyki...");
            // Zaplanuj odtworzenie dźwięku po pierwszej interakcji z użytkownikiem
            SoundModule.tryPlayBackgroundMusic();
        }
    }, 1000);
});

// Obsługa kliknięć w różne elementy gry
document.addEventListener('click', function(event) {
    // Odtwórz dźwięk kliknięcia dla przycisków (ale nie dla przycisku dźwięku)
    if (event.target.tagName === 'BUTTON' && event.target.id !== 'sound-toggle-button') {
        SoundModule.playSound('click');
    }
});

// Dodaj obserwator dla zmian ekranu
document.addEventListener('DOMContentLoaded', function() {
    // Obserwuj każdy przycisk nawigacji
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) {
                SoundModule.handleScreenChange(screenId);
            }
        });
    });
});

// Eksportuj moduł do globalnego zakresu
window.SoundModule = SoundModule;

// Podłącz funkcje dźwiękowe do istniejących funkcji w grze
document.addEventListener('gameLoaded', function() {
    // Podpięcie dźwięków do zbierania nagród
    const originalCollectBirdReward = window.collectBirdReward;
    if (typeof originalCollectBirdReward === 'function') {
        window.collectBirdReward = function() {
            const result = originalCollectBirdReward.apply(this, arguments);
            if (result > 0) {
                SoundModule.playSound('collect');
            }
            return result;
        };
    }
    
    // Podpięcie dźwięków do karmienia ptaków
    const originalFeedBird = window.feedBird;
    if (typeof originalFeedBird === 'function') {
        window.feedBird = function() {
            const result = originalFeedBird.apply(this, arguments);
            SoundModule.playSound('feed');
            return result;
        };
    }
    
    // Podpięcie dźwięków do powiadomień
    const originalShowNotification = window.showNotification;
    if (typeof originalShowNotification === 'function') {
        window.showNotification = function() {
            SoundModule.playSound('notification');
            return originalShowNotification.apply(this, arguments);
        };
    }
    
    // Inicjalizacja kontrolek dźwięku w oknie ustawień
    SoundModule.initSoundSettings();
});