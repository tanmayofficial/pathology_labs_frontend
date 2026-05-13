import { axiosInstance } from "../utilities/axiosInstance";

export const getTestGroups = async (searchTerm, pageSize) => {
  try {
    const response = await axiosInstance.get(
      `/group/get-all?pageSize=${pageSize}&groupSearch=${searchTerm}`
    );
    return response;
  } catch (error) {
    console.error("Error while fetching test groups", error);
    throw error;
  }
};

export const createTestGroup = async (testGroup) => {
  try {
    const response = await axiosInstance.post("/group/create", testGroup);
    return response;
  } catch (error) {
    console.error("Error while creating test group", error);
    throw error;
  }
};

export const updateTestGroup = async (id, testGroup) => {
  try {
    const response = await axiosInstance.put(`/group/update/${id}`, testGroup);
    return response;
  } catch (error) {
    console.error("Error while updating test group", error);
    throw error;
  }
};

export const deleteTestGroup = async (id) => {
  try {
    const response = await axiosInstance.delete(`/group/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error while deleting test group", error);
    throw error;
  }
};

export const searchTestGroups = async (name) => {
  try {
    const url = `group/get-all-group-name?groupSearch=${name}`;
    // if (name) {
    //   url += `?name=${name}`;
    // }
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.error("Error while searching for test groups", error);
    throw error;
  }
};
