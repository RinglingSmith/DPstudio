function draw(evt) {
    if (!painting) return;

    const pos = getMousePos(evt); // ✅ This needs to be first!

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out'; // Set to erase
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        return;
    }

    ctx.globalCompositeOperation = 'source-over'; // Normal drawing
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;

    switch (brushType) {
        case 'round':
        case 'square':
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            break;

        case 'spray':
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * brushSize;
                const x = pos.x + radius * Math.cos(angle);
                const y = pos.y + radius * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 2 * Math.PI);
                ctx.fill();
            }
            break;

        case 'marker':
            ctx.globalAlpha = 0.1;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            break;

        case 'fuzzy':
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * brushSize;
                const x = pos.x + radius * Math.cos(angle);
                const y = pos.y + radius * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, 0.8, 0, 2 * Math.PI);
                ctx.fill();
            }
            break;

        case 'calligraphy':
            const angle = Math.PI / 6;
            const dx = Math.cos(angle) * brushSize;
            const dy = Math.sin(angle) * brushSize;
            ctx.beginPath();
            ctx.moveTo(pos.x - dx, pos.y - dy);
            ctx.lineTo(pos.x + dx, pos.y + dy);
            ctx.stroke();
            break;

        case 'airbrush':
            for (let i = 0; i < 30; i++) {
                const a = Math.random() * 2 * Math.PI;
                const r = Math.random() * brushSize;
                const x = pos.x + r * Math.cos(a);
                const y = pos.y + r * Math.sin(a);
                ctx.globalAlpha = Math.random() * 0.2;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;
            break;

        case 'pixel':
            ctx.fillRect(pos.x, pos.y, brushSize, brushSize);
            break;

        case 'mirrorX':
            const mirrorX = canvas.width - pos.x;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(mirrorX, pos.y);
            ctx.lineTo(mirrorX, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            break;

        case 'patternDot':
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.arc(pos.x + i, pos.y + i, 1.5, 0, 2 * Math.PI);
                ctx.fill();
            }
            break;
    }
}


