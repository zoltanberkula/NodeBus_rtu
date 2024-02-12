const parser = require("binary-buffer-parser");
const nio = require("zzz.skein");
// function readInputRegs(slaveID, addr, len) {
//   const fnc = 0x03;
//   createFrame(slaveID, fnc, addr, len);
//   uart.write(q2.receive(), (err) => {
//     err && console.log(err);
//   });
//   const promise = new Promise((resolve, reject) => {
//     event.once("dataReady", (data) => {
//       resolve(data);
//     });
//     setTimeout(() => {
//       reject(new Error("Request timed out"));
//     }, 2000);
//   });
//   return promise;
// }

const sID = 0x01;
const raddr = 0x01;
const rlen = 0x03;

let skein = nio.Skein.allocate(1024);
let buf = nio.Skein.wrap([sID, raddr, rlen]);

console.log(buf.get());
console.log(buf.get());
console.log(buf.get());
//console.log(bufi);

const data = [0x01, 0x03, 0x00, 0x00, 0x00, 0x01, 0x84, 0x0a];
const response = [0x01, 0x03, 0x02, 0x01, 0x0a, 0x39, 0xd3];
const buffer = Buffer.from(response);
//console.log(buffer);

const address = [0x00, 0x01];
const z = [0x00, 0x00];
const pseudoAddr = [...z, ...address];
//console.log(pseudoAddr.slice(-2));

const acrelObj = {
  DCV: 0,
  DCC: 2,
  IntT: 5,
};

// const bufferParser = new parser(buffer);

// console.log(bufferParser.int8());
// console.log(bufferParser.int16());

function bufferParser(buffer) {
  console.log("Incoming buffer:", buffer);
  let dataBytes = buffer.slice(3, 5);
  console.log("sliced:", dataBytes);
  let x = [...new Uint16Array(dataBytes)].map((s) => s.toString(16)).join(""); //refactor to a separate function
  console.log("X", parseInt(x, 16));
  console.log(Buffer.from(dataBytes, "hex"));
  const buffParser = new parser(Buffer.from(x));
  try {
    const parsed = buffParser.int16();
    console.log("Parsed:", parsed);
    return parsed;
  } catch (error) {
    console.log(new Error("parsing error"));
  }
}

//bufferParser(buffer);

//wrapper function implementation
//looping through a given object

// function readAcrelEM(slaveID, obj) {
//   if (!Object.entries(obj)) {
//     console.log("Empty Object!");
//   }
//   for (let [key, value] of Object.entries(obj)) {
//     readHoldingRegs(slaveID, value, 1)
//       .then((data) => bufferParser(data))
//       .catch((err) => console.log(err));
//   }
// }

// readAcrelEM(1, acrelObj);

function solve(addr) {
  if (addr < 0x00ff) {
    console.log("True", addr);
  } else {
    console.log(((addr >> 8) & 0xff, addr & 0xff));
    console.log("False", addr);
  }
}

// solve(0x22ff);
// solve(0x02);

// mqtt.connect();
// setInterval(() => {
//   readData2()
//     .then((storage) => console.log("STR:", storage))
//     .then(() => {
//       mqtt.publish(JSON.stringify(createPyld(), null, 2));
//       console.log(createPyld());
//     })
//     .catch((err) => console.log(err));
// }, 3000);

// const pollObject = {
//   read1: acrelReadHoldingReg(acrelMeasurand, 1),
//   read2: acrelReadHoldingReg(acrelDualMeasurand, 2),
// };
// async function read1(num) {
//   await console.log("PRINT1:", num);
//   acrelReadHoldingReg(acrelMeasurand, 1);
//   return;
// }

// async function read2(num) {
//   await console.log("PRINT2:", num);
//   acrelReadHoldingReg(acrelDualMeasurand, 2);
//   return;
// }

// async function read3(num) {
//   await console.log("PRINT3:", num);
//   return;
// }
// setInterval(() => {
//   async.parallel(
//     [
//       function (callback) {
//         callback(null, "1");
//         read1(1);
//       },
//       function (callback) {
//         callback(null, "2");
//         read2(2);
//       },
//     ],
//     function (err, results) {
//       err && console.log(err);
//       console.log("Results:", results);
//       console.log(createPyld());
//     }
//   );
// }, 3000);
