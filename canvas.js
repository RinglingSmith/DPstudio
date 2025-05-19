// canvas.js

const canvas = document.getElementById('paintCanvas');
const ctx = canvas?.getContext('2d');

// Check if canvas and context exist
if (!canvas || !ctx) {
    throw new Error("Canvas or context not found.");
}

// Resize canvas to match device pixel ratio
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

// Handle resizing of canvas based on window size
window.onload = () => {
    fixCanvasResolution();
};

window.addEventListener('resize', fixCanvasResolution);
