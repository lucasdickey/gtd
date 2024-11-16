import type { Metadata } from 'next'
// import ContactForm from './ContactForm';

// Add 'use client' directive if you need client-side features
export const metadata: Metadata = {
  title: 'About',
}

export default function About() {
  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4">About Apes On Keys</h1>
      <div className="prose dark:prose-invert mb-8">
        <p className="mb-4">
          <a
            href="https://x.com/ApesOnKeys"
            className="text-blue-500 underline"
            target="_blank"
          >
            Apes On Keys
          </a>{' '}
          (aka &lsquo;A-OK&rsquo;) is simply a place to drop in a bunch of
          little projects that will be predominantly AI-driven. Some of these
          projects will run in the browser, some will be scripts (or similar)
          you run in your console, and some might be &lsquo;how to&rsquo; style
          pieces of things I did in native UIs and daisy-chained steps together
          to achieve a cool end.
        </p>
        <p className="mb-4">
          Effectively A-OK is an experimental playground. And it&apos;s being
          built in public. Because why not.
        </p>
      </div>
    </div>
  )
}
