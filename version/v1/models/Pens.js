const { PrismaClient } = require("../../../prisma/generated/prisma");
const { toCamelCase, generateUUID } = require("../../../middleware/utils");
const prisma = new PrismaClient();

// Get all pens
exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.pens.findMany({
      include: {
        farms: true,
        cattles: true,
        pen_attachments: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get pen by ID
exports.getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.pens.findFirst({
      where: { id: id },
      include: {
        farms: true,
        cattles: true,
        pen_attachments: true,
      },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "Data not found" });
    }
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get pens by farm ID
exports.getByFarmId = async (req, res, next) => {
  try {
    const { farmId } = req.params;
    const data = await prisma.pens.findMany({
      where: { farm_id: farmId },
      include: {
        farms: true,
        cattles: true,
        pen_attachments: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Create new pen
exports.create = async (req, res, next) => {
  try {
    const { body } = req;

    const dataForm = {
      id: generateUUID(),
      farm_id: body.farmId || "",
      pen_type: body.penType || "",
      pen_number: body.penNumber || "",
      capacity: Number(body.capacity) || 0,
      name: body.name || "",
      wa: body.wa || "0",
      latitude: body.latitude || "0",
      longitude: body.longitude || "0",
      status: body.status || "1",
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: body.createdById || "",
      created_by: body.createdBy || "",
      updated_by_id: body.updatedById || "",
      updated_by: body.updatedBy || "",
    };

    const data = await prisma.pens.create({
      data: dataForm,
    });
    res.status(201).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Update pen
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    // Check if pen exists
    const existingPen = await prisma.pens.findFirst({
      where: { id: id },
    });

    if (!existingPen) {
      return res
        .status(404)
        .json({ status: "error", message: "Pen not found" });
    }

    const updateData = {
      ...(body.farmId && { farm_id: body.farmId }),
      ...(body.penType && { pen_type: body.penType }),
      ...(body.penNumber && { pen_number: body.penNumber }),
      ...(body.capacity !== undefined && { capacity: body.capacity }),
      ...(body.name && { name: body.name }),
      ...(body.wa !== undefined && { wa: body.wa }),
      ...(body.latitude !== undefined && { latitude: body.latitude }),
      ...(body.longitude !== undefined && { longitude: body.longitude }),
      ...(body.status && { status: body.status }),
      updated_at: new Date(),
      ...(body.updatedById && { updated_by_id: body.updatedById }),
      ...(body.updatedBy && { updated_by: body.updatedBy }),
    };

    const data = await prisma.pens.update({
      where: { id: id },
      data: updateData,
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Delete pen
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if pen exists
    const existingPen = await prisma.pens.findFirst({
      where: { id: id },
    });

    if (!existingPen) {
      return res
        .status(404)
        .json({ status: "error", message: "Pen not found" });
    }

    // Check if there are cattles in this pen
    const cattlesInPen = await prisma.cattles.count({
      where: { pen_id: id },
    });

    if (cattlesInPen > 0) {
      return res.status(400).json({
        status: "error",
        message: `Cannot delete pen. There are ${cattlesInPen} cattle(s) in this pen.`,
      });
    }

    await prisma.pens.delete({
      where: { id: id },
    });
    res
      .status(200)
      .json({ status: "success", message: "Pen deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get pen statistics
exports.getStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pen = await prisma.pens.findFirst({
      where: { id: id },
      include: {
        cattles: true,
      },
    });

    if (!pen) {
      return res
        .status(404)
        .json({ status: "error", message: "Pen not found" });
    }

    const stats = {
      penId: pen.id,
      penName: pen.name,
      capacity: pen.capacity,
      currentCattle: pen.cattles.length,
      availableSpace: pen.capacity - pen.cattles.length,
      occupancyRate:
        ((pen.cattles.length / pen.capacity) * 100).toFixed(2) + "%",
    };

    res.status(200).json({ status: "success", data: toCamelCase(stats) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
