
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}


__setInterval = setInterval

setInterval = function(callback, time_interval) {
    callback()
    return __setInterval(callback, time_interval)
}


async function update_prox_sensors() {
    var update_sensor = function(index, value) {
        image = $('#ir' + index + ' img').first()
        if(!value || value < 200) {
            image.css('visibility', 'hidden')
            image.attr('src', 'images/signal1.png')
        }
        else {
            scale = Math.floor((value / 3000) * 4)
            scale = Math.max(Math.min(scale, 3), 0)
            image.attr('src', 'images/signal' + (scale + 1) + '.png')
            image.css('visibility', 'visible')
        }
    }

    let values = await eel.get_prox_sensors()()

    for(var i = 0; i < 8; i++) {
        update_sensor(i, values[i])
    }
}

async function update_floor_sensors() {
    let values = await eel.get_floor_sensors()()
}

async function update_light_sensor() {
    let value = await eel.get_light_sensor()()
}

async function update_vision_sensor() {
    let value = await eel.get_vision_sensor()()
    blob = b64toBlob(value, 'image/jpeg')

    var url_factory = window.URL || window.webkitURL;
    var url = url_factory.createObjectURL( blob );
    var image = document.querySelector( "#vision_sensor" );
    image.src = url;

}

async function update_vision_sensor_params() {
    let params = await eel.get_vision_sensor_params()()
    mode = params[0]
    size = params[1]
    zoom = params[2]
    $('#vision_sensor_mode').text(mode)
    $('#vision_sensor_resolution').text(size[0] + ' x ' + size[1] + ' px')
    $('#vision_sensor_zoom').text('x' + zoom)
}

async function update_leds() {
    let leds = await eel.get_leds()()
}

async function update_motors() {
    let motors = await eel.get_motors()()

    var update_motor = function(label, value) {
        rpm = value / (2 * Math.PI)
        label.text(rpm.toFixed(2))
    }

    update_motor($('#left_motor'), motors[0])
    update_motor($('#right_motor'), motors[1])
}

async function update_performance_info() {
    let info = await eel.get_performance_info()()
    steps_per_second = info['steps_per_second']
    update_time = info['update_time'] * 1000
    think_time = info['think_time'] * 1000


    $('#steps_per_second').text(Math.floor(steps_per_second))
    $('#update_time').text(update_time.toFixed(4))
    $('#think_time').text(think_time.toFixed(4))
}


$(document).ready(function() {
    setInterval(update_performance_info, 250)
    setInterval(update_vision_sensor, 150)
    setInterval(update_vision_sensor_params, 1000)
    setInterval(update_prox_sensors, 100)
    setInterval(update_floor_sensors, 100)
    setInterval(update_light_sensor, 100)
    setInterval(update_motors, 100)
    setInterval(update_leds, 100)
})