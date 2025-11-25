import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../hooks/useTheme";

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get("/api/owners", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assurez-vous que le token est stocké
          },
        });
        setOwners(response.data);
      } catch (err) {
        setError("Failed to fetch owners");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen p-4 ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        Loading owners...
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
      <h1 className="text-3xl font-bold mb-6">Owners</h1>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">List of Owners</h2>
        {owners.length === 0 ? (
          <p>No owners found.</p>
        ) : (
          <ul className="space-y-4">
            {owners.map((owner) => (
              <li
                key={owner.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-md"
              >
                <h3 className="text-lg font-semibold">{owner.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {owner.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {owner.address}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {owner.phone}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Owners;
