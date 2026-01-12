import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CitizenDashboard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (query.trim().split(" ").length < 2) {
      alert("Please enter at least 2 words of the address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/citizen/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Citizen Dashboard</h2>
      <p>Search works happening in your area</p>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Enter area / address (min 2 words)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
        Search
      </button>

      <br /><br />

      {/* 🔄 LOADING */}
      {loading && <p>Searching...</p>}

      {/* 📦 RESULTS */}
      {results.length === 0 && !loading && (
        <p>No projects found</p>
      )}

      {results.map((item) => (
        <div
          key={item.projectId}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
            display: "flex",
            gap: "15px",
          }}
        >
          {/* 🖼 IMAGE */}
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt="Project"
              style={{
                width: "150px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          )}

          {/* 📄 DETAILS */}
          <div style={{ flex: 1 }}>
            <h4>{item.description}</h4>
            <p>📍 {item.address}</p>
            <p>👷 Contractor: {item.contractorName}</p>

            <button
              onClick={() =>
                navigate(`/citizen/project/${item.projectId}`)
              }
            >
              View Project
            </button>

            <button
              onClick={() =>
                navigate(`/citizen/project/${item.projectId}/feedback`)
              }
              style={{ marginLeft: "10px" }}
            >
              Feedback / Complaint
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CitizenDashboard;
