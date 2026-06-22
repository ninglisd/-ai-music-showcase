import { useState, useEffect, useCallback } from "react"
import { supabase, getPublicAudioUrl, getAnonymousId } from "../lib/supabase"

const OFFLINE_SONGS = [
  {
    id: "5",
    title: "白昼将尽",
    artist: "LINING&SUNO AI",
    genre: "诗意摇滚",
    duration: 280,
    audio: "/music/bai-zhou-jiang-jin.mp3",
    cover: "from-amber-500 via-orange-400 to-red-300",
    color: "#e07020",
    likeCount: 0, isLiked: false, comments: [],
    lyrics: [],
  },
  {
    id: "6",
    title: "葬花吟",
    artist: "LINING&SUNO AI",
    genre: "古风流行",
    duration: 209,
    audio: "/music/1779614955874-xh9gvz.mp3",
    cover: "from-violet-600 via-purple-500 to-cyan-400",
    color: "#f75fea",
    likeCount: 0, isLiked: false, comments: [],
    lyrics: [],
  },
  {
    id: "7",
    title: "裂痕之舞",
    artist: "LINING&SUNO AI",
    genre: "World Music",
    duration: 314,
    audio: "/music/1779610209603-61juee.mp3",
    cover: "from-violet-600 via-purple-500 to-cyan-400",
    color: "#5c66f6",
    likeCount: 0, isLiked: false, comments: [],
    lyrics: [],
  },
  {
    id: "8",
    title: "西西弗斯幸福",
    artist: "LINING&SUNO AI",
    genre: "赛博朋克",
    duration: 300,
    audio: "/music/1779601979702-8ps5v8.mp3",
    cover: "from-violet-600 via-purple-500 to-cyan-400",
    color: "#a3f75f",
    likeCount: 0, isLiked: false, comments: [],
    lyrics: [],
  },
  {
    id: "1",
    title: "时之圆",
    artist: "LINING&SUNO AI",
    genre: "氛围民谣",
    duration: 236,
    audio: "/music/时之圆.mp3",
    cover: "from-violet-600 via-purple-500 to-cyan-400",
    color: "#5c66f6",
    likeCount: 0,
    isLiked: false,
    comments: [],
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
    likeCount: 0,
    isLiked: false,
    comments: [],
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
  {
    id: "3",
    title: "莎莉花园",
    artist: "LINING&SUNO AI",
    genre: "独立民谣",
    duration: 317,
    audio: "/music/莎莉花园.mp3",
    cover: "from-amber-500 via-yellow-400 to-lime-300",
    color: "#d97706",
    likeCount: 0,
    isLiked: false,
    comments: [],
    lyrics: [
      { time: 0, text: "♪ 前奏 ♪" },
      { time: 18, text: "柳树园旁那一天，我和爱人曾相见" },
      { time: 27, text: "她那雪白的小脚，轻轻走过草中间" },
      { time: 36, text: "她劝我爱要从容，如树叶顺应自然" },
      { time: 45, text: "可我年少太无知，固执不听她良言" },
      { time: 56, text: "爱如树叶在生长，生活如青草蔓延" },
      { time: 65, text: "顺其自然去爱吧，何必纠结那誓言" },
      { time: 74, text: "可我年少太无知，不懂她温柔深远" },
      { time: 83, text: "直到如今一转身，只剩泪水流满面" },
      { time: 93, text: "流满面" },
      { time: 106, text: "依依依傍小河畔，我和爱人并肩站" },
      { time: 115, text: "她把雪白的手掌，轻搭在我肩头边" },
      { time: 124, text: "她劝我顺应生活，如青草爬满堤堰" },
      { time: 133, text: "可我年少太无知，如今泪流满满面" },
      { time: 144, text: "爱如树叶在生长，生活如青草蔓延" },
      { time: 153, text: "顺其自然去爱吧，何必纠结那誓言" },
      { time: 162, text: "可我年少太无知，不懂她温柔深远" },
      { time: 171, text: "直到如今一转身，只剩泪水流满面" },
      { time: 188, text: "当年不懂她的泪，当年不懂她的劝" },
      { time: 198, text: "岁月匆匆流走后，物是人非已多年" },
      { time: 215, text: "爱如树叶在生长，生活如青草蔓延" },
      { time: 224, text: "顺其自然去爱吧，何必纠结那誓言" },
      { time: 233, text: "可我年少太无知，不懂她温柔深远" },
      { time: 242, text: "直到如今一转身，只剩泪水流满面" },
      { time: 262, text: "柳树园旁……" },
      { time: 276, text: "年少无知……" },
      { time: 290, text: "泪流满面……" },
      { time: 310, text: "♪ 淡出 ♪" },
    ],
  },
  {
    id: "4",
    title: "二十亿光年的孤独",
    artist: "LINING&SUNO AI",
    genre: "日式摇滚",
    duration: 262,
    audio: "/music/二十亿光年的孤独.mp3",
    cover: "from-slate-800 via-blue-600 to-cyan-400",
    color: "#2563eb",
    likeCount: 0,
    isLiked: false,
    comments: [],
    lyrics: [
      { time: 0, text: "♪ 前奏 ♪" },
      { time: 18, text: "人类在小小的球体上 —" },
      { time: 26, text: "在深夜睡去 在清晨醒来" },
      { time: 34, text: "我们默默劳动 仰望着星海" },
      { time: 42, text: "有时也渴望着 火星上有同类存在" },
      { time: 54, text: "火星人在他的小球体上 —" },
      { time: 62, text: "也许在做梦 也许在恋爱" },
      { time: 70, text: "我不知道他 正经历什么时代" },
      { time: 78, text: "但渴望伙伴的心 必然是一样的期待" },
      { time: 90, text: "所谓的万有引力 —" },
      { time: 98, text: "是相互吸引 孤独的力！" },
      { time: 106, text: "宇宙正在倾斜 所以大家渴望相识" },
      { time: 116, text: "宇宙正渐渐膨胀 所以大家感到不安" },
      { time: 126, text: "在二十亿光年的寂静里 寻找着你" },
      { time: 142, text: "黑夜无边 繁星多么璀璨" },
      { time: 150, text: "隔着光年 彼此大声呼喊" },
      { time: 158, text: "两个球体 如此遥远又如此纠缠" },
      { time: 166, text: "在这未知的深空中 相互试探" },
      { time: 178, text: "所谓的万有引力 —" },
      { time: 186, text: "是相互吸引 孤独的力！" },
      { time: 194, text: "宇宙正在倾斜 所以大家渴望相识" },
      { time: 204, text: "宇宙正渐渐膨胀 所以大家感到不安" },
      { time: 214, text: "在二十亿光年的寂静里 寻找着你" },
      { time: 228, text: "时间走过 漫长的光年" },
      { time: 236, text: "空间跨越 无限的深渊" },
      { time: 244, text: "在这无声的 巨大的荒野……" },
      { time: 250, text: "向着这二十亿光年的孤独 —" },
      { time: 254, text: "我情不自禁地……" },
      { time: 258, text: "打了一个喷嚏……" },
      { time: 260, text: "♪ 淡出 ♪" },
    ],
  },
  {
    id: "9",
    title: "我想成为这样的人",
    artist: "LINING&SUNO AI",
    genre: "世界音乐",
    duration: 319,
    audio: "/music/i-want-to-be-such-a-person.mp3",
    cover: "from-amber-500 via-orange-400 to-rose-400",
    color: "#f59e0b",
    likeCount: 0, isLiked: false, comments: [],
    lyrics: [{"time": 22, "text": "雨ニモマケズ 風ニモマケズ / 不畏风雨 不畏风"}, {"time": 32, "text": "雪ニモ夏ノ暑サニモマケヌ / 亦不畏雪与夏日的酷暑"}, {"time": 44, "text": "丈夫ナカラダヲモチ 慾ハナク / 拥有结实的体魄 无欲无求"}, {"time": 51, "text": "決シテ瞋ラズ イツモシズカニワラッテヰル / 绝不嗔怒 总是静静地微笑"}, {"time": 62, "text": "一日ニ玄米四合ト / 一日吃四合玄米"}, {"time": 65, "text": "味噌ト少シノ野菜ヲタベ / 拌以味噌和少许蔬菜"}, {"time": 76, "text": "アラユルコトヲ ジブンヲカンジョウニ入レズニ / 对一切事物 不从自己的角度去考量"}, {"time": 83, "text": "ヨクミキキシワカリ ソシテワスレズ / 仔细观察 用心聆听 并将之铭记于心"}, {"time": 90, "text": "野原ノ松ノ林ノ蔭ノ 小サナ萓ブキノ小屋ニヰテ / 在这旷野松林荫下 那小小的茅屋之中"}, {"time": 101, "text": "東ニ病気ノコドモアレバ 行ッテ看病シテヤリ / 若东边有生病的孩子 就去照看，细心呵护"}, {"time": 109, "text": "西ニツカレタ母アレバ 行ッテソノ稲ノ朿ヲ負ヒ / 若西边有疲惫的母亲 就去替她背起沉重的禾束"}, {"time": 115, "text": "南ニ死ニサウナ人アレバ 行ッテコハガラナクテモイヽトイヒ / 若南边有濒死的人 就去宽慰，不必害怕"}, {"time": 124, "text": "北ニケンクヮヤソショウガアレバ ツマラナイカラヤメロトイヒ / 若北边有争吵与诉讼 就去劝阻，那毫无意义"}, {"time": 129, "text": "ヒドリノトキハナミダヲナガシ / 干旱之时流下眼泪"}, {"time": 137, "text": "サムサノナツハオロオロアルキ / 寒暑交加之时焦灼徘徊"}, {"time": 142, "text": "ミンニニデクノボートヨバレ / 人们都叫我木偶"}, {"time": 148, "text": "ホメラレモセズ クニモサレズ / 不被褒奖 亦不被苦恼"}, {"time": 154, "text": "サウイフモノニ…… / 我想成为的……"}, {"time": 158, "text": "ワタシハナリタイ / 就是这样的人"}],
  },
  {
    id: "10",
    title: "破阵乐",
    artist: "LINING&SUNO AI",
    genre: "国风摇滚",
    duration: 246,
    audio: "/music/1779696339405-e5n3qz.mp3",
    cover: "from-red-600 via-amber-500 to-yellow-400",
    color: "#dc2626",
    likeCount: 0, isLiked: false, comments: [],
    lyrics: [{"time": 0, "text": "♪ 悲凉古筝 沉重战鼓 ♪"}, {"time": 28, "text": "醉里挑灯看剑，梦回吹角连营……"}, {"time": 32, "text": "醉里挑灯看剑 梦回吹角连营"}, {"time": 36, "text": "八百里 分麾下炙 麾下炙"}, {"time": 40, "text": "五十弦 翻塞外声 塞外声"}, {"time": 44, "text": "沙场秋点兵！沙场秋点兵！"}, {"time": 48, "text": "马作的卢飞快"}, {"time": 52, "text": "弓如霹雳弦惊"}, {"time": 56, "text": "雷霆万钧 撕裂黑夜"}, {"time": 60, "text": "铁骑狂奔 踏碎疆界"}, {"time": 64, "text": "了却君王天下事！天下事！"}, {"time": 70, "text": "赢得生前身后名！身后名！"}, {"time": 76, "text": "驱散风沙 踏破贺兰山缺！"}, {"time": 82, "text": "了却君王天下事！天下事！"}, {"time": 90, "text": "♪ 重金属间奏 ♪"}, {"time": 95, "text": "看江山残破 谁在叹息"}, {"time": 99, "text": "提长枪纵马 跨过长河万里"}, {"time": 103, "text": "八百里分麾下炙 赏赐给兄弟"}, {"time": 107, "text": "五十弦翻塞外声 战歌正响起"}, {"time": 111, "text": "点兵！点兵！沙场秋点兵！"}, {"time": 116, "text": "了却君王天下事！天下事！"}, {"time": 121, "text": "赢得生前身后名！身后名！"}, {"time": 126, "text": "驱散风沙 踏破贺兰山缺！"}, {"time": 131, "text": "了却君王天下事！天下事！"}, {"time": 138, "text": "♪ 悲怆独奏 ♪"}, {"time": 144, "text": "可怜……"}, {"time": 149, "text": "可怜白发生……"}, {"time": 154, "text": "白发生……"}, {"time": 160, "text": "梦醒了。"}, {"time": 165, "text": "只剩一头白发……"}, {"time": 172, "text": "♪ 战鼓远去 风沙声 ♪"}]
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
    if (IS_OFFLINE) {
      setSongs(OFFLINE_SONGS)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from("songs")
        .select("*, lyrics(*)")
        .order("sort_order", { ascending: true })
        .order("sort_order", { foreignTable: "lyrics", ascending: true })

      if (err) throw err
      if (!data || data.length === 0) {
        setSongs([])
        setLoading(false)
        return
      }

      const songIds = data.map((s) => s.id)
      const uid = getAnonymousId()

      const [{ data: allLikes }, { data: allComments }] = await Promise.all([
        supabase.from("song_likes").select("song_id, anonymous_id").in("song_id", songIds),
        supabase.from("song_comments").select("*").in("song_id", songIds).order("created_at", { ascending: true }),
      ])

      const likesMap = {}
      for (const like of allLikes || []) {
        if (!likesMap[like.song_id]) likesMap[like.song_id] = { count: 0, likedByMe: false }
        likesMap[like.song_id].count++
        if (like.anonymous_id === uid) likesMap[like.song_id].likedByMe = true
      }

      const commentsMap = {}
      for (const c of allComments || []) {
        if (!commentsMap[c.song_id]) commentsMap[c.song_id] = []
        commentsMap[c.song_id].push(c)
      }

      const shaped = data.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        duration: song.duration,
        audio: getPublicAudioUrl(song.audio_path),
        cover: song.cover,
        color: song.color,
        likeCount: likesMap[song.id]?.count || 0,
        isLiked: likesMap[song.id]?.likedByMe || false,
        comments: commentsMap[song.id] || [],
        lyrics: (song.lyrics || []).map((l) => ({ time: l.time, text: l.text })),
      }))

      setSongs(shaped)
    } catch {
      // Supabase unreachable → fall back to local static files
      setSongs(OFFLINE_SONGS)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  const toggleLike = useCallback(async (songId, isLiked) => {
    try {
      const uid = getAnonymousId()
      if (isLiked) {
        await supabase.from("song_likes").delete().eq("song_id", songId).eq("anonymous_id", uid)
      } else {
        await supabase.from("song_likes").insert({ song_id: songId, anonymous_id: uid })
      }
      await fetchSongs()
    } catch {
      // Supabase down, silently ignore
    }
  }, [fetchSongs])

  const addComment = useCallback(async (songId, authorName, content) => {
    try {
      await supabase.from("song_comments").insert({
        song_id: songId,
        author_name: authorName || "匿名用户",
        content,
      })
      await fetchSongs()
    } catch {
      // Supabase down, silently ignore
    }
  }, [fetchSongs])

  return { songs, loading, error, refetch: fetchSongs, toggleLike, addComment }
}
