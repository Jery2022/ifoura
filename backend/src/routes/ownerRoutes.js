const express = require("express");
const {
  getOwners,
  getOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
} = require("../controllers/ownerController");
const { protect, authorize } = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("Admin"), getOwners)
  .post(
    protect,
    authorize("Admin"),
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("address").notEmpty().withMessage("Address is required"),
      body("phone").notEmpty().withMessage("Phone number is required"),
    ],
    createOwner
  );

router
  .route("/:id")
  .get(protect, authorize("Admin"), getOwnerById)
  .put(
    protect,
    authorize("Admin"),
    [
      body("name").optional().notEmpty().withMessage("Name cannot be empty"),
      body("address")
        .optional()
        .notEmpty()
        .withMessage("Address cannot be empty"),
      body("phone")
        .optional()
        .notEmpty()
        .withMessage("Phone number cannot be empty"),
    ],
    updateOwner
  )
  .delete(protect, authorize("Admin"), deleteOwner);

module.exports = router;
