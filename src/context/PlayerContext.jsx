import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react"

const PlayerContext = createContext(null)

const SHUFFLE_HISTORY_MAX = 30

export function PlayerProvider({ children, songs = [], toggleLike, addComment }) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playMode, setPlayMode] = useState("REPEAT_ALL") // NORMAL | REPEAT_ONE | REPEAT_ALL | SHUFFLE
  const playModeRef = useRef(playMode)
  const shuffleHistoryRef = useRef([])
  const audioRef = useRef(null)
  const currentIndexRef = useRef(currentIndex)
  const songsRef = useRef(songs)

  // Keep refs in sync so onEnded closure always sees latest values
  useEffect(() => { playModeRef.current = playMode }, [playMode])
  useEffect(() => { currentIndexRef.current = currentIndex }, [currentIndex])
  useEffect(() => { songsRef.current = songs }, [songs])

  const currentSong = currentIndex >= 0 ? songs[currentIndex] : null

  const play = useCallback((index) => {
    if (songs.length === 0 || index < 0 || index >= songs.length) return
    if (index === currentIndex && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      return
    }
    setCurrentIndex(index)
    setCurrentTime(0)
    setDuration(songs[index]?.duration || 0)
  }, [currentIndex, songs.length])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // 移动端自动播放被拦截，保持暂停状态
      })
    }
  }, [isPlaying])

  const next = useCallback(() => {
    if (songs.length === 0) return
    const cur = currentIndexRef.current
    const list = songsRef.current
    if (playModeRef.current === "SHUFFLE") {
      shuffleHistoryRef.current.push(cur)
      if (shuffleHistoryRef.current.length > SHUFFLE_HISTORY_MAX) shuffleHistoryRef.current.shift()
      const pool = list.map((_, i) => i).filter((i) => !shuffleHistoryRef.current.includes(i))
      if (pool.length === 0) {
        shuffleHistoryRef.current = [cur]
        const newPool = list.map((_, i) => i).filter((i) => i !== cur)
        const ri = newPool[Math.floor(Math.random() * newPool.length)]
        play(ri >= 0 ? ri : (cur + 1) % list.length)
      } else {
        play(pool[Math.floor(Math.random() * pool.length)])
      }
      return
    }
    play((cur + 1) % list.length)
  }, [play])

  const prev = useCallback(() => {
    if (songs.length === 0) return
    const cur = currentIndexRef.current
    const list = songsRef.current
    if (playModeRef.current === "SHUFFLE" && shuffleHistoryRef.current.length > 0) {
      play(shuffleHistoryRef.current.pop())
      return
    }
    play((cur - 1 + list.length) % list.length)
  }, [play])

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const changeVolume = useCallback((v) => {
    setVolume(v)
    if (audioRef.current) {
      audioRef.current.volume = v
    }
  }, [])

  const openFullscreen = useCallback((index) => {
    play(index)
    setIsFullscreen(true)
  }, [play])

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false)
  }, [])

  // Create audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      setIsPlaying(false)
      const mode = playModeRef.current
      const cur = currentIndexRef.current
      const list = songsRef.current

      if (mode === "REPEAT_ONE") {
        // 单曲循环
        const a = audio
        if (a) { a.currentTime = 0; a.play().catch(() => {}) }
        return
      }

      if (mode === "SHUFFLE") {
        // 随机播放
        shuffleHistoryRef.current.push(cur)
        if (shuffleHistoryRef.current.length > SHUFFLE_HISTORY_MAX) shuffleHistoryRef.current.shift()
        const pool = list.map((_, i) => i).filter((i) => !shuffleHistoryRef.current.includes(i))
        if (pool.length === 0) {
          shuffleHistoryRef.current = [cur]
          const newPool = list.map((_, i) => i).filter((i) => i !== cur)
          const ri = newPool[Math.floor(Math.random() * newPool.length)]
          play(ri >= 0 ? ri : (cur + 1) % list.length)
        } else {
          play(pool[Math.floor(Math.random() * pool.length)])
        }
        return
      }

      // REPEAT_ALL / NORMAL: 顺序播放下一首
      const nextIndex = (cur + 1) % list.length
      if (mode === "NORMAL" && nextIndex === 0) {
        // NORMAL模式播完最后一首就停
        return
      }
      play(nextIndex)
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)

    audioRef.current = audio

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.pause()
      audio.src = ""
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load new song when index changes
  useEffect(() => {
    if (!currentSong || !audioRef.current) return
    const audio = audioRef.current
    audio.src = currentSong.audio
    audio.play().catch(() => {
      // 移动端自动播放被拦截时，不强制播放，等用户手动触发
      setIsPlaying(false)
    })
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync volume changes to audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return (
    <PlayerContext.Provider value={{
      currentSong,
      currentIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      songs,
      audioRef,
      play,
      pause,
      togglePlay,
      next,
      prev,
      seek,
      changeVolume,
      isFullscreen,
      openFullscreen,
      closeFullscreen,
      playMode,
      setPlayMode,
      toggleLike,
      addComment,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider")
  return ctx
}
