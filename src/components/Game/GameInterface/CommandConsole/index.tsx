import React from 'react';
import TimeBar from '../../TimeBar';
import SectionHeader from '../../../../utilities/sectionHeader';
import KeybindButton from '../../KeybindButton';
import SettingsModal from '../SettingsModal';
import { useGameInterfaceStore } from '../../../../stores/Game/gameInterfaceStore';

const CommandConsole: React.FC = () => {
  const {
    playerAP,
    maxPlayerAP,
    command,
    setCommand,
    handleCommandSubmit,
    isPlayerTimePaused,
    togglePlayerTimePause,
    sacrificeAmount,
    setSacrificeAmount,
    handleSacrificeAP,
    gainPlayerAP,
    keybinds,
    showKeybindLabels,
    toggleSettingsModal,
  } = useGameInterfaceStore();

  // Get keybind for a specific action
  const getKeybind = (actionId: string) => {
    const keybind = keybinds.find((kb) => kb.actionId === actionId);
    return keybind ? keybind.keybind : '';
  };

  // Common button classes
  const buttonClass =
    'h-10 w-14 rounded bg-purple-600 text-sm text-white hover:bg-purple-700 flex items-center justify-center';
  const utilityButtonClass =
    'h-10 w-24 rounded bg-blue-600 text-sm text-white hover:bg-blue-700 flex items-center justify-center';
  const hotKeyButtonClass =
    'h-10 w-32 rounded bg-green-600 text-sm text-white hover:bg-green-700 flex items-center justify-center';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Always process the command input
    // Use underscore prefix to indicate intentionally unused variable
    const _commandSubmitted = handleCommandSubmit();

    // If the command requires AP to execute an action, use executeAction instead
    // For example:
    // if (commandRequiresAP(command)) {
    //   executeAction('command', { command });
    // }
  };

  return (
    <div className="flex h-full flex-col bg-white p-4 dark:bg-gray-900/70">
      <SectionHeader text="Command Console" icon="⌘" version="v1.0" />

      {/* Fill more vertical space by expanding the button area */}
      <div className="mb-4 grid flex-grow grid-cols-4 gap-4">
        {/* Section 1: Movement buttons in a cross shape */}
        <div className="flex flex-col content-center items-center justify-around">
          <div className="grid grid-cols-3 grid-rows-3 gap-12">
            {/* Empty top-left corner */}
            <div></div>
            {/* North button */}
            <KeybindButton
              actionId="move-north"
              label="North"
              keybind={getKeybind('move-north')}
              onAction={() => console.log('Moving North')}
              className={buttonClass}
              showKeybindLabel={showKeybindLabels}
            >
              North
            </KeybindButton>
            {/* Empty top-right corner */}
            <div></div>

            {/* West button */}
            <KeybindButton
              actionId="move-west"
              label="West"
              keybind={getKeybind('move-west')}
              onAction={() => console.log('Moving West')}
              className={buttonClass}
              showKeybindLabel={showKeybindLabels}
            >
              West
            </KeybindButton>
            {/* Center - could be a "look" or empty */}
            <KeybindButton
              actionId="look"
              label="Look"
              keybind={getKeybind('look')}
              onAction={() => console.log('Looking around')}
              className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}
              showKeybindLabel={showKeybindLabels}
            >
              Look
            </KeybindButton>
            {/* East button */}
            <KeybindButton
              actionId="move-east"
              label="East"
              keybind={getKeybind('move-east')}
              onAction={() => console.log('Moving East')}
              className={buttonClass}
              showKeybindLabel={showKeybindLabels}
            >
              East
            </KeybindButton>

            {/* Empty bottom-left corner */}
            <div></div>
            {/* South button */}
            <KeybindButton
              actionId="move-south"
              label="South"
              keybind={getKeybind('move-south')}
              onAction={() => console.log('Moving South')}
              className={buttonClass}
              showKeybindLabel={showKeybindLabels}
            >
              South
            </KeybindButton>
            {/* Empty bottom-right corner */}
            <div></div>
          </div>
        </div>

        {/* Section 2: Utility buttons */}
        <div className="flex h-full flex-col items-center justify-center">
          <div className="grid grid-cols-3 gap-10">
            <KeybindButton
              actionId="action"
              label="Action"
              keybind={getKeybind('action')}
              onAction={() => console.log('Action')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Action
            </KeybindButton>
            <KeybindButton
              actionId="inventory"
              label="Inventory"
              keybind={getKeybind('inventory')}
              onAction={() => console.log('Inventory')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Inventory
            </KeybindButton>
            <KeybindButton
              actionId="stats"
              label="Stats"
              keybind={getKeybind('stats')}
              onAction={() => console.log('Stats')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Stats
            </KeybindButton>
            <KeybindButton
              actionId="skills"
              label="Skills"
              keybind={getKeybind('skills')}
              onAction={() => console.log('Skills')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Skills
            </KeybindButton>
            <KeybindButton
              actionId="quests"
              label="Quests"
              keybind={getKeybind('quests')}
              onAction={() => console.log('Quests')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Quests
            </KeybindButton>
            <KeybindButton
              actionId="map"
              label="Map"
              keybind={getKeybind('map')}
              onAction={() => console.log('Map')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Map
            </KeybindButton>
            <KeybindButton
              actionId="help"
              label="Help"
              keybind={getKeybind('help')}
              onAction={() => console.log('Help')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Help
            </KeybindButton>
            <KeybindButton
              actionId="settings"
              label="Settings"
              keybind={getKeybind('settings')}
              onAction={toggleSettingsModal}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Settings
            </KeybindButton>
            <KeybindButton
              actionId="trade"
              label="Trade"
              keybind={getKeybind('trade')}
              onAction={() => console.log('Trade')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Trade
            </KeybindButton>
            <KeybindButton
              actionId="save"
              label="Save"
              keybind={getKeybind('save')}
              onAction={() => console.log('Save')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Save
            </KeybindButton>
            <KeybindButton
              actionId="load"
              label="Load"
              keybind={getKeybind('load')}
              onAction={() => console.log('Load')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Load
            </KeybindButton>
            <KeybindButton
              actionId="exit"
              label="Exit"
              keybind={getKeybind('exit')}
              onAction={() => console.log('Exit')}
              className={utilityButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              Exit
            </KeybindButton>
          </div>
        </div>

        {/* Section 3: Customizable hotkeys */}
        <div className="col-span-2 grid grid-cols-3 grid-rows-6 content-center items-center justify-items-center gap-2">
          {/* Generate 18 placeholder hotkey buttons */}
          {Array.from({ length: 18 }).map((_, index) => (
            <KeybindButton
              key={index}
              actionId={`hotkey-${index + 1}`}
              label={`Hotkey ${index + 1}`}
              keybind={getKeybind(`hotkey-${index + 1}`)}
              onAction={() => console.log(`Hotkey ${index + 1} activated`)}
              className={hotKeyButtonClass}
              showKeybindLabel={showKeybindLabels}
            >
              {index + 1}
            </KeybindButton>
          ))}
        </div>
      </div>

      {/* Player Time Bar with pause control */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-xs">Player Time</span>
            <span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs font-bold text-white">
              {playerAP}/{maxPlayerAP} AP
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Always visible sacrifice controls */}
            <input
              type="number"
              min="1"
              max={playerAP}
              value={sacrificeAmount}
              onChange={(e) =>
                setSacrificeAmount(parseInt(e.target.value) || 1)
              }
              className="w-12 rounded-l border border-gray-300 p-1 text-xs dark:border-gray-700 dark:bg-gray-800"
              disabled={playerAP === 0}
            />
            <KeybindButton
              actionId="sacrifice-ap"
              label="Sacrifice AP"
              keybind={getKeybind('sacrifice-ap')}
              onAction={handleSacrificeAP}
              className="rounded-r bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
              disabled={playerAP === 0}
              showKeybindLabel={showKeybindLabels}
            >
              Sacrifice AP
            </KeybindButton>
            <KeybindButton
              actionId="pause-time"
              label={isPlayerTimePaused ? 'Resume Time' : 'Pause Time'}
              keybind={getKeybind('pause-time')}
              onAction={togglePlayerTimePause}
              className={`rounded px-2 py-1 text-xs text-white ${
                isPlayerTimePaused
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
              showKeybindLabel={showKeybindLabels}
            >
              {isPlayerTimePaused ? 'Resume Time' : 'Pause Time'}
            </KeybindButton>
          </div>
        </div>
        <TimeBar
          color="#8B5CF6"
          segmentTime={5000} // 5 seconds per segment
          stopFill={isPlayerTimePaused}
          showPercentage={true}
          onSegmentComplete={gainPlayerAP}
          height="10px"
          maxActionPoints={maxPlayerAP}
          currentActionPoints={playerAP}
        />
      </div>

      {/* Command input at the bottom */}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 rounded-l border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
          placeholder="Enter command..."
        />
        <KeybindButton
          actionId="send-command"
          label="Send"
          keybind={getKeybind('send-command')}
          onAction={handleCommandSubmit}
          type="submit"
          className="rounded-r bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700"
          showKeybindLabel={showKeybindLabels}
        >
          Send
        </KeybindButton>
      </form>

      {/* Settings Modal */}
      <SettingsModal />
    </div>
  );
};

export default CommandConsole;
