const { slave_Units } = require("../../config.js");
const { acrelDCV } = require("../../regAddress.js");
let SerialPort = require("serialport");
let crc = require("modbuscrc");
const mbFrameParser = require("binary-buffer-parser");
const EventEmitter = require("events");
const internal = require("stream");
const { isObject } = require("util");
const { type } = require("os");

const port = "COM2";

/**
 * @description serial port options
 */
const serialOpts = {
  autoOpen: true,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
};

let uart = new SerialPort(port, serialOpts);

const event = new EventEmitter();

/**
 * @description byte arrays without CRC
 */
const chunks = {
  chunk1: [0x01, 0x03, 0x00, 0x01, 0x04], //read holding register slave 1
  chunk2: [0x02, 0x03, 0x00, 0x02, 0x04], //read holding register slave 2
};

let mbFrames = []; //an array containing the mbframes(byte array) appended with crc (output of createFrame method)

/**
 * @description queue class used to create queue instances
 */
class Queue {
  constructor() {
    this.q = [];
  }
  send(item) {
    this.q.push(item);
  }
  receive() {
    return this.q.shift();
  }
  check() {
    console.log("Queue contains:", this.q);
  }
}

const q1 = new Queue();
const q2 = new Queue();

/**
 *
 * @param {byte array} chunk
 * @returns byte array appended with CRC bytes
 */
function createCRC(chunk) {
  try {
    packet = crc(chunk);
    let s1 = packet.substring(0, 2);
    let s2 = packet.substring(2, packet.length);
    let checksum = [parseInt(s1, 16), parseInt(s2, 16)];
    return checksum;
  } catch (error) {
    console.log(new Error("Error during CRC creation."));
  }
}

/**
 * @description Event Emitter fires a "dataReady" event when data is available on serial port
 */
uart.on("data", (data) => {
  event.emit("dataReady", data);
});

/**
 *
 * @param {number} slaveID Address of the Slave Unit
 * @param {number/default} funcCode Modbus Function Code passed by readHolding/readInput fncts
 * @param {number} addr Starting address
 * @param {number} len Word count
 * @description frameBuffer is pushed into the queue on each call
 */
function createFrame(slaveID, funcCode, addr, len) {
  console.log(arguments);
  try {
    let chunk = [...arguments];
    let frame = [...chunk, ...createCRC(chunk)];
    mbFrames.push(frame);
    let frameBuffer = Buffer.from(frame);
    console.log("Framebuffer:", frameBuffer);
    if (funcCode === 3) {
      q1.send(frameBuffer);
    } else {
      q2.send(frameBuffer);
    }
  } catch (error) {
    console.log(new Error("Error during frame creation.", error));
  }
}

/**
 *
 * @param {number} slaveID
 * @param {number} addr
 * @param {number} len
 * @returns Promise on fullfillment data => parsed
 * @returns Promise on rejection err => CLI Error
 * @description a function for reading Holding Registers according to fnc 0x03
 */
function readHoldingRegs(slaveID, addr, len) {
  console.log("Reading holding registers...");
  const fnc = 0x03;
  if (addr < 0x00ff) {
    createFrame(slaveID, fnc, addr, len);
  } else if (((addr >> 8) & 0xff, addr & 0xff)) {
    createFrame(slaveID, fnc, addr, len);
  }
  uart.write(q1.receive(), (err) => {
    err && console.log(err);
  });
  const promise = new Promise((resolve, reject) => {
    event.once("dataReady", (data) => {
      resolve(data);
    });
    setTimeout(() => {
      reject(new Error("Request timed out."));
    }, 5000);
  });
  return promise;
}

/**
 *
 * @param {number} slaveID
 * @param {number} addr
 * @param {number} len
 * @returns Promise on fullfillment data => parsed
 * @returns Promise on rejection err => CLI Error
 * @description a function for reading Input Registers according to fnc 0x04
 */
function readInputRegs(slaveID, addr, len) {
  const fnc = 0x04;
  createFrame(slaveID, fnc, addr, len);
  uart.write(q2.receive(), (err) => {
    err && console.log(err);
  });
  const promise = new Promise((resolve, reject) => {
    event.once("dataReady", (data) => {
      resolve(data);
    });
    setTimeout(() => {
      reject(new Error("Request timed out."));
    }, 2000);
  });
  return promise;
}

function bufferParser(buffer) {
  console.log("Incoming buffer:", buffer);
  try {
    const dataBytes = buffer.slice(2, buffer.length - 2);
    console.log("Sliced:", dataBytes);
    const rawData = [...new Uint8Array(dataBytes)]
      .map((s) => s.toString(16))
      .join("");
    const regVal = parseInt(rawData, 16);
    console.log("RegVal:", regVal);
    // const parser = new mbFrameParser(regVal);
    // const parsedVal = parser.int16();
    // console.log("Parsed:", parsedVal);
    // return parsedVal;
  } catch (err) {
    console.log(new Error("Parsing error!", err));
  }
}

const slaveID = 0x01;
const addr = [0x00, 0x02];
const len = [0x00, 0x02];

const z = [0x00, 0x00];
const pseu = [...z, ...addr];
const freps = pseu.slice(-2).join("");
console.log("Freps:", +freps);

// const acrel = {
//   id: slave_Units.Acrel_Config.ACREL_ADDRESS,
//   addr: acrelDCV.DcVoltageValue,
//   len: 3,
// };

const acrelID = 0x02;
const acrelAddr = 0x0002;
const acrelLen = 0x06;

const gsoID = 0x03;
const gsoAddr = 0x0003;
const gsoLen = 0x08;

// readHoldingRegs(slaveID, addr, len)
//   .then((data) => console.log("DATA:", data))
//   .catch((err) => console.log(err));

readHoldingRegs(slaveID, addr, len)
  .then((data) => bufferParser(data))
  .catch((err) => console.log(err));
