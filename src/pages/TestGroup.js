import React, { useState, useEffect, useRef } from "react";
import GoBack from "../components/GoBack";
import {
  createTestGroup,
  deleteTestGroup,
  getTestGroups,
  searchTestGroups,
  updateTestGroup,
} from "../services/testGroupService";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const TestGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [subGroup, setSubGroup] = useState(false);
  const [cost, setCost] = useState("");
  const [testGroups, setTestGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [totalTestGroups, setTotalTestGroups] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const groupNameRef = useRef(null);

  const handleClear = () => {
    setGroupName("");
    setCost("");
    setSubGroup(false);
    setEditGroupId(null);
  };

  const handleEditGroup = (index, group) => {
    const selectedGroup = testGroups[index];

    if (!selectedGroup) {
      return;
    }
    groupNameRef.current.focus();

    setGroupName(group.name || "");
    setCost(group.cost || "");
    setEditIndex(index);
    setEditGroupId(group._id);
  };

  const handleAddOrUpdateGroup = async () => {
    if (!groupName) {
      toast.error("Please enter group name");
      return;
    } else if (!cost) {
      toast.error("Please enter cost");
      return;
    }

    const groupData = {
      name: groupName,
      cost: parseFloat(cost) || 0,
    };

    if (editGroupId) {
      try {
        const response = await updateTestGroup(editGroupId, groupData);
        console.log("update response: ", response);
        if (response.status === 200 || response.status === 201) {
          const updatedTestGroups = [...testGroups];
          updatedTestGroups[editIndex] = response?.data?.data;
          setTestGroups(updatedTestGroups);

          toast.success("Group updated successfully");
          handleClear();
        } else {
          console.error("Failed to update group", response);
          toast.error(response?.data?.message || "Failed to update group");
        }
      } catch (error) {
        toast.error(
          error.message || error?.data?.message || "Error updating group"
        );
        console.error("Error updating group", error);
      }
    } else {
      try {
        const response = await createTestGroup(groupData);
        console.log("create response: ", response);

        if (response.status === 200 || response.status === 201) {
          setTestGroups([response?.data?.data, ...testGroups]);
          fetchAllGroups();
          handleClear();
          toast.success("Group added successfully");
        } else {
          console.error("Failed to add group", response);
        }
      } catch (error) {
        toast.error(
          error.message || error?.data?.message || "Error adding group"
        );
        console.error("Error adding group", error);
      }
    }
  };

  const handleDeleteGroup = async (id, name) => {
    try {
      const response = await deleteTestGroup(id);
      if (response.status === 200) {
        setTestGroups(
          testGroups.length > 0
            ? testGroups.filter((group) => group._id !== id)
            : []
        );
        toast.success(`${name} deleted successfully`);
        // fetchAllGroups(searchQuery);
      } else {
        console.error("Failed to delete group", response);
        toast.error(response?.data?.message || `Failed to delete ${name}`);
      }
    } catch (error) {
      console.error("Error deleting group", error);
      toast.error(
        error.message || error?.data?.message || "Error deleting group"
      );
    }
  };

  const fetchAllGroups = async (search = "") => {
    setIsLoading(true);
    try {
      const response = await getTestGroups(search, pageSize);
      console.log("get testgroups response", response);
      if (response.status === 200) {
        setTestGroups(response?.data?.data?.testGroups || []);
        setTotalTestGroups(response?.data?.data?.totalItems || 0);
      } else {
        console.log("Failed to fetch groups", response);
      }
    } catch (error) {
      console.error("Error searching groups", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    if (pageSize < totalTestGroups) {
      setPageSize((prev) => prev + 10);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAllGroups(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, pageSize]);

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Test Group</h1>
          </div>
        </div>

        {/* Input Fields */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium">Group Name*</label>
              <input
                type="text"
                ref={groupNameRef}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>

            {/* Sub Group Checkbox */}
            <div className="flex items-center">
              <input
                disabled
                type="checkbox"
                checked={subGroup}
                onChange={(e) => setSubGroup(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Is Sub Group?</label>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium">Cost*</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
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
              onClick={handleAddOrUpdateGroup}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {editGroupId ? "Update Group" : "Add Group"}
            </button>
          </div>
        </div>

        {/* Test Groups Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 flex justify-center items-center border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Test Groups List</h2>
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
                      Group
                    </th>
                    {/* <th className="px-4 py-2 text-center border-b border-gray-300">Sub Group</th> */}
                    <th className="px-4 py-2 text-center border-b border-gray-300">
                      Cost
                    </th>
                    <th className="px-4 py-2 text-center border-b border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testGroups?.length > 0 ? (
                    testGroups?.map((group, index) => (
                      <tr
                        key={group._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {group.name}
                        </td>
                        {/* <td className="px-4 py-2 text-center border-b border-gray-300">
                    {group.subGroup ? "True" : "False"}
                  </td> */}

                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {group.cost}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          <button
                            type="button"
                            onClick={() => handleEditGroup(index, group)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteGroup(group._id, group.name)
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
                      <td colSpan="4" className="text-center">
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
              disabled={pageSize >= totalTestGroups}
              className={`px-4 py-2 rounded-lg text-white ${
                pageSize >= totalTestGroups
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pageSize >= totalTestGroups ? "No More Data" : "Load More..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestGroup;
