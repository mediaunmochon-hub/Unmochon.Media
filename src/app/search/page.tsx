import connectDB from '@/lib/db';
import Article, { IArticle } from '@/models/Article';
import User from '@/models/User';
import Link from 'next/link';
import { format } from 'date-fns';
import { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}" | UNMOCHON` : 'Search | UNMOCHON',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  let articles: (IArticle & { _id: string; author: { name: string } })[] = [];

  if (query) {
    try {
      await connectDB();
      User.init();
      const regex = new RegExp(query, 'i');
      const results = await Article.find({
        status: 'published',
        $or: [{ title: regex }, { excerpt: regex }, { tags: regex }],
      })
        .sort({ publishedAt: -1 })
        .populate('author', 'name')
        .lean()
        .limit(30);

      articles = results as unknown as (IArticle & {
        _id: string;
        author: { name: string };
      })[];
    } catch {
      // DB not reachable at build time — render empty results
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10 border-b-4 border-vanguard-red pb-4">
        <h1 className="font-serif text-4xl font-bold text-vanguard-red">
          {query ? `Results for "${query}"` : 'Search the Archive'}
        </h1>
        {query && (
          <p className="text-gray-500 mt-2">
            {articles.length} article{articles.length !== 1 ? 's' : ''} found
          </p>
        )}
      </header>

      {!query && (
        <p className="text-gray-500 font-sans text-lg">
          Enter a search term in the bar above.
        </p>
      )}

      {query && articles.length === 0 && (
        <p className="text-gray-500 font-sans text-lg py-20 text-center">
          No articles matched &ldquo;{query}&rdquo;. Try a different keyword.
        </p>
      )}

      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-vanguard-border">
          {articles.map((article) => (
            <article
              key={article._id.toString()}
              className="border-r border-b border-vanguard-border p-6 flex flex-col hover:bg-gray-50 transition-colors group"
            >
              <Link
                href={`/category/${article.category.toLowerCase()}`}
                className="text-vanguard-red font-bold uppercase tracking-wider text-[10px] mb-2 hover:underline"
              >
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
              <div className="mt-4 text-xs text-gray-500 uppercase tracking-widest pt-4 border-t border-gray-100 flex justify-between">
                <span className="font-bold">
                  {article.authorName || article.author?.name || 'Unmochon Staff'}
                </span>
                <span>
                  {article.publishedAt
                    ? format(new Date(article.publishedAt), 'MMM d, yyyy')
                    : ''}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
