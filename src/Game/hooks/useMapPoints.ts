import { useState } from 'react';
import { MapPoint } from '../types/MapPoint.type';
import {
  addMapPoint,
  togglePointVisibility,
  exportMapPointsAsCode,
} from '../utilities/map-point-utils';

export function useMapPoints(initialMapPoints: MapPoint[]) {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(initialMapPoints);
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [showHiddenPoints, setShowHiddenPoints] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedCode, setExportedCode] = useState('');
  const [selectedSearchResult, setSelectedSearchResult] =
    useState<MapPoint | null>(null);

  const handlePointClick = (point: MapPoint) => {
    if (isAddingPoints) {
      const updatedPoints = togglePointVisibility(mapPoints, point.id);
      setMapPoints(updatedPoints);
      const code = exportMapPointsAsCode(updatedPoints);
      setExportedCode(code);
      setShowExportModal(true);
    } else {
      console.log(
        `Clicked on ${point.label} (${point.type}), visible: ${point.visible}`
      );
    }
  };

  const handleMapClick = (x: number, y: number) => {
    if (!isAddingPoints) return;

    const updatedPoints = addMapPoint(mapPoints, x, y);
    setMapPoints(updatedPoints);
    const code = exportMapPointsAsCode(updatedPoints);
    setExportedCode(code);
    setShowExportModal(true);
  };

  const highlightSearchResult = (point: MapPoint) => {
    setSelectedSearchResult(point);
    setTimeout(() => {
      setSelectedSearchResult(null);
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(exportedCode)
      .then(() => {
        alert('Code copied to clipboard!');
        setShowExportModal(false);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return {
    mapPoints,
    isAddingPoints,
    showHiddenPoints,
    showExportModal,
    exportedCode,
    selectedSearchResult,
    setIsAddingPoints,
    setShowHiddenPoints,
    handlePointClick,
    handleMapClick,
    highlightSearchResult,
    copyToClipboard,
    setShowExportModal,
  };
}
