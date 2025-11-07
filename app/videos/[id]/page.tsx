import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVideoById } from '@/lib/videos'

type PageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const video = await getVideoById(params.id)

  if (!video) {
    return {
      title: '動画が見つかりません',
    }
  }

  return {
    title: `${video.title} | StreamBox`,
    description: video.description || `${video.originalName} のストリーミング動画`,
  }
}

export default async function VideoPage({ params }: PageProps) {
  const video = await getVideoById(params.id)

  if (!video) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link className="text-lg font-semibold text-slate-900" href="/">
            StreamBox
          </Link>
          <Link className="text-sm font-medium text-indigo-600 hover:text-indigo-700" href="/admin">
            管理画面
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <article className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg border border-slate-200 bg-black">
            <video className="h-full w-full" controls preload="metadata" src={`/api/videos/${video.id}/stream`}>
              <track default kind="captions" label="日本語字幕" srcLang="ja" />
            </video>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900">{video.title}</h1>
            <p className="text-sm text-slate-500">
              公開日: {format(new Date(video.createdAt), 'yyyy年M月d日 HH:mm', { locale: ja })}
            </p>
            <p className="whitespace-pre-line text-base text-slate-700">
              {video.description || 'この動画にはまだ説明が設定されていません。'}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
            <span>ファイル名: {video.originalName}</span>
            <a
              className="font-semibold text-indigo-600 hover:text-indigo-700"
              href={`/api/videos/${video.id}/stream`}
              rel="noopener noreferrer"
            >
              直接再生リンク
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}
