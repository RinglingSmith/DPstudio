#include <emscripten.h>
#include <iostream>
#include <vector>

class Canvas {
public:
    int width, height;
    std::vector<std::vector<int>> layers;

    Canvas(int w, int h) : width(w), height(h) {
        // Initialize the canvas with 1 layer
        layers.push_back(std::vector<int>(w * h, 255));  // Set a white background (255 for white)
    }

    void createLayer(int width, int height) {
        // Create a new layer and set it to white
        layers.push_back(std::vector<int>(width * height, 255));
    }

    void drawOnLayer(int layerIndex, int x, int y, int color) {
        if (layerIndex >= layers.size()) return;

        std::vector<int>& layer = layers[layerIndex];
        if (x < 0 || x >= width || y < 0 || y >= height) return;

        layer[y * width + x] = color;  // Simple logic to draw a pixel
    }

    void printCanvas() {
        std::cout << "Canvas: " << width << "x" << height << " with " << layers.size() << " layers." << std::endl;
        for (int i = 0; i < layers.size(); ++i) {
            std::cout << "Layer " << i << ": " << layers[i].size() << " pixels" << std::endl;
        }
    }
};

// The EMSCRIPTEN_BINDINGS macro tells Emscripten how to expose C++ code to JavaScript
EMSCRIPTEN_BINDINGS(CanvasModule) {
    emscripten::class_<Canvas>("Canvas")
        .constructor<int, int>()
        .function("createLayer", &Canvas::createLayer)
        .function("drawOnLayer", &Canvas::drawOnLayer)
        .function("printCanvas", &Canvas::printCanvas);
}
