const express = require("express");
const app = express();
const helmet = require("helmet");

const { getOverview, getDevice, updateDeviceState } = require("./verisure");

const { API_KEY } =
  process.env.ENV === "production"
    ? process.env
    : require("./.secrets/secrets.json");

app.use(helmet());
app.use(express.json());

function verifyRequest(req, res, next) {
  let apiKey;
  if (req.method === "POST") {
    apiKey = req.body.apiKey;
  } else {
    apiKey = req.query.apiKey;
  }

  if (apiKey !== API_KEY) throw new Error("UNAUTHORIZED");

  next();
}

app.use(verifyRequest);

app.get("/", async (req, res, next) => {
  try {
    const overview = await getOverview();
    res.send(overview);
  } catch (error) {
    next(error);
  }
});

app.get("/:key", async (req, res, next) => {
  try {
    const { key } = req.params;
    const overview = await getOverview();
    res.send(overview[key]);
  } catch (error) {
    next(error);
  }
});

app.get("/device/:device", async (req, res, next) => {
  try {
    const { device } = req.params;
    const deviceData = await getDevice(device);
    res.send(deviceData);
  } catch (error) {
    next(error);
  }
});

app.post("/device/:device/:state", async (req, res, next) => {
  try {
    const { device, state } = req.params;
    const updatedState = await updateDeviceState(device, state);
    res.send(updatedState);
  } catch (error) {
    next(error);
  }
});

app.use(function errorHandler(err, req, res, next) {
  console.error(err);
  // Just return 404 to obscure error
  res.sendStatus(404);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Verisure bridge listening on port", port);
});
