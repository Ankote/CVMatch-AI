import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthProvider";
import "./Login.css";

export default function Login() {
  const [loginFormData, setLoginFormData] = React.useState({
    username: "",
    password: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState(null);
  const message = location.state?.message || "";
  const from = location.state?.from || "/match";

  React.useEffect(() => {
    if (accessToken) {
      navigate(from);
    }
  }, [accessToken]);

  async function handleSubmit(e) {
    e.preventDefault();
    const formEl = new FormData(e.currentTarget);
    const email = formEl.get("email");
    const password = formEl.get("password");
    setStatus("submitting");
    try {
      const res = await loginUser({ username: email, password: password });
      setAccessToken(res.access);
      setError(null);
      localStorage.setItem("my_token", res.access);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setStatus("idle");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleLogout() {
    localStorage.removeItem("my_token");
    setAccessToken(null);
    navigate("/login");
  }

  return (
    <div className="login-container">
      <h1 className="login-first">{message}</h1>
      <h1>Sign in to your account</h1>
      {error?.message && <h3 className="login-first">{error.message}</h3>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          onChange={handleChange}
          type="text"
          placeholder="Username/Email"
          value={loginFormData.email}
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          value={loginFormData.password}
        />
        <button disabled={status === "submitting"}>
          {status === "idle" ? "Log in" : "Logging in..."}
        </button>

        <div style={{ marginTop: "20px" }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const token = credentialResponse.credential;
              fetch("http://localhost:8000/auth/google-login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              })
                .then((res) => res.json())
                .then((data) => {
                  localStorage.setItem("my_token", data.access);
                  setAccessToken(data.access);
                  navigate("/match");
                });
            }}
            onError={() => console.log("Google Login Failed")}
          />
        </div>

        <button type="button" onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </form>
    </div>
  );
}
