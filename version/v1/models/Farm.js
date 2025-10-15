const { PrismaClient } = require("../../../prisma/generated/prisma");
const { toCamelCase } = require("../../../middleware/utils");
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.farms.findMany();
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.getMyFarms = async (req, res, next) => {
  try {
    const data = await prisma.farms.findMany();
    res.status(200).json({ status: "success", data: toCamelCase(data) });
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
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.create = async (req, res, next) => {
  try {
    const { body } = req;

    res.status(201).json({ status: "success", data: body });

    const data = await prisma.farms.create({
      data: body,
    });
    res.status(201).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const data = await prisma.farms.update({
      where: { id: id },
      data: body,
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.farms.delete({
      where: { id: id },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
