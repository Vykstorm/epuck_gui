

import eel
from epuck_reader import EPuckReader


# Opciones para la interfaz de usuario

static_path = 'static'

app_options = {
    'mode' : 'chrome-app',
    'host' : 'localhost',
    'port' : 8000,
    'chromeFlags' : []
}



@eel.expose
def get_prox_sensors():
    return epuck.data.prox_sensors

@eel.expose
def get_floor_sensors():
    return epuck.data.floor_sensors

@eel.expose
def get_light_sensor():
    value = epuck.data.light_sensor
    # TODO
    return None

@eel.expose
def get_vision_sensor():
    image = epuck.data.vision_sensor
    # TODO
    return None

@eel.expose
def get_vision_sensor_params():
    return epuck.data.vision_sensor_params

@eel.expose
def get_leds():
    return epuck.data.leds

@eel.expose
def get_motors():
    return epuck.data.motors

@eel.expose
def get_performance_info():
    data = epuck.data
    return {
        'elapsed_time' : data.elapsed_time,
        'update_time' : data.update_time,
        'steps_per_second' : data.steps_per_second,
        'think_time' : data.think_time
    }

if __name__ == '__main__':
    epuck = EPuckReader(address='localhost', port=19998)
    eel.init(static_path)
    eel.start('main.html', options = app_options)
