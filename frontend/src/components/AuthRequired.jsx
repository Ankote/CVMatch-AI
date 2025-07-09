import { useAuth } from "./context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthRequired() {
  const { accessToken, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p>Loading...</p>; // Show a loading spinner while checking auth
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        state={{
          message: "You must log in first",
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return <Outlet />;
}