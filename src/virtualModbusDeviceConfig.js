module.exports = virtualModbusDeviceConfig = {
  Acrel_Config: {
    DEVICE_NAME: "Acrel",
    DEVICE_ID: 0x01,
    DEVICE_FN_CODE: 0x03,
    DEVICE_PORT: "COM1",
    DEVICE_BAUD: 9600,
    DEVICE_ATTR: "holdingRegisters",
    DEVICE_TYPE: "dcEMD",
  },

  Lumel_Config: {
    DEVICE_NAME: "Lumel",
    DEVICE_ID: 0x02,
    DEVICE_FN_CODE: 0x03,
    DEVICE_PORT: "COM1",
    DEVICE_BAUD: 9600,
    DEVICE_ATTR: "holdingRegisters",
    DEVICE_TYPE: "acEMD",
  },

  Orno_Config: {
    DEVICE_NAME: "Orno",
    DEVICE_ID: 0x03,
    DEVICE_FN_CODE: 0x03,
    DEVICE_PORT: "COM1",
    DEVICE_BAUD: 9600,
    DEVICE_ATTR: "holdingRegisters",
    DEVICE_TYPE: "acEMD",
  },

  Battery_Config: {
    DEVICE_NAME: "GSO_battery",
    DEVICE_ID: 0x03,
    DEVICE_FN_CODE: 0x04,
    DEVICE_PORT: "COM1",
    DEVICE_BAUD: 9600,
    DEVICE_ATTR: "inputRegisters",
    DEVICE_TYPE: "batteryUnit",
  },
};
