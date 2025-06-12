require("dotenv").config({ path: "../.env" });

const express = require("express");
const CorsMiddleware = require("../middleware/corsMiddleware");
const Route = require("../middleware/routeMiddleware");

// Middleware
const app = express();
app.use(express.json());

// Modules support
const moduleSupport = ["abc"];
app.get("/", (req, res) => {
  res.json({ text: "Welcome to the server", moduleSupport });
});
moduleSupport.forEach((module) => {
  app.use(`/${module}`, require(`../modules/${module}/routes`));
});

// Error handling middleware
Route.errorHandler(app);

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
