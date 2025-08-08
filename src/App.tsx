import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import NewsletterPage from './pages/NewsletterPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ArticleEditor from './pages/ArticleEditor';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          {/* Hidden Admin Routes - Only accessible via direct URL */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/articles/new" element={
            <AdminRoute>
              <ArticleEditor />
            </AdminRoute>
          } />
          <Route path="/admin/articles/edit/:id" element={
            <AdminRoute>
              <ArticleEditor />
            </AdminRoute>
          } />
          
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/newsletter" element={<NewsletterPage />} />
                  <Route path="/about" element={<div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-3xl font-bold mb-4">About TechPulse</h1><p className="text-gray-600">Making complex technology accessible to everyone.</p></div>} />
                  <Route path="/contact" element={<div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-3xl font-bold mb-4">Contact Us</h1><p className="text-gray-600">Get in touch with the TechPulse team.</p></div>} />
                  <Route path="/privacy" element={<div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-3xl font-bold mb-4">Privacy Policy</h1><p className="text-gray-600">Your privacy is important to us.</p></div>} />
                  <Route path="/terms" element={<div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-3xl font-bold mb-4">Terms of Service</h1><p className="text-gray-600">Terms and conditions for using TechPulse.</p></div>} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;