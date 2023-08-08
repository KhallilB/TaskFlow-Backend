import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, // Regex to validate email
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "leader", "member"], // Customize roles as needed
      default: "employee", // Set a default role
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
    timezone: {
      type: String,
      default: "PST",
    },
    teams: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Team",
    },
    // Projects that the user is assigned to.
    projectsAssigned: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Project",
    },
    // Tasks assigned to the user.
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Task",
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
