import { TimeBarProps } from '@/types/TimeBar';
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TimeBar: React.FC<TimeBarProps> = ({
  color,
  segmentTime,
  stopFill = false,
  stopFillTime = 0,
  slowBar = 1,
  fastBar = 1,
  onSegmentComplete,
  width = '100%',
  height = '8px',
  label,
  showPercentage = false,
  initialFill = 0,
  entityId,
  maxActionPoints = 3,
  currentActionPoints = 0,
}) => {
  const [fillPercentage, setFillPercentage] = useState(initialFill * 100);
  const [isPaused, setIsPaused] = useState(
    stopFill || currentActionPoints >= maxActionPoints
  );
  const pauseTimeRemaining = useRef(stopFillTime);
  const lastUpdateTime = useRef(Date.now());
  const animationFrameId = useRef<number | null>(null);
  const effectiveSpeed = useRef(1);
  const completionCallbackRef = useRef(onSegmentComplete);
  const currentAPRef = useRef(currentActionPoints);
  const maxAPRef = useRef(maxActionPoints);

  // Update refs when props change
  useEffect(() => {
    completionCallbackRef.current = onSegmentComplete;
    currentAPRef.current = currentActionPoints;
    maxAPRef.current = maxActionPoints;

    // Pause if max AP reached
    if (currentActionPoints >= maxActionPoints) {
      setIsPaused(true);
    } else if (!stopFill && isPaused && currentActionPoints < maxActionPoints) {
      setIsPaused(false);
    }
  }, [
    onSegmentComplete,
    currentActionPoints,
    maxActionPoints,
    stopFill,
    isPaused,
  ]);

  // Calculate effective speed based on slowBar and fastBar
  useEffect(() => {
    // Ensure slowBar is at least 0.01 (1% of normal speed)
    const effectiveSlowBar = slowBar < 0.01 ? 0.01 : slowBar;

    // Apply slow or fast modifier, but not both
    if (slowBar !== 1 && slowBar < 1) {
      effectiveSpeed.current = effectiveSlowBar;
    } else if (fastBar !== 1 && fastBar > 1) {
      effectiveSpeed.current = fastBar;
    } else {
      effectiveSpeed.current = 1;
    }
  }, [slowBar, fastBar]);

  // Handle stopFill changes
  useEffect(() => {
    // Only update pause state if we're not at max AP
    if (currentAPRef.current < maxAPRef.current) {
      setIsPaused(stopFill);
    }

    if (stopFill) {
      pauseTimeRemaining.current = stopFillTime;
    } else {
      pauseTimeRemaining.current = 0;
    }
  }, [stopFill, stopFillTime]);

  // Optimized animation loop using RAF and precise timing
  const updateFill = useCallback(() => {
    // Use performance.now() for more precise timing
    const now = performance.now();
    const deltaTime = now - lastUpdateTime.current;
    lastUpdateTime.current = now;

    // Skip tiny time deltas to avoid jitter
    if (deltaTime < 5) {
      animationFrameId.current = requestAnimationFrame(updateFill);
      return;
    }

    if (isPaused) {
      // Handle pause timer
      if (pauseTimeRemaining.current > 0 && !stopFill) {
        pauseTimeRemaining.current = Math.max(
          0,
          pauseTimeRemaining.current - deltaTime
        );
        if (
          pauseTimeRemaining.current === 0 &&
          !stopFill &&
          currentAPRef.current < maxAPRef.current
        ) {
          setIsPaused(false);
        }
      }
    } else {
      // Update fill percentage with smoother animation
      const increment =
        (deltaTime / segmentTime) * 100 * effectiveSpeed.current;

      setFillPercentage((prev) => {
        const newValue = prev + increment;

        // Check if segment is complete
        if (newValue >= 100) {
          // Only trigger callback if we're not at max AP
          if (
            completionCallbackRef.current &&
            currentAPRef.current < maxAPRef.current
          ) {
            // Use requestAnimationFrame instead of setTimeout for better timing
            requestAnimationFrame(() => {
              if (completionCallbackRef.current) {
                completionCallbackRef.current();
              }
            });
          }

          // Check if we should pause after completion (at max AP)
          if (currentAPRef.current + 1 >= maxAPRef.current) {
            setIsPaused(true);
          }

          return 0; // Reset to 0 for cleaner animation
        }
        return newValue;
      });
    }

    // Continue animation
    animationFrameId.current = requestAnimationFrame(updateFill);
  }, [isPaused, segmentTime, stopFill]);

  // Start/stop animation based on component lifecycle
  useEffect(() => {
    lastUpdateTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(updateFill);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateFill]);

  // Generate bar style with single color
  const barStyle = {
    backgroundColor: color,
    width: `${fillPercentage}%`,
    height: '100%',
    borderRadius: '4px',
    transform: 'translateZ(0)', // Hardware acceleration
    willChange: 'width', // Hint for browser optimization
  };

  return (
    <div className="flex flex-col" style={{ width }}>
      {label && (
        <div className="mb-1 flex justify-between text-xs">
          <div className="flex items-center">
            <span>{label}</span>
            {/* Show AP counter next to entity name */}
            <span className="ml-2 rounded bg-gray-700 px-1.5 py-0.5 text-xs font-bold text-white">
              {currentActionPoints}/{maxActionPoints} AP
            </span>
          </div>
          {showPercentage && <span>{Math.round(fillPercentage)}%</span>}
        </div>
      )}
      <div
        className="overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800"
        style={{ height, width: '100%' }}
      >
        <div style={barStyle} />
      </div>
      {entityId && (
        <div className="mt-1 text-xs text-gray-500">ID: {entityId}</div>
      )}
    </div>
  );
};

export default TimeBar;
