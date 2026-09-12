import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Character from "@/models/Character";
import { getUserIdFromRequest } from "@/lib/auth";
import { ensureDefaultShopItems } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    await ensureDefaultShopItems();

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let character = await Character.findOne({ user: userId });
    if (!character) {
      character = await Character.create({
        user: userId,
        level: 1,
        xp: 0,
        gold: 50,
        integrity: 100,
        streakCount: 0,
        attributes: { coder: 0, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
      });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        activeTheme: user.activeTheme || "default",
        activeFrame: user.activeFrame || "none",
        activeTitle: user.activeTitle || "Novice Adventurer",
        activeBadge: user.activeBadge || "first_step",
        soundEnabled: user.soundEnabled !== false,
      },
      character,
    });
  } catch (error) {
    console.error("Session /me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
