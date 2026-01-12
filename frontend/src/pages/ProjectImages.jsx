// ProjectImages.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProjectImages() {
  const { projectId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then((res) => res.json())
      .then(setImages)
      .catch(console.error);
  }, [projectId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>📸 Project Progress Gallery</h2>

      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "12px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={img.imageUrl}
                alt="Work progress"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                📅 {img.timestamp
                  ? new Date(img.timestamp).toLocaleString()
                  : "N/A"}
              </p>

              {img.address && (
                <p style={{ fontSize: "12px", color: "#555" }}>
                  📍 {img.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectImages;
