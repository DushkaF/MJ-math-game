import requests
import json
from flask import Flask, request, jsonify, render_template, session, abort
from config import Configuration, internalServerURL, secretKey

app = Flask(__name__)
app.config.from_object(Configuration)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = secretKey

waiters = 0


@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    if request.method == 'POST':
        username = request.form.get('username')  # запрос к данным формы
        password = request.form.get('password')
        print(username, password)
        resp = requests.get(url=f"{internalServerURL}/api/v1/user/register/{username}/{password}")
        requestJSON = json.loads(resp.text)
        print(requestJSON)
        statusCode = requestJSON["code"]
        return jsonify({'code': statusCode})
    else:
        return ""


@app.route('/logIn', methods=['POST', 'GET'])
def logIn():
    if request.method == 'POST':
        username = request.form.get('username')  # запрос к данным формы
        password = request.form.get('password')
        print(username, password)
        resp = requests.get(url=f"{internalServerURL}/api/v1/user/login/{username}/{password}")
        requestJSON = json.loads(resp.text)
        print(requestJSON)
        statusCode = requestJSON["code"]
        print(requestJSON['data'], type(requestJSON['data']))
        if statusCode == 200:
            session['token'] = requestJSON['data']['Token']
        return jsonify({'code': statusCode})
    else:
        return ""


@app.route('/waitRoom/<count>', methods=['GET'])
def room(count):
    global waiters
    waiters = int(count)
    return "Push in room " + count + " people"


@app.route('/waitRoomCount', methods=['GET'])
def waited():
    global waiters
    return jsonify({'count': waiters})


@app.route('/exit')
def prifExit():
    exitStatus = {}
    if 'token' in session:
        session.pop('token', None)  # удаление данных о посещениях
        exitStatus = {'code': 200}
    else:
        exitStatus = {'code': 404}
    return jsonify(exitStatus)


@app.route('/visits-counter/')
def visits():
    if 'visits' in session:
        session['visits'] = session.get('visits') + 1  # чтение и обновление данных сессии
    else:
        session['visits'] = 1  # настройка данных сессии
    return "Total visits: {}".format(session.get('visits'))


@app.route('/delete-visits/')
def delete_visits():
    session.pop('visits', None)  # удаление данных о посещениях
    return 'Visits deleted'


@app.route('/isToken')
def isToken():
    if 'token' in session:
        exitStatus = {'code': 200}
    else:
        exitStatus = {'code': 401}
    return jsonify(exitStatus)


@app.route('/getUser', methods=["POST"])
def getUserInfo():
    if request.method == 'POST':
        username = request.form.get('username')  # запрос к данным формы
        print(username)
        resp = requests.get(url=f"{internalServerURL}/api/v1/user/{username}")
        requestJSON = json.loads(resp.text)
        print(requestJSON)
        statusCode = requestJSON["code"]
        requestJSON['data'].update({"code": statusCode});
        print(requestJSON['data'], type(requestJSON['data']))
        if statusCode == 200:
            return jsonify(requestJSON['data'])
        return jsonify({'code': statusCode})
    else:
        return abort(404)
