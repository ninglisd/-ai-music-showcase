import { usePlayer } from "../context/PlayerContext"

function formatTime(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60)
  const s = Math.floor(Math.max(0, seconds)) % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function FullscreenPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isFullscreen,
    togglePlay,
    next,
    prev,
    seek,
    changeVolume,
    closeFullscreen,
  } = usePlayer()

  if (!isFullscreen || !currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Normalize lyrics: support plain text string or [{time, text}] array
  const rawLyrics = currentSong?.lyrics
  let lyrics = []
  if (typeof rawLyrics === "string") {
    const lines = rawLyrics.split("\n").filter((l) => l.trim())
    const totalDuration = currentSong?.duration || 240
    const gap = totalDuration / (lines.length + 1)
    lyrics = lines.map((text, i) => ({ time: gap * (i + 1), text }))
  } else if (Array.isArray(rawLyrics)) {
    lyrics = rawLyrics
  }

  // Find current lyric line
  let currentLyricIndex = -1
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      currentLyricIndex = i
      break
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0B0F] animate-[fadeIn_0.3s_ease-out]">
      {/* Background blur gradient */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${currentSong.color}40 0%, transparent 60%),
                       radial-gradient(ellipse at 50% 70%, ${currentSong.color}30 0%, transparent 50%)`,
        }}
      />

      {/* Top bar — close + song info */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={closeFullscreen}
          className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors group"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          <span className="text-sm font-medium">返回</span>
        </button>
        <div className="text-center">
          <p className="text-xs text-white/40 tracking-widest uppercase">Now Playing</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Main content: cover + lyrics side by side on desktop, stacked on mobile */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 pb-6 overflow-hidden">
        {/* Cyberpunk Vinyl Record */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] shrink-0 flex items-center justify-center">
          {/* Outer holographic ring -- counter-rotating */}
          <div
            className="absolute inset-[-6px] rounded-full z-0"
            style={{
              background: `conic-gradient(from 0deg,
                transparent 0deg, ${currentSong.color}30 25deg, transparent 55deg,
                ${currentSong.color}12 100deg, transparent 130deg,
                ${currentSong.color}30 190deg, transparent 220deg,
                ${currentSong.color}12 280deg, transparent 310deg,
                transparent 360deg)`,
              animation: "vinylSpinRev 5s linear infinite",
              animationPlayState: isPlaying ? "running" : "paused",
              filter: "blur(1.5px)",
            }}
          />

          {/* Outer neon ring */}
          <div
            className="absolute inset-[-2px] rounded-full z-0"
            style={{
              border: `1.5px solid ${currentSong.color}50`,
              boxShadow: `0 0 20px ${currentSong.color}35, 0 0 40px ${currentSong.color}15, inset 0 0 15px ${currentSong.color}08`,
              animation: "neonFlicker 2.5s ease-in-out infinite",
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          />

          {/* Ambient glow behind vinyl */}
          <div
            className="absolute inset-[10%] rounded-full z-0 blur-2xl"
            style={{
              background: `radial-gradient(circle, ${currentSong.color}20 0%, transparent 70%)`,
              animation: "neonFlicker 3s ease-in-out infinite 0.5s",
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          />

          {/* ── MAIN VINYL DISC ── */}
          <div
            className="relative w-[88%] h-[88%] rounded-full z-10"
            style={{
              background: `
                radial-gradient(circle at 50% 50%,
                  #14142a 0%,
                  #181835 2.5%,
                  #0e0e22 6%,
                  #14142a 6.5%,
                  #0e0e22 11%,
                  #14142a 11.5%,
                  #0e0e22 16%,
                  #14142a 16.5%,
                  #0e0e22 20%,
                  #14142a 20.5%,
                  #0e0e22 24%,
                  #14142a 24.5%,
                  #0e0e22 28%,
                  #14142a 28.5%,
                  #0e0e22 31%,
                  #14142a 31.5%,
                  #0e0e22 35%,
                  #14142a 35.5%,
                  #0e0e22 39%,
                  #14142a 39.5%,
                  #0e0e22 42%,
                  #14142a 42.5%,
                  #0e0e22 46%,
                  #14142a 46.5%,
                  #0e0e22 50%,
                  #14142a 50.5%,
                  #0e0e22 54%,
                  #14142a 54.5%,
                  #0e0e22 58%,
                  #14142a 58.5%,
                  #0e0e22 61%,
                  #0e0e22 65%,
                  #0a0a18 100%)`,
              boxShadow: `
                0 0 40px ${currentSong.color}10,
                0 0 80px ${currentSong.color}05,
                inset 0 0 50px rgba(0,0,0,0.5),
                inset 0 0 10px rgba(0,0,0,0.3)`,
              animation: "vinylSpin 2s linear infinite",
              animationPlayState: isPlaying ? "running" : "paused",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* Surface reflection sheen */}
            <div
              className="absolute inset-[4%] rounded-full opacity-[0.05] pointer-events-none"
              style={{
                background: `linear-gradient(135deg, #fff 0%, transparent 35%, transparent 65%, ${currentSong.color} 100%)`,
              }}
            />

            {/* Groove accent ring */}
            <div
              className="absolute top-[24%] bottom-[24%] left-[24%] right-[24%] rounded-full pointer-events-none"
              style={{
                border: `1px solid ${currentSong.color}15`,
                boxShadow: `0 0 6px ${currentSong.color}08`,
              }}
            />

            {/* Inner neon groove ring */}
            <div
              className="absolute top-[30%] bottom-[30%] left-[30%] right-[30%] rounded-full pointer-events-none"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${currentSong.color}12 30deg, transparent 60deg)`,
                maskImage: "radial-gradient(circle, transparent 45%, black 46%, black 54%, transparent 55%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 45%, black 46%, black 54%, transparent 55%)",
                animation: "vinylSpinRev 1.5s linear infinite",
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            />

            {/* ── CENTER LABEL ── */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[36%] h-[36%] rounded-full flex flex-col items-center justify-center z-10 overflow-hidden"
              style={{
                background: `radial-gradient(circle at 40% 35%, ${currentSong.color}45 0%, ${currentSong.color}18 45%, #0a0a1a 100%)`,
                border: `2px solid ${currentSong.color}50`,
                boxShadow: `0 0 20px ${currentSong.color}25, 0 0 35px ${currentSong.color}08, inset 0 0 10px rgba(0,0,0,0.3)`,
              }}
            >
              {/* Label gloss */}
              <div
                className="absolute inset-0 rounded-full opacity-[0.15] pointer-events-none"
                style={{ background: "linear-gradient(135deg, #fff 0%, transparent 55%)" }}
              />

              {/* AI badge */}
              <span
                className="relative text-[7px] font-bold tracking-[0.22em] uppercase text-white/50 mb-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                AI Generated
              </span>

              {/* Title */}
              <span
                className="relative text-[10px] sm:text-[11px] font-bold text-white/95 tracking-wide text-center leading-tight px-3"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {currentSong.title}
              </span>

              {/* Artist */}
              <span className="relative text-[7px] sm:text-[7px] text-white/35 mt-1 tracking-wider text-center px-3">
                {currentSong.artist}
              </span>

              {/* Center spindle hole */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10%] h-[10%] rounded-full"
                style={{
                  background: "#060610",
                  border: `1px solid ${currentSong.color}25`,
                  boxShadow: "inset 0 0 4px rgba(0,0,0,0.6)",
                }}
              />
            </div>

            {/* Glitch slice overlay */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-[0.04]"
              style={{
                background: `linear-gradient(to bottom, ${currentSong.color}, transparent 30%, ${currentSong.color} 60%, transparent)`,
                animation: isPlaying ? "dataScan 3s linear infinite" : "none",
              }}
            />
          </div>

          {/* ── ORBITING PARTICLES ── */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 8
            const r = 50
            return (
              <div
                key={`p${i}`}
                className="absolute rounded-full z-20 pointer-events-none"
                style={{
                  width: "3px",
                  height: "3px",
                  background: i % 2 === 0 ? currentSong.color : "#00f5d4",
                  boxShadow: `0 0 7px ${i % 2 === 0 ? currentSong.color : "#00f5d4"}, 0 0 14px ${i % 2 === 0 ? currentSong.color : "#00f5d4"}70`,
                  "--orbit-angle": `${angle}rad`,
                  "--orbit-r": r,
                  top: `${50 + Math.sin(angle) * r}%`,
                  left: `${50 + Math.cos(angle) * r}%`,
                  animation: `orbitPulse ${2 + i * 0.4}s ease-in-out infinite`,
                  animationPlayState: isPlaying ? "running" : "paused",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            )
          })}

          {/* ── EQUALIZER RING ── */}
          {Array.from({ length: 28 }).map((_, i) => {
            const angle = (i * 360) / 28
            const rad = (angle * Math.PI) / 180
            const barH = 6 + (i % 5) * 2.5
            return (
              <div
                key={`eq${i}`}
                className="absolute z-20 pointer-events-none"
                style={{
                  width: "2px",
                  height: `${barH}px`,
                  background: `linear-gradient(to top, ${currentSong.color}90, transparent)`,
                  boxShadow: `0 0 5px ${currentSong.color}50`,
                  borderRadius: "1px",
                  top: `${50 + Math.sin(rad) * 53}%`,
                  left: `${50 + Math.cos(rad) * 53}%`,
                  transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translateY(-48%)`,
                  animation: isPlaying ? `eqBounce ${0.6 + (i % 4) * 0.15}s ease-in-out infinite` : "none",
                  animationDelay: `${i * 0.04}s`,
                  opacity: 0.55,
                }}
              />
            )
          })}

          {/* AI badge floating outside */}
          <span
            className="absolute top-1 right-4 z-30 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full
                       bg-black/60 backdrop-blur-md border border-white/10 text-purple-300"
            style={{ animation: "neonFlicker 3s ease-in-out infinite 1s" }}
          >
            AI 创作
          </span>

          {/* Genre tag floating outside */}
          <span
            className="absolute bottom-2 right-4 z-30 px-2.5 py-1 text-[10px] rounded-full
                       bg-white/5 backdrop-blur-md border border-white/10 text-cyan-300"
          >
            {currentSong.genre}
          </span>
        </div>

        {/* Lyrics area */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl h-full min-h-0 overflow-hidden flex flex-col">
          {/* Song info */}
          <div className="text-center lg:text-left mb-4 shrink-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90 tracking-tight">
              {currentSong.title}
            </h2>
            <p className="text-white/40 mt-1">{currentSong.artist}</p>
          </div>

          {/* Lyrics scroll */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3 text-center lg:text-left lyrics-scroll px-2">
            {lyrics.map((line, i) => {
              const isPast = i < currentLyricIndex
              const isCurrent = i === currentLyricIndex
              return (
                <p
                  key={i}
                  className={`transition-all duration-500 text-lg leading-relaxed
                    ${isCurrent
                      ? "text-white font-semibold text-2xl scale-105"
                      : isPast
                        ? "text-white/30"
                        : "text-white/15"
                    }`}
                >
                  {isCurrent && (
                    <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full mr-3 align-middle" />
                  )}
                  {line.text}
                </p>
              )
            })}
            <div className="h-32" />
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-xl">
        {/* Progress bar */}
        <div
          className="relative h-1.5 bg-white/8 rounded-full cursor-pointer group/progress mb-4"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            seek((e.clientX - rect.left) / rect.width * duration)
          }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg shadow-purple-500/50 opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Time */}
        <div className="flex items-center justify-between mb-4 text-xs text-white/35 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2 w-40">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 shrink-0">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
              {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
            </svg>
            <input
              type="range"
              min="0" max="1" step="0.01"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>

          {/* Play controls */}
          <div className="flex items-center gap-6 mx-auto">
            <button onClick={prev} className="text-white/40 hover:text-white/80 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,12 18,2 18,22" />
                <rect x="2" y="4" width="4" height="16" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
            >
              {isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="ml-1">
                  <polygon points="6,2 20,12 6,22" />
                </svg>
              )}
            </button>

            <button onClick={next} className="text-white/40 hover:text-white/80 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,2 18,12 6,22" />
                <rect x="18" y="4" width="4" height="16" />
              </svg>
            </button>
          </div>

          {/* Spacer */}
          <div className="w-40 hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
