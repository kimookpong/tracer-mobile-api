const { PrismaClient } = require("../../../prisma/generated/prisma");
const {
  toCamelCase,
  generateUUID,
  generateTracerId,
} = require("../../../middleware/utils");
const prisma = new PrismaClient();

// Get all cattles
exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.cattles.findMany({
      include: {
        farms: true,
        pens: true,
        cattle_attachments: true,
        cattle_healths: true,
        cattle_vaccinations: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get cattle by ID
exports.getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.cattles.findFirst({
      where: { id: id },
      include: {
        farms: true,
        pens: true,
        cattle_attachments: true,
        cattle_healths: true,
        cattle_vaccinations: true,
      },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "Cattle not found" });
    }
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get cattles by farm ID
exports.getByFarmId = async (req, res, next) => {
  try {
    const { farmId } = req.params;
    const data = await prisma.cattles.findMany({
      where: { farm_id: farmId },
      include: {
        farms: true,
        pens: true,
        cattle_attachments: true,
        cattle_healths: true,
        cattle_vaccinations: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get cattles by pen ID
exports.getByPenId = async (req, res, next) => {
  try {
    const { penId } = req.params;
    const data = await prisma.cattles.findMany({
      where: { pen_id: penId },
      include: {
        farms: true,
        pens: true,
        cattle_attachments: true,
        cattle_healths: true,
        cattle_vaccinations: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get cattles by tracer ID
exports.getByTracerId = async (req, res, next) => {
  try {
    const { tracerId } = req.params;
    const data = await prisma.cattles.findFirst({
      where: { tracer_id: tracerId },
      include: {
        farms: true,
        pens: true,
        cattle_attachments: true,
        cattle_healths: true,
        cattle_vaccinations: true,
      },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "Cattle not found" });
    }
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Create new cattle
exports.create = async (req, res, next) => {
  try {
    const { body } = req;

    // Validate required fields
    if (!body.farmId) {
      return res
        .status(400)
        .json({ status: "error", message: "Farm ID is required" });
    }
    if (!body.penId) {
      return res
        .status(400)
        .json({ status: "error", message: "Pen ID is required" });
    }

    // Check pen capacity
    const pen = await prisma.pens.findFirst({
      where: { id: body.penId },
      include: { cattles: true },
    });

    if (!pen) {
      return res
        .status(404)
        .json({ status: "error", message: "Pen not found" });
    }

    if (pen.cattles.length >= pen.capacity) {
      return res.status(400).json({
        status: "error",
        message: `Pen is at full capacity (${pen.capacity} cattles)`,
      });
    }

    const dataForm = {
      id: generateUUID(),
      tracer_id: body.tracerId || generateTracerId("C", "0001"),
      farm_id: body.farmId,
      pen_id: body.penId,
      cattle_type_id: body.cattleTypeId || "",
      cattle_breed_ids: body.cattleBreedIds || [],
      traceability_id: body.traceabilityId || null,
      nid: body.nid || "",
      gender: body.gender || "",
      castration_status: body.castrationStatus || "",
      pregnant_status: body.pregnantStatus || "",
      birthdate: body.birthdate ? new Date(body.birthdate) : new Date(),
      passport_no: body.passportNo || null,
      color: body.color || "",
      ear: body.ear || "",
      horn: body.horn || "",
      weight: body.weight || "0",
      date_weight: body.dateWeight ? new Date(body.dateWeight) : new Date(),
      tracer_tag: body.tracerTag || "",
      ear_tag: body.earTag || [],
      breed_sire: body.breedSire || [],
      breed_dam: body.breedDam || [],
      breed_pgs: body.breedPgs || [],
      breed_pgd: body.breedPgd || [],
      breed_mgs: body.breedMgs || [],
      breed_mgd: body.breedMgd || [],
      is_sourcing: body.isSourcing !== undefined ? body.isSourcing : false,
      is_tracing: body.isTracing !== undefined ? body.isTracing : false,
      country_code: body.countryCode || "TH",
      status: body.status || "active",
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: body.createdById || "",
      created_by: body.createdBy || "",
      updated_by_id: body.updatedById || "",
      updated_by: body.updatedBy || "",
    };

    const data = await prisma.cattles.create({
      data: dataForm,
      include: {
        farms: true,
        pens: true,
      },
    });
    res.status(201).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Update cattle
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    // Check if cattle exists
    const existingCattle = await prisma.cattles.findFirst({
      where: { id: id },
    });

    if (!existingCattle) {
      return res
        .status(404)
        .json({ status: "error", message: "Cattle not found" });
    }

    // If pen_id is being changed, check new pen capacity
    if (body.penId && body.penId !== existingCattle.pen_id) {
      const newPen = await prisma.pens.findFirst({
        where: { id: body.penId },
        include: { cattles: true },
      });

      if (!newPen) {
        return res
          .status(404)
          .json({ status: "error", message: "New pen not found" });
      }

      if (newPen.cattles.length >= newPen.capacity) {
        return res.status(400).json({
          status: "error",
          message: `New pen is at full capacity (${newPen.capacity} cattles)`,
        });
      }
    }

    const updateData = {
      ...(body.tracerId && { tracer_id: body.tracerId }),
      ...(body.farmId && { farm_id: body.farmId }),
      ...(body.penId && { pen_id: body.penId }),
      ...(body.cattleTypeId && { cattle_type_id: body.cattleTypeId }),
      ...(body.cattleBreedIds && { cattle_breed_ids: body.cattleBreedIds }),
      ...(body.traceabilityId !== undefined && {
        traceability_id: body.traceabilityId,
      }),
      ...(body.nid && { nid: body.nid }),
      ...(body.gender && { gender: body.gender }),
      ...(body.castrationStatus && {
        castration_status: body.castrationStatus,
      }),
      ...(body.pregnantStatus && { pregnant_status: body.pregnantStatus }),
      ...(body.birthdate && { birthdate: new Date(body.birthdate) }),
      ...(body.passportNo !== undefined && { passport_no: body.passportNo }),
      ...(body.color && { color: body.color }),
      ...(body.ear && { ear: body.ear }),
      ...(body.horn && { horn: body.horn }),
      ...(body.weight !== undefined && { weight: body.weight }),
      ...(body.dateWeight && { date_weight: new Date(body.dateWeight) }),
      ...(body.tracerTag && { tracer_tag: body.tracerTag }),
      ...(body.earTag && { ear_tag: body.earTag }),
      ...(body.breedSire && { breed_sire: body.breedSire }),
      ...(body.breedDam && { breed_dam: body.breedDam }),
      ...(body.breedPgs && { breed_pgs: body.breedPgs }),
      ...(body.breedPgd && { breed_pgd: body.breedPgd }),
      ...(body.breedMgs && { breed_mgs: body.breedMgs }),
      ...(body.breedMgd && { breed_mgd: body.breedMgd }),
      ...(body.isSourcing !== undefined && { is_sourcing: body.isSourcing }),
      ...(body.isTracing !== undefined && { is_tracing: body.isTracing }),
      ...(body.countryCode && { country_code: body.countryCode }),
      ...(body.status && { status: body.status }),
      updated_at: new Date(),
      ...(body.updatedById && { updated_by_id: body.updatedById }),
      ...(body.updatedBy && { updated_by: body.updatedBy }),
    };

    const data = await prisma.cattles.update({
      where: { id: id },
      data: updateData,
      include: {
        farms: true,
        pens: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Delete cattle
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if cattle exists
    const existingCattle = await prisma.cattles.findFirst({
      where: { id: id },
    });

    if (!existingCattle) {
      return res
        .status(404)
        .json({ status: "error", message: "Cattle not found" });
    }

    // Delete related records first
    await prisma.cattle_attachments.deleteMany({
      where: { cattle_id: id },
    });
    await prisma.cattle_healths.deleteMany({
      where: { cattle_id: id },
    });
    await prisma.cattle_vaccinations.deleteMany({
      where: { cattle_id: id },
    });

    // Delete the cattle
    await prisma.cattles.delete({
      where: { id: id },
    });

    res
      .status(200)
      .json({ status: "success", message: "Cattle deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get cattle statistics
exports.getStats = async (req, res, next) => {
  try {
    const totalCattles = await prisma.cattles.count();
    const activeCattles = await prisma.cattles.count({
      where: { status: "active" },
    });
    const maleCattles = await prisma.cattles.count({
      where: { gender: "male" },
    });
    const femaleCattles = await prisma.cattles.count({
      where: { gender: "female" },
    });

    const stats = {
      totalCattles,
      activeCattles,
      maleCattles,
      femaleCattles,
      inactiveCattles: totalCattles - activeCattles,
    };

    res.status(200).json({ status: "success", data: toCamelCase(stats) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Move cattle to different pen
exports.moveToPen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPenId, updatedById, updatedBy } = req.body;

    if (!newPenId) {
      return res
        .status(400)
        .json({ status: "error", message: "New pen ID is required" });
    }

    // Check if cattle exists
    const cattle = await prisma.cattles.findFirst({
      where: { id: id },
    });

    if (!cattle) {
      return res
        .status(404)
        .json({ status: "error", message: "Cattle not found" });
    }

    // Check new pen capacity
    const newPen = await prisma.pens.findFirst({
      where: { id: newPenId },
      include: { cattles: true },
    });

    if (!newPen) {
      return res
        .status(404)
        .json({ status: "error", message: "New pen not found" });
    }

    if (newPen.cattles.length >= newPen.capacity) {
      return res.status(400).json({
        status: "error",
        message: `New pen is at full capacity (${newPen.capacity} cattles)`,
      });
    }

    const data = await prisma.cattles.update({
      where: { id: id },
      data: {
        pen_id: newPenId,
        updated_at: new Date(),
        updated_by_id: updatedById || "",
        updated_by: updatedBy || "",
      },
      include: {
        farms: true,
        pens: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Cattle moved successfully",
      data: toCamelCase(data),
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
