import { ExportModalProps } from '@/Game/types/ExportModal.types';
import React from 'react';

const ExportModal: React.FC<ExportModalProps> = ({
  showExportModal,
  exportedCode,
  onClose,
  onCopy,
}) => {
  if (!showExportModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[80vh] w-[80vw] max-w-3xl overflow-auto rounded-lg bg-white p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-bold">Updated Map Points</h3>
        <p className="mb-4 text-sm">
          Copy this code and update your data.ts file:
        </p>
        <pre className="mb-4 max-h-[40vh] overflow-auto rounded bg-gray-100 p-4 text-xs dark:bg-gray-900">
          {exportedCode}
        </pre>
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-gray-200 px-4 py-2 text-sm dark:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white"
            onClick={onCopy}
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
