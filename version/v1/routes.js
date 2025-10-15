const express = require("express");
const router = express.Router();
const Admins = require("./models/Admins");
const Authen = require("./models/Authen");
const User = require("./models/User");
const News = require("./models/News");
const Farms = require("./models/Farm");
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

module.exports = router;
