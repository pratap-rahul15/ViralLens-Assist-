import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Landing() {

  const navigate = useNavigate();

  return (
    <div className="landing">

      <div className="landing-content">

        <h1 className="bot-title">🤖 ViralLens Assist</h1>

        <p className="bot-subtitle">Your AI-powered customer support agent</p>

        <p className="landing-desc">
          ViralLens Assist helps you resolve queries instantly with AI-powered
          support. 
          Sign up, chat, and get solutions tailored just for you —
          anytime, anywhere.
        </p>
        <button className="get-started-btn" onClick={() => navigate("/login")}>
          Get Started 🤝
        </button>
      </div>
    </div>
  );
}
