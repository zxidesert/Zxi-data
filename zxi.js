(function() {
    "use strict";

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
        // iOS / HyperOS Style Clean Glassmorphism Box
        s: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18, 18, 20, 0.65);backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);color:#fff;padding:35px 30px;border-radius:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,Helvetica,sans-serif;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.08);width:320px;box-sizing:border-box;animation: zxi-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);'
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
                    analyser.smoothingTimeConstant = 0.8; 
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
                        musicBtn.textContent = '🔊'; 
                        musicBtn.classList.add('playing');
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
            @keyframes zxi-fade-in {
                0% { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes zxi-rainbow-bg {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes zxi-spinner {
                to { transform: rotate(360deg); }
            }
            
            .zxi-clickable-credit {
                position: fixed; bottom: 18px; right: 24px; font-size: 14px; font-weight: 600;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing: 0.5px;
                z-index: 2147483647; text-decoration: none; cursor: pointer;
                color: rgba(255,255,255,0.6); transition: color 0.3s ease;
            }
            .zxi-clickable-credit:hover { color: #fff; }

            .zxi-music-btn {
                position: fixed; bottom: 20px; left: 20px; width: 44px; height: 44px;
                border-radius: 22px; background: rgba(20,20,22,0.7); backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 18px;
                display: flex; align-items: center; justify-content: center; cursor: pointer;
                z-index: 2147483647; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3); outline: none;
            }
            .zxi-music-btn:hover { background: rgba(30,30,35,0.8); transform: scale(1.05); }
            .zxi-music-btn.playing {
                border-color: transparent;
                background: linear-gradient(120deg, #ff007b, #7b00ff, #00d2ff);
                background-size: 200% 200%;
                animation: zxi-rainbow-bg 3s ease infinite;
                box-shadow: 0 0 15px rgba(123,0,255,0.4);
            }

            /* Animated Rainbow Border Button (iOS/Premium Style) */
            .zxi-premium-btn {
                position: relative; width: 100%; padding: 14px; margin-bottom: 12px;
                border-radius: 14px; font-weight: 600; cursor: pointer; font-size: 14px;
                letter-spacing: 0.5px; color: #fff; background: rgba(30, 30, 35, 0.6);
                border: none; outline: none; z-index: 1; transition: transform 0.2s ease, background 0.3s ease;
            }
            .zxi-premium-btn::before {
                content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
                border-radius: 16px; z-index: -1;
                background: linear-gradient(90deg, #ff0055, #ffaa00, #00ffcc, #7b00ff, #ff0055);
                background-size: 400%; animation: zxi-rainbow-bg 6s linear infinite;
                opacity: 0; transition: opacity 0.3s ease;
            }
            .zxi-premium-btn::after {
                content: ''; position: absolute; top: 1px; left: 1px; right: 1px; bottom: 1px;
                border-radius: 13px; background: rgba(25, 25, 28, 0.95); z-index: -1;
                backdrop-filter: blur(10px);
            }
            .zxi-premium-btn:hover { transform: translateY(-2px); }
            .zxi-premium-btn:hover::before { opacity: 1; }

            .zxi-input {
                width: 100%; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px; background: rgba(0,0,0,0.2); color: #fff; text-align: center;
                box-sizing: border-box; font-size: 15px; font-weight: 500; outline: none;
                transition: border-color 0.3s ease, background 0.3s ease;
            }
            .zxi-input:focus {
                border-color: rgba(255,255,255,0.4); background: rgba(0,0,0,0.3);
            }

            .zxi-title {
                margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: 1px;
                background: linear-gradient(90deg, #fff, #a1a1aa); -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .zxi-subtitle {
                margin: 0 0 24px 0; color: #a1a1aa; font-size: 12px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;
            }
            
            .zxi-loader {
                width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.1);
                border-top-color: #fff; border-radius: 50%; animation: zxi-spinner 0.8s linear infinite;
                margin: 0 auto 10px auto;
            }
        `;
        document.head.appendChild(styleSheet);

        const creditLink = document.createElement('a');
        creditLink.id = 'zxi-floating-credit';
        creditLink.className = 'zxi-clickable-credit';
        creditLink.innerText = '© ' + systemName;
        creditLink.href = userTelegram; 
        creditLink.target = '_blank';
        document.body.appendChild(creditLink);

        const musicBtn = document.createElement('button');
        musicBtn.id = 'zxi-music-btn';
        musicBtn.className = 'zxi-music-btn';
        musicBtn.textContent = '🔇';
        document.body.appendChild(musicBtn);

        const box = document.createElement('div');
        box.id = 'zxi-auth-box';
        box.style.cssText = _d.s;
        
        box.innerHTML = `
          <h3 class="zxi-title">${systemName}</h3>
          <p class="zxi-subtitle">Secure Authentication</p>
          <input type="password" id="zxi-key-input" class="zxi-input" placeholder="Enter License Key">
          <button id="zxi-login-btn" class="zxi-premium-btn">Authenticate</button>
          <button id="zxi-telegram-btn" class="zxi-premium-btn" style="opacity:0.8;">Join Telegram</button>
          <div id="zxi-status" style="margin-top:16px;font-size:12px;font-weight:500;color:#a1a1aa;">Awaiting Input</div>
        `;
        document.body.appendChild(box);

        async function setupVisualizer() {
            if (audioContext) return;
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.smoothingTimeConstant = 0.8; 
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source = audioContext.createMediaElementSource(zxiAudio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            } catch(e) {}
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
                    musicBtn.textContent = '🔊'; 
                    musicBtn.classList.add('playing');
                }).catch(err => {});
            } else {
                zxiAudio.pause(); 
                musicBtn.textContent = '🔇'; 
                musicBtn.classList.remove('playing');
            }
        });

        const keyInput = document.getElementById('zxi-key-input');
        const loginBtn = document.getElementById('zxi-login-btn');
        const tgBtn = document.getElementById('zxi-telegram-btn');
        const statusDiv = document.getElementById('zxi-status');

        tgBtn.addEventListener('click', () => window.open(userTelegram, '_blank'));

        // HyperOS / iOS Smooth Visualizer overlay
        function startVisualizerAnimation(selectedSeconds, redirectUrl) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%; 
                background:rgba(10,10,12,0.8); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); z-index:2147483647; 
                display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:-apple-system,BlinkMacSystemFont,sans-serif;
                animation: zxi-fade-in 0.5s ease;
            `;

            overlay.innerHTML = `
                <div style="position:relative; width:300px; height:300px; display:flex; align-items:center; justify-content:center;">
                    <canvas id="zxi-visualizer-canvas" width="300" height="300" style="position:absolute; top:0; left:0; z-index:2; pointer-events:none;"></canvas>
                    <svg width="200" height="200" style="transform:rotate(-90deg); position:relative; z-index:3;">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="4"></circle>
                        <circle id="progress" cx="100" cy="100" r="80" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="502" stroke-dashoffset="502" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear;"></circle>
                    </svg>
                    <div id="countdown-text" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:48px; font-weight:300; color:#fff; z-index:4;">${selectedSeconds}</div>
                </div>
                <p style="margin-top:30px; font-size:14px; font-weight:500; color:#a1a1aa; letter-spacing:2px; text-transform:uppercase;">Processing Request</p>
            `;
            document.body.appendChild(overlay);

            const canvas = document.getElementById('zxi-visualizer-canvas');
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = 110; 
            
            function drawCleanSpectrum() {
                animationFrameId = requestAnimationFrame(drawCleanSpectrum);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                let dynamicRadius = baseRadius;

                if (analyser && zxiAudio && !zxiAudio.paused) {
                    analyser.getByteFrequencyData(dataArray);
                    let avg = 0;
                    for(let b = 0; b < 10; b++) { avg += dataArray[b] || 0; }
                    avg = avg / 10;
                    dynamicRadius = baseRadius + (avg / 15);
                } else if (dataArray) { dataArray.fill(0); }

                const points = 64; 
                if (!dataArray) return;

                ctx.beginPath();
                for (let i = 0; i <= points; i++) {
                    const angle = (i / points) * Math.PI * 2;
                    let val = dataArray[i % (dataArray.length/2)] || 0;
                    let height = (val / 255) * 20; // Subtle height
                    
                    const r = dynamicRadius + height;
                    const x = centerX + Math.cos(angle) * r;
                    const y = centerY + Math.sin(angle) * r;
                    
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.lineWidth = 2; 
                ctx.strokeStyle = 'rgba(255,255,255,0.4)'; 
                ctx.stroke();
            }
            drawCleanSpectrum();

            let timeLeft = selectedSeconds;
            const progress = overlay.querySelector('#progress');
            const circumference = 502; // 2 * pi * 80

            const timer = setInterval(() => {
                timeLeft--;
                document.getElementById('countdown-text').textContent = timeLeft;
                progress.style.strokeDashoffset = circumference * (timeLeft / selectedSeconds);

                if (timeLeft <= 0) {
                    clearInterval(timer); cancelAnimationFrame(animationFrameId);
                    if(zxiAudio) { zxiAudio.pause(); }
                    if(musicBtn) { musicBtn.remove(); }
                    overlay.remove(); window.location.replace(redirectUrl);
                }
            }, 1000);
        }

        function triggerAincradExecutionFlow(selectedSeconds, fileSourceUrl, isProxyMode = false) {
            box.remove();
            
            if (selectedSeconds === 50 || selectedSeconds === 70) {
                autoPlayMusicAndVisualizer();
            }

            const checkOverlay = document.createElement('div');
            checkOverlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%; 
                background:rgba(10,10,12,0.8); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); z-index:2147483647; 
                display:flex; align-items:center; justify-content:center; font-family:-apple-system,sans-serif;
                animation: zxi-fade-in 0.3s ease;
            `;
            checkOverlay.innerHTML = `
                <div style="text-align:center;">
                    <div class="zxi-loader"></div>
                    <p id="zxi-check-text" style="font-size:14px; font-weight:500; color:#fff; margin-top:15px; letter-spacing:1px;">Securing Connection...</p>
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
                    checkTextNode.style.color = '#34d399';
                    checkTextNode.textContent = "Verified Successfully";
                } else {
                    checkTextNode.style.color = '#f87171';
                    checkTextNode.textContent = "No Update Found";
                }

                setTimeout(async () => {
                    checkOverlay.remove();
                    try {
                        const rResp = await fetch(fileSourceUrl + '&user=' + userIndex + '&t=' + Date.now()); 
                        const finalUrl = (await rResp.text()).trim();
                        if(finalUrl.startsWith('http')) { startVisualizerAnimation(selectedSeconds, finalUrl); }
                    } catch(err) { alert("Redirection Failed"); }
                }, 1000);
            }, 2500);
        }

        function triggerPowerZxPanel(engineMode) {
            const isPlus = engineMode === "powerplus";
            const titleText = isPlus ? "EarnLinks Engine" : "VPLink Engine";
            const placeholderText = isPlus ? "https://earnlinks.in/..." : "https://vplink.in/...";

            box.innerHTML = `
                <button id="zxi-back-btn" style="position:absolute;top:20px;left:20px;background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:18px;transition:color 0.2s;">❮</button>
                <h3 class="zxi-title">${titleText}</h3>
                <p class="zxi-subtitle">Direct Bypass Module</p>
                <input type="url" id="zxi-bypass-input" class="zxi-input" placeholder="${placeholderText}">
                <button id="zxi-fetch-bypass-btn" class="zxi-premium-btn" style="margin-bottom:0;">Initialize Bypass</button>
                <div id="zxi-bypass-status" style="margin-top:16px;font-size:12px;font-weight:500;color:#a1a1aa;">Ready</div>
            `;
            
            document.getElementById('zxi-back-btn').addEventListener('click', showMainOptionsPanel);
            document.getElementById('zxi-back-btn').addEventListener('mouseover', function(){this.style.color='#fff'});
            document.getElementById('zxi-back-btn').addEventListener('mouseout', function(){this.style.color='#a1a1aa'});

            const bypassInput = document.getElementById('zxi-bypass-input');
            const fetchBtn = document.getElementById('zxi-fetch-bypass-btn');
            const bStatus = document.getElementById('zxi-bypass-status');

            fetchBtn.addEventListener('click', async () => {
                const urlVal = bypassInput.value.trim();
                
                if (isPlus) {
                    if (!urlVal || !urlVal.includes('earnlinks.in/')) {
                        bStatus.innerHTML = "<span style='color:#f87171;'>Invalid Domain. Use EarnLinks.</span>"; return;
                    }
                } else {
                    if (!urlVal || !urlVal.includes('vplink.in/')) {
                        bStatus.innerHTML = "<span style='color:#f87171;'>Invalid Domain. Use VPLink.</span>"; return;
                    }
                }

                bStatus.innerHTML = "<div class='zxi-loader' style='width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin:0 8px 0 0;'></div>Processing...";
                fetchBtn.disabled = true;
                fetchBtn.style.opacity = '0.5';

                try {
                    const response = await fetch(`${RAILWAY_SERVER_URL}/api/bypass?mode=${engineMode}&user=${userIndex}&url=${encodeURIComponent(urlVal)}`);
                    const data = await response.json();
                    
                    if (data && data.status === "success" && data.bypassed_url) {
                        bStatus.innerHTML = "<span style='color:#34d399;'>Bypass Successful</span>";
                        
                        fetchBtn.outerHTML = `<button id="zxi-copy-bypass-btn" class="zxi-premium-btn" style="margin-bottom:0; background:rgba(255,255,255,0.1);">Copy Destination URL</button>`;
                        
                        document.getElementById('zxi-copy-bypass-btn').addEventListener('click', () => {
                            const executeCopy = (text) => {
                                const tArea = document.createElement("textarea");
                                tArea.value = text; document.body.appendChild(tArea);
                                tArea.select(); document.execCommand("copy"); tArea.remove();
                            };
                            
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(data.bypassed_url).then(() => {
                                    alert("Copied to clipboard"); box.remove();
                                }).catch(() => {
                                    executeCopy(data.bypassed_url); alert("Copied to clipboard"); box.remove();
                                });
                            } else {
                                executeCopy(data.bypassed_url); alert("Copied to clipboard"); box.remove();
                            }
                        });
                    } else {
                        bStatus.innerHTML = "<span style='color:#f87171;'>Bypass Failed. Retry.</span>"; 
                        fetchBtn.disabled = false; fetchBtn.style.opacity = '1';
                    }
                } catch (err) {
                    bStatus.innerHTML = "<span style='color:#f87171;'>Connection Error</span>"; 
                    fetchBtn.disabled = false; fetchBtn.style.opacity = '1';
                }
            });
        }

        function showMainOptionsPanel() {
            box.innerHTML = `
                <h3 class="zxi-title">Dashboard</h3>
                <p class="zxi-subtitle">Select Execution Module</p>
                <button id="zxi-choice-aincrad" class="zxi-premium-btn">Aincrad Core</button>
                <button id="zxi-choice-aincrad-proxy" class="zxi-premium-btn">Aincrad Proxy</button>
                <button id="zxi-choice-powerzx" class="zxi-premium-btn">VPLink Tool</button>
                <button id="zxi-choice-powerplus" class="zxi-premium-btn" style="margin-bottom:0;">EarnLinks Tool</button>
            `;

            document.getElementById('zxi-choice-aincrad').addEventListener('click', () => {
                box.innerHTML = `
                    <button id="zxi-back-to-main" style="position:absolute;top:20px;left:20px;background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:18px;">❮</button>
                    <h3 class="zxi-title">Aincrad</h3>
                    <p class="zxi-subtitle">Protocol Selection</p>
                    <button id="zxi-btn-fast" class="zxi-premium-btn">Fast (25s)</button>
                    <button id="zxi-btn-secure" class="zxi-premium-btn">Secure (50s)</button>
                    <button id="zxi-btn-safe" class="zxi-premium-btn" style="margin-bottom:0;">Safe (70s)</button>
                `;
                document.getElementById('zxi-back-to-main').addEventListener('click', showMainOptionsPanel);
                document.getElementById('zxi-btn-fast').addEventListener('click', () => triggerAincradExecutionFlow(25, _d.r, false));
                document.getElementById('zxi-btn-secure').addEventListener('click', () => triggerAincradExecutionFlow(50, _d.r, false));
                document.getElementById('zxi-btn-safe').addEventListener('click', () => triggerAincradExecutionFlow(70, _d.r, false));
            });

            document.getElementById('zxi-choice-aincrad-proxy').addEventListener('click', () => {
                box.innerHTML = `
                    <button id="zxi-back-to-main" style="position:absolute;top:20px;left:20px;background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:18px;">❮</button>
                    <h3 class="zxi-title">Proxy Core</h3>
                    <p class="zxi-subtitle">Protocol Selection</p>
                    <button id="zxi-proxy-fast" class="zxi-premium-btn">Fast Proxy (25s)</button>
                    <button id="zxi-proxy-secure" class="zxi-premium-btn">Secure Proxy (50s)</button>
                    <button id="zxi-proxy-safe" class="zxi-premium-btn" style="margin-bottom:0;">Safe Proxy (70s)</button>
                `;
                document.getElementById('zxi-back-to-main').addEventListener('click', showMainOptionsPanel);
                document.getElementById('zxi-proxy-fast').addEventListener('click', () => triggerAincradExecutionFlow(25, _d.p, true));
                document.getElementById('zxi-proxy-secure').addEventListener('click', () => triggerAincradExecutionFlow(50, _d.p, true));
                document.getElementById('zxi-proxy-safe').addEventListener('click', () => triggerAincradExecutionFlow(70, _d.p, true));
            });

            document.getElementById('zxi-choice-powerzx').addEventListener('click', () => triggerPowerZxPanel("power"));
            document.getElementById('zxi-choice-powerplus').addEventListener('click', () => triggerPowerZxPanel("powerplus"));
        }

        loginBtn.addEventListener('click', () => {
            const inputKey = keyInput.value.trim();
            if(!inputKey) { statusDiv.innerHTML = "<span style='color:#f87171;'>Key required</span>"; return; }
            statusDiv.innerHTML = "<div class='zxi-loader' style='width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin:0 6px 0 0;'></div>Authenticating...";
            
            setTimeout(() => {
                if (correctPassword !== "" && inputKey === correctPassword) {
                    statusDiv.innerHTML = "<span style='color:#34d399;'>Access Granted</span>";
                    setTimeout(showMainOptionsPanel, 600);
                } else {
                    statusDiv.innerHTML = "<span style='color:#f87171;'>Invalid License Key</span>";
                }
            }, 800);
        });
    })();
})();
