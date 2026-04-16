"use client"

import { motion } from "framer-motion"
import { User, Clock, ShoppingBag, RotateCcw, AlertTriangle } from "lucide-react"

interface BuyerProfileProps {
  name: string
  age: number
  signals: {
    label: string
    value: string
    fired: boolean
  }[]
  probability: number
}

export function BuyerProfile({ name, age, signals, probability }: BuyerProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <User className="h-6 w-6 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{age} years old</p>
        </div>
      </div>

      {/* Probability score */}
      <div className="mb-5 p-4 rounded-lg bg-doubt/10 border border-doubt/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-doubt" />
            <span className="text-sm font-medium text-doubt">Impulse Buyer Score</span>
          </div>
          <span className="text-xl font-bold font-mono text-doubt">{probability}</span>
        </div>
        <div className="h-2 rounded-full bg-background overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-doubt"
            initial={{ width: 0 }}
            animate={{ width: `${probability * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Threshold: 0.60 - This buyer exceeds threshold
        </p>
      </div>

      {/* Signals */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Behavioral Signals
        </h4>
        {signals.map((signal, index) => (
          <motion.div
            key={signal.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`flex items-center justify-between p-3 rounded-lg ${
              signal.fired 
                ? "bg-doubt/10 border border-doubt/30" 
                : "bg-secondary/50"
            }`}
          >
            <span className="text-sm text-foreground">{signal.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                {signal.value}
              </span>
              {signal.fired && (
                <span className="flex h-2 w-2 rounded-full bg-doubt animate-pulse" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
