const { EventEmitter } = require("events");
const serialport = require("serialport");
const SerialPort = serialport.SerialPort;

let ModbusPortCounter = 0;

module.exports = class ModbusPort {
  constructor(port, baud) {
    this.port = port;
    this.baud = baud;
    this.timeoutMS = 3000;
    this.myPort;
    this.poppedFrame;
    this.modbusPortEvEmitter = new EventEmitter();
    this.modbusPortEvEmitter.on("poppedFrameDone", this.onPoppedFrameDone);
    ModbusPortCounter++;
  }

  onOpen = () => {
    console.log("Connection established.");
    console.log(`Successfully connected to PORT ${this.port}`);
    console.log("Waiting for data transmission...");
  };

  onData = (data) => {
    console.log("Data received.", data);
    this.modbusPortEvEmitter.emit("poppedFrameDone");
    this.onPoppedFrameDone(data);
  };

  onClose = () => {
    console.log("Connection closed.");
    console.log("Port closed.");
  };

  onPoppedFrameDone = (data) => {
    console.log("[POPPED_FRAME_CB] POPPED FRAME DONE", data);
  };

  createPort = () => {
    try {
      this.myPort = new serialport(this.port, {
        baudRate: this.baud,
        parser: new serialport.parsers.Readline("\r\n"),
      });
      console.log(`Connecting to PORT ${this.port} with ${this.baud} bps.`);
      this.myPort.on("open", this.onOpen);
      this.myPort.on("data", this.onData);
      this.myPort.on("close", this.onClose);
    } catch (error) {
      console.error(
        `[PORT_CONNECT_ERROR] Error during connection to PORT ${this.port}`,
        error
      );
    }
  };

  closePort = () => {
    this.myPort.close(this.onClose);
  };

  popFrame = (data) => {
    console.log("POP FRAME INVOKED", this.poppedFrame);
    this.poppedFrame = data;
    return this.poppedFrame;
  };

  popFrameASYNC = () => {
    const popFramePromise = new Promise((resolve, reject) => {
      this.modbusPortEvEmitter.on("poppedFrameDone", (data) => {
        resolve(data);
      });
      setTimeout(() => {
        reject(
          new Error(
            `ModbusPort request on PORT ${this.port} timed out after ${this.timeoutMS} miliseconds.`
          )
          //this.myPort.close()
        );
      }, this.timeoutMS);
    });
    return popFramePromise;
  };

  writePort = (mbResponse) => {
    try {
      console.log("Function @write_port invoked.");
      this.myPort.write(mbResponse);
      console.log(`Response: ${mbResponse} has been sent.`);
    } catch (error) {
      console.error(
        `[WRITE_PORT_ERROR] Error writing data to port ${this.port}`,
        error
      );
    }
  };
};

// let myModbusPort1 = new ModbusPort("COM1", 9600);
// myModbusPort1.createPort();

// let myModbusPort2 = new ModbusPort("COM2", 9600);
// myModbusPort2.createPort();

// let myModbusPort3 = new ModbusPort("COM3", 9600);
// myModbusPort3.createPort();

// let myModbusPort4 = new ModbusPort("COM4", 9600);
// myModbusPort4.createPort();
