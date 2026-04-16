"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, Zap, Brain, MessageSquare, TrendingUp } from "lucide-react"

interface StepContentProps {
  step: number
  title: string
  description: string
  details: string[]
  type: "trigger" | "doubt" | "intervention" | "outcome" | "neutral"
}

const typeConfig = {
  trigger: {
    icon: Zap,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  doubt: {
    icon: AlertTriangle,
    color: "text-doubt",
    bgColor: "bg-doubt/10",
    borderColor: "border-doubt/30",
  },
  intervention: {
    icon: Brain,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  outcome: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
  neutral: {
    icon: TrendingUp,
    color: "text-muted-foreground",
    bgColor: "bg-muted/10",
    borderColor: "border-muted/30",
  },
}

export function StepContent({ step, title, description, details, type }: StepContentProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl border p-6",
        config.borderColor,
        config.bgColor
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          config.bgColor.replace("/10", "/20")
        )}>
          <Icon className={cn("h-6 w-6", config.color)} />
        </div>
        <div>
          <span className={cn("text-xs font-mono uppercase tracking-wider", config.color)}>
            Step {step}
          </span>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>

      {/* Details */}
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-start gap-2 text-sm"
          >
            <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", config.color.replace("text-", "bg-"))} />
            <span className="text-foreground/80">{detail}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
