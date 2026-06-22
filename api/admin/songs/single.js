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

  const { id } = req.query

  if (!id) return res.status(400).json({ error: "Missing id" })

  // PUT — update song metadata + lyrics
  if (req.method === "PUT") {
    const { title, artist, genre, duration, audio_path, cover, color, lyrics } = req.body || {}

    const updateFields = {}
    if (title !== undefined) updateFields.title = title
    if (artist !== undefined) updateFields.artist = artist
    if (genre !== undefined) updateFields.genre = genre
    if (duration !== undefined) updateFields.duration = Number(duration)
    if (audio_path !== undefined) updateFields.audio_path = audio_path
    if (cover !== undefined) updateFields.cover = cover
    if (color !== undefined) updateFields.color = color

    if (Object.keys(updateFields).length > 0) {
      const { error: songErr } = await supabase
        .from("songs")
        .update(updateFields)
        .eq("id", id)

      if (songErr) return res.status(500).json({ error: songErr.message })
    }

    if (lyrics !== undefined) {
      await supabase.from("lyrics").delete().eq("song_id", id)

      if (lyrics.length > 0) {
        const lyricRows = lyrics.map((l, i) => ({
          song_id: id,
          time: Number(l.time),
          text: l.text,
          sort_order: i,
        }))
        const { error: lyricErr } = await supabase.from("lyrics").insert(lyricRows)
        if (lyricErr) return res.status(500).json({ error: lyricErr.message })
      }
    }

    return res.status(200).json({ ok: true })
  }

  // DELETE — remove song + lyrics + storage file
  if (req.method === "DELETE") {
    const { data: song } = await supabase
      .from("songs")
      .select("audio_path")
      .eq("id", id)
      .single()

    if (song?.audio_path) {
      await supabase.storage.from("music").remove([song.audio_path])
    }

    const { error } = await supabase.from("songs").delete().eq("id", id)
    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
