const express = require("express");
const userController = require("./controllers/userController");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ text: "Welcome to the DEMO module" });
});

router.get("/user", userController.userIndex);
router.put("/user/:id", userController.userFind); // or put method

router.post("/user", userController.userIndex);
router.patch("/user/:id", userController.userFind);
router.delete("/user/:id", userController.userFind);

module.exports = router;
