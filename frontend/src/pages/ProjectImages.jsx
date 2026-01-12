import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProjectImages() {
  const { projectId } = useParams();
  const [rows, setRows] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then(res => res.json())
      .then(images => {
        const grouped = {};

        images.forEach(img => {
          const key = img.uploadBatchId; // 🔥 upload-click based
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(img);
        });

        setRows(grouped);
      });
  }, [projectId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Project Images</h2>
      <p>Project ID: {projectId}</p>

      {Object.keys(rows).length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        Object.entries(rows).map(([batchId, images], index) => (
          <div key={batchId} style={{ marginBottom: "35px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              📤 Upload #{index + 1}
            </p>

            {/* 🔥 ONE ROW PER UPLOAD CLICK */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                overflowX: "auto",
                paddingBottom: "10px"
              }}
            >
              {images.map(img => (
                <div
                  key={img.id}
                  style={{
                    minWidth: "220px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "10px",
                    background: "#fff"
                  }}
                >
                  <img
                    src={img.imageUrl}
                    alt="progress"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />

                  <p style={{ fontSize: "12px", marginTop: "6px" }}>
                    📍 {img.latitude}, {img.longitude}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectImages;