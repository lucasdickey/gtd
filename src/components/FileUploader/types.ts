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
