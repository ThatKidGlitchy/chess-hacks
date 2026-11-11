// Chess Assist v1.4.4 — https://github.com/ThatKidGlitchy/chess-hacks
(() => {
  if (window.__chessHelper) return console.warn('already loaded');
  window.__chessHelper = true;
  if (!document.querySelector('link[data-ch-font]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
    fontLink.setAttribute('data-ch-font', '1');
    document.head.appendChild(fontLink);
  }
  const style = document.createElement('style');
  style.textContent = `
    :root { --ch-accent:#81b64c; --ch-accent-hover:#a3d160; --ch-bg:rgba(20,20,23,0.75); --ch-border:rgba(255,255,255,0.1); --ch-radius:20px; --ch-font:'Outfit',system-ui,sans-serif; }
    #chess-helper-root { position:fixed; left:0; top:0; width:0; height:0; overflow:visible; pointer-events:none !important; z-index:99999; font-family:var(--ch-font); }
    #chess-helper-bubble { position:fixed; width:52px; height:52px; background:var(--ch-bg); backdrop-filter:blur(20px); border:1px solid var(--ch-border); border-radius:50%; box-shadow:0 10px 40px -10px #0008; display:flex; align-items:center; justify-content:center; cursor:grab; color:#fff; pointer-events:auto; z-index:100000; user-select:none; transition:transform .2s; }
    #chess-helper-bubble:hover { transform:scale(1.1); }
    #chess-helper-bubble img { width:100%; height:100%; pointer-events:none; }
    #chess-helper-wrap { position:fixed; visibility:hidden; display:flex; align-items:stretch; gap:8px; opacity:0; transform:scale(0.9); transition:opacity .25s, transform .3s; pointer-events:none; }
    #chess-helper-wrap.visible { visibility:visible; opacity:1; transform:scale(1); pointer-events:auto; }
    #chess-helper-wrap:not(.visible), #chess-helper-wrap:not(.visible) * { pointer-events:none !important; }
    #chess-helper-panel { width:280px; background:rgba(18,18,20,0.85); backdrop-filter:blur(24px); border:1px solid var(--ch-border); border-radius:var(--ch-radius); padding:20px 20px 4px; display:flex; flex-direction:column; gap:14px; box-shadow:0 20px 60px #0009; pointer-events:auto; }
    #ch-eval-bar { width:32px; border-radius:14px; overflow:hidden; background:#000; box-shadow:0 10px 40px -10px #0008; position:relative; pointer-events:auto; min-height:200px; }
    #ch-eval-white { position:absolute; bottom:0; left:0; right:0; background:#fff; transition:height .6s ease; height:50%; }
    .ch-eval-pct { position:absolute; width:100%; text-align:center; font-size:10px; font-weight:700; font-family:var(--ch-font); z-index:2; left:0; }
    #ch-eval-pct-top { top:8px; color:#fff; text-shadow:0 0 4px #000, 0 0 4px #000; }
    #ch-eval-pct-bot { bottom:8px; color:#000; text-shadow:0 0 4px #fff, 0 0 4px #fff; }
    .ch-header { display:flex; justify-content:space-between; align-items:center; cursor:grab; user-select:none; }
    .ch-title { font-size:16px; font-weight:700; color:#fff; }
    .ch-close { width:24px; height:24px; border-radius:50%; border:none; background:rgba(255,255,255,0.08); color:#fff; font-size:16px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; }
    .ch-close:hover { background:rgba(255,255,255,0.18); }
    .ch-row { display:flex; justify-content:space-between; align-items:center; gap:6px; }
    .ch-label { font-size:13px; color:#fff; font-weight:500; flex:1; }
    .ch-switch { position:relative; width:44px; height:24px; flex-shrink:0; }
    .ch-switch input { opacity:0; width:0; height:0; }
    .ch-slider { position:absolute; cursor:pointer; inset:0; background:rgba(255,255,255,0.1); transition:.3s; border-radius:24px; }
    .ch-slider:before { content:""; position:absolute; height:18px; width:18px; left:3px; bottom:3px; background:#e4e4e7; transition:.3s; border-radius:50%; }
    input:checked + .ch-slider { background:var(--ch-accent); }
    input:checked + .ch-slider:before { transform:translateX(20px); background:#fff; }
    .ch-btn { padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); background:rgba(255,255,255,0.05); color:#fff; font-family:var(--ch-font); font-size:13px; font-weight:600; cursor:pointer; transition:.2s; }
    .ch-btn-primary { background:var(--ch-accent); color:#121212; border:none; }
    .ch-btn-primary:hover { background:var(--ch-accent-hover); }
    #ch-reset-binds:hover { background:rgba(255,255,255,0.12) !important; color:#fff !important; border-color:rgba(255,255,255,0.2) !important; }
    #ch-reset-binds:active { transform:scale(0.97); background:rgba(255,255,255,0.18) !important; transition:all .05s !important; }
    .ch-depth-row { display:flex; align-items:center; gap:10px; }
    .ch-depth-label { font-size:13px; color:#fff; font-weight:500; white-space:nowrap; }
    .ch-depth-val { font-size:13px; color:var(--ch-accent); font-weight:700; min-width:20px; text-align:center; }
    .ch-range { -webkit-appearance:none; appearance:none; flex:1; min-width:0; height:4px; background:rgba(255,255,255,0.15); border-radius:4px; outline:none; cursor:pointer; }
    .ch-range::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:var(--ch-accent); cursor:pointer; }
    .ch-range::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:var(--ch-accent); border:none; cursor:pointer; }
    .ch-shade-overlay { position:absolute; pointer-events:none; z-index:999; border-radius:2px; transition:opacity .2s; }
    .ch-keybind { font-size:11px; color:rgba(255,255,255,0.5); background:rgba(255,255,255,0.08); padding:2px 8px; border-radius:6px; font-family:var(--ch-font); font-weight:600; letter-spacing:0.5px; cursor:pointer; transition:.2s; }
    .ch-keybind:hover { color:#fff; background:rgba(255,255,255,0.15); }
    .ch-keybind.recording { color:var(--ch-accent); background:rgba(129,182,76,0.15); animation:ch-pulse 1s infinite; }
    @keyframes ch-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .ch-info { width:16px; height:16px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.3); color:rgba(255,255,255,0.4); font-size:10px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:.2s; font-style:italic; font-family:serif; line-height:1; }
    .ch-info:hover, .ch-info.active { border-color:var(--ch-accent); color:var(--ch-accent); }
    .ch-tooltip { display:none; background:rgba(10,10,12,0.95); border:1px solid var(--ch-border); border-radius:10px; padding:8px 12px; font-size:11px; color:rgba(255,255,255,0.7); line-height:1.5; margin-top:4px; }
    .ch-tooltip.show { display:block; }
    .ch-thinking { font-size:12px; color:var(--ch-accent); font-weight:600; text-align:center; animation:ch-pulse 1.2s infinite; display:none; }
    .ch-pager { display:flex; align-items:center; justify-content:center; gap:10px; padding:2px 0 4px; user-select:none; }
    .ch-pager-arrow { width:22px; height:22px; border-radius:50%; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); font-size:13px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; transition:.15s; }
    .ch-pager-arrow:hover { background:rgba(255,255,255,0.12); color:#fff; }
    .ch-pager-arrow:disabled { opacity:0.25; cursor:default; }
    .ch-pager-arrow:disabled:hover { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); }
    .ch-pager-dots { display:flex; gap:5px; }
    .ch-pager-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.2); cursor:pointer; transition:.15s; }
    .ch-pager-dot.active { background:var(--ch-accent); width:16px; border-radius:3px; }
    .ch-pager-count { font-size:11px; font-weight:600; color:rgba(255,255,255,0.5); font-variant-numeric:tabular-nums; min-width:28px; text-align:center; }
    .ch-gameplay-page, .ch-skins-page { display:none; flex-direction:column; gap:14px; font-family:var(--ch-font); }
    .ch-gameplay-page.active, .ch-skins-page.active { display:flex; }
    .ch-premade-tile { position:relative; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:8px 4px 6px; cursor:pointer; transition:.15s; display:flex; flex-direction:column; align-items:center; gap:4px; font-family:var(--ch-font); }
    .ch-premade-tile:hover { background:rgba(255,255,255,0.1); border-color:var(--ch-accent); }
    .ch-premade-tile.active { background:rgba(129,182,76,0.15); border-color:var(--ch-accent); }
    .ch-premade-tile img { width:40px; height:40px; pointer-events:none; }
    .ch-premade-tile .ch-premade-name { font-size:10px; color:rgba(255,255,255,0.7); text-align:center; line-height:1.2; word-break:break-word; font-family:var(--ch-font); }
    .ch-premade-empty { font-family:var(--ch-font); }
    .ch-section-head { font-size:10px; font-weight:700; color:rgba(255,255,255,0.4); letter-spacing:1.5px; text-transform:uppercase; padding:4px 0 2px; border-bottom:1px solid rgba(255,255,255,0.06); margin-bottom:2px; }
    .ch-section-head:not(:first-child) { margin-top:6px; }
    #ch-streamer-text { position:fixed; top:16px; left:50%; transform:translateX(-50%); display:none; padding:.45em 1em; border-radius:14px; background:var(--ch-bg); backdrop-filter:blur(20px); border:1px solid var(--ch-border); color:#fff; font-family:var(--ch-font); font-size:22px; font-weight:700; letter-spacing:0.5px; z-index:99998; white-space:nowrap; box-shadow:0 10px 40px -10px #0008; cursor:grab; touch-action:none; user-select:none; -webkit-user-select:none; pointer-events:auto !important; }
    #ch-streamer-text.show { display:block; }
    #ch-streamer-text:active { cursor:grabbing; }
    #ch-whatsnew-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:100010; display:none; align-items:center; justify-content:center; backdrop-filter:blur(4px); font-family:var(--ch-font); }
    #ch-whatsnew-backdrop.visible { display:flex; }
    #ch-whatsnew-modal { width:min(420px, 92vw); max-height:80vh; overflow-y:auto; background:rgba(18,18,20,0.98); border:1px solid var(--ch-border); border-radius:16px; padding:24px; box-shadow:0 30px 80px rgba(0,0,0,0.8); color:#fff; scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.2) transparent; }
    #ch-whatsnew-modal h2 { margin:0 0 4px; font-size:18px; font-weight:700; }
    #ch-whatsnew-modal .ch-wn-sub { font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:16px; }
    #ch-whatsnew-modal ul { list-style:none; padding:0; margin:0 0 18px; display:flex; flex-direction:column; gap:10px; }
    #ch-whatsnew-modal li { font-size:13px; line-height:1.45; color:rgba(255,255,255,0.85); padding-left:18px; position:relative; }
    #ch-whatsnew-modal li:before { content:""; position:absolute; left:4px; top:7px; width:6px; height:6px; border-radius:50%; background:var(--ch-accent); }
    #ch-whatsnew-modal li b { color:#fff; font-weight:600; }
    #ch-whatsnew-ok { width:100%; padding:11px; border-radius:10px; border:none; background:var(--ch-accent); color:#121212; font-family:var(--ch-font); font-size:13px; font-weight:700; cursor:pointer; transition:.2s; }
    #ch-whatsnew-ok:hover { background:var(--ch-accent-hover); }
    .ch-thinking.active { display:block; }
    .ch-tabs { display:flex; gap:4px; }
    .ch-tab { flex:1; padding:7px 0; border:none; background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.45); font-family:var(--ch-font); font-size:11px; font-weight:600; cursor:pointer; border-radius:10px; transition:.2s; }
    .ch-tab:hover { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); }
    .ch-tab.active { background:var(--ch-accent); color:#121212; }
    .ch-tab-content { display:none; flex-direction:column; gap:14px; font-family:var(--ch-font); }
    .ch-tab-content.active { display:flex; }
    .ch-detect-stat { display:flex; justify-content:space-between; align-items:center; padding:2px 0; }
    .ch-detect-label { font-size:12px; color:rgba(255,255,255,0.55); font-weight:500; }
    .ch-detect-value { font-size:13px; color:#fff; font-weight:700; font-family:var(--ch-font); }
    .ch-detect-gauge { height:10px; border-radius:5px; background:rgba(255,255,255,0.08); overflow:hidden; margin:4px 0; }
    .ch-detect-fill { height:100%; width:0%; border-radius:5px; transition:width .5s ease, background .5s ease; background:var(--ch-accent); }
    .ch-detect-verdict { text-align:center; font-size:12px; font-weight:600; color:rgba(255,255,255,0.4); padding:2px 0; }
    .ch-detect-reset { padding:8px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); font-family:var(--ch-font); font-size:12px; font-weight:600; cursor:pointer; transition:.2s; text-align:center; }
    .ch-detect-reset:hover { background:rgba(255,255,255,0.1); color:#fff; }
    .ch-skins-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:4px; font-family:var(--ch-font); }
    .ch-skin-tile { aspect-ratio:1; background:rgba(255,255,255,0.1); border-radius:6px; cursor:pointer; position:relative; display:flex; align-items:center; justify-content:center; background-size:contain; background-position:center; background-repeat:no-repeat; transition:.15s; font-family:var(--ch-font); }
    .ch-skin-tile:hover { background-color:rgba(255,255,255,0.18); }
    .ch-skin-tile.wide { grid-column:span 3; aspect-ratio:3/1; }
    .ch-skin-label { font-size:16px; color:rgba(255,255,255,0.8); pointer-events:none; line-height:1; font-family:var(--ch-font); }
    .ch-skin-tile.has-skin .ch-skin-label { display:none; }
    .ch-skin-remove { display:none; position:absolute; top:-4px; right:-4px; width:14px; height:14px; border-radius:50%; background:#e04040; color:#fff; border:none; font-size:10px; line-height:14px; text-align:center; padding:0; cursor:pointer; z-index:2; }
    .ch-skin-tile.has-skin:hover .ch-skin-remove { display:block; }
    .ch-skins-row-label { font-size:10px; color:rgba(255,255,255,0.3); font-weight:600; grid-column:span 6; text-align:center; margin:2px 0 -2px; font-family:var(--ch-font); }
  `;
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

  const LANG_INDEX = {
    en: { _name: "English", langPickerTitle: "Choose your language", langPickerSub: "You can change this later in Settings.", langPickerContinue: "Continue" },
    es: { _name: "Español", langPickerTitle: "Elige tu idioma", langPickerSub: "Puedes cambiarlo más tarde en Ajustes.", langPickerContinue: "Continuar" },
    fr: { _name: "Français", langPickerTitle: "Choisissez votre langue", langPickerSub: "Vous pouvez la changer plus tard dans les Réglages.", langPickerContinue: "Continuer" },
    de: { _name: "Deutsch", langPickerTitle: "Wähle deine Sprache", langPickerSub: "Du kannst sie später in den Einstellungen ändern.", langPickerContinue: "Weiter" },
    pt: { _name: "Português", langPickerTitle: "Escolha seu idioma", langPickerSub: "Você pode mudar depois em Ajustes.", langPickerContinue: "Continuar" },
    ru: { _name: "Русский", langPickerTitle: "Выберите язык", langPickerSub: "Можно изменить позже в настройках.", langPickerContinue: "Продолжить" },
    it: { _name: "Italiano", langPickerTitle: "Scegli la tua lingua", langPickerSub: "Puoi cambiarla più tardi nelle Impostazioni.", langPickerContinue: "Continua" },
    pl: { _name: "Polski", langPickerTitle: "Wybierz swój język", langPickerSub: "Możesz to zmienić później w Ustawieniach.", langPickerContinue: "Kontynuuj" },
    nl: { _name: "Nederlands", langPickerTitle: "Kies je taal", langPickerSub: "Je kunt dit later wijzigen in Instellingen.", langPickerContinue: "Doorgaan" },
    tr: { _name: "Türkçe", langPickerTitle: "Dilini seç", langPickerSub: "Bunu daha sonra Ayarlar'dan değiştirebilirsin.", langPickerContinue: "Devam" },
    zh: { _name: "简体中文", langPickerTitle: "选择你的语言", langPickerSub: "稍后可在设置中更改。", langPickerContinue: "继续" },
    ja: { _name: "日本語", langPickerTitle: "言語を選択", langPickerSub: "後で設定から変更できます。", langPickerContinue: "続ける" },
    ko: { _name: "한국어", langPickerTitle: "언어 선택", langPickerSub: "나중에 설정에서 변경할 수 있습니다.", langPickerContinue: "계속" },
    uk: { _name: "Українська", langPickerTitle: "Виберіть мову", langPickerSub: "Можна змінити пізніше в налаштуваннях.", langPickerContinue: "Продовжити" },
    hi: { _name: "हिन्दी", langPickerTitle: "अपनी भाषा चुनें", langPickerSub: "आप इसे बाद में सेटिंग्स में बदल सकते हैं।", langPickerContinue: "जारी रखें" },
    ar: { _name: "العربية", langPickerTitle: "اختر لغتك", langPickerSub: "يمكنك تغيير ذلك لاحقاً في الإعدادات.", langPickerContinue: "متابعة" }
  };
  const LANG_MIRRORS = [
    "https://fastly.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@main/i18n/",
    "https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@main/i18n/",
    "https://raw.githubusercontent.com/ThatKidGlitchy/chess-engines/main/i18n/"
  ];
  const LANG_CACHE_TTL = 24 * 60 * 60 * 1000;
  function readCachedLang(code) {
    try {
      const raw = localStorage.getItem("ch-lang-cache-v2-" + code);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.data || (Date.now() - obj.t) > LANG_CACHE_TTL) return null;
      return obj.data;
    } catch { return null; }
  }
  function writeCachedLang(code, data) {
    try { localStorage.setItem("ch-lang-cache-v2-" + code, JSON.stringify({ t: Date.now(), data })); } catch {}

    try { Object.keys(localStorage).forEach(k => { if (k.startsWith("ch-lang-cache-") && !k.startsWith("ch-lang-cache-v2-")) localStorage.removeItem(k); }); } catch {}
  }
  function langFetchText(url) {
    return new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => { if (!done) { done = true; reject(new Error("timeout")); } }, 15000);
      try {
        fetch(url, { cache: "default" }).then(r => {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.text();
        }).then(txt => {
          if (done) return;
          done = true; clearTimeout(timer); resolve(txt);
        }).catch(() => {
          try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = () => {
              if (done) return;
              if (xhr.status >= 200 && xhr.status < 300) { done = true; clearTimeout(timer); resolve(xhr.responseText); }
              else { done = true; clearTimeout(timer); reject(new Error("HTTP " + xhr.status)); }
            };
            xhr.onerror = () => { if (!done) { done = true; clearTimeout(timer); reject(new Error("network")); } };
            xhr.send();
          } catch (e) {
            if (!done) { done = true; clearTimeout(timer); reject(e); }
          }
        });
      } catch (e) {
        if (!done) { done = true; clearTimeout(timer); reject(e); }
      }
    });
  }
  async function langLoadJSON(path) {
    let lastErr = null;
    for (const base of LANG_MIRRORS) {
      try {
        const txt = await langFetchText(base + path);
        return JSON.parse(txt);
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error("all lang mirrors failed");
  }
  const _langFetches = {};
  function loadLang(code) {
    if (!LANG_INDEX[code] || code === "en") return Promise.resolve(LANGS[code] || null);
    if (LANGS[code]) return Promise.resolve(LANGS[code]);
    const cached = readCachedLang(code);
    if (cached) { LANGS[code] = cached; return Promise.resolve(cached); }
    if (_langFetches[code]) return _langFetches[code];
    _langFetches[code] = langLoadJSON(code + ".json")
      .then(data => { if (data) { LANGS[code] = data; writeCachedLang(code, data); } return data; })
      .catch(err => { console.warn("[Chess Assist] lang load failed for", code, err && err.message); return null; })
      .finally(() => { delete _langFetches[code]; });
    return _langFetches[code];
  }
  let VOICE_RATE = 1, VOICE_VOLUME = 1, VOICE_NAME = '';
  let voiceUnlocked = false;
  let lastSpokenText = '', lastSpokenFen = '', lastSpokenMove = '';
  let streamerSize = 22, streamerPos = null, streamerMove = null;
  let UI_OPACITY = 1;
  let HIDDEN_DARKNESS = .07;
  let uiHidden = false;
  let persistSettings = localStorage.getItem('ch-persist') !== '0';
  const DEPTH_ELO_TABLE = [null, 1500, 1700, 1900, 2100, 2300, 2500, 2700, 2850, 2950, 3050, 3100, 3150, 3200, 3250, 3300, 3350, 3400, 3430, 3460, 3490, 3510, 3530, 3550, 3600];
  function depthToElo(d) { return DEPTH_ELO_TABLE[Math.max(1, Math.min(24, d|0))] || 3200; }

  const LANGS = {
    en: {
      _name: 'English',
      title: 'Chess Assist',
      tabGameplay: 'Gameplay', tabDetection: 'Detection', tabSkins: 'Skins', tabSettings: 'Settings',
      depth: 'Depth', showArrow: 'Show best move', hiddenArrow: 'Hidden arrows', auto: 'Auto-play',
      delay: 'Move delay', eval: 'Win percent', analyze: 'Analyze once', hide: 'Hide all',
      opponent: "Opponent's best", voice: 'Voice moves', streamer: 'Streamer mode',
      darkness: 'Darkness', min: 'Min', max: 'Max', size: 'Size', speed: 'Speed', vol: 'Vol',
      voiceLabel: 'Voice', sayOnce: 'Say once', center: 'Center on screen',
      pressKeys: 'Press keys...', thinking: 'Thinking...', loadingEngine: 'Loading engine...',
      black: 'Black', white: 'White',
      detMoves: 'Moves analyzed', detAcpl: 'Avg CPL', detBmr: 'Best move rate', detAcc: 'Accuracy', detSusp: 'Suspicion',
      detStart: 'Play a game to start detection', detReset: 'Reset stats',
      skinsHint: 'Click a tile to upload a custom image',
      rowWhite: 'White', rowBlack: 'Black', rowBoard: 'Board', rowTiles: 'Tiles',
      boardBg: 'Board BG', lightTiles: 'Light tiles', darkTiles: 'Dark tiles',
      pieceMask: 'Piece mask', resetSkins: 'Reset all skins',
      premadeHint: 'Premade piece sets — click to apply all 12 pieces at once',
      searchSets: 'Search sets…', clearPremade: 'Clear premade pieces', loadingCatalog: 'Loading catalog…',
      boardsHint: 'Board themes — click a tile to apply the board artwork',
      searchBoards: 'Search boards…', clearBoard: 'Clear board', boardsCredit: 'Boards by NikAgs.',
      setsCredit: 'Sets by Lichess, Rhosgfx, Sharechess.', fullCredits: 'Full credits',
      engineLabel: 'Engine', appearance: 'Appearance', keybinds: 'Keybinds', session: 'Session', strength: 'Strength',
      opacity: 'Opacity', resetBinds: 'Reset all keybinds', saveOnReload: 'Save on reload',
      language: 'Language',
      madeBy: 'made by', terms: 'Terms & Disclaimer',
      wnTitle: "What's new in", wnSub: 'Chess Assist — chess.com helper', wnOk: 'Got it',
      tipDepth: 'How many moves ahead the engine calculates. Higher = stronger but slower. 16 is a good balance. Below 10 is fast but weaker, above 20 is very slow. The “≈ N ELO” label below is a rough estimate of playing strength at that depth — not official. For Stockfish it’s ballparked against CCRL-ish ratings; for Lozza 11, Garbochess, and p4wn it’s a looser guess since those engines don’t have standardized strength numbers.',
      tipArrow: 'Draws a green arrow on the board showing the best move the engine found.',
      tipHidden: 'Darkens the from/to squares instead of drawing an arrow. Use the Darkness slider to pick how strong — lower is subtler, higher is easier to read. Overrides the green arrow when both are on.',
      tipAuto: "Automatically plays the best move for you when it's your turn. Uses anti-repetition to avoid repeating the same moves.",
      tipDelay: 'Random delay before auto-play makes a move, so it looks like a human thinking. Set a min and max range in seconds. Off by default — the engine moves as soon as it finishes calculating.',
      tipEval: "Shows a live win probability bar next to the panel. Updates every position using the selected engine's centipawn evaluation.",
      tipHide: 'Hides everything — the icon, panel, arrows, and shading — and pauses auto-play / arrows / voice until you unhide. The hidden state now persists across page reloads. If you ever forget the keybind, open the browser console (F12) after loading the script and it will print the current hide keybind.',
      tipOpponent: "Shows a red arrow for the opponent's best reply to the current position. Helps you anticipate what they'll play next.",
      tipVoice: "Speaks the best move through your headphones each turn. Nothing shows on screen and no arrows need to be drawn — if anyone's watching your screen they can't spot it. Uses your browser's built-in voices; pick voice, speed, and volume below.",
      tipStreamer: "Shows the best move as a floating text pill instead of an arrow. Drag it off your capture area or behind your stream overlay so viewers can't see it. Resize with the slider.",
      tipMask: 'Pieces: uses the original piece shape as a mask filled with your custom image. Tiles: each square gets the image individually instead of one large image showing through.',
      tipEngine: "Which engine picks the moves. Stockfish 19 is the current default and strongest. Older Stockfish versions (8, 10, 11, 16, 17, 18) are lighter and faster on slow devices. Lozza 11 and Garbochess are pure JavaScript — slower but zero load time; their depth slider auto-caps at 12. p4wn is a deliberately weak pure-JS engine (depth capped at 4) for simulating a low-rated opponent.",
      tipOpacity: 'How see-through the whole helper UI is — knight icon, panel, eval bar, streamer pill. 100% is fully opaque. Lower it if the UI gets in the way of the board.',
      tipPersist: 'When on, your settings (toggles, depth, keybinds, position) persist across page reloads. Turn off to make changes only for this session.',
      tipLang: 'Interface language. Saved separately from other settings, so it stays set even when "Save on reload" is off.',
      tipDetMoves: 'Number of moves tracked so far. More moves = more reliable stats. At least 10 moves recommended for accurate results.',
      tipDetAcpl: 'Average Centipawn Loss — how many centipawns the opponent loses per move. Lower = stronger play. Engines typically have ACPL under 10, humans 30–100+ depending on rating.',
      tipDetBmr: "How often the opponent plays the engine's top choice (within 5 centipawns). Engines hit 80%+, most humans 30–60% depending on ELO.",
      tipDetAcc: 'Lichess-style accuracy score derived from ACPL. 90%+ is very strong, 95%+ at low ELO is suspicious. Compared against expected accuracy for the opponent’s rating.',
      tipDetScore: "Multi-factor suspicion score adjusted for the opponent's ELO. Combines ACPL ratio, best-move rate gap, zero-blunder bonus, and accuracy gap vs expected stats for their rating.",
      langPickerTitle: 'Choose your language', langPickerSub: 'You can change this later in Settings.', langPickerContinue: 'Continue'
    }
  };
  let currentLang = (() => {
    try {
      const saved = localStorage.getItem('ch-lang');
      if (saved && LANG_INDEX[saved]) return saved;
    } catch {}
    return null;
  })();
  function t(key) {
    const L = (currentLang && LANGS[currentLang]) || LANGS.en;
    return L[key] != null ? L[key] : (LANGS.en[key] != null ? LANGS.en[key] : key);
  }
  function setLang(lang) {
    if (!LANG_INDEX[lang]) return;
    currentLang = lang;
    try { localStorage.setItem("ch-lang", lang); } catch {}
    if (lang === "en" || LANGS[lang]) { applyI18n(); return; }
    loadLang(lang).then(() => applyI18n());
  }
  function applyI18n() {

    const root = document.getElementById('chess-helper-panel');
    if (!root) return;
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      el.textContent = t(k);
    });
    root.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
    });

    const langSel = root.querySelector('#ch-lang');
    if (langSel) langSel.value = currentLang || 'en';

    try {
      if (typeof binds === 'object' && typeof keyLabel === 'function') {
        root.querySelectorAll('.ch-keybind[data-bind]').forEach(el => {
          const name = el.dataset.bind;
          if (el.classList.contains('recording')) {
            el.textContent = t('pressKeys');
          } else if (binds[name]) {
            el.textContent = keyLabel(binds[name]);
          } else {
            el.textContent = t('pressKeys');
          }
        });
      }
    } catch {}

    fitTextToEnglish(root);
    fitLabelsToRow(root);
  }

  function fitLabelsToRow(root) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const parent = el.parentElement;
      if (!parent) return;
      let tries = 0;
      while (parent.scrollWidth > parent.clientWidth + 1 && tries < 40) {
        const cs = parseFloat(getComputedStyle(el).fontSize);
        if (cs <= 8) break;
        el.style.fontSize = (cs - 0.5) + 'px';
        tries++;
      }
    });
  }

  function fitTextToEnglish(root) {
    if (!root || !LANGS.en) return;
    const en = LANGS.en;
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      const enStr = en[k];
      if (!enStr) return;
      const curStr = el.textContent;
      if (!el.dataset.chFsBase) {
        el.dataset.chFsBase = String(parseFloat(getComputedStyle(el).fontSize) || 12);
      }
      const base = parseFloat(el.dataset.chFsBase);
      if (curStr === enStr) { el.style.fontSize = ''; return; }
      el.style.fontSize = base + 'px';
      const curW = el.getBoundingClientRect().width;
      if (curW <= 0) return;
      el.textContent = enStr;
      const enW = el.getBoundingClientRect().width;
      el.textContent = curStr;
      if (enW > 0 && curW > enW * 1.02) {
        const ratio = enW / curW;
        const newSize = Math.max(8, base * ratio);
        el.style.fontSize = newSize + 'px';
      } else {
        el.style.fontSize = '';
      }
    });
  }
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
        uiHidden,
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
      verdictEl.textContent = t('detStart');
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
    if (activeDetectionKey && detection.oppMoves > 0 && !gameInProgress()) return false;
    if (activeDetectionKey && detection.oppMoves > 0 && currentMoves.length === 0 && !saved) return false;
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
  function xhrArrayBuffer(url, onBytes, timeoutMs) {
    return new Promise((res, rej) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = timeoutMs || 60000;
        xhr.onprogress = e => { try { onBytes(e.loaded, e.lengthComputable ? e.total : 0); } catch {} };
        xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300 && xhr.response) res(xhr.response); else rej(new Error('HTTP ' + xhr.status + ' ' + url)); };
        xhr.onerror = () => rej(new Error('network error ' + url));
        xhr.ontimeout = () => rej(new Error('XHR timeout ' + url));
        xhr.send();
      } catch (e) { rej(e); }
    });
  }
  async function fetchWithProgress(url, onBytes) {
    const TIMEOUT_MS = 60000;
    let ctrl = null, timer = null;
    try {
      ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      timer = setTimeout(() => { try { ctrl && ctrl.abort(); } catch {} }, TIMEOUT_MS);
      const resp = await fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
      if (!resp.ok) throw new Error('HTTP ' + resp.status + ' ' + url);
      if (!resp.body || !resp.body.getReader) { const ab = await resp.arrayBuffer(); clearTimeout(timer); return ab; }
      const total = Number(resp.headers.get('Content-Length')) || 0;
      const reader = resp.body.getReader();
      const chunks = [];
      let received = 0;
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        try { onBytes(received, total); } catch {}
      }
      clearTimeout(timer);
      const buf = new Uint8Array(received);
      let off = 0;
      for (const c of chunks) { buf.set(c, off); off += c.length; }
      return buf.buffer;
    } catch (e) {
      clearTimeout(timer);
      console.warn('[Chess Assist] fetch stream failed, falling back to XHR:', e && e.message);
      return xhrArrayBuffer(url, onBytes, TIMEOUT_MS);
    }
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
        const jsPrefix = 'try{if(typeof SharedArrayBuffer!=="undefined"){try{new SharedArrayBuffer(1);}catch(_e){try{delete self.SharedArrayBuffer;}catch(_){self.SharedArrayBuffer=void 0;}}}self.addEventListener("error",function(ev){try{self.postMessage("info string worker error: "+(ev.message||ev));}catch(_){}});}catch(_){}\n';
        sfWorker = new Worker(URL.createObjectURL(new Blob([ jsPrefix + code ], {
          type: 'application/javascript'
        })));
      }
      await uciCommand('uci', 'uciok');
      uciSend('setoption name Hash value ' + (engine.hash || 64));
      sfCurrentMultiPV = 1;
      if (!engine.noMultiPV) uciSend('setoption name MultiPV value 1');
      await uciCommand('isready', 'readyok');
      sfReady = true;
      sfWorker.onerror = handleWorkerCrash;
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
          const asmBuf = await fetchWithProgress(engine.asmUrl, () => {});
          const code = (new TextDecoder).decode(asmBuf);
          const jsPrefix = 'try{if(typeof SharedArrayBuffer!=="undefined"){try{new SharedArrayBuffer(1);}catch(_e){try{delete self.SharedArrayBuffer;}catch(_){self.SharedArrayBuffer=void 0;}}}self.addEventListener("error",function(ev){try{self.postMessage("info string worker error: "+(ev.message||ev));}catch(_){}});}catch(_){}\n';
          sfWorker = new Worker(URL.createObjectURL(new Blob([ jsPrefix + code ], {
            type: 'application/javascript'
          })));
          await uciCommand('uci', 'uciok');
          uciSend('setoption name Hash value ' + (engine.hash || 64));
          sfCurrentMultiPV = 1;
          if (!engine.noMultiPV) uciSend('setoption name MultiPV value 1');
          await uciCommand('isready', 'readyok');
          sfReady = true;
          sfWorker.onerror = handleWorkerCrash;
          lastEngineResponse = Date.now();
          installReadyokListener();
          hideLoadingOverlay();
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
    showLoadingOverlay(t('loadingEngine'));
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
    try { updateDepthEloLabel(); } catch {}
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
    const expectedTurn = fenBefore && fenBefore.split(' ')[1];
    const myColor = getMyColor();
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        const curFen = getFEN();
        if (!curFen) return;
        if (curFen.split(' ')[0] !== fenBefore.split(' ')[0]) return;
        if (curFen.split(' ')[1] !== expectedTurn) return;
        if (curFen.split(' ')[1] !== myColor) return;
      }
      clickSquare(from);
      await new Promise(r => setTimeout(r, 200 + attempt * 100));
      {
        const curFen = getFEN();
        if (curFen && curFen.split(' ')[1] !== myColor) return;
      }
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
    if (uiHidden) return;
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
      updateDetectionUI();
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




          const _afterTurn = fenAfter && fenAfter.split(' ')[1];
          if (_afterTurn && _afterTurn !== getMyColor()) {
            lastMovedFen = fenAfter;
            waitingForOpponent = true;
          } else {
            lastMovedFen = '';
            waitingForOpponent = false;
            lastFen = '';
          }
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
    if (uiHidden) return;
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
  panel.innerHTML = `
    <div class="ch-header"><div class="ch-title" data-i18n="title">Chess Assist</div><button class="ch-close" id="ch-close">&times;</button></div>
    <div class="ch-tabs">
      <button class="ch-tab active" data-tab="gameplay" data-i18n="tabGameplay">Gameplay</button>
      <button class="ch-tab" data-tab="detection" data-i18n="tabDetection">Detection</button>
      <button class="ch-tab" data-tab="skins" data-i18n="tabSkins">Skins</button>
      <button class="ch-tab" data-tab="settings" data-i18n="tabSettings">Settings</button>
    </div>
    <div class="ch-tab-content active" id="ch-tab-gameplay">
    <div class="ch-thinking" id="ch-thinking" data-i18n="thinking">Thinking...</div>
    <div class="ch-pager" id="ch-gp-pager">
      <button class="ch-pager-arrow" id="ch-gp-prev" data-dir="-1" aria-label="Previous page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M5 1L1 5l4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="ch-pager-dots">
        <div class="ch-pager-dot active" data-page="1"></div>
        <div class="ch-pager-dot" data-page="2"></div>
      </div>
      <span class="ch-pager-count" id="ch-gp-count">1/2</span>
      <button class="ch-pager-arrow" id="ch-gp-next" data-dir="1" aria-label="Next page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M2 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <div class="ch-gameplay-page active" data-page="1">
    <div>
      <div class="ch-depth-row"><span class="ch-depth-label" data-i18n="depth">Depth</span><span class="ch-info" data-tip="depth">i</span><input type="range" class="ch-range" id="ch-depth" min="1" max="24" value="16"><span class="ch-depth-val" id="ch-depth-val">16</span></div>
      <div class="ch-tooltip" id="tip-depth" data-i18n="tipDepth">How many moves ahead the engine calculates. Higher = stronger but slower. 16 is a good balance. Below 10 is fast but weaker, above 20 is very slow. The “≈ N ELO” label below is a rough estimate of playing strength at that depth — not official. For Stockfish it’s ballparked against CCRL-ish ratings; for Lozza 11, Garbochess, and p4wn it’s a looser guess since those engines don’t have standardized strength numbers.</div>
      <div id="ch-depth-elo" style="font-size:10px;color:rgba(255,255,255,0.4);text-align:right;margin-top:2px;letter-spacing:0.3px;">≈ 3350 ELO</div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="showArrow">Show best move</span><span class="ch-info" data-tip="arrow">i</span><span class="ch-keybind" data-bind="arrow" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-arrow"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-arrow" data-i18n="tipArrow">Draws a green arrow on the board showing the best move the engine found.</div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="hiddenArrow">Hidden arrows</span><span class="ch-info" data-tip="hidden">i</span><span class="ch-keybind" data-bind="hidden" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-hidden"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-hidden" data-i18n="tipHidden">Darkens the from/to squares instead of drawing an arrow. Use the Darkness slider to pick how strong — lower is subtler, higher is easier to read. Overrides the green arrow when both are on.</div>
      <div id="ch-hidden-controls" style="display:none">
        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label" style="font-size:12px;" data-i18n="darkness">Darkness</span><input type="range" class="ch-range" id="ch-hidden-darkness" min="2" max="50" value="7"><span class="ch-depth-val" id="ch-hidden-darkness-val" style="font-size:12px;">7%</span></div>
      </div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="auto">Auto-play</span><span class="ch-info" data-tip="auto">i</span><span class="ch-keybind" data-bind="auto" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-auto"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-auto" data-i18n="tipAuto">Automatically plays the best move for you when it's your turn. Uses anti-repetition to avoid repeating the same moves.</div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="delay">Move delay</span><span class="ch-info" data-tip="delay">i</span><span class="ch-keybind" data-bind="delay" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-delay-toggle"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-delay" data-i18n="tipDelay">Random delay before auto-play makes a move, so it looks like a human thinking. Set a min and max range in seconds. Off by default — the engine moves as soon as it finishes calculating.</div>
      <div id="ch-delay-sliders" style="display:none">
        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label" data-i18n="min">Min</span><input type="range" class="ch-range" id="ch-delay-min" min="0" max="15" value="1" step="0.5"><span class="ch-depth-val" id="ch-delay-min-val">1s</span></div>
        <div class="ch-depth-row" style="margin-top:4px"><span class="ch-depth-label" data-i18n="max">Max</span><input type="range" class="ch-range" id="ch-delay-max" min="0" max="15" value="5" step="0.5"><span class="ch-depth-val" id="ch-delay-max-val">5s</span></div>
      </div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="eval">Win percent</span><span class="ch-info" data-tip="eval">i</span><span class="ch-keybind" data-bind="eval" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-eval"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-eval" data-i18n="tipEval">Shows a live win probability bar next to the panel. Updates every position using the selected engine's centipawn evaluation.</div>
    </div>
    <div class="ch-row" style="margin-top:2px;"><button class="ch-btn ch-btn-primary" id="ch-analyze" style="flex:1;" data-i18n="analyze">Analyze once</button><span class="ch-keybind" data-bind="analyze" style="margin-left:8px;" data-i18n="pressKeys">Press keys...</span></div>
    <div>
      <div class="ch-row" style="margin-top:2px"><span class="ch-label" style="flex:0 0 auto;" data-i18n="hide">Hide all</span><span class="ch-info" data-tip="hide">i</span><span class="ch-keybind" data-bind="hide" style="margin-left:auto;" data-i18n="pressKeys">Press keys...</span></div>
      <div class="ch-tooltip" id="tip-hide" data-i18n="tipHide">Hides everything — the icon, panel, arrows, and shading — and pauses auto-play / arrows / voice until you unhide. The hidden state now persists across page reloads. If you ever forget the keybind, open the browser console (F12) after loading the script and it will print the current hide keybind.</div>
    </div>
    </div>
    <div class="ch-gameplay-page" data-page="2">
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="opponent">Opponent's best</span><span class="ch-info" data-tip="opponent">i</span><span class="ch-keybind" data-bind="opponent" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-opponent"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-opponent" data-i18n="tipOpponent">Shows a red arrow for the opponent's best reply to the current position. Helps you anticipate what they'll play next.</div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="voice">Voice moves</span><span class="ch-info" data-tip="voice">i</span><span class="ch-keybind" data-bind="voice" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-voice"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-voice" data-i18n="tipVoice">Speaks the best move through your headphones each turn. Nothing shows on screen and no arrows need to be drawn — if anyone's watching your screen they can't spot it. Uses your browser's built-in voices; pick voice, speed, and volume below.</div>
      <div id="ch-voice-sliders" style="display:none">
        <div style="margin-top:6px;"><div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;" data-i18n="voiceLabel">Voice</div>
          <div id="ch-voice-pick-wrap" style="position:relative;width:100%;">
            <button type="button" id="ch-voice-pick-btn" style="width:100%;padding:7px 24px 7px 10px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);font-size:12px;text-align:left;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;">Default<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" style="position:absolute;right:9px;top:50%;transform:translateY(-50%);opacity:0.55;pointer-events:none;"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <div id="ch-voice-pick-list" style="display:none;position:absolute;top:calc(100% + 2px);left:0;right:0;max-height:240px;overflow-y:auto;background:#1a1a1c;border:1px solid rgba(255,255,255,0.1);border-radius:8px;z-index:100002;box-shadow:0 10px 30px rgba(0,0,0,0.6);scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent;"></div>
          </div>
        </div>
        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label" data-i18n="speed">Speed</span><input type="range" class="ch-range" id="ch-voice-rate" min="0.5" max="2" value="1" step="0.1"><span class="ch-depth-val" id="ch-voice-rate-val">1.0</span></div>
        <div class="ch-depth-row" style="margin-top:4px"><span class="ch-depth-label" data-i18n="vol">Vol</span><input type="range" class="ch-range" id="ch-voice-vol" min="0" max="1" value="1" step="0.05"><span class="ch-depth-val" id="ch-voice-vol-val">100%</span></div>
        <div class="ch-row" style="margin-top:6px;"><button class="ch-btn" id="ch-voice-test" style="flex:1;" data-i18n="sayOnce">Say once</button><span class="ch-keybind" data-bind="voiceRepeat" style="margin-left:8px;" data-i18n="pressKeys">Press keys...</span></div>
      </div>
    </div>
    <div>
      <div class="ch-row"><span class="ch-label" data-i18n="streamer">Streamer mode</span><span class="ch-info" data-tip="streamer">i</span><span class="ch-keybind" data-bind="streamer" data-i18n="pressKeys">Press keys...</span><label class="ch-switch"><input type="checkbox" id="ch-streamer"><span class="ch-slider"></span></label></div>
      <div class="ch-tooltip" id="tip-streamer" data-i18n="tipStreamer">Shows the best move as a floating text pill instead of an arrow. Drag it off your capture area or behind your stream overlay so viewers can't see it. Resize with the slider.</div>
      <div id="ch-streamer-controls" style="display:none">
        <div class="ch-depth-row" style="margin-top:6px"><span class="ch-depth-label" data-i18n="size">Size</span><input type="range" class="ch-range" id="ch-streamer-size" min="12" max="60" value="22"><span class="ch-depth-val" id="ch-streamer-size-val">22</span></div>
        <div class="ch-row" style="margin-top:6px;"><button class="ch-btn" id="ch-streamer-reset" style="flex:1;" data-i18n="center">Center on screen</button><span class="ch-keybind" data-bind="streamerCenter" style="margin-left:8px;" data-i18n="pressKeys">Press keys...</span></div>
      </div>
    </div>
    </div>
    </div>
    <div class="ch-tab-content" id="ch-tab-detection">
      <div style="display:flex;gap:4px;justify-content:center;padding:4px 0 6px;">
        <button id="ch-det-black" class="ch-det-target active" style="flex:1;padding:4px 0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:var(--ch-accent);color:#fff;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;" data-i18n="black">Black</button>
        <button id="ch-det-white" class="ch-det-target" style="flex:1;padding:4px 0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;" data-i18n="white">White</button>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label"><span data-i18n="detMoves">Moves analyzed</span> <span class="ch-info" data-tip="det-moves">i</span></span><span class="ch-detect-value" id="ch-det-moves">0</span></div>
        <div class="ch-tooltip" id="tip-det-moves" data-i18n="tipDetMoves">Number of moves tracked so far. More moves = more reliable stats. At least 10 moves recommended for accurate results.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label"><span data-i18n="detAcpl">Avg CPL</span> <span class="ch-info" data-tip="det-acpl">i</span></span><span class="ch-detect-value" id="ch-det-acpl">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-acpl" data-i18n="tipDetAcpl">Average Centipawn Loss — how many centipawns the opponent loses per move. Lower = stronger play. Engines typically have ACPL under 10, humans 30–100+ depending on rating.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label"><span data-i18n="detBmr">Best move rate</span> <span class="ch-info" data-tip="det-bmr">i</span></span><span class="ch-detect-value" id="ch-det-bmr">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-bmr" data-i18n="tipDetBmr">How often the opponent plays the engine's top choice (within 5 centipawns). Engines hit 80%+, most humans 30–60% depending on ELO.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label"><span data-i18n="detAcc">Accuracy</span> <span class="ch-info" data-tip="det-acc">i</span></span><span class="ch-detect-value" id="ch-det-acc">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-acc" data-i18n="tipDetAcc">Lichess-style accuracy score derived from ACPL. 90%+ is very strong, 95%+ at low ELO is suspicious. Compared against expected accuracy for the opponent's rating.</div>
      </div>
      <div>
        <div class="ch-detect-stat"><span class="ch-detect-label"><span data-i18n="detSusp">Suspicion</span> <span class="ch-info" data-tip="det-score">i</span></span><span class="ch-detect-value" id="ch-det-score">&mdash;</span></div>
        <div class="ch-tooltip" id="tip-det-score" data-i18n="tipDetScore">Multi-factor suspicion score adjusted for the opponent's ELO. Combines ACPL ratio, best-move rate gap, zero-blunder bonus, and accuracy gap vs expected stats for their rating.</div>
      </div>
      <div class="ch-detect-gauge"><div class="ch-detect-fill" id="ch-det-fill"></div></div>
      <div class="ch-detect-verdict" id="ch-det-verdict" data-i18n="detStart">Play a game to start detection</div>
      <div style="display:flex;gap:6px;margin-top:4px;">
        <button class="ch-detect-reset" id="ch-det-reset" style="flex:1;" data-i18n="detReset">Reset stats</button>
      </div>
    </div>
    <div class="ch-tab-content" id="ch-tab-skins">
    <div class="ch-pager" id="ch-sk-pager">
      <button class="ch-pager-arrow" id="ch-sk-prev" data-dir="-1" aria-label="Previous page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M5 1L1 5l4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <div class="ch-pager-dots">
        <div class="ch-pager-dot active" data-page="1"></div>
        <div class="ch-pager-dot" data-page="2"></div>
        <div class="ch-pager-dot" data-page="3"></div>
      </div>
      <span class="ch-pager-count" id="ch-sk-count">1/3</span>
      <button class="ch-pager-arrow" id="ch-sk-next" data-dir="1" aria-label="Next page"><svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10"><path d="M2 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <div class="ch-skins-page active" data-page="1">
      <div style="font-size:11px;color:rgba(255,255,255,0.4);text-align:center;padding:2px 0 4px;font-style:italic;" data-i18n="skinsHint">Click a tile to upload a custom image</div>
      <div class="ch-skins-grid" id="ch-skins-grid">
        <div class="ch-skins-row-label" data-i18n="rowWhite">White</div>
        <div class="ch-skin-tile" data-skin="wk"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wq"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wr"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wb"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wn"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="wp"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skins-row-label" data-i18n="rowBlack">Black</div>
        <div class="ch-skin-tile" data-skin="bk"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bq"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="br"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bb"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bn"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile" data-skin="bp"><span class="ch-skin-label"><img src="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png" style="width:28px;height:28px;pointer-events:none;"></span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skins-row-label" data-i18n="rowBoard">Board</div>
        <div class="ch-skin-tile" data-skin="board" style="grid-column:2/6;aspect-ratio:4/1;"><span class="ch-skin-label" style="font-size:11px;" data-i18n="boardBg">Board BG</span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skins-row-label" data-i18n="rowTiles">Tiles</div>
        <div class="ch-skin-tile wide" data-skin="lightTiles"><span class="ch-skin-label" style="font-size:11px;" data-i18n="lightTiles">Light tiles</span><button class="ch-skin-remove">&times;</button></div>
        <div class="ch-skin-tile wide" data-skin="darkTiles"><span class="ch-skin-label" style="font-size:11px;" data-i18n="darkTiles">Dark tiles</span><button class="ch-skin-remove">&times;</button></div>
      </div>
      <div>
        <div class="ch-row"><span class="ch-label" data-i18n="pieceMask">Piece mask</span><span class="ch-info" data-tip="mask">i</span><label class="ch-switch"><input type="checkbox" id="ch-skin-mask"><span class="ch-slider"></span></label></div>
        <div class="ch-tooltip" id="tip-mask" data-i18n="tipMask">Pieces: uses the original piece shape as a mask filled with your custom image. Tiles: each square gets the image individually instead of one large image showing through.</div>
      </div>
      <button class="ch-detect-reset" id="ch-skins-reset" data-i18n="resetSkins">Reset all skins</button>
    </div>
    <div class="ch-skins-page" data-page="2">
      <div style="font-size:11px;color:rgba(255,255,255,0.4);text-align:center;padding:2px 0 4px;font-style:italic;" data-i18n="premadeHint">Premade piece sets — click to apply all 12 pieces at once</div>
      <input type="text" id="ch-premade-search" placeholder="Search sets…" data-i18n-ph="searchSets" style="width:100%;padding:7px 10px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);font-size:12px;box-sizing:border-box;margin-bottom:6px;">
      <div id="ch-premade-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-height:240px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent;padding-right:2px;">
        <div class="ch-premade-empty" style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);font-size:11px;padding:20px 0;" data-i18n="loadingCatalog">Loading catalog…</div>
      </div>
      <button class="ch-detect-reset" id="ch-premade-clear" data-i18n="clearPremade">Clear premade pieces</button>
      <div style="font-size:10px;color:rgba(255,255,255,0.3);text-align:center;padding:4px 0 2px;"><span data-i18n="setsCredit">Sets by Lichess, Rhosgfx, Sharechess.</span> <a href="https://github.com/ThatKidGlitchy/chess-engines/blob/main/skins/CREDITS.txt" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.55);text-decoration:underline;" data-i18n="fullCredits">Full credits</a>.</div>
    </div>
    <div class="ch-skins-page" data-page="3">
      <div style="font-size:11px;color:rgba(255,255,255,0.4);text-align:center;padding:2px 0 4px;font-style:italic;" data-i18n="boardsHint">Board themes — click a tile to apply the board artwork</div>
      <input type="text" id="ch-board-search" placeholder="Search boards…" data-i18n-ph="searchBoards" style="width:100%;padding:7px 10px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);font-size:12px;box-sizing:border-box;margin-bottom:6px;">
      <div id="ch-board-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-height:240px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent;padding-right:2px;">
        <div class="ch-premade-empty" style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);font-size:11px;padding:20px 0;" data-i18n="loadingCatalog">Loading catalog…</div>
      </div>
      <button class="ch-detect-reset" id="ch-board-clear" data-i18n="clearBoard">Clear board</button>
      <div style="font-size:10px;color:rgba(255,255,255,0.3);text-align:center;padding:4px 0 2px;"><span data-i18n="boardsCredit">Boards by NikAgs.</span> <a href="https://github.com/NikAgs/ChessSkins" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.55);text-decoration:underline;" data-i18n="fullCredits">Full credits</a>.</div>
    </div>
    </div>
    <div class="ch-tab-content" id="ch-tab-settings">
      <div class="ch-section-head" data-i18n="engineLabel">Engine</div>
      <div>
        <div class="ch-row"><span class="ch-label" data-i18n="engineLabel">Engine</span><span class="ch-info" data-tip="engine">i</span></div>
        <select id="ch-engine" style="width:100%;padding:6px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);margin-top:4px;color-scheme:dark;">
          <option value="sf19" style="background:#1a1a1c;color:#fff;">Stockfish 19</option>
          <option value="sf18" style="background:#1a1a1c;color:#fff;">Stockfish 18</option>
          <option value="sf17" style="background:#1a1a1c;color:#fff;">Stockfish 17</option>
          <option value="sf16" style="background:#1a1a1c;color:#fff;">Stockfish 16</option>
          <option value="sf11" style="background:#1a1a1c;color:#fff;">Stockfish 11</option>
          <option value="sf10" style="background:#1a1a1c;color:#fff;">Stockfish 10</option>
          <option value="sf8" style="background:#1a1a1c;color:#fff;">Stockfish 8</option>
          <option value="lozza11" style="background:#1a1a1c;color:#fff;">Lozza 11</option>
          <option value="garbochess" style="background:#1a1a1c;color:#fff;">Garbochess</option>
          <option value="p4wn" style="background:#1a1a1c;color:#fff;">p4wn</option>
        </select>
        <div class="ch-tooltip" id="tip-engine" data-i18n="tipEngine">Which engine picks the moves. Stockfish 19 is the current default and strongest. Older Stockfish versions (8, 10, 11, 16, 17, 18) are lighter and faster on slow devices. Lozza 11 and Garbochess are pure JavaScript — slower but zero load time; their depth slider auto-caps at 12. p4wn is a deliberately weak pure-JS engine (depth capped at 4) for simulating a low-rated opponent.</div>
      </div>
      <div class="ch-section-head" data-i18n="appearance">Appearance</div>
      <div>
        <div class="ch-depth-row"><span class="ch-depth-label" style="font-size:12px;" data-i18n="opacity">Opacity</span><span class="ch-info" data-tip="opacity">i</span><input type="range" class="ch-range" id="ch-opacity" min="5" max="100" value="100"><span class="ch-depth-val" id="ch-opacity-val" style="font-size:12px;">100%</span></div>
        <div class="ch-tooltip" id="tip-opacity" data-i18n="tipOpacity">How see-through the whole helper UI is — knight icon, panel, eval bar, streamer pill. 100% is fully opaque. Lower it if the UI gets in the way of the board.</div>
      </div>
      <div>
        <div class="ch-row" style="margin-top:6px;"><span class="ch-label" data-i18n="language">Language</span><span class="ch-info" data-tip="lang">i</span></div>
        <select id="ch-lang" style="width:100%;padding:6px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:var(--ch-font);margin-top:4px;color-scheme:dark;"></select>
        <div class="ch-tooltip" id="tip-lang" data-i18n="tipLang">Interface language. Saved separately from other settings, so it stays set even when "Save on reload" is off.</div>
      </div>
      <div class="ch-section-head" data-i18n="keybinds">Keybinds</div>
      <div>
        <button class="ch-btn" id="ch-reset-binds" style="width:100%;padding:8px 0;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-family:var(--ch-font);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;" data-i18n="resetBinds">Reset all keybinds</button>
      </div>
      <div class="ch-section-head" data-i18n="session">Session</div>
      <div>
        <div class="ch-row"><span class="ch-label" data-i18n="saveOnReload">Save on reload</span><span class="ch-info" data-tip="persist">i</span><label class="ch-switch"><input type="checkbox" id="ch-persist"><span class="ch-slider"></span></label></div>
        <div class="ch-tooltip" id="tip-persist" data-i18n="tipPersist">When on, your settings (toggles, depth, keybinds, position) persist across page reloads. Turn off to make changes only for this session.</div>
      </div>
    </div>
    <div style="text-align:center;padding:2px 0 0;font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:0.3px;line-height:1.1;"><span data-i18n="madeBy">made by</span> <a href="https://github.com/ThatKidGlitchy/chess-hacks" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.35);text-decoration:underline;">ThatKidGlitchy</a> &middot; <a href="https://github.com/ThatKidGlitchy/chess-hacks/blob/main/Chess-Assist-Disclaimer.md" target="_blank" rel="noopener noreferrer" style="color:rgba(255,255,255,0.55);text-decoration:underline;" data-i18n="terms">Terms &amp; Disclaimer</a><div style="font-size:8px;color:rgba(255,255,255,0.10);font-family:var(--ch-font);font-weight:600;letter-spacing:0.3px;margin-top:4px;font-variant-numeric:tabular-nums;">v1.4.4</div></div>
  `;
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

  if (currentLang && currentLang !== "en") { loadLang(currentLang).then(() => applyI18n()); }
  applyI18n();
  (function wireLangDropdown() {
    const sel = panel.querySelector('#ch-lang');
    if (!sel) return;
    sel.innerHTML = Object.entries(LANG_INDEX).map(([code, L]) => `<option value="${code}" style="background:#1a1a1c;color:#fff;">${L._name}</option>`).join('');
    sel.value = currentLang || 'en';
    sel.onchange = (e) => setLang(e.target.value);
  })();
  function showLangPicker(onDone) {
    const backdrop = document.createElement('div');
    backdrop.id = 'ch-lang-backdrop';
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:100020;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);font-family:var(--ch-font);';
    const opts = Object.entries(LANG_INDEX).map(([code, L]) => `<option value="${code}">${L._name}</option>`).join('');
    backdrop.innerHTML = `
      <div role="dialog" aria-modal="true" style="width:min(360px,92vw);background:rgba(18,18,20,0.98);border:1px solid var(--ch-border);border-radius:16px;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,0.8);color:#fff;">
        <h2 style="margin:0 0 4px;font-size:18px;font-weight:700;">Choose your language</h2>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:16px;">You can change this later in Settings.</div>
        <select id="ch-lang-pick" style="width:100%;padding:10px;background:#1a1a1c;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:10px;font-family:var(--ch-font);font-size:14px;color-scheme:dark;margin-bottom:16px;">${opts}</select>
        <button id="ch-lang-continue" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--ch-accent);color:#121212;font-family:var(--ch-font);font-size:13px;font-weight:700;cursor:pointer;">Continue</button>
      </div>`;
    document.body.appendChild(backdrop);
    const sel = backdrop.querySelector('#ch-lang-pick');

    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (LANG_INDEX[browser]) sel.value = browser;

    const h2 = backdrop.querySelector('h2');
    const sub = backdrop.querySelector('div[style*="rgba(255,255,255,0.5)"]');
    const cont = backdrop.querySelector('#ch-lang-continue');
    const applyPreview = () => {
      const L = LANG_INDEX[sel.value] || LANG_INDEX.en;
      h2.textContent = L.langPickerTitle;
      sub.textContent = L.langPickerSub;
      cont.textContent = L.langPickerContinue;
    };
    applyPreview();
    sel.onchange = applyPreview;
    cont.onclick = () => {
      setLang(sel.value);
      backdrop.remove();
      if (onDone) onDone();
    };
  }
  let _wnDeferred = false;
  if (!currentLang) {
    _wnDeferred = true;
    showLangPicker(() => {
      const code = currentLang || 'en';
      const fire = () => { try { showWhatsNew(false); } catch {} };
      if (code === 'en' || LANGS[code]) fire();
      else loadLang(code).then(fire).catch(fire);
    });
  }

  const CURRENT_VERSION = '1.4.4';
  const CHANGELOG = {
    '1.4.4': [ '<b>Boards tab</b> — third page on the Skins tab with a gallery of board themes. Click a tile and the board artwork applies instantly. Searchable, like the premade piece sets, with full credits to the original artists.', '<b>More premade piece sets</b> — expanded the Lichess / Rhosgfx / Sharechess catalog so there are more options on the premade page without having to upload your own.', '<b>Auto-play no longer freezes against fast opponents</b> — if the opponent premoves or replies in under ~300 ms, their move was already on the board by the time the script finished playing yours, which left auto-play stuck waiting for a FEN change that had already happened. Auto-play now detects this case and keeps going immediately.' ],
    '1.4.3': [ '<b>Interface in 16 languages</b> — English, Español, Français, Deutsch, Português, Русский, Italiano, Polski, Nederlands, Türkçe, 简体中文, 日本語, 한국어, Українська, हिन्दी, العربية. First-run picker; switch any time in Settings → Language. Non-English dictionaries fetched on demand from CDN with a 24hr local cache, so the extension stays small.', '<b>Smart text fit</b> — translated labels that would be wider than the English equivalent scale their font-size down automatically, so long German, Dutch or Russian strings never push the opacity slider or anything else outside the panel borders.', '<b>Detection stats persist until the next game</b> — accuracy, best-move rate, CPL and suspicion score stay visible after the game ends, through the lobby, and only clear once the first move of a new game is tracked. Reviewing a finished game no longer wipes the numbers mid-review.' ],
    '1.4.2': [ '<b>Depth ≈ ELO estimate</b> under the Depth slider so you can see roughly how strong each depth level plays. Rough estimate, not official — looser for Lozza / Garbochess / p4wn.', '<b>Hidden icon now persists</b> across page reloads — hide it once and chess.com reloading the page won’t bring it back. While hidden, auto-play, arrows, and voice stay paused until you unhide. If you forget the hide keybind, open the browser console (F12) after loading and it prints the current bind.', '<b>Engine loader fixes</b> — Stockfish 10/17 and p4wn no longer sit on the loading animation forever. 60-second fetch and XHR timeouts, SharedArrayBuffer cleanly disabled on iOS Safari, and the overlay reliably hides when the asm.js fallback takes over.' ],
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
    const changelogKey = 'changelog_' + CURRENT_VERSION.replace(/\./g, '_');
    const langPack = (currentLang && LANGS[currentLang]) || {};
    const translated = Array.isArray(langPack[changelogKey]) ? langPack[changelogKey] : null;
    const items = (translated && translated.length) ? translated : (CHANGELOG[CURRENT_VERSION] || []);
    if (!items.length) return;
    const backdrop = document.createElement('div');
    backdrop.id = 'ch-whatsnew-backdrop';
    backdrop.className = 'visible';
    backdrop.innerHTML = `
      <div id="ch-whatsnew-modal" role="dialog" aria-modal="true" aria-labelledby="ch-whatsnew-title">
        <h2 id="ch-whatsnew-title">${t('wnTitle')} v${CURRENT_VERSION}</h2>
        <div class="ch-wn-sub">${t('wnSub')}</div>
        <ul>${items.map(it => `<li>${it}</li>`).join('')}</ul>
        <button id="ch-whatsnew-ok">${t('wnOk')}</button>
      </div>`;
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
  window.chessHelper._debug = () => ({
    version: CURRENT_VERSION,
    langMirror: LANG_MIRRORS[0],
    currentLang,
    langLoaded: !!LANGS[currentLang],
    hasChangelogKey: !!(LANGS[currentLang] && LANGS[currentLang]['changelog_' + CURRENT_VERSION.replace(/\./g, '_')]),
    firstBullet: (LANGS[currentLang] && LANGS[currentLang]['changelog_' + CURRENT_VERSION.replace(/\./g, '_')] || [''])[0].slice(0, 80)
  });
  if (!_wnDeferred) setTimeout(() => showWhatsNew(false), 400);
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
              el.style.setProperty('background-repeat', 'no-repeat', 'important');
              el.style.setProperty('background-position', 'center center', 'important');
              el.style.setProperty('background-origin', 'content-box', 'important');
              el.style.setProperty('background-clip', 'content-box', 'important');
              el.style.setProperty('padding', '0', 'important');
              if (skinMaskMode) {
                const orig = getOriginalPieceUrl(c);
                el.style.setProperty('-webkit-mask-image', `url("${orig}")`, 'important');
                el.style.setProperty('mask-image', `url("${orig}")`, 'important');
                el.style.setProperty('-webkit-mask-size', 'contain', 'important');
                el.style.setProperty('mask-size', 'contain', 'important');
                el.style.setProperty('-webkit-mask-repeat', 'no-repeat', 'important');
                el.style.setProperty('mask-repeat', 'no-repeat', 'important');
                el.style.setProperty('-webkit-mask-position', 'center', 'important');
                el.style.setProperty('mask-position', 'center', 'important');
                el.style.setProperty('background-size', 'cover', 'important');
              } else {
                el.style.setProperty('-webkit-mask-image', 'none', 'important');
                el.style.setProperty('mask-image', 'none', 'important');
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
        css += `${sel}{-webkit-mask-image:url("${orig}")!important;mask-image:url("${orig}")!important;-webkit-mask-size:contain!important;mask-size:contain!important;-webkit-mask-repeat:no-repeat!important;mask-repeat:no-repeat!important;-webkit-mask-position:center!important;mask-position:center!important;-webkit-mask-origin:content-box!important;mask-origin:content-box!important;background-image:url("${savedSkins[c]}")!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;background-origin:content-box!important;background-clip:content-box!important;padding:0!important;animation:none!important;transform-origin:center center!important}\n`;
      } else {
        css += `${sel}{background-image:url("${savedSkins[c]}")!important;background-size:contain!important;background-repeat:no-repeat!important;background-position:center center!important;background-origin:content-box!important;background-clip:content-box!important;padding:0!important;animation:none!important;transform-origin:center center!important}\n`;
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
    if (skinsPage === 3 && !boardCatalog) loadBoardCatalog();
  }
  panel.querySelector('#ch-sk-prev').onclick = () => setSkinsPage(skinsPage - 1);
  panel.querySelector('#ch-sk-next').onclick = () => setSkinsPage(skinsPage + 1);
  panel.querySelectorAll('#ch-sk-pager .ch-pager-dot').forEach(d => {
    d.onclick = () => setSkinsPage(+d.dataset.page);
  });
  setSkinsPage(1);
  const PREMADE_BASES = [
    'https://fastly.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@main',
    'https://cdn.jsdelivr.net/gh/ThatKidGlitchy/chess-engines@main',
    'https://raw.githubusercontent.com/ThatKidGlitchy/chess-engines/main'
  ];
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
      const hay = (s.name || '').toLowerCase();
      return `<div class="ch-premade-tile${active}" data-id="${esc(s.id)}" data-hay="${esc(hay)}" title="${esc(s.name)} — ${esc(s.author || 'unknown')} (${esc(s.license || '—')})"><img src="${s.thumb}" alt="" decoding="async"><div class="ch-premade-name">${esc(s.name)}</div></div>`;
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
      const show = !q || tile.dataset.hay.startsWith(q);
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
  function chFetchText(url) {
    return fetch(url, { cache: 'reload' }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).catch(() => new Promise((res, rej) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300) res(xhr.responseText); else rej(new Error('HTTP ' + xhr.status)); };
        xhr.onerror = () => rej(new Error('network error'));
        xhr.send();
      } catch (e) { rej(e); }
    }));
  }
  async function chLoadJSON(path) {
    let lastErr = null;
    const bust = '?v=' + Date.now();
    for (const base of PREMADE_BASES) {
      const url = base + path + bust;
      try {
        const txt = await chFetchText(url);
        const trimmed = txt.trimStart();
        if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) throw new Error('non-JSON response (got "' + trimmed.slice(0, 1) + '")');
        return JSON.parse(txt);
      } catch (e) {
        console.warn('[Chess Assist] mirror failed', new URL(url).host, e && e.message);
        lastErr = e;
      }
    }
    throw lastErr || new Error('all mirrors failed');
  }
  async function loadPremadeCatalog() {
    try {
      premadeCatalog = await chLoadJSON('/skins/catalog.json');
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
      const pieces = await chLoadJSON('/' + entry.file);
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
      if (skinMaskMode) {
        skinMaskMode = false;
        try { localStorage.setItem('ch-skin-mask', '0'); } catch {}
        const mt = panel.querySelector('#ch-skin-mask');
        if (mt) mt.checked = false;
      }
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
  let boardCatalog = null, activeBoardId = '';
  try { activeBoardId = localStorage.getItem('ch-board-active') || ''; } catch {}
  function buildBoardGrid() {
    const grid = panel.querySelector('#ch-board-grid');
    if (!grid || !boardCatalog) return;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    grid.innerHTML = boardCatalog.map(b => {
      const active = b.id === activeBoardId ? ' active' : '';
      const hay = (b.name || '').toLowerCase();
      return `<div class="ch-premade-tile${active}" data-id="${esc(b.id)}" data-hay="${esc(hay)}" title="${esc(b.name)} — ${esc(b.author || 'NikAgs')} (${esc(b.license || 'MIT')})"><img src="${b.thumb}" alt="" decoding="async"><div class="ch-premade-name">${esc(b.name)}</div></div>`;
    }).join('');
    grid.querySelectorAll('.ch-premade-tile').forEach(tile => {
      tile.onclick = () => applyBoard(tile.dataset.id);
    });
  }
  function filterBoardGrid(q) {
    const grid = panel.querySelector('#ch-board-grid');
    if (!grid) return;
    q = q.trim().toLowerCase();
    let visible = 0;
    grid.querySelectorAll('.ch-premade-tile').forEach(tile => {
      const show = !q || tile.dataset.hay.startsWith(q);
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
      empty.textContent = 'No boards match.';
      empty.style.display = '';
    } else if (empty) {
      empty.style.display = 'none';
    }
  }
  function refreshBoardActive() {
    const grid = panel.querySelector('#ch-board-grid');
    if (!grid) return;
    grid.querySelectorAll('.ch-premade-tile').forEach(t => t.classList.toggle('active', t.dataset.id === activeBoardId));
  }
  async function loadBoardCatalog() {
    try {
      boardCatalog = await chLoadJSON('/boards/catalog.json');
      buildBoardGrid();
    } catch (e) {
      const grid = panel.querySelector('#ch-board-grid');
      if (grid) grid.innerHTML = '<div class="ch-premade-empty" style="grid-column:1/-1;text-align:center;color:#e07040;font-size:11px;padding:20px 0;">Failed to load boards catalog.<br><span style="color:rgba(255,255,255,0.4);">' + String(e.message || e) + '</span></div>';
    }
  }
  async function applyBoard(id) {
    const entry = (boardCatalog || []).find(b => b.id === id);
    if (!entry) return;
    try {
      const board = await chLoadJSON('/' + entry.file);
      if (board.board) {
        if (board.board.startsWith('data:')) {
          savedSkins.board = board.board;
        } else {
          try {
            const svgText = await chFetchText(board.board + (board.board.includes('?') ? '&' : '?') + 'v=' + Date.now());
            const embedded = svgText.match(/<image[^>]*(?:xlink:)?href=["'](data:image\/[^"']+)["']/i);
            savedSkins.board = embedded ? embedded[1] : board.board;
          } catch {
            savedSkins.board = board.board;
          }
        }
      }
      delete savedSkins.lightTiles;
      delete savedSkins.darkTiles;
      try { localStorage.setItem('ch-skins', JSON.stringify(savedSkins)); } catch {}
      try { localStorage.setItem('ch-board-active', id); } catch {}
      activeBoardId = id;
      renderSkinTiles();
      applySkins();
      refreshBoardActive();
    } catch (e) {
      console.warn('[Chess Assist] Failed to apply board theme:', e);
    }
  }
  const boardSearch = panel.querySelector('#ch-board-search');
  if (boardSearch) {
    let searchTimer = null;
    boardSearch.oninput = e => {
      const v = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => filterBoardGrid(v), 120);
    };
  }
  panel.querySelector('#ch-board-clear').onclick = () => {
    delete savedSkins.board;
    delete savedSkins.lightTiles;
    delete savedSkins.darkTiles;
    try { localStorage.setItem('ch-skins', JSON.stringify(savedSkins)); } catch {}
    try { localStorage.removeItem('ch-board-active'); } catch {}
    activeBoardId = '';
    renderSkinTiles();
    applySkins();
    refreshBoardActive();
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
  function updateDepthEloLabel() {
    const el = panel.querySelector('#ch-depth-elo');
    if (!el) return;
    el.textContent = '≈ ' + depthToElo(ENGINE_DEPTH) + ' ELO';
  }
  panel.querySelector('#ch-depth').oninput = e => {
    ENGINE_DEPTH = parseInt(e.target.value);
    engineDepths[currentEngine] = ENGINE_DEPTH;
    panel.querySelector('#ch-depth-val').textContent = ENGINE_DEPTH;
    updateDepthEloLabel();
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
      el.textContent = t('pressKeys');
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
  const HIDE_TOGGLES = [
    { sel: '#ch-arrow',    key: 'showArrow' },
    { sel: '#ch-hidden',   key: 'hiddenArrow' },
    { sel: '#ch-auto',     key: 'autoPlay' },
    { sel: '#ch-opponent', key: 'showOpponent' },
    { sel: '#ch-eval',     key: 'showEval' },
    { sel: '#ch-voice',    key: 'voice' },
    { sel: '#ch-streamer', key: 'streamer' }
  ];
  let togglesBeforeHide = null;
  function toggleUI() {
    uiHidden = !uiHidden;
    root.style.display = uiHidden ? 'none' : '';
    saveSettings();
    if (uiHidden) {
      clearArrows();
      clearShading();
      clearOpponentArrow();
      stopVoice();
      togglesBeforeHide = {};
      for (const { sel, key } of HIDE_TOGGLES) {
        const cb = panel.querySelector(sel);
        if (!cb) continue;
        togglesBeforeHide[key] = !!cb.checked;
        if (cb.checked) {
          cb.checked = false;
          cb.dispatchEvent(new Event('change'));
        }
      }
    } else {
      if (togglesBeforeHide) {
        for (const { sel, key } of HIDE_TOGGLES) {
          if (!togglesBeforeHide[key]) continue;
          const cb = panel.querySelector(sel);
          if (!cb || cb.checked) continue;
          cb.checked = true;
          cb.dispatchEvent(new Event('change'));
        }
        togglesBeforeHide = null;
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
    return parts.join('+') || t('pressKeys');
  }
  function keyLabel(k) {
    if (!k) return t('pressKeys');
    const parts = [];
    if (k.ctrl) parts.push('Ctrl');
    if (k.alt) parts.push('Alt');
    if (k.shift) parts.push('Shift');
    if (k.meta) parts.push('Win');
    if (k.key) parts.push(prettyKey(k.key));
    return parts.join('+') || t('pressKeys');
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
        if (otherEl) otherEl.textContent = t('pressKeys');
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
      el.textContent = t('pressKeys');
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
    if (saved.uiHidden) {
      uiHidden = true;
      root.style.display = 'none';
    }
    updateDepthEloLabel();
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
  if (uiHidden) {
    try {
      const lbl = (binds && binds.hide) ? keyLabel(binds.hide) : 'not set';
      console.log('%c[Chess Assist] UI is hidden. If you forgot your hide keybind it was: ' + lbl, 'color:#81b64c;font-weight:bold;');
    } catch {}
  }
})();
