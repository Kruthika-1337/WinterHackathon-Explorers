import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CitizenFeedback from "./CitizenFeedback";

function CitizenProjectView() {
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
      <h2>Project Details 🏗</h2>

      <h3>Work Progress Images</h3>

      {images.length === 0 ? <p>No images yet.</p> : null}

      {images.map((img) => (
        <div key={img.id} style={{ marginBottom: "20px" }}>
          <img
            src={img.imageUrl}
            alt="Work"
            style={{ width: "280px", borderRadius: "8px" }}
          />
          <p><strong>📍 Address:</strong> {img.address}</p>
          <p><strong>⏱ Time:</strong> {new Date(img.timestamp).toLocaleString()}</p>
        </div>
      ))}

      <CitizenFeedback projectId={projectId} />

      <button onClick={() => window.history.back()}>
        ⬅ Back
      </button>
    </div>
  );
}

export default CitizenProjectView;
