'use strict';
/**
 * EmmaBonkersViz
 * ──────────────────────────────────────────────────────────────────────────
 * Full-screen procedural celebration animation featuring Emma's photograph.
 */
class EmmaBonkersViz {
    static DURATION_MS = 60_000;
    static MAX_TAPS = 12;
    static BASE_EMMAS = 4;
    static EMMAS_PER_TAP = 4;
    static MAX_EMMAS = 52;
    static HUE_SCALE_FACTOR = 0.45;
    static MODES = ['psychedelic', 'fluid', 'tunnel', 'waveform'];

    constructor(canvas, imgEl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.img = imgEl;
        this.running = false;
        this.raf = null;
        this.startTs = null;
        this._lastTs = null;
        this.tapLevel = 0;
        this.particles = [];
        this.onComplete = null;
        this.paletteShift = Math.random() * 360;
        this.effectMode = 'psychedelic';
        this.colourBoost = 1;

        this._buf = document.createElement('canvas');
        this._bufCtx = this._buf.getContext('2d');
        this._tmp = document.createElement('canvas');
        this._tmpCtx = this._tmp.getContext('2d');

        this._onResize = () => this._resize();
    }

    start() {
        this._resize();
        window.addEventListener('resize', this._onResize);
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
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = [];
    }

    onTap() {
        if (!this.running || this.tapLevel >= EmmaBonkersViz.MAX_TAPS) return;
        this.tapLevel++;
        this.paletteShift = Math.random() * 360;
        this.colourBoost = Math.min(3, this.colourBoost + 0.08);
        if (this.particles.length) {
            for (const p of this.particles) {
                p.hue = Math.random() * 360;
                p.hueSpeed = (Math.random() - 0.5) * 180;
            }
        }
        const room = EmmaBonkersViz.MAX_EMMAS - this.particles.length;
        const extra = Math.min(EmmaBonkersViz.EMMAS_PER_TAP + this.tapLevel, room);
        if (extra > 0) this._spawn(extra, true);
    }

    addMoreEmmas() {
        this.onTap();
    }

    intensifyColours() {
        if (!this.running) return;
        this.paletteShift = Math.random() * 360;
        this.colourBoost = Math.min(3.25, this.colourBoost + 0.28);
    }

    setMode(mode) {
        if (EmmaBonkersViz.MODES.includes(mode)) this.effectMode = mode;
    }

    _resize() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        for (const c of [this.canvas, this._buf, this._tmp]) {
            c.width = W;
            c.height = H;
        }
        this._hypot = Math.hypot(W, H);
        this._kaleidoscopeOverscan = this._hypot / Math.min(W, H);
    }

    _spawn(count, burst) {
        const W = this.canvas.width;
        const H = this.canvas.height;
        const rMax = Math.min(W, H) * 0.44;
        const styles = ['orbit', 'spiral', 'wobble', 'tunnel'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                angle: Math.random() * Math.PI * 2,
                angleSpeed: (0.3 + Math.random() * 0.85) * (Math.random() > 0.5 ? 1 : -1),
                radius: 55 + Math.random() * rMax * 0.88,
                radiusMin: 30,
                radiusMax: rMax,
                scale: 0.4 + Math.random() * 0.65,
                scalePulse: 0.08 + Math.random() * 0.22,
                scalePhase: Math.random() * Math.PI * 2,
                scaleSpeed: 0.4 + Math.random() * 1.6,
                spin: (Math.random() - 0.5) * 2.2,
                spinAngle: Math.random() * Math.PI * 2,
                hue: Math.random() * 360,
                hueSpeed: (Math.random() - 0.5) * 120,
                alpha: burst ? 0 : 1,
                style: styles[Math.floor(Math.random() * styles.length)],
                phase: Math.random() * Math.PI * 2,
                z: 0.1 + Math.random() * 0.9,
                zSpeed: 0.35 + Math.random() * 0.55,
            });
        }
    }

    _tick(ts) {
        if (!this.running) return;
        if (this.startTs === null) this.startTs = ts;
        if (this._lastTs === null) this._lastTs = ts;

        const elapsed = ts - this.startTs;
        const dt = Math.min(0.05, (ts - this._lastTs) * 0.001);
        this._lastTs = ts;

        const W = this.canvas.width;
        const H = this.canvas.height;
        const t = elapsed * 0.001;
        const intensity = Math.min(1, 0.22 + this.tapLevel * 0.068 + (this.colourBoost - 1) * 0.12);
        const fadeStart = EmmaBonkersViz.DURATION_MS - 5_000;
        const fadeOut = Math.max(0, (elapsed - fadeStart) / 5_000);
        const useKaleo = this.tapLevel >= 3 || this.effectMode === 'psychedelic';

        const tCtx = useKaleo ? this._tmpCtx : this.ctx;
        if (useKaleo) tCtx.clearRect(0, 0, W, H);

        const feedAlpha = useKaleo ? 0.82 : 0.89;
        const zoom = 1.004 + intensity * 0.004 + (this.effectMode === 'tunnel' ? 0.0035 : 0);
        const swirl = (0.0018 + intensity * 0.0042) * Math.sin(t * 0.27);
        tCtx.save();
        tCtx.globalAlpha = feedAlpha;
        tCtx.translate(W / 2, H / 2);
        tCtx.scale(zoom, zoom);
        tCtx.rotate(swirl);
        tCtx.drawImage(this._buf, -W / 2, -H / 2);
        tCtx.restore();

        this._plasma(tCtx, t, intensity, W, H);

        if (this.effectMode === 'fluid') this._fluidShapes(tCtx, t, intensity, W, H);
        if (this.effectMode === 'tunnel') this._geometricTunnel(tCtx, t, intensity, W, H);
        if (this.effectMode === 'waveform') this._waveforms(tCtx, t, intensity, W, H);
        if (this.effectMode === 'psychedelic') this._psychedelicBurst(tCtx, t, intensity, W, H);

        this._emmas(tCtx, t, dt, intensity, W, H);
        this._textBursts(tCtx, t, intensity, W, H);

        if (useKaleo) this._kaleidoscope(t, intensity, W, H);

        this._tapHint(t, W, H, fadeOut);

        if (fadeOut > 0) {
            this.ctx.fillStyle = `rgba(0,0,0,${Math.min(fadeOut * 1.15, 1)})`;
            this.ctx.fillRect(0, 0, W, H);
        }

        this._bufCtx.clearRect(0, 0, W, H);
        this._bufCtx.drawImage(this.canvas, 0, 0);

        if (elapsed >= EmmaBonkersViz.DURATION_MS) {
            this.stop();
            if (typeof this.onComplete === 'function') this.onComplete();
            return;
        }

        this.raf = requestAnimationFrame(ts2 => this._tick(ts2));
    }

    _plasma(ctx, t, intensity, W, H) {
        const blobCount = 4 + Math.floor(this.tapLevel * 0.75);
        const boost = this.colourBoost;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = Math.min(0.26, 0.09 + intensity * 0.17 + (boost - 1) * 0.03);
        for (let i = 0; i < blobCount; i++) {
            const sp = 0.38 + i * 0.29;
            const gx = W / 2 + Math.sin(t * sp * 0.68 + i * 2.094) * W * 0.43;
            const gy = H / 2 + Math.cos(t * sp * 0.53 + i * 1.571) * H * 0.43;
            const rad = W * (0.24 + 0.16 * boost + 0.18 * Math.sin(t * 0.33 + i * 1.1));
            const hue = (this.paletteShift + t * (42 + boost * 10) + i * 137.508) % 360;
            const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
            g.addColorStop(0, `hsl(${hue}, 100%, ${Math.min(76, 62 + boost * 8)}%)`);
            g.addColorStop(0.5, `hsl(${(hue + 55) % 360}, 100%, ${Math.max(38, 52 - boost * 2)}%)`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();
    }

    _fluidShapes(ctx, t, intensity, W, H) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.2 + intensity * 0.14;
        const layers = 5;
        for (let i = 0; i < layers; i++) {
            const hue = (this.paletteShift + i * 55 + t * 60) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.16)`;
            ctx.beginPath();
            const cy = H * (0.2 + i * 0.15);
            ctx.moveTo(0, cy);
            for (let x = 0; x <= W; x += 24) {
                const y = cy
                    + Math.sin(t * (1.1 + i * 0.15) + x * 0.008) * (28 + intensity * 45)
                    + Math.cos(t * (0.8 + i * 0.12) - x * 0.011) * (18 + intensity * 24);
                ctx.lineTo(x, y);
            }
            ctx.lineTo(W, H + 40);
            ctx.lineTo(0, H + 40);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }

    _geometricTunnel(ctx, t, intensity, W, H) {
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.globalCompositeOperation = 'lighter';
        const rings = 18;
        for (let i = 0; i < rings; i++) {
            const progress = ((t * 0.65 + i / rings) % 1);
            const scale = 0.12 + progress * 1.18;
            const radius = Math.min(W, H) * scale * 0.7;
            const sides = 6 + (i % 5);
            const hue = (this.paletteShift + progress * 280 + i * 18) % 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 68%, ${0.1 + (1 - progress) * 0.3})`;
            ctx.lineWidth = Math.max(1.2, (1 - progress) * (3.5 + intensity * 5));
            ctx.beginPath();
            for (let s = 0; s <= sides; s++) {
                const ang = (Math.PI * 2 * s) / sides + t * 0.45 + i * 0.08;
                const x = Math.cos(ang) * radius;
                const y = Math.sin(ang) * radius;
                if (s === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    _waveforms(ctx, t, intensity, W, H) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const bands = 7;
        for (let i = 0; i < bands; i++) {
            const hue = (this.paletteShift + i * 38 + t * 80) % 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.2 + intensity * 0.25})`;
            ctx.lineWidth = 1.5 + i * 0.28;
            ctx.beginPath();
            const baseY = H * (0.18 + i * 0.1);
            for (let x = 0; x <= W; x += 14) {
                const wave = Math.sin(x * 0.018 + t * (1.8 + i * 0.18)) * (18 + intensity * 26)
                    + Math.cos(x * 0.008 - t * (2.5 + i * 0.12)) * (10 + this.tapLevel * 2.2);
                const tunnelPull = Math.sin((x / W) * Math.PI * 2 + t * 1.4) * 10 * intensity;
                const y = baseY + wave + tunnelPull;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    _psychedelicBurst(ctx, t, intensity, W, H) {
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.globalCompositeOperation = 'screen';
        const rays = 24;
        for (let i = 0; i < rays; i++) {
            const hue = (this.paletteShift + i * 15 + t * 120) % 360;
            const angle = (Math.PI * 2 * i) / rays + t * 0.35;
            const length = Math.min(W, H) * (0.18 + 0.18 * Math.sin(t * 1.1 + i));
            ctx.strokeStyle = `hsla(${hue}, 100%, 66%, ${0.08 + intensity * 0.14})`;
            ctx.lineWidth = 2 + intensity * 5;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 40, Math.sin(angle) * 40);
            ctx.lineTo(Math.cos(angle) * (length + 120), Math.sin(angle) * (length + 120));
            ctx.stroke();
        }
        ctx.restore();
    }

    _emmas(ctx, t, dt, intensity, W, H) {
        const hasPhoto = this.img && this.img.complete && this.img.naturalWidth > 0;
        const baseSize = Math.min(W, H) * (0.35 + intensity * 0.25);
        const forceTunnel = this.tapLevel >= 5 || this.effectMode === 'tunnel';

        const bri = (1.18 + intensity * 0.22 + (this.colourBoost - 1) * 0.06).toFixed(2);
        const sat = (1.35 + intensity * 0.85 + (this.colourBoost - 1) * 0.3).toFixed(2);
        const con = (1.12 + intensity * 0.2).toFixed(2);
        const briFallback = (1.2 + intensity * 0.5).toFixed(2);

        for (const p of this.particles) {
            if (p.alpha < 1) p.alpha = Math.min(1, p.alpha + dt * 2.8);

            p.spinAngle += p.spin * dt * (1 + intensity);
            p.hue = (p.hue + p.hueSpeed * dt + 360) % 360;
            const sp = 1 + Math.sin(t * p.scaleSpeed + p.scalePhase) * p.scalePulse;

            let cx, cy, sz;

            if (forceTunnel || p.style === 'tunnel') {
                p.z -= p.zSpeed * dt * (0.35 + intensity * 0.8);
                if (p.z <= 0.02) {
                    p.z = 1.0;
                    p.angle = Math.random() * Math.PI * 2;
                }
                const psp = 0.55 / p.z;
                cx = W / 2 + Math.cos(p.angle) * W * 0.5 * psp;
                cy = H / 2 + Math.sin(p.angle) * H * 0.5 * psp;
                sz = baseSize * psp * p.scale * sp;
            } else {
                p.angle += p.angleSpeed * dt * (1 + intensity * 0.8);
                if (p.style === 'spiral') {
                    p.radius = p.radiusMin + (p.radiusMax - p.radiusMin) * (0.5 + 0.5 * Math.sin(t * 0.22 + p.phase));
                }
                const wx = p.style === 'wobble' ? Math.sin(t * 1.15 + p.phase) * 52 * intensity : 0;
                const wy = p.style === 'wobble' ? Math.cos(t * 0.82 + p.phase) * 52 * intensity : 0;
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
                const hueRotate = ((p.hue * EmmaBonkersViz.HUE_SCALE_FACTOR + this.paletteShift) | 0) % 360;
                ctx.filter = `hue-rotate(${hueRotate}deg) brightness(${bri}) saturate(${sat}) contrast(${con})`;
                ctx.drawImage(this.img, -sz / 2, -sz / 2, sz, sz);
            } else {
                ctx.filter = `brightness(${briFallback})`;
                ctx.fillStyle = `hsl(${p.hue | 0}, 100%, 60%)`;
                ctx.beginPath();
                ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `${(sz * 0.55) | 0}px serif`;
                ctx.fillText('👸', 0, 0);
            }

            ctx.restore();
        }
    }

    _kaleidoscope(t, intensity, W, H) {
        const slices = Math.min(16, 4 + this.tapLevel * 2 + (this.effectMode === 'psychedelic' ? 2 : 0));
        const segAngle = (Math.PI * 2) / slices;
        const rotSpeed = 0.12 + intensity * 0.38;

        this.ctx.clearRect(0, 0, W, H);
        this.ctx.save();
        this.ctx.translate(W / 2, H / 2);
        this.ctx.rotate(t * rotSpeed);

        for (let i = 0; i < slices; i++) {
            this.ctx.save();
            this.ctx.rotate(segAngle * i);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, this._hypot + 4, -0.012, segAngle + 0.012);
            this.ctx.closePath();
            this.ctx.clip();
            if (i % 2 === 1) this.ctx.scale(-1, 1);
            const over = this._kaleidoscopeOverscan;
            this.ctx.drawImage(this._tmp, -W * over / 2, -H * over / 2, W * over, H * over);
            this.ctx.restore();
        }
        this.ctx.restore();
    }

    _textBursts(ctx, t, intensity, W, H) {
        if (this.tapLevel < 1) return;
        const pool = [
            'EMMA BINGO!', 'OH MY GOD!', 'NAAAOOO!!', 'EWWWWWW!!',
            'ITS SOOO CUTE!!', 'HEHEHEHEH!!', 'Soorry!',
            "That's offensaave!", "I don't WANT TO.", 'HURRY UP!'
        ];
        const count = Math.min(1 + Math.floor(this.tapLevel * 0.5), pool.length);
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < count; i++) {
            const ph = i * 2.094 + t * (0.45 + i * 0.18);
            const sc = 0.7 + Math.abs(Math.sin(ph * 0.55)) * 2.0 * (0.6 + intensity * 0.4);
            const alp = 0.35 + Math.abs(Math.sin(ph * 0.4)) * 0.6;
            const hue = (this.paletteShift + t * 48 + i * 137.508) % 360;
            const fs = Math.max(13, Math.min(W, H) * 0.033 * sc);
            const x = W / 2 + Math.cos(ph * 0.78 + i * 1.1) * W * 0.24 * (0.4 + intensity * 0.6);
            const y = H / 2 + Math.sin(ph * 0.64 + i * 0.9) * H * 0.24 * (0.4 + intensity * 0.6);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.sin(ph * 0.22) * 0.45);
            ctx.font = `900 ${fs | 0}px Nunito, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = alp;
            ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
            ctx.shadowColor = `hsl(${(hue + 90) % 360}, 100%, 55%)`;
            ctx.shadowBlur = 14 + intensity * 28;
            ctx.fillText(pool[i], 0, 0);
            ctx.restore();
        }
        ctx.restore();
    }

    _tapHint(t, W, H, fadeOut) {
        if (this.tapLevel >= EmmaBonkersViz.MAX_TAPS || fadeOut > 0.45) return;
        const blink = 0.55 + 0.45 * Math.sin(t * Math.PI * 1.5);
        const label = this.tapLevel === 0
            ? '👆 Tap the screen or use the buttons for more chaos!'
            : this.tapLevel < 7
                ? `👆 MORE! (${this.tapLevel} / ${EmmaBonkersViz.MAX_TAPS})`
                : `🔥 MAXIMUM CHAOS!!! (${this.tapLevel} / ${EmmaBonkersViz.MAX_TAPS})`;
        const fs = Math.max(11, Math.min(W, H) * 0.024);
        this.ctx.save();
        this.ctx.globalAlpha = blink * 0.85 * (1 - fadeOut * 2);
        this.ctx.font = `700 ${fs | 0}px Nunito, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(label, W / 2, H - 84);
        this.ctx.restore();
    }
}
