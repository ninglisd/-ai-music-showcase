import { usePlayer } from "../context/PlayerContext"

function formatTime(seconds) {
  const s = Math.floor(Math.max(0, seconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, "0")}`
}

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    prev,
    seek,
    changeVolume,
  } = usePlayer()

  if (!currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50
                    bg-[rgba(8,8,12,0.82)] backdrop-blur-2xl
                    border-t border-white/[0.08]
                    shadow-[0_-1px_40px_rgba(0,0,0,0.5)]">
      {/* Progress bar — 2px with glowing dot */}
      <div
        className="relative h-[2px] bg-white/[0.10] cursor-pointer group/progress"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const pct = (e.clientX - rect.left) / rect.width
          seek(pct * duration)
        }}
      >
        {/* Played section: green → purple gradient */}
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #00F5D4, #00C3FF 50%, #BF00FF 100%)",
          }}
        />
        {/* Glowing particle dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                      w-2.5 h-2.5 rounded-full
                      transition-all duration-150
                      opacity-0 group-hover/progress:opacity-100"
          style={{
            left: `${progress}%`,
            background: "radial-gradient(circle, #00F5D4 0%, #00C3FF 50%, transparent 70%)",
            boxShadow: "0 0 8px rgba(0,245,212,0.6), 0 0 16px rgba(0,195,255,0.3)",
          }}
        />
      </div>

      <div className="max-w-screen-2xl mx-auto px-5 py-2.5 flex items-center gap-4">
        {/* Song info */}
        <div className="flex items-center gap-3 w-56 min-w-0">
          <div
            className="w-10 h-10 rounded-lg shrink-0"
            style={{
              background: `linear-gradient(135deg, ${currentSong.color}, ${currentSong.color}44)`,
              boxShadow: `0 0 12px ${currentSong.color}20`,
            }}
          />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-white/85 truncate"
               style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
              {currentSong.title}
            </p>
            <p className="text-[10px] text-white/40 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls — glass pill background */}
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-3 px-4 py-1 rounded-full
                          bg-white/[0.06] backdrop-blur-md border border-white/[0.08]">
            <button onClick={prev} className="text-white/40 hover:text-white/75 transition-colors p-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,12 18,2 18,22" />
                <rect x="2" y="4" width="4" height="16" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08]
                         flex items-center justify-center
                         hover:bg-white/[0.12] transition-all hover:scale-105"
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" opacity="0.8">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="ml-0.5" opacity="0.8">
                  <polygon points="6,2 20,12 6,22" />
                </svg>
              )}
            </button>

            <button onClick={next} className="text-white/40 hover:text-white/75 transition-colors p-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,2 18,12 6,22" />
                <rect x="18" y="4" width="4" height="16" />
              </svg>
            </button>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1.5 text-[10px] text-white/35 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/10">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 w-44 justify-end">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.5" className="text-white/35 shrink-0">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
            {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
          </svg>
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
    </div>
  )
}
