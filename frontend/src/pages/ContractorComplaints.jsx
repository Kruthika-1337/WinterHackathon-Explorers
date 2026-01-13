import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ContractorComplaints() {
  const { id } = useParams();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${id}/complaints`)
      .then(res => res.json())
      .then(data => setComplaints(data));
  }, [id]);

  return (
    <div style={{ padding: 30 }}>
      <h2>Project Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints found</p>
      ) : (
        complaints.map(c => (
          <div
            key={c.id}
            style={{
              background: "#fff",
              marginBottom: 15,
              padding: 15,
              borderRadius: 8,
            }}
          >
            <p><strong>{c.username}</strong></p>
            <p>{c.message}</p>

            {c.imageUrl && (
              <img src={c.imageUrl} alt="" style={{ width: "100%" }} />
            )}

            <small>{new Date(c.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default ContractorComplaints;
