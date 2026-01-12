import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CitizenSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Extra safety check (React-side)
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    const response = await fetch("http://localhost:5000/citizen/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      navigate("/citizen/dashboard");
    }
  };

  return (
    <div>
      <h2>Citizen Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required   // ✅ REQUIRED
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required   // ✅ REQUIRED
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required   // ✅ REQUIRED
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default CitizenSignup;
