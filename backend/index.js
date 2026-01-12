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

const upload = multer({ dest: "uploads/" });

/* ================= GOOGLE DRIVE ================= */
const oauthClientData = JSON.parse(fs.readFileSync("oauth-client.json"));
const oauth2Client = new google.auth.OAuth2(
  oauthClientData.web.client_id,
  oauthClientData.web.client_secret,
  oauthClientData.web.redirect_uris[0]
);
oauth2Client.setCredentials(JSON.parse(fs.readFileSync("token.json")));

const drive = google.drive({ version: "v3", auth: oauth2Client });

/* ================= IN MEMORY DB ================= */
let contractorProjects = [];
let projectImages = [];
let feedbacks = [];

/* ================= ADDRESS ================= */
async function getAddressFromIP(ip) {
  try {
    const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
    if (!geo.data.latitude) return "Address unavailable";

    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${geo.data.latitude},${geo.data.longitude}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return res.data.results?.[0]?.formatted_address || "Address unavailable";
  } catch {
    return "Address unavailable";
  }
}

/* ================= UPLOAD IMAGES ================= */
app.post("/upload", upload.array("photos"), async (req, res) => {
  const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const address = await getAddressFromIP(userIP);

  const uploaded = [];

  for (let file of req.files) {
    const driveRes = await drive.files.create({
      requestBody: { name: file.originalname },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    });

    await drive.permissions.create({
      fileId: driveRes.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    fs.unlinkSync(file.path);

    const img = {
      id: projectImages.length + 1,
      projectId: Number(req.body.projectId),
      imageUrl: `https://drive.google.com/thumbnail?id=${driveRes.data.id}&sz=w800`,
      address,
      timestamp: new Date().toISOString(),
    };

    projectImages.push(img);
    uploaded.push(img);
  }

  res.json({ success: true, images: uploaded });
});

/* ================= PROJECT CRUD ================= */
app.post("/contractor/project", (req, res) => {
  const p = { id: contractorProjects.length + 1, ...req.body };
  contractorProjects.push(p);
  res.json(p);
});

app.get("/contractor/projects", (_, res) => res.json(contractorProjects));

app.put("/contractor/project/:id", (req, res) => {
  const p = contractorProjects.find(x => x.id == req.params.id);
  Object.assign(p, req.body);
  res.json(p);
});

app.delete("/contractor/project/:id", (req, res) => {
  contractorProjects = contractorProjects.filter(p => p.id != req.params.id);
  projectImages = projectImages.filter(i => i.projectId != req.params.id);
  res.json({ success: true });
});

app.get("/contractor/project/:id/images", (req, res) =>
  res.json(projectImages.filter(i => i.projectId == req.params.id))
);

/* ================= CITIZEN SEARCH ================= */
app.get("/citizen/search", (req, res) => {
  const words = req.query.q?.toLowerCase().split(" ").filter(w => w.length > 2);
  if (!words || words.length < 2) return res.json([]);

  const results = [];

  projectImages.forEach(img => {
    if (words.every(w => img.address.toLowerCase().includes(w))) {
      const proj = contractorProjects.find(p => p.id === img.projectId);
      if (proj && !results.find(r => r.projectId === proj.id)) {
        results.push({
          projectId: proj.id,
          description: proj.description,
          address: img.address,
          thumbnail: img.imageUrl,
        });
      }
    }
  });

  res.json(results);
});

/* ================= FEEDBACK ================= */
app.post("/citizen/feedback", upload.single("photo"), async (req, res) => {
  let imageUrl = null;

  if (req.file) {
    const d = await drive.files.create({
      requestBody: { name: req.file.originalname },
      media: { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) },
    });

    await drive.permissions.create({
      fileId: d.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    fs.unlinkSync(req.file.path);
    imageUrl = `https://drive.google.com/thumbnail?id=${d.data.id}&sz=w600`;
  }

  const fb = {
    id: feedbacks.length + 1,
    ...req.body,
    imageUrl,
    time: new Date().toISOString(),
  };

  feedbacks.push(fb);
  res.json({ success: true });
});

app.get("/contractor/project/:id/feedback", (req, res) =>
  res.json(feedbacks.filter(f => f.projectId == req.params.id))
);

/* ================= START ================= */
app.listen(5000, () =>
  console.log("🚀 Backend running on http://localhost:5000")
);
