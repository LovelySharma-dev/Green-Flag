import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Quest from "@/models/Quest";
import Character from "@/models/Character";
import { applyQuestCompletion } from "@/lib/engine";
import { getUserIdFromRequest } from "@/lib/auth"; // implement via your chosen auth (JWT/Clerk/etc.)

export async function POST(req) {
  await dbConnect();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questId } = await req.json();
  const quest = await Quest.findOne({ _id: questId, user: userId });
  if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  if (quest.status === "completed") {
    return NextResponse.json({ error: "Already completed" }, { status: 409 });
  }

  const character = await Character.findOne({ user: userId });
  if (!character) return NextResponse.json({ error: "Character not found" }, { status: 404 });

  // ALL scoring math happens server-side — client only ever says "I did this quest"
  const result = applyQuestCompletion(character, quest);

  quest.status = "completed";
  quest.completedAt = new Date();

  await Promise.all([quest.save(), character.save()]);

  return NextResponse.json({ quest, character, result });
}
