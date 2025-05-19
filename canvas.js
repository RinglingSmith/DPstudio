// canvas.js

const canvas = document.getElementById('paintCanvas');
const ctx = canvas?.getContext('2d');

if (!canvas || !ctx) {
    throw new Error("Canvas or context not found.");
}

let history = [];
let historyStep = -1;
let scale = 1;
let offsetX = 0;
let offsetY = 0;

// Function to fix the canvas resolution based on the device pixel ratio
function fixCanvasResolution() {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const oldData = canvas.toDataURL();

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const img = new Image();
    img.src = oldData;
    img.onload = () => ctx.drawImage(img, 0, 0);
}

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left - offsetX) / scale,
        y: (evt.clientY - rect.top - offsetY) / scale
    };
}

// Touch support for mobile devices
function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    return {
        clientX: touch.clientX,
        clientY: touch.clientY
    };
}

// Event listeners for canvas
canvas.addEventListener("mousedown", startPaint);
canvas.addEventListener("mouseup", endPaint);
canvas.addEventListener("mouseout", endPaint);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

// Handle canvas resizing
window.onload = () => {
    fixCanvasResolution();
    history.push(canvas.toDataURL());
    historyStep = 0;
};

window.addEventListener('resize', fixCanvasResolution);
