// layers.js - manage layers as multiple canvases stacked

class LayerManager {
  constructor(container) {
    this.container = container; // DOM container for canvases
    this.layers = [];
    this.activeLayerIndex = -1;
  }

  addLayer(name = 'Layer') {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth;
    canvas.height = this.container.clientHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = this.layers.length;
    this.container.appendChild(canvas);

    this.layers.push({ canvas, name });
    this.activeLayerIndex = this.layers.length - 1;
    return this.activeLayerIndex;
  }

  deleteLayer(index) {
    if (index < 0 || index >= this.layers.length) return false;
    const layer = this.layers[index];
    this.container.removeChild(layer.canvas);
    this.layers.splice(index, 1);
    if (this.activeLayerIndex >= this.layers.length) {
      this.activeLayerIndex = this.layers.length - 1;
    }
    this.updateZIndices();
    return true;
  }

  getActiveLayer() {
    if (this.activeLayerIndex < 0) return null;
    return this.layers[this.activeLayerIndex].canvas;
  }

  getActiveContext() {
    const layer = this.getActiveLayer();
    if (!layer) return null;
    return layer.getContext('2d');
  }

  setActiveLayer(index) {
    if (index >= 0 && index < this.layers.length) {
      this.activeLayerIndex = index;
      return true;
    }
    return false;
  }

  clearLayer(index) {
    if (index < 0 || index >= this.layers.length) return;
    const ctx = this.layers[index].canvas.getContext('2d');
    ctx.clearRect(0, 0, this.layers[index].canvas.width, this.layers[index].canvas.height);
  }

  resizeLayers(width, height) {
    this.layers.forEach(({ canvas }) => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCanvas.getContext('2d').drawImage(canvas, 0, 0);

      canvas.width = width;
      canvas.height = height;

      canvas.getContext('2d').drawImage(tempCanvas, 0, 0);
    });
  }

  updateZIndices() {
    this.layers.forEach(({canvas}, i) => {
      canvas.style.zIndex = i;
    });
  }
}

window.LayerManager = LayerManager;
