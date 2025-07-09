import { createContext, useContext, useState, useEffect } from "react";
import { refreshAccessToken } from "../api/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated on app load
  useEffect(() => {
    //console.log("Checking authentication...");
    async function checkAuth() {
      try {
        //console.log("Refreshing access token...1");
        const newAccessToken = await refreshAccessToken(); // Refresh the token
        //console.log("Refreshing access token...2");
        //console.log("New access token:", newAccessToken);
        setAccessToken(newAccessToken); // Store the new access token in memory
      } catch (err) {
        //console.log("Token refresh failed:", err);
        setAccessToken(null); // Clear the token if refresh fails
      } finally {
        //console.log("Authentication check complete.");
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  //console.log(accessToken);
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
