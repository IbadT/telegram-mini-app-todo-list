import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, useWatch } from 'react-hook-form';
import { CreateCategoryDto } from '../types';
import { useCategoryStore } from '../store/categoryStore';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CreateCategoryDto>();
  const { addCategory, categories } = useCategoryStore();
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Watch for changes in the name field
  const categoryName = useWatch({
    control,
    name: 'name',
  });

  // Check for duplicate categories whenever the name changes
  useEffect(() => {
    if (categoryName) {
      const normalizedInput = categoryName.toLowerCase().trim();
      const isDuplicate = categories.some(
        category => category.name.toLowerCase().trim() === normalizedInput
      );
      
      if (isDuplicate) {
        setCategoryError('Category with this name already exists');
      } else {
        setCategoryError(null);
      }
    } else {
      setCategoryError(null);
    }
  }, [categoryName, categories]);

  const onSubmit = async (data: CreateCategoryDto) => {
    try {
      await addCategory(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const isSubmitDisabled = !!categoryError || !categoryName;

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
                  Add New Category
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        categoryError ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    {categoryError && <p className="text-red-500 text-sm">{categoryError}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <input
                      type="color"
                      {...register('color', { required: 'Color is required' })}
                      className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitDisabled}
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        isSubmitDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500'
                      }`}
                    >
                      Add Category
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