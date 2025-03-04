import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Loader } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusIcon = () => {
    switch (project.status) {
      case 'draft':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'processing':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Link to={`/editor/${project.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-40 bg-gray-200 relative">
          {project.thumbnail ? (
            <img 
              src={project.thumbnail} 
              alt={project.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100">
              <span className="text-indigo-400 font-medium">No Preview</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
            {getStatusIcon()}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;