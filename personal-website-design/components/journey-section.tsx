"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Train } from "lucide-react"

interface MilestoneProps {
  period: string
  location: string
  description: string
  position: "top" | "bottom"
  tilt: "left" | "right"
  image: string
  imagePosition?: string
  isActive?: boolean
  index: number
}

function Milestone({ period, location, description, position, tilt, image, imagePosition = "object-cover", isActive, index }: MilestoneProps) {
  const tiltClass = tilt === "left" ? "-rotate-2" : "rotate-2"
  
  return (
    <div className="relative flex flex-col items-center min-w-[280px]" data-milestone={index}>
      {/* Polaroid Card */}
      <div 
        className={`
          ${position === "top" ? "order-1 mb-8" : "order-3 mt-8"}
          ${tiltClass}
          bg-white p-3 shadow-lg rounded-sm transition-all duration-500
          ${isActive ? "scale-110 shadow-xl ring-2 ring-primary" : "hover:scale-105"}
        `}
      >
        <div className="relative w-56 h-40 overflow-hidden mb-3">
          <Image
            src={image}
            alt={period}
            fill
            className={imagePosition}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-primary">{period}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>

      {/* Train Stop Node */}
      <div className={`order-2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md z-10 transition-all duration-300 ${isActive ? "scale-150 bg-accent" : ""}`} />

      {/* Description */}
      <div 
        className={`
          ${position === "top" ? "order-3 mt-4" : "order-1 mb-4"}
          max-w-[260px] text-center
        `}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

const milestones = [
  {
    period: "Early 2000s",
    location: "Pune, IN",
    description: "Watching shapes dance on a black console, written in C++ by my uncle. Since 6 years old, it felt like nothing less than magic. That magic never left.",
    position: "top" as const,
    tilt: "left" as const,
    image: "/childhood_picture.png",
    imagePosition: "object-cover object-center",
  },
  {
    period: "CSE Undergrad",
    location: "Hyderabad, IN",
    description: "For someone introduced to code before she could spell it, CSE was my natural next step.",
    position: "bottom" as const,
    tilt: "right" as const,
    image: "/undergrad.png",
    imagePosition: "object-cover object-center",
  },
  {
    period: "J.P. Morgan Chase & Co.",
    location: "Hyderabad, IN",
    description: "Cracked one of the hardest interviews to work in Consumer Banking, high-stakes space where a single product decision could affect millions of people's financial lives.",
    position: "top" as const,
    tilt: "left" as const,
    image: "/jpmorgan_chase.png",
    imagePosition: "object-cover object-top",
  },
  {
    period: "CodeForGood",
    location: "2021",
    description: "What started as a small side project to digitize a non-profit's operations ended up helping locate ten malnourished children who had been out of reach. Technology wasn't the solution — it was the bridge to one.",
    position: "bottom" as const,
    tilt: "right" as const,
    image: "/codeforgood.png",
    imagePosition: "object-cover object-top",
  },
  {
    period: "Kellogg School of Management",
    location: "Evanston, IL",
    description: "5 years in banking taught me how to build for scale. Kellogg was about learning to build for everyone else — different industries, different customers, different problems entirely.",
    position: "top" as const,
    tilt: "left" as const,
    image: "/northwestern_kellogg.jpeg",
    imagePosition: "object-cover object-center",
  },
  {
    period: "Amazon",
    location: "Seattle, WA",
    description: "#customerobsessed. One of the best places to stress-test how technical depth and business thinking can work as one. Shaped how I think about building at scale.",
    position: "bottom" as const,
    tilt: "right" as const,
    image: "/amazon_intern.jpg",
    imagePosition: "object-cover object-center",
  },
]

export function JourneySection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [trainPosition, setTrainPosition] = useState(0)

  const startJourneyAnimation = useCallback(() => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setActiveIndex(0)
    setTrainPosition(0)

    const milestoneElements = scrollRef.current?.querySelectorAll('[data-milestone]')
    if (!milestoneElements || milestoneElements.length === 0) return

    let currentIndex = 0
    
    const animateToNextStop = () => {
      if (currentIndex >= milestones.length) {
        setIsAnimating(false)
        setActiveIndex(-1)
        return
      }

      setActiveIndex(currentIndex)
      
      // Calculate train position based on milestone index
      const containerWidth = scrollRef.current?.scrollWidth || 0
      const milestoneWidth = containerWidth / milestones.length
      const newTrainPosition = currentIndex * milestoneWidth + milestoneWidth / 2
      setTrainPosition(newTrainPosition)

      // Scroll to the current milestone
      const milestone = milestoneElements[currentIndex] as HTMLElement
      if (milestone && scrollRef.current) {
        const scrollLeft = milestone.offsetLeft - scrollRef.current.offsetWidth / 2 + milestone.offsetWidth / 2
        scrollRef.current.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        })
      }

      currentIndex++
      setTimeout(animateToNextStop, 3000) // 3 second pause at each stop
    }

    animateToNextStop()
  }, [isAnimating])

  // Listen for hash change to trigger animation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#journey') {
        setTimeout(startJourneyAnimation, 500)
      }
    }

    // Check initial hash
    if (window.location.hash === '#journey') {
      setTimeout(startJourneyAnimation, 500)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [startJourneyAnimation])

  return (
    <section id="journey" className="pt-8 pb-24" style={{ backgroundColor: '#E8F0F9' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-medium text-primary mb-4">
            How I got here
          </h2>
          <p className="text-muted-foreground">The stops that shaped how I think</p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollRef}
            className="overflow-x-auto pb-8 scrollbar-hide"
          >
            <div className="flex items-center min-w-max px-8 relative">
              {/* Train Track Line */}
              <div className="absolute left-0 right-0 h-1 bg-primary/20 top-1/2 -translate-y-1/2">
                {/* Track details */}
                <div className="absolute inset-0 flex items-center justify-around">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-2 h-3 bg-primary/30 rounded-sm" />
                  ))}
                </div>
              </div>

              {/* Animated Train */}
              {isAnimating && (
                <div 
                  className="absolute z-20 transition-all duration-1000 ease-in-out top-1/2 -translate-y-1/2"
                  style={{ left: `${trainPosition}px`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="bg-primary text-primary-foreground rounded-lg p-2 shadow-lg animate-bounce">
                    <Train className="w-6 h-6" />
                  </div>
                </div>
              )}

              {/* Milestones */}
              <div className="flex gap-12 relative z-10 py-8">
                {milestones.map((milestone, index) => (
                  <Milestone 
                    key={index} 
                    {...milestone} 
                    isActive={activeIndex === index}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="flex justify-center mt-4">
            <p className="text-xs text-muted-foreground">
              {isAnimating ? "Enjoy the ride..." : "Scroll to explore →"}
            </p>
          </div>
        </div>

        {/* Epilogue Section */}
        <div className="mt-24 pt-12 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl lg:text-3xl font-medium text-primary mb-6">
              What&apos;s next
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              I wasn&apos;t born during the internet revolution, but I feel lucky to be watching AI 
              fundamentally change how we build. For the first time, the barrier between an idea 
              and its execution is almost nothing — which means the real work is finally just 
              thinking clearly about the right problems.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
