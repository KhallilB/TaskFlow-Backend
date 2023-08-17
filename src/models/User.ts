import { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUserDocument extends Document {
  [key: string]: any; // Add index signature
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
  };
  timezone: string;
  teams: Schema.Types.ObjectId[];
  projectsAssigned: Schema.Types.ObjectId[];
  tasks: Schema.Types.ObjectId[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends IUserDocument {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
}

interface IUserModel extends Model<IUserDocument, {}> {}

const userSchema = new Schema<IUser, IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
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
      // One uppercase letter
      // One special character
      // One digit
      // Min Length of 8
      match: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]){8}$/,
      minlength: 8
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
      type: [Schema.Types.ObjectId],
      ref: "Team",
    },
    // Projects that the user is assigned to.
    projectsAssigned: {
      type: [Schema.Types.ObjectId],
      ref: "Project",
    },
    // Tasks assigned to the user.
    tasks: {
      type: [Schema.Types.ObjectId],
      ref: "Task",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) return next();
  try {
    this.firstName = this.firstName.charAt(0).toUpperCase();
    this.lastName = this.lastName.charAt(0).toUpperCase();

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

// Method to get signed JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = model<IUser>("User", userSchema);

export default User;
