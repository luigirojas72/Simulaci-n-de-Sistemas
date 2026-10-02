// "El talento crece a la velocidad de la confianza." como galaxia.
// Las estrellas son talento; la gravedad que las mantiene unidas mientras giran es la confianza.
// Las líneas que entran son talentos nuevos que se suman al sistema.
// "Dar forma": las mismas estrellas toman la forma de la formación (birrete), la pasión (corazón)
// o la institución (logo UPB 3D), y pueden volver a ser galaxia.
import { sampleShape } from "./shapes.js";
import { capModel } from "./pong.js";

const CX = 1300;
const CY = 560;
const TILT = 0.85;
const F = 1100;

const rand = (a, b) => a + Math.random() * (b - a);
function gauss() {
  return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
}
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function heartModel(count) {
  const pts = [];
  while (pts.length < count) {
    const x = rand(-1.25, 1.25), y = rand(-1.1, 1.35);
    const q = x * x + y * y - 1;
    const f = q * q * q - x * x * y * y * y;
    if (f > 0) continue;
    const depth = Math.cbrt(-f);
    const z = (Math.random() * 2 - 1) * 0.45 * depth;
    const c = mix([255, 40, 80], [255, 140, 190], Math.min(1, depth * 1.2 + Math.random() * 0.2));
    pts.push({ x: x * 230, y: -y * 230 + 30, z: z * 230, c });
  }
  return pts;
}

function upbModel(img, count) {
  const w = 620, h = Math.round((620 * img.height) / (img.width * 0.47));
  const flat = sampleShape((g, cw, ch) => g.drawImage(img, 0, 0, img.width * 0.47, img.height, 0, 0, cw, ch), w, h, 1800);
  const layers = [-45, -22, 0, 22, 45];
  const pts = [];
  for (let i = 0; i < count; i++) {
    const p = flat[(Math.random() * flat.length) | 0];
    const li = (Math.random() * layers.length) | 0;
    const c = li === 0 ? [247, 240, 225] : li === layers.length - 1 ? [8, 169, 221] : mix([247, 240, 225], [233, 109, 170], li / 4);
    pts.push({ x: p.x - w / 2 + rand(-1.5, 1.5), y: p.y - h / 2 + rand(-1.5, 1.5), z: layers[li], c });
  }
  return pts;
}

function capShape(count) {
  const base = capModel();
  const pts = [];
  for (let i = 0; i < count; i++) {
    const p = base[(Math.random() * base.length) | 0];
    pts.push({ x: p.lx * 2.7 + rand(-3, 3), y: p.ly * 2.7 + 20 + rand(-3, 3), z: p.z * 2.7 + rand(-3, 3), c: [p.r, p.g, p.b] });
  }
  return pts;
}

export const GALAXY_MODES = [
  { id: "galaxy", label: "Galaxia" },
  { id: "cap", label: "Birrete" },
  { id: "heart", label: "Corazón" },
  { id: "logo", label: "Logo UPB" },
];

export function makeGalaxy(A) {
  const targets = [];
  const CORE = [255, 246, 214], GOLD = [255, 204, 120], ARM_IN = [190, 205, 255], ARM_OUT = [110, 120, 255];
  const VIOLET = [170, 95, 235], PINK = [255, 110, 175], STREAM = [150, 225, 255];

  // Núcleo brillante y bulbo amarillento.
  for (let i = 0; i < 1000; i++) {
    const r = Math.abs(gauss()) * 70;
    targets.push({ kind: "star", rad: r, ang: rand(0, Math.PI * 2), y: gauss() * 22, c: mix(CORE, GOLD, Math.random() * 0.5), size: rand(2.6, 4.4), tw: true });
  }
  for (let i = 0; i < 700; i++) {
    const r = 40 + Math.abs(gauss()) * 130;
    targets.push({ kind: "star", rad: r, ang: rand(0, Math.PI * 2), y: gauss() * 16, c: mix(GOLD, [255, 170, 110], Math.random()), size: rand(2.2, 3.2), tw: Math.random() < 0.3 });
  }
  // Brazos espirales.
  for (let i = 0; i < 3300; i++) {
    const arm = i % 2;
    const r = 70 + Math.pow(Math.random(), 0.8) * 470;
    const spread = 0.2 + (r / 540) * 0.3;
    const a = arm * Math.PI + 2.6 * Math.log(r / 70) + gauss() * spread;
    const t = r / 540;
    let c = t < 0.5 ? mix(GOLD, ARM_IN, t * 2) : mix(ARM_IN, Math.random() < 0.5 ? ARM_OUT : VIOLET, (t - 0.5) * 2);
    let size = rand(1.8, 2.8);
    if (Math.random() < 0.06) {
      c = PINK;
      size = 3.4;
    }
    targets.push({ kind: "star", rad: r, ang: a, y: gauss() * 8, c, size, tw: Math.random() < 0.1, arm: true });
  }
  // Polvo tenue alrededor.
  for (let i = 0; i < 500; i++) {
    targets.push({ kind: "star", rad: rand(80, 620), ang: rand(0, Math.PI * 2), y: gauss() * 30, c: mix(ARM_OUT, VIOLET, Math.random()), size: 1.8, alpha: 0.45 });
  }
  // Líneas de partículas que entran en espiral hacia el centro.
  for (let i = 0; i < 500; i++) {
    targets.push({ kind: "stream", s: i % 4, u0: Math.random(), speed: rand(0.05, 0.08), c: STREAM, size: 2.4, lastU: 0 });
  }

  const stars = targets.filter((t) => t.kind === "star");
  const shapes = { cap: capShape(stars.length), heart: heartModel(stars.length), logo: upbModel(A.brandForum, stars.length) };
  stars.forEach((t, i) => {
    t.shape = { cap: shapes.cap[i], heart: shapes.heart[i], logo: shapes.logo[i] };
  });

  const state = { mode: "galaxy", since: 0 };

  function applyColors() {
    for (const t of targets) {
      const c = state.mode === "galaxy" || t.kind === "stream" ? t.c : t.shape[state.mode].c;
      t.r = c[0];
      t.g = c[1];
      t.b = c[2];
      t.size = state.mode === "galaxy" || t.kind === "stream" ? t.sizeG : 2.8;
      t.a = state.mode === "galaxy" ? (t.alpha ?? 1) : 1;
    }
  }
  for (const t of targets) t.sizeG = t.size;
  applyColors();

  const ct = Math.cos(TILT), st = Math.sin(TILT);

  function transform(p, t, el, out) {
    let x, y, z, cp = ct, sp = st, yaw = 0;
    const mode = state.mode;
    if (t.kind === "stream") {
      const u = (t.u0 + el * t.speed) % 1;
      const r = 640 * Math.pow(1 - u, 0.9) + 15;
      const a = t.s * (Math.PI / 2) + 0.6 + u * 2.6 + el * 0.08;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r;
      y = 0;
      if (mode !== "galaxy") {
        cp = 1;
        sp = 0;
        y = z * 0.55;
        z = 0;
      }
      // Al reiniciar el recorrido, la partícula reaparece afuera en vez de cruzar la pantalla.
      if (u < t.lastU) {
        const persp = F / (F + y * sp + z * cp);
        p.x = CX + x * persp;
        p.y = CY + (y * cp - z * sp) * persp;
        p.vx = p.vy = 0;
      }
      t.lastU = u;
    } else if (mode === "galaxy") {
      // El núcleo gira más rápido; los brazos rotan como patrón para no enrollarse con el tiempo.
      const w = t.arm ? 0.11 : 0.32 * Math.sqrt(90 / (t.rad + 90));
      const a = t.ang + el * w;
      x = Math.cos(a) * t.rad;
      z = Math.sin(a) * t.rad;
      y = t.y;
    } else {
      const s = t.shape[mode];
      let k = 1;
      if (mode === "heart") {
        // Latido doble.
        const ph = (el * 1.15) % 1;
        k = 1 + 0.11 * Math.exp(-ph * 14) + (ph > 0.22 ? 0.07 * Math.exp(-(ph - 0.22) * 14) : 0);
        yaw = Math.sin(el * 0.7) * 0.5;
      } else if (mode === "logo") {
        yaw = Math.sin(el * 0.6) * 0.75;
      } else {
        yaw = el * 0.7;
      }
      x = s.x * k;
      y = s.y * k;
      z = s.z * k;
      cp = Math.cos(0.18);
      sp = Math.sin(0.18);
    }
    if (yaw) {
      const c = Math.cos(yaw), si = Math.sin(yaw);
      const nx = x * c + z * si;
      z = -x * si + z * c;
      x = nx;
    }
    const y2 = y * cp - z * sp;
    const z2 = y * sp + z * cp;
    const persp = F / (F + z2);
    out[0] = CX + x * persp;
    out[1] = CY + y2 * persp;
    p.ds = persp * (t.tw && mode === "galaxy" ? 0.65 + 0.7 * Math.abs(Math.sin(el * 2.6 * (0.4 + p.phase) + p.phase * 30)) : 1);
  }

  return {
    modes: GALAXY_MODES,
    get mode() {
      return state.mode;
    },
    reset() {
      state.mode = "galaxy";
      applyColors();
    },
    setMode(field, mode) {
      state.mode = mode;
      applyColors();
      field.refreshTargets();
    },
    formation: {
      targets,
      transform,
      k: 0.045,
      damp: 0.82,
      idle: 0.3,
      mouse: 1.2,
      ambientAlpha: 0.3,
      ambientSize: 1.6,
      ambientSpeed: 0.15,
    },
  };
}
