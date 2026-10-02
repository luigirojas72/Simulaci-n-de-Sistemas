// Convierte imágenes, texto y figuras dibujadas en puntos objetivo para las partículas.
// Cada punto lleva su color, así una foto o un logo se "dibuja" con partículas.

function rasterize(draw, w, h) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  const g = c.getContext("2d", { willReadFrequently: true });
  draw(g, c.width, c.height);
  return { data: g.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height };
}

function scan(img, step, jitter, alphaMin) {
  const pts = [];
  const { data, w, h } = img;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const sx = Math.min(w - 1, Math.max(0, x + (Math.random() - 0.5) * jitter));
      const sy = Math.min(h - 1, Math.max(0, y + (Math.random() - 0.5) * jitter));
      const i = ((sy | 0) * w + (sx | 0)) * 4;
      if (data[i + 3] < alphaMin) continue;
      pts.push({ x: sx, y: sy, r: data[i], g: data[i + 1], b: data[i + 2] });
    }
  }
  return pts;
}

// Muestrea una figura buscando aproximadamente `count` puntos repartidos de forma uniforme.
export function sampleShape(draw, w, h, count, { jitter = 0.5, alphaMin = 110 } = {}) {
  const img = rasterize(draw, w, h);
  const probe = scan(img, 4, 0, alphaMin).length;
  const step = Math.max(2, Math.sqrt((probe * 16) / count));
  const pts = scan(img, step, step * jitter, alphaMin);
  pts.step = step;
  return pts;
}

// Fotos: rejilla regular (mosaico) con color por píxel, levemente realzado para pantalla grande.
export function samplePhoto(image, w, h, count, { lift = 1.12, jitter = 0.15 } = {}) {
  const pts = sampleShape((g, cw, ch) => drawCover(g, image, cw, ch), w, h, count, { jitter, alphaMin: 1 });
  for (const p of pts) {
    p.r = Math.min(255, p.r * lift + 10);
    p.g = Math.min(255, p.g * lift + 10);
    p.b = Math.min(255, p.b * lift + 12);
  }
  return pts;
}

export function place(pts, x, y) {
  for (const p of pts) {
    p.x += x;
    p.y += y;
  }
  return pts;
}

// Coordenadas locales centradas en (0,0), para figuras que se mueven como grupo.
export function local(pts, w, h, group) {
  for (const p of pts) {
    p.lx = p.x - w / 2;
    p.ly = p.y - h / 2;
    p.group = group;
  }
  return pts;
}

export function drawCover(g, img, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const iw = img.width * s;
  const ih = img.height * s;
  g.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}

export function drawContain(g, img, w, h) {
  const s = Math.min(w / img.width, h / img.height);
  const iw = img.width * s;
  const ih = img.height * s;
  g.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}

// Birrete de graduación.
export function drawCap(g, w, h) {
  g.fillStyle = "#cfc4ab";
  g.beginPath();
  g.moveTo(w * 0.24, h * 0.42);
  g.lineTo(w * 0.24, h * 0.74);
  g.quadraticCurveTo(w * 0.5, h * 0.9, w * 0.76, h * 0.74);
  g.lineTo(w * 0.76, h * 0.42);
  g.closePath();
  g.fill();

  g.fillStyle = "#f3ebd7";
  g.beginPath();
  g.moveTo(w * 0.5, h * 0.06);
  g.lineTo(w * 0.98, h * 0.32);
  g.lineTo(w * 0.5, h * 0.58);
  g.lineTo(w * 0.02, h * 0.32);
  g.closePath();
  g.fill();

  g.strokeStyle = "#d6a94f";
  g.lineWidth = h * 0.035;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(w * 0.5, h * 0.32);
  g.lineTo(w * 0.86, h * 0.4);
  g.lineTo(w * 0.86, h * 0.78);
  g.stroke();
  g.fillStyle = "#d6a94f";
  g.fillRect(w * 0.83, h * 0.76, w * 0.06, h * 0.16);
}

// Engranaje: la industria.
export function drawGear(g, w, h) {
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.48, r = R * 0.8, teeth = 12;
  g.fillStyle = "#f7353f";
  g.beginPath();
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const rad = i % 4 < 2 ? R : r;
    g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  g.closePath();
  g.fill();
  g.globalCompositeOperation = "destination-out";
  g.beginPath();
  g.arc(cx, cy, R * 0.36, 0, Math.PI * 2);
  g.fill();
  g.globalCompositeOperation = "source-over";
}

// Bandera de Colombia (arriba) y de Medellín (abajo): la ciudad.
export function drawFlags(g, w, h) {
  const fh = h * 0.45;
  g.fillStyle = "#fcd116";
  g.fillRect(0, 0, w, fh * 0.5);
  g.fillStyle = "#1f5fd6";
  g.fillRect(0, fh * 0.5, w, fh * 0.25);
  g.fillStyle = "#e3172d";
  g.fillRect(0, fh * 0.75, w, fh * 0.25);

  const y = h - fh;
  g.fillStyle = "#f7f7f4";
  g.fillRect(0, y, w, fh * 0.5);
  g.fillStyle = "#12a150";
  g.fillRect(0, y + fh * 0.5, w, fh * 0.5);
}
