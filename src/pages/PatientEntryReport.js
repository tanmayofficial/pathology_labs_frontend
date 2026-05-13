import React, { useEffect, useRef, useState } from "react";
import GoBack from "../components/GoBack";
import moment from "moment";
import {
  getAllPatientEntryReport,
  getPatientTestDetails,
} from "../services/patientService";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import PatientEntryReportPrint from "../components/PatientEntryReportPrint";
import { useReactToPrint } from "react-to-print";
import TestDetailsModal from "../components/TestDetailsModal";
import { axiosInstance } from "../utilities/axiosInstance";
import * as XLSX from "xlsx";

const PatientEntryReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [totalReportData, setTotalReportData] = useState(0);
  const [totalOfData, setTotalOfData] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [testDetails, setTestDetails] = useState([]);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  console.log(totalReportData);

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(`/paitent-entry/get-all`, {
        params: {
          fromDate,
          toDate,
          paitentSearch: searchTerm,
          excelReports: true,
        },
      });
      console.log("Exporting...", response?.data?.data?.items);

      if (response?.data?.data?.items?.length > 0) {
        const formattedData = response.data.data.items.map((entry) => ({
          "Patient No": entry.paitentNo,
          Date: entry.date,
          "Lab No": entry.labNo,
          Title: entry.title,
          "Patient Name": entry.paitent?.name || "N/A",
          Age: entry.age,
          Gender: entry.gender,
          "Total Cost": entry.totalCost,
          "Extra Charges": entry.extraCharges,
          Discount: entry.discount,
          Advance: entry.advance,
          "Net Balance": entry.netBlance,
          Ledger: entry.ledger?.name || "N/A",
          "Payment Status": entry.paymentStatus,
          "Due Amount": entry.due,
        }));

        formattedData.push({
          "Patient No": "Total",
          Date: "",
          "Lab No": "",
          Title: "",
          "Patient Name": "",
          Age: "",
          Gender: "",
          "Total Cost": response?.data?.data?.totalOf?.totalCost || 0,
          "Extra Charges": response?.data?.data?.totalOf?.extraCharges || 0,
          Discount: response?.data?.data?.totalOf?.discount || 0,
          Advance: response?.data?.data?.totalOf?.advance || 0,
          "Net Balance": response?.data?.data?.totalOf?.netBlance || 0,
          Ledger: "",
          "Payment Status": "",
          "Due Amount": response?.data?.data?.totalOf?.due || 0,
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Entries");

        XLSX.writeFile(workbook, "Patient_Entry_Report.xlsx");

        toast.success("Excel exported successfully!");
      } else {
        toast.error("No data available for export!");
      }
    } catch (error) {
      console.error("Error while exporting report", error);
      toast.error(error?.response?.data?.message || "Error exporting report!");
    }
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
    setReportData([]);
  };

  const fetchReportData = async () => {
    const formattedFromDate = fromDate
      ? moment(fromDate).format("DD/MM/YYYY")
      : "";
    const formattedToDate = toDate ? moment(toDate).format("DD/MM/YYYY") : "";

    const payload = {
      searchTerm,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      pageSize,
    };

    try {
      setIsLoading(true);
      const response = await getAllPatientEntryReport(payload);

      if (response?.data?.data?.items) {
        setReportData(response.data.data.items || []);
        setTotalReportData(response?.data?.data?.totalItems || 0);
        setTotalOfData(response?.data?.data?.totalOf || 0);
      } else {
        setReportData([]);
        setTotalReportData(0);
        setTotalOfData(0);
        toast.error(response.data.message || "No data found!");
      }
    } catch (err) {
      toast.error("Problem fetching patient entry report!");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    fetchReportData();
  };

  const handleLoadMore = () => {
    if (pageSize < totalReportData) {
      setPageSize((prev) => prev + 30);
    }
  };

  const handleViewDetails = async (patientId) => {
    try {
      const response = await getPatientTestDetails(patientId);
      console.log("response: ", response);
      if (response.status === 200) {
        setTestDetails(response.data.data.testId);
        setModalOpen(true);
      } else {
        toast.error("Failed to fetch test details");
      }
    } catch (error) {
      toast.error("Error fetching test details");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!fromDate && !toDate && !searchTerm) {
      fetchReportData();
    }
  }, [fromDate, toDate, searchTerm]);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Patient Entry Report
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-100 p-4 rounded-lg shadow text-black">
          <input
            type="date"
            className="border rounded p-2 w-[280px]"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2 w-[280px]"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <input
            type="text"
            className="border rounded p-2 w-[280px]"
            placeholder="Search Patient No."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          >
            Clear
          </button>

          <button
            className="px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600"
            onClick={handleExport}
          >
            Export
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>

        {/* Report Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={50} color="#e94560" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full border border-gray-300">
                <thead className="sticky top-0 bg-gray-100 shadow-md z-100">
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Lab No.
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Patient No.
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Title
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Patient Name
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Age
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Gender
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Total Cost
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Extra Charges
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Discount
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Advance
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Net Balance
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Ledger
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Payment Status
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Due Amount
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.length > 0 ? (
                    reportData?.map((entry, index) => (
                      <tr
                        key={entry._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.labNo}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.paitentNo}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.title}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.paitent?.name || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.age}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.gender}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.totalCost}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.extraCharges}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.discount}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.advance}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.netBlance}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.ledger?.name || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.paymentStatus}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {entry.due}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(entry._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="15" className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={pageSize >= totalReportData}
              className={`px-4 py-2 rounded-lg text-white ${
                pageSize >= totalReportData
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pageSize >= totalReportData ? "No More Data" : "Load More..."}
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-6 p-4 gap-2 bg-gray-100 rounded-lg shadow flex justify-between text-black">
          <div>
            <span className="font-bold">Total Cost: </span>
            <span>{totalOfData.totalCost || 0}</span>
          </div>
          <div>
            <span className="font-bold">T. Ex. Charges: </span>
            <span>{totalOfData?.extraCharges || 0}</span>
          </div>
          <div>
            <span className="font-bold">Total Discount: </span>
            <span>{totalOfData?.discount || 0}</span>
          </div>
          <div>
            <span className="font-bold">Total Advance: </span>
            <span>{totalOfData?.advance || 0}</span>
          </div>
          <div>
            <span className="font-bold">T. N. Bal.: </span>
            <span>{totalOfData?.netBlance || 0}</span>
          </div>
          <div>
            <span className="font-bold">Total Due: </span>
            <span>{totalOfData?.due || 0}</span>
          </div>
        </div>

        {modalOpen && (
          <TestDetailsModal
            testDetails={testDetails}
            setModalOpen={setModalOpen}
          />
        )}

        {/* Print Component (Hidden) */}
        <div style={{ display: "none" }}>
          <PatientEntryReportPrint
            ref={printRef}
            reportData={reportData}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientEntryReport;
