import { createClient } from "@supabase/supabase-js"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { filename } = req.body || {}
  if (!filename) return res.status(400).json({ error: "Missing filename" })

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase.storage
    .from("music")
    .createSignedUploadUrl(filename)

  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ signedUrl: data.signedUrl, path: filename })
}
