type ToastOptions = {
  duration?: number
  type?: 'success' | 'error' | 'info'
}

export function showToast(
  message: string,
  duration: number = 3000,
  options: ToastOptions = {}
) {
  // Create toast element if it doesn't exist
  let toastContainer = document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.position = 'fixed'
    toastContainer.style.top = '1rem'
    toastContainer.style.right = '1rem'
    toastContainer.style.zIndex = '50'
    document.body.appendChild(toastContainer)
  }

  // Create new toast element
  const toast = document.createElement('div')
  toast.className = `toast ${options.type || ''}`
  toast.textContent = message

  // Add initial styles
  toast.style.opacity = '0'
  toast.style.transition = 'opacity 0.3s ease'

  // Add to container
  toastContainer.appendChild(toast)

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1'
  })

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast)
      }
      // Remove container if empty
      if (toastContainer.childNodes.length === 0) {
        document.body.removeChild(toastContainer)
      }
    }, 300) // Wait for fade out animation
  }, duration)
}
