'use client'

import { useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  // Hide navigation on mount
  useEffect(() => {
    const nav = document.querySelector('nav')
    if (nav) {
      nav.style.display = 'none'
    }
    // Show navigation again when component unmounts
    return () => {
      if (nav) {
        nav.style.display = ''
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">{children}</div>
  )
}
