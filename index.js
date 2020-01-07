const express = require("express");
const app = express();
const helmet = require("helmet");

const { listPosts, listPostsByHashtag } = require("./happeo");

const SECONDS = 10;
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

app.get("/list-posts-by-hashtag-interval/:hashtag", async (req, res, next) => {
  try {
    const { hashtag } = req.params;

    setInterval(async () => {
      const posts = await listPostsByHashtag(hashtag, {
        onlyNewPosts: true
      });

      console.log(posts);
      if (posts.length > 0) {
        // DO STUFF WITH DRONE LOL
      }
    }, INTERVAL);

    res.send(`Interval running every ${SECONDS} seconds`);
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
