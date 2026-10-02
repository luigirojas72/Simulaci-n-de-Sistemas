# Relevo generacional · Fórum UPB

Presentación generativa para la charla *"Relevo generacional: la ventaja que nadie está aprovechando"* (Unidad 5, sistemas de partículas).

## Concepto: el espacio lo sostienen las relaciones

Una sola población de ~7000 partículas (personas) atraviesa toda la charla. En cada momento del guion las **mismas** partículas se reorganizan en una estructura nueva: el logo, un auditorio de grados, tres actores, una red, dos generaciones, un edificio. La presentación no cambia de "diapositiva": cambia la forma en que las personas se relacionan.

## Gramática visual

| Elemento | Significado |
|---|---|
| Partícula | Una persona |
| Partícula crema, pesada y lenta | Experiencia |
| Partícula cian/magenta, ligera y rápida | Generación joven |
| Resorte hacia su lugar | Vínculo con una estructura (el mouse la perturba y el vínculo la devuelve) |
| Rigidez del resorte | Confianza o rigidez institucional |
| Línea crema / cian / **roja** | Relación entre experiencia / entre jóvenes / **entre generaciones** |
| Onda | Impacto que se propaga |
| Partícula suelta | Potencial que aún no pertenece a ninguna estructura |
| Foto hecha de partículas | Un lugar real del Fórum sostenido por personas |

## Recorrido del guion

1. **Relevo generacional**: el logo UPB Fórum hecho de partículas; alrededor, muchas partículas sueltas. Es la ventaja que nadie aprovecha.
2. **¿Solo para grados?**: la foto de una ceremonia de grados y un birrete. Los resortes son muy rígidos y casi no vibran: un espacio con una sola forma.
3. **Encontrarse con el mundo**: la estructura se vuelve porosa; unas partículas salen y otras llegan desde fuera.
4. **Academia + Industria + Ciudad**: tres actores con forma, color y ritmo propios (símbolo UPB 90 años, engranaje, banderas de Colombia y Medellín).
5. **El impacto sí**: los tres actores se acercan y su encuentro emite ondas que mueven todo el campo.
6. **Comunidad**: una foto de un evento. Primero solo hay puntos (personas); luego aparecen las líneas y las personas cambian de color (transformación).
7. **Confianza**: resortes rígidos y vínculos estables; la red crece sin dispersarse.
8. **Rutas**: la experiencia se queda sobre los caminos; los jóvenes los recorren y algunos se desvían para abrir rutas nuevas.
9. **Una visión, dos generaciones**: un solo círculo (la visión) con dos mitades de comportamiento distinto y sin vínculos entre ellas.
10. **Trabajan juntas**: las mitades se mezclan y aparecen los vínculos rojos entre generaciones.
11. **Los jóvenes son el presente**: solo la generación joven forma la imagen; la experiencia queda detrás.
12. **El futuro se construye**: el edificio del Fórum se arma desde la base y los vínculos funcionan como andamio.
13. **Continuidad**: el símbolo de los 90 años de la UPB en 3D, hecho de capas de partículas: adelante la generación joven y atrás la experiencia. De frente se ve una sola marca (una visión); al girarlo (arrastrando el mouse) se ve que tiene profundidad porque está hecho de generaciones apiladas.

## Demostración en vivo

- **X**: quita la generación joven. La estructura pierde sostén y cae.
- **Z**: quita la experiencia. La energía joven se dispersa sin estructura.

Sirve para mostrar en la exposición que el significado está en las relaciones, no en la imagen.

## Controles

`→` / espacio / PageDown: avanzar · `←` / PageUp: volver · `F`: pantalla completa · `H`: ocultar controles · `L` o `?`: gramática visual · `R`: reiniciar

## Ejecutar

```bash
npm install
npm run dev
```

`npm run build` genera `dist/` para publicar (por ejemplo en GitHub Pages). `npm run assets` regenera las fotos optimizadas desde los recursos del cliente.

## Archivos

- `src/field.js`: motor de partículas (resortes, ondas, vínculos, demostración).
- `src/slides.js`: guion y estructura de cada momento.
- `src/shapes.js`: convierte fotos, logos y figuras en puntos objetivo.
- `src/main.js`: navegación, texto y controles.
