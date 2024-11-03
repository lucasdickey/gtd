'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [text, setText] = useState('An Ape On Keys')
  const [animationState, setAnimationState] = useState('typing-first')
  const [showMonkey, setShowMonkey] = useState(false)

  useEffect(() => {
    // Wait for first typewriter to complete
    const firstTimer = setTimeout(() => {
      setAnimationState('deleting')

      // Wait for deletion to complete
      const deleteTimer = setTimeout(() => {
        setText('We are A-OK')
        setAnimationState('typing-second')

        // Add slight delay before showing monkey
        const monkeyTimer = setTimeout(() => {
          setShowMonkey(true)
        }, 500) // Adjust timing as needed

        return () => clearTimeout(monkeyTimer)
      }, 1000) // Adjust timing as needed

      return () => clearTimeout(deleteTimer)
    }, 2000) // Adjust timing as needed

    return () => clearTimeout(firstTimer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="container max-w-md px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-[300px] mb-6">
            <h1
              className={`text-4xl font-bold w-[75%] mx-auto overflow-hidden whitespace-nowrap border-r-4 border-black
                ${animationState === 'typing-first' ? 'animate-typewriter-first' : ''}
                ${animationState === 'deleting' ? 'animate-delete-text' : ''}
                ${animationState === 'typing-second' ? 'animate-typewriter-second' : ''}
              `}
            >
              {text}
            </h1>
          </div>
          <Image
            src="/a-okay-monkey-1.png"
            alt="A-OK Monkey"
            width={300}
            height={300}
            className={`${showMonkey ? 'animate-fade-in-blur' : 'opacity-0'}`}
          />
        </div>
      </div>
    </div>
  )
}
