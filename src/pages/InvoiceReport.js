import React, { useEffect, useState } from "react";
import GoBack from "../components/GoBack";
import { invoiceData } from "../utilities/invoiceData";
import { getPatientInvoiceEntries } from "../services/patientService";
import moment from "moment/moment";
import { ClipLoader } from "react-spinners";

const InvoiceReport = () => {
  const [visibleRows, setVisibleRows] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEntries, setPatientEntries] = useState([]);
  const [pageSizes, setPageSizes] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [patientEntriesTotals, setPatientEntriesTotals] = useState({});

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 10);
    setPageSizes((prev) => prev + 10);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setPatientName("");
    setPatientEntries([]);
    setPatientEntriesTotals({});
  };

  const fetchPatientEntries = async () => {
    const formattedFromDate = fromDate
      ? moment(fromDate).format("DD/MM/YYYY")
      : "";
    const formattedToDate = toDate ? moment(toDate).format("DD/MM/YYYY") : "";

    setIsLoading(true);
    try {
      const response = await getPatientInvoiceEntries({
        page: 1,
        pageSize: pageSizes,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        name: patientName,
      });
      if (response?.data?.data) {
        setPatientEntries(response.data?.data?.items);
        setPatientEntriesTotals(response.data?.data?.totalOf);
      } else {
        setPatientEntries([]);
        setPatientEntriesTotals({});
      }
    } catch (error) {
      console.error("Error fetching patient entries:", error);
      setPatientEntries([]);
      setPatientEntriesTotals({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPatientEntries();
  };

  useEffect(() => {
    if (!pageSizes && !fromDate && !toDate && !patientName) {
      fetchPatientEntries();
    }
  }, [pageSizes, fromDate, toDate, patientName]);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Invoices</h1>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg shadow text-black">
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
            placeholder="Patient Name"
            className="border rounded p-2 w-[280px]"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
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
          {/* <button className="px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600">
            Export
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">
            Print
          </button> */}
        </div>

        {/* Invoice Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={50} color="#e94560" />
            </div>
          ) : (
            <div className="overflow-y-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border-b">Lab No</th>
                    <th className="px-4 py-2 border-b">Patient Name</th>
                    <th className="px-4 py-2 border-b">Date</th>
                    {/* <th className="px-4 py-2 border-b">Tests</th> */}
                    <th className="px-4 py-2 border-b">Paid Amount</th>
                    <th className="px-4 py-2 border-b">Advance</th>
                    <th className="px-4 py-2 border-b">Discount</th>
                    <th className="px-4 py-2 border-b">Extra Charges</th>
                    <th className="px-4 py-2 border-b">Due</th>
                    <th className="px-4 py-2 border-b">Total Cost</th>
                    <th className="px-4 py-2 border-b">Net Balance</th>
                    <th className="px-4 py-2 border-b">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientEntries.length > 0 ? (
                    patientEntries
                      ?.slice(0, visibleRows)
                      .map((entry, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.labNo}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.paitent?.name}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.date}
                          </td>
                          {/* <td className="px-4 py-2 border-b border-gray-300">
                            {entry.test?.map((item) => item.name).join(", ")}
                          </td> */}
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.amount}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.advance}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.discount}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.extraCharges}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.due}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.totalCost}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.netBlance}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            {entry.paymentStatus}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Load More Button */}
          {patientEntries.length > 0 && visibleRows < patientEntries.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
              >
                Load More...
              </button>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow flex justify-between text-black">
          <div>
            T. Paid Amt:
            <span className="font-bold">
              {patientEntriesTotals?.totalAmount?.toFixed(2) || 0}
            </span>
          </div>
          <div>
            T. Advance:
            <span className="font-bold">
              {patientEntriesTotals?.advance?.toFixed(2) || 0}
            </span>
          </div>
          <div>
            T. Discount:
            <span className="font-bold">
              {patientEntriesTotals?.discount?.toFixed(2) || 0}
            </span>
          </div>
          <div>
            T. Ex. Charges:
            <span className="font-bold">
              {patientEntriesTotals?.extraCharges?.toFixed(2) || 0}
            </span>
          </div>
          <div>
            T. Due:
            <span className="font-bold">
              {patientEntriesTotals?.due?.toFixed(2) || 0}
            </span>
          </div>
          <div>
            Total Cost.:
            <span className="font-bold">
              {patientEntriesTotals?.totalCost?.toFixed(2) || 0}
            </span>
          </div>
          <div>
            T. Net Bal:
            <span className="font-bold">
              {patientEntriesTotals?.netBlance?.toFixed(2) || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReport;
