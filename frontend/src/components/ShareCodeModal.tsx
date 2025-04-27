import React from 'react';

interface ShareCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareCode: string;
}

const ShareCodeModal: React.FC<ShareCodeModalProps> = ({ isOpen, onClose, shareCode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg min-w-[300px]">
        <h2 className="text-lg font-semibold mb-4">Share this code</h2>
        <div className="mb-4 text-center text-2xl font-mono">{shareCode}</div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={() => {
            navigator.clipboard.writeText(shareCode);
            onClose();
          }}
        >
          Copy & Close
        </button>
      </div>
    </div>
  );
};

export default ShareCodeModal; 