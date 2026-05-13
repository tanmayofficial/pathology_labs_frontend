import React, { useRef, useState } from "react";
// import {
//   createDoctor,
//   deleteDoctor,
//   getDoctors,
//   updateDoctor,
// } from "../services/doctorService";
import { toast } from "react-toastify";
import GoBack from "../components/GoBack";
import { ClipLoader } from "react-spinners";

const hardcodedDoctors = [
  {
    _id: "doc-001",
    name: "Dr. Amit Sharma",
    email: "amit.sharma@example.com",
    contactNo: "9876543210",
    commission: 10,
  },
  {
    _id: "doc-002",
    name: "Dr. Priya Mehta",
    email: "priya.mehta@example.com",
    contactNo: "9876543211",
    commission: 12,
  },
  {
    _id: "doc-003",
    name: "Dr. Rahul Verma",
    email: "rahul.verma@example.com",
    contactNo: "9876543212",
    commission: 8,
  },
  {
    _id: "doc-004",
    name: "Dr. Neha Gupta",
    email: "neha.gupta@example.com",
    contactNo: "9876543213",
    commission: 15,
  },
  {
    _id: "doc-005",
    name: "Dr. Sanjay Patel",
    email: "sanjay.patel@example.com",
    contactNo: "9876543214",
    commission: 10,
  },
  {
    _id: "doc-006",
    name: "Dr. Anjali Rao",
    email: "anjali.rao@example.com",
    contactNo: "9876543215",
    commission: 11,
  },
  {
    _id: "doc-007",
    name: "Dr. Vikram Singh",
    email: "vikram.singh@example.com",
    contactNo: "9876543216",
    commission: 9,
  },
  {
    _id: "doc-008",
    name: "Dr. Kavita Iyer",
    email: "kavita.iyer@example.com",
    contactNo: "9876543217",
    commission: 13,
  },
  {
    _id: "doc-009",
    name: "Dr. Rohan Das",
    email: "rohan.das@example.com",
    contactNo: "9876543218",
    commission: 7,
  },
  {
    _id: "doc-010",
    name: "Dr. Sneha Kapoor",
    email: "sneha.kapoor@example.com",
    contactNo: "9876543219",
    commission: 14,
  },
  {
    _id: "doc-011",
    name: "Dr. Arjun Nair",
    email: "arjun.nair@example.com",
    contactNo: "9876543220",
    commission: 10,
  },
  {
    _id: "doc-012",
    name: "Dr. Meera Joshi",
    email: "meera.joshi@example.com",
    contactNo: "9876543221",
    commission: 12,
  },
];

const Doctor = () => {
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [commission, setCommission] = useState("");
  const [doctors, setDoctors] = useState(hardcodedDoctors);
  const [editIndex, setEditIndex] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const doctorNameRef = useRef(null);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9]{10,}$/.test(phone);
  };

  const handleAddOrUpdateDoctor = async () => {
    if (!doctorName) return toast.warn("Doctor name is mandatory!");

    if (email && !isValidEmail(email)) {
      return toast.warn("Enter a valid email address!");
    }

    if (contactNo && !isValidPhone(contactNo)) {
      return toast.warn("Enter a valid phone number (at least 10 digits)!");
    }

    const doctorData = {
      name: doctorName,
      email: email || "",
      contactNo: contactNo || "",
      commission: parseFloat(commission) || 0,
    };

    if (editIndex !== null) {
      // console.log("Updating doctor:", doctorData);

      // try {
      //   const response = await updateDoctor(doctorData, updateId);

      //   if (response.status === 200 || response.status === 201) {
      //     // setDoctors([response?.data?.data, ...doctors]);
      //     const updatedDoctors = [...doctors];
      //     updatedDoctors[editIndex] = response?.data?.data;

      //     setDoctors(updatedDoctors);
      //     toast.success("Doctor updated successfully");
      //     handleClear();
      //   } else {
      //     console.error("Error updating doctor", response);
      //     toast.error(response?.data?.message || "Failed to update doctor");
      //   }
      // } catch (error) {
      //   console.error("Error while updating doctor", error);
      //   toast.error(
      //     error.message || error?.data?.message || "Error while updating doctor"
      //   );
      // }

      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === updateId ? { ...doctor, ...doctorData } : doctor
        )
      );
      toast.success("Doctor updated successfully");
      handleClear();
    } else {
      // try {
      //   const response = await createDoctor(doctorData);
      //   console.log("create res: ", response);

      //   if (response.status === 200 || response.status === 201) {
      //     setDoctors([response?.data?.data, ...doctors]);

      //     toast.success("Doctor added successfully");
      //     fetchDoctors(searchTerm);
      //     handleClear();
      //   } else {
      //     console.error("Error creating doctor", response);
      //     toast.error(response?.data?.message || "Failed to add doctor");
      //   }
      // } catch (error) {
      //   console.error("Error while adding doctor", error);
      //   toast.error(
      //     error.message || error?.data?.message || "Error while adding doctor"
      //   );
      // }

      setDoctors((prevDoctors) => [
        { _id: `doc-${Date.now()}`, ...doctorData },
        ...prevDoctors,
      ]);
      toast.success("Doctor added successfully");
      handleClear();
    }
  };

  const handleEditDoctor = (doctor, index) => {
    if (!doctor) return;

    setDoctorName(doctor?.name || "");
    setEmail(doctor?.email || "");
    setContactNo(doctor?.contactNo || "");
    setCommission(doctor?.commission || "");

    setEditIndex(index);
    setUpdateId(doctor._id);

    doctorNameRef.current.focus();
  };

  const handleDeleteDoctor = async (id, name) => {
    // try {
    //   const response = await deleteDoctor(id);

    //   if (response.status === 200) {
    //     setDoctors(
    //       doctors?.length > 0
    //         ? doctors?.filter((doctor) => doctor._id !== id)
    //         : []
    //     );
    //     toast.success(`Dr. ${name} deleted successfully`);
    //   } else {
    //     toast.error(response?.data?.message || `Failed to delete Dr. ${name}`);
    //     console.error("Failed to delete doctor", response);
    //   }
    // } catch (error) {
    //   toast.error(
    //     error?.message || error?.data?.message || "Error while deleting doctor"
    //   );
    //   console.error("Error while deleting doctor", error);
    // }

    setDoctors((prevDoctors) =>
      prevDoctors?.length > 0
        ? prevDoctors?.filter((doctor) => doctor._id !== id)
        : []
    );
    toast.success(`Dr. ${name} deleted successfully`);
  };

  const handleClear = () => {
    setDoctorName("");
    setEmail("");
    setContactNo("");
    setCommission("");
    setEditIndex(null);
    setUpdateId("");
  };

  // const fetchDoctors = async (search = "") => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getDoctors(search, pageSize);
  //     console.log("get doc response", response);
  //     if (response.status === 200) {
  //       setDoctors(response?.data?.data?.doctors || []);
  //       setTotalDoctors(response?.data?.data?.totalDoctors || 0);
  //     } else {
  //       console.log("Failed to fetch doctors", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching doctors", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const filteredDoctors = doctors?.filter((doctor) => {
    const searchValue = searchTerm.toLowerCase();

    return (
      doctor.name?.toLowerCase().includes(searchValue) ||
      doctor.email?.toLowerCase().includes(searchValue) ||
      doctor.contactNo?.includes(searchValue)
    );
  });
  const displayedDoctors = filteredDoctors?.slice(0, pageSize);
  const totalDoctors = filteredDoctors?.length || 0;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPageSize(10);
  };

  const handleLoadMore = () => {
    if (pageSize < totalDoctors) {
      setPageSize((prev) => prev + 10);
    }
  };

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     fetchDoctors(searchTerm);
  //   }, 500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchTerm, pageSize]);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Doctor</h1>
          </div>
        </div>

        {/* Input Fields */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            {/* Doctor Name */}
            <div>
              <label className="block text-sm font-medium">Name *</label>
              <input
                ref={doctorNameRef}
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium">Contact</label>
              <input
                type="tel"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Commission */}
            <div>
              <label className="block text-sm font-medium">Commission(%)</label>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleAddOrUpdateDoctor}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Doctors List</h2>
          <div className="bg-white text-gray-800 my-3">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Enter to search a Doctor.."
              className="w-full px-4 py-2 flex justify-center items-center border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
            />
          </div>
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
                      Name
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300">
                      Contact
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300">
                      Commission(%)
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedDoctors?.length > 0 ? (
                    displayedDoctors?.map((doctor, index) => (
                      <tr
                        key={doctor._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {doctor.name}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {doctor.email}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {doctor.contactNo}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {doctor.commission}
                        </td>
                        <td className="px-4 py-2 flex text-center border-b border-gray-300">
                          <button
                            type="button"
                            onClick={() => handleEditDoctor(doctor, index)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteDoctor(doctor._id, doctor.name)
                            }
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                          >
                            Delete
                          </button>
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
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={pageSize >= totalDoctors}
              className={`px-4 py-2 rounded-lg text-white ${
                pageSize >= totalDoctors
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pageSize >= totalDoctors ? "No More Data" : "Load More..."}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Doctor;
