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
            comingSoon: "Tu wkrótce pojawi się okno Przyjaciół"
        },
        dailyRewards: {
            title: "Nagrody Dzienne",
            description: "Odbieraj codzienne nagrody i utrzymuj serię przez 7 dni!",
            nextReward: "Następna nagroda za: {{time}}"
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
            notEnoughCoins: "You don't have enough BeakCoins (needed: {{amount}})"
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
            coins: "BeakCoins",
            fruits: "Fruits",
            ton: "TON",
            seedsIcon: "Seeds",
            coinsIcon: "BeakCoins",
            fruitsIcon: "Fruits",
            tonIcon: "TON"
        },
        birdSlots: {
            feedBird: "Feed",
            scareBird: "Scare Away",
            collectReward: "Collect",
            unlock: "Unlock",
            lockInfo: "Unlock for {{amount}} BeakCoins",
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
            unlockFor: "Unlock for {{amount}} BeakCoins",
            unlockInfo: "Unlock this location for {{amount}} BeakCoins in the Map menu!",
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
                fountainDesc: "A beautiful fountain attracting BeakCoins",
                fountainBonus: "Bonus: +10% more BeakCoins",
                balloonName: "Tour Balloon",
                balloonDesc: "A colorful balloon that makes birds eat faster to return to play",
                balloonBonus: "Bonus: -10% feeding time",
                boatName: "Boat",
                boatDesc: "A small boat that allows you to get closer to the birds, making feeding cheaper",
                boatBonus: "Bonus: -12% feeding cost",
                kiteName: "Kite",
                kiteDesc: "A colorful kite that helps attract birds and increases their generosity",
                kiteBonus: "Bonus: +12% more BeakCoins",
                paragliderName: "Paraglider",
                paragliderDesc: "A spectacular paraglider that helps birds focus on eating",
                paragliderBonus: "Bonus: -12% feeding time"
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
            upgradeButton: "Upgrade ({{amount}} BeakCoins)",
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
            scareBirds: "Scare away {{amount}} birds",
            autoCollect: "Collect auto-harvest {{amount}} times",
            dailyBonus: "Complete all today's missions",
            newWeeklyMissionsAvailable: "New weekly missions available!",
            rewardLabel: "Reward: {{reward}} BeakCoins",
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
                    title: "Collect {{amount}} BeakCoins",
                    description: "Collect a total of {{amount}} BeakCoins"
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
            notEnoughCoins: "You don't have enough BeakCoins! Needed: {{amount}}",
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
        adultReward: "You receive 100 BeakCoins for raising an adult bird!"
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
        notEnoughCoins: "Not enough BeakCoins! You need {{amount}} coins."
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
        coins: "BeakCoins",
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
            comingSoon: "Friends window coming soon"
        },
        dailyRewards: {
            title: "Daily Rewards",
            description: "Collect daily rewards and maintain a 7-day streak!",
            nextReward: "Next reward in: {{time}}"
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
        unlockCost: "Unlock for {{amount}} BeakCoins",
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
        coins: "BeakCoins",
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
            cancel: "Cancel expedition"
        },
        notifications: {
            minCoinsAmount: "Minimum amount is 100 BeakCoins!",
            notEnoughCoins: "You don't have enough BeakCoins!",
            enterFruitsAmount: "Enter the number of fruits to exchange!",
            notEnoughFruits: "You don't have enough fruits!",
            convertedCoinsToFruits: "Exchanged {{amount}} BeakCoins for {{fruits}} fruits!",
            convertedFruitsToCoins: "Exchanged {{amount}} fruits for {{coins}} BeakCoins!",
            gameReset: "Game has been reset!",
            confirmReset: "Are you sure you want to reset the game?",
            locationUnlockSuccess: "Location {{location}} unlocked!",
            expeditionInProgress: "Expedition in progress! You can return to it from the Nest screen.",
            addingSeedManually: "Adding seed manually",
            seedAdded: "+1 seeds",
            noSeedsToCollect: "No seeds to collect!",
            levelUp: "Level {{level}} reached! +{{amount}} BeakCoins!",
            birdReadyToCollect: "Bird ready to collect reward!",
            receivedTon: "You received {{amount}} TON for the mythical bird!",
            mythicalBirdFeedingBonus: "You're feeding a mythical bird! Bonus -{{bonus}}% to feeding time.",
            birdsFeeded: "Fed {{count}} birds in {{location}}! Used {{seeds}} seeds.",
            rewardsCollected: "Collected rewards from {{count}} birds: +{{coins}} BeakCoins!",
            noBirdsToFeed: "No birds to feed in {{location}}!",
            allBirdsFeeding: "In {{location}} all birds are either being fed or there are no birds. Unlock more slots or wait.",
            notEnoughSeedsForAllBirds: "You don't have enough seeds! You need {{amount}} seeds.",
            noRewardsToCollect: "No rewards to collect!",
            enterValidValue: "Enter a valid value!",
            notEnoughFruitsForMythical: "Not enough fruits! You need {{amount}} fruits to feed a mythical bird.",
            receivedCoinsWithBonus: "You received {{baseAmount}} + {{bonusAmount}} BeakCoins (fountain bonus)!",
            receivedCoins: "You received {{amount}} BeakCoins!",
            adsFeatureSoon: "Ad watching feature will be available soon!",
            withdrawFeatureSoon: "Withdrawal feature will be available soon!",
            eggPurchaseError: "Error: cannot buy egg",
            eggPurchaseFunctionUnavailable: "Egg purchase function unavailable!",
            functionUnavailable: "Function {{functionName}} unavailable!",
            receivedFruitsForCoins: "You received {{fruits}} fruits for {{coins}} BeakCoins"
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
            achievementShare: "I earned the \"{{achievementTitle}}\" achievement in BeakCoins game! Play with me!",
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

}
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