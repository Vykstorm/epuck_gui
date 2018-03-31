
from epuck_reader import EPuckReader
from threading import Lock
from flask import Flask
from os.path import join, dirname
from time import sleep, clock


app = Flask(__name__)



# Limitamos la cantidad máxima de requests via http para actualizar la info de los sensores / actuadores del epuck
# en la interfaz de usuario.
max_requests_per_sec = 10



# Métodos auxiliares

_epuck_lock = Lock()
epuck = None


def get_epuck_data():
    global epuck
    with _epuck_lock:
        if epuck is None or not epuck.alive:
            while True:
                try:
                    epuck = EPuckReader(address = 'localhost', port = 19998)
                    break
                except ConnectionRefusedError:
                    pass
        return epuck.data


@app.route('/')
@app.route('/epuck')
def main():
    with open(join(dirname(__file__), 'static', 'main.html')) as html:
        return html.read()


_last_request_time = None

@app.route('/data')
def data():
    global _last_request_time
    curr_time = clock()
    if not _last_request_time is None and curr_time - _last_request_time < (1 / max_requests_per_sec):
        sleep(1 / max_requests_per_sec - (curr_time - _last_request_time))
    _last_request_time = curr_time

    response = app.response_class(
        response=get_epuck_data(),
        status=200,
        mimetype='application/json'
    )

    return response


if __name__ == '__main__':
    app.run()