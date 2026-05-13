import { axiosInstance } from "../utilities/axiosInstance";


export const getCategories = async (searchTerm, pageSize) => {
  try {
    const response = await axiosInstance.get(`/category-register/get-all?pageSize=${pageSize}&categorySearch=${searchTerm}`);
    return response;
  } catch (error) {
    console.error("Error while fetching categories", error);
    return error;
  }
};

export const createCategory = async (category) => {
  try {
    const response = await axiosInstance.post(
      "/category-register/create",
      category
    );
    return response;
  } catch (error) {
    console.error("Error while adding category", error);
    return error.response || error;
  }
};

export const updateCategory = async (category, id) => {
  try {
    const response = await axiosInstance.put(
      `/category-register/update/${id}`,
      category
    );
    return response;
  } catch (error) {
    console.error("Error while updating category", error);
    return error.response || error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/category-register/delete/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error while deleting category", error);
    return error.response || error;
  }
};

export const searchCategories = async (query) => {
  try {
    const response = await axiosInstance.get(
      `/category-register/search?name=${query}`
    );
    return response;
  } catch (error) {
    console.error("Error while searching categories", error);
    return error.response || error;
  }
};
