import { useNavigate } from "react-router-dom";

export default function ContractorAuth() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>Contractor</h2>

      <button onClick={() => navigate("/contractor/login")}>
        Login
      </button>

      <br /><br />

      <button onClick={() => navigate("/contractor/signup")}>
        Signup
      </button>
    </div>
  );
}