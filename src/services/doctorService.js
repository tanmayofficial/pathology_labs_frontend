import axios from "axios";
import { axiosInstance } from "../utilities/axiosInstance";

export const getDoctors = async (searchTerm, pageSize) => {
  try {
    const response = await axiosInstance.get(
      `/doctor-register/get-all/?doctorSearch=${searchTerm}&pageSize=${pageSize}`
    );
    return response;
  } catch (error) {
    console.error("Error while fetching doctors", error);
    return error;
  }
};

export const createDoctor = async (doctor) => {
  try {
    const response = await axiosInstance.post(
      `/doctor-register/create`,
      doctor
    );
    return response;
  } catch (error) {
    console.error("Error while adding doctor", error);
    return error.response || error;
  }
};

export const updateDoctor = async (doctor, id) => {
  try {
    const response = await axiosInstance.put(
      `/doctor-register/update/${id}`,
      doctor
    );
    return response;
  } catch (error) {
    console.error("Error while updating doctor", error);
    return error.response || error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/doctor-register/delete/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error while deleting doctor", error);
    return error.response || error;
  }
};

export const searchDoctor = async (name) => {
  try {
    const url = `/doctor-register/search`;
    if (name) {
      url += `?name=${name}`;
    }
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.error("Error while searching for doctor", error);
    throw error;
  }
};