import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-serif font-bold text-xl tracking-widest text-vanguard-red hover:text-white transition-colors">
            UNMOCHON CMS
          </Link>
          <nav className="hidden md:flex gap-4 text-sm uppercase tracking-wider font-bold text-gray-300">
            <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/admin/editor" className="hover:text-white transition-colors">New Article</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
          <span>{session.user?.name}</span>
          <a href="/api/auth/signout" className="border border-gray-600 px-3 py-1 hover:bg-white hover:text-black transition-colors">Logout</a>
          <Link href="/" className="ml-4 underline text-vanguard-red hover:text-white">Live Site</Link>
        </div>
      </header>
      
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
