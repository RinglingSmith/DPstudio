// Elements from the DOM
const resizeBtn = document.getElementById('resize-canvas');
const resizeDialog = document.getElementById('resize-dialog');
const widthInput = document.getElementById('width-range');
const heightInput = document.getElementById('height-range');
const applyBtn = document.getElementById('apply-size');
const cancelBtn = document.getElementById('cancel-size');

// Show the resize dialog
resizeBtn.addEventListener('click', () => {
  // Set current canvas size in the inputs
  widthInput.value = canvas.width;
  heightInput.value = canvas.height;
  resizeDialog.style.display = 'block';
});

// Apply the new canvas size
applyBtn.addEventListener('click', () => {
  const newWidth = parseInt(widthInput.value);
  const newHeight = parseInt(heightInput.value);

  // Create a temporary image of current canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Resize canvas
  canvas.width = newWidth;
  canvas.height = newHeight;

  // Refill background
  ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, newWidth, newHeight);

  // Restore old image data (if smaller canvas, it will crop)
  ctx.putImageData(imageData, 0, 0);

  resizeDialog.style.display = 'none';
});

// Cancel button hides the dialog
cancelBtn.addEventListener('click', () => {
  resizeDialog.style.display = 'none';
});
