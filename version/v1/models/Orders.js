const { PrismaClient } = require("../../../prisma/generated/prisma");
const {
  toCamelCase,
  generateUUID,
} = require("../../../middleware/utils");
const prisma = new PrismaClient();

// Get all orders
exports.getAll = async (req, res, next) => {
  const { buyerId, status } = req.query;
  try {
    const data = await prisma.orders.findMany({
      where: {
        ...(buyerId && { buyer_id: buyerId }),
        ...(status && { status: status }),
      },
      include: {
        order_attachments: true,
        order_requests: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.myOrders = async (req, res, next) => {
  const userId = req.user.id;
  try {
    res.status(200).json({ status: "success", data: toCamelCase([]) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
}

// Get order by ID
exports.getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.orders.findFirst({
      where: { id: id },
      include: {
        order_attachments: true,
        order_requests: true,
      },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get orders by buyer ID
exports.getByBuyerId = async (req, res, next) => {
  try {
    const { buyerId } = req.params;
    const data = await prisma.orders.findMany({
      where: { buyer_id: buyerId },
      include: {
        order_attachments: true,
        order_requests: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get orders by order code
exports.getByOrderCode = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const data = await prisma.orders.findFirst({
      where: { order_code: orderCode },
      include: {
        order_attachments: true,
        order_requests: true,
      },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get orders by status
exports.getByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const data = await prisma.orders.findMany({
      where: { status: status },
      include: {
        order_attachments: true,
        order_requests: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Create new order
exports.create = async (req, res, next) => {
  try {
    const { body } = req;

    // Validate required fields
    if (!body.buyerId) {
      return res
        .status(400)
        .json({ status: "error", message: "buyerId is required" });
    }

    const dataForm = {
      id: generateUUID(),
      buyer_id: body.buyerId,
      buyer_code: body.buyerCode || "",
      buyer_company_name: body.buyerCompanyName || "",
      buyer_register_date: body.buyerRegisterDate ? new Date(body.buyerRegisterDate) : new Date(),
      order_code: body.orderCode || "",
      remark: body.remark || null,
      delivery_from_date: body.deliveryFromDate ? new Date(body.deliveryFromDate) : new Date(),
      delivery_to_date: body.deliveryToDate ? new Date(body.deliveryToDate) : new Date(),
      delivery_type: body.deliveryType || "",
      origin_address: body.originAddress || "",
      destination_address: body.destinationAddress || "",
      destination_country: body.destinationCountry || "",
      destination_country_code: body.destinationCountryCode || "",
      total_price: body.totalPrice || 0,
      quarantine_day: body.quarantineDay || 0,
      status: body.status || "PENDING",
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: body.createdById || "",
      created_by: body.createdBy || "",
      updated_by_id: body.updatedById || "",
      updated_by: body.updatedBy || "",
    };

    const data = await prisma.orders.create({
      data: dataForm,
      include: {
        order_attachments: true,
        order_requests: true,
      },
    });
    res.status(201).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Update order
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    // Check if order exists
    const existingOrder = await prisma.orders.findFirst({
      where: { id: id },
    });

    if (!existingOrder) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    // Prepare update data
    const updateData = {
      ...(body.buyerId && { buyer_id: body.buyerId }),
      ...(body.buyerCode && { buyer_code: body.buyerCode }),
      ...(body.buyerCompanyName && { buyer_company_name: body.buyerCompanyName }),
      ...(body.buyerRegisterDate && { buyer_register_date: new Date(body.buyerRegisterDate) }),
      ...(body.orderCode && { order_code: body.orderCode }),
      ...(body.remark !== undefined && { remark: body.remark }),
      ...(body.deliveryFromDate && { delivery_from_date: new Date(body.deliveryFromDate) }),
      ...(body.deliveryToDate && { delivery_to_date: new Date(body.deliveryToDate) }),
      ...(body.deliveryType && { delivery_type: body.deliveryType }),
      ...(body.originAddress && { origin_address: body.originAddress }),
      ...(body.destinationAddress && { destination_address: body.destinationAddress }),
      ...(body.destinationCountry && { destination_country: body.destinationCountry }),
      ...(body.destinationCountryCode && { destination_country_code: body.destinationCountryCode }),
      ...(body.totalPrice !== undefined && { total_price: body.totalPrice }),
      ...(body.quarantineDay !== undefined && { quarantine_day: body.quarantineDay }),
      ...(body.status && { status: body.status }),
      updated_at: new Date(),
      ...(body.updatedById && { updated_by_id: body.updatedById }),
      ...(body.updatedBy && { updated_by: body.updatedBy }),
    };

    const data = await prisma.orders.update({
      where: { id: id },
      data: updateData,
      include: {
        order_attachments: true,
        order_requests: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Update order status
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, updatedById, updatedBy } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ status: "error", message: "status is required" });
    }

    const data = await prisma.orders.update({
      where: { id: id },
      data: {
        status: status,
        updated_at: new Date(),
        ...(updatedById && { updated_by_id: updatedById }),
        ...(updatedBy && { updated_by: updatedBy }),
      },
      include: {
        order_attachments: true,
        order_requests: true,
      },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Delete order
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const existingOrder = await prisma.orders.findFirst({
      where: { id: id },
    });

    if (!existingOrder) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    const data = await prisma.orders.delete({
      where: { id: id },
    });
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Get order statistics by buyer
exports.getStatsByBuyer = async (req, res, next) => {
  try {
    const { buyerId } = req.params;

    const stats = await prisma.orders.groupBy({
      by: ['status'],
      where: { buyer_id: buyerId },
      _count: {
        id: true,
      },
      _sum: {
        total_price: true,
      },
    });

    res.status(200).json({ status: "success", data: toCamelCase(stats) });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
