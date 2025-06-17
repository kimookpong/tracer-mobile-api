const express = require("express");
const router = express.Router();
const Admins = require("./models/Admins");
const Authen = require("./models/Authen");
const User = require("./models/User");
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

module.exports = router;
