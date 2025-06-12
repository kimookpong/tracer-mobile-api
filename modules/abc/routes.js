const express = require("express");
const userController = require("./controllers/userController");
const SwaggerMiddleware = require("../../middleware/SwaggerMiddleware");

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ text: "Welcome to the ABC module" });
});
router.use(
  "/docs",
  ...SwaggerMiddleware.setup(
    { module: "abc", title: "API Documentation " }, // info
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
 * /user:
 *    post:
 *      tags: [ABC]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *              example:
 *                name: John Doe
 *                email: john.doe@example.com
 *          responses:
 *              200:
 *                 description: Successfully
 */
router.post("/user", userController.userIndex);

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

/**
 * @swagger
 * /user/{id}:
 *      delete:
 *          tags: [ABC]
 *          parameters:
 *              -   in: รหัสหน่วยงาน
 *                  name: id
 *                  required: true
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Successfully
 */
router.delete("/user/:id", userController.userDetele);

module.exports = router;
