import React from 'react';
import { MapPoint } from '../MapPoint/type';
import LocationCard from '../LocationCard';

interface LocationCardWrapperProps {
  activePoint: MapPoint | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const LocationCardWrapper: React.FC<LocationCardWrapperProps> = ({
  activePoint,
  position,
  onClose,
}) => {
  if (!activePoint) return null;

  return (
    <LocationCard point={activePoint} position={position} onClose={onClose} />
  );
};

export default LocationCardWrapper;
