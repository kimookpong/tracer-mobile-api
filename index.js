const express = require("express");
const app = express();
app.use(express.json());
app.use(`/v1`, require(`./version/v1/routes`));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
