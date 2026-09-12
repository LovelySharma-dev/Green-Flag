// Server-authoritative progression engine.
// The client NEVER sends xp/gold deltas directly — only "I completed quest X",
// and this engine computes the effect. This is what stops users cheating stats.

const BASE_XP = 50;
const CURVE_EXP = 1.5;

export function xpForLevel(level) {
  return Math.round(BASE_XP * Math.pow(level, CURVE_EXP));
}

// Weight per flag. Yellow is a gentle nudge, not a punishment;
// red is a real setback; neutral doesn't move the economy at all.
const FLAG_WEIGHTS = {
  green: { xp: 20, gold: 10, integrity: 0, breaksStreak: false },
  yellow: { xp: -5, gold: 0, integrity: -2, breaksStreak: false },
  red: { xp: -25, gold: -15, integrity: -10, breaksStreak: true },
  neutral: { xp: 0, gold: 0, integrity: 0, breaksStreak: false },
};

/**
 * Applies a completed quest to a character document (mutates in place),
 * handling level-up rollover and streak logic. Returns a summary the
 * frontend can use to trigger the right animation.
 */
export function applyQuestCompletion(character, quest) {
  const weights = FLAG_WEIGHTS[quest.flag] ?? FLAG_WEIGHTS.neutral;

  const leveledUp = [];
  character.xp += weights.xp;
  character.gold = Math.max(0, character.gold + weights.gold);
  character.integrity = Math.min(100, Math.max(0, character.integrity + weights.integrity));

  // Roll xp up/down across level thresholds
  while (character.xp >= xpForLevel(character.level)) {
    character.xp -= xpForLevel(character.level);
    character.level += 1;
    leveledUp.push(character.level);
  }
  while (character.xp < 0 && character.level > 1) {
    character.level -= 1;
    character.xp += xpForLevel(character.level);
  }
  if (character.xp < 0) character.xp = 0;

  // Attribute bump only on green (skip cost of maintaining per-flag attribute rules elsewhere)
  if (quest.flag === "green" && quest.attribute) {
    character.attributes[quest.attribute] = (character.attributes[quest.attribute] || 0) + 5;
  }

  // Streak handling
  const today = new Date().toDateString();
  const last = character.lastActiveDate ? new Date(character.lastActiveDate).toDateString() : null;
  if (weights.breaksStreak) {
    character.streakCount = 0;
  } else if (last !== today) {
    character.streakCount += 1;
    character.lastActiveDate = new Date();
  }

  return {
    leveledUp,
    xpDelta: weights.xp,
    goldDelta: weights.gold,
    integrityDelta: weights.integrity,
    newLevel: character.level,
    newXp: character.xp,
    xpToNext: xpForLevel(character.level),
  };
}
