import { useState, useEffect } from 'react';
import { EditOperation, VideoClip } from '../types';
import * as aiService from '../services/aiService';

type AIToolType = 'auto-edit' | 'smart-trim' | 'auto-caption' | 'background-music' | 'color-enhance' | 'highlight-reel';

interface UseAIResult {
  isProcessing: boolean;
  currentTool: AIToolType | null;
  applyAITool: (tool: AIToolType, videoId: string, options?: any) => Promise<EditOperation[] | VideoClip[] | EditOperation>;
  processingProgress: number;
  cancelProcessing: () => void;
}

export function useAI(): UseAIResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTool, setCurrentTool] = useState<AIToolType | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  const simulateProgress = () => {
    setProcessingProgress(0);
    setIsCancelled(false);
    
    const interval = setInterval(() => {
      if (isCancelled) {
        clearInterval(interval);
        return;
      }
      
      setProcessingProgress(prev => {
        // Slow down progress as it approaches 100%
        const increment = prev < 70 ? Math.random() * 10 : Math.random() * 3;
        const newProgress = prev + increment;
        return newProgress >= 100 ? 99 : newProgress; // Cap at 99% until processing is complete
      });
    }, 300);
    
    setProgressInterval(interval);
    return interval;
  };

  const cancelProcessing = () => {
    setIsCancelled(true);
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    setIsProcessing(false);
    setCurrentTool(null);
    setProcessingProgress(0);
  };

  const applyAITool = async (
    tool: AIToolType, 
    videoId: string, 
    options?: any
  ): Promise<EditOperation[] | VideoClip[] | EditOperation> => {
    setIsProcessing(true);
    setCurrentTool(tool);
    
    const interval = simulateProgress();
    
    try {
      let result;
      
      // Simulate actual processing time based on tool complexity
      const processingTime = getProcessingTime(tool);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      switch (tool) {
        case 'auto-edit':
          result = await aiService.autoEditVideo(videoId, options);
          break;
        case 'smart-trim':
          result = await aiService.smartTrim(videoId);
          break;
        case 'auto-caption':
          result = await aiService.generateCaptions(videoId);
          break;
        case 'background-music':
          result = await aiService.recommendBackgroundMusic(videoId, options?.mood);
          break;
        case 'color-enhance':
          result = await aiService.enhanceColors(videoId, options?.intensity);
          break;
        case 'highlight-reel':
          result = await aiService.createHighlightReel(videoId, options?.duration);
          break;
        default:
          throw new Error(`Unknown AI tool: ${tool}`);
      }
      
      // Set to 100% when complete
      setProcessingProgress(100);
      
      // Clear the interval
      clearInterval(interval);
      setProgressInterval(null);
      
      return result;
    } catch (error) {
      console.error(`Error applying AI tool ${tool}:`, error);
      throw error;
    } finally {
      if (!isCancelled) {
        // Keep the 100% state visible briefly before resetting
        setTimeout(() => {
          if (!isCancelled) {
            setIsProcessing(false);
            setCurrentTool(null);
          }
        }, 1000);
      }
    }
  };

  // Different tools take different amounts of time to process
  const getProcessingTime = (tool: AIToolType): number => {
    switch (tool) {
      case 'auto-edit':
        return 5000; // Most complex, takes longest
      case 'smart-trim':
        return 3000;
      case 'auto-caption':
        return 4000; // Speech recognition takes time
      case 'background-music':
        return 2500;
      case 'color-enhance':
        return 2000; // Relatively quick
      case 'highlight-reel':
        return 4500;
      default:
        return 3000;
    }
  };

  return {
    isProcessing,
    currentTool,
    applyAITool,
    processingProgress,
    cancelProcessing
  };
}