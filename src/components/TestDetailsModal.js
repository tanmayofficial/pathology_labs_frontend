import React from "react";

const TestDetailsModal = ({ setModalOpen, testDetails }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Patient Test Details</h2>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full border border-gray-300">
            <thead className="sticky top-0 bg-gray-100 shadow-md z-100">
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">
                  S.N
                </th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">
                  Test Name
                </th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">
                  Group
                </th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">
                  Normal Range
                </th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">
                  Unit
                </th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {testDetails.length > 0 ? (
                testDetails.map((test, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-center border-b whitespace-nowrap">
                      {test.serialNo}
                    </td>
                    <td className="px-4 py-2 text-center border-b whitespace-nowrap">
                      {test.name}
                    </td>
                    <td className="px-4 py-2 text-center border-b whitespace-nowrap">
                      {test.testGroupId.name}
                    </td>
                    <td className="px-4 py-2 text-center border-b whitespace-nowrap">
                      {test.normalRange}
                    </td>
                    <td className="px-4 py-2 text-center border-b whitespace-nowrap">
                      {test.unit}
                    </td>
                    <td className="px-4 py-2 text-center border-b whitespace-nowrap">
                      {test.cost}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalOpen(false)}
            className="mt-4 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsModal;
