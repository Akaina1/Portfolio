import React from 'react';

interface MapLegendProps {
  isMapReady: boolean;
  isAddingPoints: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({
  isMapReady,
  isAddingPoints,
}) => {
  if (!isMapReady) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-4 text-xs">
      <div className="flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-red-500"></div>
        <span>City</span>
      </div>
      <div className="flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
        <span>Landmark</span>
      </div>
      <div className="flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
        <span>Point of Interest</span>
      </div>
      <div className="flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-purple-500"></div>
        <span>Location (New Points)</span>
      </div>
      <div className="flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-gray-300 opacity-50"></div>
        <span>Hidden Point</span>
      </div>
      <div className="ml-4 text-xs italic">
        {isAddingPoints
          ? 'Click on points to toggle visibility'
          : 'Hover over points to see location details'}
      </div>
    </div>
  );
};

export default MapLegend;
