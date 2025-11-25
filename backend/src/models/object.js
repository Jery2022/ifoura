const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Project = require("./project");

const Object = sequelize.define("Object", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  initialBudget: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  projectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: "id",
    },
    allowNull: false,
  },
});

Project.hasMany(Object, { foreignKey: "projectId" });
Object.belongsTo(Project, { foreignKey: "projectId" });

module.exports = Object;
