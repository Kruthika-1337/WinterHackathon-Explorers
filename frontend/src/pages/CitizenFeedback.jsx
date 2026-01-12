import { useState } from "react";

function CitizenFeedback({ projectId }) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("Citizen");
  const [type, setType] = useState("feedback");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");

  const submitFeedback = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("message", message);
    formData.append("type", type);
    if (photo) formData.append("photo", photo);

    const res = await fetch(
      `http://localhost:5000/citizen/project/${projectId}/feedback`,
      { method: "POST", body: formData }
    );

    const out = await res.json();
    if (out.success) setStatus("✔ Submitted!");
    else setStatus("❌ Failed, try again");
  };

  return (
    <div style={{ marginTop: "20px", borderTop: "1px solid #aaa", paddingTop: "20px" }}>
      <h3>Send Feedback / Complaint 📢</h3>

      <form onSubmit={submitFeedback}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="feedback">Feedback</option>
          <option value="complaint">Complaint</option>
        </select>

        <br /><br />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <br /><br />
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />

        <br /><br />
        <button type="submit">Submit</button>
      </form>

      <p>{status}</p>
    </div>
  );
}

export default CitizenFeedback;
