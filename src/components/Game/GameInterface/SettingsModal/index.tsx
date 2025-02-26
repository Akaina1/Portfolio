import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameInterfaceStore } from '../../../../stores/Game/gameInterfaceStore';

const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    toggleSettingsModal,
    keybinds,
    changeKeybind,
    showKeybindLabels,
    toggleKeybindLabels,
  } = useGameInterfaceStore();

  const [activeTab, setActiveTab] = useState('keybinds');
  const [recordingFor, setRecordingFor] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen && !recordingFor) {
        toggleSettingsModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, toggleSettingsModal, recordingFor]);

  // Extract unique categories from keybinds
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(keybinds.map((kb) => kb.category))
    );
    setCategories(uniqueCategories);
    if (uniqueCategories.length > 0 && !activeCategory) {
      setActiveCategory(uniqueCategories[0]);
    }
  }, [keybinds, activeCategory]);

  // Handle recording new keybind
  const startRecording = (actionId: string) => {
    setRecordingFor(actionId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, actionId: string) => {
    e.preventDefault();

    // Build the keybind string
    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');

    // Get the main key
    let key = e.key;
    if (key === ' ') key = 'Space';
    if (key.length === 1) key = key.toUpperCase();
    if (key !== 'Control' && key !== 'Shift' && key !== 'Alt') {
      parts.push(key);
    }

    // Only save if there's a main key (not just modifiers)
    if (
      parts.length > 0 &&
      !['Control', 'Shift', 'Alt'].includes(parts[parts.length - 1])
    ) {
      const newKeybind = parts.join('+');
      changeKeybind(actionId, newKeybind);
      setRecordingFor(null);
    }
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative h-[80vh] w-[80vw] rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        {/* Close button */}
        <button
          onClick={toggleSettingsModal}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-bold">Settings</h2>

        {/* Tabs */}
        <div className="mb-6 flex border-b">
          <button
            className={`mr-4 pb-2 ${
              activeTab === 'keybinds'
                ? 'border-b-2 border-purple-600 font-bold text-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('keybinds')}
          >
            Keybinds
          </button>
          <button
            className={`mr-4 pb-2 ${
              activeTab === 'interface'
                ? 'border-b-2 border-purple-600 font-bold text-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('interface')}
          >
            Interface
          </button>
          <button
            className={`mr-4 pb-2 ${
              activeTab === 'graphics'
                ? 'border-b-2 border-purple-600 font-bold text-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('graphics')}
          >
            Graphics
          </button>
          <button
            className={`mr-4 pb-2 ${
              activeTab === 'audio'
                ? 'border-b-2 border-purple-600 font-bold text-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('audio')}
          >
            Audio
          </button>
        </div>

        {/* Tab content */}
        <div className="h-[calc(100%-8rem)] overflow-y-auto">
          {activeTab === 'keybinds' && (
            <div>
              {/* Global keybind settings */}
              <div className="mb-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h3 className="mb-3 text-lg font-semibold">Keybind Settings</h3>
                <div className="flex items-center">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={showKeybindLabels}
                      onChange={toggleKeybindLabels}
                      className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <span>Show keybind labels on buttons</span>
                  </label>
                </div>
              </div>

              {/* Category selector */}
              <div className="mb-4 flex space-x-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      activeCategory === category ? 'default' : 'outline'
                    }
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Keybinds table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pl-2">Action</th>
                    <th className="pb-2">Keybind</th>
                    <th className="pb-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {keybinds
                    .filter((kb) => kb.category === activeCategory)
                    .map((keybind) => (
                      <tr key={keybind.actionId} className="border-b">
                        <td className="py-2 pl-2">{keybind.label}</td>
                        <td className="py-2">
                          {recordingFor === keybind.actionId ? (
                            <div className="rounded border border-purple-500 bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900/30">
                              Press keys...
                            </div>
                          ) : (
                            <div className="rounded bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                              {keybind.keybind || 'Not set'}
                            </div>
                          )}
                        </td>
                        <td className="py-2">
                          {recordingFor === keybind.actionId ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRecordingFor(null)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, keybind.actionId)
                              }
                            >
                              Cancel
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startRecording(keybind.actionId)}
                            >
                              Change
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'interface' && (
            <div className="p-4">
              <h3 className="mb-4 text-lg font-semibold">Interface Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={showKeybindLabels}
                      onChange={toggleKeybindLabels}
                      className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <span>Show keybind labels on buttons</span>
                  </label>
                </div>
                {/* Other interface settings can go here */}
              </div>
            </div>
          )}

          {activeTab === 'graphics' && (
            <div className="p-4 text-center text-gray-500">
              Graphics settings coming soon...
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="p-4 text-center text-gray-500">
              Audio settings coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
