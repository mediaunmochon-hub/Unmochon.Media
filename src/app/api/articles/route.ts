import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = status ? { status } : {};
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .lean();
      
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    // Auto-generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Assign current user as author
    data.author = (session.user as any).id;

    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const article = await Article.create(data);
    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
