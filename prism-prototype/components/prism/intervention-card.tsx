"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Mail, Bell, MessageSquare, Package, Smartphone } from "lucide-react"

interface InterventionCardProps {
  type: "email" | "push" | "page" | "delivery" | "tracking"
  title: string
  message: string
  interventionType: string
  isVisible: boolean
  delay?: number
  channel?: "Passive" | "Active"
}

const channelIcons = {
  email: Mail,
  push: Bell,
  page: MessageSquare,
  delivery: Package,
  tracking: Smartphone,
}

const channelLabels = {
  email: "Email",
  push: "Push Notification",
  page: "Order Page",
  delivery: "Delivery Notification",
  tracking: "Tracking Page",
}

export function InterventionCard({ 
  type, 
  title, 
  message, 
  interventionType,
  isVisible,
  delay = 0,
  channel
}: InterventionCardProps) {
  const Icon = channelIcons[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, delay }}
          className="relative overflow-hidden rounded-xl border border-primary/30 bg-card p-5"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          
          <div className="relative">
            {/* Channel header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {channelLabels[type]}
                  </span>
                  {channel && (
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      channel === "Passive" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-accent/20 text-accent"
                    )}>
                      {channel}
                    </span>
                  )}
                </div>
                <p className="text-xs text-primary font-medium">{interventionType}</p>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
            </div>

            {/* CTA preview */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-primary underline cursor-pointer hover:text-primary/80 transition-colors">
                View more
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
