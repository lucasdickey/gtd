'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export function HomePage() {
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
        }, 800) // Show monkey after typing completes

        return () => clearTimeout(monkeyTimer)
      }, 800) // Deletion duration - faster

      return () => clearTimeout(deleteTimer)
    }, 2000) // Initial typing duration - slower

    return () => clearTimeout(firstTimer)
  }, [])

  const headingClasses = [
    'text-4xl font-bold overflow-hidden whitespace-nowrap border-r-4 border-black mb-8',
    'font-vt323',
    animationState === 'typing-first' && 'animate-typewriter-first',
    animationState === 'deleting' && 'animate-delete-text',
    animationState === 'typing-second' && 'animate-typewriter-second',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="container mx-auto px-8 md:px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={headingClasses}>{text}</h1>
        </div>

        <div className="md:flex items-start gap-8">
          <div
            className={`md:w-[250px] flex-shrink-0 mb-4 md:mb-0 ${
              showMonkey ? 'animate-fade-in-blur' : 'opacity-0'
            }`}
          >
            <Image
              src="/a-okay-monkey-1.png"
              alt="A-OK Monkey"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>

          <div className="text-gray-600">
            <p className="mb-4">
              <a
                href="https://en.wikipedia.org/wiki/Infinite_monkey_theorem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                The E/ACC Monkey Theorem
              </a>{' '}
              states that if you give an infinite number of AI models an
              infinite amount of compute, they will eventually generate every
              possible text, image, video, and piece of code – including all of
              Shakespeare&apos;s works, their various HBO adaptations, and at
              least 47 different AI-generated musicals where Hamlet raps.
            </p>
            <p className="mb-4">
              However, they&apos;ll also generate an infinite number of
              hallucinated Shakespeare quotes about cryptocurrency, several
              million images of the Bard wearing Supreme hoodies, and countless
              variations of &quot;To yeet or not to yeet.&quot; The models will
              perpetually insist they&apos;re unsure about events after their
              training cutoff date&quot; even when discussing events from the
              16th century.
            </p>
            <p className="mb-4">
              Unlike the original typing monkeys who would take eons to produce
              anything coherent, modern AI can generate nonsense at
              unprecedented speeds and with unwavering confidence. They&apos;ll
              even add citations to completely imaginary academic papers and
              insist they&apos;re being helpful while doing so.
            </p>
            <p className="mb-4">
              The theorem suggests that somewhere in this infinite digital soup
              of content, there exists a perfect reproduction of Romeo and
              Juliet – though it&apos;s probably tagged as &quot;not financial
              advice&quot; and ends with a prompt to like and subscribe.
            </p>
            <p className="mb-4 text-xs">
              (Note: This theorem has been reviewed by approximately 2.7 million
              AI models, each claiming to have a knowledge cutoff date that
              makes them unable to verify their own existence.)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
