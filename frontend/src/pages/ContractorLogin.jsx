import { useState } from "react";

function ContractorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Contractor Login:", email, password);

    await fetch("http://localhost:5000/contractor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  };

  return (
    <div>
      <h2>Contractor Login</h2>

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
      New contractor?{" "}
      <button onClick={() => window.location.href="/contractor/signup"}>
      Sign up
      </button>
      </p>
    </div>
  );
}

export default ContractorLogin;