import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Landing() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleLogin = async (role) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: role,
        })
      );

      // Redirect based on role
      if (role === "citizen") {
        navigate("/citizen/dashboard");
      } else {
        navigate("/contractor/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>WorkProof System</h1>
      <p>Transparent Government Work Monitoring</p>

      <button onClick={() => handleLogin("citizen")}>
        Login as Citizen
      </button>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => handleLogin("contractor")}
      >
        Login as Contractor
      </button>
    </div>
  );
}

export default Landing;
