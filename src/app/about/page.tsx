import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | UNMOCHON',
  description: 'Independent journalism. Unapologetic truth-telling.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-10 border-b-4 border-vanguard-red pb-4">
        <h1 className="font-serif text-5xl font-bold text-vanguard-red">About Unmochon</h1>
      </header>
      <div className="prose prose-lg max-w-none font-sans text-gray-700 space-y-6">
        <p>
          Unmochon is an independent news publication committed to fearless journalism,
          clear-eyed analysis, and uncompromising truth. We cover politics, economics,
          technology, culture, and the stories they pay to bury.
        </p>
        <p>
          Our newsroom is free from the pressures of advertising-driven media. We answer
          only to our readers and to the truth.
        </p>
      </div>
    </div>
  );
}
