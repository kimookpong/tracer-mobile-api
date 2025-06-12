const express = require("express");
const userController = require("./controllers/userController");
const SwaggerMiddleware = require("../../middleware/SwaggerMiddleware");

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ text: "Welcome to the DEMO2 module" });
});
router.use(
  "/docs",
  ...SwaggerMiddleware.setup(
    { module: "demo2", title: "API Documentation " }, // info
    { admin: "admin" } // user login
  )
);

/**
 * @swagger
 * tags:
 *   -  name: ABC
 *      description: จัดการข้อมูลผู้ใช้งาน
 *
 */

/**
 * @swagger
 * /user:
 *      get:
 *          tags: [ABC]
 *          responses:
 *              200:
 *                 description: Successfully
 */
router.get("/user", userController.userIndex);

/**
 * @swagger
 * /user/{id}:
 *      get:
 *          tags: [ABC]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  description: รหัสหน่วยงาน
 *                  required: true
 *                  schema:
 *                      type: integer
 *              -   in: path
 *                  name: test
 *                  description: สำหรับทดสอบ
 *          responses:
 *              200:
 *                  description: Successfully
 */
router.get("/user/:id", userController.userFind);

module.exports = router;
