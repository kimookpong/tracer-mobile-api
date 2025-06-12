const sprintModel = require("../models/sprintModel");
const Route = require("../../../middleware/routeMiddleware");

exports.sprintIndex = async (req, res, next) => {
  try {
    const sprints = await sprintModel.getAll();
    Route.sendResponse(res, 200, { dt: sprints });
  } catch (err) {
    next(err);
  }
};

exports.sprintCreate = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await sprintModel.create(data);
    Route.sendResponse(res, 200, { dt: result });
  } catch (err) {
    next(err);
  }
};

exports.sprintFind = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await sprintModel.find(id);
    Route.sendResponse(res, 200, { dt: result });
  } catch (err) {
    next(err);
  }
};

exports.sprintUpdate = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await sprintModel.update(id, data);
    Route.sendResponse(res, 200, { dt: result });
  } catch (err) {
    next(err);
  }
};

exports.sprintDelete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await sprintModel.remove(id);
    Route.sendResponse(res, 200, { dt: result });
  } catch (err) {
    next(err);
  }
};
