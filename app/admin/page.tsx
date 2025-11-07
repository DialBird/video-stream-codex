import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import { getAllVideos } from '@/lib/videos'
import { UploadForm } from './upload-form'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const videos = await getAllVideos()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-slate-900">動画管理</h1>
          <Link className="text-sm font-medium text-indigo-600 hover:text-indigo-700" href="/">
            公開サイトを見る
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">新しい動画をアップロード</h2>
          <UploadForm />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">アップロード済みの動画</h2>
          {videos.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              まだ動画がありません。アップロードするとここに一覧表示されます。
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      タイトル
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      作成日時
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      公開ページ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {videos.map((video) => (
                    <tr key={video.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{video.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {format(new Date(video.createdAt), 'yyyy年M月d日 HH:mm', { locale: ja })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link className="text-indigo-600 hover:text-indigo-700" href={`/videos/${video.id}`}>
                          視聴ページを開く
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
