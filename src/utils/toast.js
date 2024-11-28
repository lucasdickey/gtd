export function showToast(message, duration = 3000) {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const toast = document.getElementById('toast')
    if (toast) {
      toast.textContent = message
      toast.classList.remove('hidden')
      toast.classList.add('show')

      setTimeout(() => {
        toast.classList.remove('show')
        toast.classList.add('hidden')
      }, duration)
    }
  }
}
