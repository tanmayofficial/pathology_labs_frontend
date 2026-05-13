import { axiosInstance } from "../utilities/axiosInstance";

export const getLedgers = async () => {
  try {
    const response = await axiosInstance.get(`/ledger-register/get-all`);
    return response;
  } catch (error) {
    console.error("Error while fetching ledgers", error);
    return error.response || error;
  }
};


export const createLedger = async (ledger) => {
  try {
    const response = await axiosInstance.post(
      `/ledger-register/create`,
      ledger
    );
    return response;
  } catch (error) {
    console.error("Error while adding ledger", error);
    return error.response || error;
  }
};


export const updateLedger = async (ledger, id) => {
  try {
    const response = await axiosInstance.put(
      `/ledger-register/update/${id}`,
      ledger
    );
    return response;
  } catch (error) {
    console.error("Error while updating ledger", error);
    return error.response || error;
  }
};


export const deleteLedger = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/ledger-register/delete/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error while deleting ledger", error);
    return error.response || error;
  }
};

export const getAllLedgersReport = async (payload) => {
  try {
    const response = await axiosInstance.get(`/reports/ledger-reports`, {
      params: {
        accountType: payload.accountType,
        fromDate: payload.fromDate,
        toDate: payload.toDate
      }
    });
    return response;
  } catch (error) {
    console.error("Error while fetching ledgers", error);
    return error.response || error;
  }
};
