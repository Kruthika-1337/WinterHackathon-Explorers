import { useEffect, useState } from "react";

function CitizenImages({ projectId }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then(res => res.json())
      .then(data => setImages(data));
  }, [projectId]);

  return (
    <div>
      <h3>Work Progress Images</h3>

      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        images.map(img => (
          <div
            key={img.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={img.imageUrl}
              alt="progress"
              style={{ width: "250px", borderRadius: "6px" }}
            />

            <p style={{ fontSize: "13px" }}>
              📍 <strong>Address:</strong> {img.address}
            </p>

            <p style={{ fontSize: "12px" }}>
              🕒 {new Date(img.timestamp).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default CitizenImages;
