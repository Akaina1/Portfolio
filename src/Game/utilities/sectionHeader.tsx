import { SectionHeaderProps } from '@/Game/types/SectionHeader.types';
import React from 'react';

const SectionHeader: React.FC<SectionHeaderProps> = ({
  text,
  icon,
  version,
}) => {
  return (
    <h2 className="mb-2 flex items-center border-b-2 border-purple-600/30 bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-700 bg-clip-text pb-1 text-3xl font-bold text-transparent drop-shadow-sm dark:from-purple-500 dark:via-blue-500 dark:to-purple-500 dark:drop-shadow-dark-soft">
      <span className="mr-2">{icon}</span>
      {text}
      <span className="ml-2 animate-pulse text-xs text-indigo-700 dark:text-purple-400">
        {version}
      </span>
    </h2>
  );
};

export default SectionHeader;
