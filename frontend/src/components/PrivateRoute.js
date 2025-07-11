import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("my_token");

    if (!token) {
      setIsValid(false);
      setLoading(false);
      return;
    }

    // Verify token with backend
    fetch("http://localhost:8000/auth/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) {
          setIsValid(true);
        } else {
          localStorage.removeItem("my_token"); // cleanup
          setIsValid(false);
        }
      })
      .catch(() => {
        setIsValid(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Checking token...</div>;

  return isValid ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
};

export default PrivateRoute;
