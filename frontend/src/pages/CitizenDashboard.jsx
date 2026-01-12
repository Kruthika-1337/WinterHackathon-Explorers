import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CitizenDashboard() {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/citizen/projects")
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const filtered = projects.filter(p => {
    const words = query.toLowerCase().split(" ");
    return words.length >= 2 &&
      words.every(w => p.address.toLowerCase().includes(w));
  });

  return (
    <div style={{ padding: "30px" }}>
      <h2>Citizen Dashboard</h2>

      <input
        type="text"
        placeholder="Search by area (min 2 words)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />

      <br /><br />

      {filtered.map(p => (
        <div
          key={p.projectId}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            cursor: "pointer"
          }}
          onClick={() =>
            navigate(`/citizen/project/${p.projectId}`)
          }
        >
          <img
            src={p.thumbnail}
            width="200"
            alt="thumbnail"
          />
          <h4>{p.description}</h4>
          <p>📍 {p.address}</p>
        </div>
      ))}
    </div>
  );
}

export default CitizenDashboard;
