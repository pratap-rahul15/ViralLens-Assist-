import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white p-4">

      <h1 className="text-lg font-bold">🤖 ViralLens Assist</h1>

      <div className="space-x-4">

        <Link to="/chat" className="hover:underline">Chat</Link>

        <Link to="/register" className="hover:underline">Register</Link>

        <Link to="/" className="hover:underline">Login</Link>
        <button
          onClick={handleLogout}
          
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
