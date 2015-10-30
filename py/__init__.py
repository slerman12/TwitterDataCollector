from flask import Flask, render_template, json, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/helloUser', methods=['POST'])
def api_articles():
    user = request.get_json()['user']
    return json.dumps({'status':'OK','user':user});

if __name__ == '__main__':
    app.run()
