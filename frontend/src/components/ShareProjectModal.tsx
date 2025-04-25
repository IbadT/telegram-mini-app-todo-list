import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useProjectStore } from '../store/projectStore';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const { shareProject } = useProjectStore();
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const code = await shareProject(projectId);
      setShareCode(code);
    } catch (error) {
      console.error('Failed to share project:', error);
      setError('Failed to generate share code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (shareCode) {
      const shareLink = `${window.location.origin}/projects/share/${shareCode}`;
      navigator.clipboard.writeText(shareLink);
      const tgWebApp = window.Telegram?.WebApp;
      if (tgWebApp?.showAlert) {
        tgWebApp.showAlert('Share link copied to clipboard!');
      }
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
                  Share Project
                </Dialog.Title>

                {error && (
                  <div className="mt-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-4">
                  {!shareCode ? (
                    <button
                      type="button"
                      onClick={handleShare}
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Generating...' : 'Generate Share Link'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={shareCode}
                          readOnly
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="inline-flex justify-center rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Share this code with others to give them access to your project.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Close
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