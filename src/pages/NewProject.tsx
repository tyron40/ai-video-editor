import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Wand2, Check } from 'lucide-react';
import VideoUploader from '../components/VideoUploader';
import AITemplateGallery from '../components/AITemplateGallery';
import TemplatePreview from '../components/TemplatePreview';
import { AITemplate } from '../types';

const NewProject: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'template'>('upload');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState<AITemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [showUploadForTemplate, setShowUploadForTemplate] = useState(false);
  const navigate = useNavigate();

  const handleUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setUploadedFiles(prev => prev.filter(f => f !== file));
  };

  const simulateAIProcessing = () => {
    setAiProcessing(true);
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setAiProcessing(false);
            // Navigate with state containing the project name, template, and uploaded files
            navigate('/editor/new-project-id', { 
              state: { 
                projectName, 
                template: selectedTemplate,
                uploadedFiles,
                isTemplateProject: true
              } 
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    if (uploadedFiles.length === 0 && activeTab === 'upload') {
      alert('Please upload at least one video file');
      return;
    }

    if (!selectedTemplate && activeTab === 'template') {
      alert('Please select a template');
      return;
    }

    if (activeTab === 'template' && uploadedFiles.length === 0 && !showUploadForTemplate) {
      setShowUploadForTemplate(true);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === 'template') {
        // If using a template, simulate AI processing
        simulateAIProcessing();
      } else {
        // Navigate to the editor with the new project ID and pass uploaded files
        navigate('/editor/new-project-id', { 
          state: { 
            projectName, 
            uploadedFiles 
          } 
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: AITemplate) => {
    setSelectedTemplate(template);
  };

  // Sample templates for the gallery
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
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter project name"
          />
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('upload');
                setShowUploadForTemplate(false);
              }}
            >
              <div className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Videos
              </div>
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'template'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('template')}
            >
              <div className="flex items-center">
                <Wand2 className="h-4 w-4 mr-2" />
                Use AI Template
              </div>
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'upload' ? (
              <VideoUploader 
                onUpload={handleUpload} 
                uploadedFiles={uploadedFiles} 
                onRemove={handleRemoveFile} 
              />
            ) : (
              <div>
                {!showUploadForTemplate ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Choose an AI Template</h3>
                      {selectedTemplate && (
                        <button
                          onClick={() => setPreviewTemplate(selectedTemplate)}
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          Preview Selected Template
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      {templates.map(template => (
                        <div 
                          key={template.id} 
                          className={`relative cursor-pointer group ${
                            selectedTemplate?.id === template.id 
                              ? 'ring-2 ring-indigo-500 rounded-lg' 
                              : ''
                          }`}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-40 bg-gray-200 relative">
                              <img 
                                src={template.thumbnail} 
                                alt={template.name} 
                                className="w-full h-full object-cover"
                              />
                              {selectedTemplate?.id === template.id && (
                                <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
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
                                  className="text-sm text-indigo-600 hover:text-indigo-500"
                                >
                                  Preview
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedTemplate && (
                      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <h4 className="font-medium text-indigo-900 mb-2">Selected Template: {selectedTemplate.name}</h4>
                        <p className="text-sm text-indigo-700 mb-3">{selectedTemplate.description}</p>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setPreviewTemplate(selectedTemplate)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                          >
                            Preview Template
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <h4 className="font-medium text-indigo-900 mb-2">
                        Upload Videos for {selectedTemplate?.name} Template
                      </h4>
                      <p className="text-sm text-indigo-700 mb-3">
                        Upload videos to apply the {selectedTemplate?.name} template to. The AI will automatically edit your videos according to the template style.
                      </p>
                    </div>
                    
                    <VideoUploader 
                      onUpload={handleUpload} 
                      uploadedFiles={uploadedFiles} 
                      onRemove={handleRemoveFile} 
                    />
                    
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => setShowUploadForTemplate(false)}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Back to Template Selection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCreateProject}
            disabled={isLoading || aiProcessing}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${
              (isLoading || aiProcessing) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading && !aiProcessing ? 'Creating...' : 
             aiProcessing ? 'AI Processing...' : 
             (activeTab === 'template' && !showUploadForTemplate && selectedTemplate) ? 'Continue with Template' :
             'Create Project'}
          </button>
        </div>
        
        {aiProcessing && (
          <div className="mt-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              AI is analyzing your videos and applying the {selectedTemplate?.name} template...
            </p>
          </div>
        )}
      </div>

      {previewTemplate && (
        <TemplatePreview 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
        />
      )}
    </div>
  );
};

export default NewProject;