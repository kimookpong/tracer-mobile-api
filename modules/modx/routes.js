const express = require("express");
const sprintController = require("./controllers/sprintController");
const productBacklogController = require("./controllers/productBacklogController");
const SwaggerMiddleware = require("../../middleware/SwaggerMiddleware");

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ text: "Welcome to the MODX module" });
});
router.use(
  "/docs",
  ...SwaggerMiddleware.setup(
    {
      module: "modx",
      title: "modx ",
      description: "API Documentation for modx  Author: นายมานิต จิตต์ประไพย",
      version: "1.0.1",
    }, // info
    { modx: "modx" } // user login
  )
);

/**
 * @swagger
 * tags:
 *   - name: sprint
 *     description: จัดการ sprint แต่ละรอบ
 *   - name: productBacklog
 *     description: จัดการ product backlog ของ sprint แต่ละรอบ
 *
 */

// Routes
/**
 * @swagger
 * /sprint/index:
 *      get:
 *          summary: แสดงข้อมูล sprint ทั้งหมด
 *          tags: [sprint]
 *          responses:
 *              200:
 *                 description: Successfully
 */

router.get("/sprint/index", sprintController.sprintIndex);

/**
 * @swagger
 * /sprint/create:
 *      post:
 *          summary: สร้าง sprint แต่ละรอบ
 *          tags: [sprint]
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              SPRINT_NAME:
 *                                  type: string
 *                              START_DATE:
 *                                  type: string
 *                              END_DATE:
 *                                  type: string
 *                          example:
 *                              SPRINT_NAME: "Sprint 1"
 *                              START_DATE: "2021-09-01"
 *                              END_DATE: "2021-09-30"
 *          responses:
 *              200:
 *                 description: Successfully
 */

router.post("/sprint/create", sprintController.sprintCreate);

/**
 * @swagger
 * /sprint/find/{id}:
 *      get:
 *          summary: ค้นหา sprint จากรหัส sprint
 *          tags: [sprint]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  description: รหัส sprint
 *                  required: true
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Successfully
 */
router.get("/sprint/find/:id", sprintController.sprintFind);

/**
 * @swagger
 * /sprint/update/{id}:
 *      put:
 *          summary: แก้ไขข้อมูล sprint
 *          tags: [sprint]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  description: รหัส sprint
 *                  required: true
 *                  schema:
 *                      type: integer
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              SPRINT_NAME:
 *                                  type: string
 *                              START_DATE:
 *                                  type: string
 *                              END_DATE:
 *                                  type: string
 *                          example:
 *                              SPRINT_NAME: "Sprint 1"
 *                              START_DATE: "2021-09-01"
 *                              END_DATE: "2021-09-30"
 *          responses:
 *              200:
 *                  description: Successfully
 */
router.put("/sprint/update/:id", sprintController.sprintUpdate);

/**
 * @swagger
 * /sprint/delete/{id}:
 *     delete:
 *         summary: ลบข้อมูล sprint
 *         tags: [sprint]
 *         parameters:
 *             - in: path
 *               name: id
 *               description: รหัส sprint
 *               required: true
 *               schema:
 *                 type: integer
 *         responses:
 *             200:
 *                 description: Successfully
 */
router.delete("/sprint/delete/:id", sprintController.sprintDelete);

/**
 * @swagger
 * /productBacklog/index:
 *      get:
 *          summary: แสดงข้อมูล product backlog ทั้งหมด
 *          tags: [productBacklog]
 *          responses:
 *              200:
 *                 description: Successfully
 */
router.get(
  "/productBacklog/index",
  productBacklogController.productBacklogIndex
);

/**
 * @swagger
 * /productBacklog/create:
 *     post:
 *        summary: สร้าง product backlog
 *        tags: [productBacklog]
 *        requestBody:
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   CODE:
 *                     type: string
 *                   TITLE:
 *                     type: string
 *                   AS_A:
 *                     type: string
 *                   I_WANT:
 *                     type: string
 *                   SO_THAT:
 *                     type: string
 *                   ACC_CRIT:
 *                     type: string
 *                   PRIORITYS:
 *                     type: string
 *                   ESTIMATION:
 *                     type: string
 *                   SPRINT_ID:
 *                     type: string
 *                   COLOR:
 *                     type: string
 *               example:
 *                 CODE: "P001"
 *                 TITLE: "Product 1"
 *                 AS_A: "As a user, I want to login to the system"
 *                 I_WANT: "I want to login with my username and password"
 *                 SO_THAT: "So that I can access the system"
 *                 ACC_CRIT: "Username and password are correct"
 *                 PRIORITYS: "1"
 *                 ESTIMATION: "1"
 *                 SPRINT_ID: "1"
 *                 COLOR: "#FFFFFF"
 *        responses:
 *          200:
 *            description: Successfully
 */
router.post(
  "/productBacklog/create",
  productBacklogController.productBacklogCreate
);

module.exports = router;
