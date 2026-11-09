'use strict';
(() => {
  /* ============================================================
     Constantes
     ============================================================ */
  const KEY = 'sporttoday.v1';
  const REP_S = 2.5; // estimation : secondes par répétition
  const RING_C = 578.05; // 2π × 92 (rayon du cercle SVG)
  const DAY1 = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // index = getDay()
  const WEEK = [1, 2, 3, 4, 5, 6, 0]; // affichage lundi → dimanche
  const DOW = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const MON = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const DOW_S = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const DONE_C = '#3DDC97';
  const COLORS = ['#FF6B2C', '#8C7BFF', '#17C3A2', '#FFB020', '#FF4F9A', '#A3D63C', '#3FA2FF', '#C9CED6'];
  const S_ICONS = ['dumbbell', 'lotus', 'flame', 'zap', 'heart', 'activity', 'wind', 'mountain'];
  const SUGGEST = [
    'Pompes', 'Pompes inclinées', 'Pompes déclinées', 'Pompes diamant', 'Pompes piquées', 'Dips',
    'Squats', 'Squats sautés', 'Squat bulgare', 'Fentes', 'Fentes arrière', 'Fentes sautées', 'Chaise',
    'Pont fessier', 'Pont 1 jambe', 'Hip thrust', 'Mollets', 'Superman', 'Tractions', 'Rowing',
    'Burpees', 'Mountain climbers', 'Jumping jacks', 'Montées de genoux', 'Talons-fesses', 'Corde à sauter',
    'Rotations bras + bassin', 'Planche', 'Planche latérale', 'Planche dynamique', 'Crunchs', 'Russian twist',
    'Relevés de jambes', 'Bicycle crunch', 'Hollow hold', 'Dead bug', 'Bird dog', 'Hundred', 'Roll up',
    'Ciseaux', 'Swimming', 'Teaser', 'Respiration', 'Chat-vache', 'Enroulé de colonne', "Posture de l'enfant",
    'Chien tête en bas', 'Cobra', 'Fente basse', 'Ischios', 'Pigeon', 'Pectoraux', 'Torsion allongée',
    'Nuque', 'Papillon', 'Quadriceps', 'Épaules', 'Relâchement',
  ];

  /* ============================================================
     Icônes (SVG 24×24, trait)
     ============================================================ */
  const F = 'fill="currentColor" stroke="none"';
  const I = {
    play: `<path d="M7.5 4.6v14.8a1 1 0 0 0 1.52.85l12-7.4a1 1 0 0 0 0-1.7l-12-7.4A1 1 0 0 0 7.5 4.6Z" ${F}/>`,
    pause: `<rect x="6" y="4.5" width="4.2" height="15" rx="1.3" ${F}/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.3" ${F}/>`,
    skipF: `<path d="M5 5.6v12.8a1 1 0 0 0 1.56.83l9.3-6.4a1 1 0 0 0 0-1.66l-9.3-6.4A1 1 0 0 0 5 5.6Z" ${F}/><path d="M19.5 5v14"/>`,
    skipB: `<path d="M19 5.6v12.8a1 1 0 0 1-1.56.83l-9.3-6.4a1 1 0 0 1 0-1.66l9.3-6.4A1 1 0 0 1 19 5.6Z" ${F}/><path d="M4.5 5v14"/>`,
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.2 1.8M10 2.5h4M18.5 6l1.5-1.5"/>',
    hourglass: '<path d="M6 3h12M6 21h12M7 3v3.2a5 5 0 0 0 2.4 4.3L12 12l2.6-1.5A5 5 0 0 0 17 6.2V3M7 21v-3.2a5 5 0 0 1 2.4-4.3L12 12l2.6 1.5a5 5 0 0 1 2.4 4.3V21"/>',
    repeat: '<path d="m17 2 3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="m7 22-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
    arrows: '<path d="M7 4 3 8l4 4M3 8h18M17 12l4 4-4 4M21 16H3"/>',
    hash: '<path d="M5 9h15M4 15h15M10 3 8 21M16 3l-2 18"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    list: `<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.3" ${F}/><circle cx="4.5" cy="12" r="1.3" ${F}/><circle cx="4.5" cy="18" r="1.3" ${F}/>`,
    volume: '<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    vibrate: '<rect x="8" y="4" width="8" height="16" rx="2"/><path d="M4 8.5v7M20 8.5v7"/>',
    voice: '<path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 10v4"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    upload: '<path d="M12 15V4M7 9l5-5 5 5M4 20h16"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    flag: '<path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    // icônes de séance
    dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    lotus: '<path d="M12 20c-3.6 0-7.2-1.7-9-5 2.7-.9 5.6-.3 9 2.5 3.4-2.8 6.3-3.4 9-2.5-1.8 3.3-5.4 5-9 5Z"/><path d="M12 17.5c-2-1.9-3.2-4.5-3-7.8.9-1.4 1.9-2.6 3-3.7 1.1 1.1 2.1 2.3 3 3.7.2 3.3-1 5.9-3 7.8Z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3Z"/>',
  };
  const ic = (n, c = '') => `<svg class="i${c ? ' ' + c : ''}" viewBox="0 0 24 24" aria-hidden="true">${I[n] || ''}</svg>`;

  /* ============================================================
     Utilitaires
     ============================================================ */
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const pad = n => String(n).padStart(2, '0');
  const nm = it => (it.name || '').trim() || 'Exercice';
  const bn = b => (b.name || '').trim() || 'Bloc';
  const sn = s => (s.name || '').trim() || 'Séance';
  const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const clone = o => JSON.parse(JSON.stringify(o));
  const isKey = k => typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k);
  const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

  function fmtDur(s) {
    s = Math.round(s);
    if (s < 60) return s + '″';
    const m = Math.floor(s / 60), r = s % 60;
    return r ? `${m}′${pad(r)}` : m + '′';
  }
  function fmtClock(sec) {
    const s = Math.max(0, Math.ceil(sec - 1e-6));
    const m = Math.floor(s / 60), r = s % 60;
    return m ? `${m}:${pad(r)}` : String(r);
  }
  function fmtTotal(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, r = s % 60;
    return h ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
  }
  const fmtMin = s => Math.max(1, Math.round(s / 60)) + ' min';
  function spokenDur(s) {
    if (s < 60) return `${s} secondes`;
    const m = Math.floor(s / 60), r = s % 60;
    return `${m} minute${m > 1 ? 's' : ''}${r ? ' ' + r : ''}`;
  }
  function tgHTML(it) {
    const side = it.side ? ic('arrows', 'side') : '';
    return it.type === 'time'
      ? `<span>${fmtDur(it.value)}</span>${side}`
      : `<span><small class="x">×</small>${it.value}</span>${side}`;
  }

  /* ============================================================
     Données
     ============================================================ */
  const ex = (name, type, value, side = false) => ({ id: uid(), name, type, value, side });
  const blk = (name, rounds, restEx, restRound, restAfter, items) => ({ id: uid(), name, rounds, restEx, restRound, restAfter, items });

  function defaultSessions() {
    return [
      {
        id: uid(), name: 'Muscu', icon: 'dumbbell', color: COLORS[0], days: [1, 3, 5],
        blocks: [
          blk('Échauffement', 1, 0, 0, 15, [
            ex('Jumping jacks', 'time', 60),
            ex('Rotations bras + bassin', 'time', 30),
            ex('Montées de genoux', 'time', 30),
          ]),
          blk('Bloc 1', 3, 0, 45, 60, [
            ex('Pompes', 'reps', 15),
            ex('Squats', 'reps', 20),
          ]),
          blk('Bloc 2', 3, 0, 45, 60, [
            ex('Pompes piquées', 'reps', 12),
            ex('Pont fessier', 'reps', 20),
            ex('Superman', 'reps', 15),
          ]),
          blk('Abdos', 3, 0, 30, 0, [
            ex('Russian twist', 'reps', 20, true),
            ex('Relevés de jambes', 'reps', 15),
            ex('Crunchs', 'reps', 25),
            ex('Planche', 'time', 45),
          ]),
        ],
      },
      {
        id: uid(), name: 'Pilates', icon: 'lotus', color: COLORS[1], days: [2, 4, 6, 0],
        blocks: [
          blk('Éveil', 1, 0, 0, 0, [
            ex('Respiration', 'time', 60),
            ex('Chat-vache', 'reps', 10),
            ex('Enroulé de colonne', 'reps', 6),
          ]),
          blk('Centre', 2, 0, 30, 30, [
            ex('Hundred', 'time', 60),
            ex('Dead bug', 'reps', 10, true),
            ex('Roll up', 'reps', 8),
            ex('Ciseaux', 'reps', 10, true),
          ]),
          blk('Gainage', 2, 0, 30, 30, [
            ex('Planche latérale', 'time', 30, true),
            ex('Bird dog', 'reps', 10, true),
            ex('Pont 1 jambe', 'reps', 8, true),
            ex('Swimming', 'time', 30),
          ]),
          blk('Étirements', 1, 0, 0, 0, [
            ex('Fente basse', 'time', 45, true),
            ex('Ischios', 'time', 60),
            ex('Pigeon', 'time', 45, true),
            ex('Pectoraux', 'time', 45, true),
            ex('Torsion allongée', 'time', 45, true),
            ex('Nuque', 'time', 30, true),
          ]),
          blk('Relâchement', 1, 0, 0, 0, [
            ex("Posture de l'enfant", 'time', 60),
            ex('Relâchement', 'time', 120),
          ]),
        ],
      },
    ];
  }
  const DEFAULT_SETTINGS = { sound: true, vibe: true, voice: false, prep: 5, pace: 0 };

  function normalize(d) {
    const out = {
      v: 1,
      sessions: Array.isArray(d.sessions) ? d.sessions : [],
      settings: { ...DEFAULT_SETTINGS, ...(d.settings || {}) },
      log: [],
      start: '',
    };
    out.sessions = out.sessions.filter(s => s && typeof s === 'object').map(s => ({
      id: String(s.id || uid()),
      name: String(s.name ?? 'Séance'),
      icon: S_ICONS.includes(s.icon) ? s.icon : 'flame',
      color: /^#[0-9a-f]{6}$/i.test(s.color) ? s.color : COLORS[0],
      days: Array.isArray(s.days) ? s.days.map(Number).filter(n => n >= 0 && n <= 6) : [],
      blocks: (Array.isArray(s.blocks) ? s.blocks : []).map(b => ({
        id: String(b.id || uid()),
        name: String(b.name ?? 'Bloc'),
        rounds: clamp(Math.round(+b.rounds) || 1, 1, 30),
        restEx: clamp(Math.round(+b.restEx) || 0, 0, 900),
        restRound: clamp(Math.round(+b.restRound) || 0, 0, 900),
        restAfter: clamp(Math.round(+b.restAfter) || 0, 0, 900),
        items: (Array.isArray(b.items) ? b.items : []).map(it => {
          const type = it.type === 'time' ? 'time' : 'reps';
          return {
            id: String(it.id || uid()),
            name: String(it.name ?? ''),
            type,
            value: clamp(Math.round(+it.value) || (type === 'time' ? 30 : 10), type === 'time' ? 5 : 1, type === 'time' ? 3600 : 500),
            side: !!it.side,
          };
        }),
      })),
    }));
    // Historique : chaque entrée garde son nom / sa couleur / son icône,
    // elle reste donc intacte si la séance est modifiée ou supprimée.
    out.log = (Array.isArray(d.log) ? d.log : []).filter(l => l && isKey(l.d)).map(l => {
      const s = out.sessions.find(x => x.id === l.id);
      return {
        k: String(l.k || uid()),
        id: String(l.id || ''),
        d: l.d,
        t: Math.max(0, Math.round(+l.t) || 0),
        n: String(l.n ?? (s ? sn(s) : 'Séance')),
        c: /^#[0-9a-f]{6}$/i.test(l.c) ? l.c : (s ? s.color : DONE_C),
        ic: S_ICONS.includes(l.ic) ? l.ic : (s ? s.icon : 'activity'),
        m: !!l.m,
        at: +l.at || 0,
      };
    });
    // Début du suivi : les croix ne s'affichent qu'à partir de ce jour.
    const firstLog = out.log.reduce((a, l) => (l.d < a ? l.d : a), dateKey());
    out.start = isKey(d.start) && d.start <= firstLog ? d.start : firstLog;
    return out;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && Array.isArray(d.sessions)) return normalize(d);
      }
    } catch (e) { /* stockage indisponible */ }
    return { v: 1, sessions: defaultSessions(), settings: { ...DEFAULT_SETTINGS }, log: [], start: dateKey() };
  }
  let state = load();

  let saveT = 0;
  function flush() {
    clearTimeout(saveT); saveT = 0;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* plein ou bloqué */ }
  }
  function save() { clearTimeout(saveT); saveT = setTimeout(flush, 200); }
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

  const findS = id => state.sessions.find(s => s.id === id);

  /* ============================================================
     Séance → suite d'étapes chronométrées
     ============================================================ */
  function buildSteps(s, st) {
    const pace = st.pace | 0, prep = st.prep | 0;
    const blocks = s.blocks.filter(b => b.items.length);
    const raw = [];
    blocks.forEach((b, bi) => {
      const R = clamp(b.rounds | 0, 1, 30);
      for (let r = 0; r < R; r++) {
        b.items.forEach((it, ii) => {
          const w = { kind: 'work', it, b, bi, r, R };
          if (it.type === 'time') {
            if (it.side) {
              raw.push({ ...w, dur: it.value, side: 1 });
              if (prep) raw.push({ kind: 'switch', dur: prep, it, b, bi, r, R });
              raw.push({ ...w, dur: it.value, side: 2 });
            } else raw.push({ ...w, dur: it.value });
          } else {
            raw.push({ ...w, reps: it.value, dur: pace ? it.value * pace * (it.side ? 2 : 1) : 0 });
          }
          if (ii < b.items.length - 1 && b.restEx > 0) raw.push({ kind: 'rest', dur: b.restEx, b, bi, r, R });
        });
        if (r < R - 1 && b.restRound > 0) raw.push({ kind: 'rest', dur: b.restRound, b, bi, r, R });
      }
      if (bi < blocks.length - 1 && b.restAfter > 0) raw.push({ kind: 'rest', dur: b.restAfter, b, bi, r: R - 1, R });
    });
    // Courte préparation avant un exercice chronométré qui n'est pas précédé d'un repos.
    const out = [];
    for (const x of raw) {
      const prev = out[out.length - 1];
      if (x.kind === 'work' && x.dur && prep && (!prev || prev.kind === 'work')) {
        out.push({ kind: 'prep', dur: prep, b: x.b, bi: x.bi, r: x.r, R: x.R });
      }
      out.push(x);
    }
    return { steps: out, blocks };
  }

  function estimate(s) {
    return buildSteps(s, state.settings).steps
      .reduce((a, x) => a + (x.dur || x.reps * REP_S * (x.it.side ? 2 : 1)), 0);
  }
  const countEx = s => s.blocks.reduce((a, b) => a + b.items.length, 0);

  /* ============================================================
     Son, vibration, voix, écran allumé
     ============================================================ */
  const Snd = {
    ctx: null,
    unlock() {
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          this.ctx = new AC();
        }
        if (this.ctx.state !== 'running') this.ctx.resume();
        const b = this.ctx.createBuffer(1, 1, 22050), src = this.ctx.createBufferSource();
        src.buffer = b; src.connect(this.ctx.destination); src.start(0);
      } catch (e) { /* audio indisponible */ }
    },
    tone(f, d, at = 0, type = 'sine', vol = 0.28) {
      const c = this.ctx;
      if (!c || !state.settings.sound) return;
      try {
        if (c.state !== 'running') c.resume();
        const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(c.destination);
        o.start(t); o.stop(t + d + 0.03);
      } catch (e) { /* ignore */ }
    },
    tick() { this.tone(880, 0.1, 0, 'sine', 0.3); },
    go() { this.tone(1318, 0.38, 0, 'triangle', 0.34); },
    rest() { this.tone(784, 0.16); this.tone(523, 0.3, 0.16); },
    soft() { this.tone(660, 0.14, 0, 'sine', 0.2); },
    rep() { this.tone(1500, 0.035, 0, 'square', 0.05); },
    done() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.26, i * 0.13, 'triangle', 0.3)); },
  };
  const vib = p => { if (state.settings.vibe && navigator.vibrate) try { navigator.vibrate(p); } catch (e) { /* ignore */ } };

  let frVoice = null;
  function pickVoice() {
    try {
      const vs = speechSynthesis.getVoices();
      frVoice = vs.find(v => /^fr[-_]FR/i.test(v.lang) && v.localService) || vs.find(v => /^fr/i.test(v.lang)) || null;
    } catch (e) { frVoice = null; }
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    try { speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) { /* ignore */ }
  }
  function say(text, force) {
    if ((!state.settings.voice && !force) || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR'; u.rate = 1.05;
      if (frVoice) u.voice = frVoice;
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }
  const hush = () => { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } };

  let wl = null;
  async function wakeOn() {
    try {
      if ('wakeLock' in navigator && !wl && !document.hidden) {
        wl = await navigator.wakeLock.request('screen');
        wl.addEventListener('release', () => { wl = null; });
      }
    } catch (e) { wl = null; }
  }
  function wakeOff() { try { wl && wl.release(); } catch (e) { /* ignore */ } wl = null; }

  /* ============================================================
     Navigation (pile + historique, le bouton retour marche)
     ============================================================ */
  const $view = document.getElementById('view');
  const $sheet = document.getElementById('sheet');
  const $toast = document.getElementById('toast');
  const nav = [{ v: 'home' }];
  let useHist = true; // désactivé si l'historique du navigateur est indisponible
  try { history.replaceState({ d: 0 }, ''); } catch (e) { useHist = false; }

  const topE = () => nav[nav.length - 1];
  const baseE = () => { for (let i = nav.length - 1; i >= 0; i--) if (!nav[i].sheet) return nav[i]; return nav[0]; };

  let pend = null; // retour en cours (l'historique répond en asynchrone)
  const queued = [];
  function push(e) {
    if (pend) { queued.push(e); return; }
    nav.push(e);
    if (useHist) { try { history.pushState({ d: nav.length - 1 }, ''); } catch (er) { useHist = false; } }
    render();
  }
  function popTo(d) {
    while (nav.length - 1 > d) {
      const t = nav.pop();
      if (t.v === 'play') stopPlayer();
    }
    render();
    while (queued.length) push(queued.shift());
  }
  function back(n = 1) {
    n = Math.min(n, nav.length - 1);
    if (n <= 0 || pend) return;
    const d = nav.length - 1 - n;
    if (useHist) {
      try {
        // Filet de sécurité si le navigateur ne renvoie jamais l'événement.
        pend = { t: setTimeout(() => { pend = null; useHist = false; popTo(d); }, 700) };
        history.go(-n);
        return;
      } catch (e) { clearTimeout(pend.t); pend = null; useHist = false; }
    }
    popTo(d);
  }
  addEventListener('popstate', e => {
    if (!useHist) return;
    if (pend) { clearTimeout(pend.t); pend = null; }
    const d = e.state && typeof e.state.d === 'number' ? e.state.d : 0;
    const pi = nav.findIndex(x => x.v === 'play');
    if (pi >= 0 && d < pi && P.on && !P.finished) {
      // Retour pendant une séance : on met en pause au lieu de quitter.
      try { history.pushState({ d: nav.length - 1 }, ''); } catch (er) { useHist = false; }
      openPause();
      return;
    }
    popTo(d);
  });

  /* ============================================================
     Rendu
     ============================================================ */
  let lastBase = '';
  function render() {
    const base = baseE(), t = topE();
    const key = base.v + ':' + (base.sid || '');
    renderView(base);
    if (key !== lastBase) { window.scrollTo(0, 0); lastBase = key; }
    renderSheet(t.sheet ? t : null);
  }

  function renderView(base = baseE()) {
    document.body.classList.toggle('playing', base.v === 'play');
    if (base.v === 'play') {
      if (!document.getElementById('pl')) buildPlayer();
      return;
    }
    if (base.v === 'edit' && findS(base.sid)) {
      $view.innerHTML = editorHTML(findS(base.sid));
      const t = topE();
      if (t.sheet === 'ex') { const el = $view.querySelector(`.item[data-id="${t.id}"]`); if (el) el.classList.add('hl'); }
    } else if (base.v === 'hist') $view.innerHTML = histHTML(base);
    else $view.innerHTML = homeHTML();
  }

  /* ---------- Accueil ---------- */
  function homeHTML() {
    const now = new Date(), dow = now.getDay();
    const hero = state.sessions.find(s => s.days.includes(dow));
    const others = state.sessions.filter(s => s !== hero);
    return `<main class="home wrap">
      <header class="top">
        <p class="date"><b>${DOW[dow]}</b> ${now.getDate()} ${MON[now.getMonth()]}</p>
        <span class="top-acts">
          <button class="ib" data-a="hist" aria-label="Suivi">${ic('calendar')}</button>
          <button class="ib" data-a="settings" aria-label="Réglages">${ic('sliders')}</button>
        </span>
      </header>
      ${weekHTML(now)}
      ${hero ? heroHTML(hero) : ''}
      <section class="list">
        ${others.map(rowHTML).join('')}
        <button class="add-row" data-a="newSession" aria-label="Nouvelle séance">${ic('plus')}</button>
      </section>
    </main>`;
  }

  const isMiss = (key, today, has) => !has && key < today && key >= state.start;
  const markHTML = (kind, cls = '') => `<span class="mark ${kind} ${cls}">${ic(kind === 'ok' ? 'check' : kind === 'ko' ? 'x' : 'calendar')}</span>`;

  function weekHTML(now) {
    const today = dateKey(now);
    const done = new Set(state.log.map(l => l.d));
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
    let html = '';
    for (let k = 0; k < 7; k++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + k);
      const key = dateKey(d), gd = d.getDay(), has = done.has(key);
      let mark;
      if (has) mark = markHTML('ok');
      else if (isMiss(key, today, has)) mark = markHTML('ko');
      else {
        const planned = state.sessions.filter(s => s.days.includes(gd));
        mark = `<span class="dots">${planned.map(s => `<i style="--c:${s.color}"></i>`).join('') || '<i class="none"></i>'}</span>`;
      }
      const cls = key === today ? 'today' : key < today ? 'past' : '';
      html += `<span class="day ${cls}"><span class="dl">${DAY1[gd]}</span>${mark}<span class="dn">${d.getDate()}</span></span>`;
    }
    return `<button class="week" data-a="hist" aria-label="Suivi">${html}</button>`;
  }

  function heroHTML(s) {
    const done = state.log.some(l => l.id === s.id && l.d === dateKey());
    return `<article class="hero" style="--c:${s.color}">
      ${done ? `<span class="hero-done" aria-label="Fait">${ic('check')}</span>` : ''}
      <button class="hero-open" data-a="open" data-id="${s.id}">
        <span class="badge">${ic(s.icon)}</span>
        <span class="hero-txt">
          <span class="hero-name">${esc(sn(s))}</span>
          <span class="meta"><span>${ic('clock')}${fmtMin(estimate(s))}</span><span>${ic('list')}${countEx(s)}</span></span>
        </span>
      </button>
      <button class="play-xl" data-a="play" data-id="${s.id}" aria-label="Démarrer">${ic('play')}</button>
    </article>`;
  }

  function rowHTML(s) {
    const days = WEEK.filter(d => s.days.includes(d)).map(d => DAY1[d]).join(' ');
    return `<div class="row" style="--c:${s.color}">
      <button class="row-open" data-a="open" data-id="${s.id}">
        <span class="badge">${ic(s.icon)}</span>
        <span class="row-txt">
          <span class="row-name">${esc(sn(s))}</span>
          <span class="row-meta"><span>${fmtMin(estimate(s))}</span>${days ? `<span class="mini-days">${days}</span>` : ''}</span>
        </span>
      </button>
      <button class="row-play" data-a="play" data-id="${s.id}" aria-label="Démarrer">${ic('play')}</button>
    </div>`;
  }

  /* ---------- Suivi ---------- */
  const fmtHM = sec => { const m = Math.round(sec / 60), h = Math.floor(m / 60); return h ? `${h}h${pad(m % 60)}` : `${m} min`; };
  function streak(done) {
    const d = new Date();
    if (!done.has(dateKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (done.has(dateKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const logRow = (l, withDate) => {
    const d = parseKey(l.d);
    return `${withDate ? `<span class="lg-d">${DOW_S[d.getDay()]} ${d.getDate()}</span>` : ''}<span class="badge">${ic(l.ic)}</span><span class="lg-n">${esc(l.n)}</span><span class="lg-t">${l.t ? fmtHM(l.t) : ''}</span>`;
  };

  function histHTML(e) {
    const now = new Date(), today = dateKey(now);
    const { y, mo } = e;
    const done = new Set(state.log.map(l => l.d));
    const prefix = `${y}-${pad(mo + 1)}-`;
    const nDays = new Date(y, mo + 1, 0).getDate();
    const offset = (new Date(y, mo, 1).getDay() + 6) % 7;
    let cells = WEEK.map(d => `<span class="cal-h">${DAY1[d]}</span>`).join('') + '<span></span>'.repeat(offset);
    let okN = 0, koN = 0;
    for (let n = 1; n <= nDays; n++) {
      const key = prefix + pad(n), has = done.has(key);
      let cls = '', mark = '';
      if (has) { cls = 'ok'; mark = ic('check'); okN++; }
      else if (isMiss(key, today, has)) { cls = 'ko'; mark = ic('x'); koN++; }
      else if (key > today) cls = 'fut';
      if (key === today) cls += ' today';
      cells += key > today
        ? `<span class="cd ${cls}"><b>${n}</b></span>`
        : `<button class="cd ${cls}" data-a="daySheet" data-id="${key}"><b>${n}</b>${mark}</button>`;
    }
    const entries = state.log.filter(l => l.d.startsWith(prefix))
      .sort((a, b) => b.d.localeCompare(a.d) || b.at - a.at);
    const secs = entries.reduce((a, l) => a + l.t, 0);
    const isCur = y === now.getFullYear() && mo === now.getMonth();
    return `<main class="hist wrap">
      <header class="ed-top">
        <button class="ib" data-a="back" aria-label="Retour">${ic('chevL')}</button>
        <span class="ed-title"><span class="badge" style="--c:var(--done)">${ic('calendar')}</span><h1>Suivi</h1></span>
        <span class="streak" aria-label="Série">${ic('flame')}${streak(done)}</span>
      </header>
      <div class="month-nav">
        <button class="ib" data-a="month" data-d="-1" aria-label="Mois précédent">${ic('chevL')}</button>
        <h2>${MONTHS[mo]} <span>${y}</span></h2>
        <button class="ib" data-a="month" data-d="1" aria-label="Mois suivant"${isCur ? ' disabled' : ''}>${ic('chevR')}</button>
      </div>
      <div class="stats">
        <div class="stat st-ok"><span class="stat-v">${ic('check')}${okN}</span><span class="stat-l">faits</span></div>
        <div class="stat st-ko"><span class="stat-v">${ic('x')}${koN}</span><span class="stat-l">ratés</span></div>
        <div class="stat"><span class="stat-v">${ic('clock')}${fmtHM(secs)}</span><span class="stat-l">temps</span></div>
      </div>
      <div class="cal">${cells}</div>
      ${entries.length ? `<ul class="log">${entries.map(l => `<li><button class="lg" data-a="daySheet" data-id="${l.d}" style="--c:${l.c}">${logRow(l, true)}</button></li>`).join('')}</ul>` : ''}
    </main>`;
  }

  /* ---------- Éditeur ---------- */
  function editorHTML(s) {
    const est = estimate(s);
    return `<main class="editor wrap" style="--c:${s.color}">
      <header class="ed-top">
        <button class="ib" data-a="back" aria-label="Retour">${ic('chevL')}</button>
        <button class="ed-title" data-a="sessionSheet">
          <span class="badge">${ic(s.icon)}</span>
          <h1>${esc(sn(s))}</h1>
        </button>
      </header>
      <div class="ed-meta">
        <span class="est">${ic('clock')}${fmtMin(est)}</span>
        <button class="days-btn" data-a="sessionSheet" aria-label="Jours">${WEEK.map(d => `<i class="${s.days.includes(d) ? 'on' : ''}">${DAY1[d]}</i>`).join('')}</button>
      </div>
      <div class="blocks">${s.blocks.map((b, bi) => blockHTML(s, b, bi)).join('')}</div>
      <button class="add-block" data-a="addBlock" aria-label="Ajouter un bloc">${ic('plus')}${ic('layers')}</button>
      <div class="ed-play"><button class="play-bar" data-a="play" data-id="${s.id}">${ic('play')}<span>${fmtMin(est)}</span></button></div>
    </main>`;
  }

  function blockHTML(s, b, bi) {
    let items = '';
    b.items.forEach((it, ii) => {
      if (ii && b.restEx) items += `<li class="gap">${ic('hourglass')}${fmtDur(b.restEx)}</li>`;
      items += `<li><button class="item" data-a="exSheet" data-id="${it.id}"><span class="nm">${esc(nm(it))}</span><span class="tg">${tgHTML(it)}</span></button></li>`;
    });
    if (!b.items.length) items = `<li class="empty">${ic('list')}</li>`;
    const chips = b.rounds > 1
      ? `<span class="chip">${ic('repeat')}${b.rounds}</span>${b.restRound ? `<span class="chip rest">${ic('hourglass')}${fmtDur(b.restRound)}</span>` : ''}`
      : '';
    const after = bi < s.blocks.length - 1 && b.restAfter
      ? `<div class="between">${ic('hourglass')}${fmtDur(b.restAfter)}</div>` : '';
    return `<section class="block">
      <button class="block-head" data-a="blockSheet" data-id="${b.id}">
        <h2>${esc(bn(b))}</h2><span class="chips">${chips}</span>
      </button>
      <ol class="items">${items}</ol>
      <button class="add-item" data-a="addEx" data-id="${b.id}" aria-label="Ajouter un exercice">${ic('plus')}</button>
    </section>${after}`;
  }

  /* ---------- Feuilles (panneaux du bas) ---------- */
  function ctx() {
    const t = topE();
    if (!t || !t.sheet) return null;
    if (t.sheet === 'settings') return { t, obj: state.settings };
    if (t.sheet === 'day') return { t, obj: {} };
    const s = findS(t.sid);
    if (!s) return null;
    if (t.sheet === 'session') return { t, s, obj: s };
    if (t.sheet === 'block') {
      const bi = s.blocks.findIndex(x => x.id === t.id);
      return bi < 0 ? null : { t, s, bi, b: s.blocks[bi], obj: s.blocks[bi] };
    }
    if (t.sheet === 'ex') {
      for (let bi = 0; bi < s.blocks.length; bi++) {
        const b = s.blocks[bi], ii = b.items.findIndex(x => x.id === t.id);
        if (ii >= 0) return { t, s, bi, b, ii, it: b.items[ii], obj: b.items[ii] };
      }
    }
    return null;
  }

  const SPEC = {
    rounds: { min: 1, max: 30, step: 1 },
    restEx: { min: 0, max: 900, time: true },
    restRound: { min: 0, max: 900, time: true },
    restAfter: { min: 0, max: 900, time: true },
    prep: { min: 0, max: 15, step: 1 },
    pace: { min: 0, max: 6, step: 1 },
  };
  const spec = (k, o) => k === 'value'
    ? (o.type === 'time' ? { min: 5, max: 3600, time: true } : { min: 1, max: 500, step: 1 })
    : SPEC[k];
  function stepVal(v, d, sp) {
    if (sp.time) {
      const inc = d > 0 ? (v < 60 ? 5 : v < 300 ? 15 : 30) : (v <= 60 ? 5 : v <= 300 ? 15 : 30);
      v = d > 0 ? (Math.floor(v / inc) + 1) * inc : (Math.ceil(v / inc) - 1) * inc;
    } else v += d * sp.step;
    return clamp(v, sp.min, sp.max);
  }
  function fmtField(k, v, o) {
    if (k === 'value') return o.type === 'time' ? fmtDur(v) : String(v);
    if (k === 'rounds') return '×' + v;
    if (k === 'prep') return v ? v + '″' : '0';
    if (k === 'pace') return v ? v + '″' : '—';
    return v ? fmtDur(v) : '0';
  }
  const stepperHTML = (k, o, cls = '') => `<div class="stepper ${cls}">
      <button data-a="step" data-k="${k}" data-d="-1" aria-label="Moins">${ic('minus')}</button>
      <output data-val="${k}">${fmtField(k, o[k], o)}</output>
      <button data-a="step" data-k="${k}" data-d="1" aria-label="Plus">${ic('plus')}</button>
    </div>`;
  const fieldHTML = (icon, label, k, o, cls = '') => `<div class="field">${ic(icon, cls)}<span class="lbl">${label}</span>${stepperHTML(k, o)}</div>`;
  const tglHTML = (icon, label, k, on) => `<button class="tgl" data-a="toggle" data-k="${k}" aria-pressed="${!!on}">${ic(icon)}<span>${label}</span><i class="sw"></i></button>`;
  const okHTML = () => `<button class="ok" data-a="back" aria-label="Valider">${ic('check')}</button>`;

  function quickHTML(it) {
    const q = it.type === 'time' ? [15, 20, 30, 45, 60, 90, 120] : [5, 8, 10, 12, 15, 20, 25, 30];
    return q.map(v => `<button data-a="setVal" data-v="${v}" class="${it.value === v ? 'on' : ''}">${it.type === 'time' ? fmtDur(v) : v}</button>`).join('');
  }

  function sheetBody(c) {
    const t = c.t;
    if (t.sheet === 'ex') {
      const it = c.it, time = it.type === 'time';
      return `<input class="name-in" id="f-name" data-bind="name" value="${esc(it.name)}" placeholder="Exercice" list="exlist" autocomplete="off" autocapitalize="sentences" enterkeyhint="done">
        <div class="seg" role="group">
          <button data-a="setType" data-v="reps" aria-pressed="${!time}">${ic('hash')}<span>Reps</span></button>
          <button data-a="setType" data-v="time" aria-pressed="${time}">${ic('timer')}<span>Temps</span></button>
        </div>
        ${stepperHTML('value', it, 'big')}
        <div class="quick">${quickHTML(it)}</div>
        ${tglHTML('arrows', 'Par côté', 'side', it.side)}
        <div class="acts">
          <button class="ib" data-a="moveEx" data-d="-1" aria-label="Monter">${ic('up')}</button>
          <button class="ib" data-a="moveEx" data-d="1" aria-label="Descendre">${ic('down')}</button>
          <button class="ib" data-a="dupEx" aria-label="Dupliquer">${ic('copy')}</button>
          <button class="ib danger" data-a="delEx" aria-label="Supprimer">${ic('trash')}</button>
          ${okHTML()}
        </div>`;
    }
    if (t.sheet === 'block') {
      const b = c.b;
      return `<input class="name-in" id="f-name" data-bind="name" value="${esc(b.name)}" placeholder="Bloc" autocomplete="off" autocapitalize="sentences" enterkeyhint="done">
        <div class="fields">
          ${fieldHTML('repeat', 'Tours', 'rounds', b)}
          ${fieldHTML('hourglass', 'Entre exos', 'restEx', b, 'rest')}
          ${fieldHTML('hourglass', 'Entre tours', 'restRound', b, 'rest')}
          ${fieldHTML('hourglass', 'Après le bloc', 'restAfter', b, 'rest')}
        </div>
        <div class="acts">
          <button class="ib" data-a="moveBlock" data-d="-1" aria-label="Monter">${ic('up')}</button>
          <button class="ib" data-a="moveBlock" data-d="1" aria-label="Descendre">${ic('down')}</button>
          <button class="ib" data-a="dupBlock" aria-label="Dupliquer">${ic('copy')}</button>
          <button class="ib danger" data-a="delBlock" aria-label="Supprimer">${ic('trash')}</button>
          ${okHTML()}
        </div>`;
    }
    if (t.sheet === 'session') {
      const s = c.s;
      return `<input class="name-in" id="f-name" data-bind="name" value="${esc(s.name)}" placeholder="Séance" autocomplete="off" autocapitalize="sentences" enterkeyhint="done">
        <div class="pick days">${WEEK.map(d => `<button data-a="toggleDay" data-v="${d}" aria-pressed="${s.days.includes(d)}">${DAY1[d]}</button>`).join('')}</div>
        <div class="pick icons">${S_ICONS.map(n => `<button data-a="setIcon" data-v="${n}" aria-pressed="${s.icon === n}" aria-label="${n}">${ic(n)}</button>`).join('')}</div>
        <div class="pick colors">${COLORS.map(col => `<button data-a="setColor" data-v="${col}" style="--sw:${col}" aria-pressed="${s.color === col}" aria-label="${col}"></button>`).join('')}</div>
        <div class="acts">
          <button class="ib" data-a="dupSession" aria-label="Dupliquer">${ic('copy')}</button>
          <button class="ib danger" data-a="delSession" aria-label="Supprimer">${ic('trash')}</button>
          ${okHTML()}
        </div>`;
    }
    if (t.sheet === 'day') {
      const key = t.id, d = parseKey(key), today = dateKey();
      const list = state.log.filter(l => l.d === key).sort((a, b) => a.at - b.at);
      const kind = list.length ? 'ok' : isMiss(key, today, false) ? 'ko' : 'none';
      const opts = [...state.sessions.map(s => ({ id: s.id, n: sn(s), c: s.color, ic: s.icon })), { id: '', n: 'Sport', c: DONE_C, ic: 'activity' }];
      return `<div class="day-head">${markHTML(kind, 'big')}<h2>${DOW[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}</h2></div>
        ${list.length ? `<ul class="log">${list.map(l => `<li class="lg" style="--c:${l.c}">${logRow(l, false)}<button class="ib danger" data-a="delLog" data-id="${l.k}" aria-label="Supprimer">${ic('trash')}</button></li>`).join('')}</ul>` : ''}
        ${key <= today ? `<div class="add-log">${opts.map(o => `<button data-a="addLog" data-id="${o.id}" style="--c:${o.c}"><span class="badge">${ic(o.ic)}</span><span class="al-n">${esc(o.n)}</span>${ic('plus')}</button>`).join('')}</div>` : ''}
        <div class="acts">${okHTML()}</div>`;
    }
    if (t.sheet === 'settings') {
      const st = state.settings;
      return `<div class="fields">
          ${tglHTML('volume', 'Son', 'sound', st.sound)}
          ${tglHTML('vibrate', 'Vibration', 'vibe', st.vibe)}
          ${tglHTML('voice', 'Voix', 'voice', st.voice)}
          ${fieldHTML('timer', 'Préparation', 'prep', st)}
          ${fieldHTML('hash', 'Reps auto', 'pace', st)}
        </div>
        <div class="data-row">
          <button data-a="exportData">${ic('download')}<span>Export</span></button>
          <button data-a="importData">${ic('upload')}<span>Import</span></button>
          <button data-a="resetData">${ic('reset')}<span>Défaut</span></button>
        </div>
        <div class="acts">${okHTML()}</div>`;
    }
    return '';
  }

  let sheetKey = null, sheetT = 0;
  function renderSheet(t) {
    document.body.classList.toggle('sheet-open', !!t);
    if (!t) {
      if (sheetKey) {
        sheetKey = null;
        $sheet.classList.remove('open');
        clearTimeout(sheetT);
        sheetT = setTimeout(() => { if (!sheetKey) $sheet.innerHTML = ''; }, 320);
      }
      return;
    }
    const c = ctx();
    if (!c) { back(); return; }
    const key = t.sheet + ':' + (t.id || '');
    const color = c.s ? c.s.color : t.sheet === 'day' ? DONE_C : (state.sessions[0] ? state.sessions[0].color : COLORS[0]);
    if (key !== sheetKey) {
      clearTimeout(sheetT);
      $sheet.classList.remove('open');
      $sheet.innerHTML = `<div class="scrim" data-a="back"></div><div class="sheet" role="dialog" aria-modal="true" style="--c:${color}"><div class="grab"></div><div class="sheet-body">${sheetBody(c)}</div></div>`;
      sheetKey = key;
      void $sheet.offsetWidth;
      $sheet.classList.add('open');
      if (t.isNew) {
        const inp = $sheet.querySelector('#f-name');
        if (inp) { try { inp.focus({ preventScroll: true }); inp.select(); } catch (e) { /* ignore */ } }
      }
      if (t.sheet === 'ex' || t.sheet === 'block') setTimeout(() => reveal(t.id), 60);
    } else refreshSheet();
  }
  function refreshSheet() {
    const c = ctx();
    const body = $sheet.querySelector('.sheet-body');
    if (!c || !body) return;
    body.innerHTML = sheetBody(c);
    const sh = $sheet.querySelector('.sheet');
    if (sh && c.s) sh.style.setProperty('--c', c.s.color);
  }

  // Fait apparaître la ligne éditée au-dessus du panneau.
  function reveal(id) {
    const el = $view.querySelector(`[data-id="${id}"]`);
    const sh = $sheet.querySelector('.sheet');
    if (!el || !sh) return;
    $view.querySelectorAll('.hl').forEach(x => x.classList.remove('hl'));
    if (el.classList.contains('item')) el.classList.add('hl');
    const hdr = $view.querySelector('.ed-top');
    const topLimit = hdr ? hdr.getBoundingClientRect().bottom : 0;
    // Position finale du panneau (il peut être encore en train de glisser).
    const r = el.getBoundingClientRect(), bottomLimit = window.innerHeight - sh.offsetHeight;
    if (r.top < topLimit + 8 || r.bottom > bottomLimit - 8) {
      const target = topLimit + Math.max(8, (bottomLimit - topLimit - r.height) / 2);
      window.scrollBy({ top: r.top - target, behavior: 'smooth' });
    }
  }

  function toast(icon = 'check', bad = false) {
    $toast.innerHTML = ic(icon);
    $toast.classList.toggle('bad', bad);
    $toast.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => $toast.classList.remove('show'), 1300);
  }

  // Bouton à double tap : 1er tap arme (rouge), 2e tap confirme.
  function armed(btn) {
    if (btn.classList.contains('armed')) { clearTimeout(btn._t); return true; }
    document.querySelectorAll('.armed').forEach(disarm);
    btn._html = btn.innerHTML;
    btn.classList.add('armed');
    btn.innerHTML = ic('check');
    btn._t = setTimeout(() => disarm(btn), 2600);
    return false;
  }
  function disarm(b) { clearTimeout(b._t); b.classList.remove('armed'); if (b._html) b.innerHTML = b._html; }

  function changed(full = true) {
    save();
    renderView();
    if (full) refreshSheet();
  }

  /* ============================================================
     Actions
     ============================================================ */
  const curS = () => findS(baseE().sid);

  function moveEx(d) {
    const c = ctx();
    if (!c) return;
    const { s, bi, ii, b, it } = c;
    let nbi = bi, nii = ii + d;
    if (nii < 0) { if (bi === 0) return; nbi = bi - 1; nii = s.blocks[nbi].items.length; }
    else if (nii > b.items.length - 1) { if (bi === s.blocks.length - 1) return; nbi = bi + 1; nii = 0; }
    b.items.splice(ii, 1);
    s.blocks[nbi].items.splice(nii, 0, it);
    save(); renderView();
    reveal(it.id);
  }

  const ACT = {
    back: () => back(),
    open: b => push({ v: 'edit', sid: b.dataset.id }),
    play: b => startSession(b.dataset.id),
    settings: () => push({ sheet: 'settings', id: 'settings' }),
    hist: () => { const n = new Date(); push({ v: 'hist', y: n.getFullYear(), mo: n.getMonth() }); },
    month: b => {
      const e = baseE(), n = new Date();
      let mo = e.mo + (+b.dataset.d), y = e.y;
      if (mo < 0) { mo = 11; y--; } else if (mo > 11) { mo = 0; y++; }
      if (y > n.getFullYear() || (y === n.getFullYear() && mo > n.getMonth())) return;
      e.y = y; e.mo = mo;
      renderView();
    },
    daySheet: b => push({ sheet: 'day', id: b.dataset.id }),
    addLog: b => {
      const key = topE().id, s = findS(b.dataset.id);
      if (!isKey(key) || key > dateKey()) return;
      state.log.push({ k: uid(), id: s ? s.id : '', d: key, t: 0, n: s ? sn(s) : 'Sport', c: s ? s.color : DONE_C, ic: s ? s.icon : 'activity', m: true, at: Date.now() });
      flush(); renderView(); refreshSheet(); toast('check');
    },
    delLog: btn => {
      if (!armed(btn)) return;
      state.log = state.log.filter(l => l.k !== btn.dataset.id);
      flush(); renderView(); refreshSheet();
    },
    sessionSheet: () => { const s = curS(); if (s) push({ sheet: 'session', sid: s.id, id: s.id }); },
    blockSheet: b => push({ sheet: 'block', sid: baseE().sid, id: b.dataset.id }),
    exSheet: b => push({ sheet: 'ex', sid: baseE().sid, id: b.dataset.id }),

    newSession: () => {
      const used = state.sessions.map(s => s.color);
      const s = {
        id: uid(), name: '', icon: 'flame',
        color: COLORS.find(c => !used.includes(c)) || COLORS[state.sessions.length % COLORS.length],
        days: [], blocks: [blk('Bloc 1', 3, 0, 45, 60, [])],
      };
      state.sessions.push(s);
      save();
      push({ v: 'edit', sid: s.id });
      push({ sheet: 'session', sid: s.id, id: s.id, isNew: true });
    },
    addEx: b => {
      const s = curS(), bl = s && s.blocks.find(x => x.id === b.dataset.id);
      if (!bl) return;
      const last = bl.items[bl.items.length - 1];
      const it = ex('', last ? last.type : 'reps', last ? last.value : 10);
      bl.items.push(it);
      save(); renderView();
      push({ sheet: 'ex', sid: s.id, id: it.id, isNew: true });
    },
    addBlock: () => {
      const s = curS();
      if (!s) return;
      const last = s.blocks[s.blocks.length - 1];
      if (last && !last.restAfter) last.restAfter = 60;
      const b = blk(`Bloc ${s.blocks.length + 1}`, last ? last.rounds : 3, last ? last.restEx : 0, last ? last.restRound || 45 : 45, 60, []);
      s.blocks.push(b);
      save(); renderView();
      push({ sheet: 'block', sid: s.id, id: b.id, isNew: true });
    },

    setType: b => {
      const c = ctx(), v = b.dataset.v;
      if (!c || c.it.type === v) return;
      c.it.type = v;
      c.it.value = v === 'time' ? 30 : 10;
      changed();
    },
    setVal: b => { const c = ctx(); if (!c) return; c.it.value = +b.dataset.v; changed(); },
    toggle: b => {
      const c = ctx(), k = b.dataset.k;
      if (!c) return;
      c.obj[k] = !c.obj[k];
      changed();
      if (c.t.sheet === 'settings' && c.obj[k]) {
        if (k === 'sound') { Snd.unlock(); Snd.go(); }
        if (k === 'vibe') vib(120);
        if (k === 'voice') say('Voix activée');
      }
    },
    moveEx: b => moveEx(+b.dataset.d),
    dupEx: () => {
      const c = ctx();
      if (!c) return;
      c.b.items.splice(c.ii + 1, 0, { ...c.it, id: uid() });
      save(); back(); toast('copy');
    },
    delEx: () => {
      const c = ctx();
      if (!c) return;
      c.b.items.splice(c.ii, 1);
      save(); back();
    },
    moveBlock: b => {
      const c = ctx();
      if (!c) return;
      const j = c.bi + (+b.dataset.d);
      if (j < 0 || j >= c.s.blocks.length) return;
      c.s.blocks.splice(c.bi, 1);
      c.s.blocks.splice(j, 0, c.b);
      save(); renderView(); reveal(c.b.id);
    },
    dupBlock: () => {
      const c = ctx();
      if (!c) return;
      const copy = clone(c.b);
      copy.id = uid();
      copy.items.forEach(i => { i.id = uid(); });
      c.s.blocks.splice(c.bi + 1, 0, copy);
      save(); back(); toast('copy');
    },
    delBlock: btn => {
      if (!armed(btn)) return;
      const c = ctx();
      if (!c) return;
      c.s.blocks.splice(c.bi, 1);
      save(); back();
    },

    toggleDay: b => {
      const c = ctx(), d = +b.dataset.v;
      if (!c) return;
      c.s.days = c.s.days.includes(d) ? c.s.days.filter(x => x !== d) : [...c.s.days, d];
      changed();
    },
    setIcon: b => { const c = ctx(); if (!c) return; c.s.icon = b.dataset.v; changed(); },
    setColor: b => { const c = ctx(); if (!c) return; c.s.color = b.dataset.v; changed(); },
    dupSession: () => {
      const c = ctx();
      if (!c) return;
      const copy = clone(c.s);
      copy.id = uid(); copy.days = []; copy.name = sn(c.s) + ' 2';
      copy.blocks.forEach(b => { b.id = uid(); b.items.forEach(i => { i.id = uid(); }); });
      state.sessions.splice(state.sessions.indexOf(c.s) + 1, 0, copy);
      save(); back(2); toast('copy');
    },
    delSession: btn => {
      if (!armed(btn)) return;
      const c = ctx();
      if (!c) return;
      state.sessions = state.sessions.filter(s => s !== c.s);
      save(); back(2);
    },

    exportData: () => exportData(),
    importData: () => document.getElementById('importFile').click(),
    resetData: btn => {
      if (!armed(btn)) return;
      state.sessions = defaultSessions();
      save(); renderView(); disarm(btn); toast('check');
    },

    // Lecteur
    plMain: () => {
      const st = P.steps[P.i];
      if (st.kind === 'work' && !st.dur) next();
      else togglePause();
    },
    plRing: () => ACT.plMain(),
    plPrev: () => prev(),
    plNext: () => next(),
    plAdd: () => {
      const st = P.steps[P.i];
      if (st.kind !== 'rest') return;
      st.dur += 15; P.lastBeep = null; paintTick(Date.now());
    },
    plClose: () => openPause(),
    plResume: () => { P.el.querySelector('.pl-over').hidden = true; resume(); },
    plQuit: () => { stopPlayer(); back(); },
    plFinish: () => finish(true),
    plDone: () => { stopPlayer(); back(); },
  };

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    const a = b.dataset.a;
    if (a === 'step') { if (e.detail === 0) doStep(b); return; } // clavier ; le tactile passe par pointerdown
    const fn = ACT[a];
    if (fn) fn(b, e);
  });

  // Pas à pas avec appui long (accélère)
  let repT = 0;
  function doStep(b) {
    const c = ctx();
    if (!c) return;
    const k = b.dataset.k, d = +b.dataset.d, sp = spec(k, c.obj);
    const v0 = +c.obj[k] || 0, v = stepVal(v0, d, sp);
    if (v === v0) return;
    c.obj[k] = v;
    const out = $sheet.querySelector(`[data-val="${k}"]`);
    if (out) out.textContent = fmtField(k, v, c.obj);
    if (k === 'value') {
      $sheet.querySelectorAll('.quick button').forEach(q => q.classList.toggle('on', +q.dataset.v === v));
    }
    save(); renderView();
  }
  const stopRep = () => { clearTimeout(repT); repT = 0; };
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-a="step"]');
    if (!b || e.button > 0) return;
    e.preventDefault();
    doStep(b);
    stopRep();
    let n = 0;
    const again = () => { doStep(b); n++; repT = setTimeout(again, n > 8 ? 55 : 110); };
    repT = setTimeout(again, 400);
  });
  ['pointerup', 'pointercancel', 'blur'].forEach(t => addEventListener(t, stopRep));
  document.addEventListener('pointerout', e => { if (repT && e.target.closest && e.target.closest('[data-a="step"]')) stopRep(); });

  document.addEventListener('input', e => {
    const el = e.target;
    if (!el.dataset || !el.dataset.bind) return;
    const c = ctx();
    if (!c) return;
    c.obj[el.dataset.bind] = el.value;
    save(); renderView();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('name-in')) { e.target.blur(); return; }
    if (e.key === 'Escape' && topE().sheet) { back(); return; }
    if (baseE().v === 'play' && P.on && !P.finished && !topE().sheet) {
      if (e.key === ' ') { e.preventDefault(); ACT.plMain(); }
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    }
  });

  /* ---------- Export / import ---------- */
  async function exportData() {
    const data = JSON.stringify({ app: 'sporttoday', v: 1, sessions: state.sessions, settings: state.settings, log: state.log, start: state.start }, null, 2);
    const name = `sport-today-${dateKey()}.json`;
    try {
      const file = new File([data], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await navigator.share({ files: [file] });
        return;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('download');
  }
  document.getElementById('importFile').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (!d || !Array.isArray(d.sessions)) throw new Error('format');
      const keep = !Array.isArray(d.log);
      state = normalize({ sessions: d.sessions, settings: { ...state.settings, ...(d.settings || {}) }, log: keep ? state.log : d.log, start: keep ? state.start : d.start });
      flush(); render(); toast('check');
    } catch (err) { toast('x', true); }
  });

  /* ============================================================
     Lecteur : moteur du chrono
     ============================================================ */
  const P = { on: false, finished: false, steps: [], i: 0 };

  function startSession(sid) {
    const s = findS(sid);
    if (!s) return;
    const { steps, blocks } = buildSteps(s, state.settings);
    if (!steps.some(x => x.kind === 'work')) { toast('x', true); return; }
    Snd.unlock();
    const now = Date.now();
    Object.assign(P, {
      on: true, finished: false, sid, s, color: s.color, steps, blocks,
      segTot: blocks.map((_, k) => steps.filter(x => x.bi === k).length),
      i: 0, t0: now, ps: now, paused: false, pa: 0, pausedTotal: 0,
      lastBeep: null, lastRep: 0, cache: {}, el: null,
    });
    push({ v: 'play', sid });
    cueEnter(P.steps[0], true);
    paintPhase();
    paintTick(now);
    clearInterval(P.iv);
    P.iv = setInterval(tick, 200);
    cancelAnimationFrame(P.raf);
    const loop = () => { tick(); P.raf = requestAnimationFrame(loop); };
    P.raf = requestAnimationFrame(loop);
    wakeOn();
  }

  function stopLoop() { clearInterval(P.iv); cancelAnimationFrame(P.raf); P.iv = 0; P.raf = 0; }
  function stopPlayer() {
    if (!P.on) return;
    stopLoop(); wakeOff(); hush();
    P.on = false;
  }

  function buildPlayer() {
    $view.innerHTML = `<div id="pl" class="pl" data-phase="prep" style="--c:${P.color}">
      <div class="pl-glow"></div>
      <header class="pl-top">
        <button class="ib" data-a="plClose" aria-label="Pause">${ic('x')}</button>
        <div class="segs">${P.blocks.map(() => '<i><b></b></i>').join('')}</div>
        <span class="pl-total">0:00</span>
      </header>
      <div class="pl-meta"><span class="pl-block"></span><span class="rounds"></span></div>
      <div class="pl-head">
        <span class="pl-kind"></span>
        <h1 class="pl-name"></h1>
        <div class="pl-sub"></div>
      </div>
      <button class="pl-ring" data-a="plRing" aria-label="Valider ou pause">
        <svg viewBox="0 0 200 200" aria-hidden="true"><circle class="trk" cx="100" cy="100" r="92"/><circle class="prg" cx="100" cy="100" r="92"/></svg>
        <span class="pl-num">0</span>
        <span class="pl-unit"></span>
      </button>
      <div class="pl-extra"><button data-a="plAdd" aria-label="Ajouter 15 secondes">+15″</button></div>
      <div class="pl-next"></div>
      <nav class="pl-ctrl">
        <button class="ib lg" data-a="plPrev" aria-label="Précédent">${ic('skipB')}</button>
        <button class="pl-main" data-a="plMain" aria-label="Pause"></button>
        <button class="ib lg" data-a="plNext" aria-label="Suivant">${ic('skipF')}</button>
      </nav>
      <div class="pl-over" hidden>
        <div class="over-box">
          <button class="ob ob-quit" data-a="plQuit"><span class="bub">${ic('x')}</span><span>Quitter</span></button>
          <button class="ob ob-go" data-a="plResume"><span class="bub">${ic('play')}</span><span>Reprendre</span></button>
          <button class="ob ob-fin" data-a="plFinish"><span class="bub">${ic('check')}</span><span>Terminer</span></button>
        </div>
      </div>
      <div class="pl-done" hidden>
        <div class="done-ring">${ic('check')}</div>
        <h2 class="done-name"></h2>
        <div class="done-stats"><span>${ic('clock')}<b class="d-time"></b></span><span>${ic('list')}<b class="d-sets"></b></span></div>
        <button class="pl-main" data-a="plDone" aria-label="Fermer">${ic('check')}</button>
      </div>
    </div>`;
    const el = document.getElementById('pl');
    P.el = el;
    P.prg = el.querySelector('.prg');
    P.num = el.querySelector('.pl-num');
    P.tot = el.querySelector('.pl-total');
    paintPhase();
    paintTick(Date.now());
  }

  const nextWork = i => { for (let j = i + 1; j < P.steps.length; j++) if (P.steps[j].kind === 'work') return j; return -1; };
  const nextPreview = i => { for (let j = i + 1; j < P.steps.length; j++) { const x = P.steps[j]; if (x.kind === 'work' && x.side !== 2) return j; } return -1; };

  function paintPhase() {
    const R = P.el;
    if (!R) return;
    const st = P.steps[P.i];
    const refI = st.kind === 'work' ? P.i : nextWork(P.i);
    const ref = P.steps[refI] || st;
    const manual = st.kind === 'work' && !st.dur;
    R.dataset.phase = st.kind;
    R.dataset.manual = manual ? '1' : '';
    R.style.setProperty('--pc', st.kind === 'work' ? P.color : st.kind === 'rest' ? 'var(--rest)' : 'var(--prep)');
    R.classList.toggle('paused', P.paused);

    R.querySelector('.pl-kind').innerHTML = { rest: ic('hourglass'), prep: ic('timer'), switch: ic('arrows') }[st.kind] || '';
    R.querySelector('.pl-name').textContent = ref.it ? nm(ref.it) : '';

    let sub = '';
    if (st.kind === 'work' && st.side) sub = `${ic('arrows')}<span>${st.side}/2</span>`;
    else if (st.kind === 'switch') sub = `${ic('arrows')}<span>2/2</span>`;
    else if (st.kind !== 'work' && ref.it) sub = tgHTML(ref.it);
    R.querySelector('.pl-sub').innerHTML = sub;

    R.querySelector('.pl-block').textContent = ref.b ? bn(ref.b) : '';
    R.querySelector('.rounds').innerHTML = ref.R > 1
      ? Array.from({ length: ref.R }, (_, k) => `<i class="${k < ref.r ? 'done' : k === ref.r ? 'cur' : ''}"></i>`).join('')
      : '';

    R.querySelector('.pl-unit').textContent = st.kind === 'work' && st.reps ? (st.it.side && !st.dur ? 'par côté' : 'reps') : '';

    const ni = nextPreview(refI);
    R.querySelector('.pl-next').innerHTML = ni >= 0
      ? `${ic('chevR')}<span class="nx">${esc(nm(P.steps[ni].it))}</span><span class="tg">${tgHTML(P.steps[ni].it)}</span>`
      : ic('flag');

    const main = R.querySelector('.pl-main');
    main.innerHTML = manual ? ic('check') : P.paused ? ic('play') : ic('pause');
    main.setAttribute('aria-label', manual ? 'Fait' : P.paused ? 'Reprendre' : 'Pause');

    R.querySelectorAll('.segs i').forEach((seg, k) => {
      let done = 0;
      for (let j = 0; j < P.i; j++) if (P.steps[j].bi === k) done++;
      seg.firstChild.style.transform = `scaleX(${P.segTot[k] ? done / P.segTot[k] : 0})`;
      seg.classList.toggle('cur', k === ref.bi);
    });
    P.cache = {};
  }

  function paintTick(now) {
    if (!P.el || P.finished) return;
    const st = P.steps[P.i];
    const t = P.paused ? P.pa : now;
    const el = Math.max(0, t - P.ps);
    let frac = 1, num;
    if (st.dur) {
      const durMs = st.dur * 1000, rem = Math.max(0, durMs - el);
      frac = rem / durMs;
      num = st.kind === 'work' && st.reps
        ? String(Math.ceil(st.reps * (st.it.side ? 2 : 1) * rem / durMs))
        : fmtClock(rem / 1000);
    } else num = String(st.reps);
    P.prg.style.strokeDashoffset = (RING_C * (1 - frac)).toFixed(2);
    if (num !== P.cache.num) {
      P.num.textContent = num;
      P.num.classList.toggle('long', num.length >= 5);
      P.cache.num = num;
    }
    const tot = fmtTotal(t - P.t0 - P.pausedTotal);
    if (tot !== P.cache.tot) { P.tot.textContent = tot; P.cache.tot = tot; }
  }

  function tick() {
    if (!P.on || P.finished) return;
    const now = Date.now();
    if (!P.paused) {
      let st = P.steps[P.i], el = now - P.ps;
      // Avance automatiquement (et rattrape le temps passé écran éteint).
      while (st.dur && el >= st.dur * 1000) {
        const over = el - st.dur * 1000;
        if (P.i >= P.steps.length - 1) { finish(true); return; }
        P.i++;
        P.ps = now - over;
        P.lastBeep = null; P.lastRep = 0;
        st = P.steps[P.i];
        el = over;
        if (!st.dur || el < st.dur * 1000) { cueEnter(st, over < 1500); paintPhase(); }
      }
      if (st.dur) {
        const rem = Math.ceil((st.dur * 1000 - el) / 1000);
        if (rem >= 1 && rem <= 3 && rem !== P.lastBeep) { P.lastBeep = rem; Snd.tick(); vib(35); }
        if (st.kind === 'work' && st.reps) {
          const rep = Math.floor(el / (st.dur * 1000 / (st.reps * (st.it.side ? 2 : 1))));
          if (rep !== P.lastRep) { P.lastRep = rep; if (rep > 0 && rem > 3) Snd.rep(); }
        }
      }
    }
    paintTick(now);
  }

  function spokenWork(st) {
    if (!st || !st.it) return '';
    const it = st.it;
    const v = it.type === 'time' ? spokenDur(it.value) : String(it.value);
    return `${nm(it)}, ${v}${it.side ? ' par côté' : ''}`;
  }

  function cueEnter(st, live) {
    if (!live) return;
    const prev = P.steps[P.i - 1];
    if (st.kind === 'work') {
      Snd.go(); vib(260);
      if (st.side === 2) say('Autre côté');
      else if (!prev || prev.kind !== 'prep') say(spokenWork(st));
    } else if (st.kind === 'rest') {
      Snd.rest(); vib([90, 70, 90]);
      const n = P.steps[nextWork(P.i)];
      say(n ? `Repos. Ensuite, ${spokenWork(n)}` : 'Repos');
    } else if (st.kind === 'prep') {
      Snd.soft(); vib(60);
      say(spokenWork(P.steps[nextWork(P.i)]));
    } else if (st.kind === 'switch') {
      Snd.soft(); vib([60, 60, 60]);
      say('Changez de côté');
    }
  }

  function goTo(i) {
    P.i = clamp(i, 0, P.steps.length - 1);
    const now = Date.now();
    P.ps = now;
    if (P.paused) P.pa = now;
    P.lastBeep = null; P.lastRep = 0;
    cueEnter(P.steps[P.i], !P.paused);
    paintPhase();
    paintTick(now);
  }
  function next() {
    if (!P.on || P.finished) return;
    if (P.i >= P.steps.length - 1) finish(true);
    else goTo(P.i + 1);
  }
  function prev() {
    if (!P.on || P.finished) return;
    const st = P.steps[P.i], el = (P.paused ? P.pa : Date.now()) - P.ps;
    if (st.kind === 'work' && el > 2500) { goTo(P.i); return; }
    let j = P.i - 1;
    while (j >= 0 && P.steps[j].kind !== 'work') j--;
    goTo(j >= 0 ? j : 0);
  }
  function pause() {
    if (P.paused || P.finished) return;
    P.paused = true; P.pa = Date.now();
    hush(); paintPhase(); paintTick(P.pa);
  }
  function resume() {
    if (!P.paused) return;
    const d = Date.now() - P.pa;
    P.ps += d; P.pausedTotal += d; P.paused = false;
    Snd.unlock(); wakeOn();
    paintPhase(); paintTick(Date.now());
  }
  const togglePause = () => (P.paused ? resume() : pause());
  function openPause() {
    if (!P.el || P.finished) return;
    pause();
    P.el.querySelector('.pl-over').hidden = false;
  }

  function finish(logIt) {
    if (P.finished || !P.el) return;
    const now = Date.now();
    if (P.paused) { P.pausedTotal += now - P.pa; P.paused = false; }
    P.finished = true;
    const ms = now - P.t0 - P.pausedTotal;
    let sets = 0;
    for (let j = 0; j <= P.i; j++) { const x = P.steps[j]; if (x.kind === 'work' && x.side !== 2) sets++; }
    if (logIt) {
      state.log.push({ k: uid(), id: P.sid, d: dateKey(), t: Math.round(ms / 1000), n: sn(P.s), c: P.s.color, ic: P.s.icon, m: false, at: Date.now() });
      if (state.log.length > 2000) state.log.splice(0, state.log.length - 2000);
      flush();
    }
    stopLoop(); wakeOff();
    Snd.done(); vib([70, 50, 70, 50, 240]);
    say('Séance terminée. Bravo !');
    const R = P.el;
    R.querySelector('.pl-over').hidden = true;
    R.querySelector('.done-name').textContent = sn(P.s);
    R.querySelector('.d-time').textContent = fmtTotal(ms);
    R.querySelector('.d-sets').textContent = sets;
    R.querySelector('.pl-done').hidden = false;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (P.on && !P.finished) { tick(); if (!P.paused) wakeOn(); }
    else if (baseE().v !== 'play' && !topE().sheet) renderView();
  });

  /* ============================================================
     Démarrage
     ============================================================ */
  document.getElementById('exlist').innerHTML = SUGGEST.map(s => `<option value="${esc(s)}"></option>`).join('');
  render();

  try {
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      const hadCtl = !!navigator.serviceWorker.controller;
      // Nouvelle version installée : on recharge (sauf en pleine séance).
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadCtl && !P.on) location.reload(); });
      addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
    }
  } catch (e) { /* pas de service worker ici */ }
})();
