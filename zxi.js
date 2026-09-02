(function() {
    "use strict";

    // ========== CONFIG ==========
    const RAILWAY_SERVER_URL = "https://zxi-file-loader.ah4734536.workers.dev";
    const sKey = "Hey";
    const _d = {
        r: `${RAILWAY_SERVER_URL}/?file=zxi.txt&key=${sKey}`,
        p: `${RAILWAY_SERVER_URL}/?file=zx.txt&key=${sKey}`,
        t: `${RAILWAY_SERVER_URL}/?file=button.txt`,
        m: `${RAILWAY_SERVER_URL}/?file=music.txt`,
        n: `${RAILWAY_SERVER_URL}/?file=name.txt`,
    };

    // ========== USER DETECTION ==========
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

    // ========== STATE ==========
    let zxiAudio = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let animationFrameId = null;
    let isMusicLoading = false;

    // ========== CYBERPUNK TERMINAL STYLES ==========
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        :root {
            --zxi-bg: #0a0a0a;
            --zxi-panel: rgba(0, 20, 20, 0.85);
            --zxi-border: #00ffcc;
            --zxi-text: #00ffcc;
            --zxi-dim: #008877;
            --zxi-glow: 0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 40px #00ffcc;
            --zxi-font: 'Courier New', 'Fira Code', monospace;
        }

        * {
            box-sizing: border-box;
        }

        @keyframes zxi-scanline {
            0% { top: -100%; }
            100% { top: 100%; }
        }
        @keyframes zxi-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
        }
        @keyframes zxi-border-pulse {
            0%, 100% { border-color: #00ffcc; box-shadow: 0 0 10px #00ffcc; }
            50% { border-color: #00cc99; box-shadow: 0 0 20px #00cc99; }
        }
        @keyframes zxi-text-glow {
            0%, 100% { text-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc; }
            50% { text-shadow: 0 0 15px #00ffcc, 0 0 30px #00ffcc; }
        }
        @keyframes zxi-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .zxi-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: var(--zxi-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            font-family: var(--zxi-font);
            overflow: hidden;
            animation: zxi-flicker 5s infinite;
        }

        /* Scanline overlay */
        .zxi-overlay::before {
            content: '';
            position: absolute;
            top: -100%;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                to bottom,
                transparent 0px,
                transparent 2px,
                rgba(0, 255, 204, 0.03) 2px,
                rgba(0, 255, 204, 0.03) 4px
            );
            animation: zxi-scanline 8s linear infinite;
            pointer-events: none;
        }

        .zxi-terminal {
            background: var(--zxi-panel);
            border: 2px solid var(--zxi-border);
            border-radius: 4px;
            padding: 24px;
            width: 360px;
            max-width: 90vw;
            box-shadow: var(--zxi-glow), inset 0 0 20px rgba(0,255,204,0.1);
            position: relative;
            animation: zxi-border-pulse 3s infinite;
        }

        .zxi-title {
            font-size: 26px;
            font-weight: bold;
            color: var(--zxi-text);
            text-align: center;
            letter-spacing: 4px;
            margin: 0 0 6px;
            text-transform: uppercase;
            animation: zxi-text-glow 2s infinite;
        }

        .zxi-subtitle {
            font-size: 11px;
            color: var(--zxi-dim);
            text-align: center;
            letter-spacing: 3px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .zxi-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid var(--zxi-border);
            border-radius: 2px;
            color: var(--zxi-text);
            font-family: var(--zxi-font);
            font-size: 14px;
            text-align: center;
            outline: none;
            margin-bottom: 16px;
            transition: all 0.2s;
        }
        .zxi-input:focus {
            border-color: #ffffff;
            box-shadow: 0 0 15px rgba(0,255,204,0.5);
        }
        .zxi-input::placeholder {
            color: rgba(0,255,204,0.4);
        }

        .zxi-btn {
            width: 100%;
            padding: 12px;
            background: transparent;
            border: 1px solid var(--zxi-border);
            color: var(--zxi-text);
            font-family: var(--zxi-font);
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 2px;
            cursor: pointer;
            border-radius: 2px;
            margin-bottom: 10px;
            transition: all 0.3s;
            text-transform: uppercase;
        }
        .zxi-btn:hover {
            background: rgba(0,255,204,0.1);
            box-shadow: 0 0 15px rgba(0,255,204,0.5);
        }
        .zxi-btn-primary {
            background: rgba(0,255,204,0.2);
            border-color: #00ffcc;
            box-shadow: 0 0 10px rgba(0,255,204,0.3);
        }
        .zxi-btn-danger {
            border-color: #ff0055;
            color: #ff0055;
        }
        .zxi-btn-telegram {
            border-color: #229ED9;
            color: #229ED9;
        }

        .zxi-status {
            font-size: 10px;
            color: var(--zxi-dim);
            text-align: center;
            letter-spacing: 1px;
            min-height: 18px;
            margin-top: 8px;
            text-transform: uppercase;
        }

        .zxi-back-btn {
            position: absolute;
            top: 12px;
            left: 12px;
            background: none;
            border: none;
            color: var(--zxi-dim);
            font-size: 18px;
            cursor: pointer;
            font-family: var(--zxi-font);
        }

        .zxi-music-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(0,20,20,0.8);
            border: 1px solid var(--zxi-border);
            color: var(--zxi-text);
            font-size: 18px;
            cursor: pointer;
            z-index: 2147483647;
            box-shadow: 0 0 10px rgba(0,255,204,0.5);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--zxi-font);
        }
        .zxi-music-btn:hover {
            background: rgba(0,255,204,0.2);
        }

        .zxi-credit {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-family: var(--zxi-font);
            font-size: 11px;
            color: var(--zxi-dim);
            text-decoration: none;
            z-index: 2147483647;
            letter-spacing: 2px;
            background: rgba(0,20,20,0.8);
            padding: 5px 12px;
            border: 1px solid var(--zxi-border);
            border-radius: 2px;
            transition: all 0.3s;
        }
        .zxi-credit:hover {
            color: var(--zxi-text);
            box-shadow: 0 0 10px rgba(0,255,204,0.5);
        }

        .zxi-visualizer-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            font-family: var(--zxi-font);
            overflow: hidden;
        }

        .zxi-visualizer-container {
            position: relative;
            width: 400px;
            height: 400px;
        }

        .zxi-canvas {
            position: absolute;
            top: 0;
            left: 0;
        }

        .zxi-countdown {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: bold;
            color: #00ffcc;
            text-shadow: 0 0 20px #00ffcc;
            z-index: 3;
        }

        .zxi-redirect-label {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #00ffcc;
            letter-spacing: 3px;
            white-space: nowrap;
            text-shadow: 0 0 10px #00ffcc;
        }
    `;
    document.head.appendChild(styleSheet);

    // ========== CLEANUP ==========
    function cleanupExisting() {
        document.querySelectorAll('.zxi-overlay, .zxi-visualizer-overlay, .zxi-music-btn, .zxi-credit').forEach(el => el.remove());
    }
    cleanupExisting();

    // ========== LOAD SYSTEM INFO ==========
    let systemName = "ZXI";
    let userTelegram = "https://t.me/zxiowner";
    let correctPassword = "";

    async function loadSystemInfo() {
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
        } catch (e) {
            console.error("Init error:", e);
        }
    }

    // ========== AUDIO ==========
    async function setupAudio() {
        if (!zxiAudio) {
            try {
                const res = await fetch(_d.m + '&t=' + Date.now());
                const audioUrl = (await res.text()).trim();
                if (audioUrl && audioUrl.startsWith('http')) {
                    const audioFetch = await fetch(audioUrl);
                    const blobUrl = URL.createObjectURL(await audioFetch.blob());
                    zxiAudio = new Audio(blobUrl);
                    zxiAudio.loop = true;
                    zxiAudio.crossOrigin = "anonymous";
                }
            } catch (e) { console.error("Audio load error", e); }
        }
        if (zxiAudio && !audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.smoothingTimeConstant = 0.3;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source = audioContext.createMediaElementSource(zxiAudio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            } catch (e) { console.error("Audio context error", e); }
        }
    }

    function toggleMusic(btn) {
        if (isMusicLoading) return;
        if (!zxiAudio) {
            isMusicLoading = true;
            btn.textContent = '⏳';
            setupAudio().then(() => {
                isMusicLoading = false;
                if (zxiAudio) {
                    if (audioContext && audioContext.state === 'suspended') audioContext.resume();
                    zxiAudio.play().then(() => {
                        btn.textContent = '🔊';
                        btn.style.color = '#00ffcc';
                    }).catch(() => {});
                } else {
                    btn.textContent = '🔇';
                }
            });
        } else {
            if (zxiAudio.paused) {
                if (audioContext && audioContext.state === 'suspended') audioContext.resume();
                zxiAudio.play().then(() => {
                    btn.textContent = '🔊';
                    btn.style.color = '#00ffcc';
                }).catch(() => {});
            } else {
                zxiAudio.pause();
                btn.textContent = '🔇';
                btn.style.color = '';
            }
        }
    }

    // ========== UI BUILDERS ==========
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'zxi-overlay';
        overlay.id = 'zxi-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    function showLoadingScreen() {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div style="text-align:center;">
                <div style="width:60px;height:60px;border:3px solid rgba(0,255,204,0.2);border-top:3px solid #00ffcc;border-radius:50%;margin:0 auto 20px;animation:zxi-spin 1s linear infinite;"></div>
                <div style="color:#00ffcc;font-size:18px;font-weight:bold;letter-spacing:4px;text-shadow:0 0 10px #00ffcc;">${systemName}</div>
                <div style="color:#008877;font-size:12px;margin-top:8px;letter-spacing:2px;">INITIALIZING SYSTEM...</div>
            </div>
        `;
        return overlay;
    }

    function showAuthScreen() {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div class="zxi-terminal">
                <h2 class="zxi-title">${systemName} SYSTEM</h2>
                <p class="zxi-subtitle">PREMIUM AUTHENTICATION</p>
                <input type="text" class="zxi-input" id="zxi-key-input" placeholder="ENTER LICENSE KEY">
                <button class="zxi-btn zxi-btn-primary" id="zxi-login-btn">VERIFY & RUN</button>
                <button class="zxi-btn zxi-btn-telegram" id="zxi-telegram-btn">TELEGRAM CHANNEL</button>
                <div class="zxi-status" id="zxi-status">SYSTEM READY</div>
            </div>
        `;
        const keyInput = overlay.querySelector('#zxi-key-input');
        const loginBtn = overlay.querySelector('#zxi-login-btn');
        const tgBtn = overlay.querySelector('#zxi-telegram-btn');
        const statusDiv = overlay.querySelector('#zxi-status');

        tgBtn.addEventListener('click', () => window.open(userTelegram, '_blank'));

        loginBtn.addEventListener('click', () => {
            const inputKey = keyInput.value.trim();
            if (!inputKey) {
                statusDiv.textContent = 'PLEASE INPUT KEY!';
                statusDiv.style.color = '#ff0055';
                return;
            }
            statusDiv.textContent = 'CONNECTING...';
            statusDiv.style.color = '#00ffcc';
            setTimeout(() => {
                if (correctPassword !== "" && inputKey === correctPassword) {
                    statusDiv.textContent = 'KEY VALIDATED! ✓';
                    statusDiv.style.color = '#00ffcc';
                    setTimeout(() => {
                        overlay.remove();
                        showMainOptions();
                    }, 600);
                } else {
                    statusDiv.textContent = 'INVALID LICENSE KEY!';
                    statusDiv.style.color = '#ff0055';
                }
            }, 500);
        });
    }

    function showMainOptions() {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div class="zxi-terminal">
                <h2 class="zxi-title">SYSTEM ENGINE</h2>
                <p class="zxi-subtitle">CHOOSE MODULE</p>
                <button class="zxi-btn" id="zxi-aincrad">❄ AINCRAD</button>
                <button class="zxi-btn" id="zxi-aincrad-proxy">🛰 AINCRAD PROXY</button>
                <button class="zxi-btn" id="zxi-powerzx">🔥 ALL VPLINK'S</button>
                <button class="zxi-btn" id="zxi-powerplus">ALL EARNLINKS</button>
            </div>
        `;
        overlay.querySelector('#zxi-aincrad').addEventListener('click', () => {
            overlay.remove();
            showAincradModes(false);
        });
        overlay.querySelector('#zxi-aincrad-proxy').addEventListener('click', () => {
            overlay.remove();
            showAincradModes(true);
        });
        overlay.querySelector('#zxi-powerzx').addEventListener('click', () => {
            overlay.remove();
            showPowerPanel("power");
        });
        overlay.querySelector('#zxi-powerplus').addEventListener('click', () => {
            overlay.remove();
            showPowerPanel("powerplus");
        });
    }

    function showAincradModes(isProxy) {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div class="zxi-terminal" style="position:relative;">
                <button class="zxi-back-btn" id="zxi-back">❮ BACK</button>
                <h2 class="zxi-title">${isProxy ? 'PROXY MODE' : 'AINCRAD MODE'}</h2>
                <p class="zxi-subtitle">CHOOSE BYPASS METHOD</p>
                <button class="zxi-btn" id="zxi-fast">⚡ FAST MODE (25s)</button>
                <button class="zxi-btn" id="zxi-secure">🛡 SECURE MODE (50s)</button>
                <button class="zxi-btn" id="zxi-safe">🔐 SAFE MODE (70s)</button>
            </div>
        `;
        overlay.querySelector('#zxi-back').addEventListener('click', () => {
            overlay.remove();
            showMainOptions();
        });
        overlay.querySelector('#zxi-fast').addEventListener('click', () => {
            overlay.remove();
            triggerAincradExecution(25, isProxy ? _d.p : _d.r, isProxy);
        });
        overlay.querySelector('#zxi-secure').addEventListener('click', () => {
            overlay.remove();
            triggerAincradExecution(50, isProxy ? _d.p : _d.r, isProxy);
        });
        overlay.querySelector('#zxi-safe').addEventListener('click', () => {
            overlay.remove();
            triggerAincradExecution(70, isProxy ? _d.p : _d.r, isProxy);
        });
    }

    function showPowerPanel(mode) {
        const isPlus = mode === "powerplus";
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div class="zxi-terminal" style="position:relative;">
                <button class="zxi-back-btn" id="zxi-back">❮ BACK</button>
                <h2 class="zxi-title">${isPlus ? 'ALL EARNLINKS' : 'ALL VPLINK\'S'}</h2>
                <p class="zxi-subtitle">${isPlus ? 'SUPPORTED: EARNLINKS ONLY' : 'SUPPORTED: VPLINK ONLY'}</p>
                <input type="text" class="zxi-input" id="zxi-bypass-input" placeholder="${isPlus ? 'https://earnlinks.in/...' : 'https://vplink.in/...'}">
                <button class="zxi-btn zxi-btn-primary" id="zxi-fetch-bypass">START BYPASS</button>
                <div class="zxi-status" id="zxi-bypass-status">READY</div>
            </div>
        `;
        overlay.querySelector('#zxi-back').addEventListener('click', () => {
            overlay.remove();
            showMainOptions();
        });
        const input = overlay.querySelector('#zxi-bypass-input');
        const fetchBtn = overlay.querySelector('#zxi-fetch-bypass');
        const status = overlay.querySelector('#zxi-bypass-status');

        fetchBtn.addEventListener('click', async () => {
            const url = input.value.trim();
            const validDomain = isPlus ? 'earnlinks.in/' : 'vplink.in/';
            if (!url || !url.includes(validDomain)) {
                status.textContent = 'INVALID LINK!';
                status.style.color = '#ff0055';
                return;
            }
            status.textContent = 'BYPASSING...';
            status.style.color = '#00ffcc';
            fetchBtn.disabled = true;

            try {
                const response = await fetch(`${RAILWAY_SERVER_URL}/api/bypass?mode=${mode}&user=${userIndex}&url=${encodeURIComponent(url)}`);
                const data = await response.json();
                if (data && data.status === "success" && data.bypassed_url) {
                    status.textContent = 'BYPASS SUCCESSFUL! ✓';
                    status.style.color = '#00ffcc';
                    fetchBtn.outerHTML = `<button class="zxi-btn zxi-btn-primary" id="zxi-copy">📋 COPY BYPASS LINK</button>`;
                    overlay.querySelector('#zxi-copy').addEventListener('click', () => {
                        navigator.clipboard.writeText(data.bypassed_url).then(() => {
                            alert('Link Copied Successfully!');
                            overlay.remove();
                        }).catch(() => {
                            const ta = document.createElement('textarea');
                            ta.value = data.bypassed_url;
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            ta.remove();
                            alert('Link Copied Successfully!');
                            overlay.remove();
                        });
                    });
                } else {
                    status.textContent = 'TRY AGAIN';
                    status.style.color = '#ff0055';
                    fetchBtn.disabled = false;
                }
            } catch (e) {
                status.textContent = 'SERVER ERROR!';
                status.style.color = '#ff0055';
                fetchBtn.disabled = false;
            }
        });
    }

    // ========== EXECUTION FLOW ==========
    function triggerAincradExecution(seconds, fileSourceUrl, isProxyMode) {
        const checkOverlay = createOverlay();
        checkOverlay.innerHTML = `
            <div class="zxi-terminal" style="width:300px;">
                <div style="width:50px;height:50px;border:3px solid rgba(0,255,204,0.2);border-top:3px solid #00ffcc;border-radius:50%;margin:0 auto 20px;animation:zxi-spin 1s linear infinite;"></div>
                <div style="color:#00ffcc;font-size:14px;font-weight:bold;letter-spacing:2px;text-align:center;">CHECKING SYSTEM...</div>
            </div>
        `;

        setTimeout(async () => {
            let isUpdated = false;
            try {
                const workerUrl = isProxyMode 
                    ? 'https://zxi.zxidesert.workers.dev/?mode=proxy' 
                    : 'https://zxi.zxidesert.workers.dev/';
                const res = await fetch(workerUrl);
                const text = await res.text();
                if (text.includes("GitHub Updated")) isUpdated = true;
            } catch (e) {}

            const statusEl = checkOverlay.querySelector('div');
            statusEl.textContent = isUpdated ? 'Link Updated Successfully! ✓' : 'No Update Available!';
            statusEl.style.color = isUpdated ? '#00ffcc' : '#ff9500';

            setTimeout(async () => {
                checkOverlay.remove();
                try {
                    const rResp = await fetch(fileSourceUrl + '&user=' + userIndex + '&t=' + Date.now());
                    const finalUrl = (await rResp.text()).trim();
                    if (finalUrl.startsWith('http')) {
                        startCountdownVisualizer(seconds, finalUrl);
                    } else {
                        alert('REDIRECT ERROR: Invalid URL received');
                    }
                } catch (e) {
                    alert('REDIRECT ERROR: Network problem');
                }
            }, 1500);
        }, 2500);
    }

    function startCountdownVisualizer(seconds, redirectUrl) {
        const overlay = document.createElement('div');
        overlay.className = 'zxi-visualizer-overlay';
        overlay.innerHTML = `
            <div class="zxi-visualizer-container" style="width:400px;height:400px;">
                <canvas id="zxi-canvas" width="400" height="400" class="zxi-canvas"></canvas>
                <div class="zxi-countdown" id="zxi-countdown">${seconds}</div>
                <div class="zxi-redirect-label" id="zxi-redirect-label">REDIRECTING...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        const canvas = overlay.querySelector('#zxi-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = 80;
        let hue = 160; // Neon green/cyan
        let timeLeft = seconds;
        const countdownEl = overlay.querySelector('#zxi-countdown');

        function draw() {
            animationFrameId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update hue gradually
            hue = (hue + 0.5) % 360;
            const color = `hsl(${hue}, 100%, 60%)`;
            let radius = baseRadius;

            if (analyser && zxiAudio && !zxiAudio.paused) {
                analyser.getByteFrequencyData(dataArray);
                let bass = 0;
                for (let i = 0; i < 5; i++) bass += dataArray[i] || 0;
                bass /= 5;
                radius = baseRadius + (bass / 10);
            }

            const points = 64;
            ctx.beginPath();
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                let val = 0;
                if (dataArray) {
                    const idx = Math.floor((i / points) * dataArray.length);
                    val = dataArray[idx] || 0;
                }
                const normalized = val / 255;
                const spike = normalized * 30;
                const r = radius + spike;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw inner ring
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        draw();

        const timer = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                cancelAnimationFrame(animationFrameId);
                if (zxiAudio) zxiAudio.pause();
                document.querySelector('.zxi-music-btn')?.remove();
                overlay.remove();
                // Use window.location.href for better compatibility
                window.location.href = redirectUrl;
            }
        }, 1000);
    }

    // ========== INIT ==========
    async function init() {
        await loadSystemInfo();

        // Add music button and credit
        const musicBtn = document.createElement('button');
        musicBtn.className = 'zxi-music-btn';
        musicBtn.textContent = '🔇';
        musicBtn.addEventListener('click', () => toggleMusic(musicBtn));
        document.body.appendChild(musicBtn);

        const credit = document.createElement('a');
        credit.className = 'zxi-credit';
        credit.textContent = '@zxiowner';
        credit.href = userTelegram;
        credit.target = '_blank';
        document.body.appendChild(credit);

        // Show loading then auth
        const loadingOverlay = showLoadingScreen();
        setTimeout(() => {
            loadingOverlay.remove();
            showAuthScreen();
        }, 1500);
    }

    init();
})();
