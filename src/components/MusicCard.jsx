import { usePlayer } from "../context/PlayerContext"

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

/* ── Per-song generative art preset ── */
function getArtStyle(song) {
  const map = {
    "时之圆": "bloom",       // flowing flower-like particle sculpture
    "破阵子": "charge",       // rotating charged polyhedron energy field
    "寻他": "terrain",        // granular red light streams
    "你在千里之外": "warmth",  // warm flowing gradients
  }
  return map[song.title] || "default"
}

function CoverArt({ song }) {
  const style = getArtStyle(song)
  const c = song.color

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#050508" }}>
      {/* Base ambient glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse at 50% 40%, ${c}30 0%, transparent 70%)` }}
      />

      {/* ── BLOOM: 时之圆 — flowing flower particle sculpture ── */}
      {style === "bloom" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-purple-400/15"
                style={{
                  width: `${60 + i * 28}%`,
                  height: `${60 + i * 28}%`,
                  animation: `particleFloat ${3 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  transform: `rotate(${i * 30}deg)`,
                }}
              />
            ))}
          </div>
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`p${i}`}
              className="absolute w-1 h-1 rounded-full bg-purple-300/40"
              style={{
                left: `${10 + Math.sin(i * 1.7) * 40 + 40}%`,
                top: `${10 + Math.cos(i * 2.1) * 40 + 40}%`,
                animation: `particleFloat ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </>
      )}

      {/* ── CHARGE: 破阵子 — rotating polyhedron energy field ── */}
      {style === "charge" && (
        <>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%]"
            style={{
              background: `conic-gradient(from 0deg, ${c}10, ${c}30 90deg, transparent 180deg, ${c}20 270deg, ${c}10 360deg)`,
              animation: "spin 6s linear infinite",
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%]"
            style={{
              background: `conic-gradient(from 180deg, transparent, ${c}20 180deg, transparent 360deg)`,
              animation: "spin 4s linear infinite reverse",
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          />
          {/* Energy arcs */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/10"
              style={{
                width: `${80 + i * 30}%`,
                height: `${80 + i * 30}%`,
                animation: `spin ${8 + i * 2}s linear infinite`,
                clipPath: i === 1 ? "polygon(30% 0, 70% 0, 70% 100%, 30% 100%)" : undefined,
              }}
            />
          ))}
        </>
      )}

      {/* ── TERRAIN: 寻他 — granular red light stream terrain ── */}
      {style === "terrain" && (
        <>
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 120px 80px at 30% 50%, ${c}60 0%, transparent 70%),
              radial-gradient(ellipse 80px 120px at 65% 35%, ${c}40 0%, transparent 60%),
              radial-gradient(ellipse 100px 60px at 50% 70%, ${c}50 0%, transparent 65%)
            `,
            animation: "nebulaDrift 12s ease-in-out infinite alternate",
          }} />
          {/* Granular noise texture overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20% 30%, ${c}80 50%, transparent),
              radial-gradient(1px 1px at 40% 60%, ${c}60 50%, transparent),
              radial-gradient(1px 1px at 60% 25%, ${c}90 50%, transparent),
              radial-gradient(1px 1px at 75% 55%, ${c}70 50%, transparent),
              radial-gradient(1px 1px at 30% 75%, ${c}80 50%, transparent),
              radial-gradient(1px 1px at 55% 45%, ${c}60 50%, transparent),
              radial-gradient(1px 1px at 70% 70%, ${c}90 50%, transparent),
              radial-gradient(1px 1px at 15% 50%, ${c}50 50%, transparent),
              radial-gradient(1px 1px at 50% 15%, ${c}70 50%, transparent),
              radial-gradient(1px 1px at 85% 40%, ${c}80 50%, transparent),
              radial-gradient(1px 2px at 25% 45%, #fff 30%, transparent),
              radial-gradient(1px 2px at 45% 55%, #fff 25%, transparent),
              radial-gradient(1px 2px at 65% 35%, #fff 30%, transparent),
              radial-gradient(1px 2px at 35% 65%, #fff 20%, transparent),
              radial-gradient(1px 2px at 55% 75%, #fff 25%, transparent)
            `,
            backgroundSize: "100% 100%",
          }} />
          {/* Flowing light strips */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-[1px] opacity-30"
              style={{
                left: 0, right: 0,
                top: `${20 + i * 14}%`,
                background: `linear-gradient(90deg, transparent, ${c}80, ${c}40, transparent)`,
                animation: `particleFloat ${3 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </>
      )}

      {/* ── WARMTH: 你在千里之外 — warm flowing gradients ── */}
      {style === "warmth" && (
        <>
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 40% 30%, ${c}30 0%, transparent 50%),
              radial-gradient(circle at 60% 60%, #f59e0b20 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, ${c}15 0%, transparent 60%)
            `,
          }} />
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-sm"
              style={{
                width: `${4 + Math.sin(i) * 6}px`,
                height: `${4 + Math.cos(i) * 6}px`,
                left: `${15 + (i / 12) * 70}%`,
                top: `${20 + Math.sin(i * 2.5) * 30 + 30}%`,
                background: i % 3 === 0 ? `${c}60` : i % 3 === 1 ? "#fbbf2470" : "#f9731630",
                animation: `particleFloat ${2.5 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </>
      )}

      {/* ── DEFAULT: other songs — ambient particle ring ── */}
      {style === "default" && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full"
            style={{ background: `radial-gradient(circle, ${c}25 0%, transparent 60%)`, animation: "particleFloat 5s ease-in-out infinite" }}
          />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full"
              style={{
                left: `${50 + Math.cos(i * Math.PI / 4) * 35}%`,
                top: `${50 + Math.sin(i * Math.PI / 4) * 35}%`,
                background: c,
                opacity: 0.5,
                animation: `particleFloat ${2 + i * 0.3}s ease-in-out infinite`,
              }}
            />
          ))}
        </>
      )}

      {/* Vignette overlay — lighter to show more art */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,8,16,0.35) 100%)",
      }} />
    </div>
  )
}

export default function MusicCard({ song, index }) {
  const { openFullscreen, currentIndex, isPlaying } = usePlayer()
  const active = currentIndex === index && isPlaying

  return (
    <div
      onClick={() => openFullscreen(index)}
      className="group relative rounded-2xl overflow-hidden
                 bg-[rgba(255,255,255,0.05)] backdrop-blur-sm
                 border border-white/[0.08] hover:border-white/[0.16]
                 transition-all duration-700 ease-out
                 hover:-translate-y-1
                 hover:shadow-2xl hover:shadow-purple-500/[0.12]
                 cursor-pointer"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Cover */}
      <div className="relative aspect-square overflow-hidden">
        <CoverArt song={song} />

        {/* AI tag */}
        <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-medium tracking-wider uppercase rounded-full
                         bg-black/50 backdrop-blur-sm border border-white/[0.12] text-white/40">
          AI
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2
                        opacity-0 group-hover:opacity-100 transition-all duration-500
                        bg-black/30 backdrop-blur-[2px]">
          <div className="w-14 h-14 rounded-full
                          bg-white/[0.10] backdrop-blur-xl
                          border border-white/[0.18]
                          flex items-center justify-center
                          shadow-lg shadow-black/30
                          group-hover:scale-110 transition-transform duration-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-0.5 opacity-90">
              <polygon points="6,2 20,12 6,22" />
            </svg>
          </div>
          <span className="text-[11px] text-white/50 tracking-widest font-medium"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PLAY
          </span>
        </div>

        {/* Now Playing indicator */}
        {active && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full
                          bg-purple-500/25 backdrop-blur-md border border-purple-400/25">
            <span className="flex gap-[2px]">
              <span className="w-[2px] h-2.5 bg-[#00f5d4] rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
              <span className="w-[2px] h-3.5 bg-[#00f5d4] rounded-full animate-[pulse_0.5s_ease-in-out_0.15s_infinite]" />
              <span className="w-[2px] h-2 bg-[#00f5d4] rounded-full animate-[pulse_0.5s_ease-in-out_0.3s_infinite]" />
            </span>
            <span className="text-[10px] font-semibold text-[#00f5d4] tracking-wide">ON AIR</span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-3.5">
        <h3 className="font-semibold text-white/90 truncate text-sm tracking-tight"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          {song.title}
        </h3>
        <p className="text-[11px] text-white/40 mt-0.5 truncate">{song.artist}</p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full
                          bg-white/[0.06] border border-white/[0.10] text-cyan-300/65 tracking-wide">
            {song.genre}
          </span>
          <span className="text-[10px] text-white/30"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {formatTime(song.duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
