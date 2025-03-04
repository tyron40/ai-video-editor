import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Film, AlertCircle } from 'lucide-react';

interface VideoUploaderProps {
  onUpload: (files: File[]) => void;
  uploadedFiles: File[];
  onRemove: (file: File) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUpload, uploadedFiles, onRemove }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(rejection => {
        if (rejection.errors[0].code === 'file-too-large') {
          return 'File is too large. Maximum size is 500MB.';
        }
        if (rejection.errors[0].code === 'file-invalid-type') {
          return 'Invalid file type. Please upload MP4, MOV, AVI, or WEBM files.';
        }
        return 'Error uploading file.';
      });
      setUploadError(errors[0]);
      return;
    }

    setUploadError(null);
    
    // Simulate upload process
    if (acceptedFiles.length > 0) {
      setIsUploading(true);
      
      // Simulate network delay
      setTimeout(() => {
        onUpload(acceptedFiles);
        setIsUploading(false);
      }, 1500);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxSize: 1024 * 1024 * 500, // 500MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
          ${uploadError ? 'border-red-300 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm font-medium text-gray-900">Uploading videos...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">
              {isDragActive ? 'Drop the videos here' : 'Drag & drop videos here, or click to select'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              MP4, MOV, AVI, WEBM up to 500MB
            </p>
          </>
        )}
      </div>

      {uploadError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{uploadError}</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files</h4>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center">
                  <Film className="h-5 w-5 text-indigo-500 mr-2" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-xs block">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-16 bg-green-100 rounded-full mr-3">
                    <div className="h-full bg-green-500 rounded-full w-full"></div>
                  </div>
                  <button 
                    onClick={() => onRemove(file)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;