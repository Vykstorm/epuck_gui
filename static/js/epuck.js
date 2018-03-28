
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
    blob = b64toBlob(value, 'image/jpeg')

    var url_factory = window.URL || window.webkitURL;
    var url = url_factory.createObjectURL( blob );
    var image = document.querySelector( "#vision_sensor" );
    image.src = url;

    //$('#vision_sensor').attr('src', 'data:image/jpeg;base64,' + value)
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
    $('#update_time').text(update_time.toFixed(4))
    $('#think_time').text(think_time.toFixed(4))
}


$(document).ready(function() {
    setInterval(update_performance_info, 250)
    setInterval(update_vision_sensor, 150)
})