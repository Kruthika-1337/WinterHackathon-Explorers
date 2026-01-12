import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CitizenSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/citizen/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    // ✅ REDIRECT
    navigate("/citizen/dashboard");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Citizen Signup</h2>

      <form onSubmit={handleSignup}>
        <input placeholder="Name" onChange={e => setName(e.target.value)} /><br /><br />
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default CitizenSignup;
