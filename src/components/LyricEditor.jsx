import { useState, useCallback, useRef } from "react"

export default function LyricEditor({ lyrics, onChange }) {
  const [bulkText, setBulkText] = useState("")
  const [showBulk, setShowBulk] = useState(false)
  const autoParsedRef = useRef(false)

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

  const parseBulk = useCallback((text) => {
    const lines = text.trim().split("\n").filter(l => l.trim())
    const parsed = []
    for (const line of lines) {
      const match = line.match(/^(\d+(?:\.\d+)?)\s+(.+)/)
      if (match) {
        parsed.push({ time: Number(match[1]), text: match[2] })
      }
    }
    return parsed
  }, [])

  // Auto-parse on EVERY change: immediately sync bulk text to lyrics state
  function handleBulkTextChange(text) {
    setBulkText(text)
    const parsed = parseBulk(text)
    if (parsed.length > 0) {
      autoParsedRef.current = true
      onChange(parsed)
    }
  }

  function handleBulkImport() {
    const parsed = parseBulk(bulkText)
    if (parsed.length > 0) {
      onChange(parsed)
      setBulkText("")
      setShowBulk(false)
      autoParsedRef.current = false
    }
  }

  function handleSwitchToSingle() {
    if (!autoParsedRef.current && bulkText.trim()) {
      const parsed = parseBulk(bulkText)
      if (parsed.length > 0) onChange(parsed)
    }
    setBulkText("")
    setShowBulk(false)
    autoParsedRef.current = false
  }

  const bulkLineCount = bulkText.trim() ? bulkText.trim().split("\n").filter(l => l.trim()).length : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/40 tracking-wider uppercase">歌词</label>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/20">{lyrics.length} 行</span>
          <button
            type="button"
            onClick={() => {
              if (showBulk) {
                handleSwitchToSingle()
              } else {
                setShowBulk(true)
              }
            }}
            className="text-[10px] text-cyan-400/60 hover:text-cyan-300 transition-colors"
          >
            {showBulk ? "返回逐行" : "批量导入"}
          </button>
        </div>
      </div>

      {showBulk ? (
        <div className="space-y-2">
          <p className="text-[10px] text-white/20">每行格式：秒数 + 空格 + 歌词，粘贴后自动识别</p>
          <textarea
            value={bulkText}
            onChange={(e) => handleBulkTextChange(e.target.value)}
            placeholder={"36 七点半的闹钟，又一次准时嘶吼\n41 打卡机的绿灯，吞噬了昨夜的自由"}
            rows={12}
            className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl
                       text-white/70 text-xs placeholder:text-white/10
                       focus:outline-none focus:border-cyan-400/40 transition-colors resize-y font-mono"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBulkImport}
              disabled={!bulkText.trim()}
              className="flex-1 py-2 rounded-lg bg-cyan-500/15 border border-cyan-400/25
                         text-cyan-300 text-xs font-medium hover:bg-cyan-500/25
                         disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              导入 {bulkLineCount} 行
            </button>
            <button
              type="button"
              onClick={handleSwitchToSingle}
              className="flex-1 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08]
                         text-white/30 text-xs hover:bg-white/[0.08] transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
