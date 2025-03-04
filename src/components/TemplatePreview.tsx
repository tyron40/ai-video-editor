import React, { useState, useEffect } from 'react';
import { AITemplate } from '../types';
import { Play, Pause, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface TemplatePreviewProps {
  template: AITemplate;
  onClose: () => void;
  onSelect?: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  template, 
  onClose,
  onSelect 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock preview steps for each template
  const previewSteps = [
    {
      title: 'Original Footage',
      description: 'Your raw video before AI processing',
      image: `https://images.unsplash.com/photo-1576824303923-18e2c3d6c27b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
    },
    {
      title: 'AI Scene Detection',
      description: 'AI identifies key moments and scenes',
      image: `https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
    },
    {
      title: 'Smart Transitions',
      description: 'Smooth transitions are automatically added',
      image: `https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
    },
    {
      title: 'Color Enhancement',
      description: 'Colors are optimized for visual impact',
      image: `https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
    },
    {
      title: 'Final Result',
      description: 'Your professionally edited video',
      image: template.thumbnail
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            setCurrentStep(current => {
              const nextStep = (current + 1) % previewSteps.length;
              return nextStep;
            });
            return 0;
          }
          return newProgress;
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, previewSteps.length]);

  const handleNext = () => {
    setCurrentStep((currentStep + 1) % previewSteps.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentStep((currentStep - 1 + previewSteps.length) % previewSteps.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleUseTemplate = () => {
    if (onSelect) {
      onSelect();
    } else {
      onClose();
      // In a real app, this would navigate to template selection
      window.location.href = '/new-project';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">{template.name} Preview</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="relative">
          <div className="h-80 bg-gray-900 relative overflow-hidden">
            <img 
              src={previewSteps[currentStep].image} 
              alt={previewSteps[currentStep].title} 
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            
            {/* Step indicator overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex justify-between items-center text-white">
                <div>
                  <h3 className="font-bold text-lg">{previewSteps[currentStep].title}</h3>
                  <p className="text-sm text-gray-300">{previewSteps[currentStep].description}</p>
                </div>
                <div className="text-sm">
                  Step {currentStep + 1} of {previewSteps.length}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-1 w-full bg-gray-700 mt-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4">
            <button 
              onClick={handlePrev}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={handleNext}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={togglePlayPause}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause Preview
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Auto Play Preview
                </>
              )}
            </button>
            
            <div className="flex space-x-1">
              {previewSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index);
                    setProgress(0);
                  }}
                  className={`h-2 w-2 rounded-full ${
                    currentStep === index ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <h3 className="font-medium text-gray-900 mb-2">Template Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-6">
            <li>Automatic scene detection and editing</li>
            <li>Optimized transitions between clips</li>
            <li>AI-generated text overlays and captions</li>
            <li>Color grading and visual enhancements</li>
            <li>Royalty-free background music selection</li>
          </ul>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close Preview
            </button>
            <button 
              onClick={handleUseTemplate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;