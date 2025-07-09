
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MatchCv from "./components/pages/matchCv";
import Login from "./components/pages/Login";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
// import "./server";

function App() {
  return (
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
  );
}

export default App;
