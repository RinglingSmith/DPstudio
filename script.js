const canvas = document.getElementById('drawboard');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

let brushColor = "#000";
let lineWidth = 5;
let isPainting = false;
let lastX, lastY;

// Initial setup
resizeCanvas();

// Window resize (preserve drawings)
window.addEventListener('resize', () => resizeCanvas(true));

// Drawing function
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
    ctx.quadraticCurveTo(mouseX, mouseY, (lastX + mouseX) / 2, (lastY + mouseY) / 2);
    ctx.stroke();

    lastX = mouseX;
    lastY = mouseY;
}


// Resize the canvas using container width
function resizeCanvas(preserveContent = false) {
    const container = document.getElementById('canvas-container');
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

    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (preserveContent) {
        ctx.drawImage(tempCanvas, 0, 0);
    }
}

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

canvas.addEventListener('mousemove', draw);

// Background color change
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

// Toolbar updates
toolbar.addEventListener('change', (e) => {
    if (e.target.id === 'stroke') {
        brushColor = e.target.value;
    }

    if (e.target.id === 'size-slider') {
        lineWidth = parseInt(e.target.value, 10);
        document.getElementById('size-value').textContent = lineWidth;
    }
});

// Manual resize with user inputs
document.getElementById('apply-size').addEventListener('click', () => {
    const widthInput = document.getElementById('canvas-width').value;
    const heightInput = document.getElementById('canvas-height').value;
    const newWidth = parseInt(widthInput);
    const newHeight = parseInt(heightInput);

    if (isNaN(newWidth) || isNaN(newHeight)) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
});

// Clear button
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Save button
document.querySelector('.save-img').addEventListener('click', () => {
    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png';
    link.click();
});