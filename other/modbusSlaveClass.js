let SerialPort = require("serialport");
let crc = require("modbuscrc");
let responses = require("./responses.js");
const response = require("./responses.js");
const { frames } = require("./responses.js");

/**
 * @description Modbus Slave Singleton Class
 */
class ModbusSlave {
  /**
   * @param {string} serialPort Serialport to connect to
   * @param {number} baudRate   Baudrate
   * @param {object} regs Desired reg addresses
   * @returns
   */
  constructor(serialPort, baudRate, regs, frame) {
    this.serialPort = serialPort;
    this.baudRate = baudRate;
    this.regs = regs;
    this.frame = frame;
    let _serial = this;
    console.log("CONSTRUCTOR REGS:", this.regs);
    console.log("CONSTRUCTOR FRAMES:", this.frame);
  }

  /**
   * @description Method that opens the desired Serialport
   */
  connect() {
    this._serial = new SerialPort(this.serialPort, {
      baudRate: this.baudRate,
      parser: new SerialPort.parsers.Readline("\n"),
    });
  }

  /**
   * @description Method that applies a crc algorithm on the passed in frame
   * @param {number} frame
   * @returns frame with cyclic redundancy check
   */
  cyclicRC(frame) {
    console.log("Function @cyclicRC invoked");
    console.log(frame);
    crcframe = crc(frame);
    let s1 = crcframe.substring(0, 2);
    let s2 = crcframe.substring(2, crcframe.length);
    let checksum = [parseInt(s1, 16), parseInt("0x" + s2)];
    return checksum;
  }

  /**
   * @param {number} frame
   * @description Method that concatenates and writes the frame to the Serialport
   */
  serialWrite(frame) {
    console.log("Function @serial_Write invoked");
    console.log(this.frame);
    this._serial.write([...frame].concat(this.cyclicRC(frame)));
  }

  /**
   * @description Method that parses the reg address from the frame received, and sends back a given answer
   */
  modbusSend() {
    try {
      let buffer;
      this._serial.on("open", () => {
        console.log(`Serial Port Opened! Listening on PORT ${this.serialPort}`);
        this._serial.on("data", function (data) {
          let reg_address = parseInt(
            "0x" + data[2].toString(16) + data[3].toString(16)
          );
          console.log("REG ADDRESS:", reg_address);
          if (responses.resps.hasOwnProperty(this.regs)) {
            buffer = responses.frames.frame1.concat(response.resps[this.regs]);
            console.log("BUFFER:", this.buffer);
          }
          console.log("BUFFER:", this.buffer);
          serialWrite(this.buffer);
        });
      });
    } catch (error) {
      console.error("Modbus Send Error!");
    }
  }
}

module.exports = {
  ModbusSlave,
};
