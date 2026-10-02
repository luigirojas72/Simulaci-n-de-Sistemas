// "Una visión. Dos generaciones." como juego de relevos.
// Dos barras (jóvenes a la izquierda, experiencia a la derecha) se pasan la visión: un birrete 3D.
// Si nadie lo devuelve y toca el borde, la visión se rompe en partículas... y vuelve a armarse.

const TOP = 330;
const BOTTOM = 1020;
const PADDLE_W = 30;
const PADDLE_H = 210;
const BALL_R = 70;
const CENTER = { x: 960, y: 675 };

const PURPLE_TOP = [138, 79, 208];
const PURPLE_EDGE = [91, 42, 134];
const PURPLE_DARK = [74, 35, 112];
const RED = [247, 53, 63];

function pt(lx, ly, z, c) {
  return { lx, ly, z, r: c[0], g: c[1], b: c[2], ball: true };
}

// Birrete en 3D (coordenadas locales, y hacia abajo): tablero cuadrado, casquete y cordón con borla.
function capModel() {
  const pts = [];
  const S = 78, top = -30, step = 7;
  for (let x = -S; x <= S; x += step) {
    for (let z = -S; z <= S; z += step) pts.push(pt(x, top, z, PURPLE_TOP));
  }
  for (let a = -S; a <= S; a += step / 1.5) {
    for (const dy of [3, 7]) {
      pts.push(pt(a, top + dy, -S, PURPLE_EDGE), pt(a, top + dy, S, PURPLE_EDGE));
      pts.push(pt(-S, top + dy, a, PURPLE_EDGE), pt(S, top + dy, a, PURPLE_EDGE));
    }
  }
  const rows = 8;
  for (let i = 0; i < rows; i++) {
    const y = top + 10 + (i / (rows - 1)) * 48;
    const r = 50 + (i / (rows - 1)) * 4;
    const n = Math.round((2 * Math.PI * r) / 7);
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2;
      pts.push(pt(Math.cos(a) * r, y, Math.sin(a) * r, PURPLE_DARK));
    }
  }
  // Cordón rojo: del botón central a una esquina, luego cuelga.
  for (let i = 0; i < 6; i++) pts.push(pt((Math.random() - 0.5) * 6, top - 4, (Math.random() - 0.5) * 6, RED));
  const corner = S * 0.92;
  for (let u = 0; u <= 1; u += 0.025) {
    for (let k = 0; k < 2; k++) pts.push(pt(corner * u + (Math.random() - 0.5) * 3, top - 3, corner * u + (Math.random() - 0.5) * 3, RED));
  }
  for (let y = top; y <= top + 70; y += 2.5) {
    for (let k = 0; k < 2; k++) pts.push(pt(corner + (Math.random() - 0.5) * 3, y, corner + (Math.random() - 0.5) * 3, RED));
  }
  for (let i = 0; i < 70; i++) {
    pts.push(pt(corner + (Math.random() - 0.5) * 12, top + 70 + Math.random() * 26, corner + (Math.random() - 0.5) * 12, RED));
  }
  return pts;
}

function paddle(group, gen) {
  const pts = [];
  for (let x = -PADDLE_W / 2; x <= PADDLE_W / 2; x += 4.5) {
    for (let y = -PADDLE_H / 2; y <= PADDLE_H / 2; y += 4.5) pts.push({ lx: x, ly: y, group, gen });
  }
  return pts;
}

export function makePong() {
  const paddles = [
    { x: 120, y: CENTER.y, w: PADDLE_W },
    { x: 1800, y: CENTER.y, w: PADDLE_W },
  ];
  const rot3d = { x: CENTER.x, y: CENTER.y, f: 700, auto: 0.035, pitch: 0.5 };
  const score = { text: "", x: 960, y: 310 };
  const ball = { x: CENTER.x, y: CENTER.y, vx: 0, vy: 0, wait: 0, rally: 0, best: 0 };
  let grab = null;

  function serve() {
    const dir = Math.random() < 0.5 ? -1 : 1;
    const a = (Math.random() - 0.5) * 0.9;
    ball.vx = Math.cos(a) * 8 * dir;
    ball.vy = Math.sin(a) * 8;
  }

  function reset() {
    ball.x = CENTER.x;
    ball.y = CENTER.y;
    ball.wait = 1.2;
    ball.rally = 0;
    for (const p of paddles) p.y = CENTER.y;
    grab = null;
  }

  function label() {
    score.text = `RELEVOS: ${ball.rally}` + (ball.best ? `   ·   MEJOR: ${ball.best}` : "");
  }

  function hit(p, side) {
    const dy = ball.y - p.y;
    if (Math.abs(dy) > PADDLE_H / 2 + BALL_R * 0.6) return false;
    const speed = Math.min(17, Math.hypot(ball.vx, ball.vy) * 1.06);
    const a = (dy / (PADDLE_H / 2)) * 0.85;
    ball.vx = Math.cos(a) * speed * side;
    ball.vy = Math.sin(a) * speed;
    ball.rally++;
    ball.best = Math.max(ball.best, ball.rally);
    return true;
  }

  function update(field) {
    const dt = 1 / 60;
    if (ball.wait > 0) {
      ball.wait -= dt;
      if (ball.wait <= 0) serve();
    } else {
      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.y - BALL_R < TOP && ball.vy < 0) ball.vy *= -1;
      if (ball.y + BALL_R > BOTTOM && ball.vy > 0) ball.vy *= -1;

      const [L, R] = paddles;
      if (ball.vx < 0 && ball.x - BALL_R < L.x + PADDLE_W / 2 && ball.x > L.x) hit(L, 1);
      if (ball.vx > 0 && ball.x + BALL_R > R.x - PADDLE_W / 2 && ball.x < R.x) hit(R, -1);

      // Nadie la devolvió: la visión toca el borde y se rompe.
      if (ball.x - BALL_R * 0.5 < 0 || ball.x + BALL_R * 0.5 > 1920) {
        field.explode(ball.x, ball.y, (t) => t.ball);
        ball.x = CENTER.x;
        ball.y = CENTER.y;
        ball.vx = ball.vy = 0;
        ball.rally = 0;
        ball.wait = 3.2;
      }
    }
    rot3d.x = ball.x;
    rot3d.y = ball.y;
    label();
  }

  return {
    reset,
    // Clic sobre una barra para tomarla; se mueve de arriba a abajo hasta soltar.
    down(x, y) {
      grab = paddles.find((p) => Math.abs(x - p.x) < 80 && Math.abs(y - p.y) < PADDLE_H / 2 + 40) || null;
      if (grab) grab.offset = y - grab.y;
      return !!grab;
    },
    move(_x, y) {
      if (!grab) return;
      grab.y = Math.max(TOP + PADDLE_H / 2, Math.min(BOTTOM - PADDLE_H / 2, y - grab.offset));
    },
    up() {
      grab = null;
    },
    formation: {
      targets: [...capModel(), ...paddle(0, 1), ...paddle(1, 0)],
      rot3d,
      groups: paddles,
      update,
      k: 0.12,
      damp: 0.72,
      mouse: 0,
      idle: 0.4,
      size: 3.4,
      ambientAlpha: 0.22,
      ambientSpeed: 0.6,
      labels: [
        { text: "JÓVENES", x: 160, y: 310 },
        { text: "EXPERIENCIA", x: 1760, y: 310 },
        score,
        { text: "CLIC SOSTENIDO SOBRE UNA BARRA PARA MOVERLA", x: 960, y: 1062 },
      ],
    },
    score,
  };
}
