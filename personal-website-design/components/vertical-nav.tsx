"use client"

import { useState, useEffect } from "react"

const sections = [
  { id: "home", label: "Landing" },
  { id: "journey", label: "How did I get here" },
  { id: "work", label: "What I am building" },
  { id: "background", label: "Where I've built" },
  { id: "footer", label: "What's next" },
]

export function VerticalNav() {
  const [activeSection, setActiveSection] = useState("home")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4">
      {/* Vertical Line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-px h-full bg-[#0F2D52]/20" />
      </div>

      {sections.map((section) => {
        const isActive = activeSection === section.id
        const isHovered = hoveredSection === section.id

        return (
          <div key={section.id} className="relative">
            {/* Tooltip */}
            {isHovered && (
              <div 
                className="absolute right-8 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium bg-[#0F2D52] text-white rounded whitespace-nowrap"
                style={{ boxShadow: '0 2px 8px rgba(15, 45, 82, 0.15)' }}
              >
                {section.label}
              </div>
            )}

            {/* Dot */}
            <button
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              className={`
                relative z-10 rounded-full transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'w-3.5 h-3.5 bg-[#0F2D52]' 
                  : 'w-2.5 h-2.5 border-2 border-[#0F2D52]/40 bg-transparent hover:border-[#0F2D52]/70'
                }
              `}
              aria-label={`Go to ${section.label}`}
            />
          </div>
        )
      })}
    </nav>
  )
}
