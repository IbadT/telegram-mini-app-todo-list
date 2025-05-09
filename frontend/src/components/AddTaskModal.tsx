import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { CreateTaskDto, Priority } from '../types';
import { useTaskStore } from '../store/taskStore';
import { useCategoryStore } from '../store/categoryStore';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, projectId }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTaskDto>();
  const { addTask } = useTaskStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setError(null);
    }
  }, [isOpen, fetchCategories]);

  const priorityOptions: Priority[] = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];

  const onSubmit = async (data: CreateTaskDto) => {
    try {
      if (!projectId) {
        setError('No project selected');
        return;
      }

      if (!categories.length) {
        setError('No categories available');
        return;
      }

      if (!data.priority) data.priority = Priority.MEDIUM;
      if ((!data.categoryId || isNaN(Number(data.categoryId))) && categories.length > 0) {
        data.categoryId = categories[0].id;
      }

      await addTask(projectId, data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to add task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  // Add Telegram Mini App initialization
  useEffect(() => {
    if (window.Telegram?.WebApp?.initData) {
      const initData = window.Telegram.WebApp.initData;
      // You can use this data for authentication or other purposes
      console.log('Telegram init data:', initData);
    }
  }, []);

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Add New Task
                </Dialog.Title>
                {error && (
                  <div className="mt-2 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      {...register('description')}
                      className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      {...register('priority', { required: 'Priority is required' })}
                      className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:cursor-pointer"
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                    {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      {...register('categoryId', { 
                        required: 'Category is required',
                        valueAsNumber: true 
                      })}
                      className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:cursor-pointer"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="datetime-local"
                      {...register('dueDate')}
                      onChange={(e) => {
                        register('dueDate').onChange(e);
                        e.target.blur();
                      }}
                      className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:cursor-pointer"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 