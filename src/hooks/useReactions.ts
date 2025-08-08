import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type ReactionType = 'love' | 'helpful' | 'insightful' | 'inspiring';

interface ReactionCounts {
  love_count: number;
  helpful_count: number;
  insightful_count: number;
  inspiring_count: number;
}

interface UserReaction {
  reaction_type: ReactionType;
}

export const useReactions = (articleId: string) => {
  const [counts, setCounts] = useState<ReactionCounts>({
    love_count: 0,
    helpful_count: 0,
    insightful_count: 0,
    inspiring_count: 0
  });
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userSession] = useState(() => {
    // Create or get persistent session ID
    let sessionId = localStorage.getItem('user_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_session', sessionId);
    }
    return sessionId;
  });

  // Fetch reaction counts and user's reactions
  const fetchReactions = async () => {
    try {
      // Get reaction counts
      const { data: countsData, error: countsError } = await supabase
        .from('reaction_counts')
        .select('*')
        .eq('article_id', articleId)
        .maybeSingle();

      if (countsError) {
        console.error('Error fetching reaction counts:', countsError);
      } else if (countsData) {
        setCounts(countsData);
      }

      // Get user's reactions
      const { data: userReactionsData, error: userError } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('article_id', articleId)
        .eq('user_session', userSession);

      if (userError) {
        console.error('Error fetching user reactions:', userError);
      } else {
        const userReactionSet = new Set(
          userReactionsData?.map((r: UserReaction) => r.reaction_type) || []
        );
        setUserReactions(userReactionSet);
      }
    } catch (error) {
      console.error('Error in fetchReactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add or remove a reaction
  const toggleReaction = async (reactionType: ReactionType) => {
    try {
      const hasReaction = userReactions.has(reactionType);

      if (hasReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('article_id', articleId)
          .eq('user_session', userSession)
          .eq('reaction_type', reactionType);

        if (error) throw error;

        // Update local state
        const newUserReactions = new Set(userReactions);
        newUserReactions.delete(reactionType);
        setUserReactions(newUserReactions);

        setCounts(prev => ({
          ...prev,
          [`${reactionType}_count`]: Math.max(0, prev[`${reactionType}_count` as keyof ReactionCounts] - 1)
        }));
      } else {
        // Add reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            article_id: articleId,
            user_session: userSession,
            reaction_type: reactionType,
            ip_address: await getClientIP()
          });

        if (error) throw error;

        // Update local state
        const newUserReactions = new Set(userReactions);
        newUserReactions.add(reactionType);
        setUserReactions(newUserReactions);

        setCounts(prev => ({
          ...prev,
          [`${reactionType}_count`]: prev[`${reactionType}_count` as keyof ReactionCounts] + 1
        }));
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      // Revert optimistic update on error
      await fetchReactions();
    }
  };

  // Get client IP for additional validation
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchReactions();
    }
  }, [articleId]);

  return {
    counts,
    userReactions,
    loading,
    toggleReaction,
    refreshReactions: fetchReactions
  };
};