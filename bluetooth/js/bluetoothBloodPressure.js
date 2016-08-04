
var BLOODPRESSURE_SERVICE = '00001810-0000-1000-8000-00805f9b34fb';
var BLOODPRESSURE_CHARACTERISTIC = '00002a35-0000-1000-8000-00805f9b34fb';


function handleBloodPressureCharacteristic(characteristic) {
    write('add listener for Blood Pressure characteristic changed...');
    characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    write('read value...');
    //return characteristic.readValue();
    return characteristic.startNotifications();
}
