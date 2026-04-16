"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Linkedin,
  Mail,
  Zap,
  Brain,
  Target,
  TrendingDown,
  Users,
  Clock,
  MessageSquare,
  Bell,
  Package,
  Smartphone,
  Mail as MailIcon,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JourneyTimeline } from "@/components/prism/journey-timeline"
import { EmotionIndicator } from "@/components/prism/emotion-indicator"
import { InterventionCard } from "@/components/prism/intervention-card"
import { BuyerProfile } from "@/components/prism/buyer-profile"
import { PhoneMockup } from "@/components/prism/phone-mockup"
import { StepContent } from "@/components/prism/step-content"
import { cn } from "@/lib/utils"

// Buyer scenarios data
const buyerScenarios = {
  matt: {
    id: "matt",
    name: "Matt",
    type: "Classic Impulse Buyer",
    riskLevel: "High",
    probability: 0.87,
    avatar: "M",
    description: "Late-night Instagram purchase, high return-reason skew category",
    signals: [
      { name: "Return Reason Skew", matched: true, value: "Jacket → 68% fit/style returns" },
      { name: "Time-of-Purchase", matched: true, value: "1:47 AM local time" },
      { name: "Entry Source", matched: true, value: "Instagram influencer link" },
      { name: "Cart Dwell Time", matched: true, value: "47 seconds (below threshold)" },
      { name: "Size Confidence", matched: false, value: "Selected usual size" },
    ],
    interventionSummary: {
      windows: 3,
      passive: 3,
      active: 3,
    },
    journey: [
      {
        step: 1,
        title: "The Trigger",
        description: "Matt discovers a jacket on Instagram at 1:47 AM",
        details: [
          "Scrolling Instagram after midnight",
          "Sees influencer Jake wearing a vintage leather jacket",
          "Clicks affiliate link → lands on product page",
          "Cart dwell time: 47 seconds",
        ],
        emotion: { confidence: 85, doubt: 10, excitement: 90 },
        screen: "instagram" as const,
        type: "trigger" as const,
      },
      {
        step: 2,
        title: "Impulse Purchase",
        description: "Quick checkout without size research",
        details: [
          "Selects usual size without checking size guide",
          "Skips reviews section entirely",
          "Completes purchase in under 2 minutes",
          "Order confirmation: 1:48 AM",
        ],
        emotion: { confidence: 80, doubt: 15, excitement: 85 },
        screen: "checkout" as const,
        type: "trigger" as const,
      },
      {
        step: 3,
        title: "PRISM Detects Risk",
        description: "System identifies high-risk behavioral signals",
        details: [
          "P(impulse) calculated: 0.87",
          "4 of 5 behavioral signals matched",
          "Category return-reason skew: 68%",
          "Intervention sequence triggered",
        ],
        emotion: { confidence: 75, doubt: 25, excitement: 70 },
        screen: "confirmation" as const,
        type: "intervention" as const,
        intervention: {
          type: "page" as const,
          title: "Order Confirmation Page",
          message: "73% of buyers who got this jacket said it runs true to size. You're going to love it.",
          interventionType: "Reassurance + Social Proof",
          channel: "Passive" as const,
        },
      },
      {
        step: 4,
        title: "Window 1: Confirmation Email",
        description: "Active outreach with ownership framing",
        details: [
          "Email sent within 5 minutes of purchase",
          "Subject: Your new jacket is on its way",
          "Ownership language: \"your jacket\" not \"the jacket\"",
          "Includes style tips from other buyers",
        ],
        emotion: { confidence: 70, doubt: 35, excitement: 60 },
        screen: "notification" as const,
        notification: {
          title: "Your New Jacket",
          message: "Your vintage leather jacket is being prepared. Here's how others are styling theirs...",
        },
        type: "intervention" as const,
        intervention: {
          type: "email" as const,
          title: "Confirmation Email",
          message: "Your jacket is being prepared with care. Most buyers pair it with dark denim for their first outing.",
          interventionType: "Ownership Framing",
          channel: "Active" as const,
        },
      },
      {
        step: 5,
        title: "Doubt Formation",
        description: "Morning-after regret begins to set in",
        details: [
          "Wakes up, checks bank account",
          "Second-guesses the purchase",
          "Considers initiating return",
          "Searches \"return policy\" on site",
        ],
        emotion: { confidence: 42, doubt: 68, excitement: 25 },
        screen: "product" as const,
        type: "doubt" as const,
      },
      {
        step: 6,
        title: "Window 2: Push Notification",
        description: "Timely intervention during doubt window",
        details: [
          "Push notification triggered by doubt signals",
          "Anticipation-building message",
          "Shipping update with style content",
          "Redirects attention to arrival excitement",
        ],
        emotion: { confidence: 55, doubt: 45, excitement: 50 },
        screen: "notification" as const,
        notification: {
          title: "Shipping Update",
          message: "Your jacket just left the warehouse! Track it here + see what others wore on day one.",
        },
        type: "intervention" as const,
        intervention: {
          type: "push" as const,
          title: "Push Notification",
          message: "Your jacket just shipped! Most first-time wearers say the leather softens perfectly after a week.",
          interventionType: "Anticipation Building",
          channel: "Active" as const,
        },
      },
      {
        step: 7,
        title: "Window 2: Tracking Page",
        description: "Passive intervention via shipping page",
        details: [
          "Matt checks tracking multiple times",
          "Page includes contextual reassurance",
          "Style tips embedded in tracking experience",
          "Building anticipation for arrival",
        ],
        emotion: { confidence: 65, doubt: 35, excitement: 60 },
        screen: "tracking" as const,
        type: "intervention" as const,
        intervention: {
          type: "tracking" as const,
          title: "Tracking Page",
          message: "Your jacket is on the way. Most buyers pair it with denim or sneakers for their first outing.",
          interventionType: "Anticipation Building",
          channel: "Passive" as const,
        },
      },
      {
        step: 8,
        title: "Window 3: Delivery",
        description: "Final intervention at unboxing moment",
        details: [
          "Delivery notification with style guide",
          "Unboxing experience reinforcement",
          "Post-delivery email with care tips",
          "Confidence restored through ownership",
        ],
        emotion: { confidence: 88, doubt: 12, excitement: 82 },
        screen: "delivery" as const,
        type: "intervention" as const,
        intervention: {
          type: "delivery" as const,
          title: "Delivery Notification",
          message: "Your jacket has arrived! Here's a quick care guide to keep it looking fresh for years.",
          interventionType: "Ownership Reinforcement",
          channel: "Passive" as const,
        },
      },
      {
        step: 9,
        title: "Window 3: Post-Delivery Email",
        description: "Active follow-up to cement satisfaction",
        details: [
          "Email sent 2 hours after delivery",
          "Asks about first impressions",
          "Provides styling inspiration",
          "Subtle reminder of purchase reasoning",
        ],
        emotion: { confidence: 92, doubt: 8, excitement: 78 },
        screen: "notification" as const,
        notification: {
          title: "How's the fit?",
          message: "We'd love to hear your first impressions. Plus, here's how to break in the leather perfectly.",
        },
        type: "intervention" as const,
        intervention: {
          type: "email" as const,
          title: "Post-Delivery Email",
          message: "How's the fit? The leather will soften beautifully over the first few wears. Here's how to care for it.",
          interventionType: "Satisfaction Anchoring",
          channel: "Active" as const,
        },
      },
      {
        step: 10,
        title: "Order Retained",
        description: "Matt decides to keep the jacket",
        details: [
          "Return window passes without action",
          "Matt wears jacket for first outing",
          "Posts photo on Instagram",
          "PRISM intervention successful",
        ],
        emotion: { confidence: 95, doubt: 5, excitement: 85 },
        screen: "kept" as const,
        type: "outcome" as const,
      },
    ],
  },
  sarah: {
    id: "sarah",
    name: "Sarah",
    type: "Moderate Risk Buyer",
    riskLevel: "Moderate",
    probability: 0.74,
    avatar: "S",
    description: "Evening purchase, some research done but quick decision",
    signals: [
      { name: "Return Reason Skew", matched: true, value: "Dress → 52% fit returns" },
      { name: "Time-of-Purchase", matched: true, value: "9:23 PM local time" },
      { name: "Entry Source", matched: false, value: "Direct search" },
      { name: "Cart Dwell Time", matched: true, value: "1 min 20 sec" },
      { name: "Size Confidence", matched: false, value: "Checked size guide" },
    ],
    interventionSummary: {
      windows: 3,
      passive: 3,
      active: 1,
    },
    journey: [
      {
        step: 1,
        title: "The Discovery",
        description: "Sarah finds a dress while browsing in the evening",
        details: [
          "Browsing after dinner at 9:23 PM",
          "Searched directly for \"summer dress\"",
          "Spent 1 min 20 sec on product page",
          "Checked size guide briefly",
        ],
        emotion: { confidence: 78, doubt: 15, excitement: 75 },
        screen: "product" as const,
        type: "trigger" as const,
      },
      {
        step: 2,
        title: "Purchase Decision",
        description: "Completes purchase with moderate consideration",
        details: [
          "Read a few reviews",
          "Selected size based on guide",
          "Completed checkout",
          "Order confirmation: 9:28 PM",
        ],
        emotion: { confidence: 75, doubt: 20, excitement: 70 },
        screen: "checkout" as const,
        type: "trigger" as const,
      },
      {
        step: 3,
        title: "PRISM Detects Moderate Risk",
        description: "System identifies moderate-risk signals",
        details: [
          "P(impulse) calculated: 0.74",
          "3 of 5 behavioral signals matched",
          "Category return-reason skew: 52%",
          "Reduced intervention sequence",
        ],
        emotion: { confidence: 72, doubt: 28, excitement: 65 },
        screen: "confirmation" as const,
        type: "intervention" as const,
        intervention: {
          type: "page" as const,
          title: "Order Confirmation Page",
          message: "Great choice! This dress is a customer favorite with 4.6 stars from 230 reviews.",
          interventionType: "Social Proof",
          channel: "Passive" as const,
        },
      },
      {
        step: 4,
        title: "Window 1: Confirmation Email",
        description: "Single active outreach email",
        details: [
          "Email sent within 10 minutes",
          "Standard ownership framing",
          "No push notifications (P < 0.80)",
          "Light-touch approach",
        ],
        emotion: { confidence: 70, doubt: 30, excitement: 60 },
        screen: "notification" as const,
        notification: {
          title: "Order Confirmed",
          message: "Your summer dress is on its way! Expected delivery in 3-5 days.",
        },
        type: "intervention" as const,
        intervention: {
          type: "email" as const,
          title: "Confirmation Email",
          message: "Your dress is being prepared. Customers love pairing this with sandals for summer events.",
          interventionType: "Ownership Framing",
          channel: "Active" as const,
        },
      },
      {
        step: 5,
        title: "Mild Doubt",
        description: "Some second thoughts but not severe",
        details: [
          "Briefly wonders about fit",
          "Checks order status once",
          "Doesn't search for return policy",
          "Doubt is mild and passing",
        ],
        emotion: { confidence: 60, doubt: 40, excitement: 50 },
        screen: "product" as const,
        type: "doubt" as const,
      },
      {
        step: 6,
        title: "Window 2: Tracking Page Only",
        description: "Passive intervention, no active outreach",
        details: [
          "No push notification (P < 0.80)",
          "Tracking page has reassurance content",
          "Light anticipation building",
          "Minimal intervention needed",
        ],
        emotion: { confidence: 68, doubt: 32, excitement: 58 },
        screen: "tracking" as const,
        type: "intervention" as const,
        intervention: {
          type: "tracking" as const,
          title: "Tracking Page",
          message: "Your dress is in transit. Perfect for upcoming summer plans!",
          interventionType: "Anticipation Building",
          channel: "Passive" as const,
        },
      },
      {
        step: 7,
        title: "Window 3: Delivery",
        description: "Standard delivery notification",
        details: [
          "Delivery notification sent",
          "No post-delivery email (P < 0.80)",
          "Passive touchpoint only",
          "Let product speak for itself",
        ],
        emotion: { confidence: 82, doubt: 18, excitement: 72 },
        screen: "delivery" as const,
        type: "intervention" as const,
        intervention: {
          type: "delivery" as const,
          title: "Delivery Notification",
          message: "Your dress has arrived! Enjoy your new summer look.",
          interventionType: "Ownership Reinforcement",
          channel: "Passive" as const,
        },
      },
      {
        step: 8,
        title: "Order Retained",
        description: "Sarah keeps the dress",
        details: [
          "Tries on dress, fits well",
          "Return window passes",
          "Wears to summer event",
          "Moderate intervention successful",
        ],
        emotion: { confidence: 90, doubt: 10, excitement: 80 },
        screen: "kept" as const,
        type: "outcome" as const,
      },
    ],
  },
  jenna: {
    id: "jenna",
    name: "Jenna",
    type: "Low-Signal Buyer",
    riskLevel: "Low",
    probability: 0.63,
    avatar: "J",
    description: "Afternoon purchase with corroborating signals only",
    signals: [
      { name: "Return Reason Skew", matched: true, value: "Sweater → 45% fit returns" },
      { name: "Time-of-Purchase", matched: false, value: "2:15 PM local time" },
      { name: "Entry Source", matched: false, value: "Organic search" },
      { name: "Cart Dwell Time", matched: true, value: "1 min 5 sec" },
      { name: "Size Confidence", matched: false, value: "Checked size guide" },
    ],
    interventionSummary: {
      windows: 2,
      passive: 2,
      active: 0,
    },
    journey: [
      {
        step: 1,
        title: "The Discovery",
        description: "Jenna finds a sweater during lunch break",
        details: [
          "Browsing during afternoon break",
          "Found via organic Google search",
          "Cart dwell time: 1 min 5 sec",
          "Checked size guide before purchasing",
        ],
        emotion: { confidence: 82, doubt: 12, excitement: 70 },
        screen: "product" as const,
        type: "trigger" as const,
      },
      {
        step: 2,
        title: "Considered Purchase",
        description: "Completes purchase with some research",
        details: [
          "Read several reviews",
          "Compared with similar items",
          "Selected size after checking guide",
          "Order placed at 2:15 PM",
        ],
        emotion: { confidence: 80, doubt: 15, excitement: 68 },
        screen: "checkout" as const,
        type: "trigger" as const,
      },
      {
        step: 3,
        title: "PRISM Detects Low Risk",
        description: "System identifies lower-risk profile",
        details: [
          "P(impulse) calculated: 0.63",
          "Only 2 of 5 signals matched",
          "Below active outreach threshold",
          "Passive-only intervention mode",
        ],
        emotion: { confidence: 78, doubt: 18, excitement: 65 },
        screen: "confirmation" as const,
        type: "intervention" as const,
        intervention: {
          type: "page" as const,
          title: "Order Confirmation Page",
          message: "Thank you for your order! Your sweater is a bestseller this season.",
          interventionType: "Light Reassurance",
          channel: "Passive" as const,
        },
      },
      {
        step: 4,
        title: "No Follow-up Email",
        description: "Score below active outreach threshold",
        details: [
          "P(impulse) = 0.63 < 0.70 threshold",
          "No confirmation email intervention",
          "Standard transactional email only",
          "Preserving engagement capital",
        ],
        emotion: { confidence: 76, doubt: 20, excitement: 62 },
        screen: "notification" as const,
        notification: {
          title: "Order Confirmed",
          message: "Your order #12847 has been received. Standard delivery in 5-7 days.",
        },
        type: "neutral" as const,
      },
      {
        step: 5,
        title: "Window 2: Skipped",
        description: "No intervention during transit",
        details: [
          "No push notification sent",
          "No tracking page intervention",
          "Low risk doesn't warrant intrusion",
          "Avoiding over-communication",
        ],
        emotion: { confidence: 74, doubt: 22, excitement: 60 },
        screen: "tracking" as const,
        type: "neutral" as const,
      },
      {
        step: 6,
        title: "Window 3: Delivery Only",
        description: "Single passive touchpoint at delivery",
        details: [
          "Standard delivery notification",
          "No post-delivery email",
          "Minimal intervention approach",
          "Trust the considered purchase",
        ],
        emotion: { confidence: 85, doubt: 12, excitement: 70 },
        screen: "delivery" as const,
        type: "intervention" as const,
        intervention: {
          type: "delivery" as const,
          title: "Delivery Notification",
          message: "Your sweater has been delivered. Enjoy!",
          interventionType: "Simple Confirmation",
          channel: "Passive" as const,
        },
      },
      {
        step: 7,
        title: "Order Retained",
        description: "Jenna keeps the sweater naturally",
        details: [
          "No active intervention needed",
          "Product met expectations",
          "Return window passed",
          "Light-touch approach validated",
        ],
        emotion: { confidence: 92, doubt: 5, excitement: 75 },
        screen: "kept" as const,
        type: "outcome" as const,
      },
    ],
  },
}

const channelInfo = {
  passive: [
    { icon: FileText, name: "Order Confirmation Page", timing: "Immediate" },
    { icon: Package, name: "Shipping/Tracking Page", timing: "During transit" },
    { icon: Bell, name: "Delivery Notification", timing: "At delivery" },
  ],
  active: [
    { icon: MailIcon, name: "Confirmation Email", timing: "Within 5 min" },
    { icon: Smartphone, name: "Push Notification", timing: "During doubt window" },
    { icon: MailIcon, name: "Post-Delivery Email", timing: "2 hours after delivery" },
  ],
}

export default function PRISMJourney() {
  const [selectedScenario, setSelectedScenario] = useState<"matt" | "sarah" | "jenna">("matt")
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const scenario = buyerScenarios[selectedScenario]
  const currentJourneyStep = scenario.journey[currentStep]

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= scenario.journey.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [isPlaying, scenario.journey.length])

  // Reset step when scenario changes
  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [selectedScenario])

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
    setIsPlaying(false)
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(scenario.journey.length - 1, prev + 1))
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/50">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">PRISM</h1>
                <p className="text-xs text-muted-foreground">A PM Case Study by Ramya Velchuri</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com/in/ramyavelchuri" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a 
                href="mailto:ramya.velchuri@example.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Post-Purchase Remorse Intervention System Model</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">PRISM</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground mb-4 leading-relaxed">
                Turning buyer&apos;s remorse into lasting confidence
              </p>
              
              <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto">
                An AI-driven intervention system that detects impulse purchases and delivers 
                targeted reassurance across 6 channels to reduce returns by 10%.
              </p>
            </motion.div>
          </div>

          {/* Key Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
          >
            {[
              { value: "$744B", label: "Lost to Returns", icon: TrendingDown },
              { value: "44%", label: "Regret Rate", icon: Users },
              { value: "6", label: "Channels", icon: MessageSquare },
              { value: "10%", label: "Reduction Target", icon: Target },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center"
              >
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How PRISM Works */}
      <section className="border-b border-border/50 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">How PRISM Works</h2>
            <p className="text-muted-foreground">Three-step intervention across the post-purchase journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Detect",
                description: "Score each order using 5 behavioral signals to calculate impulse probability",
                icon: Target,
              },
              {
                step: "02",
                title: "Decide",
                description: "Route to intervention intensity based on probability thresholds",
                icon: Brain,
              },
              {
                step: "03",
                title: "Deliver",
                description: "Deploy targeted messaging across 3 windows and 6 channels",
                icon: Zap,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative bg-card border border-border/50 rounded-xl p-6"
              >
                <div className="text-5xl font-bold text-primary/10 absolute top-4 right-4">{item.step}</div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Channels Section */}
      <section className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">6-Channel Intervention System</h2>
            <p className="text-muted-foreground">Passive and active touchpoints across 3 windows</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Passive Channels */}
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Passive Channels</h3>
                  <p className="text-xs text-muted-foreground">User-initiated touchpoints</p>
                </div>
              </div>
              <div className="space-y-3">
                {channelInfo.passive.map((channel, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <channel.icon className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.timing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Channels */}
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Active Channels</h3>
                  <p className="text-xs text-muted-foreground">PRISM-initiated outreach</p>
                </div>
              </div>
              <div className="space-y-3">
                {channelInfo.active.map((channel, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <channel.icon className="h-4 w-4 text-accent" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.timing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario Selector */}
      <section className="border-b border-border/50 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Explore Buyer Journeys</h2>
            <p className="text-muted-foreground">See how PRISM adapts intervention intensity based on risk signals</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {Object.values(buyerScenarios).map((buyer) => (
              <button
                key={buyer.id}
                onClick={() => setSelectedScenario(buyer.id as "matt" | "sarah" | "jenna")}
                className={cn(
                  "relative p-4 rounded-xl border text-left transition-all duration-200",
                  selectedScenario === buyer.id
                    ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                    : "bg-card border-border/50 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                    buyer.riskLevel === "High" ? "bg-doubt/20 text-doubt" :
                    buyer.riskLevel === "Moderate" ? "bg-accent/20 text-accent" :
                    "bg-success/20 text-success"
                  )}>
                    {buyer.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{buyer.name}</h3>
                    <p className="text-xs text-muted-foreground">{buyer.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    buyer.riskLevel === "High" ? "bg-doubt/20 text-doubt" :
                    buyer.riskLevel === "Moderate" ? "bg-accent/20 text-accent" :
                    "bg-success/20 text-success"
                  )}>
                    {buyer.riskLevel} Risk
                  </span>
                  <span className="text-xs text-muted-foreground">P = {buyer.probability}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Journey Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Buyer Profile & Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <BuyerProfile
              name={scenario.name}
              type={scenario.type}
              probability={scenario.probability}
              signals={scenario.signals}
              avatar={scenario.avatar}
            />
          </div>
          
          {/* Intervention Summary */}
          <div className="lg:w-64 bg-card border border-border/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Intervention Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Windows Active</span>
                <span className="font-medium text-foreground">{scenario.interventionSummary.windows}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Passive Touchpoints</span>
                <span className="font-medium text-primary">{scenario.interventionSummary.passive}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Active Outreach</span>
                <span className="font-medium text-accent">{scenario.interventionSummary.active}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <JourneyTimeline
          steps={scenario.journey.map((s) => s.title)}
          currentStep={currentStep}
          onStepClick={(step) => {
            setCurrentStep(step)
            setIsPlaying(false)
          }}
        />

        {/* Journey Content */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup 
              screen={currentJourneyStep.screen} 
              notification={currentJourneyStep.notification}
            />
          </div>

          {/* Step Content */}
          <div className="lg:col-span-2 space-y-6">
            <StepContent
              step={currentJourneyStep.step}
              title={currentJourneyStep.title}
              description={currentJourneyStep.description}
              details={currentJourneyStep.details}
              type={currentJourneyStep.type}
            />

            {/* Emotion Indicator */}
            <EmotionIndicator
              confidence={currentJourneyStep.emotion.confidence}
              doubt={currentJourneyStep.emotion.doubt}
              excitement={currentJourneyStep.emotion.excitement}
            />

            {/* Intervention Card */}
            {currentJourneyStep.intervention && (
              <InterventionCard
                type={currentJourneyStep.intervention.type}
                title={currentJourneyStep.intervention.title}
                message={currentJourneyStep.intervention.message}
                interventionType={currentJourneyStep.intervention.interventionType}
                isVisible={true}
                channel={currentJourneyStep.intervention.channel}
              />
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentStep === scenario.journey.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground ml-4">
            Step {currentStep + 1} of {scenario.journey.length}
          </span>
        </div>
      </main>

      {/* Comparison Section */}
      <section className="border-t border-border/50 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Intervention Intensity Comparison</h2>
            <p className="text-muted-foreground">How PRISM calibrates outreach based on impulse probability</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Buyer</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">P(impulse)</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Risk Level</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Windows</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Passive</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Active</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(buyerScenarios).map((buyer) => (
                  <tr key={buyer.id} className="border-b border-border/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                          buyer.riskLevel === "High" ? "bg-doubt/20 text-doubt" :
                          buyer.riskLevel === "Moderate" ? "bg-accent/20 text-accent" :
                          "bg-success/20 text-success"
                        )}>
                          {buyer.avatar}
                        </div>
                        <span className="font-medium text-foreground">{buyer.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-mono text-foreground">{buyer.probability}</td>
                    <td className="text-center py-3 px-4">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        buyer.riskLevel === "High" ? "bg-doubt/20 text-doubt" :
                        buyer.riskLevel === "Moderate" ? "bg-accent/20 text-accent" :
                        "bg-success/20 text-success"
                      )}>
                        {buyer.riskLevel}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-foreground">{buyer.interventionSummary.windows}</td>
                    <td className="text-center py-3 px-4 text-primary font-medium">{buyer.interventionSummary.passive}</td>
                    <td className="text-center py-3 px-4 text-accent font-medium">{buyer.interventionSummary.active}</td>
                    <td className="text-center py-3 px-4 font-bold text-foreground">
                      {buyer.interventionSummary.passive + buyer.interventionSummary.active}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                PRISM Case Study by Ramya Velchuri
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com/in/ramyavelchuri" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:ramya.velchuri@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
