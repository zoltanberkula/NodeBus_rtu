const ModbusClientPreprocessor = require("./modbusClientPreProcessor.js");
const ModbusClientProvider = require("./modbusClientProvider.js");
const virtualModbusDeviceConfig = require("./virtualModbusDeviceConfig.js");

let virtualModbusDeviceCounter = 0;

module.exports = class VirtualModbusDevice extends ModbusClientPreprocessor {
  constructor(virtualDeviceParams) {
    super();
    this.virtualDeviceParams = virtualDeviceParams;
    this.deviceName = virtualDeviceParams.name;
    this.deviceData;
    this.deviceResponse;
    virtualModbusDeviceCounter++;
  }

  #createDeviceData = () => {
    try {
      this.deviceData = {
        attrID: this.virtualDeviceParams.attr,
      };
    } catch (error) {
      console.error("[CREATE_DEVICE_DATA] Error during data creation.", error);
    }
  };

  #fillDeviceData = (wcnt, dataSource) => {
    try {
      for (let i = 0; i <= wcnt; i++) {
        dataSource
          ? (this.deviceData[i] = Object.values(dataSource[i]))
          : (this.deviceData[i] = Math.floor(Math.random() * 1000));
      }
    } catch (error) {
      console.error(
        "[FILL_DEVICE_DATA_ERROR] Error during deviceData fill.",
        error
      );
    }
  };

  #createDataResponse = (deviceData) => {
    try {
      this.deviceResponse = [
        this.virtualDeviceParams.id,
        this.virtualDeviceParams.fnc,
        ...Object.values(deviceData).slice(0, -1),
      ];
    } catch (error) {
      console.error(
        "[CREATE_DATA_RESPONSE_ERROR] Error during response creation.",
        error
      );
    }
  };

  createRegisterAttribute = (fnc, wcnt, dataSource) => {
    try {
      this.#createDeviceData();
      if (fnc == this.virtualDeviceParams.fnc) {
        this.#fillDeviceData(wcnt, dataSource);
        this.#createDataResponse(this.deviceData);
      } else {
        console.log("Function code not suitable for this device.");
      }
    } catch (error) {
      console.error(
        "[CREATE_REGISTER_ATTRIBUTE_ERROR] Error during attribute creation.",
        error
      );
    }
  };
};
