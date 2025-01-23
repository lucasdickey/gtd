import { Id } from '@/convex/_generated/dataModel'
import { useState, useCallback } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import React from 'react'

export interface FileUploaderProps {
  onUploadComplete: (result: {
    fileKey: string
    fileUrl: string
    fileName: string
  }) => void
  onError: (error: Error) => void
  allowedTypes?: string[]
  maxSizeMB?: number
  projectId?: Id<'projects'> | 'general'
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  projectId,
  onUploadComplete,
  onError,
  allowedTypes = ['image/jpeg', 'image/png'],
  maxSizeMB = 5,
}) => {
  const storeFileReference = useMutation(api.files.storeFileReference)
  const [uploading, setUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [progress, setProgress] = useState(0)

  const uploadFile = useCallback(
    async (fileToUpload: File) => {
      setError(null)
      setUploading(true)
      setCurrentFile(fileToUpload)
      setProgress(0)

      try {
        const sanitizedFileName = fileToUpload.name
          .replace(/[^a-zA-Z0-9.]/g, '-')
          .replace(/-+/g, '-')
          .toLowerCase()

        const formData = new FormData()
        formData.append('file', fileToUpload, sanitizedFileName)

        const response = await fetch('/api/upload-s3', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        setProgress(100)
        const result = await response.json()

        // Store the file reference in Convex after successful S3 upload
        await storeFileReference({
          projectId: projectId || 'general',
          fileName: fileToUpload.name,
          fileKey: result.fileKey,
          fileUrl: result.fileUrl,
          fileSize: fileToUpload.size,
          mimeType: fileToUpload.type,
        })

        // Only log success/failure, not the full details
        console.log('File reference stored successfully')

        setUploading(false)
        return {
          fileKey: result.fileKey,
          fileUrl: result.fileUrl,
          fileName: fileToUpload.name,
        }
      } catch (err) {
        // Only log that an error occurred, not the full error
        console.error('Failed to store file reference')
        setError(err as Error)
        setUploading(false)
        setProgress(0)
        throw err
      }
    },
    [projectId, storeFileReference]
  )

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const result = await uploadFile(file)
        onUploadComplete(result)
      } catch (err) {
        onError(err as Error)
      }
    },
    [uploadFile, onUploadComplete, onError]
  )

  return React.createElement('div', { className: 'w-full max-w-md' }, [
    React.createElement('input', {
      key: 'input',
      type: 'file',
      onChange: handleFileUpload,
      disabled: uploading,
      className: 'hidden',
      id: 'file-upload',
      accept: allowedTypes.join(','),
    }),
    React.createElement(
      'label',
      {
        key: 'label',
        htmlFor: 'file-upload',
        className: `
            block w-full px-4 py-2 text-sm font-medium text-center text-white 
            rounded-lg cursor-pointer transition-colors
            ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          `,
      },
      uploading ? 'Uploading...' : 'Upload Files'
    ),
    uploading &&
      React.createElement(
        'div',
        { key: 'progress', className: 'mt-4' },
        React.createElement(
          'div',
          { className: 'flex justify-between text-xs text-gray-600 mb-1' },
          React.createElement('span', null, `Uploading ${currentFile?.name}`),
          React.createElement('span', null, `${progress}%`)
        ),
        React.createElement(
          'div',
          { className: 'w-full bg-gray-200 rounded-full h-2' },
          React.createElement('div', {
            className:
              'bg-blue-600 h-2 rounded-full transition-all duration-300',
            style: { width: `${progress}%` },
          })
        )
      ),
    error &&
      React.createElement(
        'div',
        {
          key: 'error',
          className: 'mt-2 p-2 bg-red-50 border border-red-200 rounded-md',
        },
        React.createElement(
          'p',
          { className: 'text-sm text-red-600' },
          error.message
        )
      ),
    React.createElement(
      'p',
      { key: 'info', className: 'mt-2 text-xs text-gray-500' },
      'Allowed types: ',
      allowedTypes.map((type) => type.split('/')[1]).join(', '),
      React.createElement('br'),
      `Max size: ${maxSizeMB}MB per file`
    ),
  ])
}
