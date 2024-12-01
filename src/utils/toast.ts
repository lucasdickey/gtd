export function showToast(message: string, duration: number = 3000) {
  // Try to use existing toast element first
  const toast = document.getElementById('toast')

  if (toast) {
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

  // Create toast container if needed
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

  const newToast = document.createElement('div')
  newToast.className = `bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300`
  newToast.textContent = message

  toastContainer.appendChild(newToast)
  requestAnimationFrame(() => (newToast.style.opacity = '1'))

  setTimeout(() => {
    newToast.style.opacity = '0'
    setTimeout(() => {
      toastContainer?.removeChild(newToast)
      if (toastContainer?.childNodes.length === 0) {
        toastContainer.remove()
      }
    }, 300)
  }, duration)
}
