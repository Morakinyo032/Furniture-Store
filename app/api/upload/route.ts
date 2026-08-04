import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const MAX_IMAGE = 8 * 1024 * 1024 // 8MB
const MAX_VIDEO = 100 * 1024 * 1024 // 100MB

export async function POST(request: NextRequest) {
  // Only the authenticated owner may upload media.
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Only image and video files are allowed.' },
        { status: 400 },
      )
    }

    if (isImage && file.size > MAX_IMAGE) {
      return NextResponse.json(
        { error: 'Images must be under 8MB.' },
        { status: 400 },
      )
    }
    if (isVideo && file.size > MAX_VIDEO) {
      return NextResponse.json(
        { error: 'Videos must be under 100MB.' },
        { status: 400 },
      )
    }

    const blob = await put(`store/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url, type: isVideo ? 'video' : 'image' })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
