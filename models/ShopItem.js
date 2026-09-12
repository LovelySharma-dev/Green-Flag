import mongoose from "mongoose";

// Cosmetic-only by design: themes, badges, avatar flair. Never pay-to-win
// stat boosts — gold buys flavor, not progression, so the economy can't
// undermine the "real effort = real progress" premise.
const ShopItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["theme", "badge", "avatar_frame", "title"], required: true },
  cost: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  assetKey: { type: String }, // maps to a CSS theme class / badge icon / etc.
});

export default mongoose.models.ShopItem || mongoose.model("ShopItem", ShopItemSchema);
