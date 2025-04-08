import axios from 'axios';

const redditService = {
  async getSubredditPosts(subreddit) {
    try {
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`);
      return response.data.data.children.map(post => ({
        id: post.data.id,
        title: post.data.title,
        author: post.data.author,
        score: post.data.score,
        url: post.data.url,
        permalink: `https://reddit.com${post.data.permalink}`,
        created: new Date(post.data.created_utc * 1000).toLocaleDateString(),
        thumbnail: post.data.thumbnail,
        thumbnail_width: post.data.thumbnail_width,
        thumbnail_height: post.data.thumbnail_height,
        num_comments: post.data.num_comments,
        subreddit_icon: post.data.sr_detail?.icon_img || 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png'
      }));
    } catch (error) {
      console.error('Error fetching Reddit data:', error);
      throw error;
    }
  }
};

export default redditService; 