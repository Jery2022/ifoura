const Project = require("../models/project");
const Owner = require("../models/owner");
const { validationResult } = require("express-validator");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Admin, User)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Owner, attributes: ["name"] }],
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private (Admin, User)
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Owner, attributes: ["name"] }],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, initialBudget, ownerId } = req.body;

  try {
    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const project = await Project.create({
      name,
      description,
      initialBudget,
      ownerId,
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, initialBudget, ownerId } = req.body;

  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (ownerId) {
      const owner = await Owner.findByPk(ownerId);
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      project.ownerId = ownerId;
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.initialBudget = initialBudget || project.initialBudget;

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();
    res.status(200).json({ message: "Project removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
