import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CitizenDashboard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      alert("Enter at least 3 characters");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(
        `http://localhost:5000/citizen/search?q=${query}`
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Citizen Dashboard 🏠</h2>

      <p>Search for works around your area:</p>

      <div style={styles.searchContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your street / locality / landmark"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button style={styles.button} onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      <div style={styles.results}>
        {results.length === 0 && !loading && (
          <p style={{ marginTop: "20px" }}>No matching works found yet.</p>
        )}

        {results.map((p) => (
          <div key={p.projectId} style={styles.card}>
            <img
              src={p.thumbnail}
              alt="thumb"
              style={styles.thumb}
            />
            <div style={styles.info}>
              <h4>{p.description}</h4>
              <p>📍 {p.address}</p>
              <p>👷 Contractor: {p.contractorName}</p>

              <button
                style={styles.viewBtn}
                onClick={() =>
                  navigate(`/citizen/project/${p.projectId}`)
                }
              >
                View Details / Give Feedback
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px", fontFamily: "Arial" },
  heading: { marginBottom: "15px" },
  searchContainer: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "6px",
    backgroundColor: "#0077ff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  results: { marginTop: "25px" },
  card: {
    display: "flex",
    gap: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "15px",
    background: "#fafafa",
  },
  thumb: {
    width: "110px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  info: { flex: 1 },
  viewBtn: {
    marginTop: "5px",
    backgroundColor: "green",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default CitizenDashboard;
