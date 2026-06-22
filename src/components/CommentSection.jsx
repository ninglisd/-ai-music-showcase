import { useState } from "react"

function timeAgo(dateStr) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return "刚刚"
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  return `${Math.floor(diff / 86400)} 天前`
}

export default function CommentSection({ songId, comments, onAddComment }) {
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    await onAddComment(songId, name.trim(), text.trim())
    setText("")
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Comment list */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3 lyrics-scroll">
        {comments.length === 0 ? (
          <p className="text-white/15 text-sm text-center py-8">暂无评论，来说点什么吧</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-black">
                  {c.author_name?.[0] || "匿"}
                </div>
                <span className="text-sm text-white/70 font-medium">{c.author_name || "匿名用户"}</span>
                <span className="text-xs text-white/20">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed pl-11">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0 mt-3 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="昵称（选填）"
          maxLength={20}
          className="w-full px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg
                     text-white/70 text-sm placeholder:text-white/15
                     focus:outline-none focus:border-purple-400/30 transition-colors"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="写下你的想法..."
            maxLength={500}
            className="flex-1 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg
                       text-white/70 text-sm placeholder:text-white/15
                       focus:outline-none focus:border-purple-400/30 transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400
                       text-black text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed
                       hover:opacity-90 transition-opacity shrink-0"
          >
            {submitting ? "..." : "发送"}
          </button>
        </div>
      </form>
    </div>
  )
}
