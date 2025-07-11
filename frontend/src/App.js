import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MatchCv from "./components/pages/matchCv";
import Login from "./components/pages/Login";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={ clientId } >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/match" element={<MatchCv />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
