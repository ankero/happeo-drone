const axios = require("axios");
const { API_KEY } = require("../../.secrets/secrets.json");

const instance = axios.create({
  baseURL: "https://api.happeo.com",
  timeout: 10000,
  headers: { "x-happeo-apikey": API_KEY }
});

module.exports = instance;
