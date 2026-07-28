'use strict';
/**
 * EmmaBonkersViz
 * ──────────────────────────────────────────────────────────────────────────
 * MilkDrop / Geiss-inspired full-screen procedural animation featuring
 * Emma's photograph.
 *
 * Rendering layers (per tick):
 *   1. Zoom-warp feedback — previous frame zoomed/rotated slightly inward.
 *      Creates the classic infinite-zoom feedback tunnel.
 *   2. Plasma colour blobs — screen-blended animated radial gradients give
 *      the shifting rainbow background.
 *   3. Emma sprite particles — orbiting, spiralling, wobbling, tunnelling.
 *      Each particle has its own hue-rotate + brightness + saturation filter.
 *   4. Text bursts — floating Emma phrases (screen blend, tap-level driven).
 *   5. Kaleidoscope composite — enabled at tap level ≥ 3.  Renders layers
 *      1-4 to an offscreen canvas, then draws it N-fold mirrored around
 *      the centre.
 *   6. Tap-hint text — blinking "👆 Tap for more chaos!" label.
 *   7. Fade-out — last 5 s fades to black before calling onComplete.
 *
 * Public API:
 *   const viz = new EmmaBonkersViz(canvasEl, imgEl);
 *   viz.onComplete = () => { … };   // fired when 60 s timer expires
 *   viz.start();
 *   viz.onTap();                    // call on user click/tap
 *   viz.stop();                     // early manual stop
 *
 * Graceful degradation:
 *   If imgEl has not loaded (or emma.png is missing), each particle slot is
 *   rendered as a colourful emoji avatar instead.
 * ──────────────────────────────────────────────────────────────────────────
 */
class EmmaBonkersViz {
    /** Total animation duration in milliseconds (60 s = one satisfying bingo celebration). */
    static DURATION_MS   = 60_000;
    static MAX_TAPS      = 12;
    static BASE_EMMAS    = 4;
    static EMMAS_PER_TAP = 4;
    static MAX_EMMAS     = 52;
    static KALEIDOSCOPE_OVERSCAN = 1.14;

    constructor(canvas, imgEl) {
        this.canvas     = canvas;
        this.ctx        = canvas.getContext('2d');
        this.img        = imgEl;           // HTMLImageElement (may not be loaded)
        this.running    = false;
        this.raf        = null;
        this.startTs    = null;
        this._lastTs    = null;
        this.tapLevel   = 0;
        this.particles  = [];
        this.onComplete = null;            // () => void  callback at 60 s
        this.paletteShift = Math.random() * 360;

        /* Offscreen buffers:
           _buf  – copy of the previous rendered frame (feedback source)
           _tmp  – intermediate render target when kaleidoscope is active  */
        this._buf    = document.createElement('canvas');
        this._bufCtx = this._buf.getContext('2d');
        this._tmp    = document.createElement('canvas');
        this._tmpCtx = this._tmp.getContext('2d');

        this._onResize = () => this._resize();
    }

    /* ── Public ──────────────────────────────────────────────────────────── */

    start() {
        this._resize();
        window.addEventListener('resize', this._onResize);

        /* Seed feedback buffer with solid black so first-frame feedback is clean */
        this._bufCtx.fillStyle = '#000';
        this._bufCtx.fillRect(0, 0, this._buf.width, this._buf.height);

        this._spawn(EmmaBonkersViz.BASE_EMMAS, false);
        this.running = true;
        this.startTs = null;
        this._lastTs = null;
        this.raf = requestAnimationFrame(ts => this._tick(ts));
    }

    stop() {
        this.running = false;
        window.removeEventListener('resize', this._onResize);
        if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = [];
    }

    /** Call on every tap/click to escalate the madness. */
    onTap() {
        if (!this.running || this.tapLevel >= EmmaBonkersViz.MAX_TAPS) return;
        this.tapLevel++;
        this.paletteShift = Math.random() * 360;
        for (const p of this.particles) {
            p.hue = Math.random() * 360;
            p.hueSpeed = (Math.random() - 0.5) * 180;
        }
        const room  = EmmaBonkersViz.MAX_EMMAS - this.particles.length;
        const extra = Math.min(EmmaBonkersViz.EMMAS_PER_TAP + this.tapLevel, room);
        if (extra > 0) this._spawn(extra, true /* burst */);
    }

    /* ── Internal ────────────────────────────────────────────────────────── */

    _resize() {
        const W = window.innerWidth, H = window.innerHeight;
        for (const c of [this.canvas, this._buf, this._tmp]) {
            c.width = W; c.height = H;
        }
        /* Cache for kaleidoscope — only changes on resize */
        this._hypot = Math.hypot(W, H);
    }

    /* ── Spawn new Emma particles ─────────────────────────────────────────
       `burst` particles fade in from alpha 0 (newly added on tap).          */
    _spawn(count, burst) {
        const W = this.canvas.width, H = this.canvas.height;
        const rMax   = Math.min(W, H) * 0.44;
        const STYLES = ['orbit', 'spiral', 'wobble', 'tunnel'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                /* Orbital / positional */
                angle:      Math.random() * Math.PI * 2,
                angleSpeed: (0.3 + Math.random() * 0.85) * (Math.random() > 0.5 ? 1 : -1),
                radius:     55 + Math.random() * rMax * 0.88,
                radiusMin:  30,
                radiusMax:  rMax,
                /* Appearance */
                scale:      0.4 + Math.random() * 0.65,
                scalePulse: 0.08 + Math.random() * 0.22,
                scalePhase: Math.random() * Math.PI * 2,
                scaleSpeed: 0.4 + Math.random() * 1.6,
                /* Spin */
                spin:       (Math.random() - 0.5) * 2.2,
                spinAngle:  Math.random() * Math.PI * 2,
                /* Colour shift */
                hue:        Math.random() * 360,
                hueSpeed:   (Math.random() - 0.5) * 120,
                /* Fade-in for burst particles */
                alpha:      burst ? 0 : 1,
                /* Motion style */
                style:      STYLES[Math.floor(Math.random() * STYLES.length)],
                phase:      Math.random() * Math.PI * 2,
                /* Tunnel-mode z depth */
                z:          0.1 + Math.random() * 0.9,
                zSpeed:     0.35 + Math.random() * 0.55,
            });
        }
    }

    /* ── Main animation tick ─────────────────────────────────────────────── */
    _tick(ts) {
        if (!this.running) return;
        if (this.startTs === null) this.startTs = ts;
        if (this._lastTs  === null) this._lastTs  = ts;

        const elapsed = ts - this.startTs;
        const dt      = Math.min(0.05, (ts - this._lastTs) * 0.001);
        this._lastTs  = ts;

        const W         = this.canvas.width;
        const H         = this.canvas.height;
        const t         = elapsed * 0.001;
        /* intensity: 0 at start, ramps up toward 1 as taps accumulate      */
        const intensity = Math.min(1, 0.22 + this.tapLevel * 0.068);
        const fadeStart = EmmaBonkersViz.DURATION_MS - 5_000;
        const fadeOut   = Math.max(0, (elapsed - fadeStart) / 5_000);
        const useKaleo  = this.tapLevel >= 3;

        /* When kaleidoscope is active, render layers 1-4 into _tmp so that
           the kaleidoscope can fold _tmp onto the main canvas.              */
        const tCtx = useKaleo ? this._tmpCtx : this.ctx;

        /* ── Layer 1: zoom-warp feedback ─────────────────────────────────
           Draw the previous frame slightly enlarged + rotated from the
           centre.  The slight zoom creates the infinite-tunnel pull-in.
           globalAlpha < 1 makes old content decay, preventing blow-up.     */
        const feedAlpha = useKaleo ? 0.82 : 0.89;
        /* Keep zoom/swirl restrained so repeated taps don't expose edge/border artifacts. */
        const zoom      = 1.004 + intensity * 0.004;
        const swirl     = (0.0018 + intensity * 0.0042) * Math.sin(t * 0.27);
        tCtx.save();
        tCtx.globalAlpha = feedAlpha;
        tCtx.translate(W / 2, H / 2);
        tCtx.scale(zoom, zoom);
        tCtx.rotate(swirl);
        tCtx.drawImage(this._buf, -W / 2, -H / 2);
        tCtx.restore();

        /* ── Layer 2: plasma colour overlay ──────────────────────────── */
        this._plasma(tCtx, t, intensity, W, H);

        /* ── Layer 3: Emma particles ──────────────────────────────────── */
        this._emmas(tCtx, t, dt, intensity, W, H);

        /* ── Layer 4: text bursts ─────────────────────────────────────── */
        this._textBursts(tCtx, t, intensity, W, H);

        /* ── Layer 5: kaleidoscope composite ─────────────────────────── */
        if (useKaleo) {
            this._kaleidoscope(t, intensity, W, H);
        }

        /* ── Layer 6: tap-hint label (always on main canvas) ─────────── */
        this._tapHint(t, W, H, fadeOut);

        /* ── Layer 7: fade to black ───────────────────────────────────── */
        if (fadeOut > 0) {
            this.ctx.fillStyle = `rgba(0,0,0,${Math.min(fadeOut * 1.15, 1)})`;
            this.ctx.fillRect(0, 0, W, H);
        }

        /* ── Snapshot main canvas → feedback buffer ──────────────────── */
        this._bufCtx.clearRect(0, 0, W, H);
        this._bufCtx.drawImage(this.canvas, 0, 0);

        /* ── Check for auto-stop ──────────────────────────────────────── */
        if (elapsed >= EmmaBonkersViz.DURATION_MS) {
            this.stop();
            if (typeof this.onComplete === 'function') this.onComplete();
            return;
        }

        this.raf = requestAnimationFrame(ts2 => this._tick(ts2));
    }

    /* ── Plasma: animated screen-blend radial gradient blobs ─────────────── */
    _plasma(ctx, t, intensity, W, H) {
        const blobCount = 4 + Math.floor(this.tapLevel * 0.75);
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.09 + intensity * 0.17;
        for (let i = 0; i < blobCount; i++) {
            const sp  = 0.38 + i * 0.29;
            const gx  = W / 2 + Math.sin(t * sp * 0.68 + i * 2.094) * W * 0.43;
            const gy  = H / 2 + Math.cos(t * sp * 0.53 + i * 1.571) * H * 0.43;
            const rad = W * (0.27 + 0.23 * Math.sin(t * 0.33 + i * 1.1));
            /* Golden-angle hue spacing gives nice colour variety */
            const hue = (this.paletteShift + t * 42 + i * 137.508) % 360;
            const g   = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
            g.addColorStop(0,   `hsl(${hue}, 100%, 68%)`);
            g.addColorStop(0.5, `hsl(${(hue + 55) % 360}, 100%, 48%)`);
            g.addColorStop(1,   'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();
    }

    /* ── Emma sprite particles ────────────────────────────────────────────── */
    _emmas(ctx, t, dt, intensity, W, H) {
        const hasPhoto    = this.img && this.img.complete && this.img.naturalWidth > 0;
        const baseSize    = Math.min(W, H) * (0.14 + intensity * 0.10);
        const forceTunnel = this.tapLevel >= 5;

        /* Precompute intensity-driven filter values once for all particles */
        const bri = (1.18 + intensity * 0.22).toFixed(2);
        const sat = (1.35 + intensity * 0.85).toFixed(2);
        const con = (1.12 + intensity * 0.2).toFixed(2);
        const briFallback = (1.2 + intensity * 0.5).toFixed(2);

        for (const p of this.particles) {
            /* Burst fade-in */
            if (p.alpha < 1) p.alpha = Math.min(1, p.alpha + dt * 2.8);

            /* Rotate and colour-shift */
            p.spinAngle += p.spin     * dt * (1 + intensity);
            p.hue        = (p.hue + p.hueSpeed * dt + 360) % 360;
            const sp     = 1 + Math.sin(t * p.scaleSpeed + p.scalePhase) * p.scalePulse;

            /* Compute screen position */
            let cx, cy, sz;

            if (forceTunnel || p.style === 'tunnel') {
                /* Tunnel: zoom from depth z toward viewer, reset when too close */
                p.z -= p.zSpeed * dt * (0.35 + intensity * 0.8);
                if (p.z <= 0.02) { p.z = 1.0; p.angle = Math.random() * Math.PI * 2; }
                const psp = 0.55 / p.z;
                cx = W / 2 + Math.cos(p.angle) * W * 0.5 * psp;
                cy = H / 2 + Math.sin(p.angle) * H * 0.5 * psp;
                sz = baseSize * psp * p.scale * sp;
            } else {
                /* All other styles move along an orbit in XY-space */
                p.angle += p.angleSpeed * dt * (1 + intensity * 0.8);
                if (p.style === 'spiral') {
                    /* Spiral: radius pulses between min and max */
                    p.radius = p.radiusMin + (p.radiusMax - p.radiusMin) *
                               (0.5 + 0.5 * Math.sin(t * 0.22 + p.phase));
                }
                const wx = p.style === 'wobble'
                    ? Math.sin(t * 1.15 + p.phase) * 52 * intensity : 0;
                const wy = p.style === 'wobble'
                    ? Math.cos(t * 0.82 + p.phase) * 52 * intensity : 0;
                cx = W / 2 + Math.cos(p.angle) * p.radius + wx;
                cy = H / 2 + Math.sin(p.angle) * p.radius + wy;
                sz = baseSize * p.scale * sp;
            }

            if (sz < 5) continue;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(p.spinAngle);
            ctx.globalAlpha = p.alpha;

            if (hasPhoto) {
                const hueRotate = ((p.hue * 0.45 + this.paletteShift) | 0) % 360;
                ctx.filter = `hue-rotate(${hueRotate}deg) brightness(${bri}) saturate(${sat}) contrast(${con})`;
                ctx.drawImage(this.img, -sz / 2, -sz / 2, sz, sz);
            } else {
                /* Emoji fallback: drawn as coloured circle + 👸 */
                ctx.filter = `brightness(${briFallback})`;
                ctx.fillStyle = `hsl(${p.hue | 0}, 100%, 60%)`;
                ctx.beginPath();
                ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `${(sz * 0.55) | 0}px serif`;
                ctx.fillText('👸', 0, 0);
            }

            ctx.restore();  /* resets filter, transform & alpha for this particle */
        }
    }

    /* ── Kaleidoscope: fold _tmp N-fold around the centre ─────────────────── */
    _kaleidoscope(t, intensity, W, H) {
        /* More slices = more complex symmetry as taps increase */
        const slices   = Math.min(16, 4 + this.tapLevel * 2);
        const segAngle = (Math.PI * 2) / slices;
        /* Slow rotation of the whole kaleidoscope pattern */
        const rotSpeed = 0.12 + intensity * 0.38;

        this.ctx.clearRect(0, 0, W, H);
        this.ctx.save();
        this.ctx.translate(W / 2, H / 2);
        this.ctx.rotate(t * rotSpeed);

        for (let i = 0; i < slices; i++) {
            this.ctx.save();
            this.ctx.rotate(segAngle * i);

            /* Clip to a pie-slice so only one segment shows */
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            /* Slightly over-extend radius/angles to hide antialias seams between slices */
            this.ctx.arc(0, 0, this._hypot + 4, -0.012, segAngle + 0.012);
            this.ctx.closePath();
            this.ctx.clip();

            /* Flip every other slice to create true mirror symmetry */
            if (i % 2 === 1) this.ctx.scale(-1, 1);

            const over = EmmaBonkersViz.KALEIDOSCOPE_OVERSCAN;
            this.ctx.drawImage(this._tmp, -W * over / 2, -H * over / 2, W * over, H * over);
            this.ctx.restore();
        }
        this.ctx.restore();
    }

    /* ── Floating text phrases (screen blend, tap-level scaled) ──────────── */
    _textBursts(ctx, t, intensity, W, H) {
        if (this.tapLevel < 1) return;
        const POOL  = [
            'EMMA BINGO!', 'OH MY GOD!', 'NAAAOOO!!', 'EWWWWWW!!',
            'ITS SOOO CUTE!!', 'HEHEHEHEH!!', 'Soorry!',
            "That's offensaave!", "I don't WANT TO.", 'HURRY UP!'
        ];
        const count = Math.min(1 + Math.floor(this.tapLevel * 0.5), POOL.length);
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < count; i++) {
            const ph  = i * 2.094 + t * (0.45 + i * 0.18);
            const sc  = 0.7 + Math.abs(Math.sin(ph * 0.55)) * 2.0 * (0.6 + intensity * 0.4);
            const alp = 0.35 + Math.abs(Math.sin(ph * 0.4)) * 0.6;
            const hue = (this.paletteShift + t * 48 + i * 137.508) % 360;
            const fs  = Math.max(13, Math.min(W, H) * 0.033 * sc);
            const x   = W / 2 + Math.cos(ph * 0.78 + i * 1.1) * W * 0.24 * (0.4 + intensity * 0.6);
            const y   = H / 2 + Math.sin(ph * 0.64 + i * 0.9) * H * 0.24 * (0.4 + intensity * 0.6);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.sin(ph * 0.22) * 0.45);
            ctx.font         = `900 ${fs | 0}px Nunito, sans-serif`;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha  = alp;
            ctx.fillStyle    = `hsl(${hue}, 100%, 65%)`;
            ctx.shadowColor  = `hsl(${(hue + 90) % 360}, 100%, 55%)`;
            ctx.shadowBlur   = 14 + intensity * 28;
            ctx.fillText(POOL[i], 0, 0);
            ctx.restore();
        }
        ctx.restore();
    }

    /* ── Blinking tap-hint label at the bottom of the screen ─────────────── */
    _tapHint(t, W, H, fadeOut) {
        if (this.tapLevel >= EmmaBonkersViz.MAX_TAPS || fadeOut > 0.45) return;
        const blink = 0.55 + 0.45 * Math.sin(t * Math.PI * 1.5);
        const label = this.tapLevel === 0
            ? '👆 Tap anywhere for more chaos!'
            : this.tapLevel < 7
                ? `👆 MORE! (${this.tapLevel} / ${EmmaBonkersViz.MAX_TAPS})`
                : `🔥 MAXIMUM CHAOS!!! (${this.tapLevel} / ${EmmaBonkersViz.MAX_TAPS})`;
        const fs = Math.max(11, Math.min(W, H) * 0.024);
        this.ctx.save();
        this.ctx.globalAlpha  = blink * 0.85 * (1 - fadeOut * 2);
        this.ctx.font         = `700 ${fs | 0}px Nunito, sans-serif`;
        this.ctx.textAlign    = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillStyle    = '#ffffff';
        this.ctx.shadowColor  = '#000000';
        this.ctx.shadowBlur   = 10;
        this.ctx.fillText(label, W / 2, H - 18);
        this.ctx.restore();
    }
}
