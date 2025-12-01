import { createApp } from './app';
import { connectDatabase } from './config/database';
import { config } from './config/env';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = await createApp();

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`
        Server is running on port ${PORT}
      `);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      process.exit(0);
    });
  } catch (error) {
    process.exit(1);
  }
};

// Start the server
startServer();