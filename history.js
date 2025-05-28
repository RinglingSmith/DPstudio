// history.js - undo/redo for multiple layers

class HistoryManager {
  constructor(layerManager, maxUndo = 50) {
    this.layerManager = layerManager;
    this.maxUndo = maxUndo;
    this.undoStack = [];
    this.redoStack = [];
  }

  saveState() {
    const state = this.layerManager.layers.map(({canvas}) => {
      return canvas.toDataURL();
    });
    if (this.undoStack.length >= this.maxUndo) {
      this.undoStack.shift();
    }
    this.undoStack.push(state);
    this.redoStack = [];
    this.updateButtons();
  }

  undo() {
    if (!this.canUndo()) return;
    const currentState = this.layerManager.layers.map(({canvas}) => canvas.toDataURL());
    this.redoStack.push(currentState);

    const prevState = this.undoStack.pop();
    this.restoreState(prevState);
    this.updateButtons();
  }

  redo() {
    if (!this.canRedo()) return;
    const currentState = this.layerManager.layers.map(({canvas}) => canvas.toDataURL());
    this.undoStack.push(currentState);

    const nextState = this.redoStack.pop();
    this.restoreState(nextState);
    this.updateButtons();
  }

  restoreState(state) {
    state.forEach((dataURL, i) => {
      if (i >= this.layerManager.layers.length) return;
      const ctx = this.layerManager.layers[i].canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, this.layerManager.layers[i].canvas.width, this.layerManager.layers[i].canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataURL;
    });
  }

  canUndo() { return this.undoStack.length > 0; }
  canRedo() { return this.redoStack.length > 0; }

  updateButtons() {
    const undoBtn = document.getElementById('undo');
    const redoBtn = document.getElementById('redo');
    undoBtn.disabled = !this.canUndo();
    redoBtn.disabled = !this.canRedo();
  }
}

window.HistoryManager = HistoryManager;
