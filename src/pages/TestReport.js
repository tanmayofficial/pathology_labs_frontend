import React, { useState, useEffect } from "react";
import GoBack from "../components/GoBack";
import { getAllTests } from "../services/testService";
import { ClipLoader } from "react-spinners";

const TestReport = () => {
  const [testData, setTestData] = useState([]);
  const [visibleRows, setVisibleRows] = useState(5);
  const [testName, setTestName] = useState("");
  const [testGroup, setTestGroup] = useState("");
  const [cost, setCost] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTestReports();
  }, [page, testName, testGroup, cost]);

  const fetchTestReports = async () => {
    setIsLoading(true);
    try {
      const response = await getAllTests({
        page,
        pageSize: 10,
        name: testName,
        group: testGroup,
        cost: cost,
      });
      // console.log("response testData: ", response);
      if (response.status === 200) {
        if (page === 1) {
          setTestData(response?.data?.data?.items);
        } else {
          setTestData((prev) => [...prev, ...response?.data?.data?.items]);
        }
      } else {
        setTestData([]);
      }
    } catch (error) {
      console.error("Error fetching test reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 5);
    setPage((prev) => prev + 1);
  };

  const handleClear = () => {
    setTestName("");
    setTestGroup("");
    setCost("");
    setPage(1);
  };

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Test Report</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-gray-100 p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Test Name"
            className="border rounded p-2 w-[280px] text-black"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Test Group"
            className="border rounded p-2 w-[280px] text-black"
            value={testGroup}
            onChange={(e) => setTestGroup(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cost"
            className="border rounded p-2 w-[280px] text-black"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <button
            onClick={fetchTestReports}
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
          {/* <button className="px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600">
            Export
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">
            Print
          </button> */}
        </div>
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={50} color="#e94560" />
            </div>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Sr. No.</th>
                  <th className="px-4 py-2 border-b">Test Name</th>
                  <th className="px-4 py-2 border-b">Group Name</th>
                  <th className="px-4 py-2 border-b">Unit</th>
                  <th className="px-4 py-2 border-b">Cost</th>
                </tr>
              </thead>
              <tbody>
                {testData?.slice(0, visibleRows).map((test, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 border-b border-gray-300">
                      {test.serialNo}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {test.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {test.testGroupId?.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {test.unit}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {test.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {testData?.length >= visibleRows && (
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
      </div>
    </div>
  );
};

export default TestReport;
