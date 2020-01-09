const apiClient = require("./apiClient");

const PAGE_SIZE = 5;
const PAGE_NUMBER = 1;
const STATE = "PUBLISHED";

let latesCheckedPost = 0;

async function listPosts() {
  try {
    const results = await apiClient({
      method: "GET",
      url: "/posts",
      pageNumber: PAGE_NUMBER,
      pageSize: PAGE_SIZE,
      state: STATE
    });

    return results.data;
  } catch (error) {
    throw error;
  }
}

async function listNewPosts() {
  try {
    const results = await listPosts();
    const newPosts = results.items.filter(
      post => post.publishedMs > latesCheckedPost
    );

    if (newPosts.length > 0) {
      latesCheckedPost = newPosts[0].publishedMs;
    }

    return { items: newPosts };
  } catch (error) {
    throw error;
  }
}

async function listPostsByHashtag(hashtag, params = {}) {
  if (!hashtag) throw new Error("MISSING HASHTAG");

  try {
    const { onlyNewPosts } = params;
    const results = onlyNewPosts ? await listNewPosts() : await listPosts();
    const postsWithHashtag = results.items.filter(post =>
      post.hashtags.includes(hashtag)
    );
    return postsWithHashtag;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listPosts,
  listPostsByHashtag
};
