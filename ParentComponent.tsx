import React, { useCallback } from 'react'
import { FileUploader } from '@/components/FileUploader'

const ParentComponent = () => {
  const onUploadComplete = useCallback(
    (result: { fileKey: string; fileUrl: string; fileName: string }) => {
      // handle upload complete
    },
    []
  )

  const onError = useCallback((error: Error) => {
    console.error('Upload error:', error)
  }, [])

  return (
    <FileUploader
      projectId="general"
      onUploadComplete={onUploadComplete}
      onError={onError}
    />
  )
}

export default ParentComponent
