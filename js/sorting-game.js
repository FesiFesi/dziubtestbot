// ===== MINI-GRA SORTOWANIA ZIARENEK =====
console.log("Inicjalizacja mini-gry sortowania ziarenek");

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

// Funkcja startująca mini-grę
function startSortingGame() {
    console.log("Uruchamiam mini-grę sortowania");
    
    // Sprawdź czy jesteśmy w Telegram WebApp
    isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
    console.log("Czy jesteśmy w Telegram WebApp: " + isTelegramWebApp);
    
    // Ukryj ekran hodowli
    const breedingScreen = document.getElementById('breeding-screen');
    const sortingScreen = document.getElementById('sorting-game-screen');
    
    if (breedingScreen && sortingScreen) {
        breedingScreen.classList.remove('active');
        sortingScreen.classList.add('active');
        
        // Zainicjalizuj grę
        initializeSortingGame();
    }
}

// Funkcja inicjalizująca ziarenka
function initializeSortingGame() {
    console.log("Inicjalizacja ziarenek do sortowania");
    
    // Reset zmiennych gry
    collectedSeeds = 0;
    timeRemaining = 45;
    
    // Ukryj ekran podsumowujący
    document.getElementById('summary-screen').style.display = 'none';
    
    // Wyczyść stare ziarenka
    const seedsContainer = document.getElementById('seeds-container');
    seedsContainer.innerHTML = '';
    
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
    seedsToSort.forEach(type => {
        createSeed(type);
    });
    
    // Ustaw licznik
    seedsRemaining = seedsToSort.length;
    document.getElementById('collected-count').textContent = collectedSeeds;
    
    // Uruchom timer
    startTimer();
    
    // Inicjalizacja eventów miseczek
    setTimeout(() => {
        setupBowlEvents();
    }, 100);
}

// Funkcja timera
function startTimer() {
    // Wyświetl początkowy czas
    updateTimerDisplay();
    
    // Uruchom odliczanie
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            stopTimer();
            endGame();
        }
    }, 1000);
}

// Zatrzymuje timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Aktualizuje wyświetlany czas
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('time-left').textContent = formattedTime;
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
    });
    
    seed.addEventListener('dragend', function(e) {
        this.style.opacity = '1';
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

// Funkcja do przetwarzania upuszczenia ziarenka
function processDrop(x, y) {
    let droppedOnBowl = false;
    
    document.querySelectorAll('.bowl').forEach(bowl => {
        const rect = bowl.getBoundingClientRect();
        
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            // Ziarenko zostało upuszczone na miseczkę
            droppedOnBowl = true;
            bowl.style.transform = 'scale(1)';
            
            // Sprawdź, czy ziarenko pasuje do miseczki
            if (currentSeedElement.dataset.type === bowl.dataset.type) {
                // Poprawne dopasowanie
                console.log("Dobrze! Ziarenko w miseczce.");
                
                // Usuń ziarenko
                currentSeedElement.remove();
                
                // Zwiększ licznik zebranych
                collectedSeeds++;
                document.getElementById('collected-count').textContent = collectedSeeds;
                
                // Sprawdź czy koniec gry
                if (collectedSeeds === 30) {
                    stopTimer();
                    endGame();
                }
            } else {
                // Błędne dopasowanie
                console.log("Źle! To nie ta miseczka.");
                showNotification("To nie ta miseczka!");
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

// Poprawiona funkcja wyboru ziarenka
function selectSeed(seed) {
    // Odznacz poprzednio zaznaczone
    if (currentSeedElement) {
        currentSeedElement.style.transform = 'scale(1)';
        currentSeedElement.style.opacity = '1';
    }
    
    // Zaznacz nowe
    currentSeedElement = seed;
    seed.style.transform = 'scale(1.2)';
    seed.style.opacity = '0.8';
    
    // Dodane: wyraźne podświetlenie na telegramie
    if (isTelegramWebApp) {
        // Dodaj animację pulsowania dla lepszej widoczności na telegramie
        seed.style.boxShadow = '0 0 10px 5px rgba(255,255,0,0.7)';
    }
    
    console.log("Wybrano ziarenko typu: " + seed.dataset.type);
    
    // Opcjonalnie: wyświetl podpowiedź dla użytkownika na telegramie
    if (isTelegramWebApp) {
        showNotification("Kliknij na miseczkę, aby umieścić w niej ziarenko!");
    }
}

// Funkcja dla eventów miseczek - ulepszona dla Telegrama
function setupBowlEvents() {
    document.querySelectorAll('.bowl').forEach(bowl => {
        // Obsługa zdarzeń dla drag & drop na komputerze
        bowl.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1.1)';
        });
        
        bowl.addEventListener('dragleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        bowl.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            
            const seedType = e.dataTransfer.getData('seedType');
            
            // Sprawdź, czy ziarenko pasuje do miseczki
            if (seedType === this.dataset.type) {
                // Poprawne dopasowanie
                console.log("Dobrze! Ziarenko w miseczce.");
                
                // Usuń ziarenko
                if (currentSeedElement) {
                    currentSeedElement.remove();
                    currentSeedElement = null;
                }
                
                // Zwiększ licznik zebranych
                collectedSeeds++;
                document.getElementById('collected-count').textContent = collectedSeeds;
                
                // Sprawdź czy koniec gry
                if (collectedSeeds === 30) {
                    stopTimer();
                    endGame();
                }
            } else {
                // Błędne dopasowanie
                console.log("Źle! To nie ta miseczka.");
                showNotification("To nie ta miseczka!");
                
                if (currentSeedElement) {
                    currentSeedElement.style.transform = 'scale(1)';
                    currentSeedElement.style.opacity = '1';
                }
            }
        });
        
        // Ulepszona obsługa kliknięcia - działa lepiej w Telegramie
        bowl.addEventListener('click', function() {
            if (currentSeedElement) {
                const seedType = currentSeedElement.dataset.type;
                const bowlType = this.dataset.type;
                
                if (seedType === bowlType) {
                    // Poprawne dopasowanie
                    console.log("Dobrze! Ziarenko w miseczce.");
                    
                    // Usuń ziarenko
                    currentSeedElement.remove();
                    
                    // Reset dodatkowych stylów na telegramie
                    if (isTelegramWebApp) {
                        currentSeedElement.style.boxShadow = 'none';
                    }
                    
                    currentSeedElement = null;
                    
                    // Zwiększ licznik zebranych
                    collectedSeeds++;
                    document.getElementById('collected-count').textContent = collectedSeeds;
                    
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
                    console.log("Źle! To nie ta miseczka.");
                    showNotification("To nie ta miseczka!");
                    
                    // Odznacz ziarenko
                    currentSeedElement.style.transform = 'scale(1)';
                    currentSeedElement.style.opacity = '1';
                    
                    // Reset dodatkowych stylów na telegramie
                    if (isTelegramWebApp) {
                        currentSeedElement.style.boxShadow = 'none';
                    }
                    
                    currentSeedElement = null;
                    
                    // Wizualne odrzucenie dla użytkownika
                    this.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 300);
                }
            } else if (isTelegramWebApp) {
                // Na Telegramie - pokaż podpowiedź, jeśli użytkownik klika miseczkę bez wybrania ziarenka
                showNotification("Najpierw wybierz ziarenko!");
            }
        });
        
        // Dodatkowa obsługa dla dotyku na telegramie
        bowl.addEventListener('touchstart', function(e) {
            if (isTelegramWebApp) {
                e.preventDefault(); // Zapobiegaj standardowym zachowaniom tylko w Telegramie
                
                if (currentSeedElement) {
                    const seedType = currentSeedElement.dataset.type;
                    const bowlType = this.dataset.type;
                    
                    // Symuluj kliknięcie
                    if (seedType === bowlType) {
                        // Poprawne dopasowanie
                        currentSeedElement.remove();
                        if (isTelegramWebApp) {
                            currentSeedElement.style.boxShadow = 'none';
                        }
                        currentSeedElement = null;
                        
                        collectedSeeds++;
                        document.getElementById('collected-count').textContent = collectedSeeds;
                        
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
                        // Błędne dopasowanie
                        showNotification("To nie ta miseczka!");
                        
                        // Odznacz ziarenko
                        currentSeedElement.style.transform = 'scale(1)';
                        currentSeedElement.style.opacity = '1';
                        if (isTelegramWebApp) {
                            currentSeedElement.style.boxShadow = 'none';
                        }
                        currentSeedElement = null;
                        
                        // Animacja odrzucenia
                        this.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 300);
                    }
                } else {
                    showNotification("Najpierw wybierz ziarenko!");
                }
            }
        }, { passive: false });
    });
}

// Funkcja kończąca grę
function endGame() {
    console.log("Koniec gry!");
    
    // Oblicz przyrost czystości (3% za ziarenko)
    const cleanlinessGain = collectedSeeds * 3;
    
    // Zwiększ czystość ptaka
    if (gameState.petBird) {
        gameState.petBird.cleanliness += cleanlinessGain;
        if (gameState.petBird.cleanliness > 100) {
            gameState.petBird.cleanliness = 100;
        }
    }
    
    // Dodaj doświadczenie
    addPetExperience(15 + collectedSeeds);
    
    // Pokaż ekran podsumowujący
    showSummary(collectedSeeds, cleanlinessGain);
}

// Funkcja pokazująca podsumowanie
function showSummary(collected, cleanliness) {
    const summaryScreen = document.getElementById('summary-screen');
    document.getElementById('final-count').textContent = collected;
    document.getElementById('cleanliness-gained').textContent = cleanliness;
    summaryScreen.style.display = 'flex';
}

// Funkcja kończąca mini-grę
function endSortingGame() {
    const breedingScreen = document.getElementById('breeding-screen');
    const sortingScreen = document.getElementById('sorting-game-screen');
    
    if (breedingScreen && sortingScreen) {
        sortingScreen.classList.remove('active');
        breedingScreen.classList.add('active');
        
        // Aktualizuj UI hodowli
        if (typeof updatePetBirdUI === 'function') {
            updatePetBirdUI();
        }
        
        // Zapisz grę
        if (typeof saveGame === 'function') {
            saveGame();
        }
    }
}

// Dodaj obsługę przycisku powrotu
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('sorting-back-button');
    if (backButton) {
        backButton.onclick = function() {
            stopTimer(); // Zatrzymaj timer gdy wracamy
            endSortingGame();
        };
    }
});

// Eksportuj funkcję startową do globalnego zakresu
window.startSortingGame = startSortingGame;
window.endSortingGame = endSortingGame;