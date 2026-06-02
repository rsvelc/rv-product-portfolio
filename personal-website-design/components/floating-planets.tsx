"use client"

export function FloatingPlanets() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sun - Top Left corner, happy and warm */}
      <div 
        className="absolute animate-spin-slow"
        style={{ top: '3%', left: '1%', width: '65px', height: '65px' }}
      >
        <svg viewBox="0 0 65 65" className="w-full h-full">
          <circle cx="32.5" cy="32.5" r="22" fill="#FFD93D" />
          <circle cx="32.5" cy="32.5" r="18" fill="#FFE66D" />
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="32.5"
              y1="32.5"
              x2={32.5 + 30 * Math.cos((angle * Math.PI) / 180)}
              y2={32.5 + 30 * Math.sin((angle * Math.PI) / 180)}
              stroke="#FFD93D"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
          {/* Cute winking face */}
          <circle cx="26" cy="29" r="2.5" fill="#E8A838" />
          <path d="M36 27 Q39 29 36 31" stroke="#E8A838" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M24 37 Q32.5 43 41 37" stroke="#E8A838" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <circle cx="22" cy="34" r="3" fill="#FFB347" opacity="0.5" />
          <circle cx="43" cy="34" r="3" fill="#FFB347" opacity="0.5" />
        </svg>
      </div>

      {/* Mercury - Tiny speedy boi */}
      <div 
        className="absolute animate-zoom-around"
        style={{ top: '18%', right: '8%', width: '26px', height: '26px' }}
      >
        <svg viewBox="0 0 26 26" className="w-full h-full">
          <circle cx="13" cy="13" r="11" fill="#B0B0B0" />
          <circle cx="13" cy="13" r="9" fill="#C8C8C8" />
          {/* Craters */}
          <circle cx="9" cy="10" r="2" fill="#9A9A9A" />
          <circle cx="16" cy="14" r="1.5" fill="#9A9A9A" />
          <circle cx="11" cy="17" r="1" fill="#9A9A9A" />
          {/* Speedy expression - determined face */}
          <circle cx="10" cy="12" r="1.2" fill="#666" />
          <circle cx="16" cy="12" r="1.2" fill="#666" />
          <path d="M10 16 L16 16" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
          {/* Speed lines */}
          <line x1="2" y1="10" x2="5" y2="10" stroke="#9A9A9A" strokeWidth="1" opacity="0.6" />
          <line x1="1" y1="13" x2="4" y2="13" stroke="#9A9A9A" strokeWidth="1" opacity="0.6" />
          <line x1="2" y1="16" x2="5" y2="16" stroke="#9A9A9A" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* Venus - Fancy with bow */}
      <div 
        className="absolute animate-twirl"
        style={{ top: '40%', left: '2%', width: '42px', height: '42px' }}
      >
        <svg viewBox="0 0 42 42" className="w-full h-full">
          <circle cx="21" cy="23" r="16" fill="#E8C547" />
          <circle cx="21" cy="23" r="13" fill="#F4D576" />
          {/* Cloud swirls */}
          <ellipse cx="16" cy="20" rx="4" ry="2" fill="#F9E8A8" opacity="0.7" />
          <ellipse cx="26" cy="26" rx="3" ry="1.5" fill="#F9E8A8" opacity="0.7" />
          {/* Cute bow on top */}
          <path d="M14 8 Q21 12 28 8 M21 12 L21 7" stroke="#FF69B4" strokeWidth="2" fill="none" />
          <circle cx="21" cy="7" r="2" fill="#FF69B4" />
          {/* Blushing face */}
          <circle cx="16" cy="21" r="1.5" fill="#C9A830" />
          <circle cx="26" cy="21" r="1.5" fill="#C9A830" />
          <path d="M16 28 Q21 32 26 28" stroke="#C9A830" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Blush */}
          <circle cx="13" cy="25" r="2" fill="#FFB6C1" opacity="0.5" />
          <circle cx="29" cy="25" r="2" fill="#FFB6C1" opacity="0.5" />
        </svg>
      </div>

      {/* Earth with Moon orbiting - Happy home planet */}
      <div 
        className="absolute animate-gentle-float"
        style={{ top: '8%', right: '2%', width: '80px', height: '80px' }}
      >
        <svg viewBox="0 0 80 80" className="w-full h-full">
          {/* Earth */}
          <circle cx="40" cy="40" r="24" fill="#4A90D9" />
          <circle cx="40" cy="40" r="22" fill="#5BA3E8" />
          {/* Continents */}
          <ellipse cx="34" cy="34" rx="7" ry="9" fill="#7BC47F" />
          <ellipse cx="48" cy="44" rx="5" ry="4" fill="#7BC47F" />
          <ellipse cx="32" cy="48" rx="4" ry="3" fill="#7BC47F" />
          {/* Clouds */}
          <ellipse cx="44" cy="32" rx="5" ry="2" fill="white" opacity="0.6" />
          <ellipse cx="34" cy="52" rx="4" ry="1.5" fill="white" opacity="0.6" />
          {/* Happy face */}
          <circle cx="34" cy="38" r="2.5" fill="#2D6BB0" />
          <circle cx="46" cy="38" r="2.5" fill="#2D6BB0" />
          <path d="M34 46 Q40 52 46 46" stroke="#2D6BB0" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Moon orbiting around */}
          <g className="animate-orbit-moon">
            <circle cx="68" cy="25" r="9" fill="#D4D4D4" />
            <circle cx="68" cy="25" r="7.5" fill="#E8E8E8" />
            <circle cx="65" cy="23" r="1.5" fill="#BEBEBE" />
            <circle cx="70" cy="27" r="1" fill="#BEBEBE" />
            {/* Moon sleepy face */}
            <path d="M65 24 Q66 23 67 24" stroke="#A0A0A0" strokeWidth="1" fill="none" />
            <path d="M69 24 Q70 23 71 24" stroke="#A0A0A0" strokeWidth="1" fill="none" />
            <path d="M66 27 Q68 28 70 27" stroke="#A0A0A0" strokeWidth="1" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Mars - Tough little guy */}
      <div 
        className="absolute animate-bounce-tough"
        style={{ top: '60%', right: '4%', width: '38px', height: '38px' }}
      >
        <svg viewBox="0 0 38 38" className="w-full h-full">
          <circle cx="19" cy="19" r="15" fill="#CD5C5C" />
          <circle cx="19" cy="19" r="13" fill="#E07B7B" />
          {/* Surface features */}
          <circle cx="14" cy="15" r="2.5" fill="#B84848" />
          <circle cx="24" cy="21" r="2" fill="#B84848" />
          {/* Tough face with bandana hint */}
          <path d="M12 12 L26 12" stroke="#8B3A3A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="14" cy="17" r="1.5" fill="#8B3A3A" />
          <circle cx="24" cy="17" r="1.5" fill="#8B3A3A" />
          <path d="M15 24 L23 24" stroke="#8B3A3A" strokeWidth="1.5" strokeLinecap="round" />
          {/* Little fist */}
          <circle cx="32" cy="28" r="4" fill="#E07B7B" />
        </svg>
      </div>

      {/* Jupiter - Big friendly giant */}
      <div 
        className="absolute animate-wobble"
        style={{ top: '75%', left: '1%', width: '60px', height: '60px' }}
      >
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <circle cx="30" cy="30" r="26" fill="#E4A857" />
          <circle cx="30" cy="30" r="24" fill="#F0BE6E" />
          {/* Jupiter bands */}
          <ellipse cx="30" cy="20" rx="22" ry="3.5" fill="#D4944A" opacity="0.6" />
          <ellipse cx="30" cy="30" rx="24" ry="3" fill="#D4944A" opacity="0.4" />
          <ellipse cx="30" cy="40" rx="20" ry="3.5" fill="#D4944A" opacity="0.5" />
          {/* Great Red Spot - like a cute freckle */}
          <ellipse cx="40" cy="33" rx="5" ry="3" fill="#C97B4A" />
          {/* Gentle giant face */}
          <circle cx="24" cy="28" r="2.5" fill="#B87D3D" />
          <circle cx="36" cy="28" r="2.5" fill="#B87D3D" />
          <path d="M22 38 Q30 44 38 38" stroke="#B87D3D" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Rosy spots */}
          <circle cx="18" cy="34" r="3" fill="#E8A857" opacity="0.6" />
          <circle cx="42" cy="34" r="3" fill="#E8A857" opacity="0.6" />
        </svg>
      </div>

      {/* Saturn - Elegant ring dancer */}
      <div 
        className="absolute animate-ring-dance"
        style={{ top: '28%', right: '1%', width: '85px', height: '55px' }}
      >
        <svg viewBox="0 0 85 55" className="w-full h-full">
          {/* Back ring */}
          <ellipse cx="42.5" cy="27.5" rx="40" ry="10" fill="none" stroke="#D4B896" strokeWidth="5" opacity="0.4" />
          <ellipse cx="42.5" cy="27.5" rx="36" ry="8" fill="none" stroke="#E8D4B8" strokeWidth="3" opacity="0.3" />
          {/* Planet */}
          <circle cx="42.5" cy="27.5" r="20" fill="#E8D4A8" />
          <circle cx="42.5" cy="27.5" r="18" fill="#F5E6C8" />
          {/* Saturn bands */}
          <ellipse cx="42.5" cy="22" rx="16" ry="2.5" fill="#D4C4A0" opacity="0.5" />
          <ellipse cx="42.5" cy="32" rx="16" ry="2.5" fill="#D4C4A0" opacity="0.4" />
          {/* Front ring */}
          <ellipse cx="42.5" cy="27.5" rx="40" ry="10" fill="none" stroke="#D4B896" strokeWidth="5" strokeDasharray="0 80 120" />
          {/* Graceful face */}
          <circle cx="37" cy="25" r="2" fill="#B8A070" />
          <circle cx="48" cy="25" r="2" fill="#B8A070" />
          <path d="M37 33 Q42.5 37 48 33" stroke="#B8A070" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Crown hint */}
          <path d="M35 14 L38 18 L42.5 14 L47 18 L50 14" stroke="#FFD700" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Uranus - Tilted sleepy planet */}
      <div 
        className="absolute animate-lazy-roll"
        style={{ top: '85%', right: '15%', width: '45px', height: '45px' }}
      >
        <svg viewBox="0 0 45 45" className="w-full h-full">
          <circle cx="22.5" cy="22.5" r="18" fill="#7DD3D3" />
          <circle cx="22.5" cy="22.5" r="16" fill="#9DE8E8" />
          {/* Vertical ring (Uranus is tilted!) */}
          <ellipse cx="22.5" cy="22.5" rx="3" ry="22" fill="none" stroke="#B8F0F0" strokeWidth="2.5" opacity="0.5" />
          {/* Sleepy face - lying on side */}
          <path d="M16 19 Q18 17 20 19" stroke="#4AABAB" strokeWidth="1.5" fill="none" />
          <path d="M25 19 Q27 17 29 19" stroke="#4AABAB" strokeWidth="1.5" fill="none" />
          <ellipse cx="22.5" cy="27" rx="4" ry="2" fill="#4AABAB" opacity="0.4" />
          {/* Zzz */}
          <text x="32" y="15" fill="#4AABAB" fontSize="6" fontWeight="bold">z</text>
          <text x="36" y="12" fill="#4AABAB" fontSize="5" fontWeight="bold">z</text>
        </svg>
      </div>

      {/* Neptune - Cool mysterious dude */}
      <div 
        className="absolute animate-mysterious-float"
        style={{ top: '50%', left: '4%', width: '48px', height: '48px' }}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <circle cx="24" cy="24" r="20" fill="#4169E1" />
          <circle cx="24" cy="24" r="18" fill="#5B7FE8" />
          {/* Storm spot */}
          <ellipse cx="30" cy="26" rx="4" ry="2.5" fill="#3050B0" />
          {/* Cloud bands */}
          <ellipse cx="24" cy="17" rx="14" ry="2.5" fill="#7B9FEF" opacity="0.4" />
          <ellipse cx="24" cy="32" rx="12" ry="2" fill="#7B9FEF" opacity="0.3" />
          {/* Cool sunglasses face */}
          <rect x="15" y="20" width="7" height="4" rx="1" fill="#1a1a1a" />
          <rect x="26" y="20" width="7" height="4" rx="1" fill="#1a1a1a" />
          <line x1="22" y1="22" x2="26" y2="22" stroke="#1a1a1a" strokeWidth="1.5" />
          <path d="M18 30 Q24 33 30 30" stroke="#2A4AAA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Trident hint */}
          <line x1="40" y1="8" x2="40" y2="20" stroke="#87CEEB" strokeWidth="1.5" />
          <path d="M36 10 L40 8 L44 10" stroke="#87CEEB" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Pluto - Tiny sad but loved */}
      <div 
        className="absolute animate-lonely-bounce"
        style={{ top: '22%', left: '6%', width: '24px', height: '24px' }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="9" fill="#C4A882" />
          <circle cx="12" cy="12" r="7.5" fill="#D4BC9A" />
          {/* Heart shape (like real Pluto!) */}
          <path d="M8 9 Q8 7 10 7 Q11 7 11 8.5 Q11 7 12 7 Q14 7 14 9 Q14 11 11 13 Q8 11 8 9" fill="#E8D8C4" />
          {/* Hopeful face */}
          <circle cx="9" cy="11" r="1" fill="#9A8060" />
          <circle cx="15" cy="11" r="1" fill="#9A8060" />
          <path d="M9 15 Q12 17 15 15" stroke="#9A8060" strokeWidth="1" fill="none" strokeLinecap="round" />
          {/* Little sparkle - still a planet to us */}
          <text x="18" y="6" fill="#FFD700" fontSize="6">*</text>
        </svg>
      </div>

      {/* Comet - Occasional visitor */}
      <div 
        className="absolute animate-comet"
        style={{ top: '35%', right: '12%', width: '50px', height: '20px' }}
      >
        <svg viewBox="0 0 50 20" className="w-full h-full">
          {/* Tail */}
          <ellipse cx="20" cy="10" rx="18" ry="4" fill="url(#cometGradient)" opacity="0.6" />
          <defs>
            <linearGradient id="cometGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#87CEEB" stopOpacity="0" />
              <stop offset="100%" stopColor="#E0FFFF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* Head */}
          <circle cx="42" cy="10" r="6" fill="#E0FFFF" />
          <circle cx="42" cy="10" r="4.5" fill="#F0FFFF" />
          {/* Excited face */}
          <circle cx="40" cy="9" r="0.8" fill="#87CEEB" />
          <circle cx="44" cy="9" r="0.8" fill="#87CEEB" />
          <ellipse cx="42" cy="12" rx="1.5" ry="1" fill="#87CEEB" />
        </svg>
      </div>

      {/* Asteroid friends - two buddies */}
      <div 
        className="absolute animate-asteroid-spin"
        style={{ top: '68%', right: '8%', width: '30px', height: '30px' }}
      >
        <svg viewBox="0 0 30 30" className="w-full h-full">
          {/* Asteroid 1 */}
          <ellipse cx="10" cy="12" rx="7" ry="6" fill="#8B7355" transform="rotate(-15 10 12)" />
          <circle cx="7" cy="10" r="1.5" fill="#6B5344" />
          <circle cx="12" cy="14" r="1" fill="#6B5344" />
          <circle cx="8" cy="11" r="0.8" fill="#5B4334" />
          <circle cx="11" cy="11" r="0.8" fill="#5B4334" />
          {/* Asteroid 2 - bumping into 1 */}
          <ellipse cx="22" cy="20" rx="5" ry="4" fill="#9B8365" transform="rotate(20 22 20)" />
          <circle cx="20" cy="19" r="0.6" fill="#6B5344" />
          <circle cx="23" cy="21" r="0.6" fill="#6B5344" />
          {/* Impact stars */}
          <text x="14" y="16" fill="#FFD700" fontSize="5">*</text>
        </svg>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes zoom-around {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -5px) scale(1.1); }
          50% { transform: translate(0, -10px) scale(1); }
          75% { transform: translate(-10px, -5px) scale(1.1); }
        }
        @keyframes twirl {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          25% { transform: rotate(5deg) translateY(-8px); }
          50% { transform: rotate(-5deg) translateY(0); }
          75% { transform: rotate(5deg) translateY(-8px); }
        }
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(-5px) translateX(-5px); }
        }
        @keyframes orbit-moon {
          0% { transform: rotate(0deg) translateX(8px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(8px) rotate(-360deg); }
        }
        @keyframes bounce-tough {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes ring-dance {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          25% { transform: rotate(2deg) translateY(-5px); }
          50% { transform: rotate(-2deg) translateY(0); }
          75% { transform: rotate(2deg) translateY(-5px); }
        }
        @keyframes lazy-roll {
          0%, 100% { transform: rotate(85deg) translateY(0); }
          50% { transform: rotate(95deg) translateY(-5px); }
        }
        @keyframes mysterious-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-12px) scale(1.02); opacity: 0.9; }
        }
        @keyframes lonely-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-20px); }
          50% { transform: translateY(-5px); }
          70% { transform: translateY(-15px); }
        }
        @keyframes comet {
          0% { transform: translateX(100px) translateY(50px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-100px) translateY(-50px); opacity: 0; }
        }
        @keyframes asteroid-spin {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(10deg) translateY(-3px); }
          50% { transform: rotate(0deg) translateY(0); }
          75% { transform: rotate(-10deg) translateY(-3px); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-zoom-around {
          animation: zoom-around 3s ease-in-out infinite;
        }
        .animate-twirl {
          animation: twirl 4s ease-in-out infinite;
        }
        .animate-gentle-float {
          animation: gentle-float 6s ease-in-out infinite;
        }
        .animate-orbit-moon {
          animation: orbit-moon 15s linear infinite;
          transform-origin: -28px 15px;
        }
        .animate-bounce-tough {
          animation: bounce-tough 2s ease-in-out infinite;
        }
        .animate-wobble {
          animation: wobble 3s ease-in-out infinite;
        }
        .animate-ring-dance {
          animation: ring-dance 5s ease-in-out infinite;
        }
        .animate-lazy-roll {
          animation: lazy-roll 8s ease-in-out infinite;
        }
        .animate-mysterious-float {
          animation: mysterious-float 5s ease-in-out infinite;
        }
        .animate-lonely-bounce {
          animation: lonely-bounce 4s ease-in-out infinite;
        }
        .animate-comet {
          animation: comet 20s linear infinite;
        }
        .animate-asteroid-spin {
          animation: asteroid-spin 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
