import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import { ShareProjectModal } from './ShareProjectModal';
import { useState } from 'react';

const ProjectList = () => {
  const { projects, currentProject, setCurrentProject, deleteProject } = useProjectStore();
  const [shareModalProject, setShareModalProject] = useState<number | null>(null);

  const handleShare = (projectId: number) => {
    setShareModalProject(projectId);
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`p-4 rounded-lg shadow-md ${
            currentProject?.id === project.id
              ? 'bg-blue-50 border-2 border-blue-500 dark:bg-blue-900'
              : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className="flex-grow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 p-2 rounded-lg"
              onClick={() => setCurrentProject(project)}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {project.tasks?.length || 0} tasks
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {project.tasks?.filter((t) => t.completed).length || 0} completed
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                  Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleShare(project.id)}
                className="text-gray-400 hover:text-blue-500 hover:cursor-pointer transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-gray-400 hover:text-red-500 hover:cursor-pointer transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No projects yet. Create one to get started!</p>
        </div>
      )}
      {shareModalProject && (
        <ShareProjectModal
          isOpen={true}
          projectId={shareModalProject}
          onClose={() => setShareModalProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectList; 