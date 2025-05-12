import { ErrorHandler } from "../utils/errorHandler.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Avoid sending headers again if already sent
  }

  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

// Handling Uncaught Exception
export const handleUncaughtError = () => {
  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1); // Exit the process to avoid undefined behavior
  });
};
