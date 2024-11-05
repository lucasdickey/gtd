// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { generateUploadURL } from '@/utils/s3-utils'

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json()

    // Validate file type (add your own validation logic)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    const { uploadUrl, fileKey } = await generateUploadURL(fileName, fileType)

    return NextResponse.json({ uploadUrl, fileKey })
  } catch (error) {
    console.error('Error in upload route:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
