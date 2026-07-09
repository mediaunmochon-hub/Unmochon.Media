import connectDB from '@/lib/db';
import Article, { IArticle } from '@/models/Article';
import User from '@/models/User';
import Link from 'next/link';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ category: string }>;
};

// Helper to ensure MongoDB connection is active
async function getArticlesByCategory(categoryParam: string) {
  await connectDB();
  User.init();
  
  // Case-insensitive match for category using regex or exact match if normalized
  // The DB stores them capitalized, e.g., 'Politics', 'Economy'
  const categories = ['Politics', 'Economy', 'Tech', 'Culture', 'Opinion'];
  const matchedCategory = categories.find(c => c.toLowerCase() === categoryParam.toLowerCase());
  
  if (!matchedCategory) {
    return null;
  }

  const articles = await Article.find({ status: 'published', category: matchedCategory })
    .sort({ publishedAt: -1 })
    .populate('author', 'name')
    .lean();
    
  return { 
    articles: articles as unknown as (IArticle & { _id: any, author: { name: string } })[],
    categoryName: matchedCategory
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category } = await params;
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${capitalized} News & Analysis | Vanguard`,
    description: `Latest independent news, analysis, and opinion on ${capitalized}.`,
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const result = await getArticlesByCategory(category);

  if (!result) {
    notFound();
  }

  const { articles, categoryName } = result;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 border-b-4 border-black pb-4">
        <h1 className="font-serif text-5xl font-bold uppercase tracking-wide">
          {categoryName}
        </h1>
        <p className="font-sans text-gray-500 mt-2 text-lg">
          Latest stories, analysis, and opinion pieces.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="font-serif text-3xl mb-4 text-gray-600">No stories found in this section.</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-vanguard-border">
          {articles.map((article) => (
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
                <h3 className="font-serif text-2xl font-bold leading-snug mb-3 group-hover:text-gray-600 transition-colors">
                  {article.title}
                </h3>
                <p className="font-sans text-sm text-gray-600 line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
              </Link>
              <div className="mt-auto text-xs text-gray-500 uppercase tracking-widest pt-4 border-t border-gray-100 flex justify-between">
                <span className="font-bold">{article.authorName || article.author?.name || 'Vanguard Staff'}</span>
                <span>{article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : ''}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
