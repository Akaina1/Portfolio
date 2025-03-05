import { GameMessage } from '@/Game/types/GameMessage.types';
import { formatTime } from '@/Game/utilities/formatTime';

// Render a message with appropriate styling based on its type
export const renderMessage = (message: GameMessage) => {
  // Base classes for all messages
  let classes = 'mb-3 px-2 py-1 rounded';

  // Type-specific styling with light/dark mode support
  switch (message.type) {
    case 'system':
      classes +=
        ' bg-purple-100/50 border-l-4 border-purple-500 dark:bg-purple-900/30';
      break;
    case 'npc':
      classes +=
        ' bg-blue-100/50 border-l-2 border-blue-400 dark:bg-blue-900/20';
      break;
    case 'player':
      classes +=
        ' bg-green-100/50 border-l-2 border-green-400 dark:bg-green-900/20';
      break;
    case 'combat':
      classes += ' bg-red-100/50 border-l-2 border-red-400 dark:bg-red-900/20';
      break;
    case 'environment':
      classes += ' bg-gray-100/50 dark:bg-gray-800/20';
      break;
    case 'quest':
      classes +=
        ' bg-yellow-100/50 border-l-4 border-yellow-500 dark:bg-yellow-900/30';
      break;
  }

  // Add importance styling
  if (message.isImportant) {
    classes += ' font-bold text-xl';
  }

  return (
    <div key={message.id} className={classes}>
      {/* Timestamp */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {formatTime(message.timestamp)}
        {message.type === 'system' && ' [SYSTEM]'}
        {message.type === 'quest' && ' [QUEST]'}
        {message.type === 'combat' && ' [COMBAT]'}
      </div>

      {/* Speaker name if present */}
      {message.speaker && (
        <div className="font-medium text-blue-600 dark:text-blue-300">
          {message.speaker}:
        </div>
      )}

      {/* Message content with line breaks preserved */}
      <div
        className={`whitespace-pre-line ${
          message.type === 'player'
            ? 'text-green-600 dark:text-green-300'
            : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
