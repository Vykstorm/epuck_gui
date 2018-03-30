

import eel
from epuck_reader import EPuckReader
from threading import Lock


# Opciones para la interfaz de usuario

static_path = 'static'

app_options = {
    'mode' : 'chrome',
    'host' : 'localhost',
    'port' : 8000,
    'chromeFlags' : []
}


# Funciones expuestas para ser invocadas desde Javascript

@eel.expose
def get_prox_sensors():
    return get_epuck_data().prox_sensors

@eel.expose
def get_floor_sensors():
    return get_epuck_data().floor_sensors

@eel.expose
def get_light_sensor():
    value = get_epuck_data().light_sensor
    # TODO
    return None

@eel.expose
def get_vision_sensor():
    image = get_epuck_data().vision_sensor
    return image

@eel.expose
def get_vision_sensor_params():
    return get_epuck_data().vision_sensor_params

@eel.expose
def get_leds():
    return get_epuck_data().leds

@eel.expose
def get_motors():
    return get_epuck_data().motors

@eel.expose
def get_performance_info():
    data = get_epuck_data()
    return {
        'elapsed_time' : data.elapsed_time,
        'update_time' : data.update_time,
        'steps_per_second' : data.steps_per_second,
        'think_time' : data.think_time
    }


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



if __name__ == '__main__':
    eel.init(static_path)
    eel.start('main.html', options = app_options)
