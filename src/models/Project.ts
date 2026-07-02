import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  authorId: string;
  authorName: string;
  likes: string[];
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String },
    liveUrl: { type: String },
    images: { type: [String], default: [] },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    likes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
