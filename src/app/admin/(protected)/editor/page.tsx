'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function EditorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featureImage: '',
    category: 'Politics',
    tags: '',
    status: 'draft'
  });
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, featureImage: result.url }));
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      setAutoSlug(false);
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`);
      const data = await res.json();
      if (res.ok) {
        setFormData({
          ...data,
          tags: data.tags ? data.tags.join(', ') : ''
        });
      } else {
        setError(data.error || 'Failed to fetch article');
      }
    } catch (err) {
      setError('Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && autoSlug) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    } else {
      if (name === 'slug') setAutoSlug(false);
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      status,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const url = articleId ? `/api/articles/${articleId}` : '/api/articles';
      const method = articleId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save article');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && articleId && !formData.title) {
    return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Loading Editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-vanguard-border shadow-sm p-8">
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-bold">{error}</div>}
      
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-vanguard-border">
        <h1 className="font-serif text-3xl font-bold">{articleId ? 'Edit Article' : 'New Article'}</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="px-6 py-2 border border-black text-black font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('published')}
            disabled={loading}
            className="px-6 py-2 bg-vanguard-red text-white font-bold uppercase tracking-wider hover:bg-red-800 transition-colors disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full text-4xl font-serif font-bold border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-vanguard-red px-0 py-2 bg-transparent placeholder-gray-300"
            placeholder="Headline Goes Here"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">URL Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-vanguard-red font-mono text-sm"
              placeholder="article-url-slug"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-vanguard-red bg-white"
            >
              {['Politics', 'Economy', 'Tech', 'Culture', 'Opinion'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Subtitle / Excerpt (Max 200 chars)</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            maxLength={200}
            rows={2}
            className="w-full font-sans text-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-vanguard-red resize-none"
            placeholder="A brief summary that appears under the headline..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Feature Image</label>
          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {uploading && <span className="text-sm text-gray-500 uppercase font-bold tracking-widest">Uploading...</span>}
          </div>
          {formData.featureImage && (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.featureImage} alt="Feature preview" className="h-40 object-cover border border-vanguard-border" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex justify-between">
            <span>Body Content (Markdown)</span>
            <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-vanguard-red hover:underline text-xs">Markdown Guide</a>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={20}
            className="w-full font-mono text-base border border-gray-300 px-4 py-4 focus:outline-none focus:border-vanguard-red resize-y"
            placeholder="Write your article here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-vanguard-red"
            placeholder="election, congress, debate"
          />
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Loading...</div>}>
      <EditorForm />
    </Suspense>
  );
}
