from app import app, waiters
from flask import render_template, send_file

@app.route("/")
def index():
    print(waiters)
    print(id(waiters))
    return render_template("index.html")

@app.route("/game")
def game():
    return render_template("game.html")

@app.route('/static/<dir>/<file>')
def statics(dir, file):
    path = "static/"+dir+"/"+file
    return send_file(path)