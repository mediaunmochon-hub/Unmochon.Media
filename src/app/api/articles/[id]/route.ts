import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    const article = await Article.findById(params.id).lean();
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const article = await Article.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    revalidatePath('/');
    revalidatePath('/admin');
    if (article.category) {
      revalidatePath(`/category/${article.category.toLowerCase()}`);
    }
    revalidatePath(`/article/${article.slug}`);
    return NextResponse.json(article);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const article = await Article.findByIdAndDelete(params.id);
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/admin');
    if (article.category) {
      revalidatePath(`/category/${article.category.toLowerCase()}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete article' }, { status: 500 });
  }
}
