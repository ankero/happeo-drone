const Verisure = require("verisure");

const { USERNAME, PASSWORD } =
  process.env.ENV === "production"
    ? process.env
    : require("./.secrets/secrets.json");

const AVAILABLE_STATES = ["OFF", "ON"];

const DEVICE_MAP = require("./deviceMap.json");
const VALID_UNTIL_MINUTES = 15;

console.log(`Initialising connection with: ${USERNAME} and ${PASSWORD}`);

const connection = new Verisure(USERNAME, PASSWORD);
let installation = null;
let validUntil = null;

async function getMyVerisure() {
  try {
    if (installation && validUntil < Date.now()) return installation;

    await connection.getToken();
    const installations = await connection.getInstallations();
    installation = installations[0];
    validUntil = Date.now() + VALID_UNTIL_MINUTES * 60000;
    return installation;
  } catch (error) {
    throw error;
  }
}

async function getOverview() {
  try {
    const myVerisure = await getMyVerisure();
    const overview = await myVerisure.getOverview();
    return overview;
  } catch (error) {
    throw error;
  }
}

async function getDevice(device) {
  if (!DEVICE_MAP[device]) throw new Error("INVALID_DEVICE");

  try {
    const overview = await getOverview();
    const foundDevice = overview[DEVICE_MAP[device].type].find(
      d => (d.deviceLabel = DEVICE_MAP[device].deviceLabel)
    );
    return foundDevice;
  } catch (error) {
    throw error;
  }
}

async function updateDeviceState(device, state) {
  try {
    if (!AVAILABLE_STATES.includes(state)) throw new Error("INVALID_STATE");

    const deviceToUpdate = await getDevice(device);
    if (!deviceToUpdate) throw new Error("MISSING_DEVICE");
    if (deviceToUpdate.pendingState !== "NONE") throw new Error("DEVICE_BUSY");

    const options = {
      url: "smartplug/state",
      method: "post",
      data: [
        {
          deviceLabel: deviceToUpdate.deviceLabel,
          state: state === "ON"
        }
      ]
    };

    const myVerisure = await getMyVerisure();

    await myVerisure.client(options);

    const updatedDeviceState = await getDevice(device);

    return updatedDeviceState;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getOverview,
  getDevice,
  updateDeviceState
};
