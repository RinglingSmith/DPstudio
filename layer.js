let layers = [];
let currentLayer = null;
let layerIdCounter = 0;

const layerList = document.getElementById("layerList");
const canvasWrapper = document.getElementById("canvasWrapper");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");

function createCanvas(id, width = 800, height = 600) {
  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = width;
  canvas.height = height;
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

  setActiveLayer(layers[layers.length - 1].id);
}

function setActiveLayer(id) {
  layers.forEach(layer => (layer.style.pointerEvents = "none"));
  const canvas = document.getElementById(id);
  if (!canvas) return;
  canvas.style.pointerEvents = "auto";
  currentLayer = canvas;

  // Highlight in the list
  Array.from(layerList.children).forEach(li => {
    li.classList.toggle("active", li.textContent === id);
  });
}

// Drawing
let isDrawing = false;
let lastX = 0, lastY = 0;

canvasWrapper.addEventListener("mousedown", e => {
  if (!currentLayer) return;
  const rect = currentLayer.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  isDrawing = true;
});

canvasWrapper.addEventListener("mousemove", e => {
  if (!isDrawing || !currentLayer) return;
  const ctx = currentLayer.getContext("2d");
  const rect = currentLayer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
});

["mouseup", "mouseleave"].forEach(event =>
  canvasWrapper.addEventListener(event, () => {
    isDrawing = false;
  })
);

// Initialize with one layer
window.onload = () => addLayer();


