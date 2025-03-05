import React from 'react';
import LocationCard from '../LocationCard';
import { LocationCardWrapperProps } from '@/Game/types/LocationCardWrapper.types';

const LocationCardWrapper: React.FC<LocationCardWrapperProps> = ({
  activePoint,
  position,
  onClose,
  containerRef,
}) => {
  if (!activePoint) return null;

  // Get container dimensions to constrain card position
  const containerRect = containerRef.current?.getBoundingClientRect();

  // Adjust position to ensure card stays within container bounds
  let adjustedX = position.x;
  let adjustedY = position.y;

  if (containerRect) {
    // Estimate card dimensions
    const cardWidth = 320;
    const cardHeight = 400;

    // Ensure card doesn't go beyond right edge
    if (adjustedX + cardWidth > containerRect.width) {
      adjustedX = containerRect.width - cardWidth - 10;
    }

    // Ensure card doesn't go beyond bottom edge
    if (adjustedY + cardHeight > containerRect.height) {
      adjustedY = containerRect.height - cardHeight - 10;
    }

    // Ensure card doesn't go beyond left or top edges
    adjustedX = Math.max(10, adjustedX);
    adjustedY = Math.max(10, adjustedY);
  }

  return (
    <LocationCard
      point={activePoint}
      position={{ x: adjustedX, y: adjustedY }}
      onClose={onClose}
    />
  );
};

export default LocationCardWrapper;
