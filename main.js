
window.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById('scene');

// Escena
const scene = new THREE.Scene();

// Cámara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 170);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);



const textureLoader = new THREE.TextureLoader();
const astronautTexture = textureLoader.load("assets/astronauta.png");

const astronautMaterial = new THREE.SpriteMaterial({
  map: astronautTexture,
  transparent: true,
  opacity: 1
});



const astronaut = new THREE.Sprite(astronautMaterial);

// tamaño del astronauta
astronaut.scale.set(40, 40, 1);

// posición encima del planeta
astronaut.position.set(0, 40, 0);

scene.add(astronaut);


// --- FONDO ESTRELLADO ---
function createStarField() {
  const starCount = 3000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;

    // esfera gigante alrededor de la escena
    const radius = 800 + Math.random() * 400;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 1.2,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  return stars;
}

const starField = createStarField();
// --- NEBULOSA ---
function createNebula() {
  const count = 1500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positions[i3]     = (Math.random() - 0.5) * 600;
    positions[i3 + 1] = (Math.random() - 0.5) * 400;
    positions[i3 + 2] = (Math.random() - 0.5) * 600;

    // colores nebulosos
    colors[i3]     = 0.4 + Math.random() * 0.3; // morado
    colors[i3 + 1] = 0.1 + Math.random() * 0.2; // azul
    colors[i3 + 2] = 0.6 + Math.random() * 0.3; // violeta
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 6,
    transparent: true,
    opacity: 0.15,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const nebula = new THREE.Points(geometry, material);
  scene.add(nebula);

  return nebula;
}

const nebula = createNebula();



// Crear esfera de puntos
const radius = 30;
const sphere = new THREE.SphereGeometry(radius, 100, 100);

const pointsGeometry = new THREE.BufferGeometry();
pointsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(sphere.attributes.position.array, 3)
);

// Colores aleatorios
const count = sphere.attributes.position.count;
const colors = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  const i3 = i * 3;

  // t va de 0 a 1
  const t = i / count;

  // Color morado (128, 0, 255)
  const r1 = 128 / 255, g1 = 0, b1 = 255 / 255;
  // Color amarillo (255, 255, 0)
  const r2 = 255 / 255, g2 = 255 / 255, b2 = 0;

  // Interpolación lineal
  colors[i3]     = r1 + (r2 - r1) * t;
  colors[i3 + 1] = g1 + (g2 - g1) * t;
  colors[i3 + 2] = b1 + (b2 - b1) * t;
}

pointsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

// --- MATERIAL LUMINOSO CON TEXTURA GENERADA ---
function createDiscTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

const planetMaterial = new THREE.PointsMaterial({
  size: 0.8,
  map: createDiscTexture(),
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  depthWrite: false
});
const planet = new THREE.Points(pointsGeometry, planetMaterial);

// --- ANILLO DE PARTÍCULAS ---
const ringParticles = 4000;
const ringPositions = new Float32Array(ringParticles * 3);
const ringColors = new Float32Array(ringParticles * 3);

for (let i = 0; i < ringParticles; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 40 + Math.random() * 50; // más cerca del planeta
  const y = (Math.random() - 0.5) * 1.0;

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  ringPositions[i * 3] = x;
  ringPositions[i * 3 + 1] = y;
  ringPositions[i * 3 + 2] = z;

  // --- Degradado morado (#8000ff) a amarillo (#ffff00) ---
  const t = i / ringParticles;
  const r1 = 128 / 255, g1 = 0, b1 = 255 / 255; // morado
  const r2 = 255 / 255, g2 = 255 / 255, b2 = 0; // amarillo

  ringColors[i * 3]     = r1 + (r2 - r1) * t;
  ringColors[i * 3 + 1] = g1 + (g2 - g1) * t;
  ringColors[i * 3 + 2] = b1 + (b2 - b1) * t;
}

const ringGeometry = new THREE.BufferGeometry();
ringGeometry.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
ringGeometry.setAttribute("color", new THREE.BufferAttribute(ringColors, 3));

const ringMaterial = new THREE.PointsMaterial({
  size: 1.0, // más grande
  map: createDiscTexture(),
  transparent: true,
  opacity: 1.0, // más fuerte
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  depthWrite: false
});

const ring = new THREE.Points(ringGeometry, ringMaterial);


// --- GRUPO PLANETA + ANILLO ---
const planetSystem = new THREE.Group();
planetSystem.add(planet);
planetSystem.add(ring);
scene.add(planetSystem);

// --- CONTROLES MOUSE ---
let isDragging = false;
let prevX = 0;
let prevY = 0;
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  prevX = e.clientX;
  prevY = e.clientY;
});
canvas.addEventListener("mouseup", () => { isDragging = false; });
canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    planetSystem.rotation.y += dx * 0.005;
    planetSystem.rotation.x += dy * 0.005;
    prevX = e.clientX;
    prevY = e.clientY;
  }
});
// Zoom con la rueda
canvas.addEventListener("wheel", (e) => {
  camera.position.z += e.deltaY * 0.05;
});

// --- CONTROLES TÁCTILES ---
let touchStartX = 0, touchStartY = 0, touchDistance = 0;
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    touchDistance = Math.sqrt(dx * dx + dy * dy);
  }
});
canvas.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    planetSystem.rotation.y += dx * 0.002;
    planetSystem.rotation.x += dy * 0.002;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const newDistance = Math.sqrt(dx * dx + dy * dy);
    const delta = newDistance - touchDistance;
    camera.position.z -= delta * 0.05;
    touchDistance = newDistance;
  }
});

// --- RESPONSIVO ---
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Guardar posiciones originales
const originalPositions = pointsGeometry.attributes.position.array.slice();
const originalRingPositions = ringGeometry.attributes.position.array.slice();

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.03;

  // --- Movimiento suave en la esfera ---
  const pos = pointsGeometry.attributes.position.array;
  for (let i = 0; i < pos.length; i += 3) {
    pos[i]     = originalPositions[i]     + Math.sin(time + i) * 1.5; // X
    pos[i + 1] = originalPositions[i + 1] + Math.cos(time + i) * 1.5; // Y
    pos[i + 2] = originalPositions[i + 2] + Math.sin(time + i) * 1.5; // Z
  }
  pointsGeometry.attributes.position.needsUpdate = true;

  // --- Movimiento suave en el anillo ---
  const rpos = ringGeometry.attributes.position.array;
  for (let i = 0; i < rpos.length; i += 3) {
    rpos[i]     = originalRingPositions[i]     + Math.sin(time + i) * 1.2;
    rpos[i + 1] = originalRingPositions[i + 1] + Math.cos(time + i) * 1.2;
    rpos[i + 2] = originalRingPositions[i + 2] + Math.sin(time + i) * 1.2;
  }
  ringGeometry.attributes.position.needsUpdate = true;

  // Rotación general del sistema
  planetSystem.rotation.y += 0.002;

  renderer.render(scene, camera);


}
// movimiento muy lento del fondo
starField.rotation.y += 0.00005;
nebula.rotation.y += 0.0001;
nebula.rotation.x += 0.00005;

// El astronauta siempre mira a la cámara
astronaut.lookAt(camera.position);

animate();

const song = document.getElementById("song");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false;

musicBtn.addEventListener("click", () => {
  if (!isPlaying) {
    song.play().then(() => {
      musicBtn.innerHTML = "⏸️ Pausar";
      isPlaying = true;
    }).catch(err => {
      console.log("El navegador bloqueó el audio:", err);
    });
  } else {
    song.pause();
    musicBtn.innerHTML = "▶️ Reproducir";
    isPlaying = false;
  }
});
});