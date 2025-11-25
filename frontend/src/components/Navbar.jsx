import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Ifoura App
        </Link>
        <div className="flex items-center space-x-4">
          {currentUser && (
            <>
              <Link to="/owners" className="hover:text-gray-300">
                Propriétaires
              </Link>
              <Link to="/projects" className="hover:text-gray-300">
                Projets
              </Link>
              <Link to="/objects" className="hover:text-gray-300">
                Objets
              </Link>
              <Link to="/reports" className="hover:text-gray-300">
                Rapports
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-700 dark:bg-gray-600"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
