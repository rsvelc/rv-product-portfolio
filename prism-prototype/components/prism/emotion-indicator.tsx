"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EmotionIndicatorProps {
  emotion: "excited" | "doubt" | "neutral" | "confident"
  confidence: number
  label: string
}

const emotionConfig = {
  excited: {
    color: "text-success",
    bgColor: "bg-success/20",
    borderColor: "border-success",
    gradient: "from-success/20 to-transparent",
  },
  doubt: {
    color: "text-doubt",
    bgColor: "bg-doubt/20",
    borderColor: "border-doubt",
    gradient: "from-doubt/20 to-transparent",
  },
  neutral: {
    color: "text-muted-foreground",
    bgColor: "bg-muted/20",
    borderColor: "border-muted",
    gradient: "from-muted/20 to-transparent",
  },
  confident: {
    color: "text-primary",
    bgColor: "bg-primary/20",
    borderColor: "border-primary",
    gradient: "from-primary/20 to-transparent",
  },
}

export function EmotionIndicator({ emotion, confidence, label }: EmotionIndicatorProps) {
  const config = emotionConfig[emotion]

  return (
    <div className={cn("rounded-xl border p-4", config.borderColor, config.bgColor)}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn("text-sm font-medium", config.color)}>{label}</span>
        <span className={cn("text-2xl font-bold font-mono", config.color)}>
          {confidence}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-background overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", config.bgColor.replace("/20", ""))}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
