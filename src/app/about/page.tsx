import type { Metadata } from 'next'
// import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'About',
}

export default function About() {
  return (
    <>
      <div className="container mx-auto px-8 md:px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">About Apes On Keys</h1>
        <div className="prose dark:prose-invert mb-16">
          <p>
            Apes On Keys (aka &lsquo;A-OK&rsquo;) is simply a place to drop in a bunch of little projects that will be predominantly AI-driven. Some of these projects will run in the browser, some will be scripts (or similar) you run in your console, and some might be &lsquo;how to&rsquo; style pieces of things I did in native UIs and daisy-chained steps together to achieve a cool end.
          </p>
          <p>
            Effectively A-OK is an experimentaly playground. And it&apos;s being built in public. Because why not.
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-4">About Me</h1>
        <div className="prose dark:prose-invert">
          <p className="italic text-lg border-l-4 border-brand-gold pl-4 my-6 bg-brand-beige/10 dark:bg-brand-beige/5 p-6 rounded-r">
            &ldquo;With over 20 years of experience in product management, I have
            successfully led cross-functional teams, including software engineers
            and user interface designers, to develop innovative software
            solutions. My entrepreneurial ventures have honed my ability to
            navigate the complexities of startup environments, fostering a culture
            of innovation and adaptability. Holding bachelor&rsquo;s degrees in
            Political Science and Philosophy, I bring a unique perspective to
            product development, integrating critical thinking and a deep
            understanding of social dynamics. My leadership style emphasizes
            collaboration and strategic vision, ensuring that all aspects of
            product development align with overarching business goals. My diverse
            interests in social sciences, technology, and entrepreneurship
            continually inspire me to explore new ideas and drive meaningful
            change in the tech industry.&rdquo;
          </p>
          <p>
            That first draft was ChatGPT with Web Search creating a one-paragraph
            summary of my LinkedIn profile. It&rsquo;s kind of okay, but not 100% A-OK yet. We&apos;l workshop it when feeling less lazy.
          </p>
        </div>
      </div>
    </>
  )
}
