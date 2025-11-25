const express = require("express");
const {
  generateObjectReport,
  exportObjectReportPdf,
  exportObjectReportDocx,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/object/:objectId")
  .get(protect, authorize(["Admin", "User"]), generateObjectReport);

router
  .route("/object/:objectId/pdf")
  .get(protect, authorize(["Admin", "User"]), exportObjectReportPdf);

router
  .route("/object/:objectId/docx")
  .get(protect, authorize(["Admin", "User"]), exportObjectReportDocx);

module.exports = router;
