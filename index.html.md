<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adobe-style Paint</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Adobe-style Paint</h1>
    <!-- Controls Section -->
    <div id="controls">
        <label for="colorPicker">Brush Color: </label>
        <input type="color" id="colorPicker" value="#000000">
        Size">Brush Size: </label>
        <input type="range" id="brushSize" min="1" max="50" value="5">
        <button id="clearBtn">Clear</button>
        <button id="saveBtn">Save</button>
    </div>
    <!-- Canvas Section -->
    <canvas id="paintCanvas" width="800" height="600"></canvas>
    <script src="script.js"></script>
</body>
</html>
