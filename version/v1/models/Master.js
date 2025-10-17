const { PrismaClient } = require("../../../prisma/generated/prisma");
const { toCamelCase } = require("../../../middleware/utils");
const prisma = new PrismaClient();

// Get all cattle breeds
exports.getBreeds = async (req, res, next) => {
  try {
    const data = await prisma.cattle_breeds.findMany({
      orderBy: {
        name_en: "asc",
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get all cattle types
exports.getTypes = async (req, res, next) => {
  try {
    const data = await prisma.cattle_types.findMany({
      orderBy: {
        name_en: "asc",
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
