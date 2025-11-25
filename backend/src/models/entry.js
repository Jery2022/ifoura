const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Object = require("./object");

const Entry = sequelize.define("Entry", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  source: {
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

Object.hasMany(Entry, { foreignKey: "objectId" });
Entry.belongsTo(Object, { foreignKey: "objectId" });

module.exports = Entry;
