import React, { useState } from 'react';
import { Heart, ThumbsUp, Lightbulb, Zap } from 'lucide-react';
import { useReactions } from '../hooks/useReactions';

interface ReactionButtonsProps {
  articleId: string;
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({ articleId }) => {
  const { counts, userReactions, loading, toggleReaction } = useReactions(articleId);

  const reactionTypes = [
    { key: 'love', icon: Heart, label: 'Love it', color: 'text-red-500', bgColor: 'bg-red-50' },
    { key: 'helpful', icon: ThumbsUp, label: 'Helpful', color: 'text-green-500', bgColor: 'bg-green-50' },
    { key: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { key: 'inspiring', icon: Zap, label: 'Inspiring', color: 'text-purple-500', bgColor: 'bg-purple-50' }
  ];

  if (loading) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What did you think?</h3>
        <div className="flex flex-wrap gap-3">
          {reactionTypes.map((reaction) => {
            const Icon = reaction.icon;
            return (
              <div
                key={reaction.key}
                className="flex items-center px-4 py-2 rounded-full border border-gray-300 text-gray-400 animate-pulse"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="font-medium">{reaction.label}</span>
                <span className="ml-2 text-sm font-semibold">...</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">What did you think?</h3>
      <div className="flex flex-wrap gap-3">
        {reactionTypes.map((reaction) => {
          const Icon = reaction.icon;
          const isActive = userReactions.has(reaction.key);
          const count = counts[`${reaction.key}_count` as keyof typeof counts];

          return (
            <button
              key={reaction.key}
              onClick={() => toggleReaction(reaction.key as any)}
              className={`flex items-center px-4 py-2 rounded-full border transition-all ${
                isActive
                  ? `${reaction.bgColor} ${reaction.color} border-current`
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
              disabled={loading}
            >
              <Icon className={`mr-2 h-4 w-4 ${isActive ? '' : 'text-gray-500'}`} />
              <span className="font-medium">{reaction.label}</span>
              <span className="ml-2 text-sm font-semibold">
                {count > 0 ? count : ''}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Genuine engagement indicator */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <span className="inline-flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Genuine reactions from real readers
        </span>
      </div>
    </div>
  );
};

export default ReactionButtons;