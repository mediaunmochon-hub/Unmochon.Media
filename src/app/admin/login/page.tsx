'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-vanguard-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 border border-vanguard-border shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
            VANGUARD ADMIN
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 uppercase tracking-widest">
            Sign in to the Newsroom
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center font-bold bg-red-50 p-2 border border-red-200">{error}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">User ID</label>
              <input
                id="email-address"
                name="email"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vanguard-red focus:border-vanguard-red focus:z-10 sm:text-sm"
                placeholder="User ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-vanguard-red focus:border-vanguard-red focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-wider rounded-none text-white bg-black hover:bg-vanguard-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vanguard-red transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-4 text-xs text-center text-gray-400">
          Hint: Use nahida / nahida0211
        </div>
      </div>
    </div>
  );
}
