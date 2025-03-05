'use client';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { terrainRegistry } from '@/components/Game/GameInterface/ASCII/terrainSymbols';
import { AreaMap } from '@/components/Game/GameInterface/AreaMap';
import { AreaService } from '@/services/game/areaService';
import { MapData } from '@/types/AreaMap';

console.log('Available terrain types:', Object.keys(terrainRegistry));

export default function MapCreator() {
  // State for map dimensions
  const [mapWidth, setMapWidth] = useState(10);
  const [mapHeight, setMapHeight] = useState(10);

  // State for the map data
  const [mapData, setMapData] = useState<string[][]>([]);
  const [encodedMap, setEncodedMap] = useState<MapData | null>(null);

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

  // State for the currently selected drawing tool
  const [drawingTool, setDrawingTool] = useState<
    | 'single'
    | 'line'
    | 'rectangle'
    | 'rectangle-fill'
    | 'circle'
    | 'circle-fill'
  >('single');

  // State for tracking drawing operations
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [previewMap, setPreviewMap] = useState<string[][] | null>(null);

  // Create a static map for legend generation
  // This adds all terrain types to a small map
  const legendMap = useMemo(() => {
    // Get all terrain keys
    const terrainKeys = Object.keys(terrainRegistry);

    // Create a 1xN map with one cell for each terrain type
    return [terrainKeys];
  }, []);

  // Initialize map with default terrain (floor surrounded by walls)
  const initializeMap = useCallback(() => {
    try {
      const newMapData = AreaService.createWalledMap({
        width: mapWidth,
        height: mapHeight,
      });

      // Decode for string[][] compatibility
      const decodedMap = AreaService.decodeMapData(newMapData);
      setMapData(decodedMap.tiles);
      setEncodedMap(newMapData);

      // Update history
      setHistory([JSON.parse(JSON.stringify(decodedMap.tiles))]);
      setHistoryIndex(0);
    } catch (error) {
      console.error('Failed to initialize map:', error);
      // Fallback to a basic empty map if initialization fails
      const emptyMap = Array(mapHeight)
        .fill(null)
        .map(() => Array(mapWidth).fill('empty'));
      setMapData(emptyMap);
      setHistory([JSON.parse(JSON.stringify(emptyMap))]);
      setHistoryIndex(0);
    }
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
    if (drawingTool === 'single') {
      // Save current state to history before making changes
      saveToHistory(mapData);

      // Update the map
      const newMapData = JSON.parse(JSON.stringify(mapData));
      newMapData[rowIndex][colIndex] = selectedTerrain;
      setMapData(newMapData);

      // Update encoded map
      try {
        const newEncodedMap = AreaService.encodeMapData(newMapData);
        setEncodedMap(newEncodedMap);
      } catch (error) {
        console.error('Error encoding map:', error);
      }
    }
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
    if (!encodedMap) return '';

    const serialized = AreaService.serializeMap(encodedMap);
    return (
      `// Map: ${mapName}\n` +
      `// Dimensions: ${mapWidth}x${mapHeight}\n\n` +
      `const ${mapName.replace(/\s+/g, '')}Data = ${serialized};\n`
    );
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

    try {
      const newEncodedMap = AreaService.encodeMapData(mapData);
      const terrainCode = terrainRegistry[selectedTerrain].code;

      // Fill the interior while preserving walls
      AreaService.fillArea(
        newEncodedMap,
        1,
        1,
        mapWidth - 2,
        mapHeight - 2,
        terrainCode
      );

      // Decode back for display
      const decodedMap = AreaService.decodeMapData(newEncodedMap);
      setMapData(decodedMap.tiles);
      setEncodedMap(newEncodedMap);
    } catch (error) {
      console.error('Error filling area:', error);
    }
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

  // Draw a line between two points using Bresenham's algorithm
  const drawLine = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    map: string[][],
    terrain: string
  ) => {
    const newMap = JSON.parse(JSON.stringify(map));

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (x0 >= 0 && x0 < mapWidth && y0 >= 0 && y0 < mapHeight) {
        newMap[y0][x0] = terrain;
      }

      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }

    return newMap;
  };

  // Draw a rectangle (outline or filled)
  const drawRectangle = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    map: string[][],
    terrain: string,
    fill: boolean
  ) => {
    const newMap = JSON.parse(JSON.stringify(map));

    // Ensure x0,y0 is the top-left and x1,y1 is the bottom-right
    const [startX, endX] = [Math.min(x0, x1), Math.max(x0, x1)];
    const [startY, endY] = [Math.min(y0, y1), Math.max(y0, y1)];

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        // For outline, only draw if on the perimeter
        if (fill || y === startY || y === endY || x === startX || x === endX) {
          if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
            newMap[y][x] = terrain;
          }
        }
      }
    }

    return newMap;
  };

  // Draw a circle (outline or filled)
  const drawCircle = (
    centerX: number,
    centerY: number,
    radius: number,
    map: string[][],
    terrain: string,
    fill: boolean
  ) => {
    const newMap = JSON.parse(JSON.stringify(map));

    // Calculate radius based on the distance between start and end points
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        // Calculate distance from center
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );

        // For outline, only draw if approximately on the circle edge
        // For fill, draw if inside the circle
        if (
          (fill && distance <= radius) ||
          (!fill && Math.abs(distance - radius) < 0.5)
        ) {
          newMap[y][x] = terrain;
        }
      }
    }

    return newMap;
  };

  // Handle mouse down to start drawing
  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    if (drawingTool === 'single') {
      handleCellClick(rowIndex, colIndex);
      return;
    }

    setIsDrawing(true);
    setStartPoint({ x: colIndex, y: rowIndex });
    setEndPoint({ x: colIndex, y: rowIndex });

    // Show preview for initial point
    const preview = JSON.parse(JSON.stringify(mapData));
    preview[rowIndex][colIndex] = selectedTerrain;
    setPreviewMap(preview);
  };

  // Handle mouse move during drawing
  const handleMouseMove = (rowIndex: number, colIndex: number) => {
    if (!isDrawing || !startPoint) return;

    setEndPoint({ x: colIndex, y: rowIndex });

    // Create a preview based on the current tool
    let preview = JSON.parse(JSON.stringify(mapData));

    switch (drawingTool) {
      case 'line':
        preview = drawLine(
          startPoint.x,
          startPoint.y,
          colIndex,
          rowIndex,
          preview,
          selectedTerrain
        );
        break;
      case 'rectangle':
        preview = drawRectangle(
          startPoint.x,
          startPoint.y,
          colIndex,
          rowIndex,
          preview,
          selectedTerrain,
          false
        );
        break;
      case 'rectangle-fill':
        preview = drawRectangle(
          startPoint.x,
          startPoint.y,
          colIndex,
          rowIndex,
          preview,
          selectedTerrain,
          true
        );
        break;
      case 'circle':
      case 'circle-fill': {
        const centerX = (startPoint.x + colIndex) / 2;
        const centerY = (startPoint.y + rowIndex) / 2;
        const radius =
          Math.sqrt(
            Math.pow(colIndex - startPoint.x, 2) +
              Math.pow(rowIndex - startPoint.y, 2)
          ) / 2;
        preview = drawCircle(
          centerX,
          centerY,
          radius,
          preview,
          selectedTerrain,
          drawingTool === 'circle-fill'
        );
        break;
      }
    }

    setPreviewMap(preview);
  };

  // Handle mouse up to complete drawing
  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !endPoint || !previewMap) return;

    // Save current state to history before making changes
    saveToHistory(mapData);

    // Apply the preview to the actual map
    setMapData(previewMap);

    // Update encoded map
    try {
      const newEncodedMap = AreaService.encodeMapData(previewMap);
      setEncodedMap(newEncodedMap);
    } catch (error) {
      console.error('Error encoding map:', error);
    }

    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setEndPoint(null);
    setPreviewMap(null);
  };

  return (
    <div className="min-h-screen w-full p-24">
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
              min="0"
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
              min="0"
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

      {/* Drawing Tools */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-2 text-xl font-semibold">Drawing Tools</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDrawingTool('single')}
            className={`rounded px-3 py-1 ${
              drawingTool === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            Single Tile
          </button>
          <button
            onClick={() => setDrawingTool('line')}
            className={`rounded px-3 py-1 ${
              drawingTool === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setDrawingTool('rectangle')}
            className={`rounded px-3 py-1 ${
              drawingTool === 'rectangle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            Rectangle (Outline)
          </button>
          <button
            onClick={() => setDrawingTool('rectangle-fill')}
            className={`rounded px-3 py-1 ${
              drawingTool === 'rectangle-fill'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            Rectangle (Fill)
          </button>
          <button
            onClick={() => setDrawingTool('circle')}
            className={`rounded px-3 py-1 ${
              drawingTool === 'circle'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            Circle (Outline)
          </button>
          <button
            onClick={() => setDrawingTool('circle-fill')}
            className={`rounded px-3 py-1 ${
              drawingTool === 'circle-fill'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            Circle (Fill)
          </button>
        </div>
      </div>

      {/* Terrain Selection */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-2 text-xl font-semibold">Terrain Selection</h2>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {Object.entries(terrainRegistry).map(([key, terrain]) => (
            <button
              key={key}
              onClick={() => setSelectedTerrain(key)}
              className={`flex min-h-16 w-full flex-col items-center justify-center rounded border p-2 ${
                selectedTerrain === key
                  ? 'border-yellow-400 bg-gray-700'
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
              }`}
              title={`${terrain.name}${
                terrain.properties.passable ? ' (Passable)' : ''
              }`}
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

      {/* Map Editor */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-2 text-xl font-semibold">Map Editor</h2>
        <p className="mb-4 text-sm text-gray-400">
          {drawingTool === 'single'
            ? 'Click on cells to place the selected terrain type.'
            : 'Click and drag to draw with the selected tool.'}
        </p>

        <div className="overflow-auto">
          <div className="inline-block border-2 border-gray-600">
            {(previewMap || mapData).map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => {
                  const terrain = terrainRegistry[cell];
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`flex h-8 w-8 items-center justify-center border border-gray-800 ${
                        terrain.color
                      } hover:bg-gray-700`}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={() => {
                        // Optional: handle mouse leaving the cell during drawing
                        if (isDrawing) {
                          handleMouseMove(rowIndex, colIndex);
                        }
                      }}
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
              className={`ml-2 font-mono ${terrainRegistry[selectedTerrain].color}`}
            >
              {terrainRegistry[selectedTerrain].symbol}
            </span>
            <span className="ml-1">
              ({terrainRegistry[selectedTerrain].name})
            </span>
          </p>
        </div>
      </div>

      {/* Map Preview */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-2 text-xl font-semibold">Map Preview</h2>

        <div className="overflow-auto">
          <AreaMap
            mapData={previewMap || mapData}
            roomName={mapName}
            legend={true}
            legendData={legendMap}
            onCellClick={handleCellClick}
            onCellHover={(x, y) => handleMouseMove(y, x)}
          />
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
  );
}
