import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | UNMOCHON',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-10 border-b-4 border-vanguard-red pb-4">
        <h1 className="font-serif text-5xl font-bold text-vanguard-red">Terms of Service</h1>
      </header>
      <div className="prose prose-lg max-w-none font-sans text-gray-700 space-y-6">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>
          By accessing Unmochon, you agree to these terms. All content published on this
          site is the intellectual property of Unmochon Media unless otherwise stated.
        </p>
        <h2 className="font-serif text-2xl font-bold mt-8 text-vanguard-red">Use of Content</h2>
        <p>
          Content may be shared with attribution. Reproduction of full articles without
          permission is prohibited.
        </p>
        <h2 className="font-serif text-2xl font-bold mt-8 text-vanguard-red">Disclaimer</h2>
        <p>
          Unmochon provides news and opinion content for informational purposes. We
          strive for accuracy but make no warranties regarding completeness or
          reliability.
        </p>
        <p>
          Questions? Contact us at{' '}
          <a href="mailto:media.unomochon@gmail.com" className="text-vanguard-red hover:underline">
            media.unomochon@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
