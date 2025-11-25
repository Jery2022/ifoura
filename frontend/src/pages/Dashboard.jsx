import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {currentUser ? (
        <p className="text-lg">Welcome, {currentUser.email}!</p>
      ) : (
        <p className="text-lg">Please log in to view the dashboard.</p>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for dashboard widgets */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Owners</h2>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Projects</h2>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Objects</h2>
          <p className="text-3xl font-bold">25</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Entries</h2>
          <p className="text-3xl font-bold">150</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Expenses</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overall Balance</h2>
          <p className="text-3xl font-bold text-green-500">$30,000</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
