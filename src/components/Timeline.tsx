import React, { useState, useRef, useEffect } from 'react';
import { VideoClip, EditOperation } from '../types';

interface TimelineProps {
  clips: VideoClip[];
  operations: EditOperation[];
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
  onOperationSelect: (operation: EditOperation | null) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  clips, 
  operations, 
  currentTime, 
  duration, 
  onTimeChange,
  onOperationSelect
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;
    
    onTimeChange(Math.max(0, Math.min(newTime, duration)));
  };
  
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const movePosition = e.clientX - rect.left;
    const percentage = movePosition / rect.width;
    const newTime = percentage * duration;
    
    onTimeChange(Math.max(0, Math.min(newTime, duration)));
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getClipPosition = (clip: VideoClip) => {
    // Calculate position based on clip order in the timeline
    const clipIndex = clips.findIndex(c => c.id === clip.id);
    let startTime = 0;
    
    for (let i = 0; i < clipIndex; i++) {
      startTime += clips[i].duration;
    }
    
    const widthPercentage = (clip.duration / duration) * 100;
    return { left: (startTime / duration) * 100, width: widthPercentage };
  };
  
  const getOperationStyle = (operation: EditOperation) => {
    const startPercentage = (operation.startTime / duration) * 100;
    const endPercentage = operation.endTime 
      ? ((operation.endTime - operation.startTime) / duration) * 100
      : 2; // Fixed width for point operations
    
    let bgColor = 'bg-gray-400';
    switch (operation.type) {
      case 'trim': bgColor = 'bg-red-400'; break;
      case 'transition': bgColor = 'bg-blue-400'; break;
      case 'text': bgColor = 'bg-green-400'; break;
      case 'filter': bgColor = 'bg-purple-400'; break;
      case 'audio': bgColor = 'bg-yellow-400'; break;
    }
    
    return {
      left: `${startPercentage}%`,
      width: `${endPercentage}%`,
      className: `absolute h-6 rounded ${bgColor} cursor-pointer`
    };
  };
  
  return (
    <div className="w-full bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{formatTime(0)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div 
        ref={timelineRef}
        className="relative h-16 bg-gray-200 rounded cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Clips visualization */}
        {clips.map(clip => {
          const { left, width } = getClipPosition(clip);
          return (
            <div 
              key={clip.id}
              className="absolute h-8 bg-indigo-200 border border-indigo-300 rounded"
              style={{ left: `${left}%`, width: `${width}%`, top: '4px' }}
            >
              <div className="truncate text-xs p-1">{clip.name}</div>
            </div>
          );
        })}
        
        {/* Operations layer */}
        <div className="absolute bottom-0 left-0 right-0 h-6">
          {operations.map(operation => {
            const style = getOperationStyle(operation);
            return (
              <div 
                key={operation.id}
                style={{ left: style.left, width: style.width }}
                className={style.className}
                onClick={(e) => {
                  e.stopPropagation();
                  onOperationSelect(operation);
                }}
              >
                <span className="text-xs truncate px-1">{operation.type}</span>
              </div>
            );
          })}
        </div>
        
        {/* Current time indicator */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
          style={{ left: `${(currentTime / duration) * 100}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full -ml-1 -mt-1"></div>
        </div>
      </div>
      
      <div className="mt-2 text-center text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Timeline;