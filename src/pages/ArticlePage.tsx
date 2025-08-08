import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, Clock, Volume2, Pause } from 'lucide-react';
import SocialShare from '../components/SocialShare';
import ReactionButtons from '../components/ReactionButtons';
import { useArticles } from '../hooks/useArticles';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const { getArticle } = useArticles();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    const { data, error } = await getArticle(articleId);
    if (error || !data || !data.published) {
      setArticle(null);
    } else {
      setArticle(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/" replace />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTextToSpeech = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-6">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
            {article.category}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(article.created_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>{article.read_time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={handleTextToSpeech}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause Audio
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Listen to Article
              </>
            )}
          </button>
          
          <SocialShare 
            url={window.location.href}
            title={article.title}
          />
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-12">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.75'
          }}
        />
      </article>

      {/* Reaction Buttons */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <ReactionButtons articleId={parseInt(article.id)} />
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
            T
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">TechPulse Team</h3>
            <p className="text-gray-600">Senior Tech Writer</p>
          </div>
        </div>
        <p className="text-gray-700">
          Our team of technology journalists with years of experience covering AI, 
          software development, and emerging tech trends. She specializes in making complex 
          technical concepts accessible to everyone.
        </p>
      </div>
    </div>
  );
};

export default ArticlePage;