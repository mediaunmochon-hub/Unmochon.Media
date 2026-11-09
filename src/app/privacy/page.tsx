import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | UNMOCHON',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-10 border-b-4 border-vanguard-red pb-4">
        <h1 className="font-serif text-5xl font-bold text-vanguard-red">Privacy Policy</h1>
      </header>
      <div className="prose prose-lg max-w-none font-sans text-gray-700 space-y-6">
        <p>Last updated: {new Date().getFullYear()}</p>
        <p>
          Unmochon collects only the data necessary to operate this site. We do not sell
          or share your personal information with third parties.
        </p>
        <h2 className="font-serif text-2xl font-bold mt-8 text-vanguard-red">Data We Collect</h2>
        <ul>
          <li>Anonymous page view counts (no personally identifiable information)</li>
          <li>Email addresses submitted via newsletter sign-up (not yet active)</li>
        </ul>
        <h2 className="font-serif text-2xl font-bold mt-8 text-vanguard-red">Third-Party Services</h2>
        <p>
          We use Cloudinary for media hosting and Vercel for site delivery. These
          services have their own privacy policies.
        </p>
        <p>
          For any privacy concerns, contact us at{' '}
          <a href="mailto:media.unomochon@gmail.com" className="text-vanguard-red hover:underline">
            media.unomochon@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
