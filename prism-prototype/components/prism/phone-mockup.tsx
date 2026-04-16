"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ShoppingBag, Bell, Package, CheckCircle, X } from "lucide-react"

interface PhoneMockupProps {
  screen: "instagram" | "product" | "checkout" | "confirmation" | "notification" | "delivery" | "kept" | "tracking"
  notification?: {
    title: string
    message: string
  }
}

export function PhoneMockup({ screen, notification }: PhoneMockupProps) {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-4 border-foreground/20 bg-background p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-foreground/20" />
        
        {/* Screen */}
        <div className="relative h-[500px] overflow-hidden rounded-[2rem] bg-card">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-2 text-xs text-muted-foreground">
            <span>1:47 AM</span>
            <div className="flex items-center gap-1">
              <span className="font-mono">87%</span>
            </div>
          </div>

          {/* Screen content */}
          <AnimatePresence mode="wait">
            {screen === "instagram" && (
              <InstagramScreen key="instagram" />
            )}
            {screen === "product" && (
              <ProductScreen key="product" />
            )}
            {screen === "checkout" && (
              <CheckoutScreen key="checkout" />
            )}
            {screen === "confirmation" && (
              <ConfirmationScreen key="confirmation" />
            )}
            {screen === "notification" && notification && (
              <NotificationScreen key="notification" {...notification} />
            )}
            {screen === "tracking" && (
              <TrackingScreen key="tracking" />
            )}
            {screen === "delivery" && (
              <DeliveryScreen key="delivery" />
            )}
            {screen === "kept" && (
              <KeptScreen key="kept" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-primary/10 blur-2xl" />
    </div>
  )
}

function InstagramScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-background p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500" />
        <div>
          <p className="text-xs font-semibold text-foreground">@styleinfl</p>
          <p className="text-[10px] text-muted-foreground">Sponsored</p>
        </div>
      </div>
      <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center mb-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-foreground mb-2">Just got this amazing jacket! Link in bio</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
      >
        Shop Now
      </motion.button>
    </motion.div>
  )
}

function ProductScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-4"
    >
      <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center mb-4">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/50" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">Premium Jacket</h3>
      <p className="text-lg font-bold text-foreground mb-2">$129.00</p>
      <p className="text-xs text-muted-foreground mb-4">30 seconds on page...</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg bg-accent text-accent-foreground text-sm font-bold"
      >
        Add to Cart
      </motion.button>
    </motion.div>
  )
}

function CheckoutScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-4"
    >
      <h3 className="font-semibold text-foreground mb-4">Checkout</h3>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary mb-4">
        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Premium Jacket</p>
          <p className="text-xs text-muted-foreground">Qty: 1</p>
        </div>
        <p className="text-sm font-bold text-foreground">$129</p>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">$129.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">FREE</span>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">$129.00</span>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg bg-accent text-accent-foreground text-sm font-bold"
      >
        Complete Purchase
      </motion.button>
    </motion.div>
  )
}

function ConfirmationScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-4 flex flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
      >
        <CheckCircle className="h-8 w-8 text-success" />
      </motion.div>
      <h3 className="font-semibold text-foreground mb-2">Order Confirmed!</h3>
      <p className="text-sm text-muted-foreground mb-4">Order #PRJ-2847</p>
      <p className="text-xs text-muted-foreground">Estimated delivery: 5-7 days</p>
    </motion.div>
  )
}

function NotificationScreen({ title, message }: { title: string; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="p-4 rounded-xl bg-primary/10 border border-primary/30"
      >
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
          </div>
        </div>
      </motion.div>
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">PRISM Intervention Active</p>
      </div>
    </motion.div>
  )
}

function TrackingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-4"
    >
      <h3 className="font-semibold text-foreground mb-4">Track Your Order</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">Order Placed</p>
            <p className="text-[10px] text-muted-foreground">Yesterday, 1:48 AM</p>
          </div>
        </div>
        <div className="ml-4 h-6 border-l-2 border-primary/30" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">In Transit</p>
            <p className="text-[10px] text-muted-foreground">Arriving Thursday</p>
          </div>
        </div>
        <div className="ml-4 h-6 border-l-2 border-muted/30" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground">Delivered</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>
      <div className="mt-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-xs text-foreground leading-relaxed">Most buyers pair it with denim or sneakers for their first outing.</p>
      </div>
    </motion.div>
  )
}

function DeliveryScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-4 flex flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4"
      >
        <Package className="h-8 w-8 text-primary" />
      </motion.div>
      <h3 className="font-semibold text-foreground mb-2">Your Package Arrived!</h3>
      <p className="text-sm text-muted-foreground mb-4">Delivered today at 2:34 PM</p>
    </motion.div>
  )
}

function KeptScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-4 flex flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mb-4"
      >
        <CheckCircle className="h-10 w-10 text-success" />
      </motion.div>
      <h3 className="font-semibold text-foreground mb-2">Order Retained</h3>
      <p className="text-sm text-muted-foreground mb-2">No return initiated</p>
      <p className="text-xs text-primary">PRISM intervention successful</p>
    </motion.div>
  )
}
