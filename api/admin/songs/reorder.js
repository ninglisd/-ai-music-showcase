import { createClient } from "@supabase/supabase-js"

function auth(req) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  return token === process.env.ADMIN_PASSWORD
}

export default async function handler(req, res) {
  if (!auth(req)) return res.status(401).json({ error: "Unauthorized" })
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { id, direction } = req.body || {}
  if (!id || !direction) return res.status(400).json({ error: "Missing id or direction" })

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Get current song's sort_order
  const { data: current } = await supabase.from("songs").select("sort_order").eq("id", id).single()
  if (!current) return res.status(404).json({ error: "Song not found" })

  const myOrder = current.sort_order

  // Find adjacent song
  const query = supabase.from("songs").select("id,sort_order").limit(1)
  if (direction === "up") {
    query.lt("sort_order", myOrder).order("sort_order", { ascending: false })
  } else {
    query.gt("sort_order", myOrder).order("sort_order", { ascending: true })
  }
  const { data: neighbor } = await query

  if (!neighbor || neighbor.length === 0) {
    return res.status(200).json({ ok: true }) // Already at top/bottom
  }

  const other = neighbor[0]

  // Swap sort_order values
  await supabase.from("songs").update({ sort_order: other.sort_order }).eq("id", id)
  await supabase.from("songs").update({ sort_order: myOrder }).eq("id", other.id)

  return res.status(200).json({ ok: true })
}
