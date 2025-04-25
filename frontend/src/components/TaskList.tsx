import { Task } from '../types';
import { format } from 'date-fns';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const { toggleTaskCompletion, deleteTask } = useTaskStore();
  const { currentProject } = useProjectStore();

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

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => currentProject && toggleTaskCompletion(currentProject.id, task.id)}
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
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {task.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  )}
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: task.category.color + '20', color: task.category.color }}
                  >
                    {task.category.name}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => currentProject && deleteTask(currentProject.id, task.id)}
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
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskList; 