
var PULSEOX_SERVICE = '46a970e0-0d5f-11e2-8b5e-0002a5d5c51b';
var PULSEOX_CHARACTERISTIC = '0aad7ea0-0d60-11e2-8e3c-0002a5d5c51b';

function handlePulseOxService(service) {
  return service.getCharacteristic(PULSEOX_CHARACTERISTIC).then(handlePulseOxCharacteristic);
}

function handlePulseOxCharacteristic(characteristic) {
    write('add listener for PulseOx characteristic changed...');
    characteristic.addEventListener('characteristicvaluechanged', onPulseOxValueChanged);
    write('read value...');
    //return characteristic.readValue();
    return characteristic.startNotifications();
}

function onPulseOxValueChanged(event) {
    var value = event.target.value;
    var textDecoder = new TextDecoder(); // Used to convert bytes to UTF-8 string.
    write('Received ' + textDecoder.decode(value));
  try {
    var sp02 = value[7];
    var msb = ((value[8] & 0xff) << 8) & 0xffffffff;
    var lsb = (value[9] & 0xff) & 0xffffffff;
    var pulseRate = msb | lsb;
    clear();
    write(sp02 + ' ' + pulseRate);
  } catch (err) {
    write(err);
    write(err.message);
  }
}
