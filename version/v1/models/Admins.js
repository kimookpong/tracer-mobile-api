const { PrismaClient } = require("../../../prisma/generated/prisma");
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.admins.findMany();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.admins.findUnique({
      where: { id: id },
    });
    if (!data) {
      res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
