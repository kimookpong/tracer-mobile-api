require("dotenv").config({ path: ".env" });

const express = require("express");
const Route = require("./middleware/routeMiddleware");

// Middleware
const app = express();
app.use(express.json());

// Modules support
const moduleSupport = ["abc", "demo", "demo2", "modx"];
app.get("/", (req, res) => {
  res.json({ text: "Welcome to the server", moduleSupport });
});
moduleSupport.forEach((mod) => {
  app.use(`/${mod}`, require(`./modules/${mod}/routes`));
});

// Error handling middleware
Route.errorHandler(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
