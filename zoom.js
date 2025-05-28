let zoomLevel = 1;
const zoomStep = 0.1;
const minZoom = 0.2;
const maxZoom = 5;

drawboard.addEventListener('wheel', function (e) {
  e.preventDefault(); // prevent page scrolling

  if (e.deltaY < 0) {
    // zoom in
    zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
  } else {
    // zoom out
    zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
  }

  updateZoom();
});

function updateZoom() {
  drawboard.style.transform = `scale(${zoomLevel})`;
}
