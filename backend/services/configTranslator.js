const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const configTranslator = {
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
  },
  
  // Format pages configuration
  _formatPages(pages) {
    return pages.map(page => ({
      name: page.name,
      columns: this._formatColumns(page.columns),
    }));
  },
  
  // Format columns configuration
  _formatColumns(columns) {
    return columns.map(column => ({
      size: column.size,
      widgets: this._formatWidgets(column.widgets),
    }));
  },
  
  // Format widgets configuration
  _formatWidgets(widgets) {
    return widgets.map(widget => {
      // Get widget transformer for this type
      const transformer = this._getWidgetTransformer(widget.type);
      
      // Transform widget configuration
      return transformer(widget);
    });
  },
  
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
  },
  
  // Widget transformer implementations
  _transformRedditWidget(widget) {
    return {
      type: 'reddit',
      title: widget.title || 'Reddit Feed',
      subreddit: widget.config.subreddit || 'all',
      showThumbnails: widget.config.showThumbnails ?? true,
      collapseAfter: widget.config.collapseAfter || 5,
      style: widget.config.style || 'card',
      refreshInterval: widget.config.refreshInterval || 300000,
    };
  },
  
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
  },
  
  // Other widget transformers...
  _transformWeatherWidget(widget) {
    return {
      type: 'weather',
      location: widget.config.location,
      units: widget.config.units || 'metric',
    };
  },
  
  _transformSearchWidget(widget) {
    return {
      type: 'search',
      search_engine: widget.config.searchEngine || 'google',
      placeholder: widget.config.placeholder || 'Search the web...',
    };
  },
  
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
  },
  
  // Generate YAML file for a specific user dashboard
  generateYamlFile: async (dashboard, userId) => {
    try {
      const config = {
        dashboard: {
          id: dashboard.id,
          name: dashboard.name,
          user_id: userId,
          widgets: dashboard.layout || []
        }
      };

      const configDir = path.join(__dirname, '../../config');
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      const configPath = path.join(configDir, `dashboard_${dashboard.id}.yaml`);
      const yamlContent = yaml.dump(config);

      fs.writeFileSync(configPath, yamlContent);
      return configPath;
    } catch (err) {
      console.error('Error generating YAML file:', err);
      throw err;
    }
  },

  parseYamlFile: async (configPath) => {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      return yaml.load(fileContent);
    } catch (err) {
      console.error('Error parsing YAML file:', err);
      throw err;
    }
  }
};

module.exports = configTranslator;