import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Film, Wand2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import AIFeatureHighlight from '../components/AIFeatureHighlight';
import AITemplateGallery from '../components/AITemplateGallery';
import { Project } from '../types';

const Dashboard: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const recentProjects: Project[] = [
    {
      id: '1',
      name: 'Product Demo Video',
      createdAt: '2025-04-10T12:00:00Z',
      thumbnail: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Social Media Ad',
      createdAt: '2025-04-08T15:30:00Z',
      thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'processing'
    },
    {
      id: '3',
      name: 'Tutorial Series',
      createdAt: '2025-04-05T09:15:00Z',
      status: 'draft'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link 
          to="/new-project" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link 
          to="/new-project" 
          className="flex flex-col items-center justify-center h-64 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-300 hover:bg-indigo-100 transition-colors"
        >
          <PlusCircle className="h-12 w-12 text-indigo-500 mb-3" />
          <span className="text-indigo-600 font-medium">Create New Project</span>
        </Link>
        
        <Link 
          to="/upload" 
          className="flex flex-col items-center justify-center h-64 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-300 hover:bg-blue-100 transition-colors"
        >
          <Film className="h-12 w-12 text-blue-500 mb-3" />
          <span className="text-blue-600 font-medium">Upload Videos</span>
        </Link>
        
        <Link 
          to="/templates" 
          className="flex flex-col items-center justify-center h-64 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-colors"
        >
          <Wand2 className="h-12 w-12 text-purple-500 mb-3" />
          <span className="text-purple-600 font-medium">AI Templates</span>
        </Link>
      </div>

      <AITemplateGallery title="Featured AI Templates" />

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AIFeatureHighlight 
            title="Smart Auto-Edit" 
            description="Our AI analyzes your footage and automatically creates professional edits based on content and quality."
            icon="wand"
          />
          <AIFeatureHighlight 
            title="Intelligent Captions" 
            description="Generate accurate captions and subtitles with AI speech recognition in multiple languages."
            icon="sparkles"
          />
          <AIFeatureHighlight 
            title="Content-Aware Music" 
            description="AI matches the perfect royalty-free background music to your video's mood and pacing."
            icon="zap"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;