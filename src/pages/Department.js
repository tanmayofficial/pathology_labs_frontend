import React, { useEffect, useRef, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
} from "../services/departmentService";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import GoBack from "../components/GoBack";

const Department = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [allDepartments, setAllDepartments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [totalDepartments, setTotalDepartments] = useState(0);

  const departmentNameRef = useRef(null);

  const handleAddOrUpdateDepartment = async () => {
    if (!departmentName) {
      toast.error("Department name is required");
      return;
    }
    const departmentData = { name: departmentName };

    if (updateId) {
      try {
        const response = await updateDepartment(departmentData, updateId);
        if (response.status === 200 || response.status === 201) {
          fetchDepartments(searchTerm);
          toast.success("Department updated successfully");
          handleClear();
        } else {
          toast.error(response?.data?.message || "Failed to update department");
        }
      } catch (error) {
        toast.error(
          error.message ||
            error?.data?.message ||
            "Error while updating department"
        );
      }
    } else {
      try {
        const response = await createDepartment(departmentData);
        if (response.status === 200 || response.status === 201) {
          fetchDepartments(searchTerm);
          toast.success("Department added successfully");
          handleClear();
        } else {
          toast.error(response?.data?.message || "Failed to add department");
        }
      } catch (error) {
        toast.error(
          error.message ||
            error?.data?.message ||
            "Error while adding department"
        );
      }
    }
  };

  const handleEditDepartment = (index, id) => {
    departmentNameRef.current.focus();
    const selectedDepartment = allDepartments[index];
    setDepartmentName(selectedDepartment.name);
    setEditIndex(index);
    setUpdateId(id);
  };

  const handleDeleteDepartment = async (id, name) => {
    try {
      const response = await deleteDepartment(id);
      if (response.status === 200) {
        toast.success(`${name} Department deleted successfully`);
        fetchDepartments(searchTerm);
      } else {
        console.log("Failed to delete department", response);
        toast.error(
          response?.data?.message || `Failed to delete ${name} department!`
        );
      }
    } catch (error) {
      console.log("Error while deleting department", error);
      toast.error(
        error.message ||
          error?.data?.message ||
          `Error while deleting ${name} department!`
      );
    }
  };

  const handleClear = () => {
    setDepartmentName("");
    setEditIndex(null);
    setUpdateId("");
  };

  const fetchDepartments = async (search = "") => {
    setIsLoading(true);
    try {
      const response = await getDepartments(search, pageSize);
      if (response.status === 200) {
        setAllDepartments(
          response?.data?.data?.items || response?.data?.data?.departments || []
        );
        setTotalDepartments(
          response?.data?.data?.totalItems ||
            response?.data?.data?.totalDepertment ||
            0
        );
      } else {
        setAllDepartments([]);
        setTotalDepartments(0);
        console.log("No departments to display! ", response);
      }
    } catch (error) {
      console.error("Error fetching departments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLoadMore = () => {
    if (pageSize < totalDepartments) {
      setPageSize((prev) => prev + 10);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDepartments(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pageSize]);


  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Department</h1>
          </div>
        </div>

        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium">
                Department Name*
              </label>
              <input
                ref={departmentNameRef}
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
              />
            </div>
          </div>

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
              onClick={handleAddOrUpdateDepartment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Department List</h2>
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allDepartments?.length > 0 ? (
                    allDepartments?.map((department, index) => (
                      <tr
                        key={department._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 text-center border-b border-gray-300 ">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {department.name}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 ">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditDepartment(index, department._id)
                            }
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteDepartment(
                                department._id,
                                department.name
                              )
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
                      <td colSpan="3" className="text-center">
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
              disabled={pageSize >= totalDepartments}
              className={`px-4 py-2 rounded-lg text-white ${
                pageSize >= totalDepartments
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pageSize >= totalDepartments ? "No More Data" : "Load More..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
