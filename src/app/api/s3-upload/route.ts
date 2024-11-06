import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    // Log environment variables (redact sensitive info)
    console.log('Environment check:', {
      region: process.env.AWS_REGION,
      bucketName: process.env.AWS_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    })

    // Log request details
    console.log('Request headers:', Object.fromEntries(request.headers))

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('No file in request')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Log file details
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    const fileKey = `${uuidv4()}-${file.name}`

    try {
      const buffer = await file.arrayBuffer()
      console.log(
        'Successfully converted file to buffer, size:',
        buffer.byteLength
      )

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      })

      console.log('Attempting S3 upload with params:', {
        bucket: process.env.AWS_BUCKET_NAME,
        key: fileKey,
        contentType: file.type,
      })

      const result = await s3Client.send(command)
      console.log('S3 upload successful:', result)

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
      return NextResponse.json({ fileUrl, fileKey })
    } catch (uploadError) {
      console.error('Error during file processing or upload:', uploadError)
      return NextResponse.json(
        { error: 'File upload failed', details: uploadError },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Top level error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process upload request',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
}
