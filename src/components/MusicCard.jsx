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
  "西西弗斯是幸福的": { bg: ["#f8f4f0", "#f0ebe0", "#f8f4f0", "#ebe4d5"], accent: "#111111" },
  "时之圆":       { bg: ["#1a1a3e", "#2d2d6b", "#1a2a4a", "#252560"], accent: "#7b8cff" },
  "不畏风雨":     { bg: ["#1a1a2e", "#2d2d4e", "#1a1a3e", "#252545"], accent: "#ff6b6b" },
  "莎莉花园":     { bg: ["#3d2010", "#5c3a1a", "#4a2a10", "#2a1808"], accent: "#e0a030" },
  "二十亿光年的孤独": { bg: ["#0a1030", "#151d50", "#0d1440", "#121848"], accent: "#4080ff" },
  "我想成为这样的人": { bg: ["#2d2510", "#3d3818", "#2a200c", "#1a1808"], accent: "#e0c040" },
  "破阵乐":              { bg: ["#3d0a0a", "#5c1010", "#2d0000", "#1a0505"], accent: "#e84020" },
  "破阵子":              { bg: ["#3d0a0a", "#5c1010", "#2d0000", "#1a0505"], accent: "#e84020" },
  "Broken Forever":      { bg: ["#f5e000", "#f0d000", "#e5c000", "#c4a800"], accent: "#f5e000" },
  "Right Where I'm Posed To Be": { bg: ["#c41e1e", "#a01818", "#801010", "#500808"], accent: "#ffffff" },
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

  /* 白昼将尽 — Q弹爱心 */
  if (title === "白昼将尽") {
    // 圆润可爱的Q版爱心路径
    const qHeart = "M50 82 C30 68 12 50 12 28 C12 14 22 5 34 5 C42 5 48 10 50 18 C52 10 58 5 66 5 C78 5 88 14 88 28 C88 50 70 68 50 82Z"
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="qh-grad" cx="40%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#ff6b8a" />
            <stop offset="40%" stopColor="#ff3b5c" />
            <stop offset="80%" stopColor="#d63045" />
            <stop offset="100%" stopColor="#8b1020" />
          </radialGradient>
          <radialGradient id="qh-shine" cx="30%" cy="22%" r="25%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="qh-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* 光晕 */}
        <ellipse cx="50" cy="48" rx="42" ry="44" fill="#ff3b5c" opacity="0.12" filter="url(#qh-glow)">
          <animateTransform attributeName="transform" type="scale" values="1;1.12;1" dur="1.4s" repeatCount="indefinite" />
        </ellipse>
        {/* 主体 */}
        <path d={qHeart} fill="url(#qh-grad)" opacity="0.55" filter="url(#qh-glow)">
          <animateTransform attributeName="transform" type="scale" values="1;1.05;0.97;1.03;1" dur="1.2s" repeatCount="indefinite"
            keyTimes="0;0.3;0.5;0.7;1" calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.2 1; 0.4 0 0.6 1; 0.4 0 0.2 1" />
        </path>
        {/* 高光 */}
        <path d={qHeart} fill="url(#qh-shine)" opacity="0.3">
          <animateTransform attributeName="transform" type="scale" values="1;1.05;0.97;1.03;1" dur="1.2s" repeatCount="indefinite"
            keyTimes="0;0.3;0.5;0.7;1" calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.2 1; 0.4 0 0.6 1; 0.4 0 0.2 1" />
        </path>
      </svg>
    )
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

  /* 西西弗斯是幸福的 — 蒙德里安《红蓝黄构图》*/
  if (title === "西西弗斯是幸福的") {
    const BLACK = "#111111"
    // 经典蒙德里安：白底+粗黑线+红黄蓝三原色块
    const rects = [
      // 大红块 (左上区域，视觉焦点)
      { x: 3, y: 3, w: 44, h: 52, color: "#e63946" },
      // 小蓝块 (右侧中部)
      { x: 82, y: 38, w: 15, h: 18, color: "#1d3557" },
      // 小黄块 (右下)
      { x: 82, y: 72, w: 15, h: 11, color: "#ffd166" },
      // 白/浅灰区域 (左下方)
      { x: 3, y: 69, w: 52, h: 15, color: "#f0ece4" },
      // 白区域 (右上)
      { x: 58, y: 3, w: 13, h: 24, color: "#f5f1eb" },
      // 白区域 (中右)
      { x: 58, y: 38, w: 13, h: 18, color: "#e8e2d8" },
    ]
    // 黑线：横向 + 纵向
    const lines = [
      // 水平线
      { x1: 3, y1: 55, x2: 97, y2: 55, w: 3 },
      { x1: 3, y1: 29, x2: 71, y2: 29, w: 2.5 },
      { x1: 58, y1: 72, x2: 97, y2: 72, w: 3 },
      { x1: 3, y1: 84, x2: 55, y2: 84, w: 2 },
      // 垂直线
      { x1: 47, y1: 3, x2: 47, y2: 97, w: 3 },
      { x1: 58, y1: 29, x2: 58, y2: 97, w: 2 },
      { x1: 71, y1: 3, x2: 71, y2: 55, w: 2.5 },
      { x1: 82, y1: 29, x2: 82, y2: 97, w: 2 },
    ]
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color}>
            <animate attributeName="opacity" values="0.88;0.95;0.88"
              dur={`${5 + i * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
          </rect>
        ))}
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={BLACK} strokeWidth={l.w} strokeLinecap="square" />
        ))}
      </svg>
    )
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

  /* 不畏风雨 — 红蓝黄雨伞 */
  if (title === "不畏风雨") {
    const cx = 50, cy = 52, R = 30
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="umb-dome" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>
        </defs>
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="0,0; -4,0; 0,0; 4,0; 0,0" dur="7s" repeatCount="indefinite" begin="0s" />
          {/* 伞面穹顶 — 半椭圆 */}
          <path d={`M${cx - R} ${cy} A${R} ${R * 0.8} 0 0 1 ${cx + R} ${cy}`}
            fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* 红黄蓝三色块 — 裁剪到穹顶内 */}
          <clipPath id="umb-clip">
            <path d={`M${cx - R - 2} ${cy + 2} A${R + 2} ${R * 0.8 + 2} 0 0 1 ${cx + R + 2} ${cy + 2} Z`} />
          </clipPath>
          <g clipPath="url(#umb-clip)">
            <rect x={cx - R} y={cy - 20} width={R * 2 / 3} height={R * 2} fill="#e63946" opacity="0.6" />
            <rect x={cx - R / 3} y={cy - 20} width={R * 2 / 3} height={R * 2} fill="#ffd166" opacity="0.6" />
            <rect x={cx + R / 3} y={cy - 20} width={R * 2 / 3} height={R * 2} fill="#4d96ff" opacity="0.6" />
          </g>
          {/* 伞骨线 */}
          {[0, 1, 2, 3].map(i => {
            const ax = cx - R + i * (R * 2 / 3)
            return <line key={i} x1={ax} y1={cy - 2} x2={ax} y2={cy} stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
          })}
          {/* 穹顶高光+暗部 */}
          <path d={`M${cx - R} ${cy} A${R} ${R * 0.8} 0 0 1 ${cx + R} ${cy}`}
            fill="url(#umb-dome)" />
          {/* 伞面底边波浪 */}
          <path d={`M${cx - R} ${cy} Q${cx - R + 6} ${cy + 5} ${cx - R/3} ${cy + 3} Q${cx} ${cy + 6} ${cx + R/3} ${cy + 3} Q${cx + R - 6} ${cy + 5} ${cx + R} ${cy}`}
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
          {/* 伞顶 */}
          <line x1={cx} y1={cy - R * 0.78} x2={cx} y2={cy - R * 1.05} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
          <circle cx={cx} cy={cy - R * 1.1} r="1.5" fill="rgba(255,255,255,0.5)" />
          {/* 伞杆 */}
          <line x1={cx} y1={cy + 1} x2={cx} y2={cy + 32} stroke="#ddd" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          {/* J形弯柄 */}
          <path d={`M${cx} ${cy + 32} Q${cx} ${cy + 42} ${cx - 10} ${cy + 42}`}
            stroke="#ddd" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" />
          {/* 雨滴 */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={`rain-${i}`}
              x1={cx - 15 + i * 14} y1={cy + 5 + i * 5}
              x2={cx - 15 + i * 14 - 1} y2={cy + 12 + i * 5}
              stroke="rgba(150,200,255,0.35)" strokeWidth="0.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </line>
          ))}
        </g>
      </svg>
    )
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

  /* 二十亿光年的孤独 — 赛博朋克时钟 */
  if (title === "二十亿光年的孤独") {
    const cx = 50, cy = 48, R = 32
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="clock-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,229,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0)" />
          </radialGradient>
        </defs>
        {/* 外圈 */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={c} strokeWidth="0.4" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r={R - 5} fill="none" stroke={c} strokeWidth="0.2" opacity="0.15" strokeDasharray="1 3">
          <animateTransform attributeName="transform" type="rotate" from="0 50 48" to="360 50 48" dur="20s" repeatCount="indefinite" />
        </circle>
        {/* 刻度 */}
        {Array.from({length: 12}, (_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2
          const x1 = cx + Math.cos(a) * (R - 6)
          const y1 = cy + Math.sin(a) * (R - 6)
          const x2 = cx + Math.cos(a) * (R - 2)
          const y2 = cy + Math.sin(a) * (R - 2)
          return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={c} strokeWidth={i % 3 === 0 ? 0.8 : 0.3} opacity="0.3" strokeLinecap="round" />
        })}
        {/* 时针 */}
        <line x1={cx} y1={cy} x2={cx} y2={cy - 14} stroke={c} strokeWidth="1.2" opacity="0.45" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 50 48" to="360 50 48" dur="120s" repeatCount="indefinite" />
        </line>
        {/* 分针 */}
        <line x1={cx} y1={cy} x2={cx + 18} y2={cy} stroke={c} strokeWidth="0.7" opacity="0.35" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 50 48" to="360 50 48" dur="10s" repeatCount="indefinite" />
        </line>
        {/* 秒针 */}
        <line x1={cx} y1={cy + 5} x2={cx} y2={cy - 22} stroke="#ff3b5c" strokeWidth="0.3" opacity="0.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 50 48" to="360 50 48" dur="60s" repeatCount="indefinite" />
        </line>
        {/* 中心点 */}
        <circle cx={cx} cy={cy} r="1.5" fill={c} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* 光晕 */}
        <circle cx={cx} cy={cy} r={R + 2} fill="url(#clock-bg)" opacity="0.5" />
        {/* 数字 */}
        {[12,3,6,9].map((n, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2
          const tx = cx + Math.cos(a) * (R - 12)
          const ty = cy + Math.sin(a) * (R - 12)
          return <text key={`num-${i}`} x={tx} y={ty} fill={c} opacity="0.3"
            fontSize="5" fontWeight="bold" textAnchor="middle" dominantBaseline="central"
            fontFamily="'SF Mono', monospace">{n}</text>
        })}
      </svg>
    )
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

  /* 破阵乐/破阵子 — 闪电 */
  if (title === "破阵乐" || title === "破阵子") {
    // 预计算闪电路径（避免 Math.random 在每次渲染时变化）
    const boltPaths = [
      { x: 25, y: -5, segs: [{dx:5,dy:15},{dx:-8,dy:20},{dx:12,dy:18},{dx:-3,dy:22},{dx:6,dy:20},{dx:-4,dy:15}] },
      { x: 55, y: -5, segs: [{dx:-6,dy:18},{dx:10,dy:22},{dx:-7,dy:16},{dx:9,dy:20},{dx:-5,dy:24}] },
      { x: 72, y: -5, segs: [{dx:3,dy:12},{dx:-10,dy:20},{dx:8,dy:25},{dx:-6,dy:18},{dx:4,dy:20},{dx:-8,dy:15}] },
      { x: 35, y: -5, segs: [{dx:-4,dy:20},{dx:8,dy:18},{dx:-9,dy:22},{dx:5,dy:24},{dx:-6,dy:16}] },
      { x: 60, y: -5, segs: [{dx:7,dy:14},{dx:-5,dy:24},{dx:10,dy:20},{dx:-8,dy:18},{dx:3,dy:24}] },
    ]
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="bolt-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {boltPaths.map((bp, i) => (
          <g key={i} filter="url(#bolt-glow)">
            <animate attributeName="opacity" values="0;0.7;0;0.8;0" dur={`${1.8 + i * 0.4}s`}
              repeatCount="indefinite" begin={`${i * 0.6}s`} />
            <polyline
              points={(() => {
                let x = bp.x, y = bp.y
                let pts = `${x},${y}`
                bp.segs.forEach(s => { x += s.dx; y += s.dy; pts += ` ${x},${y}` })
                return pts
              })()}
              fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <polyline
              points={(() => {
                let x = bp.x, y = bp.y
                let pts = `${x},${y}`
                bp.segs.forEach(s => { x += s.dx; y += s.dy; pts += ` ${x},${y}` })
                return pts
              })()}
              fill="none" stroke="#fff" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </g>
        ))}
      </svg>
    )
  }

  /* 带着不服输的孤勇去和世界交手吧 — 白色灯塔 + 探照灯 */
  if (title === "带着不服输的孤勇去和世界交手吧") {
    const lx = 50, ly = 55, lw = 12, lh = 32
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="beam-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,200,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,200,0)" />
          </radialGradient>
          <filter id="lh-glow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        {/* 探照灯锥形光束 — 4个方向 */}
        {[0, 45, 135, 180, 225, 315].map((angle, i) => {
          const rad = angle * Math.PI / 180
          const dx = Math.cos(rad) * 55, dy = Math.sin(rad) * 55
          const px = Math.cos(rad + 0.15) * 12, py = Math.sin(rad + 0.15) * 12
          const nx = Math.cos(rad - 0.15) * 12, ny = Math.sin(rad - 0.15) * 12
          return (
            <g key={`beam-${i}`}>
              <polygon
                points={`${lx + px},${ly - lh/2 + py} ${lx + nx},${ly - lh/2 + ny} ${lx + dx},${ly - lh/2 + dy}`}
                fill="url(#beam-grad)" opacity="0.18">
                <animate attributeName="opacity" values="0.12;0.25;0.12" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
              </polygon>
            </g>
          )
        })}
        {/* 灯塔底座 */}
        <rect x={lx - lw} y={ly + lh/2 - 5} width={lw * 2} height="8" rx="2"
          fill="#ddd" opacity="0.4" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        {/* 灯塔塔身 — 下宽上窄梯形 */}
        <polygon points={`${lx - lw},${ly + lh/2 - 4} ${lx + lw},${ly + lh/2 - 4} ${lx + lw * 0.7},${ly - lh/2 + 2} ${lx - lw * 0.7},${ly - lh/2 + 2}`}
          fill="#f5f5f5" opacity="0.55" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
        {/* 红色条纹 — 两条 */}
        <line x1={lx - lw * 0.9} y1={ly + lh/2 - 14} x2={lx + lw * 0.9} y2={ly + lh/2 - 14}
          stroke="#e63946" strokeWidth="2" opacity="0.45" />
        <line x1={lx - lw * 0.85} y1={ly + lh/2 - 22} x2={lx + lw * 0.85} y2={ly + lh/2 - 22}
          stroke="#e63946" strokeWidth="2" opacity="0.45" />
        {/* 灯塔顶部灯室 */}
        <rect x={lx - lw * 0.6} y={ly - lh/2 - 2} width={lw * 1.2} height="6" rx="1.5"
          fill="#fff8dc" opacity="0.6" filter="url(#lh-glow)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        {/* 灯室发光 */}
        <circle cx={lx} cy={ly - lh/2 + 1} r="8" fill="rgba(255,255,220,0.3)" filter="url(#lh-glow)">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* 塔顶 */}
        <polygon points={`${lx - lw * 0.5},${ly - lh/2 - 4} ${lx + lw * 0.5},${ly - lh/2 - 4} ${lx},${ly - lh/2 - 9}`}
          fill="#e63946" opacity="0.45" />
        <circle cx={lx} cy={ly - lh/2 - 10} r="1" fill="rgba(255,255,255,0.6)" />
      </svg>
    )
  }

  /* Broken Forever — 黄色梨 */
  if (title === "Broken Forever") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pear-grad" x1="30%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#f8f0a0" />
            <stop offset="15%" stopColor="#f2e250" />
            <stop offset="45%" stopColor="#e8d420" />
            <stop offset="75%" stopColor="#d4c010" />
            <stop offset="100%" stopColor="#b8a008" />
          </linearGradient>
          <radialGradient id="pear-shine" cx="35%" cy="20%" r="35%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* 梨主体 — 上窄下宽 */}
        <g transform="translate(48,48) scale(0.65)">
          {/* 主体轮廓 */}
          <path d="
            M 0 -36
            C -8 -36, -16 -30, -20 -20
            C -26 -8, -30 8, -28 20
            C -26 30, -18 38, -6 40
            C 6 42, 18 38, 24 28
            C 30 18, 28 0, 22 -12
            C 16 -24, 8 -34, 0 -36 Z"
            fill="url(#pear-grad)" opacity="0.90" />
          {/* 外轮廓线 */}
          <path d="
            M 0 -36
            C -8 -36, -16 -30, -20 -20
            C -26 -8, -30 8, -28 20
            C -26 30, -18 38, -6 40
            C 6 42, 18 38, 24 28
            C 30 18, 28 0, 22 -12
            C 16 -24, 8 -34, 0 -36 Z"
            fill="none" stroke="#8a7a08" strokeWidth="1.3" opacity="0.4" />
          {/* 高光 */}
          <path d="M -10 -26 C -16 -10, -16 8, -10 22 C -6 28, 0 30, 4 28"
            fill="url(#pear-shine)" />
          {/* 蒂 — 深棕色细柄 */}
          <line x1="0" y1="-36" x2="2" y2="-46" stroke="#3a2a0a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* 底部小凹 */}
          <circle cx="2" cy="38" r="1.5" fill="#8a7a08" opacity="0.3" />
          {/* 斑点 */}
          <circle cx="-16" cy="0" r="0.6" fill="#8a7a08" opacity="0.16" />
          <circle cx="10" cy="10" r="0.5" fill="#8a7a08" opacity="0.14" />
          <circle cx="-6" cy="-10" r="0.5" fill="#8a7a08" opacity="0.12" />
        </g>
      </svg>
    )
  }

  /* Right Where I'm Posed To Be — 万宝路香烟盒 */
  if (title === "Right Where I'm Posed To Be") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mred2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dd3030" />
            <stop offset="35%" stopColor="#c91e1e" />
            <stop offset="70%" stopColor="#a81818" />
            <stop offset="100%" stopColor="#7a0e0e" />
          </linearGradient>
          <linearGradient id="mgold2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c89820" />
            <stop offset="50%" stopColor="#ecc850" />
            <stop offset="100%" stopColor="#a07810" />
          </linearGradient>
        </defs>
        {/* 烟盒 */}
        <g transform="translate(50,48) scale(0.46)">
          {/* 红色盒体 */}
          <rect x="-38" y="-62" width="76" height="124" rx="4"
            fill="url(#mred2)" opacity="0.94" />
          {/* 盒边光照 */}
          <rect x="-38" y="-62" width="76" height="124" rx="4"
            fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
          {/* 白色屋顶 — 经典的 Marlboro 倒V形白色区域: 从底部角落斜向上升到顶部中央 */}
          <path d="M -36 -58 L -36 12 L 0 -48 L 36 12 L 36 -58 Z"
            fill="rgba(252,252,250,0.93)" />
          {/* 屋顶上沿金色细线 */}
          <path d="M -36 -56 L 0 -46 L 36 -56"
            fill="none" stroke="url(#mgold2)" strokeWidth="0.6" opacity="0.7" />
          {/* 屋顶下沿金色细线 */}
          <path d="M -36 10 L 0 -46 L 36 10"
            fill="none" stroke="url(#mgold2)" strokeWidth="0.6" opacity="0.6" />
          {/* Marlboro 文字 — 紧凑serif, 位于白色屋顶区域 */}
          <text x="0" y="-8" textAnchor="middle"
            fill="#1a1a1a" fontSize="10" fontWeight="900" letterSpacing="2"
            fontFamily="'Georgia','Times New Roman','Palatino',serif">
            Marlboro
          </text>
          {/* 白色横条 — 中部 */}
          <rect x="-34" y="18" width="68" height="4" rx="1.5"
            fill="rgba(252,252,250,0.90)" />
          {/* 底部金色横条 */}
          <rect x="-36" y="42" width="72" height="7" rx="2"
            fill="url(#mgold2)" opacity="0.85" />
          {/* 金色横条上细线 */}
          <line x1="-32" y1="45" x2="32" y2="45" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          {/* 侧面高光 */}
          <line x1="36" y1="-60" x2="36" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
        </g>
        {/* 飘烟 */}
        {[0,1,2,3].map(i => (
          <g key={`mks-${i}`}>
            <path d={`M ${44 + i * 8} ${34 - i * 5}
                     Q ${48 + i * 5} ${24 - i * 6}
                       ${42 + i * 7} ${14 - i * 8}`}
              fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.3" strokeLinecap="round">
              <animate attributeName="opacity" values="0.16;0.03;0.16" dur={`${4 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
              <animateTransform attributeName="transform" type="translate" values={`0,0; 2,-6; -1,-14`} dur={`${4 + i * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
            </path>
          </g>
        ))}
      </svg>
    )
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
