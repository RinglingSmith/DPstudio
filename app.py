# app.py
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/search")
def search():
    query = request.args.get("q")
    # Pretend search results
    results = [
        {"title": "Example Result 1", "url": "http://example.com"},
        {"title": "Example Result 2", "url": "http://example.com/2"}
    ]
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True)
