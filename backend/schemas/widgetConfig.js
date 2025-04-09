const redditWidgetSchema = {
  type: 'object',
  required: ['subreddit'],
  properties: {
    title: {
      type: 'string',
      description: 'Custom title for the widget. If not provided, defaults to subreddit name'
    },
    subreddit: {
      type: 'string',
      description: 'Name of the subreddit to fetch posts from'
    },
    showThumbnails: {
      type: 'boolean',
      default: true,
      description: 'Whether to show post thumbnails'
    },
    collapseAfter: {
      type: 'integer',
      minimum: 1,
      default: 6,
      description: 'Number of posts to show before collapsing'
    },
    style: {
      type: 'string',
      enum: ['vertical-list', 'grid'],
      default: 'vertical-list',
      description: 'Layout style for the posts'
    },
    refreshInterval: {
      type: 'integer',
      minimum: 60000,
      default: 300000,
      description: 'Interval in milliseconds to refresh the widget data'
    }
  }
};

const widgetConfigSchema = {
  type: 'object',
  required: ['type', 'config'],
  properties: {
    type: {
      type: 'string',
      enum: ['weather', 'clock', 'reddit', 'todo']
    },
    config: {
      oneOf: [
        {
          if: { properties: { type: { const: 'reddit' } } },
          then: { $ref: '#/definitions/redditConfig' }
        },
        // ... existing widget configs ...
      ]
    }
  },
  definitions: {
    redditConfig: redditWidgetSchema,
    // ... existing definitions ...
  }
}; 