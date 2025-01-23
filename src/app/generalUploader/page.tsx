'use client'
import React from 'react'
import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import Image from 'next/image'

interface UploadedFile {
  fileKey: string
  fileUrl: string
  fileName: string
}

export default function GeneralUploaderPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const handleUploadComplete = (fileData: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, fileData])
  }

  const handleError = (error: Error) => {
    console.error('Upload error:', error)
  }

  return React.createElement(
    'div',
    { className: 'container mx-auto px-4 py-8' },
    [
      React.createElement(
        'h1',
        { key: 'title', className: 'text-2xl font-bold mb-6' },
        'General File Uploader'
      ),

      React.createElement(
        'div',
        { key: 'uploader', className: 'mb-8' },
        React.createElement(FileUploader, {
          projectId: 'general',
          onUploadComplete: handleUploadComplete,
          onError: handleError,
          allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'application/pdf',
          ],
          maxSizeMB: 20,
        })
      ),

      uploadedFiles.length > 0 &&
        React.createElement('div', { key: 'files', className: 'mt-8' }, [
          React.createElement(
            'h2',
            { key: 'files-title', className: 'text-xl font-semibold mb-4' },
            'Uploaded Files'
          ),
          React.createElement(
            'div',
            {
              key: 'files-grid',
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
            },
            uploadedFiles.map((file) =>
              React.createElement(
                'div',
                {
                  key: file.fileKey,
                  className: 'p-4 border rounded-lg bg-white shadow-sm',
                },
                [
                  file.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                    ? React.createElement(Image, {
                        key: 'image',
                        src: file.fileUrl,
                        alt: file.fileName,
                        width: 500,
                        height: 192,
                        className: 'w-full h-48 object-cover rounded-lg mb-2',
                      })
                    : React.createElement(
                        'div',
                        {
                          key: 'file-placeholder',
                          className:
                            'w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-2',
                        },
                        [
                          React.createElement(
                            'span',
                            {
                              key: 'file-name',
                              className: 'text-gray-500',
                            },
                            `File: ${file.fileName}`
                          ),
                        ]
                      ),
                  React.createElement(
                    'div',
                    {
                      key: 'file-info',
                      className: 'flex justify-between items-center',
                    },
                    [
                      React.createElement(
                        'span',
                        {
                          key: 'file-name-display',
                          className: 'text-sm text-gray-600 truncate',
                        },
                        file.fileName
                      ),
                      React.createElement(
                        'a',
                        {
                          key: 'file-link',
                          href: file.fileUrl,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className:
                            'text-blue-500 hover:text-blue-600 text-sm',
                        },
                        'View'
                      ),
                    ]
                  ),
                ]
              )
            )
          ),
        ]),
    ]
  )
}
