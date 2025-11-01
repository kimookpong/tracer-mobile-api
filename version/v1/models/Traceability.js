const { PrismaClient } = require("../../../prisma/generated/prisma");
const { toCamelCase, generateUUID } = require("../../../middleware/utils");
const prisma = new PrismaClient();

// Get all traceability records
exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.traceability.findMany({
      include: {
        traceability_cattle: {
          include: {
            traceability_vehicle: true,
          },
        },
        traceability_status: {
          orderBy: {
            created_at: "desc",
          },
        },
        traceability_vehicle: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get traceability by ID
exports.getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.traceability.findFirst({
      where: { id: id },
      include: {
        traceability_cattle: {
          include: {
            traceability_vehicle: true,
          },
        },
        traceability_status: {
          orderBy: {
            created_at: "desc",
          },
        },
        traceability_vehicle: true,
      },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "Traceability record not found" });
    }
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get traceability by document number
exports.getByDocumentNo = async (req, res, next) => {
  try {
    const { documentNo } = req.params;
    const data = await prisma.traceability.findFirst({
      where: { document_no: documentNo },
      include: {
        traceability_cattle: {
          include: {
            traceability_vehicle: true,
          },
        },
        traceability_status: {
          orderBy: {
            created_at: "desc",
          },
        },
        traceability_vehicle: true,
      },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "Traceability record not found" });
    }
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get traceability by origin farm
exports.getByOriginFarm = async (req, res, next) => {
  try {
    const { farmId } = req.params;
    const data = await prisma.traceability.findMany({
      where: { origin_farm_id: farmId },
      include: {
        traceability_cattle: {
          include: {
            traceability_vehicle: true,
          },
        },
        traceability_status: {
          orderBy: {
            created_at: "desc",
          },
        },
        traceability_vehicle: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get traceability by destination farm
exports.getByDestinationFarm = async (req, res, next) => {
  try {
    const { farmId } = req.params;
    const data = await prisma.traceability.findMany({
      where: { destination_farm_id: farmId },
      include: {
        traceability_cattle: {
          include: {
            traceability_vehicle: true,
          },
        },
        traceability_status: {
          orderBy: {
            created_at: "desc",
          },
        },
        traceability_vehicle: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get traceability by status
exports.getByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const data = await prisma.traceability.findMany({
      where: { status: status },
      include: {
        traceability_cattle: {
          include: {
            traceability_vehicle: true,
          },
        },
        traceability_status: {
          orderBy: {
            created_at: "desc",
          },
        },
        traceability_vehicle: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Create new traceability record
exports.create = async (req, res, next) => {
  try {
    const { body } = req;

    // Validate required fields
    if (!body.originFarmId) {
      return res
        .status(400)
        .json({ status: "error", message: "Origin farm ID is required" });
    }
    if (!body.originPenId) {
      return res
        .status(400)
        .json({ status: "error", message: "Origin pen ID is required" });
    }

    const dataForm = {
      id: generateUUID(),
      reason: body.reason || "",
      document_no: body.documentNo || "",
      total_animal: body.totalAnimal || 0,
      origin_farm_id: body.originFarmId,
      origin_pen_id: body.originPenId,
      destination_farm_id: body.destinationFarmId || null,
      destination_pen_id: body.destinationPenId || null,
      specific_destination_name: body.specificDestinationName || null,
      destination_province: body.destinationProvince || null,
      shipment_date: body.shipmentDate
        ? new Date(body.shipmentDate)
        : new Date(),
      estimated_arrival_date: body.estimatedArrivalDate
        ? new Date(body.estimatedArrivalDate)
        : new Date(),
      destination_type: body.destinationType || "",
      status: body.status || "pending",
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: body.createdById || "",
      created_by: body.createdBy || "",
      updated_by_id: body.updatedById || "",
      updated_by: body.updatedBy || "",
    };

    const data = await prisma.traceability.create({
      data: dataForm,
      include: {
        traceability_cattle: true,
        traceability_status: true,
        traceability_vehicle: true,
      },
    });

    // Create initial status record
    await prisma.traceability_status.create({
      data: {
        id: generateUUID(),
        traceability_id: data.id,
        status: dataForm.status,
        created_at: new Date(),
        updated_at: new Date(),
        created_by_id: body.createdById || "",
        created_by: body.createdBy || "",
        updated_by_id: body.updatedById || "",
        updated_by: body.updatedBy || "",
      },
    });

    res.status(201).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Update traceability
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    // Check if traceability exists
    const existing = await prisma.traceability.findFirst({
      where: { id: id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ status: "error", message: "Traceability record not found" });
    }

    const updateData = {
      ...(body.reason && { reason: body.reason }),
      ...(body.documentNo && { document_no: body.documentNo }),
      ...(body.totalAnimal !== undefined && { total_animal: body.totalAnimal }),
      ...(body.originFarmId && { origin_farm_id: body.originFarmId }),
      ...(body.originPenId && { origin_pen_id: body.originPenId }),
      ...(body.destinationFarmId !== undefined && {
        destination_farm_id: body.destinationFarmId,
      }),
      ...(body.destinationPenId !== undefined && {
        destination_pen_id: body.destinationPenId,
      }),
      ...(body.specificDestinationName !== undefined && {
        specific_destination_name: body.specificDestinationName,
      }),
      ...(body.destinationProvince !== undefined && {
        destination_province: body.destinationProvince,
      }),
      ...(body.shipmentDate && { shipment_date: new Date(body.shipmentDate) }),
      ...(body.estimatedArrivalDate && {
        estimated_arrival_date: new Date(body.estimatedArrivalDate),
      }),
      ...(body.destinationType && { destination_type: body.destinationType }),
      ...(body.status && { status: body.status }),
      updated_at: new Date(),
      ...(body.updatedById && { updated_by_id: body.updatedById }),
      ...(body.updatedBy && { updated_by: body.updatedBy }),
    };

    const data = await prisma.traceability.update({
      where: { id: id },
      data: updateData,
      include: {
        traceability_cattle: true,
        traceability_status: true,
        traceability_vehicle: true,
      },
    });

    // If status changed, create new status record
    if (body.status && body.status !== existing.status) {
      await prisma.traceability_status.create({
        data: {
          id: generateUUID(),
          traceability_id: id,
          status: body.status,
          created_at: new Date(),
          updated_at: new Date(),
          created_by_id: body.updatedById || "",
          created_by: body.updatedBy || "",
          updated_by_id: body.updatedById || "",
          updated_by: body.updatedBy || "",
        },
      });
    }

    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Update traceability status
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, updatedById, updatedBy } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ status: "error", message: "Status is required" });
    }

    // Check if traceability exists
    const existing = await prisma.traceability.findFirst({
      where: { id: id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ status: "error", message: "Traceability record not found" });
    }

    // Update traceability status
    const data = await prisma.traceability.update({
      where: { id: id },
      data: {
        status: status,
        updated_at: new Date(),
        updated_by_id: updatedById || "",
        updated_by: updatedBy || "",
      },
      include: {
        traceability_cattle: true,
        traceability_status: true,
        traceability_vehicle: true,
      },
    });

    // Create status history record
    await prisma.traceability_status.create({
      data: {
        id: generateUUID(),
        traceability_id: id,
        status: status,
        created_at: new Date(),
        updated_at: new Date(),
        created_by_id: updatedById || "",
        created_by: updatedBy || "",
        updated_by_id: updatedById || "",
        updated_by: updatedBy || "",
      },
    });

    res.status(200).json({
      status: "success",
      message: "Status updated successfully",
      data: toCamelCase(data),
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Add vehicle to traceability
exports.addVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    // Check if traceability exists
    const existing = await prisma.traceability.findFirst({
      where: { id: id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ status: "error", message: "Traceability record not found" });
    }

    const vehicleData = {
      id: generateUUID(),
      traceability_id: id,
      vehicle_type: body.vehicleType || "",
      vehicle_registration: body.vehicleRegistration || "",
      transport_company_name: body.transportCompanyName || "",
      driver_title: body.driverTitle || "",
      driver_first_name: body.driverFirstName || "",
      driver_middle_name: body.driverMiddleName || null,
      driver_last_name: body.driverLastName || "",
      contact_title: body.contactTitle || null,
      contact_first_name: body.contactFirstName || null,
      contact_middle_name: body.contactMiddleName || null,
      contact_last_name: body.contactLastName || null,
      contact_phone: body.contactPhone || "",
      is_contract_same_driver:
        body.isContractSameDriver !== undefined
          ? body.isContractSameDriver
          : true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: body.createdById || "",
      created_by: body.createdBy || "",
      updated_by_id: body.updatedById || "",
      updated_by: body.updatedBy || "",
    };

    const vehicle = await prisma.traceability_vehicle.create({
      data: vehicleData,
    });

    res.status(201).json({ status: "success", data: toCamelCase(vehicle) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Add cattle to traceability
exports.addCattle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cattleId, vehicleId, createdById, createdBy } = req.body;

    if (!cattleId) {
      return res
        .status(400)
        .json({ status: "error", message: "Cattle ID is required" });
    }
    if (!vehicleId) {
      return res
        .status(400)
        .json({ status: "error", message: "Vehicle ID is required" });
    }

    // Check if traceability exists
    const existing = await prisma.traceability.findFirst({
      where: { id: id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ status: "error", message: "Traceability record not found" });
    }

    const cattleData = {
      id: generateUUID(),
      traceability_id: id,
      vehicle_id: vehicleId,
      cattle_id: cattleId,
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: createdById || "",
      created_by: createdBy || "",
      updated_by_id: createdById || "",
      updated_by: createdBy || "",
    };

    const cattle = await prisma.traceability_cattle.create({
      data: cattleData,
    });

    res.status(201).json({ status: "success", data: toCamelCase(cattle) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get status history
exports.getStatusHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const history = await prisma.traceability_status.findMany({
      where: { traceability_id: id },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({ status: "success", data: toCamelCase(history) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Delete traceability
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if traceability exists
    const existing = await prisma.traceability.findFirst({
      where: { id: id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ status: "error", message: "Traceability record not found" });
    }

    // Delete related records first
    await prisma.traceability_cattle.deleteMany({
      where: { traceability_id: id },
    });
    await prisma.traceability_status.deleteMany({
      where: { traceability_id: id },
    });
    await prisma.traceability_vehicle.deleteMany({
      where: { traceability_id: id },
    });

    // Delete the traceability
    await prisma.traceability.delete({
      where: { id: id },
    });

    res
      .status(200)
      .json({
        status: "success",
        message: "Traceability record deleted successfully",
      });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get statistics
exports.getStats = async (req, res, next) => {
  try {
    const total = await prisma.traceability.count();
    const pending = await prisma.traceability.count({
      where: { status: "pending" },
    });
    const inTransit = await prisma.traceability.count({
      where: { status: "in_transit" },
    });
    const completed = await prisma.traceability.count({
      where: { status: "completed" },
    });
    const cancelled = await prisma.traceability.count({
      where: { status: "cancelled" },
    });

    const stats = {
      total,
      pending,
      inTransit,
      completed,
      cancelled,
    };

    res.status(200).json({ status: "success", data: toCamelCase(stats) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
