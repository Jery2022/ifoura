const express = require("express");
const {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
} = require("../controllers/entryController");
const { protect, authorize } = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router({ mergeParams: true }); // mergeParams pour accéder à objectId

router
  .route("/")
  .get(protect, getEntries)
  .post(
    protect,
    authorize(["Admin", "User"]),
    [
      body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number"),
      body("date")
        .isISO8601()
        .toDate()
        .withMessage("Please provide a valid date"),
    ],
    createEntry
  );

router
  .route("/:id")
  .get(protect, getEntryById)
  .put(
    protect,
    authorize(["Admin", "User"]),
    [
      body("amount")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number"),
      body("date")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Please provide a valid date"),
    ],
    updateEntry
  )
  .delete(protect, authorize(["Admin", "User"]), deleteEntry);

module.exports = router;
