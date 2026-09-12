import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Character from "@/models/Character";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";
import { ensureDefaultShopItems } from "@/lib/seed";

export async function POST(req) {
  try {
    await dbConnect();
    await ensureDefaultShopItems();

    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Username and password are required" },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim();
    const user = await User.findOne({
      $or: [{ email: trimmed.toLowerCase() }, { username: trimmed }],
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    let character = await Character.findOne({ user: user._id });
    if (!character) {
      character = await Character.create({
        user: user._id,
        level: 1,
        xp: 0,
        gold: 50,
        integrity: 100,
        streakCount: 0,
        attributes: { coder: 0, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
      });
    }

    const token = signToken({ userId: user._id.toString(), username: user.username });
    const response = NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        activeTheme: user.activeTheme,
        activeFrame: user.activeFrame,
        activeTitle: user.activeTitle,
        activeBadge: user.activeBadge,
        soundEnabled: user.soundEnabled,
      },
      character,
    });

    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
