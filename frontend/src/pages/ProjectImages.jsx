// ProjectImages.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProjectImages() {
  const { projectId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/contractor/project/${projectId}/images`
        );
        const data = await res.json();
        setImages(data.reverse());
      } catch (err) {
        console.error(err);
      }
    };

    loadImages();
  }, [projectId]);

  return (
    <div style={{ padding: 30 }}>
      <h2>Uploaded Images</h2>
      <p>Project ID: {projectId}</p>

      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        images.map((img) => (
          <div
            key={img.id}
            style={{
              marginBottom: 25,
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <img
              src={img.imageUrl}
              alt=""
              style={{ width: 260, borderRadius: 6 }}
            />

            <p><strong>📍 Address:</strong> {img.address}</p>
            <p><strong>⏱ Time:</strong> {new Date(img.timestamp).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectImages;
