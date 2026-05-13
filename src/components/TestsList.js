import React from "react";
import { ClipLoader } from "react-spinners";

const TestsList = (props) => {
  const {
    searchQuery,
    handleSearch,
    isLoading,
    tests,
    handleEditTest,
    handleDeleteTest,
    handleLoadMore,
    pageSize,
    totalTests,
  } = props;

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter to search a test..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 flex justify-center items-center border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Test List</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={50} color="#e94560" />
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full border border-gray-300">
            <thead className="sticky top-0 bg-gray-100 shadow-md z-100">
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  S. No.
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Test Name
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Test Code
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Serial No
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Test Group
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Unit
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Default Value
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Cost
                </th>
                {/* <th className="px-4 py-2 text-center border-b border-gray-300">
                    Normal Range
                  </th> */}
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Normal Range Lower (Male)
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Normal Range Upper (Male)
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Normal Range Lower (Female)
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Normal Range Upper (Female)
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Widal Test
                </th>
                <th className="px-4 py-2 text-center border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tests?.length > 0 ? (
                tests?.map((test, index) => (
                  <tr
                    key={test._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.testCode || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.serialNo || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test?.testGroups?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.unit || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.defultValue || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.cost || "N/A"}
                    </td>
                    {/* <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.normalRange || "N/A"}
                    </td> */}
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.lowerRangeMale || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.upperRangeMale || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.lowerRangeFemle || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.upperRangeFemle || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {test.widalTest ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 flex text-center border-b border-gray-300">
                      <button
                        onClick={() => handleEditTest(index, test)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test._id, test.name)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-4">
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
          disabled={pageSize >= totalTests}
          className={`px-4 py-2 rounded-lg text-white ${
            pageSize >= totalTests
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {pageSize >= totalTests ? "No More Data" : "Load More..."}
        </button>
      </div>
    </div>
  );
};

export default TestsList;
