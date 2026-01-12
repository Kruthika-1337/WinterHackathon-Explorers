import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ContractorFeedback() {
  const { projectId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/feedback`)
      .then((res) => res.json())
      .then(setFeedbacks)
      .catch(console.error);
  }, [projectId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Citizen Feedback 📢</h2>

      {feedbacks.length === 0 ? <p>No feedback yet.</p> : null}

      {feedbacks.map((fb) => (
        <div key={fb.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
          <p><strong>{fb.username}</strong> ({fb.type})</p>
          <p>{fb.message}</p>
          {fb.imageUrl && (
            <img
              src={fb.imageUrl}
              alt="Feedback"
              style={{ width: "200px", borderRadius: "8px" }}
            />
          )}
          <p><small>{new Date(fb.timestamp).toLocaleString()}</small></p>
        </div>
      ))}

      <button onClick={() => window.history.back()}>⬅ Back</button>
    </div>
  );
}

export default ContractorFeedback;
