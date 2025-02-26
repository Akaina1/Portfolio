import React from 'react';
import TimeBar from '../../TimeBar';
import SectionHeader from '../../../../utilities/sectionHeader';
import { useGameInterfaceStore } from '../../../../stores/Game/gameInterfaceStore';

const PartyTimeBars: React.FC = () => {
  const {
    partyMembers,
    isPartyTimeStopped,
    togglePartyTimeStop,
    gainPartyMemberAP,
    playerAP,
    giftAmounts,
    setGiftAmount,
    giveAPToPartyMember,
  } = useGameInterfaceStore();

  return (
    <div className="flex h-full flex-col bg-white p-4 dark:bg-gray-900/70">
      <SectionHeader text="Party" icon="👥" version="v1.0" />

      <div className="mb-2 flex justify-between">
        <span className="text-sm font-bold">Party Timeline</span>
        <button
          onClick={togglePartyTimeStop}
          className="rounded bg-purple-600 px-2 py-1 text-xs text-white hover:bg-purple-700"
        >
          {isPartyTimeStopped ? 'Resume' : 'Pause'}
        </button>
      </div>

      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
        {partyMembers.map((member) => (
          <div key={member.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-xs font-medium">{member.name}</span>
                <span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs font-bold text-white">
                  {member.ap}/{member.maxAp} AP
                </span>
              </div>

              {/* Only show gift controls for party members other than player */}
              {member.id !== 'player-01' && (
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="1"
                    max={Math.min(playerAP, member.maxAp - member.ap)}
                    value={giftAmounts[member.id] || 1}
                    onChange={(e) =>
                      setGiftAmount(member.id, parseInt(e.target.value) || 1)
                    }
                    className="w-10 rounded-l border border-gray-300 p-1 text-xs dark:border-gray-700 dark:bg-gray-800"
                    disabled={playerAP === 0 || member.ap >= member.maxAp}
                  />
                  <button
                    onClick={() => giveAPToPartyMember(member.id)}
                    className="rounded-r bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    disabled={playerAP === 0 || member.ap >= member.maxAp}
                  >
                    Give AP
                  </button>
                </div>
              )}
            </div>

            <TimeBar
              key={member.id}
              color={member.color}
              segmentTime={member.segmentTime}
              stopFill={isPartyTimeStopped}
              slowBar={member.slowBar}
              fastBar={member.fastBar}
              label="" // Remove label since we're showing it above
              entityId={member.id}
              height="10px"
              maxActionPoints={member.maxAp}
              currentActionPoints={member.ap}
              onSegmentComplete={() => gainPartyMemberAP(member.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartyTimeBars;
