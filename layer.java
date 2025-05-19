import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.ArrayList;

public class LayerServlet extends HttpServlet {

    private ArrayList<String> layers = new ArrayList<>();

    @Override
    public void init() throws ServletException {
        // Initialize with one layer
        layers.add("Layer 1");
    }

    // Do GET to retrieve the list of layers
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println("{ \"layers\": " + layers.toString() + " }");
    }

    // Do POST to add a new layer
    @Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Read the new layer name from the request
    String layerName = request.getParameter("layerName");
    if (layerName != null && !layerName.isEmpty()) {
        layers.add(layerName);
    }

    // Prepare the response
    response.setContentType("application/json");
    PrintWriter out = response.getWriter();

    // Build valid JSON
    StringBuilder json = new StringBuilder("{ \"layers\": [");
    for (int i = 0; i < layers.size(); i++) {
        json.append("\"").append(layers.get(i)).append("\"");
        if (i < layers.size() - 1) {
            json.append(",");
        }
    }
    json.append("] }");

    // Send the response
    out.println(json.toString());
    out.flush();
}


    // Do DELETE to remove a layer by index
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int layerIndex = Integer.parseInt(request.getParameter("index"));
            if (layerIndex >= 0 && layerIndex < layers.size()) {
                layers.remove(layerIndex);
            }
        } catch (NumberFormatException e) {
            // Handle invalid index
        }

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println("{ \"layers\": " + layers.toString() + " }");
    }
}
