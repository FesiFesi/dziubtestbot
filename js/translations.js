// translations.js
const translations = {
    pl: {
        // Polski - język domyślny
        general: {
            loading: "Ładowanie...",
            save: "Zapisz",
            cancel: "Anuluj",
            back: "← Powrót",
            confirmReset: "Czy na pewno chcesz zresetować grę?",
            gameReset: "Gra została zresetowana!",
            notEnoughCoins: "Nie masz wystarczająco DziubCoinów (potrzeba: {{amount}})"
        },
        menu: {
            mainTitle: "FEED & FLAP"
        },
        navigation: {
            main: "Główna",
            breeding: "Gniazdo",
            feeding: "Karmienie",
            production: "Ziarenka",
            missions: "Misje",
            wallet: "Portfel"
        },
        settings: {
            title: "Ustawienia",
            soundSettings: "Ustawienia dźwięku",
            backgroundMusic: "Muzyka w tle",
            musicVolume: "Głośność muzyki",
            soundEffects: "Efekty dźwiękowe",
            effectsVolume: "Głośność efektów",
            languageSettings: "Ustawienia języka",
            legalInfo: "Informacje prawne",
            termsOfService: "Regulamin gry",
            privacyPolicy: "Polityka Prywatności"
        },
        resources: {
            seeds: "Ziarenka",
            coins: "DziubCoiny",
            fruits: "Owoce",
            ton: "TON",
            seedsIcon: "Ziarenka",
            coinsIcon: "DziubCoiny",
            fruitsIcon: "Owoce",
            tonIcon: "TON"
        },
        birdSlots: {
            feedBird: "Nakarm",
            scareBird: "Przepędź",
            collectReward: "Odbierz",
            unlock: "Odblokuj",
            lockInfo: "Odblokuj za {{amount}} DziubCoinów",
            newSlotUnlocked: "Odblokowano nowy slot na ptaki!",
            waitingForBird: "Czekam na ptaka..."
        },
        locations: {
            parkName: "Park Miejski",
            lakeName: "Brzeg Jeziora",
            forestName: "Tajemniczy Las",
            newLocation: "Nowa lokacja",
            unlocked: "Odblokowane",
            locked: "Zablokowane",
            comingSoon: "Wkrótce dostępna!",
            unlockFor: "Odblokuj za {{amount}} DziubCoinów",
            unlockInfo: "Odblokuj tę lokację za {{amount}} DziubCoinów w menu Mapy!",
            description: {
                park: "Twoja pierwsza lokacja. Można tu spotkać miejskie gatunki ptaków.",
                lake: "Nowe miejsce pełne przybrzeżnych ptaków! Odblokuj, aby zyskać dostęp do nowych gatunków.",
                forest: "Magiczne miejsce ukryte pośród drzew. Odblokuj, aby odkryć rzadkie leśne ptaki.",
                comingSoonDesc: "Tajemnicza nowa lokacja zostanie dodana w kolejnej aktualizacji. Nowe ptaki, nowe wyzwania!"
            },
            buttons: {
                selected: "Wybrano",
                feedAll: "Nakarm wszystkie",
                collectAll: "Odbierz wszystkie",
                availableSoon: "Dostępna wkrótce"
            },
             birdsDiscovery: "Ptaki: {{discovered}}/{{total}}",
               notifications: {
        locationUnlocked: "Odblokowano lokację {{location}}!",
        locationError: "Błąd: Lokacja nie istnieje!",
        locationLocked: "Ta lokacja jest zablokowana!",
        locationSelected: "Wybrano lokację: {{name}}",
        notEnoughCoins: "Za mało DziubCoinów! Potrzebujesz {{amount}} monet.",


          receivedTon: "Otrzymałeś {{amount}} TON za mitycznego ptaka!",
    receivedCoinsWithBonus: "Otrzymałeś {{baseAmount}} + {{bonusAmount}} DziubCoinów (bonus z fontanny)!",
    receivedCoins: "Otrzymałeś {{amount}} DziubCoinów!",
    rewardFixLoaded: "🔨 Ostateczny skrypt naprawczy załadowany - nadpisuję funkcję collectBirdReward co 100ms",


    mythicalBirdFed: "Nakarmiono mitycznego ptaka używając {{amount}} owoców!"
    


    },

logs: {
        initSystem: "Inicjalizacja systemu lokacji",
        preInitState: "Stan odblokowanych lokacji przed inicjalizacją:",
        noLocationsObject: "Brak obiektu locations - tworzę nowy",
        noCurrentLocation: "Brak currentLocation - ustawiam domyślną wartość",
        noUnlockedLocations: "Brak unlockedLocations - ustawiam domyślne wartości",
        usingExistingValues: "Używam istniejących wartości dla unlockedLocations:",
        currentLocationLocked: "Bieżąca lokacja {{location}} nie jest odblokowana, przywracam do park",
        addingParkLocation: "Dodaję brakującą lokację 'park' do unlockedLocations",
        addingLakeLocation: "Dodaję brakującą lokację 'lake' do unlockedLocations",
        stateChangesDetected: "Wykryto zmiany w stanie lokacji podczas inicjalizacji - zapisuję stan gry",
        stateBefore: "Stan przed:",
        stateAfter: "Stan po:",
        feedScreenTransition: "Przejście do ekranu karmienia przez hideAndShowScreen - aktualizuję dekoracje",
        initComplete: "Zakończono inicjalizację systemu lokacji. Stan odblokowanych lokacji:",
        
        showingMapScreen: "Pokazuję ekran mapy",
        updatingMapUI: "Aktualizuję UI mapy. Stan odblokowanych lokacji:",
        missingLocationsObject: "BŁĄD: Brak obiektu locations lub unlockedLocations podczas aktualizacji UI mapy!",
        foundLocationElements: "Znaleziono {{count}} elementów lokacji na mapie",
        buttonNotFound: "Nie znaleziono przycisku w elemencie lokacji:",
        dataLocationMissing: "Przycisk nie ma atrybutu data-location:",
        updatingLocationUI: "Aktualizuję UI dla lokacji {{location}}, stan odblokowania: {{unlocked}}",
        locationUnlocked: "Lokacja {{location}} jest odblokowana - aktualizuję UI",
        locationLocked: "Lokacja {{location}} jest zablokowana - aktualizuję UI",
        uiMemoryMismatch1: "Niezgodność: Lokacja {{location}} jest odblokowana w pamięci, ale ma klasę 'locked' w UI",
        uiMemoryMismatch2: "Niezgodność: Lokacja {{location}} jest zablokowana w pamięci, ale nie ma klasy 'locked' w UI",
        
        selectedButtonClicked: "Kliknięto przycisk \"Wybrano\" dla lokacji {{location}}",
        selectButtonClicked: "Kliknięto przycisk wyboru lokacji {{location}}",
        setupUnlockButtons: "Ustawiam przyciski odblokowania lokacji. Stan odblokowanych lokacji:",
        unlockButtonClicked: "Kliknięto przycisk odblokowania lokacji: {{location}}",
        stateBeforeUnlock: "Stan przed odblokowaniem:",
        tryingToUnlock: "Próba odblokowania lokacji: {{location}}",
        availableConfigs: "Dostępne konfiguracje:",
        configNotFound: "Nie znaleziono konfiguracji dla lokacji {{location}}",
        usingFallbackCost: "Używam awaryjnego kosztu z atrybutu data-cost: {{cost}}",
        unlockAttempt: "Próba odblokowania lokacji: {{location}}, koszt: {{cost}}",
        missingLocationsError: "BŁĄD: Brak obiektu locations! Tworzę nowy.",
        missingUnlockedLocationsError: "BŁĄD: Brak obiektu unlockedLocations! Tworzę nowy.",
        unlockingLocation: "Odblokowuję lokację {{location}}...",
        stateAfterUnlock: "Stan po odblokowaniu:",
        criticalUnlockError: "BŁĄD KRYTYCZNY: Lokacja {{location}} nie została odblokowana poprawnie!",
        savingGameAfterUnlock: "Zapisuję stan gry po odblokowaniu lokacji",
        saveGameUnavailable: "Funkcja saveGame niedostępna! Próbuję użyć localStorage bezpośrednio.",
        localStorageError: "Błąd podczas zapisu do localStorage:",
        stateAfterTimeout: "Stan lokacji po timeout:",
        addingUnlockListener: "Dodaję event listener dla przycisku odblokowania lokacji {{location}}",
        
        changingLocation: "Zmiana lokacji na: {{location}}",
        locationNotDefined: "Lokacja {{location}} nie jest zdefiniowana!",
        alreadyInLocation: "Już jesteś w tej lokacji",
        applyingDecorations: "Stosowanie dekoracji dla lokacji {{location}} w changeLocation",
        decorationsFunctionUnavailable: "Funkcja applyDecorations nie jest dostępna!",
        updatingCatalog: "Aktualizuję katalog ptaków po zmianie lokacji",
        
        diagnosticsHeader: "=== DIAGNOSTYKA STANU LOKACJI ===",
        gameStateExists: "Obiekt gameState istnieje:",
        gameStateMissingError: "BŁĄD KRYTYCZNY: Brak obiektu gameState!",
        locationsObjectExists: "Obiekt locations istnieje:",
        locationsMissingError: "BŁĄD KRYTYCZNY: Brak obiektu locations w gameState!",
        unlockedLocationsExists: "Obiekt unlockedLocations istnieje:",
        unlockedLocationsMissingError: "BŁĄD KRYTYCZNY: Brak obiektu unlockedLocations w gameState.locations!",
        unlockedLocations: "Odblokowane lokacje:",
        locationStatus: "Lokacja {{location}}: {{status}}",
        currentLocation: "Aktualna lokacja:",
        currentLocationUnlocked: "Czy aktualna lokacja ({{location}}) jest odblokowana: {{unlocked}}",
        uiLocationElements: "Liczba elementów lokacji w UI:",
        locationUiMemoryStatus: "Lokacja {{location}} w UI: {{uiStatus}}, w pamięci: {{memoryStatus}}",
        savedStateExists: "Zapisany stan istnieje w localStorage",
        savedUnlockedLocations: "Odblokowane lokacje w zapisanym stanie:",
        stateDifference: "Niezgodność dla lokacji {{location}}: w pamięci={{memoryState}}, w zapisie={{savedState}}",
        statesMatch: "Stan lokacji w pamięci zgodny z zapisanym stanem",
        noSavedUnlockedLocations: "Brak informacji o odblokowanych lokacjach w zapisanym stanie!",
        parseSaveError: "Błąd podczas parsowania zapisanego stanu:",
        noSavedState: "Brak zapisanego stanu w localStorage",
        saveGameAvailable: "Funkcja saveGame dostępna:",
        loadGameAvailable: "Funkcja loadGame dostępna:",
        diagnosticsFooter: "=== KONIEC DIAGNOSTYKI ===",
        
        startingRepair: "Rozpoczynam naprawę systemu lokacji...",
        creatingGameState: "Tworzę nowy obiekt gameState",
        creatingLocations: "Tworzę nowy obiekt locations",
        creatingUnlockedLocations: "Tworzę nowy obiekt unlockedLocations",
        settingDefaultLocation: "Ustawiam domyślną bieżącą lokację",
        restoringFromSave: "Przywracam odblokowane lokacje z zapisu",
        restoreError: "Błąd podczas przywracania z zapisu:",
        updatingMapUI: "Aktualizuję UI mapy",
        savingRepairedState: "Zapisuję naprawiony stan",
        repairComplete: "Naprawa zakończona. Aktualny stan odblokowanych lokacji:"
    }


        },
        catalog: {
            title: "Katalog ptaków",
            mapTitle: "Mapa lokacji",
            birdStats: {
                type: "Typ:",
                chance: "Szansa:",
                time: "Czas:",
                cost: "Koszt:",
                reward: "Nagroda:",
                seeds: "{{amount}} ziarenka",
                seed: "{{amount}} ziarenko",
                seedMultiple: "{{amount}} ziarenka",
                fruit: "{{amount}} owoc",
                fruits: "{{amount}} owoce"
            },
            birdTypes: {
                common: "Pospolity",
                rare: "Rzadki",
                epic: "Epicki",
                legendary: "Legendarny",
                mythical: "Mityczny"
            },
            birdNames: {
                // Park
                commonSparrow: "Wróbel pospolity",
                rareRobin: "Gołąb krakowski",
                epicCardinal: "Sójka białolica",
                legendaryPhoenix: "Grafeniks",
                mythicalEagle: "Bielik Koronny",
                // Jezioro
                commonDuck: "Kaczka krzyżówka",
                rareHeron: "Łabędź krzykliwy",
                epicSwan: "Pelikan różowy",
                legendaryPelican: "Czapla jeziorna",
                mythicalKraken: "Błękitny Widmoptak",
                // Las
                commonWoodpecker: "Sikorka bogatka",
                rareOwl: "Dzięcioł czarny",
                epicHawk: "Mroczny Puchacz",
                legendaryGriffin: "Złotopióry",
                mythicalPhoenix: "Duch Lasu"
            }
        },



birdDiscovery: {
    systemInitialization: "Inicjalizacja systemu odkrywania ptaków",
    systemInitialized: "System odkrywania ptaków zainicjalizowany",
    attemptGeneration: "Próba generowania ptaka w slocie {{slotIndex}}, lokacja {{locationId}}",
    birdGenerated: "Wygenerowano ptaka typu {{birdType}} w lokacji {{locationId}}",
    discoveringBird: "Odkrywam ptaka {{birdId}} w lokacji {{locationId}}",
    idNotFound: "Nie znaleziono ID dla ptaka typu {{birdType}} w lokacji {{locationId}}",
    catalogOpenDetected: "Wykryto otwarcie katalogu - aktualizuję UI",
    discovering: "Odkrywanie ptaka {{birdId}} w lokacji {{locationId}}",
    birdAlreadyDiscovered: "Ptak {{birdId}} już odkryty w lokacji {{locationId}}",
    birdDiscovered: "Ptak {{birdId}} został odkryty w lokacji {{locationId}}!",
    newBirdAdded: "Nowy ptak dodany do katalogu!",
    catalogUpdateStarted: "Aktualizacja UI katalogu ptaków",
    locationCatalogUpdate: "Aktualizacja katalogu dla lokacji: {{locationId}}",
    catalogElementNotFound: "Nie znaleziono elementu #{{locationId}}-catalog w DOM",
    noDiscoveredBirdsData: "Brak danych o odkrytych ptakach dla lokacji {{locationId}}",
    foundBirdItems: "Znaleziono {{count}} elementów ptaków w lokacji {{locationId}}",
    noBirdId: "Element ptaka bez data-bird-id",
    markingBirdAsDiscovered: "Oznaczam ptaka {{birdId}} jako odkryty w UI",
    classesAfterUpdate: "Klasy po aktualizacji: {{classes}}",
    catalogMonitoringAdded: "Dodawanie monitorowania otwarcia katalogu",
    catalogButtonClicked: "Kliknięto przycisk katalogu",
    catalogScreenActivated: "Wykryto aktywację ekranu katalogu",
    directDiscovery: "Bezpośrednie odkrywanie ptaka typu {{birdType}} w lokacji {{locationId}}",
    directBirdDiscovered: "Odkryto nowego ptaka: {{birdId}} w lokacji {{locationId}}!",
    directBirdAlreadyDiscovered: "Ptak {{birdId}} w lokacji {{locationId}} był już odkryty.",
    discoveryError: "Błąd: nieprawidłowy typ ptaka {{birdType}} dla lokacji {{locationId}}",
    cannotDiscover: "Nie można odkryć ptaka: nieprawidłowy typ lub lokacja"
},
catalogFix: {
    startingRepair: "Uruchamiam naprawę wyświetlania ptaków w katalogu...",
    repairingLocation: "Sprawdzanie i naprawa lokacji {{locationId}} w katalogu...",
    locationUnlockStatus: "Lokacja {{locationId}} jest odblokowana: {{status}}",
    catalogElements: "Elementy katalog: lockInfo={{lockInfo}}, birdGrid={{birdGrid}}, status={{statusElement}}",
    showingBirds: "Pokazuję ptaki z lokacji {{locationId}}",
    repairCompleted: "Zakończono naprawę wyświetlania ptaków w katalogu",
    repairingBirdImages: "Naprawa obrazków ptaków w lokacji {{locationId}}...",
    noImageMapping: "Brak mapowania obrazków dla lokacji {{locationId}}",
    foundBirdElements: "Znaleziono {{count}} elementów ptaków w lokacji {{locationId}}",
    cannotDetermineBirdType: "Nie można określić typu ptaka dla id: {{birdId}}",
    imageElementNotFound: "Nie znaleziono elementu obrazka dla ptaka {{birdId}}",
    settingBirdImage: "Ustawiam obrazek dla ptaka {{birdId}}: {{path}}",
    removingUndiscoveredClass: "Ptak {{birdId}} jest odkryty - usuwam klasę bird-undiscovered"
},
lakeBirdCatalog: {
    repairStarting: "Naprawa katalogu ptaków dla Brzegu Jeziora...",
    catalogNotFound: "Nie znaleziono elementu lake-catalog!",
    unlockStatus: "Stan odblokowania Brzegu Jeziora: {{status}}",
    gridRepaired: "Naprawiono siatkę ptaków w katalogu Jeziora",
    gridNotFound: "Nie znaleziono siatki ptaków w katalogu Jeziora!",
    gridCreated: "Utworzono nową siatkę ptaków dla katalogu Jeziora",
    birdsAdded: "Dodano {{count}} ptaków do katalogu Jeziora.",
    updatingDiscoveryState: "Aktualizowanie stanu odkrycia ptaków w lokacji Jezioro...",
    noDiscoveryData: "Brak struktury danych dla odkrytych ptaków!",
    foundBirdElements: "Znaleziono {{count}} elementów ptaków w katalogu Jeziora",
    removingUndiscoveredClass: "Ptak {{birdId}} jest odkryty - usuwam klasę bird-undiscovered",
    setupEventListeners: "Konfiguracja nasłuchiwania zdarzeń dla naprawy katalogu Jeziora...",
    catalogButtonClicked: "Kliknięto przycisk katalogu ptaków - uruchamiam naprawę",
    catalogScreenOpened: "Wykryto otwarcie ekranu katalogu - uruchamiam naprawę",
    setupCompleted: "Zakończono konfigurację nasłuchiwania zdarzeń",
    moduleLoaded: "Załadowano moduł naprawy katalogu Jeziora"
},
birdAppearance: {
    directUpdate: "Bezpośrednia aktualizacja wyglądu ptaków w katalogu",
    lakeGridNotFound: "Siatka ptaków jeziora nie znaleziona - uruchamiam naprawę"
},



        shop: {
            title: "Rozbuduj lokację!",
            sectionHeaders: {
                park: "Park Miejski",
                lake: "Brzeg Jeziora",
                forest: "Tajemniczy Las",
                description: "Ulepsz {{location}}, aby zyskać bonusy!",
                forestPlaceholder: "Nowe dekoracje dostępne już wkrótce!"
            },
            decorations: {
                benchName: "Ławka w parku",
                benchDesc: "Urocza ławka na której siadają goście parku, by karmić dzióbasy",
                benchBonus: "Bonus: -10% koszt karmienia ptaków",
                fountainName: "Fontanna",
                fountainDesc: "Piękna fontanna przyciągająca DziubCoiny",
                fountainBonus: "Bonus: +10% więcej DziubCoinów",
                balloonName: "Balon wycieczkowy",
                balloonDesc: "Kolorowy balon, dzięki któremu ptaki szybciej jedzą aby wrócić do zabawy",
                balloonBonus: "Bonus: -10% czas karmienia",
                boatName: "Łódka",
                boatDesc: "Mała łódka, która pozwala podpłynąć bliżej do ptaków, dzięki czemu karmienie jest tańsze",
                boatBonus: "Bonus: -12% koszt karmienia ptaków",
                kiteName: "Latawiec",
                kiteDesc: "Kolorowy latawiec, który pomaga przyciągać ptaki i zwiększa ich hojność",
                kiteBonus: "Bonus: +12% więcej DziubCoinów",
                paragliderName: "Paralotnia",
                paragliderDesc: "Widowiskowa paralotnia, dzięki której ptaki są bardziej skupione na jedzeniu",
                paragliderBonus: "Bonus: -12% czas karmienia"
            },



buttons: {
        purchased: "Zakupione"
    },
    bonuses: {
        activeTitle: "Aktywne bonusy",
        feedCostBonus: "🌱 -{{value}}% koszt karmienia",
        rewardBonus: "💰 +{{value}}% więcej DziubCoinów",
        feedTimeBonus: "⏱️ -{{value}}% czas karmienia"
    },
    requirements: {
        parkPremium: "Wymaga: Ławka i Fontanna",
        lakePremium: "Wymaga: Łódka i Latawiec"
    },
    notifications: {
        decorationNotExist: "Błąd: Ta dekoracja nie istnieje!",
        alreadyOwned: "Już posiadasz tę dekorację!",
        requiresParkBasic: "Musisz najpierw kupić ławkę i fontannę!",
        requiresLakeBasic: "Musisz najpierw kupić łódkę i latawiec!",
        notEnoughTon: "Za mało TON! Potrzebujesz {{amount}} TON.",
        decorationPurchased: "Zakupiono dekorację: {{name}}!",
        newDecoration: "Nowa dekoracja!",
        feedCostBonus: " Teraz karmienie ptaków kosztuje o {{value}}% mniej!",
        rewardBonus: " Teraz otrzymujesz o {{value}}% więcej DziubCoinów!",
        feedTimeBonus: " Teraz ptaki jedzą o {{value}}% szybciej!",
        mythicalBirdBonus: "Karmisz mitycznego ptaka! Bonus -{{bonus}}% do czasu karmienia."

    }




        },
        production: {
            title: "Produkcja Ziarenek",
            autoCollector: "Auto Zbieruś",
            collectAuto: "Zbierz auto-zbiór",
            collectSeed: "Zbierz ziarenko",
            upgrades: "Ulepszenia",
            biggerCapacity: "Większy Auto Zbieruś",
            biggerCapacityDesc: "Zwiększa pojemność o 10",
            fasterCollection: "Szybszy Auto Zbieruś",
            fasterCollectionDesc: "Zwiększa szybkość zbierania",
            upgradeButton: "Ulepsz ({{amount}} DziubCoinów)",
            autoCapacityIncreased: "Zwiększono pojemność Auto Zbierusia!",
            autoSpeedIncreased: "Zwiększono szybkość Auto Zbierusia!"
        },
        missions: {
            title: "Misje",
            description: "Wykonuj misje, aby zdobywać cenne nagrody!",
            daily: "Misje dzienne",
            weekly: "Misje tygodniowe",
            resetTimer: "Resetuje się o 00:00 UTC",
            weeklyResetTimer: "Resetuje się w sobotę o północy UTC",
            completed: "Misja ukończona: {{title}}! Kliknij \"Odbierz\", aby odebrać nagrodę.",
            rewardClaimed: "Odebrano nagrodę za misję!",
            newMissionsAvailable: "Nowe misje są dostępne!",
            bonusCompleted: "Misja bonusowa ukończona! Odbierz specjalną nagrodę!",
            weeklyRewardClaimed: "Odebrano nagrodę za misję tygodniową!",
            collectSeeds: "Zbierz {{amount}} ziarenek",
            feedBirds: "Nakarm {{amount}} ptaki",
            scareBirds: "Przepędź {{amount}} ptaków",
            autoCollect: "Zbierz {{amount}} razy auto-zbiór",
            dailyBonus: "Wykonaj wszystkie dzisiejsze misje",
            newWeeklyMissionsAvailable: "Nowe misje tygodniowe są dostępne!",
            rewardLabel: "Nagroda: {{reward}} DziubCoinów",
            claim: "Odbierz",
            resetTimerWithTime: "Resetuje się za {{hours}}h {{minutes}}m",
            weeklyResetTimerWithTime: "Resetuje się w sobotę o północy UTC (za {{days}}d {{hours}}h {{minutes}}m)",
            status: {
                completed: "Ukończono",
                rewarded: "Odebrano",
                bonus: "Bonus"
            },
            weekly: {
                unlockSlots: {
                    title: "Odblokuj nowy slot na ptaki",
                    description: "Odblokuj dowolny nowy slot na ptaki"
                },
                feedEpicBirds: {
                    title: "Nakarm {{amount}} epickich ptaków",
                    description: "Znajdź i nakarm {{amount}} epickich ptaków"
                },
                collectCurrency: {
                    title: "Zbierz {{amount}} DziubCoinów",
                    description: "Zbierz w sumie {{amount}} DziubCoinów"
                },
                completeDailyMissions: {
                    title: "Wykonaj 5 dziennych misji",
                    description: "Ukończ 5 dziennych misji w ciągu tygodnia"
                }
            }
        },
        feeding: {
            feedingBonus: "Bonus -{{bonus}}% do czasu karmienia.",
            rewardBonus: "Bonus +{{bonus}}% do nagród.",
            forcedFeedDiscount: "Aktywowano wymuszony bonus -10% za ławkę!",
            forcedFeedDiscountActivated: "Aktywowano wymuszony bonus -10% za ławkę!"
        },
        breeding: {
            title: "Hodowla Ptaków",
            noBird: "Brak ptaka",
            getEgg: "Zdobądź jajko",
            startBreeding: "Zdobądź jajko, aby zacząć hodowlę!",
            feed: "Nakarm",
            play: "Baw się",
            clean: "Wyczyść",
            expeditions: "🚀 Ekspedycje",
            chickName: "Pisklak",
            eggPurchased: "Zakupiono jajko!",
            notEnoughCoins: "Nie masz wystarczająco DziubCoinów! Potrzeba {{amount}}",
            alreadyHaveEgg: "Już masz jajko lub ptaka!",
            egg: "jajko",
            bird: "ptak",
            statusGood: "Twój {{type}} jest w dobrym stanie!",
            stats: {
                hunger: "Głód:",
                happiness: "Szczęście:",
                cleanliness: "Czystość:",
                experience: "Doświadczenie:",
                level: "Poziom: {{level}}"
            },

            initialization: "Inicjalizacja systemu hodowli ptaków",
    backToBreeding: "Powrót do ekranu hodowli",
    increaseHappiness: "Kliknięto ptaka - zwiększam szczęście!",
    youngBird: "Ptak jest jeszcze za mały do zabawy!",
    startPlayScreen: "Uruchamiam ekran zabawy",
    birdImageSet: "Ustawiono obrazek ptaka: {{path}}",
    birdCleaned: "Wyczyściłeś {{name}}!",
    needsHigherLevel: "Potrzebujesz wyższego poziomu ptaka aby to zrobić!",
    screenInitialized: "Ekran hodowli zainicjalizowany pomyślnie",

 birdStatus: {
        hungry: "{{name}} jest głodny!",
        sad: "{{name}} jest smutny!",
        dirty: "{{name}} potrzebuje czyszczenia!",
        good: "{{name}} czuje się dobrze!"
    },

  birdEvents: {
        eggHatched: "Twoje jajko się wykluło! Masz teraz pisklę!",
        chickGrown: "Twoje pisklę dorosło! Masz teraz młodego ptaka!",
        birdAdult: "Twój ptak osiągnął dorosłość!",
        adultReward: "Otrzymujesz 100 DziubCoinów za wychowanie dorosłego ptaka!"
    },



 ui: {
        feedButton: "Nakarm ({{cost}} ziarenek)",
        expeditionsButton: "🚀 Ekspedycje",
        lockedExpeditionsButton: "🔒 Ekspedycje",
        getEggButton: "Zdobądź jajko (50 💰)"
    },

      feeding: {
        birdFed: "Nakarmiono ptaka! Zużyto {{amount}} ziarenek.",
        notEnoughSeeds: "Za mało ziarenek! Potrzebujesz {{amount}} ziarenek.",
        birdFull: "Ptak jest już najedzony!"
    },

       playing: {
        happinessIncreased: "Zwiększyłeś szczęście ptaka do {{amount}}%!"
    },

     egg: {
        purchased: "Zdobyłeś nowe jajko! Nazwałeś je {{name}}!",
        notEnoughCoins: "Za mało DziubCoinów! Potrzebujesz {{amount}} monet."
    },

     birdNames: {
        prefixes: ["Puszek", "Ćwirek", "Słonko", "Świergot", "Błysk", "Skoczek", "Lotnik", "Złotko", "Szmaragd", "Burza"],
        suffixes: ["Piórko", "Dziubek", "Skrzydło", "Śpiewak", "Strzała", "Błękit", "Ćwir", "Serce", "Skrzydlaty", "Dzób"]
    }


        },
        expeditions: {
            title: "Ekspedycje",
            description: "Wyślij swojego ptaka na ekspedycję, aby zdobyć cenne nagrody!",
            petLevel: "Twój ptak jest na poziomie {{level}}.",
            loading: "Ładowanie ekspedycji...",


            logs: {
        initialization: "Inicjalizacja systemu ekspedycji",
        moduleInit: "Inicjalizacja modułu ekspedycji",
        eventListeners: "Konfiguracja event listenerów ekspedycji",
        buttonSetup: "Ustawiam przycisk ekspedycji: {{button}}",
        buttonClicked: "Kliknięto przycisk ekspedycji: {{id}}",
        uiUpdate: "Aktualizacja UI ekspedycji",
        availabilityStatus: "Status dostępności ekspedycji: {{status}}",
        startingExpedition: "Rozpoczynanie ekspedycji: {{id}}",
        wardrobeButtonCheck: "Upewnianie się, że przycisk szafy działa",
        wardrobeButtonClicked: "Kliknięto przycisk szafy",
        pendingExpedition: "Sprawdzanie oczekującej ekspedycji...",
        foundPendingRewards: "Znaleziono oczekujące nagrody z ekspedycji",
        foundSavedExpedition: "Znaleziono zapisaną ekspedycję:",
        expeditionInProgress: "Ekspedycja w trakcie - kontynuowanie",
        noPendingExpedition: "Brak oczekującej ekspedycji",
        wardrobeResetExpeditionCompleted: "Resetowanie stanu szafy - ekspedycja zakończona",
        wardrobeResetButtonsUnlocked: "Stan szafy zresetowany - przyciski odblokowane",
        expeditionEndTime: "Ekspedycja już się zakończyła - ustawiam flagę oczekujących nagród"
    },
    ui: {
        backToMain: "← Powrót do Głównej",
        cancelExpedition: "Anuluj ekspedycję",
        expeditionCompleted: "Ekspedycja zakończona!",
        collectRewards: "Odbierz nagrody",
        startButton: "Rozpocznij",
        costLabel: "Koszt:",
        freeLabel: "✓ BEZPŁATNA",
        rewardsLabel: "NAGRODY",
        takeCare: "Zaopiekuj się swoim ptakiem",
        birdReachedDistance: "Twój ptak przebył dystans",
        distanceAdded: "Dystans został dodany do przepustki nagród",
        meters: "metrów",
        navBreedingButton: "Gniazdo",
        navExpeditionsButton: "🚀 Ekspedycje",
        expeditionTimer: "00:00:00"
    },
    expeditionTypes: {
        short: {
            title: "Eksploracja Lasu",
            description: "Krótka wyprawa do pobliskiego lasu. Idealna na zdobycie podstawowych zasobów.",
            duration: "2 godziny"
        },
        medium: {
            title: "Wyprawa do Jaskini",
            description: "Średniej długości ekspedycja w głąb tajemniczej jaskini. Większe ryzyko, większe nagrody!",
            duration: "6 godzin"
        },
        long: {
            title: "Lot nad Krainą Mgieł",
            description: "Długa i niebezpieczna podróż przez Krainę Mgieł. Najwyższe nagrody dla najodważniejszych!",
            duration: "14 godzin"
        }
    },
    rewardTypes: {
        seeds: "ziarenek",
        coins: "DziubCoinów",
        ton: "TON",
        fruits: "owoców",
        distance: "dystansu w przepustce"
    },
    statusMessages: {
        hungryBird: "Twój ptak jest zbyt głodny! Nakarm go przed wyruszeniem na ekspedycję.",
        sadBird: "Twój ptak jest zbyt smutny! Pobaw się z nim przed wyruszeniem na ekspedycję.",
        dirtyBird: "Twój ptak jest zbyt brudny! Wyczyść go przed wyruszeniem na ekspedycję.",
        lowLevel: "Twój ptak musi osiągnąć poziom 4, aby móc wyruszyć na ekspedycję.",
        birdParameters: "Wszystkie parametry ptaka muszą być powyżej 75%, aby mógł wyruszyć na ekspedycję."
    },
    notifications: {
        notEnoughFruits: "Nie masz wystarczająco owoców! Potrzebujesz {{amount}} owoców, aby rozpocząć tę ekspedycję.",
        fruitsSpent: "Wydano {{amount}} owoców na rozpoczęcie ekspedycji.",
        expeditionStarted: "Rozpoczęto ekspedycję: {{title}}!",
        expeditionError: "Wystąpił błąd podczas rozpoczynania ekspedycji. Spróbuj ponownie.",
        rewardsReceived: "Otrzymano nagrody z ekspedycji:",
        confirmCancel: "Czy na pewno chcesz anulować ekspedycję? Stracisz wszystkie potencjalne nagrody i nie otrzymasz zwrotu kosztów.",
        expeditionCancelled: "Ekspedycja została anulowana.",
        distanceTraveled: "Twój ptak przebył dystans {{distance}}m! Sprawdź przepustkę nagród.",
        expeditionInProgress: "Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji.",
        expeditionCompleted: "Ekspedycja zakończona! Odbierz nagrody w zakładce Gniazdo."
    },
    stats: {
        hunger: "Głód:",
        happiness: "Szczęście:",
        cleanliness: "Czystość:"
    },
    errors: {
        expeditionNotFound: "Nie znaleziono ekspedycji o ID: {{id}}",
        noExpeditionData: "Brak danych aktywnej ekspedycji!",
        timerError: "Brak danych aktywnej ekspedycji dla timera!",
        errorSavingState: "Błąd podczas zapisywania stanu oczekujących nagród: {{error}}",
        rewardPassModuleUnavailable: "Moduł przepustki nagród nie jest dostępny"
    }
},
activeExpedition: {
    cancel: "Anuluj ekspedycję",
    expeditionMessage: "Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji.",
    skinUnavailable: "Niedostępny"


        },
        wallet: {
            title: " ",
            balance: "Stan salda",
            withdraw: "Wypłać",
            howToEarn: "Jak zdobywać TON?",
            mythicalBirds: "Mityczne Ptaki",
            mythicalBirdsDesc: "W każdej lokacji masz szansę natrafić na mitycznego ptaka. Po jego nakarmieniu otrzymasz nagrodę TON. Potrzebujesz tylko owoców i cierpliwości",
            expeditions: "Ekspedycje",
            expeditionsDesc: "Gdy twój ptak w gnieździe dorośnie, wyślij go na wyprawę pełną przygód. Może przynieść z niej cenne TON i inne nagrody",
            currencyExchange: "Wymień walutę",
            amountPlaceholder: "Ilość",
            convert: "Zamień",
            ads: "Reklamy",
            watchAd: "Obejrzyj reklamę",
            adsPlaceholder: "Funkcja w trakcie rozwoju. Wkrótce będziesz mógł otrzymywać nagrody za oglądanie reklam!"
        },
        friends: {
            title: "Przyjaciele",
            comingSoon: "Tu wkrótce pojawi się okno Przyjaciół",


 referralTitle: "Nagrody za polecenia",
    invitedFriends: "zaproszonych znajomych",
    weeklyInvites: "w tym tygodniu",
    yourReferralLink: "Twój link polecający:",
    copyButton: "📋 Kopiuj link",
    shareButton: "📤 Udostępnij",
    invitedUsers: "👥 Zaproszeni użytkownicy",
    userPrefix: "Użytkownik #",
    specialRewards: "🏅 Nagrody specjalne"
},
referral: {
    initialization: "Inicjalizacja systemu poleceń 2.0 (referral.js)",
    selfInviteAttempt: "Próba zaproszenia samego siebie - ignoruję",
    processing: "Przetwarzanie zaproszenia od: {{code}}",
    welcomeBonus: "Zostałeś zaproszony! +{{amount}} DziubCoinów!",
    linkCopied: "Link polecający skopiowany do schowka!",
    copyError: "Nie udało się skopiować linku",
    linkCopiedSimple: "Link polecający skopiowany!",
    shareError: "Błąd udostępniania linku: {{error}}",
    newUserJoined: "Nowy użytkownik dołączył! +{{amount}} DziubCoinów!",
    comboMultiplier: "Combo x{{combo}}! 🔥",
    weeklyReward: "🏆 Nagroda tygodniowa! {{description}}",
    copied: "Skopiowano!",
    greatButton: "Świetnie!",
    claimButton: "Odbierz!",
    tierRewards: "🎯 Nagrody za zaproszenia",
    weeklyRewards: "🏆 Nagrody tygodniowe",
    remaining: "Zostało: {{remaining}}",
    shareMessage: "🦆 Zagraj ze mną w DziubCoins! Karm ptaki i zbieraj nagrody! 💰\n\n🎁 Otrzymasz 20 DziubCoinów na start!",
    tiers: {
        tier1: "Pierwsze zaproszenie! 🎉",
        tier3: "3 zaproszenia! Świetnie! 🔥",
        tier5: "5 zaproszeń! 🦜",
        tier10: "10 zaproszeń! Bonus TON! 💎",
        tier20: "20 zaproszeń! ✨",
        tier50: "50 zaproszeń! 💎",
        tier100: "100 zaproszeń! Nowy skin rekrutera! 🌟"
    },
    weekly: {
        tier5: "5 zaproszeń w tygodniu!",
        tier10: "10 zaproszeń w tygodniu! Niesamowite!",
        tier20: "20 zaproszeń w tygodniu! Jesteś mistrzem!"
    },
     tierLevel: "Poziom {{level}} Osiągnięty!",
    rewards: "Nagrody",
    invitation: "zaproszenie",
    invitations: "zaproszeń",
    skinrecruiter: "Skin Rekrutera"

        },
        dailyRewards: {
            title: "Nagrody Dzienne",
            description: "Odbieraj codzienne nagrody i utrzymuj serię przez 7 dni!",
            nextReward: "Następna nagroda za: {{time}}",



logs: {
        constructor: "System nagród dziennych: konstruktor",
        initialization: "Inicjalizacja systemu nagród dziennych...",
        initialized: "System nagród dziennych zainicjalizowany:",
        initError: "Błąd podczas inicjalizacji systemu nagród:",
        stateSaved: "Stan nagród zapisany:",
        loadError: "Błąd wczytywania stanu nagród:",
        saveError: "Błąd zapisywania stanu nagród:",
        daysSinceLastClaim: "Dni od ostatniego odbioru:",
        startingNewWeek: "Rozpoczynanie nowego tygodnia! Poprzedni:",
        streakReset: "Resetowanie postępu dniowego, ale zachowanie tygodnia"
    },
    notifications: {
        cantClaimNow: "Nie możesz teraz odebrać nagrody. Wróć jutro!",
        allRewardsClaimed: "Wszystkie nagrody zostały już odebrane!",
        rewardNotFound: "Błąd: Nie znaleziono nagrody na ten dzień!",
        weeklyBonus: "Gratulacje! Ukończyłeś tydzień {{week}}! Nagrody w nowym tygodniu będą lepsze!",
        rewardsReset: "Zresetowano nagrody dzienne!",
        alreadyClaimed: "Ta nagroda została już odebrana!",
        claimInOrder: "Odbierz nagrody po kolei!",
        availableReward: "Masz nagrodę do odebrania w kalendarzu!"
    },
    rewardTypes: {
        seeds: {
            one: "ziarenko",
            few: "ziarenka",
            many: "ziarenek"
        },
        coins: {
            one: "DziubCoin",
            few: "DziubCoiny",
            many: "DziubCoinów"
        },
        fruits: {
            one: "owoc",
            fraction: "owocu",
            few: "owoce",
            many: "owoców"
        },
        ton: "TON"
    },
    ui: {
        weekIndicator: "Tydzień {{week}}",
        streakActive: "Seria trwa! Tak trzymaj!",
        streakBroken: "Seria przerwana! Zacznij od nowa, zachowując postęp tygodnia.",
        dayNumber: "Dzień {{day}}",
        claimButton: "Odbierz nagrodę",
        comeBackTomorrow: "Wróć jutro po więcej!",
        timerNextReward: "Następna nagroda za: {{hours}}h {{minutes}}m {{seconds}}s"
    }



        },
        rewardPass: {
            title: "Nagrody Ekspedycji",
            remaining: "Pozostało: {{time}}",
            premiumTitle: "Premium Pass - Odblokuj Specjalne Nagrody!",
            premiumDesc: "Awansuj na Premium i otrzymaj dostęp do ekskluzywnych nagród oraz natychmiastowy bonus +500m!",
            benefits: {
                double: "Podwójna ilość nagród",
                betterTon: "Lepsze nagrody TON",
                instantBonus: "+500m natychmiast"
            },
            buyPremium: "Kup Premium Pass (2 TON)",



 logs: {
        initialization: "Inicjalizacja systemu przepustki nagród",
        moduleInit: "Inicjalizacja modułu przepustki nagród",
        foundSaved: "Znaleziono zapisaną przepustkę nagród: {{data}}",
        restoreFromSave: "Odtworzono przepustkę z zapisanej gry: {{data}}",
        updatedFromSave: "Zaktualizowano przepustkę z zapisanej gry: {{data}}",
        creatingNew: "Tworzenie nowego obiektu przepustki nagród",
        updatingEndDate: "Aktualizacja daty końcowej przepustki nagród",
        saveState: "Zapisano stan przepustki nagród: {{data}}",
        saveFailed: "Nie udało się zapisać dodatkowej kopii claimedRewards: {{error}}",
        uiUpdate: "Aktualizacja UI przepustki nagród"
    },
    ui: {
        rewards: "Nagrody",
        unlockCost: "Odblokuj za {{amount}} DziubCoinów",
        timerFormat: "Pozostało: {{days}}d {{hours}}h {{minutes}}m",
        currentDistance: "Aktualny dystans: {{distance}}m",
        claim: "Odbierz!",
        premiumActive: "Premium Pass Aktywny",
        premiumActiveBadge: "✨ PREMIUM AKTYWNE ✨"
    },
    notifications: {
        notEnoughTon: "Nie masz wystarczająco TON! Potrzebujesz 2 TON, aby kupić Premium Pass.",
        premiumActivated: "Gratulacje! Aktywowano Premium Pass i dodano bonus +500m!",
        newSeason: "Rozpoczął się nowy sezon przepustki nagród! Twój dystans został zachowany, ale możesz zdobyć nowe nagrody.",
        distanceUpdate: "Aktualizacja dystansu przepustki: {{distance}}",
        distanceSaved: "Zapisano nowy dystans: {{distance}}",
        distanceSaveError: "Błąd podczas zapisywania dystansu: {{error}}",
        recoveringDistance: "Odzyskiwanie zapisanego dystansu: {{distance}}",
        rewardsRecovered: "Odzyskano status odebranych nagród: {{data}}",
        recoveryError: "Błąd podczas odzyskiwania stanu przepustki: {{error}}",
        insufficientDistance: "Musisz przejść większy dystans, aby odebrać tę nagrodę!",
        needPremium: "Musisz kupić Premium Pass, aby odebrać tę nagrodę!",
        alreadyClaimed: "Ta nagroda została już odebrana!",
        skinUnlocked: "Odblokowano skin: Leśny Zwiadowca!",
        rewardClaimed: "Odebrano nagrodę: {{reward}}!"
    },
    rewardTypes: {
        seeds: "ziarenek",
        coins: "DziubCoinów",
        fruit: "owoców",
        fruits: "owoców",
        ton: "TON",
        skin: "Skin"
    },
    birdDistance: {
        title: "Twój ptak przebył dystans:",
        checkRewardPass: "Sprawdź przepustkę nagród"
    }





        },
        wardrobe: {
            title: "Szafa Ptaka",
            description: "Tutaj możesz zmienić wygląd swojego ptaka!",
            availableSkins: "Dostępne skiny:",
            skins: {
                defaultName: "Podstawowy",
                defaultDesc: "Standardowy wygląd ptaka",
                defaultBonus: "Bonus: brak",
                selected: "Wybrany",
                locked: "Zablokowany",
                forestScoutName: "Leśny zwiadowca",
                forestScoutDesc: "Doświadczony zwiadowca znający wszystkie zakamarki lasu",
                forestScoutBonus: "Bonus: +10% ziarenek z ekspedycji",
                forestScoutRequirement: "Wymagane: 1100m w ekspedycji",
                masterRecruiterName: "Master Recruiter",
                masterRecruiterDesc: "Mistrz rekrutacji - symbol prestiżu i wpływu",
                masterRecruiterRequirement: "Wymagane: 100 zaproszeń"
            },



buttons: {
        select: "Wybierz",
        selected: "Wybrany",
        locked: "Zablokowany",
        unavailable: "Niedostępny"
    },
    notifications: {
        expeditionActive: "Twój ptak jest na ekspedycji! Nie możesz zmienić skina podczas aktywnej ekspedycji.",
        masterSkinRequirement: "Musisz zaprosić 100 znajomych, aby odblokować skin Master Recruiter!",
        forestSkinRequirement: "Osiągnij 1100m w ekspedycji, aby odblokować skin Leśnego Zwiadowcy!",
        adultBirdRequired: "Tylko dorosły ptak może zmienić wygląd!",
        defaultSkinSelected: "Wybrano domyślny wygląd ptaka!",
        forestSkinSelected: "Wybrano skin Leśnego Zwiadowcy! Zyskujesz bonus +10% ziarenek z ekspedycji!",
        masterSkinSelected: "Wybrano skin Master Recruiter! Dumnie noś symbol mistrza rekrutacji!"
    },
    bonusInfo: "Aktywny bonus: +10% ziarenek z ekspedycji"




        },
        mainScreen: {
            level: "Poziom {{level}}",
            xp: "{{current}}/{{next}} XP"
        },
        sortingGame: {
            time: "Czas: {{time}}",
            title: "Posortuj ziarenka",
            collected: "Zebrałeś: {{count}} / 30 ziarenek",
            summary: "Podsumowanie",
            cleaned: "Posprzątałeś: {{count}} ziarenek",
            cleanlinessGained: "Otrzymałeś: +{{percent}}% czystości",
            finish: "Koniec",




initialization: "Inicjalizacja mini-gry sortowania ziarenek",
starting: "Uruchamiam mini-grę sortowania",
telegramCheck: "Czy jesteśmy w Telegram WebApp: {{status}}",
seedsInitialization: "Inicjalizacja ziarenek do sortowania",
correctMatch: "Dobrze! Ziarenko w miseczce.",
wrongMatch: "Źle! To nie ta miseczka.",
wrongBowl: "To nie ta miseczka!",
seedSelected: "Wybrano ziarenko typu: {{type}}",
clickBowl: "Kliknij na miseczkę, aby umieścić w niej ziarenko!",
selectSeedFirst: "Najpierw wybierz ziarenko!",
gameEnd: "Koniec gry!"



        },
        activeExpedition: {
            cancel: "Anuluj ekspedycję"
        },
        notifications: {
            minCoinsAmount: "Minimalna kwota to 100 DziubCoinów!",
            notEnoughCoins: "Nie masz wystarczająco DziubCoinów!",
            enterFruitsAmount: "Podaj liczbę owoców do wymiany!",
            notEnoughFruits: "Nie masz wystarczająco owoców!",
            convertedCoinsToFruits: "Wymieniono {{amount}} DziubCoinów na {{fruits}} owoców!",
            convertedFruitsToCoins: "Wymieniono {{amount}} owoców na {{coins}} DziubCoinów!",
            gameReset: "Gra została zresetowana!",
            confirmReset: "Czy na pewno chcesz zresetować grę?",
            locationUnlockSuccess: "Odblokowano lokację {{location}}!",
            expeditionInProgress: "Ekspedycja w trakcie! Możesz wrócić do niej z ekranu Gniazda.",
            addingSeedManually: "Dodaję ziarenko ręcznie",
            seedAdded: "+1 ziarenek",
            noSeedsToCollect: "Brak ziarenek do zebrania!",
            levelUp: "Osiągnięto poziom {{level}}! +{{amount}} DziubCoinów!",
            birdReadyToCollect: "Ptak gotowy do odbioru nagrody!",
            receivedTon: "Otrzymałeś {{amount}} TON za mitycznego ptaka!",
            mythicalBirdFeedingBonus: "Karmisz mitycznego ptaka! Bonus -{{bonus}}% do czasu karmienia.",
            birdsFeeded: "Nakarmiono {{count}} ptaków w lokacji {{location}}! Zużyto {{seeds}} ziarenek.",
            rewardsCollected: "Odebrano nagrody od {{count}} ptaków: +{{coins}} DziubCoinów!",
            noBirdsToFeed: "Brak ptaków do nakarmienia w lokacji {{location}}!",
            allBirdsFeeding: "W lokacji {{location}} wszystkie ptaki są w trakcie karmienia lub nie ma tam ptaków. Odblokuj więcej slotów lub poczekaj.",
            notEnoughSeedsForAllBirds: "Nie masz wystarczająco ziarenek! Potrzebujesz {{amount}} ziarenek.",
            noRewardsToCollect: "Brak nagród do odebrania!",
            enterValidValue: "Wprowadź poprawną wartość!",
            notEnoughFruitsForMythical: "Za mało owoców! Potrzebujesz {{amount}} owoców aby nakarmić mitycznego ptaka.",
            receivedCoinsWithBonus: "Otrzymałeś {{baseAmount}} + {{bonusAmount}} DziubCoinów (bonus z fontanny)!",
            receivedCoins: "Otrzymałeś {{amount}} DziubCoinów!",
            adsFeatureSoon: "Funkcja oglądania reklam będzie dostępna wkrótce!",
            withdrawFeatureSoon: "Funkcja wypłaty będzie dostępna wkrótce!",
            eggPurchaseError: "Błąd: nie można kupić jajka",
            eggPurchaseFunctionUnavailable: "Funkcja zakupu jajka niedostępna!",
            functionUnavailable: "Funkcja {{functionName}} niedostępna!",
            receivedFruitsForCoins: "Otrzymałeś {{fruits}} owoców za {{coins}} DziubCoinów"
        },
        telegram: {
            // Logi inicjalizacyjne
            initialization: "Inicjalizacja telegram.js",
            webAppAvailable: "Telegram WebApp dostępny, inicjalizuję",
            webAppUnavailable: "Telegram WebApp niedostępny, działa tryb przeglądarkowy",
            viewportChanged: "Viewport Telegram zmieniony, odświeżam UI",
            initSuccess: "Telegram WebApp zainicjowany pomyślnie",
            initError: "Błąd inicjalizacji Telegram WebApp:",
            
            // Przyciski i akcje
            backButtonPressed: "Przycisk powrotu wciśnięty, zapisuję stan gry",
            statsSent: "Statystyki wysłane do Telegrama:",
            statsError: "Błąd wysyłania danych do Telegrama:",
            sharingUnavailable: "Udostępnianie dostępne tylko w aplikacji Telegram",
            achievementShare: "Zdobyłem osiągnięcie \"{{achievementTitle}}\" w grze DziubCoins! Zagraj ze mną!",
            sharingFunctionUnavailable: "Funkcja udostępniania nie jest dostępna",
            sharingError: "Błąd udostępniania osiągnięcia:",
            
            // Inne
            imagePreparation: "Przygotowanie obrazu do udostępnienia - funkcja w przygotowaniu",
            colorsAdjusted: "Kolory dostosowane do motywu Telegrama",
            colorError: "Błąd dostosowania kolorów:",
            gameClosing: "Zamykanie gry, zapisuję stan"
        },



sound: {
    logs: {
        initialization: "Inicjalizacja systemu dźwięków",
        moduleInit: "Inicjalizacja modułu dźwięków",
        firstInteraction: "Pierwsza interakcja, uruchamianie muzyki w tle...",
        listenersSetup: "Przygotowano listenery na pierwszą interakcję dla muzyki w tle",
        soundLoaded: "Załadowano dźwięk: {{name}}",
        soundLoadError: "Błąd ładowania dźwięku {{name}}: {{error}}",
        settingsLoaded: "Załadowano ustawienia dźwięku: włączony={{enabled}}, głośność={{volume}}, muzyka={{music}}, efekty={{effects}}",
        settingsLoadError: "Błąd ładowania ustawień dźwięku: {{error}}",
        settingsSaved: "Zapisano ustawienia dźwięku: włączony={{enabled}}, głośność={{volume}}, muzyka={{music}}, efekty={{effects}}",
        settingsSaveError: "Błąd zapisywania ustawień dźwięku: {{error}}",
        toggleButtonDisabled: "Przycisk dźwięku wyłączony - używaj ustawień w panelu",
        layoutFixed: "Naprawiono układ okna ustawień",
        initSoundSettings: "Inicjalizacja kontrolek dźwięku w oknie ustawień",
        soundControlsInitialized: "Kontrolki dźwięku zainicjalizowane",
        initLanguageOptions: "Inicjalizacja kontrolek wyboru języka",
        languageControlsInitialized: "Kontrolki wyboru języka zainicjalizowane",
        mainScreenActive: "Ekran główny jest aktywny, próba odtworzenia muzyki..."
    },
    notifications: {
        soundsEnabled: "Dźwięki włączone",
        soundsDisabled: "Dźwięki wyłączone",
        backgroundMusicEnabled: "Muzyka w tle włączona",
        backgroundMusicDisabled: "Muzyka w tle wyłączona",
        soundEffectsEnabled: "Efekty dźwiękowe włączone",
        soundEffectsDisabled: "Efekty dźwiękowe wyłączone",
        volume: "Głośność: {{volume}}%",
        languageChanged: "Język: {{language}}"
    },
    errors: {
        soundNotFound: "Dźwięk \"{{name}}\" nie istnieje!",
        soundPlayWarning: "Nie można odtworzyć dźwięku {{name}}: {{error}}",
        soundPlayError: "Błąd odtwarzania dźwięku {{name}}: {{error}}",
        soundStopError: "Błąd zatrzymywania dźwięku: {{error}}"
    },
    language: {
        polish: "Polski",
        english: "English"
    },

    locationActions: {
    logs: {
        feedingAllBirds: "Karmienie wszystkich ptaków w lokacji {{locationId}} (nowa wersja)",
        slotsNotFound: "Nie znaleziono slotów dla lokacji {{locationId}}",
        feedingCalculation: "Oryginalny koszt przed bonusami: {{cost}} dla ptaka typu {{birdType}}",
        bonusApplied: "Koszt po zastosowaniu bonusów: z {{oldCost}} na {{newCost}} (lokacja: {{locationId}})",
        bonusFunctionUnavailable: "Funkcja bonusów niedostępna!",
        costAdded: "Dodano koszt {{cost}}, łączny wymagany koszt: {{totalCost}}",
        mythicalFeedingTimeBonus: "Czas karmienia mitycznego ptaka po zastosowaniu bonusów: {{feedTime}} (lokacja: {{locationId}})",
        birdFeedingTimeBonus: "Czas karmienia po zastosowaniu bonusów: {{feedTime}} (lokacja: {{locationId}})"
    },
    notifications: {
        locationLocked: "Ta lokacja jest zablokowana!",
        notEnoughSeeds: "Za mało ziarenek! Potrzebujesz {{amount}} ziarenek.",
        notEnoughFruits: "Za mało owoców! Potrzebujesz {{amount}} owoców.",
        notEnoughResources: "Za mało zasobów! Potrzebujesz {{amount}} ziarenek i {{fruitAmount}} owoców.",
        feedingTimeBonus: " (-{{bonus}}% czas karmienia)",
        fedBirdsAndMythical: "Nakarmiono {{birds}} ptaków ({{seeds}} ziarenek) i {{mythical}} mitycznych ptaków ({{fruits}} owoców) w lokacji {{location}}!{{bonus}}",
        fedBirds: "Nakarmiono {{birds}} ptaków w lokacji {{location}}! Zużyto {{seeds}} ziarenek.{{bonus}}",
        fedMythical: "Nakarmiono {{mythical}} mitycznych ptaków w lokacji {{location}}! Zużyto {{fruits}} owoców.{{bonus}}",
        noBirdsToFeed: "Brak ptaków do nakarmienia w lokacji {{location}}!",
        rewardsWithTon: "Odebrano nagrody od {{birds}} ptaków w lokacji {{location}}: +{{coins}} DziubCoinów i +{{ton}} TON!"
    },
    buttons: {
        feedAll: "Nakarm wszystkie",
        collectAll: "Odbierz wszystkie"
    },
    collectingAllRewards: "Odbieranie wszystkich nagród w lokacji {{locationId}} (nowa wersja)",
    locationStatusCheck: "Sprawdzanie statusu lokacji {{locationId}}",
    updatingAllButtons: "Aktualizacja wszystkich przycisków akcji dla wszystkich lokacji",
    buttonsNotFound: "Nie znaleziono przycisków akcji dla lokacji {{locationId}}",
    actionButtonClicked: "Kliknięto przycisk akcji zbiorczej (nowa wersja)",
    noLocationAttribute: "Brak atrybutu data-location na przycisku",
    actionInitialization: "Inicjalizacja systemu akcji zbiorczych dla lokacji",
    birdSlotsUiUpdate: "Aktualizacja UI slotów z ptakami dla aktualnej lokacji"
}

}
    },
    en: {
        // Angielski
        general: {
            loading: "Loading...",
            save: "Save",
            cancel: "Cancel",
            back: "← Back",
            confirmReset: "Are you sure you want to reset the game?",
            gameReset: "Game has been reset!",
            notEnoughCoins: "You don't have enough BirdCoins (needed: {{amount}})"
        },
        menu: {
            mainTitle: "FEED & FLAP"
        },
        navigation: {
            main: "Main",
            breeding: "Nest",
            feeding: "Feeding",
            production: "Seeds",
            missions: "Missions",
            wallet: "Wallet"
        },
        settings: {
            title: "Settings",
            soundSettings: "Sound Settings",
            backgroundMusic: "Background Music",
            musicVolume: "Music Volume",
            soundEffects: "Sound Effects",
            effectsVolume: "Effects Volume",
            languageSettings: "Language Settings",
            legalInfo: "Legal Information",
            termsOfService: "Terms of Service",
            privacyPolicy: "Privacy Policy"
        },
        resources: {
            seeds: "Seeds",
            coins: "BirdCoins",
            fruits: "Fruits",
            ton: "TON",
            seedsIcon: "Seeds",
            coinsIcon: "BirdCoins",
            fruitsIcon: "Fruits",
            tonIcon: "TON"
        },
        birdSlots: {
            feedBird: "Feed",
            scareBird: "Shoo",
            collectReward: "Collect",
            unlock: "Unlock",
            lockInfo: "Unlock for {{amount}} BirdCoins",
            newSlotUnlocked: "New bird slot unlocked!",
            waitingForBird: "Waiting for a bird..."
        },
        locations: {
            parkName: "City Park",
            lakeName: "Lake Shore",
            forestName: "Mysterious Forest",
            newLocation: "New Location",
            unlocked: "Unlocked",
            locked: "Locked",
            comingSoon: "Coming Soon!",
            unlockFor: "Unlock for {{amount}} BirdCoins",
            unlockInfo: "Unlock this location for {{amount}} BirdCoins in the Map menu!",
            description: {
                park: "Your first location. You can meet urban bird species here.",
                lake: "A new place full of coastal birds! Unlock to access new species.",
                forest: "A magical place hidden among the trees. Unlock to discover rare forest birds.",
                comingSoonDesc: "A mysterious new location will be added in the next update. New birds, new challenges!"
            },
            buttons: {
                selected: "Selected",
                feedAll: "Feed All",
                collectAll: "Collect All",
                availableSoon: "Available Soon"
            },

 birdsDiscovery: "Birds: {{discovered}}/{{total}}",

 notifications: {
        locationUnlocked: "Location {{location}} unlocked!",
        locationError: "Error: Location does not exist!",
        locationLocked: "This location is locked!",
        locationSelected: "Selected location: {{name}}",
        notEnoughCoins: "Not enough BirdCoins! You need {{amount}} coins.",



 receivedTon: "You received {{amount}} TON for the mythical bird!",
    receivedCoinsWithBonus: "You received {{baseAmount}} + {{bonusAmount}} BirdCoins (fountain bonus)!",
    receivedCoins: "You received {{amount}} BirdCoins!",
    rewardFixLoaded: "🔨 Final reward fix script loaded - overriding collectBirdReward function every 100ms",


    mythicalBirdFed: "Fed a mythical bird using {{amount}} fruits!"
    


    },

     logs: {
        initSystem: "Initializing location system",
        preInitState: "State of unlocked locations before initialization:",
        noLocationsObject: "No locations object - creating new",
        noCurrentLocation: "No currentLocation - setting default value",
        noUnlockedLocations: "No unlockedLocations - setting default values",
        usingExistingValues: "Using existing values for unlockedLocations:",
        currentLocationLocked: "Current location {{location}} is not unlocked, restoring to park",
        addingParkLocation: "Adding missing 'park' location to unlockedLocations",
        addingLakeLocation: "Adding missing 'lake' location to unlockedLocations",
        stateChangesDetected: "Detected changes in location state during initialization - saving game state",
        stateBefore: "State before:",
        stateAfter: "State after:",
        feedScreenTransition: "Transition to feed screen via hideAndShowScreen - updating decorations",
        initComplete: "Location system initialization completed. Unlocked locations state:",
        
        showingMapScreen: "Showing map screen",
        updatingMapUI: "Updating map UI. Unlocked locations state:",
        missingLocationsObject: "ERROR: Missing locations or unlockedLocations object during map UI update!",
        foundLocationElements: "Found {{count}} location elements on the map",
        buttonNotFound: "Button not found in location element:",
        dataLocationMissing: "Button does not have data-location attribute:",
        updatingLocationUI: "Updating UI for location {{location}}, unlock state: {{unlocked}}",
        locationUnlocked: "Location {{location}} is unlocked - updating UI",
        locationLocked: "Location {{location}} is locked - updating UI",
        uiMemoryMismatch1: "Mismatch: Location {{location}} is unlocked in memory but has 'locked' class in UI",
        uiMemoryMismatch2: "Mismatch: Location {{location}} is locked in memory but doesn't have 'locked' class in UI",
        
        selectedButtonClicked: "Selected button clicked for location {{location}}",
        selectButtonClicked: "Select button clicked for location {{location}}",
        setupUnlockButtons: "Setting up unlock location buttons. Unlocked locations state:",
        unlockButtonClicked: "Unlock button clicked for location: {{location}}",
        stateBeforeUnlock: "State before unlock:",
        tryingToUnlock: "Trying to unlock location: {{location}}",
        availableConfigs: "Available configurations:",
        configNotFound: "Configuration not found for location {{location}}",
        usingFallbackCost: "Using fallback cost from data-cost attribute: {{cost}}",
        unlockAttempt: "Attempting to unlock location: {{location}}, cost: {{cost}}",
        missingLocationsError: "ERROR: No locations object! Creating new.",
        missingUnlockedLocationsError: "ERROR: No unlockedLocations object! Creating new.",
        unlockingLocation: "Unlocking location {{location}}...",
        stateAfterUnlock: "State after unlock:",
        criticalUnlockError: "CRITICAL ERROR: Location {{location}} was not properly unlocked!",
        savingGameAfterUnlock: "Saving game state after location unlock",
        saveGameUnavailable: "SaveGame function unavailable! Trying to use localStorage directly.",
        localStorageError: "Error during localStorage save:",
        stateAfterTimeout: "Location state after timeout:",
        addingUnlockListener: "Adding event listener for unlock button of location {{location}}",
        
        changingLocation: "Changing location to: {{location}}",
        locationNotDefined: "Location {{location}} is not defined!",
        alreadyInLocation: "You are already in this location",
        applyingDecorations: "Applying decorations for location {{location}} in changeLocation",
        decorationsFunctionUnavailable: "ApplyDecorations function is not available!",
        updatingCatalog: "Updating bird catalog after location change",
        
        diagnosticsHeader: "=== LOCATION STATE DIAGNOSTICS ===",
        gameStateExists: "GameState object exists:",
        gameStateMissingError: "CRITICAL ERROR: GameState object is missing!",
        locationsObjectExists: "Locations object exists:",
        locationsMissingError: "CRITICAL ERROR: Locations object is missing in gameState!",
        unlockedLocationsExists: "UnlockedLocations object exists:",
        unlockedLocationsMissingError: "CRITICAL ERROR: UnlockedLocations object is missing in gameState.locations!",
        unlockedLocations: "Unlocked locations:",
        locationStatus: "Location {{location}}: {{status}}",
        currentLocation: "Current location:",
        currentLocationUnlocked: "Is current location ({{location}}) unlocked: {{unlocked}}",
        uiLocationElements: "Number of location elements in UI:",
        locationUiMemoryStatus: "Location {{location}} in UI: {{uiStatus}}, in memory: {{memoryStatus}}",
        savedStateExists: "Saved state exists in localStorage",
        savedUnlockedLocations: "Unlocked locations in saved state:",
        stateDifference: "Discrepancy for location {{location}}: in memory={{memoryState}}, in save={{savedState}}",
        statesMatch: "Location state in memory matches saved state",
        noSavedUnlockedLocations: "No information about unlocked locations in saved state!",
        parseSaveError: "Error parsing saved state:",
        noSavedState: "No saved state in localStorage",
        saveGameAvailable: "SaveGame function available:",
        loadGameAvailable: "LoadGame function available:",
        diagnosticsFooter: "=== END OF DIAGNOSTICS ===",
        
        startingRepair: "Starting location system repair...",
        creatingGameState: "Creating new gameState object",
        creatingLocations: "Creating new locations object",
        creatingUnlockedLocations: "Creating new unlockedLocations object",
        settingDefaultLocation: "Setting default current location",
        restoringFromSave: "Restoring unlocked locations from save",
        restoreError: "Error during restore from save:",
        updatingMapUI: "Updating map UI",
        savingRepairedState: "Saving repaired state",
        repairComplete: "Repair complete. Current unlocked locations state:"
    }




        },
        catalog: {
            title: "Bird Catalog",
            mapTitle: "Location Map",
            birdStats: {
                type: "Type:",
                chance: "Chance:",
                time: "Time:",
                cost: "Cost:",
                reward: "Reward:",
                seeds: "{{amount}} seeds",
                seed: "{{amount}} seed",
                seedMultiple: "{{amount}} seeds",
                fruit: "{{amount}} fruit",
                fruits: "{{amount}} fruits"
            },
            birdTypes: {
                common: "Common",
                rare: "Rare",
                epic: "Epic",
                legendary: "Legendary",
                mythical: "Mythical"
            },
            birdNames: {
                // Park
                commonSparrow: "Common Sparrow",
                rareRobin: "Krakow Pigeon",
                epicCardinal: "White-faced Jay",
                legendaryPhoenix: "Graphenix",
                mythicalEagle: "Crowned Eagle",
                // Lake
                commonDuck: "Mallard Duck",
                rareHeron: "Whooper Swan",
                epicSwan: "Pink Pelican",
                legendaryPelican: "Lake Heron",
                mythicalKraken: "Blue Phantom Bird",
                // Forest
                commonWoodpecker: "Great Tit",
                rareOwl: "Black Woodpecker",
                epicHawk: "Dark Eagle Owl",
                legendaryGriffin: "Goldfeather",
                mythicalPhoenix: "Forest Spirit"
            }
        },






birdDiscovery: {
    systemInitialization: "Initializing bird discovery system",
    systemInitialized: "Bird discovery system initialized",
    attemptGeneration: "Attempting to generate bird in slot {{slotIndex}}, location {{locationId}}",
    birdGenerated: "Generated bird of type {{birdType}} in location {{locationId}}",
    discoveringBird: "Discovering bird {{birdId}} in location {{locationId}}",
    idNotFound: "ID not found for bird type {{birdType}} in location {{locationId}}",
    catalogOpenDetected: "Catalog opening detected - updating UI",
    discovering: "Discovering bird {{birdId}} in location {{locationId}}",
    birdAlreadyDiscovered: "Bird {{birdId}} already discovered in location {{locationId}}",
    birdDiscovered: "Bird {{birdId}} has been discovered in location {{locationId}}!",
    newBirdAdded: "New bird added to catalog!",
    catalogUpdateStarted: "Updating bird catalog UI",
    locationCatalogUpdate: "Updating catalog for location: {{locationId}}",
    catalogElementNotFound: "Element #{{locationId}}-catalog not found in DOM",
    noDiscoveredBirdsData: "No discovered birds data for location {{locationId}}",
    foundBirdItems: "Found {{count}} bird elements in location {{locationId}}",
    noBirdId: "Bird element without data-bird-id",
    markingBirdAsDiscovered: "Marking bird {{birdId}} as discovered in UI",
    classesAfterUpdate: "Classes after update: {{classes}}",
    catalogMonitoringAdded: "Adding catalog opening monitoring",
    catalogButtonClicked: "Catalog button clicked",
    catalogScreenActivated: "Catalog screen activation detected",
    directDiscovery: "Directly discovering bird type {{birdType}} in location {{locationId}}",
    directBirdDiscovered: "Discovered new bird: {{birdId}} in location {{locationId}}!",
    directBirdAlreadyDiscovered: "Bird {{birdId}} in location {{locationId}} was already discovered.",
    discoveryError: "Error: invalid bird type {{birdType}} for location {{locationId}}",
    cannotDiscover: "Cannot discover bird: invalid type or location"
},
catalogFix: {
    startingRepair: "Starting bird catalog display repair...",
    repairingLocation: "Checking and repairing location {{locationId}} in catalog...",
    locationUnlockStatus: "Location {{locationId}} is unlocked: {{status}}",
    catalogElements: "Catalog elements: lockInfo={{lockInfo}}, birdGrid={{birdGrid}}, status={{statusElement}}",
    showingBirds: "Showing birds from location {{locationId}}",
    repairCompleted: "Bird catalog display repair completed",
    repairingBirdImages: "Repairing bird images in location {{locationId}}...",
    noImageMapping: "No image mapping for location {{locationId}}",
    foundBirdElements: "Found {{count}} bird elements in location {{locationId}}",
    cannotDetermineBirdType: "Cannot determine bird type for id: {{birdId}}",
    imageElementNotFound: "Image element not found for bird {{birdId}}",
    settingBirdImage: "Setting image for bird {{birdId}}: {{path}}",
    removingUndiscoveredClass: "Bird {{birdId}} is discovered - removing bird-undiscovered class"
},
lakeBirdCatalog: {
    repairStarting: "Repairing Lake Shore bird catalog...",
    catalogNotFound: "Lake-catalog element not found!",
    unlockStatus: "Lake Shore unlock status: {{status}}",
    gridRepaired: "Bird grid in Lake catalog repaired",
    gridNotFound: "Bird grid not found in Lake catalog!",
    gridCreated: "Created new bird grid for Lake catalog",
    birdsAdded: "Added {{count}} birds to Lake catalog.",
    updatingDiscoveryState: "Updating bird discovery state in Lake location...",
    noDiscoveryData: "No structure for discovered birds data!",
    foundBirdElements: "Found {{count}} bird elements in Lake catalog",
    removingUndiscoveredClass: "Bird {{birdId}} is discovered - removing bird-undiscovered class",
    setupEventListeners: "Setting up event listeners for Lake catalog repair...",
    catalogButtonClicked: "Bird catalog button clicked - starting repair",
    catalogScreenOpened: "Catalog screen opening detected - starting repair",
    setupCompleted: "Event listener setup completed",
    moduleLoaded: "Lake catalog repair module loaded"
},
birdAppearance: {
    directUpdate: "Direct update of bird appearance in catalog",
    lakeGridNotFound: "Lake bird grid not found - starting repair"
},




        shop: {
            title: "Expand Your Location!",
            sectionHeaders: {
                park: "City Park",
                lake: "Lake Shore",
                forest: "Mysterious Forest",
                description: "Upgrade {{location}} to gain bonuses!",
                forestPlaceholder: "New decorations coming soon!"
            },
            decorations: {
                benchName: "Park Bench",
                benchDesc: "A lovely bench where park visitors sit to feed the beaks",
                benchBonus: "Bonus: -10% feeding cost",
                fountainName: "Fountain",
                fountainDesc: "A beautiful fountain attracting BirdCoins",
                fountainBonus: "Bonus: +10% more BirdCoins",
                balloonName: "Tour Balloon",
                balloonDesc: "A colorful balloon that makes birds eat faster to return to play",
                balloonBonus: "Bonus: -10% feeding time",
                boatName: "Boat",
                boatDesc: "A small boat that allows you to get closer to the birds, making feeding cheaper",
                boatBonus: "Bonus: -12% feeding cost",
                kiteName: "Kite",
                kiteDesc: "A colorful kite that helps attract birds and increases their generosity",
                kiteBonus: "Bonus: +12% more BirdCoins",
                paragliderName: "Paraglider",
                paragliderDesc: "A spectacular paraglider that helps birds focus on eating",
                paragliderBonus: "Bonus: -12% feeding time"
            },



buttons: {
        purchased: "Purchased"
    },
    bonuses: {
        activeTitle: "Active bonuses",
        feedCostBonus: "🌱 -{{value}}% feeding cost",
        rewardBonus: "💰 +{{value}}% more BirdCoins",
        feedTimeBonus: "⏱️ -{{value}}% feeding time"
    },
    requirements: {
        parkPremium: "Requires: Bench and Fountain",
        lakePremium: "Requires: Boat and Kite"
    },
    notifications: {
        decorationNotExist: "Error: This decoration does not exist!",
        alreadyOwned: "You already own this decoration!",
        requiresParkBasic: "You need to buy bench and fountain first!",
        requiresLakeBasic: "You need to buy boat and kite first!",
        notEnoughTon: "Not enough TON! You need {{amount}} TON.",
        decorationPurchased: "Purchased decoration: {{name}}!",
        newDecoration: "New decoration!",
        feedCostBonus: " Now feeding birds costs {{value}}% less!",
        rewardBonus: " Now you receive {{value}}% more BirdCoins!",
        feedTimeBonus: " Now birds eat {{value}}% faster!",
        mythicalBirdBonus: "You're feeding a mythical bird! Bonus -{{bonus}}% to feeding time."
    }

        },
        production: {
            title: "Seed Production",
            autoCollector: "Auto Collector",
            collectAuto: "Collect auto-harvest",
            collectSeed: "Collect seed",
            upgrades: "Upgrades",
            biggerCapacity: "Bigger Auto Collector",
            biggerCapacityDesc: "Increases capacity by 10",
            fasterCollection: "Faster Auto Collector",
            fasterCollectionDesc: "Increases collection speed",
            upgradeButton: "Upgrade ({{amount}} BirdCoins)",
            autoCapacityIncreased: "Auto Collector capacity increased!",
            autoSpeedIncreased: "Auto Collector speed increased!"
        },
        missions: {
            title: "Missions",
            description: "Complete missions to earn valuable rewards!",
            daily: "Daily Missions",
            weekly: "Weekly Missions",
            resetTimer: "Resets at 00:00 UTC",
            weeklyResetTimer: "Resets Saturday at midnight UTC",
            completed: "Mission completed: {{title}}! Click \"Claim\" to receive the reward.",
            rewardClaimed: "Mission reward claimed!",
            newMissionsAvailable: "New missions available!",
            bonusCompleted: "Bonus mission completed! Claim your special reward!",
            weeklyRewardClaimed: "Weekly mission reward claimed!",
            collectSeeds: "Collect {{amount}} seeds",
            feedBirds: "Feed {{amount}} birds",
            scareBirds: "Shoo away {{amount}} birds",
            autoCollect: "Collect auto-harvest {{amount}} times",
            dailyBonus: "Complete all today's missions",
            newWeeklyMissionsAvailable: "New weekly missions available!",
            rewardLabel: "Reward: {{reward}} BirdCoins",
            claim: "Claim",
            resetTimerWithTime: "Resets in {{hours}}h {{minutes}}m",
            weeklyResetTimerWithTime: "Resets Saturday at midnight UTC (in {{days}}d {{hours}}h {{minutes}}m)",
            status: {
                completed: "Completed",
                rewarded: "Claimed",
                bonus: "Bonus"
            },
            weekly: {
                unlockSlots: {
                    title: "Unlock a new bird slot",
                    description: "Unlock any new bird slot"
                },
                feedEpicBirds: {
                    title: "Feed {{amount}} epic birds",
                    description: "Find and feed {{amount}} epic birds"
                },
                collectCurrency: {
                    title: "Collect {{amount}} BirdCoins",
                    description: "Collect a total of {{amount}} BirdCoins"
                },
                completeDailyMissions: {
                    title: "Complete 5 daily missions",
                    description: "Complete 5 daily missions within a week"
                }
            }
        },
        feeding: {
            feedingBonus: "Bonus -{{bonus}}% to feeding time.",
            rewardBonus: "Bonus +{{bonus}}% to rewards.",
            forcedFeedDiscount: "Forced -10% bench bonus activated!",
            forcedFeedDiscountActivated: "Forced -10% bench bonus activated!"
        },
        breeding: {
            title: "Bird Breeding",
            noBird: "No bird",
            getEgg: "Get egg",
            startBreeding: "Get an egg to start breeding!",
            feed: "Feed",
            play: "Play",
            clean: "Clean",
            expeditions: "🚀 Expeditions",
            chickName: "Hatchling",
            eggPurchased: "Egg purchased!",
            notEnoughCoins: "You don't have enough BirdCoins! Needed: {{amount}}",
            alreadyHaveEgg: "You already have an egg or a bird!",
            egg: "egg",
            bird: "bird",
            statusGood: "Your {{type}} is in good condition!",
            stats: {
                hunger: "Hunger:",
                happiness: "Happiness:",
                cleanliness: "Cleanliness:",
                experience: "Experience:",
                level: "Level: {{level}}"
            },

    initialization: "Initializing bird breeding system",
    backToBreeding: "Back to breeding screen",
    increaseHappiness: "Bird clicked - increasing happiness!",
    youngBird: "The bird is still too young to play!",
    startPlayScreen: "Starting play screen",
    birdImageSet: "Bird image set: {{path}}",
    birdCleaned: "You cleaned {{name}}!",
    needsHigherLevel: "You need a higher level bird to do this!",
    screenInitialized: "Breeding screen initialized successfully",

     birdStatus: {
        hungry: "{{name}} is hungry!",
        sad: "{{name}} is sad!",
        dirty: "{{name}} needs cleaning!",
        good: "{{name}} feels good!"
    },

 birdEvents: {
        eggHatched: "Your egg has hatched! You now have a chick!",
        chickGrown: "Your chick has grown up! You now have a young bird!",
        birdAdult: "Your bird has reached adulthood!",
        adultReward: "You receive 100 BirdCoins for raising an adult bird!"
    },

  ui: {
        feedButton: "Feed ({{cost}} seeds)",
        expeditionsButton: "🚀 Expeditions",
        lockedExpeditionsButton: "🔒 Expeditions",
        getEggButton: "Get egg (50 💰)"
    },

     feeding: {
        birdFed: "Bird fed! Used {{amount}} seeds.",
        notEnoughSeeds: "Not enough seeds! You need {{amount}} seeds.",
        birdFull: "Bird is already full!"
    },

      playing: {
        happinessIncreased: "You increased your bird's happiness to {{amount}}%!"
    },

    egg: {
        purchased: "You got a new egg! You named it {{name}}!",
        notEnoughCoins: "Not enough BirdCoins! You need {{amount}} coins."
    },

  birdNames: {
        prefixes: ["Fluffy", "Chirpy", "Sunny", "Warble", "Flash", "Jumper", "Flyer", "Golden", "Emerald", "Storm"],
        suffixes: ["Feather", "Beak", "Wing", "Singer", "Arrow", "Azure", "Bird", "Heart", "Gem", "Angel"]
    }
        



        },
        expeditions: {
            title: "Expeditions",
            description: "Send your bird on an expedition to earn valuable rewards!",
            petLevel: "Your bird is at level {{level}}.",
            loading: "Loading expeditions...",



 logs: {
        initialization: "Initializing expedition system",
        moduleInit: "Initializing expedition module",
        eventListeners: "Setting up expedition event listeners",
        buttonSetup: "Setting up expedition button: {{button}}",
        buttonClicked: "Expedition button clicked: {{id}}",
        uiUpdate: "Updating expedition UI",
        availabilityStatus: "Expedition availability status: {{status}}",
        startingExpedition: "Starting expedition: {{id}}",
        wardrobeButtonCheck: "Ensuring wardrobe button works",
        wardrobeButtonClicked: "Wardrobe button clicked",
        pendingExpedition: "Checking pending expedition...",
        foundPendingRewards: "Found pending rewards from expedition",
        foundSavedExpedition: "Found saved expedition:",
        expeditionInProgress: "Expedition in progress - continuing",
        noPendingExpedition: "No pending expedition",
        wardrobeResetExpeditionCompleted: "Resetting wardrobe state - expedition completed",
        wardrobeResetButtonsUnlocked: "Wardrobe state reset - buttons unlocked",
        expeditionEndTime: "Expedition has already ended - setting pending rewards flag"
    },
    ui: {
        backToMain: "← Back to Main",
        cancelExpedition: "Cancel Expedition",
        expeditionCompleted: "Expedition Completed!",
        collectRewards: "Collect Rewards",
        startButton: "Start",
        costLabel: "Cost:",
        freeLabel: "✓ FREE",
        rewardsLabel: "REWARDS",
        takeCare: "Take Care of Your Bird",
        birdReachedDistance: "Your bird traveled",
        distanceAdded: "Distance was added to the reward pass",
        meters: "meters",
        navBreedingButton: "Nest",
        navExpeditionsButton: "🚀 Expeditions",
        expeditionTimer: "00:00:00"
    },
    expeditionTypes: {
        short: {
            title: "Forest Exploration",
            description: "A short trip to the nearby forest. Perfect for obtaining basic resources.",
            duration: "2 hours"
        },
        medium: {
            title: "Cave Expedition",
            description: "Medium-length expedition into a mysterious cave. Higher risk, greater rewards!",
            duration: "6 hours"
        },
        long: {
            title: "Flight Over the Mist Realm",
            description: "A long and dangerous journey through the Mist Realm. The highest rewards for the bravest!",
            duration: "14 hours"
        }
    },
    rewardTypes: {
        seeds: "seeds",
        coins: "BirdCoins",
        ton: "TON",
        fruits: "fruits",
        distance: "distance in pass"
    },
    statusMessages: {
        hungryBird: "Your bird is too hungry! Feed it before going on an expedition.",
        sadBird: "Your bird is too sad! Play with it before going on an expedition.",
        dirtyBird: "Your bird is too dirty! Clean it before going on an expedition.",
        lowLevel: "Your bird must reach level 4 to go on an expedition.",
        birdParameters: "All bird parameters must be above 75% to go on an expedition."
    },
    notifications: {
        notEnoughFruits: "You don't have enough fruits! You need {{amount}} fruits to start this expedition.",
        fruitsSpent: "Spent {{amount}} fruits to start the expedition.",
        expeditionStarted: "Started expedition: {{title}}!",
        expeditionError: "An error occurred while starting the expedition. Please try again.",
        rewardsReceived: "Received rewards from the expedition:",
        confirmCancel: "Are you sure you want to cancel the expedition? You will lose all potential rewards and won't get a refund.",
        expeditionCancelled: "Expedition has been cancelled.",
        distanceTraveled: "Your bird traveled {{distance}}m! Check the reward pass.",
        expeditionInProgress: "Your bird is on an expedition! You cannot change skins during an active expedition.",
        expeditionCompleted: "Expedition completed! Collect rewards in the Nest tab."
    },
    stats: {
        hunger: "Hunger:",
        happiness: "Happiness:",
        cleanliness: "Cleanliness:"
    },
    errors: {
        expeditionNotFound: "Expedition with ID {{id}} not found",
        noExpeditionData: "No active expedition data!",
        timerError: "No active expedition data for timer!",
        errorSavingState: "Error saving pending rewards state: {{error}}",
        rewardPassModuleUnavailable: "Reward pass module is not available"
    }
},
activeExpedition: {
    cancel: "Cancel expedition",
    expeditionMessage: "Your bird is on an expedition! You cannot change skins during an active expedition.",
    skinUnavailable: "Unavailable"




        },
        wallet: {
            title: " ",
            balance: "Balance",
            withdraw: "Withdraw",
            howToEarn: "How to earn TON?",
            mythicalBirds: "Mythical Birds",
            mythicalBirdsDesc: "In each location you have a chance to encounter a mythical bird. After feeding it, you'll receive a TON reward. You only need fruits and patience",
            expeditions: "Expeditions",
            expeditionsDesc: "When your nest bird grows up, send it on an adventure-filled journey. It can bring back valuable TON and other rewards",
            currencyExchange: "Exchange Currency",
            amountPlaceholder: "Amount",
            convert: "Convert",
            ads: "Ads",
            watchAd: "Watch Ad",
            adsPlaceholder: "Feature in development. Soon you'll be able to earn rewards for watching ads!"
        },
        friends: {
            title: "Friends",
            comingSoon: "Friends window coming soon",



referralTitle: "Referral Rewards",
    invitedFriends: "invited friends",
    weeklyInvites: "this week",
    yourReferralLink: "Your referral link:",
    copyButton: "📋 Copy link",
    shareButton: "📤 Share",
    invitedUsers: "👥 Invited Users",
    userPrefix: "User #",
    specialRewards: "🏅 Special Rewards"
},
referral: {
    initialization: "Initializing referral system 2.0 (referral.js)",
    selfInviteAttempt: "Self-invitation attempt - ignoring",
    processing: "Processing invitation from: {{code}}",
    welcomeBonus: "You've been invited! +{{amount}} BirdCoins!",
    linkCopied: "Referral link copied to clipboard!",
    copyError: "Failed to copy the link",
    linkCopiedSimple: "Referral link copied!",
    shareError: "Link sharing error: {{error}}",
    newUserJoined: "New user joined! +{{amount}} BirdCoins!",
    comboMultiplier: "Combo x{{combo}}! 🔥",
    weeklyReward: "🏆 Weekly reward! {{description}}",
    copied: "Copied!",
    greatButton: "Great!",
    claimButton: "Claim!",
    tierRewards: "🎯 Invitation Rewards",
    weeklyRewards: "🏆 Weekly Rewards",
    remaining: "Remaining: {{remaining}}",
    shareMessage: "🦆 Play BirdCoins with me! Feed birds and collect rewards! 💰\n\n🎁 You'll get 20 BirdCoins to start!",
    tiers: {
        tier1: "First invitation! 🎉",
        tier3: "3 invitations! Great! 🔥",
        tier5: "5 invitations! 🦜",
        tier10: "10 invitations! TON Bonus! 💎",
        tier20: "20 invitations! ✨",
        tier50: "50 invitations! 💎",
        tier100: "100 invitations! New recruiter skin! 🌟"
    },
    weekly: {
        tier5: "5 invitations in a week!",
        tier10: "10 invitations in a week! Amazing!",
        tier20: "20 invitations in a week! You're a master!"
    },

       tierLevel: "Level {{level}} Achieved!",
    rewards: "Rewards",
    invitation: "invitation",
    invitations: "invitations",
    skinrecruiter: "Recruiter Skin"

            
        },
        dailyRewards: {
            title: "Daily Rewards",
            description: "Collect daily rewards and maintain a 7-day streak!",
            nextReward: "Next reward in: {{time}}",

logs: {
        constructor: "Daily rewards system: constructor",
        initialization: "Initializing daily rewards system...",
        initialized: "Daily rewards system initialized:",
        initError: "Error initializing rewards system:",
        stateSaved: "Rewards state saved:",
        loadError: "Error loading rewards state:",
        saveError: "Error saving rewards state:",
        daysSinceLastClaim: "Days since last claim:",
        startingNewWeek: "Starting a new week! Previous:",
        streakReset: "Resetting daily progress, but keeping week"
    },
    notifications: {
        cantClaimNow: "You can't claim a reward now. Come back tomorrow!",
        allRewardsClaimed: "All rewards have already been claimed!",
        rewardNotFound: "Error: No reward found for this day!",
        weeklyBonus: "Congratulations! You've completed week {{week}}! Rewards in the new week will be better!",
        rewardsReset: "Daily rewards have been reset!",
        alreadyClaimed: "This reward has already been claimed!",
        claimInOrder: "Claim rewards in order!",
        availableReward: "You have a reward to claim in the calendar!"
    },
    rewardTypes: {
        seeds: {
            one: "seed",
            few: "seeds",
            many: "seeds"
        },
        coins: {
            one: "BirdCoin",
            few: "BirdCoins",
            many: "BirdCoins"
        },
        fruits: {
            one: "fruit",
            fraction: "fruit",
            few: "fruits",
            many: "fruits"
        },
        ton: "TON"
    },
    ui: {
        weekIndicator: "Week {{week}}",
        streakActive: "Streak active! Keep it up!",
        streakBroken: "Streak broken! Start over while keeping week progress.",
        dayNumber: "Day {{day}}",
        claimButton: "Claim reward",
        comeBackTomorrow: "Come back tomorrow for more!",
        timerNextReward: "Next reward in: {{hours}}h {{minutes}}m {{seconds}}s"
    }


        },
        rewardPass: {
            title: "Expedition Rewards",
            remaining: "Remaining: {{time}}",
            premiumTitle: "Premium Pass - Unlock Special Rewards!",
            premiumDesc: "Upgrade to Premium and get access to exclusive rewards plus an instant +500m bonus!",
            benefits: {
                double: "Double rewards",
                betterTon: "Better TON rewards",
                instantBonus: "+500m instantly"
            },
            buyPremium: "Buy Premium Pass (2 TON)",





logs: {
        initialization: "Initializing reward pass system",
        moduleInit: "Initializing reward pass module",
        foundSaved: "Found saved reward pass: {{data}}",
        restoreFromSave: "Restored reward pass from saved game: {{data}}",
        updatedFromSave: "Updated reward pass from saved game: {{data}}",
        creatingNew: "Creating new reward pass object",
        updatingEndDate: "Updating reward pass end date",
        saveState: "Saved reward pass state: {{data}}",
        saveFailed: "Failed to save additional claimedRewards copy: {{error}}",
        uiUpdate: "Updating reward pass UI"
    },
    ui: {
        rewards: "Rewards",
        unlockCost: "Unlock for {{amount}} BirdCoins",
        timerFormat: "Remaining: {{days}}d {{hours}}h {{minutes}}m",
        currentDistance: "Current distance: {{distance}}m",
        claim: "Claim!",
        premiumActive: "Premium Pass Active",
        premiumActiveBadge: "✨ PREMIUM ACTIVE ✨"
    },
    notifications: {
        notEnoughTon: "You don't have enough TON! You need 2 TON to buy Premium Pass.",
        premiumActivated: "Congratulations! Premium Pass activated and +500m bonus added!",
        newSeason: "A new reward pass season has begun! Your distance has been preserved, but you can earn new rewards.",
        distanceUpdate: "Updating reward pass distance: {{distance}}",
        distanceSaved: "Saved new distance: {{distance}}",
        distanceSaveError: "Error saving distance: {{error}}",
        recoveringDistance: "Recovering saved distance: {{distance}}",
        rewardsRecovered: "Recovered claimed rewards status: {{data}}",
        recoveryError: "Error recovering reward pass state: {{error}}",
        insufficientDistance: "You need to travel further to claim this reward!",
        needPremium: "You need to buy Premium Pass to claim this reward!",
        alreadyClaimed: "This reward has already been claimed!",
        skinUnlocked: "Unlocked skin: Forest Scout!",
        rewardClaimed: "Claimed reward: {{reward}}!"
    },
    rewardTypes: {
        seeds: "seeds",
        coins: "BirdCoins",
        fruit: "fruit",
        fruits: "fruits",
        ton: "TON",
        skin: "Skin"
    },
    birdDistance: {
        title: "Your bird traveled a distance of:",
        checkRewardPass: "Check reward pass"
    }






        },
        wardrobe: {
            title: "Bird Wardrobe",
            description: "Here you can change your bird's appearance!",
            availableSkins: "Available skins:",
            skins: {
                defaultName: "Default",
                defaultDesc: "Standard bird appearance",
                defaultBonus: "Bonus: none",
                selected: "Selected",
                locked: "Locked",
                forestScoutName: "Forest Scout",
                forestScoutDesc: "An experienced scout familiar with all forest nooks",
                forestScoutBonus: "Bonus: +10% seeds from expeditions",
                forestScoutRequirement: "Required: 1100m in expedition",
                masterRecruiterName: "Master Recruiter",
                masterRecruiterDesc: "Master of recruitment - symbol of prestige and influence",
                masterRecruiterRequirement: "Required: 100 invitations"
            },






buttons: {
        select: "Select",
        selected: "Selected",
        locked: "Locked",
        unavailable: "Unavailable"
    },
    notifications: {
        expeditionActive: "Your bird is on an expedition! You cannot change skins during an active expedition.",
        masterSkinRequirement: "You need to invite 100 friends to unlock the Master Recruiter skin!",
        forestSkinRequirement: "Reach 1100m in expedition to unlock the Forest Scout skin!",
        adultBirdRequired: "Only an adult bird can change its appearance!",
        defaultSkinSelected: "Default bird appearance selected!",
        forestSkinSelected: "Forest Scout skin selected! You gain +10% seeds from expeditions!",
        masterSkinSelected: "Master Recruiter skin selected! Proudly wear the symbol of recruitment mastery!"
    },
    bonusInfo: "Active bonus: +10% seeds from expeditions"










        },
        mainScreen: {
            level: "Level {{level}}",
            xp: "{{current}}/{{next}} XP"
        },
        sortingGame: {
            time: "Time: {{time}}",
            title: "Sort the seeds",
            collected: "Collected: {{count}} / 30 seeds",
            summary: "Summary",
            cleaned: "Cleaned: {{count}} seeds",
            cleanlinessGained: "Received: +{{percent}}% cleanliness",
            finish: "Finish",




initialization: "Initializing seed sorting mini-game",
starting: "Starting sorting mini-game",
telegramCheck: "Are we in Telegram WebApp: {{status}}",
seedsInitialization: "Initializing seeds for sorting",
correctMatch: "Good! Seed in the bowl.",
wrongMatch: "Wrong! Not the right bowl.",
wrongBowl: "Not the right bowl!",
seedSelected: "Selected seed type: {{type}}",
clickBowl: "Click on a bowl to place the seed in it!",
selectSeedFirst: "Select a seed first!",
gameEnd: "Game over!"





        },
       
        

  activeExpedition: {
        cancel: "Cancel expedition",
        expeditionMessage: "Your bird is on an expedition! You cannot change skins during an active expedition.",
        skinUnavailable: "Unavailable"
    },





        notifications: {
            minCoinsAmount: "Minimum amount is 100 BirdCoins!",
            notEnoughCoins: "You don't have enough BirdCoins!",
            enterFruitsAmount: "Enter the number of fruits to exchange!",
            notEnoughFruits: "You don't have enough fruits!",
            convertedCoinsToFruits: "Exchanged {{amount}} BirdCoins for {{fruits}} fruits!",
            convertedFruitsToCoins: "Exchanged {{amount}} fruits for {{coins}} BirdCoins!",
            gameReset: "Game has been reset!",
            confirmReset: "Are you sure you want to reset the game?",
            locationUnlockSuccess: "Location {{location}} unlocked!",
            expeditionInProgress: "Expedition in progress! You can return to it from the Nest screen.",
            addingSeedManually: "Adding seed manually",
            seedAdded: "+1 seeds",
            noSeedsToCollect: "No seeds to collect!",
            levelUp: "Level {{level}} reached! +{{amount}} BirdCoins!",
            birdReadyToCollect: "Bird ready to collect reward!",
            receivedTon: "You received {{amount}} TON for the mythical bird!",
            mythicalBirdFeedingBonus: "You're feeding a mythical bird! Bonus -{{bonus}}% to feeding time.",
            birdsFeeded: "Fed {{count}} birds in {{location}}! Used {{seeds}} seeds.",
            rewardsCollected: "Collected rewards from {{count}} birds: +{{coins}} BirdCoins!",
            noBirdsToFeed: "No birds to feed in {{location}}!",
            allBirdsFeeding: "In {{location}} all birds are either being fed or there are no birds. Unlock more slots or wait.",
            notEnoughSeedsForAllBirds: "You don't have enough seeds! You need {{amount}} seeds.",
            noRewardsToCollect: "No rewards to collect!",
            enterValidValue: "Enter a valid value!",
            notEnoughFruitsForMythical: "Not enough fruits! You need {{amount}} fruits to feed a mythical bird.",
            receivedCoinsWithBonus: "You received {{baseAmount}} + {{bonusAmount}} BirdCoins (fountain bonus)!",
            receivedCoins: "You received {{amount}} BirdCoins!",
            adsFeatureSoon: "Ad watching feature will be available soon!",
            withdrawFeatureSoon: "Withdrawal feature will be available soon!",
            eggPurchaseError: "Error: cannot buy egg",
            eggPurchaseFunctionUnavailable: "Egg purchase function unavailable!",
            functionUnavailable: "Function {{functionName}} unavailable!",
            receivedFruitsForCoins: "You received {{fruits}} fruits for {{coins}} BirdCoins"
        },
        telegram: {
            // Initialization logs
            initialization: "Initializing telegram.js",
            webAppAvailable: "Telegram WebApp available, initializing",
            webAppUnavailable: "Telegram WebApp unavailable, browser mode active",
            viewportChanged: "Telegram viewport changed, refreshing UI",
            initSuccess: "Telegram WebApp initialized successfully",
            initError: "Error initializing Telegram WebApp:",
            
            // Buttons and actions
            backButtonPressed: "Back button pressed, saving game state",
            statsSent: "Statistics sent to Telegram:",
            statsError: "Error sending data to Telegram:",
            sharingUnavailable: "Sharing is only available in the Telegram app",
            achievementShare: "I earned the \"{{achievementTitle}}\" achievement in BirdCoins game! Play with me!",
            sharingFunctionUnavailable: "Sharing function is not available",
            sharingError: "Error sharing achievement:",
            
            // Other
            imagePreparation: "Preparing image for sharing - function in development",
            colorsAdjusted: "Colors adjusted to Telegram theme",
            colorError: "Error adjusting colors:",
            gameClosing: "Closing game, saving state"
        },


sound: {
    logs: {
        initialization: "Initializing sound system",
        moduleInit: "Initializing sound module",
        firstInteraction: "First interaction, starting background music...",
        listenersSetup: "Prepared listeners for first interaction for background music",
        soundLoaded: "Loaded sound: {{name}}",
        soundLoadError: "Error loading sound {{name}}: {{error}}",
        settingsLoaded: "Loaded sound settings: enabled={{enabled}}, volume={{volume}}, music={{music}}, effects={{effects}}",
        settingsLoadError: "Error loading sound settings: {{error}}",
        settingsSaved: "Saved sound settings: enabled={{enabled}}, volume={{volume}}, music={{music}}, effects={{effects}}",
        settingsSaveError: "Error saving sound settings: {{error}}",
        toggleButtonDisabled: "Sound button disabled - use settings in panel",
        layoutFixed: "Fixed settings window layout",
        initSoundSettings: "Initializing sound controls in settings window",
        soundControlsInitialized: "Sound controls initialized",
        initLanguageOptions: "Initializing language selection controls",
        languageControlsInitialized: "Language controls initialized",
        mainScreenActive: "Main screen is active, attempting to play music..."
    },
    notifications: {
        soundsEnabled: "Sounds enabled",
        soundsDisabled: "Sounds disabled",
        backgroundMusicEnabled: "Background music enabled",
        backgroundMusicDisabled: "Background music disabled",
        soundEffectsEnabled: "Sound effects enabled",
        soundEffectsDisabled: "Sound effects disabled",
        volume: "Volume: {{volume}}%",
        languageChanged: "Language: {{language}}"
    },
    errors: {
        soundNotFound: "Sound \"{{name}}\" does not exist!",
        soundPlayWarning: "Cannot play sound {{name}}: {{error}}",
        soundPlayError: "Error playing sound {{name}}: {{error}}",
        soundStopError: "Error stopping sound: {{error}}"
    },
    language: {
        polish: "Polski",
        english: "English"
    }
},
    locationActions: {
    logs: {
        feedingAllBirds: "Feeding all birds in location {{locationId}} (new version)",
        slotsNotFound: "Slots not found for location {{locationId}}",
        feedingCalculation: "Original cost before bonuses: {{cost}} for bird type {{birdType}}",
        bonusApplied: "Cost after applying bonuses: from {{oldCost}} to {{newCost}} (location: {{locationId}})",
        bonusFunctionUnavailable: "Bonus function unavailable!",
        costAdded: "Added cost {{cost}}, total required cost: {{totalCost}}",
        mythicalFeedingTimeBonus: "Mythical bird feeding time after applying bonuses: {{feedTime}} (location: {{locationId}})",
        birdFeedingTimeBonus: "Feeding time after applying bonuses: {{feedTime}} (location: {{locationId}})"
    },
    notifications: {
        locationLocked: "This location is locked!",
        notEnoughSeeds: "Not enough seeds! You need {{amount}} seeds.",
        notEnoughFruits: "Not enough fruits! You need {{amount}} fruits.",
        notEnoughResources: "Not enough resources! You need {{amount}} seeds and {{fruitAmount}} fruits.",
        feedingTimeBonus: " (-{{bonus}}% feeding time)",
        fedBirdsAndMythical: "Fed {{birds}} birds ({{seeds}} seeds) and {{mythical}} mythical birds ({{fruits}} fruits) in location {{location}}!{{bonus}}",
        fedBirds: "Fed {{birds}} birds in location {{location}}! Used {{seeds}} seeds.{{bonus}}",
        fedMythical: "Fed {{mythical}} mythical birds in location {{location}}! Used {{fruits}} fruits.{{bonus}}",
        noBirdsToFeed: "No birds to feed in location {{location}}!",
        rewardsWithTon: "Collected rewards from {{birds}} birds in location {{location}}: +{{coins}} BirdCoins and +{{ton}} TON!"
    },
    buttons: {
        feedAll: "Feed All",
        collectAll: "Collect All"
    },
    collectingAllRewards: "Collecting all rewards in location {{locationId}} (new version)",
    locationStatusCheck: "Checking status of location {{locationId}}",
    updatingAllButtons: "Updating all action buttons for all locations",
    buttonsNotFound: "No action buttons found for location {{locationId}}",
    actionButtonClicked: "Action button clicked (new version)",
    noLocationAttribute: "No data-location attribute on button",
    actionInitialization: "Initializing location actions system",
    birdSlotsUiUpdate: "Updating bird slots UI for current location"
    }
},


};

// Aktualny język - naprawiony odczyt przy inicjalizacji
let currentLanguage = localStorage.getItem('gameLanguage') || 'pl';

// Funkcja do pobierania tłumaczenia z opcją podstawiania wartości
function t(path, values = {}) {
    // Upewnij się, że ustawiony jest domyślny język w przypadku braku tłumaczeń
    if (!translations[currentLanguage]) {
        console.error("Błąd: Brak tłumaczeń dla języka", currentLanguage);
        // Fallback do polskiego, jeśli brak tłumaczeń dla aktualnego języka
        if (translations.pl) {
            return getTranslation('pl', path, values);
        }
        return path; // Zwróć ścieżkę, jeśli nie ma tłumaczeń
    }
    
    return getTranslation(currentLanguage, path, values);
    
    // Funkcja pomocnicza do pobierania tłumaczenia
    function getTranslation(lang, path, values) {
        const keys = path.split('.');
        let value = translations[lang];
        
        for (const key of keys) {
            if (!value || typeof value !== 'object' || !value[key]) {
                console.warn("Ostrzeżenie: Nie znaleziono tłumaczenia dla klucza", path, "w języku", lang);
                return path; // Zwróć ścieżkę, jeśli nie znajdzie tłumaczenia
            }
            value = value[key];
        }
        
        // Podstaw wartości jeśli są
        if (typeof value === 'string' && values) {
            Object.keys(values).forEach(key => {
                value = value.replace(`{{${key}}}`, values[key]);
            });
        }
        
        return value;
    }
}

// Funkcja do zmiany języka
function changeLanguage(lang) {
    console.log("Zmiana języka z " + currentLanguage + " na " + lang);
    
    // Zapisz poprzedni język na wypadek błędu
    const previousLanguage = currentLanguage;
    
    try {
        // Sprawdź czy tłumaczenia dla tego języka istnieją
        if (!translations[lang]) {
            console.error("BŁĄD: Brak tłumaczeń dla języka: " + lang);
            return false;
        }
        
        // Ustaw nowy język
        currentLanguage = lang;
        
        // WAŻNE: Zapisz język w localStorage
        localStorage.setItem('gameLanguage', lang);
        
        // NOWOŚĆ: Zapisz język w gameState dla trwałości
        if (window.gameState) {
            if (!window.gameState.settings) {
                window.gameState.settings = {};
            }
            window.gameState.settings.language = lang;
            
            // Zapisz stan gry
            if (typeof window.saveGame === 'function') {
                window.saveGame();
            }
        }
        
        // Aktualizuj teksty
        updateAllTexts();
        
        // Zaktualizuj wygląd flag
        updateLanguageFlags();
        
        console.log("Język został zmieniony pomyślnie na: " + lang);
        
        // Pokaż powiadomienie
        if (typeof showNotification === 'function') {
            const langNames = {
                'pl': 'Polski',
                'en': 'English'
            };
            showNotification("Język: " + (langNames[lang] || lang));
        }
        
        return true;
    } catch (error) {
        console.error("Wystąpił błąd podczas zmiany języka: " + error.message);
        console.error(error.stack);
        
        // Przywróć poprzedni język w przypadku błędu
        currentLanguage = previousLanguage;
        
        return false;
    }
}

// Funkcja aktualizująca wygląd flag języka
function updateLanguageFlags() {
    const flagContainers = document.querySelectorAll('.language-option');
    
    flagContainers.forEach(container => {
        const span = container.querySelector('span');
        if (!span) return;
        
        const flagLang = span.textContent.toLowerCase();
        
        // Obsługujemy tylko polską i angielską flagę
        if (flagLang === 'pl' || flagLang === 'en') {
            const isActive = (flagLang === 'pl' && currentLanguage === 'pl') || 
                             (flagLang === 'en' && currentLanguage === 'en');
            
            if (isActive) {
                container.querySelector('.flag-container').style.border = '2px solid #ff9800';
                span.style.color = '#ff9800';
            } else {
                container.querySelector('.flag-container').style.border = 'none';
                span.style.color = '#757575';
            }
        }
    });
}

// Funkcja aktualizująca wszystkie teksty
function updateAllTexts() {
    console.log("Rozpoczynam aktualizację wszystkich tekstów - język: " + currentLanguage);
    
    try {
        // Sprawdź, czy tłumaczenia dla wybranego języka istnieją
        if (!translations[currentLanguage]) {
            console.error("BŁĄD: Brak tłumaczeń dla języka: " + currentLanguage);
            return; // Przerwij, jeśli brak tłumaczeń
        }
        
        // Aktualizuj elementy HTML z atrybutem data-i18n
        console.log("Szukam elementów z atrybutem data-i18n...");
        const elementsWithI18n = document.querySelectorAll('[data-i18n]');
        console.log("Znaleziono elementów: " + elementsWithI18n.length);
        
        // Wymuszenie odświeżenia DOM
        setTimeout(() => {
            elementsWithI18n.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const valuesStr = element.getAttribute('data-i18n-values');
                let values = {};
                
                if (valuesStr) {
                    try {
                        values = JSON.parse(valuesStr);
                    } catch (e) {
                        console.warn("Ostrzeżenie: Nieprawidłowy format data-i18n-values dla klucza " + key);
                    }
                }
                
                const translatedText = t(key, values);
                element.textContent = translatedText;
            });
            
            // Aktualizuj placeholdery
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                element.placeholder = t(key);
            });
            
            // Aktualizuj atrybuty alt dla obrazków
            document.querySelectorAll('[data-i18n-alt]').forEach(element => {
                const key = element.getAttribute('data-i18n-alt');
                element.alt = t(key);
            });
            
            // Aktualizuj tytuł strony
            if (document.title) {
                document.title = t('menu.mainTitle');
            }
            
            console.log("Aktualizacja tekstów zakończona pomyślnie!");
            
            // Wywołaj specyficzne funkcje aktualizujące dla poszczególnych modułów
            if (typeof updateUITexts === 'function') {
                console.log("Wywołuję updateUITexts()");
                updateUITexts();
            }
            
            if (typeof updateGameTexts === 'function') {
                console.log("Wywołuję updateGameTexts()");
                updateGameTexts();
            }
            
            if (typeof updateMissionTexts === 'function') {
                console.log("Wywołuję updateMissionTexts()");
                updateMissionTexts();
            }
            
            // Ręczna aktualizacja niektórych tekstów używanych w grze
            updateCommonGameTexts();
        }, 100);
    } catch (error) {
        console.error("Wystąpił błąd podczas aktualizacji tekstów: " + error.message);
        console.error(error.stack);
    }
}

// Funkcja pomocnicza do aktualizacji często używanych tekstów w grze
function updateCommonGameTexts() {
    // Aktualizuj tekst poziomu na ekranie głównym
    const levelBadge = document.querySelector('.main-level-badge');
    if (levelBadge) {
        const level = window.gameState?.player?.level || 1;
        levelBadge.textContent = t('mainScreen.level', {level: level});
    }
    
    // Aktualizuj przyciski nawigacji
    document.querySelectorAll('.nav-button').forEach(button => {
        const screenType = button.getAttribute('data-screen');
        if (screenType && translations[currentLanguage].navigation[screenType.replace('-screen', '')]) {
            button.textContent = t(`navigation.${screenType.replace('-screen', '')}`);
        }
    });
    
    // Aktualizuj przyciski w slotach ptaków
    document.querySelectorAll('.feed-button').forEach(button => {
        button.textContent = t('birdSlots.feedBird');
    });
    
    document.querySelectorAll('.scare-button').forEach(button => {
        button.textContent = t('birdSlots.scareBird');
    });
    
    document.querySelectorAll('.collect-reward-button').forEach(button => {
        button.textContent = t('birdSlots.collectReward');
    });
    
    document.querySelectorAll('.unlock-button').forEach(button => {
        button.textContent = t('birdSlots.unlock');
    });
    
    // Odśwież okna modalne
    const settingsTitle = document.querySelector('#settings-modal h2');
    if (settingsTitle) {
        settingsTitle.textContent = t('settings.title');
    }
    
    // Aktualizuj etykiety ustawień dźwięku
    document.querySelectorAll('.sound-setting-label').forEach(label => {
        const key = label.getAttribute('data-i18n');
        if (key) {
            label.textContent = t(key);
        }
    });
}

// Inicjalizacja języka przy ładowaniu strony - NOWA FUNKCJA
function initializeLanguage() {
    // Najpierw sprawdź, czy istnieje ustawienie w gameState
    if (window.gameState && window.gameState.settings && window.gameState.settings.language) {
        currentLanguage = window.gameState.settings.language;
        // Synchronizuj z localStorage
        localStorage.setItem('gameLanguage', currentLanguage);
    } else {
        // Jeśli nie ma w gameState, pobierz z localStorage
        currentLanguage = localStorage.getItem('gameLanguage') || 'pl';
        
        // Zapisz do gameState, jeśli istnieje
        if (window.gameState) {
            if (!window.gameState.settings) {
                window.gameState.settings = {};
            }
            window.gameState.settings.language = currentLanguage;
        }
    }
    
    console.log("Inicjalizacja języka: " + currentLanguage);
    
    // Aktualizuj interfejs
    updateAllTexts();
    updateLanguageFlags();
}

// Nasłuchiwanie na zdarzenie 'gameLoaded', aby zainicjalizować język
document.addEventListener('gameLoaded', function() {
    console.log("Zdarzenie gameLoaded - inicjalizacja języka...");
    initializeLanguage();
});

// Hook do obsługi zapisu gry, aby zawsze zapisać język
const originalSaveGame = window.saveGame;
if (typeof originalSaveGame === 'function') {
    window.saveGame = function() {
        // Ustaw język w gameState przed zapisem
        if (window.gameState) {
            if (!window.gameState.settings) {
                window.gameState.settings = {};
            }
            window.gameState.settings.language = currentLanguage;
        }
        
        // Wywołaj oryginalną funkcję zapisu
        return originalSaveGame.apply(this, arguments);
    };
}

// Również inicjalizuj język bezpośrednio przy ładowaniu skryptu
setTimeout(initializeLanguage, 500);

// Eksportuj funkcje do globalnego zakresu
window.t = t;
window.changeLanguage = changeLanguage;
window.updateAllTexts = updateAllTexts;
window.initializeLanguage = initializeLanguage;