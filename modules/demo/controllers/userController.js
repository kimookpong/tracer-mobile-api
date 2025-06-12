const userModel = require("../models/userModel");
const Route = require("../../../middleware/routeMiddleware");

exports.userIndex = async (req, res, next) => {
  try {
    const users = await userModel.getAll();
    Route.sendResponse(res, 200, { dt: users });
  } catch (err) {
    next(err);
  }
};

exports.userFind = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === 41) {
      Route.sendResponse(res, 400, { message: "id must not 41" });
    }
    const users = await userModel.getFind(id);
    Route.sendResponse(res, 200, { dt: users });
  } catch (err) {
    next(err);
  }
};

exports.userDetele = async (req, res, next) => {
  try {
    await userModel.delete(req);
    Route.sendResponse(res, 200, { dt: users });
  } catch (err) {
    next(err);
  }
};
