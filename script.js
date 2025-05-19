document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('drawboard');
  const toolbar = document.getElementById('toolbar');
  const ctx = canvas.getContext('2d');

  let brushColor = '#000';
  let lineWidth = 5;
  let isPainting = false;
  let lastX, lastY;

  // Get the drawboard section instead of missing #canvas-container
  const container = document.querySelector('.drawboard');

  // Initial canvas setup
  resizeCanvas();

  // Window resize (preserve content)
  window.addEventListener('resize', () => resizeCanvas(true));

  function resizeCanvas(preserveContent = false) {
    const containerRect = container.getBoundingClientRect();

    let tempCanvas, tempCtx;

    if (preserveContent) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = containerRect.width;
    canvas.height = window.innerHeight - toolbar.offsetHeight;

    // Draw background color to canvas pixels
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (preserveContent && tempCtx) {
      ctx.drawImage(tempCanvas, 0, 0);
    }
  }

  function draw(e) {
    if (!isPainting) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();

    lastX = mouseX;
    lastY = mouseY;
  }

  canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx.beginPath();
  });

  canvas.addEventListener('mousemove', draw);

  // Change stroke color
  document.getElementById('stroke').addEventListener('input', (e) => {
    brushColor = e.target.value;
  });

  // Change brush size
  document.getElementById('size-slider').addEventListener('input', (e) => {
    lineWidth = parseInt(e.target.value, 10);
    document.getElementById('size-value').textContent = lineWidth;
  });

  // Change background color
  document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    const newColor = e.target.value;
    canvas.style.backgroundColor = newColor;

    // Save existing drawing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    // Fill new background
    ctx.fillStyle = newColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  });

  // Apply manual canvas size
  document.getElementById('apply-size').addEventListener('click', () => {
    const width = parseInt(document.getElementById('canvas-width').value);
    const height = parseInt(document.getElementById('canvas-height').value);

    if (isNaN(width) || isNaN(height)) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  });

  // Clear canvas
  document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Save image
  document.querySelector('.save-img').addEventListener('click', () => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png';
    link.click();
  });
});
