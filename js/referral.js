// System poleceń (referral) dla gry DziubCoins - Wersja 3.0 NAPRAWIONA
(function() {
    console.log("🔄 Inicjalizacja nowego systemu poleceń v3.0");

    // ===== KONFIGURACJA NAGRÓD =====
    const REFERRAL_REWARDS = {
        perInvite: 15, // Nagroda za każde zaproszenie
        invited: 25,   // Nagroda dla zaproszonego
        tiers: {
            1: { coins: 50, fruits: 0, ton: 0, special: null },
            3: { coins: 100, fruits: 1, ton: 0, special: null },
            5: { coins: 200, fruits: 2, ton: 0.01, special: null },
            10: { coins: 300, fruits: 3, ton: 0.02, special: null },
            20: { coins: 500, fruits: 5, ton: 0.05, special: null },
            50: { coins: 800, fruits: 8, ton: 0.1, special: null },
            100: { coins: 1200, fruits: 15, ton: 0.5, special: "master_recruiter", description: "Skin Master Recruiter" }
        }
    };

    // ===== GŁÓWNY OBIEKT SYSTEMU =====
    const ReferralSystem = {
        // Inicjalizacja systemu
        init: function() {
            console.log("🚀 Inicjalizacja systemu poleceń");
            
            // Sprawdź czy gameState istnieje
            if (!window.gameState) {
                console.warn("⚠️ gameState nie istnieje podczas inicjalizacji");
                return;
            }

            // Utwórz strukturę referral w gameState jeśli nie istnieje
            this.ensureReferralStructure();
            
            // Wczytaj dane z localStorage jako backup
            this.loadFromLocalStorage();
            
            // Wygeneruj kod polecający jeśli nie ma
            this.generateReferralCodeIfNeeded();
            
            // Sprawdź link polecający przy pierwszym uruchomieniu
            this.checkInitialReferralLink();
            
            console.log("✅ System poleceń zainicjalizowany");
            this.saveToLocalStorage(); // Zapisz po inicjalizacji
        },

        // Upewnij się, że struktura referral istnieje w gameState
        ensureReferralStructure: function() {
            if (!window.gameState.referral) {
                window.gameState.referral = {
                    myReferralCode: null,
                    referrerUserId: null,
                    totalInvites: 0,
                    invitedUsers: {},
                    rewardsClaimed: {},
                    specialSkins: []
                };
                console.log("📋 Utworzono nową strukturę referral w gameState");
            }
        },

        // Wczytaj dane z localStorage jako backup
        loadFromLocalStorage: function() {
            try {
                const savedTotalInvites = localStorage.getItem('referral_totalInvites');
                const savedInvitedUsers = localStorage.getItem('referral_invitedUsers');
                const savedRewardsClaimed = localStorage.getItem('referral_rewardsClaimed');

                if (savedTotalInvites && !isNaN(parseInt(savedTotalInvites))) {
                    const totalInvites = parseInt(savedTotalInvites);
                    if (totalInvites > window.gameState.referral.totalInvites) {
                        window.gameState.referral.totalInvites = totalInvites;
                        console.log("🔄 Przywrócono totalInvites z localStorage:", totalInvites);
                    }
                }

                if (savedInvitedUsers) {
                    const invitedUsers = JSON.parse(savedInvitedUsers);
                    if (Object.keys(invitedUsers).length > Object.keys(window.gameState.referral.invitedUsers).length) {
                        window.gameState.referral.invitedUsers = invitedUsers;
                        console.log("🔄 Przywrócono invitedUsers z localStorage");
                    }
                }

                if (savedRewardsClaimed) {
                    const rewardsClaimed = JSON.parse(savedRewardsClaimed);
                    window.gameState.referral.rewardsClaimed = { ...window.gameState.referral.rewardsClaimed, ...rewardsClaimed };
                    console.log("🔄 Przywrócono rewardsClaimed z localStorage");
                }
            } catch (error) {
                console.error("❌ Błąd wczytywania z localStorage:", error);
            }
        },

        // Zapisz do localStorage jako backup
        saveToLocalStorage: function() {
            try {
                if (!window.gameState.referral) return;

                localStorage.setItem('referral_totalInvites', window.gameState.referral.totalInvites.toString());
                localStorage.setItem('referral_invitedUsers', JSON.stringify(window.gameState.referral.invitedUsers));
                localStorage.setItem('referral_rewardsClaimed', JSON.stringify(window.gameState.referral.rewardsClaimed));
                
                console.log("💾 Zapisano dane poleceń do localStorage");
            } catch (error) {
                console.error("❌ Błąd zapisywania do localStorage:", error);
            }
        },

        // Wygeneruj kod polecający jeśli nie ma
        generateReferralCodeIfNeeded: function() {
            if (!window.gameState.referral.myReferralCode) {
                // Spróbuj użyć Telegram ID
                if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
                    const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
                    if (userId) {
                        window.gameState.referral.myReferralCode = `ref_${userId}`;
                    }
                }
                
                // Fallback - losowy kod
                if (!window.gameState.referral.myReferralCode) {
                    window.gameState.referral.myReferralCode = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
                }
                
                console.log("🔑 Wygenerowano kod polecający:", window.gameState.referral.myReferralCode);
            }
        },

        // Sprawdź link polecający przy pierwszym uruchomieniu
        checkInitialReferralLink: function() {
            // Sprawdź czy już przetworzono zaproszenie
            const alreadyProcessed = localStorage.getItem('referral_processed');
            if (alreadyProcessed) return;

            try {
                if (window.Telegram && window.Telegram.WebApp) {
                    const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
                    
                    if (startParam && startParam.startsWith('ref_')) {
                        this.processInvitation(startParam);
                    }
                }
            } catch (error) {
                console.error("❌ Błąd sprawdzania linku polecającego:", error);
            }
        },

        // Przetwórz zaproszenie
        processInvitation: function(referrerCode) {
            console.log("📨 Przetwarzanie zaproszenia od:", referrerCode);
            
            // Sprawdź czy to nie samozaproszenie
            if (referrerCode === window.gameState.referral.myReferralCode) {
                console.log("⚠️ Próba samozaproszenia - ignoruję");
                return;
            }

            // Zapisz kto nas zaprosił
            window.gameState.referral.referrerUserId = referrerCode;
            
            // Daj nagrodę zaproszonemu
            if (window.gameState.resources) {
                window.gameState.resources.coins += REFERRAL_REWARDS.invited;
                this.showNotification(`Bonus za zaproszenie: +${REFERRAL_REWARDS.invited} BirdCoinów!`);
                
                // NAPRAWKA: Aktualizuj UI po dodaniu nagród
                this.updateUI();
            }

            // Oznacz jako przetworzone
            localStorage.setItem('referral_processed', 'true');
            localStorage.setItem('referral_referrer', referrerCode);
            
            console.log("✅ Zaproszenie przetworzone pomyślnie");
            this.saveGame();
        },

        // Dodaj nowego zaproszonego użytkownika
        addInvitedUser: function(userId) {
            console.log("➕ Dodawanie nowego użytkownika:", userId);
            
            if (!window.gameState.referral) {
                console.error("❌ Brak struktury referral!");
                return;
            }

            // Sprawdź czy już istnieje
            if (window.gameState.referral.invitedUsers[userId]) {
                console.log("⚠️ Użytkownik już istnieje");
                return;
            }

            // Dodaj użytkownika
            window.gameState.referral.invitedUsers[userId] = Date.now();
            window.gameState.referral.totalInvites++;

            // Daj nagrodę
            if (window.gameState.resources) {
                window.gameState.resources.coins += REFERRAL_REWARDS.perInvite;
                this.showNotification(`Nowy użytkownik dołączył! +${REFERRAL_REWARDS.perInvite} BirdCoinów!`);
                
                // NAPRAWKA: Aktualizuj UI po dodaniu nagród
                this.updateUI();
            }

            // Sprawdź nagrody progowe
            this.checkTierRewards();
            
            // Zapisz
            this.saveToLocalStorage();
            this.saveGame();
            
            console.log(`✅ Dodano użytkownika. Łącznie zaproszeń: ${window.gameState.referral.totalInvites}`);
        },

        // Sprawdź i przyznaj nagrody progowe
        checkTierRewards: function() {
            const totalInvites = window.gameState.referral.totalInvites;
            
            Object.keys(REFERRAL_REWARDS.tiers).forEach(tierStr => {
                const tier = parseInt(tierStr);
                const tierKey = `tier_${tier}`;
                
                if (totalInvites >= tier && !window.gameState.referral.rewardsClaimed[tierKey]) {
                    console.log(`🎉 Odblokowano nagrodę za ${tier} zaproszeń!`);
                    // Nie odbieraj automatycznie - pozwól graczowi odebrać w oknie przyjaciół
                }
            });
        },

        // NAPRAWKA: Odbierz nagrodę progową - GŁÓWNA FUNKCJA DO NAPRAWY
        claimTierReward: function(tier) {
            console.log(`🎁 Próba odebrania nagrody za ${tier} zaproszeń`);
            
            const tierKey = `tier_${tier}`;
            const reward = REFERRAL_REWARDS.tiers[tier];
            
            if (!reward) {
                console.error("❌ Nie znaleziono nagrody dla poziomu:", tier);
                return false;
            }

            // Sprawdź czy spełnione warunki
            if (window.gameState.referral.totalInvites < tier) {
                this.showNotification(`Potrzebujesz ${tier} zaproszeń!`);
                return false;
            }

            // Sprawdź czy już odebrano
            if (window.gameState.referral.rewardsClaimed[tierKey]) {
                this.showNotification("Ta nagroda została już odebrana!");
                return false;
            }

            // NAPRAWKA: Sprawdź czy gameState.resources istnieje
            if (!window.gameState.resources) {
                console.error("❌ Brak obiektu resources w gameState!");
                window.gameState.resources = { coins: 0, fruits: 0, ton: 0, seeds: 0 };
            }

            console.log("💰 Stan zasobów PRZED dodaniem nagród:", {
                coins: window.gameState.resources.coins,
                fruits: window.gameState.resources.fruits,
                ton: window.gameState.resources.ton
            });

            // NAPRAWKA: Przyznaj nagrody z dodatkowymi logami
            let rewardMessage = `Odebrano nagrodę za ${tier} zaproszeń: `;
            
            if (reward.coins > 0) {
                window.gameState.resources.coins += reward.coins;
                rewardMessage += `+${reward.coins} BirdCoinów `;
                console.log(`💰 Dodano ${reward.coins} BirdCoinów`);
            }
            
            if (reward.fruits > 0) {
                window.gameState.resources.fruits += reward.fruits;
                rewardMessage += `+${reward.fruits} owoców `;
                console.log(`🍇 Dodano ${reward.fruits} owoców`);
            }
            
            if (reward.ton > 0) {
                window.gameState.resources.ton = (window.gameState.resources.ton || 0) + reward.ton;
                rewardMessage += `+${reward.ton} TON `;
                console.log(`⭐ Dodano ${reward.ton} TON`);
            }

            console.log("💰 Stan zasobów PO dodaniu nagród:", {
                coins: window.gameState.resources.coins,
                fruits: window.gameState.resources.fruits,
                ton: window.gameState.resources.ton
            });

            // Obsłuż specjalne nagrody (skiny)
            if (reward.special === "master_recruiter") {
                this.unlockMasterRecruiterSkin();
                rewardMessage += `+Skin Master Recruiter `;
            }

            // Oznacz jako odebrane
            window.gameState.referral.rewardsClaimed[tierKey] = true;
            console.log(`✅ Oznaczono nagrodę tier_${tier} jako odebraną`);
            
            // NAPRAWKA: Zapisz PRZED aktualizacją UI
            this.saveToLocalStorage();
            this.saveGame();
            
            // NAPRAWKA: AKTUALIZUJ UI - TO BYŁO GŁÓWNYM PROBLEMEM!
            this.updateUI();
            
            // NAPRAWKA: Pokaż animację nagrody jeśli funkcja istnieje
            if (typeof window.showRewardAnimation === 'function') {
                try {
                    const claimButton = document.querySelector(`button[onclick*="claimTierReward(${tier})"]`);
                    if (claimButton) {
                        window.showRewardAnimation(rewardMessage, claimButton);
                    }
                } catch (error) {
                    console.log("⚠️ Nie można pokazać animacji nagrody:", error);
                }
            }
            
            // Pokaż powiadomienie
            this.showNotification(rewardMessage);
            
            // NAPRAWKA: Aktualizuj UI okna przyjaciół PO wszystkich zmianach
            setTimeout(() => {
                this.updateFriendsModal();
            }, 100);
            
            console.log(`✅ Pomyślnie odebrano nagrodę za ${tier} zaproszeń`);
            return true;
        },

        // Odblokuj skin Master Recruiter
        unlockMasterRecruiterSkin: function() {
            console.log("🎨 Odblokowywanie skina Master Recruiter");
            
            // Upewnij się, że struktura skinów istnieje
            if (!window.gameState.skins) {
                window.gameState.skins = {
                    currentSkin: "default",
                    unlockedSkins: ["default"]
                };
            }

            // Dodaj skin do odblokowanych
            if (!window.gameState.skins.unlockedSkins.includes("master")) {
                window.gameState.skins.unlockedSkins.push("master");
            }

            // Dodaj do specjalnych skinów referral
            if (!window.gameState.referral.specialSkins.includes("master_recruiter")) {
                window.gameState.referral.specialSkins.push("master_recruiter");
            }

            // Wyzwól zdarzenie odblokowania skina
            document.dispatchEvent(new CustomEvent('skinUnlocked', {
                detail: { skinId: "master" }
            }));

            console.log("✅ Skin Master Recruiter odblokowany");
        },

        // Skopiuj link polecający
        copyReferralLink: function() {
            if (!window.gameState.referral.myReferralCode) {
                console.error("❌ Brak kodu polecającego");
                return;
            }

            const botUsername = "DziubCoinsBot";
            const referralLink = `https://t.me/${botUsername}?start=${window.gameState.referral.myReferralCode}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(referralLink).then(() => {
                    this.showNotification("Link skopiowany!");
                }).catch(err => {
                    console.error("❌ Błąd kopiowania:", err);
                    this.showNotification("Błąd kopiowania linku");
                });
            } else {
                // Fallback
                const textArea = document.createElement("textarea");
                textArea.value = referralLink;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification("Link skopiowany!");
            }
        },

        // Aktualizuj okno przyjaciół
        updateFriendsModal: function() {
            const friendsBody = document.querySelector('#friends-modal .friends-body');
            if (!friendsBody) return;

            const referralData = window.gameState.referral;
            const totalInvites = referralData.totalInvites || 0;
            const botUsername = "DziubCoinsBot";
            const referralLink = `https://t.me/${botUsername}?start=${referralData.myReferralCode}`;

            friendsBody.innerHTML = `
                <div class="referral-container" style="padding: 20px;">
                    <!-- Statystyki główne -->
                    <div class="referral-stats" style="background: linear-gradient(135deg, #2196F3, #1976D2); border-radius: 15px; padding: 20px; margin-bottom: 20px; color: white; text-align: center;">
                        <div style="font-size: 36px; font-weight: bold; margin-bottom: 10px;">${totalInvites}</div>
                        <div style="font-size: 18px;">${window.t ? window.t('friends.invitedFriends') : 'zaproszonych znajomych'}</div>
                    </div>
                    
                    <!-- Link polecający -->
                    <div class="referral-link-section" style="background: #f5f5f5; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <p style="margin-bottom: 15px; text-align: center; font-weight: bold;">${window.t ? window.t('friends.yourReferralLink') : 'Twój link polecający'}:</p>
                        <div style="background: white; border: 2px solid #2196F3; border-radius: 10px; padding: 12px; word-break: break-all; font-size: 14px; margin-bottom: 15px;">
                            ${referralLink}
                        </div>
                        <button onclick="window.ReferralSystem.copyReferralLink()" style="width: 100%; background: #4CAF50; color: white; border: none; border-radius: 10px; padding: 12px; cursor: pointer; font-weight: bold;">
                            ${window.t ? window.t('friends.copyButton') : 'Kopiuj link'}
                        </button>
                    </div>
                    
                    <!-- Nagrody progowe -->
                    <div class="tier-rewards-section" style="background: #fff3e0; border-radius: 15px; padding: 20px;">
                        <h4 style="margin-bottom: 20px; color: #f57c00; text-align: center;">${window.t ? window.t('referral.tierRewards') : 'Nagrody za zaproszenia'}</h4>
                        ${this.generateTierRewardsHTML()}
                    </div>
                </div>
            `;
        },

     
        



// Wygeneruj HTML nagród progowych
generateTierRewardsHTML: function() {
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    Object.keys(REFERRAL_REWARDS.tiers).forEach(tierStr => {
        const tier = parseInt(tierStr);
        const reward = REFERRAL_REWARDS.tiers[tier];
        const tierKey = `tier_${tier}`;
        const totalInvites = window.gameState.referral.totalInvites || 0;
        const isCompleted = totalInvites >= tier;
        const isClaimed = window.gameState.referral.rewardsClaimed[tierKey] || false;
        
        // Użyj funkcji t() dla wszystkich tekstów
        const invitationText = tier === 1 ? 
            window.t('referral.invitation') : 
            window.t('referral.invitations');
        
        // Przygotuj opis nagród z tłumaczeniami
        let rewardDescription = `${reward.coins} ${window.t('referral.birdCoins')}`;
        if (reward.fruits > 0) {
            rewardDescription += ` + ${reward.fruits} ${window.t('referral.fruits')}`;
        }
        if (reward.ton > 0) {
            rewardDescription += ` + ${reward.ton} TON`;
        }
        if (reward.special) {
            rewardDescription += ` + ${reward.description}`;
        }
        
        html += `
            <div class="tier-item" style="
                display: flex; 
                align-items: center; 
                padding: 15px; 
                background: ${isCompleted ? '#e8f5e8' : '#fff'}; 
                border-radius: 10px; 
                border: ${isCompleted && !isClaimed ? '2px solid #4CAF50' : '1px solid #ddd'};
            ">
                <div style="
                    width: 50px; 
                    height: 50px; 
                    background: ${isCompleted ? '#4CAF50' : '#f5f5f5'}; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin-right: 15px; 
                    font-size: 24px;
                ">
                    ${isCompleted ? (isClaimed ? '✅' : '🎁') : '👥'}
                </div>
                <div style="flex: 1;">
                    <strong style="font-size: 16px;">${tier} ${invitationText}</strong>
                    <div style="color: #666; font-size: 14px; margin-top: 5px;">
                        ${rewardDescription}
                    </div>
                    ${!isCompleted ? `<div style="color: #999; font-size: 12px;">${window.t('referral.remaining')} ${tier - totalInvites}</div>` : ''}
                </div>
                ${isCompleted && !isClaimed ? `
                    <button onclick="window.ReferralSystem.claimTierReward(${tier})" style="
                        background: #4CAF50; 
                        color: white; 
                        border: none; 
                        border-radius: 8px; 
                        padding: 8px 16px; 
                        cursor: pointer; 
                        font-weight: bold;
                    ">${window.t('referral.claimButton')}</button>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
},










        // NAPRAWKA: Pomocnicze funkcje - dodano updateUI
        updateUI: function() {
            // Wywołaj globalną funkcję updateUI jeśli istnieje
            if (typeof window.updateUI === 'function') {
                window.updateUI();
                console.log("🔄 Zaktualizowano interfejs użytkownika");
            } else {
                console.warn("⚠️ Funkcja updateUI nie jest dostępna");
            }
        },

        showNotification: function(message) {
            if (typeof window.showNotification === 'function') {
                window.showNotification(message);
            } else {
                console.log("📢 Powiadomienie:", message);
            }
        },

        saveGame: function() {
            if (typeof window.saveGame === 'function') {
                window.saveGame();
            }
        },

        // Funkcje testowe (do usunięcia w produkcji)
        testAddInvite: function() {
            const testUserId = `test_${Date.now()}`;
            this.addInvitedUser(testUserId);
            console.log("🧪 Dodano testowe zaproszenie");
        }
    };

    // Eksportuj do globalnego zakresu
    window.ReferralSystem = ReferralSystem;

    // Automatyczna inicjalizacja
    document.addEventListener('gameLoaded', function() {
        setTimeout(() => {
            ReferralSystem.init();
        }, 500);
    });

    // Backup inicjalizacja po załadowaniu strony
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (window.gameState && !window.ReferralSystem.initialized) {
                ReferralSystem.init();
                window.ReferralSystem.initialized = true;
            }
        }, 2000);
    });

    // Nasłuchuj na otwarcie okna przyjaciół
    document.addEventListener('click', function(e) {
        if (e.target.closest('.friends-button')) {
            setTimeout(() => {
                ReferralSystem.updateFriendsModal();
            }, 100);
        }
    });

    console.log("✅ System poleceń v3.0 załadowany");





// Nasłuchuj na zmiany języka i aktualizuj okno przyjaciół
document.addEventListener('languageChanged', function() {
    console.log("Język zmieniony - aktualizuję okno przyjaciół");
    // Jeśli okno przyjaciół jest otwarte, zaktualizuj je
    const friendsModal = document.getElementById('friends-modal');
    if (friendsModal && friendsModal.style.display === 'flex') {
        setTimeout(() => {
            ReferralSystem.updateFriendsModal();
        }, 100);
    }
});



})();