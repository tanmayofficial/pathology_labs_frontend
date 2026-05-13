import { axiosInstance } from "../utilities/axiosInstance";

export const getTests = async () => {
  try {
    const response = await axiosInstance.get(`/test/get-all`);
    return response;
  } catch (error) {
    console.error("Error while fetching tests", error);
    throw error;
  }
};

export const createTest = async (test) => {
  try {
    const response = await axiosInstance.post(`/test/create`, test);
    return response;
  } catch (error) {
    console.error("Error while creating test", error);
    throw error;
  }
};

export const updateTest = async (id, test) => {
  try {
    const response = await axiosInstance.put(`/test/update/${id}`, test);
    return response;
  } catch (error) {
    console.error("Error while updating test", error);
    throw error;
  }
};

export const deleteTest = async (id) => {
  try {
    const response = await axiosInstance.delete(`/test/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error while deleting test", error);
    throw error;
  }
};

export const searchTests = async (searchTerm, pageSize) => {
  try {
    const response = await axiosInstance.get(`/test/get-all?pageSize=${pageSize}&testSearch=${searchTerm}`);
    return response;
  } catch (error) {
    console.error("Error while searching for tests", error);
    throw error;
  }
};

export const getAllTests = async ({ page, pageSize, name, group, cost }) => {
  try {
    const response = await axiosInstance.get(`/test/test-reports`, {
      params: {
        page,
        pageSize,
        name,
        group,
        cost,
      },
    });
    return response;
  } catch (error) {
    console.error("Error while fetching all tests", error);
    throw error;
  }
};
