const Gpio = require("onoff").Gpio;
const { GPIO_Config } = require("../../config.js");

const K1 = new Gpio(GPIO_Config.CONTACTOR1_PIN, "out");
const K2 = new Gpio(GPIO_Config.CONTACTOR2_PIN, "out");
const K3 = new Gpio(GPIO_Config.CONTACTOR3_PIN, "out");
const K4 = new Gpio(GPIO_Config.CONTACTOR4_PIN, "out");

/**
 * @param {number} contactor Number of contactorpin to lock
 * @description A function for contactor control ON
 */
function contactorOn(contactor) {
  console.log(contactor._gpio);
  switch (contactor._gpio) {
    case GPIO_Config.CONTACTOR1_PIN:
      console.log("K1 LOCKED!");
      K1.writeSync(K1.readSync() ^ 1);
      break;
    case GPIO_Config.CONTACTOR2_PIN:
      console.log("K2 LOCKED!");
      K2.writeSync(K2.readSync() ^ 1);
      break;
    case GPIO_Config.CONTACTOR3_PIN:
      console.log("K3 LOCKED!");
      K3.writeSync(K4.readSync() ^ 1);
      break;
    case GPIO_Config.CONTACTOR4_PIN:
      console.log("K4 LOCKED!");
      K4.writeSync(K4.readSync() ^ 1);
      break;
    default:
      K1.writeSync(0);
      K2.writeSync(0);
      K3.writeSync(0);
      K4.writeSync(0);
      break;
  }
}

/**
 * @param {number} contactor Number of contactorpin to dislock
 * @description A function for contactor control OFF
 */
function contactorOff(contactor) {
  switch (contactor._gpio) {
    case 5:
      console.log("K1 DISLOCKED!");
      K1.writeSync(K1.readSync() ^ 1);
      break;
    case 6:
      console.log("K2 DISLOCKED!");
      K2.writeSync(K2.readSync() ^ 1);
      break;
    case 17:
      console.log("K3 DISLOCKED!");
      K3.writeSync(K3.readSync() ^ 1);
      break;
    case 27:
      console.log("K4 DISLOCKED!");
      K4.writeSync(K4.readSync() ^ 1);
      break;
    default:
      K1.writeSync(0);
      K2.writeSync(0);
      K3.writeSync(0);
      K4.writeSync(0);
      break;
  }
}

module.exports = {
  contactorOn: contactorOn,
  contactorOff: contactorOff,
};
