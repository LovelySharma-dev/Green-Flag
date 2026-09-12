import { xpForLevel, applyQuestCompletion } from "../lib/engine.js";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("--- Testing Progression Engine & Math ---");

// Test 1: Non-linear XP curve
const xpL1 = xpForLevel(1);
const xpL2 = xpForLevel(2);
const xpL3 = xpForLevel(3);
assert(xpL1 === 50, `Level 1 requires 50 XP (got ${xpL1})`);
assert(xpL2 > xpL1, `Level 2 (${xpL2} XP) > Level 1 (${xpL1} XP)`);
assert(xpL3 > xpL2, `Level 3 (${xpL3} XP) > Level 2 (${xpL2} XP)`);

// Test 2: Green Quest Completion
const char1 = {
  level: 1,
  xp: 0,
  gold: 0,
  integrity: 100,
  streakCount: 0,
  lastActiveDate: null,
  attributes: { coder: 0, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
};
const greenQuest = { flag: "green", attribute: "coder", title: "Write clean code" };
const res1 = applyQuestCompletion(char1, greenQuest);
assert(char1.xp === 20, `Green quest added 20 XP (xp: ${char1.xp})`);
assert(char1.gold === 10, `Green quest added 10 Gold (gold: ${char1.gold})`);
assert(char1.attributes.coder === 5, `Coder attribute increased to 5 (val: ${char1.attributes.coder})`);
assert(char1.streakCount === 1, `Streak increased to 1 (streak: ${char1.streakCount})`);
assert(res1.leveledUp.length === 0, `No level up at 20/50 XP`);

// Test 3: Level Up on Green Quest
const char2 = {
  level: 1,
  xp: 40,
  gold: 20,
  integrity: 100,
  streakCount: 1,
  lastActiveDate: new Date(),
  attributes: { coder: 10, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
};
const res2 = applyQuestCompletion(char2, greenQuest);
assert(char2.level === 2, `Character leveled up to 2 (level: ${char2.level})`);
assert(char2.xp === 10, `Character XP rolled over to 10 (xp: ${char2.xp})`);
assert(res2.leveledUp.includes(2), `Result indicated level 2 unlocked`);

// Test 4: Yellow Quest (Caution/Slip)
const char3 = {
  level: 2,
  xp: 30,
  gold: 50,
  integrity: 100,
  streakCount: 5,
  lastActiveDate: new Date(),
  attributes: { coder: 10, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
};
const yellowQuest = { flag: "yellow", attribute: "monk", title: "Minor procrastination" };
applyQuestCompletion(char3, yellowQuest);
assert(char3.xp === 25, `Yellow quest reduced XP by 5 (xp: ${char3.xp})`);
assert(char3.gold === 50, `Yellow quest did not change gold (gold: ${char3.gold})`);
assert(char3.integrity === 98, `Yellow quest reduced integrity to 98 (integrity: ${char3.integrity})`);
assert(char3.streakCount === 5, `Yellow quest did not break streak (streak: ${char3.streakCount})`);

// Test 5: Red Quest (Severe Setback)
const char4 = {
  level: 2,
  xp: 30,
  gold: 30,
  integrity: 100,
  streakCount: 7,
  lastActiveDate: new Date(),
  attributes: { coder: 10, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
};
const redQuest = { flag: "red", attribute: "monk", title: "Relapse/Setback" };
applyQuestCompletion(char4, redQuest);
assert(char4.xp === 5, `Red quest docked 25 XP (xp: ${char4.xp})`);
assert(char4.gold === 15, `Red quest docked 15 Gold (gold: ${char4.gold})`);
assert(char4.integrity === 90, `Red quest docked 10 Integrity (integrity: ${char4.integrity})`);
assert(char4.streakCount === 0, `Red quest broke streak to 0 (streak: ${char4.streakCount})`);

// Test 6: Neutral Quest
const char5 = {
  level: 1,
  xp: 10,
  gold: 10,
  integrity: 90,
  streakCount: 2,
  lastActiveDate: new Date(),
  attributes: { coder: 5, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
};
const neutralQuest = { flag: "neutral", attribute: "yolo", title: "Logged neutral event" };
applyQuestCompletion(char5, neutralQuest);
assert(char5.xp === 10 && char5.gold === 10 && char5.integrity === 90, "Neutral quest had 0 stat impact");

// Test 7: Gold Floor and Level 1 Floor
const char6 = {
  level: 1,
  xp: 5,
  gold: 5,
  integrity: 5,
  streakCount: 1,
  lastActiveDate: new Date(),
  attributes: { coder: 0, monk: 0, moksha: 0, yolo: 0, founder: 0, athlete: 0 },
};
applyQuestCompletion(char6, redQuest);
assert(char6.gold === 0, `Gold floored at 0 (gold: ${char6.gold})`);
assert(char6.xp === 0, `XP floored at 0 at Level 1 (xp: ${char6.xp})`);
assert(char6.level === 1, `Level cannot regress below 1 (level: ${char6.level})`);
assert(char6.integrity === 0, `Integrity floored at 0 (integrity: ${char6.integrity})`);

console.log("\n🎉 ALL ENGINE PROGRESSION TESTS PASSED SUCCESSFULLY!\n");
