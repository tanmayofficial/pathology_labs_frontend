import React, { useEffect, useRef, useState } from "react";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../services/patientService";
import { toast } from "react-toastify";
import GoBack from "../components/GoBack";
import { ClipLoader } from "react-spinners";
import { getDoctors, searchDoctor } from "../services/doctorService";
import moment from "moment";
import { getCategories, searchCategories } from "../services/categoryService";
import {
  getDepartments,
  searchDepartments,
} from "../services/departmentService";

const Patient = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [patientDetails, setPatientDetails] = useState({
    patientName: "",
    doctorId: "",
    address: "",
    cityOrVillage: "",
    contactNo: "",
    email: "",
    sampleDate: "",
    sampleTime: "",
    reportingDate: "",
    reportingTime: "",
    categoryId: "",
    weight: "",
    departmentId: "",
  });

  // const patientNameRef = useRef(null);

  const handleClear = () => {
    setPatientDetails({
      patientName: "",
      doctorId: "",
      address: "",
      cityOrVillage: "",
      contactNo: "",
      email: "",
      sampleDate: "",
      sampleTime: "",
      reportingDate: "",
      reportingTime: "",
      categoryId: "",
      weight: "",
      departmentId: "",
    });
    setEditIndex(null);
    setUpdateId("");
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9]{10,}$/.test(phone);
  };

  const handleAddOrUpdatePatient = async () => {
    if (
      !patientDetails.patientName ||
      !patientDetails.doctorId ||
      // !patientDetails.ledgerId ||
      !patientDetails.address ||
      !patientDetails.cityOrVillage ||
      !patientDetails.contactNo ||
      // !patientDetails.email ||
      !patientDetails.sampleDate ||
      !patientDetails.sampleTime ||
      !patientDetails.reportingDate ||
      !patientDetails.reportingTime ||
      !patientDetails.categoryId ||
      !patientDetails.weight ||
      !patientDetails.departmentId
    )
      return toast.warn("Please fill all required fields!");

    if (patientDetails.email && !isValidEmail(patientDetails.email)) {
      return toast.warn("Enter a valid email address!");
    }

    if (patientDetails.contactNo && !isValidPhone(patientDetails.contactNo)) {
      return toast.warn("Enter a valid phone number (at least 10 digits)!");
    }

    const formattedSampleDate = patientDetails.sampleDate
      ? moment(patientDetails.sampleDate).format("DD/MM/YYYY")
      : "";
    const formattedReportingDate = patientDetails.reportingDate
      ? moment(patientDetails.reportingDate).format("DD/MM/YYYY")
      : "";

    const payload = {
      name: patientDetails.patientName,
      doctorId: patientDetails.doctorId,
      // ledgerId: patientDetails.ledgerId,
      address: patientDetails.address,
      cityOrVillage: patientDetails.cityOrVillage,
      contactNo: patientDetails.contactNo,
      email: patientDetails.email || "",
      sampleDate: formattedSampleDate,
      sampleTime: patientDetails.sampleTime,
      reportingDate: formattedReportingDate,
      reportingTime: patientDetails.reportingTime,
      categoryId: patientDetails.categoryId,
      weight: patientDetails.weight,
      depertmentId: patientDetails.departmentId,
    };

    console.log("payload: ", payload);

    if (updateId) {
      try {
        const response = await updatePatient(payload, updateId);
        if (response.status === 200 || response.status === 201) {
          fetchPatients(searchTerm);
          toast.success("Patient updated successfully");
          handleClear();
        } else {
          toast.error(response?.data?.message || "Failed to update patient");
        }
      } catch (error) {
        toast.error(
          error?.message || error?.data?.message || "Error updating patient"
        );
      }
    } else {
      try {
        const response = await createPatient(payload);
        if (response.status === 200 || response.status === 201) {
          fetchPatients(searchTerm);
          handleClear();
          toast.success("Patient added successfully");
        } else {
          toast.error(response?.data?.message || "Failed to add patient.");
        }
      } catch (error) {
        toast.error(
          error?.message || error?.data?.message || "Error while adding patient"
        );
      }
    }
  };

  const formatTime = (time) => {
    return time ? moment(time, "HH:mm").format("hh:mm A") : "";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleEditPatient = (index, id) => {
    const selectedPatient = allPatients[index];
    console.log("selected patient", selectedPatient);
    if (!selectedPatient) return;

    setPatientDetails({
      patientName: selectedPatient.name || "",
      doctorId: selectedPatient.doctorId || "",
      // ledgerId: selectedPatient.ledgerId,
      address: selectedPatient.address || "",
      cityOrVillage: selectedPatient.cityOrVillage || "",
      contactNo: selectedPatient.contactNo || "",
      email: selectedPatient.email || "",
      sampleDate: formatDate(selectedPatient.sampleDate),
      sampleTime: selectedPatient.sampleTime,
      reportingDate: formatDate(selectedPatient.reportingDate),
      reportingTime: selectedPatient.reportingTime,
      categoryId: selectedPatient.categoryId || "",
      weight: selectedPatient.weight || "",
      departmentId: selectedPatient.depertmentId || "",
    });

    setEditIndex(index);
    setUpdateId(id);
  };

  const handleDeletePatient = async (id, name) => {
    try {
      const response = await deletePatient(id);
      if (response.status === 200) {
        toast.success(`${name} deleted successfully`);
        fetchPatients(searchTerm);
      } else {
        toast.error(response?.data?.message || "Failed to delete patient!");
        console.log("Failed to delete patient!", response);
      }
    } catch (error) {
      toast.error(
        error?.message || error?.data?.message || "Error while deleting patient"
      );
    }
  };

  const handleLoadMore = () => {
    if (pageSize < totalPatients) {
      setPageSize((prev) => prev + 10);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await searchDoctor(doctorSearchTerm);
      console.log("get doc response", response);

      if (response.status === 200) {
        setDoctors(response.data.data);
      } else {
        console.log("Failed to fetch doctors", response);
        setDoctors([]);
      }
    } catch (error) {
      console.log(error);
      setDoctors([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await searchCategories(categorySearchTerm);
      console.log("get cat response", response);

      if (response.status === 200) {
        setCategories(response.data.data);
      } else {
        console.log("Failed to fetch categories", response);
        setCategories([]);
      }
    } catch (error) {
      console.log(error);
      setCategories([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await searchDepartments(departmentSearchTerm);
      console.log("get dept response", response);

      if (response.status === 200) {
        setDepartments(response.data.data);
      } else {
        console.log("Failed to fetch categories", response);
        setDepartments([]);
      }
    } catch (error) {
      console.log(error);
      setDepartments([]);
    }
  };

  const fetchPatients = async (search = "") => {
    setIsLoading(true);
    try {
      const response = await getPatients(search, pageSize);
      console.log("response patient: ", response);
      if (response.status === 200) {
        setAllPatients(response?.data?.data?.items || []);
        setTotalPatients(response?.data?.data?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching patients", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDoctors();
    fetchCategories();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pageSize]);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Patient
            </h1>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium">
                Ref By (Doctor)*
              </label>
              <select
                name="doctorId"
                value={patientDetails.doctorId}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              >
                <option value="" disabled>
                  Select Doctor
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Patient Name*</label>
              <input
                type="text"
                name="patientName"
                value={patientDetails.patientName}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Address*</label>
              <input
                type="text"
                name="address"
                value={patientDetails.address}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">City/Village*</label>
              <input
                type="text"
                name="cityOrVillage"
                value={patientDetails.cityOrVillage}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Contact No.*</label>
              <input
                type="text"
                name="contactNo"
                value={patientDetails.contactNo}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(value))
                    setPatientDetails({ ...patientDetails, contactNo: value });
                }}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={patientDetails.email}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Sample Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sample Date*
                </label>
                <input
                  type="date"
                  name="sampleDate"
                  value={patientDetails.sampleDate}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sample Time*
                </label>
                <input
                  type="time"
                  name="sampleTime"
                  value={patientDetails.sampleTime}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Selected Time: {formatTime(patientDetails.sampleTime || null)}
                </p>
              </div>
            </div>

            {/* Reporting Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reporting Date*
                </label>
                <input
                  type="date"
                  name="reportingDate"
                  value={patientDetails.reportingDate}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reporting Time*
                </label>
                <input
                  type="time"
                  name="reportingTime"
                  value={patientDetails.reportingTime}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Selected Time:{" "}
                  {formatTime(patientDetails.reportingTime || null)}
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category ID*
              </label>
              <select
                name="categoryId"
                value={patientDetails.categoryId}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight and Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kgs)*
                </label>
                <input
                  type="number"
                  name="weight"
                  value={patientDetails.weight}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department*
                </label>
                <select
                  name="departmentId"
                  value={patientDetails.departmentId}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div></div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Clear
              </button>
              <button
                onClick={handleAddOrUpdatePatient}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {updateId ? "Update Patient" : "Add Patient"}
              </button>
            </div>
          </div>
        </div>

        {/* All Patients Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 flex justify-center items-center border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Patient List</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={50} color="#e94560" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full border border-gray-300">
                <thead className="sticky top-0 bg-gray-100 shadow-md z-100">
                  <tr className="bg-gray-200">
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      S. No.
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Patient Name
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Ref By(Dr.)
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Address
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      City/Vill.
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Contact
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Sample Date
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Sample Time
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Reporting Date
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Reporting Time
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Weight
                    </th>
                    <th className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Department
                    </th>
                    <th className="px-3 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allPatients?.length > 0 ? (
                    allPatients?.map((patient, index) => (
                      <tr
                        key={patient._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.name}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.doctors?.name || "N/A"}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.address}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.cityOrVillage}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.contactNo}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.email}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.sampleDate}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {formatTime(patient.sampleTime)}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.reportingDate}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {formatTime(patient.reportingTime)}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.category?.name || "N/A"}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.weight}
                        </td>
                        <td className="px-6 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          {patient.depertment?.name || "N/A"}
                        </td>
                        <td className="flex gap-1 px-3 py-2 text-center border-b border-gray-300 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditPatient(index, patient._id)
                            }
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeletePatient(patient._id, patient.name)
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
              disabled={pageSize >= totalPatients}
              className={`px-4 py-2 rounded-lg text-white ${
                pageSize >= totalPatients
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pageSize >= totalPatients ? "No More Data" : "Load More..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
