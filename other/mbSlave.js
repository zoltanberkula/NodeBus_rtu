const {Default_Modbus_Config} = require("./config.js");
const Serialport = require("serialport");
const Modbus = require("jsmodbus");

const options = {
    baudRate: Default_Modbus_Config.BAUD_RATE,
}

const socket = new Serialport("COM2", options);
const client = new Modbus.client.RTU(socket);

socket.on('connect', function () {
    client.readCoils(0, 13).then(function (resp) {
    console.log(resp);
    }, console.error);
    });

//socket.connect(options)

// const modbus = require('jsmodbus')
// const SerialPort = require('serialport')
// const options = {
//     baudRate: 115200
// }
// const socket = new SerialPort("COM2", options)
// const server = new modbus.server.RTU(socket)

// server.on('connect', function (client) {
//     console.log("in connect")
//     console.log(client);
// });

// server.on('connection', function (client) {
//     console.log("in connection")
//     console.log(client);
// });

// server.on('readHoldingRegisters', function (adr, len) {
//     console.log("in readHoldingRegisters")
//     console.log("adr: " + adr);
//     console.log("len: " + len);
// });


const modbus = require("jsmodbus");
const SerialPort = require("serialport");

const options = {
    baudRate: 9600
}

const socket = new SerialPort("COM1", options);
const server = new modbus.server.RTU(socket);

server.on("connect", function(client){
    console.log(client);
});

server.on("readCoils", function(request, response, send)
{
    console.log("in readCoils");
    response.body.coils[0] = true;
    response.body.coils[1] = false;
    response.body.coils[2] = true;
    response.body.coils[3] = false;
    response.body.coils[4] = true;
    response.body.coils[5] = false;
    response.body.coils[6] = true;
    response.body.coils[7] = false;
    response.body.coils[8] = true;
    response.body.coils[9] = false;

    send(response);
});

server.on("readHoldingRegisters", function(request, response, send)
{
    console.log("in readHoldingRegisters");
    response.body.holdingRegisters[0] = 655;
    response.body.holdingRegisters[1] = 654;
    response.body.holdingRegisters[2] = 653;
    response.body.holdingRegisters[3] = 652;
    response.body.holdingRegisters[4] = 651;
    response.body.holdingRegisters[5] = 650;
    response.body.holdingRegisters[6] = 649;
    response.body.holdingRegisters[7] = 648;
    response.body.holdingRegisters[8] = 647;
    response.body.holdingRegisters[9] = 646;

    send(response);
});

server.on("readInputRegisters", function(request, response, send)
{
    console.log("in readInputRegisters");
    response.body.inputRegisters[0] = 455;
    response.body.inputRegisters[1] = 454;
    response.body.inputRegisters[2] = 453;
    response.body.inputRegisters[3] = 452;
    response.body.inputRegisters[4] = 451;
    response.body.inputRegisters[5] = 450;
    response.body.inputRegisters[6] = 349;
    response.body.inputRegisters[7] = 348;
    response.body.inputRegisters[8] = 347;
    response.body.inputRegisters[9] = 346;

    send(response);
});

const { ModbusSlave } = require("./sandbox/modbusSlaveClass");
const response = require("./sandbox/responses.js");

let holdingRegisters = new Array();

holdingRegisters[0] = 655;
holdingRegisters[1] = 654;
holdingRegisters[2] = 653;
holdingRegisters[3] = 652;
holdingRegisters[4] = 651;
holdingRegisters[5] = 650;
holdingRegisters[6] = 649;
holdingRegisters[7] = 648;
holdingRegisters[8] = 647;
holdingRegisters[9] = 646;

const mbSlave = new ModbusSlave("COM1", 9600, response.acrelRespV, response.frames);
mbSlave.connect();
mbSlave.modbusSend();