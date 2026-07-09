import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'User ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await connectDB();
        
        // For demonstration, if DB is empty, let's create a default admin
        const adminExists = await User.findOne({ email: 'nahida' });
        if (!adminExists) {
          const hashedPassword = await bcrypt.hash('nahida0211', 10);
          await User.create({
            name: 'Nahida',
            email: 'nahida',
            passwordHash: hashedPassword,
            role: 'admin'
          });
        }

        const user = await User.findOne({ email: credentials.email });
        
        if (user) {
          // Backward compatibility check for plain-text password from old setup
          const isMatch = await bcrypt.compare(credentials.password, user.passwordHash).catch(() => false);
          
          if (isMatch || user.passwordHash === credentials.password) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
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
