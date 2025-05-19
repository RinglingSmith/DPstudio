import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.ArrayList;

public class LayerServlet extends HttpServlet {

    // In-memory list to store layers
    private ArrayList<String> layers = new ArrayList<>();

    @Override
    public void init() throws ServletException {
        // Initialize with one layer
        layers.add("Layer 1");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the list of layers and send them as a response
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println("{ \"layers\": " + layers.toString() + " }");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle adding a new layer
        String layerName = request.getParameter("layerName");
        if (layerName != null && !layerName.isEmpty()) {
            layers.add(layerName);
        }

        // Respond with the updated list of layers
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println("{ \"layers\": " + layers.toString() + " }");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle removing a layer by its index
        try {
            int layerIndex = Integer.parseInt(request.getParameter("index"));
            if (layerIndex >= 0 && layerIndex < layers.size()) {
                layers.remove(layerIndex);
            }
        } catch (NumberFormatException e) {
            // Handle invalid index
        }

        // Respond with the updated list of layers
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println("{ \"layers\": " + layers.toString() + " }");
    }
}


