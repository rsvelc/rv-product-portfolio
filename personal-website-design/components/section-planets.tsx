"use client"

type SectionPlanetsVariant = "domain" | "work" | "journey"

export function SectionPlanets({ variant }: { variant: SectionPlanetsVariant }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {variant === "domain" && (
        <>
          {/* Mercury - top right */}
          <div
            className="absolute sp-zoom-around"
            style={{ top: "6%", right: "3%", width: "26px", height: "26px" }}
          >
            <svg viewBox="0 0 26 26" className="w-full h-full">
              <circle cx="13" cy="13" r="11" fill="#B0B0B0" />
              <circle cx="13" cy="13" r="9" fill="#C8C8C8" />
              <circle cx="9" cy="10" r="2" fill="#9A9A9A" />
              <circle cx="16" cy="14" r="1.5" fill="#9A9A9A" />
              <circle cx="11" cy="17" r="1" fill="#9A9A9A" />
              <circle cx="10" cy="12" r="1.2" fill="#666" />
              <circle cx="16" cy="12" r="1.2" fill="#666" />
              <path d="M10 16 L16 16" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="2" y1="10" x2="5" y2="10" stroke="#9A9A9A" strokeWidth="1" opacity="0.6" />
              <line x1="1" y1="13" x2="4" y2="13" stroke="#9A9A9A" strokeWidth="1" opacity="0.6" />
              <line x1="2" y1="16" x2="5" y2="16" stroke="#9A9A9A" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>

          {/* Venus - bottom left */}
          <div
            className="absolute sp-twirl"
            style={{ bottom: "8%", left: "2%", width: "42px", height: "42px" }}
          >
            <svg viewBox="0 0 42 42" className="w-full h-full">
              <circle cx="21" cy="23" r="16" fill="#E8C547" />
              <circle cx="21" cy="23" r="13" fill="#F4D576" />
              <ellipse cx="16" cy="20" rx="4" ry="2" fill="#F9E8A8" opacity="0.7" />
              <ellipse cx="26" cy="26" rx="3" ry="1.5" fill="#F9E8A8" opacity="0.7" />
              <path d="M14 8 Q21 12 28 8 M21 12 L21 7" stroke="#FF69B4" strokeWidth="2" fill="none" />
              <circle cx="21" cy="7" r="2" fill="#FF69B4" />
              <circle cx="16" cy="21" r="1.5" fill="#C9A830" />
              <circle cx="26" cy="21" r="1.5" fill="#C9A830" />
              <path d="M16 28 Q21 32 26 28" stroke="#C9A830" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="13" cy="25" r="2" fill="#FFB6C1" opacity="0.5" />
              <circle cx="29" cy="25" r="2" fill="#FFB6C1" opacity="0.5" />
            </svg>
          </div>

          {/* Pluto - top left */}
          <div
            className="absolute sp-lonely-bounce"
            style={{ top: "12%", left: "5%", width: "24px", height: "24px" }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <circle cx="12" cy="12" r="9" fill="#C4A882" />
              <circle cx="12" cy="12" r="7.5" fill="#D4BC9A" />
              <path d="M8 9 Q8 7 10 7 Q11 7 11 8.5 Q11 7 12 7 Q14 7 14 9 Q14 11 11 13 Q8 11 8 9" fill="#E8D8C4" />
              <circle cx="9" cy="11" r="1" fill="#9A8060" />
              <circle cx="15" cy="11" r="1" fill="#9A8060" />
              <path d="M9 15 Q12 17 15 15" stroke="#9A8060" strokeWidth="1" fill="none" strokeLinecap="round" />
              <text x="18" y="6" fill="#FFD700" fontSize="6">*</text>
            </svg>
          </div>

          {/* Comet - middle right */}
          <div
            className="absolute sp-comet"
            style={{ top: "45%", right: "5%", width: "50px", height: "20px" }}
          >
            <svg viewBox="0 0 50 20" className="w-full h-full">
              <ellipse cx="20" cy="10" rx="18" ry="4" fill="url(#cometGrad1)" opacity="0.6" />
              <defs>
                <linearGradient id="cometGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#87CEEB" stopOpacity="0" />
                  <stop offset="100%" stopColor="#E0FFFF" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <circle cx="42" cy="10" r="6" fill="#E0FFFF" />
              <circle cx="42" cy="10" r="4.5" fill="#F0FFFF" />
              <circle cx="40" cy="9" r="0.8" fill="#87CEEB" />
              <circle cx="44" cy="9" r="0.8" fill="#87CEEB" />
              <ellipse cx="42" cy="12" rx="1.5" ry="1" fill="#87CEEB" />
            </svg>
          </div>
        </>
      )}

      {variant === "work" && (
        <>
          {/* Mars - top right */}
          <div
            className="absolute sp-bounce-tough"
            style={{ top: "8%", right: "4%", width: "38px", height: "38px" }}
          >
            <svg viewBox="0 0 38 38" className="w-full h-full">
              <circle cx="19" cy="19" r="15" fill="#CD5C5C" />
              <circle cx="19" cy="19" r="13" fill="#E07B7B" />
              <circle cx="14" cy="15" r="2.5" fill="#B84848" />
              <circle cx="24" cy="21" r="2" fill="#B84848" />
              <path d="M12 12 L26 12" stroke="#8B3A3A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="17" r="1.5" fill="#8B3A3A" />
              <circle cx="24" cy="17" r="1.5" fill="#8B3A3A" />
              <path d="M15 24 L23 24" stroke="#8B3A3A" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="32" cy="28" r="4" fill="#E07B7B" />
            </svg>
          </div>

          {/* Neptune - bottom left */}
          <div
            className="absolute sp-mysterious-float"
            style={{ bottom: "10%", left: "3%", width: "48px", height: "48px" }}
          >
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <circle cx="24" cy="24" r="20" fill="#4169E1" />
              <circle cx="24" cy="24" r="18" fill="#5B7FE8" />
              <ellipse cx="30" cy="26" rx="4" ry="2.5" fill="#3050B0" />
              <ellipse cx="24" cy="17" rx="14" ry="2.5" fill="#7B9FEF" opacity="0.4" />
              <ellipse cx="24" cy="32" rx="12" ry="2" fill="#7B9FEF" opacity="0.3" />
              <rect x="15" y="20" width="7" height="4" rx="1" fill="#1a1a1a" />
              <rect x="26" y="20" width="7" height="4" rx="1" fill="#1a1a1a" />
              <line x1="22" y1="22" x2="26" y2="22" stroke="#1a1a1a" strokeWidth="1.5" />
              <path d="M18 30 Q24 33 30 30" stroke="#2A4AAA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <line x1="40" y1="8" x2="40" y2="20" stroke="#87CEEB" strokeWidth="1.5" />
              <path d="M36 10 L40 8 L44 10" stroke="#87CEEB" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Asteroids - top left */}
          <div
            className="absolute sp-asteroid-spin"
            style={{ top: "15%", left: "2%", width: "30px", height: "30px" }}
          >
            <svg viewBox="0 0 30 30" className="w-full h-full">
              <ellipse cx="10" cy="12" rx="7" ry="6" fill="#8B7355" transform="rotate(-15 10 12)" />
              <circle cx="7" cy="10" r="1.5" fill="#6B5344" />
              <circle cx="12" cy="14" r="1" fill="#6B5344" />
              <ellipse cx="22" cy="20" rx="5" ry="4" fill="#9B8365" transform="rotate(20 22 20)" />
              <circle cx="20" cy="19" r="0.6" fill="#6B5344" />
              <circle cx="23" cy="21" r="0.6" fill="#6B5344" />
              <text x="14" y="16" fill="#FFD700" fontSize="5">*</text>
            </svg>
          </div>

          {/* Comet - mid left */}
          <div
            className="absolute sp-comet"
            style={{ top: "55%", left: "4%", width: "50px", height: "20px" }}
          >
            <svg viewBox="0 0 50 20" className="w-full h-full">
              <ellipse cx="20" cy="10" rx="18" ry="4" fill="url(#cometGrad2)" opacity="0.6" />
              <defs>
                <linearGradient id="cometGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#87CEEB" stopOpacity="0" />
                  <stop offset="100%" stopColor="#E0FFFF" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <circle cx="42" cy="10" r="6" fill="#E0FFFF" />
              <circle cx="42" cy="10" r="4.5" fill="#F0FFFF" />
              <circle cx="40" cy="9" r="0.8" fill="#87CEEB" />
              <circle cx="44" cy="9" r="0.8" fill="#87CEEB" />
              <ellipse cx="42" cy="12" rx="1.5" ry="1" fill="#87CEEB" />
            </svg>
          </div>
        </>
      )}

      {variant === "journey" && (
        <>
          {/* Jupiter - top left */}
          <div
            className="absolute sp-wobble"
            style={{ top: "5%", left: "1%", width: "60px", height: "60px" }}
          >
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <circle cx="30" cy="30" r="26" fill="#E4A857" />
              <circle cx="30" cy="30" r="24" fill="#F0BE6E" />
              <ellipse cx="30" cy="20" rx="22" ry="3.5" fill="#D4944A" opacity="0.6" />
              <ellipse cx="30" cy="30" rx="24" ry="3" fill="#D4944A" opacity="0.4" />
              <ellipse cx="30" cy="40" rx="20" ry="3.5" fill="#D4944A" opacity="0.5" />
              <ellipse cx="40" cy="33" rx="5" ry="3" fill="#C97B4A" />
              <circle cx="24" cy="28" r="2.5" fill="#B87D3D" />
              <circle cx="36" cy="28" r="2.5" fill="#B87D3D" />
              <path d="M22 38 Q30 44 38 38" stroke="#B87D3D" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="18" cy="34" r="3" fill="#E8A857" opacity="0.6" />
              <circle cx="42" cy="34" r="3" fill="#E8A857" opacity="0.6" />
            </svg>
          </div>

          {/* Saturn - top right */}
          <div
            className="absolute sp-ring-dance"
            style={{ top: "4%", right: "2%", width: "85px", height: "55px" }}
          >
            <svg viewBox="0 0 85 55" className="w-full h-full">
              <ellipse cx="42.5" cy="27.5" rx="40" ry="10" fill="none" stroke="#D4B896" strokeWidth="5" opacity="0.4" />
              <ellipse cx="42.5" cy="27.5" rx="36" ry="8" fill="none" stroke="#E8D4B8" strokeWidth="3" opacity="0.3" />
              <circle cx="42.5" cy="27.5" r="20" fill="#E8D4A8" />
              <circle cx="42.5" cy="27.5" r="18" fill="#F5E6C8" />
              <ellipse cx="42.5" cy="22" rx="16" ry="2.5" fill="#D4C4A0" opacity="0.5" />
              <ellipse cx="42.5" cy="32" rx="16" ry="2.5" fill="#D4C4A0" opacity="0.4" />
              <ellipse cx="42.5" cy="27.5" rx="40" ry="10" fill="none" stroke="#D4B896" strokeWidth="5" strokeDasharray="0 80 120" />
              <circle cx="37" cy="25" r="2" fill="#B8A070" />
              <circle cx="48" cy="25" r="2" fill="#B8A070" />
              <path d="M37 33 Q42.5 37 48 33" stroke="#B8A070" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M35 14 L38 18 L42.5 14 L47 18 L50 14" stroke="#FFD700" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Mars - bottom right */}
          <div
            className="absolute sp-bounce-tough"
            style={{ bottom: "6%", right: "8%", width: "38px", height: "38px" }}
          >
            <svg viewBox="0 0 38 38" className="w-full h-full">
              <circle cx="19" cy="19" r="15" fill="#CD5C5C" />
              <circle cx="19" cy="19" r="13" fill="#E07B7B" />
              <circle cx="14" cy="15" r="2.5" fill="#B84848" />
              <circle cx="24" cy="21" r="2" fill="#B84848" />
              <path d="M12 12 L26 12" stroke="#8B3A3A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="17" r="1.5" fill="#8B3A3A" />
              <circle cx="24" cy="17" r="1.5" fill="#8B3A3A" />
              <path d="M15 24 L23 24" stroke="#8B3A3A" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="32" cy="28" r="4" fill="#E07B7B" />
            </svg>
          </div>

          {/* Earth with Moon - bottom left */}
          <div
            className="absolute sp-gentle-float"
            style={{ bottom: "8%", left: "2%", width: "80px", height: "80px" }}
          >
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <circle cx="40" cy="40" r="24" fill="#4A90D9" />
              <circle cx="40" cy="40" r="22" fill="#5BA3E8" />
              <ellipse cx="34" cy="34" rx="7" ry="9" fill="#7BC47F" />
              <ellipse cx="48" cy="44" rx="5" ry="4" fill="#7BC47F" />
              <ellipse cx="32" cy="48" rx="4" ry="3" fill="#7BC47F" />
              <ellipse cx="44" cy="32" rx="5" ry="2" fill="white" opacity="0.6" />
              <ellipse cx="34" cy="52" rx="4" ry="1.5" fill="white" opacity="0.6" />
              <circle cx="34" cy="38" r="2.5" fill="#2D6BB0" />
              <circle cx="46" cy="38" r="2.5" fill="#2D6BB0" />
              <path d="M34 46 Q40 52 46 46" stroke="#2D6BB0" strokeWidth="2" fill="none" strokeLinecap="round" />
              <g className="sp-orbit-moon">
                <circle cx="68" cy="25" r="9" fill="#D4D4D4" />
                <circle cx="68" cy="25" r="7.5" fill="#E8E8E8" />
                <circle cx="65" cy="23" r="1.5" fill="#BEBEBE" />
                <circle cx="70" cy="27" r="1" fill="#BEBEBE" />
                <path d="M65 24 Q66 23 67 24" stroke="#A0A0A0" strokeWidth="1" fill="none" />
                <path d="M69 24 Q70 23 71 24" stroke="#A0A0A0" strokeWidth="1" fill="none" />
                <path d="M66 27 Q68 28 70 27" stroke="#A0A0A0" strokeWidth="1" fill="none" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes sp-zoom-around {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -5px) scale(1.1); }
          50% { transform: translate(0, -10px) scale(1); }
          75% { transform: translate(-10px, -5px) scale(1.1); }
        }
        @keyframes sp-twirl {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          25% { transform: rotate(5deg) translateY(-8px); }
          50% { transform: rotate(-5deg) translateY(0); }
          75% { transform: rotate(5deg) translateY(-8px); }
        }
        @keyframes sp-bounce-tough {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes sp-wobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes sp-ring-dance {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          25% { transform: rotate(2deg) translateY(-5px); }
          50% { transform: rotate(-2deg) translateY(0); }
          75% { transform: rotate(2deg) translateY(-5px); }
        }
        @keyframes sp-lazy-roll {
          0%, 100% { transform: rotate(85deg) translateY(0); }
          50% { transform: rotate(95deg) translateY(-5px); }
        }
        @keyframes sp-mysterious-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-12px) scale(1.02); opacity: 0.9; }
        }
        @keyframes sp-lonely-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-20px); }
          50% { transform: translateY(-5px); }
          70% { transform: translateY(-15px); }
        }
        @keyframes sp-comet {
          0% { transform: translateX(60px) translateY(30px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-60px) translateY(-30px); opacity: 0; }
        }
        @keyframes sp-asteroid-spin {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(10deg) translateY(-3px); }
          50% { transform: rotate(0deg) translateY(0); }
          75% { transform: rotate(-10deg) translateY(-3px); }
        }
        @keyframes sp-gentle-float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(-5px) translateX(-5px); }
        }
        @keyframes sp-orbit-moon {
          0% { transform: rotate(0deg) translateX(8px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(8px) rotate(-360deg); }
        }
        .sp-zoom-around { animation: sp-zoom-around 3s ease-in-out infinite; }
        .sp-twirl { animation: sp-twirl 4s ease-in-out infinite; }
        .sp-bounce-tough { animation: sp-bounce-tough 2s ease-in-out infinite; }
        .sp-wobble { animation: sp-wobble 3s ease-in-out infinite; }
        .sp-ring-dance { animation: sp-ring-dance 5s ease-in-out infinite; }
        .sp-lazy-roll { animation: sp-lazy-roll 8s ease-in-out infinite; }
        .sp-mysterious-float { animation: sp-mysterious-float 5s ease-in-out infinite; }
        .sp-lonely-bounce { animation: sp-lonely-bounce 4s ease-in-out infinite; }
        .sp-comet { animation: sp-comet 15s linear infinite; }
        .sp-asteroid-spin { animation: sp-asteroid-spin 3s ease-in-out infinite; }
        .sp-gentle-float { animation: sp-gentle-float 6s ease-in-out infinite; }
        .sp-orbit-moon {
          animation: sp-orbit-moon 15s linear infinite;
          transform-origin: -28px 15px;
        }
      `}</style>
    </div>
  )
}
