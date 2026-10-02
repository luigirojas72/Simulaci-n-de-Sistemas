# Unidad 5: Sistemas de partículas

**Proyecto:** presentación generativa para la charla *"Relevo generacional: la ventaja que nadie está aprovechando"*, Centro de Eventos Fórum UPB.

- Código del proyecto: [Unidad5/](Unidad5/)
- Explicación técnica y controles: [Unidad5/README.md](Unidad5/README.md)
- Autoevaluación detallada: [Unidad5/AUTOEVALUACION.md](Unidad5/AUTOEVALUACION.md)

---

## Actividad 01: referentes

**Memo Akten, [Forms](https://memo.tv/projects/2011/forms/).** El movimiento de los atletas se convierte en estructuras que se extienden en el espacio y el tiempo. Lo que sostiene la estructura es la relación entre el cuerpo y su propio rastro. Lo que cambia es cómo ese rastro se deforma, se repite y se separa del cuerpo, y eso produce sentido porque el movimiento deja de ser un instante y se vuelve una forma que se puede leer. De aquí tomé la idea de que la forma no se dibuja: aparece porque los elementos están relacionados.

**[ForumTEDTALK](https://github.com/juanferfranco/ForumTEDTALK).** Cada frase del guion se traduce en un estado del sistema (espiral, red, rutas, densidad) sin ilustrar la frase de forma literal. La relación que sostiene la estructura es la de las partículas (personas) con la espiral (el Fórum como espacio vivo). Lo que cambia es la cantidad e intensidad de las conexiones, y eso produce sentido porque "potencial sin relación todavía no es comunidad". Usé el mismo guion, pero con una gramática propia: en vez de una espiral, el centro de mi propuesta son los vínculos que sostienen cada estructura.

## Actividad 02: encargo de diseño

### Concepto: el espacio lo sostienen las relaciones

Una sola población de ~7000 partículas (personas) atraviesa toda la charla. En cada momento del guion, las **mismas** partículas se reorganizan en una estructura nueva: el logo, un auditorio de grados, tres actores, una galaxia, un juego de relevos, un edificio. No cambia la diapositiva: cambia la forma en que las personas se relacionan.

### Gramática visual

| Elemento | Significado |
|---|---|
| Partícula | Una persona |
| Partícula crema, pesada y lenta | Experiencia |
| Partícula cian/magenta, ligera y rápida | Generación joven |
| Resorte hacia su lugar | Vínculo con una estructura (el mouse la perturba y el vínculo la devuelve) |
| Rigidez del resorte | Confianza o rigidez institucional |
| Línea crema / cian / roja | Relación entre experiencia / entre jóvenes / entre generaciones |
| Onda | Impacto que se propaga |
| Partícula suelta | Potencial que aún no pertenece a ninguna estructura |
| Foto hecha de partículas | Un lugar real del Fórum sostenido por personas |

### Recorrido del guion (sin cambiar su orden)

1. **Relevo generacional**: el logo UPB Fórum hecho de partículas, que se deforma con el mouse. Alrededor hay muchas partículas sueltas: la ventaja que nadie aprovecha.
2. **¿Solo para grados?**: la foto de una ceremonia de grados y un birrete, con resortes rígidos que casi no vibran. Un espacio con una sola forma.
3. **Encontrarse con el mundo**: la estructura se vuelve porosa; unas partículas salen y otras llegan desde fuera.
4. **Academia + Industria + Ciudad**: tres actores (símbolo UPB 90 años, engranaje y las banderas de Colombia y Medellín) con forma, color y ritmo propios.
5. **El impacto sí**: los tres actores se acercan y su encuentro emite ondas que mueven todo el campo.
6. **Comunidad**: una foto de un evento. Primero solo hay puntos (personas); luego aparecen las líneas y las personas cambian de color.
7. **Confianza**: una galaxia con núcleo amarillento. El talento (estrellas) gira y crece sin dispersarse porque la confianza (la gravedad) lo sostiene; las líneas que entran son talentos nuevos. Con **Dar forma**, el mismo talento se convierte en birrete, corazón que late o logo UPB 3D. La cámara se mueve arrastrando y con la rueda.
8. **Rutas**: la experiencia se queda sobre los caminos; los jóvenes los recorren y algunos se desvían para abrir rutas nuevas.
9. **Una visión, dos generaciones**: un juego de relevos (pong). Una barra de jóvenes y otra de experiencia se pasan una misma visión: un birrete UPB en 3D. Si nadie la recibe, se rompe en partículas y vuelve a armarse. Con pausa aparece la explicación.
10. **Trabajan juntas**: las generaciones se mezclan y aparecen los vínculos rojos entre ellas.
11. **Los jóvenes son el presente**: solo la generación joven forma la imagen; la experiencia queda detrás.
12. **El futuro se construye**: el edificio del Fórum se arma desde la base y los vínculos funcionan como andamio.
13. **Continuidad**: el logo UPB Fórum y el símbolo de los 90 años en 3D, hecho de capas de generaciones. Se gira arrastrando.

### Interacción y demostración en vivo

- **Mouse**: deforma la estructura; el vínculo la devuelve a su forma.
- **Clic**: mini explosión de partículas que se regenera enseguida.
- **X / Z**: quita la generación joven (la estructura cae) o la experiencia (los jóvenes se dispersan).
- **P**: pausa el juego de relevos · **1–4**: dar forma en la galaxia.
- **F**: pantalla completa · **? / L**: leyenda de la gramática visual.

### Cómo se construyó

HTML + JavaScript (Canvas 2D) con Vite. El código se hizo con apoyo de IA a partir de mis ideas: el logo interactivo, las banderas, el birrete, las fotos de partículas, el logo 3D, el pong, la galaxia con formas y la explosión al clic. Las fui probando y ajustando; el historial de commits de la carpeta `Unidad5/` muestra esa evolución.

Para ejecutarlo:

```
cd Unidad5
npm install
npm run dev
```

## Actividad 03: autoevaluación

| Criterio | Puntaje |
|---|---|
| 1. Cumplimiento del encargo | 25 / 25 |
| 2. Relaciones estructurales | 25 / 25 |
| 3. Comportamiento y significado | 25 / 25 |
| 4. Explicación y demostración | 25 / 25 |
| **Total** | **100 / 100 → 5.0** |

La justificación de cada criterio está en [Unidad5/AUTOEVALUACION.md](Unidad5/AUTOEVALUACION.md).
