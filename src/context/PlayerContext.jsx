import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react"

const PlayerContext = createContext(null)

export function PlayerProvider({ children, songs = [] }) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const audioRef = useRef(null)

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
      audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const next = useCallback(() => {
    if (songs.length === 0) return
    const nextIndex = (currentIndex + 1) % songs.length
    play(nextIndex)
  }, [currentIndex, play, songs.length])

  const prev = useCallback(() => {
    if (songs.length === 0) return
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    play(prevIndex)
  }, [currentIndex, play, songs.length])

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
      next()
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
    audio.play()
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
