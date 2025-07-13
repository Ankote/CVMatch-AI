import axios from "./axios";
import Cookies from "js-cookie";
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

export async function verifierToken() {
  const token = localStorage.getItem("my_token");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/auth/verify/",
      { token: token }, // This becomes JSON: { "token": "value" }
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.status;
  } catch (error) {
    try{
      

      const response = await axios.post(
      "/auth/token/refresh/", // ✅ Fixed URL
      {}, // ✅ Empty body since refresh token is in HTTP-only cookie
      { withCredentials: true } // ✅ Ensures cookies are sent
     );
     localStorage.setItem("my_token", response.data.access)
     
     return true
    }
    catch{
      return false
    }
  }
}

export async function Logout() {
  localStorage.removeItem("my_token");
  try {
    const response = await axios.post(
      "/auth/logout/",
      {}, // no body
      { withCredentials: true } // send cookies
    );
    return response.status;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    return error;
  }
}
