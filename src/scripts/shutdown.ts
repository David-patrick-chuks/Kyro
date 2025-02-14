import logger from "../config/logger";

// Graceful shutdown function
export const shutdown = (server: any) => {
    try {
      logger.info("Shutting down gracefully...");
      // Attempt to close the server
      server.close(() => {
        logger.info("Closed all connections gracefully.");
        // Optional: clean up other resources (like DB connections)
        process.exit(0); // Exit the process after everything is closed
      });
      // If server hasn't closed after 10 seconds, force shutdown
      setTimeout(() => {
        logger.error("Forcing shutdown after timeout.");
        process.exit(1); // Force exit with an error code if shutdown times out
      }, 10000);
  
    } catch (error: any) {
      // Handle any error that occurs during the shutdown process
      logger.error(`Error during shutdown: ${error.message}`);
      process.exit(1); // Exit with error code if shutdown fails
    }
  };