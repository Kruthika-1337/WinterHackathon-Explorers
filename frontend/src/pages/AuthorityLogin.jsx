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
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Authority Login</h2>
        <p style={styles.subtitle}>
          Government / Municipal Access Only
        </p>

        <input
          type="text"
          placeholder="Authority Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default AuthorityLogin;

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #f4f6f8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
  title: {
    marginBottom: "5px",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#1976d2",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "12px",
    textAlign: "center",
    fontSize: "14px",
  },
};
