"use client"

import { Linkedin, Eye, Cloud, CreditCard, Shield } from "lucide-react"
import { SectionPlanets } from "@/components/section-planets"

interface DomainCard {
  lane: string
  icon: React.ReactNode
  title: string
  description: string
  skills: string[]
  gradient: string
}

const domainCards: DomainCard[] = [
  {
    lane: "LANE 01",
    icon: <Eye className="w-5 h-5" />,
    title: "Observability",
    description: "Owned the vision and roadmap for an in-house observability platform unifying metrics, logs, and traces into a single AI-powered experience, enabling proactive incident detection across 5,000+ consumer banking applications. Leveraged OpenTelemetry to standardize telemetry collection across legacy and modern systems.",
    skills: ["OpenTelemetry", "Prometheus", "Grafana", "Jaeger", "Splunk", "Datadog", "Dynatrace", "Elastic", "Distributed tracing", "TSDB", "APM", "SLO/SLA", "SRE", "Microservice Architecture", "Anomaly detection", "SLO-based alerting"],
    gradient: "linear-gradient(135deg, #0F2D52 0%, #1A4A7A 100%)",
  },
  {
    lane: "LANE 02",
    icon: <Cloud className="w-5 h-5" />,
    title: "Cloud Infrastructure (AWS)",
    description: "Curiosity about cloud infrastructure led me to pursue AWS Solutions Architect and CKAD certifications, while gaining hands-on experience with Docker and Cloud Foundry. That interest eventually led me to take ownership of an enterprise AWS migration initiative, where I drove early cloud adoption by designing optimization strategies, API integration playbooks, disaster recovery plans, and chaos engineering frameworks.",
    skills: ["AWS (EC2, EKS, S3, CloudWatch, Lambda, IAM)", "Kubernetes", "CKAD", "AWS Solutions Architect", "Terraform", "Docker", "Cloud Foundry", "Chaos engineering", "DR planning", "CI/CD", "Cloud-Native Application Patterns", "Platform Engineering", "FinOps", "DevOps", "IaaS", "SaaS"],
    gradient: "linear-gradient(135deg, #1A4A7A 0%, #1E5799 100%)",
  },
  {
    lane: "LANE 03",
    icon: <CreditCard className="w-5 h-5" />,
    title: "Payments",
    description: "Rising payment failures and fraud across SMB merchant accounts highlighted a broader challenge: balancing security with a seamless payment experience. As part of the strategy team, I helped design an RSA-based authorization workflow for bulk payments and worked across payment infrastructure roadmaps to improve system reliability at scale.",
    skills: ["RSA authorization", "Bulk payments", "Merchant infrastructure", "Payment reliability", "High-volume pipelines", "Agile", "RESTful APIs", "Spring Boot", "Java", "BDD"],
    gradient: "linear-gradient(135deg, #1E5799 0%, #2563A8 100%)",
  },
  {
    lane: "LANE 04",
    icon: <Shield className="w-5 h-5" />,
    title: "Risk, Compliance & Governance",
    description: "While analyzing application logs, I discovered sensitive customer information being exposed through internal logging systems. What started as a monitoring issue quickly revealed a broader compliance and regulatory risk. I took ownership of the problem end-to-end, designing a data masking platform that prevented PII leakage across JPMC systems before it became a regulatory incident.",
    skills: ["PII detection", "Data masking", "GDPR/CCPA", "Logging governance", "Risk standards", "Data leak prevention", "Compliance-first design", "High-volume data pipelines", "Kafka", "NLP", "Python", "SQL", "ReactJS"],
    gradient: "linear-gradient(135deg, #2563A8 0%, #3A7DC9 100%)",
  },
]

const lookingForwardQuestions = [
  "At what point does an agent become worth the added complexity?",
  "Are evals enough, or are we missing something?",
  "What breaks first when you put agents into highly regulated environments?",
  "If traditional observability helps us understand execution, what helps us understand reasoning (decision observability)?",
]

function DomainCardComponent({ card }: { card: DomainCard }) {
  return (
    <div 
      className="rounded-[18px] p-6 flex flex-col h-full min-h-[420px]"
      style={{ background: card.gradient }}
    >
      {/* Top Row: Icon + Lane + Skill Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-white/80">
            {card.icon}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">
            {card.lane}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/15 text-white/80 font-medium">
          {card.skills.length} skills
        </span>
      </div>
      
      {/* Title */}
      <h3 className="font-serif text-2xl font-medium text-white mb-3">
        {card.title}
      </h3>
      
      {/* Description */}
      <p 
        className="text-white/70 mb-6"
        style={{ 
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.82rem',
          lineHeight: 1.65
        }}
      >
        {card.description}
      </p>
      
      {/* Skills - Always Visible */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {card.skills.map((skill) => (
          <span
            key={skill}
            className="text-[11px] px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export function DomainExpertiseSection() {
  return (
    <section id="background" className="py-24 relative" style={{ backgroundColor: '#E4EDF7' }}>
      <SectionPlanets variant="domain" />
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
            background
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-medium text-primary">
            Where I&apos;ve built
          </h2>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {domainCards.map((card) => (
            <DomainCardComponent key={card.lane} card={card} />
          ))}
        </div>

        {/* Looking Forward Card */}
        <div className="bg-white rounded-[18px] border border-[rgba(15,45,82,0.10)] shadow-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex-1 p-8 lg:p-10">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Looking Forward
              </span>
              <h3 className="font-serif text-2xl font-medium text-primary mb-4">
                Questions I&apos;m chasing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
                With the rapid adoption of AI, I&apos;m thinking about what changes if the infrastructure I touched was replaced by autonomous workflows. These are the questions I don&apos;t have answers to yet.
              </p>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {lookingForwardQuestions.map((question, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>{question}</p>
                  </div>
                ))}
              </div>

              {/* Upskilling */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
                <span className="font-medium">Upskilling:</span>
                <span>Agentic Workflows, LLMOps and Evals</span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px bg-border" />

            {/* Right CTA */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-10 lg:w-80 border-t lg:border-t-0 border-border">
              <p className="font-serif italic text-sm text-muted-foreground text-center mb-4">
                I&apos;m always curious about insightful conversations on this.
              </p>
              <a
                href="https://www.linkedin.com/in/ramya-velchuri/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors mb-4"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-sm font-medium">Let&apos;s connect</span>
              </a>
              <div className="flex flex-col gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-3 mt-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>Available for Work</span>
                </div>
                <p className="text-xs text-green-800 leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
                  Open to product roles at the intersection of AI, infrastructure, and enterprise software. If you think there&apos;s a fit, I&apos;d love to connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 mt-24">
        <div className="border-t border-border" />
      </div>
    </section>
  )
}
