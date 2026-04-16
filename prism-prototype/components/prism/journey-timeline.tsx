"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface JourneyStep {
  id: string
  time: string
  title: string
  isActive: boolean
  isCompleted: boolean
  emotion: "excited" | "doubt" | "neutral" | "confident"
}

interface JourneyTimelineProps {
  steps: JourneyStep[]
  currentStep: number
  onStepClick: (index: number) => void
}

const emotionColors = {
  excited: "bg-success",
  doubt: "bg-doubt",
  neutral: "bg-muted-foreground",
  confident: "bg-primary",
}

export function JourneyTimeline({ steps, currentStep, onStepClick }: JourneyTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
      
      {/* Progress line */}
      <motion.div 
        className="absolute left-4 top-0 w-0.5 bg-primary md:left-1/2 md:-translate-x-1/2"
        initial={{ height: 0 }}
        animate={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative flex items-start gap-4 md:gap-8",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            {/* Step indicator */}
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 md:absolute md:left-1/2 md:-translate-x-1/2",
                step.isActive 
                  ? "border-primary bg-primary scale-125" 
                  : step.isCompleted 
                    ? "border-primary bg-primary/20" 
                    : "border-border bg-card"
              )}
            >
              <span className={cn(
                "h-2 w-2 rounded-full transition-colors",
                emotionColors[step.emotion]
              )} />
            </button>

            {/* Content */}
            <div className={cn(
              "flex-1 md:w-[calc(50%-2rem)]",
              index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
            )}>
              <span className="text-xs font-mono text-muted-foreground">{step.time}</span>
              <h3 className={cn(
                "text-sm font-medium mt-1 transition-colors",
                step.isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
