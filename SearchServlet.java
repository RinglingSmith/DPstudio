package com.example.wiki;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class SearchServlet extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String query = request.getParameter("query");
    response.setContentType("text/html");

    PrintWriter out = response.getWriter();
    out.println("<html><body>");
    out.println("<h2>Search results for: " + query + "</h2>");
    // Simulated results
    out.println("<p><a href='article.html?id=1'>Sample Article 1</a></p>");
    out.println("</body></html>");
  }
}
