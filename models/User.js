import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    activeTheme: {
      type: String,
      default: "default",
    },
    activeFrame: {
      type: String,
      default: "none",
    },
    activeTitle: {
      type: String,
      default: "Novice Adventurer",
    },
    activeBadge: {
      type: String,
      default: "first_step",
    },
    soundEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
