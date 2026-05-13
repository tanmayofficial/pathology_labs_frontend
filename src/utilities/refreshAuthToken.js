export const refreshAuthToken = async () => {
  try {
    const apiURL = process.env.REACT_APP_BASE_URL;
    const refreshToken = localStorage.getItem("refreshToken");

    const response = await axios.post(`${apiURL}/api/v1/token/refresh`, {
      refreshToken,
    });

    if (response.data?.accessToken) {
      localStorage.setItem("authToken", response.data.accessToken);
      return response.data.accessToken;
    }
    throw new Error("Failed to refresh token");
  } catch (error) {
    console.error("Error refreshing token", error);
    throw error;
  }
};
