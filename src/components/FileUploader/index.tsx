export interface FileUploaderProps {
  projectId: string
  onUploadComplete?: (fileData: {
    fileKey: string
    fileUrl: string
    fileName: string
  }) => void
  onError?: (error: Error) => void
  allowedTypes?: string[]
  maxSizeMB?: number
}

// src/components/FileUploader/index.tsx
import { useState, useCallback } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { FileUploaderProps } from './types'

export const FileUploader = ({
  projectId,
  onUploadComplete,
  onError,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 10,
}: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<string | null>(null)

  const storeFileReference = useMutation(api.files.storeFileReference)

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      )
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`)
    }

    setCurrentFile(file.name)

    // 1. Get presigned URL
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.statusText}`)
    }

    const { uploadUrl, fileKey } = await response.json()

    // 2. Upload to S3 with progress tracking
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setProgress(Math.round(percentComplete))
        }
      })

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`))
        }
      }

      xhr.onerror = () => reject(new Error('Upload failed'))
      xhr.send(file)
    })

    // 3. Store reference in Convex
    const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`

    await storeFileReference({
      projectId,
      fileName: file.name,
      fileKey,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type,
    })

    return {
      fileKey,
      fileUrl,
      fileName: file.name,
    }
  }

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files?.length) return

      setUploading(true)
      setProgress(0)
      setError(null)

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const result = await uploadFile(file)
          onUploadComplete?.(result)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed')
        setError(error.message)
        onError?.(error)
      } finally {
        setUploading(false)
        setCurrentFile(null)
        setProgress(0)
        // Reset input value to allow uploading the same files again
        event.target.value = ''
      }
    },
    [
      projectId,
      storeFileReference,
      allowedTypes,
      maxSizeMB,
      onUploadComplete,
      onError,
    ]
  )

  return (
    <div className="w-full max-w-md">
      <input
        type="file"
        onChange={handleFileUpload}
        multiple
        disabled={uploading}
        className="hidden"
        id="file-upload"
        accept={allowedTypes.join(',')}
      />

      <label
        htmlFor="file-upload"
        className={`
          block w-full px-4 py-2 text-sm font-medium text-center text-white 
          rounded-lg cursor-pointer transition-colors
          ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </label>

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Uploading {currentFile}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* File Type Info */}
      <p className="mt-2 text-xs text-gray-500">
        Allowed types:{' '}
        {allowedTypes.map((type) => type.split('/')[1]).join(', ')}
        <br />
        Max size: {maxSizeMB}MB per file
      </p>
    </div>
  )
}

export default FileUploader
