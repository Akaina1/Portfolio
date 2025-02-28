// Enhanced map cell definitions for more complex maps
export const terrainSymbols: Record<
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
