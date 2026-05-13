import React from "react";

const AddNewDoctor = (props) => {
  const {
    doctors,
    setShowDoctorModal,
    doctorName,
    setDoctorName,
    doctorEmail,
    setDoctorEmail,
    doctorContact,
    setDoctorContact,
    commission,
    setCommission,
    addDoctor,
  } = props;

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white text-black rounded-lg shadow-2xl p-8 w-full max-w-lg relative">
          {/* Close Button (Cross Icon) */}
          <button
            onClick={() => setShowDoctorModal(false)}
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

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Doctor
          </h2>
          <form className="space-y-4">
            {/* Doctor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Doctor Name*
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Doctor Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email ID
              </label>
              <input
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Doctor Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact No.
              </label>
              <input
                type="text"
                value={doctorContact}
                onChange={(e) => setDoctorContact(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Commission */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Comm. (%)
              </label>
              <input
                type="text"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Action Buttons for Doctor Modal */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowDoctorModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addDoctor}
                className="px-4 py-2 bg-[#127a29] text-white rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Add Doctor
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default AddNewDoctor;
