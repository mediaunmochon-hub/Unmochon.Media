'use client';

import { useEffect, useRef } from 'react';

export default function ViewTracker({ articleId }: { articleId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch(`/api/articles/${articleId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch((err) => console.error('Failed to track view', err));
  }, [articleId]);

  return null; // Invisible component
}
