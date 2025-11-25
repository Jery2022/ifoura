const Owner = require("../models/owner");
const { validationResult } = require("express-validator");

// @desc    Get all owners
// @route   GET /api/owners
// @access  Private (Admin)
const getOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll();
    res.status(200).json(owners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single owner
// @route   GET /api/owners/:id
// @access  Private (Admin)
const getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json(owner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new owner
// @route   POST /api/owners
// @access  Private (Admin)
const createOwner = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, address, phone } = req.body;

  try {
    const owner = await Owner.create({ name, description, address, phone });
    res.status(201).json(owner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update owner
// @route   PUT /api/owners/:id
// @access  Private (Admin)
const updateOwner = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, address, phone } = req.body;

  try {
    const owner = await Owner.findByPk(req.params.id);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    owner.name = name || owner.name;
    owner.description = description || owner.description;
    owner.address = address || owner.address;
    owner.phone = phone || owner.phone;

    await owner.save();
    res.status(200).json(owner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete owner
// @route   DELETE /api/owners/:id
// @access  Private (Admin)
const deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    await owner.destroy();
    res.status(200).json({ message: "Owner removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOwners,
  getOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
};
