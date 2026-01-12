const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer
const upload = multer({ dest: "uploads/" });

// Google OAuth
const oauthClientData = JSON.parse(fs.readFileSync("oauth-client.json"));
const oauth2Client = new google.auth.OAuth2(
  oauthClientData.web.client_id,
  oauthClientData.web.client_secret,
  oauthClientData.web.redirect_uris[0]
);

const token = JSON.parse(fs.readFileSync("token.json"));
oauth2Client.setCredentials(token);

const drive = google.drive({ version: "v3", auth: oauth2Client });

// In-memory DB
let contractorProjects = [];
let projectImages = [];
let projectFeedbacks = [];

/* HEALTH */
app.get("/", (_, res) => res.send("Backend running ✔"));

/* Get readable address */
async function getAddressFromIP(ip) {
  try {
    const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { latitude, longitude } = geo.data;
    if (!latitude || !longitude) return "Address unavailable";

    const addr = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      { params: { latlng: `${latitude},${longitude}`, key: process.env.GOOGLE_MAPS_API_KEY } }
    );

    return addr.data.results?.[0]?.formatted_address || "Address unavailable";
  } catch {
    return "Address unavailable";
  }
}

/* Upload image */
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const projectId = Number(req.body.projectId);
    const contractorName = req.body.contractorName || "Unknown Contractor";
    const timestamp = new Date().toISOString();

    const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "8.8.8.8";
    const address = await getAddressFromIP(userIP);

    const driveResponse = await drive.files.create({
      requestBody: { name: req.file.originalname },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
    });

    const fileId = driveResponse.data.id;
    await drive.permissions.create({ fileId, requestBody: { role: "reader", type: "anyone" } });
    fs.unlinkSync(req.file.path);

    const img = {
      id: projectImages.length + 1,
      projectId,
      contractorName,
      driveFileId: fileId,
      imageUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
      address,
      timestamp
    };

    projectImages.push(img);
    res.json({ success: true, image: img });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* Contractor Projects */
app.post("/contractor/project", (req, res) => {
  const { description, startDate, endDate } = req.body;
  const project = {
    id: contractorProjects.length + 1,
    description,
    startDate,
    endDate,
  };
  contractorProjects.push(project);
  res.json({ success: true, project });
});

app.get("/contractor/projects", (_, res) => res.json(contractorProjects));

app.put("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = contractorProjects.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: "Not found" });

  p.description = req.body.description;
  p.startDate = req.body.startDate;
  p.endDate = req.body.endDate;
  res.json({ success: true, project: p });
});

app.delete("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);
  contractorProjects = contractorProjects.filter(p => p.id !== id);
  projectImages = projectImages.filter(i => i.projectId !== id);
  projectFeedbacks = projectFeedbacks.filter(f => f.projectId !== id);
  res.json({ success: true });
});

/* Project images */
app.get("/contractor/project/:id/images", (req, res) => {
  res.json(projectImages.filter(i => i.projectId === Number(req.params.id)));
});

/* Citizen search */
app.get("/citizen/search", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  if (q.split(" ").length < 2) return res.json([]);

  const seen = new Set();
  const results = [];

  for (const img of projectImages) {
    if (q.split(" ").every(w => img.address.toLowerCase().includes(w))) {
      if (!seen.has(img.projectId)) {
        const p = contractorProjects.find(x => x.id === img.projectId);
        results.push({
          projectId: img.projectId,
          description: p?.description || "",
          address: img.address,
          thumbnail: img.imageUrl,
        });
        seen.add(img.projectId);
      }
    }
  }

  res.json(results);
});

/* Citizen Feedback */
app.post("/citizen/project/:id/feedback", upload.single("photo"), async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    let imageUrl = null;

    if (req.file) {
      const driveResponse = await drive.files.create({
        requestBody: { name: req.file.originalname },
        media: { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) },
      });
      const fileId = driveResponse.data.id;
      await drive.permissions.create({ fileId, requestBody: { role: "reader", type: "anyone" } });
      fs.unlinkSync(req.file.path);
      imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }

    const f = {
      id: projectFeedbacks.length + 1,
      projectId,
      username: req.body.username,
      message: req.body.message,
      type: req.body.type,
      imageUrl,
      timestamp: new Date().toISOString(),
    };

    projectFeedbacks.push(f);
    res.json({ success: true, feedback: f });
  } catch (err) {
    res.status(500).json({ error: "Feedback failed" });
  }
});

/* Contractor sees feedback */
app.get("/contractor/project/:id/feedback", (req, res) =>
  res.json(projectFeedbacks.filter(f => f.projectId === Number(req.params.id)))
);

/* Dummy Auth */
app.post("/citizen/login", (_, res) => res.json({ success: true }));
app.post("/contractor/login", (_, res) => res.json({ success: true }));

app.listen(5000, () => console.log("Running http://localhost:5000"));
