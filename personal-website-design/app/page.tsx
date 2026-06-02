import { Header } from "@/components/header"
import { HeroContent } from "@/components/hero-content"
import { VennDiagram } from "@/components/venn-diagram"
import { DomainExpertiseSection } from "@/components/domain-expertise-section"
import { WorkSection } from "@/components/work-section"
import { JourneySection } from "@/components/journey-section"
import { Footer } from "@/components/footer"
import { FloatingPlanets } from "@/components/floating-planets"
import { VerticalNav } from "@/components/vertical-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating Planets Background */}
      <FloatingPlanets />
      
      {/* Vertical Navigation */}
      <VerticalNav />
      
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="pt-24 pb-16 mx-auto max-w-7xl px-6 lg:px-12" style={{ backgroundColor: '#EEF4FB' }}>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-[calc(100vh-8rem)]">
            <div className="flex-1 w-full lg:w-auto">
              <HeroContent />
            </div>
            
            <div className="flex-1 w-full lg:w-auto">
              <VennDiagram />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-6 lg:px-12" style={{ backgroundColor: '#EEF4FB' }}>
          <div className="border-t border-border" />
        </div>

        {/* Domain Expertise Section - Where I've built */}
        <DomainExpertiseSection />

        {/* Work Section - What I am building */}
        <WorkSection />

        {/* Journey Section - How did I get here */}
        <JourneySection />
      </main>

      {/* Footer - What's next */}
      <Footer />
    </div>
  )
}
