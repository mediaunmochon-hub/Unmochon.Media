'use client';

import { useState, useEffect } from 'react';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

export default function SocialShare({ title, className = '' }: { title: string, className?: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  if (!url) return null;

  return (
    <div className={className}>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 border border-gray-200 hover:border-gray-400 hover:text-black transition-colors rounded-full flex items-center justify-center" aria-label="Share on X">
        <Twitter className="w-5 h-5" />
      </a>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 border border-gray-200 hover:border-gray-400 hover:text-black transition-colors rounded-full flex items-center justify-center" aria-label="Share on Facebook">
        <Facebook className="w-5 h-5" />
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border border-gray-200 hover:border-gray-400 hover:text-black transition-colors rounded-full flex items-center justify-center" aria-label="Share on LinkedIn">
        <Linkedin className="w-5 h-5" />
      </a>
      <button onClick={handleCopy} className="p-2 border border-gray-200 hover:border-gray-400 hover:text-black transition-colors rounded-full flex items-center justify-center" aria-label="Copy link">
        {copied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
