import React from 'react';
import { Wand2, X, AlertCircle } from 'lucide-react';

interface AIProcessingModalProps {
  isOpen: boolean;
  toolName: string | null;
  progress: number;
  onCancel: () => void;
  result?: any;
}

const AIProcessingModal: React.FC<AIProcessingModalProps> = ({
  isOpen,
  toolName,
  progress,
  onCancel,
  result
}) => {
  if (!isOpen) return null;

  const formatToolName = (name: string | null) => {
    if (!name) return '';
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const isComplete = progress >= 100;

  const renderResultDetails = () => {
    if (!result) return null;
    
    if (result.type === 'template') {
      return (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">AI applied the template with:</p>
          <p className="text-sm text-gray-600">
            {result.operations} operations including transitions, text overlays, and color adjustments
          </p>
        </div>
      );
    }
    
    if (result.type === 'filter') {
      return (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">AI enhanced your video:</p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Adjusted brightness to {(result.params.brightness || 1).toFixed(2)}x</li>
            <li>Enhanced contrast to {(result.params.contrast || 1).toFixed(2)}x</li>
            <li>Optimized saturation to {(result.params.saturation || 1).toFixed(2)}x</li>
            {result.params.vibrance && (
              <li>Increased vibrance by {((result.params.vibrance - 1) * 100).toFixed(0)}%</li>
            )}
          </ul>
        </div>
      );
    }
    
    if (result.type === 'audio') {
      return (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">AI added background music:</p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Track: {result.params.title}</li>
            <li>Artist: {result.params.artist}</li>
            <li>BPM: {result.params.bpm}</li>
            <li>Key: {result.params.key}</li>
            <li>Volume: {(result.params.volume * 100).toFixed(0)}%</li>
          </ul>
        </div>
      );
    }
    
    if (Array.isArray(result)) {
      if (result[0]?.type === 'trim') {
        return (
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">AI identified and removed:</p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              {result.map((item, index) => (
                <li key={index}>
                  {item.params.reason === 'silence' && `Silent segment (${item.params.duration}s) at ${item.startTime.toFixed(1)}s`}
                  {item.params.reason === 'low quality' && `Low quality segment (${item.params.duration}s) at ${item.startTime.toFixed(1)}s`}
                  {item.params.reason === 'redundant content' && `Redundant content (${item.params.duration}s) at ${item.startTime.toFixed(1)}s`}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      
      if (result[0]?.type === 'text') {
        return (
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">AI generated captions:</p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>{result.length} captions added to your video</li>
              <li>Average confidence: {(result.reduce((sum: number, item: any) => sum + (item.params.confidence || 0), 0) / result.length * 100).toFixed(0)}%</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">You can edit each caption by selecting it on the timeline</p>
          </div>
        );
      }
    }
    
    return (
      <div className="bg-gray-50 p-3 rounded-md mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">AI made the following changes:</p>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
          {Array.isArray(result) ? (
            result.map((item, index) => (
              <li key={index}>
                {item.type === 'trim' && 'Trimmed low-quality segment'}
                {item.type === 'text' && 'Added caption text'}
                {item.type === 'filter' && 'Applied color enhancement'}
                {item.type === 'transition' && 'Added smooth transition'}
                {item.type === 'audio' && 'Added background music'}
              </li>
            ))
          ) : (
            <li>
              {result.type === 'trim' && 'Trimmed low-quality segment'}
              {result.type === 'text' && 'Added caption text'}
              {result.type === 'filter' && 'Applied color enhancement'}
              {result.type === 'transition' && 'Added smooth transition'}
              {result.type === 'audio' && 'Added background music'}
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Wand2 className="h-5 w-5 mr-2 text-indigo-600" />
            {isComplete ? 'AI Processing Complete' : 'AI Processing'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {!isComplete ? (
            <>
              <div className="flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
              
              <p className="text-center text-gray-700 mb-4">
                {formatToolName(toolName)} in progress...
              </p>
              
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                {Math.round(progress)}% complete
              </p>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-700">
                      Our AI is analyzing your video and applying intelligent edits.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      This may take a few moments depending on the complexity of your content.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel Processing
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h4 className="text-center font-medium text-gray-900 mb-2">
                {formatToolName(toolName)} Complete!
              </h4>
              
              <p className="text-center text-gray-600 mb-4">
                {result?.type === 'template' 
                  ? `AI has successfully applied the ${result.name} template to your video.`
                  : 'AI has successfully processed your video and applied intelligent edits.'}
              </p>
              
              {renderResultDetails()}
              
              <div className="flex justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Continue Editing
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIProcessingModal;