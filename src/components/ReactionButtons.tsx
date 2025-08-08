import React, { useState } from 'react';
import { Heart, ThumbsUp, Lightbulb, Zap } from 'lucide-react';

interface ReactionButtonsProps {
  articleId: number;
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({ articleId }) => {
  const [reactions, setReactions] = useState({
    love: 142,
    helpful: 89,
    insightful: 67,
    inspiring: 34
  });

  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  const reactionTypes = [
    { key: 'love', icon: Heart, label: 'Love it', color: 'text-red-500', bgColor: 'bg-red-50' },
    { key: 'helpful', icon: ThumbsUp, label: 'Helpful', color: 'text-green-500', bgColor: 'bg-green-50' },
    { key: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { key: 'inspiring', icon: Zap, label: 'Inspiring', color: 'text-purple-500', bgColor: 'bg-purple-50' }
  ];

  const handleReaction = (reactionKey: string) => {
    const newUserReactions = new Set(userReactions);
    const newReactions = { ...reactions };

    if (userReactions.has(reactionKey)) {
      // Remove reaction
      newUserReactions.delete(reactionKey);
      newReactions[reactionKey as keyof typeof reactions]--;
    } else {
      // Add reaction
      newUserReactions.add(reactionKey);
      newReactions[reactionKey as keyof typeof reactions]++;
    }

    setUserReactions(newUserReactions);
    setReactions(newReactions);
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">What did you think?</h3>
      <div className="flex flex-wrap gap-3">
        {reactionTypes.map((reaction) => {
          const Icon = reaction.icon;
          const isActive = userReactions.has(reaction.key);
          const count = reactions[reaction.key as keyof typeof reactions];

          return (
            <button
              key={reaction.key}
              onClick={() => handleReaction(reaction.key)}
              className={`flex items-center px-4 py-2 rounded-full border transition-all ${
                isActive
                  ? `${reaction.bgColor} ${reaction.color} border-current`
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Icon className={`mr-2 h-4 w-4 ${isActive ? '' : 'text-gray-500'}`} />
              <span className="font-medium">{reaction.label}</span>
              <span className="ml-2 text-sm font-semibold">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReactionButtons;