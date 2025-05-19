// Canvas size change logic
const widthInput = document.getElementById('canvas-width');
const heightInput = document.getElementById('canvas-height');
const applySizeButton = document.getElementById('apply-size');

applySizeButton.addEventListener('click', () => {
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);

    // Save current canvas content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    // Resize canvas
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Refill background color
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Restore previous content (scaled if new size is different)
    ctx.drawImage(tempCanvas, 0, 0);
});
