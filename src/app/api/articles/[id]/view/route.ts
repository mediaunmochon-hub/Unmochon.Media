import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Article from '@/models/Article';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    
    // Increment the views field by 1
    const article = await Article.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, views: article.views });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
  }
}
