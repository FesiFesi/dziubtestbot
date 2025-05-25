// ===== SYSTEM DŹWIĘKÓW FEED & FLAP =====
console.log(t('sound.logs.initialization'));

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
            console.log(t('sound.logs.firstInteraction'));
            
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
        
        console.log(t('sound.logs.listenersSetup'));
    },

    // Głośność dźwięków (0.0 - 1.0)
    volume: 0.5,
    backgroundMusicVolume: 0.3,
    soundEffectsVolume: 0.7,
    
    // Obiekt przechowujący załadowane dźwięki
    sounds: {},
    
    // Inicjalizacja modułu dźwięków
    init: function() {
        console.log(t('sound.logs.moduleInit'));
        
        // Ładowanie dźwięków do pamięci
        this.loadSounds();
        
        // Sprawdź zapisane ustawienia dźwięku
        this.loadSoundSettings();
        
        // Dodaj style CSS dla elementów dźwięku
        this.addSoundStyles();
        
        // Napraw layout okna ustawień
        this.fixSettingsModalLayout();
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
                console.log(t('sound.logs.soundLoaded', { name: name }));
            } catch (error) {
                console.error(t('sound.logs.soundLoadError', { name: name, error: error.message }));
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
                
                console.log(t('sound.logs.settingsLoaded', { 
                    enabled: this.soundEnabled, 
                    volume: this.volume, 
                    music: this.backgroundMusicEnabled, 
                    effects: this.soundEffectsEnabled 
                }));
            }
        } catch (error) {
            console.error(t('sound.logs.settingsLoadError', { error: error.message }));
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
            console.log(t('sound.logs.settingsSaved', { 
                enabled: this.soundEnabled, 
                volume: this.volume, 
                music: this.backgroundMusicEnabled, 
                effects: this.soundEffectsEnabled 
            }));
        } catch (error) {
            console.error(t('sound.logs.settingsSaveError', { error: error.message }));
        }
    },
    
    // Tworzenie przycisku włączania/wyłączania dźwięku
    createSoundToggleButton: function() {
        // Wyłączone - teraz używamy kontrolek w panelu ustawień
        console.log(t('sound.logs.toggleButtonDisabled'));
        
        // Usuń istniejący przycisk, jeśli był wcześniej dodany
        const existingButton = document.getElementById('sound-toggle-button');
        if (existingButton && existingButton.parentNode) {
            existingButton.parentNode.removeChild(existingButton);
        }
    },

    // Funkcja naprawiająca układ okna ustawień
    fixSettingsModalLayout: function() {
        // Poczekaj na załadowanie DOM
        setTimeout(() => {
            const settingsModal = document.getElementById('settings-modal');
            if (!settingsModal) return;
            
            // Napraw kontener treści okna ustawień
            const settingsContent = settingsModal.querySelector('.settings-content');
            if (settingsContent) {
                settingsContent.style.width = '90%';
                settingsContent.style.maxWidth = '400px';
                settingsContent.style.maxHeight = '85vh';
                settingsContent.style.overflowY = 'auto';
                settingsContent.style.margin = 'auto';
            }
            
            // Napraw sekcję treści ustawień
            const settingsBody = settingsModal.querySelector('.settings-body');
            if (settingsBody) {
                settingsBody.style.padding = '15px';
                settingsBody.style.overflowY = 'auto';
            }
            
            // Napraw wygląd przycisków sekcji informacji prawnych
            const legalLinks = settingsModal.querySelector('.legal-links');
            if (legalLinks) {
                const buttons = legalLinks.querySelectorAll('a');
                buttons.forEach(button => {
                    button.style.padding = '10px 15px';
                    button.style.fontSize = '12px';
                    button.style.whiteSpace = 'normal';
                    button.style.height = 'auto';
                    button.style.display = 'flex';
                    button.style.alignItems = 'center';
                    button.style.justifyContent = 'center';
                    button.style.textAlign = 'center';
                });
            }
            
            console.log(t('sound.logs.layoutFixed'));
        }, 500);
    },
    
    // Dodanie stylów CSS dla elementów dźwięku
    addSoundStyles: function() {
        // Usuń istniejące style jeśli istnieją
        const existingStyles = document.getElementById('sound-module-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        const styles = document.createElement('style');
        styles.id = 'sound-module-styles';
        styles.innerHTML = `
            /* Główne style dla okna ustawień */
            #settings-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 2000;
                justify-content: center;
                align-items: center;
                overflow-y: auto;
                padding: 20px 10px;
                box-sizing: border-box;
            }
            
            #settings-modal .settings-content {
                background-color: white;
                border-radius: 20px;
                width: 90%;
                max-width: 400px;
                max-height: 85vh;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                position: relative;
                overflow: hidden;
                margin: auto;
                display: flex;
                flex-direction: column;
            }
            
            #settings-modal .settings-header {
                background: linear-gradient(135deg, #4fc3f7, #2196f3);
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            #settings-modal .settings-body {
                padding: 15px;
                overflow-y: auto;
                flex-grow: 1;
            }
            
            /* Style dla sekcji ustawień dźwięku */
            .sound-settings-container {
                background: #e3f2fd;
                border-radius: 15px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
            }
            
            .sound-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                background: white;
                padding: 10px 15px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }
            
            .sound-setting-label {
                font-weight: bold;
                color: #2196F3;
                font-size: 15px;
                margin-right: 10px;
                flex-shrink: 0;
                max-width: 45%;
            }
            
            /* Style dla przełączników typu toggle */
            .sound-toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
                flex-shrink: 0;
            }
            
            .sound-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
                margin: 0;
                padding: 0;
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
                border: none;
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
                border: none;
            }
            
            input:checked + .sound-toggle-slider {
                background-color: #9C27B0 !important;
            }
            
            input:focus + .sound-toggle-slider {
                box-shadow: 0 0 1px #9C27B0 !important;
            }
            
            input:checked + .sound-toggle-slider:before {
                transform: translateX(26px);
            }
            
            /* Style dla suwaków głośności */
            .sound-volume-slider {
                -webkit-appearance: none;
                appearance: none;
                height: 8px;
                border-radius: 4px;
                background: #e0e0e0;
                outline: none;
                flex: 1;
                margin: 0 10px;
                max-width: 100px;
            }
            
            .sound-volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #9C27B0;
                cursor: pointer;
                box-shadow: 0 0 5px rgba(156, 39, 176, 0.3);
            }
            
            .sound-volume-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #9C27B0;
                cursor: pointer;
                box-shadow: 0 0 5px rgba(156, 39, 176, 0.3);
                border: none;
            }
            
            .sound-volume-value {
                font-weight: bold;
                color: #9C27B0;
                min-width: 7px;
                text-align: right;
                flex-shrink: 0;
                font-size: 13px;
                margin-left: -22px;
                margin-right: 39px;
            }
            
            .sound-setting-divider {
                margin: 15px 0;
                border: 0;
                height: 1px;
                background-color: rgba(33, 150, 243, 0.2);
            }
            
            /* Style dla sekcji języka */
            .settings-section {
                background: linear-gradient(135deg, #ffb347, #ffcc5c);
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 2px 8px rgba(255, 179, 71, 0.3);
                margin-top: 20px;
            }
            
            .language-options {
                display: flex;
                justify-content: space-around;
                margin-top: 15px;
                flex-wrap: wrap;
                gap: 5px;
            }
            
            .language-option {
                text-align: center;
                cursor: pointer;
                background: white;
                padding: 8px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
                min-width: 60px;
            }
            
            .flag-container {
                width: 50px;
                height: 30px;
                margin-bottom: 5px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
            }
            
            /* Style dla sekcji informacji prawnych */
            .legal-links {
                margin-top: 20px;
                border-top: 1px solid #e0e0e0;
                padding-top: 15px;
            }
            
            .legal-links h3 {
                margin-bottom: 15px;
                color: #1565c0;
                text-align: center;
                font-size: 18px;
            }
            
            .legal-links > div {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 15px;
                flex-wrap: wrap;
            }
            
            .legal-links a {
                background: linear-gradient(135deg, #4fc3f7, #2196f3);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 3px 8px rgba(33, 150, 243, 0.3);
                transition: all 0.2s ease-in-out;
                flex: 1;
                max-width: 130px;
                min-width: 110px;
                font-size: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: auto;
            }
        `;
        document.head.appendChild(styles);
    },
    
    // Włączanie/wyłączanie dźwięku
    toggleSound: function() {
        this.soundEnabled = !this.soundEnabled;
        
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
            showNotification(this.soundEnabled ? t('sound.notifications.soundsEnabled') : t('sound.notifications.soundsDisabled'));
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
            showNotification(this.backgroundMusicEnabled ? t('sound.notifications.backgroundMusicEnabled') : t('sound.notifications.backgroundMusicDisabled'));
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
            showNotification(this.soundEffectsEnabled ? t('sound.notifications.soundEffectsEnabled') : t('sound.notifications.soundEffectsDisabled'));
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
            showNotification(t('sound.notifications.volume', { volume: Math.round(this.volume * 100) }));
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
            console.error(t('sound.errors.soundNotFound', { name: name }));
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
                console.warn(t('sound.errors.soundPlayWarning', { name: name, error: error.message }));
            });
        } catch (error) {
            console.error(t('sound.errors.soundPlayError', { name: name, error: error.message }));
        }
    },
    
    // Zatrzymanie dźwięku
    stopSound: function(name) {
        // Sprawdź czy dźwięk istnieje
        if (!this.sounds[name]) {
            console.error(t('sound.errors.soundNotFound', { name: name }));
            return;
        }
        
        try {
            const sound = this.sounds[name];
            sound.pause();
            sound.currentTime = 0;
        } catch (error) {
            console.error(t('sound.errors.soundStopError', { name: name, error: error.message }));
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
                    console.error(t('sound.errors.soundStopError', { error: error.message }));
                }
            }
        }
    },
    
    // Inicjalizacja kontrolek dźwięku w oknie ustawień
    initSoundSettings: function() {
        console.log(t('sound.logs.initSoundSettings'));
        
        // Upewnij się, że style są załadowane
        this.addSoundStyles();
        
        // Napraw układ okna ustawień
        this.fixSettingsModalLayout();
        
        // Przełącznik muzyki w tle
        const musicToggle = document.getElementById('sound-music-toggle');
        if (musicToggle) {
            // Usuń wszystkie istniejące nasłuchiwacze zdarzeń
            const newMusicToggle = musicToggle.cloneNode(true);
            if (musicToggle.parentNode) {
                musicToggle.parentNode.replaceChild(newMusicToggle, musicToggle);
            }
            
            // Ustaw stan początkowy
            newMusicToggle.checked = this.backgroundMusicEnabled;
            
            // Dodaj nowy nasłuchiwacz
            newMusicToggle.addEventListener('change', () => {
                this.backgroundMusicEnabled = newMusicToggle.checked;
                this.saveSoundSettings();
                
                if (!this.backgroundMusicEnabled) {
                    this.stopSound('background');
                } else if (this.soundEnabled) {
                    const mainScreen = document.getElementById('main-screen');
                    if (mainScreen && mainScreen.classList.contains('active')) {
                        this.playSound('background');
                    }
                }
                
                if (typeof showNotification === 'function') {
                    showNotification(this.backgroundMusicEnabled ? t('sound.notifications.backgroundMusicEnabled') : t('sound.notifications.backgroundMusicDisabled'));
                }
            });
        }
        
        // Suwak głośności muzyki w tle
        const musicVolumeSlider = document.getElementById('sound-music-volume');
        const musicVolumeValue = document.getElementById('sound-music-volume-value');
        if (musicVolumeSlider) {
            // Usuń wszystkie istniejące nasłuchiwacze zdarzeń
            const newMusicVolumeSlider = musicVolumeSlider.cloneNode(true);
            if (musicVolumeSlider.parentNode) {
                musicVolumeSlider.parentNode.replaceChild(newMusicVolumeSlider, musicVolumeSlider);
            }
            
            // Ustaw wartość początkową
            newMusicVolumeSlider.value = this.backgroundMusicVolume * 100;
            
            // Dodaj nowy nasłuchiwacz
            newMusicVolumeSlider.addEventListener('input', () => {
                const value = parseFloat(newMusicVolumeSlider.value) / 100;
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
            // Usuń wszystkie istniejące nasłuchiwacze zdarzeń
            const newEffectsToggle = effectsToggle.cloneNode(true);
            if (effectsToggle.parentNode) {
                effectsToggle.parentNode.replaceChild(newEffectsToggle, effectsToggle);
            }
            
            // Ustaw stan początkowy
            newEffectsToggle.checked = this.soundEffectsEnabled;
            
            // Dodaj nowy nasłuchiwacz
            newEffectsToggle.addEventListener('change', () => {
                this.soundEffectsEnabled = newEffectsToggle.checked;
                this.saveSoundSettings();
                
                if (typeof showNotification === 'function') {
                    showNotification(this.soundEffectsEnabled ? t('sound.notifications.soundEffectsEnabled') : t('sound.notifications.soundEffectsDisabled'));
                }
            });
        }
        
        // Suwak głośności efektów dźwiękowych
        const effectsVolumeSlider = document.getElementById('sound-effects-volume');
        const effectsVolumeValue = document.getElementById('sound-effects-volume-value');
        if (effectsVolumeSlider) {
            // Usuń wszystkie istniejące nasłuchiwacze zdarzeń
            const newEffectsVolumeSlider = effectsVolumeSlider.cloneNode(true);
            if (effectsVolumeSlider.parentNode) {
                effectsVolumeSlider.parentNode.replaceChild(newEffectsVolumeSlider, effectsVolumeSlider);
            }
            
            // Ustaw wartość początkową
            newEffectsVolumeSlider.value = this.soundEffectsVolume * 100;
            
            // Dodaj nowy nasłuchiwacz
            newEffectsVolumeSlider.addEventListener('input', () => {
                const value = parseFloat(newEffectsVolumeSlider.value) / 100;
                this.setSoundEffectsVolume(value);
                if (effectsVolumeValue) {
                    effectsVolumeValue.textContent = Math.round(value * 100) + '%';
                }
            });
        }
        if (effectsVolumeValue) {
            effectsVolumeValue.textContent = Math.round(this.soundEffectsVolume * 100) + '%';
        }
        
        console.log(t('sound.logs.soundControlsInitialized'));
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
    },

    // Inicjalizacja kontrolek wyboru języka
    initLanguageOptions: function() {
        console.log(t('sound.logs.initLanguageOptions'));
        
        // Pobierz wszystkie elementy flag
        const languageOptions = document.querySelectorAll('.language-option');
        
        // Aktualny język
        const currentLang = localStorage.getItem('gameLanguage') || 'pl';
        
        // Dla każdej flagi dodaj obsługę kliknięcia
        languageOptions.forEach(option => {
            // Usuń wszystkie istniejące nasłuchiwacze zdarzeń
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
            
            // Pobierz język z tekstu
            const langText = newOption.querySelector('span').textContent.toLowerCase();
            
            // Obsługujemy tylko polski i angielski
            if (langText === 'pl' || langText === 'en') {
                const lang = langText === 'pl' ? 'pl' : 'en';
                
                // Ukryj flagę ukraińską
                if (langText === 'ua') {
                    newOption.style.display = 'none';
                    return;
                }
                
                // Ustaw odpowiednie style dla aktywnego języka
                if (lang === currentLang) {
                    newOption.querySelector('.flag-container').style.border = '2px solid #ff9800';
                    newOption.querySelector('span').style.color = '#ff9800';
                } else {
                    newOption.querySelector('.flag-container').style.border = 'none';
                    newOption.querySelector('span').style.color = '#757575';
                }
                
                // Dodaj nasłuchiwacz kliknięcia
                newOption.addEventListener('click', () => {
                    // Zmień język
                    if (typeof window.changeLanguage === 'function') {
                        window.changeLanguage(lang);
                        
                        // Aktualizuj style wszystkich flag
                        document.querySelectorAll('.language-option').forEach(opt => {
                            const optLangText = opt.querySelector('span').textContent.toLowerCase();
                            if (optLangText === 'pl' || optLangText === 'en') {
                                const optLang = optLangText === 'pl' ? 'pl' : 'en';
                                
                                if (optLang === lang) {
                                    opt.querySelector('.flag-container').style.border = '2px solid #ff9800';
                                    opt.querySelector('span').style.color = '#ff9800';
                                } else {
                                    opt.querySelector('.flag-container').style.border = 'none';
                                    opt.querySelector('span').style.color = '#757575';
                                }
                            }
                        });
                        
                        // Pokaż powiadomienie o zmianie języka
                        if (typeof showNotification === 'function') {
                            const langNames = {
                                'pl': t('sound.language.polish'),
                                'en': t('sound.language.english')
                            };
                            showNotification(t('sound.notifications.languageChanged', { language: langNames[lang] }));
                        }
                        
                        // Odtwórz dźwięk kliknięcia
                        this.playSound('click');
                    }
                });
            } else {
                // Jeśli to ukraińska flaga, ukryj ją
                newOption.style.display = 'none';
            }
        });
        
        console.log(t('sound.logs.languageControlsInitialized'));
    }
};

// Automatyczna inicjalizacja modułu dźwięków przy ładowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        SoundModule.init();
        
        // Inicjalizacja kontrolek dźwięku w oknie ustawień
        SoundModule.initSoundSettings();

        // Inicjalizacja kontrolek języka
        SoundModule.initLanguageOptions();
        
        // Próba uruchomienia muzyki, ale najpierw sprawdź, czy główny ekran jest aktywny
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen && mainScreen.classList.contains('active')) {
            console.log(t('sound.logs.mainScreenActive'));
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

    // Inicjalizacja kontrolek języka
    SoundModule.initLanguageOptions();
});