const Object = require("../models/object");
const Project = require("../models/project");
const { validationResult } = require("express-validator");

// @desc    Get all objects
// @route   GET /api/objects
// @access  Private (Admin, User)
const getObjects = async (req, res) => {
  try {
    const objects = await Object.findAll({
      include: [{ model: Project, attributes: ["name"] }],
    });
    res.status(200).json(objects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single object
// @route   GET /api/objects/:id
// @access  Private (Admin, User)
const getObjectById = async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id, {
      include: [{ model: Project, attributes: ["name"] }],
    });

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    res.status(200).json(object);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new object
// @route   POST /api/objects
// @access  Private (Admin, User)
const createObject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, initialBudget, projectId } = req.body;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const object = await Object.create({
      name,
      description,
      initialBudget,
      projectId,
    });
    res.status(201).json(object);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update object
// @route   PUT /api/objects/:id
// @access  Private (Admin, User)
const updateObject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, initialBudget, projectId } = req.body;

  try {
    const object = await Object.findByPk(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      object.projectId = projectId;
    }

    object.name = name || object.name;
    object.description = description || object.description;
    object.initialBudget = initialBudget || object.initialBudget;

    await object.save();
    res.status(200).json(object);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete object
// @route   DELETE /api/objects/:id
// @access  Private (Admin, User)
const deleteObject = async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    await object.destroy();
    res.status(200).json({ message: "Object removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject,
};
