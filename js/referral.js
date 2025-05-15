// System poleceń (referral) dla gry DziubCoins - Wersja 2.0 ULTRA
(function() {
    console.log("Inicjalizacja systemu poleceń 2.0 (referral.js)");

    // Rozszerz gameState o dane systemu poleceń
    if (!window.gameState.referral) {
        window.gameState.referral = {
            referrerUserId: null, // ID użytkownika, który nas zaprosił
            myReferralCode: null, // Nasz unikalny kod polecający
            invitedUsers: [], // Lista użytkowników, których zaprosiliśmy
            totalInvites: 0, // Łączna liczba zaproszonych
            combo: 0, // Combo za zaproszenia z rzędu
            lastInviteDate: null, // Data ostatniego zaproszenia
            rewardsClaimed: { // Które nagrody progowe zostały odebrane
                tier1: false, // 1 zaproszenie
                tier3: false, // 3 zaproszenia
                tier5: false, // 5 zaproszeń
                tier10: false, // 10 zaproszeń
                tier20: false, // 20 zaproszeń
                tier50: false, // 50 zaproszeń
                tier100: false // 100 zaproszeń - skin rekrutera
            },
            weeklyInvites: 0, // Zaproszenia w tym tygodniu
            weeklyResetDate: null, // Data resetu tygodniowego
            specialSkins: [] // Specjalne skiny za zaproszenia
        };
    }

    // Konfiguracja nagród
    const REFERRAL_REWARDS = {
        perInvite: 10, // Nagroda za każde zaproszenie
        invited: 20, // Nagroda dla zaproszonego
        comboBonus: 2, // Mnożnik za combo
        maxCombo: 3, // Maksymalny mnożnik combo
        tiers: {
            1: { 
                coins: 25, 
                fruits: 0, 
                ton: 0,
                special: null,
                description: "Pierwsze zaproszenie! 🎉",
                icon: "🥇"
            },
            3: { 
                coins: 50, 
                fruits: 0, 
                ton: 0,
                special: null,
                description: "3 zaproszenia! Świetnie! 🔥",
                icon: "🏆"
            },
            5: { 
                coins: 75, 
                fruits: 1, 
                ton: 0,
                special: null,
                description: "5 zaproszeń! 🦜",
                icon: "🎖️"
            },
            10: { 
                coins: 100, 
                fruits: 2, 
                ton: 0.01,
                special: null,
                description: "10 zaproszeń! Bonus TON! 💎",
                icon: "💰"
            },
            20: { 
                coins: 300, 
                fruits: 3, 
                ton: 0.05,
                special: null,
                description: "20 zaproszeń! ✨",
                icon: "👑"
            },
            50: { 
                coins: 500, 
                fruits: 5, 
                ton: 0.1,
                special: null,
                description: "50 zaproszeń! 💎",
                icon: "💎"
            },
            100: { 
                coins: 700, 
                fruits: 10, 
                ton: 1,
                special: "skin_recruiter",
                description: "100 zaproszeń! Nowy skin rekrutera! 🌟",
                icon: "🏅"
            }
        },
        weeklyRewards: {
            5: { coins: 100, fruits: 1, description: "5 zaproszeń w tygodniu!" },
            10: { coins: 200, fruits: 2, ton: 0.02, description: "10 zaproszeń w tygodniu! Niesamowite!" },
            20: { coins: 300, fruits: 3, ton: 0.05, description: "20 zaproszeń w tygodniu! Jesteś mistrzem!" }
        }
    };

    // Generowanie unikalnego kodu referencyjnego
    function generateReferralCode() {
        // Jeśli mamy dostęp do Telegram User ID, używamy go
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
            const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
            if (userId) {
                return `ref_${userId}`;
            }
        }
        
        // Fallback - generujemy losowy kod
        return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Inicjalizacja systemu poleceń
    function initReferralSystem() {
        console.log("Inicjalizacja systemu poleceń 2.0");
        
        // Jeśli nie mamy kodu referencyjnego, generujemy go
        if (!gameState.referral.myReferralCode) {
            gameState.referral.myReferralCode = generateReferralCode();
            saveGame();
        }

        // Sprawdź reset tygodniowy
        checkWeeklyReset();

        // Sprawdź, czy użytkownik przyszedł z linku referencyjnego
        checkReferralLink();
        
        // Zaktualizuj UI okna przyjaciół
        updateFriendsModal();
    }

    // Sprawdzenie resetu tygodniowego
    function checkWeeklyReset() {
        const now = new Date();
        const lastReset = gameState.referral.weeklyResetDate ? new Date(gameState.referral.weeklyResetDate) : null;
        
        if (!lastReset || (now - lastReset) > 7 * 24 * 60 * 60 * 1000) {
            // Reset licznika tygodniowego
            gameState.referral.weeklyInvites = 0;
            gameState.referral.weeklyResetDate = now.toISOString();
            saveGame();
        }
    }

    // Sprawdzenie, czy użytkownik przyszedł z linku referencyjnego
    function checkReferralLink() {
        try {
            if (window.Telegram && window.Telegram.WebApp) {
                const tg = window.Telegram.WebApp;
                const startParam = tg.initDataUnsafe.start_param;
                
                if (startParam && startParam.startsWith('ref_')) {
                    const referrerCode = startParam;
                    
                    // Nie możemy zaprosić sami siebie
                    if (referrerCode === gameState.referral.myReferralCode) {
                        console.log("Próba zaproszenia samego siebie - ignoruję");
                        return;
                    }
                    
                    // Jeśli nie mamy jeszcze referrera i to nowy gracz
                    if (!gameState.referral.referrerUserId && !localStorage.getItem('referralProcessed')) {
                        processReferral(referrerCode);
                    }
                }
            }
        } catch (error) {
            console.error("Błąd sprawdzania linku referencyjnego:", error);
        }
    }

    // Przetwarzanie zaproszenia
    function processReferral(referrerCode) {
        console.log("Przetwarzanie zaproszenia od:", referrerCode);
        
        // Oznacz, że zaproszenie zostało przetworzone
        localStorage.setItem('referralProcessed', 'true');
        
        // Zapisz, kto nas zaprosił
        gameState.referral.referrerUserId = referrerCode;
        
        // Daj nagrodę zaproszonemu
        gameState.resources.coins += REFERRAL_REWARDS.invited;
        
        // Powiadom o nagrodzie z animacją
        showReferralAnimation(`Zostałeś zaproszony! +${REFERRAL_REWARDS.invited} DziubCoinów!`, 'welcome');
        
        // Zapisz stan gry
        saveGame();
        updateUI();
        
        // Wyślij informację do serwera/bota o pomyślnym zaproszeniu
        sendReferralToTelegram(referrerCode);
    }

    // Funkcja do kopiowania linku referencyjnego
    function copyReferralLink() {
        const botUsername = "DziubCoinsBot"; // Zmień na nazwę swojego bota
        const referralLink = `https://t.me/${botUsername}?start=${gameState.referral.myReferralCode}`;
        
        // Skopiuj do schowka
        if (navigator.clipboard) {
            navigator.clipboard.writeText(referralLink).then(function() {
                showReferralAnimation("Link polecający skopiowany do schowka!", 'success');
                // Efekt wizualny kopiowania
                animateCopyButton();
            }).catch(function(err) {
                console.error('Błąd kopiowania:', err);
                showNotification("Nie udało się skopiować linku");
            });
        } else {
            // Fallback dla starszych przeglądarek
            const textArea = document.createElement("textarea");
            textArea.value = referralLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showReferralAnimation("Link polecający skopiowany!", 'success');
            animateCopyButton();
        }
    }

    // Animacja przycisku kopiowania
    function animateCopyButton() {
        const copyButton = document.querySelector('[onclick*="copyReferralLink"]');
        if (copyButton) {
            copyButton.classList.add('copied-animation');
            setTimeout(() => {
                copyButton.classList.remove('copied-animation');
            }, 1500);
        }
    }

    // Udostępnianie linku przez Telegram
    function shareReferralLink() {
        if (!window.Telegram || !window.Telegram.WebApp) {
            copyReferralLink(); // Fallback - skopiuj do schowka
            return;
        }
        
        try {
            const tg = window.Telegram.WebApp;
            const botUsername = "DziubCoinsBot"; // Zmień na nazwę swojego bota
            const referralLink = `https://t.me/${botUsername}?start=${gameState.referral.myReferralCode}`;
            
            if (tg.shareUrl) {
                tg.shareUrl({
                    url: referralLink,
                    text: "🦆 Zagraj ze mną w DziubCoins! Karm ptaki i zbieraj nagrody! 💰\n\n🎁 Otrzymasz 20 DziubCoinów na start!"
                });
            } else {
                copyReferralLink(); // Fallback
            }
        } catch (error) {
            console.error("Błąd udostępniania linku:", error);
            copyReferralLink(); // Fallback
        }
    }

    // Dodaj użytkownika, który użył naszego linku
    function addInvitedUser(userId) {
        if (!gameState.referral.invitedUsers.includes(userId)) {
            gameState.referral.invitedUsers.push(userId);
            gameState.referral.totalInvites++;
            gameState.referral.weeklyInvites++;
            
            // Sprawdź combo
            const now = new Date();
            const lastInvite = gameState.referral.lastInviteDate ? new Date(gameState.referral.lastInviteDate) : null;
            
            if (lastInvite && (now - lastInvite) < 24 * 60 * 60 * 1000) {
                // Zaproszenie w ciągu 24h - zwiększ combo
                gameState.referral.combo++;
            } else {
                // Reset combo
                gameState.referral.combo = 1;
            }
            
            gameState.referral.lastInviteDate = now.toISOString();
            
            // Oblicz nagrodę z uwzględnieniem combo
            let coinsReward = REFERRAL_REWARDS.perInvite;
            if (gameState.referral.combo > 1) {
                coinsReward *= Math.min(gameState.referral.combo, REFERRAL_REWARDS.maxCombo); // Max x3 combo
            }
            
            // Nagroda za zaproszenie
            gameState.resources.coins += coinsReward;
            
            // Sprawdź nagrody progowe
            checkTierRewards();
            
            // Sprawdź nagrody tygodniowe
            checkWeeklyRewards();
            
            // Animowana notyfikacja
            let message = `Nowy użytkownik dołączył! +${coinsReward} DziubCoinów!`;
            if (gameState.referral.combo > 1) {
                message += ` Combo x${gameState.referral.combo}! 🔥`;
            }
            
            showReferralAnimation(message, 'invite-success');
            
            updateUI();
            saveGame();
            updateFriendsModal();
        }
    }

    // Sprawdzanie i przyznawanie nagród progowych
    function checkTierRewards() {
        const totalInvites = gameState.referral.totalInvites;
        const rewardsClaimed = gameState.referral.rewardsClaimed;
        
        Object.entries(REFERRAL_REWARDS.tiers).forEach(([tier, reward]) => {
            const tierNum = parseInt(tier);
            const tierKey = `tier${tier}`;
            
            if (totalInvites >= tierNum && !rewardsClaimed[tierKey]) {
                // Przyznaj nagrodę
                rewardsClaimed[tierKey] = true;
                
                gameState.resources.coins += reward.coins;
                gameState.resources.fruits += reward.fruits;
                
                // Specjalna nagroda TON
                if (reward.ton) {
                    gameState.resources.ton = (gameState.resources.ton || 0) + reward.ton;
                }
                
                // Specjalne nagrody (tylko skiny)
                if (reward.special && reward.special.startsWith('skin_')) {
                    gameState.referral.specialSkins.push(reward.special);
                }
                
                // Efektowna animacja nagrody
                showTierRewardAnimation(reward, tier);
                
                updateUI();
                saveGame();
            }
        });
    }

    // Sprawdzanie nagród tygodniowych
    function checkWeeklyRewards() {
        const weeklyInvites = gameState.referral.weeklyInvites;
        
        Object.entries(REFERRAL_REWARDS.weeklyRewards).forEach(([threshold, reward]) => {
            const thresholdNum = parseInt(threshold);
            
            if (weeklyInvites >= thresholdNum) {
                // Przyznaj nagrodę tygodniową (można ją odbierać wielokrotnie)
                gameState.resources.coins += reward.coins;
                gameState.resources.fruits += reward.fruits;
                
                if (reward.ton) {
                    gameState.resources.ton = (gameState.resources.ton || 0) + reward.ton;
                }
                
                showReferralAnimation(`🏆 Nagroda tygodniowa! ${reward.description}`, 'weekly-reward');
            }
        });
    }

    // Efektowna animacja nagrody progowej
    function showTierRewardAnimation(reward, tier) {
        // Utwórz overlay
        const overlay = document.createElement('div');
        overlay.className = 'referral-tier-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        // Kontener nagrody
        const rewardContainer = document.createElement('div');
        rewardContainer.className = 'tier-reward-container';
        rewardContainer.style.cssText = `
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            animation: bounceIn 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            position: relative;
            overflow: hidden;
        `;
        
        // Efekt świecenia
        const glowEffect = document.createElement('div');
        glowEffect.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            animation: rotate 3s linear infinite;
        `;
        rewardContainer.appendChild(glowEffect);
        
        // Zawartość
        const content = document.createElement('div');
        content.style.position = 'relative';
        content.style.zIndex = '1';
        content.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">${reward.icon}</div>
            <h2 style="color: #fff; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                Poziom ${tier} Osiągnięty!
            </h2>
            <p style="color: #fff; font-size: 18px; margin-bottom: 20px;">
                ${reward.description}
            </p>
            <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 15px; margin-bottom: 20px;">
                <div style="color: #fff; font-weight: bold; margin-bottom: 10px;">Nagrody:</div>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    ${reward.coins > 0 ? `<div><img src="assets/images/coin-icon.png" style="width: 24px; height: 24px; vertical-align: middle;"> ${reward.coins}</div>` : ''}
                    ${reward.fruits > 0 ? `<div><img src="assets/images/fruit-icon.png" style="width: 24px; height: 24px; vertical-align: middle;"> ${reward.fruits}</div>` : ''}
                    ${reward.ton > 0 ? `<div><img src="assets/images/ton-icon.png" style="width: 24px; height: 24px; vertical-align: middle;"> ${reward.ton} TON</div>` : ''}
                    ${reward.special ? `<div style="color: #FFD700;">🎁 ${reward.special.replace(/_/g, ' ').toUpperCase()}</div>` : ''}
                </div>
            </div>
            <button onclick="this.closest('.referral-tier-overlay').remove()" style="
                background: #fff;
                color: #FFA500;
                border: none;
                border-radius: 25px;
                padding: 12px 30px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                transition: all 0.2s;
            ">Świetnie!</button>
        `;
        
        rewardContainer.appendChild(content);
        overlay.appendChild(rewardContainer);
        document.body.appendChild(overlay);
        
        // Animuj cząsteczki
        createParticleEffect(overlay);
    }

    // Efekt cząsteczek
    function createParticleEffect(container) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: #FFD700;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-float ${Math.random() * 3 + 2}s ease-out infinite;
                opacity: ${Math.random() * 0.7 + 0.3};
            `;
            container.appendChild(particle);
        }
    }

    // Animowane powiadomienia referrals
    function showReferralAnimation(text, type = 'default') {
        const notification = document.createElement('div');
        notification.className = `referral-notification ${type}`;
        
        const colors = {
            'welcome': 'linear-gradient(135deg, #4FC3F7, #2196F3)',
            'success': 'linear-gradient(135deg, #66BB6A, #4CAF50)',
            'invite-success': 'linear-gradient(135deg, #FFA726, #FF6F00)',
            'weekly-reward': 'linear-gradient(135deg, #AB47BC, #8E24AA)',
            'default': 'linear-gradient(135deg, #42A5F5, #1E88E5)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type] || colors.default};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const icon = document.createElement('span');
        icon.style.fontSize = '24px';
        icon.textContent = type === 'welcome' ? '🎉' : 
                          type === 'success' ? '✅' : 
                          type === 'invite-success' ? '🔥' : 
                          type === 'weekly-reward' ? '🏆' : '📢';
        
        notification.appendChild(icon);
        notification.appendChild(document.createTextNode(text));
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    // Aktualizacja UI okna przyjaciół
    function updateFriendsModal() {
        const friendsBody = document.querySelector('#friends-modal .friends-body');
        if (!friendsBody) return;
        
        const referralData = gameState.referral;
        const totalInvites = referralData.totalInvites;
        const weeklyInvites = referralData.weeklyInvites;
        const combo = referralData.combo;
        
        // Generuj link polecający
        const botUsername = "DziubCoinsBot"; // Zmień na nazwę swojego bota
        const referralLink = `https://t.me/${botUsername}?start=${referralData.myReferralCode}`;
        
        friendsBody.innerHTML = `
            <div class="referral-container" style="padding: 15px;">
                <h3 style="color: #2196F3; margin-bottom: 20px; text-align: center;">System Poleceń 2.0</h3>
                
                <!-- Statystyki główne -->
                <div class="referral-stats-main" style="background: linear-gradient(135deg, #2196F3, #1976D2); border-radius: 15px; padding: 20px; margin-bottom: 20px; color: white; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="text-align: center; font-size: 36px; font-weight: bold; margin-bottom: 10px;">
                            ${totalInvites}
                            ${combo > 1 ? `<span style="font-size: 18px; color: #FFD700;">x${combo} COMBO!</span>` : ''}
                        </div>
                        <div style="text-align: center; font-size: 18px;">zaproszonych znajomych</div>
                        <div style="display: flex; justify-content: center; margin-top: 20px;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold;">${weeklyInvites}</div>
                                <div style="font-size: 14px; opacity: 0.9;">w tym tygodniu</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Link polecający -->
                <div class="referral-link-section" style="background: #f5f5f5; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin-bottom: 15px; text-align: center; font-weight: bold; color: #333;">Twój link polecający:</p>
                    <div class="referral-link-box" style="background: white; border: 2px solid #2196F3; border-radius: 10px; padding: 12px; word-break: break-all; font-size: 14px; margin-bottom: 15px; position: relative;">
                        ${referralLink}
                        <span class="copy-tooltip" style="position: absolute; top: -30px; right: 10px; background: #333; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; display: none;">Skopiowano!</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="window.ReferralSystem.copyReferralLink()" style="flex: 1; background: linear-gradient(135deg, #4CAF50, #45A049); color: white; border: none; border-radius: 10px; padding: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 3px 10px rgba(0,0,0,0.2); transition: all 0.2s;">
                            📋 Kopiuj link
                        </button>
                        <button onclick="window.ReferralSystem.shareReferralLink()" style="flex: 1; background: linear-gradient(135deg, #2196F3, #1976D2); color: white; border: none; border-radius: 10px; padding: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 3px 10px rgba(0,0,0,0.2); transition: all 0.2s;">
                            📤 Udostępnij
                        </button>
                    </div>
                </div>
                
                <!-- Nagrody progowe -->
                <div class="referral-tiers" style="background: #fff3e0; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 20px; color: #f57c00; text-align: center;">🎯 Nagrody za zaproszenia</h4>
                    ${generateTierList()}
                </div>
                
                <!-- Nagrody tygodniowe -->
                <div class="weekly-rewards" style="background: #e8f5e9; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 15px; color: #4CAF50; text-align: center;">🏆 Nagrody tygodniowe</h4>
                    ${generateWeeklyRewards()}
                </div>
                
                <!-- Lista zaproszonych -->
                ${generateInvitedList()}
                
                <!-- Nagrody specjalne -->
                ${generateSpecialRewards()}
            </div>
        `;
        
        // Dodaj animacje CSS
        addReferralAnimations();
    }

    // Generowanie listy progów nagród
    function generateTierList() {
        let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
        
        Object.entries(REFERRAL_REWARDS.tiers).forEach(([tier, reward]) => {
            const tierNum = parseInt(tier);
            const isCompleted = gameState.referral.totalInvites >= tierNum;
            const isClaimed = gameState.referral.rewardsClaimed[`tier${tier}`];
            const isNext = !isCompleted && gameState.referral.totalInvites < tierNum;
            
            html += `
                <div class="tier-item ${isCompleted ? 'completed' : ''} ${isNext ? 'next' : ''}" style="
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    background: ${isCompleted ? 'linear-gradient(135deg, #c8e6c9, #a5d6a7)' : '#fff'};
                    border-radius: 10px;
                    border: ${isNext ? '2px solid #FFA500' : '1px solid #ddd'};
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s;
                ">
                    ${isNext ? '<div class="pulse-effect" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, rgba(255,165,0,0.1) 0%, transparent 70%); animation: pulse 2s infinite;"></div>' : ''}
                    <div style="width: 50px; height: 50px; background: ${isCompleted ? '#4CAF50' : '#f5f5f5'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 24px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        ${isCompleted ? (isClaimed ? '✅' : '🎁') : reward.icon}
                    </div>
                    <div style="flex: 1;">
                        <strong style="color: #333; font-size: 16px;">${tierNum} ${tierNum === 1 ? 'zaproszenie' : 'zaproszeń'}</strong>
                        <div style="color: #666; font-size: 14px; margin-top: 5px;">
                            ${reward.coins} DziubCoinów
                            ${reward.fruits > 0 ? ` + ${reward.fruits} ${reward.fruits === 1 ? 'owoc' : 'owoców'}` : ''}
                            ${reward.ton > 0 ? ` + ${reward.ton} TON` : ''}
                            ${reward.special ? ` + ${reward.special.replace(/_/g, ' ')}` : ''}
                        </div>
                        ${isNext ? `<div style="color: #FFA500; font-size: 12px; margin-top: 5px;">Zostało: ${tierNum - gameState.referral.totalInvites}</div>` : ''}
                    </div>
                    ${isCompleted && !isClaimed ? `
                        <button onclick="window.ReferralSystem.claimTierReward(${tier})" style="
                            background: linear-gradient(135deg, #FFD700, #FFA500);
                            color: white;
                            border: none;
                            border-radius: 20px;
                            padding: 8px 20px;
                            cursor: pointer;
                            font-weight: bold;
                            animation: bounce 1s infinite;
                        ">Odbierz!</button>
                    ` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // Generowanie nagród tygodniowych
    function generateWeeklyRewards() {
        let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        
        Object.entries(REFERRAL_REWARDS.weeklyRewards).forEach(([threshold, reward]) => {
            const thresholdNum = parseInt(threshold);
            const progress = Math.min(gameState.referral.weeklyInvites / thresholdNum * 100, 100);
            const isCompleted = gameState.referral.weeklyInvites >= thresholdNum;
            
            html += `
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="font-weight: bold; color: #333;">${thresholdNum} zaproszeń</span>
                        <span style="color: #666; font-size: 14px;">${gameState.referral.weeklyInvites}/${thresholdNum}</span>
                    </div>
                    <div style="height: 10px; background: #e0e0e0; border-radius: 5px; overflow: hidden;">
                        <div style="width: ${progress}%; height: 100%; background: linear-gradient(135deg, #4CAF50, #66BB6A); transition: width 0.3s;"></div>
                    </div>
                    <div style="color: #666; font-size: 12px; margin-top: 5px;">
                        ${reward.coins} monet
                        ${reward.fruits > 0 ? ` + ${reward.fruits} ${reward.fruits === 1 ? 'owoc' : 'owoców'}` : ''}
                        ${reward.ton > 0 ? ` + ${reward.ton} TON` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // Generowanie listy zaproszonych użytkowników
    function generateInvitedList() {
        if (gameState.referral.invitedUsers.length === 0) {
            return '';
        }
        
        let html = `
            <div style="margin-top: 20px; background: #f5f5f5; border-radius: 15px; padding: 20px;">
                <h4 style="margin-bottom: 15px; color: #1565c0;">👥 Zaproszeni użytkownicy</h4>
                <div style="max-height: 200px; overflow-y: auto;">
        `;
        
        gameState.referral.invitedUsers.forEach((userId, index) => {
            html += `
                <div style="
                    padding: 10px;
                    background: white;
                    margin-bottom: 8px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border: 2px solid #ddd;
                ">
                    <div style="display: flex; align-items: center;">
                        <div style="width: 40px; height: 40px; background: #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 10px;">
                            ${index + 1}
                        </div>
                        <div>
                            <div style="font-weight: bold; color: #333;">Użytkownik #${index + 1}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }

    // Generowanie sekcji nagród specjalnych
    function generateSpecialRewards() {
        if (gameState.referral.specialSkins.length === 0) {
            return '';
        }
        
        let html = `
            <div style="margin-top: 20px; background: linear-gradient(135deg, #f3e5f5, #e1bee7); border-radius: 15px; padding: 20px;">
                <h4 style="margin-bottom: 15px; color: #8E24AA;">🏅 Nagrody specjalne</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        `;
        
        gameState.referral.specialSkins.forEach(skin => {
            html += `
                <div style="
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    border-radius: 10px;
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                ">
                    <span style="font-size: 24px;">✨</span>
                    <span style="font-weight: bold; color: white;">${skin.replace(/_/g, ' ')}</span>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }

    // Dodaj animacje CSS
    function addReferralAnimations() {
        if (document.getElementById('referral-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'referral-animations';
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes particle-float {
                0% { transform: translateY(0) translateX(0); opacity: 1; }
                100% { transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
            }
            
            .copied-animation {
                animation: bounce 0.5s ease-out;
            }
            
            .tier-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .tier-item.next {
                animation: pulse 2s infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Funkcja odbierania nagrody progowej
    window.claimTierReward = function(tier) {
        const reward = REFERRAL_REWARDS.tiers[tier];
        if (!reward) return;
        
        // Animacja odbierania nagrody
        showTierRewardAnimation(reward, tier);
        
        // Zaktualizuj UI
        updateFriendsModal();
    };

    // Wysyłanie informacji o zaproszeniu do Telegram
    function sendReferralToTelegram(referrerCode) {
        if (!window.Telegram || !window.Telegram.WebApp) return;
        
        try {
            const tg = window.Telegram.WebApp;
            
            if (tg.sendData) {
                const data = {
                    type: 'referral',
                    referrer: referrerCode,
                    invited: gameState.referral.myReferralCode,
                    timestamp: Date.now()
                };
                
                tg.sendData(JSON.stringify(data));
                console.log("Wysłano informację o zaproszeniu do Telegram");
            }
        } catch (error) {
            console.error("Błąd wysyłania danych do Telegram:", error);
        }
    }

    // Testowa funkcja do symulowania zaproszeń
    window.testAddInvite = function() {
        const testUserId = `test_user_${Date.now()}`;
        addInvitedUser(testUserId);
        console.log("Dodano testowe zaproszenie");
    };

    // Interfejs publiczny
    window.ReferralSystem = {
        init: initReferralSystem,
        copyReferralLink: copyReferralLink,
        shareReferralLink: shareReferralLink,
        addInvitedUser: addInvitedUser,
        updateUI: updateFriendsModal,
        claimTierReward: claimTierReward
    };

    // Inicjalizacja przy ładowaniu gry
    document.addEventListener('gameLoaded', function() {
        setTimeout(function() {
            window.ReferralSystem.init();
        }, 500);
    });

    // Aktualizuj UI przy otwieraniu okna przyjaciół
    document.addEventListener('DOMContentLoaded', function() {
        const friendsButton = document.querySelector('.friends-button');
        if (friendsButton) {
            friendsButton.addEventListener('click', function() {
                updateFriendsModal();
            });
        }
    });

})();