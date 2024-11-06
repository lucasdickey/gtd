import React, { useCallback } from 'react'
import FileUploader from './FileUploader'

const ParentComponent = () => {
  const onUploadComplete = useCallback((result) => {
    // handle upload complete
  }, [])

  return <FileUploader onUploadComplete={onUploadComplete} />
}

export default ParentComponent
