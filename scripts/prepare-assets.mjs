// Copia y optimiza las fotos del cliente para la presentación.
import sharp from "sharp";
import fs from "fs";

const SRC = "C:/Users/HP/Downloads/recursos cliente/RECURSOS/";
const OUT = "public/assets/";

const photos = {
  "grados.jpg": "FOTO 1.jpg",
  "entrada.jpg": "20240815_215042752_iOS.jpg",
  "evento.jpg": "FOTO 3.jpg",
  "jovenes.jpg": "FOTO 4.jpg",
  "edificio.jpg": "FÓRUM JPG  (5).jpg",
};

for (const [out, src] of Object.entries(photos)) {
  await sharp(SRC + src).rotate().resize(1600, 1000, { fit: "inside" }).jpeg({ quality: 82 }).toFile(OUT + out);
  console.log("ok", out);
}
for (const f of ["brand-forum.png", "brand-90.png", "qr-social.png"]) fs.copyFileSync("assets/src/" + f, OUT + f);
