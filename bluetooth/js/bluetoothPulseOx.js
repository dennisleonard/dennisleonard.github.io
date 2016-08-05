
var PULSEOX_SERVICE = '46a970e0-0d5f-11e2-8b5e-0002a5d5c51b';
var PULSEOX_CHARACTERISTIC = '0aad7ea0-0d60-11e2-8e3c-0002a5d5c51b';

function handlePulseOxService(service) {
  return service.getCharacteristic(PULSEOX_CHARACTERISTIC).then(handlePulseOxCharacteristic);
}

function handlePulseOxCharacteristic(characteristic) {
    log('add listener for PulseOx characteristic changed...');
    characteristic.addEventListener('characteristicvaluechanged', onPulseOxValueChanged);
    log('read value...');
    //return characteristic.readValue();
    return characteristic.startNotifications();
}

function onPulseOxValueChanged(event) {
  var value = event.target.value;
  try {
    log('byte length: ' + value.byteLength);
    var sp02 = value.getUint8(7);
    var msb = value.getUint8(8);//((value[8] & 0xff) << 8) & 0xffffffff;
    var lsb = value.getUint8(9);//(value[9] & 0xff) & 0xffffffff;
    var pulseRate = msb | lsb;
    clear();
    write('Oxygen: ' + sp02 + '% ' + 'Heart Rate: ' + pulseRate);
  } catch (err) {
    write(err.message);
  }
}
