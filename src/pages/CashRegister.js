import React, { useState, useEffect } from "react";
import GoBack from "../components/GoBack";
import { getCashRegisterReports } from "../services/cashRegisterService";
import { ClipLoader } from "react-spinners";
import { getPatients } from "../services/patientService";
import moment from "moment";

const CashRegister = () => {
  const [visibleRows, setVisibleRows] = useState(5);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [city, setCity] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [reports, setReports] = useState([]);
  const [pageSizes, setPageSizes] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [allPatients, setAllPatients] = useState([]);

  console.log("patient data:", allPatients)

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 10);
    setPageSizes((prev) => prev + 10);
  };

  const handlePatientChange = (event) => {
    const selectedPatientId = event.target.value;
    console.log("selectedPatientId: ", selectedPatientId)
    const patient = allPatients.find((p) => p._id === selectedPatientId);
  
    console.log("Selected Patient:", patient);
  
    if (patient) {
      setSelectedPatient(patient.name);
      setAddress(patient.address || "");
      setContactNo(patient.contactNo || "");
      setCity(patient.cityOrVillage || "");
    } else {
      setSelectedPatient("");
      setAddress("");
      setContactNo("");
      setCity("");
    }
  };
  

  const handleSearch = async () => {
    fetchCashRegisterReports();
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSelectedPatient("");
    setAddress("");
    setContactNo("");
    setCity("");
    setReports([]);
    setTotalAmount(0);
  };

  const fetchAllPatients = async () => {
      try {
        const response = await getPatients();
        // console.log("get patn response", response);
  
        if (response.status === 200) {
          setAllPatients(response?.data?.data?.paitents);
        } else {
          console.log("Failed to fetch patients", response);
          setAllPatients([])
        }
      } catch (error) {
        console.log(error);
        setAllPatients([])
      }
    };

  const fetchCashRegisterReports = async () => {
    const formattedFromDate = fromDate
    ? moment(fromDate).format("DD/MM/YYYY")
    : "";
    const formattedToDate = toDate ? moment(toDate).format("DD/MM/YYYY") : "";
    
    setIsLoading(true)
    try {
      const data = await getCashRegisterReports(
        formattedFromDate,
        formattedToDate,
        selectedPatient
      );
      // console.log("first", data.data.items);
      if (data.data.items.length > 0) {
        setReports(data.data.items);
        const total = data.data.items.reduce(
          (sum, record) => sum + record.amount,
          0
        );
        setTotalAmount(total);
      } else {
        setReports([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Error fetching cash register reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  useEffect(() => {
    fetchCashRegisterReports();
  }, [fromDate, toDate, selectedPatient]);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">

        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Cash Register Report
            </h1>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-100 p-4 rounded-lg shadow text-black">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded p-2"
            />
            <select
              value={selectedPatient}
              onChange={handlePatientChange}
              className="border rounded p-2"
            >
              <option value="">Select Patient</option>
                    {allPatients?.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name}
                      </option>
                    ))}
            </select>
            <input
              type="text"
              placeholder="Address"
              value={address}
              readOnly
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Contact No."
              value={contactNo}
              readOnly
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              readOnly
              className="border rounded p-2"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={50} color="#e94560" />
            </div>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">OPD</th>
                  <th className="px-4 py-2 border-b">Patient Name</th>
                  <th className="px-4 py-2 border-b">Age</th>
                  <th className="px-4 py-2 border-b">Sex</th>
                  <th className="px-4 py-2 border-b">Doctor</th>
                  <th className="px-4 py-2 border-b">Cost</th>
                  <th className="px-4 py-2 border-b">Discount</th>
                  <th className="px-4 py-2 border-b">Rec. Amt.</th>
                  <th className="px-4 py-2 border-b">Balance</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? reports.map((report, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 border-b">{report.date}</td>
                    <td className="px-4 py-2 border-b">{report.opd}</td>
                    <td className="px-4 py-2 border-b">
                      {report.paitent?.name || report.name}
                    </td>
                    <td className="px-4 py-2 border-b">{report.age}</td>
                    <td className="px-4 py-2 border-b">{report.gender}</td>
                    <td className="px-4 py-2 border-b">
                      {report.doctor || report?.doctorId?.name}
                    </td>
                    <td className="px-4 py-2 border-b">{report.totalCost}</td>
                    <td className="px-4 py-2 border-b">{report.discount}</td>
                    <td className="px-4 py-2 border-b">{report.amount}</td>
                    <td className="px-4 py-2 border-b">{report.netBlance}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="12" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {/* Load More Button */}
          {reports.length > 0 && visibleRows < reports?.length && (
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

        {/* Total Amount Section */}
        <div className="flex justify-between bg-gray-100 text-black p-4 mt-4 rounded-lg shadow">
          <span>Total Amount:</span>
          <span className="font-bold text-red-600">{totalAmount}.00</span>
        </div>
      </div>
    </div>
  );
};

export default CashRegister;
