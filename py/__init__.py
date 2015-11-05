from flask import Flask, render_template, json, request
import bounding_boxes
import AcceptRejectHistoricalJob
import CreateHistoricalJob
import MonitorJobStatus

app = Flask(__name__)


@app.route('/gnip')
def index():
    return render_template('index.html')


@app.route('/createJob', methods=['POST'])
def createJob():

    username = request.get_json()['username']
    password = request.get_json()['password']
    title = request.get_json()['title']
    timeframe = request.get_json()['timeframe']
    coordinates = request.get_json()['coordinates']
    rules = bounding_boxes.returnBoundingBox(coordinates['W'], coordinates['E'],
                                             coordinates['N'], coordinates['S'], "rules")
    createJob = CreateHistoricalJob.post(username, password, timeframe['fromDate'], timeframe['toDate'], title, rules)
    return json.dumps({'status': 'OK', 'createJob': createJob})


@app.route('/acceptRejectJob', methods=['POST'])
def acceptRejectJob():

    username = request.get_json()['username']
    password = request.get_json()['password']
    url = request.get_json()['url']
    accept = request.get_json()['accept']

    acceptRejectJob = AcceptRejectHistoricalJob.put(url, username, password, accept)

    return json.dumps({'status': 'OK', 'acceptRejectJob': acceptRejectJob})


@app.route('/jobStatus', methods=['POST'])
def jobStatus():

    username = request.get_json()['username']
    password = request.get_json()['password']
    url = request.get_json()['url']

    jobStatus = MonitorJobStatus.get(url, username, password)

    return json.dumps({'status': 'OK', 'jobStatus': jobStatus})


if __name__ == '__main__':
    app.run(host='0.0.0.0')
