import { useParams } from "react-router-dom";
import { useState } from "react";

function CitizenFeedback() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const submit = async () => {
    console.log("Citizen submitting complaint for project:", id);

    const formData = new FormData();
    formData.append("message", message);
    formData.append("username", "Citizen");
    formData.append("type", "complaint");

    if (file) formData.append("photo", file);

    await fetch(`http://localhost:5000/citizen/project/${id}/feedback`, {
      method: "POST",
      body: formData,
    });

    alert("Complaint submitted");
    setMessage("");
    setFile(null);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Submit Complaint</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the issue"
        style={{ width: "100%" }}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default CitizenFeedback;
