const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { google } = require("googleapis");

const app = express();

/* ================================
   MIDDLEWARES
================================ */
app.use(cors());
app.use(express.json());

/* ================================
   MULTER
================================ */
const upload = multer({ dest: "uploads/" });

/* ================================
   GOOGLE DRIVE AUTH
================================ */
const oauthClientData = JSON.parse(
  fs.readFileSync("oauth-client.json")
);

const oauth2Client = new google.auth.OAuth2(
  oauthClientData.web.client_id,
  oauthClientData.web.client_secret,
  oauthClientData.web.redirect_uris[0]
);

const token = JSON.parse(fs.readFileSync("token.json"));
oauth2Client.setCredentials(token);

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

/* ================================
   IN-MEMORY DATABASE (SINGLE SOURCE)
================================ */
let contractorProjects = [];
let projectImages = [];

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/* ================================
   UPLOAD IMAGE + GEO TAG
================================ */
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const { projectId, latitude, longitude, timestamp } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const driveResponse = await drive.files.create({
      requestBody: { name: req.file.originalname },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
    });

    const fileId = driveResponse.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    fs.unlinkSync(req.file.path);

    const imageData = {
      id: projectImages.length + 1,
      projectId: Number(projectId),
      driveFileId: fileId,
      imageUrl,
      latitude,
      longitude,
      timestamp,
    };

    projectImages.push(imageData);
    res.json({ success: true, image: imageData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   CREATE PROJECT
================================ */
app.post("/contractor/project", (req, res) => {
  const { description, startDate, endDate } = req.body;

  const newProject = {
    id: contractorProjects.length + 1,
    description,
    startDate,
    endDate,
  };

  contractorProjects.push(newProject);
  res.json({ success: true, project: newProject });
});

/* ================================
   GET PROJECTS
================================ */
app.get("/contractor/projects", (req, res) => {
  res.json(contractorProjects);
});

/* ================================
   UPDATE PROJECT ✅ FIXED
================================ */
app.put("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);
  const { description, startDate, endDate } = req.body;

  const project = contractorProjects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  project.description = description;
  project.startDate = startDate;
  project.endDate = endDate;

  res.json({ success: true, project });
});

/* ================================
   DELETE PROJECT
================================ */
app.delete("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);

  contractorProjects = contractorProjects.filter(p => p.id !== id);
  projectImages = projectImages.filter(img => img.projectId !== id);

  res.json({ success: true });
});

/* ================================
   GET IMAGES BY PROJECT
================================ */
app.get("/contractor/project/:projectId/images", (req, res) => {
  const projectId = Number(req.params.projectId);
  res.json(projectImages.filter(img => img.projectId === projectId));
});

/* ================================
   AUTH (DUMMY)
================================ */
app.post("/citizen/login", (_, res) => res.json({ success: true }));
app.post("/citizen/signup", (_, res) => res.json({ success: true }));
app.post("/contractor/login", (_, res) => res.json({ success: true }));
app.post("/contractor/signup", (_, res) => res.json({ success: true }));

/* ================================
   START SERVER
================================ */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});