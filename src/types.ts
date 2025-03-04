export interface Project {
  id: string;
  name: string;
  createdAt: string;
  thumbnail?: string;
  status: 'draft' | 'processing' | 'completed';
}

export interface VideoClip {
  id: string;
  name: string;
  duration: number;
  src: string;
  thumbnail?: string;
  file?: File; // Added to store the original File object for uploaded files
  metadata?: {
    interestScore?: number;
    motionScore?: number;
    faceDetected?: boolean;
    audioLevel?: number;
  };
}

export interface EditOperation {
  id: string;
  type: 'trim' | 'transition' | 'text' | 'filter' | 'audio';
  params: Record<string, any>;
  startTime: number;
  endTime?: number;
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}