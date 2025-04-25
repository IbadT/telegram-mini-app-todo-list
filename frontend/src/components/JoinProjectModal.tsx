import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useProjectStore } from '../store/projectStore';

interface JoinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinProject?: (shareCode: string) => Promise<void>;
}

export const JoinProjectModal: React.FC<JoinProjectModalProps> = ({
  isOpen,
  onClose,
  onJoinProject,
}) => {
  const { joinProject } = useProjectStore();
  const [shareCode, setShareCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (!shareCode.trim()) {
      setError('Please enter a share code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      if (onJoinProject) {
        await onJoinProject(shareCode.trim());
      } else {
        await joinProject(shareCode.trim());
      }
      onClose();
    } catch (error) {
      console.error('Failed to join project:', error);
      setError('Failed to join project. Please check the share code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Join Project
                </Dialog.Title>

                {error && (
                  <div className="mt-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-4">
                  <input
                    type="text"
                    value={shareCode}
                    onChange={(e) => setShareCode(e.target.value)}
                    placeholder="Enter share code"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={isLoading || !shareCode.trim()}
                    className="inline-flex justify-center rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Joining...' : 'Join Project'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 