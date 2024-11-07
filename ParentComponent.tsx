import React, { useCallback } from 'react'
import { FileUploader } from '@/components/FileUploader'

const ParentComponent = () => {
  const onUploadComplete = useCallback(
    (result: { fileKey: string; fileUrl: string; fileName: string }) => {
      // handle upload complete
    },
    []
  )

  return (
    <FileUploader projectId="general" onUploadComplete={onUploadComplete} />
  )
}

export default ParentComponent
