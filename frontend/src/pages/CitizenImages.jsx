import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CitizenImages() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading images...</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Project Progress Images</h2>
      <p>Project ID: {projectId}</p>

      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        images.map((img) => (
          <div
            key={img.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#fafafa",
            }}
          >
            {/* IMAGE */}
            <img
              src={img.imageUrl}
              alt="Project Progress"
              style={{
                width: "100%",
                maxWidth: "420px",
                borderRadius: "6px",
                display: "block",
                marginBottom: "10px",
              }}
            />

            {/* DETAILS */}
            <p>
              🕒 <strong>Uploaded:</strong>{" "}
              {img.timestamp
                ? new Date(img.timestamp).toLocaleString()
                : "N/A"}
            </p>

            <p>
              📍 <strong>Address:</strong><br />
              {img.address || "Address unavailable"}
            </p>

            <p>
              👷 <strong>Contractor:</strong>{" "}
              {img.contractorName || "Unknown"}
            </p>
          </div>
        ))
      )}

      <hr />

      {/* FEEDBACK BUTTON */}
      <button
        onClick={() =>
          navigate(`/citizen/project/${projectId}/feedback`)
        }
        style={{
          padding: "10px 18px",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Give Feedback / Complaint
      </button>
    </div>
  );
}

export default CitizenImages;
