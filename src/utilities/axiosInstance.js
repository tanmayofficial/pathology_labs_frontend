import axios from "axios";

const apiURL = `${process.env.REACT_APP_BASE_URL}/api/v1`;

const getAuthToken = () => localStorage.getItem("authToken");


export const axiosInstance = axios.create({ baseURL: apiURL });


axiosInstance.interceptors.request.use((config) => {
  const authToken = getAuthToken();
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
}, Promise.reject);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
