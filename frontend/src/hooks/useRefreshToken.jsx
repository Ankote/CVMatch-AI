import axios from "../api/axios";

export async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "/auth/token/refresh/", // ✅ Fixed URL
      {}, // ✅ Empty body since refresh token is in HTTP-only cookie
      { withCredentials: true } // ✅ Ensures cookies are sent
    );
    return response.data.access;
  } catch (error) {
    return null;
  }
}

export default refreshAccessToken;
