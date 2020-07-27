import requests
import json
from flask import Flask, request, jsonify
from config import Configuration, internalServerURL



app = Flask(__name__)
app.config.from_object(Configuration)


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
        if statusCode == 200:
            print("success")
        elif statusCode == 405:
            print("Username is in use")
        return jsonify({'code': statusCode})
    return ""


# http://34.69.97.127:5660/login/<username>/<password>
# http://34.69.97.127:5660/register/<username>/<password>
