const canvas = document.getElementById('drawboard');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

// Get the canvas offset relative to the page
const canvasRect = canvas.getBoundingClientRect();

// Set the canvas size to match the window size
canvas.width = window.innerWidth - canvasRect.left;
canvas.height = window.innerHeight - canvasRect.top;

let isPainting = false;
let lineWidth = 5;
let startX, startY;
let lastX, lastY;

// Function to create smoother brush strokes
const draw = (e) => {
    if (!isPainting) {
        return;
    }

    // Adjust mouse coordinates based on the canvas position
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    ctx.lineWidth = lineWidth;
    ctx.linecap = 'round';
    ctx.strokeStyle = ctx.strokeStyle || "#000";  // Default color if not set

    // Using quadraticCurveTo for smoother curves between points
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);  // Start point of the curve
    ctx.quadraticCurveTo(mouseX, mouseY, (lastX + mouseX) / 2, (lastY + mouseY) / 2);  // Control point and end point
    ctx.stroke();

    // Update lastX, lastY to current mouse position
    lastX = mouseX;
    lastY = mouseY;
};

// Event listener to change background color
document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    // Change the canvas background color based on the color picker value
    canvas.style.backgroundColor = e.target.value;
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with the selected color
});

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;

    // Adjust mouse coordinates based on the canvas position
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    lastX = mouseX;
    lastY = mouseY;
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

// Event listener for the toolbar actions
toolbar.addEventListener('click', (e) => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', (e) => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
});

window.addEventListener('load', () => {
    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
});
