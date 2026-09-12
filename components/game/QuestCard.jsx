"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FLAG_STYLES = {
  green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  red: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  yellow: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  neutral: "border-slate-500/40 bg-slate-500/10 text-slate-300",
};

const FLAG_ICON = { green: "🟢", red: "🔴", yellow: "🟡", neutral: "⚪" };

export default function QuestCard({ quest, onComplete, pending }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3 backdrop-blur-sm",
        FLAG_STYLES[quest.flag]
      )}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true">{FLAG_ICON[quest.flag]}</span>
        <div>
          <p className="font-medium">{quest.title}</p>
          <p className="text-xs opacity-70 capitalize">{quest.attribute}</p>
        </div>
      </div>

      {quest.status !== "completed" && (
        <Button
          size="sm"
          disabled={pending}
          onClick={() => onComplete(quest._id)}
          aria-label={`Complete quest: ${quest.title}`}
        >
          {pending ? "…" : "Complete"}
        </Button>
      )}
    </motion.div>
  );
}
