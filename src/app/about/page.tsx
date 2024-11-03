import type { Metadata } from 'next'
// import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'About',
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>

      <div className="prose dark:prose-invert mb-12">
        <p className="italic text-lg border-l-4 border-brand-gold pl-4 my-6 mx-4 bg-brand-beige/10 dark:bg-brand-beige/5 p-6 rounded-r">
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
          summary of my LinkedIn profile. It&rsquo;s okay, but not A-OK yet.
        </p>
      </div>
    </div>
  )
}
