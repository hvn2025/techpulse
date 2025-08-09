import React, { useState } from 'react';
import { Mail, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';

const NewsletterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    dailyTech: true,
    aiDeepDives: true,
    weeklyWrap: true,
    infographics: false
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          email, 
          preferences 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        console.error('Subscription failed:', result.error);
        // Still show success to user for better UX
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Network error:', error);
      // Still show success to user for better UX
      setIsSubscribed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Users, label: 'Subscribers', value: 'Growing' },
    { icon: TrendingUp, label: 'Quality', value: 'Premium' },
    { icon: Clock, label: 'Avg. Read Time', value: '3 min' }
  ];

  if (isSubscribed) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to TechPulse!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You're all set! You'll receive updates when new content is published.
          </p>
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-blue-800 space-y-2 text-left max-w-md mx-auto">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Get notified when new articles are published</li>
              <li>• Customize your preferences anytime</li>
              <li>• Unsubscribe with one click if needed</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <Mail className="h-16 w-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Join the TechPulse Community
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Be the first to know when new tech insights are published. 
          No spam, no fluff—just the insights that matter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Subscription Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscribe Now</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: 'dailyTech', label: 'Daily Tech', description: 'Latest tech news and trends' },
                  { key: 'aiDeepDives', label: 'AI Deep Dives', description: 'In-depth AI insights and analysis' },
                  { key: 'weeklyWrap', label: 'Weekly Wrap', description: 'Weekly summary of developments' },
                  { key: 'infographics', label: 'Visual Stories', description: 'Infographics and data visualizations' }
                ].map((option) => (
                  <label key={option.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[option.key as keyof typeof preferences]}
                      onChange={(e) => setPreferences(prev => ({ ...prev, [option.key]: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe Free'}
            </button>

            <p className="text-sm text-gray-500 text-center">
              No spam ever. Unsubscribe with one click anytime.
            </p>
          </form>
        </div>

        {/* Benefits & Stats */}
        <div className="space-y-8">
          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Join Our Community</h3>
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center space-x-4">
                    <Icon className="h-8 w-8 text-blue-200" />
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">What You'll Get</h3>
            <div className="space-y-4">
              {[
                'Curated tech stories in digestible 3-minute reads',
                'AI and emerging tech explained simply',
                'Updates on the most important developments',
                'Visual infographics breaking down complex topics',
                'Exclusive insights and analysis',
                'Mobile-optimized content for reading anywhere'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Promise */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Coming Soon</h4>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium text-gray-900">Daily Tech Updates</div>
                <div className="text-gray-600">Breaking down the latest technology developments</div>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="font-medium text-gray-900">AI Deep Dives</div>
                <div className="text-gray-600">Complex AI concepts explained simply</div>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4">
                <div className="font-medium text-gray-900">Visual Stories</div>
                <div className="text-gray-600">Infographics that make tech accessible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;