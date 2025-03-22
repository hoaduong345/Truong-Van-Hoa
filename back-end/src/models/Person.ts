import mongoose, { Schema, Document } from 'mongoose';

export interface IPerson extends Document {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  avatar: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const PersonSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  avatar: { type: String, required: true },
  score: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IPerson>('Person', PersonSchema); 