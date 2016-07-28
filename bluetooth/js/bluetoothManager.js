

var requestDevice = function() {
  update("requesting device...");

  if (navigator.bluetooth) {
    navigator.bluetooth.requestDevice({
      filters: [{
        services: ['46a970e0-0d5f-11e2-8b5e-0002a5d5c51b']
      }]
    })
    .then(device => { update('device name: ' + device.Name); })
    .catch(error => { update(error); });
  } else {
    update("bluetooth not supported");
  }

}

var update = function (msg) {
  console.log(msg);
  document.getElementById('msg').innerHTML = msg;
}
