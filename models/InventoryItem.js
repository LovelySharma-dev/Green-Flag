import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "ShopItem", required: true },
    equipped: { type: Boolean, default: false },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A user can only own one copy of a given item
InventoryItemSchema.index({ user: 1, item: 1 }, { unique: true });

export default mongoose.models.InventoryItem || mongoose.model("InventoryItem", InventoryItemSchema);
