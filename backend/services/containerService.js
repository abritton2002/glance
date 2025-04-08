// services/containerService.js
const Docker = require('dockerode');
const path = require('path');
const fs = require('fs');

const docker = new Docker();

const containerService = {
  deployDashboard: async (userId, dashboardId, configPath) => {
    try {
      const containerName = `glance-dashboard-${userId}-${dashboardId}`;
      
      // Check if container already exists
      const existingContainer = await docker.getContainer(containerName).inspect().catch(() => null);
      
      if (existingContainer) {
        // Stop and remove existing container
        await docker.getContainer(containerName).stop();
        await docker.getContainer(containerName).remove();
      }

      // Create new container
      const container = await docker.createContainer({
        Image: 'glance-dashboard',
        name: containerName,
        Env: [
          `USER_ID=${userId}`,
          `DASHBOARD_ID=${dashboardId}`,
          `CONFIG_PATH=${configPath}`
        ],
        HostConfig: {
          Binds: [
            `${configPath}:/app/config/dashboard.yaml`
          ],
          PortBindings: {
            '3000/tcp': [{ HostPort: `${3000 + dashboardId}` }]
          }
        }
      });

      // Start container
      await container.start();
      
      return container.id;
    } catch (err) {
      console.error('Error deploying dashboard container:', err);
      throw err;
    }
  },

  removeContainer: async (userId, dashboardId) => {
    try {
      const containerName = `glance-dashboard-${userId}-${dashboardId}`;
      
      // Stop and remove container
      await docker.getContainer(containerName).stop();
      await docker.getContainer(containerName).remove();
      
      // Remove config file
      const configPath = path.join(__dirname, '../../config', `dashboard_${dashboardId}.yaml`);
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
    } catch (err) {
      console.error('Error removing dashboard container:', err);
      throw err;
    }
  }
};

module.exports = containerService;