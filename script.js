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
    "OH MY GOD WHAT IS THAT!?",
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
    "I dunno, why would you ask me?!",
    "Wait, what happened?",
    "Be quiet.",
    "You sound like a …",
    "It's SOOO CUTE!!",
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
    "IT'S TOO HOT!",
    "My butt hurts…",
    "It's not my fault…",
    "What does that mean…"
];

/* Victory exclamations displayed on the win screen */
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
    "My butt hurts… it's infuriating!",
    "ITS TOO HOT! Can we have pudding?",
    "You scared meeee!! He-yyyy!"
];

const SOUND_FILES = [
    "Alex isn't helping.ogg",
    "Alex isn't sharing.ogg",
    "Alex won't let me.ogg",
    "Are you sure.ogg",
    "Asmar taps aggressively.ogg",
    "Be quiet.ogg",
    "But I want some.ogg",
    "Can I have some.ogg",
    "Can I have sweets.ogg",
    "Can we do something else.ogg",
    "Can we get a dog.ogg",
    "Can we have pudding.ogg",
    "Can we watch TV.ogg",
    "Can you buy it for me.ogg",
    "Can you get me one.ogg",
    "Can you help me.ogg",
    "Can't be bothered.ogg",
    "Da-ddy.ogg",
    "Do we have to.ogg",
    "EWWWWWW.ogg",
    "Go away.ogg",
    "Good for you.ogg",
    "He-yyyy.ogg",
    "Hehehehheheheheheehhahahahahahah.ogg",
    "Hey, I was sitting there.ogg",
    "Honestly.ogg",
    "How do you do this.ogg",
    "How do you know that.ogg",
    "How's that even possible.ogg",
    "Huh.ogg",
    "Hurry up.ogg",
    "I can't help it.ogg",
    "I don't WANT TO.ogg",
    "I don't care.ogg",
    "I don't get it.ogg",
    "I don't know what to do.ogg",
    "I don't know.ogg",
    "I don't like shopping.ogg",
    "I don't understand.ogg",
    "I dunno, why would you ask me.ogg",
    "I feel sick.ogg",
    "I guess so.ogg",
    "I want to go home.ogg",
    "I wasn't listening.ogg",
    "I'M COOOLD.ogg",
    "I'll do it.ogg",
    "I'm bored.ogg",
    "I'm going to bed.ogg",
    "I'm hungry.ogg",
    "I'm thirsty.ogg",
    "IT'S TOO HOT.ogg",
    "It wasn't ME-E.ogg",
    "It's SOOO CUTE.ogg",
    "It's infuriating.ogg",
    "It's not my fault.ogg",
    "Just be quiet.ogg",
    "Mummy.ogg",
    "My butt hurts.ogg",
    "NAAAOOO.ogg",
    "Naaauw.ogg",
    "Not helpful.ogg",
    "OH MY GOD WHAT IS THAT.ogg",
    "OH MY GOD.ogg",
    "Ow, that hurt.ogg",
    "Really.ogg",
    "School is boring.ogg",
    "Shut-up.ogg",
    "Soorry.ogg",
    "That looks nice.ogg",
    "That looks pretty.ogg",
    "That's boring.ogg",
    "That's just not my problem.ogg",
    "That's just stupid.ogg",
    "That's nice.ogg",
    "That's not fair.ogg",
    "That's not true.ogg",
    "That's offensaave.ogg",
    "That's weird.ogg",
    "That's your problem.ogg",
    "They look old.ogg",
    "Urgh.ogg",
    "Wait what.ogg",
    "Wait, what did you say.ogg",
    "Wait, what happened.ogg",
    "What are you doing.ogg",
    "What does that mean.ogg",
    "What's for dinner.ogg",
    "What's the point.ogg",
    "What's the time.ogg",
    "What.ogg",
    "Where are we going.ogg",
    "Where are we.ogg",
    "Why are we here.ogg",
    "Why can't you tell me.ogg",
    "Why would you do that.ogg",
    "You scared meeee.ogg",
    "You sound like a.ogg",
    "You're so annoying.ogg",
    "Your face.ogg"
];
const SOUND_REPEAT_GAP_MS = 140;
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

function hashString32(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function normaliseText(value) {
    return value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, ' and ')
        .replace(/\*/g, ' ')
        .replace(/…|\.\.\./g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function tokenise(value) {
    return normaliseText(value).split(/\s+/).filter(Boolean);
}

function getBigrams(value) {
    const compact = normaliseText(value).replace(/\s+/g, '');
    if (compact.length < 2) return compact ? [compact] : [];
    const grams = [];
    for (let i = 0; i < compact.length - 1; i++) grams.push(compact.slice(i, i + 2));
    return grams;
}

function diceCoefficient(a, b) {
    const aa = getBigrams(a);
    const bb = getBigrams(b);
    if (!aa.length || !bb.length) return aa.length === bb.length ? 1 : 0;
    const counts = new Map();
    for (const gram of aa) counts.set(gram, (counts.get(gram) || 0) + 1);
    let matches = 0;
    for (const gram of bb) {
        const count = counts.get(gram) || 0;
        if (count > 0) {
            matches++;
            counts.set(gram, count - 1);
        }
    }
    return (2 * matches) / (aa.length + bb.length);
}

function scorePhraseMatch(phrase, sound) {
    if (phrase.normalized === sound.normalized) return 100;

    const phraseTokens = phrase.tokens;
    const soundTokens = sound.tokens;
    let overlap = 0;
    for (const token of phraseTokens) {
        if (soundTokens.includes(token)) overlap++;
    }

    const tokenScore = overlap / Math.max(phraseTokens.length, soundTokens.length, 1);
    const coverageScore = overlap / Math.max(Math.min(phraseTokens.length, soundTokens.length), 1);
    const charScore = diceCoefficient(phrase.label, sound.label);
    const containsBonus =
        phrase.normalized.includes(sound.normalized) || sound.normalized.includes(phrase.normalized)
            ? 0.12
            : 0;

    return tokenScore * 0.56 + coverageScore * 0.22 + charScore * 0.22 + containsBonus;
}

const SOUND_LIBRARY = SOUND_FILES.map(file => {
    const label = file.replace(/\.ogg$/i, '');
    return {
        file,
        label,
        normalized: normaliseText(label),
        tokens: tokenise(label),
        url: `sounds/${encodeURIComponent(file)}`
    };
});

const SOUND_MATCH_CACHE = new Map();

function findBestSoundForPhrase(phraseText) {
    if (SOUND_MATCH_CACHE.has(phraseText)) return SOUND_MATCH_CACHE.get(phraseText);

    const phrase = {
        label: phraseText,
        normalized: normaliseText(phraseText),
        tokens: tokenise(phraseText)
    };

    let best = SOUND_LIBRARY[0] || null;
    let bestScore = -Infinity;
    for (const sound of SOUND_LIBRARY) {
        const score = scorePhraseMatch(phrase, sound);
        if (score > bestScore) {
            best = sound;
            bestScore = score;
        }
    }

    SOUND_MATCH_CACHE.set(phraseText, best);
    return best;
}

/* ── Week Key ────────────────────────────────────────────────────────────────
   Returns "YYYY-MM-DD" for the Monday of the current week (weeks run Mon-Sun).
   Weekly progress is keyed to this value so boards roll over each week.
   ──────────────────────────────────────────────────────────────────────────── */
function getWeekKey() {
    const now = new Date();
    const dow = now.getDay();                      // 0=Sun … 6=Sat
    const offset = dow === 0 ? 6 : dow - 1;       // days since Monday
    const mon = new Date(now);
    mon.setHours(12, 0, 0, 0);
    mon.setDate(now.getDate() - offset);
    const y = mon.getFullYear();
    const m = String(mon.getMonth() + 1).padStart(2, '0');
    const d = String(mon.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getWeeklySeed(size) {
    return hashString32(`${getWeekKey()}:${size}:weekly`) >>> 0;
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

/* ── LocalStorage Helpers ──────────────────────────────────────────────────── */
const STORE_NS = 'emmaBingo';

function storageKey(mode, size, seed) {
    if (mode === 'custom') {
        return `${STORE_NS}_${mode}_${getWeekKey()}_${size}_${seed >>> 0}`;
    }
    return `${STORE_NS}_${mode}_${getWeekKey()}_${size}`;
}

function customPointerKey(size) {
    return `${STORE_NS}_customCurrent_${getWeekKey()}_${size}`;
}

function getCurrentCustomSeed(size) {
    try {
        const raw = localStorage.getItem(customPointerKey(size));
        const seed = raw === null ? null : Number(raw);
        return Number.isInteger(seed) && seed >= 0 && seed <= 0xFFFFFFFF ? (seed >>> 0) : null;
    } catch (_) {
        return null;
    }
}

function setCurrentCustomSeed(size, seed) {
    try {
        localStorage.setItem(customPointerKey(size), String(seed >>> 0));
    } catch (_) {}
}

function loadSavedState(mode, size, seed) {
    try {
        const lookupSeed = mode === 'custom' ? seed : getWeeklySeed(size);
        if (mode === 'custom' && !Number.isInteger(lookupSeed)) return null;
        const raw = localStorage.getItem(storageKey(mode, size, lookupSeed));
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (obj.weekKey !== getWeekKey() || obj.gridSize !== size) return null;
        if (mode === 'weekly' && (obj.seed >>> 0) !== getWeeklySeed(size)) return null;
        if (mode === 'custom' && (obj.seed >>> 0) !== (lookupSeed >>> 0)) return null;
        return obj;
    } catch (_) {
        return null;
    }
}

function persistState(mode, state) {
    try {
        localStorage.setItem(storageKey(mode, state.gridSize, state.seed), JSON.stringify(state));
        if (mode === 'custom') setCurrentCustomSeed(state.gridSize, state.seed);
    } catch (_) { /* storage full – silently ignore */ }
}

function buildFreshState(size, seed) {
    return {
        gridSize: size,
        words: selectWords(size, seed),
        crossed: new Array(size * size).fill(false),
        weekKey: getWeekKey(),
        seed: seed >>> 0
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

/* ── App State ─────────────────────────────────────────────────────────────── */
let gameState = null;
let boardMode = 'weekly';
let victoryViz = null;
let winAudioCtx = null;
let winAudioNodes = [];
let winAudioStopTimer = null;
let phraseAudio = null;
let victorySoundAudio = null;
let victorySoundLoopToken = 0;
let lastSoundUrl = null;
let lastSoundAt = 0;

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

    for (let b = 0; b < bars * 4; b++) {
        const bt = now + b * beat;
        master.gain.setValueAtTime(0.2, bt);
        master.gain.exponentialRampToValueAtTime(0.11, bt + 0.08);
        master.gain.linearRampToValueAtTime(0.2, bt + beat * 0.9);
    }

    for (let s = 0; s < totalSteps; s++) {
        const t0 = now + s * step;

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

function stopAudioInstance(audio) {
    if (!audio) return;
    try {
        audio.pause();
        audio.currentTime = 0;
    } catch (_) {}
}

function playSoundMatch(sound, opts = {}) {
    if (!sound) return null;

    const { channel = 'phrase', rate = 1, volume = 1, onEnded = null } = opts;
    const now = performance.now();
    const tooSoon = lastSoundUrl === sound.url && (now - lastSoundAt) < SOUND_REPEAT_GAP_MS;
    if (tooSoon && channel === 'phrase') return null;

    const audio = new Audio(sound.url);
    audio.preload = 'auto';
    audio.playbackRate = rate;
    audio.volume = volume;
    if (typeof onEnded === 'function') audio.addEventListener('ended', onEnded, { once: true });
    audio.addEventListener('error', () => { if (typeof onEnded === 'function') onEnded(); }, { once: true });

    if (channel === 'phrase') {
        stopAudioInstance(phraseAudio);
        phraseAudio = audio;
    } else if (channel === 'victory') {
        stopAudioInstance(victorySoundAudio);
        victorySoundAudio = audio;
    }

    lastSoundUrl = sound.url;
    lastSoundAt = now;
    audio.play().catch(() => {
        if (channel === 'phrase' && phraseAudio === audio) phraseAudio = null;
        if (channel === 'victory' && victorySoundAudio === audio) victorySoundAudio = null;
        if (typeof onEnded === 'function') onEnded();
    });
    return audio;
}

function playPhraseSound(phraseText) {
    playSoundMatch(findBestSoundForPhrase(phraseText), { channel: 'phrase', volume: 1 });
}

function pickRandomVictorySound() {
    if (!SOUND_LIBRARY.length) return null;
    if (SOUND_LIBRARY.length === 1) return SOUND_LIBRARY[0];
    let candidate = SOUND_LIBRARY[Math.floor(Math.random() * SOUND_LIBRARY.length)];
    if (victorySoundAudio && candidate.url === victorySoundAudio.src) {
        candidate = SOUND_LIBRARY[(SOUND_LIBRARY.indexOf(candidate) + 1) % SOUND_LIBRARY.length];
    }
    return candidate;
}

function stopVictorySoundLoop() {
    victorySoundLoopToken++;
    stopAudioInstance(victorySoundAudio);
    victorySoundAudio = null;
}

function scheduleNextVictorySound(loopToken, delay = 0) {
    window.setTimeout(() => {
        if (loopToken !== victorySoundLoopToken || !victoryViz || !victoryViz.running) return;
        const sound = pickRandomVictorySound();
        if (!sound) return;
        playSoundMatch(sound, {
            channel: 'victory',
            volume: 0.95,
            onEnded: () => scheduleNextVictorySound(loopToken, 120 + Math.random() * 240)
        });
    }, delay);
}

function startVictorySoundLoop() {
    stopVictorySoundLoop();
    const loopToken = victorySoundLoopToken;
    scheduleNextVictorySound(loopToken, 0);
}

/* ── Font Sizes ────────────────────────────────────────────────────────────── */
const CELL_FONT = { 3: '14px', 4: '11px', 5: '9px', 6: '7.5px', 7: '6.5px' };

function updateProgress() {
    const { gridSize, crossed } = gameState;
    const total = gridSize * gridSize;
    const center = getCenterIndex(gridSize);
    const cells = total - (center >= 0 ? 1 : 0);
    const done = crossed.filter(Boolean).length;

    document.getElementById('progress-text').textContent = `${done} / ${cells} crossed off`;
    document.getElementById('progress-fill').style.width = `${(done / cells) * 100}%`;
}

function getPhraseAtCellIndex(index) {
    const center = getCenterIndex(gameState.gridSize);
    if (index === center) return null;
    let wordIndex = index;
    if (center >= 0 && index > center) wordIndex--;
    return gameState.words[wordIndex] || null;
}

/* ── Grid Rendering ────────────────────────────────────────────────────────── */
function renderGrid() {
    const gridEl = document.getElementById('bingo-grid');
    gridEl.innerHTML = '';

    const { gridSize, crossed } = gameState;
    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    document.documentElement.style.setProperty('--cell-font', CELL_FONT[gridSize] || '9px');

    const total = gridSize * gridSize;
    const center = getCenterIndex(gridSize);

    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.dataset.ci = i;

        if (i === center) {
            cell.classList.add('center-cell');
            cell.setAttribute('aria-label', 'Emma Bingo – free space');
            cell.innerHTML = `
                <div class="center-logo">
                    <span class="logo-icon">👸</span>
                    <span class="logo-text">EMMA<br>BINGO</span>
                </div>`;
        } else {
            const text = getPhraseAtCellIndex(i);
            cell.textContent = text;
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-pressed', crossed[i] ? 'true' : 'false');
            cell.setAttribute('aria-label', text + (crossed[i] ? ' – crossed off' : ''));

            if (crossed[i]) cell.classList.add('crossed');

            cell.addEventListener('click', () => toggleCell(i));
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

/* ── Cell Toggle ───────────────────────────────────────────────────────────── */
function toggleCell(i) {
    if (i === getCenterIndex(gameState.gridSize)) return;

    const phrase = getPhraseAtCellIndex(i);
    gameState.crossed[i] = !gameState.crossed[i];
    persistState(boardMode, gameState);

    const cell = document.querySelector(`[data-ci="${i}"]`);
    if (cell) {
        cell.classList.toggle('crossed', gameState.crossed[i]);
        cell.setAttribute('aria-pressed', gameState.crossed[i] ? 'true' : 'false');
        cell.setAttribute('aria-label', cell.textContent.trim() + (gameState.crossed[i] ? ' – crossed off' : ''));
    }

    if (phrase) playPhraseSound(phrase);

    updateProgress();

    if (checkVictory()) triggerVictory();
}

/* ── Victory Detection ─────────────────────────────────────────────────────── */
function checkVictory() {
    const { gridSize, crossed } = gameState;
    const total = gridSize * gridSize;
    const center = getCenterIndex(gridSize);
    for (let i = 0; i < total; i++) {
        if (i === center) continue;
        if (!crossed[i]) return false;
    }
    return true;
}

function syncVizModeButtons(activeMode) {
    document.querySelectorAll('[data-viz-mode]').forEach(button => {
        button.classList.toggle('active', button.dataset.vizMode === activeMode);
    });
}

/* ── Victory Presentation ──────────────────────────────────────────────────── */
function triggerVictory() {
    const phrase = EMMA_EXCLAMATIONS[Math.floor(Math.random() * EMMA_EXCLAMATIONS.length)];
    document.getElementById('victory-phrase').textContent = phrase;

    const overlay = document.getElementById('victory-overlay');
    const box = document.getElementById('victory-box');

    overlay.classList.remove('hidden');
    overlay.classList.add('viz-active');
    box.classList.add('box-hidden');
    box.classList.remove('box-revealed');

    playVictoryMusic();

    const canvas = document.getElementById('confetti-canvas');
    const imgEl = document.getElementById('emma-img');
    victoryViz = new EmmaBonkersViz(canvas, imgEl);
    victoryViz.setMode('psychedelic');
    syncVizModeButtons(victoryViz.effectMode);
    victoryViz.onComplete = () => {
        stopVictorySoundLoop();
        overlay.classList.remove('viz-active');
        box.classList.remove('box-hidden');
        box.classList.add('box-revealed');
    };
    victoryViz.start();
    startVictorySoundLoop();
}

function closeVictory() {
    const overlay = document.getElementById('victory-overlay');
    const box = document.getElementById('victory-box');
    overlay.classList.add('hidden');
    overlay.classList.remove('viz-active');
    box.classList.remove('box-hidden', 'box-revealed');
    if (victoryViz) { victoryViz.stop(); victoryViz = null; }
    stopVictorySoundLoop();
    stopVictoryMusic();
}

/* ── Board Initialisation ──────────────────────────────────────────────────── */
function initBoard(size, mode, overrideSeed, pushHistory) {
    boardMode = mode;

    if (mode === 'weekly') {
        const weeklySeed = getWeeklySeed(size);
        gameState = loadSavedState('weekly', size, weeklySeed) || buildFreshState(size, weeklySeed);
        persistState('weekly', gameState);
    } else {
        const activeSeed = Number.isInteger(overrideSeed)
            ? (overrideSeed >>> 0)
            : (getCurrentCustomSeed(size) ?? ((Math.random() * 0xFFFFFFFF) >>> 0));
        gameState = loadSavedState('custom', size, activeSeed) || buildFreshState(size, activeSeed);
        persistState('custom', gameState);
    }

    persistUrlState(mode, size, gameState.seed, !!pushHistory);

    document.querySelectorAll('.btn-mode').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    renderGrid();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('week-label').textContent = getWeekKey();

    const gridSel = document.getElementById('grid-size');
    const urlState = parseUrlState();
    if (urlState.size) gridSel.value = String(urlState.size);

    document.addEventListener('pointerdown', () => { ensureWinAudioContext(); }, { once: true });

    gridSel.addEventListener('change', () => {
        closeVictory();
        initBoard(parseInt(gridSel.value, 10), boardMode, undefined, true);
    });

    document.getElementById('btn-weekly').addEventListener('click', () => {
        closeVictory();
        initBoard(parseInt(gridSel.value, 10), 'weekly', undefined, true);
    });

    document.getElementById('btn-shuffle').addEventListener('click', () => {
        closeVictory();
        const size = parseInt(gridSel.value, 10);
        const seed = boardMode === 'custom'
            ? ((Math.random() * 0xFFFFFFFF) >>> 0)
            : undefined;
        initBoard(size, 'custom', seed, true);
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        if (!confirm('Clear all crossed-off phrases on this board?')) return;
        closeVictory();
        gameState.crossed = new Array(gameState.gridSize * gameState.gridSize).fill(false);
        persistState(boardMode, gameState);
        renderGrid();
    });

    document.getElementById('btn-close-victory').addEventListener('click', closeVictory);
    document.getElementById('btn-exit-viz').addEventListener('click', closeVictory);

    document.querySelector('[data-viz-action="more-emmas"]').addEventListener('click', () => {
        if (!victoryViz || !victoryViz.running) return;
        victoryViz.addMoreEmmas();
    });

    document.querySelector('[data-viz-action="more-colours"]').addEventListener('click', () => {
        if (!victoryViz || !victoryViz.running) return;
        victoryViz.intensifyColours();
    });

    document.querySelectorAll('[data-viz-mode]').forEach(button => {
        button.addEventListener('click', () => {
            if (!victoryViz || !victoryViz.running) return;
            victoryViz.setMode(button.dataset.vizMode);
            syncVizModeButtons(victoryViz.effectMode);
        });
    });

    document.getElementById('victory-overlay').addEventListener('click', (e) => {
        if (victoryViz && victoryViz.running) {
            if (!e.target.closest('#btn-close-victory') && !e.target.closest('.viz-controls')) {
                victoryViz.onTap();
            }
            return;
        }
        if (e.target === e.currentTarget) closeVictory();
    });

    initBoard(
        parseInt(gridSel.value, 10),
        urlState.mode || 'weekly',
        urlState.mode === 'custom' ? urlState.seed : undefined,
        false
    );
});
