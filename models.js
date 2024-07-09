import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  description: { type: String },
  mime_type: { type: String, required: true },
  path: { type: String, required: true },
  filename: { type: String, required: true },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

export { File };