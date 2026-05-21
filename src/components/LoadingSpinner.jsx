export default function LoadingSpinner({ text = "加载中..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            background: "conic-gradient(from 0deg, #8b5cf6, transparent 40deg, #00f5d4, transparent 200deg, #8b5cf6, transparent 360deg)",
            animation: "vinylSpin 1.2s linear infinite",
          }}
        />
        <div className="absolute inset-2 rounded-full bg-[#0B0B0F]/80 border border-white/5" />
      </div>
      <p className="text-white/30 text-sm tracking-wide">{text}</p>
    </div>
  )
}
