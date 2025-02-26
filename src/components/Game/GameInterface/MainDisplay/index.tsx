import React from 'react';
import { messages } from './data';
import { renderMessage } from './renderMessage';
import SectionHeader from '@/utilities/sectionHeader';
const MainDisplay: React.FC = () => {
  return (
    <div className="flex h-full flex-col bg-white p-4 dark:bg-gray-900/70">
      <div className="flex items-center justify-between">
        <SectionHeader text="Main Display" icon="📺" version="v1.0" />
        <div className="flex space-x-2">
          <button className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Clear
          </button>
          <button className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Map
          </button>
        </div>
      </div>

      {/* Stylized divider */}
      <div className="mb-3 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

      {/* Message container with scrolling */}
      <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
        {messages.map(renderMessage)}
      </div>
    </div>
  );
};

export default MainDisplay;
