import mongoose from "mongoose";
mongoose.set("bufferCommands", false);

import app from "./src/app";
import Connect, { closeDatabase } from "./src/config/db/dbConnect";

/* ===============================
   Handle uncaught exceptions (MUST be first)
   =============================== */
process.on("uncaughtException", (err: Error) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

/* ===============================
   Load environment variables
   =============================== */
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    // Connect to database FIRST
    await Connect();

    // Then start the server
    const server = app.listen(PORT, () => {
      console.log(
        `🚀 ME Movies Server is running!\n` +
          `📍 Environment: ${NODE_ENV}\n` +
          `🌐 Port: ${PORT}\n` +
          `🔗 Health Check: http://localhost:${PORT}/Health\n` +
          `🛡️ Security: Helmet, CORS, Rate Limiting enabled\n` +
          `📊 Logging: Morgan (${NODE_ENV === "production" ? "combined" : "dev"})\n` +
          `🔐 User Routes: /API/auth/`,
      );
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error("❌ UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);
      server.close(async () => {
        await closeDatabase();
        process.exit(1);
      });
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`👋 ${signal} RECEIVED. Shutting down gracefully`);
      server.close(async () => {
        await closeDatabase();
        console.log("💥 Process terminated!");
        process.exit(0);
      });
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    // console.error('❌ Failed to start server:', error);
    console.error("❌ Failed to start server");

    process.exit(1);
  }
};

startServer();
