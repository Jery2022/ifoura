import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../hooks/useTheme";
import { Link, useLocation } from "react-router-dom";

const Objects = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("projectId");

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await axios.get("/api/objects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        let filteredObjects = response.data;
        if (projectId) {
          filteredObjects = response.data.filter(
            (obj) => obj.projectId === parseInt(projectId)
          );
        }
        setObjects(filteredObjects);
      } catch (err) {
        setError("Failed to fetch objects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchObjects();
  }, [projectId]);

  if (loading) {
    return (
      <div
        className={`min-h-screen p-4 ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        Loading objects...
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
      <h1 className="text-3xl font-bold mb-6">Objects</h1>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">List of Objects</h2>
        {objects.length === 0 ? (
          <p>No objects found.</p>
        ) : (
          <ul className="space-y-4">
            {objects.map((object) => (
              <li
                key={object.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-md"
              >
                <h3 className="text-lg font-semibold">{object.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {object.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Initial Budget: {object.initialBudget} F CFA
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Project: {object.Project ? object.Project.name : "N/A"}
                </p>
                <div className="flex space-x-4 mt-2">
                  <Link
                    to={`/objects/${object.id}/entries`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    View Entries
                  </Link>
                  <Link
                    to={`/objects/${object.id}/expenses`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    View Expenses
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Objects;
