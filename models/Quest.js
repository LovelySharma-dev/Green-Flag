import mongoose from "mongoose";

// Flags are the ONLY categorization axis. Titles are always free-text,
// user-authored. We never hardcode sensitive categories (legal, relational,
// medical, etc.) — the user names their own quests/vices, the flag just
// tells the engine how to score it.
export const FLAGS = ["green", "red", "yellow", "neutral"];

const QuestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    attribute: {
      type: String,
      enum: ["coder", "monk", "moksha", "yolo", "founder", "athlete"],
      required: true,
    },
    flag: { type: String, enum: FLAGS, default: "green" },
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Quest || mongoose.model("Quest", QuestSchema);
