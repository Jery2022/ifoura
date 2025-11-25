const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Owner = require("./owner");

const Project = sequelize.define("Project", {
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
  ownerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Owner,
      key: "id",
    },
    allowNull: false,
  },
});

Owner.hasMany(Project, { foreignKey: "ownerId" });
Project.belongsTo(Owner, { foreignKey: "ownerId" });

module.exports = Project;
