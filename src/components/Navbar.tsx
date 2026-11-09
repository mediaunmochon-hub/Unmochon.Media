'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = ['Politics', 'Economy', 'Tech', 'Culture', 'Opinion'];

  return (
    <>
      <header className="sticky top-0 z-40 bg-vanguard-cream border-t-4 border-t-vanguard-red border-b border-b-vanguard-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Hamburger Menu */}
            <div className="flex-1 flex items-center">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-vanguard-cream/80 transition-colors focus:outline-none"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6 text-vanguard-text" />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image
                  src="/logo-header.png"
                  alt="UNMOCHON"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Right: Search */}
            <div className="flex-1 flex justify-end items-center">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-vanguard-cream/80 transition-colors focus:outline-none"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-vanguard-text" />
              </button>
            </div>
          </div>
        </div>
        {/* Secondary Header: Categories (Desktop only) */}
        <div className="hidden md:block border-t border-vanguard-border bg-vanguard-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-center space-x-8 py-3">
              {categories.map((cat) => (
                <Link 
                  key={cat} 
                  href={`/category/${cat.toLowerCase()}`}
                  className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-vanguard-red transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Full-screen Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-vanguard-cream flex flex-col">
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-gray-100 focus:outline-none"
            >
              <X className="w-8 h-8 text-vanguard-text" />
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center p-4">
            <form className="w-full max-w-3xl" action="/search" method="GET">
              <input 
                type="text" 
                name="q"
                placeholder="Search the archive..." 
                className="w-full text-4xl md:text-6xl font-serif font-bold border-b-2 border-vanguard-text py-4 focus:outline-none focus:border-vanguard-red bg-transparent placeholder-gray-400"
                autoFocus
              />
              <div className="mt-8 text-sm uppercase tracking-widest text-gray-500">
                Press Enter to search
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-80 max-w-full bg-vanguard-cream h-full border-r border-vanguard-border shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-vanguard-border">
              <span className="font-serif font-bold text-xl text-vanguard-red">Sections</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-grow overflow-y-auto p-4 space-y-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg font-sans font-medium hover:text-vanguard-red border-b border-vanguard-border">
                Home
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat} 
                  href={`/category/${cat.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-lg font-sans font-medium hover:text-vanguard-red border-b border-vanguard-border"
                >
                  {cat}
                </Link>
              ))}
              <div className="mt-8 pt-8">
                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-500 hover:text-vanguard-text uppercase tracking-wider">
                  Admin Dashboard
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
