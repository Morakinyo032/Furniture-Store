'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MediaUploader({
  value,
  onChange,
  accept = 'image',
  label,
}: {
  value?: string | null
  onChange: (url: string) => void
  accept?: 'image' | 'video'
  label: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const acceptAttr = accept === 'video' ? 'video/*' : 'image/*'
  const isVideo = accept === 'video'

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
      toast.success('Uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>

      {value ? (
        <div className="relative overflow-hidden rounded-md border border-border bg-muted">
          {isVideo ? (
            <video src={value} controls className="h-40 w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value || "/placeholder.svg"} alt="Preview" className="h-40 w-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm transition-colors hover:bg-background"
            aria-label="Remove media"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground',
            uploading && 'pointer-events-none opacity-70',
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Click to upload {isVideo ? 'a video' : 'an image'}
            </>
          )}
        </button>
      )}

      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Replace
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
