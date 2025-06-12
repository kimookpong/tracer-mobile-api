const productBacklogModel = require("../models/productBacklogModel");
const Route = require("../../../middleware/routeMiddleware");

exports.productBacklogIndex = async (req, res, next) => {
  try {
    const productBacklog = await productBacklogModel.getAll();
    Route.sendResponse(res, 200, { dt: productBacklog });
  } catch (err) {
    next(err);
  }
};

exports.productBacklogCreate = async (req, res, next) => {
  try {
    const data = req.body;
    const productBacklog = await productBacklogModel.create(data);
    Route.sendResponse(res, 200, { dt: productBacklog });
  } catch (err) {
    next(err);
  }
};
