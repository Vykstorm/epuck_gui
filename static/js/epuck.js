
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


function update_prox_sensors(values) {
    var update_sensor = function(index, value) {
        image = $('#ir' + index + ' img').first()
        if(!value || value < 200) {
            image.css('visibility', 'hidden')
            image.attr('src', '/static/images/signal1.png')
        }
        else {
            scale = Math.floor((value / 3000) * 4)
            scale = Math.max(Math.min(scale, 3), 0)
            image.attr('src', '/static/images/signal' + (scale + 1) + '.png')
            image.css('visibility', 'visible')
        }
    }

    for(var i = 0; i < 8; i++) {
        update_sensor(i, values[i])
    }
}

function update_floor_sensors(values) {

}

function update_light_sensor() {

}

function update_vision_sensor(value) {
    var url
    if(!value) {
        url = 'images/camera_disconnected.png'
    }
    else {
        blob = b64toBlob(value, 'image/jpeg')
        var url_factory = window.URL || window.webkitURL;
        url = url_factory.createObjectURL( blob );
    }
    var image = document.querySelector( "#vision_sensor" );
    image.src = url;

}

function update_vision_sensor_params(params) {
    mode = params[0]
    size = params[1]
    zoom = params[2]
    $('#vision_sensor_mode').text(mode)
    $('#vision_sensor_resolution').text(size[0] + ' x ' + size[1] + ' px')
    $('#vision_sensor_zoom').text('x' + zoom)
}

function update_leds(states) {

}

function update_motors(speeds) {

    var update_motor = function(label, value) {
        rpm = value / (2 * Math.PI)
        label.text(rpm.toFixed(2))
    }

    update_motor($('#left_motor'), speeds[0])
    update_motor($('#right_motor'), speeds[1])
}

function update_performance_info(info) {
    steps_per_second = info['steps_per_second']
    update_time = info['update_time'] * 1000
    think_time = info['think_time'] * 1000

    $('#steps_per_second').text(Math.floor(steps_per_second))
    $('#update_time').text(update_time.toFixed(4))
    $('#think_time').text(think_time.toFixed(4))
}


current_data = undefined

function update(data) {
    update_prox_sensors(data['prox_sensors'])
    update_floor_sensors(data['floor_sensors'])
    update_vision_sensor(data['vision_sensor'])
    update_vision_sensor_params(data['vision_sensor_params'])
    update_motors(data['motors'])
    // update_leds()
    // update_light_sensor()

    if(current_data == undefined) {
        update_performance_info(data)
    }
    current_data = data
}


$(document).ready(function() {
    var get_data = function() {
        $.getJSON('/data', function(data) {
            update(data)
            get_data()
        })
    }
    get_data()

    // Solo refrescamos cada 850 mills la información relativa al rendimiento del controlador.
    setInterval(function() {
        if(current_data != undefined) {
            update_performance_info(current_data)
        }
    }, 850)
})