import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebarOptions } from "../utilities/sideBarData";
import PatientEntry from "../pages/PatientEntry";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeOption,
  setActiveOption,
}) => {
  const location = useLocation();

  useEffect(() => {
    setActiveOption(location.pathname);
  }, [location.pathname, setActiveOption]);

  return (
    <React.Fragment>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 bg-gray-800 text-white absolute top-4 left-4 rounded-md hover:bg-gray-700 z-444"
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-6 px-4 overflow-y-scroll h-screen custom-scrollbar transition-all duration-300 z-100 ${
          isSidebarOpen ? "w-[20%]" : "w-0"
        }`}
      >
        {isSidebarOpen && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-center">ADMIN</h2>
            <div className="border-b border-gray-500 mb-4"></div>
            <ul className="space-y-2">
              {sidebarOptions.map((option) => (
                <li key={option.path}>
                  <Link
                    to={option.path}
                    className={`flex items-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${
                      activeOption === option.path
                        ? "bg-primary text-white"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveOption(option.path)}
                  >
                    {option.icon}
                    <span>{option.name}</span>
                  </Link>
                  <div className="border-t border-gray-600"></div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
