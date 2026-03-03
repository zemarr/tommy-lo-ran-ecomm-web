import { UTApi } from "uploadthing/server"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

const utapi = new UTApi()

export async function POST(req: Request) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { key } = await req.json()

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 })
  }

  await utapi.deleteFiles(key)

  return NextResponse.json({ success: true })
}