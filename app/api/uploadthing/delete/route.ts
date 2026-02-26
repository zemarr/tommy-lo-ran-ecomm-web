import { UTApi } from "uploadthing/server"
import { NextResponse } from "next/server"

const utapi = new UTApi()

export async function POST(req: Request) {
  const { key } = await req.json()

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
  }

  await utapi.deleteFiles(key)

  return NextResponse.json({ success: true })
}