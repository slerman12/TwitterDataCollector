from flask import Flask, render_template, json, request
import bounding_boxes

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/newJob', methods=['POST'])
def api_articles():
    data = bounding_boxes.returnBoundingBox(-78.5401367286, -76.18272114, 43.3301514, 42.00027541, "rochester-rules")

    # user = request.get_json()['user']
    return json.dumps({'status': 'OK', 'rules': data})


# @app.route('/jobStatus', methods=['POST'])
# def api_articles():
#     user = request.get_json()['user']
#     return json.dumps({'status': 'OK', 'user': user})
#
#
# @app.route('/results', methods=['POST'])
# def api_articles():
#     user = request.get_json()['user']
#     return json.dumps({'status': 'OK', 'user': user})


if __name__ == '__main__':
    app.run()
