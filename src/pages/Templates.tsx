import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, Eye } from 'lucide-react';
import TemplateCard from '../components/TemplateCard';
import TemplatePreview from '../components/TemplatePreview';
import { AITemplate } from '../types';

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState<AITemplate | null>(null);
  
  // Mock data - in a real app, this would come from an API
  const templates: AITemplate[] = [
    {
      id: '1',
      name: 'Product Demo',
      description: 'Perfect for showcasing your product features with professional transitions and text overlays.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Social Media Story',
      description: 'Vertical format optimized for Instagram and TikTok with engaging effects and text animations.',
      thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'Tutorial',
      description: 'Step-by-step format with automatic chapter markers, captions, and highlight zooms.',
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
  ];
  
  const handleSelectTemplate = (template: AITemplate) => {
    setSelectedTemplate(template);
  };
  
  const simulateAIProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            navigate('/new-project');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };
  
  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // In a real app, this would create a new project with the selected template
      simulateAIProcessing();
    }
  };

  const handlePreviewTemplate = (template: AITemplate) => {
    setPreviewTemplate(template);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back
      </button>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Templates</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="relative group">
            <TemplateCard 
              template={template} 
              onSelect={handleSelectTemplate} 
            />
            <button
              onClick={() => handlePreviewTemplate(template)}
              className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-90"
              aria-label={`Preview ${template.name} template`}
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="h-64 bg-gray-200">
              <img 
                src={selectedTemplate.thumbnail} 
                alt={selectedTemplate.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h2>
              <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Template Features:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Automatic scene detection and editing</li>
                  <li>Optimized transitions between clips</li>
                  <li>AI-generated text overlays and captions</li>
                  <li>Color grading and visual enhancements</li>
                  <li>Royalty-free background music selection</li>
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handlePreviewTemplate(selectedTemplate)}
                  className="flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Template
                </button>
                
                {isProcessing ? (
                  <div className="flex-1 ml-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      AI is analyzing template and preparing your project...
                    </p>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setSelectedTemplate(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUseTemplate}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Use This Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {previewTemplate && (
        <TemplatePreview 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
        />
      )}
    </div>
  );
};

export default Templates;