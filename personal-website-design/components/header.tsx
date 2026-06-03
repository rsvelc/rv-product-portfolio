"use client"

import { Button } from "@/components/ui/button"
import { Linkedin, Github, Mail } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <nav className="flex items-center justify-between py-4">
          <a href="/" className="italic text-[1.5rem]" style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, color: '#0F2D52' }}>
            Ramya Velchuri.
          </a>

          <div className="flex items-center gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/ramya-velchuri/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/rsvelc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&to=ramyasree0299@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email Ramya"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            <Button
              className="rounded-full px-5 py-2 font-medium text-white border-none hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0F2D52' }}
              asChild
            >
              <a href="https://github.com/rsvelc/rv-product-portfolio/raw/main/Resume/Ramya_Velchuri.docx" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
