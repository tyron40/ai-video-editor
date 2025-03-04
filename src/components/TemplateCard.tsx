import React from 'react';
import { AITemplate } from '../types';

interface TemplateCardProps {
  template: AITemplate;
  onSelect: (template: AITemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect(template)}
    >
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={template.thumbnail} 
          alt={template.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{template.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {template.description}
        </p>
        <div className="flex items-center mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
            AI Template
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;