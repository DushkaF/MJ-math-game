import requests
import json
from flask import Flask, request, jsonify, render_template, session
from config import Configuration, internalServerURL

app = Flask(__name__)
app.config.from_object(Configuration)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

waiters = 0



@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    if request.method == 'POST':
        username = request.form.get('username')  # запрос к данным формы
        password = request.form.get('password')
        print(username, password)
        resp = requests.get(url=internalServerURL + "register/" + username + '/' + password)
        requvestJSON = json.loads(resp.text)
        print(requvestJSON)
        statusCode = requvestJSON["code"]
        return jsonify({'code': statusCode})
    else:
        return ""


@app.route('/logIn', methods=['POST', 'GET'])
def logIn():
    if request.method == 'POST':
        username = request.form.get('username')  # запрос к данным формы
        password = request.form.get('password')
        print(username, password)
        resp = requests.get(url=internalServerURL + "login/" + username + '/' + password)
        requvestJSON = json.loads(resp.text)
        print(requvestJSON)
        statusCode = requvestJSON["code"]
        print(requvestJSON['data'], type(requvestJSON['data']))
        if statusCode == 200:
            session['token'] = requvestJSON['data']['Token']
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