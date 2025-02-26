import type { ChatChannel } from '@/types/ChatChannel';
import SectionHeader from '@/utilities/sectionHeader';
import React, { useState } from 'react';

const ChatConsole: React.FC = () => {
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('world');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Message to ${activeChannel}:`, message);
    // Here you would send the message to the game server
    setMessage('');
  };

  // Define all available channels
  const allChannels: ChatChannel[] = [
    'world',
    'local',
    'party',
    'whisper',
    'trade',
    'guild',
    'admin',
    'system',
  ];

  // Split channels into rows of 6 max
  const firstRowChannels = allChannels.slice(0, 6);
  const secondRowChannels = allChannels.slice(6);

  return (
    <div className="flex h-full flex-col bg-white p-4 dark:bg-gray-900/70">
      <SectionHeader text="Chat" icon="💬" version="v1.0" />

      <div className="mb-2 flex w-full flex-col">
        {/* First row of channels */}
        <div className="grid w-full grid-cols-6 gap-1">
          {firstRowChannels.map((channel) => (
            <button
              key={channel}
              className={`rounded-t border-b-2 px-1 py-1 text-xs ${
                activeChannel === channel
                  ? 'border-purple-600 font-bold text-purple-600'
                  : 'border-gray-300 text-gray-500'
              }`}
              onClick={() => setActiveChannel(channel)}
            >
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </button>
          ))}
        </div>

        {/* Second row of channels (if needed) */}
        {secondRowChannels.length > 0 && (
          <div className="mt-1 grid w-full grid-cols-6 gap-1">
            {secondRowChannels.map((channel, index) => (
              <button
                key={index}
                className={`rounded-t border-b-2 px-1 py-1 text-xs ${
                  activeChannel === channel
                    ? 'border-purple-600 font-bold text-purple-600'
                    : 'border-gray-300 text-gray-500'
                }`}
                onClick={() => setActiveChannel(channel)}
              >
                {channel.charAt(0).toUpperCase() + channel.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded bg-white/30 p-2 dark:bg-black/30">
        <div className="text-sm text-gray-500">
          Welcome to the {activeChannel} chat.
        </div>
        {/* Chat messages would be rendered here */}
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-l border border-gray-300 p-1 text-sm dark:border-gray-700 dark:bg-gray-800"
          placeholder={`Type ${activeChannel} message...`}
        />
        <button
          type="submit"
          className="rounded-r bg-purple-600 px-2 py-1 text-sm font-bold text-white hover:bg-purple-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatConsole;
