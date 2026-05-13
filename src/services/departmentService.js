import { axiosInstance } from "../utilities/axiosInstance";

export const getDepartments = async (searchTerm, pageSize) => {
  try {
    const response = await axiosInstance.get(`/depertment-register/get-all?pageSize=${pageSize}&depertmentSearch=${searchTerm}`);
    return response;
  } catch (error) {
    console.error("Error while fetching departments", error);
    return error.response || error;
  }
};

export const createDepartment = async (department) => {
  try {
    const response = await axiosInstance.post(
      "/depertment-register/create",
      department
    );
    return response;
  } catch (error) {
    console.error("Error while adding department", error);
    return error.response || error;
  }
};

export const updateDepartment = async (department, id) => {
  try {
    const response = await axiosInstance.put(
      `/depertment-register/update/${id}`,
      department
    );
    return response;
  } catch (error) {
    console.error("Error while updating department", error);
    return error.response || error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/depertment-register/delete/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error while deleting department", error);
    return error.response || error;
  }
};

export const searchDepartments = async (query) => {
  try {
    const response = await axiosInstance.get(
      `/depertment-register/search?name=${query}`
    );
    return response;
  } catch (error) {
    console.error("Error while searching departments", error);
    return error.response || error;
  }
};
