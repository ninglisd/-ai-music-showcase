import { useState, useEffect, useCallback } from "react"
import { supabase, getPublicAudioUrl } from "../lib/supabase"

// Offline fallback data — used when Supabase is not configured
const OFFLINE_SONGS = [
  {
    id: "1",
    title: "时之圆",
    artist: "LINING&SUNO AI",
    genre: "氛围民谣",
    duration: 236,
    audio: "/music/时之圆.mp3",
    cover: "from-violet-600 via-purple-500 to-cyan-400",
    color: "#5c66f6",
    lyrics: [
      { time: 0, text: "♪ 前奏 ♪" },
      { time: 16, text: "冰层裂开第一道光" },
      { time: 22, text: "惊醒沉睡的土壤" },
      { time: 28, text: "柳丝垂落如绿浪" },
      { time: 34, text: "风把新生轻轻唱" },
      { time: 42, text: "蝉鸣撕扯着热浪" },
      { time: 48, text: "荷花在暴雨中开放" },
      { time: 54, text: "闪电只是云的印章" },
      { time: 60, text: "彩虹是天空的奖赏" },
      { time: 68, text: "落叶铺成金色海洋" },
      { time: 74, text: "雁阵写下人字两行" },
      { time: 80, text: "果实垂首向大地仰望" },
      { time: 86, text: "成熟是学会了弯腰的模样" },
      { time: 94, text: "白雪覆盖所有过往" },
      { time: 100, text: "枯枝在寒风中守望" },
      { time: 106, text: "冰层下暗流在涌荡" },
      { time: 112, text: "等待是最深的倔强" },
      { time: 120, text: "没有不谢的芬芳" },
      { time: 126, text: "没有永恒的冰凉" },
      { time: 132, text: "圆画到最后 起点就在终点旁" },
      { time: 140, text: "我们学会告别 才懂得生长" },
      { time: 146, text: "凋零和盛开 都是光的形状" },
      { time: 154, text: "春不为花谢悲伤" },
      { time: 160, text: "夏不为秋来慌张" },
      { time: 166, text: "冬不为寒夜仓皇" },
      { time: 172, text: "四季只是 时间的浪" },
      { time: 180, text: "当最后一片雪融成了溪响" },
      { time: 188, text: "你听见岁月在低声讲——" },
      { time: 196, text: "所谓永恒" },
      { time: 204, text: "不过是变化在流浪" },
      { time: 216, text: "♪ 尾声 ♪" },
    ],
  },
  {
    id: "2",
    title: "不畏风雨",
    artist: "LINING&SUNO AI",
    genre: "独立民谣",
    duration: 268,
    audio: "/music/不畏风雨.mp3",
    cover: "from-green-500 via-emerald-400 to-teal-300",
    color: "#10b981",
    lyrics: [
      { time: 0, text: "♪ 器乐前奏 ♪" },
      { time: 12, text: "不畏雨 不畏风" },
      { time: 20, text: "也不畏冬雪 和酷暑" },
      { time: 28, text: "有一个结实的身体" },
      { time: 36, text: "无欲无求 绝不发怒" },
      { time: 44, text: "总是平静微笑" },
      { time: 54, text: "一日食玄米半升" },
      { time: 62, text: "以及味噌 和少许蔬菜" },
      { time: 70, text: "对所有事情 不过分思虑" },
      { time: 78, text: "多听多看 洞察铭记" },
      { time: 86, text: "居住在原野松林荫下" },
      { time: 94, text: "小小的茅草屋" },
      { time: 104, text: "东边有孩子生病 就去看护照顾" },
      { time: 114, text: "西边有母亲劳累 就去帮她扛起稻束" },
      { time: 124, text: "南边有人垂危 就去告诉他莫要怕" },
      { time: 134, text: "北边有争吵或冲突 就去说这很无聊请停止" },
      { time: 146, text: "干旱时流下眼泪" },
      { time: 154, text: "冷夏时坐立不安" },
      { time: 162, text: "大家喊我傻瓜" },
      { time: 170, text: "不被赞美 也不受苦" },
      { time: 180, text: "我想成为" },
      { time: 186, text: "我想成为" },
      { time: 192, text: "这样的人……" },
      { time: 204, text: "东边有孩子生病 就去看护照顾" },
      { time: 214, text: "西边有母亲劳累 就去帮她扛起稻束" },
      { time: 224, text: "南边有人垂危 就去告诉他莫要怕" },
      { time: 234, text: "北边有争吵或冲突 就去说这很无聊请停止" },
      { time: 246, text: "大家喊我傻瓜" },
      { time: 252, text: "不被赞美 也不受苦" },
      { time: 258, text: "我想成为" },
      { time: 264, text: "这样的人……" },
      { time: 266, text: "(耳语) 这样的人" },
      { time: 268, text: "♪ 淡出 ♪" },
    ],
  },
]

const IS_OFFLINE =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes("placeholder")

export default function useSongs() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSongs = useCallback(async () => {
    // Offline mode — use bundled data
    if (IS_OFFLINE) {
      setSongs(OFFLINE_SONGS)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from("songs")
      .select("*, lyrics(*)")
      .order("created_at", { ascending: false })
      .order("sort_order", { foreignTable: "lyrics", ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const shaped = (data || []).map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      duration: song.duration,
      audio: getPublicAudioUrl(song.audio_path),
      cover: song.cover,
      color: song.color,
      lyrics: (song.lyrics || []).map((l) => ({ time: l.time, text: l.text })),
    }))

    setSongs(shaped)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  return { songs, loading, error, refetch: fetchSongs }
}
