import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleLogin = async (role) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: role,
        })
      );

      if (role === "citizen") {
        navigate("/citizen/dashboard");
      } else {
        navigate("/contractor/dashboard");
      }
    } catch (error) {
  if (error.code === "auth/cancelled-popup-request") {
    // 🔕 Ignore this harmless dev-only warning
    return;
  }

  console.error("Login error:", error);
  alert("Google login failed. Please try again.");
}


  };

  return (
    <div className="landing">
      {/* Navbar */}
     <nav className="navbar">
  <div className="nav-left">
    <h2>Work<span>Proof</span></h2>
   
  </div>

  <button
    className="authority-btn"
    onClick={() => navigate("/admin")}
  >
    🛡 Authority Login
  </button>
</nav>

      {/* Hero Section */}
      <div className="hero">
        {/* Left Content */}
        <div className="hero-left">
          <h1>
            Smart Proof of <br />
            <span>On-Ground Work</span>
          </h1>

          <p>
            A transparent monitoring platform for government projects.
            Contractors upload verified progress while citizens track work in real time.
          </p>

          <div className="badges">
            <span>📍 Geo-Tagged</span>
            <span>⏱ Time-Stamped</span>
            <span>✅ Verified</span>
          </div>

          <div className="cards">
            {/* Contractor Card */}
            <div className="card">
              <h4>👷 Contractor Portal</h4>
              <p>
                Upload weekly work proof, manage projects & request extensions.
              </p>
              <button
                className="blue"
                onClick={() => handleLogin("contractor")}
              >
                Sign in with Google
              </button>
           
            </div>

            {/* Citizen Card */}
            <div className="card">
              <h3>👥 Citizen Portal</h3>
              <p>
                Track progress, view updates & submit feedback transparently .
              </p>
              <button
                className="orange"
                onClick={() => handleLogin("citizen")}
              >
                Sign in with Google
              </button>
              
              
              
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hero-right">
          <img
            src="https://media.istockphoto.com/id/1333149806/photo/silhouette-of-worker-construction-building-casting-concrete-work-on-scaffolding.jpg?s=612x612&w=0&k=20&c=pXCoT0xn_RoLXha93K1EcozKFRM8-f8vQc8kz49mTW0="
            alt="construction"
          />
          <span className="verified-badge">✔ VERIFIED WORK</span>
        </div>
      </div>
    </div>
  );
}

export default Landing;