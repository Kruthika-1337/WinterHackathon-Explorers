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
          const fileId = img.fileId || img.driveFileId;

          if (!fileId) return null;

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
              <img
                src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`}
                alt="Work Progress"
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />

              <p style={{ fontSize: "14px" }}>
                📅 <strong>Time:</strong>{" "}
                {img.timestamp
                  ? new Date(img.timestamp).toLocaleString()
                  : "N/A"}
              </p>

              <p>
                📍 <strong>Address:</strong><br />
                {img.address || "Address unavailable"}
              </p>

            </div>
          );
        })
      )}
    </div>
  );
}

export default ProjectImages;