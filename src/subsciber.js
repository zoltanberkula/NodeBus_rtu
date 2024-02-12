const VirtualModbusDevice = require("./virtualModbusDevice.js");
const VirtualModbusDeviceConfig = require("./virtualModbusDeviceConfig.js");

let SubscriberCounter = 0;

//subscriber instance can subscribe to modbusEmulation
//each subscriber has a paramsObject that contains its specifications
//each subscriber instances includes a device
//the device's specifications come from a config file
//a subscriber can hold only one device
//the subscriber can subscribe forn or unsubscriber from modbus stream transmission
//through the modbusClientProvider Class

let subscriberParams = {
  subName: "subscriber1",
  subID: 1,
  deviceName: "acrel",
  deviceCfg: VirtualModbusDeviceConfig.Acrel_Config,
};

class Subscriber {
  constructor(subscriberParams) {
    this.subscriberParams = subscriberParams;
    this.deviceCfg = subscriberParams.deviceCfg;
    SubscriberCounter++;
  }

  createDevice = () => {}; //creates a virtualModbusDevice
}
