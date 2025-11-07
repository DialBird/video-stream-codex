import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import { getAllVideos } from '@/lib/videos'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const videos = await getAllVideos()

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

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">最新の動画</h1>
          <p className="mt-2 text-sm text-slate-600">管理画面でアップロードした動画がここに公開されます。</p>
        </section>

        {videos.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            現在公開されている動画はありません。
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <Link
                key={video.id}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                href={`/videos/${video.id}`}
              >
                <div className="aspect-video bg-slate-900/80" />
                <div className="space-y-2 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600">{video.title}</h2>
                  <p className="text-sm text-slate-600">{video.description || '説明文はまだありません。'}</p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(video.createdAt), {
                      locale: ja,
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
