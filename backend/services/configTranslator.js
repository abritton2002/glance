const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

class ConfigTranslator {
  // Convert a user-friendly dashboard config to Glance YAML
  dashboardToYaml(dashboard) {
    const config = {
      server: {
        port: 8080,
      },
      theme: {
        light: true,
        background_color: '210 15 97',
        primary_color: '210 80 50',
      },
      branding: {
        logo_text: dashboard.name || 'myDash',
      },
      pages: this._formatPages(dashboard.layout.pages),
    };
    
    return yaml.dump(config);
  }
  
  // Format pages configuration
  _formatPages(pages) {
    return pages.map(page => ({
      name: page.name,
      columns: this._formatColumns(page.columns),
    }));
  }
  
  // Format columns configuration
  _formatColumns(columns) {
    return columns.map(column => ({
      size: column.size,
      widgets: this._formatWidgets(column.widgets),
    }));
  }
  
  // Format widgets configuration
  _formatWidgets(widgets) {
    return widgets.map(widget => {
      // Get widget transformer for this type
      const transformer = this._getWidgetTransformer(widget.type);
      
      // Transform widget configuration
      return transformer(widget);
    });
  }
  
  // Get transformer function for specific widget type
  _getWidgetTransformer(widgetType) {
    const transformers = {
      reddit: this._transformRedditWidget,
      rss: this._transformRssWidget,
      weather: this._transformWeatherWidget,
      search: this._transformSearchWidget,
      bookmarks: this._transformBookmarksWidget,
      // Add more widget transformers as needed
      
      // Default transformer for unknown widget types
      default: (widget) => ({
        type: widget.type,
        ...widget.config,
      }),
    };
    
    return transformers[widgetType] || transformers.default;
  }
  
  // Widget transformer implementations
  _transformRedditWidget(widget) {
    // If user entered comma-separated subreddits, use just the first one
    let subreddit = widget.config.subreddits;
    if (subreddit.includes(',')) {
      subreddit = subreddit.split(',')[0].trim();
    }
    
    return {
      type: 'reddit',
      title: widget.title || subreddit,
      subreddit: subreddit,
      show_thumbnails: widget.config.showThumbnails || false,
      style: widget.config.style || 'vertical-list',
      collapse_after: widget.config.collapseAfter || 5,
    };
  }
  
  // Transform RSS widget from user-friendly to Glance format
  _transformRssWidget(widget) {
    return {
      type: 'rss',
      title: widget.title || 'RSS Feed',
      style: widget.config.style || 'vertical-list',
      feeds: widget.config.feeds.map(feed => ({
        url: feed.url,
        title: feed.title || '',
      })),
      limit: widget.config.limit || 10,
      collapse_after: widget.config.collapseAfter || 5,
    };
  }
  
  // Other widget transformers...
  _transformWeatherWidget(widget) {
    return {
      type: 'weather',
      location: widget.config.location,
      units: widget.config.units || 'metric',
    };
  }
  
  _transformSearchWidget(widget) {
    return {
      type: 'search',
      search_engine: widget.config.searchEngine || 'google',
      placeholder: widget.config.placeholder || 'Search the web...',
    };
  }
  
  _transformBookmarksWidget(widget) {
    return {
      type: 'bookmarks',
      groups: widget.config.groups.map(group => ({
        title: group.title,
        links: group.links.map(link => ({
          title: link.title,
          url: link.url,
          icon: link.icon || '',
        })),
      })),
    };
  }
  
// Generate YAML file for a specific user dashboard
async generateYamlFile(dashboard, userId) {
    const config = this.dashboardToYaml(dashboard);
    
    // Use a more reliable path for configurations
    const configDir = path.resolve(process.env.CONFIG_PATH || './config', userId.toString());
    console.log(`Generating config file in: ${configDir}`);
    
    // Create config directory if it doesn't exist
    try {
      if (!fs.existsSync(configDir)) {
        console.log(`Creating directory: ${configDir}`);
        fs.mkdirSync(configDir, { recursive: true });
      }
    } catch (error) {
      console.error(`Error creating directory: ${error.message}`);
      throw error;
    }
    
    const filePath = path.join(configDir, `${dashboard.id}.yml`);
    console.log(`Writing config to: ${filePath}`);
    
    try {
      fs.writeFileSync(filePath, config);
      console.log(`Config file written successfully`);
      return filePath;
    } catch (error) {
      console.error(`Error writing config file: ${error.message}`);
      throw error;
    }
   }
}
module.exports = new ConfigTranslator();