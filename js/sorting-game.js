// ===== MINI-GRA SORTOWANIA ZIARENEK =====
console.log(t('sortingGame.initialization'));

// Zmienne globalne dla mini-gry
let seedsToSort = [];
let currentSeedElement = null;
let seedsRemaining = 0;
let collectedSeeds = 0;
let timeRemaining = 45;
let timerInterval = null;
let isDragging = false;
let touchOffsetX = 0;
let touchOffsetY = 0;
let lastTapTime = 0; // Dodana zmienna do śledzenia czasu ostatniego tapnięcia
let isTelegramWebApp = false; // Flaga do wykrywania Telegram WebApp








function startSortingGame() {
    console.log(t('sortingGame.starting'));
    
    // Reset zmiennej kończącej grę
    window.gameEnded = false;
    
    // Sprawdź czy jesteśmy w Telegram WebApp
    isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
    console.log(t('sortingGame.telegramCheck', { status: isTelegramWebApp }));
    
    // Ukryj ekran hodowli
    const breedingScreen = document.getElementById('breeding-screen');
    const sortingScreen = document.getElementById('sorting-game-screen');
    
    // POPRAWKA: Upewnij się, że ekran sortowania ma klasę game-screen
    if (sortingScreen && !sortingScreen.classList.contains('game-screen')) {
        sortingScreen.classList.add('game-screen');
        console.log("Naprawiono: Dodano brakującą klasę game-screen do ekranu sortowania");
    }
    
    // Ukryj ekran podsumowania jeśli jest widoczny
    const summaryScreen = document.getElementById('summary-screen');
    if (summaryScreen) {
        summaryScreen.style.display = 'none';
    }
    
    if (breedingScreen && sortingScreen) {
        breedingScreen.classList.remove('active');
        sortingScreen.classList.add('active');
        
        // POPRAWKA: Opóźnij inicjalizację gry, dając czas na pełne załadowanie DOM
        setTimeout(() => {
            // Zainicjalizuj grę
            initializeSortingGame();
            
            // NOWOŚĆ: Dodatkowe inicjalizacje dla pewności
            setTimeout(() => {
                safeSortingGameInit();
            }, 300);
        }, 100);
    } else {
        console.error("Nie znaleziono ekranów hodowli lub sortowania!");
    }
}
















function initializeSortingGame() {
    console.log(t('sortingGame.seedsInitialization'));
    
    // Reset zmiennych gry
    collectedSeeds = 0;
    timeRemaining = 45;
    currentSeedElement = null;
    
    // Ukryj ekran podsumowujący
    const summaryScreen = document.getElementById('summary-screen');
    if (summaryScreen) {
        summaryScreen.style.display = 'none';
    }
    
    // Wyczyść stare ziarenka
    const seedsContainer = document.getElementById('seeds-container');
    if (seedsContainer) {
        seedsContainer.innerHTML = '';
    } else {
        console.error("Nie znaleziono kontenera ziarenek (seeds-container)");
    }
    
    // Stwórz 30 ziarenek (4 rodzaje po 7-8 sztuk)
    seedsToSort = [];
    for (let type = 1; type <= 4; type++) {
        for (let i = 0; i < 8; i++) {
            if (seedsToSort.length < 30) {
                seedsToSort.push(type);
            }
        }
    }
    
    // Uzupełnij do 30 ziarenek
    while (seedsToSort.length < 30) {
        seedsToSort.push(1);
    }
    
    // Wymieszaj ziarenka
    shuffleArray(seedsToSort);
    
    // Umieść ziarenka na ekranie
    if (seedsContainer) {
        seedsToSort.forEach(type => {
            createSeed(type);
        });
    }
    
    // Ustaw licznik
    seedsRemaining = seedsToSort.length;
    
    // Wyszukaj elementy UI lub stwórz je jeśli nie istnieją
    initializeUIElements();
    
    // Zatrzymaj istniejący timer jeśli istnieje
    stopTimer();
    
    // Inicjalizacja eventów miseczek
    setTimeout(() => {
        setupBowlEvents();
    }, 100);
    
    // Uruchom timer z dłuższym opóźnieniem
    setTimeout(() => {
        startTimer();
    }, 500); // Zwiększone opóźnienie dla pewności
    
    // Dla pewności ponownie zainicjalizuj po 2 sekundach
    setTimeout(safeSortingGameInit, 2000);
}

// Nowa funkcja inicjalizująca elementy UI
function initializeUIElements() {
    // Napraw element licznika
    let counterElement = document.getElementById('collected-count');
    if (!counterElement) {
        // Znajdź kontener
        const counterContainer = document.getElementById('seeds-remaining');
        if (counterContainer) {
            // Sprawdź czy są już jakieś spany
            const spans = counterContainer.querySelectorAll('span');
            if (spans.length > 0) {
                // Użyj drugiego spana jako licznika (jeśli istnieje)
                if (spans.length > 1) {
                    spans[1].id = 'collected-count';
                    counterElement = spans[1];
                } else {
                    // Użyj pierwszego dostępnego
                    spans[0].id = 'collected-count';
                    counterElement = spans[0];
                }
            } else {
                // Stwórz nowy span jeśli nie istnieje
                counterElement = document.createElement('span');
                counterElement.id = 'collected-count';
                const collectedText = document.createElement('span');
collectedText.setAttribute('data-i18n', 'sortingGame.collected');
collectedText.setAttribute('data-i18n-values', JSON.stringify({count: collectedSeeds}));
collectedText.innerHTML = t('sortingGame.collected', {count: collectedSeeds});
counterContainer.appendChild(collectedText);
            }
        }
    }
    
    // Ustaw początkową wartość licznika
    if (counterElement) {
        counterElement.textContent = collectedSeeds;
    }
    
    // Napraw element timera
    let timerElement = document.getElementById('time-left');
    if (!timerElement) {
        // Znajdź kontener
        const timerContainer = document.getElementById('sorting-timer');
        if (timerContainer) {
            // Sprawdź czy są już jakieś spany
            const spans = timerContainer.querySelectorAll('span');
            if (spans.length > 0) {
                // Użyj drugiego spana jako timera (jeśli istnieje)
                if (spans.length > 1) {
                    spans[1].id = 'time-left';
                    timerElement = spans[1];
                } else {
                    // Użyj pierwszego dostępnego
                    spans[0].id = 'time-left';
                    timerElement = spans[0];
                }
            } else {
                // Stwórz nowy span jeśli nie istnieje
                timerElement = document.createElement('span');
                timerElement.id = 'time-left';
                timerContainer.appendChild(document.createTextNode('Czas: '));
                timerContainer.appendChild(timerElement);
            }
        }
    }
    
    // Ustaw początkową wartość timera
    if (timerElement) {
        timerElement.textContent = "0:45";
    }
}











function updateCollectedCounter() {
    // Próba znalezienia elementu licznika na kilka sposobów
    let counterElement = document.getElementById('collected-count');
    
    // Jeśli nie znaleziono po ID, próbujemy znaleźć przez selektor
    if (!counterElement) {
        const counterContainer = document.getElementById('seeds-remaining');
        if (counterContainer) {
            // Próbujemy znaleźć zagnieżdżony span
            const spans = counterContainer.querySelectorAll('span');
            if (spans.length > 1) {
                // Przypisz ID do drugiego spana
                spans[1].id = 'collected-count';
                counterElement = spans[1];
                console.log("Naprawiono: Przypisano ID do elementu licznika");
            } else if (spans.length === 1) {
                // Jeśli jest tylko jeden span, użyj go
                counterElement = spans[0];
            }
        }
    }
    
    if (counterElement) {
        try {
            counterElement.textContent = collectedSeeds;
            
            // Upewnij się, że tekst nadrzędnego elementu jest poprawny
            const remainingText = document.getElementById('seeds-remaining');
            if (remainingText) {
                // Sprawdź czy tekst zawiera odpowiedni format (X / 30)
                if (!remainingText.textContent.includes('30')) {
                    const spans = remainingText.querySelectorAll('span');
                    if (spans.length > 0) {
                        // Aktualizuj tylko span z liczbą
                        spans[0].textContent = t('sortingGame.collected', {count: collectedSeeds});
                    } else {
                        // Aktualizuj cały element
                        remainingText.innerHTML = t('sortingGame.collected', {count: collectedSeeds}) + ' / 30 ziarenek';
                    }
                }
            }
            
            console.log("Aktualizacja licznika:", collectedSeeds);
        } catch (e) {
            console.error("Błąd przy aktualizacji licznika:", e);
        }
    } else {
        console.error("Nie znaleziono elementu licznika (collected-count) - szczegółowa diagnostyka");
        
        // Próba naprawy - szukamy wszystkich pasujących elementów
        const allSpans = document.querySelectorAll('#seeds-remaining span');
        console.log("Wszystkie elementy span w liczniku:", allSpans.length);
        
        if (allSpans.length > 0) {
            // Użyj pierwszego dostępnego spana
            allSpans[0].textContent = collectedSeeds;
            console.log("Awaryjne ustawienie licznika na pierwszym dostępnym spanie");
        }
    }
}











function startTimer() {
    console.log("Uruchamiam timer z czasem początkowym:", timeRemaining);
    
    // Upewnij się, że czas początkowy jest poprawnie ustawiony
    if (timeRemaining <= 0 || timeRemaining > 300) {
        console.log("Resetowanie nieprawidłowego czasu początkowego");
        timeRemaining = 45; // Reset do domyślnej wartości
    }
    
    // Wyczyść istniejący interval
    stopTimer(); // Użyj funkcji stopTimer dla pewności
    
    // Wyświetl początkowy czas
    updateTimerDisplay();
    
    // Uruchom odliczanie z bezpiecznikiem
    try {
        timerInterval = setInterval(function() {
            timeRemaining--;
            console.log("Timer: pozostały czas:", timeRemaining);
            updateTimerDisplay();
            
            if (timeRemaining <= 0) {
                stopTimer();
                endGame();
            }
        }, 1000);
        
        console.log("Timer uruchomiony, interval ID:", timerInterval);
        
        // Zapisz timerInterval także w window, aby mieć pewność, że nie zgubi się
        window.sortingGameTimerInterval = timerInterval;
        
        // Dodatkowe zabezpieczenie - jeśli timer nie działa, spróbuj ponownie za 2 sekundy
        setTimeout(function() {
            if (timeRemaining === 45) {
                console.log("Timer nie działa - próba ponownego uruchomienia");
                stopTimer();
                timerInterval = setInterval(function() {
                    timeRemaining--;
                    updateTimerDisplay();
                    
                    if (timeRemaining <= 0) {
                        stopTimer();
                        endGame();
                    }
                }, 1000);
            }
        }, 2000);
    } catch (e) {
        console.error("Błąd przy uruchamianiu timera:", e);
    }
}

















function stopTimer() {
    if (timerInterval) {
        console.log("Zatrzymuję timer, interval ID:", timerInterval);
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Dodatkowe zabezpieczenie
    if (window.sortingGameTimerInterval) {
        clearInterval(window.sortingGameTimerInterval);
        window.sortingGameTimerInterval = null;
    }
}





function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Próba znalezienia elementu timera na kilka sposobów
    let timerElement = document.getElementById('time-left');
    
    // Jeśli nie znaleziono po ID, próbujemy znaleźć przez selektor
    if (!timerElement) {
        const timerContainer = document.getElementById('sorting-timer');
        if (timerContainer) {
            // Próbujemy znaleźć zagnieżdżony span
            const spans = timerContainer.querySelectorAll('span');
            if (spans.length > 1) {
                // Przypisz ID do drugiego spana
                spans[1].id = 'time-left';
                timerElement = spans[1];
                console.log("Naprawiono: Przypisano ID do elementu timera");
            } else if (spans.length === 1) {
                // Jeśli jest tylko jeden span, użyj go
                timerElement = spans[0];
            }
        }
    }
    
    if (timerElement) {
        timerElement.textContent = formattedTime;
        console.log("Aktualizacja timera:", formattedTime);
    } else {
        console.error("Nie znaleziono elementu timera (time-left) - szczegółowa diagnostyka");
        
        // Dodatkowa diagnostyka
        const allSpans = document.querySelectorAll('#sorting-timer span');
        console.log("Wszystkie elementy span w timerze:", allSpans.length);
        allSpans.forEach((s, i) => console.log(`Span ${i}:`, s.textContent));
    }
}







function createSeed(type) {
    const seedsContainer = document.getElementById('seeds-container');
    const seed = document.createElement('img');
    
    seed.src = `assets/images/clean${type}.png`;
    seed.className = 'draggable-seed';
    seed.dataset.type = type;
    
    // Poprawione pozycjonowanie
    const containerWidth = seedsContainer.offsetWidth;
    const containerHeight = seedsContainer.offsetHeight;
    
    const randomX = Math.random() * (containerWidth - 30);
    const randomY = Math.random() * (containerHeight - 30);
    
    seed.style.position = 'absolute';
    seed.style.left = `${randomX}px`;
    seed.style.top = `${randomY}px`;
    seed.style.width = '30px';
    seed.style.height = '30px';
    seed.style.cursor = 'grab';
    seed.style.transition = 'transform 0.2s';
    seed.style.zIndex = '10'; // Dodajemy z-index, aby ziarenka były nad innymi elementami
    
    // Standardowe drag & drop dla komputerów (pozostawione bez zmian)
    seed.draggable = true;
    
    seed.addEventListener('dragstart', function(e) {
        this.style.opacity = '0.7';
        e.dataTransfer.setData('seedType', this.dataset.type);
        if (e.dataTransfer.setDragImage) {
            e.dataTransfer.setDragImage(this, 15, 15);
        }
        currentSeedElement = this;
        this.classList.add('active'); // NOWOŚĆ: dodana klasa active
    });
    
    seed.addEventListener('dragend', function(e) {
        this.style.opacity = '1';
        this.classList.remove('active'); // NOWOŚĆ: usunięta klasa active
    });
    
    // Zmodyfikowana obsługa zdarzeń dotykowych
    seed.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Zapobiega domyślnym zachowaniom przeglądarki
        
        // Zapamiętaj czas dotknięcia dla wykrycia pojedynczego tapnięcia
        const now = new Date().getTime();
        const timeSinceLastTap = now - lastTapTime;
        lastTapTime = now;
        
        // Jeśli jesteśmy w aplikacji Telegram i dotknięcie nie jest podwójnym tapnięciem,
        // to traktuj je jako wybór ziarenka zamiast rozpoczęcia przeciągania
        if (isTelegramWebApp && timeSinceLastTap > 300) {
            selectSeed(this);
            return;
        }
        
        // Zapisz pozycję dotknięcia względem ziarenka
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        touchOffsetX = touch.clientX - rect.left;
        touchOffsetY = touch.clientY - rect.top;
        
        // Zaznacz ziarenko
        currentSeedElement = this;
        this.style.opacity = '0.7';
        this.style.transform = 'scale(1.2)';
        this.classList.add('active'); // NOWOŚĆ: dodana klasa active
        
        // Ustaw flagę przeciągania
        isDragging = true;
        
        // Zwiększ z-index, aby ziarenko było na wierzchu
        this.style.zIndex = '100';
    }, { passive: false });
    
    // Dodaj obsługę kliknięcia
    seed.addEventListener('click', function() {
        selectSeed(this);
    });
    
    seedsContainer.appendChild(seed);
}

// Poprawiona obsługa zdarzeń dotykowych dla dokumentu
document.addEventListener('touchmove', function(e) {
    if (isDragging && currentSeedElement && !isTelegramWebApp) {
        e.preventDefault(); // Zapobiega przewijaniu strony, ale tylko poza Telegramem
        
        const touch = e.touches[0];
        
        // Oblicz nową pozycję ziarenka
        const newX = touch.clientX - touchOffsetX;
        const newY = touch.clientY - touchOffsetY;
        
        // Aktualizuj pozycję ziarenka
        currentSeedElement.style.left = `${newX}px`;
        currentSeedElement.style.top = `${newY}px`;
        
        // Sprawdź, czy ziarenko jest nad miseczką
        checkBowlCollision(touch.clientX, touch.clientY);
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (isDragging && currentSeedElement && !isTelegramWebApp) {
        e.preventDefault();
        
        // Sprawdź, czy ziarenko zostało upuszczone na miseczkę
        const lastTouch = e.changedTouches[0];
        processDrop(lastTouch.clientX, lastTouch.clientY);
        
        // Przywróć normalny wygląd ziarenka
        currentSeedElement.style.opacity = '1';
        currentSeedElement.style.transform = 'scale(1)';
        currentSeedElement.style.zIndex = '10';
        currentSeedElement.classList.remove('active'); // NOWOŚĆ: usunięta klasa active
        
        // Resetuj stan przeciągania
        isDragging = false;
    }
}, { passive: false });

// Funkcja do sprawdzania kolizji z miseczkami
function checkBowlCollision(x, y) {
    document.querySelectorAll('.bowl').forEach(bowl => {
        const rect = bowl.getBoundingClientRect();
        
        // Sprawdź, czy punkt (x, y) znajduje się nad miseczką
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            bowl.style.transform = 'scale(1.1)';
        } else {
            bowl.style.transform = 'scale(1)';
        }
    });
}









function processDrop(x, y) {
    let droppedOnBowl = false;
    
    document.querySelectorAll('.bowl').forEach(bowl => {
        const rect = bowl.getBoundingClientRect();
        
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            // Ziarenko zostało upuszczone na miseczkę
            droppedOnBowl = true;
            bowl.style.transform = 'scale(1)';
            
            // Sprawdź, czy ziarenko pasuje do miseczki
            if (currentSeedElement && currentSeedElement.dataset && currentSeedElement.dataset.type === bowl.dataset.type) {
                // Poprawne dopasowanie
                console.log(t('sortingGame.correctMatch'));
                
                // Usuń ziarenko
                if (currentSeedElement.parentNode) {
                    currentSeedElement.remove();
                }
                
                // Zwiększ licznik zebranych
                collectedSeeds++;
                console.log("Zebrano ziarenko! Łącznie:", collectedSeeds);
                
                // Aktualizacja licznika - bezpośrednie ustawienie wartości
                const counterElement = document.getElementById('collected-count');
                if (counterElement) {
                    counterElement.textContent = collectedSeeds;
                }
                
                // Dodatkowo aktualizuj przez naszą funkcję
                updateCollectedCounter();
                
                // Wizualne potwierdzenie
                bowl.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    bowl.style.transform = 'scale(1)';
                }, 300);
                
                // Sprawdź czy koniec gry
                if (collectedSeeds >= 30) {
                    console.log("Wszystkie ziarenka zebrane!");
                    stopTimer();
                    endGame();
                }
            } else {
                // Błędne dopasowanie
                console.log(t('sortingGame.wrongMatch'));
                try {
                    showNotification(t('sortingGame.wrongBowl'));
                } catch (e) {
                    console.error("Błąd przy wyświetlaniu powiadomienia:", e);
                    // Alternatywne podejście
                    showNotification("To nie ta miseczka!");
                }
            }
        }
    });
    
    // Jeśli ziarenko nie zostało upuszczone na żadną miseczkę, po prostu zostaje na nowej pozycji
    currentSeedElement = null;
}











// Funkcja do mieszania tablicy
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// CAŁKOWICIE NOWA FUNKCJA WYBORU ZIARENKA
function selectSeed(seed) {
    console.log("Wybieranie ziarenka:", seed);
    
    // Usuń klasę active ze wszystkich ziarenek
    document.querySelectorAll('.draggable-seed').forEach(s => {
        s.classList.remove('active');
        s.style.transform = 'scale(1)';
        s.style.opacity = '1';
        // Usuń dodatkowe efekty na telegramie
        if (isTelegramWebApp && s.style) {
            s.style.boxShadow = 'none';
        }
    });
    
    // Zaznacz nowe ziarenko
    currentSeedElement = seed;
    seed.classList.add('active');
    seed.style.transform = 'scale(1.2)';
    seed.style.opacity = '0.8';
    
    // Dodane: wyraźne podświetlenie na telegramie
    if (isTelegramWebApp) {
        seed.style.boxShadow = '0 0 10px 5px rgba(255,255,0,0.7)';
    }
    
    try {
        console.log(t('sortingGame.seedSelected', { type: seed.dataset.type }));
    } catch (e) {
        console.log("Wybrano ziarenko typu: " + seed.dataset.type);
    }
    
    // Opcjonalnie: wyświetl podpowiedź dla użytkownika na telegramie
    if (isTelegramWebApp) {
        try {
            showNotification(t('sortingGame.clickBowl'));
        } catch (e) {
            console.error("Błąd przy wyświetlaniu podpowiedzi:", e);
            // Alternatywne podejście
            showNotification("Kliknij na miseczkę, aby umieścić w niej ziarenko!");
        }
    }
}

// CAŁKOWICIE NOWA FUNKCJA INICJALIZACJI MISECZEK
function setupBowlEvents() {
    console.log("Inicjalizacja eventów miseczek - NAPRAWIONA WERSJA");
    
    document.querySelectorAll('.bowl').forEach(bowl => {
        // Usuń wszystkie istniejące listenery
        const newBowl = bowl.cloneNode(true);
        if (bowl.parentNode) {
            bowl.parentNode.replaceChild(newBowl, bowl);
        }
        
        // Obsługa zdarzeń dla drag & drop na komputerze
        newBowl.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1.1)';
        });
        
        newBowl.addEventListener('dragleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        newBowl.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            
            const seedType = e.dataTransfer.getData('seedType');
            
            // Sprawdź, czy ziarenko pasuje do miseczki
            if (seedType === this.dataset.type) {
                // Poprawne dopasowanie
                try {
                    console.log(t('sortingGame.correctMatch'));
                } catch (e) {
                    console.log("Dobrze! Ziarenko w miseczce.");
                }
                
                // Usuń ziarenko
                if (currentSeedElement) {
                    currentSeedElement.remove();
                    currentSeedElement = null;
                }
                
                // Zwiększ licznik zebranych
                collectedSeeds++;
                
                // POPRAWKA: Aktualizacja licznika w formacie "X/30"
                updateCollectedCounter();
                
                // Sprawdź czy koniec gry
                if (collectedSeeds === 30) {
                    stopTimer();
                    endGame();
                }
            } else {
                // Błędne dopasowanie
                try {
                    console.log(t('sortingGame.wrongMatch'));
                    showNotification(t('sortingGame.wrongBowl'));
                } catch (e) {
                    console.log("Źle! To nie ta miseczka.");
                    showNotification("To nie ta miseczka!");
                }
                
                if (currentSeedElement) {
                    currentSeedElement.style.transform = 'scale(1)';
                    currentSeedElement.style.opacity = '1';
                }
            }
        });
        
        // NAPRAWIONA OBSŁUGA KLIKNIĘCIA
        newBowl.addEventListener('click', function(e) {
            console.log("Kliknięto miseczkę");
            
            // Dodane zabezpieczenie - sprawdzamy zarówno zmienną jak i klasę CSS
            let activeSeed = currentSeedElement;
            if (!activeSeed) {
                // Próba znalezienia aktywnego ziarenka po klasie CSS
                activeSeed = document.querySelector('.draggable-seed.active');
                if (activeSeed) {
                    console.log("Znaleziono aktywne ziarenko przez klasę CSS");
                    currentSeedElement = activeSeed;
                }
            }
            
            if (activeSeed) {
                console.log("Mamy aktywne ziarenko:", activeSeed.dataset.type);
                // Pobierz typ ziarenka i miseczki
                const seedType = activeSeed.dataset.type;
                const bowlType = this.dataset.type;
                
                console.log(`Porównywanie typów - ziarenko: ${seedType}, miseczka: ${bowlType}`);
                
                if (seedType === bowlType) {
                    // Poprawne dopasowanie
                    try {
                        console.log(t('sortingGame.correctMatch'));
                    } catch (e) {
                        console.log("Dobrze! Ziarenko w miseczce.");
                    }
                    
                    // Usuń ziarenko
                    activeSeed.remove();
                    
                    // Reset stylów i zmiennej globalnej
                    if (isTelegramWebApp && activeSeed.style) {
                        activeSeed.style.boxShadow = 'none';
                    }
                    
                    // Resetujemy zmienną globalną
                    currentSeedElement = null;
                    
                    // Zwiększ licznik zebranych
                    collectedSeeds++;
                    
                    // POPRAWKA: Aktualizacja licznika w formacie "X/30"
                    updateCollectedCounter();
                    
                    // Wizualne potwierdzenie dla użytkownika
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 300);
                    
                    // Sprawdź czy koniec gry
                    if (collectedSeeds === 30) {
                        stopTimer();
                        endGame();
                    }
                } else {
                    // Błędne dopasowanie
                    try {
                        console.log(t('sortingGame.wrongMatch'));
                        showNotification(t('sortingGame.wrongBowl'));
                    } catch (e) {
                        console.log("Źle! To nie ta miseczka.");
                        showNotification("To nie ta miseczka!");
                    }
                    
                    // Odznacz ziarenko
                    if (activeSeed.style) {
                        activeSeed.style.transform = 'scale(1)';
                        activeSeed.style.opacity = '1';
                        
                        // Reset dodatkowych stylów na telegramie
                        if (isTelegramWebApp) {
                            activeSeed.style.boxShadow = 'none';
                        }
                        
                        // Usuń klasę active
                        activeSeed.classList.remove('active');
                    }
                    
                    currentSeedElement = null;
                    
                    // Wizualne odrzucenie dla użytkownika
                    this.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 300);
                }
            } else if (isTelegramWebApp) {
                // Na Telegramie - pokaż podpowiedź
                try {
                    showNotification(t('sortingGame.selectSeedFirst'));
                } catch (e) {
                    console.error("Błąd podczas wyświetlania powiadomienia:", e);
                    showNotification("Najpierw wybierz ziarenko!");
                }
            }
        });
        
        // Dodatkowa obsługa dla dotyku na telegramie
        newBowl.addEventListener('touchstart', function(e) {
            if (isTelegramWebApp) {
                e.preventDefault(); // Zapobiegaj standardowym zachowaniom tylko w Telegramie
                
                // Podobna logika jak przy obsłudze click
                let activeSeed = currentSeedElement;
                if (!activeSeed) {
                    activeSeed = document.querySelector('.draggable-seed.active');
                    if (activeSeed) {
                        currentSeedElement = activeSeed;
                    }
                }
                
                if (activeSeed) {
                    const seedType = activeSeed.dataset.type;
                    const bowlType = this.dataset.type;
                    
                    // Logika sprawdzania dopasowania - podobna jak wyżej
                    if (seedType === bowlType) {
                        // Poprawne dopasowanie
                        activeSeed.remove();
                        activeSeed.classList.remove('active');
                        
                        if (isTelegramWebApp && activeSeed.style) {
                            activeSeed.style.boxShadow = 'none';
                        }
                        
                        currentSeedElement = null;
                        
                        collectedSeeds++;
                        
                        // POPRAWKA: Aktualizacja licznika w formacie "X/30"
                        updateCollectedCounter();
                        
                        // Animacja potwierdzenia
                        this.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 300);
                        
                        if (collectedSeeds === 30) {
                            stopTimer();
                            endGame();
                        }
                    } else {
                        // Błędne dopasowanie - logika jak wyżej
                        try {
                            showNotification(t('sortingGame.wrongBowl'));
                        } catch (e) {
                            showNotification("To nie ta miseczka!");
                        }
                        
                        // Reset stanu ziarenka
                        if (activeSeed.style) {
                            activeSeed.style.transform = 'scale(1)';
                            activeSeed.style.opacity = '1';
                            activeSeed.classList.remove('active');
                            
                            if (isTelegramWebApp) {
                                activeSeed.style.boxShadow = 'none';
                            }
                        }
                        
                        currentSeedElement = null;
                        
                        // Animacja odrzucenia
                        this.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 300);
                    }
                } else {
                    try {
                        showNotification(t('sortingGame.selectSeedFirst'));
                    } catch (e) {
                        showNotification("Najpierw wybierz ziarenko!");
                    }
                }
            }
        }, { passive: false });
    });
    
    console.log("Zakończono inicjalizację eventów miseczek");
}







function endGame() {
    // Zabezpieczenie przed wielokrotnym wywołaniem
    if (window.gameEnded) return;
    window.gameEnded = true;
    
    console.log("Koniec gry! Zebrane ziarenka:", collectedSeeds);
    
    // Sprawdź czy faktycznie mamy zebrane ziarenka
    if (collectedSeeds <= 0) {
        // Awaryjnie użyj licznika z ekranu gry
        const counterElement = document.getElementById('collected-count');
        if (counterElement && counterElement.textContent) {
            const displayedCount = parseInt(counterElement.textContent);
            if (!isNaN(displayedCount) && displayedCount > 0) {
                console.log("Korekta liczby zebranych ziarenek z UI:", displayedCount);
                collectedSeeds = displayedCount;
            }
        }
    }
    
    console.log("Finalna liczba zebranych ziarenek:", collectedSeeds);
    
    // Oblicz przyrost czystości (3% za ziarenko)
    const cleanlinessGain = collectedSeeds * 3;
    console.log("Przyrost czystości:", cleanlinessGain);
    
    // Zwiększ czystość ptaka
    if (gameState.petBird) {
        const oldCleanliness = gameState.petBird.cleanliness;
        gameState.petBird.cleanliness += cleanlinessGain;
        if (gameState.petBird.cleanliness > 100) {
            gameState.petBird.cleanliness = 100;
        }
        console.log("Czystość ptaka zmieniona z", oldCleanliness, "na", gameState.petBird.cleanliness);
    }
    
    // Dodaj doświadczenie
    if (typeof addPetExperience === 'function') {
        addPetExperience(15 + collectedSeeds);
    } else {
        console.error("Funkcja addPetExperience niedostępna!");
    }
    
    // Pokaż ekran podsumowujący
    showSummary(collectedSeeds, cleanlinessGain);
    
    // Zapisz stan gry
    if (typeof saveGame === 'function') {
        saveGame();
    }
}





function showSummary(collected, cleanliness) {
    console.log(t('sortingGame.gameEnd'));
    console.log(t('sortingGame.cleaned', {count: collected}));
    console.log(t('sortingGame.cleanlinessGained', {percent: cleanliness}));
    
    // Sprawdź czy zostały przekazane poprawne wartości
    if (collected === undefined || collected === null || collected < 0) {
        collected = 0;
        console.error("Nieprawidłowa liczba zebranych ziarenek:", collected);
    }
    
    if (cleanliness === undefined || cleanliness === null || cleanliness < 0) {
        cleanliness = 0;
        console.error("Nieprawidłowy przyrost czystości:", cleanliness);
    }
    
    // Wyświetl wartości w konsoli dla diagnostyki
    console.log("Wartości na ekranie podsumowania - ziarenka:", collected, "czystość:", cleanliness);
    
    const summaryScreen = document.getElementById('summary-screen');
    if (summaryScreen) {
        // Reset stylu display
        summaryScreen.style.display = '';
        // Ustaw flex po małym opóźnieniu
        setTimeout(() => {
            summaryScreen.style.display = 'flex';
        }, 10);
        
        // Aktualizuj HTML z użyciem systemu tłumaczeń
        summaryScreen.innerHTML = `
            <h2 style="color: #4CAF50; font-size: 36px; margin-bottom: 30px;" data-i18n="sortingGame.summary">${t('sortingGame.summary')}</h2>
            <p style="font-size: 24px; margin-bottom: 20px;" data-i18n="sortingGame.cleaned" data-i18n-values='{"count": "${collected}"}'>${t('sortingGame.cleaned', {count: collected})}</p>
            <p style="font-size: 24px; margin-bottom: 20px; color: #4CAF50;" data-i18n="sortingGame.cleanlinessGained" data-i18n-values='{"percent": "${cleanliness}"}'>${t('sortingGame.cleanlinessGained', {percent: cleanliness})}</p>
            <button onclick="endSortingGame()" style="background-color: #4CAF50; color: white; border: none; border-radius: 10px; padding: 15px 30px; font-size: 18px; cursor: pointer; margin-top: 30px;" data-i18n="sortingGame.finish">${t('sortingGame.finish')}</button>
        `;
        
        // Weryfikacja po utworzeniu elementów
        const finalCountElement = document.getElementById('final-count');
        const cleanlinessGainedElement = document.getElementById('cleanliness-gained');
        
        if (!finalCountElement || !cleanlinessGainedElement) {
            console.log("Elementy nie zostały poprawnie utworzone, stosowanie alternatywnego podejścia");
            
            // Tworzenie elementów jeden po drugim
            summaryScreen.innerHTML = '';
            
            const heading = document.createElement('h2');
            heading.style.color = '#4CAF50';
            heading.style.fontSize = '36px';
            heading.style.marginBottom = '30px';
            heading.setAttribute('data-i18n', 'sortingGame.summary');
            heading.textContent = t('sortingGame.summary');
            summaryScreen.appendChild(heading);
            
            const collectedPara = document.createElement('p');
            collectedPara.style.fontSize = '24px';
            collectedPara.style.marginBottom = '20px';
            collectedPara.setAttribute('data-i18n', 'sortingGame.cleaned');
            collectedPara.setAttribute('data-i18n-values', JSON.stringify({count: collected}));
            collectedPara.innerHTML = t('sortingGame.cleaned', {count: collected});
            summaryScreen.appendChild(collectedPara);
            
            const cleanlinessPara = document.createElement('p');
            cleanlinessPara.style.fontSize = '24px';
            cleanlinessPara.style.marginBottom = '20px';
            cleanlinessPara.style.color = '#4CAF50';
            cleanlinessPara.setAttribute('data-i18n', 'sortingGame.cleanlinessGained');
            cleanlinessPara.setAttribute('data-i18n-values', JSON.stringify({percent: cleanliness}));
            cleanlinessPara.innerHTML = t('sortingGame.cleanlinessGained', {percent: cleanliness});
            summaryScreen.appendChild(cleanlinessPara);
            
            const finishButton = document.createElement('button');
            finishButton.onclick = endSortingGame;
            finishButton.style.backgroundColor = '#4CAF50';
            finishButton.style.color = 'white';
            finishButton.style.border = 'none';
            finishButton.style.borderRadius = '10px';
            finishButton.style.padding = '15px 30px';
            finishButton.style.fontSize = '18px';
            finishButton.style.cursor = 'pointer';
            finishButton.style.marginTop = '30px';
            finishButton.setAttribute('data-i18n', 'sortingGame.finish');
            finishButton.textContent = t('sortingGame.finish');
            summaryScreen.appendChild(finishButton);
        }
    } else {
        console.error("Nie znaleziono ekranu podsumowania!");
        
        // Kod tworzenia awaryjnego ekranu podsumowania pozostaje bez zmian,
        // ale tutaj również należałoby zaktualizować o system tłumaczeń
    }
}






function endSortingGame() {
    console.log("Kończenie mini-gry sortowania i powrót do ekranu hodowli");
    
    // Zatrzymaj timer jeśli nadal działa
    stopTimer();
    
    // Reset zmiennej gameEnded
    window.gameEnded = false;
    
    const breedingScreen = document.getElementById('breeding-screen');
    const sortingScreen = document.getElementById('sorting-game-screen');
    
    if (breedingScreen && sortingScreen) {
        sortingScreen.classList.remove('active');
        breedingScreen.classList.add('active');
        
        // Aktualizuj UI hodowli
        if (typeof updatePetBirdUI === 'function') {
            updatePetBirdUI();
            console.log("Zaktualizowano UI hodowli");
        } else {
            console.error("Funkcja updatePetBirdUI niedostępna!");
        }
        
        // Zapisz grę
        if (typeof saveGame === 'function') {
            saveGame();
            console.log("Zapisano stan gry");
        } else {
            console.error("Funkcja saveGame niedostępna!");
        }
        
        // Dodatkowe zabezpieczenie - ukryj ekran podsumowania
        const summaryScreen = document.getElementById('summary-screen');
        if (summaryScreen) {
            summaryScreen.style.display = 'none';
        }
        
        // Sprawdź, czy przyciski działają
        const cleanPetButton = document.getElementById('clean-pet-button');
        if (cleanPetButton) {
            console.log("Przycisk czyszczenia ptaka jest widoczny");
        } else {
            console.error("Nie znaleziono przycisku czyszczenia ptaka!");
        }
    } else {
        console.error("Nie znaleziono ekranów hodowli lub sortowania!");
    }
}









function safeSortingGameInit() {
    console.log("Bezpieczna inicjalizacja gry sortowania");
    
    // Sprawdź czy elementy istnieją
    const timerElement = document.getElementById('time-left');
    const counterElement = document.getElementById('collected-count');
    
    if (!timerElement) {
        console.error("KRYTYCZNY: Nadal brak elementu timera (time-left)");
        
        // Próbuj znaleźć element po zawartości
        const timerContainer = document.getElementById('sorting-timer');
        if (timerContainer) {
            console.log("Znaleziono kontener timera, próbuję znaleźć wewnętrzny element span");
            const spans = timerContainer.querySelectorAll('span');
            spans.forEach((span, index) => {
                console.log(`Span ${index}:`, span.textContent);
            });
            
            // Jeśli potrzeba, utwórz element
            if (spans.length > 1 && !document.getElementById('time-left')) {
                spans[1].id = 'time-left';
                console.log("Dodano brakujące ID do elementu time-left");
            }
        }
    }
    
    if (!counterElement) {
        console.error("KRYTYCZNY: Nadal brak elementu licznika (collected-count)");
        
        // Próbuj znaleźć element po zawartości
        const counterContainer = document.getElementById('seeds-remaining');
        if (counterContainer) {
            console.log("Znaleziono kontener licznika, próbuję znaleźć wewnętrzny element span");
            const spans = counterContainer.querySelectorAll('span');
            spans.forEach((span, index) => {
                console.log(`Span ${index}:`, span.textContent);
            });
            
            // Jeśli potrzeba, utwórz element
            if (spans.length > 1 && !document.getElementById('collected-count')) {
                spans[1].id = 'collected-count';
                console.log("Dodano brakujące ID do elementu collected-count");
            }
        }
    }
    
    // POPRAWKA: Aktualizacja licznika w formacie "X/30"
    updateCollectedCounter();
    
    // POPRAWKA: Aktualizacja wyświetlania timera
    updateTimerDisplay();
    
    // Upewnij się, że wszystkie miseczki mają poprawnie skonfigurowane eventy
    setupBowlEvents();
}







// Dodaj obsługę przycisku powrotu
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - konfiguracja przycisku powrotu i bezpieczna inicjalizacja");
    
    const backButton = document.getElementById('sorting-back-button');
    if (backButton) {
        backButton.onclick = function() {
            stopTimer(); // Zatrzymaj timer gdy wracamy
            endSortingGame();
        };
    }
    
    // Dodatkowy kod zapewniający prawidłową inicjalizację
    setTimeout(safeSortingGameInit, 1000);
});







// Załaduj gdy DOM jest gotowy
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM załadowany - inicjalizuję moduł sortowania");
    
    // Upewnij się, że elementy mają poprawne ID
    setTimeout(() => {
        const sortingTimer = document.getElementById('sorting-timer');
        const seedsRemaining = document.getElementById('seeds-remaining');
        
        if (sortingTimer) {
            const spans = sortingTimer.querySelectorAll('span');
            if (spans.length > 1 && !spans[1].id) {
                spans[1].id = 'time-left';
                console.log("Dodano ID do elementu timera");
            }
        }
        
        if (seedsRemaining) {
            const spans = seedsRemaining.querySelectorAll('span');
            if (spans.length > 1 && !spans[1].id) {
                spans[1].id = 'collected-count';
                console.log("Dodano ID do elementu licznika");
            }
        }
    }, 500);
});





// Funkcja awaryjna uruchamiana w przypadku problemów z inicjalizacją
window.emergencyFixSortingGame = function() {
    console.log("=== WYKONYWANIE AWARYJNEJ NAPRAWY GRY SORTOWANIA ===");
    
    // Reset wszystkich elementów i wartości
    collectedSeeds = 0;
    timeRemaining = 45;
    
    // Zatrzymaj istniejący timer
    stopTimer();
    
    // Stwórz lub napraw elementy UI
    // 1. Timer
    let timerElement = document.getElementById('time-left');
    if (!timerElement) {
        // Znajdź kontener timera
        const timerContainer = document.getElementById('sorting-timer');
        if (timerContainer) {
            // Wyczyść istniejącą zawartość
            timerContainer.innerHTML = '<span data-i18n="sortingGame.time" data-i18n-values=\'{"time": "0:45"}\'>Czas: <span id="time-left">0:45</span></span>';
            timerElement = document.getElementById('time-left');
        }
    }
    
    // 2. Licznik
    let counterElement = document.getElementById('collected-count');
    if (!counterElement) {
        // Znajdź kontener licznika
        const counterContainer = document.getElementById('seeds-remaining');
        if (counterContainer) {
            // Wyczyść istniejącą zawartość
            counterContainer.innerHTML = '<span data-i18n="sortingGame.collected" data-i18n-values=\'{"count": "0"}\'>Zebrałeś: <span id="collected-count">0</span> / 30 ziarenek</span>';
            counterElement = document.getElementById('collected-count');
        }
    }
    
    // 3. Ustaw początkowe wartości
    if (timerElement) timerElement.textContent = "0:45";
    if (counterElement) counterElement.textContent = "0";
    
    // 4. Uruchom timer ponownie
    setTimeout(function() {
        startTimer();
        console.log("Timer uruchomiony awaryjnie!");
    }, 500);
    
    console.log("=== ZAKOŃCZONO AWARYJNĄ NAPRAWĘ ===");
};








// Eksportuj funkcję startową do globalnego zakresu
window.startSortingGame = startSortingGame;
window.endSortingGame = endSortingGame;
window.safeSortingGameInit = safeSortingGameInit; // Eksportujemy też funkcję bezpiecznej inicjalizacji