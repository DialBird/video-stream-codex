import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export type Video = {
  id: string
  title: string
  description: string
  originalName: string
  filename: string
  createdAt: string
}

const videosFilePath = path.join(process.cwd(), 'data', 'videos.json')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir, { recursive: true })
}

async function readVideosFile(): Promise<Video[]> {
  try {
    const data = await fs.readFile(videosFilePath, 'utf8')
    return JSON.parse(data) as Video[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(videosFilePath, '[]', 'utf8')
      return []
    }
    throw error
  }
}

async function writeVideosFile(videos: Video[]) {
  await fs.writeFile(videosFilePath, JSON.stringify(videos, null, 2), 'utf8')
}

export async function getAllVideos(): Promise<Video[]> {
  const videos = await readVideosFile()
  return videos.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  const videos = await readVideosFile()
  return videos.find((video) => video.id === id)
}

export type CreateVideoInput = {
  title: string
  description: string
  fileBuffer: Buffer
  originalName: string
}

export async function createVideo({ title, description, fileBuffer, originalName }: CreateVideoInput): Promise<Video> {
  await ensureUploadsDir()
  const id = randomUUID()
  const safeTitle = title
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .toLowerCase()
  const filename = `${id}-${safeTitle || 'video'}.mp4`
  const filepath = path.join(uploadsDir, filename)
  await fs.writeFile(filepath, fileBuffer)

  const newVideo: Video = {
    id,
    title,
    description,
    originalName,
    filename,
    createdAt: new Date().toISOString(),
  }

  const videos = await readVideosFile()
  videos.push(newVideo)
  await writeVideosFile(videos)

  return newVideo
}
