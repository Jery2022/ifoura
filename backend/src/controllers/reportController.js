const { Op } = require("sequelize");
const { Owner, Project, Object, Entry, Expense } = require("../models");
const {
  generatePdfReport,
  generateDocxReport,
} = require("../utils/reportGenerator");
const path = require("path");

// @desc    Generate a financial report for a given object
// @route   GET /api/reports/object/:objectId
// @access  Private (Admin, User)
const generateObjectReport = async (req, res) => {
  try {
    const { objectId } = req.params;

    const object = await Object.findByPk(objectId, {
      include: [
        {
          model: Project,
          include: [{ model: Owner }],
        },
        { model: Entry },
        { model: Expense },
      ],
    });

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    const totalEntries = object.Entries.reduce(
      (sum, entry) => sum + parseFloat(entry.amount),
      0
    );
    const totalExpenses = object.Expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    const balance = totalEntries - totalExpenses;

    const expensesByCategory = object.Expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(expense.amount);
      return acc;
    }, {});

    const formattedExpensesByCategory = Object.keys(expensesByCategory).map(
      (category) => ({
        category,
        amount: expensesByCategory[category],
      })
    );

    let status = "";
    if (balance > 0) {
      status = `Trop perçu à reverser (${balance} F CFA)`;
    } else if (balance < 0) {
      status = `Trop dépensé à justifier (${Math.abs(balance)} F CFA)`;
    } else {
      status = "Solde équilibré";
    }

    const reportData = {
      ownerName: object.Project.Owner.name,
      projectName: object.Project.name,
      objectName: object.name,
      totalEntries: totalEntries.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      balance: balance.toFixed(2),
      expensesByCategory: formattedExpensesByCategory,
      status,
    };

    res.status(200).json(reportData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Export a financial report for a given object as PDF
// @route   GET /api/reports/object/:objectId/pdf
// @access  Private (Admin, User)
const exportObjectReportPdf = async (req, res) => {
  try {
    const { objectId } = req.params;

    const object = await Object.findByPk(objectId, {
      include: [
        {
          model: Project,
          include: [{ model: Owner }],
        },
        { model: Entry },
        { model: Expense },
      ],
    });

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    const totalEntries = object.Entries.reduce(
      (sum, entry) => sum + parseFloat(entry.amount),
      0
    );
    const totalExpenses = object.Expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    const balance = totalEntries - totalExpenses;

    const expensesByCategory = object.Expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(expense.amount);
      return acc;
    }, {});

    const formattedExpensesByCategory = Object.keys(expensesByCategory).map(
      (category) => ({
        category,
        amount: expensesByCategory[category],
      })
    );

    let status = "";
    if (balance > 0) {
      status = `Trop perçu à reverser (${balance} F CFA)`;
    } else if (balance < 0) {
      status = `Trop dépensé à justifier (${Math.abs(balance)} F CFA)`;
    } else {
      status = "Solde équilibré";
    }

    const reportData = {
      ownerName: object.Project.Owner.name,
      projectName: object.Project.name,
      objectName: object.name,
      totalEntries: totalEntries.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      balance: balance.toFixed(2),
      expensesByCategory: formattedExpensesByCategory,
      status,
    };

    const outputPath = path.join(
      __dirname,
      `../../reports/report-${objectId}.pdf`
    );
    await generatePdfReport(reportData, outputPath);

    res.download(outputPath, `report-${objectId}.pdf`, (err) => {
      if (err) {
        console.error("Error downloading PDF:", err);
        res.status(500).json({ message: "Error downloading PDF" });
      }
      fs.unlinkSync(outputPath); // Supprimer le fichier après l'envoi
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Export a financial report for a given object as DOCX
// @route   GET /api/reports/object/:objectId/docx
// @access  Private (Admin, User)
const exportObjectReportDocx = async (req, res) => {
  try {
    const { objectId } = req.params;

    const object = await Object.findByPk(objectId, {
      include: [
        {
          model: Project,
          include: [{ model: Owner }],
        },
        { model: Entry },
        { model: Expense },
      ],
    });

    if (!object) {
      return res.status(404).json({ message: "Object not found" });
    }

    const totalEntries = object.Entries.reduce(
      (sum, entry) => sum + parseFloat(entry.amount),
      0
    );
    const totalExpenses = object.Expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    const balance = totalEntries - totalExpenses;

    const expensesByCategory = object.Expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(expense.amount);
      return acc;
    }, {});

    const formattedExpensesByCategory = Object.keys(expensesByCategory).map(
      (category) => ({
        category,
        amount: expensesByCategory[category],
      })
    );

    let status = "";
    if (balance > 0) {
      status = `Trop perçu à reverser (${balance} F CFA)`;
    } else if (balance < 0) {
      status = `Trop dépensé à justifier (${Math.abs(balance)} F CFA)`;
    } else {
      status = "Solde équilibré";
    }

    const reportData = {
      ownerName: object.Project.Owner.name,
      projectName: object.Project.name,
      objectName: object.name,
      totalEntries: totalEntries.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      balance: balance.toFixed(2),
      expensesByCategory: formattedExpensesByCategory,
      status,
    };

    const outputPath = path.join(
      __dirname,
      `../../reports/report-${objectId}.docx`
    );
    await generateDocxReport(reportData, outputPath);

    res.download(outputPath, `report-${objectId}.docx`, (err) => {
      if (err) {
        console.error("Error downloading DOCX:", err);
        res.status(500).json({ message: "Error downloading DOCX" });
      }
      fs.unlinkSync(outputPath); // Supprimer le fichier après l'envoi
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  generateObjectReport,
  exportObjectReportPdf,
  exportObjectReportDocx,
};
