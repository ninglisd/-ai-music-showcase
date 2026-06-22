export default function Header() {
  return (
    <header className="relative pt-12 pb-8 px-6 text-center">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[260px] bg-gradient-to-b from-purple-500/[0.14] via-cyan-500/[0.06] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Geometric ring logo mark */}
        <div className="flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="opacity-70">
            <circle cx="16" cy="16" r="14" stroke="url(#qmLogo)" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="4" fill="url(#qmLogo)" opacity="0.3" />
            <line x1="16" y1="2" x2="16" y2="10" stroke="url(#qmLogo)" strokeWidth="1" />
            <line x1="16" y1="22" x2="16" y2="30" stroke="url(#qmLogo)" strokeWidth="1" />
            <line x1="2" y1="16" x2="10" y2="16" stroke="url(#qmLogo)" strokeWidth="1" />
            <line x1="22" y1="16" x2="30" y2="16" stroke="url(#qmLogo)" strokeWidth="1" />
            <defs>
              <linearGradient id="qmLogo" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#00C3FF" />
                <stop offset="50%" stopColor="#BF00FF" />
                <stop offset="100%" stopColor="#00F5D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* AUDIOVERSE — AUDIO white, VERSE gradient */}
        <h1
          className="font-bold uppercase select-none leading-none"
          style={{
            fontFamily: "'Space Grotesk', 'Syne', sans-serif",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            letterSpacing: "0.22em",
          }}
        >
          <span className="text-white">AUDIO</span>
          <span style={{
            background: "linear-gradient(90deg, #00C3FF 0%, #BF00FF 45%, #00F5D4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(191,0,255,0.25))",
          }}>VERSE</span>
        </h1>

        {/* 声之维度 */}
        <p
          className="mt-1 text-white/[0.30] tracking-[0.4em] text-xs font-medium"
          style={{ fontFamily: "'Space Grotesk', 'Syne', sans-serif" }}
        >
          声 之 维 度
        </p>

        {/* Tagline */}
        <p className="mt-5 text-white/[0.40] text-xs sm:text-sm max-w-lg mx-auto tracking-wide leading-relaxed">
          每一段旋律都由神经网络生成，跨越风格的边界，探索声音的无限维度
        </p>

        {/* AI POWERED — Pill Glassmorphism Badge */}
        <button
          className="inline-flex items-center gap-1.5 mt-5 px-4 py-1.5 rounded-full
                     bg-white/[0.06] backdrop-blur-xl
                     border border-[#00F5D4]/35
                     text-[10px] font-medium tracking-[0.2em] uppercase
                     text-[#00F5D4]/75
                     transition-all duration-700
                     hover:border-[#00F5D4]/70 hover:text-[#00F5D4]
                     animate-[breathe_3s_ease-in-out_infinite]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="w-1 h-1 rounded-full bg-[#00F5D4]/70" />
          AI Powered
        </button>
      </div>
    </header>
  )
}
