const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
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
   IN-MEMORY DATABASE
================================ */
let contractorProjects = [];
let projectImages = [];

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (_, res) => {
  res.send("Backend running ✅");
});

/* ================================
   CREATE PROJECT (PENDING)
================================ */
app.post("/contractor/project", (req, res) => {
  const { description, startDate, endDate } = req.body;

  const project = {
    id: contractorProjects.length + 1,
    description,
    startDate,
    endDate,
    status: "pending",
  };

  contractorProjects.push(project);
  res.json({ success: true, project });
});

/* ================================
   GET CONTRACTOR PROJECTS
================================ */
app.get("/contractor/projects", (_, res) => {
  res.json(contractorProjects);
});

/* ================================
   ADMIN: VIEW PENDING
================================ */
app.get("/admin/projects", (_, res) => {
  res.json(contractorProjects.filter(p => p.status === "pending"));
});

/* ================================
   ADMIN: APPROVE PROJECT
================================ */
app.put("/admin/project/:id/approve", (req, res) => {
  const project = contractorProjects.find(
    p => p.id === Number(req.params.id)
  );

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  project.status = "approved";
  res.json({ success: true });
});

/* ================================
   UPLOAD IMAGE (MAIN FIX)
================================ */
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const projectId = Number(req.body.projectId);

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    /* 🔒 Check approval */
    const project = contractorProjects.find(p => p.id === projectId);
    if (!project || project.status !== "approved") {
      return res.status(403).json({
        error: "Project not approved by authority yet",
      });
    }

    /* ⏳ Weekly upload limit */
    const uploads = projectImages.filter(
      img => img.projectId === projectId
    );

    if (uploads.length > 0) {
      const last = new Date(uploads.at(-1).timestamp).getTime();
      const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - last < ONE_WEEK) {
        return res.status(403).json({
          error: "Weekly upload limit reached",
        });
      }
    }

    /* ☁️ Upload to Drive */
    const driveRes = await drive.files.create({
      requestBody: { name: req.file.originalname },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      },
    });

    const fileId = driveRes.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    fs.unlinkSync(req.file.path);

    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    const image = {
      id: projectImages.length + 1,
      projectId,
      imageUrl,
      timestamp: new Date().toISOString(),
    };

    projectImages.push(image);

    res.json({ success: true, image });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ================================
   GET PROJECT IMAGES
================================ */
app.get("/contractor/project/:id/images", (req, res) => {
  const id = Number(req.params.id);
  res.json(projectImages.filter(i => i.projectId === id));
});

/* ================================
   START SERVER
================================ */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});