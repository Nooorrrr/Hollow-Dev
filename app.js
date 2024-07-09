import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ejs from 'ejs';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Set up EJS as the view engine
app.engine("html", ejs.renderFile);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Use the file routes
app.use('/files', fileRoutes);

// Redirect root to files route
app.get('/', (req, res) => {
  res.redirect('/files');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`L'application tourne au port ${port}`);
});