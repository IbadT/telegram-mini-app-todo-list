import { useEffect, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import ProjectList from './ProjectList';
import TaskList from './TaskList';
import AddProjectModal from './AddProjectModal';
import { AddTaskModal } from './AddTaskModal';
import { AddCategoryModal } from './AddCategoryModal';
import { JoinProjectModal } from './JoinProjectModal';

const MainContent = () => {
  const { projects, currentProject, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isJoinProjectModalOpen, setIsJoinProjectModalOpen] = useState(false);

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
            <ProjectList />
          </div>

          {currentProject ? (
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tasks for {currentProject.name}
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
                <TaskList tasks={tasks} />
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
              Select a project to view its tasks and categories
            </div>
          )}
        </div>
      </div>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
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