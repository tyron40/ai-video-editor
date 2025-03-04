import React, { useState } from 'react';
import { Wand2, Scissors, Type, Music, Palette, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface AIToolsPanelProps {
  onApplyTool: (tool: string, params?: any) => void;
  isProcessing: boolean;
  currentTool: string | null;
  processingProgress: number;
}

const AIToolsPanel: React.FC<AIToolsPanelProps> = ({ 
  onApplyTool, 
  isProcessing, 
  currentTool,
  processingProgress 
}) => {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [colorIntensity, setColorIntensity] = useState(1.0);
  const [musicMood, setMusicMood] = useState('neutral');
  const [highlightDuration, setHighlightDuration] = useState(30);
  
  const tools = [
    { id: 'auto-edit', name: 'Auto Edit', icon: <Wand2 className="h-5 w-5" />, description: 'Automatically edit your video with AI' },
    { id: 'smart-trim', name: 'Smart Trim', icon: <Scissors className="h-5 w-5" />, description: 'Remove silent or low-quality segments' },
    { id: 'auto-caption', name: 'Auto Caption', icon: <Type className="h-5 w-5" />, description: 'Generate and add captions' },
    { id: 'background-music', name: 'Background Music', icon: <Music className="h-5 w-5" />, description: 'Add AI-matched background music' },
    { id: 'color-enhance', name: 'Color Enhance', icon: <Palette className="h-5 w-5" />, description: 'Enhance colors and lighting' },
    { id: 'highlight-reel', name: 'Highlight Reel', icon: <Sparkles className="h-5 w-5" />, description: 'Create a highlight reel from footage' },
  ];

  const toggleExpandTool = (toolId: string) => {
    if (expandedTool === toolId) {
      setExpandedTool(null);
    } else {
      setExpandedTool(toolId);
    }
  };

  const handleApplyTool = (toolId: string) => {
    let params = {};
    
    // Add tool-specific parameters
    if (toolId === 'color-enhance') {
      params = { intensity: colorIntensity };
    } else if (toolId === 'background-music') {
      params = { mood: musicMood };
    } else if (toolId === 'highlight-reel') {
      params = { duration: highlightDuration };
    }
    
    onApplyTool(toolId, params);
    setExpandedTool(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-medium text-lg mb-4">AI Tools</h3>
      <div className="space-y-3">
        {tools.map(tool => (
          <div key={tool.id} className="rounded-md overflow-hidden">
            <button
              onClick={() => toggleExpandTool(tool.id)}
              disabled={isProcessing}
              className={`w-full flex items-center justify-between p-3 transition-colors text-left
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50'}
                ${currentTool === tool.id ? 'bg-indigo-50 border border-indigo-100' : ''}
                ${expandedTool === tool.id ? 'bg-indigo-50' : ''}
              `}
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-md text-indigo-600 mr-3">
                  {tool.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{tool.name}</h4>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                </div>
              </div>
              {expandedTool === tool.id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedTool === tool.id && (
              <div className="p-3 bg-indigo-50 border-t border-indigo-100">
                {tool.id === 'color-enhance' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intensity: {colorIntensity.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={colorIntensity}
                      onChange={(e) => setColorIntensity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
                
                {tool.id === 'background-music' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Music Mood
                    </label>
                    <select
                      value={musicMood}
                      onChange={(e) => setMusicMood(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="upbeat">Upbeat</option>
                      <option value="dramatic">Dramatic</option>
                      <option value="neutral">Neutral</option>
                      <option value="corporate">Corporate</option>
                      <option value="emotional">Emotional</option>
                    </select>
                  </div>
                )}
                
                {tool.id === 'highlight-reel' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration: {highlightDuration} seconds
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      step="5"
                      value={highlightDuration}
                      onChange={(e) => setHighlightDuration(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
                
                <button
                  onClick={() => handleApplyTool(tool.id)}
                  disabled={isProcessing}
                  className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply {tool.name}
                </button>
              </div>
            )}
            
            {currentTool === tool.id && isProcessing && (
              <div className="mt-2 px-3 pb-3">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-indigo-600 mt-1">Processing: {Math.round(processingProgress)}%</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-sm text-blue-700">
              AI is processing your video...
            </p>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            This may take a few moments depending on video length and complexity
          </p>
        </div>
      )}
    </div>
  );
};

export default AIToolsPanel;