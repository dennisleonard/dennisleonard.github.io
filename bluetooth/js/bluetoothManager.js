

var requestDevice = function() {
  update("requesting device...");

  if (navigator.bluetooth) {
    navigator.bluetooth.requestDevice({
      filters: [{ 
        services: ['46A970E0-0D5F-11E2-8B5E-0002A5D5C51B']
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

requestDevice();
