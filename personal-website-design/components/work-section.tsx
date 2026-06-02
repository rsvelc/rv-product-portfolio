"use client"

import { ExternalLink } from "lucide-react"
import { SectionPlanets } from "@/components/section-planets"

interface WorkItem {
  title: string
  meta: string
  linkText: string
  linkUrl: string
  description: string
  note?: string
  downloadUrl?: string
  tags: string[]
  isLinkedIn?: boolean
  linkedInEmbed?: string
}

interface Category {
  id: string
  dotColor: string
  title: string
  subtitle: string
  items: WorkItem[]
}

const categories: Category[] = [
  {
    id: "case-study",
    dotColor: "#0F2D52",
    title: "Case Study",
    subtitle: "Independent work · Product proposal (PRFAQ style)",
    items: [
      {
        title: "PRISM — Post-Purchase Remorse Intervention and Signal Model",
        meta: "E-commerce · AI/LLM · Behavioral design",
        linkText: "View prototype →",
        linkUrl: "https://v0-prism-rsvelc-prototype.vercel.app/",
        description: "We're in an era where buying something takes 30 seconds and returning it takes two clicks. Platforms have spent years optimizing for conversion, but very little attention has been paid to what happens after a buyer clicks \"Buy Now.\" till order delivery. This case study explores whether platforms can identify moments of post-purchase doubt and help buyers feel confident in their decisions before a return is ever initiated.",
        note: "Sign-in to Vercel may be required to access the prototype.",
        downloadUrl: "https://github.com/rsvelc/rv-product-portfolio/raw/main/prism/PRISM-rsvelc-casestudy.pdf",
        tags: ["Post-purchase", "LLM agents", "Behavioral signals", "PRFAQ", "E-commerce"],
      },
    ],
  },
  {
    id: "vibe-coding",
    dotColor: "#1E5799",
    title: "Vibe Coding",
    subtitle: "Built for myself · Personal productivity",
    items: [
      {
        title: "Aria — Adaptive Reminder & Intelligence Assistant",
        meta: "Productivity · ADHD · Outcome-oriented focus",
        linkText: "View on GitHub →",
        linkUrl: "https://github.com/rsvelc/rv-product-portfolio/tree/main/aria",
        description: "I have ADHD. For years, I tried every productivity system I could find and failed most of them. Over time, I realised the issue wasn't consistency or discipline. The way I naturally think didn't match the way these tools were designed. Most productivity tools begin with task-oriented lists, while I begin with outcome-oriented lists. I think in goals, context, and momentum. For example, I don't wake up thinking, \"I need to send three emails.\" I wake up thinking, \"I need to make progress on recruiting.\" The emails are just one way to get there. So instead of searching for the right tool, I built one.",
        tags: ["Vibe coding", "ADHD", "Productivity", "Built for myself"],
      },
    ],
  },
  {
    id: "thought-leadership",
    dotColor: "#3A7DC9",
    title: "Thought Leadership",
    subtitle: "Writing · LinkedIn",
    items: [
      {
        title: "Ramya Velchuri on LinkedIn",
        meta: "",
        linkText: "View all posts →",
        linkUrl: "https://www.linkedin.com/in/ramya-velchuri/recent-activity/all/",
        description: "",
        tags: [],
        isLinkedIn: true,
        linkedInEmbed: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7462291380615294976?collapsed=1",
      },
    ],
  },
]

function WorkCard({ category }: { category: Category }) {
  const item = category.items[0]
  
  if (item.isLinkedIn) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col h-full">
        {/* Header with dot */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.dotColor }}
          />
          <div>
            <h3 className="text-lg font-medium text-foreground">{category.title}</h3>
            <p className="text-xs text-muted-foreground">{category.subtitle}</p>
          </div>
        </div>

        {/* Embedded LinkedIn Post */}
        <div className="flex-1 flex flex-col">
          <a 
            href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7462291380615294976"
            target="_blank"
            rel="noopener noreferrer"
            className="block flex-1"
          >
            <iframe 
              src={item.linkedInEmbed}
              height="400"
              width="100%"
              frameBorder="0"
              allowFullScreen
              title="Embedded LinkedIn post"
              className="rounded-lg pointer-events-none"
            />
          </a>
        </div>

        {/* Link at bottom */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {item.linkText}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col h-full">
      {/* Header with dot */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.dotColor }}
        />
        <div>
          <h3 className="text-lg font-medium text-foreground">{category.title}</h3>
          <p className="text-xs text-muted-foreground">{category.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-base font-medium text-foreground mb-1">{item.title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{item.meta}</p>
        <p className="text-sm text-foreground leading-relaxed mb-4">{item.description}</p>
        
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-accent/50 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Link and note at bottom */}
      <div className="mt-auto pt-4 border-t border-border/50">
        <a
          href={item.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1 mb-2"
        >
          {item.linkText}
          <ExternalLink className="w-3 h-3" />
        </a>
        {item.downloadUrl && (
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1 mb-2"
          >
            Download Case Study →
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {item.note && (
          <p className="text-xs text-muted-foreground italic">{item.note}</p>
        )}
      </div>
    </div>
  )
}

export function WorkSection() {
  return (
    <section id="work" className="py-24 relative" style={{ backgroundColor: '#EEF4FB' }}>
      <SectionPlanets variant="work" />
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
            portfolio
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-medium text-primary">
            What am I building
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <WorkCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 mt-24">
        <div className="border-t border-border" />
      </div>
    </section>
  )
}
