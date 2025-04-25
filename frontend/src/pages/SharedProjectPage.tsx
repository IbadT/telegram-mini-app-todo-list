import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Project, Task } from '../types';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { JoinProjectModal } from '../components/JoinProjectModal';
import { AddTaskModal } from '../components/AddTaskModal';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';

const SharedProjectPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { projects, joinProject, deleteProject } = useProjectStore();
  const { tasks, fetchTasks, toggleTaskCompletion, deleteTask } = useTaskStore();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const isCreator = user?.id === project?.creatorId;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/projects/share/${code}`);
        const projectData = response.data;
        setProject(projectData);
        
        if (projectData.id) {
          await fetchTasks(projectData.id);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchProject();
    }
  }, [code, fetchTasks]);

  const handleDeleteProject = async () => {
    if (!project) return;
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(project.id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Project not found</div>;

  const projectTasks = tasks.filter(task => task.projectId === project.id);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{project.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{project.description}</p>
            </div>
            {isCreator && (
              <button
                onClick={handleDeleteProject}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete Project
              </button>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Join Project
            </button>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tasks</h2>
          {projectTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
          ) : (
            <div className="space-y-4">
              {projectTasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => project && toggleTaskCompletion(project.id, task.id)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 hover:cursor-pointer transition-all duration-200"
                      />
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            task.completed
                              ? 'text-gray-400 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-gray-600 dark:text-gray-300">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.category && (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {task.category.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isCreator && (
                      <button
                        onClick={() => project && deleteTask(project.id, task.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <JoinProjectModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinProject={async (shareCode: string) => {
          try {
            await joinProject(shareCode);
            navigate('/');
          } catch (error) {
            console.error('Failed to join project:', error);
          }
        }}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        currentProject={project}
      />
    </div>
  );
};

export default SharedProjectPage; 