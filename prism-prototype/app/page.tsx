"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BuyerProfile } from "@/components/prism/buyer-profile"
import { PhoneMockup } from "@/components/prism/phone-mockup"
import { StepContent } from "@/components/prism/step-content"
import { InterventionCard } from "@/components/prism/intervention-card"
import { EmotionIndicator } from "@/components/prism/emotion-indicator"
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Linkedin, 
  Mail, 
  User, 
  ShoppingBag,
  Sparkles,
  Target,
  Zap,
  TrendingDown,
  Brain,
  Shield,
  Github,
  Download
} from "lucide-react"

// Matt's Journey - Classic Impulse Buyer (High signals, probability 0.87)
// Full 6 interventions: 3 passive (confirmation page, tracking page, delivery notification) + 3 active (confirmation email, push notification, post-delivery email)
const mattJourney = [
  {
    id: "discovery",
    time: "1:47 AM",
    title: "Discovery via Instagram",
    emotion: "excited" as const,
    confidence: 85,
    screen: "instagram" as const,
    step: {
      title: "Impulse Trigger",
      description: "Matt discovers a jacket through an Instagram reel from his favorite influencer at 1:47 AM.",
      details: [
        "Late-night browsing with reduced impulse control",
        "Social media entry source (influencer recommendation)",
        "High emotional engagement, low rational evaluation",
        "FOMO-driven click-through behavior"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "product",
    time: "1:47 AM",
    title: "30 Seconds on Product Page",
    emotion: "excited" as const,
    confidence: 78,
    screen: "product" as const,
    step: {
      title: "Minimal Evaluation",
      description: "Matt spends only 30 seconds on the product page, skipping reviews and detailed specifications.",
      details: [
        "Fast time-to-purchase (below platform average)",
        "Low page depth (skipped reviews and Q&A)",
        "No comparison shopping behavior",
        "Decision driven by aspiration, not information"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "checkout",
    time: "1:48 AM",
    title: "Quick Checkout",
    emotion: "excited" as const,
    confidence: 72,
    screen: "checkout" as const,
    step: {
      title: "Impulse Purchase Complete",
      description: "Matt completes checkout in under a minute. All behavioral signals now fire in PRISM.",
      details: [
        "Return reason skew: 70%+ prior remorse-coded returns",
        "Time-of-purchase match: History of late-night returns",
        "Entry source match: History of social-driven returns",
        "Impulse buyer probability: 0.87 (exceeds 0.60 threshold)"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "confirmation",
    time: "1:48 AM",
    title: "Window 1: Confirmation Page",
    emotion: "excited" as const,
    confidence: 65,
    screen: "confirmation" as const,
    intervention: {
      type: "page" as const,
      title: "Passive Channel #1: Order Confirmation Page",
      message: "A lot of customers said they weren't sure at first but ended up loving how the jacket fits. Click here to read their experience.",
      interventionType: "Reassurance + Social Proof",
      channel: "Passive"
    },
    step: {
      title: "Window 1: Immediate Intervention",
      description: "PRISM activates immediately. The first passive intervention appears embedded in the confirmation page.",
      details: [
        "Channel: Order confirmation page (T = 0)",
        "Type: PASSIVE - embedded in existing touchpoint",
        "Intervention: Reassurance + Social Proof",
        "Addresses doubt: \"Did I make a mistake?\""
      ],
      type: "intervention" as const
    }
  },
  {
    id: "email-confirmation",
    time: "1:58 AM",
    title: "Window 1: Confirmation Email",
    emotion: "excited" as const,
    confidence: 60,
    screen: "notification" as const,
    notification: {
      title: "Order confirmed - here's what buyers said",
      message: "Most people who own this jacket say the same thing - they kept it and wondered why they ever doubted it."
    },
    intervention: {
      type: "email" as const,
      title: "Active Channel #1: Order Confirmation Email",
      message: "Most people who own this jacket say the same thing - they kept it and wondered why they ever doubted it. Here's what buyers who felt the same way said after their first wear.",
      interventionType: "Reassurance + Social Proof",
      channel: "Active"
    },
    step: {
      title: "Window 1: Active Email Outreach",
      description: "PRISM sends a confirmation email 5-10 minutes after purchase with reinforcing social proof content.",
      details: [
        "Channel: Email (T = 5-10 min)",
        "Type: ACTIVE - proactive system outreach",
        "Reserved for P >= 0.80 (Matt is 0.87)",
        "Reinforces page intervention with buyer testimonials"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "doubt-forms",
    time: "Next Morning",
    title: "Post-Purchase Doubt",
    emotion: "doubt" as const,
    confidence: 42,
    screen: "notification" as const,
    notification: {
      title: "Your jacket is on its way",
      message: "You're going to want to see what other buyers said about this one."
    },
    step: {
      title: "Doubt Formation Window",
      description: "By morning, the initial excitement fades. Matt begins questioning his decision.",
      details: [
        "\"Do I really need this?\"",
        "\"Will it even look good on me?\"",
        "\"Why did I buy this at 2 AM?\"",
        "Critical period where returns are often initiated"
      ],
      type: "doubt" as const
    }
  },
  {
    id: "tracking-page",
    time: "Day 2",
    title: "Window 2: Tracking Page",
    emotion: "neutral" as const,
    confidence: 52,
    screen: "tracking" as const,
    intervention: {
      type: "tracking" as const,
      title: "Passive Channel #2: Shipping/Tracking Page",
      message: "Your new jacket arrives Thursday. Most buyers pair it with denim or sneakers for their first outing - that's when it earns its place.",
      interventionType: "Ownership + First-Use Guidance",
      channel: "Passive"
    },
    step: {
      title: "Window 2: Ownership Framing",
      description: "During the waiting period, PRISM embeds ownership framing content on the tracking page.",
      details: [
        "Channel: Shipping/tracking page (T = Day 2-3)",
        "Type: PASSIVE - embedded in existing touchpoint",
        "Intervention: Ownership + First-Use Guidance",
        "Makes product feel already integrated into life"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "push-notification",
    time: "Day 2",
    title: "Window 2: Push Notification",
    emotion: "neutral" as const,
    confidence: 58,
    screen: "notification" as const,
    notification: {
      title: "Your jacket arrives Thursday",
      message: "Most buyers pair it with denim or sneakers for their first outing. Here's how to style it."
    },
    intervention: {
      type: "push" as const,
      title: "Active Channel #2: Push Notification",
      message: "Your jacket arrives Thursday. Most buyers pair it with denim or sneakers for their first outing - that's when it earns its place.",
      interventionType: "Ownership + First-Use Guidance",
      channel: "Active"
    },
    step: {
      title: "Window 2: Active Push Outreach",
      description: "For high-probability buyers (P >= 0.80), PRISM sends an active push notification during the waiting period.",
      details: [
        "Channel: Push notification (T = 6-24 hrs)",
        "Type: ACTIVE - proactive system outreach",
        "Reserved for P >= 0.80 (Matt is 0.87)",
        "Push fires before email in same window (email is fallback)"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "delivery-notification",
    time: "Day 5",
    title: "Window 3: Delivery Notification",
    emotion: "confident" as const,
    confidence: 72,
    screen: "delivery" as const,
    notification: {
      title: "Your jacket has arrived!",
      message: "This is the kind of piece you'll reach for on your next weekend outing."
    },
    intervention: {
      type: "delivery" as const,
      title: "Passive Channel #3: Delivery Notification",
      message: "This is the kind of piece you'll reach for on your next weekend outing. See how others are styling it this season.",
      interventionType: "Anticipation Building",
      channel: "Passive"
    },
    step: {
      title: "Window 3: Anticipation Building",
      description: "At delivery, PRISM shifts focus from doubt to excitement about first use.",
      details: [
        "Channel: Delivery notification (T = delivery day)",
        "Type: PASSIVE - embedded in delivery touchpoint",
        "Intervention: Anticipation Building",
        "Final passive touchpoint before decision crystallizes"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "post-delivery-email",
    time: "Day 5",
    title: "Window 3: Post-Delivery Email",
    emotion: "confident" as const,
    confidence: 82,
    screen: "notification" as const,
    notification: {
      title: "It's here - your first-wear moment",
      message: "Try it with your usual outfit first. Buyers say that's always when it feels right."
    },
    intervention: {
      type: "email" as const,
      title: "Active Channel #3: Post-Delivery Email",
      message: "When it arrives, try it with your usual outfit first. Buyers say that's always when it feels right. See how this buyer styled it on day one...",
      interventionType: "Anticipation Building",
      channel: "Active"
    },
    step: {
      title: "Window 3: First-Use Activation",
      description: "High-confidence users (P >= 0.80) receive a post-delivery email with first-use guidance.",
      details: [
        "Channel: Post-delivery email (T = same day or +1)",
        "Type: ACTIVE - proactive system outreach",
        "Reserved for P >= 0.80 (Matt is 0.87)",
        "Provides concrete styling guidance for immediate use"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "kept",
    time: "Day 7+",
    title: "Order Retained",
    emotion: "confident" as const,
    confidence: 92,
    screen: "kept" as const,
    step: {
      title: "Successful Outcome",
      description: "Matt does not initiate a return. The doubt never fully crystallized into a decision.",
      details: [
        "No return initiated within 7-day window",
        "Full 6 interventions delivered (3P + 3A)",
        "Engagement signals fed back to model",
        "PRISM learns and improves for future interventions"
      ],
      type: "outcome" as const
    }
  }
]

// Sarah's Journey - Moderate-signal Buyer (Mixed signals, probability 0.74)
// Moderate 4 interventions: 3 passive + 1 active (confirmation email only, no push or post-delivery email)
const sarahJourney = [
  {
    id: "discovery",
    time: "9:15 PM",
    title: "Discovery via Pinterest",
    emotion: "excited" as const,
    confidence: 75,
    screen: "instagram" as const,
    step: {
      title: "Inspired Discovery",
      description: "Sarah discovers running shoes through a Pinterest board while browsing workout inspiration after dinner.",
      details: [
        "Evening browsing (moderate impulse control)",
        "Social media entry source (Pinterest inspiration)",
        "Moderate emotional engagement",
        "Interest-driven click-through (fitness goal)"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "product",
    time: "9:18 PM",
    title: "90 Seconds on Product Page",
    emotion: "excited" as const,
    confidence: 72,
    screen: "product" as const,
    step: {
      title: "Partial Evaluation",
      description: "Sarah spends 90 seconds on the product page, glances at the ratings but skips detailed reviews.",
      details: [
        "Time-to-purchase: Below average but not extremely fast",
        "Page depth: Viewed ratings, skipped full reviews",
        "Some deliberation present",
        "Decision influenced by fitness aspiration"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "checkout",
    time: "9:20 PM",
    title: "Checkout Complete",
    emotion: "excited" as const,
    confidence: 68,
    screen: "checkout" as const,
    step: {
      title: "Moderate-Signal Purchase",
      description: "Sarah completes checkout. Two pattern signals fire plus corroborating signals. Probability is 0.74.",
      details: [
        "Entry source match: Yes (social media history)",
        "Return reason skew: 45% remorse (moderate)",
        "Time-of-purchase: Evening, not late night",
        "Impulse buyer probability: 0.74 (between thresholds)"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "confirmation",
    time: "9:20 PM",
    title: "Window 1: Confirmation Page",
    emotion: "excited" as const,
    confidence: 65,
    screen: "confirmation" as const,
    intervention: {
      type: "page" as const,
      title: "Passive Channel #1: Order Confirmation Page",
      message: "Runners who bought these said the cushioning felt right from the first mile. See what they noticed.",
      interventionType: "Reassurance + Social Proof",
      channel: "Passive"
    },
    step: {
      title: "Window 1: Page Intervention",
      description: "PRISM activates with a passive intervention on the confirmation page.",
      details: [
        "Channel: Order confirmation page (T = 0)",
        "Type: PASSIVE - embedded in existing touchpoint",
        "Intervention: Reassurance + Social Proof",
        "Addresses doubt about product quality"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "email-confirmation",
    time: "9:30 PM",
    title: "Window 1: Confirmation Email",
    emotion: "excited" as const,
    confidence: 62,
    screen: "notification" as const,
    notification: {
      title: "Your running shoes are confirmed",
      message: "Most runners say they felt the difference on their first run. Here's what to expect."
    },
    intervention: {
      type: "email" as const,
      title: "Active Channel #1: Order Confirmation Email",
      message: "Most runners say they felt the difference on their first run. Here's what real buyers noticed during their first week.",
      interventionType: "Reassurance + Social Proof",
      channel: "Active"
    },
    step: {
      title: "Window 1: Active Email",
      description: "Sarah receives confirmation email since her score (0.74) is above 0.60 threshold but below 0.80.",
      details: [
        "Channel: Email (T = 5-10 min)",
        "Type: ACTIVE - but limited outreach",
        "0.74 > 0.60 threshold (intervention eligible)",
        "0.74 < 0.80 threshold (no push/post-delivery)"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "doubt-forms",
    time: "Next Morning",
    title: "Mild Doubt",
    emotion: "doubt" as const,
    confidence: 55,
    screen: "notification" as const,
    notification: {
      title: "Your shoes are being prepared",
      message: "Estimated shipping: Today"
    },
    step: {
      title: "Doubt Formation (Mild)",
      description: "Sarah experiences some doubt but it's less intense than a high-probability buyer.",
      details: [
        "\"Did I need new running shoes?\"",
        "\"I wonder if they'll fit right...\"",
        "Doubt present but not overwhelming",
        "Lower likelihood of return initiation"
      ],
      type: "doubt" as const
    }
  },
  {
    id: "tracking-page",
    time: "Day 2",
    title: "Window 2: Tracking Page",
    emotion: "neutral" as const,
    confidence: 60,
    screen: "tracking" as const,
    intervention: {
      type: "tracking" as const,
      title: "Passive Channel #2: Shipping/Tracking Page",
      message: "Your new running shoes arrive Friday. Many buyers break them in with a short walk before their first run.",
      interventionType: "Ownership + First-Use Guidance",
      channel: "Passive"
    },
    step: {
      title: "Window 2: Passive Only",
      description: "Sarah sees ownership framing on tracking page but receives no push notification (P < 0.80).",
      details: [
        "Channel: Shipping/tracking page (T = Day 2)",
        "Type: PASSIVE only",
        "NO push notification (0.74 < 0.80)",
        "Appropriate restraint for moderate-risk buyer"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "no-push",
    time: "Day 2",
    title: "Window 2: No Push Sent",
    emotion: "neutral" as const,
    confidence: 62,
    screen: "notification" as const,
    notification: {
      title: "Shipping update",
      message: "Your package is in transit. Arriving Friday."
    },
    step: {
      title: "Skipped: Push Notification",
      description: "PRISM does not send a push notification. Sarah's score is below the active outreach threshold.",
      details: [
        "Push reserved for P >= 0.80",
        "Sarah's probability: 0.74",
        "Avoids over-communication",
        "Passive tracking intervention is sufficient"
      ],
      type: "neutral" as const
    }
  },
  {
    id: "delivery-notification",
    time: "Day 4",
    title: "Window 3: Delivery Notification",
    emotion: "confident" as const,
    confidence: 75,
    screen: "delivery" as const,
    notification: {
      title: "Your running shoes have arrived!",
      message: "A short walk today, your first run tomorrow - that's how most buyers break them in."
    },
    intervention: {
      type: "delivery" as const,
      title: "Passive Channel #3: Delivery Notification",
      message: "A short walk today, your first run tomorrow - that's how most buyers break them in.",
      interventionType: "Anticipation Building",
      channel: "Passive"
    },
    step: {
      title: "Window 3: Delivery Touch",
      description: "PRISM delivers the final passive intervention at delivery.",
      details: [
        "Channel: Delivery notification (T = delivery day)",
        "Type: PASSIVE - third and final passive touch",
        "Intervention: Anticipation Building",
        "No post-delivery email (P < 0.80)"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "kept",
    time: "Day 7+",
    title: "Order Retained",
    emotion: "confident" as const,
    confidence: 88,
    screen: "kept" as const,
    step: {
      title: "Successful Outcome",
      description: "Sarah does not initiate a return. The moderate intervention intensity was appropriate for her risk level.",
      details: [
        "No return initiated",
        "4 total interventions (3P + 1A)",
        "Balanced approach for mid-range probability",
        "Outcome helps calibrate thresholds for P=0.74"
      ],
      type: "outcome" as const
    }
  }
]

// Jenna's Journey - Low-signal Buyer (Corroborating signals only, probability 0.63)
// Light touch: 2 passive interventions only
const jennaJourney = [
  {
    id: "discovery",
    time: "12:15 PM",
    title: "Flash Sale Discovery",
    emotion: "excited" as const,
    confidence: 70,
    screen: "instagram" as const,
    step: {
      title: "Sale-Driven Entry",
      description: "Jenna discovers wireless earbuds through a flash sale banner during her lunch break.",
      details: [
        "Browsing during lunch (normal hours)",
        "Entry via flash sale banner on platform",
        "Moderate emotional engagement",
        "Price-driven discovery, not influencer-driven"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "product",
    time: "12:17 PM",
    title: "2 Minutes on Product Page",
    emotion: "excited" as const,
    confidence: 72,
    screen: "product" as const,
    step: {
      title: "Light Evaluation",
      description: "Jenna spends two minutes on the product page and reads a few reviews before checkout.",
      details: [
        "Time-to-purchase: Below average for electronics",
        "Page depth: Below platform average",
        "Did read some reviews (unlike impulse buyer)",
        "Some deliberation, but still fast"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "checkout",
    time: "12:19 PM",
    title: "Checkout Complete",
    emotion: "excited" as const,
    confidence: 68,
    screen: "checkout" as const,
    step: {
      title: "Low-Signal Purchase",
      description: "Jenna completes checkout. Only corroborating signals fire - no pattern signals detected.",
      details: [
        "Fast time-to-purchase: Yes (corroborating)",
        "Low page depth: Yes (corroborating)",
        "Return reason skew: No (18% overall return rate)",
        "Impulse buyer probability: 0.63 (just above 0.60)"
      ],
      type: "trigger" as const
    }
  },
  {
    id: "confirmation",
    time: "12:19 PM",
    title: "Window 1: Confirmation Page",
    emotion: "excited" as const,
    confidence: 65,
    screen: "confirmation" as const,
    intervention: {
      type: "page" as const,
      title: "Passive Channel #1: Order Confirmation Page",
      message: "You'll notice the difference the first time you use these, especially on a commute or during a workout. See it in action.",
      interventionType: "Anticipation Building",
      channel: "Passive"
    },
    step: {
      title: "Window 1: Light Touch",
      description: "Only passive intervention on confirmation page. No email since score below active outreach threshold.",
      details: [
        "Channel: Order confirmation page only",
        "Type: PASSIVE - minimal intervention",
        "NO confirmation email (0.63 < 0.80)",
        "Light touch for low-confidence flagged users"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "no-email",
    time: "12:30 PM",
    title: "Window 1: No Email Sent",
    emotion: "neutral" as const,
    confidence: 62,
    screen: "notification" as const,
    notification: {
      title: "Order #JN-2847 confirmed",
      message: "Your wireless earbuds are on the way. Expected delivery: Thursday."
    },
    step: {
      title: "Skipped: Confirmation Email",
      description: "PRISM does not send a confirmation email. Jenna's score is below the active outreach threshold.",
      details: [
        "No pattern signals fired",
        "Probability 0.63 < 0.80 threshold",
        "Active outreach reserved for high-confidence users",
        "Avoids over-communication for low-risk buyers"
      ],
      type: "neutral" as const
    }
  },
  {
    id: "window2-skipped",
    time: "Day 2-3",
    title: "Window 2: Skipped",
    emotion: "neutral" as const,
    confidence: 60,
    screen: "notification" as const,
    notification: {
      title: "Your order is on its way",
      message: "Estimated delivery: Thursday. Track your package."
    },
    step: {
      title: "Window 2: No Intervention",
      description: "Window 2 is skipped entirely. Corroborating signals only - no pattern signal confirmed behavioral history.",
      details: [
        "No tracking page intervention",
        "No push notification sent",
        "No email fallback needed",
        "System conserves intervention capacity"
      ],
      type: "neutral" as const
    }
  },
  {
    id: "delivery",
    time: "Day 4",
    title: "Window 3: Delivery Notification",
    emotion: "confident" as const,
    confidence: 72,
    screen: "delivery" as const,
    notification: {
      title: "Your earbuds have arrived!",
      message: "Ten minutes on your favorite playlist - buyers say that's the moment it clicks."
    },
    intervention: {
      type: "delivery" as const,
      title: "Passive Channel #2: Delivery Notification",
      message: "Your earbuds are here. Ten minutes on your favorite playlist - buyers say that's the moment it clicks.",
      interventionType: "Anticipation Building",
      channel: "Passive"
    },
    step: {
      title: "Window 3: Delivery Touch",
      description: "PRISM delivers a passive intervention at delivery - the second and final touchpoint for Jenna.",
      details: [
        "Channel: Delivery notification",
        "Type: PASSIVE only",
        "No post-delivery email (P < 0.80)",
        "Total touchpoints: 2 passive, 0 active"
      ],
      type: "intervention" as const
    }
  },
  {
    id: "kept",
    time: "Day 7+",
    title: "Order Retained",
    emotion: "confident" as const,
    confidence: 85,
    screen: "kept" as const,
    step: {
      title: "Successful Outcome",
      description: "Jenna does not initiate a return. The light-touch intervention was appropriate for her risk level.",
      details: [
        "No return initiated",
        "2 passive touchpoints delivered",
        "0 active outreach sent",
        "Outcome contributes to threshold calibration for P=0.63"
      ],
      type: "outcome" as const
    }
  }
]

const mattSignals = [
  { label: "Return Reason Skew", value: "73% remorse", fired: true },
  { label: "Time-of-Purchase Match", value: "1:47 AM", fired: true },
  { label: "Entry Source Match", value: "Instagram", fired: true },
  { label: "Fast Time-to-Purchase", value: "< 60 sec", fired: true },
  { label: "Low Page Depth", value: "No reviews", fired: true },
]

const sarahSignals = [
  { label: "Return Reason Skew", value: "45% remorse", fired: false },
  { label: "Time-of-Purchase Match", value: "9:15 PM", fired: false },
  { label: "Entry Source Match", value: "Pinterest", fired: true },
  { label: "Fast Time-to-Purchase", value: "< 90 sec", fired: true },
  { label: "Low Page Depth", value: "Few pages", fired: true },
]

const jennaSignals = [
  { label: "Return Reason Skew", value: "18% overall", fired: false },
  { label: "Time-of-Purchase Match", value: "12:15 PM", fired: false },
  { label: "Entry Source Match", value: "Sale Banner", fired: false },
  { label: "Fast Time-to-Purchase", value: "< 2 min", fired: true },
  { label: "Low Page Depth", value: "Few pages", fired: true },
]

type Scenario = "matt" | "sarah" | "jenna"

const scenarios = {
  matt: {
    name: "Matt",
    age: 28,
    type: "Classic Impulse Buyer",
    probability: 0.87,
    signals: mattSignals,
    journey: mattJourney,
    description: "High-signal buyer with 5 pattern signals fired. Receives full 6-intervention sequence (3 passive + 3 active).",
    product: "Jacket",
    entrySource: "Instagram influencer reel",
    riskLevel: "High Likelihood",
    passiveTouchpoints: 3,
    activeTouchpoints: 3,
    windowsActive: "3 of 3"
  },
  sarah: {
    name: "Sarah",
    age: 31,
    type: "Moderate-Signal Buyer",
    probability: 0.74,
    signals: sarahSignals,
    journey: sarahJourney,
    description: "Mixed signals with probability between thresholds. Receives 4 interventions (3 passive + 1 active email).",
    product: "Running Shoes",
    entrySource: "Pinterest inspiration",
    riskLevel: "Moderate Likelihood",
    passiveTouchpoints: 3,
    activeTouchpoints: 1,
    windowsActive: "3 of 3"
  },
  jenna: {
    name: "Jenna",
    age: 34,
    type: "Low-Signal Buyer",
    probability: 0.63,
    signals: jennaSignals,
    journey: jennaJourney,
    description: "Low-signal buyer with only corroborating signals. Receives 2 light-touch passive interventions only.",
    product: "Wireless Earbuds",
    entrySource: "Flash sale banner",
    riskLevel: "Low Likelihood",
    passiveTouchpoints: 2,
    activeTouchpoints: 0,
    windowsActive: "2 of 3"
  }
}

export default function PRISMJourney() {
  const [currentScenario, setCurrentScenario] = useState<Scenario>("matt")
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const scenario = scenarios[currentScenario]
  const journeySteps = scenario.journey
  const step = journeySteps[currentStep]

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= journeySteps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, journeySteps.length])

  const handleScenarioChange = (newScenario: Scenario) => {
    setCurrentScenario(newScenario)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PRISM</h1>
              <p className="text-xs text-muted-foreground">Post-Purchase Remorse Intervention Model</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://www.linkedin.com/in/ramya-velchuri/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">Ramya Velchuri</span>
            </a>
            <a 
              href="https://github.com/rsvelc/rv-product-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a 
              href="mailto:ramyasree0299@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* PRISM Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">A PM Case Study by Ramya Velchuri</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              <span className="text-primary">PRISM</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 text-balance">
              Post-Purchase Remorse Intervention and Signal Model
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              PRISM is a multi-agent post-purchase personalization system that uses behavioral signals and historical return patterns to identify buyers at high likelihood of post-purchase remorse, then delivers personalized interventions across the post-purchase journey to increase purchase confidence and reduce remorse-driven returns.
            </p>
            <a
              href="https://github.com/rsvelc/rv-product-portfolio/raw/8d82f8a059e8b72757e012c7a5f718c2e8713269/prism/PRISM-rsvelc-casestudy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <Download className="h-4 w-4" />
              Download the case study here
            </a>
          </motion.div>

          {/* Key Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <span className="text-2xl font-bold text-foreground">$744B</span>
              </div>
              <p className="text-sm text-muted-foreground">Lost to e-commerce returns annually</p>
            </div>
            
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <span className="text-2xl font-bold text-foreground">44%</span>
              </div>
              <p className="text-sm text-muted-foreground">Returns influenced by post-purchase doubt</p>
            </div>
            
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-bold text-foreground">5</span>
              </div>
              <p className="text-sm text-muted-foreground">Behavioral signals analyzed per purchase</p>
            </div>
            
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <span className="text-2xl font-bold text-foreground">10%</span>
              </div>
              <p className="text-sm text-muted-foreground">Projected reduction in remorse-driven returns with PRISM</p>
            </div>
          </motion.div>

          {/* How PRISM Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl border border-primary/20 bg-primary/5"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              How PRISM Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium text-primary mb-2">1. Detect</div>
                <p className="text-sm text-muted-foreground">Analyze behavioral signals (return history, time-of-purchase, entry source, page depth) to calculate remorse probability (0-1).</p>
              </div>
              <div>
                <div className="text-sm font-medium text-primary mb-2">2. Decide</div>
                <p className="text-sm text-muted-foreground">Select intervention type and intensity based on probability score. Higher risk = more touchpoints across 3 intervention windows.</p>
              </div>
              <div>
                <div className="text-sm font-medium text-primary mb-2">3. Deliver</div>
                <p className="text-sm text-muted-foreground">Deploy personalized interventions via 6 channels: confirmation page, email, tracking page, push notification, delivery notification, post-delivery email.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Journey Section Header */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-mono text-primary mb-4"
          >
            INTERACTIVE PROTOTYPE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance"
          >
            Explore the Buyer&apos;s Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            See how PRISM adapts its intervention strategy based on behavioral signals across three different buyer scenarios.
          </motion.p>
        </div>
      </section>

      {/* Scenario Selector */}
      <section className="max-w-5xl mx-auto px-4 mb-8">
        {/* Autoplay Button at Top */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-sm text-muted-foreground mb-3 text-center">Click Autoplay to see the journey through the eyes of each buyer</p>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full px-6"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Auto Play
              </>
            )}
          </Button>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-4">
          {(Object.keys(scenarios) as Scenario[]).map((key) => {
            const s = scenarios[key]
            const isActive = currentScenario === key
            return (
              <motion.button
                key={key}
                onClick={() => handleScenarioChange(key)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isActive 
                    ? "border-primary bg-primary/10" 
                    : "border-border bg-card hover:border-primary/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? "bg-primary/20" : "bg-secondary"}`}>
                    <User className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground">{s.name}, {s.age}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                        s.riskLevel === "High Likelihood" 
                          ? "bg-destructive/20 text-destructive" 
                          : s.riskLevel === "Moderate Likelihood"
                            ? "bg-accent/20 text-accent"
                            : "bg-success/20 text-success"
                      }`}>
                        {s.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-primary font-medium mb-1">{s.type}</p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{s.description}</p>
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ShoppingBag className="h-3 w-3" />
                        {s.product}
                      </span>
                      <span className="font-mono text-foreground">P = {s.probability}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {scenario.name}&apos;s Journey Progress
            </span>
            <span className="text-sm font-mono text-foreground">
              {currentStep + 1} / {journeySteps.length}
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / journeySteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-between mt-2">
            {journeySteps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentStep 
                    ? "bg-primary scale-150" 
                    : idx < currentStep 
                      ? "bg-primary/50" 
                      : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Journey Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Buyer Profile */}
          <div className="lg:col-span-3 space-y-6">
            <BuyerProfile
              name={scenario.name}
              age={scenario.age}
              signals={scenario.signals}
              probability={scenario.probability}
            />
            <EmotionIndicator
              emotion={step.emotion}
              confidence={step.confidence}
              label={step.emotion === "doubt" ? "Doubt Level" : step.emotion === "confident" ? "Confidence" : step.emotion === "neutral" ? "Neutral" : "Excitement"}
            />
            
            {/* Intervention Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <h4 className="text-sm font-medium text-foreground mb-3">Intervention Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Windows Active</span>
                  <span className="font-mono text-foreground">{scenario.windowsActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passive Touchpoints</span>
                  <span className="font-mono text-foreground">{scenario.passiveTouchpoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Outreach</span>
                  <span className="font-mono text-foreground">{scenario.activeTouchpoints}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Total Interventions</span>
                  <span className="font-mono text-primary font-semibold">
                    {scenario.passiveTouchpoints + scenario.activeTouchpoints}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Phone Mockup */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="sticky top-24">
              <PhoneMockup 
                screen={step.screen} 
                notification={step.notification}
              />
              <div className="mt-6 text-center">
                <p className="text-sm font-mono text-muted-foreground">{step.time}</p>
                <p className="text-sm text-foreground font-medium">{step.title}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Step Details & Intervention */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <StepContent
                key={`${currentScenario}-${step.id}`}
                step={currentStep + 1}
                {...step.step}
              />
            </AnimatePresence>

            {step.intervention && (
              <InterventionCard
                {...step.intervention}
                isVisible={true}
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentStep === journeySteps.length - 1}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 6 Channels Explanation */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Where are interventions seen and at what time?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">P</div>
                Passive Channels
              </h4>
              <p className="text-sm text-muted-foreground mb-4">Embedded in existing touchpoints where the buyer is already present.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">W1</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Order Confirmation Page</p>
                    <p className="text-xs text-muted-foreground">T = 0 min - Immediately after purchase</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">W2</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Shipping/Tracking Page</p>
                    <p className="text-xs text-muted-foreground">T = Day 2-3 - During waiting period</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">W3</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Delivery Notification</p>
                    <p className="text-xs text-muted-foreground">T = Delivery day - At package arrival</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 rounded-xl border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">A</div>
                Active Channels
              </h4>
              <p className="text-sm text-muted-foreground mb-4">Proactive outreach reserved for high-probability buyers (P &gt;= 0.80).</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">W1</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Order Confirmation Email</p>
                    <p className="text-xs text-muted-foreground">T = 5-10 min - Follow-up with social proof</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">W2</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Push Notification</p>
                    <p className="text-xs text-muted-foreground">T = 6-24 hrs - Fires before email fallback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">W3</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Post-Delivery Email</p>
                    <p className="text-xs text-muted-foreground">T = Same day or +1 - First-use guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Comparison */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">How does it adapt for different users?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {(Object.keys(scenarios) as Scenario[]).map((key) => {
              const s = scenarios[key]
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl border ${
                    currentScenario === key 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      s.riskLevel === "High Likelihood" 
                        ? "bg-destructive/20" 
                        : s.riskLevel === "Moderate Likelihood"
                          ? "bg-accent/20"
                          : "bg-success/20"
                    }`}>
                      <span className="text-lg font-semibold text-foreground">{s.name[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{s.name}, {s.age}</h4>
                      <p className="text-sm text-primary">{s.type}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Probability Score</span>
                      <span className={`font-mono font-semibold ${
                        s.probability >= 0.8 ? "text-destructive" : s.probability >= 0.7 ? "text-accent" : "text-success"
                      }`}>
                        {s.probability}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Signals Fired</span>
                      <span className="font-mono text-foreground">
                        {s.signals.filter(sig => sig.fired).length} / {s.signals.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Product</span>
                      <span className="text-foreground">{s.product}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Entry Source</span>
                      <span className="text-foreground text-right">{s.entrySource}</span>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Passive</span>
                        <span className="font-mono text-foreground">{s.passiveTouchpoints}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Active</span>
                        <span className="font-mono text-foreground">{s.activeTouchpoints}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-semibold mt-2">
                        <span className="text-muted-foreground">Total Interventions</span>
                        <span className="font-mono text-primary">
                          {s.passiveTouchpoints + s.activeTouchpoints}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* About PRISM */}
        <div className="mt-16 p-8 rounded-xl border border-border bg-card">
          <h3 className="text-xl font-semibold text-foreground mb-4">About This Case Study</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PRISM (Post-Purchase Remorse Intervention and Signal Model) is a conceptual AI-driven system designed to identify and address buyer&apos;s remorse before it results in a return. By analyzing behavioral signals and delivering personalized interventions, PRISM helps buyers feel confident in their purchase decisions.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The system adapts its intervention intensity based on the buyer&apos;s risk profile. High-probability impulse buyers like Matt receive all 6 interventions across 3 windows, moderate-risk buyers like Sarah receive 4 interventions (3 passive + 1 active), while lower-risk buyers like Jenna receive only 2 light passive touchpoints - avoiding over-communication while still providing support.
          </p>
          <p className="text-sm text-muted-foreground">
            This interactive prototype demonstrates the buyer&apos;s journey and intervention points described in the full case study by Ramya Velchuri.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Case Study by Ramya Velchuri - Kellogg School of Management, Northwestern University (Class of 2026)
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.linkedin.com/in/ramya-velchuri/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/rsvelc/rv-product-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              GitHub
            </a>
            <a 
              href="mailto:ramyasree0299@gmail.com"
              className="text-sm text-primary hover:underline"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
