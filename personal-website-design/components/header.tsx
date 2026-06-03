"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Linkedin, Github, Mail, Copy, Check, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function Header() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: "", value: "" })
  const [copied, setCopied] = useState(false)

  const openContactDialog = () => {
    setDialogContent({
      title: "Email",
      value: "ramyasree0299@gmail.com"
    })
    setCopied(false)
    setDialogOpen(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(dialogContent.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments where clipboard API is blocked
      const textArea = document.createElement("textarea")
      textArea.value = dialogContent.value
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Copy failed silently
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <>
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
                <button
                  onClick={() => openContactDialog()}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="View Email"
                >
                  <Mail className="w-5 h-5" />
                </button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-lg px-4 py-3">
                <span className="text-foreground font-medium">{dialogContent.value}</span>
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <a
              href={`mailto:${dialogContent.value}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Email Ramya
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
