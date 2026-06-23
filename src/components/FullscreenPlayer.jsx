import { usePlayer } from "../context/PlayerContext"

function fmt(s) { const m=Math.floor(Math.max(0,s)/60); return `${m}:${(Math.floor(Math.max(0,s))%60).toString().padStart(2,"0")}` }

const songGradients = {
  "白昼将尽":       ["#c0392b","#a02828","#8b1a1a","#5c1010"],
  "葬花吟":         ["#7b2d8b","#5c2068","#4a154b","#2d1b3d"],
  "裂痕之舞":       ["#155e6d","#0f4a5a","#0d3b4f","#0a2a38"],
  "西西弗斯是幸福的":   ["#0a1628","#0d1f3c","#0a1628","#0f2445"],
  "时之圆":         ["#2d2d6b","#252560","#1a1a3e","#1a2a4a"],
  "不畏风雨":       ["#1a1a2e","#2d2d4e","#1a1a3e","#252545"],
  "莎莉花园":       ["#5c3a1a","#4a2a10","#3d2010","#2a1808"],
  "二十亿光年的孤独": ["#151d50","#121848","#0a1030","#0d1440"],
  "我想成为这样的人": ["#3d3818","#2d2510","#2a200c","#1a1808"],
  "破阵乐":         ["#5c1010","#4a0808","#3d0a0a","#1a0505"],
}
const songGlows = {
  "白昼将尽":"#e05030","葬花吟":"#c97bdb","裂痕之舞":"#30b8c0","西西弗斯是幸福的":"#e63946",
  "时之圆":"#7b8cff","不畏风雨":"#ff6b6b","莎莉花园":"#e0a030","二十亿光年的孤独":"#4080ff",
  "我想成为这样的人":"#e0c040","破阵乐":"#e84020",
}
const HUE2 = [0,15,30,45,60,120,180,210,240,270,300,330]
function autoGlow(title) {
  let h = 0; for (let i=0;i<title.length;i++) h = ((h<<5)-h+title.charCodeAt(i))|0; h = Math.abs(h)
  const hue = HUE2[h%HUE2.length]; return `hsl(${hue},70%,55%)`
}
function autoGrad(title) {
  let h = 0; for (let i=0;i<title.length;i++) h = ((h<<5)-h+title.charCodeAt(i))|0; h = Math.abs(h)
  const hue = HUE2[h%HUE2.length], sat = 45+(h%35), l = 22+(h%10)
  return [`hsl(${hue},${sat}%,${l}%)`,`hsl(${(hue+25)%360},${sat-8}%,${l-5}%)`,`hsl(${(hue+15)%360},${sat-14}%,${l-10}%)`,`hsl(${hue},${sat-18}%,${l-15}%)`]
}

export default function FullscreenPlayer() {
  const { currentSong, isPlaying, currentTime, duration, volume,
    isFullscreen, togglePlay, next, prev, seek, changeVolume, closeFullscreen } = usePlayer()

  if(!isFullscreen||!currentSong)return null

  const progress=duration>0?(currentTime/duration)*100:0
  const grad=songGradients[currentSong?.title]||autoGrad(currentSong?.title||"")
  const glow=songGlows[currentSong?.title]||autoGlow(currentSong?.title||"")

  return (
    <div className="fixed inset-0 z-50 flex flex-col"
      style={{ background:`linear-gradient(160deg, ${grad[0]} 0%, ${grad[1]} 35%, ${grad[2]} 65%, ${grad[3]} 100%)` }}>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[65%] h-[65%] rounded-full"
          style={{ background:`radial-gradient(circle, ${glow}30 0%, transparent 60%)`, filter:"blur(70px)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full"
          style={{ background:`radial-gradient(circle, ${glow}25 0%, transparent 55%)`, filter:"blur(60px)" }} />
      </div>

      <button onClick={closeFullscreen}
        className="absolute top-5 left-5 z-20 w-9 h-9 rounded-full flex items-center justify-center
                   transition-all hover:scale-105"
        style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.10)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
      </button>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-14 px-6 pt-4 pb-2 overflow-hidden min-h-0">

        {/* Sony Walkman */}
        <div className="relative shrink-0 flex items-center justify-center
                        w-[240px] h-[340px] sm:w-[280px] sm:h-[400px] lg:w-[360px] lg:h-[480px]">

          <div className="relative w-full h-full rounded-[32px] overflow-hidden"
            style={{
              background:`linear-gradient(170deg, #fafaf8 0%, #f2f0ec 15%, #eae8e2 35%, #f5f3ef 55%, #edebe5 75%, #e6e4dc 100%)`,
              boxShadow:`0 24px 60px rgba(0,0,0,0.18), 0 6px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.04)`,
              border:"1.5px solid rgba(0,0,0,0.06)",
            }}>

            <div className="absolute top-0 left-0 right-0 h-[10%] flex items-end justify-between px-5 pb-1.5"
              style={{borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
              <span className="text-[13px] sm:text-[15px] font-black tracking-tight italic"
                style={{color:"#2a2a2a",fontFamily:"'Syne','Instrument Sans',sans-serif",letterSpacing:"-0.02em"}}>WALKMAN</span>
              <span className="text-[7px] font-semibold tracking-[0.25em] uppercase"
                style={{color:"rgba(0,0,0,0.25)"}}>STEREO · AUTO REVERSE</span>
            </div>

            {/* 磁带仓 */}
            <div className="absolute top-[12%] left-[6%] right-[6%] h-[50%] rounded-[14px] overflow-hidden"
              style={{background:"#c8dae8",border:"3px solid rgba(0,0,0,0.10)",boxShadow:"inset 0 4px 16px rgba(0,0,0,0.12), 0 2px 0 rgba(255,255,255,0.5)"}}>

              <div className="absolute inset-[2%] rounded-[5px]"
                style={{background:"#f0d878",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.08)"}}>

                <div className="absolute top-[3%] left-[5%] right-[5%] h-[38%] rounded-[3px] flex flex-col items-center justify-center"
                  style={{background:"rgba(255,255,255,0.55)",border:"1px solid rgba(0,0,0,0.06)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.5)"}}>
                  <span className="text-[7px] sm:text-[8px] font-bold text-center leading-tight px-3"
                    style={{color:"#3a2a10",fontFamily:"'Syne','Instrument Sans',sans-serif"}}>{currentSong.title}</span>
                  <span className="text-[5px] mt-0.5 font-medium uppercase tracking-[0.1em]"
                    style={{color:"rgba(0,0,0,0.4)"}}>AI MUSIC · STEREO</span>
                </div>

                {/* 左转轮 */}
                <div className="absolute top-[50%] -translate-y-1/2 flex items-center justify-center"
                  style={{left:"16%",width:"25%",aspectRatio:"1"}}>
                  <div className="w-full h-full rounded-full flex items-center justify-center"
                    style={{background:"rgba(180,190,200,0.20)",border:"2px solid rgba(0,0,0,0.12)",boxShadow:"inset 0 0 6px rgba(0,0,0,0.08)"}}>
                    <div className="w-[78%] h-[78%] rounded-full flex items-center justify-center"
                      style={{background:"#dce2e6",animation:"vinylSpin 1.3s linear infinite",animationPlayState:isPlaying?"running":"paused"}}>
                      <div className="w-[85%] h-[85%] rounded-full" style={{background:"#ddd6c8",border:"1px solid rgba(0,0,0,0.06)"}}/>
                      {[0,1,2,3,4,5].map(i=>(<div key={i} className="absolute w-0.5 bg-black/8 rounded-full" style={{height:"50%",transform:`rotate(${i*60}deg)`}}/>))}
                      <div className="absolute w-[22%] h-[22%] rounded-full flex items-center justify-center" style={{background:"#d0c8b8",border:"0.5px solid rgba(0,0,0,0.1)"}}>
                        <div className="w-[35%] h-[35%] rounded-full" style={{background:"rgba(0,0,0,0.2)"}}/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右转轮 */}
                <div className="absolute top-[50%] -translate-y-1/2 flex items-center justify-center"
                  style={{right:"16%",width:"25%",aspectRatio:"1"}}>
                  <div className="w-full h-full rounded-full flex items-center justify-center"
                    style={{background:"rgba(180,190,200,0.20)",border:"2px solid rgba(0,0,0,0.12)",boxShadow:"inset 0 0 6px rgba(0,0,0,0.08)"}}>
                    <div className="w-[78%] h-[78%] rounded-full flex items-center justify-center"
                      style={{background:"#dce2e6",animation:"vinylSpin 1.5s linear infinite",animationPlayState:isPlaying?"running":"paused"}}>
                      <div className="w-[85%] h-[85%] rounded-full" style={{background:"#ddd6c8",border:"1px solid rgba(0,0,0,0.06)"}}/>
                      {[0,1,2,3,4,5].map(i=>(<div key={i} className="absolute w-0.5 bg-black/8 rounded-full" style={{height:"50%",transform:`rotate(${i*60}deg)`}}/>))}
                      <div className="absolute w-[22%] h-[22%] rounded-full flex items-center justify-center" style={{background:"#d0c8b8",border:"0.5px solid rgba(0,0,0,0.1)"}}>
                        <div className="w-[35%] h-[35%] rounded-full" style={{background:"rgba(0,0,0,0.2)"}}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[8%] left-[34%] right-[34%]">
                  <div className="w-full h-[12px] rounded-[2px] flex items-center justify-center"
                    style={{background:"#1a1208",border:"0.5px solid rgba(0,0,0,0.2)"}}>
                    <div className="w-[25%] h-[35%] rounded-[1px]" style={{background:"#c8a850",border:"0.5px solid rgba(0,0,0,0.15)"}}/>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 left-0 w-[35%] h-[35%] pointer-events-none"
                style={{background:"linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 100%)",borderRadius:"14px 0 100% 0"}}/>
            </div>

            <div className="absolute top-[65%] left-[8%] right-[8%] text-center">
              <p className="text-[14px] sm:text-[16px] font-bold leading-tight"
                style={{color:"#2a2a2a",fontFamily:"-apple-system,'SF Pro Display','PingFang SC',sans-serif"}}>{currentSong.title}</p>
              <p className="text-[10px] sm:text-[11px] mt-1" style={{color:"rgba(0,0,0,0.4)"}}>{currentSong.artist}</p>
            </div>

            <div className="absolute bottom-[6%] left-[10%] right-[10%] h-[13%] flex items-center justify-center gap-5 sm:gap-6"
              style={{borderTop:"1px solid rgba(0,0,0,0.05)"}}>
              <button onClick={(e)=>{e.stopPropagation();prev()}}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{background:"#e8e4dc",border:"1.5px solid rgba(0,0,0,0.1)",boxShadow:"0 2px 4px rgba(0,0,0,0.06)"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(0,0,0,0.4)"><polygon points="6,12 18,2 18,22"/><rect x="2" y="4" width="4" height="16"/></svg>
              </button>
              <button onClick={(e)=>{e.stopPropagation();togglePlay()}}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{background:`linear-gradient(135deg,${glow},${glow}88)`,boxShadow:`0 4px 16px ${glow}30, 0 1px 3px rgba(0,0,0,0.1)`}}>
                {isPlaying?(
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
                ):(
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff" className="ml-0.5"><polygon points="6,2 20,12 6,22"/></svg>
                )}
              </button>
              <button onClick={(e)=>{e.stopPropagation();next()}}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{background:"#e8e4dc",border:"1.5px solid rgba(0,0,0,0.1)",boxShadow:"0 2px 4px rgba(0,0,0,0.06)"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(0,0,0,0.4)"><polygon points="6,2 18,12 6,22"/><rect x="18" y="4" width="4" height="16"/></svg>
              </button>
            </div>

            <span className="absolute bottom-2 left-0 right-0 text-center text-[7px]"
              style={{color:"rgba(0,0,0,0.15)",fontFamily:"'Space Grotesk',sans-serif"}}>WM-AI1 · AI MUSIC PLAYER</span>
          </div>
        </div>

      </div>

      <div className="relative z-10 px-6 pt-2 pb-5"
        style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
        <div className="relative h-[3px] rounded-full cursor-pointer group/progress mb-3" style={{background:"rgba(255,255,255,0.06)"}}
          onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seek((e.clientX-r.left)/r.width*duration)}}>
          <div className="absolute inset-y-0 left-0 rounded-full" style={{width:`${progress}%`,background:`linear-gradient(90deg,${glow},${glow}88)`}}/>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{left:`${progress}%`}}/>
        </div>
        <div className="flex items-center justify-between mb-3 text-[11px] text-white/20" style={{fontFamily:"'SF Mono',monospace"}}>
          <span>{fmt(currentTime)}</span><span>{fmt(duration)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 w-28">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>{volume>0&&<path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}</svg>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e=>changeVolume(parseFloat(e.target.value))} className="w-20"/>
          </div>
          <div className="flex items-center gap-8 mx-auto">
            <button onClick={prev} className="text-white/30 hover:text-white/60"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,12 18,2 18,22"/><rect x="2" y="4" width="4" height="16" rx="1"/></svg></button>
            <button onClick={togglePlay} className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95" style={{background:`linear-gradient(135deg,${glow},${glow}88)`}}>
              {isPlaying?<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>:<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" className="ml-0.5"><polygon points="6,2 20,12 6,22"/></svg>}
            </button>
            <button onClick={next} className="text-white/30 hover:text-white/60"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,2 18,12 6,22"/><rect x="18" y="4" width="4" height="16" rx="1"/></svg></button>
          </div>
          <div className="w-28 hidden sm:block"/>
        </div>
      </div>
    </div>
  )
}
