const Expense = require("../models/expense");
const Object = require("../models/object");
const { validationResult } = require("express-validator");

// @desc    Get all expenses for an object
// @route   GET /api/objects/:objectId/expenses
// @access  Private (Admin, User)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { objectId: req.params.objectId },
      include: [{ model: Object, attributes: ["name"] }],
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private (Admin, User)
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [{ model: Object, attributes: ["name"] }],
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new expense
// @route   POST /api/objects/:objectId/expenses
// @access  Private (Admin, User)
const createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, amount, date, justification } = req.body;
  const { objectId } = req.params;

  try {
    const object = await Object.findByPk(objectId);
    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    const expense = await Expense.create({
      category,
      amount,
      date,
      justification,
      objectId,
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private (Admin, User)
const updateExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, amount, date, justification } = req.body;

  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.category = category || expense.category;
    expense.amount = amount || expense.amount;
    expense.date = date || expense.date;
    expense.justification = justification || expense.justification;

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Admin, User)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();
    res.status(200).json({ message: "Expense removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
