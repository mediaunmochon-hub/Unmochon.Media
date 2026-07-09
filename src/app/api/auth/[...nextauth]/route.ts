import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db';
import User from '@/models/User';
// In a real app, use bcrypt. Here we'll do a simple mock for now, but let's assume raw string matching for simplicity or we can just mock a default admin.

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await connectDB();
        
        // For demonstration, if DB is empty, let's create a default admin
        const adminExists = await User.findOne({ email: 'admin@vanguard.com' });
        if (!adminExists) {
          await User.create({
            name: 'Vanguard Admin',
            email: 'admin@vanguard.com',
            passwordHash: 'password', // INSECURE: Use bcrypt in production
            role: 'admin'
          });
        }

        const user = await User.findOne({ email: credentials.email });
        
        // Simple password check (replace with bcrypt.compare in production)
        if (user && user.passwordHash === credentials.password) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'vanguard-super-secret-key-change-in-prod',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
