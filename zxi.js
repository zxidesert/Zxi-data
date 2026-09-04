javascript:(function() {
    "use strict";

    // ⚠️ এখানে আপনার আসল পাইথন রেলওয়ে সার্ভারের ডোমেনটি বসান
    const RAILWAY_SERVER_URL = "https://zxi-file-loader.ah4734536.workers.dev"; 

    let userIndex = -1;
    if (typeof window.ZXI_BOOKMARK_LOAD !== "undefined") {
        userIndex = 0;
    } else {
        for (let i = 1; i <= 500; i++) {
            if (typeof window['ZXI' + i + '_BOOKMARK_LOAD'] !== "undefined") {
                userIndex = i;
                break;
            }
        }
    }

    if (userIndex === -1) {
        console.log("%cAccess Denied - Bookmark Required", "color:#ff0000;font-size:15px;font-weight:bold");
        return;
    }

    const sKey = "Hey";

    const _d = {
        r: `${RAILWAY_SERVER_URL}/?file=zxi.txt&key=${sKey}`,
        p: `${RAILWAY_SERVER_URL}/?file=zx.txt&key=${sKey}`,
        t: `${RAILWAY_SERVER_URL}/?file=button.txt`,
        m: `${RAILWAY_SERVER_URL}/?file=music.txt`,
        n: `${RAILWAY_SERVER_URL}/?file=name.txt`, 
        s: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(6,10,23,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;padding:30px 25px;border-radius:16px;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.6);border:2px solid #00ffcc;width:300px;box-sizing:border-box;animation: zxi-lightning-glow 3s linear infinite;'
    };

    let zxiAudio = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let animationFrameId = null;
    let isMusicLoading = false;

    async function autoPlayMusicAndVisualizer() {
        if (!zxiAudio && !isMusicLoading) {
            try {
                isMusicLoading = true;
                const res = await fetch(_d.m + '&t=' + Date.now());
                const audioUrl = (await res.text()).trim();
                if(audioUrl && audioUrl.startsWith('http')) {
                    const audioFetch = await fetch(audioUrl);
                    const blobUrl = URL.createObjectURL(await audioFetch.blob());
                    zxiAudio = new Audio(blobUrl); zxiAudio.loop = true; zxiAudio.crossOrigin = "anonymous";
                } else { isMusicLoading = false; return; }
            } catch(err) { isMusicLoading = false; return; }
            isMusicLoading = false;
        }
        if (zxiAudio) {
            try {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioContext.createAnalyser();
                    analyser.fftSize = 512;
                    analyser.smoothingTimeConstant = 0.3; 
                    dataArray = new Uint8Array(analyser.frequencyBinCount);
                    source = audioContext.createMediaElementSource(zxiAudio);
                    source.connect(analyser);
                    analyser.connect(audioContext.destination);
                }
                if (audioContext.state === 'suspended') { await audioContext.resume(); }
                if (zxiAudio.paused) {
                    await zxiAudio.play();
                    const musicBtn = document.getElementById('zxi-music-btn');
                    if (musicBtn) {
                        musicBtn.textContent = '🔊'; musicBtn.style.color = '#00ffcc';
                        musicBtn.style.borderColor = '#00ffcc'; musicBtn.style.boxShadow = '0 0 15px rgba(0,255,204,0.6)';
                    }
                }
            } catch(e) {}
        }
    }

    (async function() {
        const oldBox = document.getElementById('zxi-auth-box');
        if(oldBox) oldBox.remove();
        
        const oldCredit = document.getElementById('zxi-floating-credit');
        if(oldCredit) oldCredit.remove();

        const oldMusicBtn = document.getElementById('zxi-music-btn');
        if(oldMusicBtn) oldMusicBtn.remove();

        let systemName = "ZXI";
        let userTelegram = "https://t.me/zxiowner"; 
        let correctPassword = "";

        try {
            const nameRes = await fetch(_d.n + '&t=' + Date.now());
            const nameText = await nameRes.text();
            const lines = nameText.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");
            
            if (lines[userIndex]) {
                const matches = lines[userIndex].match(/"([^"]+)"/g);
                if (matches && matches.length >= 3) {
                    systemName = matches[0].replace(/"/g, '');      
                    userTelegram = matches[1].replace(/"/g, '');    
                    correctPassword = matches[2].replace(/"/g, ''); 
                }
            }
        } catch(e) {
            console.error("Initialization error:", e);
        }

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            @keyframes zxi-lightning-glow {
                0% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
                25% { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
                30% { box-shadow: 0 0 8px #00ffcc, 0 0 12px #00ffcc, inset 0 0 6px rgba(0,255,204,0.3); border-color: #00ffcc; }
                35% { box-shadow: 0 0 25px #00ffff, 0 0 40px #00ffcc, inset 0 0 15px rgba(0,255,204,0.5); border-color: #00ffff; }
                70% { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
                73% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
                100% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
            }
            @keyframes zxi-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .zxi-clickable-credit {
                position: fixed;
                bottom: 14px; right: 20px; font-size: 18px; font-weight: bold;
                font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;
                z-index: 2147483647; text-decoration: none; cursor: pointer;
                background: transparent; border: none; padding: 0; margin: 0;
                animation: zxi-rainbow-glow 3s linear infinite;
            }
            @keyframes zxi-rainbow-glow {
                0% { color: #ff0000; text-shadow: 0 0 6px #ff0000; }
                16% { color: #ff7f00; text-shadow: 0 0 6px #ff7f00; }
                33% { color: #ffff00; text-shadow: 0 0 6px #ffff00; }
                50% { color: #00ff00; text-shadow: 0 0 6px #00ff00; }
                66% { color: #00ffff; text-shadow: 0 0 6px #00ffff; }
                83% { color: #0000ff; text-shadow: 0 0 6px #0000ff; }
                100% { color: #8b00ff; text-shadow: 0 0 6px #8b00ff; }
            }
            
            .zxi-mode-btn {
                width: 100%; border: 1px solid rgba(0,255,204,0.3); padding: 12px;
                border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;
                letter-spacing: 1.5px; margin-bottom: 12px; color: #fff;
                transition: all 0.3s ease; text-transform: uppercase;
            }
            .zxi-btn-fast { background: linear-gradient(90deg, rgba(0,255,150,0.1), rgba(0,255,150,0.2)); border-color: #00ff96; box-shadow: 0 0 8px rgba(0,255,150,0.2); }
            .zxi-btn-fast:hover { background: #00ff96; color: #030712; box-shadow: 0 0 15px #00ff96; }
            
            .zxi-btn-secure { background: linear-gradient(90deg, rgba(255,170,0,0.1), rgba(255,170,0,0.2)); border-color: #ffaa00; box-shadow: 0 0 8px rgba(255,170,0,0.2); }
            .zxi-btn-secure:hover { background: #ffaa00; color: #030712; box-shadow: 0 0 15px #ffaa00; }
            
            .zxi-btn-plus { background: linear-gradient(90deg, rgba(255,0,128,0.1), rgba(255,0,128,0.2)); border-color: #ff0080; box-shadow: 0 0 8px rgba(255,0,128,0.2); }
            .zxi-btn-plus:hover { background: #ff0080; color: #fff; box-shadow: 0 0 15px #ff0080; }

            .zxi-btn-safe { background: linear-gradient(90deg, rgba(0,204,255,0.1), rgba(0,204,255,0.2)); border-color: #00ccff; box-shadow: 0 0 8px rgba(0,204,255,0.2); }
            .zxi-btn-safe:hover { background: #00ccff; color: #030712; box-shadow: 0 0 15px #00ccff; }

            .zxi-btn-main-choice { background: linear-gradient(90deg, rgba(0,255,204,0.1), rgba(0,255,204,0.2)); border-color: #00ffcc; box-shadow: 0 0 8px rgba(0,255,204,0.2); }
            .zxi-btn-main-choice:hover { background: #00ffcc; color: #030712; box-shadow: 0 0 15px #00ffcc; }

            .zxi-btn-proxy-choice { background: linear-gradient(90deg, rgba(139,0,255,0.1), rgba(139,0,255,0.2)); border-color: #8b00ff; box-shadow: 0 0 8px rgba(139,0,255,0.2); }
            .zxi-btn-proxy-choice:hover { background: #8b00ff; color: #fff; box-shadow: 0 0 15px #8b00ff; }
        `;
        document.head.appendChild(styleSheet);

        const creditLink = document.createElement('a');
        creditLink.id = 'zxi-floating-credit';
        creditLink.className = 'zxi-clickable-credit';
        creditLink.innerText = '@zxiowner';
        creditLink.href = userTelegram; 
        creditLink.target = '_blank';
        document.body.appendChild(creditLink);

        const musicBtn = document.createElement('button');
        musicBtn.id = 'zxi-music-btn';
        musicBtn.style.cssText = 'position:fixed; bottom:15px; left:15px; background:rgba(6,10,23,0.95); border:2px solid rgba(0,255,204,0.5); color:#ff4444; border-radius:50%; width:45px; height:45px; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 15px rgba(0,0,0,0.5); transition:all 0.3s ease; z-index:2147483647; outline:none;';
        musicBtn.textContent = '🔇';
        document.body.appendChild(musicBtn);

        const box = document.createElement('div');
        box.id = 'zxi-auth-box';
        box.style.cssText = _d.s;
        
        box.innerHTML = `
          <h3 style="margin:0 0 6px 0;color:#00ffcc;font-size:20px;letter-spacing:1.5px;font-weight:800;text-shadow:0 0 12px rgba(0,255,204,0.5); text-transform: uppercase;">${systemName} SYSTEM AUTH</h3>
          <p style="margin:0 0 20px 0;color:#64748b;font-size:11px;letter-spacing:2px;font-weight:600;">ENTER LICENSE KEY</p>
          <input type="text" id="zxi-key-input" placeholder="ENTER KEY HERE" style="width:100%;padding:12px;margin-bottom:16px;border:1px solid rgba(0,255,204,0.4);border-radius:8px;background:rgba(7,11,25,0.6);color:#fff;text-align:center;box-sizing:border-box;font-size:13px;font-weight:600;letter-spacing:1px;outline:none;transition:all 0.3s ease;box-shadow:inset 0 2px 4px rgba(0,0,0,0.5);">
          <button id="zxi-login-btn" style="width:100%;background:#00ffcc;color:#030712;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;letter-spacing:0.5px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,255,204,0.3);transition:all 0.2s ease;">VERIFY & RUN</button>
          <button id="zxi-telegram-btn" style="width:100%;background:#229ED9;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(34,158,217,0.25);">TELEGRAM</button>
          <div id="zxi-status" style="margin-top:16px;font-size:11px;font-weight:700;color:#64748b;letter-spacing:1.5px;">READY</div>
        `;
        document.body.appendChild(box);

        async function setupVisualizer() {
            if (audioContext) return;
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.smoothingTimeConstant = 0.3; 
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source = audioContext.createMediaElementSource(zxiAudio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            } catch(e) {
                console.error("Audio engine malfunction:", e);
            }
        }

        musicBtn.addEventListener('click', async () => {
            if (isMusicLoading) return;
            if (!zxiAudio) {
                try {
                    isMusicLoading = true; musicBtn.textContent = '⏳';
                    const res = await fetch(_d.m + '&t=' + Date.now());
                    const audioUrl = (await res.text()).trim();
                    if(audioUrl && audioUrl.startsWith('http')) {
                        const audioFetch = await fetch(audioUrl);
                        const blobUrl = URL.createObjectURL(await audioFetch.blob());
                        zxiAudio = new Audio(blobUrl); zxiAudio.loop = true; zxiAudio.crossOrigin = "anonymous";
                    } else { isMusicLoading = false; musicBtn.textContent = '🔇'; return; }
                } catch(err) { isMusicLoading = false; musicBtn.textContent = '🔇'; return; }
                isMusicLoading = false;
            }
            if (audioContext && audioContext.state === 'suspended') { await audioContext.resume(); }
            if (zxiAudio.paused) {
                await setupVisualizer();
                zxiAudio.play().then(() => {
                    musicBtn.textContent = '🔊'; musicBtn.style.color = '#00ffcc';
                    musicBtn.style.borderColor = '#00ffcc'; musicBtn.style.boxShadow = '0 0 15px rgba(0,255,204,0.6)';
                }).catch(err => {});
            } else {
                zxiAudio.pause(); musicBtn.textContent = '🔇'; musicBtn.style.color = '#ff4444';
                musicBtn.style.borderColor = 'rgba(0,255,204,0.5)'; musicBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
            }
        });

        const keyInput = document.getElementById('zxi-key-input');
        keyInput.addEventListener('focus', () => {
            keyInput.style.border = '1px solid #00ffcc';
            keyInput.style.boxShadow = '0 0 10px rgba(0,255,204,0.25), inset 0 2px 4px rgba(0,0,0,0.5)';
        });

        const loginBtn = document.getElementById('zxi-login-btn');
        const tgBtn = document.getElementById('zxi-telegram-btn');
        const statusDiv = document.getElementById('zxi-status');

        tgBtn.addEventListener('click', () => window.open(userTelegram, '_blank'));

        // ================== প্রিমিয়াম লোডিং স্ক্রিন (মেঘ, বজ্র, বৃষ্টি, রঙিন ঘূর্ণন) ==================
        function startVisualizerAnimation(selectedSeconds, redirectUrl) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%; 
                background:rgba(3,7,18,0.4); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:2147483647; 
                font-family:system-ui,-apple-system,sans-serif; overflow:hidden;
            `;

            overlay.innerHTML = `
                <canvas id="zxi-premium-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1;"></canvas>

                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; z-index:2;">
                    <div style="position:relative; width:320px; height:320px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                        <!-- ঘূর্ণায়মান রঙিন রিং -->
                        <div style="position:absolute; width:280px; height:280px; animation: zxi-premium-spin 4s linear infinite;">
                            <svg width="280" height="280" viewBox="0 0 280 280">
                                <circle cx="140" cy="140" r="120" fill="none" stroke="url(#grad1)" stroke-width="6" stroke-linecap="round" stroke-dasharray="200 400" />
                                <circle cx="140" cy="140" r="110" fill="none" stroke="url(#grad2)" stroke-width="4" stroke-linecap="round" stroke-dasharray="150 450" />
                                <circle cx="140" cy="140" r="130" fill="none" stroke="url(#grad3)" stroke-width="2" stroke-linecap="round" stroke-dasharray="100 500" />
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#ff0080" />
                                        <stop offset="50%" stop-color="#00ffcc" />
                                        <stop offset="100%" stop-color="#ffaa00" />
                                    </linearGradient>
                                    <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stop-color="#00ccff" />
                                        <stop offset="50%" stop-color="#ff00ff" />
                                        <stop offset="100%" stop-color="#00ff96" />
                                    </linearGradient>
                                    <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stop-color="#ff3300" />
                                        <stop offset="50%" stop-color="#ffff00" />
                                        <stop offset="100%" stop-color="#00ffff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <!-- মূল কাউন্টডাউন সার্কেল -->
                        <svg width="240" height="240" style="transform:rotate(-90deg); position:relative; z-index:3;">
                            <circle cx="120" cy="120" r="85" fill="rgba(6,10,23,0.94)" stroke="rgba(255,255,255,0.05)" stroke-width="10"></circle>
                            <circle id="progress" cx="120" cy="120" r="85" fill="none" stroke="#00ccff" stroke-width="10" stroke-dasharray="534" stroke-dashoffset="534" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear;"></circle>
                        </svg>
                        <div id="countdown-text" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:52px; font-weight:900; color:#fff; text-shadow:0 0 15px #00ccff; z-index:4;">${selectedSeconds}</div>
                    </div>
                    <p id="zxi-redirect-label" style="margin-top:20px; color:#00ccff; font-size:15px; font-weight:700; letter-spacing:3px; text-shadow:0 0 10px rgba(0,204,255,0.4);">REDIRECTING...</p>
                </div>
            `;
            document.body.appendChild(overlay);

            // অতিরিক্ত CSS অ্যানিমেশন
            const extraStyle = document.createElement('style');
            extraStyle.textContent = `
                @keyframes zxi-premium-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(extraStyle);

            const canvas = document.getElementById('zxi-premium-canvas');
            const ctx = canvas.getContext('2d');
            let width = window.innerWidth;
            let height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // মেঘের অ্যারে
            const clouds = [];
            for (let i = 0; i < 8; i++) {
                clouds.push({
                    x: Math.random() * width,
                    y: Math.random() * height * 0.4,
                    scale: Math.random() * 1.5 + 0.5,
                    speed: Math.random() * 0.8 + 0.2,
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }

            // বৃষ্টির ফোঁটা
            const raindrops = [];
            const MAX_DROPS = 250;
            for (let i = 0; i < MAX_DROPS; i++) {
                raindrops.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    length: Math.random() * 22 + 12,
                    speed: Math.random() * 18 + 12,
                    opacity: Math.random() * 0.6 + 0.3,
                    wind: Math.random() * 3 - 1.5,
                });
            }

            // বজ্রপাত ফ্ল্যাশ
            let lightningAlpha = 0;
            let lightningBoltPoints = [];
            let lightningVisible = false;

            function triggerLightning() {
                // আলোর ঝলক
                lightningAlpha = 0.9;
                lightningVisible = true;
                // বজ্ররেখার জন্য এলোমেলো পয়েন্ট
                lightningBoltPoints = [];
                let x = Math.random() * width;
                let y = -10;
                while (y < height * 0.6) {
                    lightningBoltPoints.push({ x, y });
                    x += Math.random() * 80 - 40;
                    y += Math.random() * 40 + 20;
                }
                setTimeout(() => { lightningAlpha = 0; lightningVisible = false; }, 150);
                setTimeout(() => { lightningAlpha = 0.6; }, 300);
                setTimeout(() => { lightningAlpha = 0; }, 450);
            }

            function scheduleLightning() {
                const delay = Math.random() * 3000 + 1500;
                setTimeout(() => {
                    triggerLightning();
                    scheduleLightning();
                }, delay);
            }
            scheduleLightning();

            function drawCloud(cloud) {
                ctx.save();
                ctx.globalAlpha = cloud.opacity;
                ctx.fillStyle = '#ffffff';
                ctx.filter = 'blur(8px)';
                // মেঘের আকার
                ctx.beginPath();
                ctx.arc(cloud.x, cloud.y, 40 * cloud.scale, 0, Math.PI * 2);
                ctx.arc(cloud.x + 50 * cloud.scale, cloud.y - 20 * cloud.scale, 50 * cloud.scale, 0, Math.PI * 2);
                ctx.arc(cloud.x + 100 * cloud.scale, cloud.y, 40 * cloud.scale, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            function drawRain() {
                animationFrameId = requestAnimationFrame(drawRain);
                ctx.clearRect(0, 0, width, height);

                // বজ্রপাতের আলো
                if (lightningAlpha > 0) {
                    ctx.fillStyle = `rgba(255,255,255,${lightningAlpha})`;
                    ctx.fillRect(0, 0, width, height);
                }

                // মেঘ আঁকা ও আপডেট
                for (const cloud of clouds) {
                    drawCloud(cloud);
                    cloud.x += cloud.speed;
                    if (cloud.x - 200 > width) {
                        cloud.x = -200;
                        cloud.y = Math.random() * height * 0.4;
                    }
                }

                // বজ্ররেখা আঁকা
                if (lightningVisible && lightningBoltPoints.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(lightningBoltPoints[0].x, lightningBoltPoints[0].y);
                    for (let i = 1; i < lightningBoltPoints.length; i++) {
                        ctx.lineTo(lightningBoltPoints[i].x, lightningBoltPoints[i].y);
                    }
                    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = 'white';
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // বৃষ্টি আঁকা
                for (const drop of raindrops) {
                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x + drop.wind * 4, drop.y + drop.length);
                    ctx.strokeStyle = `rgba(174,194,224,${drop.opacity})`;
                    ctx.lineWidth = 1.8;
                    ctx.stroke();

                    // অবস্থান আপডেট
                    drop.y += drop.speed;
                    drop.x += drop.wind * 1.5;
                    if (drop.y > height) {
                        drop.y = -drop.length;
                        drop.x = Math.random() * width;
                    }
                    if (drop.x > width + 50) drop.x = -50;
                    if (drop.x < -50) drop.x = width + 50;
                }

                // নিচের দিকে স্প্ল্যাশ ইফেক্ট (সামান্য সাদা রেখা)
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                for (let i = 0; i < 20; i++) {
                    const x = Math.random() * width;
                    const y = height - Math.random() * 5;
                    ctx.fillRect(x, y, Math.random() * 6, 1);
                }
            }
            drawRain();

            // রিসাইজ হ্যান্ডেল
            window.addEventListener('resize', () => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                raindrops.forEach(drop => {
                    drop.x = Math.random() * width;
                    drop.y = Math.random() * height;
                });
            });

            const progressRing = overlay.querySelector('#progress');
            const countdownText = overlay.querySelector('#countdown-text');
            let timeLeft = selectedSeconds;
            const circumference = 534;

            const timer = setInterval(() => {
                timeLeft--;
                countdownText.textContent = timeLeft;
                progressRing.style.strokeDashoffset = circumference * (timeLeft / selectedSeconds);

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    cancelAnimationFrame(animationFrameId);
                    if(zxiAudio) { zxiAudio.pause(); }
                    if(musicBtn) { musicBtn.remove(); }
                    overlay.remove();
                    window.location.replace(redirectUrl);
                }
            }, 1000);
        }

        function triggerAincradExecutionFlow(selectedSeconds, fileSourceUrl, isProxyMode = false) {
            box.remove();
            
            if (selectedSeconds === 50 || selectedSeconds === 80) {
                autoPlayMusicAndVisualizer();
            }

            const checkOverlay = document.createElement('div');
            checkOverlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%; 
                background:rgba(3,7,18,0.85); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); z-index:2147483647; 
                display:flex; align-items:center; justify-content:center; font-family:system-ui,-apple-system,sans-serif;
            `;
            checkOverlay.innerHTML = `
                <div style="text-align:center; background:rgba(6,10,23,0.95); padding:35px 30px; border-radius:16px; border:1px solid #00ffcc; width:290px; animation: zxi-lightning-glow 3s linear infinite;">
                    <div style="width: 45px; height: 45px; border: 4px solid rgba(0,254,204,0.1); border-top: 4px solid #00ffcc; border-radius: 50%; margin: 0 auto 20px auto; animation: zxi-spin 0.8s linear infinite;"></div>
                    <p id="zxi-check-text" style="color:#00ffcc; font-size:15px; font-weight:700; margin:0; letter-spacing:1.5px; text-shadow:0 0 8px rgba(0,255,204,0.3);">CHECKING UPDATE...</p>
                </div>
            `;
            document.body.appendChild(checkOverlay);

            setTimeout(async () => {
                let isUpdated = false;
                try {
                    const targetWorkerUrl = isProxyMode 
                        ? 'https://zxi.zxidesert.workers.dev/?mode=proxy' 
                        : 'https://zxi.zxidesert.workers.dev/';
                        
                    const workerRes = await fetch(targetWorkerUrl);
                    const workerText = await workerRes.text();
                    if (workerText.includes("GitHub Updated")) { isUpdated = true; }
                } catch (err) {}

                const checkTextNode = document.getElementById('zxi-check-text');
                if (isUpdated) {
                    checkTextNode.innerHTML = "<span style='color:#00ffcc;'>Link Updated Successfully! ✓</span>";
                } else {
                    checkTextNode.innerHTML = "<span style='color:#ff4444;'>No Update Available!</span>";
                }

                setTimeout(async () => {
                    checkOverlay.remove();
                    try {
                        const rResp = await fetch(fileSourceUrl + '&user=' + userIndex + '&t=' + Date.now()); 
                        const finalUrl = (await rResp.text()).trim();
                        if(finalUrl.startsWith('http')) { startVisualizerAnimation(selectedSeconds, finalUrl); }
                    } catch(err) { alert("REDIRECT ERROR!"); }
                }, 1500);
            }, 3500);
        }

        function triggerPowerZxPanel(engineMode) {
            const isPlus = engineMode === "powerplus";
            const titleText = isPlus ? "ALL EARNLINKS" : "ALL VPLINK'S";
            const subTitle = isPlus ? "SUPPORTED: EARNLINKS ONLY" : "SUPPORTED: VPLINK ONLY";
            const placeholderText = isPlus ? "https://earnlinks.in/..." : "https://vplink.in/...";

            box.innerHTML = `
                <button id="zxi-back-btn" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#64748b;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                <h3 style="margin:0 0 8px 0;color:#00ffcc;font-size:18px;font-weight:800;">${titleText}</h3>
                <p style="margin:0 0 20px 0;color:#64748b;font-size:10px;letter-spacing:1px;">${subTitle}</p>
                <input type="text" id="zxi-bypass-input" placeholder="${placeholderText}" style="width:100%;padding:12px;margin-bottom:16px;border:1px solid rgba(0,255,204,0.4);border-radius:8px;background:rgba(7,11,25,0.6);color:#fff;text-align:center;box-sizing:border-box;">
                <button id="zxi-fetch-bypass-btn" style="width:100%;background:#00ffcc;color:#030712;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;">START BYPASS</button>
                <div id="zxi-bypass-status" style="margin-top:16px;font-size:11px;font-weight:700;color:#64748b;">READY</div>
            `;
            document.getElementById('zxi-back-btn').addEventListener('click', showMainOptionsPanel);

            const bypassInput = document.getElementById('zxi-bypass-input');
            const fetchBtn = document.getElementById('zxi-fetch-bypass-btn');
            const bStatus = document.getElementById('zxi-bypass-status');

            fetchBtn.addEventListener('click', async () => {
                const urlVal = bypassInput.value.trim();
                
                if (isPlus) {
                    if (!urlVal || !urlVal.includes('earnlinks.in/')) {
                        bStatus.innerHTML = "<span style='color:#ff4444;'>INVALID LINK! URL MUST BE EARNLINKS.</span>"; return;
                    }
                } else {
                    if (!urlVal || !urlVal.includes('vplink.in/')) {
                        bStatus.innerHTML = "<span style='color:#ff4444;'>INVALID LINK! URL MUST BE VPLINK.</span>"; return;
                    }
                }

                bStatus.innerHTML = "<span style='color:#00ffcc;'>BYPASSING LINK VIA Zxi... PLEASE WAIT</span>";
                fetchBtn.disabled = true;

                try {
                    const response = await fetch(`${RAILWAY_SERVER_URL}/api/bypass?mode=${engineMode}&user=${userIndex}&url=${encodeURIComponent(urlVal)}`);
                    const data = await response.json();
                    
                    if (data && data.status === "success" && data.bypassed_url) {
                        bStatus.innerHTML = "<span style='color:#00ff96;'>BYPASS SUCCESSFUL! ✓</span>";
                        
                        fetchBtn.outerHTML = `<button id="zxi-copy-bypass-btn" style="width:100%;background:linear-gradient(90deg, #00ffcc, #00ccff);color:#030712;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 15px rgba(0,255,204,0.4);animation: zxi-lightning-glow 2s linear infinite;">📋 COPY BYPASS LINK</button>`;
                        
                        document.getElementById('zxi-copy-bypass-btn').addEventListener('click', () => {
                            const executeCopy = (text) => {
                                const tArea = document.createElement("textarea");
                                tArea.value = text; document.body.appendChild(tArea);
                                tArea.select(); document.execCommand("copy"); tArea.remove();
                            };
                            
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(data.bypassed_url).then(() => {
                                    alert("Link Copied Successfully!"); box.remove();
                                }).catch(() => {
                                    executeCopy(data.bypassed_url); alert("Link Copied Successfully!"); box.remove();
                                });
                            } else {
                                executeCopy(data.bypassed_url); alert("Link Copied Successfully!"); box.remove();
                            }
                        });
                    } else {
                        bStatus.innerHTML = "<span style='color:#ff4444;'>TRY AGAIN</span>"; fetchBtn.disabled = false;
                    }
                } catch (err) {
                    bStatus.innerHTML = "<span style='color:#ff4444;'>SERVER ERROR! TRY AGAIN</span>"; fetchBtn.disabled = false;
                }
            });
        }

        function showMainOptionsPanel() {
            box.innerHTML = `
                <h3 style="margin:0 0 8px 0;color:#00ffcc;font-size:18px;font-weight:800;">SELECT SYSTEM ENGINE</h3>
                <p style="margin:0 0 22px 0;color:#64748b;font-size:10px;letter-spacing:1px;">CHOOSE YOUR SPECIFIC MODULE</p>
                <button id="zxi-choice-aincrad" class="zxi-mode-btn zxi-btn-main-choice">❄️ Aincrad</button>
                <button id="zxi-choice-aincrad-proxy" class="zxi-mode-btn zxi-btn-proxy-choice">🛰️ Aincrad Proxy</button>
                <button id="zxi-choice-powerzx" class="zxi-mode-btn zxi-btn-secure">🔥 ALL VPLINK'S</button>
                <button id="zxi-choice-powerplus" class="zxi-mode-btn zxi-btn-plus">ALL EARNLINKS</button>
            `;

            document.getElementById('zxi-choice-aincrad').addEventListener('click', () => {
                box.innerHTML = `
                    <button id="zxi-back-to-main" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#64748b;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                    <h3 style="margin:0 0 8px 0;color:#00ffcc;font-size:18px;font-weight:800;">SELECT SYSTEM MODE</h3>
                    <p style="margin:0 0 22px 0;color:#64748b;font-size:10px;letter-spacing:1px;">CHOOSE SECURITY BYPASS METHOD</p>
                    <button id="zxi-btn-fast" class="zxi-mode-btn zxi-btn-fast">⚡ FAST MODE (25s)</button>
                    <button id="zxi-btn-secure" class="zxi-mode-btn zxi-btn-secure">🛡️ SECURE MODE (50s)</button>
                    <button id="zxi-btn-safe" class="zxi-mode-btn zxi-btn-safe">🔐 SAFE MODE (80s)</button>
                `;
                document.getElementById('zxi-back-to-main').addEventListener('click', showMainOptionsPanel);
                document.getElementById('zxi-btn-fast').addEventListener('click', () => triggerAincradExecutionFlow(25, _d.r, false));
                document.getElementById('zxi-btn-secure').addEventListener('click', () => triggerAincradExecutionFlow(50, _d.r, false));
                document.getElementById('zxi-btn-safe').addEventListener('click', () => triggerAincradExecutionFlow(80, _d.r, false));
            });

            document.getElementById('zxi-choice-aincrad-proxy').addEventListener('click', () => {
                box.innerHTML = `
                    <button id="zxi-back-to-main" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#64748b;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                    <h3 style="margin:0 0 8px 0;color:#8b00ff;font-size:18px;font-weight:800;">SELECT PROXY MODE</h3>
                    <p style="margin:0 0 22px 0;color:#64748b;font-size:10px;letter-spacing:1px;">CHOOSE PROXY BYPASS METHOD</p>
                    <button id="zxi-proxy-fast" class="zxi-mode-btn zxi-btn-fast">⚡ FAST PROXY (25s)</button>
                    <button id="zxi-proxy-secure" class="zxi-mode-btn zxi-btn-secure">🛡️ SECURE PROXY (50s)</button>
                    <button id="zxi-proxy-safe" class="zxi-mode-btn zxi-btn-safe">🔐 SAFE PROXY (80s)</button>
                `;
                document.getElementById('zxi-back-to-main').addEventListener('click', showMainOptionsPanel);
                document.getElementById('zxi-proxy-fast').addEventListener('click', () => triggerAincradExecutionFlow(25, _d.p, true));
                document.getElementById('zxi-proxy-secure').addEventListener('click', () => triggerAincradExecutionFlow(50, _d.p, true));
                document.getElementById('zxi-proxy-safe').addEventListener('click', () => triggerAincradExecutionFlow(80, _d.p, true));
            });

            document.getElementById('zxi-choice-powerzx').addEventListener('click', () => triggerPowerZxPanel("power"));
            document.getElementById('zxi-choice-powerplus').addEventListener('click', () => triggerPowerZxPanel("powerplus"));
        }

        loginBtn.addEventListener('click', () => {
            const inputKey = keyInput.value.trim();
            if(!inputKey) { statusDiv.innerHTML = "<span style='color:#ff4444;'>PLEASE INPUT KEY!</span>"; return; }
            statusDiv.innerHTML = "<span style='color:#00ffcc;'>CONNECTING SERVER...</span>";
            
            setTimeout(() => {
                if (correctPassword !== "" && inputKey === correctPassword) {
                    statusDiv.innerHTML = "<span style='color:#00ffcc;'>KEY VALIDATED! ✓</span>";
                    setTimeout(showMainOptionsPanel, 800);
                } else {
                    statusDiv.innerHTML = "<span style='color:#ff4444;'>INVALID LICENSE KEY!</span>";
                }
            }, 500);
        });
    })();
})();
