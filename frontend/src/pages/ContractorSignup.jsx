import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ContractorSignup() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ React-side validation
    if (!companyName || !email || !password) {
      alert("All fields are required");
      return;
    }

    const response = await fetch("http://localhost:5000/contractor/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, email, password }),
    });

    if (response.ok) {
      navigate("/contractor/dashboard");
    }
  };

  return (
    <div>
      <h2>Contractor Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          required               // ✅ REQUIRED
          onChange={(e) => setCompanyName(e.target.value)}
        /><br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required               // ✅ REQUIRED
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required               // ✅ REQUIRED
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default ContractorSignup;
