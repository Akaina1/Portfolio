import React, { useMemo, useState } from 'react';
import { messages, currentEnemy } from '../../../data/MainDisplay.data';
import { renderMessage } from './renderMessage';
import SectionHeader from '@/Game/utilities/sectionHeader';
import { ZoomableWorldMap } from '../WorldMap';
import { EnemyDisplay } from './EnemyDisplay';
import { AreaMap } from '../AreaMap';
import { MapData } from '@/Game/types/AreaMap.types';
import { AreaService } from '@/Game/services/area/areaService';

type DisplayMode = 'messages' | 'map' | 'worldmap' | 'combat';

const MainDisplay: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('messages');

  // Example map data - more complex village with different terrain types
  const mapData = useMemo<MapData>(() => {
    const NewMapData = {
      tiles: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 257, 257, 257, 257, 257, 2, 2, 2, 1, 1,
        257, 257, 257, 257, 257, 257, 2, 2, 1, 1, 257, 257, 257, 257, 257, 257,
        257, 2, 1, 1, 257, 257, 256, 257, 257, 257, 257, 257, 1, 1, 257, 257,
        257, 256, 256, 256, 257, 257, 1, 1, 257, 257, 257, 257, 256, 256, 257,
        257, 1, 1, 258, 257, 257, 257, 257, 257, 257, 257, 1, 1, 258, 258, 257,
        257, 257, 257, 257, 257, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      ],
      dimensions: { width: 10, height: 10 },
      version: 1,
    };

    // Parse the map data using AreaService
    return AreaService.deserializeMap(JSON.stringify(NewMapData));
  }, []);

  return (
    <div className="flex h-full flex-col bg-white p-4 dark:bg-gray-900/70">
      <div className="flex items-center justify-between">
        <SectionHeader text="Main Display" icon="📺" version="v1.0" />
        <div className="flex space-x-2">
          <button
            className={`rounded px-2 py-1 text-xs ${
              displayMode === 'messages'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setDisplayMode('messages')}
          >
            Messages
          </button>
          <button
            className={`rounded px-2 py-1 text-xs ${
              displayMode === 'map'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setDisplayMode('map')}
          >
            Map
          </button>
          <button
            className={`rounded px-2 py-1 text-xs ${
              displayMode === 'worldmap'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setDisplayMode('worldmap')}
          >
            World Map
          </button>
          <button
            className={`rounded px-2 py-1 text-xs ${
              displayMode === 'combat'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setDisplayMode('combat')}
          >
            Combat
          </button>
        </div>
      </div>

      {/* Stylized divider */}
      <div className="mb-3 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

      {/* Display content based on mode */}
      <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
        {displayMode === 'messages' && messages.map(renderMessage)}

        {displayMode === 'map' && (
          <AreaMap mapData={mapData} roomName="Meadowbrook Village" />
        )}

        {displayMode === 'worldmap' && <ZoomableWorldMap />}

        {displayMode === 'combat' && (
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-bold text-red-500">Combat View</h3>
            <div className="w-full max-w-md">
              <EnemyDisplay {...currentEnemy} />
            </div>

            {/* Battle log */}
            <div className="mt-6 w-full max-w-md rounded border border-gray-300 p-2 dark:border-gray-700">
              <div className="mb-1 text-sm font-bold">Battle Log:</div>
              <div className="max-h-40 space-y-1 overflow-y-auto text-xs">
                <p>• You attacked Goblin Archer for 8 damage!</p>
                <p>• Goblin Archer is poisoned and takes 2 damage.</p>
                <p className="text-red-500">
                  • Goblin Archer shoots an arrow at you for 5 damage!
                </p>
                <p>• You cast Fireball for 12 damage!</p>
                <p>• Goblin Archer is weakened (-25% Attack).</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDisplay;
