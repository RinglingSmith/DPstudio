<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DP Studio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <section id="toolbar" class="toolbar">  
            <div class="row">
                <h1>DP Studio</h1>
                <label class="title">Shape</label>
                <ul class="option">
                    <li class="options">
                        <span>Rectangle</span>
                    </li>
                    <li class="options">
                        <span>Circle</span>
                    </li>
                    <li class="options">
                        <span>Triangle</span>
                    </li>
                    <li class="options">
                        <span>Line</span>
                    </li>
                    <li class="options">
                        <input type="checkbox">
                        <label for="fill-color">Fill color</label>  
                    </li>
                </ul>
            </div>
            <div class="row">
                <label class="title">Option</label>
                <ul class="option">
                    <li class="options">
                        <span>Brush</span>
                    </li>
                    <li class="options">
                        <span>Eraser</span>
                    </li>
                    <li class="options">
                        <input type="range" id="size-slider">  
                    </li>
                </ul>
                <div class="row">
                    <button id="clear" class="clear">Clear</button> 
                    <button class="save-img">Save Image</button>
                </div>
            </div>
        </section>
        <section class="drawboard">
            <canvas id="drawboard"></canvas>
        </section>
    </div>
    <script src="script.js"></script>
</body>
</html>
