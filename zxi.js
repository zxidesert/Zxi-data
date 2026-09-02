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

    // ========== STYLES ==========
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        /* Global iOS-like design */
        :root {
            --zxi-bg: rgba(22, 22, 28, 0.85);
            --zxi-card: rgba(28, 28, 34, 0.75);
            --zxi-border: rgba(255, 255, 255, 0.15);
            --zxi-text: #ffffff;
            --zxi-subtext: #98989d;
            --zxi-accent: #0a84ff;
            --zxi-green: #34c759;
            --zxi-red: #ff3b30;
            --zxi-orange: #ff9500;
            --zxi-purple: #af52de;
            --zxi-radius: 20px;
            --zxi-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }

        @keyframes zxi-fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes zxi-slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zxi-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes zxi-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(10,132,255,0.3); }
            50% { box-shadow: 0 0 40px rgba(10,132,255,0.6); }
        }
        @keyframes zxi-breathing {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }

        .zxi-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
            animation: zxi-fadeIn 0.3s ease;
        }
        .zxi-card {
            background: var(--zxi-card);
            border: 1px solid var(--zxi-border);
            border-radius: var(--zxi-radius);
            padding: 24px 20px;
            width: 320px;
            max-width: 90vw;
            box-shadow: var(--zxi-shadow);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            text-align: center;
            animation: zxi-slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .zxi-title {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: var(--zxi-text);
            margin: 0 0 6px;
        }
        .zxi-subtitle {
            font-size: 12px;
            font-weight: 500;
            color: var(--zxi-subtext);
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }
        .zxi-input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(118,118,128,0.12);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 14px;
            color: var(--zxi-text);
            font-size: 14px;
            text-align: center;
            outline: none;
            transition: all 0.2s;
            margin-bottom: 16px;
            box-sizing: border-box;
        }
        .zxi-input:focus {
            border-color: var(--zxi-accent);
            background: rgba(10,132,255,0.1);
        }
        .zxi-input::placeholder {
            color: rgba(255,255,255,0.4);
        }
        .zxi-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            background: rgba(118,118,128,0.2);
            color: white;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        .zxi-btn:hover {
            background: rgba(118,118,128,0.3);
        }
        .zxi-btn-primary {
            background: var(--zxi-accent);
            color: white;
            box-shadow: 0 4px 15px rgba(10,132,255,0.3);
        }
        .zxi-btn-primary:hover {
            background: #0066cc;
        }
        .zxi-btn-danger {
            background: var(--zxi-red);
        }
        .zxi-btn-telegram {
            background: rgba(34,158,217,0.2);
            color: #229ED9;
            border: 1px solid #229ED9;
        }
        .zxi-status {
            font-size: 11px;
            font-weight: 500;
            color: var(--zxi-subtext);
            letter-spacing: 1px;
            min-height: 20px;
            margin-top: 10px;
        }
        .zxi-back-btn {
            position: absolute;
            top: 16px;
            left: 16px;
            background: none;
            border: none;
            color: var(--zxi-subtext);
            font-size: 20px;
            cursor: pointer;
            padding: 4px;
        }
        .zxi-music-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--zxi-card);
            border: 1px solid var(--zxi-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: var(--zxi-accent);
            font-size: 20px;
            cursor: pointer;
            z-index: 2147483647;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .zxi-music-btn:hover {
            transform: scale(1.05);
        }
        .zxi-credit {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            font-weight: 600;
            color: var(--zxi-subtext);
            text-decoration: none;
            z-index: 2147483647;
            letter-spacing: 1px;
            background: var(--zxi-card);
            padding: 6px 12px;
            border-radius: 20px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .zxi-visualizer-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            animation: zxi-fadeIn 0.3s ease;
        }
        .zxi-visualizer-container {
            text-align: center;
            position: relative;
        }
        .zxi-canvas {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
        }
        .zxi-countdown {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-weight: 700;
            color: white;
            z-index: 3;
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
                        btn.style.color = '#34c759';
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
                    btn.style.color = '#34c759';
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

    function createCard(html, parent) {
        const card = document.createElement('div');
        card.className = 'zxi-card';
        card.innerHTML = html;
        parent.appendChild(card);
        return card;
    }

    function showLoadingScreen() {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div style="text-align:center;">
                <div style="width:60px;height:60px;border:4px solid rgba(255,255,255,0.1);border-top:4px solid #0a84ff;border-radius:50%;margin:0 auto 20px;animation:zxi-spin 1s linear infinite;"></div>
                <div style="color:white;font-size:18px;font-weight:600;letter-spacing:2px;">${systemName}</div>
                <div style="color:#98989d;font-size:12px;margin-top:8px;">Loading System...</div>
            </div>
        `;
        return overlay;
    }

    function showAuthScreen() {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div class="zxi-card" style="position:relative;">
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
                statusDiv.style.color = '#ff3b30';
                return;
            }
            statusDiv.textContent = 'CONNECTING...';
            statusDiv.style.color = '';
            setTimeout(() => {
                if (correctPassword !== "" && inputKey === correctPassword) {
                    statusDiv.textContent = 'KEY VALIDATED! ✓';
                    statusDiv.style.color = '#34c759';
                    setTimeout(() => {
                        overlay.remove();
                        showMainOptions();
                    }, 600);
                } else {
                    statusDiv.textContent = 'INVALID LICENSE KEY!';
                    statusDiv.style.color = '#ff3b30';
                }
            }, 500);
        });
    }

    function showMainOptions() {
        const overlay = createOverlay();
        overlay.innerHTML = `
            <div class="zxi-card">
                <h2 class="zxi-title">SYSTEM ENGINE</h2>
                <p class="zxi-subtitle">CHOOSE MODULE</p>
                <button class="zxi-btn" id="zxi-aincrad">❄️ Aincrad</button>
                <button class="zxi-btn" id="zxi-aincrad-proxy">🛰️ Aincrad Proxy</button>
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
            <div class="zxi-card" style="position:relative;">
                <button class="zxi-back-btn" id="zxi-back">❮</button>
                <h2 class="zxi-title">${isProxy ? 'PROXY MODE' : 'AINCRAD MODE'}</h2>
                <p class="zxi-subtitle">CHOOSE BYPASS METHOD</p>
                <button class="zxi-btn" id="zxi-fast">⚡ FAST MODE (25s)</button>
                <button class="zxi-btn" id="zxi-secure">🛡️ SECURE MODE (50s)</button>
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
            <div class="zxi-card" style="position:relative;">
                <button class="zxi-back-btn" id="zxi-back">❮</button>
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
                status.style.color = '#ff3b30';
                return;
            }
            status.textContent = 'BYPASSING...';
            status.style.color = '';
            fetchBtn.disabled = true;

            try {
                const response = await fetch(`${RAILWAY_SERVER_URL}/api/bypass?mode=${mode}&user=${userIndex}&url=${encodeURIComponent(url)}`);
                const data = await response.json();
                if (data && data.status === "success" && data.bypassed_url) {
                    status.textContent = 'BYPASS SUCCESSFUL! ✓';
                    status.style.color = '#34c759';
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
                    status.style.color = '#ff3b30';
                    fetchBtn.disabled = false;
                }
            } catch (e) {
                status.textContent = 'SERVER ERROR!';
                status.style.color = '#ff3b30';
                fetchBtn.disabled = false;
            }
        });
    }

    // ========== EXECUTION FLOW ==========
    function triggerAincradExecution(seconds, fileSourceUrl, isProxyMode) {
        // Show check overlay
        const checkOverlay = createOverlay();
        checkOverlay.innerHTML = `
            <div class="zxi-card" style="width:280px;">
                <div style="width:50px;height:50px;border:4px solid rgba(255,255,255,0.1);border-top:4px solid #0a84ff;border-radius:50%;margin:0 auto 20px;animation:zxi-spin 1s linear infinite;"></div>
                <div style="color:white;font-size:16px;font-weight:600;">CHECKING SYSTEM...</div>
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

            const statusText = checkOverlay.querySelector('div');
            statusText.textContent = isUpdated ? 'Link Updated Successfully! ✓' : 'No Update Available!';
            statusText.style.color = isUpdated ? '#34c759' : '#ff9500';

            setTimeout(async () => {
                checkOverlay.remove();
                try {
                    const rResp = await fetch(fileSourceUrl + '&user=' + userIndex + '&t=' + Date.now());
                    const finalUrl = (await rResp.text()).trim();
                    if (finalUrl.startsWith('http')) {
                        startCountdownVisualizer(seconds, finalUrl);
                    } else {
                        alert('REDIRECT ERROR!');
                    }
                } catch (e) {
                    alert('REDIRECT ERROR!');
                }
            }, 1500);
        }, 2500);
    }

    function startCountdownVisualizer(seconds, redirectUrl) {
        const overlay = document.createElement('div');
        overlay.className = 'zxi-visualizer-overlay';
        overlay.innerHTML = `
            <div class="zxi-visualizer-container" style="width:400px;height:400px;position:relative;">
                <canvas id="zxi-canvas" width="400" height="400" class="zxi-canvas"></canvas>
                <div class="zxi-countdown" id="zxi-countdown">${seconds}</div>
                <div style="position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);color:white;font-size:14px;font-weight:500;letter-spacing:2px;">REDIRECTING...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        const canvas = overlay.querySelector('#zxi-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = 88;
        let hue = 0;
        const progressRing = document.createElement('div'); // not used, we'll draw a ring manually

        function draw() {
            animationFrameId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            hue = (hue + 1.5) % 360;
            const color = `hsl(${hue}, 100%, 60%)`;
            let radius = baseRadius;

            if (analyser && zxiAudio && !zxiAudio.paused) {
                analyser.getByteFrequencyData(dataArray);
                let bass = 0;
                for (let i = 0; i < 5; i++) bass += dataArray[i] || 0;
                bass /= 5;
                radius = baseRadius + (bass / 12);
            }

            const points = 56;
            ctx.beginPath();
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                let mirrorAngle = (i % (points / 4)) / (points / 4) * Math.PI * 0.5;
                let idx = Math.floor(Math.sin(mirrorAngle) * (dataArray.length * 0.65));
                let idx2 = (idx + 2) % dataArray.length;
                let val = ((dataArray[idx] || 0) * 0.7 + (dataArray[idx2] || 0) * 0.3);
                let normalized = val / 255;
                let boosted = Math.min(255, Math.pow(normalized, 1.1) * 255 * 5.8);
                let spike = (i % 2 === 0) ? (5 + (boosted / 255) * 47) : (-3 + (boosted / 255) * 4);
                const r = radius + spike;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.lineWidth = 3.8;
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';
            ctx.strokeStyle = color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        draw();

        let timeLeft = seconds;
        const countdownEl = overlay.querySelector('#zxi-countdown');
        const timer = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                cancelAnimationFrame(animationFrameId);
                if (zxiAudio) zxiAudio.pause();
                document.querySelector('.zxi-music-btn')?.remove();
                overlay.remove();
                window.location.replace(redirectUrl);
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
