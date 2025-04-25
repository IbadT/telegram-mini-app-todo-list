import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';

const ProjectList = () => {
  const { projects, currentProject, setCurrentProject, deleteProject } = useProjectStore();

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
              className="flex-grow cursor-pointer"
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
            <button
              onClick={() => deleteProject(project.id)}
              className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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
      ))}
    </div>
  );
};

export default ProjectList; 