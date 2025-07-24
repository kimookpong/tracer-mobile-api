const express = require("express");
const router = express.Router();
const Admins = require("./models/Admins");
const Authen = require("./models/Authen");
const User = require("./models/User");
const News = require("./models/News");
const verifyToken = require("../../middleware/auth");

// Authentication

router.post("/authen/register", verifyToken, Authen.register);
router.post("/authen/login", Authen.login);
router.post("/authen/logout", verifyToken, Authen.logout);
router.post("/authen/checktoken", Authen.checkToken);

// Users
router.get("/users", verifyToken, User.getAll);
router.get("/users/:id", verifyToken, User.getId);

// Admins
router.get("/admins", verifyToken, Admins.getAll);
router.get("/admins/:id", verifyToken, Admins.getId);

// News
router.get("/news", verifyToken, News.getAll);
router.get("/news/:id", verifyToken, News.getId);

module.exports = router;
