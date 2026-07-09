import Link from 'next/link';

export default function Footer() {
  const categories = ['Politics', 'Economy', 'Tech', 'Culture', 'Opinion'];

  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t-4 border-vanguard-red mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12 mb-8">
          
          <div className="md:col-span-2">
            <Link href="/" className="font-serif font-bold text-3xl tracking-tight mb-4 inline-block">
              VANGUARD
            </Link>
            <p className="text-gray-400 font-sans max-w-sm mb-6">
              Independent news, rigorous analysis, and unapologetic opinion. 
              Fearless journalism for the modern era.
            </p>
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300">Subscribe to our Newsletter</h4>
              <form className="flex max-w-sm">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-grow bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:border-vanguard-red font-sans"
                />
                <button type="button" className="bg-vanguard-red hover:bg-red-800 text-white px-4 py-2 font-bold uppercase text-sm tracking-wider transition-colors">
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
          <p>&copy; {new Date().getFullYear()} Vanguard Media. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Rigorous Journalistic Aesthetic</p>
        </div>
      </div>
    </footer>
  );
}
