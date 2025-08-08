import React from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, Brain, BarChart3, Calendar } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import { useArticles } from '../hooks/useArticles';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { articles, loading } = useArticles();

  const categoryInfo = {
    'daily-tech': {
      name: 'Daily Tech',
      description: 'Latest technology news and trends, simplified for everyone',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    'ai-deep-dives': {
      name: 'AI Deep Dives',
      description: 'Understanding artificial intelligence, one layer at a time',
      icon: Brain,
      color: 'bg-purple-500'
    },
    'infographics': {
      name: 'Infographics',
      description: 'Complex tech topics visualized and simplified',
      icon: BarChart3,
      color: 'bg-emerald-500'
    },
    'weekly-wrap': {
      name: 'Weekly Wrap',
      description: 'Your weekly digest of the most important tech developments',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  };

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo] || categoryInfo['daily-tech'];
  const Icon = currentCategory.icon;

  const categoryArticles = articles.filter(article => 
    article.published && article.category === currentCategory.name
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <div className="text-center mb-12">
        <div className={`${currentCategory.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <Icon className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {currentCategory.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {currentCategory.description}
        </p>
      </div>

      {/* Articles Grid - Shows when articles exist */}
      {categoryArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Empty State - Shows when no articles in category */}
      {categoryArticles.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-sm p-12">
            <div className={`${currentCategory.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're working on amazing {currentCategory.name.toLowerCase()} content. Subscribe to get notified when new articles are published!
            </p>
            <Link
              to="/newsletter"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Subscribe for Updates
            </Link>
          </div>
        </div>
      )}

      {/* Load More Button - Shows when there are articles */}
      {categoryArticles.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;