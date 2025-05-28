// tools.js - brush, eraser, fill, shapes

class ToolManager {
  constructor(layerManager, historyManager) {
    this.layerManager = layerManager;
    this.historyManager = historyManager;
    this.currentTool = 'brush';
    this.brushColor = '#000000';
    this.brushSize = 5;
    this.drawing = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setColor(color) {
    this.brushColor = color;
  }

  setSize(size) {
    this.brushSize = size;
  }

  startDrawing(x, y) {
    this.drawing = true;
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;

    if (this.currentTool === 'fill') {
      this.historyManager.saveState();
      this.floodFill(x, y, this.brushColor);
      this.drawing = false;
    } else if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
      const ctx = this.layerManager.getActiveContext();
      if (!ctx) return;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.currentTool === 'brush' ? this.brushColor : '#FFFFFF';
      ctx.lineWidth = this.brushSize;
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }

  draw(x, y) {
    if (!this.drawing) return;
    const ctx = this.layerManager.getActiveContext();
    if (!ctx) return;

    if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (this.currentTool === 'rect' || this.currentTool === 'circle') {
      // redraw previous state for preview
      if (this.historyManager.undoStack.length > 0) {
        this.historyManager.restoreState(this.historyManager.undoStack[this.historyManager.undoStack.length - 1]);
      } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
      ctx.lineWidth = this.brushSize;
      ctx.strokeStyle = this.brushColor;
      ctx.fillStyle = this.brushColor;
      ctx.setLineDash([6]);
      const width = x - this.startX;
      const height = y - this.startY;
      if (this.currentTool === 'rect') {
        ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.currentTool === 'circle') {
        ctx.beginPath();
        const radius = Math.sqrt(width * width + height * height);
        ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing(x, y) {
    if (!this.drawing) return;
    this.drawing = false;
    const ctx = this.layerManager.getActiveContext();
    if (!ctx) return;

    if (this.currentTool === 'rect') {
      this.historyManager.saveState();
      this.drawRect(this.startX, this.startY, x, y);
    } else if (this.currentTool === 'circle') {
      this.historyManager.saveState();
      this.drawCircle(this.startX, this.startY, x, y);
    } else if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
      this.historyManager.saveState();
      ctx.beginPath();
    }
  }

  drawRect(x1, y1, x2, y2) {
    const ctx = this.layerManager.getActiveContext();
    if (!ctx) return;
    const width = x2 - x1;
    const height = y2 - y1;
    ctx.lineWidth = this.brushSize;
    ctx.strokeStyle = this.brushColor;
    ctx.strokeRect(x1, y1, width, height);
  }

  drawCircle(x1, y1, x2, y2) {
    const ctx = this.layerManager.getActiveContext();
    if (!ctx) return;
    const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    ctx.lineWidth = this.brushSize;
    ctx.strokeStyle = this.brushColor;
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Flood fill algorithm on active layer
  floodFill(startX, startY, fillColor) {
    const ctx = this.layerManager.getActiveContext();
    if (!ctx) return;
    const canvas = ctx.canvas;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;

    const targetPos = (startY * width + startX) * 4;
    const targetColor = data.slice(targetPos, targetPos + 4);
    const fillColorArr = this.hexToRgba(fillColor);

    if (this.colorsMatch(targetColor, fillColorArr)) return;

    const stack = [[startX, startY]];

    while (stack.length) {
      const [x, y] = stack.pop();
      const pos = (y * width + x) * 4;
      const currentColor = data.slice(pos, pos + 4);
      if (this.colorsMatch(currentColor, targetColor)) {
        data[pos] = fillColorArr[0];
        data[pos + 1] = fillColorArr[1];
        data[pos + 2] = fillColorArr[2];
        data[pos + 3] = fillColorArr[3];

        if (x > 0) stack.push([x - 1, y]);
        if (x < width - 1) stack.push([x + 1, y]);
        if (y > 0) stack.push([x, y - 1]);
        if (y < height - 1) stack.push([x, y + 1]);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  hexToRgba(hex) {
    let c = hex.substring(1);
    if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
    const bigint = parseInt(c, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
  }

  colorsMatch(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
}

window.ToolManager = ToolManager;
