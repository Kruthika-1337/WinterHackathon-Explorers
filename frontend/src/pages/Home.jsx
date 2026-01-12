import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>🏗 Public Works Transparency Portal</h1>

      <h3>Contractor</h3>
      <Link to="/contractor/login">Login</Link><br />
      <Link to="/contractor/signup">Signup</Link>

      <h3 style={{ marginTop: 20 }}>Citizen</h3>
      <Link to="/citizen/login">Login</Link><br />
      <Link to="/citizen/signup">Signup</Link>
    </div>
  );
}

export default Home;
