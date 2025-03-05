import React, { useState } from 'react';
import SectionHeader from '../../../utilities/sectionHeader';
import { PlayerTab, CharacterStats } from '@/Game/types/PlayerConsole.types';

const PlayerConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlayerTab>('stats');

  // Example stats object - in real app this would come from props or context
  // TODO: Remove this once we have a real stats object
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [characterStats, setCharacterStats] = useState<CharacterStats>({
    level: 1,
    experience: 245,
    nextLevel: 1000,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    stamina: 100,
    maxStamina: 100,
    strength: 10,
    dexterity: 8,
    intelligence: 12,
    wisdom: 10,
    constitution: 9,
    charisma: 7,
    luck: 5,
    defense: 15,
    magicResist: 10,
    attackPower: 22,
    spellPower: 18,
    critChance: 5,
    critDamage: 150,
    gold: 250,
  });

  // Group stats for better organization
  const statGroups = {
    primary: ['level', 'experience', 'nextLevel', 'gold'],
    resources: [
      'health',
      'maxHealth',
      'mana',
      'maxMana',
      'stamina',
      'maxStamina',
    ],
    attributes: [
      'strength',
      'dexterity',
      'intelligence',
      'wisdom',
      'constitution',
      'charisma',
      'luck',
    ],
    combat: [
      'defense',
      'magicResist',
      'attackPower',
      'spellPower',
      'critChance',
      'critDamage',
    ],
  };

  // Format stat names for display
  const formatStatName = (stat: string): string => {
    // Handle special cases
    if (stat === 'maxHealth') return 'Max Health';
    if (stat === 'maxMana') return 'Max Mana';
    if (stat === 'maxStamina') return 'Max Stamina';
    if (stat === 'nextLevel') return 'Next Level';
    if (stat === 'critChance') return 'Crit Chance';
    if (stat === 'critDamage') return 'Crit Damage';
    if (stat === 'magicResist') return 'Magic Resist';
    if (stat === 'attackPower') return 'Attack Power';
    if (stat === 'spellPower') return 'Spell Power';

    // Default formatting
    return stat.charAt(0).toUpperCase() + stat.slice(1);
  };

  // Format stat values for display
  const formatStatValue = (stat: string, value: number): string => {
    if (stat === 'experience') return `${value}/${characterStats.nextLevel}`;
    if (stat === 'health') return `${value}/${characterStats.maxHealth}`;
    if (stat === 'mana') return `${value}/${characterStats.maxMana}`;
    if (stat === 'stamina') return `${value}/${characterStats.maxStamina}`;
    if (stat === 'critChance' || stat === 'critDamage') return `${value}%`;
    if (stat === 'gold') return `${value} coins`;
    return value.toString();
  };

  // Define all available tabs
  const allTabs: PlayerTab[] = [
    'stats',
    'inventory',
    'quests',
    'skills',
    'equipment',
    'spells',
  ];

  // Function to get abbreviated tab name for smaller screens
  const getTabDisplay = (tab: string, isSmallScreen: boolean) => {
    if (!isSmallScreen) {
      return tab.charAt(0).toUpperCase() + tab.slice(1);
    }

    // Abbreviations for small screens
    const abbreviations: Record<string, string> = {
      stats: 'Stat',
      inventory: 'Inv',
      quests: 'Qst',
      skills: 'Skl',
      equipment: 'Eqp',
      spells: 'Spl',
    };

    return abbreviations[tab] || tab.charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-full flex-col bg-white p-4 dark:bg-gray-900/70">
      <SectionHeader text="Player" icon="👤" version="v1.0" />

      {/* Responsive tabs - use flex-wrap and smaller padding on smaller screens */}
      <div className="mb-2 flex flex-wrap">
        {allTabs.map((tab) => (
          <button
            key={tab}
            className={`mb-1 mr-1 rounded-t border-b-2 px-1 py-1 text-xs sm:px-2 md:px-4 ${
              activeTab === tab
                ? 'border-purple-600 font-bold text-purple-600'
                : 'border-gray-300 text-black dark:text-white'
            }`}
            onClick={() => setActiveTab(tab)}
            title={tab.charAt(0).toUpperCase() + tab.slice(1)}
          >
            {/* Show abbreviated names on smaller screens */}
            <span className="hidden md:inline">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
            <span className="md:hidden">{getTabDisplay(tab, true)}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto rounded bg-white/30 p-2 dark:bg-black/30">
        {activeTab === 'stats' && (
          <div className="custom-scrollbar h-full overflow-y-auto pr-1">
            <h3 className="mb-2 font-bold text-amber-700 dark:text-amber-500">
              Character Stats
            </h3>

            {/* Primary Stats */}
            <div className="mb-3 rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-900/50 dark:bg-amber-900/20">
              <h4 className="mb-1 text-sm font-semibold text-amber-800 dark:text-amber-400">
                Character
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {statGroups.primary.map((stat) => (
                  <React.Fragment key={stat}>
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      {formatStatName(stat)}:
                    </div>
                    <div className="text-right font-bold text-amber-800 dark:text-amber-400">
                      {formatStatValue(
                        stat,
                        characterStats[stat as keyof CharacterStats]
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 dark:border-red-900/50 dark:bg-red-900/20">
              <h4 className="mb-1 text-sm font-semibold text-red-800 dark:text-red-400">
                Resources
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {statGroups.resources.map((stat) => (
                  <React.Fragment key={stat}>
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      {formatStatName(stat)}:
                    </div>
                    <div className="text-right font-bold text-red-800 dark:text-red-400">
                      {formatStatValue(
                        stat,
                        characterStats[stat as keyof CharacterStats]
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Attributes */}
            <div className="mb-3 rounded border border-blue-200 bg-blue-50 p-2 dark:border-blue-900/50 dark:bg-blue-900/20">
              <h4 className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-400">
                Attributes
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {statGroups.attributes.map((stat) => (
                  <React.Fragment key={stat}>
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      {formatStatName(stat)}:
                    </div>
                    <div className="text-right font-bold text-blue-800 dark:text-blue-400">
                      {formatStatValue(
                        stat,
                        characterStats[stat as keyof CharacterStats]
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Combat Stats */}
            <div className="mb-3 rounded border border-purple-200 bg-purple-50 p-2 dark:border-purple-900/50 dark:bg-purple-900/20">
              <h4 className="mb-1 text-sm font-semibold text-purple-800 dark:text-purple-400">
                Combat
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {statGroups.combat.map((stat) => (
                  <React.Fragment key={stat}>
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      {formatStatName(stat)}:
                    </div>
                    <div className="text-right font-bold text-purple-800 dark:text-purple-400">
                      {formatStatValue(
                        stat,
                        characterStats[stat as keyof CharacterStats]
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <h3 className="mb-2 font-bold">Inventory</h3>
            <div className="text-sm">
              <div className="mb-1 flex justify-between">
                <span>Basic Sword</span>
                <span>x1</span>
              </div>
              <div className="mb-1 flex justify-between">
                <span>Health Potion</span>
                <span>x3</span>
              </div>
              <div className="mb-1 flex justify-between">
                <span>Leather Armor</span>
                <span>x1</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <div>
            <h3 className="mb-2 font-bold">Active Quests</h3>
            <div className="text-sm">
              <div className="mb-2">
                <div className="font-medium">Welcome to the World</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Explore the starting area and talk to the village elder.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <h3 className="mb-2 font-bold">Skills</h3>
            <div className="text-sm">
              <div className="mb-1 flex justify-between">
                <span>Basic Attack</span>
                <span>Lvl 1</span>
              </div>
              <div className="mb-1 flex justify-between">
                <span>Dodge</span>
                <span>Lvl 1</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div>
            <h3 className="mb-2 font-bold">Equipment</h3>
            <div className="text-sm">
              <div className="mb-1 grid grid-cols-2 gap-1">
                <span>Head:</span>
                <span>None</span>
                <span>Body:</span>
                <span>Leather Armor</span>
                <span>Weapon:</span>
                <span>Basic Sword</span>
                <span>Accessory:</span>
                <span>None</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spells' && (
          <div>
            <h3 className="mb-2 font-bold">Spells</h3>
            <div className="text-sm">
              <div className="mb-1 flex justify-between">
                <span>Fireball</span>
                <span>10 MP</span>
              </div>
              <div className="mb-1 flex justify-between">
                <span>Heal</span>
                <span>15 MP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerConsole;
