const express = require("express");
const router = express.Router();
const Admins = require("./models/Admins");
const Authen = require("./models/Authen");
const verifyToken = require("../../middleware/auth");

// Authentication
router.post("/authen/register", verifyToken, Authen.register);
router.post("/authen/login", Authen.login);
router.post("/authen/logout", verifyToken, Authen.logout);

// Admins
router.get("/admins", verifyToken, Admins.getAll);
router.get("/admins/:id", verifyToken, Admins.getId);

module.exports = router;
