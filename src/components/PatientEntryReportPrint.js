import React, { forwardRef } from "react";
import moment from "moment";

const PatientEntryReportPrint = forwardRef(
  ({ reportData, fromDate, toDate }, ref) => {
    // console.log("reportData", reportData);
    // console.log("ref: ", ref);
    return (
      <div
        ref={ref}
        className="p-3 w-[210mm] h-[297mm] mx-auto bg-white text-black overflow-hidden"
      >
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">Patient Entry Report</h1>
          <p className="text-lg">
            From: {fromDate ? moment(fromDate).format("DD/MM/YYYY") : "-"} To:
            {toDate ? moment(toDate).format("DD/MM/YYYY") : "-"}
          </p>
        </div>

        <table className="w-full border-collapse border border-gray-800 text-xs">
          <thead>
            <tr className="bg-gray-200">
              {[
                "Date",
                "Lab No.",
                "Patient No.",
                "Title",
                "Patient Name",
                "Age",
                "Gender",
                "Total Cost",
                "Extra Charges",
                "Discount",
                "Advance",
                "Net Balance",
                "Ledger",
                "Payment Status",
                "Due Amount",
              ].map((header, index) => (
                <th key={index} className="border border-gray-800 px-1 py-1">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData?.length > 0 ? (
              reportData.map((entry, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.date || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.labNo || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.paitentNo || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.title || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.paitent?.name || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.age || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.gender || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.totalCost || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.extraCharges || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.discount || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.advance || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.netBlance || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.ledger?.name || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.paymentStatus || "-"}
                  </td>
                  <td className="border border-gray-800 px-1 py-1 text-center">
                    {entry.due || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center py-3">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between font-bold text-lg">
        <p>Total Cost: {reportData.reduce((acc, item) => acc + item.totalCost, 0)}</p>
        <p>Total Due: {reportData.reduce((acc, item) => acc + item.due, 0)}</p>
      </div>
      </div>
    );
  }
);

export default PatientEntryReportPrint;
