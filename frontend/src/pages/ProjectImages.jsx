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
        images.map((img, index) => {
          // ✅ EXTRACT FILE ID FROM imageUrl
          const fileId = img.imageUrl?.split("id=")[1];

          if (!fileId) return null;

          const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;

          return (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "8px",
                maxWidth: "320px",
              }}
            >
             <iframe
  src={`https://drive.google.com/file/d/${fileId}/preview`}
  width="100%"
  height="300"
  style={{ borderRadius: "6px", border: "none" }}
  title="Work Progress"
/>



              <p style={{ fontSize: "14px" }}>
                📅 <strong>Time:</strong>{" "}
                {img.timestamp
                  ? new Date(img.timestamp).toLocaleString()
                  : "N/A"}
              </p>

              <p style={{ fontSize: "14px" }}>
                📍 <strong>Location:</strong><br />
                Lat: {img.latitude || "N/A"}<br />
                Lng: {img.longitude || "N/A"}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ProjectImages;
