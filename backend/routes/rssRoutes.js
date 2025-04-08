const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
const parser = new Parser();

router.get('/feed', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const feed = await parser.parseURL(url);
    const items = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      description: item.content || item.description,
      pubDate: item.pubDate || item.isoDate
    }));

    res.json(items);
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    res.status(500).json({ error: 'Failed to parse RSS feed' });
  }
});

module.exports = router; 