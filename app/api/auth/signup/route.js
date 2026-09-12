import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Character from "@/models/Character";
import Quest from "@/models/Quest";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ensureDefaultShopItems } from "@/lib/seed";

export async function POST(req) {
  try {
    await dbConnect();
    await ensureDefaultShopItems();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      activeTheme: "default",
      activeFrame: "none",
      activeTitle: "Novice Adventurer",
      activeBadge: "first_step",
      soundEnabled: true,
    });

    // Create starting Character document
    const character = await Character.create({
      user: user._id,
      level: 1,
      xp: 0,
      gold: 50, // Starter bonus gold
      integrity: 100,
      streakCount: 0,
      attributes: {
        coder: 0,
        monk: 0,
        moksha: 0,
        yolo: 0,
        founder: 0,
        athlete: 0,
      },
    });

    // Seed initial starter quests for the user
    const starterQuests = [
      {
        user: user._id,
        title: "Complete 45-min Deep Work Coding Session",
        attribute: "coder",
        flag: "green",
        status: "active",
      },
      {
        user: user._id,
        title: "Mindful Meditation or Breathwork (10 min)",
        attribute: "monk",
        flag: "green",
        status: "active",
      },
      {
        user: user._id,
        title: "Strength / Cardio Gym Training",
        attribute: "athlete",
        flag: "green",
        status: "active",
      },
      {
        user: user._id,
        title: "Mindless Social Media Doomscrolling",
        attribute: "yolo",
        flag: "red",
        status: "active",
      },
      {
        user: user._id,
        title: "Stayed up past 1 AM browsing",
        attribute: "monk",
        flag: "yellow",
        status: "active",
      },
    ];

    await Quest.insertMany(starterQuests);

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
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
