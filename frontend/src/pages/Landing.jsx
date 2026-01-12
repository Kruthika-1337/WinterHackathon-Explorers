import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h1>WorkProof System</h1>
      <p>Transparent Government Work Monitoring</p>

      <button onClick={() => navigate("/citizen/login")}>
        Citizen
      </button>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => navigate("/contractor/login")}
      >
        Contractor
      </button>
    </div>
  );
}

export default Landing;