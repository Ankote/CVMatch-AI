import axios from "../api/axios";

export async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "/api/token/refresh/", // ✅ Fixed URL
      {}, // ✅ Empty body since refresh token is in HTTP-only cookie
      { withCredentials: true } // ✅ Ensures cookies are sent
    );
    return response.data.access;
  } catch (error) {
    console.error(
      "Token refresh failed:",
      error.response?.data || error.message
    );
    return null;
  }
}

export default refreshAccessToken;
