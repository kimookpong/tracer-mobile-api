const express = require("express");
const router = express.Router();
const Admins = require("./models/Admins");
const Authen = require("./models/Authen");
const User = require("./models/User");
const News = require("./models/News");
const Farms = require("./models/Farm");
const Pens = require("./models/Pens");
const Cattles = require("./models/Cattles");
const Master = require("./models/Master");
const Upload = require("./models/Upload");
const verifyToken = require("../../middleware/auth");

// Authentication
router.post("/authen/register", verifyToken, Authen.register);
router.post("/authen/login", Authen.login);
router.post("/authen/loginTest", Authen.loginTest);
router.post("/authen/logout", verifyToken, Authen.logout);
router.post("/authen/checktoken", Authen.checkToken);

//Admin Tracer
router.get("/admin/users", verifyToken, User.getAll);

// Users
router.get("/users", verifyToken, User.getAll);
router.get("/users/:id", verifyToken, User.getId);

// Admins
router.get("/admins", verifyToken, Admins.getAll);
router.get("/admins/:id", verifyToken, Admins.getId);

// News
router.get("/news", verifyToken, News.getAll);
router.get("/news/:id", verifyToken, News.getId);

// Farms
router.get("/my-farms", verifyToken, Farms.getMyFarms);
router.get("/farms", verifyToken, Farms.getAll);
router.post("/farms", verifyToken, Farms.create);
router.get("/farms/:id", verifyToken, Farms.getId);
router.put("/farms/:id", verifyToken, Farms.update);
router.delete("/farms/:id", verifyToken, Farms.remove);

// Fences
router.get("/pens", verifyToken, Pens.getAll);
router.post("/pens", verifyToken, Pens.create);
router.get("/pens/:id", verifyToken, Pens.getId);
router.put("/pens/:id", verifyToken, Pens.update);
router.delete("/pens/:id", verifyToken, Pens.remove);
router.get("/pens/:id/stats", verifyToken, Pens.getStats);
router.get("/pens/farm/:farmId", verifyToken, Pens.getByFarmId);

// Cattles
router.get("/cattles", verifyToken, Cattles.getAll);
router.post("/cattles", verifyToken, Cattles.create);
router.get("/cattles/stats", verifyToken, Cattles.getStats);
router.get("/cattles/:id", verifyToken, Cattles.getId);
router.put("/cattles/:id", verifyToken, Cattles.update);
router.delete("/cattles/:id", verifyToken, Cattles.remove);
router.get("/cattles/farm/:farmId", verifyToken, Cattles.getByFarmId);
router.get("/cattles/pen/:penId", verifyToken, Cattles.getByPenId);
router.get("/cattles/tracer/:tracerId", verifyToken, Cattles.getByTracerId);
router.post("/cattles/:id/move", verifyToken, Cattles.moveToPen);

// Master Data
router.get("/master/cattleBreeds", verifyToken, Master.getBreeds);
router.get("/master/cattleTypes", verifyToken, Master.getTypes);

// Upload Files
router.post("/upload/single", verifyToken, Upload.uploadSingle, Upload.upload);
router.post("/upload/multiple", verifyToken, Upload.uploadMultiple);
router.post("/upload/remove", verifyToken, Upload.remove);
router.get("/upload/preview/:category/:year/:filename", Upload.preview);
router.get("/upload/info/:category/:year/:filename", Upload.getFileInfo);
router.get("/upload/list/:category/:year", verifyToken, Upload.listFiles);

module.exports = router;
