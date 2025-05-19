const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d");

const drawing = (e) => {
    ctx.lineTo(e.offsetx, e.offsetY):
    ctx.stroke();
}

canvas.addEventListener("mousemove", drawing);