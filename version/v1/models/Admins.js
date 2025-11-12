const { PrismaClient } = require("../../../prisma/generated/prisma");
const { toCamelCase } = require("../../../middleware/utils");
const prisma = new PrismaClient();

// Helper function to format numbers with K suffix
const formatNumber = (num) => {
  if (num >= 10000) {
    return Math.floor(num / 1000) + "K";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num;
};

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.admins.findMany();
    res.status(200).json({ status: "success", data: toCamelCase(data) });
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
    res.status(200).json({ status: "success", data: toCamelCase(data) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDashboardSummary = async (req, res, next) => {
  const { userId, roleId } = req.query;

  let totalFarms = 0;
  let totalPens = 0;
  let totalCattles = 0;
  let totalSickCattles = 0;
  let totalUsers = 0;
  let totalTraceability = 0;
  let totalInTransit = 0;
  let totalOrders = 0;

  try {
    if (roleId == "1") {
      // Get farm IDs for the farmer first
      const farmerFarms = await prisma.farms.findMany({
        where: { farmer_id: userId },
        select: { id: true }
      });
      const farmIds = farmerFarms.map(farm => farm.id);
      totalFarms = farmerFarms.length;
      totalPens = await prisma.pens.count({
        where: { farm_id: { in: farmIds } },
      });
      totalCattles = await prisma.cattles.count({
        where: { farm_id: { in: farmIds }, status: { not: "SOLD" } },
      });
    } else if (roleId == "6") {
      totalFarms = await prisma.farms.count();
      totalPens = await prisma.pens.count();
      totalCattles = await prisma.cattles.count();
      totalSickCattles = await prisma.cattles.count({
        where: { status: "SICK" },
      });
      totalUsers = await prisma.user.count();
      totalTraceability = await prisma.traceability.count();
      totalInTransit = await prisma.traceability.count({
        where: { status: "IN_TRANSIT" },
      });
      totalOrders = await prisma.orders.count();
    }

    const summary = {
      totalFarms: formatNumber(totalFarms),
      totalPens: formatNumber(totalPens),
      totalCattles: formatNumber(totalCattles),
      totalSickCattles: formatNumber(totalSickCattles),
      totalUsers: formatNumber(totalUsers),
      totalTraceability: formatNumber(totalTraceability),
      totalInTransit: formatNumber(totalInTransit),
      totalOrders: formatNumber(totalOrders),
    };

    res.status(200).json({ status: "success", data: summary });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
