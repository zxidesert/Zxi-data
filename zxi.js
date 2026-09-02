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
        s: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle at center, rgba(12,18,34,0.98) 0%, rgba(4,7,15,0.99) 100%);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);color:#fff;padding:32px 26px;border-radius:20px;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,0.75), inset 0 0 15px rgba(255,255,255,0.03);border:2px solid transparent;width:310px;box-sizing:border-box;animation: zxi-rainbow-border 4s linear infinite, zxi-box-float 6s ease-in-out infinite;'
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
                        musicBtn.textContent = '🔊'; musicBtn.style.color = '#ff00ff';
                        musicBtn.style.borderColor = '#ff00ff'; musicBtn.style.boxShadow = '0 0 20px rgba(255,0,255,0.5)';
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
            @keyframes zxi-rainbow-border {
                0% { border-color: #ff0000; box-shadow: 0 0 25px rgba(255,0,0,0.4), inset 0 0 15px rgba(255,0,0,0.15); }
                16% { border-color: #ff7f00; box-shadow: 0 0 25px rgba(255,127,0,0.4), inset 0 0 15px rgba(255,127,0,0.15); }
                33% { border-color: #ffff00; box-shadow: 0 0 25px rgba(255,255,0,0.4), inset 0 0 15px rgba(255,255,0,0.15); }
                50% { border-color: #00ff00; box-shadow: 0 0 25px rgba(0,255,0,0.4), inset 0 0 15px rgba(0,255,0,0.15); }
                66% { border-color: #00ffff; box-shadow: 0 0 25px rgba(0,255,255,0.4), inset 0 0 15px rgba(0,255,255,0.15); }
                83% { border-color: #0000ff; box-shadow: 0 0 25px rgba(0,0,255,0.4), inset 0 0 15px rgba(0,0,255,0.15); }
                100% { border-color: #ff00ff; box-shadow: 0 0 25px rgba(255,0,255,0.4), inset 0 0 15px rgba(255,0,255,0.15); }
            }
            @keyframes zxi-rainbow-text {
                0% { color: #ff0000; text-shadow: 0 0 12px rgba(255,0,0,0.7); }
                16% { color: #ff7f00; text-shadow: 0 0 12px rgba(255,127,0,0.7); }
                33% { color: #ffff00; text-shadow: 0 0 12px rgba(255,255,0,0.7); }
                50% { color: #00ff00; text-shadow: 0 0 12px rgba(0,255,0,0.7); }
                66% { color: #00ffff; text-shadow: 0 0 12px rgba(0,255,255,0.7); }
                83% { color: #0000ff; text-shadow: 0 0 12px rgba(0,0,255,0.7); }
                100% { color: #ff00ff; text-shadow: 0 0 12px rgba(255,0,255,0.7); }
            }
            @keyframes zxi-box-float {
                0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                50% { transform: translate(-50%, -50%) translateY(-5px); }
            }
            @keyframes zxi-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes zxi-fire-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
            
            .zxi-clickable-credit {
                position: fixed;
                bottom: 14px; right: 20px; font-size: 18px; font-weight: bold;
                font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;
                z-index: 2147483647; text-decoration: none; cursor: pointer;
                background: transparent; border: none; padding: 0; margin: 0;
                animation: zxi-rainbow-text 3s linear infinite;
            }
            
            .zxi-mode-btn {
                position: relative; width: 100%; border: 2px solid transparent; padding: 13px;
                border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 13px;
                letter-spacing: 1.5px; margin-bottom: 12px; color: #fff; background: rgba(10,15,30,0.85);
                transition: all 0.3s ease; text-transform: uppercase; overflow: hidden;
                animation: zxi-rainbow-border 3s linear infinite;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            }
            .zxi-mode-btn:hover {
                transform: scale(1.02);
                background: rgba(255,255,255,0.1);
            }
            
            .zxi-rainbow-title {
                animation: zxi-rainbow-text 3s linear infinite;
            }
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
        musicBtn.style.cssText = 'position:fixed; bottom:15px; left:15px; background:rgba(10,15,30,0.9); border:2px solid #ff00ff; color:#ff4444; border-radius:50%; width:48px; height:48px; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(0,0,0,0.6), 0 0 15px rgba(255,0,255,0.3); transition:all 0.3s ease; z-index:2147483647; outline:none; animation: zxi-rainbow-border 4s linear infinite;';
        musicBtn.textContent = '🔇';
        document.body.appendChild(musicBtn);

        const box = document.createElement('div');
        box.id = 'zxi-auth-box';
        box.style.cssText = _d.s;
        
        box.innerHTML = `
          <h3 class="zxi-rainbow-title" style="margin:0 0 6px 0;font-size:21px;letter-spacing:2px;font-weight:900; text-transform: uppercase;">${systemName} SYSTEM</h3>
          <p style="margin:0 0 20px 0;color:#94a3b8;font-size:11px;letter-spacing:2.5px;font-weight:700;">PREMIUM AUTHENTICATION</p>
          <input type="text" id="zxi-key-input" placeholder="ENTER LICENSE KEY" style="width:100%;padding:13px;margin-bottom:16px;border:2px solid transparent;border-radius:12px;background:rgba(5,8,18,0.75);color:#fff;text-align:center;box-sizing:border-box;font-size:13px;font-weight:700;letter-spacing:1px;outline:none;transition:all 0.3s ease;animation: zxi-rainbow-border 4s linear infinite;box-shadow:inset 0 2px 6px rgba(0,0,0,0.6);">
          <button id="zxi-login-btn" class="zxi-mode-btn" style="margin-bottom:12px; background:linear-gradient(135deg, rgba(255,0,128,0.2), rgba(0,255,204,0.2));">VERIFY & RUN</button>
          <button id="zxi-telegram-btn" style="width:100%;background:rgba(34,158,217,0.2);color:#229ED9;border:2px solid #229ED9;padding:12px;border-radius:12px;font-weight:800;cursor:pointer;font-size:13px;letter-spacing:1px;box-shadow:0 4px 15px rgba(34,158,217,0.3);transition:all 0.3s ease;">TELEGRAM CHANNEL</button>
          <div id="zxi-status" style="margin-top:16px;font-size:11px;font-weight:800;color:#94a3b8;letter-spacing:2px;">SYSTEM READY</div>
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
                    musicBtn.textContent = '🔊'; musicBtn.style.color = '#ff00ff';
                    musicBtn.style.borderColor = '#ff00ff'; musicBtn.style.boxShadow = '0 0 20px rgba(255,0,255,0.6)';
                }).catch(err => {});
            } else {
                zxiAudio.pause(); musicBtn.textContent = '🔇'; musicBtn.style.color = '#ff4444';
            }
        });

        const keyInput = document.getElementById('zxi-key-input');
        const loginBtn = document.getElementById('zxi-login-btn');
        const tgBtn = document.getElementById('zxi-telegram-btn');
        const statusDiv = document.getElementById('zxi-status');

        tgBtn.addEventListener('click', () => window.open(userTelegram, '_blank'));

        function startVisualizerAnimation(selectedSeconds, redirectUrl) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%; 
                background:rgba(4,7,15,0.7); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); z-index:2147483647; 
                display:flex; align-items:center; justify-content:center; font-family:system-ui,-apple-system,sans-serif;
            `;

            overlay.innerHTML = `
                <div style="text-align:center; position:relative;">
                    <div style="position:relative; width:400px; height:400px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                        <canvas id="zxi-visualizer-canvas" width="400" height="400" style="position:absolute; top:0; left:0; z-index:2; pointer-events:none;"></canvas>
                        <div id="zxi-glow-core" style="position:absolute; top:50%; left:50%; width:180px; height:180px; border-radius:50%; background:conic-gradient(transparent 0deg, #ff0055 90deg, #ffaa00 180deg, #00ffcc 270deg, transparent 360deg); filter: blur(25px); opacity:0.5; animation: zxi-fire-spin 4s linear infinite; z-index:1;"></div>
                        <svg width="240" height="240" style="transform:rotate(-90deg); position:relative; z-index:3;">
                            <circle cx="120" cy="120" r="85" fill="rgba(8,12,24,0.95)" stroke="rgba(255,255,255,0.05)" stroke-width="10"></circle>
                            <circle id="progress" cx="120" cy="120" r="85" fill="none" stroke="#ff00ff" stroke-width="10" stroke-dasharray="534" stroke-dashoffset="534" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear;"></circle>
                        </svg>
                        <div id="countdown-text" class="zxi-rainbow-title" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:52px; font-weight:900; z-index:4;">${selectedSeconds}</div>
                    </div>
                    <p id="zxi-redirect-label" class="zxi-rainbow-title" style="margin-top:20px; font-size:15px; font-weight:800; letter-spacing:3px; position:relative; z-index:4;">REDIRECTING...</p>
                </div>
            `;
            document.body.appendChild(overlay);

            const canvas = document.getElementById('zxi-visualizer-canvas');
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = 88; 
            let colorHue = 0; 
            
            const progressRing = overlay.querySelector('#progress');

            function drawSpectrum() {
                animationFrameId = requestAnimationFrame(drawSpectrum);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                colorHue = (colorHue + 1.5) % 360; 
                const currentNeonColor = `hsl(${colorHue}, 100%, 60%)`;
                let dynamicRadiusPulse = baseRadius;

                if (analyser && zxiAudio && !zxiAudio.paused) {
                    analyser.getByteFrequencyData(dataArray);
                    let lowBass = 0;
                    for(let b = 0; b < 5; b++) { lowBass += dataArray[b] || 0; }
                    lowBass = lowBass / 5;
                    dynamicRadiusPulse = baseRadius + (lowBass / 12);
                } else if (dataArray) { dataArray.fill(0); }

                const totalPoints = 56; 
                if (!dataArray) return;

                progressRing.style.stroke = currentNeonColor;
                progressRing.style.filter = `drop-shadow(0 0 12px ${currentNeonColor})`;

                ctx.beginPath();
                for (let i = 0; i <= totalPoints; i++) {
                    const angle = (i / totalPoints) * Math.PI * 2;
                    let mirrorAngle = (i % (totalPoints / 4)) / (totalPoints / 4) * Math.PI * 0.5;
                    let baseIdx = Math.floor(Math.sin(mirrorAngle) * (dataArray.length * 0.65));
                    let sideIdx = (baseIdx + 2) % dataArray.length;
                    let blendedVal = ((dataArray[baseIdx] || 0) * 0.7) + ((dataArray[sideIdx] || 0) * 0.3);
                    
                    let normalized = blendedVal / 255;
                    let boostedVal = Math.min(255, Math.pow(normalized, 1.1) * 255 * 5.8);

                    const iSpikeTip = (i % 2 === 0); 
                    let sharpHeight = iSpikeTip ? (5 + ((boostedVal / 255) * 47)) : (-3 + ((boostedVal / 255) * 4));
                    const finalPointsRadius = dynamicRadiusPulse + sharpHeight;

                    const x = centerX + Math.cos(angle) * finalPointsRadius;
                    const y = centerY + Math.sin(angle) * finalPointsRadius;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.lineWidth = 3.8; ctx.lineCap = 'square'; ctx.lineJoin = 'miter'; ctx.miterLimit = 4;
                ctx.strokeStyle = currentNeonColor; ctx.shadowBlur = 15; ctx.shadowColor = currentNeonColor;
                ctx.stroke();
                ctx.shadowBlur = 0; 
            }
            drawSpectrum();

            let timeLeft = selectedSeconds;
            const progress = overlay.querySelector('#progress');
            const circumference = 534;

            const timer = setInterval(() => {
                timeLeft--;
                countdownText.textContent = timeLeft;
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
                background:rgba(4,7,15,0.85); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); z-index:2147483647; 
                display:flex; align-items:center; justify-content:center; font-family:system-ui,-apple-system,sans-serif;
            `;
            checkOverlay.innerHTML = `
                <div style="text-align:center; background:rgba(10,15,30,0.95); padding:35px 30px; border-radius:20px; width:300px; animation: zxi-rainbow-border 4s linear infinite;">
                    <div style="width: 45px; height: 45px; border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #ff00ff; border-radius: 50%; margin: 0 auto 20px auto; animation: zxi-spin 0.8s linear infinite;"></div>
                    <p id="zxi-check-text" class="zxi-rainbow-title" style="font-size:15px; font-weight:800; margin:0; letter-spacing:1.5px;">CHECKING SYSTEM...</p>
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
                    checkTextNode.innerHTML = "<span class='zxi-rainbow-title'>Link Updated Successfully! ✓</span>";
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
                <button id="zxi-back-btn" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                <h3 class="zxi-rainbow-title" style="margin:0 0 8px 0;font-size:19px;font-weight:900;">${titleText}</h3>
                <p style="margin:0 0 20px 0;color:#94a3b8;font-size:10px;letter-spacing:1px;">${subTitle}</p>
                <input type="text" id="zxi-bypass-input" placeholder="${placeholderText}" style="width:100%;padding:13px;margin-bottom:16px;border:2px solid transparent;border-radius:12px;background:rgba(5,8,18,0.75);color:#fff;text-align:center;box-sizing:border-box;animation: zxi-rainbow-border 4s linear infinite;">
                <button id="zxi-fetch-bypass-btn" class="zxi-mode-btn" style="margin-bottom:0;">START BYPASS</button>
                <div id="zxi-bypass-status" style="margin-top:16px;font-size:11px;font-weight:800;color:#94a3b8;letter-spacing:1px;">READY</div>
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

                bStatus.innerHTML = "<span class='zxi-rainbow-title'>BYPASSING LINK... PLEASE WAIT</span>";
                fetchBtn.disabled = true;

                try {
                    const response = await fetch(`${RAILWAY_SERVER_URL}/api/bypass?mode=${engineMode}&user=${userIndex}&url=${encodeURIComponent(urlVal)}`);
                    const data = await response.json();
                    
                    if (data && data.status === "success" && data.bypassed_url) {
                        bStatus.innerHTML = "<span style='color:#00ff96;'>BYPASS SUCCESSFUL! ✓</span>";
                        
                        fetchBtn.outerHTML = `<button id="zxi-copy-bypass-btn" class="zxi-mode-btn" style="margin-bottom:0; background:linear-gradient(135deg, #00ffcc, #00ccff); color:#030712;">📋 COPY BYPASS LINK</button>`;
                        
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
                <h3 class="zxi-rainbow-title" style="margin:0 0 8px 0;font-size:19px;font-weight:900;">SYSTEM ENGINE</h3>
                <p style="margin:0 0 20px 0;color:#94a3b8;font-size:10px;letter-spacing:1px;">CHOOSE YOUR SPECIFIC MODULE</p>
                <button id="zxi-choice-aincrad" class="zxi-mode-btn">❄️ Aincrad</button>
                <button id="zxi-choice-aincrad-proxy" class="zxi-mode-btn">🛰️ Aincrad Proxy</button>
                <button id="zxi-choice-powerzx" class="zxi-mode-btn">🔥 ALL VPLINK'S</button>
                <button id="zxi-choice-powerplus" class="zxi-mode-btn" style="margin-bottom:0;">ALL EARNLINKS</button>
            `;

            document.getElementById('zxi-choice-aincrad').addEventListener('click', () => {
                box.innerHTML = `
                    <button id="zxi-back-to-main" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                    <h3 class="zxi-rainbow-title" style="margin:0 0 8px 0;font-size:19px;font-weight:900;">AINCRAD MODE</h3>
                    <p style="margin:0 0 20px 0;color:#94a3b8;font-size:10px;letter-spacing:1px;">CHOOSE SECURITY BYPASS METHOD</p>
                    <button id="zxi-btn-fast" class="zxi-mode-btn">⚡ FAST MODE (25s)</button>
                    <button id="zxi-btn-secure" class="zxi-mode-btn">🛡️ SECURE MODE (50s)</button>
                    <button id="zxi-btn-safe" class="zxi-mode-btn" style="margin-bottom:0;">🔐 SAFE MODE (70s)</button>
                `;
                document.getElementById('zxi-back-to-main').addEventListener('click', showMainOptionsPanel);
                document.getElementById('zxi-btn-fast').addEventListener('click', () => triggerAincradExecutionFlow(25, _d.r, false));
                document.getElementById('zxi-btn-secure').addEventListener('click', () => triggerAincradExecutionFlow(50, _d.r, false));
                document.getElementById('zxi-btn-safe').addEventListener('click', () => triggerAincradExecutionFlow(70, _d.r, false));
            });

            document.getElementById('zxi-choice-aincrad-proxy').addEventListener('click', () => {
                box.innerHTML = `
                    <button id="zxi-back-to-main" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                    <h3 class="zxi-rainbow-title" style="margin:0 0 8px 0;font-size:19px;font-weight:900;">PROXY MODE</h3>
                    <p style="margin:0 0 20px 0;color:#94a3b8;font-size:10px;letter-spacing:1px;">CHOOSE PROXY BYPASS METHOD</p>
                    <button id="zxi-proxy-fast" class="zxi-mode-btn">⚡ FAST PROXY (25s)</button>
                    <button id="zxi-proxy-secure" class="zxi-mode-btn">🛡️ SECURE PROXY (50s)</button>
                    <button id="zxi-proxy-safe" class="zxi-mode-btn" style="margin-bottom:0;">🔐 SAFE PROXY (70s)</button>
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
            if(!inputKey) { statusDiv.innerHTML = "<span style='color:#ff4444;'>PLEASE INPUT KEY!</span>"; return; }
            statusDiv.innerHTML = "<span class='zxi-rainbow-title'>CONNECTING SERVER...</span>";
            
            setTimeout(() => {
                if (correctPassword !== "" && inputKey === correctPassword) {
                    statusDiv.innerHTML = "<span style='color:#00ff96;'>KEY VALIDATED! ✓</span>";
                    setTimeout(showMainOptionsPanel, 800);
                } else {
                    statusDiv.innerHTML = "<span style='color:#ff4444;'>INVALID LICENSE KEY!</span>";
                }
            }, 500);
        });
    })();
})();
