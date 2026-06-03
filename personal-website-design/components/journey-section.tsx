"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { SectionPlanets } from "@/components/section-planets"

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
          ${position === "top" ? "order-1 mb-16" : "order-3 mt-16"}
          ${tiltClass}
          bg-white p-3 shadow-lg rounded-sm transition-all duration-500
          ${isActive ? "scale-125 shadow-2xl ring-2 ring-primary z-20 relative" : "hover:scale-105"}
        `}
      >
        <div className="relative w-56 h-40 overflow-hidden mb-3">
          <Image src={image} alt={period} fill className={imagePosition} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-primary">{period}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>

      {/* Stop Node */}
      <div className={`order-2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md z-10 transition-all duration-300 ${isActive ? "scale-150 bg-accent" : ""}`} />

      {/* Description */}
      <div className={`${position === "top" ? "order-3 mt-6" : "order-1 mb-6"} max-w-[260px] text-center`}>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// Horizontal rocket SVG — nose points right by default, rotates with direction
function RocketSVG({ angle, landing }: { angle: number; landing?: boolean }) {
  return (
    <svg
      width="64"
      height="28"
      viewBox="0 0 64 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
    >
      {/* Body */}
      <ellipse cx="30" cy="14" rx="22" ry="9" fill="#0F2D52" />
      {/* Nose */}
      <path d="M52 14 L64 11 L64 17 Z" fill="#93C5FD" />
      {/* Window */}
      <circle cx="34" cy="14" r="5" fill="white" opacity="0.9" />
      <circle cx="34" cy="14" r="3.5" fill="#60A5FA" />
      <circle cx="33" cy="12.5" r="1" fill="white" opacity="0.6" />
      {/* Top fin */}
      <path d="M10 8 L2 1 L16 8 Z" fill="#1E5799" />
      {/* Bottom fin */}
      <path d="M10 20 L2 27 L16 20 Z" fill="#1E5799" />
      {/* Flame outer */}
      <ellipse cx="7" cy="14" rx={landing ? 10 : 7} ry={landing ? 7 : 5} fill="#FCD34D" opacity="0.95" />
      {/* Flame mid */}
      <ellipse cx="5" cy="14" rx={landing ? 7 : 5} ry={landing ? 5 : 3.5} fill="#F97316" opacity="0.9" />
      {/* Flame inner */}
      <ellipse cx="3" cy="14" rx={landing ? 4 : 3} ry={landing ? 3.5 : 2} fill="white" opacity="0.7" />
      {/* Cute face */}
      <circle cx="38" cy="12" r="1" fill="#0F2D52" />
      <circle cx="38" cy="16" r="1" fill="#0F2D52" />
      <path d="M35 14 Q36 15.5 37.5 14" stroke="#0F2D52" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Standalone looping rocket for "What's next" — flies around the full section
function WhatsNextRocket() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 200, y: 60 })
  const [angle, setAngle] = useState(0)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  const rafRef = useRef<number | null>(null)
  const idRef = useRef(0)
  const startRef = useRef(performance.now())
  const prevRef = useRef({ x: 200, y: 60 })

  useEffect(() => {
    const animate = (now: number) => {
      const t = (now - startRef.current) / 1000
      const w = containerRef.current?.offsetWidth || 600
      const h = containerRef.current?.offsetHeight || 120

      // Lissajous figure — flies all around the section
      const cx = w / 2
      const cy = h / 2
      const rx = w * 0.42
      const ry = h * 0.38

      const x = cx + Math.sin(t * 0.5) * rx
      const y = cy + Math.sin(t * 0.9 + 1) * ry

      const dx = x - prevRef.current.x
      const dy = y - prevRef.current.y
      const a = Math.atan2(dy, dx) * (180 / Math.PI)
      prevRef.current = { x, y }

      setPos({ x, y })
      setAngle(a)
      setTrail(prev => [...prev, { x, y, id: idRef.current++ }].slice(-22))
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {trail.map((dot, i) => (
        <div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: dot.x, top: dot.y,
            width: `${2 + (i / trail.length) * 3}px`,
            height: `${2 + (i / trail.length) * 3}px`,
            backgroundColor: `hsl(215, 15%, ${60 + (i / trail.length) * 15}%)`,
            opacity: (i / trail.length) * 0.45,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <div className="absolute" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}>
        <RocketSVG angle={angle} />
      </div>
    </div>
  )
}

const milestones = [
  {
    period: "Early 2000s",
    location: "Pune, IN",
    description: "Watching shapes dance on a black console, written in C++ by my uncle. At 6 years old, it felt like nothing less than magic. That curiosity never left.",
    position: "top" as const,
    tilt: "left" as const,
    image: "/childhood_picture.png",
    imagePosition: "object-cover object-center",
  },
  {
    period: "CSE Undergrad",
    location: "Hyderabad, IN",
    description: "For someone who was introduced to code before she could spell it, studying Computer Science felt like the natural next step.",
    position: "bottom" as const,
    tilt: "right" as const,
    image: "/undergrad.png",
    imagePosition: "object-cover object-center",
  },
  {
    period: "J.P. Morgan Chase & Co.",
    location: "Hyderabad, IN",
    description: "Consumer banking taught me what it means to build in high-stakes environments, where a single product decision can affect millions of people's financial lives.",
    position: "top" as const,
    tilt: "left" as const,
    image: "/jpmorgan_chase.png",
    imagePosition: "object-cover object-top",
  },
  {
    period: "CodeForGood",
    location: "2021",
    description: "What started as a small side project to digitize a non-profit's operations ended up helping locate ten malnourished children who had been out of reach. It was the moment I realized technology isn't the solution itself - it's an enabler of one.",
    position: "bottom" as const,
    tilt: "right" as const,
    image: "/codeforgood.png",
    imagePosition: "object-cover object-top",
  },
  {
    period: "Kellogg School of Management",
    location: "Evanston, IL",
    description: "With that realisation, I came to Kellogg. 5 years in banking taught me how to build for scale. Kellogg taught me how different industries solve problems, how customer needs vary across contexts, and what it means to operate in a truly global market.",
    position: "top" as const,
    tilt: "left" as const,
    image: "/northwestern_kellogg.jpeg",
    imagePosition: "object-cover object-center",
  },
  {
    period: "Amazon",
    location: "Seattle, WA",
    description: "One of the best places to see technical depth and business thinking operate as one. It reshaped how I think about customers, scale, and execution. #CustomerObsessed",
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
  const [rocketPos, setRocketPos] = useState({ x: 0, y: 0 })
  const [rocketAngle, setRocketAngle] = useState(0)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number; size: number }[]>([])
  const rafRef = useRef<number | null>(null)
  const trailIdRef = useRef(0)
  const prevPosRef = useRef({ x: 0, y: 0 })

  // Get the top-left corner of a polaroid relative to the rocket coordinate system
  const getPolaroidCorner = useCallback((index: number) => {
    if (!scrollRef.current) return { x: 0, y: 0 }
    const milestoneEls = scrollRef.current.querySelectorAll('[data-milestone]')
    const el = milestoneEls[index] as HTMLElement
    if (!el) return { x: 0, y: 0 }
    const polaroid = el.querySelector('.bg-white') as HTMLElement
    if (!polaroid) return { x: el.offsetLeft, y: 0 }
    const containerRect = scrollRef.current.getBoundingClientRect()
    const polaroidRect = polaroid.getBoundingClientRect()
    const scrollLeft = scrollRef.current.scrollLeft
    const centerY = containerRect.height / 2
    return {
      x: polaroidRect.left - containerRect.left + scrollLeft + 12, // top-left with small inset
      y: polaroidRect.top - containerRect.top - centerY + 12,
    }
  }, [])

  const landRocket = useCallback((cornerX: number, cornerY: number, fromAngle: number, onDone: () => void) => {
    const aboveY = cornerY - 90 // hover point above corner

    // Phase 1: Approach — fly to directly above the corner (600ms)
    const approachDuration = 600
    const approachStart = performance.now()
    const startPos = { ...prevPosRef.current }

    const approach = (now: number) => {
      const t = Math.min((now - approachStart) / approachDuration, 1)
      const eased = 1 - Math.pow(1 - t, 2)
      const x = startPos.x + (cornerX - startPos.x) * eased
      const y = startPos.y + (aboveY - startPos.y) * eased
      const dx = x - prevPosRef.current.x
      const dy = y - prevPosRef.current.y
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        setRocketAngle(Math.atan2(dy, dx) * (180 / Math.PI))
      }
      prevPosRef.current = { x, y }
      setRocketPos({ x, y })

      if (t < 1) {
        rafRef.current = requestAnimationFrame(approach)
      } else {
        // Phase 2: Rotate CCW from current angle → -90° (nose up), 800ms
        const rotateDuration = 800
        const rotateStart = performance.now()
        const startAngle = Math.atan2(
          aboveY - startPos.y, cornerX - startPos.x
        ) * (180 / Math.PI)

        const rotate = (now: number) => {
          const t2 = Math.min((now - rotateStart) / rotateDuration, 1)
          // Ease in-out
          const eased2 = t2 < 0.5 ? 2 * t2 * t2 : -1 + (4 - 2 * t2) * t2
          setRocketAngle(startAngle + (-90 - startAngle) * eased2)
          setRocketPos({ x: cornerX, y: aboveY })

          if (t2 < 1) {
            rafRef.current = requestAnimationFrame(rotate)
          } else {
            // Phase 3: Descend slowly nose-up onto corner (1000ms)
            const descendDuration = 1000
            const descendStart = performance.now()

            const descend = (now: number) => {
              const t3 = Math.min((now - descendStart) / descendDuration, 1)
              // Ease out cubic — slows right at touchdown
              const eased3 = 1 - Math.pow(1 - t3, 3)
              // Tiny wobble fading out
              const wobble = Math.sin(t3 * Math.PI * 4) * 3 * (1 - t3)
              setRocketPos({ x: cornerX + wobble, y: aboveY + (cornerY - aboveY) * eased3 })
              setRocketAngle(-90 + wobble * 0.4)

              if (t3 < 1) {
                rafRef.current = requestAnimationFrame(descend)
              } else {
                setRocketAngle(-90)
                setTrail([])
                onDone()
              }
            }
            rafRef.current = requestAnimationFrame(descend)
          }
        }
        rafRef.current = requestAnimationFrame(rotate)
      }
    }
    rafRef.current = requestAnimationFrame(approach)
  }, [])

  const animateRocketTo = useCallback((
    fromX: number, fromY: number,
    toX: number, toY: number,
    onDone: () => void
  ) => {
    const duration = 2200
    const start = performance.now()
    const amplitude = 60
    const waves = 2.5

    prevPosRef.current = { x: fromX, y: fromY }

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      const x = fromX + (toX - fromX) * eased
      const wave = Math.sin(t * Math.PI * waves) * amplitude * (1 - t * 0.8)
      const y = fromY + (toY - fromY) * eased + wave

      // Track angle from velocity
      const dx = x - prevPosRef.current.x
      const dy = y - prevPosRef.current.y
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        setRocketAngle(Math.atan2(dy, dx) * (180 / Math.PI))
      }
      prevPosRef.current = { x, y }

      setRocketPos({ x, y })
      setTrail(prev => {
        const size = 3 + Math.random() * 4
        return [...prev, { x, y, id: trailIdRef.current++, size }].slice(-30)
      })

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        const finalAngle = Math.atan2(
          y - (fromY + (toY - fromY) * 0.99),
          x - (fromX + (toX - fromX) * 0.99)
        ) * (180 / Math.PI)
        landRocket(toX, toY, finalAngle, onDone)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [landRocket])

  const startJourneyAnimation = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)

    const milestoneElements = scrollRef.current?.querySelectorAll('[data-milestone]')
    if (!milestoneElements || milestoneElements.length === 0) return

    let currentIndex = 0

    const goToNext = () => {
      if (currentIndex >= milestones.length) {
        setIsAnimating(false)
        setActiveIndex(-1)
        return
      }

      setActiveIndex(currentIndex)

      const target = getPolaroidCorner(currentIndex)
      const prev = currentIndex === 0
        ? { x: target.x - 300, y: 0 }
        : getPolaroidCorner(currentIndex - 1)

      // Scroll to milestone
      const el = milestoneElements[currentIndex] as HTMLElement
      if (el && scrollRef.current) {
        const scrollLeft = el.offsetLeft - scrollRef.current.offsetWidth / 2 + el.offsetWidth / 2
        scrollRef.current.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
      }

      animateRocketTo(prev.x, prev.y, target.x, target.y, () => {
        currentIndex++
        setTimeout(goToNext, 3000)
      })
    }

    goToNext()
  }, [isAnimating, animateRocketTo, getPolaroidCorner])

  // Trigger when section scrolls into view
  useEffect(() => {
    const section = document.getElementById('journey')
    if (!section) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(startJourneyAnimation, 500)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [startJourneyAnimation])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <section id="journey" className="pt-8 pb-24 relative" style={{ backgroundColor: '#E8F0F9' }}>
      <SectionPlanets variant="journey" />
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-medium text-primary mb-4">
            How I got here
          </h2>
          <p className="text-muted-foreground">The stops that shaped how I think</p>
        </div>

        <div className="relative">
          <div ref={scrollRef} className="overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex items-center min-w-max px-8 relative">

              {/* Track */}
              <div className="absolute left-0 right-0 h-1 bg-primary/20 top-1/2 -translate-y-1/2">
                <div className="absolute inset-0 flex items-center justify-around">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="w-2 h-3 bg-primary/30 rounded-sm" />
                  ))}
                </div>
              </div>

              {/* Grey debris trail */}
              {isAnimating && trail.map((dot, i) => (
                <div
                  key={dot.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: dot.x,
                    top: `calc(50% + ${dot.y}px)`,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    backgroundColor: `hsl(215, 15%, ${55 + (i / trail.length) * 20}%)`,
                    opacity: (i / trail.length) * 0.55,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}

              {/* Rocket */}
              {isAnimating && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: rocketPos.x,
                    top: `calc(50% + ${rocketPos.y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <RocketSVG angle={rocketAngle} landing={rocketAngle < -45} />
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

          <div className="flex justify-center mt-4">
            <p className="text-xs text-muted-foreground">
              {isAnimating ? "🚀 Houston, we have a journey..." : "Scroll to explore →"}
            </p>
          </div>
        </div>

        {/* Epilogue */}
        <div className="mt-24 pt-12 border-t border-border relative">
          <WhatsNextRocket />
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl lg:text-3xl font-medium text-primary mb-6">
              What&apos;s next
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              I wasn&apos;t born during the Internet revolution, but I feel lucky to witness the AI
              revolution in this lifetime. The 6-year-old who fell in love with technology would
              never have believed that ideas could move this fast. For the first time, the barrier
              between an idea and its execution is almost nothing. The real work is thinking clearly
              about the problems worth solving.
              <br /><br />
              As the next chapter begins, that&apos;s exactly where I&apos;m focusing my energy: asking better
              questions, building intentionally, and staying curious about what technology can make possible.
              <br /><br />
              In a world where technology can do almost anything, our greatest responsibility is ensuring
              it does something that actually matters to people. Let&apos;s get to work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
