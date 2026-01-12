const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();

/* ================================
   MIDDLEWARE
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
   GET ADDRESS FROM IP
================================ */
async function getAddressFromIP(ip) {
  try {
    const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { latitude, longitude } = geo.data;

    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return res.data.results[0]?.formatted_address || "Address unavailable";
  } catch {
    return "Address unavailable";
  }
}

/* ================================
   UPLOAD IMAGE + ADDRESS
================================ */
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const projectId = Number(req.body.projectId);
    const timestamp = new Date().toISOString();

    // 🔥 Get address automatically
    const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const address = await getAddressFromIP(userIP);

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

    fs.unlinkSync(req.file.path);

    const imageData = {
      id: projectImages.length + 1,
      projectId,
      driveFileId: fileId,
      imageUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
      address,
      timestamp,
    };

    projectImages.push(imageData);

    res.json({ success: true, image: imageData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ================================
   PROJECT ROUTES
================================ */
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

app.get("/contractor/projects", (_, res) => {
  res.json(contractorProjects);
});

app.put("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);
  const project = contractorProjects.find(p => p.id === id);

  if (!project) return res.status(404).json({ error: "Not found" });

  project.description = req.body.description;
  project.startDate = req.body.startDate;
  project.endDate = req.body.endDate;

  res.json({ success: true, project });
});

app.delete("/contractor/project/:id", (req, res) => {
  const id = Number(req.params.id);
  contractorProjects = contractorProjects.filter(p => p.id !== id);
  projectImages = projectImages.filter(img => img.projectId !== id);
  res.json({ success: true });
});

app.get("/contractor/project/:id/images", (req, res) => {
  const id = Number(req.params.id);
  res.json(projectImages.filter(img => img.projectId === id));
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
app.listen(5000, () =>
  console.log("Server running → http://localhost:5000")
);
