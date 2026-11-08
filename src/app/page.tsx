import connectDB from '@/lib/db';
import Article, { IArticle } from '@/models/Article';
import User from '@/models/User'; // Ensure User is registered
import Link from 'next/link';
import { format } from 'date-fns';

// Helper to ensure MongoDB connection is active
async function getArticles() {
  try {
    await connectDB();
    // Force User model to load before populating
    User.init();
    
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .populate('author', 'name')
      .lean()
      .limit(20);
      
    return articles as unknown as (IArticle & { _id: any, author: { name: string } })[];
  } catch (error) {
    console.error('Database connection error in getArticles:', error);
    return [];
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const allArticles = await getArticles();

  // If no articles, show a placeholder
  if (!allArticles || allArticles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-serif text-4xl mb-4">No stories published yet.</h1>
        <p className="text-gray-500 font-sans">Check back later or access the Admin Dashboard to publish content.</p>
      </div>
    );
  }

  const heroArticle = allArticles[0];
  const sideArticles = allArticles.slice(1, 5);
  const masonryArticles = allArticles.slice(5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Section: Hero (66%) and Side Column (33%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-vanguard-border mb-12">
        
        {/* Top Story Hero */}
        <article className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-vanguard-border p-6 md:p-8 flex flex-col">
          <Link href={`/category/${heroArticle.category.toLowerCase()}`} className="text-vanguard-red font-bold uppercase tracking-wider text-xs mb-4 hover:underline">
            {heroArticle.category}
          </Link>
          <Link href={`/article/${heroArticle.slug}`} className="group mb-6">
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight group-hover:text-gray-700 transition-colors">
              {heroArticle.title}
            </h1>
          </Link>
          
          <div className="flex items-center text-xs text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">
            <span className="font-bold text-gray-800 mr-2">{heroArticle.author?.name || 'Vanguard Staff'}</span>
            <span>•</span>
            <span className="ml-2">{heroArticle.publishedAt ? format(new Date(heroArticle.publishedAt), 'MMM d, yyyy') : 'Recently'}</span>
          </div>
          
          <p className="font-sans text-xl text-gray-700 mb-8 max-w-2xl">
            {heroArticle.excerpt}
          </p>

          {heroArticle.featureImage && (
            <Link href={`/article/${heroArticle.slug}`} className="mt-auto block relative aspect-video w-full overflow-hidden bg-gray-100 border border-vanguard-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={heroArticle.featureImage} 
                alt={heroArticle.title} 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
              />
            </Link>
          )}
        </article>

        {/* Side Column Top News */}
        <aside className="lg:col-span-1 flex flex-col h-full bg-vanguard-bg">
          <div className="p-4 border-b border-vanguard-border bg-gray-50">
            <h2 className="font-serif font-bold text-lg uppercase tracking-widest text-center text-gray-900">Latest News</h2>
          </div>
          <div className="flex-grow flex flex-col divide-y divide-vanguard-border">
            {sideArticles.map((article) => (
              <article key={article._id.toString()} className="p-6 hover:bg-gray-50 transition-colors">
                <Link href={`/category/${article.category.toLowerCase()}`} className="text-vanguard-red font-bold uppercase tracking-wider text-[10px] mb-2 block hover:underline">
                  {article.category}
                </Link>
                <Link href={`/article/${article.slug}`} className="group block">
                  <h3 className="font-serif text-xl font-bold leading-snug mb-3 group-hover:text-vanguard-red transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                  {article.publishedAt ? format(new Date(article.publishedAt), 'h:mm a') : 'Just now'}
                </div>
              </article>
            ))}
            {sideArticles.length === 0 && (
              <div className="p-6 text-sm text-gray-500 italic">No more recent news.</div>
            )}
          </div>
        </aside>
      </div>

      {/* Masonry Category Blocks */}
      {masonryArticles.length > 0 && (
        <>
          <div className="border-b-4 border-black mb-8">
            <h2 className="font-serif font-bold text-3xl mb-2">More from the Archive</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-vanguard-border">
            {masonryArticles.map((article) => (
              <article key={article._id.toString()} className="border-r border-b border-vanguard-border p-6 flex flex-col h-full hover:bg-gray-50 transition-colors group">
                {article.featureImage && (
                  <Link href={`/article/${article.slug}`} className="block mb-4 overflow-hidden border border-vanguard-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.featureImage} 
                      alt={article.title} 
                      className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}
                <Link href={`/category/${article.category.toLowerCase()}`} className="text-vanguard-red font-bold uppercase tracking-wider text-[10px] mb-2 hover:underline">
                  {article.category}
                </Link>
                <Link href={`/article/${article.slug}`} className="block flex-grow">
                  <h3 className="font-serif text-xl font-bold leading-snug mb-3 group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 line-clamp-3">
                    {article.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
