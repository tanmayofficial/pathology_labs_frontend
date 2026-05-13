import { axiosInstance } from "../utilities/axiosInstance";

export const getCashRegisterReports = async (fromDate, toDate, name) => {
  try {
    const response = await axiosInstance.get("/paitent-entry/cash-register-reports", {
      params: { fromDate, toDate, name },
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching cash register reports", error);
    return null;
  }
};