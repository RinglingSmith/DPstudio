// canvasControl.js - zoom and pan, pointer helpers

class CanvasController {
  constructor(layerManager) {
    this.layerManager = layerManager;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.isPanning = false;
    this.startPanX = 0;
    this.startPanY = 0;

    // Attach listeners for zoom and pan on container
    this.container = document.getElementById('canvasContainer');
    this.container.style.overflow = 'hidden';

    this.container.addEventListener('wheel', e => this.handleWheel(e), { passive: false });
    this.container.addEventListener('mousedown', e => this.startPan(e));
    this.container.addEventListener('mouseup', e => this.endPan(e));
    this.container.addEventListener('mouseleave', e => this.endPan(e));
    this.container.addEventListener('mousemove', e => this.pan(e));

    // Touch support for pinch zoom and pan
    this.container.addEventListener('touchstart', e => this.touchStart(e), { passive: false });
    this.container.addEventListener('touchmove', e => this.touchMove(e), { passive: false });
    this.container.addEventListener('touchend', e => this.touchEnd(e));

    this.lastTouchDist = 0;
    this.isTouchPanning = false;

    this.updateTransforms();
  }

  updateTransforms() {
    this.layerManager.layers.forEach(({canvas}) => {
      canvas.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
      canvas.style.transformOrigin = '0 0';
    });
  }

  handleWheel(e) {
    e.preventDefault();
    const zoomFactor = 1.1;
    const mouseX = e.clientX - this.container.getBoundingClientRect().left;
    const mouseY = e.clientY - this.container.getBoundingClientRect().top;

    let newScale = this.scale;
    if (e.deltaY < 0) {
      newScale *= zoomFactor;
    } else {
      newScale /= zoomFactor;
    }
    newScale = Math.min(Math.max(newScale, 0.1), 10);

    // Adjust offset so zoom centers on mouse
    this.offsetX -= (mouseX / this.scale - mouseX / newScale);
    this.offsetY -= (mouseY / this.scale - mouseY / newScale);

    this.scale = newScale;
    this.updateTransforms();
  }

  startPan(e) {
    if (e.button !== 0) return;
    this.isPanning = true;
    this.startPanX = e.clientX - this.offsetX;
    this.startPanY = e.clientY - this.offsetY;
  }

  pan(e) {
    if (!this.isPanning) return;
    this.offsetX = e.clientX - this.startPanX;
    this.offsetY = e.clientY - this.startPanY;
    this.updateTransforms();
  }

  endPan(e) {
    this.isPanning = false;
  }

  // Touch handlers for pan and pinch zoom
  touchStart(e) {
    if (e.touches.length === 1) {
      this.isTouchPanning = true;
      this.startPanX = e.touches[0].clientX - this.offsetX;
      this.startPanY = e.touches[0].clientY - this.offsetY;
    } else if (e.touches.length === 2) {
      this.isTouchPanning = false;
      this.lastTouchDist = this.getTouchDist(e.touches);
    }
  }

  touchMove(e) {
    e.preventDefault();
    if (this.isTouchPanning && e.touches.length === 1) {
      this.offsetX = e.touches[0].clientX - this.startPanX;
      this.offsetY = e.touches[0].clientY - this.startPanY;
      this.updateTransforms();
    } else if (e.touches.length === 2) {
      const dist = this.getTouchDist(e.touches);
      if (this.lastTouchDist === 0) this.lastTouchDist = dist;

      let scaleChange = dist / this.lastTouchDist;
      let newScale = this.scale * scaleChange;
      newScale = Math.min(Math.max(newScale, 0.1), 10);

      // Calculate midpoint between two touches for zoom center
      const rect = this.container.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

      this.offsetX -= (midX / this.scale - midX / newScale);
      this.offsetY -= (midY / this.scale - midY / newScale);

      this.scale = newScale;
      this.updateTransforms();

      this.lastTouchDist = dist;
    }
  }

  touchEnd(e) {
    if (e.touches.length < 2) {
      this.lastTouchDist = 0;
    }
    if (e.touches.length === 0) {
      this.isTouchPanning = false;
    }
  }

  getTouchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Converts client coordinates to canvas coordinates (taking zoom/pan into account)
  clientToCanvasCoords(clientX, clientY) {
    const rect = this.container.getBoundingClientRect();
    const x = (clientX - rect.left - this.offsetX) / this.scale;
    const y = (clientY - rect.top - this.offsetY) / this.scale;
    return { x, y };
  }
}

window.CanvasController = CanvasController;
