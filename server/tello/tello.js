// Copied from https://github.com/wesbos/javascript-drones
// Thanks wesbos for making this available

// As you can see from the code, this is slapped together quite fast
// If you want to make this really working I recommend re-writing this :)
// - Antero

const dgram = require("dgram");
const wait = require("waait");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const throttle = require("lodash/throttle");
const commandDelays = require("./constants");

const PORT = 8889;
const HOST = "192.168.10.1";
const drone = dgram.createSocket("udp4");
drone.bind(PORT);

function parseState(state) {
  return state
    .split(";")
    .map(x => x.split(":"))
    .reduce((data, [key, value]) => {
      data[key] = value;
      return data;
    }, {});
}

const droneState = dgram.createSocket("udp4");
droneState.bind(8890);

drone.on("message", message => {
  console.log(`🤖 : ${message}`);
  io.sockets.emit("status", message.toString());
});

function callback(error) {
  if (error) {
    console.error(error);
  }
}

async function flyDrone() {
  const commands = [
    "command",
    "battery?",
    // "speed?",
    // "time?",
    "takeoff",
    "forward 20",
    "land"
    // "left",
  ];

  let i = 0;
  async function runCommands() {
    const command = commands[i];
    const delay = commandDelays[command].split(" ")[0];
    console.log(`running command: ${command}`);
    drone.send(command, 0, command.length, PORT, HOST, callback);
    await wait(delay);
    i += 1;
    if (i < commands.length) {
      return runCommands();
    }
    console.log("done!");
  }

  runCommands();
}

io.on("connection", socket => {
  socket.on("command", command => {
    console.log("command Sent from browser");
    console.log(command);
    drone.send(command, 0, command.length, PORT, HOST, callback);
  });

  socket.emit("status", "CONNECTED");
});

droneState.on(
  "message",
  throttle(state => {
    const formattedState = parseState(state.toString());
    io.sockets.emit("dronestate", formattedState);
  }, 100)
);

http.listen(6767, () => {
  console.log("Socket io server up and running");
});

drone.send("command", 0, "command".length, PORT, HOST, handleError);

module.exports = { flyDrone };
