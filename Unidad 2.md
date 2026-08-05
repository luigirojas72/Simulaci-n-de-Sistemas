El sistema debe incluir:

Posición, velocidad y aceleración.
Varias poblaciones de partículas.
Interacciones dependientes de la distancia.
Relaciones de atracción, repulsión o indiferencia.
Al menos una relación asimétrica.
Variabilidad entre ejecuciones.
Comportamientos emergentes, no trayectorias predefinidas.
Una identidad reconocible entre sus diferentes resultados.

Reto sustentación personal:

Quiero explorar la tensión entre el orden y el caos mediante un sistema de partículas y planetas que interactúan gravitacionalmente. Espero que el sistema muestre cómo pequeños cambios en las relaciones entre sus elementos producen configuraciones diferentes, aunque siempre con una identidad reconocible.

VERSIÓN 1 DEL RETO
Objetivo

Crear un sistema básico donde varias partículas fueran atraídas por planetas con distinta masa.

Qué tenía

6 planetas.
350 partículas.
Atracción gravitacional.
Crecimiento de los planetas al absorber partículas.

Problemas encontrados

Los planetas se movían demasiado poco.
Algunas trayectorias eran repetitivas.
La simulación se veía estática después de unos segundos.

VERSIÓN 2 DEL Reto
Cambios realizados

Se añadió gravedad entre los planetas.
Se ajustó la fuerza gravitacional.
Se modificó la fricción.
Se añadieron bordes tipo Pac-Man.

Resultado

Los planetas comenzaron a influenciarse mutuamente y el sistema adquirió un comportamiento mucho más dinámico.

Problemas

Con el tiempo algunos planetas terminaban muy cerca entre sí y el movimiento perdía variedad.

VERSIÓN 3 DEL Reto
Versión Final

Cambios

Se redujo la gravedad entre planetas para evitar agrupamientos permanentes.
Se añadió una ligera influencia de las partículas sobre los planetas para mantener el movimiento.
Se implementó un campo gravitacional controlado con el mouse.
Se ajustaron los parámetros hasta obtener un equilibrio entre estabilidad y variabilidad.

Resultado

Cada ejecución produce una distribución distinta, pero mantiene la misma identidad visual y de comportamiento.

USO IA

Se utilizó ChatGPT como apoyo para explorar distintas estrategias de programación, comprender el funcionamiento de Particle Life, depurar errores de JavaScript y proponer alternativas para las fuerzas gravitacionales. Todas las decisiones finales sobre parámetros, comportamiento e intención fueron comprendidas, modificadas y seleccionadas durante el desarrollo del sistema.

código completo final:
"// -------------------------
// PARTICLE LIFE - PLANETAS
// Versión 1
// -------------------------

let particles = [];
let planets = [];

const NUM_PARTICLES = 350;
const NUM_PLANETS = 6;

function setup() {

  createCanvas(540,960);

  noStroke();

  for(let i=0;i<NUM_PLANETS;i++){

    planets.push(new Planet());

  }

  for(let i=0;i<NUM_PARTICLES;i++){

    particles.push(new Particle());

  }

}

function draw(){

  background(5,8,18,35);

  // Actualizar planetas
  for(let p of planets){

    p.update();
    p.display();

  }

  // Actualizar partículas
  for(let p of particles){

    p.update();
    p.display();

  }
  // Dibujar el campo gravitacional del mouse
noFill();
stroke(255,80);
strokeWeight(1.5);
circle(mouseX,mouseY,180);

noStroke();
fill(255,40);
circle(mouseX,mouseY,20);

}
// -------------------------
// PLANETA
// -------------------------

class Planet{

  constructor(){

    this.x=random(width);
    this.y=random(height);

    this.vx=random(-0.4,0.4);
    this.vy=random(-0.4,0.4);

    this.mass=random(25,65);

    this.color=color(
      random(120,255),
      random(120,255),
      random(120,255)
    );

  }

update(){

  // Los planetas sienten gravedad de los demás
  for(let other of planets){
    

    if(other===this) continue;

    let dx=other.x-this.x;
    let dy=other.y-this.y;

    let d=sqrt(dx*dx+dy*dy);

    if(d>30 && d<260){

      let force=(other.mass*0.0018)/d;

      this.vx+=dx/d*force;
      this.vy+=dy/d*force;

    }
    
    
    // Influencia de las partículas sobre el planeta
for(let particle of particles){

  if(particle.captured) continue;

  let dx = particle.x - this.x;
  let dy = particle.y - this.y;

  let d = sqrt(dx*dx + dy*dy);

  if(d < 170){

    let force = 0.00035;

    this.vx += dx/d * force;
    this.vy += dy/d * force;

  }

}

  }

  // Limitar velocidad
  this.vx=constrain(this.vx,-1.3,1.3);
  this.vy=constrain(this.vy,-1.3,1.3);

  this.x+=this.vx;
  this.y+=this.vy;

  // Fricción
  this.vx*=0.998;
  this.vy*=0.998;

  // Bordes tipo pacman
  if(this.x<0) this.x=width;
  if(this.x>width) this.x=0;

  if(this.y<0) this.y=height;
  if(this.y>height) this.y=0;

}

  display(){

    fill(this.color);

    circle(
      this.x,
      this.y,
      this.mass
    );

  }

}
// -------------------------
// PARTÍCULA
// -------------------------

class Particle{

  constructor(){

    this.x=random(width);
    this.y=random(height);

    this.vx=random(-0.5,0.5);
    this.vy=random(-0.5,0.5);

    this.r=3;

    this.captured=false;

    this.owner=null;

    

  }

  update(){

    if(!this.captured){

      for(let planet of planets){

        let dx=planet.x-this.x;
        let dy=planet.y-this.y;

        let d=sqrt(dx*dx+dy*dy);
// Evitar que los planetas se queden pegados
for(let other of planets){

  if(other===this) continue;

  let dx=this.x-other.x;
  let dy=this.y-other.y;

  let d=sqrt(dx*dx+dy*dy);

  let minDist=(this.mass+other.mass)*0.45;

  if(d<minDist){

    let push=(minDist-d)*0.03;

    this.vx+=dx/d*push;
    this.vy+=dy/d*push;

  }

}
if(d < 160){

  let force = (planet.mass * 0.05) / (d + 15);

  this.vx += dx/d * force;
  this.vy += dy/d * force;

}
        // Campo gravitacional del mouse
let mdx = mouseX - this.x;
let mdy = mouseY - this.y;

let md = sqrt(mdx*mdx + mdy*mdy);

if(md < 180){

  let mouseForce = 0.08;

  this.vx += mdx/md * mouseForce;
  this.vy += mdy/md * mouseForce;

}

        if(d<planet.mass*0.45){

          this.captured=true;
          this.owner=planet;

          planet.mass+=0.12;

          break;

        }

      }

      this.vx*=0.985;
      this.vy*=0.985;

      this.x+=this.vx;
      this.y+=this.vy;

      // rebote

      if(this.x<0){

        this.x=0;
        this.vx*=-1;

      }

      if(this.x>width){

        this.x=width;
        this.vx*=-1;

      }

      if(this.y<0){

        this.y=0;
        this.vy*=-1;

      }

      if(this.y>height){

        this.y=height;
        this.vy*=-1;

      }

    }

    else{

      // reaparece cuando fue absorbida

      this.x=random(width);
      this.y=random(height);

      this.vx=random(-0.6,0.6);
      this.vy=random(-0.6,0.6);

      this.captured=false;
      this.owner=null;

    }

  }

  display(){

    fill(240);

    circle(
      this.x,
      this.y,
      this.r
    );

  }

}"

Autoevaluación:

<img width="649" height="398" alt="Captura de pantalla 2026-08-05 160829" src="https://github.com/user-attachments/assets/0dffe994-930f-409a-8c50-9fd271b02fa6" />


P5JS: https://editor.p5js.org/luigieprojas/sketches/Yk_eSiNOR 
p5js nuevo: https://editor.p5js.org/luigieprojas/sketches/AKq9ezjrK

versión temprana del reto: https://youtu.be/5UpHcq483Wg 
versión final del reto: https://youtu.be/vWqJN2ww3wY
