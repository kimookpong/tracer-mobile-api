const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(`/v1`, require(`./version/v1/routes`));
app.use((req, res, next) => {
  res.status(404).json({ error: "API not found" });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
