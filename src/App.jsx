import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { PlayerProvider, usePlayer } from "./context/PlayerContext"
import useSongs from "./hooks/useSongs"
import LoadingSpinner from "./components/LoadingSpinner"
import Header from "./components/Header"
import MusicCard from "./components/MusicCard"
import PlayerBar from "./components/PlayerBar"
import FullscreenPlayer from "./components/FullscreenPlayer"
import AdminLogin from "./components/AdminLogin"
import AdminDashboard from "./components/AdminDashboard"
import SongForm from "./components/SongForm"

function Gallery() {
  const { songs } = usePlayer()

  return (
    <main className="px-4 sm:px-6 pb-36 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {songs.map((song, i) => (
          <MusicCard key={song.id} song={song} index={i} />
        ))}
      </div>
    </main>
  )
}

function EmptyState() {
  return (
    <main className="px-4 sm:px-6 pb-36 max-w-screen-2xl mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10 mx-auto mb-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 16V8l6 4-6 4z" strokeWidth="1.5" />
        </svg>
        <p className="text-white/20 text-lg">暂无音乐</p>
        <p className="text-white/10 text-sm mt-1">通过管理后台添加歌曲</p>
      </div>
    </main>
  )
}

function MainView() {
  const { isFullscreen, songs, openFullscreen } = usePlayer()
  const [shareChecked, setShareChecked] = useState(false)

  // Handle ?song= share link
  useEffect(() => {
    if (shareChecked || songs.length === 0) return
    setShareChecked(true)
    const params = new URLSearchParams(window.location.search)
    const songName = params.get("song")
    if (songName) {
      const idx = songs.findIndex((s) => s.title === decodeURIComponent(songName))
      if (idx >= 0) {
        setTimeout(() => openFullscreen(idx), 500)
        const url = new URL(window.location)
        url.searchParams.delete("song")
        window.history.replaceState({}, "", url)
      }
    }
  }, [songs, shareChecked, openFullscreen])

  if (songs.length === 0) {
    return (
      <div className="min-h-screen relative z-10">
        <Header />
        <EmptyState />
      </div>
    )
  }

  return (
    <>
      <div className={`min-h-screen relative z-10 ${isFullscreen ? "hidden" : ""}`}>
        <Header />
        <Gallery />
        <PlayerBar />
      </div>
      <FullscreenPlayer />
    </>
  )
}

function PublicSite() {
  const { songs, loading, error, refetch, toggleLike, addComment } = useSongs()

  if (loading) return <LoadingSpinner text="正在加载音乐库..." />
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810]">
        <div className="text-center">
          <p className="text-red-400 mb-3">加载失败: {error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors text-sm"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <PlayerProvider songs={songs} toggleLike={toggleLike} addComment={addComment}>
      <MainView />
    </PlayerProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/songs/new" element={<SongForm />} />
      <Route path="/admin/songs/:id" element={<SongForm />} />
    </Routes>
  )
}
