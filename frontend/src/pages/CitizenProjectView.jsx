import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CitizenFeedback from "./CitizenFeedback";

function CitizenProjectView() {
  const { projectId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/contractor/project/${projectId}/images`)
      .then(res => res.json())
      .then(data => setImages(data));
  }, [projectId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Project Progress</h2>

      {images.length === 0 ? (
        <p>No updates yet</p>
      ) : (
        images.map(img => (
          <div
            key={img.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px"
            }}
          >
            <img
              src={img.imageUrl}
              alt="progress"
              width="300"
            />
            <p>📅 {new Date(img.timestamp).toLocaleString()}</p>
            <p>📍 {img.address}</p>
          </div>
        ))
      )}

      {/* 🔥 STEP 3 ADDED HERE */}
      <CitizenFeedback projectId={projectId} />
    </div>
  );
}

export default CitizenProjectView;
