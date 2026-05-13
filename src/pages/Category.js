import React, { useRef, useState } from "react";
// import {
//   getCategories,
//   createCategory,
//   updateCategory,
//   deleteCategory,
//   searchCategories,
// } from "../services/categoryService";
import { toast } from "react-toastify";
import GoBack from "../components/GoBack";
import { ClipLoader } from "react-spinners";

const hardcodedCategories = [
  { _id: "category-001", name: "General" },
  { _id: "category-002", name: "Emergency" },
  { _id: "category-003", name: "Corporate" },
  { _id: "category-004", name: "Senior Citizen" },
  { _id: "category-005", name: "Insurance" },
  { _id: "category-006", name: "Out Patient" },
  { _id: "category-007", name: "In Patient" },
  { _id: "category-008", name: "Health Camp" },
  { _id: "category-009", name: "Routine Checkup" },
  { _id: "category-010", name: "Follow Up" },
  { _id: "category-011", name: "Referral" },
  { _id: "category-012", name: "Home Collection" },
];

const Category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [allCategories, setAllCategories] = useState(hardcodedCategories);
  const [updateId, setUpdateId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);

  const categoryNameRef = useRef(null);

  const handleAddOrUpdateCategory = async () => {
    if (!categoryName) {
      toast.warn("Category name is required");
      return;
    }

    const categoryData = { name: categoryName };

    if (updateId) {
      // try {
      //   const response = await updateCategory(categoryData, updateId);
      //   if (response.status === 200 || response.status === 201) {
      //     fetchCategories(searchTerm);
      //     toast.success("Category updated successfully");
      //     handleClear();
      //   } else {
      //     console.error("Failed to update category", response);
      //     toast.error(response?.data?.message || "Failed to update category");
      //   }
      // } catch (error) {
      //   toast.error(
      //     error.message || error?.data?.message || "Error updating category"
      //   );
      //   console.error("Error while updating category", error);
      // }

      setAllCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === updateId ? { ...category, ...categoryData } : category
        )
      );
      toast.success("Category updated successfully");
      handleClear();
    } else {
      // try {
      //   const response = await createCategory(categoryData);
      //   console.log("createCategory response: ", response);
      //
      //   if (response.status === 200 || response.status === 201) {
      //     fetchCategories();
      //     handleClear();
      //     toast.success("Category added successfully");
      //   } else {
      //     toast.error("Failed to add category");
      //   }
      // } catch (error) {
      //   toast.error("Error while adding category");
      //   console.error("Error adding category", error);
      // }

      setAllCategories((prevCategories) => [
        { _id: `category-${Date.now()}`, ...categoryData },
        ...prevCategories,
      ]);
      handleClear();
      toast.success("Category added successfully");
    }
  };

  const handleEditCategory = (category) => {
    if (!category) return;

    categoryNameRef.current.focus();
    setCategoryName(category.name || "");
    setUpdateId(category._id);
  };

  const handleDeleteCategory = async (id, name) => {
    // try {
    //   const response = await deleteCategory(id);
    //   if (response.status === 200) {
    //     toast.success(`${name} deleted successfully`);
    //     fetchCategories(searchTerm);
    //   } else {
    //     toast.error(response?.data?.message || `Failed to delete ${name}`);
    //   }
    // } catch (error) {
    //   toast.error(
    //     error.message || error?.data?.message || "Error while deleting category"
    //   );
    //   console.error("Error deleting category!", error);
    // }

    setAllCategories((prevCategories) =>
      prevCategories.filter((category) => category._id !== id)
    );
    if (updateId === id) {
      handleClear();
    }
    toast.success(`${name} deleted successfully`);
  };

  const handleClear = () => {
    setCategoryName("");
    setUpdateId("");
  };

  // const fetchCategories = async (search = "") => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getCategories(search, pageSize);
  //     console.log("get categories response!", response);
  //
  //     if (response.status === 200) {
  //       setAllCategories(
  //         response?.data?.data?.items || response?.data?.data?.category || []
  //       );
  //       setTotalCategories(
  //         response?.data?.data?.length ||
  //           response?.data?.data?.totalCategory ||
  //           0
  //       );
  //     } else {
  //       console.log("No categories to display! ", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    setPageSize(10);
  };

  const handleLoadMore = () => {
    if (pageSize < totalCategories) {
      setPageSize((prev) => prev + 10);
    }
  };

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     fetchCategories(searchTerm);
  //   }, 500);
  //
  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchTerm, pageSize]);

  const filteredCategories = allCategories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedCategories = filteredCategories.slice(0, pageSize);
  const totalCategories = filteredCategories.length;

  return (
    <div className="bg-gradient-to-r bg-gray-200 text-black min-h-screen py-10">
      <div className="container mx-auto px-6 md:px-20 lg:px-15">
        <div className="relative mt-8 mb-3">
          <GoBack />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Category</h1>
          </div>
        </div>

        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium">
                Category Name*
              </label>
              <input
                ref={categoryNameRef}
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
              onClick={handleAddOrUpdateCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {updateId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#e94560] focus:outline-none"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Category List</h2>
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
                  {displayedCategories?.length > 0 ? (
                    displayedCategories?.map((category, index) => (
                      <tr
                        key={category._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 text-center border-b border-gray-300 ">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          {category.name}
                        </td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 ">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditCategory(category)
                            }
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCategory(category._id, category.name)
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
              disabled={pageSize >= totalCategories}
              className={`px-4 py-2 rounded-lg text-white ${
                pageSize >= totalCategories
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pageSize >= totalCategories ? "No More Data" : "Load More..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
