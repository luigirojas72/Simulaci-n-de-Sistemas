// Motor del sistema: una sola población de partículas que se reorganiza en cada momento del guion.
//
// Gramática:
//   partícula            -> una persona
//   generación 0 (crema) -> experiencia: más pesada, lenta, estructural
//   generación 1 (cian/magenta) -> generación joven: ligera, rápida, exploratoria
//   resorte al "hogar"   -> el vínculo que mantiene a la persona en una estructura
//   rigidez del resorte  -> confianza / rigidez institucional
//   líneas               -> relaciones (crema: entre experiencia, cian: entre jóvenes, rojo: entre generaciones)
//   onda                 -> impacto que se propaga
//   partícula libre      -> potencial que todavía no pertenece a ninguna estructura

export const W = 1920;
export const H = 1080;

const CREAM = [243, 235, 215];
const CYAN = [8, 169, 221];
const MAGENTA = [233, 109, 170];
const RED = [247, 53, 63];
const LINK_COLORS = [CREAM, CYAN, RED];
const BG = "#060709";
const DT = 1 / 60;

const DEFAULTS = {
  k: 0.03,
  damp: 0.84,
  idle: 1.2,
  idleSpeed: 0.8,
  idleGen: null,
  idleSpeedGen: null,
  mouse: 1,
  size: 2.6,
  sizeGen: null,
  ambientAlpha: 0.32,
  ambientSize: 2.2,
  ambientSpeed: 1,
  ambientPull: null,
  rot3d: null,
  links: null,
  linkDist: 70,
  maxLinks: 4,
  linkRamp: 1.5,
  linkAmbient: false,
  porosity: 0,
  porosityCenter: null,
  waves: null,
  trails: 0,
  transform: null,
  groups: null,
  grow: null,
  spin: null,
  colorMode: "target",
  colorShift: null,
  labels: null,
};

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (v) => v * v * (3 - 2 * v);

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Campo de flujo suave para las partículas libres.
function flow(x, y, t) {
  return (
    (Math.sin(x * 0.0021 + t * 0.13) + Math.cos(y * 0.0027 - t * 0.11) + Math.sin((x + y) * 0.0013 + t * 0.07)) * 1.7
  );
}

export class Field {
  constructor(canvas, count) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.time = 0;
    this.start = 0;
    this.key = null;
    this.f = { ...DEFAULTS };
    this.waves = [];
    this.lastWave = -99;
    this.mouse = { x: 0, y: 0, on: false };
    this.removeGen = null;
    // Rotación del objeto 3D: el público (o quien presenta) la gira arrastrando.
    this.rot = { yaw: 0, pitch: 0.2, vyaw: 0, dragging: false };
    this.view = { s: 1, ox: 0, oy: 0, dpr: 1 };
    this.ps = [];
    for (let i = 0; i < count; i++) {
      const gen = Math.random() < 0.45 ? 0 : 1;
      const gc = gen === 0 ? CREAM : Math.random() < 0.6 ? CYAN : MAGENTA;
      this.ps.push({
        i,
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        gen,
        gc,
        node: Math.random() < 0.13,
        phase: Math.random(),
        t: null,
        release: 0,
        r: gc[0], g: gc[1], b: gc[2], a: 0, size: 2,
        br: gc[0], bg: gc[1], bb: gc[2], ta: 0.3, tsize: 2,
        key: -1,
        ds: 1,
        css: "",
        lc: 0,
      });
    }
  }

  resize(w, h, dpr) {
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    const s = Math.min(w / W, h / H);
    this.view = { s, ox: (w - W * s) / 2, oy: (h - H * s) / 2, dpr };
  }

  setPointer(clientX, clientY, on = true) {
    const { s, ox, oy } = this.view;
    this.mouse.x = (clientX - ox) / s;
    this.mouse.y = (clientY - oy) / s;
    this.mouse.on = on;
  }

  get elapsed() {
    return this.time - this.start;
  }

  setFormation(def) {
    const sameStructure = def.key && def.key === this.key;
    this.f = { ...DEFAULTS, ...def };
    this.key = def.key || null;
    this.start = this.time;
    this.waves = [];
    this.lastWave = -99;
    if (!sameStructure) this.assign(def.targets || []);
    this.refreshTargets();
  }

  // Reparte los puntos objetivo entre las partículas, respetando la generación pedida.
  assign(targets) {
    const byGen = [[], []];
    const any = [];
    for (const t of shuffle(targets.slice())) (t.gen === 0 ? byGen[0] : t.gen === 1 ? byGen[1] : any).push(t);
    const rest = [];
    for (const p of shuffle(this.ps.slice())) {
      const list = byGen[p.gen];
      if (list.length) p.t = list.pop();
      else rest.push(p);
    }
    for (const p of rest) p.t = any.length ? any.pop() : null;
  }

  refreshTargets() {
    const f = this.f;
    for (const p of this.ps) {
      const t = p.t;
      if (t) {
        const c = f.colorMode === "gen" || t.r === undefined ? p.gc : [t.r, t.g, t.b];
        p.br = c[0]; p.bg = c[1]; p.bb = c[2];
        p.ta = t.a ?? 1;
        p.tsize = t.size ?? (f.sizeGen ? f.sizeGen[p.gen] : f.size);
      } else {
        p.br = p.gc[0]; p.bg = p.gc[1]; p.bb = p.gc[2];
        p.ta = f.ambientAlpha;
        p.tsize = f.ambientSize;
      }
    }
  }

  step() {
    this.time += DT;
    const f = this.f;
    const t = this.time;
    const el = this.elapsed;

    if (f.waves && el - this.lastWave > f.waves.every) {
      this.waves.push({ x: f.waves.x, y: f.waves.y, t: el });
      this.lastWave = el;
    }
    if (f.waves) this.waves = this.waves.filter((w) => (el - w.t) * f.waves.speed < 1700);

    const { x: mx, y: my, on: mOn } = this.mouse;
    const R = 160, R2 = R * R, MF = 2.6 * f.mouse;
    const grow = f.grow ? f.grow.from + (f.grow.to - f.grow.from) * ease(clamp01(el / f.grow.dur)) : 1;
    const spinA = f.spin ? el * f.spin.speed : 0;
    const sc = Math.cos(spinA), ss = Math.sin(spinA);
    const shift = f.colorShift ? f.colorShift.to * ease(clamp01(el / f.colorShift.dur)) : 0;
    const rem = this.removeGen;
    const out = [0, 0];

    const r3 = f.rot3d;
    const rot = this.rot;
    if (r3 && !rot.dragging) {
      rot.vyaw += (r3.auto - rot.vyaw) * 0.02;
      rot.yaw += rot.vyaw;
      rot.pitch += (0.2 - rot.pitch) * 0.01;
    }
    const cyw = Math.cos(rot.yaw), syw = Math.sin(rot.yaw);
    const cpt = Math.cos(rot.pitch), spt = Math.sin(rot.pitch);

    for (const p of this.ps) {
      let ax = 0, ay = 0;
      const tg = p.t;
      const removed = rem !== null && p.gen === rem;
      // Sin experiencia, la generación joven pierde la estructura y se dispersa.
      const scatter = rem === 0 && p.gen === 1;
      if (p.release > 0) p.release -= DT;
      const active = tg && !removed && !scatter && !(tg.delay && el < tg.delay) && p.release <= 0;

      p.ds = 1;
      if (active) {
        let hx, hy;
        if (r3 && tg.z !== undefined) {
          // Proyección en perspectiva: lo cercano se ve más grande.
          const x1 = tg.lx * cyw + tg.z * syw;
          const z1 = -tg.lx * syw + tg.z * cyw;
          const y2 = tg.ly * cpt - z1 * spt;
          const z2 = tg.ly * spt + z1 * cpt;
          const persp = r3.f / (r3.f + z2);
          hx = r3.x + x1 * persp;
          hy = r3.y + y2 * persp;
          p.ds = persp * persp;
        } else if (f.transform) {
          f.transform(p, tg, el, out);
          hx = out[0]; hy = out[1];
        } else if (tg.group !== undefined && f.groups) {
          const g = f.groups[tg.group];
          let lx = tg.lx, ly = tg.ly;
          if (g.wave) ly += Math.sin(lx * 0.022 - el * 3) * g.wave * (lx / g.w + 0.5);
          if (g.spin) {
            const a = el * g.spin, c = Math.cos(a), s = Math.sin(a);
            const nx = lx * c - ly * s;
            ly = lx * s + ly * c;
            lx = nx;
          }
          const k = (g.scale ?? 1) * (g.pulse ? 1 + Math.sin(el * 2.2) * g.pulse : 1);
          hx = g.x + lx * k;
          hy = g.y + ly * k;
        } else {
          hx = tg.x; hy = tg.y;
        }
        if (f.grow) {
          hx = f.grow.x + (hx - f.grow.x) * grow;
          hy = f.grow.y + (hy - f.grow.y) * grow;
        }
        if (f.spin) {
          const dx = hx - f.spin.x, dy = hy - f.spin.y;
          hx = f.spin.x + dx * sc - dy * ss;
          hy = f.spin.y + dx * ss + dy * sc;
        }
        const ia = rem !== null ? 0 : f.idleGen ? f.idleGen[p.gen] : f.idle;
        const is = f.idleSpeedGen ? f.idleSpeedGen[p.gen] : f.idleSpeed;
        hx += Math.sin(t * is * (0.7 + p.phase * 0.6) + p.phase * 40) * ia;
        hy += Math.cos(t * is * (0.6 + p.phase * 0.7) + p.phase * 70) * ia;

        // Sin la generación joven la estructura pierde sostén: los vínculos ceden y cae.
        const k = rem === 1 ? f.k * 0.02 : f.k;
        ax += (hx - p.x) * k;
        ay += (hy - p.y) * k;
        if (rem === 1) ay += 0.16;
        if (f.porosity && Math.random() < f.porosity) p.release = 1.2 + Math.random() * 2.6;
      } else {
        const ang = flow(p.x, p.y, t);
        const sp = 0.05 * f.ambientSpeed * (removed || scatter ? 3 : 1);
        ax += Math.cos(ang) * sp;
        ay += Math.sin(ang) * sp;
        if (p.release > 0 && f.porosityCenter) {
          const dx = p.x - f.porosityCenter.x, dy = p.y - f.porosityCenter.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          ax += (dx / d) * 0.08;
          ay += (dy / d) * 0.08;
        } else if (f.ambientPull && !removed && !scatter) {
          const dx = f.ambientPull.x - p.x, dy = f.ambientPull.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          if (d > f.ambientPull.r) {
            ax += (dx / d) * f.ambientPull.strength;
            ay += (dy / d) * f.ambientPull.strength;
          }
        }
      }

      // Mientras se arrastra para girar, el puntero no empuja partículas.
      if (mOn && !rot.dragging) {
        const dx = p.x - mx, dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const q = 1 - d / R;
          ax += (dx / d) * q * q * MF;
          ay += (dy / d) * q * q * MF;
        }
      }

      if (this.waves.length) {
        const wv = f.waves;
        for (const w of this.waves) {
          const r = (el - w.t) * wv.speed;
          const dx = p.x - w.x, dy = p.y - w.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = Math.abs(d - r);
          if (diff < wv.width) {
            const q = (1 - diff / wv.width) * wv.force * (1 - r / 1700);
            ax += (dx / d) * q;
            ay += (dy / d) * q;
          }
        }
      }

      const damp = active ? f.damp : 0.95;
      p.vx = (p.vx + ax) * damp;
      p.vy = (p.vy + ay) * damp;
      p.x += p.vx;
      p.y += p.vy;

      if (rem === 1 && p.y > H - 40) {
        p.y = H - 40;
        p.vy *= -0.3;
      }
      if (!active) {
        if (p.x < -30) p.x = W + 30;
        else if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30;
        else if (p.y > H + 30) p.y = -30;
      }

      // Color y tamaño: transición suave hacia el estado del momento.
      let tr = p.br, tgc = p.bg, tb = p.bb;
      if (shift && tg) {
        tr += (p.gc[0] - tr) * shift;
        tgc += (p.gc[1] - tgc) * shift;
        tb += (p.gc[2] - tb) * shift;
      }
      const ta = removed ? 0.08 : active ? p.ta : tg && tg.delay && el < tg.delay ? 0.12 : p.t ? Math.max(p.ta * 0.5, f.ambientAlpha) : p.ta;
      const ts = active ? p.tsize : f.ambientSize;
      p.r += (tr - p.r) * 0.06;
      p.g += (tgc - p.g) * 0.06;
      p.b += (tb - p.b) * 0.06;
      p.a += (ta - p.a) * 0.06;
      p.size += (ts - p.size) * 0.08;
      const key = (((p.r | 0) << 16) | ((p.g | 0) << 8) | (p.b | 0)) * 64 + ((p.a * 63) | 0);
      if (key !== p.key) {
        p.key = key;
        p.css = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${p.a.toFixed(2)})`;
      }
    }
  }

  render() {
    const c = this.ctx;
    const f = this.f;
    const { s, ox, oy, dpr } = this.view;
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (f.trails) {
      c.fillStyle = `rgba(6,7,9,${f.trails})`;
    } else {
      c.fillStyle = BG;
    }
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    c.setTransform(s * dpr, 0, 0, s * dpr, ox * dpr, oy * dpr);

    this.drawLinks(c);

    for (const p of this.ps) {
      if (p.a < 0.02) continue;
      c.fillStyle = p.css;
      const z = p.size * p.ds;
      c.fillRect(p.x - z / 2, p.y - z / 2, z, z);
    }

    if (f.labels && this.removeGen === null) {
      const a = clamp01((this.elapsed - 0.8) / 1.2);
      c.font = "600 22px Inter, sans-serif";
      c.textAlign = "center";
      c.letterSpacing = "4px";
      for (const l of f.labels) {
        c.fillStyle = `rgba(247,247,244,${0.85 * a})`;
        c.fillText(l.text, l.x, l.y);
      }
      c.letterSpacing = "0px";
    }
  }

  drawLinks(c) {
    const f = this.f;
    if (!f.links) return;
    const L = typeof f.links === "number" ? [f.links, f.links, f.links] : [f.links.exp ?? 0, f.links.jov ?? 0, f.links.cross ?? 0];
    const ramp = ease(clamp01(this.elapsed / f.linkRamp));
    const rem = this.removeGen;
    const D = f.linkDist, D2 = D * D, inv = 1 / D;
    const grid = new Map();
    const buckets = Array.from({ length: 12 }, () => []);

    for (const p of this.ps) {
      if (!p.node || p.a < 0.15) continue;
      if (!p.t && !f.linkAmbient) continue;
      if (rem !== null && (p.gen === rem || rem === 0)) continue;
      p.lc = 0;
      const cx = Math.floor(p.x * inv), cy = Math.floor(p.y * inv);
      for (let gx = cx - 1; gx <= cx + 1; gx++) {
        for (let gy = cy - 1; gy <= cy + 1; gy++) {
          const cell = grid.get(gx * 8192 + gy);
          if (!cell) continue;
          for (const q of cell) {
            if (p.lc >= f.maxLinks) break;
            if (q.lc >= f.maxLinks) continue;
            const dx = p.x - q.x, dy = p.y - q.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > D2) continue;
            const cat = p.gen === q.gen ? p.gen : 2;
            const a = (1 - Math.sqrt(d2) / D) * L[cat] * ramp;
            if (a <= 0.02) continue;
            p.lc++;
            q.lc++;
            buckets[cat * 4 + Math.min(3, (a * 4) | 0)].push(p.x, p.y, q.x, q.y);
          }
        }
      }
      const k = cx * 8192 + cy;
      const cell = grid.get(k);
      if (cell) cell.push(p);
      else grid.set(k, [p]);
    }

    c.lineWidth = 1.6;
    for (let b = 0; b < 12; b++) {
      const seg = buckets[b];
      if (!seg.length) continue;
      const col = LINK_COLORS[(b / 4) | 0];
      c.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${(((b % 4) + 0.6) / 4) * 0.75})`;
      c.beginPath();
      for (let i = 0; i < seg.length; i += 4) {
        c.moveTo(seg[i], seg[i + 1]);
        c.lineTo(seg[i + 2], seg[i + 3]);
      }
      c.stroke();
    }
  }
}
