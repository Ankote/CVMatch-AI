import { createContext, useContext, useState, useEffect } from "react";
import { verifierToken } from "../api/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated on app load
  useEffect(() => {
    //console.log("Checking authentication...");
    async function checkAuth() {
      try {
        //console.log("Refreshing access token...1");
        const newAccessToken = await verifierToken(); // Refresh the token
        //console.log("Refreshing access token...2");
        //console.log("New access token:", newAccessToken);
        setIsAuth(newAccessToken); // Store the new access token in memory
      } catch (err) {
        //console.log("Token refresh failed:", err);
        setIsAuth(false); // Clear the token if refresh fails
      } finally {
        //console.log("Authentication check complete.");
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  //console.log(accessToken);
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
