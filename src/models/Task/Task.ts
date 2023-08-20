import { Document, Schema, Model, model } from "mongoose";

export interface ITaskDocument extends Document {
  [key: string]: any; // Add index signature
  name: string;
  description: string;
  status: string;
  createdBy: Schema.Types.ObjectId;
  attachedTo: Schema.Types.ObjectId;
  dueDate: Date;
  priority: string;
  assignedUsers: Schema.Types.ObjectId[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask extends ITaskDocument {}

interface ITaskModel extends Model<ITaskDocument, {}> {}

const taskSchema = new Schema<ITask, ITaskModel>(
  {
    name: {
      type: String,
      unique: false,
      required: [true, "Please provide a name for the task"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    attachedTo: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    category: {
      type: String,
      enum: [
        "bug",
        "feature",
        "task",
        "enhancement",
        "research",
        "documentation",
        "other",
      ],
      default: "task",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;
