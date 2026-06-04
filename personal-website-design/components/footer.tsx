"use client"

import { useState, useEffect } from "react"
import { Linkedin, Github, Mail, FileText, Bug } from "lucide-react"

export function Footer() {
  const [isMac, setIsMac] = useState(false)
  const [showEmailTooltip, setShowEmailTooltip] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  return (
    <footer id="whats-next" className="py-16" style={{ backgroundColor: '#DFE9F5' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center">
          {/* Main tagline with chai icon */}
          <p className="text-xl lg:text-2xl font-sans font-bold text-primary mb-8 flex items-center justify-center gap-2">
            Built with curiosity, iteration, and a dangerous amount of caffeine.
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 text-primary"
              fill="currentColor"
            >
              <path d="M2 21v-2h18v2H2zm2-4v-3q0-1.525.713-2.863T6.7 8.7q.875-.475 1.838-.712T10.5 7.7V6q-.825 0-1.412-.587T8.5 4V3h7v1q0 .825-.587 1.413T13.5 6v1.7q.975.05 1.938.288T17.3 8.7q1.275.6 1.988 1.938T20 13.5v3H4zm2-2h12v-1.5q0-1.125-.55-2.062T16 10.05q-.725-.35-1.512-.55T13 9.2V7h-2v2.2q-.7.05-1.487.25T8 10.05q-.9.45-1.45 1.388T6 13.5V15zm12.5-6q.625 0 1.063-.437T20 7.5V4h-3v1h2v2.5q0 .625.438 1.063T20.5 9zM10 15z"/>
            </svg>
          </p>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <a
                href="mailto:ramyasree0299@gmail.com"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                aria-label="Email"
                onMouseEnter={() => setShowEmailTooltip(true)}
                onMouseLeave={() => setShowEmailTooltip(false)}
              >
                <Mail className="w-5 h-5" />
              </a>
              {showEmailTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded whitespace-nowrap">
                  {isMac ? '⌘C' : 'Ctrl+C'}
                </div>
              )}
            </div>
            <a
              href="https://www.linkedin.com/in/ramya-velchuri/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/rsvelc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/rsvelc/rv-product-portfolio/raw/main/Resume/Ramya_Velchuri.docx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              aria-label="Resume"
            >
              <FileText className="w-5 h-5" />
            </a>
          </div>

          {/* Report a Bug */}
          <div className="mb-4">
            <a
              href="https://github.com/rsvelc/rv-product-portfolio/issues/new?title=Bug+Report&body=Describe+the+bug+here"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-4 py-1.5"
            >
              <Bug className="w-3 h-3" />
              Report a bug
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2026 Ramya Velchuri. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
