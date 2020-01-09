const express = require("express");
const app = express();
const helmet = require("helmet");

const { listPosts, listPostsByHashtag } = require("./server/happeo/happeo");
const { flyDrone } = require("./server/tello/tello");

const SECONDS = 5;
const INTERVAL = SECONDS * 1000;

app.use(helmet());
app.use(express.json());

app.get("/list-posts", async (req, res, next) => {
  try {
    const posts = await listPosts();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

app.get("/list-posts-by-hashtag/:hashtag", async (req, res, next) => {
  try {
    const { hashtag } = req.params;
    const posts = await listPostsByHashtag(hashtag);
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

app.post("/poll-posts-by-hashtag/:hashtag", async (req, res, next) => {
  try {
    const { hashtag } = req.params;

    setInterval(async () => {
      const posts = await listPostsByHashtag(hashtag, {
        onlyNewPosts: true
      });

      if (posts.length > 0) {
        // DO STUFF
        console.log("FOUND POSTS WITH SPECIFID HASHTAG!");
        flyDrone();
      }
    }, INTERVAL);

    res.send(
      `Polling posts with #${hashtag}. Polling running every ${SECONDS} seconds.`
    );
  } catch (error) {
    next(error);
  }
});

app.use(function errorHandler(err, req, res, next) {
  console.error(err);
  res.send(err);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port", port);
});
