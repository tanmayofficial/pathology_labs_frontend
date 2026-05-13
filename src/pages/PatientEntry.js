import React, { use, useEffect, useRef, useState } from "react";
import GoBack from "../components/GoBack";
import AddNewPatient from "../components/AddNewPatient";
import {
  createPatientEntry,
  deletePatientEntry,
  getPatientDetails,
  getPatientEntryByPatientNo,
  getTestsByTestGroup,
  searchAllPatient,
  updatePatientEntry,
} from "../services/patientService";
import { getTestGroups, searchTestGroups } from "../services/testGroupService";
import { toast } from "react-toastify";
import moment from "moment";
import { getLedgers } from "../services/ledgerService";

const PatientEntry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [costDetails, setCostDetails] = useState({
    totalCost: 0,
    extraCharges: 0,
    discount: 0,
    advance: 0,
    netBalance: 0,
  });
  const [formData, setFormData] = useState({
    account: "",
    date: "",
    labNo: "",
    title: "",
    name: "",
    age: "",
    gender: "",
    invoiceNo: "",
    paymentStatus: "",
    amount: "",
    testId: [],
  });
  const [patientNo, setPatientNo] = useState("");
  const [allTestGroups, setAllTestGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedTestDetails, setSelectedTestDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPatientNoEditable, setIsPatientNoEditable] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [allLedgers, setAllLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allPatients, setAllPatients] = useState([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [allPatientNos, setAllPatientNos] = useState([]);

  const patientNoRef = useRef(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleTestSelection = (test) => {
    setSelectedTestDetails((prev) => {
      const isSelected = prev.some((t) => t._id === test._id);
      if (isSelected) {
        return prev.filter((t) => t._id !== test._id);
      }

      return [...prev, test];
    });
  };

  const handleClear = () => {
    setFormData({
      account: "",
      date: "",
      labNo: "",
      title: "",
      name: "",
      age: "",
      gender: "",
      invoiceNo: "",
      paymentStatus: "",
      amount: "",
      testId: [],
    });
    setSelectedPatientId("");
    getOrSearchAllGroups();
    setSelectedGroupId(null);
    setSelectedTests([]);
    setSelectedTestDetails([]);
    setSearchQuery("");

    setCostDetails({
      totalCost: 0,
      extraCharges: 0,
      discount: 0,
      advance: 0,
      netBalance: 0,
    });
    setPatientNo("");
    setIsPatientNoEditable(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  console.log("patient no. ", patientNo);

  const handleCreateEntry = async (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.labNo ||
      !formData.title ||
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !costDetails.totalCost ||
      !costDetails.netBalance ||
      selectedTestDetails.length === 0
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    const formattedDate = formData.date
      ? moment(formData.date).format("DD/MM/YYYY")
      : "";

    try {
      const response = await createPatientEntry({
        date: formattedDate,
        labNo: formData.labNo,
        title: formData.title,
        paitentId: formData.name,
        age: formData.age,
        ledgerId: formData.account,
        paymentStatus: formData.paymentStatus,
        amount: parseFloat(formData.amount),
        gender: formData.gender,
        testId: selectedTestDetails.map((item) => item._id),
        totalCost: parseFloat(costDetails.totalCost),
        extraCharges: parseFloat(costDetails.extraCharges),
        discount: parseFloat(costDetails.discount),
        advance: parseFloat(costDetails.advance),
        netBlance: parseFloat(costDetails.netBalance),
      });

      if (response.status === 200 || response.status === 201) {
        const patientNumber = response?.data?.data?.paitentNo;
        toast.success("Patient entry created successfully!");
        handleClear();
        fetchAllPatientsNo();
        setPatientNo(patientNumber);
      } else {
        toast.error(
          response?.data?.message || "Failed to create patient entry"
        );
        console.log("error response:", response);
      }
    } catch (error) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Error while submitting patient entry"
      );
      console.error("Error while submitting patient entry", error);
    }
  };

  const getOrSearchAllGroups = async () => {
    try {
      const groups = await searchTestGroups(searchQuery);
      console.log("group search/getall res: ", groups);
      if (groups.status === 200 || groups.status === 201) {
        // toast.success("Group found successfully!");
        setAllTestGroups(groups.data.data);
      } else {
        toast.error(groups.data.message || "No group found");
        setAllTestGroups([]);
        setSelectedTestDetails([]);
        console.log("first else");
      }
    } catch (error) {
      setAllTestGroups([]);
      setSelectedTestDetails([]);
      toast.error(
        error?.data?.message ||
          error?.response?.data?.message ||
          "Error searching groups",
        error
      );
      console.log("first...")
    }
  };

  const fetchAllTestNameByGroup = async (groupId) => {
    try {
      const response = await getTestsByTestGroup(groupId);
      console.log("getTestsByTestGroup response: ", response);
      if (response.status === 200) {
        setSelectedTests(response?.data?.data || []);
      } else {
        setSelectedTests([]);
      }
    } catch (error) {
      console.error("Error fetching tests by group:", error);
    }
  };
  console.log("selected test details ---> ", selectedTestDetails);
  console.log("selected group id: ", selectedGroupId);


  const fetchPatientDetails = async (patientNo) => {
    setLoading(true);
    try {
      const response = await getPatientDetails(patientNo);
      if (response.status === 200 && response.data.data.length > 0) {
        const patient = response.data.data[0];

        console.log("patientDetails: ", response);

        setFormData({
          name: patient.paitentId,
          title: patient.title,
          age: patient.age,
          gender: patient.gender,
          date: formatDate(patient.date),
          labNo: patient.labNo,
          amount: patient.amount,
          testId: patient.testId,
          account: patient.ledgerId,
          paymentStatus: patient.paymentStatus,
        });
        setSelectedPatientId(patient?._id);

        const uniqueGroupIds = [
          ...new Set(patient.testId.map((item) => item.testGroupId?._id)),
        ];
        console.log("unique group ids: ", uniqueGroupIds);
        const selectedGroup =
          uniqueGroupIds.length > 0 ? uniqueGroupIds[0] : null;
          console.log("selected group id: ", selectedGroup);
        setSelectedGroupId(selectedGroup);

        setSelectedTestDetails(patient.testId);

        setCostDetails({
          totalCost: patient.totalCost,
          extraCharges: patient.extraCharges,
          discount: patient.discount,
          advance: patient.advance,
          netBalance: patient.netBlance,
        });

        console.log("selected test details 2 ", selectedTestDetails);
      } else {
        toast.error("Patient not found!");
        setFormData({
          account: "",
          date: "",
          labNo: "",
          title: "",
          name: "",
          age: "",
          gender: "",
          invoiceNo: "",
          paymentStatus: "",
          amount: "",
          testId: [],
        });
        setSelectedPatientId("");
        getOrSearchAllGroups();
        setSelectedGroupId(null);
        setSelectedTests([]);
        setSelectedTestDetails([]);
        setSearchQuery("");

        setCostDetails({
          totalCost: 0,
          extraCharges: 0,
          discount: 0,
          advance: 0,
          netBalance: 0,
        });
      }
    } catch (error) {
      console.error("Error while fetching patient details", error);
      toast.error("Error fetching patient details");
      setFormData({
        account: "",
        date: "",
        labNo: "",
        title: "",
        name: "",
        age: "",
        gender: "",
        invoiceNo: "",
        paymentStatus: "",
        amount: "",
        testId: [],
      });
      setSelectedPatientId("");
      getOrSearchAllGroups();
      setSelectedGroupId(null);
      setSelectedTests([]);
      setSelectedTestDetails([]);
      setSearchQuery("");

      setCostDetails({
        totalCost: 0,
        extraCharges: 0,
        discount: 0,
        advance: 0,
        netBalance: 0,
      });
    } finally {
      setLoading(true);
    }
  };

  // console.log("selected tests: ", selectedTests);

  const handleGroupSelection = (groupId) => {
    console.log("groupId: ", groupId);  
    setSelectedGroupId(groupId);
    fetchAllTestNameByGroup(groupId);
  };

  const fetchAllLedgers = async () => {
    try {
      const response = await getLedgers();
      if (response.status === 200) {
        setAllLedgers(response?.data?.data);
      } else {
        console.log("No ledgers to display! ", response);
        setAllLedgers([]);
      }
    } catch (error) {
      toast.error("Error fetching ledgers");
      setAllLedgers([]);
    }
  };

  const fetchAllPatients = async () => {
    try {
      const response = await searchAllPatient(searchPatient);
      console.log("getall patient response", response);

      if (response.status === 200) {
        setAllPatients(response?.data?.data);
      } else {
        console.log("Failed to fetch patients", response);
        setAllPatients([]);
      }
    } catch (error) {
      console.log(error);
      setAllPatients([]);
    }
  };

  const fetchAllPatientsNo = async () => {
    try {
      const response = await getPatientEntryByPatientNo();
      console.log("getall patientno ---> ", response);

      if (response.status === 200) {
        setAllPatientNos(response?.data?.data);
      } else {
        console.log("Failed to fetch patients", response);
        setAllPatientNos([]);
      }
    } catch (error) {
      console.log(error);
      setAllPatientNos([]);
    }
  };

  useEffect(() => {
    fetchAllPatients();
    // fetchAllTestGroups();
    fetchAllLedgers();
    getOrSearchAllGroups();
    fetchAllPatientsNo();
  }, []);

  useEffect(() => {
    if (selectedGroupId) fetchAllTestNameByGroup(selectedGroupId);
  }, [selectedGroupId]);

  useEffect(() => {
    if (isPatientNoEditable && patientNo) {
      fetchPatientDetails(patientNo);
    }
  }, [patientNo]);

  // console.log("selectedGroupId: ", selectedGroupId);

  const calculateTotalCost = () => {
    const totalCost = selectedTestDetails.reduce(
      (acc, test) => acc + test.unit * test.cost,
      0
    );
    return totalCost;
  };

  useEffect(() => {
    const totalCost = calculateTotalCost();
    const netBalance =
      totalCost +
      costDetails.extraCharges -
      costDetails.discount -
      costDetails.advance;
    setCostDetails((prev) => ({ ...prev, totalCost, netBalance }));
  }, [
    selectedTestDetails,
    costDetails.extraCharges,
    costDetails.discount,
    costDetails.advance,
  ]);

  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setCostDetails((prev) => {
      const newCostDetails = { ...prev, [name]: parseFloat(value) || 0 };
      newCostDetails.netBalance =
        newCostDetails.totalCost +
        newCostDetails.extraCharges -
        newCostDetails.discount -
        newCostDetails.advance;

      return newCostDetails;
    });
  };

  const handleUpdateEntry = async () => {
    if (!selectedPatientId) {
      toast.warning("Please select a patient to update.");
      return;
    }

    if (
      !formData.date ||
      !formData.labNo ||
      !formData.title ||
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !costDetails.totalCost ||
      !costDetails.netBalance ||
      selectedTestDetails.length === 0
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formattedDate = formData.date
      ? moment(formData.date).format("DD/MM/YYYY")
      : "";

    try {
      const response = await updatePatientEntry(selectedPatientId, {
        date: formattedDate,
        labNo: formData.labNo,
        title: formData.title,
        paitentId: formData.name,
        age: formData.age,
        ledgerId: formData.account,
        paymentStatus: formData.paymentStatus,
        amount: parseFloat(formData.amount),
        gender: formData.gender,
        testId: selectedTestDetails.map((item) => item._id),
        patientId: formData.patientId,
        totalCost: parseFloat(costDetails.totalCost),
        extraCharges: parseFloat(costDetails.extraCharges),
        discount: parseFloat(costDetails.discount),
        advance: parseFloat(costDetails.advance),
        netBlance: parseFloat(costDetails.netBalance),
      });

      console.log("Update Res ---> ", response);

      if (response.status === 200) {
        toast.success("Patient entry updated successfully!");
      } else {
        toast.error(
          response?.data?.message || "Failed to update patient entry"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating patient entry."
      );
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPatientId) {
      toast.warning("Please select a patient to delete.");
      return;
    }

    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this patient?</p>
          <button
            onClick={async () => {
              closeToast();
              await confirmDelete();
            }}
            style={{
              marginRight: "10px",
              background: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Confirm
          </button>
          <button
            onClick={closeToast}
            style={{
              background: "gray",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async () => {
    try {
      const response = await deletePatientEntry(selectedPatientId);
      if (response) {
        toast.success("Patient entry deleted successfully!");
        handleClear();
        fetchAllPatientsNo();
      }
    } catch (error) {
      toast.error("Failed to delete patient entry.");
    }
  };

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Patient Entry Report
            </h1>
          </div>
        </div>

        {/* Patient Entry Form */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
          <form>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium">Date*</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>

              {/* Lab No */}
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <label className="block text-sm font-medium">Lab No.*</label>
                  <input
                    type="text"
                    value={formData.labNo}
                    onChange={(e) =>
                      setFormData({ ...formData, labNo: e.target.value })
                    }
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Patient No.*
                  </label>
                  <select
                    ref={patientNoRef}
                    disabled={!isPatientNoEditable}
                    value={patientNo}
                    onChange={(e) => setPatientNo(e.target.value)}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  >
                    <option value="" disabled>
                      Select Patient No...
                    </option>
                    {allPatientNos?.map((patient) => (
                      <option key={patient._id} value={patient.paitentNo}>
                        {patient.paitentNo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title*</label>
                <select
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                >
                  <option value="" disabled>
                    Select Title...
                  </option>
                  {["Mr.", "Ms.", "Mrs."].map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>

              {/* Patient Name & Add Patient Button */}
              <div>
                <label className="block text-sm font-medium">
                  Patient Name*
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    name="patient"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  >
                    <option value="" disabled>
                      Select Patient...
                    </option>
                    {allPatients?.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Add Patient
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium">Age*</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium">Gender*</label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {["male", "female"].map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Test Group */}
            <div className="mb-6">
              <label className="block text-sm font-medium">
                Search Test Group*
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Search test group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={getOrSearchAllGroups}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Test Group and Test Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Groups */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Test Groups*</h2>
                <ul className="border border-gray-300 rounded-lg p-4 h-48 overflow-y-scroll">
                  {allTestGroups?.map((group) => (
                    <li key={group._id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="testGroup"
                        className="mr-2"
                        value={group._id}
                        onChange={() => handleGroupSelection(group._id)}
                        checked={selectedGroupId === group._id}
                      />
                      {group.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Test Names */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Test Names*</h2>
                <ul className="border border-gray-300 rounded-lg p-4 h-48 overflow-y-scroll">
                  {selectedTests?.length > 0 ? (
                    selectedTests.map((test) => (
                      <li key={test._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="mr-2"
                          value={test._id}
                          onChange={() => handleTestSelection(test)}
                          checked={selectedTestDetails.some(
                            (t) => t._id === test._id
                          )}
                        />
                        {test.name}
                      </li>
                    ))
                  ) : (
                    <li>No tests available for the selected group.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Selected Tests Table */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Selected Tests*</h2>
              <table className="w-full border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">S.N</th>
                    <th className="border p-2">Test Name</th>
                    <th className="border p-2">Group</th>
                    <th className="border p-2">Normal Range</th>
                    <th className="border p-2">Unit</th>
                    <th className="border p-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTestDetails?.length > 0 ? (
                    selectedTestDetails?.map((test, index) => (
                      <tr key={test._id}>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{test.name}</td>
                        <td className="border p-2">{test.testGroupId?.name}</td>
                        <td className="border p-2">{test.normalRange}</td>
                        <td className="border p-2">{test.unit}</td>
                        <td className="border p-2">{test.cost}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border p-2 text-center" colSpan="6">
                        No tests selected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cost Details */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Cost Details*</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* Total Cost */}
                <div>
                  <label className="block text-sm font-medium">
                    Total Cost
                  </label>
                  <input
                    type="number"
                    name="totalCost"
                    value={costDetails.totalCost}
                    onChange={handleCostChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  />
                </div>

                {/* Extra Charges */}
                <div>
                  <label className="block text-sm font-medium">
                    Extra Charges
                  </label>
                  <input
                    type="number"
                    name="extraCharges"
                    value={costDetails.extraCharges}
                    onChange={handleCostChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium">Discount</label>
                  <input
                    type="number"
                    name="discount"
                    value={costDetails.discount}
                    onChange={handleCostChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  />
                </div>

                {/* Advance */}
                <div>
                  <label className="block text-sm font-medium">Advance</label>
                  <input
                    type="number"
                    name="advance"
                    value={costDetails.advance}
                    onChange={handleCostChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  />
                </div>

                {/* Net Balance */}
                <div>
                  <label className="block text-sm font-medium">
                    Net Balance*
                  </label>
                  <input
                    type="number"
                    value={costDetails.netBalance}
                    disabled
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              {/* Account & Payment Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Account */}
                <div>
                  <label className="block text-sm font-medium">Ledger*</label>
                  <select
                    value={formData.account}
                    onChange={(e) =>
                      setFormData({ ...formData, account: e.target.value })
                    }
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                  >
                    <option value="" disabled>
                      Select Ledger...
                    </option>
                    {allLedgers?.map((item, id) => (
                      <option value={item._id} key={id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Status & Paid Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium">
                      Payment Status*
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentStatus: e.target.value,
                        })
                      }
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                    >
                      <option value="" disabled>
                        Select Status...
                      </option>
                      {["paid", "unpaid"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Paid Amount*
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: Math.max(0, Number(e.target.value)),
                        })
                      }
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    patientNoRef.current.focus();
                    setIsPatientNoEditable(true);
                  }}
                  type="button"
                  className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Open
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 bg-[#124d7a] text-white rounded-lg hover:bg-opacity-90 transition duration-300"
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#127a29] text-white rounded-lg hover:bg-opacity-90 transition duration-300"
                  onClick={(e) => {
                    if (patientNo && isPatientNoEditable) {
                      handleUpdateEntry();
                    } else {
                      handleCreateEntry(e);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Add New Patient Modal */}
        {isModalOpen && (
          <AddNewPatient
            setIsModalOpen={setIsModalOpen}
            toggleModal={toggleModal}
            fetchAllPatients={fetchAllPatients}
          />
        )}
      </div>
    </div>
  );
};

export default PatientEntry;
