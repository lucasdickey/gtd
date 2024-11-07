import React, { useCallback } from 'react'
import FileUploader from '@/components/FileUploader'

const ParentComponent = () => {
  const onUploadComplete = useCallback(
    (result: { fileKey: string; fileUrl: string; fileName: string }) => {
      // handle upload complete
    },
    []
  )

  const handleError = (error: Error) => {
    console.error('Upload error:', error)
  }

  return (
    <FileUploader
      onUploadComplete={onUploadComplete}
      onError={handleError}
      allowedTypes={['image/jpeg', 'image/png']}
      maxSizeMB={5}
      projectId="general"
    />
  )
}

export default ParentComponent
