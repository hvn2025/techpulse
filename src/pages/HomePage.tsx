import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Zap, Brain, BarChart3, Calendar } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import NewsletterSignup from '../components/NewsletterSignup';
import { useArticles } from '../hooks/useArticles';

const HomePage: React.FC = () => {
  const { articles, loading } = useArticles();
  
  const featuredArticles = articles.filter(article => article.published);
  const featuredArticle = featuredArticles.find(article => article.featured) || featuredArticles[0];
  const recentArticles = featuredArticles.filter(article => article.id !== featuredArticle?.id).slice(0, 6);

  const categories = [
    {
      name: "Daily Tech",
      slug: "daily-tech",
      icon: TrendingUp,
      description: "Latest tech news, simplified",
      color: "bg-blue-500"
    },
    {
      name: "AI Deep Dives",
      slug: "ai-deep-dives",
      icon: Brain,
      description: "Understanding AI, one layer at a time",
      color: "bg-purple-500"
    },
    {
      name: "Infographics",
      slug: "infographics",
      icon: BarChart3,
      description: "Complex topics, visualized",
      color: "bg-emerald-500"
    },
    {
      name: "Weekly Wrap",
      slug: "weekly-wrap",
      icon: Calendar,
      description: "Your weekly tech digest",
      color: "bg-orange-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Tech Stories That
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Actually Matter
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Complex technology explained in 3-minute reads. No fluff, no jargon. 
          Just the insights you need to stay ahead in the digital world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/newsletter"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Zap className="mr-2 h-5 w-5" />
            Get Daily Insights
          </Link>
          <Link
            to="/category/daily-tech"
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Browse Articles
          </Link>
        </div>
      </section>

      {/* Featured Article - Will show when articles are added */}
      {featuredArticle && (
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredArticle.image_url}
                  alt={featuredArticle.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                  <span className="ml-3 text-gray-500 text-sm flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {featuredArticle.read_time}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <Link
                  to={`/article/${featuredArticle.id}`}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Read Full Story
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Articles - Will show when articles are added */}
      {recentArticles.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Stories</h2>
            <Link
              to="/category/daily-tech"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State - Shows when no articles */}
      {articles.length === 0 && (
        <section className="mb-16 text-center py-16">
          <div className="bg-white rounded-2xl shadow-sm p-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Your First Article</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your TechPulse website is set up and ready. Start adding your tech stories and insights to engage your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Add Your First Article
              </Link>
              <Link
                to="/newsletter"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Set Up Newsletter
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
};

export default HomePage;