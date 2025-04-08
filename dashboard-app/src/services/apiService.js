import axios from 'axios';
import Parser from 'rss-parser';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const parser = new Parser();

const apiService = {
  async getWeather(location) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
      return {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  async discoverFeeds(topic) {
    try {
      // First, search for relevant websites using a search API
      const searchResponse = await axios.get(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(topic)}+site:*.com+feed`,
        {
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': process.env.REACT_APP_BRAVE_API_KEY
          }
        }
      );

      // Extract potential feed URLs from search results
      const potentialFeeds = searchResponse.data.web.results
        .map(result => result.url)
        .filter(url => url.includes('feed') || url.includes('rss') || url.includes('xml'));

      // Try to parse each feed
      const validFeeds = [];
      for (const url of potentialFeeds) {
        try {
          const feed = await parser.parseURL(url);
          if (feed.items && feed.items.length > 0) {
            validFeeds.push({
              url,
              title: feed.title,
              description: feed.description
            });
          }
        } catch (e) {
          console.log(`Failed to parse feed: ${url}`);
        }
      }

      return validFeeds;
    } catch (error) {
      console.error('Error discovering feeds:', error);
      throw error;
    }
  },

  async getNews(topic) {
    try {
      // First discover relevant feeds
      const feeds = await this.discoverFeeds(topic);
      
      // Fetch and parse all feeds
      const allArticles = [];
      for (const feed of feeds) {
        try {
          const feedContent = await parser.parseURL(feed.url);
          const articles = feedContent.items.map(item => ({
            title: item.title,
            description: item.contentSnippet || item.description || '',
            url: item.link,
            source: feed.title,
            publishedAt: new Date(item.pubDate || item.isoDate).toLocaleDateString(),
            imageUrl: this.extractImageUrl(item),
            author: item.creator || item.author || ''
          }));
          allArticles.push(...articles);
        } catch (e) {
          console.log(`Failed to fetch feed: ${feed.url}`);
        }
      }

      // Sort by date and limit to top 10
      return allArticles
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  extractImageUrl(item) {
    // Try to extract image URL from content
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) return imgMatch[1];
    }
    return null;
  },

  async getGitHubActivity(username) {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/events`
      );
      return response.data.map(event => ({
        type: event.type,
        repo: event.repo.name,
        createdAt: new Date(event.created_at).toLocaleDateString(),
        url: `https://github.com/${event.repo.name}`
      }));
    } catch (error) {
      console.error('Error fetching GitHub activity:', error);
      throw error;
    }
  }
};

export default apiService; 