import axios from "./axios";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthProvider";
const domain = "http://127.0.0.1:8000/";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export async function loginUser(creds) {
  try {

    const csrfToken = Cookies.get("csrftoken");
    const res = await axios.post(`users/token/`, creds, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });

    return res.data;
  } catch (error) {
    if (error.response) {
      //console.log(error);
      throw new Error(error.response.data.error || "Login failed");
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
}


export async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/users/token/refresh/", // ✅ Fixed URL
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
