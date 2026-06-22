import { useState, useRef, useEffect } from "react"
import { usePlayer } from "../context/PlayerContext"

/* ── QR 码（简易 SVG 格子）── */
function QRCode({ url }) {
  // 用 Google Charts API 生成 QR 码
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}&bgcolor=14,14,20&color=255,255,255`
  return <img src={qrUrl} alt="QR" className="w-[120px] h-[120px] rounded-lg" />
}

/* ── 分享菜单 ── */
function ShareMenu({ song, onClose }) {
  const [qrPlatform, setQrPlatform] = useState(null)
  const menuRef = useRef(null)
  const url = `https://www.audioverse.top/?song=${encodeURIComponent(song.title)}`
  const text = `${song.title} - ${song.artist} · AI Music`

  useEffect(() => {
    function handleClick(e) { if (menuRef.current && !menuRef.current.contains(e.target)) onClose() }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const platforms = [
    { name: "Twitter",  icon: "X", color: "#1DA1F2",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank") },
    { name: "Facebook", icon: "f", color: "#1877F2",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank") },
    { name: "抖音",     icon: "♪", color: "#FF0050",
      action: () => setQrPlatform("抖音") },
    { name: "微信",     icon: "💬", color: "#07C160",
      action: () => setQrPlatform("微信") },
  ]

  if (qrPlatform) {
    return (
      <div ref={menuRef} onClick={(e) => e.stopPropagation()}
        className="absolute top-10 right-0 z-30 w-44 rounded-xl overflow-hidden
                   bg-[rgba(20,20,28,0.97)] backdrop-blur-2xl
                   border border-white/[0.10] shadow-2xl shadow-black/50
                   animate-[fadeIn_0.15s_ease-out] p-4 text-center">
        <button onClick={() => setQrPlatform(null)}
          className="absolute top-2 right-2 text-white/30 hover:text-white/60 p-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <p className="text-[11px] text-white/40 mb-3" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
          手机扫码分享到{qrPlatform}
        </p>
        <div className="inline-block rounded-lg overflow-hidden border border-white/[0.08]">
          <QRCode url={url} />
        </div>
      </div>
    )
  }

  return (
    <div ref={menuRef} onClick={(e) => e.stopPropagation()}
      className="absolute top-10 right-0 z-30 w-40 rounded-xl overflow-hidden
                 bg-[rgba(20,20,28,0.95)] backdrop-blur-2xl
                 border border-white/[0.10] shadow-2xl shadow-black/50
                 animate-[fadeIn_0.15s_ease-out]">
      {platforms.map((p) => (
        <button key={p.name} onClick={p.action}
          className="w-full flex items-center gap-3 px-4 py-2.5
                     hover:bg-white/[0.06] transition-colors text-left">
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: p.color }}>
            {p.icon}
          </span>
          <span className="text-[13px] text-white/75 font-medium"
            style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
            {p.name}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ── 每首歌独立配色 ── */
const songPalettes = {
  "白昼将尽":     { bg: ["#c0392b", "#8b1a1a", "#5c1010", "#2d0808"], accent: "#e05030" },
  "葬花吟":       { bg: ["#4a154b", "#7b2d8b", "#2d1b3d", "#1a0a20"], accent: "#c97bdb" },
  "裂痕之舞":     { bg: ["#0d3b4f", "#155e6d", "#0a2a38", "#1a4a5c"], accent: "#30b8c0" },
  "西西弗斯幸福": { bg: ["#0f0f23", "#1a1a3e", "#0d1b2d", "#162040"], accent: "#00e5ff" },
  "时之圆":       { bg: ["#1a1a3e", "#2d2d6b", "#1a2a4a", "#252560"], accent: "#7b8cff" },
  "不畏风雨":     { bg: ["#0d2818", "#1a4a2a", "#0f3018", "#1a3d20"], accent: "#40c060" },
  "莎莉花园":     { bg: ["#3d2010", "#5c3a1a", "#4a2a10", "#2a1808"], accent: "#e0a030" },
  "二十亿光年的孤独": { bg: ["#0a1030", "#151d50", "#0d1440", "#121848"], accent: "#4080ff" },
  "我想成为这样的人": { bg: ["#2d2510", "#3d3818", "#2a200c", "#1a1808"], accent: "#e0c040" },
  "破阵乐":       { bg: ["#3d0a0a", "#5c1010", "#2d0000", "#1a0505"], accent: "#e84020" },
}

const defaultPalette = { bg: ["#1a1a2e", "#2d1b4e", "#1a1a3e", "#251845"], accent: "#8b5cf6" }

// 自动为新歌生成配色
const HUE = [0,15,30,45,60,120,180,210,240,270,300,330]
function autoPalette(title) {
  let h = 0; for (let i=0;i<title.length;i++) h = ((h<<5)-h+title.charCodeAt(i))|0; h = Math.abs(h)
  const hue = HUE[h%HUE.length], sat = 45 + (h%35), l = 22 + (h%10)
  return {
    bg: [`hsl(${hue},${sat}%,${l}%)`,`hsl(${(hue+25)%360},${sat-8}%,${l-5}%)`,`hsl(${(hue+15)%360},${sat-14}%,${l-10}%)`,`hsl(${hue},${sat-18}%,${l-15}%)`],
    accent: `hsl(${hue},${sat+15}%,${l+12}%)`,
  }
}
function getPal(title) { return songPalettes[title] || autoPalette(title) }

/* ── 每首歌独立动态图案 ── */
function AnimatedPattern({ song }) {
  const title = song.title
  const pal = getPal(title)
  const c = pal.accent

  const shared = (el, i) => ({
    key: i,
    stroke: c, fill: "none", strokeWidth: "0.5",
    opacity: 0.25 + Math.random() * 0.25,
  })

  /* 白昼将尽 — 闪电/射线 */
  if (title === "白昼将尽") {
    const bolts = []
    for (let i = 0; i < 8; i++) {
      const x1 = 10 + Math.random() * 80, y1 = -5
      const mx = x1 + (Math.random() - 0.5) * 30, my = 30 + Math.random() * 30
      const x2 = x1 + (Math.random() - 0.5) * 50, y2 = 110
      const d = `M${x1} ${y1} L${mx} ${my} L${x1 + 5} ${my + 5} L${x2} ${y2}`
      bolts.push(
        <g key={i} opacity={0.12 + Math.random() * 0.2}>
          <path d={d} stroke={c} strokeWidth={0.6 + Math.random() * 1.2} fill="none"
            strokeLinecap="round" strokeLinejoin="round">
            <animate attributeName="opacity" values="0.05;0.3;0.05" dur={`${2 + Math.random() * 4}s`} repeatCount="indefinite" begin={`${Math.random() * 3}s`} />
          </path>
        </g>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{bolts}</svg>
  }

  /* 葬花吟 — 飘落花瓣 */
  if (title === "葬花吟") {
    const petals = []
    for (let i = 0; i < 12; i++) {
      const x = 15 + Math.random() * 70; const s = 2 + Math.random() * 4
      const d = `M${x} ${-10} Q${x + s} ${10 + Math.random() * 20} ${x} ${20 + Math.random() * 30} Q${x - s} ${10 + Math.random() * 20} ${x} ${-10}Z`
      petals.push(
        <path key={i} d={d} fill={c} opacity={0.06 + Math.random() * 0.1}>
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; ${(Math.random()-0.5)*15},110`}
            dur={`${8 + Math.random() * 10}s`} repeatCount="indefinite" begin={`${Math.random() * 6}s`} />
          <animate attributeName="opacity" values="0.15;0.02;0.15" dur={`${6 + Math.random() * 6}s`} repeatCount="indefinite" />
        </path>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{petals}</svg>
  }

  /* 裂痕之舞 — 晶格裂痕 */
  if (title === "裂痕之舞") {
    const lines = []
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2; const r = 25
      const cx = 50; const cy = 50
      lines.push(
        <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r}
          stroke={c} strokeWidth="0.3" opacity="0.2">
          <animateTransform attributeName="transform" type="rotate" from={`${i * 30}`} to={`${360 + i * 30}`} dur={`${12 + i * 3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur="5s" repeatCount="indefinite" />
        </line>
      )
    }
    for (let i = 0; i < 3; i++) {
      lines.push(
        <polygon key={`tri-${i}`} points={`${30 + i * 15},30 ${35 + i * 15},60 ${25 + i * 15},60`}
          stroke={c} strokeWidth="0.4" fill="none" opacity="0.15">
          <animate attributeName="opacity" values="0.05;0.25;0.05" dur={`${4 + i * 2}s`} repeatCount="indefinite" begin={`${i}s`} />
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur={`${6 + i * 2}s`} repeatCount="indefinite" />
        </polygon>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{lines}</svg>
  }

  /* 西西弗斯幸福 — 赛博网格 */
  if (title === "西西弗斯幸福") {
    const grid = []
    for (let i = 0; i < 5; i++) {
      grid.push(<line key={`h${i}`} x1="0" y1={20 + i * 16} x2="100" y2={20 + i * 16} stroke={c} strokeWidth="0.3" opacity="0.12">
        <animate attributeName="opacity" values="0.05;0.2;0.05" dur={`${3 + i * 1.5}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
      </line>)
      grid.push(<line key={`v${i}`} x1={20 + i * 16} y1="0" x2={20 + i * 16} y2="100" stroke={c} strokeWidth="0.3" opacity="0.12">
        <animate attributeName="opacity" values="0.05;0.2;0.05" dur={`${3 + i * 1.5}s`} repeatCount="indefinite" begin={`${i * 0.7 + 1}s`} />
      </line>)
    }
    for (let i = 0; i < 5; i++) {
      grid.push(
        <rect key={`dot-${i}`} x={10 + Math.random() * 80} y={10 + Math.random() * 80} width="1.5" height="1.5" rx="0.75" fill={c} opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.6;0.1" dur={`${1.5 + Math.random() * 2}s`} repeatCount="indefinite" begin={`${Math.random() * 3}s`} />
        </rect>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{grid}</svg>
  }

  /* 时之圆 — 同心圆涟漪 */
  if (title === "时之圆") {
    const circles = []
    for (let i = 0; i < 5; i++) {
      circles.push(
        <circle key={i} cx="50" cy="50" r={10 + i * 15} stroke={c} strokeWidth="0.4" fill="none" opacity="0.15">
          <animate attributeName="r" values={`${8 + i * 12};${14 + i * 15};${8 + i * 12}`} dur={`${6 + i * 2}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
          <animate attributeName="opacity" values="0.08;0.22;0.08" dur={`${5 + i * 2}s`} repeatCount="indefinite" />
        </circle>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{circles}</svg>
  }

  /* 不畏风雨 — 雨滴 + 叶片 */
  if (title === "不畏风雨") {
    const drops = []
    for (let i = 0; i < 15; i++) {
      drops.push(
        <line key={i} x1={10 + Math.random() * 80} y1={-5 - Math.random() * 20} x2={10 + Math.random() * 80} y2={-5 - Math.random() * 20 + 6}
          stroke={c} strokeWidth="0.5" strokeLinecap="round" opacity="0.2">
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; ${(Math.random()-0.5)*8},110`}
            dur={`${1.5 + Math.random() * 3}s`} repeatCount="indefinite" begin={`${Math.random() * 4}s`} />
          <animate attributeName="opacity" values="0.25;0.05" dur={`${1.5 + Math.random() * 3}s`} repeatCount="indefinite" begin={`${Math.random() * 4}s`} />
        </line>
      )
    }
    for (let i = 0; i < 3; i++) {
      const cx = 30 + i * 20; const cy = 50 + Math.sin(i * 1.5) * 15
      drops.push(
        <ellipse key={`leaf-${i}`} cx={cx} cy={cy} rx="6" ry="3" stroke={c} strokeWidth="0.4" fill={`${c}10`}
          transform={`rotate(${15 + i * 10}, ${cx}, ${cy})`} opacity="0.18">
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; ${2 - i * 2},${-3 - i * 2}; 0,0`}
            dur={`${4 + i * 2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur={`${5 + i}s`} repeatCount="indefinite" />
        </ellipse>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{drops}</svg>
  }

  /* 莎莉花园 — 有机浮游形态 */
  if (title === "莎莉花园") {
    const blobs = []
    for (let i = 0; i < 4; i++) {
      const r = 6 + Math.random() * 8; const cx = 20 + i * 20; const cy = 40 + Math.sin(i) * 20
      const d = `M${cx - r} ${cy} Q${cx} ${cy - r * 1.5} ${cx + r} ${cy} Q${cx} ${cy + r * 1.5} ${cx - r} ${cy}Z`
      blobs.push(
        <path key={i} d={d} fill={`${c}12`} stroke={c} strokeWidth="0.3" opacity="0.2">
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; ${3 - i * 2},${-5 + i}; 0,0`}
            dur={`${6 + i * 3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${5 + i * 2}s`} repeatCount="indefinite" />
        </path>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{blobs}</svg>
  }

  /* 二十亿光年的孤独 — 星点+星座连线 */
  if (title === "二十亿光年的孤独") {
    const stars = []
    const pts = []
    for (let i = 0; i < 25; i++) {
      pts.push({ x: Math.random() * 100, y: Math.random() * 100 })
      stars.push(
        <circle key={i} cx={pts[i].x} cy={pts[i].y} r={0.4 + Math.random() * 1.2} fill={c} opacity={0.15 + Math.random() * 0.4}>
          <animate attributeName="opacity" values={`${0.1 + Math.random() * 0.2};${0.4 + Math.random() * 0.4};${0.1 + Math.random() * 0.2}`}
            dur={`${2 + Math.random() * 4}s`} repeatCount="indefinite" begin={`${Math.random() * 3}s`} />
        </circle>
      )
    }
    for (let i = 0; i < 4; i++) {
      const a = pts[i * 3]; const b = pts[i * 3 + 1]
      if (a && b) stars.push(
        <line key={`link-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth="0.2" opacity="0.1">
          <animate attributeName="opacity" values="0.05;0.2;0.05" dur="6s" repeatCount="indefinite" begin={`${i * 2}s`} />
        </line>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{stars}</svg>
  }

  /* 我想成为这样的人 — 禅意波纹 */
  if (title === "我想成为这样的人") {
    const zen = []
    for (let i = 0; i < 6; i++) {
      zen.push(
        <path key={i} d={`M${5} ${30 + i * 10} Q${30} ${25 + i * 10} ${50} ${30 + i * 10} T${95} ${30 + i * 10}`}
          stroke={c} strokeWidth="0.4" fill="none" opacity="0.12">
          <animate attributeName="opacity" values="0.05;0.2;0.05" dur={`${5 + i * 2}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
          <animateTransform attributeName="transform" type="translate" values="0,0; -3,0; 0,0" dur={`${8 + i * 2}s`} repeatCount="indefinite" />
        </path>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{zen}</svg>
  }

  /* 破阵乐 — 几何菱形/盾形 */
  if (title === "破阵乐") {
    const shields = []
    for (let i = 0; i < 5; i++) {
      const cx = 20 + i * 16; const cy = 40 + (i % 2) * 25; const s = 6 + i * 0.5
      shields.push(
        <polygon key={i} points={`${cx},${cy - s} ${cx + s * 0.7},${cy} ${cx},${cy + s} ${cx - s * 0.7},${cy}`}
          stroke={c} strokeWidth="0.5" fill={`${c}08`} opacity="0.18">
          <animate attributeName="opacity" values="0.08;0.3;0.08" dur={`${4 + i * 1.5}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
          <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur={`${5 + i * 2}s`} repeatCount="indefinite" />
        </polygon>
      )
    }
    return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">{shields}</svg>
  }

  /* 其他歌曲：通用流动线条 */
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${-10 + i * 30} ${-10} Q${50 + i * 10} ${60 + i * 5} ${110 + i * 20} ${110}`}
          stroke={c} strokeWidth="0.3" fill="none" opacity="0.1">
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; ${5 - i * 2},${-5 + i * 3}; 0,0`}
            dur={`${8 + i * 3}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  )
}

/* ── 静态渐变背景 ── */
function AMGradient({ song }) {
  const pal = getPal(song.title)
  return (
    <div className="absolute inset-0" style={{
      background: `linear-gradient(155deg, ${pal.bg[0]} 0%, ${pal.bg[1]} 35%, ${pal.bg[2]} 70%, ${pal.bg[3]} 100%)`,
    }}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 65% 45% at 25% 15%, rgba(255,255,255,0.07) 0%, transparent 55%)`,
      }} />
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to top, rgba(0,0,0,0.40) 0%, transparent 30%)`,
      }} />
    </div>
  )
}

export default function MusicCard({ song, index }) {
  const { play, currentIndex, isPlaying, toggleLike } = usePlayer()
  const active = currentIndex === index && isPlaying
  const [showShare, setShowShare] = useState(false)

  function handleLike(e) { e.stopPropagation(); toggleLike?.(song.id, song.isLiked) }

  return (
    <div
      onClick={() => play(index)}
      className="group relative rounded-[18px] overflow-hidden cursor-pointer
                 transition-all duration-500 ease-out
                 hover:-translate-y-[3px] hover:shadow-xl"
      style={{
        aspectRatio: "1/1",
        boxShadow: `0 2px 12px rgba(0,0,0,0.35)`,
      }}
    >
      <AMGradient song={song} />
      <AnimatedPattern song={song} />

      {/* 左上角分类标签 */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="text-[10px] font-medium tracking-wider text-white/45 uppercase"
          style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
          {song.genre}
        </span>
      </div>

      {/* 右上角 转发+点赞 */}
      <div className="absolute top-2.5 right-2.5 z-20 flex gap-1">
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setShowShare(!showShare) }}
            className="p-1.5 rounded-full bg-black/25 backdrop-blur-sm
                       border border-white/[0.08] hover:border-white/[0.20]
                       text-white/50 hover:text-white/85
                       transition-all duration-200 hover:scale-110">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
          {showShare && <ShareMenu song={song} onClose={() => setShowShare(false)} />}
        </div>
        <button onClick={handleLike}
          className="flex items-center gap-1 p-1.5 rounded-full bg-black/25 backdrop-blur-sm
                     border border-white/[0.08] hover:border-white/[0.20]
                     transition-all duration-200 hover:scale-110"
          style={{ color: song.isLiked ? "#ff2d55" : "rgba(255,255,255,0.5)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={song.isLiked ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-[11px] font-semibold" style={{fontFamily:"-apple-system,'SF Pro Text',sans-serif"}}>{song.likeCount || 0}</span>
        </button>
      </div>

      {/* 底部：标题+歌手(左) + 播放按钮(右) */}
      <div className="absolute left-3.5 right-3.5 bottom-3.5 z-10 flex items-end justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-[15px] font-semibold text-white leading-snug tracking-tight truncate"
            style={{
              fontFamily: "-apple-system, 'SF Pro Display', 'Inter', sans-serif",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
            {song.title}
          </h3>
          <p className="text-[12px] text-white/60 mt-0.5 leading-tight truncate"
            style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
            {song.artist}
          </p>
        </div>

        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-350 ease-out
                        translate-y-2 group-hover:translate-y-0">
          <div className="w-10 h-10 rounded-full bg-white/95
                          flex items-center justify-center
                          shadow-lg shadow-black/30
                          hover:scale-105 transition-transform duration-200">
            {active ? (
              <div className="flex gap-[3px]">
                <span className="w-[3px] h-3 bg-black/80 rounded-full" />
                <span className="w-[3px] h-3.5 bg-black/80 rounded-full" />
              </div>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="black" className="ml-0.5">
                <polygon points="6,2 20,12 6,22" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
