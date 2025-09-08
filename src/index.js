import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./utils/logger.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// Morgan → pipe HTTP logs into Winston
app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Request duration logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Landing route
app.get("/", (req, res) => {
  logger.info("Health check on /");
  res.send("Booking App API is running 🚀");
});

// Routes
app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/properties", propertyRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);

// Error handler (logs stack trace!)
app.use((err, req, res, next) => {
  logger.error(
    `${req.method} ${req.originalUrl} - ${err.message}\n${err.stack}`
  );
  res.status(500).json({
    message:
      "An error occurred on the server, please double-check your request!",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
