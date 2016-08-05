


var requestDevice = function() {
  clear();
  write("start connection...");

  if (navigator.bluetooth) {
    startRequest();
  } else {
    write("bluetooth not supported");
  }
}

var startRequest = function() {
  navigator.bluetooth.requestDevice({
    filters: [
      { services: [PULSEOX_SERVICE] },
      { services: [BLOODPRESSURE_SERVICE] }
    ]
  })
  .then(device => {
    if(device) {
      clear();
      write('connecting to ' + device.name);
      device.addEventListener('gattserverdisconnected', onDisconnected);
      log('> Allowed Services: ' + device.uuids.join('<br/>' + ' '.repeat(20)));
      return device.gatt.connect();
    } else {
      write('unable to connect to device ');
    }
  })
  .then(server => {
    if(server) {
      log('get primary service...');
      return Promise.all([
        server.getPrimaryService(PULSEOX_SERVICE).then(handlePulseOxService),
        server.getPrimaryService(BLOODPRESSURE_SERVICE).then(handleBloodPressureCharacteristic)
    ]);
    } else { write('unable to get server'); }
  })
  .catch(error => { write('startRequest:' + error); });
};

function clear() {  document.getElementById('msg').innerHTML = ""; }

var write = function (msg) {
  console.log(msg);
  document.getElementById('msg').innerHTML += msg + "<br/>";
};

function log(msg) {
  console.log(msg);
}

function handleBatteryLevelChanged(event) {
  let batteryLevel = event.target.value.getUint8(0);
  write('Battery percentage is ' + batteryLevel + '%');
}

function writeRawData(value) {
  var textDecoder = new TextDecoder(); 
  write('Received ' + textDecoder.decode(value));
}

function onDisconnected(event) {
  let device = event.target;
  clear();
  log('Device ' + device.name + ' is disconnected.');
}
