const PDFDocument = require("pdfkit");
const docx = require("docx");
const fs = require("fs");
const path = require("path");

const {
  Document,
  Paragraph,
  Packer,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} = docx;

const generatePdfReport = (reportData, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(20).text("Rapport Comptable", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Propriétaire: ${reportData.ownerName}`);
    doc.text(`Projet: ${reportData.projectName}`);
    doc.text(`Objet: ${reportData.objectName}`);
    doc.text(`Avances perçues: ${reportData.totalEntries} F CFA`);
    doc.moveDown();

    doc.fontSize(16).text("Dépenses par catégorie:", { underline: true });
    doc.moveDown();

    reportData.expensesByCategory.forEach((exp) => {
      doc.text(`- ${exp.category}: ${exp.amount} F CFA`);
    });
    doc.moveDown();

    doc.fontSize(14).text(`Total dépenses: ${reportData.totalExpenses} F CFA`);
    doc.text(`Solde: ${reportData.balance} F CFA`);
    doc.text(`Statut: ${reportData.status}`);
    doc.moveDown();

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
};

const generateDocxReport = async (reportData, outputPath) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Rapport Comptable",
                size: 40,
                bold: true,
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Propriétaire: ${reportData.ownerName}`,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Projet: ${reportData.projectName}`,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Objet: ${reportData.objectName}`,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Avances perçues: ${reportData.totalEntries} F CFA`,
                size: 28,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Dépenses par catégorie:",
                size: 32,
                underline: {},
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Catégorie")],
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 10 },
                      bottom: { style: BorderStyle.SINGLE, size: 10 },
                      left: { style: BorderStyle.SINGLE, size: 10 },
                      right: { style: BorderStyle.SINGLE, size: 10 },
                    },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph("Montant (F CFA)")],
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 10 },
                      bottom: { style: BorderStyle.SINGLE, size: 10 },
                      left: { style: BorderStyle.SINGLE, size: 10 },
                      right: { style: BorderStyle.SINGLE, size: 10 },
                    },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              ...reportData.expensesByCategory.map(
                (exp) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(exp.category)],
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 10 },
                          bottom: { style: BorderStyle.SINGLE, size: 10 },
                          left: { style: BorderStyle.SINGLE, size: 10 },
                          right: { style: BorderStyle.SINGLE, size: 10 },
                        },
                      }),
                      new TableCell({
                        children: [new Paragraph(exp.amount.toString())],
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 10 },
                          bottom: { style: BorderStyle.SINGLE, size: 10 },
                          left: { style: BorderStyle.SINGLE, size: 10 },
                          right: { style: BorderStyle.SINGLE, size: 10 },
                        },
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total dépenses: ${reportData.totalExpenses} F CFA`,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Solde: ${reportData.balance} F CFA`,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Statut: ${reportData.status}`, size: 28 }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
};

module.exports = {
  generatePdfReport,
  generateDocxReport,
};
