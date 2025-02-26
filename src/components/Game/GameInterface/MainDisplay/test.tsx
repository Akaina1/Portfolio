import React, { useState, useMemo } from 'react';
import { messages } from './data';
import { renderMessage } from './renderMessage';
import SectionHeader from '@/utilities/sectionHeader';

// Collection of ASCII art for different enemy types
const enemyArtCollection: Record<string, { art: string; color: string }> = {
  wolf: {
    art: `
      /\\____/\\
     /  @  @  \\
    ( ==  ^  == )
     )         (
    /           \\
   (             )
    \\_______/\\/
`,
    color: 'text-gray-600',
  },
  goblin: {
    art:
      `
       ,      ,
      /(.-""-.)\\
  |\\  \\/      \\/  /|
  | \\ / =.  .= \\ / |
  \\( \\   o\\/o   / )/
   \\_, '-/  \\-' ,_/
     /   \\__/   \\
     \\ \\__/\\__/ /
   ___\\ \\|--|/ /___
 /` +
      '`' +
      `    \\      /    ` +
      '`' +
      `\\
`,
    color: 'text-green-600',
  },
  dragon: {
    art: `
           /\\
          /  \\
         / /\\ \\
        / /  \\ \\
       / /    \\ \\
      / /      \\ \\
     /==========- \\
    /            \\ \\
   /   (\\    /)   \\ \\
  /   //\\\\..//\\\\    \\ \\
 /   //  \\\\//  \\\\    \\ \\
/   //            \\\\   \\ \\
\\      \\\\    //      /
 \\      \\\\  //      /
`,
    color: 'text-red-600',
  },
  skeleton: {
    art: `
     .-.
    (o.o)
     |=|
    __|__
  //.=|=.\\\\
 // .=|=. \\\\
 \\\\ .=|=. //
  \\\\(_=_)//
   (:| |:)
    || ||
    () ()
    || ||
    || ||
   ==' '==
`,
    color: 'text-gray-200',
  },
  slime: {
    art: `
       .--.
    .'    '.
   /   __   \\
  |   /  \\   |
  |   \\__/   |
   \\        /
    '.____.'
`,
    color: 'text-blue-500',
  },
  spider: {
    art: `
    /\\  |\\/|  /\\
   /  \\ |  | /  \\
  |    \\|  |/    |
   \\  , \\oo/  ,  /
    \\(_=\\/\\=_)/
     (_)  (_)
`,
    color: 'text-purple-800',
  },
  bat: {
    art: `
   /\\                 /\\
  / \\'._   (\\_/)   _.'/ \\
 /    '-'  (o.o)  '-'    \\
/       /   (-)   \\       \\
      /     (_)     \\
`,
    color: 'text-gray-800',
  },
};

// Enhanced enemy component with detailed ASCII art
const EnemyDisplay: React.FC<{
  type: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  status?: string[];
}> = ({ type, name, level, health, maxHealth, status = [] }) => {
  // Get enemy art or default to wolf
  const enemy = enemyArtCollection[type] || enemyArtCollection.wolf;

  // Calculate health bar width (20 chars total)
  const healthPercentage = (health / maxHealth) * 100;
  const healthBarWidth = Math.round(healthPercentage / 5);
  const healthBar =
    '[' + '='.repeat(healthBarWidth) + ' '.repeat(20 - healthBarWidth) + ']';

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex justify-center">
        <span className="font-bold">{name}</span>
        <span className="ml-2 text-gray-500">Lv. {level}</span>
      </div>
      <pre className={`whitespace-pre-wrap font-mono ${enemy.color}`}>
        {enemy.art}
      </pre>
      <div className="mt-2 w-full">
        <div className="flex justify-between">
          <span className="text-xs">
            HP: {health}/{maxHealth}
          </span>
          <span className="text-xs">{Math.round(healthPercentage)}%</span>
        </div>
        <div className="font-mono text-xs text-red-500">{healthBar}</div>
      </div>
      {status.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {status.map((effect, i) => (
            <span
              key={i}
              className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700"
            >
              {effect}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced map cell definitions for more complex maps
const terrainSymbols: Record<
  string,
  { symbol: string; color: string; name: string }
> = {
  player: { symbol: '@', color: 'text-blue-500 font-bold', name: 'Player' },
  wall: { symbol: '█', color: 'text-gray-700', name: 'Wall' },
  floor: { symbol: '·', color: 'text-gray-400', name: 'Floor' },
  door: { symbol: '◙', color: 'text-yellow-800', name: 'Door' },
  enemy: { symbol: 'E', color: 'text-red-500', name: 'Enemy' },
  item: { symbol: 'i', color: 'text-yellow-500', name: 'Item' },
  tree: { symbol: '♣', color: 'text-green-700', name: 'Tree' },
  water: { symbol: '~', color: 'text-blue-400', name: 'Water' },
  mountain: { symbol: '▲', color: 'text-gray-600', name: 'Mountain' },
  grass: { symbol: '"', color: 'text-green-500', name: 'Grass' },
  sand: { symbol: '.', color: 'text-yellow-300', name: 'Sand' },
  bridge: { symbol: '=', color: 'text-yellow-700', name: 'Bridge' },
  chest: { symbol: '■', color: 'text-yellow-600', name: 'Chest' },
  trap: { symbol: 'x', color: 'text-red-400', name: 'Trap' },
  npc: { symbol: 'N', color: 'text-purple-500', name: 'NPC' },
  shop: { symbol: '$', color: 'text-green-600', name: 'Shop' },
  altar: { symbol: 'A', color: 'text-indigo-500', name: 'Altar' },
  stairs_up: { symbol: '<', color: 'text-gray-500', name: 'Stairs Up' },
  stairs_down: { symbol: '>', color: 'text-gray-500', name: 'Stairs Down' },
  lava: { symbol: '≈', color: 'text-red-600', name: 'Lava' },
  empty: { symbol: ' ', color: 'text-transparent', name: 'Empty' },
};

// Enhanced ASCII Map with complex terrain
const EnhancedASCIIMap: React.FC<{
  mapData: string[][];
  roomName: string;
  legend?: boolean;
}> = ({ mapData, roomName, legend = true }) => {
  // Get unique terrain types in this map for the legend
  const uniqueTerrains = useMemo(() => {
    const terrains = new Set<string>();
    mapData.forEach((row) => {
      row.forEach((cell) => {
        if (terrainSymbols[cell]) terrains.add(cell);
      });
    });
    return Array.from(terrains);
  }, [mapData]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-lg font-bold">Current Location: {roomName}</h3>

      {/* Map grid */}
      <div className="mb-4 border-2 border-gray-700 bg-gray-900 p-2">
        <div className="font-mono text-sm leading-none">
          {mapData.map((row, i) => (
            <div key={i} className="flex">
              {row.map((cell, j) => {
                const terrain = terrainSymbols[cell] || terrainSymbols.empty;
                return (
                  <div
                    key={j}
                    className={`flex h-5 w-5 items-center justify-center ${terrain.color}`}
                    title={terrain.name}
                  >
                    {terrain.symbol}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Map legend */}
      {legend && (
        <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
          {uniqueTerrains.map((terrainType) => {
            const terrain = terrainSymbols[terrainType];
            return (
              <div key={terrainType} className="flex items-center">
                <span className={`mr-2 font-mono ${terrain.color}`}>
                  {terrain.symbol}
                </span>
                <span>{terrain.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// World Map with rooms and connections
const WorldMap: React.FC = () => {
  // Box drawing characters
  const box = {
    horizontal: '─',
    vertical: '│',
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    cross: '┼',
    tLeft: '├',
    tRight: '┤',
    tTop: '┬',
    tBottom: '┴',
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-lg font-bold">World Map</h3>
      <pre className="font-mono text-xs leading-none text-gray-300">
        {`
${box.topLeft}${box.horizontal.repeat(10)}${box.tTop}${box.horizontal.repeat(12)}${box.tTop}${box.horizontal.repeat(12)}${box.topRight}
${box.vertical}  Forest   ${box.vertical}  Mountains  ${box.vertical}  Highlands  ${box.vertical}
${box.vertical}           ${box.vertical}             ${box.vertical}             ${box.vertical}
${box.tLeft}${box.horizontal.repeat(10)}${box.cross}${box.horizontal.repeat(12)}${box.cross}${box.horizontal.repeat(12)}${box.tRight}
${box.vertical}  Village  ${box.vertical}  Dark Cave  ${box.vertical}  Dragon Den  ${box.vertical}
${box.vertical}  [You]    ${box.vertical}             ${box.vertical}             ${box.vertical}
${box.tLeft}${box.horizontal.repeat(10)}${box.cross}${box.horizontal.repeat(12)}${box.cross}${box.horizontal.repeat(12)}${box.tRight}
${box.vertical}  Beach    ${box.vertical}  Underwater ${box.vertical}  Volcano    ${box.vertical}
${box.vertical}           ${box.vertical}  Cavern     ${box.vertical}             ${box.vertical}
${box.bottomLeft}${box.horizontal.repeat(10)}${box.tBottom}${box.horizontal.repeat(12)}${box.tBottom}${box.horizontal.repeat(12)}${box.bottomRight}
`}
      </pre>
      <div className="mt-4 text-sm">
        <p>
          <span className="font-bold">[You]</span> marks your current location
        </p>
        <p>Connected rooms can be traveled to directly</p>
      </div>
    </div>
  );
};

type DisplayMode = 'messages' | 'map' | 'worldmap' | 'combat';

const MainDisplay: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('messages');

  // Example map data - more complex village with different terrain types
  const mapData = [
    [
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
    ],
    [
      'wall',
      'grass',
      'grass',
      'grass',
      'tree',
      'grass',
      'floor',
      'floor',
      'floor',
      'grass',
      'tree',
      'grass',
      'grass',
      'tree',
      'wall',
    ],
    [
      'wall',
      'grass',
      'shop',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'grass',
      'grass',
      'wall',
    ],
    [
      'wall',
      'grass',
      'floor',
      'floor',
      'wall',
      'wall',
      'wall',
      'door',
      'wall',
      'wall',
      'wall',
      'floor',
      'floor',
      'grass',
      'wall',
    ],
    [
      'wall',
      'floor',
      'floor',
      'floor',
      'wall',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'wall',
      'floor',
      'floor',
      'floor',
      'wall',
    ],
    [
      'wall',
      'floor',
      'floor',
      'floor',
      'wall',
      'floor',
      'npc',
      'floor',
      'chest',
      'floor',
      'wall',
      'floor',
      'floor',
      'floor',
      'wall',
    ],
    [
      'wall',
      'floor',
      'player',
      'floor',
      'door',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'door',
      'floor',
      'floor',
      'floor',
      'wall',
    ],
    [
      'wall',
      'floor',
      'floor',
      'floor',
      'wall',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'wall',
      'floor',
      'floor',
      'item',
      'wall',
    ],
    [
      'wall',
      'floor',
      'floor',
      'floor',
      'wall',
      'wall',
      'wall',
      'door',
      'wall',
      'wall',
      'wall',
      'floor',
      'enemy',
      'floor',
      'wall',
    ],
    [
      'wall',
      'water',
      'water',
      'bridge',
      'water',
      'water',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'floor',
      'wall',
    ],
    [
      'wall',
      'water',
      'water',
      'water',
      'water',
      'water',
      'floor',
      'floor',
      'floor',
      'wall',
      'wall',
      'wall',
      'door',
      'wall',
      'wall',
    ],
    [
      'wall',
      'grass',
      'tree',
      'grass',
      'grass',
      'grass',
      'floor',
      'floor',
      'floor',
      'wall',
      'stairs_down',
      'floor',
      'floor',
      'altar',
      'wall',
    ],
    [
      'wall',
      'grass',
      'grass',
      'tree',
      'grass',
      'grass',
      'floor',
      'floor',
      'trap',
      'wall',
      'floor',
      'floor',
      'wall',
      'wall',
      'wall',
    ],
    [
      'wall',
      'mountain',
      'mountain',
      'grass',
      'grass',
      'grass',
      'floor',
      'floor',
      'floor',
      'door',
      'floor',
      'floor',
      'chest',
      'floor',
      'wall',
    ],
    [
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
      'wall',
    ],
  ];

  // Example enemy data
  const currentEnemy = {
    type: 'goblin',
    name: 'Goblin Archer',
    level: 3,
    health: 25,
    maxHealth: 40,
    status: ['Poisoned', 'Weakened'],
  };

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
          <EnhancedASCIIMap mapData={mapData} roomName="Meadowbrook Village" />
        )}

        {displayMode === 'worldmap' && <WorldMap />}

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
