import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProjectImages() {
  const { projectId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error(err));
  }, [projectId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Project Images</h2>
      <p>Project ID: {projectId}</p>

      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        images.map((img, index) => (
          <div
            key={`${img.id}-${index}`}   // ✅ FIXED
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            {/* ✅ STABLE GOOGLE DRIVE IMAGE */}
            <img
              src={`https://drive.google.com/uc?export=view&id=${img.fileId || img.driveFileId}`}
              alt="Work Progress"
              style={{
                width: "280px",
                borderRadius: "6px",
                display: "block",
                marginBottom: "10px",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            <p>
              📅 <strong>Time:</strong>{" "}
              {img.timestamp
                ? new Date(img.timestamp).toLocaleString()
                : "N/A"}
            </p>

            <p>
              📍 <strong>Location:</strong><br />
              Lat: {img.latitude || "N/A"}<br />
              Lng: {img.longitude || "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectImages;