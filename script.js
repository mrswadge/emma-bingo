'use strict';

/* ── Phrase Data ──────────────────────────────────────────────────────────────
   99 Emma phrases used as bingo squares.
   ──────────────────────────────────────────────────────────────────────────── */
const PHRASES = [
    "That's nice.",
    "I guess so.",
    "Good for you.",
    "Wait whaaat?",
    "Huh?",
    "What's the time?",
    "I don't get it.",
    "I'm hungry.",
    "I'm bored.",
    "Naaauw.",
    "NAAAOOO.",
    "Hurry up.",
    "I don't care.",
    "That's your problem.",
    "That's just not my problem.",
    "Do we have to?",
    "What's for dinner?",
    "Can we watch TV?",
    "I don't WANT TO.",
    "Mummy!",
    "Da-ddy!",
    "Can you help me?",
    "Alex isn't helping!",
    "Not helpful!",
    "They look old.",
    "Why can't you tell me?",
    "Can I have some?",
    "That's boring.",
    "Shut-up!",
    "Urgh!",
    "I'm going to bed.",
    "Go away.",
    "Just be quiet.",
    "Your face.",
    "Alex won't let me.",
    "That looks pretty.",
    "That looks nice.",
    "You're so annoying.",
    "What?",
    "What are you doing?",
    "OH MY GOD WHATS THIS!?",
    "But, I want some.",
    "That's weird.",
    "Honestly?",
    "I don't understand.",
    "Why would you do that?",
    "I want to go home.",
    "I don't like shopping.",
    "Why are we here?",
    "Where are we going?",
    "Where are we?",
    "Can I have sweets?",
    "That's not fair!",
    "Can we get a dog?",
    "I'm thirsty.",
    "Alex isn't sharing.",
    "I don't know.",
    "School is boring.",
    "What's the point?",
    "It's infuriating.",
    "Are you sure?",
    "I feel sick.",
    "Really?",
    "Ow, that hurt!",
    "That's not true!",
    "That's just stupid.",
    "Can we have pudding?",
    "I'll do it!",
    "Can you get me one?",
    "Asmar *taps aggressively*",
    "Hehehehheheheheheehhahahahahahah",
    "EWWWWWW!!",
    "Can we do something else??",
    "Can you buy it for me??",
    "It wasn't ME-E!!",
    "He-yyyy",
    "You scared meeee!!",
    "Can't be bothered.",
    "OH MY GOD",
    "Why would you ask me?!",
    "Wait, what happened?",
    "Be quiet.",
    "You sound like a \u2026",
    "Its SOOO CUTE!!",
    "Soorry.",
    "That's offensaave!",
    "How do you do this?",
    "Wait, what did you say?",
    "I wasn't listening",
    "Hey, I was sitting there!",
    "I can't help it",
    "I don't know what to do.",
    "How do you know that?",
    "How's that even possible??",
    "I'M COOOLD!",
    "ITS TOO HOT!",
    "My butt hurts\u2026",
    "Its not my fault\u2026",
    "What does that mean\u2026"
];

/* Victory exclamations spoken aloud and displayed on the win screen */
const EMMA_EXCLAMATIONS = [
    "OH MY GOD WHATS THIS!?",
    "Hehehehheheheheheehhahahahahahah!!",
    "EWWWWWW!! That's offensaave!",
    "Its SOOO CUTE!!",
    "OH MY GOD, NAAAOOO!!",
    "That's not fair! I'M COOOLD!",
    "You're so annoying! Can we get a dog?",
    "Wait whaaat?? HONESTLY??",
    "I wasn't listening, soorry!",
    "My butt hurts\u2026 it's infuriating!",
    "ITS TOO HOT! Can we have pudding?",
    "You scared meeee!! He-yyyy!"
];

/* Common female voice labels seen across major browser/platform voice packs. */
const FEMALE_VOICE_NAMES = [
    'female', 'woman', 'samantha', 'victoria', 'karen', 'zira', 'hazel', 'susan',
    'serena', 'aria', 'Libby', 'sonia', 'ava', 'allison', 'joanna', 'amy', 'emma',
    'olivia', 'salli', 'raveena', 'moira', 'kendra', 'google uk english female'
];
const FEMALE_VOICE_HINTS = new RegExp(FEMALE_VOICE_NAMES.join('|'), 'i');
const MIN_BOARD_SIZE = 3;
const MAX_BOARD_SIZE = 7;
const VICTORY_MUSIC_BPM = 138;
/* Fast trance-style 8-step patterns */
const VICTORY_MELODY_NOTES = [74, 76, 79, 81, 79, 76, 74, 72];
const VICTORY_BASS_NOTES = [38, 38, 41, 41, 36, 36, 33, 33];

/* ── Seeded RNG: Mulberry32 ──────────────────────────────────────────────────
   Produces a deterministic sequence from a 32-bit integer seed.
   ──────────────────────────────────────────────────────────────────────────── */
function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* ── Week Key ────────────────────────────────────────────────────────────────
   Returns "YYYY-MM-DD" for the Monday of the current week (weeks run Mon-Sun).
   Weekly progress is keyed to this value so boards roll over each week.
   ──────────────────────────────────────────────────────────────────────────── */
function getWeekKey() {
    const now = new Date();
    const dow = now.getDay();                      // 0=Sun … 6=Sat
    const offset = dow === 0 ? 6 : dow - 1;        // days since Monday
    const mon = new Date(now);
    mon.setDate(now.getDate() - offset);
    const y = mon.getFullYear();
    const m = String(mon.getMonth() + 1).padStart(2, '0');
    const d = String(mon.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/* ── Grid Helpers ────────────────────────────────────────────────────────────
   Odd-sized grids (3, 5, 7) have a true centre cell reserved for the logo.
   Even-sized grids (4, 6) use all cells for phrases.
   ──────────────────────────────────────────────────────────────────────────── */
function getCenterIndex(size) {
    return size % 2 === 1 ? Math.floor((size * size) / 2) : -1;
}

function getWordCount(size) {
    const total = size * size;
    return total - (getCenterIndex(size) >= 0 ? 1 : 0);
}

/* Fisher-Yates shuffle then slice */
function selectWords(size, seed) {
    const count = getWordCount(size);
    const rng   = mulberry32(seed);
    const pool  = [...PHRASES];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
}

/* ── LocalStorage Helpers ────────────────────────────────────────────────────
   Keys are namespaced by mode ('weekly'|'custom'), week-start date and size
   so state auto-expires when the week rolls over.
   ──────────────────────────────────────────────────────────────────────────── */
const STORE_NS = 'emmaBingo';

function storageKey(mode, size) {
    return `${STORE_NS}_${mode}_${getWeekKey()}_${size}`;
}

function loadSavedState(mode, size) {
    try {
        const raw = localStorage.getItem(storageKey(mode, size));
        if (!raw) return null;
        const obj = JSON.parse(raw);
        /* Sanity-check: must match current week and size */
        if (obj.weekKey !== getWeekKey() || obj.gridSize !== size) return null;
        return obj;
    } catch (err) {
        return null;
    }
}

function persistState(mode, state) {
    try {
        localStorage.setItem(storageKey(mode, state.gridSize), JSON.stringify(state));
    } catch (err) { /* storage full – silently ignore */ }
}

function buildFreshState(size, seed) {
    return {
        gridSize: size,
        words:    selectWords(size, seed),
        crossed:  new Array(size * size).fill(false),
        weekKey:  getWeekKey(),
        seed
    };
}

function parseUrlState() {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const sizeParam = parseInt(params.get('size'), 10);
    const seedParam = params.get('seed');
    const seedNum = seedParam === null ? null : Number(seedParam);

    return {
        mode: modeParam === 'custom' || modeParam === 'weekly' ? modeParam : null,
        size: Number.isInteger(sizeParam) && sizeParam >= MIN_BOARD_SIZE && sizeParam <= MAX_BOARD_SIZE ? sizeParam : null,
        seed: Number.isInteger(seedNum) && seedNum >= 0 && seedNum <= 0xFFFFFFFF ? (seedNum >>> 0) : null
    };
}

function persistUrlState(mode, size, seed, push) {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    url.searchParams.set('size', String(size));
    url.searchParams.set('seed', String(seed >>> 0));
    const method = push ? 'pushState' : 'replaceState';
    window.history[method]({}, '', url);
}

/* ── App State ───────────────────────────────────────────────────────────────
   gameState  – current board words, crosses and metadata
   boardMode  – 'weekly' | 'custom'
   victoryViz – EmmaBonkersViz instance while victory overlay is open
   ──────────────────────────────────────────────────────────────────────────── */
let gameState    = null;
let boardMode    = 'weekly';
let victoryViz = null;
let winAudioCtx  = null;
let winAudioNodes = [];
let winAudioStopTimer = null;
let winSpeechTimers = [];

function getFemaleVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const englishVoices = voices.filter(v => /^en(-|$)/i.test(v.lang));
    const englishVoicePool = englishVoices.length ? englishVoices : [];
    /* Prefer a named female English voice; fall back to any English voice */
    return englishVoicePool.find(v => FEMALE_VOICE_HINTS.test(v.name)) || englishVoicePool[0] || null;
}

function ensureWinAudioContext() {
    if (!window.AudioContext && !window.webkitAudioContext) return null;
    if (!winAudioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        winAudioCtx = new Ctx();
    }
    if (winAudioCtx.state === 'suspended') {
        winAudioCtx.resume().catch(() => {});
    }
    return winAudioCtx;
}

function stopVictoryMusic() {
    if (winAudioStopTimer) {
        clearTimeout(winAudioStopTimer);
        winAudioStopTimer = null;
    }
    for (const node of winAudioNodes) {
        try { node.stop(); } catch (_) {}
        try { node.disconnect(); } catch (_) {}
    }
    winAudioNodes = [];
}

function stopVictoryVocals() {
    for (const timer of winSpeechTimers) clearTimeout(timer);
    winSpeechTimers = [];
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function midiToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

function playVictoryMusic() {
    const ctx = ensureWinAudioContext();
    if (!ctx) return;

    stopVictoryMusic();

    const now = ctx.currentTime + 0.03;
    const beat = 60 / VICTORY_MUSIC_BPM;
    const bars = 8;
    const stepsPerBeat = 2;
    const step = beat / stepsPerBeat;
    const totalSteps = bars * 4 * stepsPerBeat;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.22, now + 0.2);
    master.connect(ctx.destination);
    winAudioNodes.push(master);

    /* Pumping sidechain-style volume motion */
    for (let b = 0; b < bars * 4; b++) {
        const bt = now + b * beat;
        master.gain.setValueAtTime(0.2, bt);
        master.gain.exponentialRampToValueAtTime(0.11, bt + 0.08);
        master.gain.linearRampToValueAtTime(0.2, bt + beat * 0.9);
    }

    for (let s = 0; s < totalSteps; s++) {
        const t0 = now + s * step;

        /* Four-on-the-floor kick */
        if (s % stepsPerBeat === 0) {
            const kick = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kick.type = 'sine';
            kick.frequency.setValueAtTime(155, t0);
            kick.frequency.exponentialRampToValueAtTime(42, t0 + 0.09);
            kickGain.gain.setValueAtTime(0.0001, t0);
            kickGain.gain.exponentialRampToValueAtTime(0.42, t0 + 0.003);
            kickGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
            kick.connect(kickGain);
            kickGain.connect(master);
            kick.start(t0);
            kick.stop(t0 + 0.12);
            winAudioNodes.push(kick, kickGain);
        }

        /* Bright off-beat hat */
        if (s % stepsPerBeat === 1) {
            const hat = ctx.createOscillator();
            const hatGain = ctx.createGain();
            hat.type = 'square';
            hat.frequency.setValueAtTime(9200, t0);
            hatGain.gain.setValueAtTime(0.0001, t0);
            hatGain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.002);
            hatGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
            hat.connect(hatGain);
            hatGain.connect(master);
            hat.start(t0);
            hat.stop(t0 + 0.035);
            winAudioNodes.push(hat, hatGain);
        }

        const noteIndex = s % VICTORY_MELODY_NOTES.length;

        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = 'square';
        bass.frequency.setValueAtTime(midiToFreq(VICTORY_BASS_NOTES[noteIndex]), t0);
        bassGain.gain.setValueAtTime(0.0001, t0);
        bassGain.gain.exponentialRampToValueAtTime(0.085, t0 + 0.01);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, t0 + step * 0.9);
        bass.connect(bassGain);
        bassGain.connect(master);
        bass.start(t0);
        bass.stop(t0 + step * 0.95);
        winAudioNodes.push(bass, bassGain);

        const lead = ctx.createOscillator();
        const leadGain = ctx.createGain();
        lead.type = 'sawtooth';
        lead.frequency.setValueAtTime(midiToFreq(VICTORY_MELODY_NOTES[noteIndex]), t0);
        leadGain.gain.setValueAtTime(0.0001, t0);
        leadGain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.01);
        leadGain.gain.exponentialRampToValueAtTime(0.0001, t0 + step * 0.75);
        lead.connect(leadGain);
        leadGain.connect(master);
        lead.start(t0);
        lead.stop(t0 + step * 0.8);
        winAudioNodes.push(lead, leadGain);
    }

    const totalDurationMs = (totalSteps * step + 0.8) * 1000;
    winAudioStopTimer = setTimeout(() => stopVictoryMusic(), totalDurationMs);
}

function randomPhraseExcluding(exclude) {
    let phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    for (let i = 0; i < 6 && exclude.has(phrase); i++) {
        phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    }
    return phrase;
}

function playVictoryVocals(primaryPhrase) {
    if (!('speechSynthesis' in window)) return;

    stopVictoryVocals();

    const femaleVoice = getFemaleVoice();
    const used = new Set([primaryPhrase]);
    const extraA = randomPhraseExcluding(used);
    used.add(extraA);
    const extraB = randomPhraseExcluding(used);

    const vocalLines = [
        'EMMA BINGO!',
        primaryPhrase,
        extraA,
        extraB
    ];

    vocalLines.forEach((line, index) => {
        const timer = setTimeout(() => {
            const msg = new SpeechSynthesisUtterance(line);
            msg.lang = 'en-GB';
            msg.rate = 1.18;
            msg.pitch = index % 2 ? 1.32 : 1.18;
            msg.volume = 1;
            if (femaleVoice) msg.voice = femaleVoice;
            window.speechSynthesis.speak(msg);
        }, 120 + index * 1650);
        winSpeechTimers.push(timer);
    });
}

/* ── Font Sizes ──────────────────────────────────────────────────────────────
   Approximate cell text size for each grid dimension, injected as a CSS
   custom property so CSS can reference it without JS repetition.
   Supported sizes: 3×3 to 7×7 (matching the grid-size selector options).
   The '9px' fallback in renderGrid covers any unexpected grid size.
   ──────────────────────────────────────────────────────────────────────────── */
const CELL_FONT = { 3: '14px', 4: '11px', 5: '9px', 6: '7.5px', 7: '6.5px' };

/* ── Progress Bar ────────────────────────────────────────────────────────────*/
function updateProgress() {
    const { gridSize, crossed } = gameState;
    const total  = gridSize * gridSize;
    const center = getCenterIndex(gridSize);
    const cells  = total - (center >= 0 ? 1 : 0);
    const done   = crossed.filter(Boolean).length;

    document.getElementById('progress-text').textContent = `${done} / ${cells} crossed off`;
    document.getElementById('progress-fill').style.width = `${(done / cells) * 100}%`;
}

/* ── Grid Rendering ──────────────────────────────────────────────────────────*/
function renderGrid() {
    const gridEl = document.getElementById('bingo-grid');
    gridEl.innerHTML = '';

    const { gridSize, words, crossed } = gameState;
    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    document.documentElement.style.setProperty('--cell-font', CELL_FONT[gridSize] || '9px');

    const total  = gridSize * gridSize;
    const center = getCenterIndex(gridSize);
    let wi = 0; /* word index (skips centre slot) */

    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.dataset.ci = i;

        if (i === center) {
            /* ── Logo / free-space cell ── */
            cell.classList.add('center-cell');
            cell.setAttribute('aria-label', 'Emma Bingo – free space');
            cell.innerHTML = `
                <div class="center-logo">
                    <span class="logo-icon">👸</span>
                    <span class="logo-text">EMMA<br>BINGO</span>
                </div>`;
        } else {
            /* ── Phrase cell ── */
            const text = words[wi++];
            cell.textContent = text;
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-pressed', crossed[i] ? 'true' : 'false');
            cell.setAttribute('aria-label', text + (crossed[i] ? ' – crossed off' : ''));

            if (crossed[i]) cell.classList.add('crossed');

            cell.addEventListener('click',   () => toggleCell(i));
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCell(i);
                }
            });
        }

        gridEl.appendChild(cell);
    }

    updateProgress();
}

/* ── Cell Toggle ─────────────────────────────────────────────────────────────*/
function toggleCell(i) {
    if (i === getCenterIndex(gameState.gridSize)) return;

    gameState.crossed[i] = !gameState.crossed[i];
    persistState(boardMode, gameState);

    const cell = document.querySelector(`[data-ci="${i}"]`);
    if (cell) {
        cell.classList.toggle('crossed', gameState.crossed[i]);
        cell.setAttribute('aria-pressed', gameState.crossed[i] ? 'true' : 'false');
        cell.setAttribute('aria-label',
            cell.textContent.trim() + (gameState.crossed[i] ? ' – crossed off' : ''));
    }

    updateProgress();

    if (checkVictory()) triggerVictory();
}

/* ── Victory Detection ───────────────────────────────────────────────────────*/
function checkVictory() {
    const { gridSize, crossed } = gameState;
    const total  = gridSize * gridSize;
    const center = getCenterIndex(gridSize);
    for (let i = 0; i < total; i++) {
        if (i === center) continue;
        if (!crossed[i]) return false;
    }
    return true;
}

/* ── Victory Presentation ────────────────────────────────────────────────────*/
function triggerVictory() {
    const phrase = EMMA_EXCLAMATIONS[Math.floor(Math.random() * EMMA_EXCLAMATIONS.length)];
    document.getElementById('victory-phrase').textContent = phrase;

    const overlay = document.getElementById('victory-overlay');
    const box     = document.getElementById('victory-box');

    /* Show overlay in viz-active mode: black background, canvas fills screen */
    overlay.classList.remove('hidden');
    overlay.classList.add('viz-active');
    box.classList.add('box-hidden');
    box.classList.remove('box-revealed');

    playVictoryVocals(phrase);
    playVictoryMusic();

    /* Start the EmmaBonkersViz animation */
    const canvas = document.getElementById('confetti-canvas');
    const imgEl  = document.getElementById('emma-img');
    victoryViz = new EmmaBonkersViz(canvas, imgEl);
    victoryViz.onComplete = () => {
        /* After 60 s: hide viz-active, reveal the victory panel */
        overlay.classList.remove('viz-active');
        box.classList.remove('box-hidden');
        box.classList.add('box-revealed');
    };
    victoryViz.start();
}

function closeVictory() {
    const overlay = document.getElementById('victory-overlay');
    const box     = document.getElementById('victory-box');
    overlay.classList.add('hidden');
    overlay.classList.remove('viz-active');
    box.classList.remove('box-hidden', 'box-revealed');
    if (victoryViz) { victoryViz.stop(); victoryViz = null; }
    stopVictoryVocals();
    stopVictoryMusic();
}

/* ── Board Initialisation ────────────────────────────────────────────────────
   Loads saved state for the requested mode/size, or creates a fresh one.
   ──────────────────────────────────────────────────────────────────────────── */
function initBoard(size, mode, overrideSeed, pushHistory) {
    boardMode = mode;

    if (overrideSeed !== undefined && overrideSeed !== null) {
        /* If URL/user provides a seed, restore matching board or create it */
        const saved = loadSavedState(mode, size);
        if (saved && (saved.seed >>> 0) === (overrideSeed >>> 0)) {
            gameState = saved;
        } else {
            gameState = buildFreshState(size, overrideSeed >>> 0);
            persistState(mode, gameState);
        }
    } else {
        const saved = loadSavedState(mode, size);
        if (saved) {
            gameState = saved;
        } else {
            const seed = (Math.random() * 0xFFFFFFFF) >>> 0;
            gameState = buildFreshState(size, seed);
            persistState(mode, gameState);
        }
    }

    persistUrlState(mode, size, gameState.seed, !!pushHistory);

    /* Sync mode-button active state */
    document.querySelectorAll('.btn-mode').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    renderGrid();
}

/* ── DOMContentLoaded ────────────────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', () => {
    /* Week label in header */
    document.getElementById('week-label').textContent = getWeekKey();

    const gridSel = document.getElementById('grid-size');
    const urlState = parseUrlState();
    if (urlState.size) gridSel.value = String(urlState.size);
    if ('speechSynthesis' in window && typeof window.speechSynthesis.getVoices === 'function') {
        /* Prime voice loading early so female voice selection is ready on win. */
        window.speechSynthesis.getVoices();
        window.speechSynthesis.addEventListener('voiceschanged', () => getFemaleVoice(), { once: true });
    }

    document.addEventListener('pointerdown', () => { ensureWinAudioContext(); }, { once: true });

    /* Grid size selector */
    gridSel.addEventListener('change', () => {
        closeVictory();
        initBoard(parseInt(gridSel.value, 10), boardMode, undefined, true);
    });

    /* Weekly board */
    document.getElementById('btn-weekly').addEventListener('click', () => {
        closeVictory();
        initBoard(parseInt(gridSel.value, 10), 'weekly', undefined, true);
    });

    /* Shuffle – always generate a brand-new random board */
    document.getElementById('btn-shuffle').addEventListener('click', () => {
        closeVictory();
        const size = parseInt(gridSel.value, 10);
        const seed = (Math.random() * 0xFFFFFFFF) >>> 0;
        initBoard(size, 'custom', seed, true);
    });

    /* Reset crosses on current board */
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (!confirm('Clear all crossed-off phrases on this board?')) return;
        closeVictory();
        gameState.crossed = new Array(gameState.gridSize * gameState.gridSize).fill(false);
        persistState(boardMode, gameState);
        renderGrid();
    });

    /* Close victory overlay */
    document.getElementById('btn-close-victory').addEventListener('click', closeVictory);

    /* During animation: tap anywhere on the overlay to increase chaos.
       After animation: clicking the dark backdrop closes the overlay.       */
    document.getElementById('victory-overlay').addEventListener('click', (e) => {
        if (victoryViz && victoryViz.running) {
            /* Don't count clicks on the close button as "more chaos" taps */
            if (!e.target.closest('#btn-close-victory')) {
                victoryViz.onTap();
            }
            return;
        }
        if (e.target === e.currentTarget) closeVictory();
    });

    /* Boot */
    initBoard(
        parseInt(gridSel.value, 10),
        urlState.mode || 'weekly',
        urlState.seed,
        false
    );
});
