import connectDB from '@/lib/db';
import Article from '@/models/Article';
import User from '@/models/User';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const article = await Article.findOne({ slug, status: 'published' }).lean();

  if (!article) {
    return { title: 'Not Found' };
  }

  return {
    title: `${article.title} | Vanguard`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featureImage ? [article.featureImage] : [],
      type: 'article',
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.featureImage ? [article.featureImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  await connectDB();
  User.init(); // ensure User is registered
  
  const article = await Article.findOne({ slug, status: 'published' })
    .populate('author', 'name')
    .lean();

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
      
      {/* Social Sharing - Desktop left gutter */}
      <div className="hidden lg:flex flex-col gap-4 absolute left-8 top-32 text-gray-400">
        <button className="p-2 border border-gray-200 hover:border-gray-400 hover:text-black transition-colors rounded-full" aria-label="Share on X">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </button>
        <button className="p-2 border border-gray-200 hover:border-gray-400 hover:text-black transition-colors rounded-full" aria-label="Share on Facebook">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>

      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <header className="mb-10">
          <Link href={`/category/${article.category.toLowerCase()}`} className="text-vanguard-red font-bold uppercase tracking-wider text-sm mb-4 inline-block hover:underline">
            {article.category}
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          <p className="font-sans text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-b border-vanguard-border py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center font-bold text-gray-500 uppercase">
                {((article.author as any)?.name || 'V').charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900 uppercase tracking-wide text-sm">
                  {(article.author as any)?.name || 'Vanguard Staff'}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  {article.publishedAt ? format(new Date(article.publishedAt), 'MMMM d, yyyy') : 'Date unknown'}
                </div>
              </div>
            </div>
            
            {/* Mobile Share (hidden on desktop) */}
            <div className="flex lg:hidden gap-3 text-gray-400">
               <button aria-label="Share on X"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></button>
            </div>
          </div>
        </header>

        {/* Feature Image */}
        {article.featureImage && (
          <figure className="mb-12">
            <div className="w-full aspect-video bg-gray-100 border border-vanguard-border relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={article.featureImage} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </figure>
        )}

        {/* Article Content */}
        <div className="prose prose-lg md:prose-xl prose-gray max-w-none">
          <ReactMarkdown>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-vanguard-border">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Filed Under:</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
