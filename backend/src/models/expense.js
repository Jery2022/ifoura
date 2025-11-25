const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Object = require("./object");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  justification: {
    type: DataTypes.STRING,
  },
  objectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Object,
      key: "id",
    },
    allowNull: false,
  },
});

Object.hasMany(Expense, { foreignKey: "objectId" });
Expense.belongsTo(Object, { foreignKey: "objectId" });

module.exports = Expense;
