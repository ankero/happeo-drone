# Verisure bridge

This is a NodeJS express app that allows exposing Verisure functionalities via webhooks. Currently this only supports control of smart plugs, but can be expanded to support all kinds of functionalities.

## Example usage

1. Deploy wherever you want
2. Use IFTTT to enable/disable a smart plug using Google Assistant + Webhooks
3. Profit

## Requirements

You will need couple of things to get this running. Please note that if you don't like using nicknames when controlling devices, like `/devices/whateverdevice/OFF` you could modify the code to allow `POST` to `/devices` with request body including `deviceLabel`.

- add `deviceMap.json`, you can just rename the deviceMapExample.json. It is used to provide easy to use nicknames for devices.
- Add `./secrets/secrets.json` for local running. Here you will need
  - `API_KEY` This is used to authenticate the requests
  - `USERNAME` Your Verisure username (recommend creating a new one)
  - `PASSWORD` Your Verisure password

## Running

Running locally, just run `npm run`.

## Deploying

Deploy where ever you want.
