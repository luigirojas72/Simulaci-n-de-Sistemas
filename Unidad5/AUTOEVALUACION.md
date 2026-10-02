# Autoevaluación · Unidad 5: Sistemas de partículas

**Proyecto:** presentación generativa para la charla *"Relevo generacional: la ventaja que nadie está aprovechando"*, Centro de Eventos Fórum UPB.
**Estudiante:** Luis Rojas Machado

| Criterio | Puntaje |
|---|---|
| 1. Cumplimiento del encargo | 25 / 25 |
| 2. Relaciones estructurales | 25 / 25 |
| 3. Comportamiento y significado | 25 / 25 |
| 4. Explicación y demostración | 25 / 25 |
| **Total** | **100 / 100 → 5.0** |

---

## 1. Cumplimiento del encargo: 25 / 25

*Mi presentación interpreta el guion mediante una estructura dinámica y funciona en pantalla completa.*

- Usa los **13 momentos del guion del cliente en su orden original**, sin modificar la secuencia narrativa. Cada frase activa un estado distinto del sistema.
- Es una **presentación web en pantalla completa** (tecla F o botón), diseñada sobre un escenario de 1920×1080 que se escala a cualquier pantalla. El texto es grande y de alto contraste para leerse desde el fondo de un auditorio. Se avanza con flechas, barra espaciadora o un control remoto de presentaciones (PageUp/PageDown).
- Todo el sistema visual es **un sistema de partículas**: unas 7000 partículas que forman logos, fotos del cliente, figuras y redes.
- Usa los **insumos del cliente**: el logo UPB Fórum, el símbolo de los 90 años y fotos reales del Fórum (grados, la entrada, eventos, jóvenes trabajando, el edificio).
- No ilustra cada frase de forma literal. Cuando aparece una figura (birrete, banderas, edificio), es porque el guion la nombra, y la estructura **se transforma** en vez de quedarse como un dibujo.

## 2. Relaciones estructurales: 25 / 25

*Puedo explicar qué relaciones existen en mi sistema, qué significan y cómo organizan sus elementos.*

El concepto es **"el espacio lo sostienen las relaciones"**. Una sola población de partículas (personas) atraviesa toda la charla y se reorganiza en cada momento. Las relaciones son:

| Relación | Cómo funciona en el código | Qué significa |
|---|---|---|
| Resorte hacia un lugar | Cada partícula es atraída hacia su punto de la estructura (`k`) | El vínculo de una persona con una estructura |
| Rigidez del resorte | Valor de `k` y amortiguación por momento | Confianza, o rigidez institucional |
| Líneas entre partículas | Se dibujan entre partículas cercanas | Relación: crema entre experiencia, cian entre jóvenes, **roja entre generaciones** |
| Dos generaciones | Cada partícula pertenece a una generación con color, tamaño y ritmo propios | Experiencia (crema, lenta, estructural) y jóvenes (cian/magenta, rápidos, exploratorios) |
| Ondas | Impulso radial que se propaga por el campo | Impacto |
| Partícula suelta | Sin lugar, sigue un campo de flujo | Potencial que aún no pertenece a ninguna estructura |

Estas relaciones organizan los elementos: un logo o una foto existe solo porque las partículas están vinculadas a sus lugares. Si la relación se rompe, la imagen desaparece. Con el mouse se puede perturbar la estructura y el vínculo la devuelve a su forma.

## 3. Comportamiento y significado: 25 / 25

*Puedo relacionar los cambios de movimiento, estructura, densidad o composición con una intención comunicativa.*

Ningún movimiento es solo decoración. Cada cambio importante responde a la frase del momento:

1. **Relevo generacional**: el logo hecho de partículas, rodeado de partículas sueltas. La ventaja existe, pero nadie la aprovecha.
2. **¿Solo para grados?**: la foto de una ceremonia de grados y un birrete con resortes rígidos que casi no vibran. Un espacio con una sola forma.
3. **Encontrarse con el mundo**: la estructura se vuelve porosa; unas partículas salen y otras llegan.
4. **Academia + Industria + Ciudad**: tres actores con forma, color y ritmo propios, todavía separados.
5. **El impacto sí**: los tres actores se acercan y su encuentro emite ondas que mueven todo el campo.
6. **Comunidad**: primero solo hay puntos (personas); luego aparecen las líneas y las personas cambian de color (transformación).
7. **Confianza**: una galaxia. El talento (estrellas) gira y crece sin dispersarse porque la confianza (la gravedad) lo sostiene. Las líneas que entran son talentos nuevos. Con "Dar forma", el mismo talento se convierte en birrete (formación), corazón (pasión) o logo UPB (institución).
8. **Rutas**: la experiencia se queda sobre los caminos y deja estela; los jóvenes los recorren y algunos se desvían para abrir rutas nuevas.
9. **Una visión, dos generaciones**: un juego de relevos. Dos barras, una de jóvenes y otra de experiencia, se pasan una misma visión: un birrete 3D. Si nadie la recibe, se rompe y vuelve a armarse. La pausa explica el significado.
10. **Trabajan juntas**: las dos generaciones se mezclan en una estructura común y aparecen los vínculos rojos entre ellas.
11. **Los jóvenes son el presente**: solo la generación joven forma la imagen; la experiencia queda detrás.
12. **El futuro se construye**: el edificio del Fórum se arma desde la base hacia arriba y los vínculos funcionan como andamio.
13. **Continuidad**: el logo UPB Fórum y el símbolo de los 90 años en 3D, hecho de capas de generaciones. De frente es una sola marca; al girarlo se ve su profundidad.

Los cambios de densidad (partículas sueltas → estructura → red), de rigidez (grados rígidos → confianza estable) y de composición (separados → cerca → mezclados) siguen el arco del discurso: **potencial sin vínculo → encuentro → comunidad → relevo → construcción**.

## 4. Explicación y demostración: 25 / 25

*Puedo presentar la propuesta funcionando, explicar mis decisiones y demostrar cómo el sistema construye sentido.*

La presentación incluye herramientas para **demostrar en vivo** que el significado está en las relaciones:

- **Tecla X**: quita la generación joven. La estructura pierde sostén y cae.
- **Tecla Z**: quita la experiencia. La energía joven se dispersa sin estructura.
- **Mouse y clic**: perturbar la estructura y ver cómo el vínculo la recupera.
- **Pausa del pong (P)**: muestra en pantalla qué representa cada elemento del juego.
- **Leyenda (`?` o L)**: muestra la gramática visual completa durante la exposición.

Entiendo el sistema y puedo intervenirlo. Está separado en módulos que puedo explicar:

- `field.js`: el motor (resortes, ondas, vínculos, explosiones).
- `slides.js`: el guion y la estructura de cada momento.
- `shapes.js`: convierte fotos y logos en partículas.
- `galaxy.js` y `pong.js`: los momentos interactivos.

El código se construyó con apoyo de IA. Las decisiones de diseño (las ideas del logo interactivo, las banderas, el birrete, las fotos de partículas, el logo 3D, el pong, la galaxia y la explosión al clic) se discutieron, se probaron y se ajustaron durante el proceso. Esa evolución queda registrada en el historial de commits del repositorio.
