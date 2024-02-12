const ModbusPort = require("./modbusPort.js");
import("lodash");

let ModbusClientProviderCounter = 0;

module.exports = class ModbusClientProvider {
  constructor() {
    this.mbPort;
    this.incomingFrame;
    this.subCntr = 0;
    this.subscribers = [];
    ModbusClientProviderCounter++;
  }

  attachPort = (subscriber) => {
    console.log(
      `Port ${subscriber.port} has been attached to device ${subscriber.name}.`
    );
    this.mbPort = new ModbusPort(subscriber.port, subscriber.baud);
    this.mbPort.createPort();
  };

  detachPort = (subscriber) => {
    console.log(`Port ${subscriber.port} has been detached from device.`);
    this.mbPort.closePort();
  };

  subscribe = (subscriber) => {
    this.subCntr++;
    this.subscribers[this.subCntr] = subscriber;
    console.log(`Device ${subscriber.name} successfully subscribed.`);
    this.attachPort(subscriber);
    return subscriber;
  };

  unsubscribe = (subscriber) => {
    for (let i = 0; i < this.subscribers.length; i++) {
      if (this.subscribers[i].id == subscriber.id) {
        this.subscribers.splice(i, 1);
        break;
      }
    }
    console.log(`Device ${subscriber.name} successfully unsubscribed.`);
    this.detachPort(subscriber);
    this.subCntr--;
  };

  #getModbusFrame = (frame) => {
    let modbusFrame = this.mbPort.popFrame();
    console.log("[GET_MODBUS_FRAME]", modbusFrame);
    console.log("[POPPED FRAME]", this.mbPort.poppedFrame);
    return modbusFrame;
  };

  getModbusFrameASYNC = () => {
    console.log("GET MODBUS FRAME ASYNC INVOKED");
    let modbusFrame = this.mbPort
      .popFrameASYNC()
      .then((data) => console.log(data))
      .then((data) => this.#forwardFrame(data))
      .catch((err) => console.log(err));
  };

  #forwardFrame = (frame) => {
    console.log("[FORWARD_FRAME] INVOKED");
    this.incomingFrame = frame;
    return frame;
  };

  getSubscribers = () => {
    return this.subscribers;
  };
};
