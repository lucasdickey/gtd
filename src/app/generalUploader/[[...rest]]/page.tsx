'use client'
import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import Image from 'next/image'
import { SignIn, SignedIn, SignedOut } from '@clerk/nextjs'

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

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-bold mb-4">
            Please sign in to upload files
          </h2>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <h1 className="text-2xl font-bold mb-6">General File Uploader</h1>
        <div className="mb-8">
          <FileUploader
            projectId="general"
            onUploadComplete={handleUploadComplete}
            onError={handleError}
            allowedTypes={[
              'image/jpeg',
              'image/png',
              'image/webp',
              'image/gif',
              'application/pdf',
            ]}
            maxSizeMB={20}
          />
        </div>

        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.fileKey}
                  className="p-4 border rounded-lg bg-white shadow-sm"
                >
                  {file.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                    <Image
                      src={file.fileUrl}
                      alt={file.fileName}
                      width={500}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-2">
                      <span className="text-gray-500">
                        File: {file.fileName}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate">
                      {file.fileName}
                    </span>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  )
}
