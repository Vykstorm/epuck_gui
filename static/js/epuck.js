
async function update_prox_sensors() {
    let values = await eel.get_prox_sensors()()
}

async function update_floor_sensors() {
    let values = await eel.get_floor_sensors()()
}

async function update_light_sensor() {
    let value = await eel.get_light_sensor()()
}

async function update_vision_sensor() {
    let value = await eel.get_vision_sensor()()
}

async function update_vision_sensor_params() {
    let params = await eel.get_vision_sensor_params()()
}

async function update_leds() {
    let leds = await eel.get_leds()()
}

async function update_motors() {
    let motors = await eel.get_motors()()
}

async function update_performance_info() {
    let info = await eel.get_performance_info()()
    steps_per_second = info['steps_per_second']
    update_time = info['update_time'] * 1000
    think_time = info['think_time'] * 1000


    $('#steps_per_second').text(Math.floor(steps_per_second))
    $('#update_time').text(update_time.toFixed(3))
    $('#think_time').text(think_time.toFixed(3))
}


$(document).ready(function() {
    update_performance_info()
})