export type PlayerTab =
  | 'stats'
  | 'inventory'
  | 'quests'
  | 'skills'
  | 'equipment'
  | 'spells';

// Add this interface for stats
export interface CharacterStats {
  level: number;
  experience: number;
  nextLevel: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  constitution: number;
  charisma: number;
  luck: number;
  defense: number;
  magicResist: number;
  attackPower: number;
  spellPower: number;
  critChance: number;
  critDamage: number;
  gold: number;
}
