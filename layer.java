import java.util.HashMap;
import java.util.Map;

public class LayerManager {

    private Map<String, Layer> layers;

    public LayerManager() {
        layers = new HashMap<>();

        // Initialize layers
        layers.put("layers-active-layer", new Layer(
            "Active Layer", 
            "Valt lager", 
            "currently selected layer that user is drawing on"
        ));
        layers.put("layers-layer", new Layer("Layer", "Lager", null));
        layers.put("layers-copy", new Layer("copy", "kopia", "noun"));
        layers.put("layers-blending", new Layer(
            "Blending", 
            "Blandning", 
            "Common feature in image editing & drawing software. All layers-blend- keys relate to this. https://en.wikipedia.org/wiki/Blend_modes"
        ));
        layers.put("layers-new", new Layer("New Layer", "Nytt lager", "action"));
        layers.put("layers-remove", new Layer("Remove Layer", "Ta bort lager", "action"));
        layers.put("layers-duplicate", new Layer("Duplicate Layer", "Duplicera lager", "action"));
        layers.put("layers-merge", new Layer("Merge with layer below", "Slå ihop med lagret under", "action"));
        layers.put("layers-clear", new Layer("Clear layer", "Rensa lager", "to make a layer empty"));
        layers.put("layers-merge-all", new Layer("Merge all", "Slå ihop alla lager", null));
        layers.put("layers-rename", new Layer("Rename", "Döp om", "action"));
        layers.put("layers-active-layer-visible", new Layer("Active layer is visible", "Detta lager är synligt", null));
        layers.put("layers-active-layer-hidden", new Layer("Active layer is hidden", "Detta lager är inte synligt", null));
        layers.put("layers-visibility-toggle", new Layer("Layer Visibility", "Visa/göm lagret", null));
        layers.put("layers-blend-normal", new Layer("normal", "normal", null));
        layers.put("layers-blend-darken", new Layer("darken", "mörkare", null));
        layers.put("layers-blend-multiply", new Layer("multiply", "multiplicera", null));
        layers.put("layers-blend-color-burn", new Layer("color burn", "efterbelys färg", null));
        layers.put("layers-blend-lighten", new Layer("lighten", "ljusare", null));
        layers.put("layers-blend-screen", new Layer("screen", "raster", null));
        layers.put("layers-blend-color-dodge", new Layer("color dodge", "färgskugga", null));
        layers.put("layers-blend-overlay", new Layer("overlay", "täcka över", null));
        layers.put("layers-blend-soft-light", new Layer("soft light", "mjukt ljus", null));
        layers.put("layers-blend-hard-light", new Layer("hard light", "skarpt ljus", null));
        layers.put("layers-blend-difference", new Layer("difference", "differens", null));
        layers.put("layers-blend-exclusion", new Layer("exclusion", "uteslutning", null));
        layers.put("layers-blend-hue", new Layer("hue", "nyans", null));
        layers.put("layers-blend-saturation", new Layer("saturation", "mättnad", null));
        layers.put("layers-blend-color", new Layer("color", "färg", null));
        layers.put("layers-blend-luminosity", new Layer("luminosity", "luminiscens", null));
        layers.put("layers-rename-title", new Layer("Rename Layer", "Döp om lager", "-title in code usually means it shows up in a tooltip, or it’s the header of a dialog box, so it can be a little bit longer."));
        layers.put("layers-rename-name", new Layer("Name", "Namn", "noun"));
        layers.put("layers-rename-clear", new Layer("Clear Name", "Rensa namnet", "action of deleting entered name"));
        layers.put("layers-rename-sketch", new Layer("Sketch", "Skiss", "noun. Name suggestion for a layer"));
        layers.put("layers-rename-colors", new Layer("Colors", "Färger", "noun. Name suggestion for a layer"));
        layers.put("layers-rename-shading", new Layer("Shading", "Skuggning", "noun. Name suggestion for a layer"));
        layers.put("layers-rename-lines", new Layer("Lines", "Linjer", "noun. Name suggestion for a layer"));
        layers.put("layers-rename-effects", new Layer("Effects", "Effekter", "noun. Name suggestion for a layer"));
        layers.put("layers-rename-foreground", new Layer("Foreground", "Förgrund", "noun. Name suggestion for a layer"));
        layers.put("layers-merge-modal-title", new Layer("Merge/Mix Layers", "Slå ihop/blanda lager", null));
        layers.put("layers-merge-description", new Layer(
            "Merges the selected layer with the one underneath. Select the mix mode:", 
            "Slår ihop det valda lagret med det lager som ligger under. Välj metod:", 
            "After ':' a list of mix/blend modes is shown."
        ));
    }

    // Get the layer by key
    public Layer getLayer(String key) {
        return layers.get(key);
    }

    // Layer class to represent a layer with original, value, and hint
    class Layer {
        private String original;
        private String value;
        private String hint;

        public Layer(String original, String value, String hint) {
            this.original = original;
            this.value = value;
            this.hint = hint;
        }

        public String getOriginal() {
            return original;
        }

        public String getValue() {
            return value;
        }

        public String getHint() {
            return hint;
        }

        @Override
        public String toString() {
            return "Layer{" +
                    "original='" + original + '\'' +
                    ", value='" + value + '\'' +
                    ", hint='" + hint + '\'' +
                    '}';
        }
    }

    public static void main(String[] args) {
        LayerManager layerManager = new LayerManager();
        System.out.println(layerManager.getLayer("layers-active-layer"));
    }
}
