import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.ColorPicker;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class PaintApp extends Application {

    private double lastX, lastY;
    private boolean isDrawing = false;
    private GraphicsContext gc;
    private ColorPicker colorPicker;

    @Override
    public void start(Stage primaryStage) {
        // Create canvas and graphics context
        Canvas canvas = new Canvas(800, 600);
        gc = canvas.getGraphicsContext2D();

        // Initialize color picker
        colorPicker = new ColorPicker();
        colorPicker.setValue(javafx.scene.paint.Color.BLACK);

        // Set up drawing behavior
        canvas.addEventHandler(MouseEvent.MOUSE_PRESSED, this::startDrawing);
        canvas.addEventHandler(MouseEvent.MOUSE_DRAGGED, this::draw);
        canvas.addEventHandler(MouseEvent.MOUSE_RELEASED, this::stopDrawing);

        // Layout
        VBox root = new VBox(colorPicker, canvas);
        Scene scene = new Scene(root);

        primaryStage.setTitle("JavaFX Paint Application");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private void startDrawing(MouseEvent event) {
        isDrawing = true;
        lastX = event.getX();
        lastY = event.getY();
    }

    private void draw(MouseEvent event) {
        if (isDrawing) {
            gc.setStroke(colorPicker.getValue());
            gc.setLineWidth(5);
            gc.strokeLine(lastX, lastY, event.getX(), event.getY());
            lastX = event.getX();
            lastY = event.getY();
        }
    }

    private void stopDrawing(MouseEvent event) {
        isDrawing = false;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
