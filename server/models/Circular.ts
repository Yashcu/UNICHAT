import mongoose from 'mongoose';

export interface ICircular extends mongoose.Document {
  title: string;
  content: string;
  summary?: string;
  postedBy: mongoose.Types.ObjectId;
  postedAt: Date;
}

const circularSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedAt: { type: Date, default: Date.now }
});

export const Circular = mongoose.model<ICircular>('Circular', circularSchema);
