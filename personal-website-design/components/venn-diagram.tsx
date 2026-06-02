import Image from "next/image"

export function VennDiagram() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">How I think</p>
        <h2 className="font-serif text-2xl lg:text-3xl font-medium text-primary">
          Where every problem starts
        </h2>
      </div>

      {/* Venn Diagram Container */}
      <div className="relative w-full" style={{ height: '420px' }}>
        {/* Business Circle (top center) */}
        <div 
          className="absolute w-52 h-52 rounded-full bg-accent/40 flex items-start justify-center pt-8"
          style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="text-center">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground">Business</span>
            <span className="block font-serif text-primary font-medium text-base mt-1">Why should<br />it be built?</span>
          </div>
        </div>

        {/* Technology Circle (bottom-left) */}
        <div 
          className="absolute w-52 h-52 rounded-full bg-primary/80 flex items-center justify-start pl-6"
          style={{ bottom: '0', left: '0' }}
        >
          <div className="text-left">
            <span className="block text-xs uppercase tracking-wider text-primary-foreground/70">Technology</span>
            <span className="block font-serif text-primary-foreground font-medium text-base mt-1">What can<br />be built?</span>
          </div>
        </div>

        {/* Arts Circle (bottom-right) */}
        <div 
          className="absolute w-52 h-52 rounded-full bg-secondary border border-border flex items-center justify-end pr-6"
          style={{ bottom: '0', right: '0' }}
        >
          <div className="text-right">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground">Arts</span>
            <span className="block font-serif text-primary font-medium text-base mt-1">How should<br />it feel?</span>
          </div>
        </div>

        {/* Profile Photo in Center */}
        <div 
          className="absolute z-10 flex flex-col items-center"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -40%)' }}
        >
          <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-background shadow-xl">
            <Image
              src="/profile.png"
              alt="Ramya Velchuri"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <p className="font-serif italic text-[11px] text-primary mt-2 font-light">
            How I solve problems
          </p>
        </div>
      </div>

      {/* Stats below diagram */}
      <div className="flex justify-center gap-16 mt-10">
        <div className="text-center">
          <div className="font-serif text-3xl font-semibold text-primary">5+</div>
          <div className="text-xs text-muted-foreground">Years experience</div>
        </div>
        <div className="text-center">
          <div className="font-serif text-3xl font-semibold text-primary">100M+</div>
          <div className="text-xs text-muted-foreground">Users impacted</div>
        </div>
      </div>
    </div>
  )
}
