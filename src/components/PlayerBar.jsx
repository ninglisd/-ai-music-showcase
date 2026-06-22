import { useState } from "react"
import { usePlayer } from "../context/PlayerContext"

function formatTime(seconds) {
  const s = Math.floor(Math.max(0, seconds))
  const m = Math.floor(s / 60)
  return `${m}:${s % 60 < 10 ? "0" : ""}${s % 60}`
}

const MODES = [
  { key: "NORMAL",     icon: "→",  label: "顺序播放" },
  { key: "REPEAT_ALL", icon: "↻",  label: "列表循环" },
  { key: "REPEAT_ONE", icon: "1",  label: "单曲循环" },
  { key: "SHUFFLE",    icon: "⇋",  label: "随机播放" },
]

export default function PlayerBar() {
  const {
    currentSong, currentIndex, isPlaying, currentTime, duration, volume,
    togglePlay, next, prev, seek, changeVolume,
    playMode, setPlayMode, openFullscreen,
  } = usePlayer()
  const [showLyrics, setShowLyrics] = useState(false)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const modeIdx = MODES.findIndex((m) => m.key === playMode)
  const mode = MODES[modeIdx] || MODES[0]

  const cycleMode = () => setPlayMode(MODES[(modeIdx + 1) % MODES.length].key)

  const lyrics = currentSong?.lyrics || []
  const currentLyric = [...lyrics].reverse().find((l) => l.time <= currentTime)
  const empty = !currentSong

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* 歌词浮层 — 只显示当前一句 */}
      {showLyrics && !empty && currentLyric && (
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="rounded-t-2xl overflow-hidden
                          bg-[rgba(14,14,20,0.85)] backdrop-blur-3xl backdrop-saturate-150
                          border border-white/[0.08] border-b-0
                          shadow-[0_-12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <span className="text-[10px] text-white/20 uppercase tracking-widest"
                style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                歌词
              </span>
              <button onClick={() => setShowLyrics(false)}
                className="text-white/20 hover:text-white/50 transition-colors p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-5 pb-5 pt-2">
              <p className="text-lg text-white font-medium leading-relaxed transition-all duration-500"
                style={{ fontFamily: "-apple-system, 'PingFang SC', sans-serif" }}>
                {currentLyric.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 播放器主体 */}
      <div className={`transition-colors duration-500 ${
        empty
          ? "bg-[rgba(12,12,18,0.55)] backdrop-blur-2xl"
          : "bg-[rgba(16,16,22,0.78)] backdrop-blur-3xl backdrop-saturate-150"
      } border-t border-white/[0.06] shadow-[0_-1px_40px_rgba(0,0,0,0.5)]`}>

        {/* 进度条 */}
        <div
          className={`relative h-[2px] transition-colors ${empty ? "bg-white/[0.04]" : "bg-white/[0.08]"} ${empty ? "cursor-default" : "cursor-pointer"} group/progress`}
          onClick={(e) => {
            if (empty || duration <= 0) return
            const rect = e.currentTarget.getBoundingClientRect()
            seek((e.clientX - rect.left) / rect.width * duration)
          }}
        >
          <div className="absolute inset-y-0 left-0 transition-all duration-300"
            style={{
              width: empty ? "0%" : `${progress}%`,
              background: `linear-gradient(90deg, ${currentSong?.color || "#6366f1"}, ${currentSong?.color || "#8b5cf6"}88, #a78bfa)`,
            }} />
          {!empty && (
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                            w-3 h-3 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{
                left: `${progress}%`,
                background: `radial-gradient(circle, #fff, ${currentSong?.color || "#6366f1"})`,
                boxShadow: `0 0 10px ${currentSong?.color || "#6366f1"}80`,
              }} />
          )}
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-3">

            {/* 左侧 — 点击进入全屏 */}
            <div className="flex items-center gap-3 w-52 min-w-0">
              <button onClick={() => !empty && openFullscreen(currentIndex)}
                className={`w-10 h-10 rounded-lg shrink-0 transition-all duration-500 ${
                  empty ? "bg-white/[0.04] cursor-default" : "hover:scale-105 hover:shadow-lg cursor-pointer"
                } overflow-hidden`}
                style={empty ? {} : {
                  background: `linear-gradient(135deg, ${currentSong?.color || "#4a4a5a"}, ${currentSong?.color || "#4a4a5a"}44)`,
                  boxShadow: `0 0 12px ${currentSong?.color || "#4a4a5a"}20`,
                }}>
                {!empty && isPlaying && (
                  <div className="w-full h-full flex items-end justify-center gap-[2px] p-2">
                    {[0,1,2,3].map((i) => (
                      <span key={i} className="w-[3px] bg-white/70 rounded-full"
                        style={{
                          height: `${30 + Math.sin(i * 1.5 + currentTime * 8) * 25}%`,
                          transition: "height 0.15s",
                        }} />
                    ))}
                  </div>
                )}
              </button>
              <div className="min-w-0">
                <p className={`text-[12px] font-semibold truncate transition-colors ${empty ? "text-white/20" : "text-white/90"}`}
                  style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}>
                  {empty ? "未在播放" : currentSong?.title}
                </p>
                <p className={`text-[11px] truncate transition-colors ${empty ? "text-white/10" : "text-white/40"}`}>
                  {empty ? "点击卡片开始播放" : currentSong?.artist}
                </p>
              </div>
            </div>

            {/* 中间 */}
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-4">
                <button onClick={cycleMode}
                  className={`relative transition-colors p-1 group/mode ${empty ? "text-white/15 cursor-default" : "text-white/35 hover:text-white/70"}`}
                  title={mode.label} disabled={empty}>
                  <span className="text-[15px] font-bold leading-none" style={{
                    fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                    color: !empty && playMode !== "NORMAL" ? currentSong?.color : undefined,
                  }}>{mode.icon}</span>
                </button>

                <button onClick={prev} disabled={empty}
                  className={`transition-colors p-1 ${empty ? "text-white/15 cursor-default" : "text-white/40 hover:text-white/75"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,12 18,2 18,22" /><rect x="2" y="4" width="4" height="16" rx="1" />
                  </svg>
                </button>

                <button onClick={togglePlay} disabled={empty}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                    ${empty
                      ? "bg-white/[0.03] border border-white/[0.04] text-white/15 cursor-default"
                      : "bg-white/[0.10] border border-white/[0.12] text-white hover:bg-white/[0.18] hover:scale-105 active:scale-95"}`}>
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" opacity={empty ? 0.2 : 0.85}>
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5" opacity={empty ? 0.2 : 0.85}>
                      <polygon points="6,2 20,12 6,22" />
                    </svg>
                  )}
                </button>

                <button onClick={next} disabled={empty}
                  className={`transition-colors p-1 ${empty ? "text-white/15 cursor-default" : "text-white/40 hover:text-white/75"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,2 18,12 6,22" /><rect x="18" y="4" width="4" height="16" rx="1" />
                  </svg>
                </button>

                <button onClick={() => setShowLyrics(!showLyrics)}
                  className={`p-1 transition-colors ${empty ? "text-white/15 cursor-default" : showLyrics ? "text-white/70" : "text-white/30 hover:text-white/60"}`}
                  title="歌词" disabled={empty}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] transition-colors"
                style={{ fontFamily: "'SF Mono', 'JetBrains Mono', monospace", color: empty ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)" }}>
                <span>{formatTime(currentTime)}</span>
                <span className="text-white/[0.06]">/</span>
                <span>{empty ? "--:--" : formatTime(duration)}</span>
              </div>
            </div>

            {/* 右侧 */}
            <div className="hidden sm:flex items-center gap-2 w-36 justify-end">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.5" className={`shrink-0 ${empty ? "text-white/10" : "text-white/30"}`}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
                {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
              </svg>
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))} className="w-20" />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
