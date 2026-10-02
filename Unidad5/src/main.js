import "./styles.css";
import { Field, W, H } from "./field.js";
import { buildSlides, N } from "./slides.js";

const BASE = import.meta.env.BASE_URL;
const $ = (id) => document.getElementById(id);

function loadImage(name) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `${BASE}assets/${name}`;
  });
}

const canvas = $("field");
const stage = $("stage");
const field = new Field(canvas, N);
let slides = [];
let index = 0;
if (import.meta.env.DEV) window.__field = field;

function layout() {
  const w = innerWidth, h = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  field.resize(w, h, dpr);
  const { s, ox, oy } = field.view;
  stage.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
}

function go(i) {
  index = (i + slides.length) % slides.length;
  const s = slides[index];
  field.removeGen = null;
  field.rot.yaw = 0;
  field.rot.pitch = 0.2;
  if (s.game) s.game.reset();
  if (s.shapes) s.shapes.reset();
  field.setFormation(s.formation);
  $("demo").classList.remove("show");

  const copy = $("copy");
  copy.classList.remove("in");
  copy.className = `copy layout-${s.layout}`;
  $("kicker").textContent = s.kicker;
  $("title").innerHTML = s.title;
  void copy.offsetWidth;
  copy.classList.add("in");

  $("brand").classList.toggle("hidden", s.brand === false);
  $("qr").classList.toggle("show", !!s.qr);
  document.body.classList.toggle("draggable", !!s.drag || !!s.game || !!s.shapes);
  $("pong-ui").classList.toggle("show", !!s.game);
  $("pong-ui").classList.remove("paused");
  $("pause").textContent = "❚❚";
  $("shapes").classList.toggle("show", !!s.shapes);
  if (s.shapes) renderShapeButtons(s.shapes);
  $("count").textContent = `${String(index + 1).padStart(2, "0")}`;
}

// Pausa del juego de relevos: muestra qué significa y el botón se encoge a un costado.
function togglePause() {
  const g = slides[index]?.game;
  if (!g) return;
  g.setPaused(!g.paused);
  $("pong-ui").classList.toggle("paused", g.paused);
  $("pause").textContent = g.paused ? "▶" : "❚❚";
  $("pause").setAttribute("aria-label", g.paused ? "Reanudar" : "Pausar");
  if (g.paused) {
    const st = g.stats();
    $("pause-stats").textContent = `Relevos en esta partida: ${st.total} · Mejor racha: ${st.best}`;
  }
}

// "Dar forma": las mismas partículas de la galaxia toman otra figura.
function renderShapeButtons(shapes) {
  const box = $("shape-buttons");
  box.innerHTML = "";
  shapes.modes.forEach((mode, i) => {
    const b = document.createElement("button");
    b.textContent = mode.label;
    b.title = `Tecla ${i + 1}`;
    b.classList.toggle("active", shapes.mode === mode.id);
    b.onclick = () => setShape(mode.id);
    box.appendChild(b);
  });
}

function setShape(id) {
  const shapes = slides[index]?.shapes;
  if (!shapes) return;
  shapes.setMode(field, id);
  renderShapeButtons(shapes);
}

// Demostración en vivo: quitar una generación y ver qué le pasa a la estructura.
function toggleRemove(gen) {
  field.removeGen = field.removeGen === gen ? null : gen;
  const demo = $("demo");
  if (field.removeGen === null) {
    demo.classList.remove("show");
    field.start = field.time - 99;
    return;
  }
  demo.textContent =
    gen === 1
      ? "Sin la generación joven, la estructura pierde sostén y cae."
      : "Sin la experiencia, la energía joven no encuentra estructura y se dispersa.";
  demo.classList.add("show");
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
}

addEventListener("keydown", (e) => {
  const k = e.key;
  if (k === "ArrowRight" || k === " " || k === "PageDown" || k === "Enter") go(index + 1);
  else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") go(index - 1);
  else if (k === "f" || k === "F") toggleFullscreen();
  else if (k === "h" || k === "H") document.body.classList.toggle("clean");
  else if (k === "l" || k === "L") $("legend").classList.toggle("show");
  else if (k === "r" || k === "R") go(0);
  else if (k === "x" || k === "X") toggleRemove(1);
  else if (k === "z" || k === "Z") toggleRemove(0);
  else if (k === "p" || k === "P") togglePause();
  else if (k >= "1" && k <= "4" && slides[index]?.shapes) setShape(slides[index].shapes.modes[+k - 1].id);
  else if (k === "Home") go(0);
  else if (k === "End") go(slides.length - 1);
  else return;
  e.preventDefault();
});

// Arrastrar gira el objeto 3D del cierre u orbita la cámara de la galaxia; en el resto de momentos
// el puntero perturba la estructura. Un clic corto produce una mini explosión en cualquier momento.
let drag = null;
let game = null;
let click = null;
addEventListener("pointermove", (e) => {
  field.setPointer(e.clientX, e.clientY, true);
  if (game) game.move(field.mouse.x, field.mouse.y);
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  drag = { ...drag, x: e.clientX, y: e.clientY };
  if (drag.camera) {
    drag.camera.drag(dx, dy);
    return;
  }
  field.rot.yaw += dx * 0.006;
  field.rot.vyaw = dx * 0.004;
  field.rot.pitch = Math.max(-1.2, Math.min(1.2, field.rot.pitch + dy * 0.006));
});
addEventListener("pointerdown", (e) => {
  field.setPointer(e.clientX, e.clientY, true);
  if (e.target.closest?.("button")) return;
  click = { x: e.clientX, y: e.clientY, t: performance.now() };
  const g = slides[index]?.game;
  if (g && g.down(field.mouse.x, field.mouse.y)) {
    game = g;
    document.body.classList.add("dragging");
    return;
  }
  const camera = slides[index]?.shapes?.camera;
  if (!slides[index]?.drag && !camera) return;
  drag = { x: e.clientX, y: e.clientY, camera };
  field.rot.dragging = true;
  document.body.classList.add("dragging");
});
addEventListener("pointerup", (e) => {
  if (click && Math.hypot(e.clientX - click.x, e.clientY - click.y) < 8 && performance.now() - click.t < 400) {
    field.setPointer(e.clientX, e.clientY, true);
    field.burst(field.mouse.x, field.mouse.y);
  }
  click = null;
  if (game) game.up();
  game = null;
  drag = null;
  field.rot.dragging = false;
  document.body.classList.remove("dragging");
});
addEventListener(
  "wheel",
  (e) => {
    const camera = slides[index]?.shapes?.camera;
    if (!camera) return;
    camera.zoom(e.deltaY);
    e.preventDefault();
  },
  { passive: false },
);
document.addEventListener("pointerleave", () => (field.mouse.on = false));
addEventListener("blur", () => (field.mouse.on = false));
addEventListener("resize", layout);

$("prev").onclick = () => go(index - 1);
$("next").onclick = () => go(index + 1);
$("full").onclick = toggleFullscreen;
$("pause").onclick = togglePause;
$("help").onclick = () => $("legend").classList.toggle("show");

let last = performance.now();
let acc = 0;
function frame(now) {
  acc += Math.min(0.1, (now - last) / 1000);
  last = now;
  // Máximo 2 pasos por cuadro: en un equipo lento la simulación se ralentiza en vez de trabarse.
  for (let i = 0; acc >= 1 / 60 && i < 2; i++) {
    field.step();
    acc -= 1 / 60;
  }
  if (acc > 1 / 30) acc = 0;
  field.render();
  requestAnimationFrame(frame);
}

async function init() {
  layout();
  const [brandForum, brand90, grados, entrada, evento, jovenes, edificio] = await Promise.all(
    ["brand-forum.png", "brand-90.png", "grados.jpg", "entrada.jpg", "evento.jpg", "jovenes.jpg", "edificio.jpg"].map(loadImage),
  );
  await document.fonts.load("600 22px Inter");
  slides = buildSlides({ brandForum, brand90, grados, entrada, evento, jovenes, edificio });
  $("total").textContent = `/${slides.length}`;
  $("loading").remove();
  go(0);
  requestAnimationFrame(frame);
}

init();

export { W, H };
