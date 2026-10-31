(() => {
  if (window.__chessHelper) return console.warn('already loaded');
  window.__chessHelper = true;

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
    :root { --ch-accent:#81b64c; --ch-accent-hover:#a3d160; --ch-bg:rgba(20,20,23,0.82); --ch-border:rgba(255,255,255,0.1); --ch-radius:18px; --ch-font:'Outfit',system-ui,sans-serif; }
    #chess-helper-root { position:fixed; left:0; top:0; width:0; height:0; overflow:visible; pointer-events:none !important; z-index:99999; font-family:var(--ch-font); -webkit-tap-highlight-color:transparent; }
    #chess-helper-bubble { position:fixed; width:48px; height:48px; background:var(--ch-bg); -webkit-backdrop-filter:blur(20px); backdrop-filter:blur(20px); border:1px solid var(--ch-border); border-radius:50%; box-shadow:0 8px 30px -8px #0008; display:flex; align-items:center; justify-content:center; cursor:grab; color:#fff; pointer-events:auto; z-index:100000; user-select:none; touch-action:none; transition:transform .15s; }
    #chess-helper-bubble:active { transform:scale(1.12); }
    #chess-helper-bubble img { width:100%; height:100%; pointer-events:none; -webkit-user-drag:none; }
    #chess-helper-wrap { position:fixed; visibility:hidden; display:flex; align-items:stretch; gap:8px; opacity:0; transform:scale(0.92); transition:opacity .2s, transform .25s; pointer-events:none; }
    #chess-helper-wrap.visible { visibility:visible; opacity:1; transform:scale(1); pointer-events:auto; }
    #chess-helper-wrap:not(.visible), #chess-helper-wrap:not(.visible) * { pointer-events:none !important; }
    #chess-helper-panel { width:min(270px,85vw); max-height:80vh; overflow-y:auto; background:rgba(18,18,20,0.9); -webkit-backdrop-filter:blur(24px); backdrop-filter:blur(24px); border:1px solid var(--ch-border); border-radius:var(--ch-radius); padding:16px; display:flex; flex-direction:column; gap:12px; box-shadow:0 16px 50px #0009; pointer-events:auto; -webkit-overflow-scrolling:touch; }
    #ch-eval-bar { width:28px; border-radius:12px; overflow:hidden; background:#000; box-shadow:0 10px 40px -10px #0008; position:relative; pointer-events:auto; min-height:180px; }
    #ch-eval-white { position:absolute; bottom:0; left:0; right:0; background:#fff; transition:height .6s ease; height:50%; }
    .ch-eval-pct { position:absolute; width:100%; text-align:center; font-size:9px; font-weight:700; font-family:var(--ch-font); z-index:2; left:0; }
    #ch-eval-pct-top { top:7px; color:#fff; text-shadow:0 0 4px #000, 0 0 4px #000; }
    #ch-eval-pct-bot { bottom:7px; color:#000; text-shadow:0 0 4px #fff, 0 0 4px #fff; }
    .ch-header { display:flex; justify-content:space-between; align-items:center; touch-action:none; user-select:none; min-height:28px; }
    .ch-title { font-size:15px; font-weight:700; color:#fff; }
    .ch-close { width:28px; height:28px; border-radius:50%; border:none; background:rgba(255,255,255,0.08); color:#fff; font-size:18px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .ch-row { display:flex; justify-content:space-between; align-items:center; gap:8px; min-height:36px; }
    .ch-label { font-size:13px; color:#fff; font-weight:500; flex:1; }
    .ch-switch { position:relative; width:48px; height:28px; flex-shrink:0; }
    .ch-switch input { opacity:0; width:0; height:0; position:absolute; }
    .ch-slider { position:absolute; cursor:pointer; inset:0; background:rgba(255,255,255,0.12); transition:.3s; border-radius:28px; }
    .ch-slider:before { content:""; position:absolute; height:22px; width:22px; left:3px; bottom:3px; background:#e4e4e7; transition:.3s; border-radius:50%; }
    input:checked + .ch-slider { background:var(--ch-accent); }
    input:checked + .ch-slider:before { transform:translateX(20px); background:#fff; }
    .ch-btn { padding:11px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); background:rgba(255,255,255,0.06); color:#fff; font-family:var(--ch-font); font-size:13px; font-weight:600; cursor:pointer; transition:.2s; -webkit-tap-highlight-color:transparent; }
    .ch-btn-primary { background:var(--ch-accent); color:#121212; border:none; }
    .ch-btn-primary:active { background:var(--ch-accent-hover); }
    .ch-depth-row { display:flex; align-items:center; gap:8px; }
    .ch-depth-label { font-size:13px; color:#fff; font-weight:500; white-space:nowrap; }
    .ch-depth-val { font-size:13px; color:var(--ch-accent); font-weight:700; min-width:22px; text-align:center; }
    .ch-range { -webkit-appearance:none; appearance:none; flex:1; height:6px; background:rgba(255,255,255,0.15); border-radius:4px; outline:none; cursor:pointer; }
    .ch-range::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:var(--ch-accent); cursor:pointer; }
    .ch-shade-overlay { position:absolute; pointer-events:none; z-index:999; border-radius:2px; transition:opacity .2s; }
    .ch-thinking { font-size:12px; color:var(--ch-accent); font-weight:600; text-align:center; animation:ch-pulse 1.2s infinite; display:none; }
    .ch-thinking.active { display:block; }
    .ch-tabs { display:flex; gap:4px; }
    .ch-tab { flex:1; padding:8px 0; border:none; background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.45); font-family:var(--ch-font); font-size:11px; font-weight:600; cursor:pointer; border-radius:10px; transition:.2s; -webkit-tap-highlight-color:transparent; }
    .ch-tab.active { background:var(--ch-accent); color:#121212; }
    .ch-tab-content { display:none; flex-direction:column; gap:12px; }
    .ch-tab-content.active { display:flex; }
    .ch-detect-stat { display:flex; justify-content:space-between; align-items:center; padding:2px 0; }
    .ch-detect-label { font-size:12px; color:rgba(255,255,255,0.55); font-weight:500; }
    .ch-detect-value { font-size:13px; color:#fff; font-weight:700; font-family:var(--ch-font); }
    .ch-detect-gauge { height:10px; border-radius:5px; background:rgba(255,255,255,0.08); overflow:hidden; margin:4px 0; }
    .ch-detect-fill { height:100%; width:0%; border-radius:5px; transition:width .5s ease, background .5s ease; background:var(--ch-accent); }
    .ch-detect-verdict { text-align:center; font-size:12px; font-weight:600; color:rgba(255,255,255,0.4); padding:2px 0; }
    .ch-detect-reset { padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); font-family:var(--ch-font); font-size:12px; font-weight:600; cursor:pointer; -webkit-tap-highlight-color:transparent; text-align:center; }
    .ch-skins-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:4px; }
    .ch-skin-tile { aspect-ratio:1; background:rgba(255,255,255,0.1); border-radius:6px; cursor:pointer; position:relative; display:flex; align-items:center; justify-content:center; background-size:contain; background-position:center; background-repeat:no-repeat; transition:.15s; -webkit-tap-highlight-color:transparent; }
    .ch-skin-tile:active { background-color:rgba(255,255,255,0.2); }
    .ch-skin-tile.wide { grid-column:span 3; aspect-ratio:3/1; }
    .ch-skin-label { font-size:18px; color:rgba(255,255,255,0.8); pointer-events:none; line-height:1; }
    .ch-skin-tile.has-skin .ch-skin-label { display:none; }
    .ch-skin-remove { display:none; position:absolute; top:-4px; right:-4px; width:18px; height:18px; border-radius:50%; background:#e04040; color:#fff; border:none; font-size:12px; line-height:18px; text-align:center; padding:0; cursor:pointer; z-index:2; }
    .ch-skin-tile.has-skin .ch-skin-remove { display:block; }
    .ch-skins-row-label { font-size:10px; color:rgba(255,255,255,0.3); font-weight:600; grid-column:span 6; text-align:center; margin:2px 0 -2px; }
    .ch-info { width:20px; height:20px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.25); color:rgba(255,255,255,0.35); font-size:10px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; font-style:italic; font-family:serif; line-height:1; transition:.2s; }
    .ch-info:hover { border-color:var(--ch-accent); color:var(--ch-accent); }
    .ch-tooltip { display:none; background:rgba(10,10,12,0.95); border:1px solid var(--ch-border); border-radius:10px; padding:8px 12px; font-size:11px; color:rgba(255,255,255,0.7); line-height:1.5; margin-top:4px; }
    .ch-tooltip.show { display:block; }
    @keyframes ch-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  `;
  document.head.appendChild(style);

  window.chessHelper = { autoPlay: false, showArrow: false, hiddenArrow: false, showOpponent: false, showEval: false, detection: true };

  function loadSettings() {
    try {
      const raw = localStorage.getItem('ch-settings');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }
  function saveSettings() {
    try {
      localStorage.setItem('ch-settings', JSON.stringify({
        toggles: { autoPlay: window.chessHelper.autoPlay, showArrow: window.chessHelper.showArrow, hiddenArrow: window.chessHelper.hiddenArrow, showOpponent: window.chessHelper.showOpponent, showEval: window.chessHelper.showEval, detection: window.chessHelper.detection },
        depth: ENGINE_DEPTH, delayMin: DELAY_MIN, delayMax: DELAY_MAX, delayEnabled: DELAY_ENABLED,
        detTarget: detTarget
      }));
    } catch {}
  }

  const detection = { oppMoves: 0, totalCpl: 0, bestMoves: 0, topThree: 0, blunders: 0, lastOppEvalCp: null, lastOppEvalFen: null, lastMyEvalCp: null, lastMyEvalFen: null };
  const moveLog = [];
  let detTarget = 'b';
  const DETECTION_CACHE_KEY = 'ch-detection-games-v1';
  let activeDetectionKey = '';

  const ELO_TABLE = [
    { elo: 400, acpl: 215, bmr: 0.17, acc: 45 }, { elo: 600, acpl: 188, bmr: 0.22, acc: 50 },
    { elo: 800, acpl: 158, bmr: 0.27, acc: 56 }, { elo: 1000, acpl: 128, bmr: 0.33, acc: 62 },
    { elo: 1200, acpl: 97, bmr: 0.40, acc: 68 }, { elo: 1400, acpl: 73, bmr: 0.48, acc: 73 },
    { elo: 1600, acpl: 53, bmr: 0.56, acc: 78 }, { elo: 1800, acpl: 37, bmr: 0.64, acc: 82 },
    { elo: 2000, acpl: 26, bmr: 0.71, acc: 86 }, { elo: 2200, acpl: 17, bmr: 0.77, acc: 89 },
    { elo: 2400, acpl: 11, bmr: 0.83, acc: 92 }, { elo: 2600, acpl: 7, bmr: 0.88, acc: 94 },
  ];

  function expectedStats(elo) {
    if (!elo) return ELO_TABLE[4];
    const c = Math.max(400, Math.min(2600, elo));
    for (let i = 0; i < ELO_TABLE.length - 1; i++) {
      if (c <= ELO_TABLE[i + 1].elo) {
        const t = (c - ELO_TABLE[i].elo) / (ELO_TABLE[i + 1].elo - ELO_TABLE[i].elo);
        const L = (a, b) => a + t * (b - a);
        return { acpl: L(ELO_TABLE[i].acpl, ELO_TABLE[i+1].acpl), bmr: L(ELO_TABLE[i].bmr, ELO_TABLE[i+1].bmr), acc: L(ELO_TABLE[i].acc, ELO_TABLE[i+1].acc) };
      }
    }
    return ELO_TABLE[ELO_TABLE.length - 1];
  }

  function lichessAccuracy(acpl) {
    return Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * (acpl + 3.756)) - 3.1668));
  }

  function getPlayerElos() {
    const elos = { top: null, bottom: null };
    try {
      const topEl = document.querySelector('.player-tagline-top .user-tagline-rating, .board-layout-top .user-tagline-rating, [class*="playerinfo-top"] [data-cy="user-tagline-rating"]');
      const botEl = document.querySelector('.player-tagline-bottom .user-tagline-rating, .board-layout-bottom .user-tagline-rating, [class*="playerinfo-bottom"] [data-cy="user-tagline-rating"]');
      if (topEl) { const n = parseInt(topEl.textContent.replace(/[()]/g, '')); if (n > 0) elos.top = n; }
      if (botEl) { const n = parseInt(botEl.textContent.replace(/[()]/g, '')); if (n > 0) elos.bottom = n; }
      if (!elos.top && !elos.bottom) {
        const all = document.querySelectorAll('.user-tagline-rating, [data-cy="user-tagline-rating"]');
        if (all.length >= 2) { elos.top = parseInt(all[0].textContent.replace(/[()]/g, '')) || null; elos.bottom = parseInt(all[1].textContent.replace(/[()]/g, '')) || null; }
        else if (all.length === 1) { elos.top = parseInt(all[0].textContent.replace(/[()]/g, '')) || null; }
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
    if (exp.acpl) { const r = exp.acpl / Math.max(acpl, 1); if (r > 4) score += 35; else if (r > 3) score += 28; else if (r > 2) score += 18; else if (r > 1.5) score += 9; }
    if (exp.bmr) { const d = bmr - exp.bmr; if (d > 0.40) score += 75; else if (d > 0.28) score += 27; else if (d > 0.18) score += 17; else if (d > 0.10) score += 8; }
    if (moveCount >= 18 && blunders === 0) { const b = elo ? (elo < 900 ? 15 : elo < 1200 ? 11 : elo < 1600 ? 7 : elo < 2000 ? 3 : 0) : 6; score += b; }
    if (exp.acc) { const g = accuracy - exp.acc; if (g > 22) score += 20; else if (g > 14) score += 14; else if (g > 8) score += 7; }
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
      acplEl.textContent = '—'; bmrEl.textContent = '—'; accEl.textContent = '—';
      scoreEl.textContent = '—'; fillEl.style.width = '0%'; fillEl.style.background = 'var(--ch-accent)';
      verdictEl.textContent = 'Play a game to start detection'; verdictEl.style.color = 'rgba(255,255,255,0.4)';
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
    if (score >= 75) { level = 'Engine detected'; color = '#e04040'; }
    else if (score >= 50) { level = 'Highly suspicious'; color = '#e07040'; }
    else if (score >= 28) { level = 'Somewhat suspicious'; color = '#e0a040'; }
    else { level = 'Likely clean'; color = 'var(--ch-accent)'; }
    if (detection.oppMoves < 5) level += ' (low sample)';
    scoreEl.textContent = score + '%';
    fillEl.style.width = score + '%';
    fillEl.style.background = color;
    verdictEl.textContent = level;
    verdictEl.style.color = color;
  }

  function recalcDetection() {
    const myColor = getMyColor();
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
    detection.oppMoves = 0; detection.totalCpl = 0; detection.bestMoves = 0;
    detection.topThree = 0; detection.blunders = 0; detection.lastOppEvalCp = null; detection.lastOppEvalFen = null;
    detection.lastMyEvalCp = null; detection.lastMyEvalFen = null;
    moveLog.length = 0;
    recalcDetection();
  }

  const TCN_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^/\\[]|_@#$&';
  function decodeTcn(tcn) {
    const files = 'abcdefgh', promos = ['q','r','b','n'], moves = [];
    for (let i = 0; i + 1 < tcn.length; i += 2) {
      const fi = TCN_CHARS.indexOf(tcn[i]), ti = TCN_CHARS.indexOf(tcn[i + 1]);
      if (fi < 0 || fi > 63 || ti < 0) continue;
      const from = files[fi % 8] + (Math.floor(fi / 8) + 1);
      if (ti < 64) { moves.push(from + files[ti % 8] + (Math.floor(ti / 8) + 1)); }
      else {
        const extra = ti - 64, promo = promos[Math.floor(extra / 3)] || 'q';
        const dFile = (extra % 3) - 1, toFile = (fi % 8) + dFile;
        const toRank = Math.floor(fi / 8) < 4 ? 0 : 7;
        if (toFile >= 0 && toFile <= 7) moves.push(from + files[toFile] + (toRank + 1) + promo);
      }
    }
    return moves;
  }
  function decodeTcnMove(t) { const r = decodeTcn(t); return r.length ? r[0] : null; }

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
        const h = game.getHistory ? game.getHistory() : (game.getMoves ? game.getMoves() : []);
        for (const m of h) {
          if (typeof m === 'string' && m.length >= 4) uci.push(m.slice(0, 5).replace(/\s/g, ''));
          else if (m?.from && m?.to) uci.push(m.from + m.to + (m.promotion || ''));
          else if (m?.tcn) { const d = decodeTcnMove(m.tcn); if (d) uci.push(d); }
        }
      } catch {}
    }
    return uci;
  }

  function getDetectionGameIdentity() {
    const pageUrl = new URL(location.href);
    const pathMatch = pageUrl.pathname.match(/\/game\/(?:live|daily)\/([^/]+)/i);
    const urlGameId = pathMatch?.[1] || pageUrl.searchParams.get('gameId') || pageUrl.searchParams.get('game_id');
    if (urlGameId) return { key: pageUrl.origin + '|' + urlGameId, stable: true };

    const b = getBoard();
    let gameId = null;
    try {
      const game = b?.game;
      const candidate = game?.getGameId?.() ?? game?.gameId;
      if (typeof candidate === 'string' || typeof candidate === 'number') gameId = String(candidate);
    } catch {}
    if (gameId) return { key: pageUrl.origin + '|' + gameId, stable: true };

    const players = [...document.querySelectorAll('.player-tagline-top .user-tagline-username, .player-tagline-bottom .user-tagline-username, .board-layout-top .user-tagline-username, .board-layout-bottom .user-tagline-username, [data-cy="user-tagline-username"]')]
      .map(el => el.textContent.trim().toLowerCase())
      .filter(Boolean)
      .sort();
    return { key: pageUrl.origin + pageUrl.pathname + '|' + (players.join('|') || 'chess-game'), stable: false };
  }

  function readDetectionCache() {
    try {
      const saved = JSON.parse(localStorage.getItem(DETECTION_CACHE_KEY) || '{}');
      return saved && typeof saved === 'object' ? saved : {};
    } catch { return {}; }
  }

  function saveDetectionState() {
    if (!activeDetectionKey) return;
    try {
      const cache = readDetectionCache();
      cache[activeDetectionKey] = {
        savedAt: Date.now(),
        gameMoves: getGameMoves(),
        moveLog: moveLog.map(move => ({ color: move.color, cpl: move.cpl })),
        detection: { ...detection }
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
    Object.assign(detection, {
      oppMoves: 0, totalCpl: 0, bestMoves: 0, topThree: 0, blunders: 0,
      lastOppEvalCp: null, lastOppEvalFen: null, lastMyEvalCp: null, lastMyEvalFen: null
    });
    const canRestore = saved && (identity.stable || (savedMoves.length <= currentMoves.length && historyMatches));
    if (canRestore) {
      const savedLog = Array.isArray(saved.moveLog) ? saved.moveLog : [];
      moveLog.push(...savedLog.filter(move => (move.color === 'w' || move.color === 'b') && Number.isFinite(move.cpl)));
      if (saved.detection && typeof saved.detection === 'object') Object.assign(detection, saved.detection);
    }
    recalcDetection();
    return true;
  }

  const pieceToFen = { wp:'P',wn:'N',wb:'B',wr:'R',wq:'Q',wk:'K', bp:'p',bn:'n',bb:'b',br:'r',bq:'q',bk:'k' };

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
    if (b?.game?.getPlayingAs) try { const c = b.game.getPlayingAs(); if (c === 1 || c === 'w' || c === 'white') return 'w'; if (c === 2 || c === 'b' || c === 'black') return 'b'; } catch {}
    if (b?.hasAttribute?.('flipped') || b?.classList?.contains('flipped')) return 'b';
    return 'w';
  }

  function inActiveGame() {
    const b = getBoard();
    if (!b) return false;
    if (document.querySelector('.move-list-wrapper, .vertical-move-list, wc-move-list, [class*="move-list"]')) return true;
    const clocks = document.querySelectorAll('.clock-component, .clock-bottom, .clock-top');
    if ([...clocks].some(c => c.classList.contains('clock-player-turn'))) return true;
    if (clocks.length >= 2) return true;
    if (b.game?.getTurn && b.game?.getPlayingAs) return true;
    return false;
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
      if (fen && fen.includes('/')) { const parts = fen.split(' '); if (parts.length >= 4) parts[3] = '-'; return parts.join(' '); }
    }
    const pieces = document.querySelectorAll('.piece');
    if (!pieces.length) return null;
    const board = Array.from({length:8}, () => Array(8).fill(null));
    pieces.forEach(p => {
      const cls = [...p.classList];
      const type = cls.find(c => pieceToFen[c]);
      const sq = cls.find(c => c.startsWith('square-'));
      if (type && sq) { const n = sq.split('-')[1]; board[8 - +n[1]][+n[0] - 1] = pieceToFen[type]; }
    });
    const rows = board.map(r => { let s = '', e = 0; for (const c of r) { if (!c) e++; else { if (e) s += e; e = 0; s += c; } } return s + (e || ''); });
    const bottom = document.querySelector('.clock-bottom, .clock-component-bottom');
    const top = document.querySelector('.clock-top, .clock-component-top');
    let turn = 'w';
    if (bottom && bottom.classList.contains('clock-player-turn')) turn = getMyColor() || 'w';
    else if (top && top.classList.contains('clock-player-turn')) turn = (getMyColor() === 'w' ? 'b' : 'w');
    return rows.join('/') + ` ${turn} - - 0 1`;
  }

  const positionMoves = new Map();
  const REPEAT_THRESHOLD = 2;
  let ENGINE_DEPTH = 16;
  let DELAY_MIN = 1, DELAY_MAX = 5, DELAY_ENABLED = false;

  const fenCache = new Map();
  const FEN_CACHE_MAX = 100;
  function getCachedEval(fen, multiPV) {
    const entry = fenCache.get(fen);
    if (entry && entry.multiPV >= multiPV) return entry.results;
    return null;
  }
  function setCachedEval(fen, results, multiPV) {
    if (fenCache.size >= FEN_CACHE_MAX) {
      const first = fenCache.keys().next().value;
      fenCache.delete(first);
    }
    fenCache.set(fen, { results, multiPV });
  }

  function boardKey(fen) {
    const parts = fen.split(' ');
    return parts[0] + ' ' + (parts[1] || 'w');
  }

  let sfWorker = null, sfReady = false, sfCurrentMultiPV = 1;

  function showLoadingOverlay(msg) {
    let ov = document.getElementById('ch-loading-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'ch-loading-overlay';
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:999999;';
      ov.innerHTML = '<div style="background:#1e1e1e;border:1px solid #444;border-radius:12px;padding:28px 36px;text-align:center;color:#fff;font-family:system-ui,sans-serif;max-width:320px;"><div id="ch-load-spinner" style="width:36px;height:36px;border:3px solid #555;border-top:3px solid #96bc4b;border-radius:50%;margin:0 auto 14px;animation:chspin 1s linear infinite;"></div><div id="ch-load-msg" style="font-size:14px;line-height:1.5;"></div></div>';
      const style = document.createElement('style');
      style.textContent = '@keyframes chspin{to{transform:rotate(360deg)}}';
      ov.appendChild(style);
      document.body.appendChild(ov);
    }
    document.getElementById('ch-load-msg').textContent = msg;
  }
  function hideLoadingOverlay() {
    const ov = document.getElementById('ch-loading-overlay');
    if (ov) ov.remove();
  }

  async function fetchWithProgress(url, label) {
    const resp = await fetch(url);
    const total = +resp.headers.get('content-length') || 0;
    if (!total || !resp.body) {
      showLoadingOverlay(label + '...');
      return resp;
    }
    const reader = resp.body.getReader();
    const chunks = [];
    let loaded = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      const pct = Math.round((loaded / total) * 100);
      showLoadingOverlay(label + ' ' + pct + '%');
    }
    const buf = new Uint8Array(loaded);
    let pos = 0;
    for (const c of chunks) { buf.set(c, pos); pos += c.length; }
    return new Response(buf, { headers: resp.headers });
  }

  let _initP = null;
  async function initEngine() {
    if (sfReady) return;
    if (_initP) return _initP;
    _initP = _doInitEngine();
    return _initP;
  }
  async function _doInitEngine() {
    if (sfWorker) return;
    const base = 'https://unpkg.com/stockfish@18.0.8/bin/';
    try {
      showLoadingOverlay('Loading engine...');
      const [jsCode, wasmBuf] = await Promise.all([
        fetchWithProgress(base + 'stockfish-18-lite-single.js', 'Loading engine JS').then(r => r.text()),
        fetchWithProgress(base + 'stockfish-18-lite-single.wasm', 'Loading engine WASM').then(r => r.arrayBuffer())
      ]);
      showLoadingOverlay('Starting engine...');
      const boot = 'self.onmessage=function(e){if(e.data&&e.data.type==="init"){self.onmessage=null;var w=e.data.wasm,done=false,of=self.fetch;self.fetch=function(u,o){if(!done){done=true;return Promise.resolve(new Response(w,{status:200,headers:{"Content-Type":"application/wasm"}}))}return of.call(self,u,o)};importScripts(URL.createObjectURL(new Blob([e.data.js],{type:"application/javascript"})))}};';
      sfWorker = new Worker(URL.createObjectURL(new Blob([boot], { type: 'application/javascript' })));
      sfWorker.postMessage({ type: 'init', wasm: wasmBuf, js: jsCode }, [wasmBuf]);
      sfWorker.onerror = handleWorkerCrash;
      await uciCommand('uci', 'uciok');
      uciSend('setoption name Hash value 64');
      sfCurrentMultiPV = 1;
      uciSend('setoption name MultiPV value 1');
      await uciCommand('isready', 'readyok');
      sfReady = true;
      hideLoadingOverlay();
    } catch (e) {
      sfWorker = null;
      try {
        showLoadingOverlay('Falling back to ASM engine...');
        const r = await fetch(base + 'stockfish-18-asm.js');
        const code = await r.text();
        sfWorker = new Worker(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })));
        sfWorker.onerror = handleWorkerCrash;
        await uciCommand('uci', 'uciok');
        uciSend('setoption name Hash value 64');
        sfCurrentMultiPV = 1;
        uciSend('setoption name MultiPV value 1');
        await uciCommand('isready', 'readyok');
        sfReady = true;
        hideLoadingOverlay();
      } catch (e2) {
        sfWorker = null;
        hideLoadingOverlay();
      }
    }
  }

  function handleWorkerCrash() {
    console.warn('[Chess Assist] Engine worker crashed, restarting...');
    if (activeQueryHandler && sfWorker) { try { sfWorker.removeEventListener('message', activeQueryHandler); } catch {} }
    activeQueryHandler = null;
    sfWorker = null;
    sfReady = false;
    sfCurrentMultiPV = 1;
    _initP = null;
    fenCache.clear();
    initEngine();
  }

  let lastEngineResponse = Date.now();
  setInterval(() => {
    if (!sfWorker || !sfReady) return;
    const silent = Date.now() - lastEngineResponse;
    if (silent > 15000) {
      console.warn('[Chess Assist] Engine unresponsive for ' + Math.round(silent / 1000) + 's, restarting...');
      handleWorkerCrash();
    }
  }, 5000);

  function uciSend(cmd) { if (sfWorker) sfWorker.postMessage(cmd); }

  function uciCommand(cmd, waitFor) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('UCI timeout')), 15000);
      const handler = (e) => {
        if (typeof e.data === 'string' && e.data.startsWith(waitFor)) {
          clearTimeout(timeout);
          sfWorker.removeEventListener('message', handler);
          resolve(e.data);
        }
      };
      sfWorker.addEventListener('message', handler);
      uciSend(cmd);
    });
  }

  let activeQueryHandler = null;
  function queryLocal(fen, depth, multiPV) {
    multiPV = multiPV || 1;
    const cached = getCachedEval(fen, multiPV);
    if (cached) return Promise.resolve(cached);
    return new Promise((resolve) => {
      if (!sfWorker || !sfReady) { resolve([]); return; }
      if (activeQueryHandler) {
        sfWorker.removeEventListener('message', activeQueryHandler);
        activeQueryHandler = null;
      }
      uciSend('stop');
      if (sfCurrentMultiPV !== multiPV) {
        sfCurrentMultiPV = multiPV;
        uciSend('setoption name MultiPV value ' + multiPV);
      }
      const moves = {};
      let gotBestmove = false;
      const timeout = setTimeout(() => {
        if (gotBestmove) return;
        sfWorker.removeEventListener('message', handler);
        activeQueryHandler = null;
        const results = Object.entries(moves).sort((a, b) => a[0] - b[0]).map(e => e[1]);
        if (results.length) setCachedEval(fen, results, multiPV);
        resolve(results);
      }, 3000);
      const handler = (e) => {
        const line = typeof e.data === 'string' ? e.data : '';
        lastEngineResponse = Date.now();
        if (line.startsWith('bestmove') && !gotBestmove) {
          gotBestmove = true;
          clearTimeout(timeout);
          sfWorker.removeEventListener('message', handler);
          activeQueryHandler = null;
          const best = line.split(/\s+/)[1];
          if (best && best.length >= 4 && !moves[1]) moves[1] = { move: best.slice(0, 4), cp: null };
          const results = Object.entries(moves).sort((a, b) => a[0] - b[0]).map(e => e[1]);
          if (results.length) setCachedEval(fen, results, multiPV);
          resolve(results);
          return;
        }
        const pvMatch = line.match(/multipv\s+(\d+).*?\bpv\s+(\S+)/);
        if (pvMatch) {
          const pvIdx = parseInt(pvMatch[1]);
          const mv = pvMatch[2];
          if (mv.length >= 4) {
            const scoreMatch = line.match(/score\s+(cp\s+[-\d]+|mate\s+[-\d]+)/);
            let cp = null;
            if (scoreMatch) {
              const parts = scoreMatch[1].split(/\s+/);
              cp = parts[0] === 'mate' ? (parseInt(parts[1]) > 0 ? 99999 : -99999) : parseInt(parts[1]);
            }
            moves[pvIdx] = { move: mv.slice(0, 4), cp };
          }
        }
      };
      activeQueryHandler = handler;
      sfWorker.addEventListener('message', handler);
      uciSend('position fen ' + fen);
      uciSend('go depth ' + depth);
    });
  }

  async function fetchRemote(fen) {
    if (!sfReady) await initEngine();
    const key = boardKey(fen);
    const played = positionMoves.get(key) || [];
    const top = await queryLocal(fen, ENGINE_DEPTH, 1);
    if (!top.length) return null;
    const topCount = played.filter(m => m === top[0].move).length;
    if (topCount < REPEAT_THRESHOLD) return top[0];
    const candidates = await queryLocal(fen, ENGINE_DEPTH, 3);
    if (!candidates.length) return top[0];
    let best = candidates[0], bestCount = Infinity;
    for (const c of candidates) {
      const count = played.filter(m => m === c.move).length;
      if (count < REPEAT_THRESHOLD) return c;
      if (count < bestCount) { best = c; bestCount = count; }
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

  initEngine();

  function clickSquare(sq) {
    const b = getBoard(); if (!b) return;
    const rect = b.getBoundingClientRect();
    const sqSize = rect.width / 8;
    const file = sq.charCodeAt(0) - 97;
    const rank = parseInt(sq[1]);
    const flipped = isFlipped();
    const x = flipped
      ? rect.left + (7 - file) * sqSize + sqSize / 2
      : rect.left + file * sqSize + sqSize / 2;
    const y = flipped
      ? rect.top + (rank - 1) * sqSize + sqSize / 2
      : rect.top + (8 - rank) * sqSize + sqSize / 2;
    for (const type of ['pointerdown', 'pointerup', 'click']) {
      const Cls = type === 'click' ? MouseEvent : PointerEvent;
      b.dispatchEvent(new Cls(type, {
        bubbles: true, cancelable: true, view: window,
        clientX: x, clientY: y, button: 0,
        buttons: type === 'pointerdown' ? 1 : 0,
        pointerId: 1, isPrimary: true, pointerType: 'touch'
      }));
    }
  }

  function isPromotion(fen, from, to) {
    const rank = to[1];
    if (rank !== '8' && rank !== '1') return false;
    const rows = ((fen || '').split(' ')[0] || '').split('/');
    const file = from.charCodeAt(0) - 97;
    const rowIdx = 8 - parseInt(from[1]);
    if (rowIdx < 0 || rowIdx > 7) return false;
    const row = rows[rowIdx] || '';
    let col = 0;
    for (const ch of row) {
      if (ch >= '1' && ch <= '8') col += parseInt(ch);
      else { if (col === file) return ch === 'P' || ch === 'p'; col++; }
    }
    return false;
  }

  async function makeMove(move) {
    if (!move || move.length < 4) return;
    const from = move.slice(0,2), to = move.slice(2,4);
    const fenBefore = getFEN();
    const needsPromo = isPromotion(fenBefore, from, to);
    const promoChar = move.length > 4 ? move[4] : 'q';

    for (let attempt = 0; attempt < 3; attempt++) {
      clickSquare(from);
      await new Promise(r => setTimeout(r, 250 + attempt * 150));
      clickSquare(to);
      await new Promise(r => setTimeout(r, 350));
      if (needsPromo) {
        const color = getMyColor() || 'w';
        for (let pi = 0; pi < 8; pi++) {
          const promoWin = document.querySelector('.promotion-window, .promotion-area, [class*="promotion"]');
          if (!promoWin) { await new Promise(r => setTimeout(r, 200)); continue; }
          const el = promoWin.querySelector(`.${color}${promoChar}, [class*="${color}${promoChar}"], [data-piece="${promoChar}"], [data-piece="${color}${promoChar}"]`)
            || promoWin.querySelector(`[class*="${promoChar}"]`)
            || promoWin.querySelector('[class*="queen"], [data-piece="q"], [data-piece="wq"], [data-piece="bq"]')
            || promoWin.children[0];
          if (el) {
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            for (const type of ['pointerdown', 'pointerup', 'click']) {
              const Cls = type === 'click' ? MouseEvent : PointerEvent;
              el.dispatchEvent(new Cls(type, { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, button: 0, buttons: type === 'pointerdown' ? 1 : 0, pointerId: 1, isPrimary: true, pointerType: 'touch' }));
            }
            break;
          }
          await new Promise(r => setTimeout(r, 200));
        }
        await new Promise(r => setTimeout(r, 350));
      }
      if (getFEN() !== fenBefore) break;
    }
  }

  function clearArrows() {
    drawing = true;
    const b = getBoard();
    try { if (b?.game?.markings?.removeAll) b.game.markings.removeAll(); } catch {}
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
    const b = getBoard(); if (!b || !move) return;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    const rect = b.getBoundingClientRect();
    const sqSize = rect.width / 8;
    const flipped = isFlipped();
    if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
    for (const sq of [from, to]) {
      const file = sq.charCodeAt(0) - 97;
      const rank = parseInt(sq[1]);
      const px = flipped ? (7 - file) * sqSize : file * sqSize;
      const py = flipped ? (rank - 1) * sqSize : (8 - rank) * sqSize;
      const overlay = document.createElement('div');
      overlay.className = 'ch-shade-overlay';
      overlay.style.cssText = `left:${px}px;top:${py}px;width:${sqSize}px;height:${sqSize}px;background:rgba(0,0,0,0.07);`;
      b.appendChild(overlay);
    }
  }

  function squareToPct(sq, flipped) {
    const file = sq.charCodeAt(0) - 97;
    const rank = +sq[1];
    if (flipped) return { x: (7 - file) * 12.5 + 6.25, y: (rank - 1) * 12.5 + 6.25 };
    return { x: file * 12.5 + 6.25, y: (8 - rank) * 12.5 + 6.25 };
  }

  function drawArrowSVG(b, move, color, opacity, cssClass, zIndex) {
    drawing = true;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    const flipped = isFlipped();
    const s = squareToPct(from, flipped);
    const e = squareToPct(to, flipped);
    const dx = e.x - s.x, dy = e.y - s.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.5) { drawing = false; return; }
    const ux = dx / len, uy = dy / len;
    const headLen = 4.5, headW = 3.5, bodyW = 1.4;
    const tipX = e.x - ux * 1, tipY = e.y - uy * 1;
    const baseX = s.x + ux * 1, baseY = s.y + uy * 1;
    const neckX = tipX - ux * headLen, neckY = tipY - uy * headLen;
    const nx = -uy, ny = ux;
    const pts = [
      [baseX + nx * bodyW, baseY + ny * bodyW],
      [neckX + nx * bodyW, neckY + ny * bodyW],
      [neckX + nx * headW, neckY + ny * headW],
      [tipX, tipY],
      [neckX - nx * headW, neckY - ny * headW],
      [neckX - nx * bodyW, neckY - ny * bodyW],
      [baseX - nx * bodyW, baseY - ny * bodyW],
    ];
    let svg = b.querySelector('.' + cssClass);
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.classList.add(cssClass);
      svg.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:${zIndex};`;
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      b.appendChild(svg);
    } else { svg.innerHTML = ''; }
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' '));
    poly.setAttribute('fill', color);
    poly.setAttribute('opacity', opacity);
    svg.appendChild(poly);
    drawing = false;
  }

  function drawNativeArrow(move) {
    clearArrows();
    const b = getBoard(); if (!b || !move) return;
    const from = move.slice(0, 2), to = move.slice(2, 4);
    try {
      if (b.game?.markings?.addMany) {
        drawing = true;
        b.game.markings.addMany([{ data: { from, to, color: '#96bc4b', opacity: 0.8 }, type: 'arrow' }]);
        drawing = false;
        return;
      }
    } catch { drawing = false; }
    drawArrowSVG(b, move, '#96bc4b', '0.8', 'ch-arrow-svg', 1000);
  }

  function clearOpponentArrow() {
    drawing = true;
    document.querySelectorAll('.ch-opponent-svg').forEach(e => e.remove());
    drawing = false;
  }

  function drawOpponentArrow(move) {
    clearOpponentArrow();
    const b = getBoard(); if (!b || !move) return;
    drawArrowSVG(b, move, '#e04040', '0.8', 'ch-opponent-svg', 1002);
  }

  function cpToWinPct(cp) {
    if (cp === null || cp === undefined) return 50;
    return Math.round(100 / (1 + Math.exp(-0.00368208 * cp)));
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
  let oppAbort = null;
  async function tick() {
    if (!window.chessHelper.autoPlay && !window.chessHelper.showArrow && !window.chessHelper.hiddenArrow && !window.chessHelper.showOpponent && !window.chessHelper.showEval && !window.chessHelper.detection) return;
    if (!inActiveGame()) return;
    if (window.chessHelper.detection) syncDetectionGame();
    const myTurn = isMyTurn();
    if (myTurn === null) return;
    if (!myTurn) {
      if (processingOpp) return;
      waitingForOpponent = false;
      lastFen = '';
      const fen = getFEN();
      if (fen && fen === lastOppFen && lastOppMove && !window.chessHelper.detection) return;
      processingOpp = true;
      clearArrows();
      clearShading();
      if (fen) {
        const abortCtrl = { aborted: false };
        oppAbort = abortCtrl;
        try {
          const candidates = await queryLocal(fen, ENGINE_DEPTH, 1);
          if (abortCtrl.aborted) return;
          const om = candidates.length ? candidates[0].move : null;
          if (candidates.length && candidates[0].cp !== null) {
            if (detection.lastMyEvalCp !== null && candidates[0].cp !== null && detection.lastMyEvalFen && detection.lastMyEvalFen !== fen) {
              const rawMyCpl = detection.lastMyEvalCp + candidates[0].cp;
              const myCpl = Number.isFinite(rawMyCpl) ? Math.min(500, Math.max(0, rawMyCpl)) : 500;
              moveLog.push({ color: getMyColor(), cpl: myCpl });
              recalcDetection();
              detection.lastMyEvalCp = null; detection.lastMyEvalFen = null;
            }
            detection.lastOppEvalCp = candidates[0].cp;
            detection.lastOppEvalFen = fen;
            saveDetectionState();
            if (window.chessHelper.showEval) updateEval(-candidates[0].cp, getMyColor());
          }
          lastOppFen = fen;
          lastOppMove = om;
          if (window.chessHelper.showOpponent && om) drawOpponentArrow(om);
          else clearOpponentArrow();
        } catch (e) { console.warn('[Chess Assist] tick error (opp):', e); } finally { processingOpp = false; oppAbort = null; }
      } else { clearOpponentArrow(); processingOpp = false; }
      return;
    }
    if (processingOpp && oppAbort) { oppAbort.aborted = true; processingOpp = false; oppAbort = null; }
    if (processingMy) return;
    lastOppFen = ''; lastOppMove = null;
    const fen = getFEN(); if (!fen) return;
    if (fen === lastFen) return;
    if (waitingForOpponent && fen !== lastMovedFen) waitingForOpponent = false;
    if (window.chessHelper.autoPlay && fen === lastMovedFen) return;

    processingMy = true;
    try {
      thinkingEl.classList.add('active');
      const result = await fetchRemote(fen);
      thinkingEl.classList.remove('active');
      if (!result) return;
      const mv = result.move;
      updateEval(result.cp, getMyColor());
      if (detection.lastOppEvalCp !== null && result.cp != null && detection.lastOppEvalFen && detection.lastOppEvalFen !== fen) {
        const rawCpl = detection.lastOppEvalCp + result.cp;
        const cpl = Number.isFinite(rawCpl) ? Math.min(500, Math.max(0, rawCpl)) : 500;
        const oppColor = getMyColor() === 'w' ? 'b' : 'w';
        moveLog.push({ color: oppColor, cpl });
        recalcDetection();
        detection.lastOppEvalCp = null;
        detection.lastOppEvalFen = null;
      }
      if (result.cp !== null) { detection.lastMyEvalCp = result.cp; detection.lastMyEvalFen = fen; saveDetectionState(); }
      lastFen = fen;
      if (window.chessHelper.hiddenArrow) { drawShading(mv); clearArrows(); }
      else if (window.chessHelper.showArrow) { drawNativeArrow(mv); clearShading(); }
      if (window.chessHelper.showOpponent) {
        const om = await queryOpponentBest(fen);
        if (om) drawOpponentArrow(om);
        else clearOpponentArrow();
      } else clearOpponentArrow();
      if (window.chessHelper.autoPlay) {
        if (DELAY_ENABLED) {
          const delay = (DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN)) * 1000;
          await new Promise(r => setTimeout(r, delay));
          if (!window.chessHelper.autoPlay) return;
        }
        recordMove(fen, mv);
        await makeMove(mv);
        const fenAfter = getFEN();
        if (fenAfter !== fen) { lastMovedFen = fenAfter; waitingForOpponent = true; }
        else lastFen = '';
      }
    } catch (e) {
      console.warn('[Chess Assist] tick error (my):', e);
      lastFen = '';
      if (window.chessHelper.autoPlay) { lastMovedFen = ''; waitingForOpponent = false; }
    } finally { processingMy = false; thinkingEl.classList.remove('active'); }
  }

  const obs = new MutationObserver(() => { if (!drawing && (window.chessHelper.autoPlay || window.chessHelper.showArrow || window.chessHelper.hiddenArrow || window.chessHelper.showOpponent || window.chessHelper.showEval || window.chessHelper.detection)) tick(); });
  let lastObservedBoard = null;
  function watch() {
    const b = getBoard();
    if (b && b !== lastObservedBoard) {
      lastObservedBoard = b;
      obs.disconnect();
      obs.observe(b, { childList:true, subtree:true, attributes:true });
    }
    if (!b) setTimeout(watch, 1000);
  }
  watch();
  setInterval(() => { watch(); tick(); }, 600);
  window.addEventListener('pagehide', saveDetectionState);

  const root = document.createElement('div'); root.id = 'chess-helper-root';
  const bubble = document.createElement('div'); bubble.id = 'chess-helper-bubble';
  bubble.innerHTML = `<img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png" draggable="false">`;
  const panel = document.createElement('div'); panel.id = 'chess-helper-panel';
  panel.innerHTML = `
    <div class="ch-header">
      <div class="ch-title">Chess Assist</div>
      <button class="ch-close" id="ch-close">&times;</button>
    </div>
    <div class="ch-tabs">
      <button class="ch-tab active" data-tab="gameplay">Gameplay</button>
      <button class="ch-tab" data-tab="detection">Detection</button>
      <button class="ch-tab" data-tab="skins">Skins</button>
    </div>
    <div class="ch-tab-content active" id="ch-tab-gameplay">
    <div class="ch-thinking" id="ch-thinking">Thinking...</div>
    <div>
      <div class="ch-depth-row">
        <span class="ch-depth-label">Depth</span>
        <span class="ch-info" data-tip="depth">i</span>
        <input type="range" class="ch-range" id="ch-depth" min="1" max="24" value="16">
        <span class="ch-depth-val" id="ch-depth-val">16</span>
      </div>
      <div class="ch-tooltip" id="tip-depth">How many moves ahead the engine calculates. Higher = stronger but slower. 16 is a good balance. Below 10 is fast but weaker, above 20 is very slow.</div>
    </div>
    <div>
      <div class="ch-row">
        <span class="ch-label">Show best move</span>
        <span class="ch-info" data-tip="arrow">i</span>
        <label class="ch-switch"><input type="checkbox" id="ch-arrow"><span class="ch-slider"></span></label>
      </div>
      <div class="ch-tooltip" id="tip-arrow">Draws a green arrow on the board showing the best move the engine found.</div>
    </div>
    <div>
      <div class="ch-row">
        <span class="ch-label">Hidden arrows</span>
        <span class="ch-info" data-tip="hidden">i</span>
        <label class="ch-switch"><input type="checkbox" id="ch-hidden"><span class="ch-slider"></span></label>
      </div>
      <div class="ch-tooltip" id="tip-hidden">Instead of a visible arrow, subtly darkens the piece square and target square. Hard to notice unless you know what to look for. Overrides the green arrow when both are on.</div>
    </div>
    <div>
      <div class="ch-row">
        <span class="ch-label">Auto-play</span>
        <span class="ch-info" data-tip="auto">i</span>
        <label class="ch-switch"><input type="checkbox" id="ch-auto"><span class="ch-slider"></span></label>
      </div>
      <div class="ch-tooltip" id="tip-auto">Automatically plays the best move for you when it's your turn. Uses anti-repetition to avoid repeating the same moves.</div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label">Move delay</span><span class="ch-info" data-tip="delay">i</span><label class="ch-switch"><input type="checkbox" id="ch-delay-toggle"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-delay">Random delay before auto-play makes a move, so it looks like a human thinking. Set a min and max range in seconds. Off by default — the engine moves as soon as it finishes calculating.</div>
      <div id="ch-delay-sliders" style="display:none">
        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label">Min</span><input type="range" class="ch-range" id="ch-delay-min" min="0" max="15" value="1" step="0.5"><span class="ch-depth-val" id="ch-delay-min-val">1s</span></div>
        <div class="ch-depth-row" style="margin-top:4px"><span class="ch-depth-label">Max</span><input type="range" class="ch-range" id="ch-delay-max" min="0" max="15" value="5" step="0.5"><span class="ch-depth-val" id="ch-delay-max-val">5s</span></div>
      </div>
    </div>
    <div>
      <div class="ch-row">
        <span class="ch-label">Opponent's best</span>
        <span class="ch-info" data-tip="opponent">i</span>
        <label class="ch-switch"><input type="checkbox" id="ch-opponent"><span class="ch-slider"></span></label>
      </div>
      <div class="ch-tooltip" id="tip-opponent">Shows a red arrow for the opponent's best reply to the current position. Helps you anticipate what they'll play next.</div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label">Win percent</span><span class="ch-info" data-tip="eval">i</span><label class="ch-switch"><input type="checkbox" id="ch-eval"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-eval">Shows a live win probability bar next to the panel. Updates every position using Stockfish's centipawn evaluation.</div>
    </div>
    <button class="ch-btn ch-btn-primary" id="ch-analyze">Analyze once</button>
    </div>
    <div class="ch-tab-content" id="ch-tab-detection">
      <div style="display:flex;gap:4px;justify-content:center;padding:4px 0 6px;">
        <button id="ch-det-black" class="ch-det-target active" style="flex:1;padding:5px 0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:var(--ch-accent);color:#fff;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;">Black</button>
        <button id="ch-det-white" class="ch-det-target" style="flex:1;padding:5px 0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;">White</button>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label">Moves analyzed <span class="ch-info" data-tip="det-moves">i</span></span><span class="ch-detect-value" id="ch-det-moves">0</span></div>
        <div class="ch-tooltip" id="tip-det-moves">Number of moves tracked so far. More moves = more reliable stats. At least 10 moves recommended for accurate results.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label">Avg CPL <span class="ch-info" data-tip="det-acpl">i</span></span><span class="ch-detect-value" id="ch-det-acpl">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-acpl">Average Centipawn Loss — how many centipawns the opponent loses per move. Lower = stronger play. Engines typically have ACPL under 10, humans 30–100+ depending on rating.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label">Best move rate <span class="ch-info" data-tip="det-bmr">i</span></span><span class="ch-detect-value" id="ch-det-bmr">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-bmr">How often the opponent plays the engine's top choice (within 5 centipawns). Engines hit 80%+, most humans 30–60% depending on ELO.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label">Accuracy <span class="ch-info" data-tip="det-acc">i</span></span><span class="ch-detect-value" id="ch-det-acc">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-acc">Lichess-style accuracy score derived from ACPL. 90%+ is very strong, 95%+ at low ELO is suspicious. Compared against expected accuracy for the opponent's rating.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label">Suspicion <span class="ch-info" data-tip="det-score">i</span></span><span class="ch-detect-value" id="ch-det-score">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-score">Multi-factor suspicion score adjusted for the opponent's ELO. Combines ACPL ratio, best-move rate gap, zero-blunder bonus, and accuracy gap vs expected stats for their rating.</div>
      </div>
      <div class="ch-detect-gauge"><div class="ch-detect-fill" id="ch-det-fill"></div></div>
      <div class="ch-detect-verdict" id="ch-det-verdict">Play a game to start detection</div>
      <div style="display:flex;gap:6px;margin-top:4px;">
        <button class="ch-detect-reset" id="ch-det-reset" style="flex:1;">Reset stats</button>
      </div>
    </div>
    <div class="ch-tab-content" id="ch-tab-skins">
      <div style="font-size:11px;color:rgba(255,255,255,0.4);text-align:center;padding:2px 0 4px;font-style:italic;">Tap a tile to upload a custom image</div>
      <div class="ch-skins-grid" id="ch-skins-grid">
        <div class="ch-skins-row-label">White</div>
        <div class="ch-skin-tile" data-skin="wk"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wq"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wr"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wb"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wn"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wp"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skins-row-label">Black</div>
        <div class="ch-skin-tile" data-skin="bk"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bq"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="br"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bb"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bn"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bp"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skins-row-label">Board</div>
        <div class="ch-skin-tile" data-skin="board" style="grid-column:2/6;aspect-ratio:4/1;"><span class="ch-skin-label" style="font-size:11px;">Board BG</span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skins-row-label">Tiles</div>
        <div class="ch-skin-tile wide" data-skin="lightTiles"><span class="ch-skin-label" style="font-size:11px;">Light tiles</span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile wide" data-skin="darkTiles"><span class="ch-skin-label" style="font-size:11px;">Dark tiles</span><button class="ch-skin-remove">&times;</button></div>
      </div>
      <div>
        <div class="ch-row"><span class="ch-label">Piece mask</span><span class="ch-info" data-tip="mask">i</span><label class="ch-switch"><input type="checkbox" id="ch-skin-mask"><span class="ch-slider"></span></label></div>
        <div class="ch-tooltip" id="tip-mask">Pieces: uses the original piece shape as a mask filled with your custom image. Tiles: each square gets the image individually instead of one large image showing through.</div>
      </div>
      <button class="ch-detect-reset" id="ch-skins-reset">Reset all skins</button>
    </div>
    <div style="text-align:center;padding:8px 0 2px;font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:0.3px;">made by <a href="https://github.com/ThatKidGlitchy/chess-hacks" target="_blank" style="color:rgba(255,255,255,0.35);text-decoration:underline;">ThatKidGlitchy</a></div>
  `;
  const wrap = document.createElement('div'); wrap.id = 'chess-helper-wrap';
  const evalBar = document.createElement('div'); evalBar.id = 'ch-eval-bar';
  evalBar.innerHTML = `<div id="ch-eval-pct-top" class="ch-eval-pct">50%</div><div id="ch-eval-white"></div><div id="ch-eval-pct-bot" class="ch-eval-pct">50%</div>`;
  evalBar.style.display = 'none';
  wrap.append(panel, evalBar);
  root.append(bubble, wrap); document.body.appendChild(root);

  const thinkingEl = panel.querySelector('#ch-thinking');

  panel.querySelectorAll('.ch-info[data-tip]').forEach(el => {
    el.ontouchend = el.onclick = (ev) => { ev.preventDefault(); const tip = panel.querySelector('#tip-' + el.dataset.tip); if (tip) tip.classList.toggle('show'); };
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

  const SKIN_CODES = ['wk','wq','wr','wb','wn','wp','bk','bq','br','bb','bn','bp','board','lightTiles','darkTiles'];
  let savedSkins = {};
  try { savedSkins = JSON.parse(localStorage.getItem('ch-skins') || '{}'); } catch {}
  let skinMaskMode = localStorage.getItem('ch-skin-mask') === '1';
  const skinStyleEl = document.createElement('style'); skinStyleEl.id = 'ch-custom-skins'; document.head.appendChild(skinStyleEl);

  function getOriginalPieceUrl(code) {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--theme-piece-set-' + code);
    if (v) { const m = v.match(/url\(["']?(.*?)["']?\)/); if (m) return m[1]; }
    const el = document.querySelector('.piece.' + code);
    if (el) { const bg = getComputedStyle(el).backgroundImage; const m = bg.match(/url\(["']?(.*?)["']?\)/); if (m) return m[1]; }
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
  function skinEnforceLoop() {
    if (!skinLoopRunning) return;
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
    requestAnimationFrame(skinEnforceLoop);
  }
  function startSkinLoop() {
    if (!skinLoopRunning) { skinLoopRunning = true; requestAnimationFrame(skinEnforceLoop); }
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
      css += `.board,#board-vs-personalities,#board-single,#board-board,.fade-in-overlay{background-image:url("${savedSkins.board}")!important;background-size:cover!important;background-position:center!important}\n`;
    }
    skinStyleEl.textContent = css;
    const board = getBoard();
    if (board) {
      if (savedSkins.board) {
        board.style.setProperty('background-image', `url("${savedSkins.board}")`, 'important');
        board.style.setProperty('background-size', 'cover', 'important');
        board.style.setProperty('background-position', 'center', 'important');
      } else {
        board.style.removeProperty('background-image');
        board.style.removeProperty('background-size');
        board.style.removeProperty('background-position');
      }
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
      const grad = light
        ? 'repeating-conic-gradient(#fff 0% 25%,transparent 0% 50%)'
        : 'repeating-conic-gradient(transparent 0% 25%,#fff 0% 50%)';
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
      if (savedSkins[code]) { tile.style.backgroundImage = `url("${savedSkins[code]}")`; tile.classList.add('has-skin'); }
      else { tile.style.backgroundImage = ''; tile.classList.remove('has-skin'); }
    });
  }

  const skinInput = document.createElement('input'); skinInput.type = 'file'; skinInput.accept = 'image/*'; skinInput.hidden = true;
  document.body.appendChild(skinInput);
  let activeSkinCode = null;

  panel.querySelector('#ch-skins-grid').addEventListener('click', e => {
    const rm = e.target.closest('.ch-skin-remove');
    const tile = e.target.closest('.ch-skin-tile');
    if (!tile) return;
    if (rm) { delete savedSkins[tile.dataset.skin]; try { localStorage.setItem('ch-skins', JSON.stringify(savedSkins)); } catch {} renderSkinTiles(); applySkins(); return; }
    activeSkinCode = tile.dataset.skin;
    skinInput.click();
  });

  skinInput.onchange = () => {
    const file = skinInput.files[0];
    if (!file || !activeSkinCode) return;
    const reader = new FileReader();
    reader.onload = ev => {
      savedSkins[activeSkinCode] = ev.target.result;
      try { localStorage.setItem('ch-skins', JSON.stringify(savedSkins)); } catch (err) { console.warn('Skin storage full:', err); }
      renderSkinTiles(); applySkins();
    };
    reader.readAsDataURL(file);
    skinInput.value = '';
  };

  panel.querySelector('#ch-skins-reset').onclick = () => { savedSkins = {}; try { localStorage.setItem('ch-skins', '{}'); } catch {} renderSkinTiles(); applySkins(); };
  const maskToggle = panel.querySelector('#ch-skin-mask');
  maskToggle.checked = skinMaskMode;
  maskToggle.onchange = () => { skinMaskMode = maskToggle.checked; localStorage.setItem('ch-skin-mask', skinMaskMode ? '1' : '0'); applySkins(); };
  renderSkinTiles(); applySkins();

  let bx = window.innerWidth - 64, by = window.innerHeight * 0.4;
  let bDrag = false, bMoved = false, bsx = 0, bsy = 0;
  function setBubblePos() { bubble.style.transform = `translate3d(${bx}px,${by}px,0)`; }
  setBubblePos();

  function bStart(cx, cy) { bDrag = true; bMoved = false; bsx = cx - bx; bsy = cy - by; }
  function bMove(cx, cy) { if (!bDrag) return; bMoved = true; bx = Math.max(0, Math.min(cx - bsx, innerWidth - 48)); by = Math.max(0, Math.min(cy - bsy, innerHeight - 48)); setBubblePos(); }
  function bEnd() { if (!bDrag) return; bDrag = false; if (!bMoved) { wrap.classList.toggle('visible'); positionPanel(); } }

  bubble.addEventListener('touchstart', (e) => { e.preventDefault(); const t = e.touches[0]; bStart(t.clientX, t.clientY); }, { passive: false });
  document.addEventListener('touchmove', (e) => { if (bDrag) { e.preventDefault(); const t = e.touches[0]; bMove(t.clientX, t.clientY); } }, { passive: false });
  document.addEventListener('touchend', bEnd);
  bubble.addEventListener('mousedown', (e) => { bStart(e.clientX, e.clientY); });
  document.addEventListener('mousemove', (e) => { bMove(e.clientX, e.clientY); });
  document.addEventListener('mouseup', bEnd);

  let ppx = -1, ppy = -1, pDrag = false, psx = 0, psy = 0;
  function positionPanel() {
    if (ppx < 0) {
      const pw = Math.min(270, innerWidth * 0.85);
      ppx = Math.max(8, Math.min(bx - pw - 8, innerWidth - pw - 8));
      if (ppx < 8) ppx = Math.max(8, (innerWidth - pw) / 2);
      ppy = Math.max(8, Math.min(by, innerHeight - 340));
    }
    ppx = Math.max(0, Math.min(ppx, innerWidth - 100));
    ppy = Math.max(0, Math.min(ppy, innerHeight - 50));
    wrap.style.left = ppx + 'px'; wrap.style.top = ppy + 'px';
  }

  const header = panel.querySelector('.ch-header');
  header.addEventListener('touchstart', (e) => { const t = e.touches[0]; pDrag = true; psx = t.clientX - ppx; psy = t.clientY - ppy; }, { passive: true });
  document.addEventListener('touchmove', (e) => { if (pDrag) { const t = e.touches[0]; ppx = t.clientX - psx; ppy = t.clientY - psy; positionPanel(); } }, { passive: true });
  document.addEventListener('touchend', () => { pDrag = false; });
  header.addEventListener('mousedown', (e) => { pDrag = true; psx = e.clientX - ppx; psy = e.clientY - ppy; e.preventDefault(); });
  document.addEventListener('mousemove', (e) => { if (pDrag) { ppx = e.clientX - psx; ppy = e.clientY - psy; positionPanel(); } });
  document.addEventListener('mouseup', () => { pDrag = false; });

  panel.querySelector('#ch-close').onclick = () => wrap.classList.remove('visible');

  panel.querySelector('#ch-depth').oninput = (e) => {
    ENGINE_DEPTH = parseInt(e.target.value);
    panel.querySelector('#ch-depth-val').textContent = ENGINE_DEPTH;
    saveSettings();
  };
  panel.querySelector('#ch-delay-toggle').onchange = (e) => {
    DELAY_ENABLED = e.target.checked;
    panel.querySelector('#ch-delay-sliders').style.display = e.target.checked ? '' : 'none';
    saveSettings();
  };
  panel.querySelector('#ch-delay-min').oninput = (e) => {
    DELAY_MIN = parseFloat(e.target.value);
    if (DELAY_MIN > DELAY_MAX) { DELAY_MAX = DELAY_MIN; panel.querySelector('#ch-delay-max').value = DELAY_MAX; panel.querySelector('#ch-delay-max-val').textContent = DELAY_MAX + 's'; }
    panel.querySelector('#ch-delay-min-val').textContent = DELAY_MIN + 's';
    saveSettings();
  };
  panel.querySelector('#ch-delay-max').oninput = (e) => {
    DELAY_MAX = parseFloat(e.target.value);
    if (DELAY_MAX < DELAY_MIN) { DELAY_MIN = DELAY_MAX; panel.querySelector('#ch-delay-min').value = DELAY_MIN; panel.querySelector('#ch-delay-min-val').textContent = DELAY_MIN + 's'; }
    panel.querySelector('#ch-delay-max-val').textContent = DELAY_MAX + 's';
    saveSettings();
  };
  panel.querySelector('#ch-arrow').onchange = (e) => {
    window.chessHelper.showArrow = e.target.checked;
    if (!e.target.checked) clearArrows(); else { lastFen = ''; tick(); }
    saveSettings();
  };
  panel.querySelector('#ch-hidden').onchange = (e) => {
    window.chessHelper.hiddenArrow = e.target.checked;
    if (!e.target.checked) clearShading(); else { lastFen = ''; tick(); }
    saveSettings();
  };
  panel.querySelector('#ch-auto').onchange = (e) => {
    window.chessHelper.autoPlay = e.target.checked;
    if (e.target.checked) { lastFen = ''; lastMovedFen = ''; waitingForOpponent = false; tick(); for (let i = 1; i <= 5; i++) setTimeout(tick, i * 1000); }
    saveSettings();
  };
  panel.querySelector('#ch-analyze').onclick = async () => {
    const btn = panel.querySelector('#ch-analyze');
    btn.textContent = 'Analyzing...';
    thinkingEl.classList.add('active');
    if (!inActiveGame()) { btn.textContent = 'No Game'; thinkingEl.classList.remove('active'); setTimeout(() => btn.textContent = 'Analyze once', 1500); return; }
    let fen = getFEN();
    if (!fen) { btn.textContent = 'No Game'; thinkingEl.classList.remove('active'); setTimeout(() => btn.textContent = 'Analyze once', 1500); return; }
    try {
      if (!isMyTurn()) {
        const candidates = await queryLocal(fen, ENGINE_DEPTH, 1);
        const om = candidates.length ? candidates[0].move : null;
        thinkingEl.classList.remove('active');
        if (om) { drawOpponentArrow(om); btn.textContent = `Opp: ${om.toUpperCase()}`; }
        else btn.textContent = 'No result';
        setTimeout(() => btn.textContent = 'Analyze once', 2500);
        return;
      }
      const result = await fetchRemote(fen);
      thinkingEl.classList.remove('active');
      if (result) {
        updateEval(result.cp, getMyColor());
        if (window.chessHelper.hiddenArrow) { drawShading(result.move); clearArrows(); }
        else { drawNativeArrow(result.move); }
        btn.textContent = `Best: ${result.move.toUpperCase()}`;
      }
      else btn.textContent = 'No result';
      setTimeout(() => btn.textContent = 'Analyze once', 2500);
    } catch(e) {
      thinkingEl.classList.remove('active');
      btn.textContent = 'Error';
      setTimeout(() => btn.textContent = 'Analyze once', 2000);
    }
  };
  panel.querySelector('#ch-opponent').onchange = (e) => {
    window.chessHelper.showOpponent = e.target.checked;
    if (!e.target.checked) clearOpponentArrow();
    else { lastFen = ''; tick(); }
    saveSettings();
  };
  panel.querySelector('#ch-eval').onchange = (e) => {
    window.chessHelper.showEval = e.target.checked;
    evalBar.style.display = e.target.checked ? '' : 'none';
    if (e.target.checked) { lastFen = ''; lastOppFen = ''; tick(); }
    saveSettings();
  };

  const saved = loadSettings();
  if (saved) {
    if (saved.toggles) {
      Object.assign(window.chessHelper, saved.toggles);
      const tmap = { showArrow: '#ch-arrow', hiddenArrow: '#ch-hidden', autoPlay: '#ch-auto', showOpponent: '#ch-opponent', showEval: '#ch-eval' };
      for (const [k, sel] of Object.entries(tmap)) {
        const cb = panel.querySelector(sel);
        if (cb) cb.checked = !!saved.toggles[k];
      }
      if (saved.toggles.showEval) evalBar.style.display = '';
    }
    if (typeof saved.depth === 'number') {
      ENGINE_DEPTH = saved.depth;
      const ds = panel.querySelector('#ch-depth'); if (ds) ds.value = ENGINE_DEPTH;
      const dv = panel.querySelector('#ch-depth-val'); if (dv) dv.textContent = ENGINE_DEPTH;
    }
    if (typeof saved.delayEnabled === 'boolean') {
      DELAY_ENABLED = saved.delayEnabled;
      const dt = panel.querySelector('#ch-delay-toggle'); if (dt) dt.checked = DELAY_ENABLED;
      const dsl = panel.querySelector('#ch-delay-sliders'); if (dsl) dsl.style.display = DELAY_ENABLED ? '' : 'none';
    }
    if (typeof saved.delayMin === 'number') { DELAY_MIN = saved.delayMin; const s = panel.querySelector('#ch-delay-min'); if (s) s.value = DELAY_MIN; const v = panel.querySelector('#ch-delay-min-val'); if (v) v.textContent = DELAY_MIN + 's'; }
    if (typeof saved.delayMax === 'number') { DELAY_MAX = saved.delayMax; const s = panel.querySelector('#ch-delay-max'); if (s) s.value = DELAY_MAX; const v = panel.querySelector('#ch-delay-max-val'); if (v) v.textContent = DELAY_MAX + 's'; }
    if (saved.detTarget === 'w') {
      detTarget = 'w';
      panel.querySelector('#ch-det-white').style.background = 'var(--ch-accent)';
      panel.querySelector('#ch-det-white').style.color = '#fff';
      panel.querySelector('#ch-det-black').style.background = 'rgba(255,255,255,0.06)';
      panel.querySelector('#ch-det-black').style.color = 'rgba(255,255,255,0.5)';
    }
  }

  console.log('chess helper (mobile) loaded');
})();
