import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatWindow from "./components/ChatWindow";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={token ? <ChatWindow /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
}

export default App;
