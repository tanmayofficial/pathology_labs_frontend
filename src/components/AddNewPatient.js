import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createPatient, getPatients } from "../services/patientService";
import AddNewDoctor from "./AddNewDoctor";
import { createDoctor, getDoctors, searchDoctor } from "../services/doctorService";
import { getLedgers } from "../services/ledgerService";
import { getCategories, searchCategories } from "../services/categoryService";
import { getDepartments, searchDepartments } from "../services/departmentService";
import moment from "moment";

const AddNewPatient = ({ setIsModalOpen, fetchAllPatients }) => {
  const [doctors, setDoctors] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorContact, setDoctorContact] = useState("");
  const [commission, setCommission] = useState("");
  const [ledgers, setLedgers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");

  const [patientDetails, setPatientDetails] = useState({
    name: "",
    doctorId: "",
    ledgerId: "",
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

  const clearAllPatientFields = () => {
    setPatientDetails({
      name: "",
      doctorId: "",
      ledgerId: "",
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
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9]{10,}$/.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatTime = (time) => {
    return time ? moment(time, "HH:mm").format("hh:mm A") : "";
  };

  const addPatient = async () => {
    if (
      !patientDetails.name ||
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
      name: patientDetails.name,
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

    try {
      const response = await createPatient(payload);
      if (response.status === 200 || response.status === 201) {
        toast.success("Patient added successfully");
        clearAllPatientFields();
        fetchAllPatients();
        setIsModalOpen(false);
      } else {
        toast.error(response?.data?.message || "Failed to add patient.");
      }
    } catch (error) {
      toast.error(
        error?.message || error?.data?.message || "Error while adding patient"
      );
      console.log("add error:", error);
    }
  };

  const clearAllFields = () => {
    setDoctorName("");
    setDoctorEmail("");
    setDoctorContact("");
    setCommission("");
  };

  const addDoctor = async () => {
    if (!doctorName) return toast.warn("Doctor name is mandatory!");

    if (doctorEmail && !isValidEmail(doctorEmail)) {
      return toast.warn("Enter a valid email address!");
    }

    if (doctorContact && !isValidPhone(doctorContact)) {
      return toast.warn("Enter a valid phone number (at least 10 digits)!");
    }

    const newDoctor = {
      name: doctorName,
      email: doctorEmail || "",
      contactNo: doctorContact || "",
      commission: parseFloat(commission) || 0,
    };

    try {
      const response = await createDoctor(newDoctor);
      console.log("create res: ", response);

      if (response.status === 200 || response.status === 201) {

        toast.success("Doctor added successfully");
        fetchAllDoctors("");
        clearAllFields();
        setShowDoctorModal(false);
      } else {
        console.error("Error creating doctor", response);
        toast.error(response?.data?.message || "Failed to add doctor");
      }
    } catch (error) {
      console.error("Error while adding doctor", error);
      toast.error(
        error.message || error?.data?.message || "Error while adding doctor"
      );
    }
  };

  const fetchLedgers = async () => {
    try {
      const response = await getLedgers();
      // console.log("get ledgr response", response);

      if (response.status === 200) {
        setLedgers(response.data.data);
      } else {
        console.log("Failed to fetch ledgers", response);
        setLedgers([]);
      }
    } catch (error) {
      console.log(error);
      setLedgers([]);
    }
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

  useEffect(() => {
    fetchAllDoctors();
    fetchLedgers();
    fetchCategories();
    fetchDepartments();
  }, []);

  return (
    <div>
      {/* Add New Patient Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
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
            Add New Patient
          </h2>

          <form className="space-y-4 text-black">
            {/* Doctor */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ref By (Doctor)*
              </label>
              <select
                name="doctorId"
                value={patientDetails.doctorId}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              >
                <option value="" disabled>Select Doctor</option>
                {doctors?.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Doctor Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowDoctorModal(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Add Doctor
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name*
              </label>
              <input
                type="text"
                name="name"
                value={patientDetails.name}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Account/Ledger */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Account
              </label>
              <select
                name="ledgerId"
                value={patientDetails.ledgerId}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              >
                <option value="">Select Account</option>
                {ledgers.map((ledger) => (
                  <option key={ledger._id} value={ledger._id}>
                    {ledger.name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address*
              </label>
              <input
                type="text"
                name="address"
                value={patientDetails.address}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* City/Village */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City/Village*
              </label>
              <input
                type="text"
                name="cityOrVillage"
                value={patientDetails.cityOrVillage}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Contact No */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact No.*
              </label>
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
                  Selected Time: {formatTime(patientDetails.reportingTime || null)}
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
                <option value="">Select Category</option>
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
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remarks */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-[#e94560] focus:outline-none"></textarea>
            </div> */}

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addPatient}
                className="px-4 py-2 bg-[#127a29] text-white rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showDoctorModal && (
        <AddNewDoctor
          doctors={doctors}
          doctorName={doctorName}
          doctorEmail={doctorEmail}
          doctorContact={doctorContact}
          commission={commission}
          setDoctorName={setDoctorName}
          setDoctorEmail={setDoctorEmail}
          setDoctorContact={setDoctorContact}
          setCommission={setCommission}
          addDoctor={addDoctor}
          clearAllFields={clearAllFields}
          setShowDoctorModal={setShowDoctorModal}
        />
      )}
    </div>
  );
};

export default AddNewPatient;
