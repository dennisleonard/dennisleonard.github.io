


var requestDevice = function() {
  clear();
  write("requesting device...");

  if (navigator.bluetooth) {
    startRequest();
  } else {
    write("bluetooth not supported");
  }
}

var startRequest = function() {
  navigator.bluetooth.requestDevice({
    filters: [{
      services: [PULSEOX_SERVICE]
    }]
  })
  .then(device => {
    if(device) {
      write('connecting to ' + device.name);
      device.addEventListener('gattserverdisconnected', onDisconnected);
      write('> Allowed Services: ' + device.uuids.join('<br/>' + ' '.repeat(20)));
      return device.gatt.connect();
    } else {
      write('unable to connect to device ');
    }
  })
  .then(server => {
    if(server) {
      write('get primary service...');
      return server.getPrimaryService(PULSEOX_SERVICE);
    } else { write('unable to get server'); }
  })
  .then(service => {
    if(service) {
      write('get characteristic...');
      return Promise.all([
        service.getCharacteristic(PULSEOX_CHARACTERISTIC).then(handlePulseOxCharacteristic),
        service.getCharacteristic(BLOODPRESSURE_CHARACTERISTIC).then(handleBloodPressureCharacteristic)
      ]);
    } else { write('unable to get service'); }
  })
  .catch(error => { write(error); });
}

var clear = function() {  document.getElementById('msg').innerHTML = ""; }

var write = function (msg) {
  console.log(msg);
  document.getElementById('msg').innerHTML += msg + "<br/>";
}

function handleBatteryLevelChanged(event) {
  let batteryLevel = event.target.value.getUint8(0);
  write('Battery percentage is ' + batteryLevel + '%');
}

function handleCharacteristicValueChanged(event) {
  var value = event.target.value;
  var textDecoder = new TextDecoder(); // Used to convert bytes to UTF-8 string.
  write('Received ' + textDecoder.decode(value));
}

function writeRawData(value) {
  var textDecoder = new TextDecoder(); // Used to convert bytes to UTF-8 string.
  write('Received ' + textDecoder.decode(value));
}

function onDisconnected(event) {
  let device = event.target;
  write('Device ' + device.name + ' is disconnected.');
}
