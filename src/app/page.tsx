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
    <div className="container mx-auto px-8 md:px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left column - Animation and Image */}
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

        {/* Right column - Text content */}
        <div className="text-sm text-gray-600 flex flex-col justify-center mt-4 border-l-2 border-gray-300 pl-8">
          <p className="mb-4">
            <a href="https://en.wikipedia.org/wiki/Infinite_monkey_theorem" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              The E/ACC Monkey Theorem
            </a> states that if you give an infinite number of AI models an infinite amount of compute, they will eventually generate every possible text, image, video, and piece of code – including all of Shakespeare's works, their various HBO adaptations, and at least 47 different AI-generated musicals where Hamlet raps.
          </p>
          <p className="mb-4">
            However, they'll also generate an infinite number of hallucinated Shakespeare quotes about cryptocurrency, several million images of the Bard wearing Supreme hoodies, and countless variations of "To yeet or not to yeet." The models will perpetually insist they're "unsure about events after their training cutoff date" even when discussing events from the 16th century.
          </p>
          <p className="mb-4">
            Unlike the original typing monkeys who would take eons to produce anything coherent, modern AI can generate nonsense at unprecedented speeds and with unwavering confidence. They'll even add citations to completely imaginary academic papers and insist they're being helpful while doing so.
          </p>
          <p className="mb-4">
            The theorem suggests that somewhere in this infinite digital soup of content, there exists a perfect reproduction of Romeo and Juliet – though it's probably tagged as "not financial advice" and ends with a prompt to like and subscribe.
            </p>
          <p className="mb-4 text-xs">
            (Note: This theorem has been reviewed by approximately 2.7 million AI models, each claiming to have a knowledge cutoff date that makes them unable to verify their own existence.)
          </p>
        </div>
      </div>
    </div>
  )
}
