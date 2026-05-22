import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"

function getToken() {
  return sessionStorage.getItem("admin_password") || ""
}

function formatDuration(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, "0")}`
}

export default function AdminDashboard() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  const fetchSongs = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/songs", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (res.status === 401) {
        sessionStorage.removeItem("admin_password")
        navigate("/admin")
        return
      }
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setSongs(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/songs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error("Delete failed")
      setSongs((prev) => prev.filter((s) => s.id !== id))
      setDeleteId(null)
    } catch {
      setError("删除失败")
    }
  }

  return (
    <div className="min-h-screen bg-[#080810] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white/90 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              AudioVerse Admin
            </h1>
            <p className="text-white/30 text-sm mt-0.5">
              {songs.length} 首歌曲
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]
                         text-white/40 text-xs hover:text-white/70 transition-colors"
            >
              查看网站
            </Link>
            <Link
              to="/admin/songs/new"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400
                         text-black text-xs font-semibold tracking-wide hover:opacity-90 transition-opacity"
            >
              + 添加歌曲
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Song list */}
        {loading ? (
          <div className="text-center py-20 text-white/20 text-sm">加载中...</div>
        ) : songs.length === 0 ? (
          <div className="text-center py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
              className="text-white/8 mx-auto mb-3">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
            <p className="text-white/20 text-sm">还没有歌曲</p>
            <Link to="/admin/songs/new" className="text-purple-400/60 text-xs hover:text-purple-300 mt-2 inline-block">
              添加第一首歌曲
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/[0.05]
                           rounded-xl hover:bg-white/[0.04] transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{song.title}</p>
                  <p className="text-white/25 text-xs truncate mt-0.5">
                    {song.artist} · {song.genre} · {formatDuration(song.duration)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    to={`/admin/songs/${song.id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-cyan-300/60
                               bg-white/[0.04] border border-white/[0.06]
                               hover:text-cyan-200 hover:bg-white/[0.08] hover:border-cyan-400/20
                               transition-colors text-xs"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    编辑
                  </Link>
                  <button
                    onClick={() => setDeleteId(song.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-red-300/50
                               bg-white/[0.04] border border-white/[0.06]
                               hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20
                               transition-colors text-xs"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#12121f] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm">
              <p className="text-white/80 text-sm text-center mb-1">确认删除这首歌？</p>
              <p className="text-white/25 text-xs text-center mb-5">此操作不可撤销，MP3 文件也会被删除</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]
                             text-white/50 text-sm hover:bg-white/[0.08] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30
                             text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
