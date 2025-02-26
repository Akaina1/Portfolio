import { useMemo } from 'react';
import { terrainSymbols } from '../ASCII/terrainSybmols';

export const AreaMap: React.FC<{
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
