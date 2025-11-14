'use client';

import { Twitter, Linkedin, Facebook, MessageCircle, Share2 } from 'lucide-react';

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
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}%0A%0A${encodedUrl}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, '_blank', 'width=600,height=600');
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedTitle}%0A%0A${encodedUrl}`;
    window.open(whatsappUrl, '_blank', 'width=600,height=600');
  };

  const shareOnReddit = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    window.open(redditUrl, '_blank', 'width=800,height=600');
  };

  const shareText = locale === 'fr' ? 'Partager' : 'Share';

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={shareOnTwitter}
        className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-medium rounded-lg transition-colors text-sm"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
        Twitter
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2] hover:bg-[#094d92] text-white font-medium rounded-lg transition-colors text-sm"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </button>
      <button
        onClick={shareOnFacebook}
        className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] hover:bg-[#145dbf] text-white font-medium rounded-lg transition-colors text-sm"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </button>
      <button
        onClick={shareOnReddit}
        className="flex items-center gap-2 px-3 py-2 bg-[#FF4500] hover:bg-[#cc3700] text-white font-medium rounded-lg transition-colors text-sm"
        aria-label="Share on Reddit"
      >
        <Share2 className="w-4 h-4" />
        Reddit
      </button>
      <button
        onClick={shareOnWhatsApp}
        className="flex items-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#1da851] text-white font-medium rounded-lg transition-colors text-sm"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </button>
    </div>
  );
}
