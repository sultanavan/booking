import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

// Controllers
import * as userController from "./controllers/userController.js";
import * as hostController from "./controllers/hostController.js";
import * as propertyController from "./controllers/propertyController.js";
import * as bookingController from "./controllers/bookingController.js";
import * as reviewController from "./controllers/reviewController.js";
import { login } from "./controllers/authController.js";

// Middleware
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Request duration logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

// Landing route
app.get("/", (req, res) => res.send("Booking App API is running 🚀"));

// --- AUTH ---
app.post("/login", login);

// --- USERS ---
app.get("/users", userController.getUsers);
app.get("/users/:id", userController.getUser);
app.post("/users", authMiddleware, userController.createUser);
app.put("/users/:id", authMiddleware, userController.updateUser);
app.delete("/users/:id", authMiddleware, userController.deleteUser);

// --- HOSTS ---
app.get("/hosts", hostController.getHosts);
app.get("/hosts/:id", hostController.getHost);
app.post("/hosts", authMiddleware, hostController.createHost);
app.put("/hosts/:id", authMiddleware, hostController.updateHost);
app.delete("/hosts/:id", authMiddleware, hostController.deleteHost);

// --- PROPERTIES ---
app.get("/properties", propertyController.getProperties);
app.get("/properties/:id", propertyController.getProperty);
app.post("/properties", authMiddleware, propertyController.createProperty);
app.put("/properties/:id", authMiddleware, propertyController.updateProperty);
app.delete(
  "/properties/:id",
  authMiddleware,
  propertyController.deleteProperty
);

// --- BOOKINGS ---
app.get("/bookings", bookingController.getBookings);
app.get("/bookings/:id", bookingController.getBooking);
app.post("/bookings", authMiddleware, bookingController.createBooking);
app.put("/bookings/:id", authMiddleware, bookingController.updateBooking);
app.delete("/bookings/:id", authMiddleware, bookingController.deleteBooking);

// --- REVIEWS ---
app.get("/reviews", reviewController.getReviews);
app.get("/reviews/:id", reviewController.getReview);
app.post("/reviews", authMiddleware, reviewController.createReview);
app.put("/reviews/:id", authMiddleware, reviewController.updateReview);
app.delete("/reviews/:id", authMiddleware, reviewController.deleteReview);

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message:
      "An error occurred on the server, please double-check your request!",
  });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
