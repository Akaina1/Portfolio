import { useMemo } from 'react';
import {
  terrainRegistry,
  getTerrainByCode,
} from '../../../utilities/terrainSymbols';
import { AreaMapProps } from '@/Game/types/AreaMap.types';

/**
 * AreaMap Component
 * Renders an ASCII-based map with optional legend and interaction handlers
 */
export const AreaMap: React.FC<AreaMapProps> = ({
  mapData,
  roomName,
  legend = true,
  legendData,
  className = '',
  onCellClick,
  onCellHover,
}) => {
  // Get unique terrain codes for the legend
  const uniqueTerrains = useMemo(() => {
    const dataToUse = legendData || mapData;
    const terrains = new Set<number>();
    dataToUse.tiles.forEach((code) => {
      terrains.add(code);
    });
    return Array.from(terrains);
  }, [mapData, legendData]);

  // Memoize the map grid
  const mapGrid = useMemo(() => {
    const { width, height } = mapData.dimensions;
    return Array.from({ length: height }, (_, y) => (
      <div key={y} className="flex">
        {Array.from({ length: width }, (_, x) => {
          const code = mapData.tiles[y * width + x];
          const terrain = getTerrainByCode(code) || terrainRegistry.empty;
          return (
            <div
              key={`${x}-${y}`}
              className={`flex h-5 w-5 items-center justify-center ${
                terrain.color
              } ${onCellClick ? 'cursor-pointer hover:bg-gray-700' : ''}`}
              title={`${terrain.name} (${x}, ${y})`}
              onClick={onCellClick ? () => onCellClick(x, y, code) : undefined}
              onMouseEnter={
                onCellHover ? () => onCellHover(x, y, code) : undefined
              }
              role={onCellClick ? 'button' : 'cell'}
              tabIndex={onCellClick ? 0 : undefined}
            >
              {terrain.symbol}
            </div>
          );
        })}
      </div>
    ));
  }, [mapData, onCellClick, onCellHover]);

  // Memoize the legend
  const legendElement = useMemo(() => {
    if (!legend) return null;

    return (
      <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
        {uniqueTerrains.map((code) => {
          const terrain = getTerrainByCode(code);
          if (!terrain) return null;
          return (
            <div key={code} className="flex items-center">
              <span className={`mr-2 font-mono ${terrain.color}`}>
                {terrain.symbol}
              </span>
              <span>{terrain.name}</span>
            </div>
          );
        })}
      </div>
    );
  }, [legend, uniqueTerrains]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <h3 className="mb-4 text-lg font-bold">Current Location: {roomName}</h3>
      <div className="mb-4 border-2 border-gray-700 bg-gray-900 p-2">
        <div className="font-mono text-sm leading-none">{mapGrid}</div>
      </div>
      {legendElement}
    </div>
  );
};
