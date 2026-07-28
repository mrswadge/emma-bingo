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

/* FNV-1a 32-bit string hash – used to convert the week key string to a seed */
function hashStr(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
    }
    return h;
}

/* ── Week Key ────────────────────────────────────────────────────────────────
   Returns "YYYY-MM-DD" for the Monday of the current week (weeks run Mon-Sun).
   All players in the same Mon-Sun window receive the same weekly board.
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
    } catch (_) {
        return null;
    }
}

function persistState(mode, state) {
    try {
        localStorage.setItem(storageKey(mode, state.gridSize), JSON.stringify(state));
    } catch (_) { /* storage full – silently ignore */ }
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

/* ── App State ───────────────────────────────────────────────────────────────
   gameState  – current board words, crosses and metadata
   boardMode  – 'weekly' | 'custom'
   confettiAnim – Confetti instance while victory overlay is open
   ──────────────────────────────────────────────────────────────────────────── */
let gameState    = null;
let boardMode    = 'weekly';
let confettiAnim = null;

/* ── Font Sizes ──────────────────────────────────────────────────────────────
   Approximate cell text size for each grid dimension, injected as a CSS
   custom property so CSS can reference it without JS repetition.
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
    overlay.classList.remove('hidden');

    /* Speech synthesis */
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg  = new SpeechSynthesisUtterance(`EMMA BINGO! ${phrase}`);
        msg.lang   = 'en-GB';
        msg.rate   = 0.78;
        msg.pitch  = 1.3;
        msg.volume = 1;
        /* Small delay avoids Chrome cutting off the first syllable */
        setTimeout(() => window.speechSynthesis.speak(msg), 120);
    }

    /* Confetti */
    const canvas = document.getElementById('confetti-canvas');
    confettiAnim = new Confetti(canvas);
    confettiAnim.start();
}

function closeVictory() {
    document.getElementById('victory-overlay').classList.add('hidden');
    if (confettiAnim) { confettiAnim.stop(); confettiAnim = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/* ── Confetti ────────────────────────────────────────────────────────────────
   Canvas-based confetti animation. Particles are rectangles and circles in
   bright colours that fall from the top and fade out near the bottom.
   ──────────────────────────────────────────────────────────────────────────── */
class Confetti {
    constructor(canvas) {
        this.canvas    = canvas;
        this.ctx       = canvas.getContext('2d');
        this.running   = false;
        this.raf       = null;
        this.particles = [];
        this.COLORS    = [
            '#e91e8c', '#9c27b0', '#ff9800', '#4caf50',
            '#2196f3', '#ffeb3b', '#f44336', '#00bcd4', '#ff5722'
        ];
        this._onResize = () => this._resize();
    }

    _resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _spawn() {
        const sz = 5 + Math.random() * 11;
        return {
            x:     Math.random() * this.canvas.width,
            y:     -(sz * 2),
            w:     sz,
            h:     sz * (0.25 + Math.random() * 0.65),
            angle: Math.random() * Math.PI * 2,
            spin:  (Math.random() - 0.5) * 0.28,
            vx:    (Math.random() - 0.5) * 5,
            vy:    2 + Math.random() * 4.5,
            color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
            alpha: 1,
            shape: Math.random() > 0.45 ? 'rect' : 'circle'
        };
    }

    _tick() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Keep spawning while running and below cap */
        if (this.running && this.particles.length < 380) {
            for (let n = 0; n < 12; n++) this.particles.push(this._spawn());
        }

        /* Remove off-screen or fully transparent particles */
        this.particles = this.particles.filter(
            p => p.y < canvas.height + 20 && p.alpha > 0.01
        );

        for (const p of this.particles) {
            p.x     += p.vx;
            p.y     += p.vy;
            p.angle += p.spin;
            p.vx    *= 0.992;          /* gentle air resistance */
            if (p.y > canvas.height * 0.6) p.alpha -= 0.02;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle   = p.color;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }
            ctx.restore();
        }

        if (this.running || this.particles.length > 0) {
            this.raf = requestAnimationFrame(() => this._tick());
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    start() {
        this._resize();
        window.addEventListener('resize', this._onResize);
        this.running   = true;
        this.particles = [];
        this._tick();
    }

    stop() {
        this.running = false;
        window.removeEventListener('resize', this._onResize);
        if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    }
}

/* ── Board Initialisation ────────────────────────────────────────────────────
   Loads saved state for the requested mode/size, or creates a fresh one.
   ──────────────────────────────────────────────────────────────────────────── */
function initBoard(size, mode, overrideSeed) {
    boardMode = mode;

    if (overrideSeed !== undefined) {
        /* Always start fresh when an explicit seed is supplied (Shuffle button) */
        gameState = buildFreshState(size, overrideSeed);
        persistState(mode, gameState);
    } else {
        const saved = loadSavedState(mode, size);
        if (saved) {
            gameState = saved;
        } else {
            const seed = mode === 'weekly'
                ? hashStr(`${getWeekKey()}-${size}`)           /* deterministic weekly seed */
                : (Math.random() * 0xFFFFFFFF) >>> 0;          /* random custom seed */
            gameState = buildFreshState(size, seed);
            persistState(mode, gameState);
        }
    }

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

    /* Grid size selector */
    gridSel.addEventListener('change', () => {
        closeVictory();
        initBoard(parseInt(gridSel.value, 10), boardMode);
    });

    /* Weekly board */
    document.getElementById('btn-weekly').addEventListener('click', () => {
        closeVictory();
        initBoard(parseInt(gridSel.value, 10), 'weekly');
    });

    /* Shuffle – always generate a brand-new random board */
    document.getElementById('btn-shuffle').addEventListener('click', () => {
        closeVictory();
        const size = parseInt(gridSel.value, 10);
        const seed = (Math.random() * 0xFFFFFFFF) >>> 0;
        initBoard(size, 'custom', seed);
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

    /* Clicking the dark backdrop also closes it */
    document.getElementById('victory-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeVictory();
    });

    /* Boot */
    initBoard(parseInt(gridSel.value, 10), 'weekly');
});
