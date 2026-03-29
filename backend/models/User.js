import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  targetCareer: { type: String, default: '' },
  roadmap: { type: Array, default: [] }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
