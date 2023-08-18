import { Document, Model, Schema, model } from "mongoose";

export interface IProjectDocument extends Document {
    [key: string]: any; // Add index signature
    name: string;
    description: string;
    status: string;
    createdBy: Schema.Types.ObjectId;
    assignedUsers: Schema.Types.ObjectId[];
    assignedTeams: Schema.Types.ObjectId[];
    tasks: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IProject extends IProjectDocument {}

interface IProjectModel extends Model<IProjectDocument, {}> {}

const projectSchema = new Schema<IProject, IProjectModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    // The user who created the project.
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // The users who are assigned to the project.
    assignedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    // The teams that are assigned to the project.
    assignedTeams: {
      type: [Schema.Types.ObjectId],
      ref: "Team",
    },
    // The tasks that are assigned to the project.
    tasks: {
      type: [Schema.Types.ObjectId],
      ref: "Task",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Project = model<IProject>("Project", projectSchema);

export default Project;
