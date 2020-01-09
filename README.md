# Happeo - Drone bridge

This small repo connects Happeo with a locally run Drone (via wifi) and flies the drone on specific commands. You can modify the index file to different kinds of behaviours.

# Requirements

## Code

- You need to obtain a api key for (happeo)[https://developers.happeo.com/reference/basics] by using a system account
- Share a Channel with this system account
- Create a folder `.secrets` to the root
- Create a file `secrets.json` with the following structure

```
{
  "API_KEY": "yourapikeygoeshere"
}
```

## Physical requirements

- Get one of these (Tello)[https://store.dji.com/shop/tello-series]
- Install the app and connect to it via Phone and activate the drone
- Connect the Drone with your computer using WIFI
- Oh and since you are using a wifi you need a hard connection with Happeo
- Enough space :D

# Running service

Run `npm run`, this will start the server.
Use `GET` requests to URIs provided in the `index.js` -file. As an example you can call `localhost:8080/list-posts-by-hashtag-interval/happeofly`. This will poll Happeo every 5 seconds and see if there are new posts with the specific hashtag. If yes, then it will run the `flyDrone()` function. Note that this server is quite stupid, so it keeps the post list in its memory, so once you restart the server it will find the old posts and start flying the drone ;) You can improve this by implementing some storage option.

### Thank you

This repo is using code from (https://github.com/wesbos/javascript-drones/)[https://github.com/wesbos/javascript-drones/] by wesbos. It is released under DWTFYWTBL -license. Thanks wesbos for the code.
