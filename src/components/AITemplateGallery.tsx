import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, ArrowRight, Eye } from 'lucide-react';
import { AITemplate } from '../types';
import TemplatePreview from './TemplatePreview';

interface AITemplateGalleryProps {
  title?: string;
  showViewAll?: boolean;
  limit?: number;
  onSelectTemplate?: (template: AITemplate) => void;
  selectedTemplateId?: string;
}

const AITemplateGallery: React.FC<AITemplateGalleryProps> = ({ 
  title = "AI Templates", 
  showViewAll = true,
  limit = 3,
  onSelectTemplate,
  selectedTemplateId
}) => {
  const navigate = useNavigate();
  const [previewTemplate, setPreviewTemplate] = useState<AITemplate | null>(null);
  
  // Mock data - in a real app, this would come from an API
  const templates: AITemplate[] = [
    {
      id: '1',
      name: 'Product Demo',
      description: 'Perfect for showcasing your product features with professional transitions.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Social Media Story',
      description: 'Vertical format optimized for Instagram and TikTok with engaging effects.',
      thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'Tutorial',
      description: 'Step-by-step format with automatic chapter markers and captions.',
      thumbnail: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      name: 'Vlog',
      description: 'Dynamic cuts, background music, and B-roll transitions for engaging personal content.',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      name: 'Corporate Presentation',
      description: 'Professional style with clean transitions, lower thirds, and corporate branding elements.',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '6',
      name: 'Travel Highlights',
      description: 'Fast-paced editing with location titles, map animations, and cinematic color grading.',
      thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ].slice(0, limit);
  
  const handleTemplateClick = (template: AITemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      setPreviewTemplate(template);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Wand2 className="h-5 w-5 mr-2 text-indigo-600" />
          {title}
        </h2>
        {showViewAll && (
          <button 
            onClick={() => navigate('/templates')}
            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            View all templates
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div 
            key={template.id} 
            className={`relative group ${selectedTemplateId === template.id ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}
          >
            <div 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleTemplateClick(template)}
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
                <div className="mt-2 flex justify-between items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    AI Template
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {previewTemplate && (
        <TemplatePreview 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
          onSelect={onSelectTemplate ? () => {
            onSelectTemplate(previewTemplate);
            setPreviewTemplate(null);
          } : undefined}
        />
      )}
    </div>
  );
};

export default AITemplateGallery;