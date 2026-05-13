import { axiosInstance } from "../utilities/axiosInstance";

export const getPatients = async (query, pageSize) => {
  try {
    const response = await axiosInstance.get(`/paitent-register/get-all?paitentSearch=${query}&pageSize=${pageSize}`);
    return response;
  } catch (error) {
    console.error("Error while fetching patients", error);
    return error.response || error;
  }
};

export const createPatient = async (patient) => {
  try {
    const response = await axiosInstance.post("/paitent-register/create",
      patient
    );
    return response;
  } catch (error) {
    console.error("Error while adding patient", error);
    return error.response || error;
  }
};

export const updatePatient = async (patient, id) => {
  try {
    const response = await axiosInstance.put(
      `/paitent-register/update/${id}`,
      patient
    );
    return response;
  } catch (error) {
    console.error("Error while updating patient", error);
    return error.response || error;
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/paitent-register/delete/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error while deleting patient", error);
    return error.response || error;
  }
};

export const createPatientEntry = async (patientEntry) => {
  try {
    const response = await axiosInstance.post(
      "/paitent-entry/create",
      patientEntry
    );
    return response;
  } catch (error) {
    console.error("Error while creating patient entry", error);
    return error.response || error;
  }
};

export const getPatientEntries = async () => {
  try {
    const response = await axiosInstance.get("/paitent-entry/get-all");
    return response;
  } catch (error) {
    console.error("Error while fetching patient entries", error);
    return error.response || error;
  }
};

export const updatePatientEntry = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/paitent-entry/update/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating patient entry:", error);
    throw error;
  }
};

export const deletePatientEntry = async (id) => {
  try {
    const response = await axiosInstance.delete(`/paitent-entry/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error while deleting patient entry", error);
    return error.response || error;
  }
};

export const getTestsByTestGroup = async (groupId) => {
  try {
    const response = await axiosInstance.get(`/test/${groupId}`);
    return response;
  } catch (error) {
    console.error("Error while fetching test groups", error);
    return error.response || error;
  }
};

export const getPatientDetails = async (patientNo) => {
  try {
    const response = await axiosInstance.get(`/paitent-entry/${patientNo}`);
    return response;
  } catch (error) {
    console.error("Error while fetching patient details", error);
    return error.response || error;
  }
}

export const getPatientInvoiceEntries = async ({ page, pageSize, fromDate, toDate, name }) => {
  try {
    const response = await axiosInstance.get("/paitent-entry/get-all", {
      params: {
        page,
        pageSize,
        fromDate,
        toDate,
        name,
      },
    });
    return response;
  } catch (error) {
    console.error("Error while fetching patient entries", error);
    return error.response || error;
  }
};


export const getPatientEntryByPatientNo = async () => {
  try {
    const response = await axiosInstance.get(`/paitent-entry/paitent-no`);
    return response;
  } catch (error) {
    console.error("Error while fetching patient entry", error);
    return error.response || error;
  }
}


export const searchAllPatient = async (query) => {
  try {
    const response = await axiosInstance.get(`/paitent-register/search?name=${query}`);
    return response;
  } catch (error) {
    console.error("Error while fetching patients", error);
    return error.response || error;
  }
} 

export const getAllPatientEntryReport = async (payload) => {
  try {
    const response = await axiosInstance.get(`/paitent-entry/get-all`, {
      params: {
        fromDate: payload.fromDate,
        toDate: payload.toDate,
        pageSize: payload.pageSize,  
        paitentSearch: payload.searchTerm,
      },
    });
    return response;
  } catch (error) {
    console.error("Error while fetching report", error);
    return error.response || error;
  }
};

export const getPatientTestDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/paitent-entry/test-by-paitent-id/${id}`);
    return response;
  } catch (error) {
    console.error("Error while fetching patient test details", error);
    return error.response || error;
  }
}

