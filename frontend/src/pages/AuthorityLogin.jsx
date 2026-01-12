import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthorityLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // 🔐 Dummy authority credentials
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("authorityLoggedIn", "true");
      navigate("/admin1");
    } else {
      setError("Invalid authority credentials");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Authority Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleLogin} style={{ width: "100%" }}>
        Login
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AuthorityLogin;
