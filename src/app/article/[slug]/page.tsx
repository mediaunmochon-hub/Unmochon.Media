import connectDB from '@/lib/db';
import Article from '@/models/Article';
import User from '@/models/User';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Metadata, ResolvingMetadata } from 'next';
import SocialShare from '@/components/SocialShare';
import ViewTracker from '@/components/ViewTracker';

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
    title: `${article.title} | UNMOCHON`,
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
      <SocialShare title={article.title} className="hidden lg:flex flex-col gap-4 absolute left-8 top-32 text-gray-400" />

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
                {(article.authorName || (article.author as any)?.name || 'U').charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900 uppercase tracking-wide text-sm">
                  {article.authorName || (article.author as any)?.name || 'Unmochon Staff'}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  {article.publishedAt ? format(new Date(article.publishedAt), 'MMMM d, yyyy') : 'Date unknown'}
                </div>
              </div>
            </div>
            
            {/* Mobile Share (hidden on desktop) */}
            <SocialShare title={article.title} className="flex lg:hidden flex-row gap-3 text-gray-400" />
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
      <ViewTracker articleId={article._id.toString()} />
    </article>
  );
}
