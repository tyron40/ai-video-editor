import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Save, Play, Pause, SkipBack, SkipForward, Download, Share2 } from 'lucide-react';
import Timeline from '../components/Timeline';
import AIToolsPanel from '../components/AIToolsPanel';
import AIProcessingModal from '../components/AIProcessingModal';
import { VideoClip, EditOperation } from '../types';
import { useAI } from '../hooks/useAI';

const VideoEditor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState<EditOperation | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isProcessing, currentTool, applyAITool, processingProgress, cancelProcessing } = useAI();
  
  // Get data from location state
  const uploadedFiles = location.state?.uploadedFiles || [];
  const template = location.state?.template || null;
  const isTemplateProject = location.state?.isTemplateProject || false;
  
  // Mock data - in a real app, this would come from an API
  const [projectName, setProjectName] = useState(location.state?.projectName || "New Project");
  const [totalDuration, setTotalDuration] = useState(120); // seconds
  
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [clipsInitialized, setClipsInitialized] = useState(false);
  
  // Initialize clips from uploaded files or use default clips
  useEffect(() => {
    if (!clipsInitialized) {
      if (uploadedFiles && uploadedFiles.length > 0) {
        const newClips = uploadedFiles.map((file: File, index: number) => {
          // Create object URLs for the uploaded files
          const objectUrl = URL.createObjectURL(file);
          return {
            id: `upload-${index}`,
            name: file.name,
            duration: 30, // This will be updated when video metadata loads
            src: objectUrl,
            file: file
          };
        });
        setClips(newClips);
      } else {
        // Default clips if no uploads
        setClips([
          {
            id: '1',
            name: 'Intro Clip',
            duration: 30,
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '2',
            name: 'Feature Demo',
            duration: 45,
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '3',
            name: 'Closing',
            duration: 45,
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
        ]);
      }
      setClipsInitialized(true);
    }
  }, [uploadedFiles, clipsInitialized]);
  
  // Update video durations once metadata is loaded
  useEffect(() => {
    if (clips.length === 0 || !clipsInitialized) return;
    
    const videoElement = document.createElement('video');
    let totalDur = 0;
    const updatedClips = [...clips];
    let clipIndex = 0;
    
    const loadNextClipDuration = () => {
      if (clipIndex >= clips.length) {
        // All clips processed
        setClips(updatedClips);
        setTotalDuration(totalDur);
        return;
      }
      
      const clip = clips[clipIndex];
      if (clip.src) {
        videoElement.src = clip.src;
        
        videoElement.onloadedmetadata = () => {
          updatedClips[clipIndex] = {
            ...clip,
            duration: videoElement.duration
          };
          totalDur += videoElement.duration;
          clipIndex++;
          loadNextClipDuration();
        };
        
        videoElement.onerror = () => {
          console.error("Error loading video metadata for clip:", clip.name);
          clipIndex++;
          loadNextClipDuration();
        };
      } else {
        clipIndex++;
        loadNextClipDuration();
      }
    };
    
    loadNextClipDuration();
    
    return () => {
      // Clean up
      videoElement.src = '';
      videoElement.onloadedmetadata = null;
      videoElement.onerror = null;
    };
  }, [clips, clipsInitialized]);
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      clips.forEach(clip => {
        if (clip.src && clip.src.startsWith('blob:')) {
          URL.revokeObjectURL(clip.src);
        }
      });
    };
  }, []);
  
  // Initialize operations based on template if it's a template project
  const [operations, setOperations] = useState<EditOperation[]>([]);
  
  useEffect(() => {
    if (isTemplateProject && template && clips.length > 0 && !operations.length) {
      // Simulate template-based operations
      let templateOperations: EditOperation[] = [];
      
      // Different operations based on template type
      if (template.id === '1') { // Product Demo
        templateOperations = [
          {
            id: `template-transition-1`,
            type: 'transition',
            params: { style: 'fade', duration: 1.2 },
            startTime: 5,
          },
          {
            id: `template-text-1`,
            type: 'text',
            params: { text: 'Product Features', position: 'center', style: 'title' },
            startTime: 8,
            endTime: 12
          },
          {
            id: `template-filter-1`,
            type: 'filter',
            params: { name: 'brightness', value: 1.2 },
            startTime: 0,
            endTime: totalDuration
          }
        ];
      } else if (template.id === '2') { // Social Media Story
        templateOperations = [
          {
            id: `template-transition-1`,
            type: 'transition',
            params: { style: 'slide', duration: 0.8 },
            startTime: 3,
          },
          {
            id: `template-text-1`,
            type: 'text',
            params: { text: 'Check This Out!', position: 'top', style: 'social' },
            startTime: 1,
            endTime: 4
          },
          {
            id: `template-filter-1`,
            type: 'filter',
            params: { name: 'vibrant', value: 1.3 },
            startTime: 0,
            endTime: totalDuration
          }
        ];
      } else if (template.id === '3') { // Tutorial
        templateOperations = [
          {
            id: `template-transition-1`,
            type: 'transition',
            params: { style: 'dissolve', duration: 1.0 },
            startTime: 8,
          },
          {
            id: `template-text-1`,
            type: 'text',
            params: { text: 'Step 1: Introduction', position: 'bottom', style: 'caption' },
            startTime: 2,
            endTime: 7
          },
          {
            id: `template-text-2`,
            type: 'text',
            params: { text: 'Step 2: Main Content', position: 'bottom', style: 'caption' },
            startTime: 10,
            endTime: 15
          }
        ];
      }
      
      setOperations(templateOperations);
      
      // Show AI processing modal for template application
      setShowAIModal(true);
      setAiResult({
        type: 'template',
        name: template.name,
        operations: templateOperations.length
      });
      
      // Simulate AI processing
      setTimeout(() => {
        setShowAIModal(false);
      }, 3000);
    } else if (!operations.length) {
      // Default operations if not a template project
      setOperations([
        {
          id: 'op1',
          type: 'transition',
          params: { style: 'fade' },
          startTime: 30,
        },
        {
          id: 'op2',
          type: 'text',
          params: { text: 'Product Features', position: 'center' },
          startTime: 40,
          endTime: 50
        },
        {
          id: 'op3',
          type: 'filter',
          params: { name: 'brightness', value: 1.2 },
          startTime: 60,
          endTime: 90
        }
      ]);
    }
  }, [isTemplateProject, template, clips, totalDuration, operations.length]);
  
  // Load project data
  useEffect(() => {
    // In a real app, this would fetch project data from an API
    console.log(`Loading project with ID: ${projectId}`);
    
    // Simulate loading project data
    const loadProject = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Project data would be loaded here
        console.log('Project data loaded');
      } catch (error) {
        console.error('Error loading project:', error);
      }
    };
    
    loadProject();
  }, [projectId]);
  
  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };
  
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const skipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(currentTime + 10, totalDuration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const skipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleApplyAITool = async (toolId: string, params?: any) => {
    setShowAIModal(true);
    
    try {
      // Call the AI service
      const result = await applyAITool(toolId as any, projectId || '1', params);
      setAiResult(result);
      
      // Update operations or clips based on the result
      if (toolId === 'highlight-reel') {
        // For highlight reel, we get new clips
        setClips(prev => [...prev, ...(result as VideoClip[])]);
      } else if (Array.isArray(result)) {
        // For operations that return multiple edit operations
        setOperations(prev => [...prev, ...(result as EditOperation[])]);
      } else {
        // For operations that return a single edit operation
        setOperations(prev => [...prev, result as EditOperation]);
      }
      
    } catch (error) {
      console.error('Error applying AI tool:', error);
      alert('Failed to apply AI tool. Please try again.');
    } finally {
      // Modal will be closed by the user
    }
  };
  
  // Get current clip based on time
  const getCurrentClip = () => {
    if (clips.length === 0) return null;
    
    let accumulatedTime = 0;
    for (const clip of clips) {
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clip.duration) {
        return clip;
      }
      accumulatedTime += clip.duration;
    }
    return clips[0]; // Default to first clip
  };
  
  const currentClip = getCurrentClip();
  
  const handleSaveProject = async () => {
    // In a real app, this would save the project to the server
    alert('Project saved successfully!');
  };
  
  const handleExportVideo = async () => {
    // In a real app, this would export the video
    alert('Video export started. You will be notified when it\'s ready.');
  };
  
  const handleShareVideo = async () => {
    // In a real app, this would share the video
    alert('Share link copied to clipboard!');
  };

  const handleCloseAIModal = () => {
    if (isProcessing) {
      // If still processing, ask for confirmation
      if (window.confirm('Are you sure you want to cancel the AI processing?')) {
        cancelProcessing();
      } else {
        return; // Don't close the modal if user cancels
      }
    }
    setShowAIModal(false);
  };

  const handleOperationUpdate = (updatedOperation: EditOperation) => {
    setOperations(prev => 
      prev.map(op => op.id === updatedOperation.id ? updatedOperation : op)
    );
    setSelectedOperation(null);
  };

  const handleOperationDelete = (operationId: string) => {
    setOperations(prev => prev.filter(op => op.id !== operationId));
    setSelectedOperation(null);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">{projectName}</h1>
        <div className="flex space-x-4">
          <button 
            onClick={handleSaveProject}
            className="flex items-center px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
          <button 
            onClick={handleExportVideo}
            className="flex items-center px-3 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          <button 
            onClick={handleShareVideo}
            className="flex items-center px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          {template && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h3 className="font-medium text-indigo-900 mb-2">Template: {template.name}</h3>
              <p className="text-xs text-indigo-700 mb-2">{template.description}</p>
              <div className="text-xs text-indigo-600">
                AI has applied this template to your videos
              </div>
            </div>
          )}
          
          <AIToolsPanel 
            onApplyTool={handleApplyAITool}
            isProcessing={isProcessing}
            currentTool={currentTool}
            processingProgress={processingProgress}
          />
          
          {selectedOperation && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-medium text-lg mb-2">Edit {selectedOperation.type}</h3>
              <div className="space-y-3">
                {Object.entries(selectedOperation.params).map(([key, value]) => {
                  // Skip metadata fields that shouldn't be editable
                  if (['confidence', 'metadata', 'referenceSectionStart', 'similarityScore'].includes(key)) {
                    return null;
                  }
                  
                  // Render different input types based on parameter type
                  if (typeof value === 'number') {
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max={key === 'volume' ? "1" : key.includes('duration') ? "10" : "2"}
                          step="0.1"
                          value={value as number}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            const updatedOperation = {
                              ...selectedOperation,
                              params: {
                                ...selectedOperation.params,
                                [key]: newValue
                              }
                            };
                            handleOperationUpdate(updatedOperation);
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>{value}</span>
                          <span>{key === 'volume' ? "1" : key.includes('duration') ? "10" : "2"}</span>
                        </div>
                      </div>
                    );
                  } else if (typeof value === 'boolean') {
                    return (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`param-${key}`}
                          checked={value as boolean}
                          onChange={(e) => {
                            const updatedOperation = {
                              ...selectedOperation,
                              params: {
                                ...selectedOperation.params,
                                [key]: e.target.checked
                              }
                            };
                            handleOperationUpdate(updatedOperation);
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`param-${key}`} className="ml-2 block text-sm text-gray-700">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    );
                  } else {
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => {
                            const updatedOperation = {
                              ...selectedOperation,
                              params: {
                                ...selectedOperation.params,
                                [key]: e.target.value
                              }
                            };
                            handleOperationUpdate(updatedOperation);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    );
                  }
                })}
                
                <div className="flex justify-between pt-2">
                  <button 
                    onClick={() => handleOperationDelete(selectedOperation.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => setSelectedOperation(null)}
                    className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl aspect-video bg-black">
              {currentClip ? (
                <video
                  ref={videoRef}
                  src={currentClip.src}
                  className="w-full h-full"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No video available
                </div>
              )}
              
              {/* Video overlay for text operations */}
              <div className="absolute inset-0 pointer-events-none">
                {operations
                  .filter(op => op.type === 'text' && currentTime >= op.startTime && (!op.endTime || currentTime <= op.endTime))
                  .map(op => {
                    const position = op.params.position || 'center';
                    let positionClass = 'items-center justify-center';
                    
                    if (position === 'top') positionClass = 'items-start justify-center pt-4';
                    if (position === 'bottom') positionClass = 'items-end justify-center pb-4';
                    if (position === 'top-left') positionClass = 'items-start justify-start p-4';
                    if (position === 'top-right') positionClass = 'items-start justify-end p-4';
                    if (position === 'bottom-left') positionClass = 'items-end justify-start p-4';
                    if (position === 'bottom-right') positionClass = 'items-end justify-end p-4';
                    
                    // Different styles based on text style parameter
                    let textClass = 'bg-black bg-opacity-50 text-white px-4 py-2 rounded';
                    if (op.params.style === 'title') {
                      textClass = 'bg-indigo-700 bg-opacity-80 text-white px-6 py-3 rounded-lg text-xl font-bold';
                    } else if (op.params.style === 'caption') {
                      textClass = 'bg-black bg-opacity-70 text-white px-4 py-1 rounded text-sm';
                    } else if (op.params.style === 'social') {
                      textClass = 'bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full font-bold';
                    }
                    
                    return (
                      <div 
                        key={op.id}
                        className={`absolute inset-0 flex ${positionClass}`}
                      >
                        <div className={textClass}>
                          {op.params.text}
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {/* Filter overlay */}
              {operations
                .filter(op => op.type === 'filter' && currentTime >= op.startTime && (!op.endTime || currentTime <= op.endTime))
                .map(op => {
                  let filterStyle = {};
                  
                  if (op.params.name === 'brightness' || op.params.name === 'colorEnhance') {
                    filterStyle = {
                      filter: `
                        brightness(${op.params.brightness || 1})
                        contrast(${op.params.contrast || 1})
                        saturate(${op.params.saturation || 1})
                      `
                    };
                  } else if (op.params.name === 'vibrant') {
                    filterStyle = {
                      filter: `
                        saturate(${op.params.value || 1.3})
                        contrast(1.1)
                      `
                    };
                  }
                  
                  return (
                    <div 
                      key={op.id}
                      className="absolute inset-0 pointer-events-none"
                      style={filterStyle}
                    ></div>
                  );
                })}
            </div>
          </div>
          
          <div className="p-4 bg-gray-800">
            <div className="flex justify-center space-x-4 mb-4">
              <button 
                onClick={skipBackward}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <SkipBack className="h-5 w-5 text-white" />
              </button>
              <button 
                onClick={togglePlayPause}
                className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500"
                disabled={!currentClip}
              >
                {isPlaying ? 
                  <Pause className="h-5 w-5 text-white" /> : 
                  <Play className="h-5 w-5 text-white" />
                }
              </button>
              <button 
                onClick={skipForward}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <SkipForward className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <Timeline 
              clips={clips}
              operations={operations}
              currentTime={currentTime}
              duration={totalDuration}
              onTimeChange={handleTimeChange}
              onOperationSelect={setSelectedOperation}
            />
          </div>
        </div>
      </div>
      
      <AIProcessingModal
        isOpen={showAIModal}
        toolName={currentTool || (template ? `template-${template.name.toLowerCase().replace(/\s+/g, '-')}` : null)}
        progress={processingProgress}
        onCancel={handleCloseAIModal}
        result={aiResult}
      />
    </div>
  );
};

export default VideoEditor;