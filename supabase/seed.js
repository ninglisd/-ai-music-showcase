// Seed script — run ONCE to migrate existing songs.js data into Supabase
// Usage: node supabase/seed.js
// Requires environment variables:
//   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_ANON_KEY
// Read them from a .env file or set them before running.

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

// Try to load .env manually (simplified dotenv)
function loadEnv() {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const envPath = resolve(__dirname, "..", ".env.local")
    const content = readFileSync(envPath, "utf-8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {}
}
loadEnv()

if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  console.error("Set them in .env.local or as environment variables")
  process.exit(1)
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// Existing songs data (copied from songs.js)
const songs = [
  {
    title: "时之圆",
    artist: "LINING&SUNO AI",
    genre: "氛围民谣",
    duration: 236,
    audio_path: "时之圆.mp3",
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
    title: "莎莉花园",
    artist: "LINING&SUNO AI",
    genre: "独立民谣",
    duration: 317,
    audio_path: "莎莉花园.mp3",
    cover: "from-amber-500 via-yellow-400 to-lime-300",
    color: "#d97706",
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
    title: "二十亿光年的孤独",
    artist: "LINING&SUNO AI",
    genre: "日式摇滚",
    duration: 262,
    audio_path: "二十亿光年的孤独.mp3",
    cover: "from-slate-800 via-blue-600 to-cyan-400",
    color: "#2563eb",
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
    title: "不畏风雨",
    artist: "LINING&SUNO AI",
    genre: "独立民谣",
    duration: 268,
    audio_path: "不畏风雨.mp3",
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

async function seed() {
  console.log(`Seeding ${songs.length} songs...`)

  for (const song of songs) {
    const { lyrics, ...songData } = song

    // Insert song
    const { data: created, error: songErr } = await supabase
      .from("songs")
      .insert(songData)
      .select()
      .single()

    if (songErr) {
      console.error(`Failed to insert "${song.title}":`, songErr.message)
      continue
    }

    console.log(`✓ ${created.title} (${created.id})`)

    // Insert lyrics
    if (lyrics.length > 0) {
      const lyricRows = lyrics.map((l, i) => ({
        song_id: created.id,
        time: l.time,
        text: l.text,
        sort_order: i,
      }))

      const { error: lyricErr } = await supabase.from("lyrics").insert(lyricRows)
      if (lyricErr) {
        console.error(`  ✗ Lyrics failed:`, lyricErr.message)
      } else {
        console.log(`  └─ ${lyricRows.length} lyrics inserted`)
      }
    }
  }

  console.log("\nDone! Upload MP3 files manually via Supabase Dashboard → Storage → music bucket")
  console.log("Files to upload from public/music/:")
  for (const song of songs) {
    console.log(`  - ${song.audio_path}`)
  }
}

seed()
