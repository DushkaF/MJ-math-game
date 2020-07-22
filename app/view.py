from app import app
from flask import render_template, request

@app.route("/")
def index():
    print()
    return render_template("index.html")

@app.route("/game")
def game():
    print()
    return render_template("game.html")

'''@app.route("/navbar_content/aboutGame.html")
def nav():
    print()
    return render_template("/navbar_content/aboutGame.html")'''