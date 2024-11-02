import type { Metadata } from 'next';
// import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'About',
};

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>

      <div className="prose dark:prose-invert mb-12">
        <p>
          Your biography text goes here. Write about yourself, your background,
          and what you do.
        </p>
      </div>

    </div>
  );
}
