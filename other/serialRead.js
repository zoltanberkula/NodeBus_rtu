const serialport = require("serialport");
const SerialPort = serialport.SerialPort;
const crc = require("modbuscrc");
const { connect } = require("serial-io");
const portName = process.argv[2];
const baudRate = process.argv[3];

const regs = {
  2000: [0x39, 0x40],
  2001: [0x40, 0x41],
  2002: [0x41, 0x42],
  2003: [0x42, 0x43],
  2004: [0x43, 0x44],
  2005: [0x44, 0x45],
  2006: [0x45, 0x46],
  2007: [0x46, 0x47],
  2008: [0x47, 0x48],
};

const coils_data = [];
const contacts_data = [];
const holding_reg_data = [];
const input_reg_data = [];
const single_coil_data = [];
const single_register_data = [];
const register_mask_data = [];
const fifo_queue_data = [];

const fnCodes = {
  READ_COILS: 1,
  READ_CONTACTS: 2,
  READ_HOLDING_REGISTERS: 3,
  READ_INPUT_REGISTERS: 4,
  WRITE_SINGLE_COIL: 5,
  WRITE_SINGLE_REGISTER: 6,
  WRITE_MULTIPLE_REGISTERS: 16,
  WRITE_MASK_REGISTER: 22,
  READ_WRITE_MULTIPLE_REGISTERS: 23,
  READ_FIFO_QUEUE: 24,
};

let slaveDataGlobal = {
  coils: {
    attrID: "coils",
  },
  contacts: {
    attrID: "contacts",
  },
  holding_registers: {
    attrID: "holdingRegisters",
  },
  input_registers: {
    attrID: "inputRegisters",
  },
  single_coils: {
    attrID: "singleCoils",
  },
  single_registers: {
    attrID: "singleRegisters",
  },
  register_masks: {
    attrID: "registerMasks",
  },
  fifo_queue: {
    attrID: "fifoQueue",
  },
};

function onOpen() {
  console.log("Connection established.");
  console.log(`Successfully connected to PORT ${portName}.`);
  console.log("Waiting for data transmission...");
}

function onData(data) {
  console.log("Data received.", data);
  serialDataParser(data);
}

function onClose() {
  console.log("Connection closed.");
  console.log("Port closed.");
}

function portConnect(portName, baudRate) {
  try {
    const myPort = new serialport(portName, {
      baudRate: parseInt(baudRate, 16),
      parser: new serialport.parsers.Readline("\r\n"),
    });
    console.log(`Connecting to PORT ${portName} with ${baudRate} bps`);

    myPort.on("open", onOpen); //onOpen Callback
    myPort.on("data", onData); //onData Callback
    myPort.on("close", onClose); //onClose Callback
    return myPort;
  } catch (error) {
    console.error(
      `[PORT_CONNECT_ERROR] Error during connection to PORT ${portName}`,
      error
    );
  }
}

function createRegisterAttribute(frame, useGlobal) {
  try {
    let attribute;
    if (checkFunctionCode(frame[1]) == fnCodes.READ_COILS) {
      return (attribute = fillRegisters(
        fnCodes.READ_COILS,
        checkWordCount(frame),
        useGlobal
      ));
    } else if (checkFunctionCode(frame[1]) == fnCodes.READ_HOLDING_REGISTERS) {
      return (attribute = fillRegisters(
        fnCodes.READ_HOLDING_REGISTERS,
        checkWordCount(frame),
        useGlobal
      ));
    } else if (checkFunctionCode(frame[1]) == fnCodes.READ_INPUT_REGISTERS) {
      return (attribute = fillRegisters(
        fnCodes.READ_INPUT_REGISTERS,
        checkWordCount(frame),
        useGlobal
      ));
    } else {
      console.log("Function code not yet implemented!");
      return (attribute = NULL);
    }
  } catch (error) {
    console.error(
      "[CREATE_REGISTER_ATTRIBUTE_ERROR] Error during attribute creation.",
      error
    );
  }
}

function fillRegisters(fnc, cnt, useGlobal) {
  try {
    let sData = {
      coils: {
        attrID: "coils",
      },
      contacts: {
        attrID: "contacts",
      },
      holding_registers: {
        attrID: "holdingRegisters",
      },
      input_registers: {
        attrID: "inputRegisters",
      },
      single_coils: {
        attrID: "singleCoils",
      },
      single_registers: {
        attrID: "singleRegisters",
      },
      register_masks: {
        attrID: "registerMasks",
      },
      fifo_queue: {
        attrID: "fifoQueue",
      },
    };

    if (fnc == fnCodes.READ_COILS) {
      for (let i = 0; i <= cnt; i++) {
        useGlobal
          ? (slaveDataGlobal.coils[i] = 100 + i)
          : (sData.coils[i] = 100 + i);
      }
      return sData.coils;
    } else if (fnc == fnCodes.READ_HOLDING_REGISTERS) {
      for (let i = 0; i <= cnt; i++) {
        useGlobal
          ? (slaveDataGlobal.holding_registers[i] = 200 + i)
          : (sData.holding_registers[i] = 200 + i);
      }
      return sData.holding_registers;
    } else if (fnc == fnCodes.READ_INPUT_REGISTERS) {
      for (let i = 0; i <= cnt; i++) {
        useGlobal
          ? (slaveDataGlobal.input_registers[i] = 300 + i)
          : (sData.input_registers[i] = 300 + i);
      }
      return sData.input_registers;
    } else {
      return NULL;
    }
  } catch (error) {
    console.error("[FILL_REGISTERS_ERROR] Error during register fill", error);
  }
}

function checkFunctionCode(fnCode) {
  try {
    let functionCode = 0;
    switch (fnCode) {
      case fnCodes.READ_COILS:
        functionCode = fnCodes.READ_COILS;
        break;
      case fnCodes.READ_CONTACTS:
        functionCode = fnCodes.READ_CONTACTS;
        break;
      case fnCodes.READ_HOLDING_REGISTERS:
        functionCode = fnCodes.READ_HOLDING_REGISTERS;
        break;
      case fnCodes.READ_INPUT_REGISTERS:
        functionCode = fnCodes.READ_INPUT_REGISTERS;
        break;
      case fnCodes.WRITE_SINGLE_COIL:
        functionCode = fnCodes.WRITE_SINGLE_COIL;
        break;
      case fnCodes.WRITE_SINGLE_REGISTER:
        functionCode = fnCodes.WRITE_SINGLE_REGISTER;
        break;
      case fnCodes.WRITE_MASK_REGISTER:
        functionCode = fnCodes.WRITE_MASK_REGISTER;
        break;
      case fnCodes.READ_WRITE_MULTIPLE_REGISTERS:
        functionCode = fnCodes.READ_WRITE_MULTIPLE_REGISTERS;
        break;
      case fnCodes.READ_FIFO_QUEUE:
        functionCode = fnCodes.READ_FIFO_QUEUE;
        break;
      default:
        functionCode = NULL;
        break;
    }
    return functionCode;
  } catch (error) {
    console.error(
      "[CHECK_FUNCTION_CODE_ERROR] Error during function code check",
      error
    );
  }
}

function checkWordCount(frame) {
  try {
    const wordCountHighByteStr = frame[4].toString(16);
    const wordCountLowByteStr = frame[5].toString(16);
    const wordCountHighByte = parseInt(wordCountHighByteStr, 16);
    const wordCountLowByte = parseInt(wordCountLowByteStr, 16);
    return (wordCount = wordCountHighByte + wordCountLowByte);
  } catch (error) {
    console.error(
      "[CHECK_WORD_COUNT_ERROR] error during word count check.",
      error
    );
  }
}

function checkRegStartAddress(frame) {
  try {
    const regStartAddressHighByteStr = frame[2].toString(16);
    const regStartAddressLowByteStr = frame[3].toString(16);
    const regStartAddressHighByte = parseInt(regStartAddressHighByteStr, 16);
    const regStartAddressLowByte = parseInt(regStartAddressLowByteStr, 16);
    return (regStartAddress = regStartAddressHighByte + regStartAddressLowByte);
  } catch (error) {
    console.error(
      "[CHECK_REG_START_ADDRESS] Check register start address error",
      error
    );
  }
}

function getCRC(frame) {
  try {
    let strFrame = frame.toString("HEX");
    let crcStr = strFrame.substring(strFrame.length, strFrame.length - 4);
    let crcHighByteStr = crcStr.substring(0, 2);
    let crcLowByteStr = crcStr.substring(2, 4);
    return {
      crcHighByteStr: crcHighByteStr,
      crcLowByteStr: crcLowByteStr,
    };
  } catch (error) {
    console.error("[GET_CRC_ERROR] Error while getting CRC", error);
  }
}

function verifyCRC(crcHighByteStr, crcLowByteStr, data) {
  try {
    let crcIsValid = false;
    let strFrame = data.toString("HEX");
    let noCrcFrame = strFrame.slice(0, strFrame.length - 4);
    let crcFromLib = crc(noCrcFrame);
    let validCRC = crcFromLib;
    let validCRCSwapped = swapEndian(
      crcFromLib.substring(0, 2),
      crcFromLib.substring(2, 4)
    );
    let actualCRC = crcHighByteStr + crcLowByteStr;
    crcIsValid = actualCRC == validCRC ? true : false;

    return {
      validCRC: validCRC,
      validCRCSwapped: validCRCSwapped,
      actualCRC: actualCRC,
      crcIsValid: crcIsValid,
    };
  } catch (error) {
    console.error(
      "[VERIFY_CRC_ERROR] Error occured while verifying CRC.",
      error
    );
  }
}

function swapEndian(highByteStr, lowByteStr) {
  try {
    let bigEndian = highByteStr;
    let littleEndian = lowByteStr;
    let notSwapped = bigEndian + littleEndian;
    let swapped = littleEndian + bigEndian;
    return swapped;
  } catch (error) {
    console.error("[SWAP_ENDIAN_ERROR] Error during Endian swap", error);
  }
}

function generateResponse(slaveID, fnCode, data) {
  //RTU Framing format RESPONSE: ADDR 8bits, FUNCTION 8bits, DATA Nx8bits
  try {
    let responseRAW = [slaveID, fnCode, ...data];
    let responseHEX = toHEX(slaveID, fnCode, data);
    let crcX = crc(responseHEX);
    let response = [];
    response = [
      ...responseHEX,
      "0x" + crcX.substring(0, 2),
      "0x" + crcX.substring(2, 4),
    ];
    return response;
  } catch (error) {
    console.error(
      "[GENERATE_RESPONSE_ERROR] Error during response creation.",
      error
    );
  }
}

function toHEX(slaveID, fnCode, data) {
  try {
    let args = [slaveID, fnCode, ...data];
    let hexVal = [];
    let indX = 0;
    for (let arg = 0; arg < args.length; arg++) {
      hexVal[indX] = "0x" + args[arg].toString(16);
      indX++;
    }
    return hexVal;
  } catch (error) {
    console.error("[TO_HEX_ERROR] Error during conversion.", error);
  }
}

function sendResponse(respFrame) {
  try {
    console.log("Function @serial_Write invoked");
    portPass.write(respFrame);
    console.log("Response sent.");
  } catch (error) {
    console.error("[SERIAL_WRITE_ERROR] Error during serial write.", error);
  }
}

function serialDataParser(data) {
  //THE ONE WHO HANDLES THE DIRTY JOB
  try {
    let responseData;
    console.log("SLAVE ID:", data[0]);
    console.log("FUNCTION CODE:", checkFunctionCode(data[1]));
    console.log("START ADDRESS:", checkRegStartAddress(data));
    console.log("WORD COUNT:", checkWordCount(data));
    responseData = [...Object.values(createRegisterAttribute(data, 0))].slice(
      0,
      -1
    );
    console.log("DATA TO BE SENT BACK:", responseData);
    let crcData = getCRC(data);
    let crcValidity = verifyCRC(
      crcData.crcHighByteStr,
      crcData.crcLowByteStr,
      data
    );
    console.log("Checking CRC Validity...");
    console.log(`CRC VALID = ${crcValidity.crcIsValid}`);
    console.log("Sending response...");
    console.log(
      "Generated Response:",
      generateResponse(data[0], data[1], responseData)
    );
    sendResponse(generateResponse(data[0], data[1], responseData));
  } catch (error) {
    console.error("[SERIAL_DATA_PARSER_ERROR] Serial data parser error", error);
  }
}

let portPass = portConnect(portName, baudRate);
