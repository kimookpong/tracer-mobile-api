const { PrismaClient } = require("../../../prisma/generated/prisma");
const {
  toCamelCase,
  generateUUID,
  generateTracerId,
} = require("../../../middleware/utils");
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.farms.findMany({
      include: {
        pens: true,
        cattles: {
          where: {
            status: {
              not: "SOLD",
            },
          },
        },
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.getMyFarms = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId || userId.trim() === "") {
      return res
        .status(400)
        .json({ status: "error", message: "userId is required" });
    }
    const data = await prisma.farms.findMany({
      where: { farmer_id: userId },
      include: {
        pens: true,
        cattles: {
          where: {
            status: {
              not: "SOLD",
            },
          },
        },
      },
    });

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
      include: {
        pens: true,
        cattles: {
          where: {
            status: {
              not: "SOLD",
            },
          },
        },
      },
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

    const dataForm = {
      id: generateUUID(),
      farm_type: body.farmType || 1,
      max_cows: body.maxCows || 0,
      name: body.name || "",
      farm_identification: body.farmIdentification || "",
      tracer_id: generateTracerId("F", "0001"),
      status: body.status || 1,
      standard: body.standard || 1,
      rai: body.rai || 1,
      ngan: body.ngan || 1,
      wa: body.wa || 1,
      address_line1: body.addressLine1 || "",
      address_subdistrict: body.addressSubdistrict || "",
      address_district: body.addressDistrict || "",
      address_province: body.addressProvince || "",
      address_zipcode: body.addressZipcode || "",
      is_owner_ref_farmer: body.isOwnerRefFarmer || true,

      farmer_id: body.farmerId || "",

      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: body.createdById || "",
      created_by: body.createdBy || "",
      updated_by_id: body.updatedById || "",
      updated_by: body.updatedBy || "",

      ref_1: generateUUID(),
    };

    const data = await prisma.farms.create({
      data: dataForm,
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

// Get all pens for a specific farm
exports.getPens = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if farm exists
    const farm = await prisma.farms.findFirst({
      where: { id: id },
    });

    if (!farm) {
      return res
        .status(404)
        .json({ status: "error", message: "Farm not found" });
    }

    // Get all pens for this farm
    const pens = await prisma.pens.findMany({
      where: { farm_id: id },
      include: {
        cattles: {
          where: {
            status: {
              not: "SOLD",
            },
          },
        },
      },
      orderBy: {
        pen_number: "asc",
      },
    });

    res.status(200).json({ status: "success", data: toCamelCase(pens) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
