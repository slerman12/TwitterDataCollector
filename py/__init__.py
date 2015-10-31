from flask import Flask, render_template, json, request
import bounding_boxes

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/newJob', methods=['POST'])
def newJob():

    coordinates = request.get_json()['coordinates']
    rules = bounding_boxes.returnBoundingBox(coordinates['W'], coordinates['E'],
                                             coordinates['N'], coordinates['S'], "rules")
    return json.dumps({'status': 'OK', 'rules': rules})


@app.route('/jobStatus', methods=['POST'])
def jobStatus():
    user = request.get_json()['user']
    return json.dumps({'status': 'OK', 'user': user})


@app.route('/results', methods=['POST'])
def results():
    user = request.get_json()['user']
    return json.dumps({'status': 'OK', 'user': user})


if __name__ == '__main__':
    app.run()
