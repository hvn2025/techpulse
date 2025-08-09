import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Article = Database['public']['Tables']['articles']['Row'];
type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async (published = true) => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (published) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  const getArticle = async (id: string) => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  };

  const createArticle = async (article: ArticleInsert) => {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (!error) {
      await fetchArticles(false);
      
      // Send newsletter if article is published
      if (article.published && data) {
        try {
          await sendNewsletterNotification(data.id);
        } catch (emailError) {
          console.error('Failed to send newsletter:', emailError);
          // Don't fail the creation if email fails
        }
      }
    }

    return { data, error };
  };

  const updateArticle = async (id: string, updates: ArticleUpdate) => {
    const wasUnpublished = articles.find(a => a.id === id)?.published === false;
    const isNowPublished = updates.published === true;
    
    const { data, error } = await supabase
      .from('articles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (!error) {
      await fetchArticles(false);
      
      // Send newsletter if article was just published
      if (wasUnpublished && isNowPublished && data) {
        try {
          await sendNewsletterNotification(data.id);
        } catch (emailError) {
          console.error('Failed to send newsletter:', emailError);
          // Don't fail the update if email fails
        }
      }
    }

    return { data, error };
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchArticles(false);
    }

    return { error };
  };

  const uploadImage = async (file: File, folder = 'articles') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      return { data: null, error };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return { data: { path: filePath, url: publicUrl }, error: null };
  };

  const sendNewsletterNotification = async (articleId: string) => {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ articleId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send newsletter');
    }

    return await response.json();
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    fetchArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    uploadImage,
  };
};