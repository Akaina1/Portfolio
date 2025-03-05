import React from 'react';
import TimeBar from '../../TimeBar';
import SectionHeader from '../../../utilities/sectionHeader';
import { useGameInterfaceStore } from '../../../stores/Game/gameInterfaceStore';

const EntityTimeBars: React.FC = () => {
  const { entities, isEntityTimeStopped, toggleEntityTimeStop, gainEntityAP } =
    useGameInterfaceStore();

  return (
    <div className="flex h-full flex-col bg-white p-4 dark:bg-gray-900/70">
      <SectionHeader text="Entities" icon="⚔️" version="v1.0" />

      <div className="mb-2 flex justify-between">
        <span className="text-sm font-bold">Combat Timeline</span>
        <button
          onClick={toggleEntityTimeStop}
          className="rounded bg-purple-600 px-2 py-1 text-xs text-white hover:bg-purple-700"
        >
          {isEntityTimeStopped ? 'Resume' : 'Pause'}
        </button>
      </div>

      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
        {entities.map((entity) => (
          <TimeBar
            key={entity.id}
            color={entity.color}
            segmentTime={entity.segmentTime}
            stopFill={isEntityTimeStopped}
            slowBar={entity.slowBar}
            fastBar={entity.fastBar}
            label={entity.name}
            entityId={entity.id}
            height="10px"
            maxActionPoints={entity.maxAp}
            currentActionPoints={entity.ap}
            onSegmentComplete={() => gainEntityAP(entity.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default EntityTimeBars;
