import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'
import { getVideoById } from '@/lib/videos'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const video = await getVideoById(params.id)

  if (!video) {
    return NextResponse.json({ error: '動画が見つかりません。' }, { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', video.filename)

  const stats = await fs.stat(filePath).catch(() => null)

  if (!stats) {
    return NextResponse.json({ error: '動画ファイルが見つかりません。' }, { status: 404 })
  }

  const range = request.headers.get('range')
  const fileSize = stats.size

  if (!range) {
    const stream = createReadStream(filePath)
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
      },
    })
  }

  const bytesPrefix = 'bytes='

  if (!range.startsWith(bytesPrefix)) {
    return NextResponse.json({ error: 'Rangeヘッダーが不正です。' }, { status: 416 })
  }

  const [startStr, endStr] = range.replace(bytesPrefix, '').split('-')
  const start = Number.parseInt(startStr, 10)
  let end = endStr ? Number.parseInt(endStr, 10) : fileSize - 1

  if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
    return NextResponse.json({ error: 'Rangeヘッダーが不正です。' }, { status: 416 })
  }

  if (start >= fileSize) {
    return NextResponse.json({ error: 'Rangeヘッダーがファイルサイズを超えています。' }, { status: 416 })
  }

  end = Math.min(end, fileSize - 1)

  const chunkSize = end - start + 1
  const stream = createReadStream(filePath, { start, end })

  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': 'video/mp4',
    },
  })
}
