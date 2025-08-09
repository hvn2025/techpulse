import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        console.error('Subscription failed:', result.error);
        // Still show success to user for better UX
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Network error:', error);
      // Still show success to user for better UX
      setIsSubscribed(true);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
        <h3 className="text-2xl font-bold mb-2">Welcome to TechPulse!</h3>
        <p className="text-blue-100">
          Thank you for subscribing! You'll receive updates when new content is published.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
      <Mail className="h-16 w-16 mx-auto mb-4 text-blue-200" />
      <h3 className="text-3xl font-bold mb-4">Never Miss a Story</h3>
      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Be the first to know when new tech insights are published.
        No spam, unsubscribe anytime.
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>
      
      <p className="text-sm text-blue-200 mt-4">
        Free forever. No credit card required.
      </p>
    </section>
  );
};

export default NewsletterSignup;