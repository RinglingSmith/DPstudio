import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

@WebServlet("/layers")
public class LayerServlet extends HttpServlet {

    private final ArrayList<String> layers = new ArrayList<>();

    @Override
    public void init() {
        layers.add("Layer 1");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<html><head><title>Layer Manager</title></head><body>");
        out.println("<h1>Layers</h1>");

        // Show current layers with remove buttons
        out.println("<ul>");
        for (int i = 0; i < layers.size(); i++) {
            out.println("<li>" + layers.get(i) +
                    "<form method='post' style='display:inline'>" +
                    "<input type='hidden' name='removeIndex' value='" + i + "'/>" +
                    "<input type='submit' value='Remove'/>" +
                    "</form></li>");
        }
        out.println("</ul>");

        // Add layer form
        out.println("<h2>Add New Layer</h2>");
        out.println("<form method='post'>");
        out.println("Layer Name: <input type='text' name='layerName' required/>");
        out.println("<input type='submit' value='Add Layer'/>");
        out.println("</form>");

        out.println("</body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String layerName = request.getParameter("layerName");
        String removeIndex = request.getParameter("removeIndex");

        if (layerName != null && !layerName.isEmpty()) {
            layers.add(layerName);
        } else if (removeIndex != null) {
            try {
                int index = Integer.parseInt(removeIndex);
                if (index >= 0 && index < layers.size()) {
                    layers.remove(index);
                }
            } catch (NumberFormatException ignored) {
            }
        }

        // Redirect back to GET view
        response.sendRedirect("layers");
    }
}
