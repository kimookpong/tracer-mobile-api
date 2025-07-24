const { PrismaClient } = require("../../../prisma/generated/prisma");
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.farms.findMany();
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.farms.findFirst({
      where: { id: id },
    });
    if (!data) {
      res.status(404).json({ status: "error", message: "Data not found" });
    }
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
