import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Videos and large images are uploaded directly from the browser to Blob
// storage (see media-uploader.tsx), bypassing this server function entirely
// for the file bytes. Vercel's serverless functions cap request bodies at
// 4.5MB by default, which any real video would exceed. This route only
// issues a short-lived, scoped upload token — it never receives the file.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
        return {
          allowedContentTypes: ['image/*', 'video/*'],
          addRandomSuffix: true,
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
        }
      },
      onUploadCompleted: async () => {
        // No DB write needed here — the client saves the returned URL
        // itself via the settings/furniture forms.
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('[v0] Upload token error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Upload failed' },
      { status: 400 },
    )
  }
}
