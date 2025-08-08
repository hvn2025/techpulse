import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          content: string;
          category: string;
          read_time: string;
          image_url: string;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt: string;
          content: string;
          category: string;
          read_time: string;
          image_url: string;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          category?: string;
          read_time?: string;
          image_url?: string;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          article_id: string;
          user_session: string;
          reaction_type: string;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_session: string;
          reaction_type: string;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_session?: string;
          reaction_type?: string;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      reaction_counts: {
        Row: {
          article_id: string;
          love_count: number;
          helpful_count: number;
          insightful_count: number;
          inspiring_count: number;
          updated_at: string;
        };
        Insert: {
          article_id: string;
          love_count?: number;
          helpful_count?: number;
          insightful_count?: number;
          inspiring_count?: number;
          updated_at?: string;
        };
        Update: {
          article_id?: string;
          love_count?: number;
          helpful_count?: number;
          insightful_count?: number;
          inspiring_count?: number;
          updated_at?: string;
        };
      };
    };
  };
};