// utils/s3.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

/**
 * Generates a pre-signed URL for uploading a file to S3
 * @param fileName - Original name of the file being uploaded
 * @param fileType - MIME type of the file (e.g., 'image/jpeg')
 * @returns Object containing the upload URL and the generated file key
 */
export const generateUploadURL = async (
  fileName: string,
  fileType: string
): Promise<{ uploadUrl: string; fileKey: string }> => {
  // Create a unique file key by combining a UUID with the original filename
  // This prevents filename collisions in the S3 bucket
  const fileKey = `${uuidv4()}-${fileName}`

  // Create a command object for the PUT operation
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!, // The S3 bucket to upload to
    Key: fileKey, // The unique file identifier in S3
    ContentType: fileType, // The MIME type of the file
  })

  try {
    // Generate a pre-signed URL that will be valid for 1 hour
    // This URL can be used by the client to upload the file directly to S3
    const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour (in seconds)
    })

    return {
      uploadUrl, // The temporary URL for uploading
      fileKey, // The unique identifier for the file in S3
    }
  } catch (error) {
    console.error('Error generating upload URL:', error)
    throw error
  }
}

/**
 * Generates a pre-signed URL for downloading a file from S3
 * @param fileKey - The unique identifier of the file in S3
 * @returns A temporary URL that can be used to download the file
 */
export const generateDownloadURL = async (fileKey: string): Promise<string> => {
  // Create a command object for the GET operation
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
  })

  try {
    // Generate a pre-signed URL for downloading, valid for 1 hour
    return await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600,
    })
  } catch (error) {
    console.error('Error generating download URL:', error)
    throw error
  }
}
