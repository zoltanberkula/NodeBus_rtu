const ModbusPort = require("./src/modbusPort.js");
const ModbusClientProvider = require("./src/modbusClientProvider.js");
const ModbusClientPreprocessor = require("./src/modbusClientPreProcessor.js");
const VirtualModbusDevice = require("./src/virtualModbusDevice.js");

const {
  Acrel_Config,
  Lumel_Config,
  Orno_Config,
  Battery_Config,
} = require("./src/virtualModbusDeviceConfig.js");

let acrelParams = {
  name: Acrel_Config.DEVICE_NAME,
  id: Acrel_Config.DEVICE_ID,
  fnc: Acrel_Config.DEVICE_FN_CODE,
  port: Acrel_Config.DEVICE_PORT,
  baud: Acrel_Config.DEVICE_BAUD,
  attr: Acrel_Config.DEVICE_ATTR,
  type: Acrel_Config.DEVICE_TYPE,
};

let lumelParams = {
  name: Lumel_Config.DEVICE_NAME,
  id: Lumel_Config.DEVICE_ID,
  fnc: Lumel_Config.DEVICE_FN_CODE,
  port: Lumel_Config.DEVICE_PORT,
  baud: Lumel_Config.DEVICE_BAUD,
  attr: Lumel_Config.DEVICE_ATTR,
  type: Lumel_Config.DEVICE_TYPE,
};

let ornoParams = {
  name: Orno_Config.DEVICE_NAME,
  id: Orno_Config.DEVICE_ID,
  fnc: Orno_Config.DEVICE_FN_CODE,
  port: Orno_Config.DEVICE_PORT,
  baud: Orno_Config.DEVICE_BAUD,
  attr: Orno_Config.DEVICE_ATTR,
  type: Orno_Config.DEVICE_TYPE,
};

let batteryParams = {
  name: Battery_Config.DEVICE_NAME,
  id: Battery_Config.DEVICE_ID,
  fnc: Battery_Config.DEVICE_FN_CODE,
  port: Battery_Config.DEVICE_PORT,
  baud: Battery_Config.DEVICE_BAUD,
  attr: Battery_Config.DEVICE_ATTR,
  type: Battery_Config.DEVICE_TYPE,
};

const frame = [90, 3, 2002, 69, 77, 99, 211];
const data = [22, 33, 44, 55];

const dcEMD1 = {
  name: "Acrel",
  port: "COM1",
  baud: 9600,
  type: "dcEMD",
};

let mbClientProvider = new ModbusClientProvider();
mbClientProvider.subscribe(dcEMD1);
mbClientProvider.getModbusFrameASYNC();

const preProcessor = new ModbusClientPreprocessor();
console.log(preProcessor.checkSlaveID(frame));
console.log(preProcessor.checkFunctionCode(frame));
console.log(preProcessor.checkStartAddress(frame));
console.log(preProcessor.checkWordCount(frame));
// console.log(preProcessor.getCRC(frame));
// console.log(preProcessor.toHEX(frame[0], frame[1], data));
// console.log(preProcessor.frameParser(frame));

const acrelEMD = new VirtualModbusDevice(acrelParams);
console.log(acrelEMD.deviceName);
acrelEMD.createRegisterAttribute(3, 10);
console.log(acrelEMD.deviceData);
console.log(acrelEMD.deviceResponse);

const lumelEMD = new VirtualModbusDevice(lumelParams);
console.log(lumelEMD.deviceName);
lumelEMD.createRegisterAttribute(3, 10);
console.log(lumelEMD.deviceData);
console.log(lumelEMD.deviceResponse);

const ornoEMD = new VirtualModbusDevice(ornoParams);
console.log(ornoEMD.deviceName);
ornoEMD.createRegisterAttribute(3, 10);
console.log(ornoEMD.deviceData);
console.log(ornoEMD.deviceResponse);

const gsoBMS = new VirtualModbusDevice(batteryParams);
console.log(gsoBMS.deviceName);
gsoBMS.createRegisterAttribute(4, 10);
console.log(gsoBMS.deviceData);
console.log(gsoBMS.deviceResponse);
