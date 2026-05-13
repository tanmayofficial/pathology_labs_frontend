import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import GoBack from "../components/GoBack";
// import {
//   createTest,
//   updateTest,
//   deleteTest,
//   searchTests,
// } from "../services/testService";
// import { getTestGroups, searchTestGroups } from "../services/testGroupService";
import TestsList from "../components/TestsList";

const hardcodedTestGroups = [
  { _id: "group-001", name: "Hematology" },
  { _id: "group-002", name: "Biochemistry" },
  { _id: "group-003", name: "Serology" },
  { _id: "group-004", name: "Microbiology" },
];

const hardcodedTests = [
  {
    _id: "test-001",
    name: "Hemoglobin",
    testGroupId: "group-001",
    testGroups: { _id: "group-001", name: "Hematology" },
    serialNo: "1",
    testCode: "HB",
    unit: 1,
    defultValue: 13.5,
    cost: 150,
    normalRange: "12-17",
    lowerRangeMale: 13,
    upperRangeMale: 17,
    lowerRangeFemle: 12,
    upperRangeFemle: 15,
    notes: "Whole blood sample",
    widalTest: false,
  },
  {
    _id: "test-002",
    name: "Total Leukocyte Count",
    testGroupId: "group-001",
    testGroups: { _id: "group-001", name: "Hematology" },
    serialNo: "2",
    testCode: "TLC",
    unit: 1,
    defultValue: 8000,
    cost: 180,
    normalRange: "4000-11000",
    lowerRangeMale: 4000,
    upperRangeMale: 11000,
    lowerRangeFemle: 4000,
    upperRangeFemle: 11000,
    notes: "",
    widalTest: false,
  },
  {
    _id: "test-003",
    name: "Blood Sugar Fasting",
    testGroupId: "group-002",
    testGroups: { _id: "group-002", name: "Biochemistry" },
    serialNo: "3",
    testCode: "BSF",
    unit: 1,
    defultValue: 90,
    cost: 120,
    normalRange: "70-100",
    lowerRangeMale: 70,
    upperRangeMale: 100,
    lowerRangeFemle: 70,
    upperRangeFemle: 100,
    notes: "Fasting sample preferred",
    widalTest: false,
  },
  {
    _id: "test-004",
    name: "Liver Function Test",
    testGroupId: "group-002",
    testGroups: { _id: "group-002", name: "Biochemistry" },
    serialNo: "4",
    testCode: "LFT",
    unit: 1,
    defultValue: 0,
    cost: 700,
    normalRange: "0-40",
    lowerRangeMale: 0,
    upperRangeMale: 40,
    lowerRangeFemle: 0,
    upperRangeFemle: 40,
    notes: "",
    widalTest: false,
  },
  {
    _id: "test-005",
    name: "Widal Test",
    testGroupId: "group-003",
    testGroups: { _id: "group-003", name: "Serology" },
    serialNo: "5",
    testCode: "WIDAL",
    unit: 1,
    defultValue: 0,
    cost: 350,
    normalRange: "0-160",
    lowerRangeMale: 0,
    upperRangeMale: 160,
    lowerRangeFemle: 0,
    upperRangeFemle: 160,
    notes: "Agglutination test",
    widalTest: true,
  },
  {
    _id: "test-006",
    name: "Urine Culture",
    testGroupId: "group-004",
    testGroups: { _id: "group-004", name: "Microbiology" },
    serialNo: "6",
    testCode: "UC",
    unit: 1,
    defultValue: 0,
    cost: 600,
    normalRange: "0-0",
    lowerRangeMale: 0,
    upperRangeMale: 0,
    lowerRangeFemle: 0,
    upperRangeFemle: 0,
    notes: "Sterile container sample",
    widalTest: false,
  },
  {
    _id: "test-007",
    name: "Creatinine",
    testGroupId: "group-002",
    testGroups: { _id: "group-002", name: "Biochemistry" },
    serialNo: "7",
    testCode: "CRE",
    unit: 1,
    defultValue: 1,
    cost: 220,
    normalRange: "0.6-1.3",
    lowerRangeMale: 0.7,
    upperRangeMale: 1.3,
    lowerRangeFemle: 0.6,
    upperRangeFemle: 1.1,
    notes: "",
    widalTest: false,
  },
  {
    _id: "test-008",
    name: "Platelet Count",
    testGroupId: "group-001",
    testGroups: { _id: "group-001", name: "Hematology" },
    serialNo: "8",
    testCode: "PLT",
    unit: 1,
    defultValue: 250000,
    cost: 200,
    normalRange: "150000-450000",
    lowerRangeMale: 150000,
    upperRangeMale: 450000,
    lowerRangeFemle: 150000,
    upperRangeFemle: 450000,
    notes: "",
    widalTest: false,
  },
  {
    _id: "test-009",
    name: "C-Reactive Protein",
    testGroupId: "group-003",
    testGroups: { _id: "group-003", name: "Serology" },
    serialNo: "9",
    testCode: "CRP",
    unit: 1,
    defultValue: 5,
    cost: 500,
    normalRange: "0-6",
    lowerRangeMale: 0,
    upperRangeMale: 6,
    lowerRangeFemle: 0,
    upperRangeFemle: 6,
    notes: "",
    widalTest: false,
  },
  {
    _id: "test-010",
    name: "Blood Urea",
    testGroupId: "group-002",
    testGroups: { _id: "group-002", name: "Biochemistry" },
    serialNo: "10",
    testCode: "UREA",
    unit: 1,
    defultValue: 30,
    cost: 180,
    normalRange: "15-45",
    lowerRangeMale: 15,
    upperRangeMale: 45,
    lowerRangeFemle: 15,
    upperRangeFemle: 45,
    notes: "",
    widalTest: false,
  },
  {
    _id: "test-011",
    name: "Malaria Parasite",
    testGroupId: "group-004",
    testGroups: { _id: "group-004", name: "Microbiology" },
    serialNo: "11",
    testCode: "MP",
    unit: 1,
    defultValue: 0,
    cost: 250,
    normalRange: "0-0",
    lowerRangeMale: 0,
    upperRangeMale: 0,
    lowerRangeFemle: 0,
    upperRangeFemle: 0,
    notes: "Peripheral smear",
    widalTest: false,
  },
  {
    _id: "test-012",
    name: "ESR",
    testGroupId: "group-001",
    testGroups: { _id: "group-001", name: "Hematology" },
    serialNo: "12",
    testCode: "ESR",
    unit: 1,
    defultValue: 10,
    cost: 120,
    normalRange: "0-20",
    lowerRangeMale: 0,
    upperRangeMale: 15,
    lowerRangeFemle: 0,
    upperRangeFemle: 20,
    notes: "",
    widalTest: false,
  },
];

const Test = () => {
  const [testName, setTestName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [underSubgroup] = useState(false);
  const [subgroup, setSubgroup] = useState("");
  const [group, setGroup] = useState("");
  const [testCode, setTestCode] = useState("");
  const [unit, setUnit] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [cost, setCost] = useState("");
  const [normalRange, setNormalRange] = useState("");
  const [normalRangeMalelower, setNormalRangeMalelower] = useState("");
  const [normalRangeMaleupper, setNormalRangeMaleupper] = useState("");
  const [normalRangeFemalelower, setNormalRangeFemalelower] = useState("");
  const [normalRangeFemaleupper, setNormalRangeFemaleupper] = useState("");
  const [notes, setNotes] = useState("");
  const [widalTest, setWidalTest] = useState(false);
  const [testGroups] = useState(hardcodedTestGroups);
  const [tests, setTests] = useState(hardcodedTests);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [, setEditIndex] = useState(null);
  const [editTestId, setEditTestId] = useState(null);
  const [isLoading] = useState(false);

  const testNameRef = useRef(null);

  const handleClear = () => {
    setTestName("");
    setSerialNumber("");
    setGroup("");
    setTestCode("");
    setUnit("");
    setDefaultValue("");
    setCost("");
    setNormalRange("");
    setNormalRangeMalelower("");
    setNormalRangeMaleupper("");
    setNormalRangeFemalelower("");
    setNormalRangeFemaleupper("");
    setNotes("");
    setWidalTest(false);
    setEditTestId(null);
    setEditIndex(null);
  };

  // const fetchGroups = async (group = "") => {
  //   try {
  //     const response = await searchTestGroups(group);
  //     console.log("first response", response);
  //     if (response.status === 200) {
  //       setTestGroups(response?.data?.data);
  //     } else {
  //       console.log("Failed to fetch test groups.", response);
  //       setTestGroups([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching test groups", error);
  //   }
  // };

  const handleAddOrUpdateTest = async () => {
    if (
      !testName ||
      !group ||
      !serialNumber ||
      !testCode ||
      !unit ||
      !defaultValue ||
      !cost ||
      !normalRange ||
      !normalRangeMalelower ||
      !normalRangeMaleupper ||
      !normalRangeFemalelower ||
      !normalRangeFemaleupper
    ) {
      return toast.warn("Fill all required fields!");
    }

    const testData = {
      name: testName,
      testGroupId: group,
      serialNo: serialNumber,
      testCode,
      unit: parseFloat(unit) || 0,
      defultValue: parseFloat(defaultValue) || 0,
      cost: parseFloat(cost) || 0,
      normalRange: normalRange,
      lowerRangeMale: parseFloat(normalRangeMalelower) || 0,
      upperRangeMale: parseFloat(normalRangeMaleupper) || 0,
      lowerRangeFemle: parseFloat(normalRangeFemalelower) || 0,
      upperRangeFemle: parseFloat(normalRangeFemaleupper) || 0,
      notes,
      widalTest,
    };
    const selectedGroup = testGroups.find(
      (testGroup) => testGroup._id === group
    );
    const localTestData = {
      ...testData,
      testGroups: selectedGroup || { _id: group, name: "N/A" },
    };

    if (editTestId) {
      // try {
      //   const response = await updateTest(editTestId, testData);
      //   if (response.status === 200 || response.status === 201) {
      //     setTests([response?.data?.data, ...tests]);
      //     const updatedTests = [...tests];
      //     updatedTests[editIndex] = response?.data?.data;

      //     setTests(updatedTests);
      //     toast.success("Test updated successfully!");
      //     handleClear();
      //   } else {
      //     console.error("Error updating test", response);
      //     toast.error(response?.data?.message || "Failed to update test.");
      //   }
      // } catch (error) {
      //   console.log("Failed to update test.", error);
      //   toast.error(
      //     error.message || error?.data?.message || "Failed to update test!"
      //   );
      // }

      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === editTestId ? { ...test, ...localTestData } : test
        )
      );
      toast.success("Test updated successfully!");
      handleClear();
    } else {
      // try {
      //   const response = await createTest(testData);
      //   if (response.status === 200 || response.status === 201) {
      //     setTests([response?.data?.data, ...tests]);

      //     toast.success("Test added successfully!");
      //     fetchAllTests(searchQuery);
      //     handleClear();
      //   } else {
      //     console.error("Error creating test", response);
      //     toast.error(response?.data?.message || "Failed to add test");
      //   }
      // } catch (error) {
      //   toast.error(
      //     error.message || error?.data?.message || "Error adding test."
      //   );
      //   console.error("Error in adding test:", error);
      // }

      setTests((prevTests) => [
        { _id: `test-${Date.now()}`, ...localTestData },
        ...prevTests,
      ]);
      toast.success("Test added successfully!");
      handleClear();
    }
  };

  const handleDeleteTest = async (id, name) => {
    // try {
    //   const response = await deleteTest(id);

    //   if (response.status === 200) {
    //     setTests(
    //       tests?.length > 0 ? tests?.filter((test) => test._id !== id) : []
    //     );
    //     toast.success(`${name} deleted successfully!`);
    //   } else {
    //     toast.error(response?.data?.message || "Failed to delete test.");
    //     console.error("Failed to delete doctor", response);
    //   }
    // } catch (error) {
    //   toast.error(
    //     error?.message || error?.data?.message || "Error deleting test."
    //   );
    //   console.error("Error while deleting test", error);
    // }

    setTests((prevTests) =>
      prevTests?.length > 0 ? prevTests?.filter((test) => test._id !== id) : []
    );
    toast.success(`${name} deleted successfully!`);
  };

  const handleEditTest = (index, test) => {
    if (!test) return;

    testNameRef.current.focus();

    setTestName(test.name || "");
    setSerialNumber(test.serialNo || "");
    setGroup(test.testGroupId || "");
    setTestCode(test.testCode || "");
    setUnit(test.unit || "");
    setDefaultValue(test.defultValue || "");
    setCost(test.cost || "");
    setNormalRange(test.normalRange || "");
    setNormalRangeMalelower(test.lowerRangeMale || "");
    setNormalRangeMaleupper(test.upperRangeMale || "");
    setNormalRangeFemalelower(test.lowerRangeFemle || "");
    setNormalRangeFemaleupper(test.upperRangeFemle || "");
    setNotes(test.notes || "");
    setWidalTest(test.widalTest || false);
    setEditTestId(test._id);
    setEditIndex(index);
  };

  // const fetchAllTests = async (search = "") => {
  //   setIsLoading(true);
  //   try {
  //     const response = await searchTests(search, pageSize);
  //     console.log("get test response", response);
  //     if (response.status === 200) {
  //       setTests(response?.data?.data?.items || []);
  //       setTotalTests(response?.data?.data?.totalItems || 0);
  //     } else {
  //       console.log("Failed to fetch tests", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching tests", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const filteredTests = tests?.filter((test) => {
    const searchValue = searchQuery.toLowerCase();

    return (
      test.name?.toLowerCase().includes(searchValue) ||
      test.testCode?.toLowerCase().includes(searchValue) ||
      test.serialNo?.toString().toLowerCase().includes(searchValue) ||
      test.testGroups?.name?.toLowerCase().includes(searchValue)
    );
  });
  const displayedTests = filteredTests?.slice(0, pageSize);
  const totalTests = filteredTests?.length || 0;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPageSize(10);
  };

  const handleLoadMore = () => {
    if (pageSize < totalTests) {
      setPageSize((prev) => prev + 10);
    }
  };

  // useEffect(() => {
  //   fetchGroups();
  // }, []);

  useEffect(() => {
    if (
      normalRangeMalelower &&
      normalRangeMaleupper &&
      normalRangeFemalelower &&
      normalRangeFemaleupper
    ) {
      const lower = Math.min(
        parseFloat(normalRangeMalelower) || 0,
        parseFloat(normalRangeFemalelower) || 0
      );
      const upper = Math.max(
        parseFloat(normalRangeMaleupper) || 0,
        parseFloat(normalRangeFemaleupper) || 0
      );
  
      setNormalRange(`${lower}-${upper}`);
    } else {
      setNormalRange("");
    }
  }, [
    normalRangeMalelower,
    normalRangeMaleupper,
    normalRangeFemalelower,
    normalRangeFemaleupper,
  ]);
  

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     fetchAllTests(searchQuery);
  //   }, 500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchQuery, pageSize]);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Test</h1>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium">Test Name*</label>
              <input
                type="text"
                value={testName}
                ref={testNameRef}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Serial Order No.*
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Group*</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              >
                <option value="">Select group...</option>
                {testGroups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium">
                Under Subgroup
              </label>
              <input
                type="checkbox"
                // disabled
                checked={underSubgroup}
                onChange={() => setUnderSubgroup(!underSubgroup)}
                className="mt-3 w-5 h-5"
              />
            </div> */}
            {underSubgroup && (
              <div>
                <label className="block text-sm font-medium">Subgroup</label>
                <input
                  type="text"
                  value={subgroup}
                  onChange={(e) => setSubgroup(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Test Code*</label>
              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Unit*</label>
              <input
                type="number"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Default Value*
              </label>
              <input
                type="number"
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Cost*</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Normal Range*</label>
              <input
                type="text"
                value={normalRange}
                disabled
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Normal Range (Male)*
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Lower"
                  value={normalRangeMalelower}
                  onChange={(e) => setNormalRangeMalelower(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Upper"
                  value={normalRangeMaleupper}
                  onChange={(e) => setNormalRangeMaleupper(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Normal Range (Female)*
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Lower"
                  value={normalRangeFemalelower}
                  onChange={(e) => setNormalRangeFemalelower(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Upper"
                  value={normalRangeFemaleupper}
                  onChange={(e) => setNormalRangeFemaleupper(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">Widal Test</label>
            <input
              type="checkbox"
              checked={widalTest}
              onChange={() => setWidalTest(!widalTest)}
              className="mt-3 w-5 h-5"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Clear
            </button>
            <button
              onClick={handleAddOrUpdateTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editTestId ? "Update Test" : "Add Test"}
            </button>
          </div>
        </div>

        {/* Tests Table */}
        <TestsList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isLoading={isLoading}
          tests={displayedTests}
          handleEditTest={handleEditTest}
          handleDeleteTest={handleDeleteTest}
          handleLoadMore={handleLoadMore}
          pageSize={pageSize}
          totalTests={totalTests}
        />
      </div>
    </div>
  );
};

export default Test;
