export default function LyricEditor({ lyrics, onChange }) {
  function updateLine(index, field, value) {
    const next = lyrics.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    onChange(next)
  }

  function removeLine(index) {
    onChange(lyrics.filter((_, i) => i !== index))
  }

  function addLine() {
    onChange([...lyrics, { time: 0, text: "" }])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/40 tracking-wider uppercase">歌词</label>
        <span className="text-[10px] text-white/20">{lyrics.length} 行</span>
      </div>

      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 lyrics-scroll">
        {lyrics.map((line, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <span className="text-[10px] text-white/15 w-4 text-right shrink-0">{i + 1}</span>
            <input
              type="number"
              value={line.time}
              onChange={(e) => updateLine(i, "time", e.target.value)}
              placeholder="秒"
              step="0.1"
              min="0"
              className="w-14 px-2 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg
                         text-white/60 text-xs placeholder:text-white/10
                         focus:outline-none focus:border-purple-400/30 transition-colors shrink-0"
            />
            <input
              type="text"
              value={line.text}
              onChange={(e) => updateLine(i, "text", e.target.value)}
              placeholder="歌词文本"
              className="flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg
                         text-white/70 text-xs placeholder:text-white/10
                         focus:outline-none focus:border-purple-400/30 transition-colors"
            />
            <button
              onClick={() => removeLine(i)}
              className="shrink-0 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLine}
        className="w-full py-2 rounded-lg border border-dashed border-white/[0.10]
                   text-white/25 text-xs hover:border-white/[0.20] hover:text-white/40
                   transition-colors flex items-center justify-center gap-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        添加行
      </button>
    </div>
  )
}
