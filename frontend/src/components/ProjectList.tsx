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
                  {project.tasks.length} tasks
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {project.tasks.filter((t) => t.completed).length} completed
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                  Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleShare(project.id)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:cursor-pointer transition-all duration-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:cursor-pointer transition-all duration-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      {shareModalProject !== null && (
        <ShareProjectModal
          isOpen={true}
          onClose={() => setShareModalProject(null)}
          projectId={shareModalProject}
        />
      )}
    </div>
  );
};

export default ProjectList; 