// services/containerService.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');

class ContainerService {
  // Create or update a container for a user's dashboard
  async deployDashboard(userId, dashboardId, configPath) {
    const containerName = `mydash-${userId.substring(0, 8)}-${dashboardId.substring(0, 8)}`;
    
    try {
      console.log(`Deploying dashboard container: ${containerName}`);
      console.log(`Config path: ${configPath}`);
      
      // Verify config file exists
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file does not exist: ${configPath}`);
      }
      
      // Check if container already exists
      const { stdout } = await execPromise(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`);
      
      if (stdout.trim() === containerName) {
        // Container exists, update it
        console.log(`Container ${containerName} exists, updating...`);
        return await this.updateContainer(containerName, configPath);
      } else {
        // Create new container
        console.log(`Container ${containerName} does not exist, creating...`);
        return await this.createContainer(containerName, configPath);
      }
    } catch (error) {
      console.error('Docker deployment error:', error);
      throw new Error(`Failed to deploy dashboard: ${error.message}`);
    }
  }
  
  // Create a new Docker container
  async createContainer(containerName, configPath) {
    try {
      // Ensure the absolute path is used
      const absoluteConfigPath = path.resolve(configPath);
      console.log(`Using absolute config path: ${absoluteConfigPath}`);
      
      // Create container without exposing a port first
      const command = `docker run -d --name ${containerName} -v "${absoluteConfigPath}:/app/config/glance.yml" ${process.env.GLANCE_IMAGE || 'glanceapp/glance'}`;
      
      console.log(`Running docker command: ${command}`);
      const { stdout } = await execPromise(command);
      const containerId = stdout.trim();
      console.log(`Container created with ID: ${containerId}`);
      
      return { 
        containerName, 
        containerId,
        port: 'internal' // Not exposing external port for now
      };
    } catch (error) {
      console.error(`Container creation error: ${error.message}`);
      // Check if the container was created despite the error
      try {
        const { stdout } = await execPromise(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`);
        if (stdout.trim() === containerName) {
          console.log(`Container ${containerName} exists despite error, removing it`);
          await execPromise(`docker rm -f ${containerName}`);
        }
      } catch (cleanupError) {
        console.error(`Error during cleanup: ${cleanupError.message}`);
      }
      throw error;
    }
  }
  
  // Update an existing container with new configuration
  async updateContainer(containerName, configPath) {
    try {
      // Ensure the absolute path is used
      const absoluteConfigPath = path.resolve(configPath);
      
      // Copy new config to container
      console.log(`Copying config to container: ${containerName}`);
      await execPromise(`docker cp "${absoluteConfigPath}" ${containerName}:/app/config/glance.yml`);
      
      // Restart container to apply changes
      console.log(`Restarting container: ${containerName}`);
      await execPromise(`docker restart ${containerName}`);
      
      return { 
        containerName,
        port: 'internal' // Not exposing external port for now
      };
    } catch (error) {
      console.error(`Container update error: ${error.message}`);
      throw error;
    }
  }
  
  // Stop and remove a container
  async removeContainer(userId, dashboardId) {
    const containerName = `mydash-${userId.substring(0, 8)}-${dashboardId.substring(0, 8)}`;
    
    try {
      console.log(`Removing container: ${containerName}`);
      await execPromise(`docker rm -f ${containerName}`);
      return true;
    } catch (error) {
      console.error('Container removal error:', error);
      throw new Error(`Failed to remove container: ${error.message}`);
    }
  }
}

module.exports = new ContainerService();