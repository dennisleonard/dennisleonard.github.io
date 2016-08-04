

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
      services: ['46a970e0-0d5f-11e2-8b5e-0002a5d5c51b']
    }]
  })
  .then(device => {
    if(device) {
      write('connecting to ' + device.name);
      device.addEventListener('gattserverdisconnected', onDisconnected);
      device.gatt.connect();
    } else {
      write('unable to connect to device ');
    }
  })
  .then(server => {
    return server.getPrimaryService('46a970e0-0d5f-11e2-8b5e-0002a5d5c51b');
  })
  .then(service => {
    return service.getCharacteristic('0aad7ea0-0d60-11e2-8e3c-0002a5d5c51b');
  })
  .then(characteristic => {
    characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    return characteristic.readValue();
  })
  .then(value => {
    write('readValue returned: ' + value);
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

function onDisconnected(event) {
  let device = event.target;
  write('Device ' + device.name + ' is disconnected.');
}
