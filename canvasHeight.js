document.addEventListener('DOMContentLoaded', () => {
  const canvasWidthInput = document.getElementById('canvasWidth');
  const canvasHeightInput = document.getElementById('canvasHeight');
  const resizeCanvasBtn = document.getElementById('resizeCanvasBtn');
  const canvasWrapper = document.getElementById('canvasWrapper');

  resizeCanvasBtn.addEventListener('click', () => {
    const newWidth = parseInt(canvasWidthInput.value);
    const newHeight = parseInt(canvasHeightInput.value);

    if (newWidth < 100 || newHeight < 100) {
      alert("Minimum size is 100x100.");
      return;
    }

    const canvases = canvasWrapper.querySelectorAll('canvas');
    canvases.forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.clearRect(0, 0, newWidth, newHeight);
      ctx.putImageData(imageData, 0, 0);
    });

    canvasWrapper.style.width = newWidth + 'px';
    canvasWrapper.style.height = newHeight + 'px';
  });
});
