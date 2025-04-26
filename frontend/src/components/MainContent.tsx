import { useEffect, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
// import ProjectList from './ProjectList';
import TaskList from './TaskList';
import AddProjectModal from './AddProjectModal';
import { AddTaskModal } from './AddTaskModal';
import { AddCategoryModal } from './AddCategoryModal';
import { JoinProjectModal } from './JoinProjectModal';


const MainContent = () => {
  const { projects, currentProject, fetchProjects, isLoading: isProjectsLoading } = useProjectStore();
  const { tasks, fetchTasks, isLoading: isTasksLoading } = useTaskStore();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isJoinProjectModalOpen, setIsJoinProjectModalOpen] = useState(false);

  console.log({ projects, tasks });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (currentProject?.id) {
      fetchTasks(currentProject.id);
    }
  }, [currentProject?.id, fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects</h1>
            <div className="space-x-2">
              <button
                onClick={() => setIsJoinProjectModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Join Project
              </button>
              <button
                onClick={() => setIsAddProjectModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Project
              </button>
            </div>
          </div>

          <div className="mt-6">
            {isProjectsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div
                      className={`p-4 rounded-lg shadow-md ${
                        currentProject?.id === project.id
                          ? 'bg-blue-50 border-2 border-blue-500 dark:bg-blue-900'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-grow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 p-2 rounded-lg"
                          onClick={() => useProjectStore.getState().setCurrentProject(project)}
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
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => useProjectStore.getState().deleteProject(project.id)}
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

                    {currentProject?.id === project.id && (
                      <div className="mt-4 ml-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Tasks
                          </h2>
                          <div className="space-x-2">
                            <button
                              onClick={() => setIsAddCategoryModalOpen(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Add Category
                            </button>
                            <button
                              onClick={() => setIsAddTaskModalOpen(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Add Task
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          {isTasksLoading ? (
                            <div className="space-y-4">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <TaskList tasks={tasks} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        currentProject={currentProject}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      />

      <JoinProjectModal
        isOpen={isJoinProjectModalOpen}
        onClose={() => setIsJoinProjectModalOpen(false)}
        onJoinProject={async (shareCode: string) => {
          try {
            await useProjectStore.getState().joinProject(shareCode);
          } catch (error) {
            console.error('Failed to join project:', error);
          }
        }}
      />
    </div>
  );
};

export default MainContent; 