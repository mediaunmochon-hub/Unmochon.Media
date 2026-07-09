'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit2, Trash2, Eye } from 'lucide-react';

type Article = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  publishedAt: string;
  author: { name: string };
  views?: number;
};

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    try {
      // Create a delete route handler for this (will do next)
      await fetch(`/api/articles/${articleToDelete}`, { method: 'DELETE' });
      setArticles(articles.filter(a => a._id !== articleToDelete));
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const draftsCount = articles.filter(a => a.status === 'draft').length;
  const publishedCount = articles.filter(a => a.status === 'published').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/editor" className="bg-vanguard-red text-white px-6 py-2 font-bold uppercase tracking-wider hover:bg-red-800 transition-colors">
          Write Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-bold text-black">{articles.length}</span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Total Articles</span>
        </div>
        <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-bold text-vanguard-red">{publishedCount}</span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Published</span>
        </div>
        <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-bold text-yellow-600">{draftsCount}</span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Drafts</span>
        </div>
        <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-bold text-blue-600">
            {articles.reduce((sum, article) => sum + (article.views || 0), 0)}
          </span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Total Views</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-bold uppercase tracking-wider">Loading archive...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-bold uppercase tracking-wider">No articles found</td></tr>
            ) : (
              articles.map((article) => (
                <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-serif font-bold text-gray-900 mb-1">{article.title}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{article.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold uppercase">
                    {article.author?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    {article.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold uppercase tracking-wider ${
                      article.status === 'published' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link href={`/article/${article.slug}`} target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors" title="View Live">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link href={`/admin/editor?id=${article._id}`} className="text-gray-400 hover:text-black transition-colors" title="Edit">
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => { setArticleToDelete(article._id); setDeleteModalOpen(true); }}
                        className="text-gray-400 hover:text-vanguard-red transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white border border-vanguard-border text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-bold font-serif text-gray-900" id="modal-title">
                      Delete Article
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 font-sans">
                        Are you sure you want to delete this article? This action cannot be undone and will permanently remove the content from the database.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button type="button" onClick={handleDelete} className="w-full inline-flex justify-center border border-transparent shadow-sm px-4 py-2 bg-vanguard-red text-base font-bold text-white hover:bg-red-800 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm uppercase tracking-wider">
                  Delete
                </button>
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="mt-3 w-full inline-flex justify-center border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm uppercase tracking-wider">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
