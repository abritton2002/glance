// models/Dashboard.js
const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  layout: {
    pages: [{
      name: String,
      columns: [{
        size: {
          type: String,
          enum: ['small', 'full'],
          required: true,
        },
        widgets: [{
          type: {
            type: String,
            required: true,
          },
          title: String,
          config: mongoose.Schema.Types.Mixed,
        }],
      }],
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// Update the lastModified date before updating the dashboard
DashboardSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

module.exports = mongoose.model('Dashboard', DashboardSchema);