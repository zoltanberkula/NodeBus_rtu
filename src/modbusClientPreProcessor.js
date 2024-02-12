const crc = require("modbuscrc");

let ModbusClientPreProcessorCounter = 0;

module.exports = class ModbusClientPreprocessor {
  constructor() {
    this.fnCodes = {
      READ_COILS: 0x01,
      READ_CONTACTS: 0x02,
      READ_HOLDING_REGISTERS: 0x03,
      READ_INPUT_REGISTERS: 0x04,
      WRITE_SINGLE_COIL: 0x05,
      WRITE_SINGLE_REGISTER: 0x06,
      WRITE_MULTIPLE_REGISTERS: 0x16,
      WRITE_MASK_REGISTER: 0x22,
      READ_WRITE_MULTIPLE_REGISTERS: 0x23,
      READ_FIFO_QUEUE: 0x24,
    };
    //this.rawMbResponse = [];
    this.hexMbResponse = {};
    this.subFrame;
    ModbusClientPreProcessorCounter++;
  }

  checkSlaveID = (frame) => {
    return frame[0];
  };

  checkFunctionCode = (frame) => {
    try {
      let functionCode = 0;
      switch (frame[1]) {
        case this.fnCodes.READ_COILS:
          functionCode = this.fnCodes.READ_COILS;
          break;
        case this.fnCodes.READ_CONTACTS:
          functionCode = this.fnCodes.READ_CONTACTS;
          break;
        case this.fnCodes.READ_HOLDING_REGISTERS:
          functionCode = this.fnCodes.READ_HOLDING_REGISTERS;
          break;
        case this.fnCodes.READ_INPUT_REGISTERS:
          functionCode = this.fnCodes.READ_INPUT_REGISTERS;
          break;
        case this.fnCodes.WRITE_SINGLE_COIL:
          functionCode = this.fnCodes.WRITE_SINGLE_COIL;
          break;
        case this.fnCodes.WRITE_SINGLE_REGISTER:
          functionCode = this.fnCodes.WRITE_SINGLE_REGISTER;
          break;
        case this.fnCodes.WRITE_MASK_REGISTER:
          functionCode = this.fnCodes.WRITE_MASK_REGISTER;
          break;
        case this.fnCodes.READ_WRITE_MULTIPLE_REGISTERS:
          functionCode = this.fnCodes.READ_WRITE_MULTIPLE_REGISTERS;
          break;
        case this.fnCodes.READ_FIFO_QUEUE:
          functionCode = this.fnCodes.READ_FIFO_QUEUE;
          break;
        default:
          functionCode = null;
          break;
      }
      return functionCode;
    } catch (error) {
      console.error(
        "[CHECK_FUNCTION_CODE_ERROR] Error during function code check",
        error
      );
    }
  };

  checkStartAddress = (frame) => {
    try {
      let regStartAddress = 0;
      const regStartAddressHighByteStr = frame[2].toString(16);
      const regStartAddressLowByteStr = frame[3].toString(16);
      const regStartAddressHighByte = parseInt(regStartAddressHighByteStr, 16);
      const regStartAddressLowByte = parseInt(regStartAddressLowByteStr, 16);
      return (regStartAddress =
        regStartAddressHighByte + regStartAddressLowByte);
    } catch (error) {
      console.error(
        "[CHECK_REG_START_ADDRESS] Check register start address error",
        error
      );
    }
  };

  checkWordCount = (frame) => {
    try {
      let wordCount = 0;
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
  };

  getCRC = (frame) => {
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
  };

  verifyCRC = (frame) => {
    try {
      let crcHighByteStr = frame[frame.length];
      let crcLowByteStr = frame[frame.length - 1];
      let crcIsValid = false;
      let strFrame = frame.toString("HEX");
      let noCrcFrame = strFrame.slice(0, strFrame.length - 4);
      let crcFromLib = crc(noCrcFrame);
      let validCRC = crcFromLib;
      let validCRCSwapped = this.#swapEndian(
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
  };

  #swapEndian = (highByteStr, lowByteStr) => {
    try {
      let bigEndian = highByteStr;
      let littleEndian = lowByteStr;
      let notSwapped = bigEndian + littleEndian;
      let swapped = littleEndian + bigEndian;
      return swapped;
    } catch (error) {
      console.error("[SWAP_ENDIAN_ERROR] Error during Endian swap", error);
    }
  };

  #toHEX = (slaveID, fnCode, data) => {
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
  };

  frameParser = (data) => {
    try {
      // console.log("SLAVE ID:", this.checkSlaveID(data));
      // console.log("FUNCTION CODE:", this.checkFunctionCode(data));
      // console.log("START ADDRESS:", this.checkStartAddress(data));
      // console.log("WORD COUNT:", this.checkWordCount(data));
      // let crcData = this.getCRC(data);
      // let crcValidity = this.verifyCRC(
      //   crcData.crcHighByteStr,
      //   crcData.crcLowByteStr,
      //   data
      // );
      // console.log("Checking CRC Validity...");
      // console.log(`CRC VALID = ${crcValidity.crcIsValid}`);
      this.frameForwarder(data, subscriber.id);
    } catch (error) {
      console.error(
        "[SERIAL_DATA_PARSER_ERROR] Serial data parser error",
        error
      );
    }
  };

  //argument = this.deviceResponse from virtualDevice Class RAW FRAME
  createHexResponse = (rawMbResponse) => {
    try {
      let indx = 0;
      for (let byteIndx = 0; byteIndx < rawMbResponse.length; byteIndx++) {
        this.hexMbResponse[indx] = "0x" + rawMbResponse[byteIndx].toString(16);
        indx++;
      }
    } catch (error) {
      console.error(
        "[CREATE_HEX_RESPONSE_ERROR] Error while creating hex response.",
        error
      );
    }
  };

  popFrame = (subscriber, data) => {
    this.subFrame = data;
    console.log(subscriber.id);
  };

  frameForwarder = (data) => {
    try {
      console.log("[MODBUS_FRAME_ROUTER] INVOKED");
      console.log(data);
      if (data[0] == subscriber.id) {
        this.popFrame(subscriber, data);
      }
    } catch (error) {
      console.error(
        "[FRAME_FORWARDER_ERROR] Error during frame forwarding.",
        error
      );
    }
  };
};
