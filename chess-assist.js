// Chess Assist v1.4.0 — https://github.com/ThatKidGlitchy/chess-hacks
(() => {
  if (window.__chessHelper) return console.warn('already loaded');
  window.__chessHelper = true;
  const style = document.createElement('style');
  style.textContent = `\n    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');\n    :root { --ch-accent:#81b64c; --ch-accent-hover:#a3d160; --ch-bg:rgba(20,20,23,0.75); --ch-border:rgba(255,255,255,0.1); --ch-radius:20px; --ch-font:'Outfit',system-ui,sans-serif; }\n    #chess-helper-root { position:fixed; left:0; top:0; width:0; height:0; overflow:visible; pointer-events:none !important; z-index:99999; font-family:var(--ch-font); }\n    #chess-helper-bubble { position:fixed; width:52px; height:52px; background:var(--ch-bg); backdrop-filter:blur(20px); border:1px solid var(--ch-border); border-radius:50%; box-shadow:0 10px 40px -10px #0008; display:flex; align-items:center; justify-content:center; cursor:grab; color:#fff; pointer-events:auto; z-index:100000; user-select:none; transition:transform .2s; }\n    #chess-helper-bubble:hover { transform:scale(1.1); }\n    #chess-helper-bubble img { width:100%; height:100%; pointer-events:none; }\n    #chess-helper-wrap { position:fixed; visibility:hidden; display:flex; align-items:stretch; gap:8px; opacity:0; transform:scale(0.9); transition:opacity .25s, transform .3s; pointer-events:none; }\n    #chess-helper-wrap.visible { visibility:visible; opacity:1; transform:scale(1); pointer-events:auto; }\n    #chess-helper-wrap:not(.visible), #chess-helper-wrap:not(.visible) * { pointer-events:none !important; }\n    #chess-helper-panel { width:280px; background:rgba(18,18,20,0.85); backdrop-filter:blur(24px); border:1px solid var(--ch-border); border-radius:var(--ch-radius); padding:20px; display:flex; flex-direction:column; gap:14px; box-shadow:0 20px 60px #0009; pointer-events:auto; }\n    #ch-eval-bar { width:32px; border-radius:14px; overflow:hidden; background:#000; box-shadow:0 10px 40px -10px #0008; position:relative; pointer-events:auto; min-height:200px; }\n    #ch-eval-white { position:absolute; bottom:0; left:0; right:0; background:#fff; transition:height .6s ease; height:50%; }\n    .ch-eval-pct { position:absolute; width:100%; text-align:center; font-size:10px; font-weight:700; font-family:var(--ch-font); z-index:2; left:0; }\n    #ch-eval-pct-top { top:8px; color:#fff; text-shadow:0 0 4px #000, 0 0 4px #000; }\n    #ch-eval-pct-bot { bottom:8px; color:#000; text-shadow:0 0 4px #fff, 0 0 4px #fff; }\n    .ch-header { display:flex; justify-content:space-between; align-items:center; cursor:grab; user-select:none; }\n    .ch-title { font-size:16px; font-weight:700; color:#fff; }\n    .ch-close { width:24px; height:24px; border-radius:50%; border:none; background:rgba(255,255,255,0.08); color:#fff; font-size:16px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; }\n    .ch-close:hover { background:rgba(255,255,255,0.18); }\n    .ch-row { display:flex; justify-content:space-between; align-items:center; gap:6px; }\n    .ch-label { font-size:13px; color:#fff; font-weight:500; flex:1; }\n    .ch-switch { position:relative; width:44px; height:24px; flex-shrink:0; }\n    .ch-switch input { opacity:0; width:0; height:0; }\n    .ch-slider { position:absolute; cursor:pointer; inset:0; background:rgba(255,255,255,0.1); transition:.3s; border-radius:24px; }\n    .ch-slider:before { content:""; position:absolute; height:18px; width:18px; left:3px; bottom:3px; background:#e4e4e7; transition:.3s; border-radius:50%; }\n    input:checked + .ch-slider { background:var(--ch-accent); }\n    input:checked + .ch-slider:before { transform:translateX(20px); background:#fff; }\n    .ch-btn { padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); background:rgba(255,255,255,0.05); color:#fff; font-family:var(--ch-font); font-size:13px; font-weight:600; cursor:pointer; transition:.2s; }\n    .ch-btn-primary { background:var(--ch-accent); color:#121212; border:none; }\n    .ch-btn-primary:hover { background:var(--ch-accent-hover); }\n    #ch-reset-binds:hover { background:rgba(255,255,255,0.12) !important; color:#fff !important; border-color:rgba(255,255,255,0.2) !important; }\n    #ch-reset-binds:active { transform:scale(0.97); background:rgba(255,255,255,0.18) !important; transition:all .05s !important; }\n    .ch-depth-row { display:flex; align-items:center; gap:10px; }\n    .ch-depth-label { font-size:13px; color:#fff; font-weight:500; white-space:nowrap; }\n    .ch-depth-val { font-size:13px; color:var(--ch-accent); font-weight:700; min-width:20px; text-align:center; }\n    .ch-range { -webkit-appearance:none; appearance:none; flex:1; height:4px; background:rgba(255,255,255,0.15); border-radius:4px; outline:none; cursor:pointer; }\n    .ch-range::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:var(--ch-accent); cursor:pointer; }\n    .ch-range::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:var(--ch-accent); border:none; cursor:pointer; }\n    .ch-shade-overlay { position:absolute; pointer-events:none; z-index:999; border-radius:2px; transition:opacity .2s; }\n    .ch-keybind { font-size:11px; color:rgba(255,255,255,0.5); background:rgba(255,255,255,0.08); padding:2px 8px; border-radius:6px; font-family:var(--ch-font); font-weight:600; letter-spacing:0.5px; cursor:pointer; transition:.2s; }\n    .ch-keybind:hover { color:#fff; background:rgba(255,255,255,0.15); }\n    .ch-keybind.recording { color:var(--ch-accent); background:rgba(129,182,76,0.15); animation:ch-pulse 1s infinite; }\n    @keyframes ch-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }\n    .ch-info { width:16px; height:16px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.3); color:rgba(255,255,255,0.4); font-size:10px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:.2s; font-style:italic; font-family:serif; line-height:1; }\n    .ch-info:hover, .ch-info.active { border-color:var(--ch-accent); color:var(--ch-accent); }\n    .ch-tooltip { display:none; background:rgba(10,10,12,0.95); border:1px solid var(--ch-border); border-radius:10px; padding:8px 12px; font-size:11px; color:rgba(255,255,255,0.7); line-height:1.5; margin-top:4px; }\n    .ch-tooltip.show { display:block; }\n    .ch-thinking { font-size:12px; color:var(--ch-accent); font-weight:600; text-align:center; animation:ch-pulse 1.2s infinite; display:none; }\n    .ch-pager { display:flex; align-items:center; justify-content:center; gap:10px; padding:2px 0 4px; user-select:none; }\n    .ch-pager-arrow { width:22px; height:22px; border-radius:50%; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); font-size:13px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; transition:.15s; }\n    .ch-pager-arrow:hover { background:rgba(255,255,255,0.12); color:#fff; }\n    .ch-pager-arrow:disabled { opacity:0.25; cursor:default; }\n    .ch-pager-arrow:disabled:hover { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); }\n    .ch-pager-dots { display:flex; gap:5px; }\n    .ch-pager-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.2); cursor:pointer; transition:.15s; }\n    .ch-pager-dot.active { background:var(--ch-accent); width:16px; border-radius:3px; }\n    .ch-pager-count { font-size:11px; font-weight:600; color:rgba(255,255,255,0.5); font-variant-numeric:tabular-nums; min-width:28px; text-align:center; }\n    .ch-gameplay-page, .ch-skins-page { display:none; flex-direction:column; gap:14px; }\n    .ch-gameplay-page.active, .ch-skins-page.active { display:flex; }\n    .ch-premade-tile { position:relative; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:8px 4px 6px; cursor:pointer; transition:.15s; display:flex; flex-direction:column; align-items:center; gap:4px; }\n    .ch-premade-tile:hover { background:rgba(255,255,255,0.1); border-color:var(--ch-accent); }\n    .ch-premade-tile.active { background:rgba(129,182,76,0.15); border-color:var(--ch-accent); }\n    .ch-premade-tile img { width:40px; height:40px; pointer-events:none; }\n    .ch-premade-tile .ch-premade-name { font-size:10px; color:rgba(255,255,255,0.7); text-align:center; line-height:1.2; word-break:break-word; }\n    .ch-section-head { font-size:10px; font-weight:700; color:rgba(255,255,255,0.4); letter-spacing:1.5px; text-transform:uppercase; padding:4px 0 2px; border-bottom:1px solid rgba(255,255,255,0.06); margin-bottom:2px; }\n    .ch-section-head:not(:first-child) { margin-top:6px; }\n    #ch-streamer-text { position:fixed; top:16px; left:50%; transform:translateX(-50%); display:none; padding:.45em 1em; border-radius:14px; background:var(--ch-bg); backdrop-filter:blur(20px); border:1px solid var(--ch-border); color:#fff; font-family:var(--ch-font); font-size:22px; font-weight:700; letter-spacing:0.5px; z-index:99998; white-space:nowrap; box-shadow:0 10px 40px -10px #0008; cursor:grab; touch-action:none; user-select:none; -webkit-user-select:none; pointer-events:auto !important; }\n    #ch-streamer-text.show { display:block; }\n    #ch-streamer-text:active { cursor:grabbing; }\n    #ch-whatsnew-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:100010; display:none; align-items:center; justify-content:center; backdrop-filter:blur(4px); font-family:var(--ch-font); }\n    #ch-whatsnew-backdrop.visible { display:flex; }\n    #ch-whatsnew-modal { width:min(420px, 92vw); max-height:80vh; overflow-y:auto; background:rgba(18,18,20,0.98); border:1px solid var(--ch-border); border-radius:16px; padding:24px; box-shadow:0 30px 80px rgba(0,0,0,0.8); color:#fff; scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.2) transparent; }\n    #ch-whatsnew-modal h2 { margin:0 0 4px; font-size:18px; font-weight:700; }\n    #ch-whatsnew-modal .ch-wn-sub { font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:16px; }\n    #ch-whatsnew-modal ul { list-style:none; padding:0; margin:0 0 18px; display:flex; flex-direction:column; gap:10px; }\n    #ch-whatsnew-modal li { font-size:13px; line-height:1.45; color:rgba(255,255,255,0.85); padding-left:18px; position:relative; }\n    #ch-whatsnew-modal li:before { content:""; position:absolute; left:4px; top:7px; width:6px; height:6px; border-radius:50%; background:var(--ch-accent); }\n    #ch-whatsnew-modal li b { color:#fff; font-weight:600; }\n    #ch-whatsnew-ok { width:100%; padding:11px; border-radius:10px; border:none; background:var(--ch-accent); color:#121212; font-family:var(--ch-font); font-size:13px; font-weight:700; cursor:pointer; transition:.2s; }\n    #ch-whatsnew-ok:hover { background:var(--ch-accent-hover); }\n    .ch-thinking.active { display:block; }\n    .ch-tabs { display:flex; gap:4px; }\n    .ch-tab { flex:1; padding:7px 0; border:none; background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.45); font-family:var(--ch-font); font-size:11px; font-weight:600; cursor:pointer; border-radius:10px; transition:.2s; }\n    .ch-tab:hover { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); }\n    .ch-tab.active { background:var(--ch-accent); color:#121212; }\n    .ch-tab-content { display:none; flex-direction:column; gap:14px; }\n    .ch-tab-content.active { display:flex; }\n    .ch-detect-stat { display:flex; justify-content:space-between; align-items:center; padding:2px 0; }\n    .ch-detect-label { font-size:12px; color:rgba(255,255,255,0.55); font-weight:500; }\n    .ch-detect-value { font-size:13px; color:#fff; font-weight:700; font-family:var(--ch-font); }\n    .ch-detect-gauge { height:10px; border-radius:5px; background:rgba(255,255,255,0.08); overflow:hidden; margin:4px 0; }\n    .ch-detect-fill { height:100%; width:0%; border-radius:5px; transition:width .5s ease, background .5s ease; background:var(--ch-accent); }\n    .ch-detect-verdict { text-align:center; font-size:12px; font-weight:600; color:rgba(255,255,255,0.4); padding:2px 0; }\n    .ch-detect-reset { padding:8px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); font-family:var(--ch-font); font-size:12px; font-weight:600; cursor:pointer; transition:.2s; text-align:center; }\n    .ch-detect-reset:hover { background:rgba(255,255,255,0.1); color:#fff; }\n    .ch-skins-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:4px; }\n    .ch-skin-tile { aspect-ratio:1; background:rgba(255,255,255,0.1); border-radius:6px; cursor:pointer; position:relative; display:flex; align-items:center; justify-content:center; background-size:contain; background-position:center; background-repeat:no-repeat; transition:.15s; }\n    .ch-skin-tile:hover { background-color:rgba(255,255,255,0.18); }\n    .ch-skin-tile.wide { grid-column:span 3; aspect-ratio:3/1; }\n    .ch-skin-label { font-size:16px; color:rgba(255,255,255,0.8); pointer-events:none; line-height:1; }\n    .ch-skin-tile.has-skin .ch-skin-label { display:none; }\n    .ch-skin-remove { display:none; position:absolute; top:-4px; right:-4px; width:14px; height:14px; border-radius:50%; background:#e04040; color:#fff; border:none; font-size:10px; line-height:14px; text-align:center; padding:0; cursor:pointer; z-index:2; }\n    .ch-skin-tile.has-skin:hover .ch-skin-remove { display:block; }\n    .ch-skins-row-label { font-size:10px; color:rgba(255,255,255,0.3); font-weight:600; grid-column:span 6; text-align:center; margin:2px 0 -2px; }\n  `;
  document.head.appendChild(style);
  window.chessHelper = {
    autoPlay: false,
    showArrow: false,
    hiddenArrow: false,
    showOpponent: false,
    showEval: false,
    detection: true,
    voice: false,
    streamer: false
  };
  let VOICE_RATE = 1, VOICE_VOLUME = 1, VOICE_NAME = '';
  let voiceUnlocked = false;
  let lastSpokenText = '', lastSpokenFen = '', lastSpokenMove = '';
  let streamerSize = 22, streamerPos = null, streamerMove = null;
  let UI_OPACITY = 1;
  let HIDDEN_DARKNESS = .07;
  let persistSettings = localStorage.getItem('ch-persist') !== '0';
  function loadSettings() {
    try {
      const raw = localStorage.getItem('ch-settings');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function saveSettings() {
    if (!persistSettings) return;
    try {
      localStorage.setItem('ch-settings', JSON.stringify({
        toggles: {
          autoPlay: window.chessHelper.autoPlay,
          showArrow: window.chessHelper.showArrow,
          hiddenArrow: window.chessHelper.hiddenArrow,
          showOpponent: window.chessHelper.showOpponent,
          showEval: window.chessHelper.showEval,
          detection: window.chessHelper.detection,
          voice: window.chessHelper.voice,
          streamer: window.chessHelper.streamer
        },
        voiceRate: VOICE_RATE,
        voiceVolume: VOICE_VOLUME,
        voiceName: VOICE_NAME,
        streamerSize,
        streamerPos,
        uiOpacity: UI_OPACITY,
        hiddenDarkness: HIDDEN_DARKNESS,
        depth: ENGINE_DEPTH,
        engineDepths,
        delayMin: DELAY_MIN,
        delayMax: DELAY_MAX,
        delayEnabled: DELAY_ENABLED,
        engine: currentEngine,
        detTarget,
        binds,
        panelPos: {
          x: panelX,
          y: panelY
        },
        bubblePos: {
          x: ox,
          y: oy
        }
      }));
    } catch {}
  }
  const PIECE_WORDS = {
    p: 'pawn',
    n: 'knight',
    b: 'bishop',
    r: 'rook',
    q: 'queen',
    k: 'king'
  };
  const DIGIT_WORDS = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight'
  };
  function pieceAtSquare(fen, sq) {
    try {
      const rows = fen.split(' ')[0].split('/');
      const file = sq.charCodeAt(0) - 97;
      const rank = parseInt(sq[1], 10);
      const row = rows[8 - rank] || '';
      let col = 0;
      for (const ch of row) {
        if (ch >= '1' && ch <= '8') col += parseInt(ch, 10); else {
          if (col === file) return ch;
          col++;
        }
      }
    } catch {}
    return null;
  }
  function sqToSpeech(sq) {
    return sq[0].toUpperCase() + ' ' + (DIGIT_WORDS[sq[1]] || sq[1]);
  }
  function moveToSpeech(fen, move, mate) {
    if (!move || move.length < 4) return '';
    const from = move.slice(0, 2), to = move.slice(2, 4);
    const promo = move.length > 4 ? move[4].toLowerCase() : isPromotion(fen, from, to) ? 'q' : null;
    const piece = (pieceAtSquare(fen, from) || 'P').toLowerCase();
    const target = pieceAtSquare(fen, to);
    const isCastle = piece === 'k' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2;
    let out;
    if (isCastle) {
      out = 'castle ' + (to[0] === 'g' ? 'kingside' : 'queenside');
    } else if (target) {
      const targetWord = PIECE_WORDS[target.toLowerCase()] || 'piece';
      out = (PIECE_WORDS[piece] || 'pawn') + ' ' + sqToSpeech(from) + ' takes ' + targetWord + ' on ' + sqToSpeech(to);
    } else {
      out = (PIECE_WORDS[piece] || 'pawn') + ' ' + sqToSpeech(from) + ' to ' + sqToSpeech(to);
    }
    if (promo) out += ', promote to ' + (PIECE_WORDS[promo] || 'queen');
    if (mate && mate > 0) {
      out += mate === 1 ? ', checkmate' : ', mate in ' + mate;
    }
    return out;
  }
  function unlockVoice() {
    if (voiceUnlocked) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      synth.speak(u);
      voiceUnlocked = true;
    } catch {}
  }
  function speakText(text) {
    if (!text) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = VOICE_RATE;
      u.volume = VOICE_VOLUME;
      if (VOICE_NAME) {
        const v = (synth.getVoices() || []).find(x => x.name === VOICE_NAME);
        if (v) u.voice = v;
      }
      synth.speak(u);
    } catch (e) {
      console.warn('[Chess Assist] speak error:', e);
    }
  }
  function stopVoice() {
    try {
      window.speechSynthesis && window.speechSynthesis.cancel();
    } catch {}
  }
  function applyStreamerStyle() {
    const el = document.getElementById('ch-streamer-text');
    if (!el) return;
    el.style.fontSize = streamerSize + 'px';
    if (streamerPos) {
      el.style.left = streamerPos.x + 'px';
      el.style.top = streamerPos.y + 'px';
      el.style.transform = 'none';
    }
  }
  function renderStreamer() {
    const el = document.getElementById('ch-streamer-text');
    if (!el) return;
    const wrapEl = document.getElementById('chess-helper-wrap');
    const panelOpen = !!(wrapEl && wrapEl.classList.contains('visible'));
    if (!window.chessHelper.streamer || !streamerMove && !panelOpen) {
      el.classList.remove('show');
      return;
    }
    if (streamerMove) {
      const from = streamerMove.slice(0, 2).toUpperCase(), to = streamerMove.slice(2, 4).toUpperCase();
      let promoChar = streamerMove.length > 4 ? streamerMove[4].toUpperCase() : null;
      if (!promoChar) {
        try {
          const f = getFEN();
          if (f && typeof isPromotion === 'function' && isPromotion(f, streamerMove.slice(0, 2), streamerMove.slice(2, 4))) promoChar = 'Q';
        } catch {}
      }
      const promo = promoChar ? ' (=' + promoChar + ')' : '';
      el.textContent = from + ' TO ' + to + promo;
      el.style.opacity = '1';
    } else {
      el.textContent = 'E2 TO E4';
      el.style.opacity = '0.7';
    }
    el.classList.add('show');
    applyStreamerStyle();
  }
  function showStreamerText(move) {
    if (!move) return;
    streamerMove = move;
    renderStreamer();
  }
  function clearStreamerText() {
    streamerMove = null;
    renderStreamer();
  }
  const detection = {
    oppMoves: 0,
    totalCpl: 0,
    bestMoves: 0,
    topThree: 0,
    blunders: 0,
    lastOppEvalCp: null,
    lastOppEvalFen: null,
    lastMyEvalCp: null,
    lastMyEvalFen: null
  };
  const moveLog = [];
  let detTarget = 'b';
  const DETECTION_CACHE_KEY = 'ch-detection-games-v1';
  let activeDetectionKey = '';
  const ELO_TABLE = [ {
    elo: 400,
    acpl: 215,
    bmr: .17,
    acc: 45
  }, {
    elo: 600,
    acpl: 188,
    bmr: .22,
    acc: 50
  }, {
    elo: 800,
    acpl: 158,
    bmr: .27,
    acc: 56
  }, {
    elo: 1e3,
    acpl: 128,
    bmr: .33,
    acc: 62
  }, {
    elo: 1200,
    acpl: 97,
    bmr: .4,
    acc: 68
  }, {
    elo: 1400,
    acpl: 73,
    bmr: .48,
    acc: 73
  }, {
    elo: 1600,
    acpl: 53,
    bmr: .56,
    acc: 78
  }, {
    elo: 1800,
    acpl: 37,
    bmr: .64,
    acc: 82
  }, {
    elo: 2e3,
    acpl: 26,
    bmr: .71,
    acc: 86
  }, {
    elo: 2200,
    acpl: 17,
    bmr: .77,
    acc: 89
  }, {
    elo: 2400,
    acpl: 11,
    bmr: .83,
    acc: 92
  }, {
    elo: 2600,
    acpl: 7,
    bmr: .88,
    acc: 94
  } ];
  function expectedStats(elo) {
    if (!elo) return ELO_TABLE[4];
    const c = Math.max(400, Math.min(2600, elo));
    for (let i = 0; i < ELO_TABLE.length - 1; i++) {
      if (c <= ELO_TABLE[i + 1].elo) {
        const t = (c - ELO_TABLE[i].elo) / (ELO_TABLE[i + 1].elo - ELO_TABLE[i].elo);
        const L = (a, b) => a + t * (b - a);
        return {
          acpl: L(ELO_TABLE[i].acpl, ELO_TABLE[i + 1].acpl),
          bmr: L(ELO_TABLE[i].bmr, ELO_TABLE[i + 1].bmr),
          acc: L(ELO_TABLE[i].acc, ELO_TABLE[i + 1].acc)
        };
      }
    }
    return ELO_TABLE[ELO_TABLE.length - 1];
  }
  function lichessAccuracy(acpl) {
    return Math.max(0, Math.min(100, 103.1668 * Math.exp(-.04354 * (acpl + 3.756)) - 3.1668));
  }
  function getPlayerElos() {
    const elos = {
      top: null,
      bottom: null
    };
    try {
      const topEl = document.querySelector('.player-tagline-top .user-tagline-rating, .board-layout-top .user-tagline-rating, [class*="playerinfo-top"] [data-cy="user-tagline-rating"]');
      const botEl = document.querySelector('.player-tagline-bottom .user-tagline-rating, .board-layout-bottom .user-tagline-rating, [class*="playerinfo-bottom"] [data-cy="user-tagline-rating"]');
      if (topEl) {
        const n = parseInt(topEl.textContent.replace(/[()]/g, ''));
        if (n > 0) elos.top = n;
      }
      if (botEl) {
        const n = parseInt(botEl.textContent.replace(/[()]/g, ''));
        if (n > 0) elos.bottom = n;
      }
      if (!elos.top && !elos.bottom) {
        const all = document.querySelectorAll('.user-tagline-rating, [data-cy="user-tagline-rating"]');
        if (all.length >= 2) {
          elos.top = parseInt(all[0].textContent.replace(/[()]/g, '')) || null;
          elos.bottom = parseInt(all[1].textContent.replace(/[()]/g, '')) || null;
        } else if (all.length === 1) {
          elos.top = parseInt(all[0].textContent.replace(/[()]/g, '')) || null;
        }
      }
    } catch {}
    return elos;
  }
  function getDetectionElo() {
    const elos = getPlayerElos();
    const flipped = isFlipped();
    if (detTarget !== getMyColor()) return flipped ? elos.bottom : elos.top;
    return flipped ? elos.top : elos.bottom;
  }
  function computeSuspicion(acpl, bmr, accuracy, blunders, moveCount, elo) {
    const exp = expectedStats(elo);
    let score = 0;
    if (exp.acpl) {
      const r = exp.acpl / Math.max(acpl, 1);
      if (r > 4) score += 35; else if (r > 3) score += 28; else if (r > 2) score += 18; else if (r > 1.5) score += 9;
    }
    if (exp.bmr) {
      const d = bmr - exp.bmr;
      if (d > .4) score += 75; else if (d > .28) score += 27; else if (d > .18) score += 17; else if (d > .1) score += 8;
    }
    if (moveCount >= 18 && blunders === 0) {
      const b = elo ? elo < 900 ? 15 : elo < 1200 ? 11 : elo < 1600 ? 7 : elo < 2e3 ? 3 : 0 : 6;
      score += b;
    }
    if (exp.acc) {
      const g = accuracy - exp.acc;
      if (g > 22) score += 20; else if (g > 14) score += 14; else if (g > 8) score += 7;
    }
    return Math.min(100, Math.round(score));
  }
  function updateDetectionUI() {
    const movesEl = document.getElementById('ch-det-moves');
    const acplEl = document.getElementById('ch-det-acpl');
    const bmrEl = document.getElementById('ch-det-bmr');
    const accEl = document.getElementById('ch-det-acc');
    const scoreEl = document.getElementById('ch-det-score');
    const fillEl = document.getElementById('ch-det-fill');
    const verdictEl = document.getElementById('ch-det-verdict');
    if (!movesEl) return;
    movesEl.textContent = detection.oppMoves;
    if (detection.oppMoves < 1) {
      acplEl.textContent = '—';
      bmrEl.textContent = '—';
      accEl.textContent = '—';
      scoreEl.textContent = '—';
      fillEl.style.width = '0%';
      fillEl.style.background = 'var(--ch-accent)';
      verdictEl.textContent = 'Play a game to start detection';
      verdictEl.style.color = 'rgba(255,255,255,0.4)';
      return;
    }
    const acpl = Math.round(detection.totalCpl / detection.oppMoves);
    const bmr = detection.bestMoves / detection.oppMoves;
    const accuracy = lichessAccuracy(acpl);
    const elo = getDetectionElo();
    acplEl.textContent = acpl;
    bmrEl.textContent = Math.round(bmr * 100) + '%';
    accEl.textContent = Math.round(accuracy * 10) / 10 + '%';
    const score = computeSuspicion(acpl, bmr, accuracy, detection.blunders, detection.oppMoves, elo);
    let level, color;
    if (score >= 75) {
      level = 'Engine detected';
      color = '#e04040';
    } else if (score >= 50) {
      level = 'Highly suspicious';
      color = '#e07040';
    } else if (score >= 28) {
      level = 'Somewhat suspicious';
      color = '#e0a040';
    } else {
      level = 'Likely clean';
      color = 'var(--ch-accent)';
    }
    if (detection.oppMoves < 5) level += ' (low sample)';
    scoreEl.textContent = score + '%';
    fillEl.style.width = score + '%';
    fillEl.style.background = color;
    verdictEl.textContent = level;
    verdictEl.style.color = color;
  }
  function recalcDetection() {
    const targetColor = detTarget;
    const entries = moveLog.filter(e => e.color === targetColor);
    detection.oppMoves = entries.length;
    detection.totalCpl = entries.reduce((s, e) => s + e.cpl, 0);
    detection.bestMoves = entries.filter(e => e.cpl <= 5).length;
    detection.topThree = entries.filter(e => e.cpl > 5 && e.cpl <= 20).length;
    detection.blunders = entries.filter(e => e.cpl > 200).length;
    updateDetectionUI();
    saveDetectionState();
  }
  function resetDetection() {
    detection.oppMoves = 0;
    detection.totalCpl = 0;
    detection.bestMoves = 0;
    detection.topThree = 0;
    detection.blunders = 0;
    detection.lastOppEvalCp = null;
    detection.lastOppEvalFen = null;
    detection.lastMyEvalCp = null;
    detection.lastMyEvalFen = null;
    moveLog.length = 0;
    recalcDetection();
  }
  const TCN_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^/\\[]|_@#$&';
  function decodeTcn(tcn) {
    const files = 'abcdefgh', promos = [ 'q', 'r', 'b', 'n' ], moves = [];
    for (let i = 0; i + 1 < tcn.length; i += 2) {
      const fi = TCN_CHARS.indexOf(tcn[i]), ti = TCN_CHARS.indexOf(tcn[i + 1]);
      if (fi < 0 || fi > 63 || ti < 0) continue;
      const from = files[fi % 8] + (Math.floor(fi / 8) + 1);
      if (ti < 64) {
        moves.push(from + files[ti % 8] + (Math.floor(ti / 8) + 1));
      } else {
        const extra = ti - 64, promo = promos[Math.floor(extra / 3)] || 'q';
        const dFile = extra % 3 - 1, toFile = fi % 8 + dFile;
        const toRank = Math.floor(fi / 8) < 4 ? 0 : 7;
        if (toFile >= 0 && toFile <= 7) moves.push(from + files[toFile] + (toRank + 1) + promo);
      }
    }
    return moves;
  }
  function decodeTcnMove(t) {
    const r = decodeTcn(t);
    return r.length ? r[0] : null;
  }
  function getGameMoves() {
    const b = getBoard();
    if (!b?.game) return [];
    const game = b.game;
    let uci = [];
    try {
      const lines = game.getRawLines?.();
      if (lines?.[0]?.length) {
        for (const m of lines[0]) {
          if (m?.from && m?.to) uci.push(m.from + m.to + (m.promotion || ''));
        }
      }
    } catch {}
    if (!uci.length) {
      try {
        const tcn = game.getTCN?.();
        if (typeof tcn === 'string' && tcn.length >= 2) uci = decodeTcn(tcn);
      } catch {}
    }
    if (!uci.length) {
      try {
        const h = game.getHistory ? game.getHistory() : game.getMoves ? game.getMoves() : [];
        for (const m of h) {
          if (typeof m === 'string' && m.length >= 4) uci.push(m.slice(0, 5).replace(/\s/g, '')); else if (m?.from && m?.to) uci.push(m.from + m.to + (m.promotion || '')); else if (m?.tcn) {
            const d = decodeTcnMove(m.tcn);
            if (d) uci.push(d);
          }
        }
      } catch {}
    }
    return uci;
  }
  function getDetectionGameIdentity() {
    const pageUrl = new URL(location.href);
    const pathMatch = pageUrl.pathname.match(/\/game\/(?:live|daily)\/([^/]+)/i);
    const urlGameId = pathMatch?.[1] || pageUrl.searchParams.get('gameId') || pageUrl.searchParams.get('game_id');
    if (urlGameId) return {
      key: pageUrl.origin + '|' + urlGameId,
      stable: true
    };
    const b = getBoard();
    let gameId = null;
    try {
      const game = b?.game;
      const candidate = game?.getGameId?.() ?? game?.gameId;
      if (typeof candidate === 'string' || typeof candidate === 'number') gameId = String(candidate);
    } catch {}
    if (gameId) return {
      key: pageUrl.origin + '|' + gameId,
      stable: true
    };
    const players = [ ...document.querySelectorAll('.player-tagline-top .user-tagline-username, .player-tagline-bottom .user-tagline-username, .board-layout-top .user-tagline-username, .board-layout-bottom .user-tagline-username, [data-cy="user-tagline-username"]') ].map(el => el.textContent.trim().toLowerCase()).filter(Boolean).sort();
    return {
      key: pageUrl.origin + pageUrl.pathname + '|' + (players.join('|') || 'chess-game'),
      stable: false
    };
  }
  function readDetectionCache() {
    try {
      const saved = JSON.parse(localStorage.getItem(DETECTION_CACHE_KEY) || '{}');
      return saved && typeof saved === 'object' ? saved : {};
    } catch {
      return {};
    }
  }
  function saveDetectionState() {
    if (!activeDetectionKey) return;
    try {
      const cache = readDetectionCache();
      cache[activeDetectionKey] = {
        savedAt: Date.now(),
        gameMoves: getGameMoves(),
        moveLog: moveLog.map(move => ({
          color: move.color,
          cpl: move.cpl
        })),
        detection: {
          ...detection
        }
      };
      const recent = Object.entries(cache).sort((a, b) => (a[1]?.savedAt || 0) - (b[1]?.savedAt || 0)).slice(-20);
      localStorage.setItem(DETECTION_CACHE_KEY, JSON.stringify(Object.fromEntries(recent)));
    } catch {}
  }
  function syncDetectionGame() {
    const identity = getDetectionGameIdentity();
    if (!identity.key) return false;
    if (identity.key === activeDetectionKey) return true;
    const cache = readDetectionCache();
    const saved = cache[identity.key];
    const currentMoves = getGameMoves();
    const savedMoves = Array.isArray(saved?.gameMoves) ? saved.gameMoves : [];
    const commonLength = Math.min(currentMoves.length, savedMoves.length);
    const historyMatches = savedMoves.slice(0, commonLength).every((move, i) => move === currentMoves[i]);
    if (!identity.stable && savedMoves.length && currentMoves.length < savedMoves.length && historyMatches) return false;
    activeDetectionKey = identity.key;
    moveLog.length = 0;
    positionMoves.clear();
    Object.assign(detection, {
      oppMoves: 0,
      totalCpl: 0,
      bestMoves: 0,
      topThree: 0,
      blunders: 0,
      lastOppEvalCp: null,
      lastOppEvalFen: null,
      lastMyEvalCp: null,
      lastMyEvalFen: null
    });
    const freshGameAgainstCachedOpponent = !identity.stable && currentMoves.length === 0 && savedMoves.length > 0;
    const canRestore = !freshGameAgainstCachedOpponent && saved && (identity.stable || savedMoves.length <= currentMoves.length && historyMatches);
    if (canRestore) {
      const savedLog = Array.isArray(saved.moveLog) ? saved.moveLog : [];
      moveLog.push(...savedLog.filter(move => (move.color === 'w' || move.color === 'b') && Number.isFinite(move.cpl)));
      if (saved.detection && typeof saved.detection === 'object') Object.assign(detection, saved.detection);
    }
    recalcDetection();
    return true;
  }
  const pieceToFen = {
    wp: 'P',
    wn: 'N',
    wb: 'B',
    wr: 'R',
    wq: 'Q',
    wk: 'K',
    bp: 'p',
    bn: 'n',
    bb: 'b',
    br: 'r',
    bq: 'q',
    bk: 'k'
  };
  function getBoard() {
    return document.querySelector('wc-chess-board') || document.querySelector('chess-board') || document.querySelector('.board');
  }
  function isFlipped() {
    const b = getBoard();
    if (!b) return false;
    if (b.hasAttribute?.('flipped') || b.classList?.contains('flipped')) return true;
    return false;
  }
  function getMyColor() {
    const b = getBoard();
    if (b?.game?.getPlayingAs) try {
      const c = b.game.getPlayingAs();
      if (c === 1 || c === 'w' || c === 'white') return 'w';
      if (c === 2 || c === 'b' || c === 'black') return 'b';
    } catch {}
    if (b?.hasAttribute?.('flipped') || b?.classList?.contains('flipped')) return 'b';
    return 'w';
  }
  function inActiveGame() {
    const b = getBoard();
    if (!b) return false;
    const clocks = document.querySelectorAll('.clock-component, .clock-bottom, .clock-top, [class*="clock-component"]');
    if ([ ...clocks ].some(c => c.classList.contains('clock-player-turn') || [ ...c.classList ].some(cl => cl.includes('clock-player-turn')))) return true;
    if (clocks.length >= 2) return true;
    if (b.game?.getPlayingAs) {
      try {
        const p = b.game.getPlayingAs();
        if (p === 1 || p === 2 || p === 'w' || p === 'b' || p === 'white' || p === 'black') return true;
        if (p != null) return true;
      } catch {
        return true;
      }
    }
    if (clocks.length >= 1 && document.querySelector('wc-move-list, .move-list-wrapper, .vertical-move-list')) {
      if (b.game?.getFEN || b.game?.getTurn) return true;
    }
    return false;
  }
  function gameInProgress() {
    const sel = '.game-setup-component, .bot-selection-component, [class*="game-setup"], [class*="bot-selection"], .selection-menu-personalities, .board-modal-container-component, .game-over-modal-content';
    const el = document.querySelector(sel);
    if (el && el.offsetParent !== null) return false;
    return true;
  }
  function isMyTurn() {
    const b = getBoard();
    const bottom = document.querySelector('.clock-bottom, .clock-component-bottom');
    const top = document.querySelector('.clock-top, .clock-component-top');
    const bottomActive = Boolean(bottom?.classList.contains('clock-player-turn'));
    const topActive = Boolean(top?.classList.contains('clock-player-turn'));
    if (bottomActive !== topActive) return bottomActive;
    if (b?.game?.getFEN) {
      const fields = b.game.getFEN().split(' ');
      const turn = fields[1];
      const moveNumber = parseInt(fields[5], 10);
      if (turn === 'w' && moveNumber === 1 && getGameMoves().length === 0 && !bottomActive && !topActive) return getMyColor() === 'w';
      if (turn === 'w' || turn === 'b') return turn === getMyColor();
      return null;
    }
    if (bottom && !top) return bottomActive ? true : null;
    if (top && !bottom) return topActive ? false : null;
    return null;
  }
  function getFEN() {
    const b = getBoard();
    if (b?.game?.getFEN) {
      const fen = b.game.getFEN();
      if (fen && fen.includes('/')) return fen;
    }
    const pieces = document.querySelectorAll('.piece');
    if (!pieces.length) return null;
    const board = Array.from({
      length: 8
    }, () => Array(8).fill(null));
    pieces.forEach(p => {
      const cls = [ ...p.classList ];
      const type = cls.find(c => pieceToFen[c]);
      const sq = cls.find(c => c.startsWith('square-'));
      if (type && sq) {
        const n = sq.split('-')[1];
        board[8 - +n[1]][+n[0] - 1] = pieceToFen[type];
      }
    });
    const rows = board.map(r => {
      let s = '', e = 0;
      for (const c of r) {
        if (!c) e++; else {
          if (e) s += e;
          e = 0;
          s += c;
        }
      }
      return s + (e || '');
    });
    const bottom = document.querySelector('.clock-bottom, .clock-component-bottom');
    const top = document.querySelector('.clock-top, .clock-component-top');
    let turn = 'w';
    if (bottom && bottom.classList.contains('clock-player-turn')) turn = getMyColor() || 'w'; else if (top && top.classList.contains('clock-player-turn')) turn = getMyColor() === 'w' ? 'b' : 'w';
    let castle = '';
    if (board[7][4] === 'K') {
      if (board[7][7] === 'R') castle += 'K';
      if (board[7][0] === 'R') castle += 'Q';
    }
    if (board[0][4] === 'k') {
      if (board[0][7] === 'r') castle += 'k';
      if (board[0][0] === 'r') castle += 'q';
    }
    if (!castle) castle = '-';
    return rows.join('/') + ` ${turn} ${castle} - 0 1`;
  }
  const positionMoves = new Map;
  const REPEAT_THRESHOLD = 2;
  let ENGINE_DEPTH = 16;
  const engineDepths = {};
  let DELAY_MIN = 1, DELAY_MAX = 5, DELAY_ENABLED = false;
  const fenCache = new Map;
  const FEN_CACHE_MAX = 100;
  function getCachedEval(fen, multiPV) {
    const entry = fenCache.get(fen);
    if (entry && entry.multiPV >= multiPV) {
      fenCache.delete(fen);
      fenCache.set(fen, entry);
      return entry.results;
    }
    return null;
  }
  function setCachedEval(fen, results, multiPV) {
    if (fenCache.has(fen)) fenCache.delete(fen);
    if (fenCache.size >= FEN_CACHE_MAX) {
      const first = fenCache.keys().next().value;
      fenCache.delete(first);
    }
    fenCache.set(fen, {
      results,
      multiPV
    });
  }
  function boardKey(fen) {
    const parts = fen.split(' ');
    return parts[0] + ' ' + (parts[1] || 'w');
  }
  let sfWorker = null, sfReady = false, sfCurrentMultiPV = 1;
  const ENGINES = {
    sf19: {
      label: 'Stockfish 19',
      kind: 'wasm',
      maxDepth: 24,
      jsUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/19/stockfish.js',
      wasmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/19/stockfish.wasm',
      asmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/19/stockfish.asm.js'
    },
    sf18: {
      label: 'Stockfish 18',
      kind: 'wasm',
      maxDepth: 24,
      jsUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/18/stockfish.js',
      wasmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/18/stockfish.wasm',
      asmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/18/stockfish.asm.js'
    },
    sf17: {
      label: 'Stockfish 17',
      kind: 'wasm',
      maxDepth: 24,
      jsUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/17/stockfish.js',
      wasmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/17/stockfish.wasm',
      asmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/17/stockfish.asm.js'
    },
    sf16: {
      label: 'Stockfish 16',
      kind: 'wasm',
      maxDepth: 24,
      jsUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/16/stockfish.js',
      wasmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/16/stockfish.wasm'
    },
    sf11: {
      label: 'Stockfish 11',
      kind: 'wasm',
      maxDepth: 24,
      jsUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/11/stockfish.js',
      wasmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/11/stockfish.wasm',
      asmUrl: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/11/stockfish.asm.js'
    },
    sf10: {
      label: 'Stockfish 10',
      kind: 'js',
      maxDepth: 24,
      url: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/10/stockfish.asm.js'
    },
    sf8: {
      label: 'Stockfish 8',
      kind: 'js',
      maxDepth: 24,
      hash: 8,
      url: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/stockfish/8/stockfish.js'
    },
    lozza11: {
      label: 'Lozza 11',
      kind: 'js',
      maxDepth: 12,
      url: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@v1/lozza/11/lozza.js',
      noMultiPV: true
    },
    garbochess: {
      label: 'Garbochess',
      kind: 'js',
      maxDepth: 12,
      url: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@main/garbochess/1/garbochess.js?v=4',
      noMultiPV: true
    },
    p4wn: {
      label: 'p4wn',
      kind: 'js',
      maxDepth: 4,
      defaultDepth: 3,
      url: 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@main/p4wn/1/p4wn.js?v=3',
      noMultiPV: true,
      noStop: true
    }
  };
  let currentEngine = 'sf19';
  let _loadingOverlay = null;
  function showLoadingOverlay(label, percent) {
    try {
      if (!_loadingOverlay) {
        _loadingOverlay = document.createElement('div');
        _loadingOverlay.id = 'ch-loading-overlay';
        _loadingOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:var(--ch-font,sans-serif);color:#fff;backdrop-filter:blur(3px);';
        _loadingOverlay.innerHTML = '<div style="background:#1a1a1c;padding:22px 32px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;align-items:center;gap:12px;min-width:240px;"><div style="width:32px;height:32px;border:3px solid rgba(255,255,255,0.15);border-top-color:var(--ch-accent,#7fffb0);border-radius:50%;animation:ch-spin 0.8s linear infinite;"></div><div id="ch-loading-label" style="font-size:13px;font-weight:600;letter-spacing:0.3px;">Loading engine...</div><div id="ch-loading-pct" style="font-size:11px;color:rgba(255,255,255,0.55);font-variant-numeric:tabular-nums;">0%</div></div><style>@keyframes ch-spin{to{transform:rotate(360deg);}}</style>';
        document.body.appendChild(_loadingOverlay);
      }
      const lbl = _loadingOverlay.querySelector('#ch-loading-label');
      if (lbl && label != null) lbl.textContent = label;
      const pct = _loadingOverlay.querySelector('#ch-loading-pct');
      if (pct) pct.textContent = percent == null ? '' : Math.max(0, Math.min(100, Math.round(percent))) + '%';
      _loadingOverlay.style.display = 'flex';
    } catch {}
  }
  function hideLoadingOverlay() {
    try {
      if (_loadingOverlay) _loadingOverlay.style.display = 'none';
    } catch {}
  }
  async function fetchWithProgress(url, onBytes) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('HTTP ' + resp.status + ' ' + url);
    const total = Number(resp.headers.get('Content-Length')) || 0;
    const reader = resp.body.getReader();
    const chunks = [];
    let received = 0;
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      try {
        onBytes(received, total);
      } catch {}
    }
    const buf = new Uint8Array(received);
    let off = 0;
    for (const c of chunks) {
      buf.set(c, off);
      off += c.length;
    }
    return buf.buffer;
  }
  let _initP = null;
  async function initEngine() {
    if (sfReady) return;
    if (_initP) return _initP;
    _initP = _doInitEngine().catch(e => {
      _initP = null;
      throw e;
    });
    return _initP;
  }
  async function _doInitEngine() {
    if (sfWorker) return;
    const engine = ENGINES[currentEngine] || ENGINES['sf19'];
    try {
      if (engine.kind === 'wasm') {
        let jsBytes = 0, jsTotal = 0, wasmBytes = 0, wasmTotal = 0;
        const updateProgress = () => {
          const total = jsTotal + wasmTotal;
          if (total > 0) {
            const pct = (jsBytes + wasmBytes) / total * 100;
            showLoadingOverlay(null, pct);
          }
        };
        const [jsBuf, wasmBuf] = await Promise.all([ fetchWithProgress(engine.jsUrl, (r, t) => {
          jsBytes = r;
          jsTotal = t;
          updateProgress();
        }), fetchWithProgress(engine.wasmUrl, (r, t) => {
          wasmBytes = r;
          wasmTotal = t;
          updateProgress();
        }) ]);
        const jsCode = (new TextDecoder).decode(jsBuf);
        showLoadingOverlay(null, 100);
        const boot = 'if(typeof SharedArrayBuffer==="undefined"){self.SharedArrayBuffer=function(){throw new Error("SAB disabled");};self.SharedArrayBuffer.prototype={};}self.onmessage=function(e){if(e.data&&e.data.type==="init"){self.onmessage=null;var w=e.data.wasm,done=false,of=self.fetch;self.fetch=function(u,o){if(!done){done=true;return Promise.resolve(new Response(w,{status:200,headers:{"Content-Type":"application/wasm"}}))}return of.call(self,u,o)};importScripts(URL.createObjectURL(new Blob([e.data.js],{type:"application/javascript"})));if(!self.onmessage&&typeof Stockfish==="function"){try{Promise.resolve(Stockfish()).then(function(sf){if(sf&&sf.addMessageListener){sf.addMessageListener(function(line){self.postMessage(line);});self.onmessage=function(ev){try{sf.postMessage(ev.data);}catch(err){}};}}).catch(function(err){self.postMessage("info string Stockfish init error: "+err);});}catch(err){self.postMessage("info string Stockfish boot error: "+err);}}}};';
        sfWorker = new Worker(URL.createObjectURL(new Blob([ boot ], {
          type: 'application/javascript'
        })));
        sfWorker.postMessage({
          type: 'init',
          wasm: wasmBuf,
          js: jsCode
        }, [ wasmBuf ]);
      } else {
        const buf = await fetchWithProgress(engine.url, (r, t) => {
          if (t > 0) showLoadingOverlay(null, r / t * 100);
        });
        const code = (new TextDecoder).decode(buf);
        showLoadingOverlay(null, 100);
        sfWorker = new Worker(URL.createObjectURL(new Blob([ code ], {
          type: 'application/javascript'
        })));
      }
      sfWorker.onerror = handleWorkerCrash;
      await uciCommand('uci', 'uciok');
      uciSend('setoption name Hash value ' + (engine.hash || 64));
      sfCurrentMultiPV = 1;
      if (!engine.noMultiPV) uciSend('setoption name MultiPV value 1');
      await uciCommand('isready', 'readyok');
      sfReady = true;
      hideLoadingOverlay();
      lastEngineResponse = Date.now();
      installReadyokListener();
    } catch (e) {
      console.warn('[Chess Assist] engine init failed:', e);
      try {
        if (sfWorker) sfWorker.terminate();
      } catch {}
      sfWorker = null;
      if (engine.kind === 'wasm' && engine.asmUrl) {
        try {
          const r = await fetch(engine.asmUrl);
          const code = await r.text();
          sfWorker = new Worker(URL.createObjectURL(new Blob([ code ], {
            type: 'application/javascript'
          })));
          sfWorker.onerror = handleWorkerCrash;
          await uciCommand('uci', 'uciok');
          uciSend('setoption name Hash value ' + (engine.hash || 64));
          sfCurrentMultiPV = 1;
          if (!engine.noMultiPV) uciSend('setoption name MultiPV value 1');
          await uciCommand('isready', 'readyok');
          sfReady = true;
          lastEngineResponse = Date.now();
          installReadyokListener();
          return;
        } catch (e2) {
          console.warn('[Chess Assist] asm fallback failed:', e2);
          try {
            if (sfWorker) sfWorker.terminate();
          } catch {}
          sfWorker = null;
        }
      }
      hideLoadingOverlay();
      throw e;
    }
  }
  async function switchEngine(newKey) {
    if (!ENGINES[newKey] || newKey === currentEngine) {
      hideLoadingOverlay();
      return;
    }
    engineDepths[currentEngine] = ENGINE_DEPTH;
    currentEngine = newKey;
    showLoadingOverlay('Loading ' + (ENGINES[newKey].label || newKey) + '...');
    if (typeof engineDepths[newKey] === 'number') ENGINE_DEPTH = engineDepths[newKey];
    try {
      if (activeSearchHandler && sfWorker) {
        sfWorker.removeEventListener('message', activeSearchHandler);
        activeSearchHandler = null;
      }
      if (activeSearchTimeout) {
        clearTimeout(activeSearchTimeout);
        activeSearchTimeout = null;
      }
      if (sfWorker) {
        sfWorker.terminate();
      }
    } catch {}
    sfWorker = null;
    sfReady = false;
    _initP = null;
    isWaitingForReady = false;
    if (pendingQuery) {
      try {
        pendingQuery.resolve([]);
      } catch {}
      pendingQuery = null;
    }
    fenCache.clear();
    lastEngineResponse = Date.now();
    if (oppAbort) {
      oppAbort.aborted = true;
      oppAbort = null;
    }
    processingMy = false;
    processingOpp = false;
    lastFen = '';
    lastMovedFen = '';
    lastOppFen = '';
    lastOppMove = null;
    lastOppQueryFen = '';
    lastOppQueryAt = 0;
    waitingForOpponent = false;
    detection.lastOppEvalCp = null;
    detection.lastOppEvalFen = null;
    detection.lastMyEvalCp = null;
    detection.lastMyEvalFen = null;
    applyDepthCap();
    try {
      await initEngine();
    } catch (e) {
      console.warn('[Chess Assist] switchEngine init failed:', e);
      hideLoadingOverlay();
      try {
        const es = document.getElementById('ch-engine');
        if (es) es.disabled = false;
      } catch {}
      return;
    }
    hideLoadingOverlay();
    try {
      const es = document.getElementById('ch-engine');
      if (es) es.disabled = false;
    } catch {}
    tick();
  }
  function applyDepthCap() {
    const cap = ENGINES[currentEngine]?.maxDepth || 24;
    const changed = ENGINE_DEPTH > cap;
    if (changed) ENGINE_DEPTH = cap;
    const ds = document.getElementById('ch-depth');
    const dv = document.getElementById('ch-depth-val');
    if (ds) {
      ds.max = cap;
      if (+ds.value > cap) ds.value = ENGINE_DEPTH;
    }
    if (dv) dv.textContent = ENGINE_DEPTH;
    if (changed) saveSettings();
  }
  function installReadyokListener() {
    if (!sfWorker) return;
    sfWorker.addEventListener('message', e => {
      const line = typeof e.data === 'string' ? e.data : '';
      if (line === 'readyok' && isWaitingForReady) {
        isWaitingForReady = false;
        if (pendingQuery) {
          const q = pendingQuery;
          pendingQuery = null;
          startSearch(q);
        }
      }
    });
  }
  function handleWorkerCrash() {
    console.warn('[Chess Assist] Engine worker crashed, restarting...');
    if (activeSearchHandler && sfWorker) {
      try {
        sfWorker.removeEventListener('message', activeSearchHandler);
      } catch {}
    }
    activeSearchHandler = null;
    if (activeSearchTimeout) {
      clearTimeout(activeSearchTimeout);
      activeSearchTimeout = null;
    }
    if (pendingQuery) {
      pendingQuery.resolve([]);
      pendingQuery = null;
    }
    isWaitingForReady = false;
    sfWorker = null;
    sfReady = false;
    sfCurrentMultiPV = 1;
    _initP = null;
    fenCache.clear();
    lastEngineResponse = Date.now();
    initEngine().catch(err => console.warn('[Chess Assist] restart failed:', err));
  }
  let lastEngineResponse = Date.now();
  setInterval(() => {
    if (!sfWorker || !sfReady) return;
    if (!activeSearchHandler && !isWaitingForReady) return;
    const silent = Date.now() - lastEngineResponse;
    if (silent > 15e3) {
      console.warn('[Chess Assist] Engine unresponsive for ' + Math.round(silent / 1e3) + 's, restarting...');
      handleWorkerCrash();
    }
  }, 5e3);
  function uciSend(cmd) {
    if (sfWorker) sfWorker.postMessage(cmd);
  }
  function uciCommand(cmd, waitFor) {
    return new Promise((resolve, reject) => {
      const worker = sfWorker;
      if (!worker) {
        reject(new Error('no worker'));
        return;
      }
      const timeout = setTimeout(() => {
        try {
          worker.removeEventListener('message', handler);
        } catch {}
        reject(new Error('UCI timeout waiting for ' + waitFor));
      }, 1e4);
      const handler = e => {
        lastEngineResponse = Date.now();
        if (typeof e.data === 'string' && e.data.startsWith(waitFor)) {
          clearTimeout(timeout);
          try {
            worker.removeEventListener('message', handler);
          } catch {}
          resolve(e.data);
        }
      };
      worker.addEventListener('message', handler);
      worker.postMessage(cmd);
    });
  }
  let isWaitingForReady = false;
  let pendingQuery = null;
  let activeSearchHandler = null;
  let activeSearchTimeout = null;
  function queryLocal(fen, depth, multiPV) {
    multiPV = multiPV || 1;
    const cached = getCachedEval(fen, multiPV);
    if (cached) return Promise.resolve(cached);
    return new Promise(resolve => {
      if (!sfWorker || !sfReady) {
        resolve([]);
        return;
      }
      if (pendingQuery) pendingQuery.resolve([]);
      pendingQuery = {
        fen,
        depth,
        multiPV,
        resolve
      };
      if (isWaitingForReady) return;
      if (activeSearchHandler) {
        sfWorker.removeEventListener('message', activeSearchHandler);
        activeSearchHandler = null;
      }
      if (activeSearchTimeout) {
        clearTimeout(activeSearchTimeout);
        activeSearchTimeout = null;
      }
      uciSend('stop');
      uciSend('isready');
      isWaitingForReady = true;
    });
  }
  function startSearch(q) {
    if (!q || !sfWorker || !sfReady) return;
    const {fen, depth, multiPV, resolve} = q;
    if (activeSearchHandler) {
      sfWorker.removeEventListener('message', activeSearchHandler);
      activeSearchHandler = null;
    }
    if (activeSearchTimeout) {
      clearTimeout(activeSearchTimeout);
      activeSearchTimeout = null;
    }
    const engine = ENGINES[currentEngine];
    const effectiveMPV = engine?.noMultiPV ? 1 : multiPV;
    if (sfCurrentMultiPV !== effectiveMPV && !engine?.noMultiPV) {
      sfCurrentMultiPV = effectiveMPV;
      uciSend('setoption name MultiPV value ' + effectiveMPV);
    }
    const moves = {};
    let gotBestmove = false;
    let stopped = false;
    const SOFT_TIMEOUT = engine?.noMultiPV ? 3e4 : 12e3;
    activeSearchTimeout = setTimeout(() => {
      if (gotBestmove || stopped) return;
      stopped = true;
      try {
        uciSend('stop');
      } catch {}
      setTimeout(() => {
        if (gotBestmove) return;
        try {
          sfWorker && sfWorker.removeEventListener('message', handler);
        } catch {}
        activeSearchHandler = null;
        activeSearchTimeout = null;
        const results = Object.entries(moves).sort((a, b) => a[0] - b[0]).map(e => e[1]);
        resolve(results);
      }, 500);
    }, SOFT_TIMEOUT);
    const handler = e => {
      const line = typeof e.data === 'string' ? e.data : '';
      lastEngineResponse = Date.now();
      if (line.startsWith('bestmove') && !gotBestmove) {
        gotBestmove = true;
        clearTimeout(activeSearchTimeout);
        activeSearchTimeout = null;
        sfWorker.removeEventListener('message', handler);
        activeSearchHandler = null;
        const best = line.split(/\s+/)[1];
        if (best && best.length >= 4 && !moves[1]) moves[1] = {
          move: best.slice(0, 4),
          cp: null
        };
        const results = Object.entries(moves).sort((a, b) => a[0] - b[0]).map(e => e[1]);
        if (results.length && !stopped) setCachedEval(fen, results, effectiveMPV);
        resolve(results);
        return;
      }
      const pvMatchWithIdx = line.match(/multipv\s+(\d+).*?\bpv\s+(\S+)/);
      if (pvMatchWithIdx) {
        const pvIdx = parseInt(pvMatchWithIdx[1]);
        const mv = pvMatchWithIdx[2];
        if (mv.length >= 4) {
          const scoreMatch = line.match(/score\s+(cp\s+[-\d]+|mate\s+[-\d]+)/);
          let cp = null, mate = null;
          if (scoreMatch) {
            const parts = scoreMatch[1].split(/\s+/);
            if (parts[0] === 'mate') {
              mate = parseInt(parts[1]);
              cp = mate > 0 ? 99999 : -99999;
            } else cp = parseInt(parts[1]);
          }
          moves[pvIdx] = {
            move: mv.slice(0, 4),
            cp,
            mate
          };
        }
      } else if (engine?.noMultiPV) {
        const pvOnly = line.match(/\bpv\s+(\S+)/);
        if (pvOnly) {
          const mv = pvOnly[1];
          if (mv.length >= 4) {
            const scoreMatch = line.match(/score\s+(cp\s+[-\d]+|mate\s+[-\d]+)/);
            let cp = null, mate = null;
            if (scoreMatch) {
              const parts = scoreMatch[1].split(/\s+/);
              if (parts[0] === 'mate') {
                mate = parseInt(parts[1]);
                cp = mate > 0 ? 99999 : -99999;
              } else cp = parseInt(parts[1]);
            }
            moves[1] = {
              move: mv.slice(0, 4),
              cp,
              mate
            };
          }
        }
      }
    };
    activeSearchHandler = handler;
    sfWorker.addEventListener('message', handler);
    uciSend('position fen ' + fen);
    uciSend('go depth ' + depth);
  }
  async function fetchRemote(fen) {
    if (!sfReady) await initEngine();
    const key = boardKey(fen);
    const played = positionMoves.get(key) || [];
    const top = await queryLocal(fen, ENGINE_DEPTH, 1);
    if (!top.length) return null;
    const topCount = played.filter(m => m === top[0].move).length;
    if (topCount < REPEAT_THRESHOLD) return top[0];
    if (ENGINES[currentEngine]?.noMultiPV) return top[0];
    const candidates = await queryLocal(fen, ENGINE_DEPTH, 3);
    if (!candidates.length) return top[0];
    let best = candidates[0], bestCount = Infinity;
    for (const c of candidates) {
      const count = played.filter(m => m === c.move).length;
      if (count < REPEAT_THRESHOLD) return c;
      if (count < bestCount) {
        best = c;
        bestCount = count;
      }
    }
    return best;
  }
  function flipFEN(fen) {
    const parts = fen.split(' ');
    parts[1] = parts[1] === 'w' ? 'b' : 'w';
    return parts.join(' ');
  }
  async function queryOpponentBest(fen) {
    if (!sfReady) await initEngine();
    const flipped = flipFEN(fen);
    const candidates = await queryLocal(flipped, ENGINE_DEPTH, 1);
    if (!candidates.length) return null;
    return candidates[0].move;
  }
  function recordMove(fen, move) {
    const key = boardKey(fen);
    const played = positionMoves.get(key) || [];
    played.push(move);
    positionMoves.set(key, played);
  }
  initEngine().catch(err => console.warn('[Chess Assist] initial engine load failed:', err));
  function clickSquare(sq) {
    const b = getBoard();
    if (!b) return;
    const rect = b.getBoundingClientRect();
    const sqSize = rect.width / 8;
    const file = sq.charCodeAt(0) - 97;
    const rank = parseInt(sq[1]);
    const flipped = isFlipped();
    const x = flipped ? rect.left + (7 - file) * sqSize + sqSize / 2 : rect.left + file * sqSize + sqSize / 2;
    const y = flipped ? rect.top + (rank - 1) * sqSize + sqSize / 2 : rect.top + (8 - rank) * sqSize + sqSize / 2;
    for (const type of [ 'pointerdown', 'pointerup', 'click' ]) {
      const Cls = type === 'click' ? MouseEvent : PointerEvent;
      b.dispatchEvent(new Cls(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        button: 0,
        buttons: type === 'pointerdown' ? 1 : 0,
        pointerId: 1,
        isPrimary: true,
        pointerType: 'mouse'
      }));
    }
  }
  function isPromotion(fen, from, to) {
    const rank = to[1];
    if (rank !== '8' && rank !== '1') return false;
    const parts = (fen || '').split(' ');
    const rows = (parts[0] || '').split('/');
    const file = from.charCodeAt(0) - 97;
    const fromRank = parseInt(from[1]);
    const rowIdx = 8 - fromRank;
    if (rowIdx < 0 || rowIdx > 7) return false;
    const row = rows[rowIdx] || '';
    let col = 0;
    for (const ch of row) {
      if (ch >= '1' && ch <= '8') {
        col += parseInt(ch);
      } else {
        if (col === file) return ch === 'P' || ch === 'p';
        col++;
      }
    }
    return false;
  }
  async function makeMove(move) {
    if (!move || move.length < 4) return;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    const fenBefore = getFEN();
    const needsPromo = isPromotion(fenBefore, from, to);
    const promoChar = move.length > 4 ? move[4] : 'q';
    for (let attempt = 0; attempt < 3; attempt++) {
      clickSquare(from);
      await new Promise(r => setTimeout(r, 200 + attempt * 100));
      clickSquare(to);
      await new Promise(r => setTimeout(r, 300));
      if (needsPromo) {
        const color = getMyColor() || 'w';
        for (let pi = 0; pi < 8; pi++) {
          const promoWin = document.querySelector('.promotion-window, .promotion-area, [class*="promotion"]');
          if (!promoWin) {
            await new Promise(r => setTimeout(r, 150));
            continue;
          }
          const el = promoWin.querySelector(`.promotion-piece.${color}${promoChar}`) || promoWin.querySelector(`.promotion-piece[data-piece="${color}${promoChar}"]`) || promoWin.querySelector(`.promotion-piece[data-piece="${promoChar}"]`) || promoWin.querySelector(`[data-piece="${color}${promoChar}"]`) || promoWin.querySelector(`.piece.${color}${promoChar}`) || promoWin.querySelector(`.${color}${promoChar}`) || promoWin.querySelector(`.promotion-piece.${color}q`) || promoWin.querySelector(`.promotion-piece[data-piece="${color}q"]`) || promoWin.querySelector(`[data-piece="${color}q"]`) || promoWin.children[0];
          if (el) {
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            for (const type of [ 'pointerdown', 'pointerup', 'click' ]) {
              const Cls = type === 'click' ? MouseEvent : PointerEvent;
              el.dispatchEvent(new Cls(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: cx,
                clientY: cy,
                button: 0,
                buttons: type === 'pointerdown' ? 1 : 0,
                pointerId: 1,
                isPrimary: true,
                pointerType: 'mouse'
              }));
            }
            break;
          }
          await new Promise(r => setTimeout(r, 150));
        }
        await new Promise(r => setTimeout(r, 300));
      }
      if (getFEN() !== fenBefore) break;
    }
  }
  function clearArrows() {
    drawing = true;
    const b = getBoard();
    try {
      if (b?.game?.markings?.removeAll) b.game.markings.removeAll();
    } catch {}
    document.querySelectorAll('.ch-arrow-svg').forEach(e => e.remove());
    drawing = false;
  }
  function clearShading() {
    drawing = true;
    document.querySelectorAll('.ch-shade-overlay').forEach(e => e.remove());
    drawing = false;
  }
  function drawShading(move) {
    clearShading();
    const b = getBoard();
    if (!b || !move) return;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    const rect = b.getBoundingClientRect();
    const sqSize = rect.width / 8;
    const flipped = isFlipped();
    if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
    for (const sq of [ from, to ]) {
      const file = sq.charCodeAt(0) - 97;
      const rank = parseInt(sq[1]);
      const px = flipped ? (7 - file) * sqSize : file * sqSize;
      const py = flipped ? (rank - 1) * sqSize : (8 - rank) * sqSize;
      const overlay = document.createElement('div');
      overlay.className = 'ch-shade-overlay';
      overlay.style.cssText = `left:${px}px;top:${py}px;width:${sqSize}px;height:${sqSize}px;background:rgba(0,0,0,${HIDDEN_DARKNESS});`;
      b.appendChild(overlay);
    }
  }
  function squareToPct(sq, flipped) {
    const file = sq.charCodeAt(0) - 97;
    const rank = +sq[1];
    if (flipped) return {
      x: (7 - file) * 12.5 + 6.25,
      y: (rank - 1) * 12.5 + 6.25
    };
    return {
      x: file * 12.5 + 6.25,
      y: (8 - rank) * 12.5 + 6.25
    };
  }
  function drawArrowSVG(b, move, color, opacity, cssClass, zIndex) {
    drawing = true;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    const flipped = isFlipped();
    const s = squareToPct(from, flipped);
    const e = squareToPct(to, flipped);
    const dx = e.x - s.x, dy = e.y - s.y;
    const len = Math.hypot(dx, dy);
    if (len < .5) {
      drawing = false;
      return;
    }
    const ux = dx / len, uy = dy / len;
    const headLen = 4.5, headW = 3.5, bodyW = 1.4;
    const tipX = e.x - ux * 1, tipY = e.y - uy * 1;
    const baseX = s.x + ux * 1, baseY = s.y + uy * 1;
    const neckX = tipX - ux * headLen, neckY = tipY - uy * headLen;
    const nx = -uy, ny = ux;
    const pts = [ [ baseX + nx * bodyW, baseY + ny * bodyW ], [ neckX + nx * bodyW, neckY + ny * bodyW ], [ neckX + nx * headW, neckY + ny * headW ], [ tipX, tipY ], [ neckX - nx * headW, neckY - ny * headW ], [ neckX - nx * bodyW, neckY - ny * bodyW ], [ baseX - nx * bodyW, baseY - ny * bodyW ] ];
    let svg = b.querySelector('.' + cssClass);
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.classList.add(cssClass);
      svg.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:${zIndex};`;
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      b.appendChild(svg);
    } else {
      svg.innerHTML = '';
    }
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' '));
    poly.setAttribute('fill', color);
    poly.setAttribute('opacity', opacity);
    svg.appendChild(poly);
    drawing = false;
  }
  function drawNativeArrow(move) {
    clearArrows();
    const b = getBoard();
    if (!b || !move) return;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    try {
      if (b.game?.markings?.addMany) {
        drawing = true;
        b.game.markings.addMany([ {
          data: {
            from,
            to,
            color: '#96bc4b',
            opacity: .8
          },
          type: 'arrow'
        } ]);
        drawing = false;
        return;
      }
    } catch {
      drawing = false;
    }
    drawArrowSVG(b, move, '#96bc4b', '0.8', 'ch-arrow-svg', 1e3);
  }
  let oppArrowIds = [];
  function clearOpponentArrow() {
    drawing = true;
    document.querySelectorAll('.ch-opponent-svg').forEach(e => e.remove());
    const b = getBoard();
    try {
      if (b?.game?.markings?.remove && oppArrowIds.length) {
        for (const id of oppArrowIds) {
          try {
            b.game.markings.remove(id);
          } catch {}
        }
      }
    } catch {}
    oppArrowIds = [];
    drawing = false;
  }
  function drawOpponentArrow(move) {
    clearOpponentArrow();
    const b = getBoard();
    if (!b || !move) return;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    try {
      if (b.game?.markings?.addMany) {
        drawing = true;
        const ret = b.game.markings.addMany([ {
          data: {
            from,
            to,
            color: '#e04040',
            opacity: .8
          },
          type: 'arrow'
        } ]);
        if (Array.isArray(ret)) oppArrowIds = ret.filter(x => x != null);
        drawing = false;
        return;
      }
    } catch {
      drawing = false;
    }
    drawArrowSVG(b, move, '#e04040', '0.8', 'ch-opponent-svg', 1002);
  }
  function cpToWinPct(cp) {
    if (cp === null || cp === undefined) return 50;
    return Math.round(100 / (1 + Math.exp(-.00368208 * cp)));
  }
  function updateEval(cp, myColor) {
    const bar = document.getElementById('ch-eval-white');
    const top = document.getElementById('ch-eval-pct-top');
    const bot = document.getElementById('ch-eval-pct-bot');
    const barWrap = document.getElementById('ch-eval-bar');
    if (!bar || !top || !bot) return;
    const flipped = myColor === 'b';
    const myPct = cpToWinPct(cp);
    const oppPct = 100 - myPct;
    const fillPct = myPct;
    bar.style.height = fillPct + '%';
    bar.style.background = flipped ? '#000' : '#fff';
    if (barWrap) barWrap.style.background = flipped ? '#fff' : '#000';
    top.textContent = oppPct + '%';
    bot.textContent = myPct + '%';
    top.style.color = flipped ? '#000' : '#fff';
    bot.style.color = flipped ? '#fff' : '#000';
    top.style.textShadow = flipped ? '0 0 4px #fff, 0 0 4px #fff' : '0 0 4px #000, 0 0 4px #000';
    bot.style.textShadow = flipped ? '0 0 4px #000, 0 0 4px #000' : '0 0 4px #fff, 0 0 4px #fff';
  }
  let processingMy = false, processingOpp = false, lastFen = '', lastMovedFen = '', drawing = false, lastOppFen = '', lastOppMove = null, waitingForOpponent = false;
  let lastOppQueryFen = '', lastOppQueryAt = 0;
  let oppAbort = null;
  let _lastSyncDetection = 0, _lastInActive = false, _lastGip = false;
  async function tick() {
    if (!window.chessHelper.autoPlay && !window.chessHelper.showArrow && !window.chessHelper.hiddenArrow && !window.chessHelper.showOpponent && !window.chessHelper.showEval && !window.chessHelper.detection && !window.chessHelper.voice && !window.chessHelper.streamer) return;
    const _active = inActiveGame();
    if (_active && !_lastInActive && window.chessHelper.autoPlay) {
      lastFen = '';
      lastMovedFen = '';
      waitingForOpponent = false;
      for (let i = 1; i <= 5; i++) setTimeout(tick, i * 1e3);
    }
    _lastInActive = _active;
    const _gip = gameInProgress();
    if (_gip && !_lastGip && window.chessHelper.autoPlay) {
      lastFen = '';
      lastMovedFen = '';
      waitingForOpponent = false;
      for (let i = 1; i <= 5; i++) setTimeout(tick, i * 1e3);
    }
    _lastGip = _gip;
    const b = getBoard();
    if (!b) return;
    const _fenCheck = (() => {
      try {
        return b.game?.getFEN?.();
      } catch {
        return null;
      }
    })();
    if (!_fenCheck) return;
    if (window.chessHelper.detection && Date.now() - _lastSyncDetection > 2e3) {
      _lastSyncDetection = Date.now();
      syncDetectionGame();
    }
    const myTurn = isMyTurn();
    if (myTurn === null) return;
    if (!myTurn) {
      if (processingOpp) return;
      waitingForOpponent = false;
      lastFen = '';
      const fen = getFEN();
      if (fen) {
        const _fenTurn = fen.split(' ')[1];
        if (_fenTurn === getMyColor()) {
          processingOpp = false;
          return;
        }
      }
      if (fen && fen === lastOppFen && lastOppMove) {
        if (!window.chessHelper.detection) return;
        if (detection.lastOppEvalFen === fen) return;
      }
      if (fen && fen === lastOppQueryFen && Date.now() - lastOppQueryAt < 1500) return;
      if (fen) {
        lastOppQueryFen = fen;
        lastOppQueryAt = Date.now();
      }
      processingOpp = true;
      clearArrows();
      clearShading();
      if (fen) {
        const abortCtrl = {
          aborted: false
        };
        oppAbort = abortCtrl;
        try {
          const candidates = await queryLocal(fen, ENGINE_DEPTH, 1);
          if (abortCtrl.aborted) return;
          if (getFEN() !== fen) return;
          if (isMyTurn() === true) return;
          const om = candidates.length ? candidates[0].move : null;
          if (candidates.length && candidates[0].cp !== null) {
            if (detection.lastMyEvalCp !== null && detection.lastMyEvalFen && detection.lastMyEvalFen !== fen) {
              const rawMyCpl = detection.lastMyEvalCp + candidates[0].cp;
              const myCpl = Number.isFinite(rawMyCpl) ? Math.min(500, Math.max(0, rawMyCpl)) : 500;
              moveLog.push({
                color: getMyColor(),
                cpl: myCpl
              });
              recalcDetection();
            }
            detection.lastMyEvalCp = null;
            detection.lastMyEvalFen = null;
            detection.lastOppEvalCp = candidates[0].cp;
            detection.lastOppEvalFen = fen;
            saveDetectionState();
            if (window.chessHelper.showEval) updateEval(-candidates[0].cp, getMyColor());
          } else if (candidates.length) {
            detection.lastMyEvalCp = null;
            detection.lastMyEvalFen = null;
            detection.lastOppEvalCp = null;
            detection.lastOppEvalFen = fen;
          }
          lastOppFen = fen;
          lastOppMove = om;
          if (window.chessHelper.showOpponent && om) drawOpponentArrow(om); else clearOpponentArrow();
        } catch (e) {
          console.warn('[Chess Assist] tick error (opp):', e);
        } finally {
          processingOpp = false;
          oppAbort = null;
        }
      } else {
        clearOpponentArrow();
        processingOpp = false;
      }
      return;
    }
    if (processingOpp && oppAbort) {
      oppAbort.aborted = true;
      processingOpp = false;
      oppAbort = null;
    }
    if (processingMy) return;
    lastOppFen = '';
    lastOppMove = null;
    const fen = getFEN();
    if (!fen) return;
    {
      const _fenTurn = fen.split(' ')[1];
      if (_fenTurn !== getMyColor()) return;
    }
    if (fen === lastFen) return;
    if (waitingForOpponent && fen !== lastMovedFen) waitingForOpponent = false;
    if (window.chessHelper.autoPlay && fen === lastMovedFen) return;
    processingMy = true;
    try {
      thinkingEl.classList.add('active');
      const result = await fetchRemote(fen);
      if (getFEN() !== fen) {
        thinkingEl.classList.remove('active');
        return;
      }
      if (isMyTurn() === false) {
        thinkingEl.classList.remove('active');
        return;
      }
      thinkingEl.classList.remove('active');
      if (!result) return;
      const mv = result.move;
      updateEval(result.cp, getMyColor());
      if (result.cp != null && detection.lastOppEvalCp !== null && detection.lastOppEvalFen && detection.lastOppEvalFen !== fen) {
        const rawCpl = detection.lastOppEvalCp + result.cp;
        const cpl = Number.isFinite(rawCpl) ? Math.min(500, Math.max(0, rawCpl)) : 500;
        const oppColor = getMyColor() === 'w' ? 'b' : 'w';
        moveLog.push({
          color: oppColor,
          cpl
        });
        recalcDetection();
      }
      detection.lastOppEvalCp = null;
      detection.lastOppEvalFen = null;
      if (result.cp !== null) {
        detection.lastMyEvalCp = result.cp;
        detection.lastMyEvalFen = fen;
        saveDetectionState();
      }
      lastFen = fen;
      if (window.chessHelper.hiddenArrow) {
        drawShading(mv);
        clearArrows();
      } else if (window.chessHelper.showArrow) {
        drawNativeArrow(mv);
        clearShading();
      }
      clearOpponentArrow();
      const _curFen = getFEN();
      const _myColor = getMyColor();
      const _fromPiece = pieceAtSquare(fen, mv.slice(0, 2));
      const _pieceIsMine = _fromPiece && _fromPiece === _fromPiece.toUpperCase() === (_myColor === 'w');
      const _stillMyTurn = _curFen && _curFen.split(' ')[1] === _myColor && isMyTurn() === true;
      const _boardUnchanged = _curFen && _curFen.split(' ')[0] === fen.split(' ')[0];
      const _mvIsOurs = _pieceIsMine && _stillMyTurn && _boardUnchanged;
      if (window.chessHelper.streamer && _mvIsOurs) showStreamerText(mv); else if (window.chessHelper.streamer) clearStreamerText(); else clearStreamerText();
      if (window.chessHelper.voice) {
        if (_mvIsOurs) {
          const text = moveToSpeech(fen, mv, result.mate);
          if (text && (text !== lastSpokenText || mv !== lastSpokenMove)) {
            lastSpokenText = text;
            lastSpokenFen = fen;
            lastSpokenMove = mv;
            speakText(text);
          }
        }
      }
      if (window.chessHelper.autoPlay && gameInProgress()) {
        if (DELAY_ENABLED) {
          const delay = (DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN)) * 1e3;
          await new Promise(r => setTimeout(r, delay));
        }
        if (!window.chessHelper.autoPlay) return;
        recordMove(fen, mv);
        await makeMove(mv);
        const fenAfter = getFEN();
        if (fenAfter !== fen) {
          lastMovedFen = fenAfter;
          waitingForOpponent = true;
        } else {
          lastFen = '';
        }
      }
    } catch (e) {
      console.warn('[Chess Assist] tick error (my):', e);
      lastFen = '';
      if (window.chessHelper.autoPlay) {
        lastMovedFen = '';
        waitingForOpponent = false;
      }
    } finally {
      processingMy = false;
      thinkingEl.classList.remove('active');
    }
  }
  let _mutDebounce = null;
  const obs = new MutationObserver(() => {
    if (drawing) return;
    if (!window.chessHelper.autoPlay && !window.chessHelper.showArrow && !window.chessHelper.hiddenArrow && !window.chessHelper.showOpponent && !window.chessHelper.showEval && !window.chessHelper.detection && !window.chessHelper.voice && !window.chessHelper.streamer) return;
    if (_mutDebounce) return;
    _mutDebounce = setTimeout(() => {
      _mutDebounce = null;
      tick();
    }, 120);
  });
  let lastObservedBoard = null;
  function watch() {
    const b = getBoard();
    if (b && b !== lastObservedBoard) {
      lastObservedBoard = b;
      obs.disconnect();
      obs.observe(b, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
  }
  watch();
  setInterval(() => {
    watch();
    tick();
  }, 500);
  window.addEventListener('pagehide', saveDetectionState);
  const root = document.createElement('div');
  root.id = 'chess-helper-root';
  const bubble = document.createElement('div');
  bubble.id = 'chess-helper-bubble';
  bubble.innerHTML = `<img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png" draggable="false">`;
  const panel = document.createElement('div');
  panel.id = 'chess-helper-panel';
  panel.innerHTML = `\n    <div class="ch-header"><div class="ch-title">Chess Assist</div><button class="ch-close" id="ch-close">&times;</button></div>\n    <div class="ch-tabs">\n      <button class="ch-tab active" data-tab="gameplay">Gameplay</button>\n      <button class="ch-tab" data-tab="detection">Detection</button>\n      <button class="ch-tab" data-tab="skins">Skins</button>\n      <button class="ch-tab" data-tab="settings">Settings</button>\n    </div>\n    <div class="ch-tab-content active" id="ch-tab-gameplay">\n    <div class="ch-thinking" id="ch-thinking">Thinking...</div>\n    <div class="ch-pager" id="ch-gp-pager">\n      <button class="ch-pager-arrow" id="ch-gp-prev" data-dir="-1" aria-label="Previous page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M5 1L1 5l4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>\n      <div class="ch-pager-dots">\n        <div class="ch-pager-dot active" data-page="1"></div>\n        <div class="ch-pager-dot" data-page="2"></div>\n      </div>\n      <span class="ch-pager-count" id="ch-gp-count">1/2</span>\n      <button class="ch-pager-arrow" id="ch-gp-next" data-dir="1" aria-label="Next page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M2 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>\n    </div>\n    <div class="ch-gameplay-page active" data-page="1">\n    <div>\n      <div class="ch-depth-row"><span class="ch-depth-label">Depth</span><span class="ch-info" data-tip="depth">i</span><input type="range" class="ch-range" id="ch-depth" min="1" max="24" value="16"><span class="ch-depth-val" id="ch-depth-val">16</span></div>\n      <div class="ch-tooltip" id="tip-depth">How many moves ahead the engine calculates. Higher = stronger but slower. 16 is a good balance. Below 10 is fast but weaker, above 20 is very slow.</div>\n    </div>\n    <div>\n      <div class="ch-row"><span class="ch-label">Show best move</span><span class="ch-info" data-tip="arrow">i</span><span class="ch-keybind" data-bind="arrow">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-arrow"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-arrow">Draws a green arrow on the board showing the best move the engine found.</div>\n    </div>\n    <div>\n      <div class="ch-row"><span class="ch-label">Hidden arrows</span><span class="ch-info" data-tip="hidden">i</span><span class="ch-keybind" data-bind="hidden">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-hidden"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-hidden">Darkens the from/to squares instead of drawing an arrow. Use the Darkness slider to pick how strong — lower is subtler, higher is easier to read. Overrides the green arrow when both are on.</div>\n      <div id="ch-hidden-controls" style="display:none">\n        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label" style="font-size:12px;">Darkness</span><input type="range" class="ch-range" id="ch-hidden-darkness" min="2" max="50" value="7"><span class="ch-depth-val" id="ch-hidden-darkness-val" style="font-size:12px;">7%</span></div>\n      </div>\n    </div>\n    <div>\n      <div class="ch-row"><span class="ch-label">Auto-play</span><span class="ch-info" data-tip="auto">i</span><span class="ch-keybind" data-bind="auto">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-auto"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-auto">Automatically plays the best move for you when it's your turn. Uses anti-repetition to avoid repeating the same moves.</div>\n    </div>\n    <div>\n      <div class="ch-row"><span class="ch-label">Move delay</span><span class="ch-info" data-tip="delay">i</span><span class="ch-keybind" data-bind="delay">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-delay-toggle"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-delay">Random delay before auto-play makes a move, so it looks like a human thinking. Set a min and max range in seconds. Off by default — the engine moves as soon as it finishes calculating.</div>\n      <div id="ch-delay-sliders" style="display:none">\n        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label">Min</span><input type="range" class="ch-range" id="ch-delay-min" min="0" max="15" value="1" step="0.5"><span class="ch-depth-val" id="ch-delay-min-val">1s</span></div>\n        <div class="ch-depth-row" style="margin-top:4px"><span class="ch-depth-label">Max</span><input type="range" class="ch-range" id="ch-delay-max" min="0" max="15" value="5" step="0.5"><span class="ch-depth-val" id="ch-delay-max-val">5s</span></div>\n      </div>\n    </div>\n    <div>\n      <div class="ch-row"><span class="ch-label">Win percent</span><span class="ch-info" data-tip="eval">i</span><span class="ch-keybind" data-bind="eval">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-eval"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-eval">Shows a live win probability bar next to the panel. Updates every position using the selected engine's centipawn evaluation.</div>\n    </div>\n    <div class="ch-row" style="margin-top:2px;"><button class="ch-btn ch-btn-primary" id="ch-analyze" style="flex:1;">Analyze once</button><span class="ch-keybind" data-bind="analyze" style="margin-left:8px;">Press keys...</span></div>\n    <div>\n      <div class="ch-row" style="margin-top:2px"><span class="ch-label" style="flex:0 0 auto;">Hide all</span><span class="ch-info" data-tip="hide">i</span><span class="ch-keybind" data-bind="hide" style="margin-left:auto;">Press keys...</span></div>\n      <div class="ch-tooltip" id="tip-hide">Hides everything — the icon, panel, arrows, and shading. Press your keybind again to bring it all back.</div>\n    </div>\n    </div>\n    <div class="ch-gameplay-page" data-page="2">\n    <div>\n      <div class="ch-row"><span class="ch-label">Opponent's best</span><span class="ch-info" data-tip="opponent">i</span><span class="ch-keybind" data-bind="opponent">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-opponent"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-opponent">Shows a red arrow for the opponent's best reply to the current position. Helps you anticipate what they'll play next.</div>\n    </div>\n    <div>\n      <div class="ch-row"><span class="ch-label">Voice moves</span><span class="ch-info" data-tip="voice">i</span><span class="ch-keybind" data-bind="voice">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-voice"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-voice">Speaks the best move through your headphones each turn. Nothing shows on screen and no arrows need to be drawn — if anyone's watching your screen they can't spot it. Uses your browser's built-in voices; pick voice, speed, and volume below.</div>\n      <div id="ch-voice-sliders" style="display:none">\n        <div style="margin-top:6px;"><div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Voice</div>\n          <div id="ch-voice-pick-wrap" style="position:relative;width:100%;">\n            <button type="button" id="ch-voice-pick-btn" style="width:100%;padding:7px 24px 7px 10px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);font-size:12px;text-align:left;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;">Default<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" style="position:absolute;right:9px;top:50%;transform:translateY(-50%);opacity:0.55;pointer-events:none;"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>\n            <div id="ch-voice-pick-list" style="display:none;position:absolute;top:calc(100% + 2px);left:0;right:0;max-height:240px;overflow-y:auto;background:#1a1a1c;border:1px solid rgba(255,255,255,0.1);border-radius:8px;z-index:100002;box-shadow:0 10px 30px rgba(0,0,0,0.6);scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent;"></div>\n          </div>\n        </div>\n        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label">Speed</span><input type="range" class="ch-range" id="ch-voice-rate" min="0.5" max="2" value="1" step="0.1"><span class="ch-depth-val" id="ch-voice-rate-val">1.0</span></div>\n        <div class="ch-depth-row" style="margin-top:4px"><span class="ch-depth-label">Vol</span><input type="range" class="ch-range" id="ch-voice-vol" min="0" max="1" value="1" step="0.05"><span class="ch-depth-val" id="ch-voice-vol-val">100%</span></div>\n        <div class="ch-row" style="margin-top:6px;"><button class="ch-btn" id="ch-voice-test" style="flex:1;">Say once</button><span class="ch-keybind" data-bind="voiceRepeat" style="margin-left:8px;">Press keys...</span></div>\n      </div>\n    </div>\n    <div>\n      <div class="ch-row"><span class="ch-label">Streamer mode</span><span class="ch-info" data-tip="streamer">i</span><span class="ch-keybind" data-bind="streamer">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-streamer"><span class="ch-slider"></span></label></div>\n      <div class="ch-tooltip" id="tip-streamer">Shows the best move as a small floating text pill ("F1 TO C4") instead of an arrow on the board. Drag it anywhere on the screen, resize with the slider. While this panel is open, a preview pill appears so you can position it before a real game starts.</div>\n      <div id="ch-streamer-controls" style="display:none">\n        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label">Size</span><input type="range" class="ch-range" id="ch-streamer-size" min="12" max="60" value="22"><span class="ch-depth-val" id="ch-streamer-size-val">22</span></div>\n        <div class="ch-row" style="margin-top:6px;"><button class="ch-btn" id="ch-streamer-reset" style="flex:1;">Center on screen</button><span class="ch-keybind" data-bind="streamerCenter" style="margin-left:8px;">Press keys...</span></div>\n      </div>\n    </div>\n    </div>\n    </div>\n    <div class="ch-tab-content" id="ch-tab-detection">\n      <div style="display:flex;gap:4px;justify-content:center;padding:4px 0 6px;">\n        <button id="ch-det-black" class="ch-det-target active" style="flex:1;padding:4px 0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:var(--ch-accent);color:#fff;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;">Black</button>\n        <button id="ch-det-white" class="ch-det-target" style="flex:1;padding:4px 0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;">White</button>\n      </div>\n      <div>\n        <div class="ch-detect-stat"><span class="ch-detect-label">Moves analyzed <span class="ch-info" data-tip="det-moves">i</span></span><span class="ch-detect-value" id="ch-det-moves">0</span></div>\n        <div class="ch-tooltip" id="tip-det-moves">Number of moves tracked so far. More moves = more reliable stats. At least 10 moves recommended for accurate results.</div>\n      </div>\n      <div>\n        <div class="ch-detect-stat"><span class="ch-detect-label">Avg CPL <span class="ch-info" data-tip="det-acpl">i</span></span><span class="ch-detect-value" id="ch-det-acpl">&mdash;</span></div>\n        <div class="ch-tooltip" id="tip-det-acpl">Average Centipawn Loss — how many centipawns the opponent loses per move. Lower = stronger play. Engines typically have ACPL under 10, humans 30–100+ depending on rating.</div>\n      </div>\n      <div>\n        <div class="ch-detect-stat"><span class="ch-detect-label">Best move rate <span class="ch-info" data-tip="det-bmr">i</span></span><span class="ch-detect-value" id="ch-det-bmr">&mdash;</span></div>\n        <div class="ch-tooltip" id="tip-det-bmr">How often the opponent plays the engine's top choice (within 5 centipawns). Engines hit 80%+, most humans 30–60% depending on ELO.</div>\n      </div>\n      <div>\n        <div class="ch-detect-stat"><span class="ch-detect-label">Accuracy <span class="ch-info" data-tip="det-acc">i</span></span><span class="ch-detect-value" id="ch-det-acc">&mdash;</span></div>\n        <div class="ch-tooltip" id="tip-det-acc">Lichess-style accuracy score derived from ACPL. 90%+ is very strong, 95%+ at low ELO is suspicious. Compared against expected accuracy for the opponent's rating.</div>\n      </div>\n      <div>\n        <div class="ch-detect-stat"><span class="ch-detect-label">Suspicion <span class="ch-info" data-tip="det-score">i</span></span><span class="ch-detect-value" id="ch-det-score">&mdash;</span></div>\n        <div class="ch-tooltip" id="tip-det-score">Multi-factor suspicion score adjusted for the opponent's ELO. Combines ACPL ratio, best-move rate gap, zero-blunder bonus, and accuracy gap vs expected stats for their rating.</div>\n      </div>\n      <div class="ch-detect-gauge"><div class="ch-detect-fill" id="ch-det-fill"></div></div>\n      <div class="ch-detect-verdict" id="ch-det-verdict">Play a game to start detection</div>\n      <div style="display:flex;gap:6px;margin-top:4px;">\n        <button class="ch-detect-reset" id="ch-det-reset" style="flex:1;">Reset stats</button>\n      </div>\n    </div>\n    <div class="ch-tab-content" id="ch-tab-skins">\n    <div class="ch-pager" id="ch-sk-pager">\n      <button class="ch-pager-arrow" id="ch-sk-prev" data-dir="-1" aria-label="Previous page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M5 1L1 5l4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>\n      <div class="ch-pager-dots">\n        <div class="ch-pager-dot active" data-page="1"></div>\n        <div class="ch-pager-dot" data-page="2"></div>\n      </div>\n      <span class="ch-pager-count" id="ch-sk-count">1/2</span>\n      <button class="ch-pager-arrow" id="ch-sk-next" data-dir="1" aria-label="Next page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M2 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>\n    </div>\n    <div class="ch-skins-page active" data-page="1">\n      <div style="font-size:11px;color:rgba(255,255,255,0.4);text-align:center;padding:2px 0 4px;font-style:italic;">Click a tile to upload a custom image</div>\n      <div class="ch-skins-grid" id="ch-skins-grid">\n        <div class="ch-skins-row-label">White</div>\n        <div class="ch-skin-tile" data-skin="wk"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="wq"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="wr"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="wb"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="wn"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="wp"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skins-row-label">Black</div>\n        <div class="ch-skin-tile" data-skin="bk"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="bq"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="br"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="bb"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="bn"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile" data-skin="bp"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skins-row-label">Board</div>\n        <div class="ch-skin-tile" data-skin="board" style="grid-column:2/6;aspect-ratio:4/1;"><span class="ch-skin-label" style="font-size:11px;">Board BG</span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skins-row-label">Tiles</div>\n        <div class="ch-skin-tile wide" data-skin="lightTiles"><span class="ch-skin-label" style="font-size:11px;">Light tiles</span><button class="ch-skin-remove">&times;</button></div>\n        <div class="ch-skin-tile wide" data-skin="darkTiles"><span class="ch-skin-label" style="font-size:11px;">Dark tiles</span><button class="ch-skin-remove">&times;</button></div>\n      </div>\n      <div>\n        <div class="ch-row"><span class="ch-label">Piece mask</span><span class="ch-info" data-tip="mask">i</span><label class="ch-switch"><input type="checkbox" id="ch-skin-mask"><span class="ch-slider"></span></label></div>\n        <div class="ch-tooltip" id="tip-mask">Pieces: uses the original piece shape as a mask filled with your custom image. Tiles: each square gets the image individually instead of one large image showing through.</div>\n      </div>\n      <button class="ch-detect-reset" id="ch-skins-reset">Reset all skins</button>\n    </div>\n    <div class="ch-skins-page" data-page="2">\n      <div style="font-size:11px;color:rgba(255,255,255,0.4);text-align:center;padding:2px 0 4px;font-style:italic;">Premade piece sets — click to apply all 12 pieces at once</div>\n      <input type="text" id="ch-premade-search" placeholder="Search sets…" style="width:100%;padding:7px 10px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);font-size:12px;box-sizing:border-box;margin-bottom:6px;">\n      <div id="ch-premade-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-height:240px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent;padding-right:2px;">\n        <div class="ch-premade-empty" style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);font-size:11px;padding:20px 0;">Loading catalog…</div>\n      </div>\n      <button class="ch-detect-reset" id="ch-premade-clear">Clear premade pieces</button>\n      <div style="font-size:10px;color:rgba(255,255,255,0.3);text-align:center;padding:4px 0 2px;">Sets by Lichess, Rhosgfx, Sharechess. <a href="https://github.com/ThatKidGlitchy/chess-engines/blob/main/skins/CREDITS.txt" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.55);text-decoration:underline;">Full credits</a>.</div>\n    </div>\n    </div>\n    <div class="ch-tab-content" id="ch-tab-settings">\n      <div class="ch-section-head">Engine</div>\n      <div>\n        <div class="ch-row"><span class="ch-label">Engine</span><span class="ch-info" data-tip="engine">i</span></div>\n        <select id="ch-engine" style="width:100%;padding:6px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);margin-top:4px;color-scheme:dark;">\n          <option value="sf19" style="background:#1a1a1c;color:#fff;">Stockfish 19</option>\n          <option value="sf18" style="background:#1a1a1c;color:#fff;">Stockfish 18</option>\n          <option value="sf17" style="background:#1a1a1c;color:#fff;">Stockfish 17</option>\n          <option value="sf16" style="background:#1a1a1c;color:#fff;">Stockfish 16</option>\n          <option value="sf11" style="background:#1a1a1c;color:#fff;">Stockfish 11</option>\n          <option value="sf10" style="background:#1a1a1c;color:#fff;">Stockfish 10</option>\n          <option value="sf8" style="background:#1a1a1c;color:#fff;">Stockfish 8</option>\n          <option value="lozza11" style="background:#1a1a1c;color:#fff;">Lozza 11</option>\n          <option value="garbochess" style="background:#1a1a1c;color:#fff;">Garbochess</option>\n          <option value="p4wn" style="background:#1a1a1c;color:#fff;">p4wn</option>\n        </select>\n        <div class="ch-tooltip" id="tip-engine">Which engine picks the moves. Stockfish 19 is the current default and strongest. Older Stockfish versions (8, 10, 11, 16, 17, 18) are lighter and faster on slow devices. Lozza 11 and Garbochess are pure JavaScript — slower but zero load time; their depth slider auto-caps at 12. p4wn is a deliberately weak pure-JS engine (depth capped at 4) for simulating a low-rated opponent.</div>\n      </div>\n      <div class="ch-section-head">Appearance</div>\n      <div>\n        <div class="ch-depth-row"><span class="ch-depth-label" style="font-size:12px;">Opacity</span><span class="ch-info" data-tip="opacity">i</span><input type="range" class="ch-range" id="ch-opacity" min="5" max="100" value="100"><span class="ch-depth-val" id="ch-opacity-val" style="font-size:12px;">100%</span></div>\n        <div class="ch-tooltip" id="tip-opacity">How see-through the whole helper UI is — knight icon, panel, eval bar, streamer pill. 100% is fully opaque. Lower it if the UI gets in the way of the board.</div>\n      </div>\n      <div class="ch-section-head">Keybinds</div>\n      <div>\n        <button class="ch-btn" id="ch-reset-binds" style="width:100%;padding:8px 0;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-family:var(--ch-font);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;">Reset all keybinds</button>\n      </div>\n      <div class="ch-section-head">Session</div>\n      <div>\n        <div class="ch-row"><span class="ch-label">Save on reload</span><span class="ch-info" data-tip="persist">i</span><label class="ch-switch"><input type="checkbox" id="ch-persist"><span class="ch-slider"></span></label></div>\n        <div class="ch-tooltip" id="tip-persist">When on, your settings (toggles, depth, keybinds, position) persist across page reloads. Turn off to make changes only for this session.</div>\n      </div>\n    </div>\n    <div style="text-align:center;padding:8px 0 2px;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.3px;">made by <a href="https://github.com/ThatKidGlitchy/chess-hacks" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.35);text-decoration:underline;">ThatKidGlitchy</a> &middot; <a href="https://github.com/ThatKidGlitchy/chess-hacks/blob/main/Chess-Assist-Disclaimer.md" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.55);text-decoration:underline;">Terms &amp; Disclaimer</a></div>\n  `;
  const wrap = document.createElement('div');
  wrap.id = 'chess-helper-wrap';
  const evalBar = document.createElement('div');
  evalBar.id = 'ch-eval-bar';
  evalBar.innerHTML = `<div id="ch-eval-pct-top" class="ch-eval-pct">50%</div><div id="ch-eval-white"></div><div id="ch-eval-pct-bot" class="ch-eval-pct">50%</div>`;
  evalBar.style.display = 'none';
  wrap.append(panel, evalBar);
  const streamerEl = document.createElement('div');
  streamerEl.id = 'ch-streamer-text';
  root.append(bubble, wrap, streamerEl);
  document.body.appendChild(root);
  const CURRENT_VERSION = '1.4.0';
  const CHANGELOG = {
    '1.4.0': [ '<b>Streamer mode</b> — shows the best move as a small floating text pill ("F1 TO C4") instead of an arrow on the board. Drag it anywhere on the screen, resize it, position it behind your stream overlay.', '<b>Premade piece sets</b> — a second page on the Skins tab with 188 open-source piece sets from Lichess, Rhosgfx, and Sharechess. Click a tile and the whole set applies at once.', '<b>Two-page Gameplay and Skins tabs</b> — pager arrows at the top so the panel stays short while fitting more features. Room to grow.', '<b>UI opacity slider</b> — in the Settings tab. Fade the whole helper UI from 100% down to 5% if it gets in the way of the board.', '<b>Hidden arrows darkness slider</b> — tune how strong the square shading is, from barely visible to easy to spot.', '<b>Settings tab reorganized</b> into Engine / Appearance / Keybinds / Session sections so things aren\'t squeezed together.', '<b>Bug fixes and polish</b> across the panel, keybinds, and arrow drawing.' ]
  };
  function showWhatsNew(force) {
    const seenKey = 'ch-whatsnew-seen';
    const seen = (() => {
      try {
        return localStorage.getItem(seenKey);
      } catch {
        return null;
      }
    })();
    if (!force && seen === CURRENT_VERSION) return;
    const items = CHANGELOG[CURRENT_VERSION] || [];
    if (!items.length) return;
    const backdrop = document.createElement('div');
    backdrop.id = 'ch-whatsnew-backdrop';
    backdrop.className = 'visible';
    backdrop.innerHTML = `\n      <div id="ch-whatsnew-modal" role="dialog" aria-modal="true" aria-labelledby="ch-whatsnew-title">\n        <h2 id="ch-whatsnew-title">What's new in v${CURRENT_VERSION}</h2>\n        <div class="ch-wn-sub">Chess Assist — chess.com helper</div>\n        <ul>${items.map(it => `<li>${it}</li>`).join('')}</ul>\n        <button id="ch-whatsnew-ok">Got it</button>\n      </div>`;
    document.body.appendChild(backdrop);
    const close = () => {
      try {
        localStorage.setItem(seenKey, CURRENT_VERSION);
      } catch {}
      backdrop.remove();
    };
    backdrop.querySelector('#ch-whatsnew-ok').onclick = close;
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) close();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', esc);
      }
    });
  }
  window.chessHelper.showWhatsNew = () => showWhatsNew(true);
  setTimeout(() => showWhatsNew(false), 400);
  panel.querySelectorAll('.ch-info[data-tip]').forEach(el => {
    el.onclick = () => {
      const tip = panel.querySelector('#tip-' + el.dataset.tip);
      if (!tip) return;
      const nowOpen = !tip.classList.contains('show');
      tip.classList.toggle('show', nowOpen);
      el.classList.toggle('active', nowOpen);
    };
  });
  panel.querySelectorAll('.ch-tab').forEach(tab => {
    tab.onclick = () => {
      panel.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('active'));
      panel.querySelectorAll('.ch-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = panel.querySelector('#ch-tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    };
  });
  let gameplayPage = 1;
  const gameplayPageCount = panel.querySelectorAll('.ch-gameplay-page').length;
  function setGameplayPage(n) {
    gameplayPage = Math.max(1, Math.min(gameplayPageCount, n));
    panel.querySelectorAll('.ch-gameplay-page').forEach(p => {
      p.classList.toggle('active', +p.dataset.page === gameplayPage);
    });
    panel.querySelectorAll('.ch-pager-dot').forEach(d => {
      d.classList.toggle('active', +d.dataset.page === gameplayPage);
    });
    const prev = panel.querySelector('#ch-gp-prev');
    const next = panel.querySelector('#ch-gp-next');
    if (prev) prev.disabled = gameplayPage === 1;
    if (next) next.disabled = gameplayPage === gameplayPageCount;
    const count = panel.querySelector('#ch-gp-count');
    if (count) count.textContent = gameplayPage + '/' + gameplayPageCount;
  }
  panel.querySelector('#ch-gp-prev').onclick = () => setGameplayPage(gameplayPage - 1);
  panel.querySelector('#ch-gp-next').onclick = () => setGameplayPage(gameplayPage + 1);
  panel.querySelectorAll('.ch-pager-dot').forEach(dot => {
    dot.onclick = () => setGameplayPage(+dot.dataset.page);
  });
  setGameplayPage(1);
  panel.querySelector('#ch-det-reset').onclick = resetDetection;
  panel.querySelector('#ch-det-black').onclick = () => {
    if (detTarget === 'b') return;
    detTarget = 'b';
    panel.querySelector('#ch-det-black').style.background = 'var(--ch-accent)';
    panel.querySelector('#ch-det-black').style.color = '#fff';
    panel.querySelector('#ch-det-white').style.background = 'rgba(255,255,255,0.06)';
    panel.querySelector('#ch-det-white').style.color = 'rgba(255,255,255,0.5)';
    recalcDetection();
    saveSettings();
  };
  panel.querySelector('#ch-det-white').onclick = () => {
    if (detTarget === 'w') return;
    detTarget = 'w';
    panel.querySelector('#ch-det-white').style.background = 'var(--ch-accent)';
    panel.querySelector('#ch-det-white').style.color = '#fff';
    panel.querySelector('#ch-det-black').style.background = 'rgba(255,255,255,0.06)';
    panel.querySelector('#ch-det-black').style.color = 'rgba(255,255,255,0.5)';
    recalcDetection();
    saveSettings();
  };
  const SKIN_CODES = [ 'wk', 'wq', 'wr', 'wb', 'wn', 'wp', 'bk', 'bq', 'br', 'bb', 'bn', 'bp', 'board', 'lightTiles', 'darkTiles' ];
  let savedSkins = {};
  try {
    savedSkins = JSON.parse(localStorage.getItem('ch-skins') || '{}');
  } catch {}
  let skinMaskMode = localStorage.getItem('ch-skin-mask') === '1';
  const skinStyleEl = document.createElement('style');
  skinStyleEl.id = 'ch-custom-skins';
  document.head.appendChild(skinStyleEl);
  function getOriginalPieceUrl(code) {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--theme-piece-set-' + code);
    if (v) {
      const m = v.match(/url\(["']?(.*?)["']?\)/);
      if (m) return m[1];
    }
    const el = document.querySelector('.piece.' + code);
    if (el) {
      const bg = getComputedStyle(el).backgroundImage;
      const m = bg.match(/url\(["']?(.*?)["']?\)/);
      if (m) return m[1];
    }
    return 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/' + code + '.png';
  }
  function clearInlineSkins() {
    document.querySelectorAll('[data-ch-skin]').forEach(el => {
      el.style.removeProperty('background-image');
      el.style.removeProperty('background-size');
      el.style.removeProperty('background-position');
      el.style.removeProperty('background-repeat');
      el.style.removeProperty('-webkit-mask-image');
      el.style.removeProperty('mask-image');
      el.style.removeProperty('-webkit-mask-size');
      el.style.removeProperty('mask-size');
      el.style.removeProperty('animation');
      delete el.dataset.chSkin;
    });
  }
  let skinLoopRunning = false;
  let _skinLastRun = 0;
  function skinEnforceLoop() {
    if (!skinLoopRunning) return;
    const now = Date.now();
    if (now - _skinLastRun >= 250) {
      _skinLastRun = now;
      const board = getBoard();
      if (board) {
        const hasSkins = SKIN_CODES.slice(0, 12).some(c => savedSkins[c]);
        if (hasSkins) {
          for (const c of SKIN_CODES.slice(0, 12)) {
            if (!savedSkins[c]) continue;
            board.querySelectorAll(`.piece.${c},.promotion-piece.${c}`).forEach(el => {
              if (el.dataset.chSkin === savedSkins[c]) return;
              el.style.setProperty('background-image', `url("${savedSkins[c]}")`, 'important');
              if (skinMaskMode) {
                const orig = getOriginalPieceUrl(c);
                el.style.setProperty('-webkit-mask-image', `url("${orig}")`, 'important');
                el.style.setProperty('mask-image', `url("${orig}")`, 'important');
                el.style.setProperty('-webkit-mask-size', 'contain', 'important');
                el.style.setProperty('mask-size', 'contain', 'important');
                el.style.setProperty('background-size', 'cover', 'important');
              } else {
                el.style.setProperty('background-size', 'contain', 'important');
              }
              el.style.setProperty('animation', 'none', 'important');
              el.dataset.chSkin = savedSkins[c];
            });
          }
        }
      }
    }
    requestAnimationFrame(skinEnforceLoop);
  }
  function startSkinLoop() {
    if (!skinLoopRunning) {
      skinLoopRunning = true;
      requestAnimationFrame(skinEnforceLoop);
    }
  }
  function applySkins() {
    let css = '';
    for (const c of SKIN_CODES.slice(0, 12)) {
      if (!savedSkins[c]) continue;
      const sel = `.piece.${c},.promotion-piece.${c}`;
      if (skinMaskMode) {
        const orig = getOriginalPieceUrl(c);
        css += `${sel}{-webkit-mask-image:url("${orig}");mask-image:url("${orig}");-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;background-image:url("${savedSkins[c]}")!important;background-size:cover!important;background-position:center!important;animation:none!important}\n`;
      } else {
        css += `${sel}{background-image:url("${savedSkins[c]}")!important;background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important;animation:none!important}\n`;
      }
    }
    if (savedSkins.board) {
      css += `wc-chess-board,chess-board,.board,#board-vs-personalities,#board-single,#board-board,.fade-in-overlay{background-image:url("${savedSkins.board}")!important;background-size:cover!important;background-position:center!important}\n`;
    }
    skinStyleEl.textContent = css;
    const board = getBoard();
    if (board) {
      board.style.removeProperty('background-image');
      board.style.removeProperty('background-size');
      board.style.removeProperty('background-position');
    }
    updateTileOverlays();
    clearInlineSkins();
    startSkinLoop();
  }
  function updateTileOverlays() {
    document.querySelectorAll('.ch-tile-overlay').forEach(el => el.remove());
    if (!savedSkins.lightTiles && !savedSkins.darkTiles) return;
    const board = getBoard();
    if (!board) return;
    const create = (url, light) => {
      const div = document.createElement('div');
      div.className = 'ch-tile-overlay';
      const grad = light ? 'repeating-conic-gradient(#fff 0% 25%,transparent 0% 50%)' : 'repeating-conic-gradient(transparent 0% 25%,#fff 0% 50%)';
      const bgSize = skinMaskMode ? '12.5% 12.5%' : 'cover';
      const bgPos = skinMaskMode ? '0 0' : 'center';
      const bgRepeat = skinMaskMode ? 'round' : 'repeat';
      div.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:1;background-image:url("${url}");background-size:${bgSize};background-position:${bgPos};background-repeat:${bgRepeat};-webkit-mask-image:${grad};mask-image:${grad};-webkit-mask-size:25% 25%;mask-size:25% 25%;`;
      board.appendChild(div);
    };
    if (savedSkins.lightTiles) create(savedSkins.lightTiles, true);
    if (savedSkins.darkTiles) create(savedSkins.darkTiles, false);
  }
  function renderSkinTiles() {
    panel.querySelectorAll('.ch-skin-tile').forEach(tile => {
      const code = tile.dataset.skin;
      if (savedSkins[code]) {
        tile.style.backgroundImage = `url("${savedSkins[code]}")`;
        tile.classList.add('has-skin');
      } else {
        tile.style.backgroundImage = '';
        tile.classList.remove('has-skin');
      }
    });
  }
  const skinInput = document.createElement('input');
  skinInput.type = 'file';
  skinInput.accept = 'image/*';
  skinInput.hidden = true;
  document.body.appendChild(skinInput);
  let activeSkinCode = null;
  panel.querySelector('#ch-skins-grid').addEventListener('click', e => {
    const rm = e.target.closest('.ch-skin-remove');
    const tile = e.target.closest('.ch-skin-tile');
    if (!tile) return;
    if (rm) {
      delete savedSkins[tile.dataset.skin];
      try {
        localStorage.setItem('ch-skins', JSON.stringify(savedSkins));
      } catch {}
      renderSkinTiles();
      applySkins();
      return;
    }
    activeSkinCode = tile.dataset.skin;
    skinInput.click();
  });
  skinInput.onchange = () => {
    const file = skinInput.files[0];
    if (!file || !activeSkinCode) return;
    const reader = new FileReader;
    reader.onload = ev => {
      savedSkins[activeSkinCode] = ev.target.result;
      try {
        localStorage.setItem('ch-skins', JSON.stringify(savedSkins));
      } catch (err) {
        console.warn('Skin storage full:', err);
      }
      renderSkinTiles();
      applySkins();
    };
    reader.readAsDataURL(file);
    skinInput.value = '';
  };
  panel.querySelector('#ch-skins-reset').onclick = () => {
    savedSkins = {};
    try {
      localStorage.setItem('ch-skins', '{}');
    } catch {}
    renderSkinTiles();
    applySkins();
    activePremadeId = '';
    renderPremadeGrid();
  };
  let skinsPage = 1;
  const skinsPageCount = panel.querySelectorAll('.ch-skins-page').length;
  function setSkinsPage(n) {
    skinsPage = Math.max(1, Math.min(skinsPageCount, n));
    panel.querySelectorAll('.ch-skins-page').forEach(p => p.classList.toggle('active', +p.dataset.page === skinsPage));
    panel.querySelectorAll('#ch-sk-pager .ch-pager-dot').forEach(d => d.classList.toggle('active', +d.dataset.page === skinsPage));
    const prev = panel.querySelector('#ch-sk-prev');
    const next = panel.querySelector('#ch-sk-next');
    if (prev) prev.disabled = skinsPage === 1;
    if (next) next.disabled = skinsPage === skinsPageCount;
    const count = panel.querySelector('#ch-sk-count');
    if (count) count.textContent = skinsPage + '/' + skinsPageCount;
    if (skinsPage === 2 && !premadeCatalog) loadPremadeCatalog();
  }
  panel.querySelector('#ch-sk-prev').onclick = () => setSkinsPage(skinsPage - 1);
  panel.querySelector('#ch-sk-next').onclick = () => setSkinsPage(skinsPage + 1);
  panel.querySelectorAll('#ch-sk-pager .ch-pager-dot').forEach(d => {
    d.onclick = () => setSkinsPage(+d.dataset.page);
  });
  setSkinsPage(1);
  const PREMADE_BASE = 'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@main';
  let premadeCatalog = null, activePremadeId = '';
  try {
    activePremadeId = localStorage.getItem('ch-premade-active') || '';
  } catch {}
  function buildPremadeGrid() {
    const grid = panel.querySelector('#ch-premade-grid');
    if (!grid || !premadeCatalog) return;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    grid.innerHTML = premadeCatalog.map(s => {
      const active = s.id === activePremadeId ? ' active' : '';
      const hay = ((s.name || '') + ' ' + (s.id || '') + ' ' + (s.author || '')).toLowerCase();
      return `<div class="ch-premade-tile${active}" data-id="${esc(s.id)}" data-hay="${esc(hay)}" title="${esc(s.name)} — ${esc(s.author || 'unknown')} (${esc(s.license || '—')})"><img src="${s.thumb}" alt="" loading="lazy"><div class="ch-premade-name">${esc(s.name)}</div></div>`;
    }).join('');
    grid.querySelectorAll('.ch-premade-tile').forEach(tile => {
      tile.onclick = () => applyPremade(tile.dataset.id);
    });
  }
  function filterPremadeGrid(q) {
    const grid = panel.querySelector('#ch-premade-grid');
    if (!grid) return;
    q = q.trim().toLowerCase();
    let visible = 0;
    grid.querySelectorAll('.ch-premade-tile').forEach(tile => {
      const show = !q || tile.dataset.hay.includes(q);
      tile.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    let empty = grid.querySelector('.ch-premade-empty');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'ch-premade-empty';
        empty.style.cssText = 'grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);font-size:11px;padding:20px 0;';
        grid.appendChild(empty);
      }
      empty.textContent = 'No sets match.';
      empty.style.display = '';
    } else if (empty) {
      empty.style.display = 'none';
    }
  }
  function refreshPremadeActive() {
    const grid = panel.querySelector('#ch-premade-grid');
    if (!grid) return;
    grid.querySelectorAll('.ch-premade-tile').forEach(t => t.classList.toggle('active', t.dataset.id === activePremadeId));
  }
  async function loadPremadeCatalog() {
    try {
      const resp = await fetch(PREMADE_BASE + '/skins/catalog.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      premadeCatalog = await resp.json();
      buildPremadeGrid();
    } catch (e) {
      const grid = panel.querySelector('#ch-premade-grid');
      if (grid) grid.innerHTML = '<div class="ch-premade-empty" style="grid-column:1/-1;text-align:center;color:#e07040;font-size:11px;padding:20px 0;">Failed to load catalog.<br><span style="color:rgba(255,255,255,0.4);">' + String(e.message || e) + '</span></div>';
    }
  }
  async function applyPremade(id) {
    const entry = (premadeCatalog || []).find(s => s.id === id);
    if (!entry) return;
    try {
      const resp = await fetch(PREMADE_BASE + '/' + entry.file);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const pieces = await resp.json();
      for (const code of [ 'wk', 'wq', 'wr', 'wb', 'wn', 'wp', 'bk', 'bq', 'br', 'bb', 'bn', 'bp' ]) {
        if (pieces[code]) savedSkins[code] = pieces[code];
      }
      try {
        localStorage.setItem('ch-skins', JSON.stringify(savedSkins));
      } catch {}
      try {
        localStorage.setItem('ch-premade-active', id);
      } catch {}
      activePremadeId = id;
      renderSkinTiles();
      applySkins();
      refreshPremadeActive();
    } catch (e) {
      console.warn('[Chess Assist] Failed to apply premade set:', e);
    }
  }
  const premadeSearch = panel.querySelector('#ch-premade-search');
  if (premadeSearch) {
    let searchTimer = null;
    premadeSearch.oninput = e => {
      const v = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => filterPremadeGrid(v), 120);
    };
  }
  panel.querySelector('#ch-premade-clear').onclick = () => {
    for (const code of [ 'wk', 'wq', 'wr', 'wb', 'wn', 'wp', 'bk', 'bq', 'br', 'bb', 'bn', 'bp' ]) delete savedSkins[code];
    try {
      localStorage.setItem('ch-skins', JSON.stringify(savedSkins));
    } catch {}
    try {
      localStorage.removeItem('ch-premade-active');
    } catch {}
    activePremadeId = '';
    renderSkinTiles();
    applySkins();
    refreshPremadeActive();
  };
  const maskToggle = panel.querySelector('#ch-skin-mask');
  maskToggle.checked = skinMaskMode;
  maskToggle.onchange = () => {
    skinMaskMode = maskToggle.checked;
    localStorage.setItem('ch-skin-mask', skinMaskMode ? '1' : '0');
    applySkins();
  };
  renderSkinTiles();
  applySkins();
  const thinkingEl = panel.querySelector('#ch-thinking');
  panel.querySelector('#ch-close').onclick = () => wrap.classList.remove('visible');
  let ox = window.innerWidth - 80, oy = 80, dragging = false, dragMoved = false, sx = 0, sy = 0;
  function setPos() {
    bubble.style.transform = `translate3d(${ox}px,${oy}px,0)`;
  }
  setPos();
  function bubbleDown(e) {
    e.preventDefault();
    dragging = true;
    dragMoved = false;
    const p = e.touches ? e.touches[0] : e;
    sx = p.clientX - ox;
    sy = p.clientY - oy;
  }
  bubble.addEventListener('mousedown', e => {
    unlockVoice();
    bubbleDown(e);
  });
  bubble.addEventListener('touchstart', bubbleDown, {
    passive: false
  });
  function bubbleMove(e) {
    if (!dragging) return;
    dragMoved = true;
    const p = e.touches ? e.touches[0] : e;
    ox = Math.max(0, Math.min(p.clientX - sx, innerWidth - 52));
    oy = Math.max(0, Math.min(p.clientY - sy, innerHeight - 52));
    setPos();
  }
  document.addEventListener('mousemove', bubbleMove);
  document.addEventListener('touchmove', bubbleMove);
  function bubbleUp() {
    if (!dragging) return;
    dragging = false;
    if (!dragMoved) {
      wrap.classList.toggle('visible');
      positionPanel();
      renderStreamer();
    } else saveSettings();
  }
  document.addEventListener('mouseup', bubbleUp);
  document.addEventListener('touchend', bubbleUp);
  let panelX = -1, panelY = -1, panelDragging = false, panelDragMoved = false, panelSX = 0, panelSY = 0;
  function positionPanel() {
    if (panelX < 0) {
      const panelW = 280;
      panelX = ox + 60;
      panelY = oy;
      if (panelX + panelW > innerWidth) panelX = ox - panelW - 10;
      if (panelY + 300 > innerHeight) panelY = innerHeight - 310;
    }
    panelX = Math.max(0, Math.min(panelX, innerWidth - 280));
    panelY = Math.max(0, Math.min(panelY, innerHeight - 50));
    wrap.style.left = panelX + 'px';
    wrap.style.top = panelY + 'px';
  }
  const header = panel.querySelector('.ch-header');
  header.addEventListener('mousedown', e => {
    panelDragging = true;
    panelDragMoved = false;
    panelSX = e.clientX - panelX;
    panelSY = e.clientY - panelY;
    e.preventDefault();
  });
  header.addEventListener('touchstart', e => {
    panelDragging = true;
    panelDragMoved = false;
    const t = e.touches[0];
    panelSX = t.clientX - panelX;
    panelSY = t.clientY - panelY;
  });
  document.addEventListener('mousemove', e => {
    if (!panelDragging) return;
    panelDragMoved = true;
    panelX = e.clientX - panelSX;
    panelY = e.clientY - panelSY;
    positionPanel();
  });
  document.addEventListener('touchmove', e => {
    if (!panelDragging) return;
    panelDragMoved = true;
    const t = e.touches[0];
    panelX = t.clientX - panelSX;
    panelY = t.clientY - panelSY;
    positionPanel();
  });
  document.addEventListener('mouseup', () => {
    if (panelDragging && panelDragMoved) saveSettings();
    panelDragging = false;
  });
  document.addEventListener('touchend', () => {
    if (panelDragging && panelDragMoved) saveSettings();
    panelDragging = false;
  });
  panel.querySelector('#ch-depth').oninput = e => {
    ENGINE_DEPTH = parseInt(e.target.value);
    engineDepths[currentEngine] = ENGINE_DEPTH;
    panel.querySelector('#ch-depth-val').textContent = ENGINE_DEPTH;
    saveSettings();
  };
  function applyUIOpacity() {
    try {
      root.style.opacity = String(UI_OPACITY);
    } catch {}
  }
  const opacitySlider = panel.querySelector('#ch-opacity');
  const opacityVal = panel.querySelector('#ch-opacity-val');
  if (opacitySlider) {
    opacitySlider.oninput = e => {
      UI_OPACITY = Math.max(.05, Math.min(1, parseInt(e.target.value, 10) / 100));
      opacityVal.textContent = Math.round(UI_OPACITY * 100) + '%';
      applyUIOpacity();
      saveSettings();
    };
  }
  applyUIOpacity();
  const engineSelect = panel.querySelector('#ch-engine');
  engineSelect.value = currentEngine;
  engineSelect.onchange = e => {
    const newKey = e.target.value;
    engineSelect.disabled = true;
    const reenable = () => {
      try {
        engineSelect.disabled = false;
      } catch {}
    };
    Promise.resolve(switchEngine(newKey)).then(() => {
      saveSettings();
      reenable();
    }, reenable);
    setTimeout(reenable, 3e4);
  };
  const resetBindsBtn = panel.querySelector('#ch-reset-binds');
  if (resetBindsBtn) resetBindsBtn.onclick = () => {
    Object.keys(binds).forEach(k => {
      binds[k] = null;
    });
    panel.querySelectorAll('.ch-keybind[data-bind]').forEach(el => {
      el.textContent = 'Press keys...';
    });
    saveSettings();
  };
  const persistToggle = panel.querySelector('#ch-persist');
  persistToggle.checked = persistSettings;
  persistToggle.onchange = e => {
    persistSettings = e.target.checked;
    if (persistSettings) {
      try {
        localStorage.setItem('ch-persist', '1');
      } catch {}
      saveSettings();
    } else {
      try {
        localStorage.removeItem('ch-settings');
        localStorage.removeItem('ch-skins');
        localStorage.removeItem('ch-detection-games-v1');
        localStorage.setItem('ch-persist', '0');
      } catch {}
    }
  };
  panel.querySelector('#ch-delay-toggle').onchange = e => {
    DELAY_ENABLED = e.target.checked;
    panel.querySelector('#ch-delay-sliders').style.display = e.target.checked ? '' : 'none';
    saveSettings();
  };
  const delayMinSlider = panel.querySelector('#ch-delay-min');
  const delayMaxSlider = panel.querySelector('#ch-delay-max');
  const delayMinVal = panel.querySelector('#ch-delay-min-val');
  const delayMaxVal = panel.querySelector('#ch-delay-max-val');
  delayMinSlider.oninput = e => {
    DELAY_MIN = parseFloat(e.target.value);
    if (DELAY_MIN > DELAY_MAX) {
      DELAY_MAX = DELAY_MIN;
      delayMaxSlider.value = DELAY_MAX;
      delayMaxVal.textContent = DELAY_MAX + 's';
    }
    delayMinVal.textContent = DELAY_MIN + 's';
    saveSettings();
  };
  delayMaxSlider.oninput = e => {
    DELAY_MAX = parseFloat(e.target.value);
    if (DELAY_MAX < DELAY_MIN) {
      DELAY_MIN = DELAY_MAX;
      delayMinSlider.value = DELAY_MIN;
      delayMinVal.textContent = DELAY_MIN + 's';
    }
    delayMaxVal.textContent = DELAY_MAX + 's';
    saveSettings();
  };
  panel.querySelector('#ch-arrow').onchange = e => {
    window.chessHelper.showArrow = e.target.checked;
    saveSettings();
    if (!e.target.checked) {
      clearArrows();
      return;
    }
    const fen = getFEN();
    if (fen && isMyTurn() === true) {
      const cached = getCachedEval(fen, 1);
      if (cached && cached.length) {
        drawNativeArrow(cached[0].move);
        clearShading();
        return;
      }
    }
    lastFen = '';
    tick();
  };
  const hiddenDarknessSlider = panel.querySelector('#ch-hidden-darkness');
  const hiddenDarknessVal = panel.querySelector('#ch-hidden-darkness-val');
  if (hiddenDarknessSlider) {
    hiddenDarknessSlider.oninput = e => {
      HIDDEN_DARKNESS = Math.max(.02, Math.min(.5, parseInt(e.target.value, 10) / 100));
      hiddenDarknessVal.textContent = Math.round(HIDDEN_DARKNESS * 100) + '%';
      document.querySelectorAll('.ch-shade-overlay').forEach(ov => {
        ov.style.background = `rgba(0,0,0,${HIDDEN_DARKNESS})`;
      });
      saveSettings();
    };
  }
  panel.querySelector('#ch-hidden').onchange = e => {
    window.chessHelper.hiddenArrow = e.target.checked;
    const hc = panel.querySelector('#ch-hidden-controls');
    if (hc) hc.style.display = e.target.checked ? '' : 'none';
    saveSettings();
    if (!e.target.checked) {
      clearShading();
      return;
    }
    const fen = getFEN();
    if (fen && isMyTurn() === true) {
      const cached = getCachedEval(fen, 1);
      if (cached && cached.length) {
        drawShading(cached[0].move);
        clearArrows();
        return;
      }
    }
    lastFen = '';
    tick();
  };
  panel.querySelector('#ch-auto').onchange = e => {
    window.chessHelper.autoPlay = e.target.checked;
    if (e.target.checked) {
      lastFen = '';
      lastMovedFen = '';
      waitingForOpponent = false;
      tick();
      for (let i = 1; i <= 5; i++) setTimeout(tick, i * 1e3);
    }
    saveSettings();
  };
  panel.querySelector('#ch-analyze').onclick = async () => {
    const btn = panel.querySelector('#ch-analyze');
    btn.textContent = 'Analyzing...';
    thinkingEl.classList.add('active');
    if (!inActiveGame()) {
      btn.textContent = 'No Game';
      thinkingEl.classList.remove('active');
      setTimeout(() => btn.textContent = 'Analyze once', 1500);
      return;
    }
    let fen = getFEN();
    if (!fen) {
      btn.textContent = 'No Game';
      thinkingEl.classList.remove('active');
      setTimeout(() => btn.textContent = 'Analyze once', 1500);
      return;
    }
    try {
      if (!isMyTurn()) {
        const candidates = await queryLocal(fen, ENGINE_DEPTH, 1);
        const om = candidates.length ? candidates[0].move : null;
        thinkingEl.classList.remove('active');
        if (om) {
          drawOpponentArrow(om);
          btn.textContent = `Opp: ${om.toUpperCase()}`;
        } else btn.textContent = 'No result';
        setTimeout(() => btn.textContent = 'Analyze once', 2500);
        return;
      }
      const result = await fetchRemote(fen);
      thinkingEl.classList.remove('active');
      if (result) {
        updateEval(result.cp, getMyColor());
        if (window.chessHelper.hiddenArrow) {
          drawShading(result.move);
          clearArrows();
        } else {
          drawNativeArrow(result.move);
        }
        btn.textContent = `Best: ${result.move.toUpperCase()}`;
      } else btn.textContent = 'No result';
      setTimeout(() => btn.textContent = 'Analyze once', 2500);
    } catch (e) {
      thinkingEl.classList.remove('active');
      btn.textContent = 'Error';
      setTimeout(() => btn.textContent = 'Analyze once', 2e3);
    }
  };
  panel.querySelector('#ch-opponent').onchange = e => {
    window.chessHelper.showOpponent = e.target.checked;
    saveSettings();
    if (!e.target.checked) {
      clearOpponentArrow();
      return;
    }
    const fen = getFEN();
    if (fen) {
      const probeFen = isMyTurn() === true ? flipFEN(fen) : fen;
      const cached = getCachedEval(probeFen, 1);
      if (cached && cached.length) {
        drawOpponentArrow(cached[0].move);
        return;
      }
    }
    lastFen = '';
    lastOppFen = '';
    tick();
  };
  panel.querySelector('#ch-eval').onchange = e => {
    window.chessHelper.showEval = e.target.checked;
    evalBar.style.display = e.target.checked ? '' : 'none';
    if (e.target.checked) {
      lastFen = '';
      lastOppFen = '';
      tick();
    }
    saveSettings();
  };
  const voiceBtn = panel.querySelector('#ch-voice-pick-btn');
  const voiceList = panel.querySelector('#ch-voice-pick-list');
  function defaultVoiceName() {
    try {
      const voices = window.speechSynthesis && window.speechSynthesis.getVoices() || [];
      const d = voices.find(v => v.default) || voices[0];
      return d ? d.name : '';
    } catch {
      return '';
    }
  }
  function setVoiceLabel(name) {
    const resolved = name || defaultVoiceName();
    const txt = resolved ? resolved + (name ? '' : ' (default)') : 'Default';
    voiceBtn.firstChild.nodeValue = txt;
  }
  function populateVoicePicker() {
    if (!voiceList || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices() || [];
    const items = [ {
      name: '',
      label: 'Default'
    } ].concat(voices.map(v => ({
      name: v.name,
      label: `${v.name} (${v.lang})`
    })));
    voiceList.innerHTML = items.map(it => {
      const safe = it.name.replace(/"/g, '&quot;');
      const active = it.name === VOICE_NAME ? 'background:rgba(129,182,76,0.15);' : '';
      return `<div class="ch-voice-item" data-name="${safe}" title="${it.label.replace(/"/g, '&quot;')}" style="padding:7px 10px;font-size:11.5px;line-height:1.3;color:#fff;cursor:pointer;word-break:break-word;${active}">${it.label}</div>`;
    }).join('');
    voiceList.querySelectorAll('.ch-voice-item').forEach(el => {
      el.onmouseenter = () => {
        if (el.dataset.name !== VOICE_NAME) el.style.background = 'rgba(255,255,255,0.08)';
      };
      el.onmouseleave = () => {
        el.style.background = el.dataset.name === VOICE_NAME ? 'rgba(129,182,76,0.15)' : '';
      };
      el.onclick = () => {
        VOICE_NAME = el.dataset.name;
        setVoiceLabel(VOICE_NAME);
        voiceList.style.display = 'none';
        populateVoicePicker();
        saveSettings();
      };
    });
    setVoiceLabel(VOICE_NAME);
  }
  if (window.speechSynthesis) {
    populateVoicePicker();
    window.speechSynthesis.onvoiceschanged = populateVoicePicker;
  }
  voiceBtn.onclick = e => {
    e.stopPropagation();
    unlockVoice();
    voiceList.style.display = voiceList.style.display === 'none' ? 'block' : 'none';
  };
  document.addEventListener('click', e => {
    if (!panel.querySelector('#ch-voice-pick-wrap').contains(e.target)) voiceList.style.display = 'none';
  });
  panel.querySelector('#ch-voice').onchange = e => {
    window.chessHelper.voice = e.target.checked;
    panel.querySelector('#ch-voice-sliders').style.display = e.target.checked ? '' : 'none';
    if (e.target.checked) {
      unlockVoice();
      lastFen = '';
      tick();
    } else stopVoice();
    saveSettings();
  };
  const voiceRateSlider = panel.querySelector('#ch-voice-rate');
  const voiceRateVal = panel.querySelector('#ch-voice-rate-val');
  voiceRateSlider.oninput = e => {
    VOICE_RATE = parseFloat(e.target.value);
    voiceRateVal.textContent = VOICE_RATE.toFixed(1);
    saveSettings();
  };
  const voiceVolSlider = panel.querySelector('#ch-voice-vol');
  const voiceVolVal = panel.querySelector('#ch-voice-vol-val');
  voiceVolSlider.oninput = e => {
    VOICE_VOLUME = parseFloat(e.target.value);
    voiceVolVal.textContent = Math.round(VOICE_VOLUME * 100) + '%';
    saveSettings();
  };
  function sayOnce() {
    unlockVoice();
    if (lastSpokenText) speakText(lastSpokenText); else speakText('knight G one to F three');
  }
  panel.querySelector('#ch-voice-test').onclick = sayOnce;
  panel.querySelector('#ch-streamer').onchange = e => {
    window.chessHelper.streamer = e.target.checked;
    panel.querySelector('#ch-streamer-controls').style.display = e.target.checked ? '' : 'none';
    if (e.target.checked) {
      lastFen = '';
      tick();
      renderStreamer();
    } else clearStreamerText();
    saveSettings();
  };
  const streamerSlider = panel.querySelector('#ch-streamer-size');
  const streamerSizeVal = panel.querySelector('#ch-streamer-size-val');
  streamerSlider.oninput = e => {
    streamerSize = parseInt(e.target.value, 10);
    streamerSizeVal.textContent = streamerSize;
    applyStreamerStyle();
    saveSettings();
  };
  let sDrag = false, sdx = 0, sdy = 0;
  streamerEl.addEventListener('pointerdown', e => {
    const r = streamerEl.getBoundingClientRect();
    sDrag = true;
    sdx = e.clientX - r.left;
    sdy = e.clientY - r.top;
    try {
      streamerEl.setPointerCapture(e.pointerId);
    } catch {}
    e.preventDefault();
  });
  streamerEl.addEventListener('pointermove', e => {
    if (!sDrag) return;
    streamerPos = {
      x: e.clientX - sdx,
      y: e.clientY - sdy
    };
    applyStreamerStyle();
  });
  const endStreamerDrag = () => {
    if (sDrag) {
      sDrag = false;
      saveSettings();
    }
  };
  streamerEl.addEventListener('pointerup', endStreamerDrag);
  streamerEl.addEventListener('pointercancel', endStreamerDrag);
  const _origCloseFn = panel.querySelector('#ch-close').onclick;
  panel.querySelector('#ch-close').onclick = () => {
    if (_origCloseFn) _origCloseFn();
    renderStreamer();
  };
  panel.querySelector('#ch-streamer-reset').onclick = () => {
    const el = document.getElementById('ch-streamer-text');
    const w = el ? Math.max(el.offsetWidth, 120) : 120;
    streamerPos = {
      x: Math.max(0, (innerWidth - w) / 2),
      y: 16
    };
    applyStreamerStyle();
    saveSettings();
  };
  applyStreamerStyle();
  let uiHidden = false;
  let autoPlayBeforeHide = false;
  function toggleUI() {
    uiHidden = !uiHidden;
    root.style.display = uiHidden ? 'none' : '';
    if (uiHidden) {
      clearArrows();
      clearShading();
      clearOpponentArrow();
      stopVoice();
      autoPlayBeforeHide = window.chessHelper.autoPlay;
      if (autoPlayBeforeHide) {
        window.chessHelper.autoPlay = false;
        panel.querySelector('#ch-auto').checked = false;
      }
    } else {
      if (autoPlayBeforeHide) {
        const cb = panel.querySelector('#ch-auto');
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
      }
      lastFen = '';
      tick();
    }
  }
  const binds = {
    hide: null,
    arrow: null,
    hidden: null,
    auto: null,
    delay: null,
    opponent: null,
    eval: null,
    voice: null,
    voiceRepeat: null,
    analyze: null,
    streamer: null,
    streamerCenter: null
  };
  let recordingBind = null;
  let recordingHeldMods = null;
  const KEY_NAMES = {
    ' ': 'Space',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Backspace: 'Backspace',
    Delete: 'Delete',
    Enter: 'Enter',
    Tab: 'Tab',
    CapsLock: 'CapsLock',
    Insert: 'Insert',
    Home: 'Home',
    End: 'End',
    PageUp: 'PgUp',
    PageDown: 'PgDn'
  };
  const MODS = new Set([ 'Control', 'Shift', 'Alt', 'Meta' ]);
  function prettyKey(key) {
    if (KEY_NAMES[key]) return KEY_NAMES[key];
    if (key.length === 1) return key.toUpperCase();
    return key;
  }
  function liveLabel(e) {
    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Win');
    if (!MODS.has(e.key)) parts.push(prettyKey(e.key));
    return parts.join('+') || 'Press keys...';
  }
  function keyLabel(k) {
    if (!k) return 'Press keys...';
    const parts = [];
    if (k.ctrl) parts.push('Ctrl');
    if (k.alt) parts.push('Alt');
    if (k.shift) parts.push('Shift');
    if (k.meta) parts.push('Win');
    if (k.key) parts.push(prettyKey(k.key));
    return parts.join('+') || 'Press keys...';
  }
  function matchesKey(e, k) {
    if (!k) return false;
    if (k.key) {
      return e.ctrlKey === !!k.ctrl && e.altKey === !!k.alt && e.shiftKey === !!k.shift && e.metaKey === !!k.meta && e.key.toLowerCase() === k.key.toLowerCase();
    }
    return false;
  }
  function bindFingerprint(k) {
    if (!k) return '';
    const parts = [];
    if (k.ctrl) parts.push('c');
    if (k.alt) parts.push('a');
    if (k.shift) parts.push('s');
    if (k.meta) parts.push('m');
    if (k.key) parts.push(k.key.toLowerCase());
    return parts.join('|');
  }
  function cancelRecording() {
    if (!recordingBind) return;
    recordingBind.el.textContent = keyLabel(binds[recordingBind.name]);
    recordingBind.el.classList.remove('recording');
    recordingBind = null;
  }
  function commitBind(newKey) {
    const name = recordingBind.name;
    const fp = bindFingerprint(newKey);
    for (const [other, k] of Object.entries(binds)) {
      if (other !== name && k && bindFingerprint(k) === fp) {
        binds[other] = null;
        const otherEl = panel.querySelector(`.ch-keybind[data-bind="${other}"]`);
        if (otherEl) otherEl.textContent = 'Press keys...';
      }
    }
    binds[name] = newKey;
    recordingBind.el.textContent = keyLabel(newKey);
    recordingBind.el.classList.remove('recording');
    recordingBind = null;
    saveSettings();
  }
  panel.querySelectorAll('.ch-keybind[data-bind]').forEach(el => {
    el.onclick = ev => {
      ev.stopPropagation();
      if (recordingBind && recordingBind.el === el) {
        cancelRecording();
        return;
      }
      cancelRecording();
      recordingBind = {
        name: el.dataset.bind,
        el
      };
      el.textContent = 'Press keys...';
      el.classList.add('recording');
    };
  });
  document.addEventListener('click', e => {
    if (recordingBind && !e.target.closest('.ch-keybind')) cancelRecording();
  });
  function toggleBind(name) {
    const map = {
      arrow: '#ch-arrow',
      hidden: '#ch-hidden',
      auto: '#ch-auto',
      delay: '#ch-delay-toggle',
      opponent: '#ch-opponent',
      eval: '#ch-eval',
      voice: '#ch-voice',
      streamer: '#ch-streamer'
    };
    const cb = panel.querySelector(map[name]);
    if (!cb) return;
    cb.checked = !cb.checked;
    cb.dispatchEvent(new Event('change'));
  }
  let soloModKey = null;
  let soloModTime = 0;
  function matchModOnly(e, k) {
    if (!k || k.key) return false;
    return !!k.ctrl === (e.key === 'Control') && !!k.alt === (e.key === 'Alt') && !!k.shift === (e.key === 'Shift') && !!k.meta === (e.key === 'Meta');
  }
  function fireModBind(name) {
    if (name === 'hide') {
      toggleUI();
      return true;
    }
    if (name === 'voiceRepeat') {
      sayOnce();
      return true;
    }
    if (name === 'analyze') {
      panel.querySelector('#ch-analyze').click();
      return true;
    }
    if (name === 'streamerCenter') {
      panel.querySelector('#ch-streamer-reset').click();
      return true;
    }
    toggleBind(name);
    return true;
  }
  document.addEventListener('keydown', e => {
    if (recordingBind) {
      if (e.key === 'Escape') {
        cancelRecording();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      recordingBind.el.textContent = liveLabel(e);
      if (MODS.has(e.key)) {
        recordingHeldMods = {
          ctrl: e.ctrlKey || e.key === 'Control',
          alt: e.altKey || e.key === 'Alt',
          shift: e.shiftKey || e.key === 'Shift',
          meta: e.metaKey || e.key === 'Meta',
          key: null
        };
      } else {
        recordingHeldMods = null;
        commitBind({
          ctrl: e.ctrlKey,
          shift: e.shiftKey,
          alt: e.altKey,
          meta: e.metaKey,
          key: e.key
        });
      }
      return;
    }
    if (MODS.has(e.key)) {
      soloModKey = e.key;
      soloModTime = Date.now();
    } else {
      soloModKey = null;
    }
    if (matchesKey(e, binds.hide)) {
      e.preventDefault();
      toggleUI();
      return;
    }
    if (matchesKey(e, binds.arrow)) {
      e.preventDefault();
      toggleBind('arrow');
      return;
    }
    if (matchesKey(e, binds.hidden)) {
      e.preventDefault();
      toggleBind('hidden');
      return;
    }
    if (matchesKey(e, binds.auto)) {
      e.preventDefault();
      toggleBind('auto');
      return;
    }
    if (matchesKey(e, binds.delay)) {
      e.preventDefault();
      toggleBind('delay');
      return;
    }
    if (matchesKey(e, binds.opponent)) {
      e.preventDefault();
      toggleBind('opponent');
      return;
    }
    if (matchesKey(e, binds.eval)) {
      e.preventDefault();
      toggleBind('eval');
      return;
    }
    if (matchesKey(e, binds.voice)) {
      e.preventDefault();
      toggleBind('voice');
      return;
    }
    if (matchesKey(e, binds.voiceRepeat)) {
      e.preventDefault();
      sayOnce();
      return;
    }
    if (matchesKey(e, binds.streamer)) {
      e.preventDefault();
      toggleBind('streamer');
      return;
    }
    if (matchesKey(e, binds.streamerCenter)) {
      e.preventDefault();
      panel.querySelector('#ch-streamer-reset').click();
      return;
    }
    if (matchesKey(e, binds.analyze)) {
      e.preventDefault();
      panel.querySelector('#ch-analyze').click();
      return;
    }
  });
  document.addEventListener('keyup', e => {
    if (recordingBind && recordingHeldMods) {
      commitBind(recordingHeldMods);
      recordingHeldMods = null;
      return;
    }
    if (!MODS.has(e.key) || !soloModKey) return;
    if (e.key !== soloModKey) {
      soloModKey = null;
      return;
    }
    if (Date.now() - soloModTime > 1e3) {
      soloModKey = null;
      return;
    }
    soloModKey = null;
    for (const name of [ 'hide', 'arrow', 'hidden', 'auto', 'delay', 'opponent', 'eval', 'voice', 'voiceRepeat', 'analyze', 'streamer', 'streamerCenter' ]) {
      if (matchModOnly(e, binds[name])) {
        e.preventDefault();
        fireModBind(name);
        return;
      }
    }
  });
  const saved = loadSettings();
  if (saved) {
    if (saved.toggles) {
      Object.assign(window.chessHelper, saved.toggles);
      const tmap = {
        showArrow: '#ch-arrow',
        hiddenArrow: '#ch-hidden',
        autoPlay: '#ch-auto',
        showOpponent: '#ch-opponent',
        showEval: '#ch-eval',
        voice: '#ch-voice',
        streamer: '#ch-streamer'
      };
      for (const [k, sel] of Object.entries(tmap)) {
        const cb = panel.querySelector(sel);
        if (cb) cb.checked = !!saved.toggles[k];
      }
      if (saved.toggles.showEval) evalBar.style.display = '';
      if (saved.toggles.voice) {
        const vs = panel.querySelector('#ch-voice-sliders');
        if (vs) vs.style.display = '';
      }
    }
    if (typeof saved.voiceRate === 'number') {
      VOICE_RATE = saved.voiceRate;
      voiceRateSlider.value = VOICE_RATE;
      voiceRateVal.textContent = VOICE_RATE.toFixed(1);
    }
    if (typeof saved.voiceVolume === 'number') {
      VOICE_VOLUME = saved.voiceVolume;
      voiceVolSlider.value = VOICE_VOLUME;
      voiceVolVal.textContent = Math.round(VOICE_VOLUME * 100) + '%';
    }
    if (typeof saved.voiceName === 'string') {
      VOICE_NAME = saved.voiceName;
      setVoiceLabel(VOICE_NAME);
      if (window.speechSynthesis) populateVoicePicker();
    }
    if (typeof saved.streamerSize === 'number') {
      streamerSize = saved.streamerSize;
      streamerSlider.value = streamerSize;
      streamerSizeVal.textContent = streamerSize;
    }
    if (saved.streamerPos && typeof saved.streamerPos.x === 'number') streamerPos = saved.streamerPos;
    if (saved.toggles && saved.toggles.streamer) {
      const sc = panel.querySelector('#ch-streamer-controls');
      if (sc) sc.style.display = '';
    }
    applyStreamerStyle();
    if (typeof saved.uiOpacity === 'number') {
      UI_OPACITY = Math.max(.05, Math.min(1, saved.uiOpacity));
      if (opacitySlider) {
        opacitySlider.value = Math.round(UI_OPACITY * 100);
        opacityVal.textContent = Math.round(UI_OPACITY * 100) + '%';
      }
      applyUIOpacity();
    }
    if (typeof saved.hiddenDarkness === 'number') {
      HIDDEN_DARKNESS = Math.max(.02, Math.min(.5, saved.hiddenDarkness));
      if (hiddenDarknessSlider) {
        hiddenDarknessSlider.value = Math.round(HIDDEN_DARKNESS * 100);
        hiddenDarknessVal.textContent = Math.round(HIDDEN_DARKNESS * 100) + '%';
      }
    }
    if (saved.toggles && saved.toggles.hiddenArrow) {
      const hc = panel.querySelector('#ch-hidden-controls');
      if (hc) hc.style.display = '';
    }
    if (typeof saved.depth === 'number') {
      ENGINE_DEPTH = saved.depth;
      const ds = panel.querySelector('#ch-depth');
      if (ds) ds.value = ENGINE_DEPTH;
      const dv = panel.querySelector('#ch-depth-val');
      if (dv) dv.textContent = ENGINE_DEPTH;
    }
    if (saved.engineDepths && typeof saved.engineDepths === 'object') Object.assign(engineDepths, saved.engineDepths);
    if (typeof saved.delayEnabled === 'boolean') {
      DELAY_ENABLED = saved.delayEnabled;
      const dt = panel.querySelector('#ch-delay-toggle');
      if (dt) dt.checked = DELAY_ENABLED;
      const dsl = panel.querySelector('#ch-delay-sliders');
      if (dsl) dsl.style.display = DELAY_ENABLED ? '' : 'none';
    }
    if (typeof saved.delayMin === 'number') {
      DELAY_MIN = saved.delayMin;
      delayMinSlider.value = DELAY_MIN;
      delayMinVal.textContent = DELAY_MIN + 's';
    }
    if (typeof saved.delayMax === 'number') {
      DELAY_MAX = saved.delayMax;
      delayMaxSlider.value = DELAY_MAX;
      delayMaxVal.textContent = DELAY_MAX + 's';
    }
    if (DELAY_MIN > DELAY_MAX) {
      const t = DELAY_MIN;
      DELAY_MIN = DELAY_MAX;
      DELAY_MAX = t;
      delayMinSlider.value = DELAY_MIN;
      delayMinVal.textContent = DELAY_MIN + 's';
      delayMaxSlider.value = DELAY_MAX;
      delayMaxVal.textContent = DELAY_MAX + 's';
    }
    if (typeof saved.engine === 'string' && ENGINES[saved.engine]) {
      currentEngine = saved.engine;
      const sel = panel.querySelector('#ch-engine');
      if (sel) sel.value = currentEngine;
    }
    if (saved.detTarget === 'w') {
      detTarget = 'w';
      panel.querySelector('#ch-det-white').style.background = 'var(--ch-accent)';
      panel.querySelector('#ch-det-white').style.color = '#fff';
      panel.querySelector('#ch-det-black').style.background = 'rgba(255,255,255,0.06)';
      panel.querySelector('#ch-det-black').style.color = 'rgba(255,255,255,0.5)';
    }
    if (saved.binds) {
      for (const [name, val] of Object.entries(saved.binds)) {
        if (val && binds.hasOwnProperty(name)) {
          binds[name] = val;
          const el = panel.querySelector(`.ch-keybind[data-bind="${name}"]`);
          if (el) el.textContent = keyLabel(val);
        }
      }
    }
    if (saved.bubblePos && typeof saved.bubblePos.x === 'number' && typeof saved.bubblePos.y === 'number') {
      ox = Math.max(0, Math.min(saved.bubblePos.x, innerWidth - 52));
      oy = Math.max(0, Math.min(saved.bubblePos.y, innerHeight - 52));
      setPos();
    }
    if (saved.panelPos && typeof saved.panelPos.x === 'number' && typeof saved.panelPos.y === 'number') {
      panelX = saved.panelPos.x;
      panelY = saved.panelPos.y;
    }
    applyDepthCap();
  }
  console.log('chess helper loaded');
})();
