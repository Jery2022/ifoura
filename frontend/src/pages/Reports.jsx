import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../hooks/useTheme";

const Reports = () => {
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await axios.get("/api/objects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setObjects(response.data);
      } catch (err) {
        setError("Failed to fetch objects for report");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchObjects();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedObject) {
      setError("Please select an object to generate a report.");
      setReportData(null);
      return;
    }
    setError("");
    try {
      const response = await axios.get(
        `/api/reports/object/${selectedObject}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReportData(response.data);
    } catch (err) {
      setError("Failed to generate report");
      console.error(err);
      setReportData(null);
    }
  };

  const handleExportPdf = async () => {
    if (!selectedObject) {
      setError("Please select an object to export a PDF report.");
      return;
    }
    try {
      const response = await axios.get(
        `/api/reports/object/${selectedObject}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob", // Important for downloading files
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${selectedObject}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to export PDF report");
      console.error(err);
    }
  };

  const handleExportDocx = async () => {
    if (!selectedObject) {
      setError("Please select an object to export a DOCX report.");
      return;
    }
    try {
      const response = await axios.get(
        `/api/reports/object/${selectedObject}/docx`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob", // Important for downloading files
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${selectedObject}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to export DOCX report");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen p-4 ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-4 ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="object-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Object:
          </label>
          <select
            id="object-select"
            value={selectedObject}
            onChange={(e) => setSelectedObject(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select an Object --</option>
            {objects.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.name} (Project: {obj.Project ? obj.Project.name : "N/A"})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerateReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm mr-2"
        >
          Generate Report
        </button>
        <button
          onClick={handleExportPdf}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm mr-2"
        >
          Export PDF
        </button>
        <button
          onClick={handleExportDocx}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          Export DOCX
        </button>
      </div>

      {reportData && (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Report Details</h2>
          <p>
            <strong>Propriétaire:</strong> {reportData.ownerName}
          </p>
          <p>
            <strong>Projet:</strong> {reportData.projectName}
          </p>
          <p>
            <strong>Objet:</strong> {reportData.objectName}
          </p>
          <p>
            <strong>Avances perçues:</strong> {reportData.totalEntries} F CFA
          </p>
          <h3 className="text-lg font-semibold mt-4">
            Dépenses par catégorie:
          </h3>
          <ul className="list-disc list-inside ml-4">
            {reportData.expensesByCategory.map((exp, index) => (
              <li key={index}>
                {exp.category}: {exp.amount} F CFA
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <strong>Total dépenses:</strong> {reportData.totalExpenses} F CFA
          </p>
          <p>
            <strong>Solde:</strong> {reportData.balance} F CFA
          </p>
          <p>
            <strong>Statut:</strong> {reportData.status}
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
