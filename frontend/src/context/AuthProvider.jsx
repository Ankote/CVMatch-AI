import { createContext, useContext, useState, useEffect } from "react";
import refreshAccessToken from "../hooks/useRefreshToken";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  const [isLoading, setIsLoading] = useState(true);


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
