const express = require("express");
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect, authorize } = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router({ mergeParams: true }); // mergeParams pour accéder à objectId

router
  .route("/")
  .get(protect, getExpenses)
  .post(
    protect,
    authorize(["Admin", "User"]),
    [
      body("category").notEmpty().withMessage("Category is required"),
      body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number"),
      body("date")
        .isISO8601()
        .toDate()
        .withMessage("Please provide a valid date"),
    ],
    createExpense
  );

router
  .route("/:id")
  .get(protect, getExpenseById)
  .put(
    protect,
    authorize(["Admin", "User"]),
    [
      body("category")
        .optional()
        .notEmpty()
        .withMessage("Category cannot be empty"),
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
    updateExpense
  )
  .delete(protect, authorize(["Admin", "User"]), deleteExpense);

module.exports = router;
