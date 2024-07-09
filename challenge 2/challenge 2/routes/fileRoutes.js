import express from 'express';
import multer from 'multer';
import { File } from '../models.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ... rest of your code ...
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/data/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get all files
router.get("/", async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.render("index", { files });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// Create a new file
router.post("/", upload.single("upload_file"), async (req, res) => {
  if (req.file) {
    try {
      const newFile = new File({
        name: req.file.originalname,
        size: req.file.size,
        mime_type: req.file.mimetype,
        path: req.file.path,
        filename: req.file.filename,
        description: req.body.description
      });
      await newFile.save();
      console.log('File saved:', newFile);
      res.redirect("/");
    } catch (err) {
      console.error('Error saving file:', err);
      res.status(500).send('An error occurred while saving the file');
    }
  } else {
    res.status(400).send('No file uploaded');
  }
});

router.get("/search", async (req, res) => {
    try {
      const fileId = req.query.id;
      if (!fileId) {
        return res.render("search_result", { error: "No file ID provided" });
      }
      const file = await File.findById(fileId);
      if (!file) {
        return res.render("search_result", { error: "File not found" });
      }
      res.render("search_result", { file });
    } catch (err) {
      console.error('Error retrieving file:', err);
      res.render("search_result", { error: "An error occurred while retrieving the file" });
    }
  });

// Get file by ID
// Get update form
router.get("/update/:id", async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).render("error", { message: "File not found" });
      }
      res.render("update_file", { file });
    } catch (err) {
      console.error('Error retrieving file for update:', err);
      res.status(500).render("error", { message: "An error occurred while retrieving the file" });
    }
  });
  
  // Update file information
  router.post("/update/:id", async (req, res) => {
    try {
      const file = await File.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description
      }, { new: true });
  
      if (!file) {
        return res.status(404).render("error", { message: "File not found" });
      }
  
      res.redirect("/");
    } catch (err) {
      console.error('Error updating file:', err);
      res.status(500).render("error", { message: "An error occurred while updating the file" });
    }
  });

  // Delete file by ID
router.post("/delete/:id", async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
  
      // Delete file from server
      const filePath = path.join(__dirname, '..', 'public', 'data', 'uploads', file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file from server:", err);
        }
      });
  
      // Delete file from database
      await File.findByIdAndDelete(req.params.id);
  
      res.redirect('/');
    } catch (err) {
      console.error('Error deleting file:', err);
      res.status(500).json({ message: "An error occurred while deleting the file" });
    }
  });
  router.get("/retrieve/:id", async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
  
      const filePath = path.join(__dirname, '..', 'public', 'data', 'uploads', file.filename);
  
      // Check if file exists
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
        res.setHeader('Content-type', file.mime_type);
  
        const filestream = fs.createReadStream(filePath);
        filestream.pipe(res);
      } else {
        res.status(404).json({ message: "File not found on server" });
      }
    } catch (err) {
      console.error('Error retrieving file:', err);
      res.status(500).json({ message: "An error occurred while retrieving the file" });
    }
  });

  router.get("/retrieve", async (req, res) => {
    const fileId = req.query.id;
    if (fileId) {
        try {
            const file = await File.findById(fileId);
            if (!file) {
                return res.render("retrieve_file", { error: "File not found" });
            }
            res.render("retrieve_file", { file });
        } catch (err) {
            console.error('Error retrieving file:', err);
            res.render("retrieve_file", { error: "An error occurred while retrieving the file" });
        }
    } else {
        res.render("retrieve_file");
    }
});

router.get("/retrieve/:id", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        const filePath = path.join(__dirname, '..', 'public', 'data', 'uploads', file.filename);

        if (fs.existsSync(filePath)) {
            res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
            res.setHeader('Content-type', file.mime_type);

            const filestream = fs.createReadStream(filePath);
            filestream.pipe(res);
        } else {
            res.status(404).json({ message: "File not found on server" });
        }
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: "An error occurred while downloading the file" });
    }
});

  export default router;