import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CitizenLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Citizen Login:", email, password);

    await fetch("http://localhost:5000/citizen/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  };

  return (
    <div>
      <h2>Citizen Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Login</button>
      </form>

      <p>
        New user?{" "}
        <button onClick={() => navigate("/citizen/signup")}>
          Sign up
        </button>
      </p>
    </div>
  );
}

export default CitizenLogin;