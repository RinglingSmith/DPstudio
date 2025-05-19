document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('drawboard');
  const toolbar = document.getElementById('toolbar');
  const ctx = canvas.getContext('2d');

  const history = [];
  const maxHistory = 50; // Optional: limit the number of saved states

  let selectedTool = "brush";
  let brushColor = '#000';
  let lineWidth = 5;
  let isPainting = false;
  let lastX = 0;
  let lastY = 0;

  // Use drawboard section as canvas container
  const container = document.querySelector('.drawboard');

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
    canvas.height = containerRect.height;

    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (preserveContent) {
      ctx.drawImage(tempCanvas, 0, 0);
    }
  }

  // Initial setup
  resizeCanvas();

  window.addEventListener('resize', () => resizeCanvas(true));

  // Draw function
  function draw(e) {
    if (!isPainting) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    if (selectedTool === "brush") {
      // Regular brush
      ctx.strokeStyle = brushColor;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    } else if (selectedTool === "eraser") {
      // Eraser
      ctx.strokeStyle = document.getElementById('bg-color-picker').value || '#ffffff';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    } else if (selectedTool === "airbrush") {
    // Airbrush effect: multiple small dots in random positions
    const dotCount = 15; // Increased dot count for a denser airbrush effect
    for (let i = 0; i < dotCount; i++) {
      const offsetX = Math.random() * 10 - 5; // Random x offset
      const offsetY = Math.random() * 10 - 5; // Random y offset

      ctx.fillStyle = brushColor;
      ctx.beginPath();
      ctx.arc(mouseX + offsetX, mouseY + offsetY, lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  lastX = mouseX;
  lastY = mouseY;
}

function saveState() {
  if (history.length >= maxHistory) {
    history.shift(); // Remove the oldest state if at max capacity
  }
  history.push(canvas.toDataURL());
}

function undo() {
  if (history.length > 0) {
    const imgData = history.pop();
    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

canvas.addEventListener('mouseup', () => {
  isPainting = false;
  ctx.beginPath();
  saveState(); // Save after each stroke
});


  // Mouse events
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

  canvas.addEventListener('mouseleave', () => {
    isPainting = false;
    ctx.beginPath();
  });

  canvas.addEventListener('mousemove', draw);

  // Tool selection
  document.getElementById('brush').addEventListener('click', () => {
    selectedTool = "brush";
  });

  document.getElementById('eraser').addEventListener('click', () => {
    selectedTool = "eraser";
  });

 document.getElementById('airbrush').addEventListener('click', () => {
  selectedTool = "airbrush";
});

  // Stroke color
  document.getElementById('stroke').addEventListener('input', (e) => {
    brushColor = e.target.value;
  });

  // Brush size
  document.getElementById('size-slider').addEventListener('input', (e) => {
    lineWidth = parseInt(e.target.value, 10);
    document.getElementById('size-value').textContent = lineWidth;
  });

  document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    undo();
  }
});

  // Background color
  document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    const newColor = e.target.value;
    canvas.style.backgroundColor = newColor;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    ctx.fillStyle = newColor;
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

  // Apply custom size
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
});
