import React from 'react';
import { Wand2, Sparkles, Zap } from 'lucide-react';

interface AIFeatureHighlightProps {
  title: string;
  description: string;
  icon?: 'wand' | 'sparkles' | 'zap';
  className?: string;
}

const AIFeatureHighlight: React.FC<AIFeatureHighlightProps> = ({
  title,
  description,
  icon = 'wand',
  className = ''
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'sparkles':
        return <Sparkles className="h-6 w-6" />;
      case 'zap':
        return <Zap className="h-6 w-6" />;
      default:
        return <Wand2 className="h-6 w-6" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <div className="bg-indigo-100 p-2 rounded-md text-indigo-600 mr-3">
          {getIcon()}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default AIFeatureHighlight;