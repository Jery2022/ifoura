require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { errorHandler } = require("./middleware/errorHandler");
const { syncDatabase } = require("./models");

// Routes
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const objectRoutes = require("./routes/objectRoutes");
const entryRoutes = require("./routes/entryRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(helmet()); // Basic security headers

// Database synchronization
syncDatabase();

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/objects", objectRoutes);
app.use("/api/objects/:objectId/entries", entryRoutes);
app.use("/api/objects/:objectId/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
