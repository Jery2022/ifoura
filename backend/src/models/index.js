const sequelize = require("../config/database");
const User = require("./user");
const Owner = require("./owner");
const Project = require("./project");
const Object = require("./object");
const Entry = require("./entry");
const Expense = require("./expense");

// Synchroniser tous les modèles avec la base de données
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // `force: true` pour recréer les tables à chaque démarrage
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

module.exports = {
  sequelize,
  User,
  Owner,
  Project,
  Object,
  Entry,
  Expense,
  syncDatabase,
};
