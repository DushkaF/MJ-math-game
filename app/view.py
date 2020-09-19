from app import app, waiters
from flask import render_template, send_file, session, abort

@app.route("/")
@app.route("/<data>")
@app.route("/<data>/<data1>")
def index(data="", data1=""):
    return render_template("index.html")


@app.route("/game")
def game():
    return render_template("game.html")


@app.route('/static/<dir>/<file>')
def statics(dir, file):
    path = "static/" + dir + "/" + file
    return send_file(path)


@app.route("/waitRoom")
def waitRoom():
    if 'token' in session:
        return render_template("waitRoom.html")
    else:
        return abort(404)
