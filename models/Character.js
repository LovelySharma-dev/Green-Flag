import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }, // xp within current level
    gold: { type: Number, default: 0 },
    integrity: { type: Number, default: 100, min: 0, max: 100 }, // dips on red flags
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    attributes: {
      coder: { type: Number, default: 0 },
      monk: { type: Number, default: 0 },
      moksha: { type: Number, default: 0 },
      yolo: { type: Number, default: 0 },
      founder: { type: Number, default: 0 },
      athlete: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Character || mongoose.model("Character", CharacterSchema);
