import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../hooks/useTheme";
import { useParams } from "react-router-dom";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const { objectId } = useParams();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`/api/objects/${objectId}/expenses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setExpenses(response.data);
      } catch (err) {
        setError("Failed to fetch expenses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [objectId]);

  if (loading) {
    return (
      <div
        className={`min-h-screen p-4 ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        Loading expenses...
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
      <h1 className="text-3xl font-bold mb-6">
        Expenses for Object {objectId}
      </h1>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">List of Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses found for this object.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-md"
              >
                <h3 className="text-lg font-semibold">
                  Category: {expense.category}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Amount: {expense.amount} F CFA
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Date: {new Date(expense.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Justification: {expense.justification}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Expenses;
