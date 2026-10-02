// Guion del cliente (secuencia intacta) y la estructura que cada momento construye.
import { W, H } from "./field.js";
import { sampleShape, samplePhoto, place, local, drawContain, drawCap, drawGear, drawFlags } from "./shapes.js";

const N = 7000;

function photo(img, x, y, w, h, count, opts) {
  return place(samplePhoto(img, w, h, count, opts), x, y);
}

function logo(img, x, y, w, count) {
  const h = (w * img.height) / img.width;
  return place(sampleShape((g, cw, ch) => drawContain(g, img, cw, ch), w, h, count, { jitter: 0.6 }), x, y);
}

// Disco con distribución de girasol: orgánico, sin rejilla.
function disc(cx, cy, R, count, filter) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count * 3 && pts.length < count; i++) {
    const r = Math.sqrt((i + 0.5) / (count * (filter ? 2 : 1))) * R;
    if (r > R) break;
    const a = i * golden;
    const x = cx + Math.cos(a) * r + (Math.random() - 0.5) * 6;
    const y = cy + Math.sin(a) * r + (Math.random() - 0.5) * 6;
    if (!filter || filter(x, y)) pts.push({ x, y });
  }
  return pts;
}

// Rutas: curvas cúbicas que atraviesan el escenario.
const ROUTES = [
  [[820, 300], [1100, 180], [1400, 420], [1860, 260]],
  [[820, 470], [1150, 380], [1450, 600], [1860, 480]],
  [[820, 640], [1100, 760], [1500, 520], [1860, 700]],
  [[820, 820], [1200, 700], [1500, 920], [1860, 860]],
];

function bez(r, u) {
  const v = 1 - u;
  const a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
  return [
    a * r[0][0] + b * r[1][0] + c * r[2][0] + d * r[3][0],
    a * r[0][1] + b * r[1][1] + c * r[2][1] + d * r[3][1],
  ];
}

export function buildSlides(A) {
  const actorTargets = [
    ...local(sampleShape((g, w, h) => drawContain(g, A.brand90, w, h), 300, 340, 1300), 300, 340, 0),
    ...local(sampleShape(drawGear, 320, 320, 1300), 320, 320, 1),
    ...local(sampleShape(drawFlags, 380, 250, 1700, { jitter: 0.3 }), 380, 250, 2),
  ];

  const logoTitle = logo(A.brandForum, 260, 200, 1400, 5000);
  const logoClose = logo(A.brandForum, 510, 110, 900, 3000);

  // Símbolo de 90 años en capas: adelante la generación joven, atrás la experiencia.
  const symbol3d = [];
  const LAYERS = 7;
  for (let i = 0; i < LAYERS; i++) {
    const z = -90 + (180 * i) / (LAYERS - 1);
    const gen = z < 0 ? 1 : z > 0 ? 0 : undefined;
    for (const p of local(sampleShape((g, w, h) => drawContain(g, A.brand90, w, h), 340, 400, 540), 340, 400)) {
      symbol3d.push({ lx: p.lx, ly: p.ly, z: z + (Math.random() - 0.5) * 8, gen });
    }
  }

  return [
    {
      kicker: "Future Leaders Forum · Fórum UPB",
      title: "Relevo generacional: <em>la ventaja que nadie está aprovechando</em>",
      layout: "bottom",
      brand: false,
      // La marca existe, pero muchas partículas siguen sueltas: potencial sin vínculo.
      formation: {
        targets: logoTitle,
        k: 0.035,
        mouse: 1.6,
        idle: 1.3,
        size: 2.6,
        ambientAlpha: 0.5,
        ambientSize: 2.6,
        ambientSpeed: 0.8,
      },
    },
    {
      kicker: "Un espacio con una sola forma",
      title: "¿Un gran auditorio solo para hacer grados?",
      layout: "left",
      // Estructura rígida: casi no vibra, el mouse apenas la deforma.
      formation: {
        targets: [
          ...photo(A.grados, 820, 210, 1000, 667, 5200),
          ...place(sampleShape(drawCap, 330, 230, 900), 120, 170),
        ],
        k: 0.09,
        damp: 0.78,
        idle: 0.25,
        idleSpeed: 0.3,
        mouse: 0.45,
        size: 10,
        ambientSpeed: 0.12,
        ambientAlpha: 0.15,
      },
    },
    {
      kicker: "Apertura",
      title: "Los eventos no llegaron a la Universidad. <em>La Universidad decidió encontrarse con el mundo.</em>",
      layout: "left",
      // La estructura se vuelve porosa: personas salen y otras llegan desde fuera.
      formation: {
        targets: photo(A.entrada, 820, 200, 1020, 680, 5400),
        k: 0.03,
        idle: 1,
        size: 10,
        porosity: 0.0025,
        porosityCenter: { x: 1330, y: 540 },
        ambientPull: { x: 1330, y: 540, r: 420, strength: 0.03 },
        ambientAlpha: 0.5,
        ambientSpeed: 1.2,
      },
    },
    {
      kicker: "Tres fuerzas",
      title: "Academia + Industria + Ciudad",
      layout: "left",
      // Tres actores con forma, color y ritmo propios. Todavía separados.
      formation: {
        key: "actors",
        targets: actorTargets,
        k: 0.04,
        idle: 0.9,
        size: 3.2,
        groups: [
          { x: 1000, y: 420, w: 300, pulse: 0.025 },
          { x: 1600, y: 420, w: 320, spin: 0.25 },
          { x: 1300, y: 800, w: 380, wave: 14 },
        ],
        links: { exp: 0.25, jov: 0.25, cross: 0 },
        labels: [
          { text: "ACADEMIA", x: 1000, y: 625 },
          { text: "INDUSTRIA", x: 1600, y: 625 },
          { text: "CIUDAD", x: 1300, y: 965 },
        ],
      },
    },
    {
      kicker: "Impacto",
      title: "Los eventos nunca fueron el objetivo. <em>El impacto sí.</em>",
      layout: "left",
      // Los tres actores se acercan y su encuentro emite ondas que mueven todo el campo.
      formation: {
        key: "actors",
        k: 0.04,
        idle: 0.9,
        size: 3.2,
        groups: [
          { x: 1150, y: 470, w: 300, pulse: 0.04, scale: 0.85 },
          { x: 1460, y: 470, w: 320, spin: 0.4, scale: 0.85 },
          { x: 1305, y: 700, w: 380, wave: 18, scale: 0.85 },
        ],
        waves: { x: 1305, y: 560, every: 1.9, speed: 520, width: 70, force: 1.6 },
        links: { exp: 0.4, jov: 0.4, cross: 0.6 },
        ambientAlpha: 0.45,
      },
    },
    {
      kicker: "Comunidad",
      title: "Un evento trae personas. <em>Una comunidad trae transformación.</em>",
      layout: "left",
      // Primero solo hay puntos (personas). Luego aparecen las líneas y las personas cambian de color.
      formation: {
        targets: photo(A.evento, 820, 200, 1020, 680, 5600),
        k: 0.035,
        idle: 1.1,
        size: 10,
        links: { exp: 0.6, jov: 0.6, cross: 0.75 },
        linkRamp: 5,
        linkDist: 80,
        maxLinks: 3,
        colorShift: { to: 0.3, dur: 7 },
      },
    },
    {
      kicker: "Confianza",
      title: "El talento crece a la velocidad de la confianza.",
      layout: "left",
      // Resortes rígidos y vínculos estables: la red crece sin dispersarse.
      formation: {
        targets: disc(1330, 540, 400, 3200),
        k: 0.06,
        idle: 0.7,
        idleSpeed: 0.5,
        colorMode: "gen",
        size: 3.4,
        grow: { x: 1330, y: 540, from: 0.45, to: 1.05, dur: 9 },
        links: { exp: 0.9, jov: 0.9, cross: 0.9 },
        linkDist: 64,
        maxLinks: 5,
        linkRamp: 3,
        ambientAlpha: 0.18,
      },
    },
    {
      kicker: "Rutas",
      title: "La experiencia construye el camino. <em>Las nuevas generaciones descubren nuevas rutas.</em>",
      layout: "left",
      // Experiencia: quieta sobre los caminos. Jóvenes: los recorren y algunos se desvían.
      formation: (() => {
        const targets = [];
        for (let i = 0; i < 2400; i++) {
          const route = ROUTES[i % ROUTES.length];
          const [x, y] = bez(route, Math.random());
          targets.push({ x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 10, gen: 0 });
        }
        for (let i = 0; i < 3000; i++) {
          const explorer = Math.random() < 0.35;
          targets.push({
            gen: 1,
            route: i % ROUTES.length,
            u0: Math.random(),
            speed: 0.04 + Math.random() * 0.05,
            dev: explorer ? 60 + Math.random() * 140 : (Math.random() - 0.5) * 16,
            freq: 1 + Math.random() * 2,
          });
        }
        return {
          targets,
          k: 0.08,
          damp: 0.8,
          idle: 0.5,
          colorMode: "gen",
          sizeGen: [2.6, 3],
          trails: 0.16,
          ambientAlpha: 0.12,
          transform(p, t, el, out) {
            if (t.route === undefined) {
              out[0] = t.x;
              out[1] = t.y;
              return;
            }
            const r = ROUTES[t.route];
            const u = (t.u0 + el * t.speed) % 1;
            const [x, y] = bez(r, u);
            const [x2, y2] = bez(r, Math.min(1, u + 0.01));
            const tx = x2 - x, ty = y2 - y;
            const len = Math.hypot(tx, ty) || 1;
            const off = t.dev * Math.sin(u * Math.PI) * Math.sin(u * Math.PI * t.freq + p.phase * 6);
            out[0] = x - (ty / len) * off;
            out[1] = y + (tx / len) * off;
          },
        };
      })(),
    },
    {
      kicker: "Una visión",
      title: "Una visión. <em>Dos generaciones.</em>",
      layout: "left",
      // Un solo círculo (la visión) con dos mitades de comportamiento distinto, sin vínculos entre ellas.
      formation: {
        targets: [
          ...disc(1330, 540, 380, 2800, (x) => x < 1316).map((p) => ({ ...p, gen: 1 })),
          ...disc(1330, 540, 380, 2600, (x) => x > 1344).map((p) => ({ ...p, gen: 0 })),
        ],
        k: 0.05,
        colorMode: "gen",
        idleGen: [0.5, 9],
        idleSpeedGen: [0.35, 2.4],
        sizeGen: [3.2, 2.8],
        links: { exp: 0.9, jov: 0.25, cross: 0 },
        linkDist: 62,
        ambientAlpha: 0.12,
      },
    },
    {
      kicker: "Juntas",
      title: "El crecimiento no ocurre cuando una generación reemplaza a otra. <em>Ocurre cuando trabajan juntas.</em>",
      layout: "left",
      // Las dos mitades se mezclan; aparecen los vínculos rojos entre generaciones. Tecla X / Z: quitar una.
      formation: {
        targets: disc(1330, 540, 430, 6200),
        k: 0.05,
        colorMode: "gen",
        idleGen: [0.6, 3],
        idleSpeedGen: [0.4, 1.6],
        sizeGen: [3, 2.8],
        spin: { x: 1330, y: 540, speed: 0.05 },
        grow: { x: 1330, y: 540, from: 0.8, to: 1, dur: 6 },
        links: { exp: 0.35, jov: 0.35, cross: 1 },
        linkDist: 66,
        maxLinks: 5,
        linkRamp: 3,
      },
    },
    {
      kicker: "Presente",
      title: "Los jóvenes no son el futuro. <em>Son el presente que muchas organizaciones aún no ven.</em>",
      layout: "left",
      // Solo la generación joven forma la imagen; la experiencia queda detrás, mirando.
      formation: {
        targets: photo(A.jovenes, 820, 200, 1020, 680, 3700).map((p) => ({ ...p, gen: 1 })),
        k: 0.05,
        idle: 1,
        size: 13,
        ambientAlpha: 0.16,
        ambientSize: 2.6,
        ambientSpeed: 0.5,
      },
    },
    {
      kicker: "Construcción",
      title: "El futuro no se hereda. <em>Se construye.</em>",
      layout: "left",
      // El edificio se arma desde la base hacia arriba; los vínculos son el andamio.
      formation: {
        targets: photo(A.edificio, 780, 190, 1080, 700, 6400).map((p) => ({
          ...p,
          delay: (1 - (p.y - 190) / 700) * 4.5 + Math.random() * 0.8,
        })),
        k: 0.045,
        idle: 0.7,
        size: 9,
        links: { exp: 0.5, jov: 0.5, cross: 0.6 },
        linkRamp: 4,
        linkDist: 60,
        ambientAlpha: 0.3,
      },
    },
    {
      kicker: "Continuidad",
      title: "@centrodeeventosupb",
      layout: "close",
      brand: false,
      qr: true,
      drag: true,
      // Cierre: vuelve la marca (2D) y debajo los 90 años como estructura con profundidad (3D).
      // De frente es una sola marca; al girarla se ve que está hecha de capas de generaciones.
      // Ambas se deforman con el puntero; el símbolo 3D se gira arrastrando.
      formation: {
        targets: [...logoClose, ...symbol3d],
        rot3d: { x: 960, y: 560, f: 900, auto: 0.006 },
        k: 0.035,
        damp: 0.84,
        mouse: 2,
        idle: 0.8,
        size: 2.6,
        labels: [{ text: "ARRASTRA PARA GIRAR", x: 960, y: 820 }],
        ambientAlpha: 0.55,
        ambientSize: 2.6,
        ambientSpeed: 0.7,
      },
    },
  ];
}

export { N, W, H };
