import requests
import json
from flask import Flask, request, jsonify
from config import Configuration, internalServerURL

app = Flask(__name__)
app.config.from_object(Configuration)


def authorization(do):
    if request.method == 'POST':
        username = request.form.get('username')  # запрос к данным формы
        password = request.form.get('password')
        print(username, password)
        resp = requests.get(url=internalServerURL + do + "/" + username + '/' + password)
        requvestJSON = json.loads(resp.text)
        print(requvestJSON)
        statusCode = requvestJSON["code"]
        return jsonify({'code': statusCode})
    else:
        return ""


@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    return authorization("register")


@app.route('/logIn', methods=['POST', 'GET'])
def logIn():
    return authorization("login")

# http://34.69.97.127:5660/login/<username>/<password>
# http://34.69.97.127:5660/register/<username>/<password>
