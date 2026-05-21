import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import LyricEditor from "./LyricEditor"

function getToken() {
  return sessionStorage.getItem("admin_password") || ""
}

const DEFAULT_COVER = "from-violet-600 via-purple-500 to-cyan-400"
const DEFAULT_COLOR = "#5c66f6"

export default function SongForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    title: "",
    artist: "LINING&SUNO AI",
    genre: "",
    duration: 0,
    audio_path: "",
    cover: DEFAULT_COVER,
    color: DEFAULT_COLOR,
  })
  const [lyrics, setLyrics] = useState([])
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [fetching, setFetching] = useState(isEdit)

  // Fetch song for edit mode
  useEffect(() => {
    if (!isEdit) return
    async function load() {
      try {
        const res = await fetch("/api/admin/songs", {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (res.status === 401) {
          sessionStorage.removeItem("admin_password")
          navigate("/admin")
          return
        }
        const all = await res.json()
        const song = all.find((s) => s.id === id)
        if (!song) {
          setError("歌曲未找到")
          setFetching(false)
          return
        }
        setForm({
          title: song.title || "",
          artist: song.artist || "",
          genre: song.genre || "",
          duration: song.duration || 0,
          audio_path: song.audio_path || "",
          cover: song.cover || DEFAULT_COVER,
          color: song.color || DEFAULT_COLOR,
        })
        setLyrics(
          (song.lyrics || []).map((l) => ({ time: l.time, text: l.text }))
        )
      } catch {
        setError("加载失败")
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id, isEdit, navigate])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError("")

    try {
      // 1. Get signed URL
      const urlRes = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ filename: file.name }),
      })
      if (!urlRes.ok) {
        const d = await urlRes.json().catch(() => ({}))
        throw new Error(d.error || "获取上传链接失败")
      }
      const { signedUrl, path: filePath } = await urlRes.json()

      // 2. Upload directly to Supabase
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error("上传文件失败")

      updateField("audio_path", filePath)
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.artist || !form.genre || !form.duration) {
      setError("请填写所有必填字段")
      return
    }
    if (!isEdit && !form.audio_path && !file) {
      setError("请上传 MP3 文件")
      return
    }

    // If a new file is pending, upload first
    if (file && !form.audio_path) {
      await handleUpload()
      if (!form.audio_path) return
    }

    setSaving(true)
    setError("")

    const body = {
      ...form,
      duration: Number(form.duration),
      lyrics,
    }

    try {
      const url = isEdit ? `/api/admin/songs/${id}` : "/api/admin/songs"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      })
      if (res.status === 401) {
        sessionStorage.removeItem("admin_password")
        navigate("/admin")
        return
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || "保存失败")
      }
      navigate("/admin/dashboard")
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <p className="text-white/20 text-sm">加载中...</p>
      </div>
    )
  }

  const inputClass =
    "w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/70 text-sm placeholder:text-white/10 focus:outline-none focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/10 transition-colors"

  return (
    <div className="min-h-screen bg-[#080810] px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/dashboard"
            className="p-1.5 text-white/30 hover:text-white/60 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-white/90 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            {isEdit ? "编辑歌曲" : "新建歌曲"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/30 mb-1.5 block">标题 *</label>
              <input
                type="text" value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass} placeholder="歌曲名"
              />
            </div>
            <div>
              <label className="text-xs text-white/30 mb-1.5 block">艺人 *</label>
              <input
                type="text" value={form.artist}
                onChange={(e) => updateField("artist", e.target.value)}
                className={inputClass} placeholder="LINING&SUNO AI"
              />
            </div>
            <div>
              <label className="text-xs text-white/30 mb-1.5 block">风格 *</label>
              <input
                type="text" value={form.genre}
                onChange={(e) => updateField("genre", e.target.value)}
                className={inputClass} placeholder="如：电子流行"
              />
            </div>
            <div>
              <label className="text-xs text-white/30 mb-1.5 block">时长（秒）*</label>
              <input
                type="number" value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                className={inputClass} placeholder="240"
                min="1"
              />
            </div>
          </div>

          {/* Cover gradient + color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/30 mb-1.5 block">封面渐变 CSS</label>
              <input
                type="text" value={form.cover}
                onChange={(e) => updateField("cover", e.target.value)}
                className={inputClass}
              />
              <div
                className={`mt-2 h-8 rounded-lg bg-gradient-to-r ${form.cover} opacity-60`}
              />
            </div>
            <div>
              <label className="text-xs text-white/30 mb-1.5 block">主色调</label>
              <div className="flex gap-2">
                <input
                  type="color" value={form.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer shrink-0"
                />
                <input
                  type="text" value={form.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* MP3 upload */}
          <div>
            <label className="text-xs text-white/30 mb-1.5 block">
              MP3 文件 {!isEdit && "*"}
              {form.audio_path && (
                <span className="text-green-400/60 ml-2">已上传: {form.audio_path}</span>
              )}
            </label>
            <div
              className="relative border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center
                         hover:border-purple-400/30 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const f = e.dataTransfer.files?.[0]
                if (f && f.type.startsWith("audio/")) {
                  setFile(f)
                  updateField("audio_path", "")
                }
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="audio/mpeg,audio/mp3"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setFile(f)
                    updateField("audio_path", "")
                  }
                }}
              />

              {file ? (
                <div className="text-sm text-white/60">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-white/20 text-xs mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleUpload() }}
                    disabled={uploading}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30
                               text-purple-300 text-xs font-medium hover:bg-purple-500/30
                               disabled:opacity-30 transition-colors"
                  >
                    {uploading ? "上传中..." : "上传文件"}
                  </button>
                </div>
              ) : (
                <p className="text-white/15 text-sm">
                  拖拽 MP3 文件到此处，或点击选择
                </p>
              )}
            </div>
          </div>

          {/* Lyrics */}
          <LyricEditor lyrics={lyrics} onChange={setLyrics} />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              to="/admin/dashboard"
              className="flex-1 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]
                         text-white/40 text-sm text-center hover:bg-white/[0.06] transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400
                         text-black text-sm font-semibold tracking-wide
                         hover:opacity-90 disabled:opacity-30 transition-opacity"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
