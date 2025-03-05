export interface MapControlsProps {
  isMapReady: boolean;
  scale: number;
  showCoordinates: boolean;
  isAddingPoints: boolean;
  showHiddenPoints: boolean;
  showSearch: boolean;
  zoomCentered: (scale: number) => void;
  setShowCoordinates: (show: boolean) => void;
  setIsAddingPoints: (adding: boolean) => void;
  setShowHiddenPoints: (show: boolean) => void;
  setShowSearch: (show: boolean) => void;
  resetView: () => void;
}
