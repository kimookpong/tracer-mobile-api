const express = require("express");
const { PrismaClient } = require("./prisma/generated/prisma");
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/admins", async (req, res) => {
  const admins = await prisma.admins.findMany();
  res.json(admins);
});

app.post("/admins", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
