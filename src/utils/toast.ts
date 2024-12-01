type ToastOptions = {
  duration?: number
  type?: 'success' | 'error' | 'info'
}

export function showToast(
  message: string,
  duration: number = 3000,
  options: ToastOptions = {}
) {
  // Try to use existing toast element first
  const toast = document.getElementById('toast')

  if (toast) {
    // Use existing toast element
    toast.textContent = message
    toast.classList.remove('hidden')
    toast.classList.add('opacity-100')

    setTimeout(() => {
      toast.classList.remove('opacity-100')
      toast.classList.add('opacity-0')
      setTimeout(() => {
        toast.classList.add('hidden')
        toast.classList.remove('opacity-0')
      }, 300)
    }, duration)
    return
  }

  // Fallback to dynamic toast creation if no existing element
  let toastContainer = document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.position = 'fixed'
    toastContainer.style.bottom = '1rem'
    toastContainer.style.right = '1rem'
    toastContainer.style.zIndex = '50'
    document.body.appendChild(toastContainer)
  }

  // Create new toast element
  const newToast = document.createElement('div')
  newToast.className = `bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${options.type || ''}`
  newToast.textContent = message

  // Add initial styles
  newToast.style.opacity = '0'
  newToast.style.transition = 'opacity 0.3s ease'

  // Add to container
  toastContainer.appendChild(newToast)

  // Trigger animation
  requestAnimationFrame(() => {
    newToast.style.opacity = '1'
  })

  // Remove after duration
  setTimeout(() => {
    newToast.style.opacity = '0'
    setTimeout(() => {
      if (toastContainer.contains(newToast)) {
        toastContainer.removeChild(newToast)
      }
      // Remove container if empty
      if (toastContainer.childNodes.length === 0) {
        document.body.removeChild(toastContainer)
      }
    }, 300) // Wait for fade out animation
  }, duration)
}
