import { type NextRequest, NextResponse } from 'next/server'
import { createVideo, getAllVideos } from '@/lib/videos'

export const runtime = 'nodejs'

export async function GET() {
  const videos = await getAllVideos()
  return NextResponse.json({ videos })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const description = (formData.get('description') as string | null)?.trim() ?? ''
  const file = formData.get('file') as File | null

  if (!title) {
    return NextResponse.json({ error: 'タイトルは必須です。' }, { status: 400 })
  }

  if (!file) {
    return NextResponse.json({ error: '動画ファイルが選択されていません。' }, { status: 400 })
  }

  if (file.type !== 'video/mp4') {
    return NextResponse.json({ error: 'MP4形式のファイルのみアップロードできます。' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const video = await createVideo({
    title,
    description,
    fileBuffer: buffer,
    originalName: file.name,
  })

  return NextResponse.json({ video }, { status: 201 })
}
