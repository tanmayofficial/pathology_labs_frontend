import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeOption, setActiveOption] = useState(location.pathname);

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-[80%]" : "w-full"
        } bg-gray-100 h-screen overflow-y-auto`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeOption={activeOption}
          setActiveOption={setActiveOption}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
