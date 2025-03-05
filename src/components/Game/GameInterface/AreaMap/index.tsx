import { useMemo } from 'react';
import { terrainSymbols } from '../ASCII/terrainSymbols';
import { AreaService } from '@/services/game/areaService';
import { MapData } from '@/types/AreaMap';

interface AreaMapProps {
  /** Map data in either string[][] or MapData format */
  mapData: string[][] | MapData;
  /** Name of the current room/area */
  roomName: string;
  /** Whether to show the terrain legend */
  legend?: boolean;
  /** Optional separate data for legend generation */
  legendData?: string[][];
  /** Optional className for container styling */
  className?: string;
  /** Optional click handler for cells */
  onCellClick?: (x: number, y: number, terrain: string) => void;
  /** Optional hover handler for cells */
  onCellHover?: (x: number, y: number, terrain: string) => void;
}

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
  // Convert MapData to string[][] if needed
  const processedMapData = useMemo((): string[][] => {
    if (Array.isArray(mapData)) {
      return mapData;
    }
    try {
      const decoded = AreaService.decodeMapData(mapData as MapData);
      return decoded.tiles;
    } catch (error) {
      console.error('Error decoding map data:', error);
      return [['empty']]; // Return minimal valid map on error
    }
  }, [mapData]);

  // Get unique terrain types for the legend
  const uniqueTerrains = useMemo(() => {
    // Use legendData if provided, otherwise use processed map data
    const dataToUse = legendData || processedMapData;

    const terrains = new Set<string>();
    dataToUse.forEach((row) => {
      row.forEach((cell) => {
        if (terrainSymbols[cell]) terrains.add(cell);
      });
    });
    return Array.from(terrains);
  }, [processedMapData, legendData]);

  // Memoize the map grid to prevent unnecessary re-renders
  const mapGrid = useMemo(() => {
    return processedMapData.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => {
          const terrain = terrainSymbols[cell] || terrainSymbols.empty;
          return (
            <div
              key={`${x}-${y}`}
              className={`flex h-5 w-5 items-center justify-center ${
                terrain.color
              } ${onCellClick ? 'cursor-pointer hover:bg-gray-700' : ''}`}
              title={`${terrain.name} (${x}, ${y})`}
              onClick={onCellClick ? () => onCellClick(x, y, cell) : undefined}
              onMouseEnter={
                onCellHover ? () => onCellHover(x, y, cell) : undefined
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
  }, [processedMapData, onCellClick, onCellHover]);

  // Memoize the legend to prevent unnecessary re-renders
  const legendElement = useMemo(() => {
    if (!legend) return null;

    return (
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
    );
  }, [legend, uniqueTerrains]);

  // Error boundary UI
  if (!processedMapData?.length || !processedMapData[0]?.length) {
    return <div className="text-red-500">Error: Invalid map data provided</div>;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <h3 className="mb-4 text-lg font-bold">Current Location: {roomName}</h3>

      {/* Map grid */}
      <div className="mb-4 border-2 border-gray-700 bg-gray-900 p-2">
        <div className="font-mono text-sm leading-none">{mapGrid}</div>
      </div>

      {/* Map legend */}
      {legendElement}
    </div>
  );
};
