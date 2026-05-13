import React, { useState, useEffect, useMemo } from "react";
import GoBack from "../components/GoBack";
import { getAllLedgersReport, getLedgers } from "../services/ledgerService";
import { toast } from "react-toastify";
import moment from "moment";

const LedgerReport = () => {
  const [visibleRows, setVisibleRows] = useState(5);
  const [account, setAccount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerNames, setLedgerNames] = useState([]);

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const response = await getLedgers();
        if (response.status === 200) {
          setLedgerNames(response.data.data);
        } else {
          console.log("Failed to fetch ledgers", response);
          setLedgerNames([]);
        }
      } catch (error) {
        console.log(error);
        setLedgerNames([]);
      }
    };

    
    fetchLedgers();
  }, []);

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 5);
  };

  const handleClear = () => {
    setAccount("");
    setFromDate("");
    setToDate("");
  };


  const { totalDebit, totalCredit, balance } = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;

    ledgerData.forEach((entry) => {
      totalDebit += entry.due ? parseFloat(entry.due) : 0;
      totalCredit += entry.amount ? parseFloat(entry.amount) : 0;
    });

    return {
      totalDebit: totalDebit.toFixed(2),
      totalCredit: totalCredit.toFixed(2),
      balance: (totalCredit - totalDebit).toFixed(2),
    };
  }, [ledgerData]);


  const handleSearch = async (e) => {
    e.preventDefault();
  
    const formattedFromDate = fromDate ? moment(fromDate).format("DD/MM/YYYY") : "";
    const formattedToDate = toDate ? moment(toDate).format("DD/MM/YYYY") : "";
  
    const payload = {
      accountType: account,
      fromDate: formattedFromDate,
      toDate: formattedToDate
    }
    try {
      const response = await getAllLedgersReport(payload);

      console.log("all ledger data: ", response)
  
      if (response.data.data && response.data.data.items) {
        setLedgerData(response.data.data.items);
      } else {
        setLedgerData([]);
        toast.error("No data found!");
      }
    } catch (err) {
      toast.error("Problem fetching ledger data!");
      console.log("Error:", err);
    }
  };
  

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">

        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Ledger Report
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-100 p-4 rounded-lg shadow text-black">
          <select
            className="border rounded p-2 w-[280px]"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            <option value="">Select Account</option>
            {ledgerNames?.map((ledger) => (
              <option key={ledger._id} value={ledger.name}>
                {ledger.name}
              </option>
            ))}
          </select>

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

        {/* Ledger Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mt-6">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Particulars</th>
                <th className="px-4 py-2 border-b">Debit</th>
                <th className="px-4 py-2 border-b">Credit</th>
                <th className="px-4 py-2 border-b">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.slice(0, visibleRows).map((entry, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 border-b border-gray-300">
                    {entry.date}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {entry.type}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {entry.name}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {entry.particulars}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {entry.due || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {entry.amount || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {entry.due ? `-${entry.due}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Load More Button */}
          {visibleRows < ledgerData.length && (
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
            <span className="font-bold">Total Dr.: </span>
            <span>{totalDebit}</span>
          </div>
          <div>
            <span className="font-bold">Total Cr.: </span>
            <span>{totalCredit}</span>
          </div>
          <div>
            <span className="font-bold">Balance: </span>
            <span>
              {balance} {balance >= 0 ? "Cr." : "Dr."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerReport;
