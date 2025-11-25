const Entry = require("../models/entry");
const Object = require("../models/object");
const { validationResult } = require("express-validator");

// @desc    Get all entries for an object
// @route   GET /api/objects/:objectId/entries
// @access  Private (Admin, User)
const getEntries = async (req, res) => {
  try {
    const entries = await Entry.findAll({
      where: { objectId: req.params.objectId },
      include: [{ model: Object, attributes: ["name"] }],
    });
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single entry
// @route   GET /api/entries/:id
// @access  Private (Admin, User)
const getEntryById = async (req, res) => {
  try {
    const entry = await Entry.findByPk(req.params.id, {
      include: [{ model: Object, attributes: ["name"] }],
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new entry
// @route   POST /api/objects/:objectId/entries
// @access  Private (Admin, User)
const createEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, date, source } = req.body;
  const { objectId } = req.params;

  try {
    const object = await Object.findByPk(objectId);
    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    const entry = await Entry.create({ amount, date, source, objectId });
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update entry
// @route   PUT /api/entries/:id
// @access  Private (Admin, User)
const updateEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, date, source } = req.body;

  try {
    const entry = await Entry.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    entry.amount = amount || entry.amount;
    entry.date = date || entry.date;
    entry.source = source || entry.source;

    await entry.save();
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete entry
// @route   DELETE /api/entries/:id
// @access  Private (Admin, User)
const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await entry.destroy();
    res.status(200).json({ message: "Entry removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
};
