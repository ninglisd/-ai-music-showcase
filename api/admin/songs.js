import { createClient } from "@supabase/supabase-js"

function auth(req) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  return token === process.env.ADMIN_PASSWORD
}

export default async function handler(req, res) {
  if (!auth(req)) return res.status(401).json({ error: "Unauthorized" })

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // GET — list all songs with lyrics
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("songs")
      .select("*, lyrics(*)")
      .order("created_at", { ascending: false })
      .order("sort_order", { foreignTable: "lyrics", ascending: true })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // POST — create song with lyrics
  if (req.method === "POST") {
    const { title, artist, genre, duration, audio_path, cover, color, lyrics } = req.body || {}
    if (!title || !artist || !genre || !duration || !audio_path) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const { data: song, error: songErr } = await supabase
      .from("songs")
      .insert({ title, artist, genre, duration: Number(duration), audio_path, cover: cover || "from-violet-600 via-purple-500 to-cyan-400", color: color || "#5c66f6" })
      .select()
      .single()

    if (songErr) return res.status(500).json({ error: songErr.message })

    if (lyrics && lyrics.length > 0) {
      const lyricRows = lyrics.map((l, i) => ({
        song_id: song.id,
        time: Number(l.time),
        text: l.text,
        sort_order: i,
      }))
      const { error: lyricErr } = await supabase.from("lyrics").insert(lyricRows)
      if (lyricErr) return res.status(500).json({ error: lyricErr.message })
    }

    return res.status(201).json(song)
  }

  return res.status(405).json({ error: "Method not allowed" })
}
