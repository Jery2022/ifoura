const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router();

router
  .route("/")
  .get(protect, getProjects)
  .post(
    protect,
    authorize("Admin"),
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("ownerId").isInt().withMessage("Owner ID must be an integer"),
    ],
    createProject
  );

router
  .route("/:id")
  .get(protect, getProjectById)
  .put(
    protect,
    authorize("Admin"),
    [
      body("name").optional().notEmpty().withMessage("Name cannot be empty"),
      body("ownerId")
        .optional()
        .isInt()
        .withMessage("Owner ID must be an integer"),
    ],
    updateProject
  )
  .delete(protect, authorize("Admin"), deleteProject);

module.exports = router;
