'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function UploadForm() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  return (
    <form
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault()
        setError(null)
        setSuccess(null)
        const form = event.currentTarget
        const formData = new FormData(form)
        setIsUploading(true)

        try {
          const response = await fetch('/api/videos', {
            method: 'POST',
            body: formData,
          })

          const payload = await response.json()

          if (!response.ok) {
            setError(payload.error ?? 'アップロードに失敗しました。')
            return
          }

          form.reset()
          setSuccess('動画をアップロードしました。')
          router.refresh()
        } catch (uploadError) {
          console.error(uploadError)
          setError('アップロード中にエラーが発生しました。')
        } finally {
          setIsUploading(false)
        }
      }}
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          タイトル
        </label>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          id="title"
          name="title"
          placeholder="例: 紹介動画"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="description">
          説明文
        </label>
        <textarea
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          id="description"
          name="description"
          placeholder="動画の説明を入力してください"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="file">
          動画ファイル（MP4）
        </label>
        <input
          accept="video/mp4"
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          id="file"
          name="file"
          type="file"
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <button
        className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        disabled={isUploading}
        type="submit"
      >
        {isUploading ? 'アップロード中...' : '動画をアップロード'}
      </button>
    </form>
  )
}
