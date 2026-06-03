import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const tags = [
  "Empathy before technology",
  "Astronomy buff",
  "Proud daughter of a single mother",
]

export function HeroContent() {
  return (
    <div className="flex flex-col justify-center max-w-xl">
      <span className="text-lg text-muted-foreground mb-2">Hey there,</span>
      
      <h1 className="text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
        <span className="italic">{"I'm "}</span>
        <span className="text-primary font-medium italic">Ramya</span>
        <br />
        <span className="text-primary font-medium">Velchuri.</span>
      </h1>
      
      <p className="text-lg text-foreground leading-relaxed mb-6">
        Just a Product-minded, outcome-oriented human with an MBA from Kellogg, a Bachelor&apos;s in Computer Science, who pours heart into the arts. Trained singer, recently turned into a theatre kid.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <Badge 
            key={tag} 
            variant="outline" 
            className="rounded-full px-3 py-1 text-xs font-normal border-border text-muted-foreground bg-card"
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Button 
          className="rounded-full px-5 py-5 bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href="#background">Background</Link>
        </Button>
        <Button 
          className="rounded-full px-5 py-5 bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href="#work">Work</Link>
        </Button>
        <Button 
          className="rounded-full px-5 py-5 bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href="#journey">Journey</Link>
        </Button>
        <Button 
          className="rounded-full px-5 py-5 bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <a href="https://github.com/rsvelc/rv-product-portfolio/raw/main/Resume/Ramya_Velchuri.docx" target="_blank" rel="noopener noreferrer">Resume</a>
        </Button>
      </div>
    </div>
  )
}
