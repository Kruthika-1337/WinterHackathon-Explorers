import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function getWeekKey(dateStr) {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${week}`;
}

function ProjectImages() {
  const { projectId } = useParams();
  const [weeklyRows, setWeeklyRows] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then((res) => res.json())
      .then((images) => {
        const grouped = {};

        images.forEach((img) => {
          const weekKey = getWeekKey(img.timestamp);
          if (!grouped[weekKey]) grouped[weekKey] = [];
          grouped[weekKey].push(img);
        });

        const sorted = Object.keys(grouped)
          .sort()
          .reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

        setWeeklyRows(sorted);
      })
      .catch(console.error);
  }, [projectId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Project Images</h2>
      <p>Project ID: {projectId}</p>

      {Object.keys(weeklyRows).length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        Object.entries(weeklyRows).map(([week, images]) => (
          <div key={week} style={{ marginBottom: "35px" }}>
            <h4 style={{ marginBottom: "10px" }}>
              📅 Week: {week}
            </h4>

            {/* ONE ROW PER WEEK */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              {images.map((img) => {
                const imageSrc =
                  img.imageUrl ||
                  `https://drive.google.com/thumbnail?id=${img.driveFileId}&sz=w1000`;

                return (
                  <div
                    key={img.id}
                    style={{
                      minWidth: "230px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "10px",
                      background: "#fff",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt="progress"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <p style={{ fontSize: "12px", marginTop: "6px" }}>
                      🕒 {new Date(img.timestamp).toLocaleString()}
                    </p>

                    <p style={{ fontSize: "12px" }}>
                      📍 {img.latitude}, {img.longitude}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectImages;