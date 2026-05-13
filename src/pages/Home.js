import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const location = useLocation();
  const [activeOption, setActiveOption] = useState(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [data, setData] = useState({
    tests: 5,
    cultures: 2,
    antibiotics: 1,
    patients: 8,
    contracts: 3,
    homeVisits: 4,
    pendingTests: 2,
    completedTests: 3,
    pendingCultures: 1,
    completedCultures: 1,
  });

  const [incomeStats, setIncomeStats] = useState({
    income: [1, 2, 3, 4, 5, 6, 7],
    expenses: [0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    purchases: [0.2, 0.5, 0.7, 1, 1.2, 1.5, 2],
    profit: [0.5, 1, 1.8, 2.5, 3.3, 4.5, 5],
  });

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      { label: "Income", data: incomeStats.income, borderColor: "#00bcd4" },
      { label: "Expenses", data: incomeStats.expenses, borderColor: "#f44336" },
      {
        label: "Purchases",
        data: incomeStats.purchases,
        borderColor: "#673ab7",
      },
      { label: "Profit", data: incomeStats.profit, borderColor: "#4caf50" },
    ],
  };

  return (
    <div className="bg-gray-100 ">
      {/* Sidebar */}
      {/* <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      /> */}

      {/* Main Content */}
      {/* <div
        className={`transition-all duration-300 ${isSidebarOpen ? "w-[100%]" : "w-full"} bg-gray-100 h-screen overflow-y-auto`}
      > */}
        {/* <Navbar isSidebarOpen={isSidebarOpen} /> */}
        <Dashboard data={data} setData={setData} chartData={chartData} />
      {/* </div> */}
    </div>
  );
};

export default Home;
