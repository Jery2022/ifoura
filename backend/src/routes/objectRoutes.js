const express = require("express");
const {
  getObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject,
} = require("../controllers/objectController");
const { protect, authorize } = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router();

router
  .route("/")
  .get(protect, getObjects)
  .post(
    protect,
    authorize(["Admin", "User"]),
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("projectId").isInt().withMessage("Project ID must be an integer"),
    ],
    createObject
  );

router
  .route("/:id")
  .get(protect, getObjectById)
  .put(
    protect,
    authorize(["Admin", "User"]),
    [
      body("name").optional().notEmpty().withMessage("Name cannot be empty"),
      body("projectId")
        .optional()
        .isInt()
        .withMessage("Project ID must be an integer"),
    ],
    updateObject
  )
  .delete(protect, authorize(["Admin", "User"]), deleteObject);

module.exports = router;
