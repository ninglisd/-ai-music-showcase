import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        sessionStorage.setItem("admin_password", password)
        navigate("/admin/dashboard")
      } else {
        setError("密码错误")
      }
    } catch {
      setError("网络错误，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white/90 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            AudioVerse Admin
          </h1>
          <p className="text-white/30 text-sm mt-1">请输入管理密码</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            autoFocus
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.10] rounded-xl
                       text-white/80 placeholder:text-white/20
                       focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20
                       transition-colors text-sm"
          />

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide
                       bg-gradient-to-r from-purple-500 to-cyan-400 text-black
                       hover:opacity-90 transition-opacity
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "验证中..." : "登录"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-white/20 hover:text-white/40 text-xs transition-colors">
            返回主页
          </Link>
        </div>
      </div>
    </div>
  )
}
