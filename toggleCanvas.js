// toggleCanvas.js

const toggleCanvasBtn = document.getElementById("toggleCanvasBtn");
const canvasWrapper = document.getElementById("canvasWrapper");

toggleCanvasBtn.addEventListener("click", function () {
    // Toggle canvas visibility
    if (canvasWrapper.style.display === "none") {
        canvasWrapper.style.display = "block";
        toggleCanvasBtn.textContent = "Hide Canvas"; // Update button text
    } else {
        canvasWrapper.style.display = "none";
        toggleCanvasBtn.textContent = "Show Canvas"; // Update button text
    }
});
