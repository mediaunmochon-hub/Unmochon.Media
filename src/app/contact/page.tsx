import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | UNMOCHON',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-10 border-b-4 border-vanguard-red pb-4">
        <h1 className="font-serif text-5xl font-bold text-vanguard-red">Contact</h1>
      </header>
      <div className="prose prose-lg max-w-none font-sans text-gray-700 space-y-6">
        <p>
          For editorial inquiries, tips, corrections, or partnership requests, reach us
          at:
        </p>
        <p>
          <a
            href="mailto:media.unomochon@gmail.com"
            className="text-vanguard-red hover:underline font-bold"
          >
            media.unomochon@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
