import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link, Check } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-500 hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-700 hover:text-white'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-600 hover:text-white'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </button>

      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 min-w-48">
          {shareLinks.map((platform) => {
            const Icon = platform.icon;
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${platform.color}`}
                onClick={() => setShowMenu(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {platform.name}
              </a>
            );
          })}
          
          <button
            onClick={() => {
              copyToClipboard();
              setShowMenu(false);
            }}
            className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <>
                <Check className="mr-3 h-4 w-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Link className="mr-3 h-4 w-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialShare;