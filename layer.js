let layers = [];
let currentLayer = null;
let layerIdCounter = 0;

const layerList = document.getElementById("layerList");
const canvasWrapper = document.getElementById("canvasWrapper");

function createCanvas(id, width = 800, height = 600) {
  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = width;
  canvas.height = height;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = layerIdCounter;
  canvasWrapper.appendChild(canvas);
  return canvas;
}

function addLayer() {
  const id = `layer-${layerIdCounter++}`;
  const canvas = createCanvas(id);
  layers.push(canvas);

  const li = document.createElement("li");
  li.textContent = id;
  li.onclick = () => setActiveLayer(id);
  layerList.appendChild(li);

  setActiveLayer(id);
}

function removeLayer() {
  if (layers.length <= 1) {
    alert("At least one layer must remain.");
    return;
  }

  const canvas = layers.pop();
  canvas.remove();
  layerList.lastChild.remove();

  const last = layers[layers.length - 1];
  setActiveLayer(last.id);
}

function setActiveLayer(id) {
  layers.forEach(layer => (layer.style.pointerEvents = "none"));
  const canvas = document.getElementById(id);
  if (!canvas) return;
  canvas.style.pointerEvents = "auto";
  currentLayer = canvas;

  Array.from(layerList.children).forEach(li => {
    li.classList.toggle("active", li.textContent === id);
  });
}

window.onload = () => addLayer();

