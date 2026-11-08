import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Vanguard',
  description: 'Independent news, rigorous analysis, and unapologetic opinion.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-10 border-b-4 border-black pb-4">
        <h1 className="font-serif text-5xl font-bold">About Vanguard</h1>
      </header>
      <div className="prose prose-lg max-w-none font-sans text-gray-700 space-y-6">
        <p>
          Vanguard is an independent news publication committed to rigorous journalism,
          clear-eyed analysis, and fearless opinion. We cover politics, economics,
          technology, culture, and the ideas that shape our world.
        </p>
        <p>
          Our newsroom is free from the pressures of advertising-driven media. We answer
          only to our readers and to the truth.
        </p>
      </div>
    </div>
  );
}
