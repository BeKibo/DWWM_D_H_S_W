import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Dossiers et fichiers
const uploadsFolder = path.join(__dirname, 'uploads');
const snapshotsPath = path.join(__dirname, 'snapshots.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsFolder));

// Multer pour upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsFolder);
  },
  filename: (req, file, cb) => {
    const { person } = req.body;
    const timestamp = Date.now();
    const safePerson = (person || 'Unknown').replace(/\s+/g, '_');
    const filename = `${safePerson}_${timestamp}.png`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Fonctions pour lire / écrire snapshots.json
const loadSnapshots = () => {
  if (!fs.existsSync(snapshotsPath)) {
    fs.writeFileSync(snapshotsPath, JSON.stringify([]));
  }
  const data = fs.readFileSync(snapshotsPath);
  return JSON.parse(data);
};

const saveSnapshots = (snapshots) => {
  fs.writeFileSync(snapshotsPath, JSON.stringify(snapshots, null, 2));
};

// ==================== ROUTES ====================

// POST - Upload d'une image et sauvegarde snapshot
app.post('/upload', upload.single('snapshot'), (req, res) => {
  const { labels, person } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const snapshots = loadSnapshots();
  const now = new Date();
  const date = now.toLocaleDateString('en-US'); // MM/DD/YYYY
  const time = now.toLocaleTimeString('en-US', { hour12: true }); // HH:MM AM/PM

  const newSnapshot = {
    id: Date.now(),
    filename: file.filename,
    labels: Array.isArray(labels) ? labels : [labels || 'Unknown'],
    date,
    time,
    filepath: `/uploads/${file.filename}`,
  };

  snapshots.push(newSnapshot);
  saveSnapshots(snapshots);

  res.json({ message: 'Snapshot saved!', snapshot: newSnapshot });
});

// GET - Récupérer tous les snapshots
app.get('/snapshots', (req, res) => {
  const snapshots = loadSnapshots();
  res.json(snapshots);
});

// DELETE - Supprimer un snapshot par ID
app.delete('/snapshots/:id', (req, res) => {
  const { id } = req.params;
  const snapshots = loadSnapshots();

  const snapshotIndex = snapshots.findIndex(snap => snap.id.toString() === id);

  if (snapshotIndex !== -1) {
    const [deletedSnapshot] = snapshots.splice(snapshotIndex, 1);

    // Supprimer aussi l'image physique
    const filePath = path.join(__dirname, deletedSnapshot.filepath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Supprimer l'image
    }

    saveSnapshots(snapshots);

    console.log(`Deleted snapshot ID: ${id}`);
    res.status(200).json({ message: 'Snapshot deleted successfully' });
  } else {
    console.error(`Snapshot with ID ${id} not found.`);
    res.status(404).json({ error: 'Snapshot not found' });
  }
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
