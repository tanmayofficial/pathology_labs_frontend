import React from 'react'
import { Line } from "react-chartjs-2";
import { Calendar, Filter } from "lucide-react";
import { Card, CardContent } from "@mui/material";

const Dashboard = ({ data, setData, chartData }) => {
  return (
    <div className="bg-gray-200 mx-auto px-6 py-4 mt-[70px]">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <button className="flex items-center bg-gray-200 px-3 py-2 rounded-md">
              <Filter className="w-5 h-5 mr-2" /> Filter
            </button>
            <div className="flex items-center bg-gray-200 px-3 py-2 rounded-md">
              <Calendar className="w-5 h-5 mr-2" />
              <span>2022/07/20 - 2022/07/20</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {[
              "Tests",
              "Cultures",
              "Antibiotics",
              "Patients",
              "Contracts",
              "Home Visits",
              "Pending Tests",
              "Completed Tests",
              "Pending Cultures",
              "Completed Cultures",
            ].map((label, index) => (
              <Card key={index} className="p-4 text-center shadow-md bg-white">
                <CardContent>
                  <h3 className="text-lg font-semibold">
                    {Object.values(data)[index]}
                  </h3>
                  <p className="text-gray-600">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold mb-4">Income Statistics</h3>
            <div className="flex items-center space-x-4">
              <input type="month" className="border px-3 py-2 rounded-md" />
              <select className="border px-3 py-2 rounded-md">
                <option>All Branches</option>
              </select>
            </div>
            <div className="mt-6">
              <Line data={chartData} />
            </div>
          </div>
        </div>
  )
}

export default Dashboard