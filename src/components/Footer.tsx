import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const categories = ['Politics', 'Economy', 'Tech', 'Culture', 'Opinion'];

  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t-4 border-vanguard-red mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12 mb-8">
          
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-header.png"
                alt="UNMOCHON"
                width={200}
                height={60}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-bold">
              Stories They Pay to Bury
            </p>
            <p className="text-gray-400 font-sans max-w-sm mb-6">
              Independent journalism. Unapologetic truth-telling. 
              We uncover the stories others are paid to suppress.
            </p>
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300">Subscribe to our Newsletter</h4>
              <form className="flex max-w-sm">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-grow bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:border-vanguard-red font-sans"
                />
                <button type="button" className="bg-vanguard-red hover:bg-vanguard-accent text-white px-4 py-2 font-bold uppercase text-sm tracking-wider transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-6">Sections</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link href={`/category/${cat.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} Unmochon Media. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Stories They Pay to Bury</p>
        </div>
      </div>
    </footer>
  );
}
