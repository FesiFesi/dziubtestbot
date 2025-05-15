// translations.js
const translations = {
    pl: {
        // Polski - język domyślny
        general: {
            loading: "Ładowanie...",
            save: "Zapisz",
            cancel: "Anuluj",
            back: "← Powrót"
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
            ton: "TON"
        },
        birdSlots: {
            feedBird: "Nakarm",
            scareBird: "Przepędź",
            collectReward: "Odbierz",
            unlock: "Odblokuj",
            lockInfo: "Odblokuj za {{amount}} DziubCoinów"
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
            upgradeButton: "Ulepsz ({{amount}} DziubCoinów)"
        },
        missions: {
            title: "Misje",
            description: "Wykonuj misje, aby zdobywać cenne nagrody!",
            daily: "Misje dzienne",
            weekly: "Misje tygodniowe",
            resetTimer: "Resetuje się o 00:00 UTC",
            weeklyResetTimer: "Resetuje się w sobotę o północy UTC"
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
            stats: {
                hunger: "Głód:",
                happiness: "Szczęście:",
                cleanliness: "Czystość:",
                experience: "Doświadczenie:",
                level: "Poziom: {{level}}"
            }
        },
        expeditions: {
            title: "Ekspedycje",
            description: "Wyślij swojego ptaka na ekspedycję, aby zdobyć cenne nagrody!",
            petLevel: "Twój ptak jest na poziomie {{level}}.",
            loading: "Ładowanie ekspedycji..."
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
            buyPremium: "Kup Premium Pass (2 TON)"
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
            }
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
            finish: "Koniec"
        },
        activeExpedition: {
            cancel: "Anuluj ekspedycję"
        }
    },
    en: {
        // Angielski
        general: {
            loading: "Loading...",
            save: "Save",
            cancel: "Cancel",
            back: "← Back"
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
            ton: "TON"
        },
        birdSlots: {
            feedBird: "Feed",
            scareBird: "Scare Away",
            collectReward: "Collect",
            unlock: "Unlock",
            lockInfo: "Unlock for {{amount}} BeakCoins"
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
            upgradeButton: "Upgrade ({{amount}} BeakCoins)"
        },
        missions: {
            title: "Missions",
            description: "Complete missions to earn valuable rewards!",
            daily: "Daily Missions",
            weekly: "Weekly Missions",
            resetTimer: "Resets at 00:00 UTC",
            weeklyResetTimer: "Resets Saturday at midnight UTC"
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
            stats: {
                hunger: "Hunger:",
                happiness: "Happiness:",
                cleanliness: "Cleanliness:",
                experience: "Experience:",
                level: "Level: {{level}}"
            }
        },
        expeditions: {
            title: "Expeditions",
            description: "Send your bird on an expedition to earn valuable rewards!",
            petLevel: "Your bird is at level {{level}}.",
            loading: "Loading expeditions..."
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
            buyPremium: "Buy Premium Pass (2 TON)"
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
            }
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
            finish: "Finish"
        },
        activeExpedition: {
            cancel: "Cancel expedition"
        }
    }
};

// Aktualny język
let currentLanguage = localStorage.getItem('gameLanguage') || 'pl';

// Funkcja do pobierania tłumaczenia z opcją podstawiania wartości
function t(path, values = {}) {
    const keys = path.split('.');
    let value = translations[currentLanguage];
    
    for (const key of keys) {
        value = value[key];
        if (!value) return path; // Zwróć ścieżkę jeśli nie znajdzie tłumaczenia
    }
    
    // Podstaw wartości jeśli są
    if (typeof value === 'string' && values) {
        Object.keys(values).forEach(key => {
            value = value.replace(`{{${key}}}`, values[key]);
        });
    }
    
    return value;
}

// Funkcja do zmiany języka
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('gameLanguage', lang);
    updateAllTexts(); // Aktualizuj wszystkie teksty na stronie
}

// Funkcja aktualizująca wszystkie teksty
function updateAllTexts() {
    // Aktualizuj elementy HTML z atrybutem data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const values = element.getAttribute('data-i18n-values');
        element.textContent = t(key, values ? JSON.parse(values) : {});
    });
    
    // Aktualizuj placeholdery
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Aktualizuj tytuł strony
    if (document.title) {
        document.title = t('menu.mainTitle');
    }
    
    // Wywołaj funkcje aktualizujące w innych modułach
    if (typeof updateUITexts === 'function') updateUITexts();
    if (typeof updateGameTexts === 'function') updateGameTexts();
    if (typeof updateMissionTexts === 'function') updateMissionTexts();
}

// Eksportuj funkcje
window.t = t;
window.changeLanguage = changeLanguage;
window.updateAllTexts = updateAllTexts;