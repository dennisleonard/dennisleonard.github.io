
var BLOODPRESSURE_SERVICE = '00001810-0000-1000-8000-00805f9b34fb';
var BLOODPRESSURE_CHARACTERISTIC = '00002a35-0000-1000-8000-00805f9b34fb';

function handleBloodPressureService(service) {
  return service.getCharacteristic(BLOODPRESSURE_CHARACTERISTIC)
  .then(handleBloodPressureCharacteristic)
  .catch(error => { write('handleBloodPressureService: ' + error); })
}

function handleBloodPressureCharacteristic(characteristic) {
    write('add listener for Blood Pressure characteristic changed...');
    characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    write('read value...');
    //return characteristic.readValue();
    return characteristic.startNotifications();
}

function handleCharacteristicValueChanged(event) {
  var value = event.target.value;
  var textDecoder = new TextDecoder(); // Used to convert bytes to UTF-8 string.
  write('Received ' + textDecoder.decode(value));
}
