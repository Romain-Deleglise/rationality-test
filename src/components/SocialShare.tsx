'use client';

import { Twitter, Linkedin } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  locale: string;
}

export default function SocialShare({ url, title, description, locale }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const shareText = locale === 'fr' ? 'Partager' : 'Share';

  return (
    <div className="flex gap-2">
      <button
        onClick={shareOnTwitter}
        className="flex items-center gap-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
        {shareText}
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        {shareText}
      </button>
    </div>
  );
}
