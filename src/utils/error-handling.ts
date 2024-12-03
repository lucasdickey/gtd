export const handleConvexError = (error: any) => {
  // Extract the actual error message from Convex error
  const errorMessage =
    error?.data?.message || error?.message || 'An unknown error occurred'

  // Log for debugging in production
  console.error('Convex operation failed:', {
    error,
    message: errorMessage,
    stack: error?.stack,
  })

  return errorMessage
}
