'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { terrainSymbols } from '@/components/Game/GameInterface/ASCII/terrainSymbols';
import { AreaMap } from '@/components/Game/GameInterface/AreaMap';

export default function MapCreator() {
  // State for map dimensions
  const [mapWidth, setMapWidth] = useState(10);
  const [mapHeight, setMapHeight] = useState(10);

  // State for the map data
  const [mapData, setMapData] = useState<string[][]>([]);

  // History for undo functionality
  const [history, setHistory] = useState<string[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // State for the currently selected terrain type
  const [selectedTerrain, setSelectedTerrain] = useState<string>('floor');

  // State for map name
  const [mapName, setMapName] = useState('New Map');

  // State for showing the generated code
  const [showCode, setShowCode] = useState(false);

  // Ref for the code textarea (for copy functionality)
  const codeRef = useRef<HTMLTextAreaElement>(null);

  // Initialize map with default terrain (floor surrounded by walls)
  const initializeMap = useCallback(() => {
    const newMap: string[][] = [];

    for (let y = 0; y < mapHeight; y++) {
      const row: string[] = [];
      for (let x = 0; x < mapWidth; x++) {
        // Create walls around the perimeter, floor elsewhere
        if (y === 0 || y === mapHeight - 1 || x === 0 || x === mapWidth - 1) {
          row.push('wall');
        } else {
          row.push('floor');
        }
      }
      newMap.push(row);
    }

    setMapData(newMap);
    // Reset history when initializing a new map
    setHistory([JSON.parse(JSON.stringify(newMap))]);
    setHistoryIndex(0);
  }, [mapHeight, mapWidth]);

  // Initialize the map with empty cells
  useEffect(() => {
    initializeMap();
  }, [mapWidth, mapHeight, initializeMap]);

  // Save current state to history before making changes
  const saveToHistory = (newMapData: string[][]) => {
    // If we're not at the end of the history, remove future states
    const newHistory = history.slice(0, historyIndex + 1);
    // Add the new state
    newHistory.push(JSON.parse(JSON.stringify(newMapData)));
    // Update history and index
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle cell click to change terrain
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Save current state to history before making changes
    saveToHistory(mapData);

    // Update the map
    const newMapData = JSON.parse(JSON.stringify(mapData));
    newMapData[rowIndex][colIndex] = selectedTerrain;
    setMapData(newMapData);
  };

  // Undo the last action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMapData(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  // Generate code for the map
  const generateCode = () => {
    let code = `const ${mapName.replace(/\s+/g, '')}Data = [\n`;

    mapData.forEach((row, rowIndex) => {
      code += '  [\n';
      row.forEach((cell, cellIndex) => {
        code += `    '${cell}'${cellIndex < row.length - 1 ? ',' : ''}\n`;
      });
      code += `  ]${rowIndex < mapData.length - 1 ? ',' : ''}\n`;
    });

    code += '];\n';
    return code;
  };

  // Copy code to clipboard
  const copyCodeToClipboard = () => {
    if (codeRef.current) {
      codeRef.current.select();
      document.execCommand('copy');
      alert('Code copied to clipboard!');
    }
  };

  // Fill area with selected terrain
  const fillArea = () => {
    // Save current state to history before making changes
    saveToHistory(mapData);

    const newMapData = mapData.map((row, y) =>
      row.map(
        (cell, x) =>
          y === 0 || y === mapHeight - 1 || x === 0 || x === mapWidth - 1
            ? cell // Keep the borders
            : selectedTerrain // Fill the interior
      )
    );
    setMapData(newMapData);
  };

  // Clear map (reset to initial state)
  const clearMap = () => {
    // Confirm before resetting
    if (
      window.confirm(
        'Are you sure you want to reset the map? This cannot be undone.'
      )
    ) {
      initializeMap();
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-8">
      <h1 className="mb-4 text-3xl font-bold">ASCII Map Creator</h1>

      {/* Map Configuration */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-2 text-xl font-semibold">Map Configuration</h2>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium">Map Name:</label>
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              className="mt-1 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Width:</label>
            <input
              type="number"
              min="5"
              max="50"
              value={mapWidth}
              onChange={(e) => setMapWidth(parseInt(e.target.value) || 10)}
              className="mt-1 w-20 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Height:</label>
            <input
              type="number"
              min="5"
              max="50"
              value={mapHeight}
              onChange={(e) => setMapHeight(parseInt(e.target.value) || 10)}
              className="mt-1 w-20 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearMap}
              className="rounded bg-red-600 px-4 py-1 font-medium text-white hover:bg-red-700"
            >
              Reset Map
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={fillArea}
              className="rounded bg-blue-600 px-4 py-1 font-medium text-white hover:bg-blue-700"
            >
              Fill Interior
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`rounded px-4 py-1 font-medium text-white ${
                historyIndex <= 0
                  ? 'cursor-not-allowed bg-gray-600'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              Undo
            </button>
          </div>
        </div>
      </div>

      {/* Terrain Selection */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-2 text-xl font-semibold">Terrain Selection</h2>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {Object.entries(terrainSymbols).map(([key, terrain]) => (
            <button
              key={key}
              onClick={() => setSelectedTerrain(key)}
              className={`flex min-h-16 w-full flex-col items-center justify-center rounded border p-2 ${
                selectedTerrain === key
                  ? 'border-yellow-400 bg-gray-700'
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
              }`}
              title={terrain.name}
            >
              <span className={`font-mono text-xl ${terrain.color}`}>
                {terrain.symbol}
              </span>
              <span className="mt-1 text-center text-xs leading-tight">
                {terrain.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Map Editor */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h2 className="mb-2 text-xl font-semibold">Map Editor</h2>
          <p className="mb-4 text-sm text-gray-400">
            Click on cells to place the selected terrain type.
          </p>

          <div className="overflow-auto">
            <div className="inline-block border-2 border-gray-600">
              {mapData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => {
                    const terrain = terrainSymbols[cell];
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`flex h-8 w-8 items-center justify-center border border-gray-800 ${
                          terrain.color
                        } hover:bg-gray-700`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        title={`${terrain.name} (${rowIndex}, ${colIndex})`}
                      >
                        {terrain.symbol}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm">
              Selected:
              <span
                className={`ml-2 font-mono ${terrainSymbols[selectedTerrain].color}`}
              >
                {terrainSymbols[selectedTerrain].symbol}
              </span>
              <span className="ml-1">
                ({terrainSymbols[selectedTerrain].name})
              </span>
            </p>
          </div>
        </div>

        {/* Map Preview */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h2 className="mb-2 text-xl font-semibold">Map Preview</h2>

          <div className="overflow-auto">
            <AreaMap mapData={mapData} roomName={mapName} />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
            >
              {showCode ? 'Hide Code' : 'Generate Code'}
            </button>

            {showCode && (
              <button
                onClick={copyCodeToClipboard}
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Copy to Clipboard
              </button>
            )}
          </div>

          {showCode && (
            <div className="mt-4">
              <textarea
                ref={codeRef}
                className="h-64 w-full rounded border border-gray-600 bg-gray-700 p-2 font-mono text-sm text-white"
                value={generateCode()}
                readOnly
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
