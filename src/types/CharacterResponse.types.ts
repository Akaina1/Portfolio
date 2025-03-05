export const CHARACTER_STATUS = {
  ACTIVE: 'ACTIVE',
  RESTING: 'RESTING',
  INJURED: 'INJURED',
  UNCONSCIOUS: 'UNCONSCIOUS',
  MOVING: 'MOVING',
} as const;

export const RESOURCE_TYPE = {
  MANA: 'MANA',
  RAGE: 'RAGE',
  ENERGY: 'ENERGY',
  FOCUS: 'FOCUS',
  SPIRIT: 'SPIRIT',
} as const;

export const MOVEMENT_STYLE = {
  STANDARD: 'STANDARD',
  QUICK: 'QUICK',
  HEAVY: 'HEAVY',
  STEALTHY: 'STEALTHY',
  MAGICAL: 'MAGICAL',
} as const;

export interface CharacterResponse {
  _id: string;
  playerId: string;
  name: string;
  level: number;
  experience: number;
  status: keyof typeof CHARACTER_STATUS;
  classId: string;

  // Points for unlocking skills and abilities
  skillPoints: number;
  abilityPoints: number;
  totalSkillPointsEarned: number;
  totalAbilityPointsEarned: number;

  attributes: {
    // Primary attributes
    primary: {
      strength: number;
      intelligence: number;
      dexterity: number;
      constitution: number;
      wisdom: number;
      charisma: number;
    };
    // Secondary attributes
    secondary: {
      perception: number;
      willpower: number;
      luck: number;
      focus: number;
    };
    // Derived attributes
    derived: {
      attackPower: number;
      spellPower: number;
      defense: number;
      magicResistance: number;
      criticalChance: number;
      evasion: number;
      initiative: number;
    };
    // Special attributes
    special: {
      stealth: number;
      persuasion: number;
      intimidation: number;
      crafting: number;
      survival: number;
    };
    // Elemental affinities
    elemental: {
      fire: number;
      water: number;
      earth: number;
      air: number;
      light: number;
      shadow: number;
    };
  };

  health: {
    current: number;
    max: number;
  };

  energy: {
    current: number;
    max: number;
    type: keyof typeof RESOURCE_TYPE;
  };

  actionPoints: {
    current: number;
    max: number;
    regenerationRate: number;
    segmentTimeModifier: number;
    movement: {
      style: keyof typeof MOVEMENT_STYLE;
      baseSpeed: number;
      currentSpeed: number;
      lastMoveTime: Date;
      movementCooldown: number;
      terrainModifier: number;
      isMoving: boolean;
      terrainModifiers: {
        road: number;
        forest: number;
        mountain: number;
        water: number;
        swamp: number;
      };
    };
  };

  location: {
    worldId?: string;
    regionId?: string;
    areaId?: string;
    coordinates: {
      x: number;
      y: number;
      z: number;
    };
  };

  createdAt: Date;
  lastPlayed: Date;
}

export interface CharacterClassResponse {
  _id: string;
  name: string;
  description: string;
  category: string;
  difficulty: number;

  // Base attributes
  baseAttributes: {
    strength: number;
    intelligence: number;
    dexterity: number;
    constitution: number;
    wisdom: number;
    charisma: number;
  };

  // Attribute growth per level
  attributeGrowth: {
    strength: number;
    intelligence: number;
    dexterity: number;
    constitution: number;
    wisdom: number;
    charisma: number;
  };

  // Primary resource
  primaryResource: {
    type: string;
    baseValue: number;
    growthPerLevel: number;
    regenBase: number;
    regenScaling: string;
  };

  // Secondary resource (optional)
  secondaryResource?: {
    type: string;
    baseValue: number;
    growthPerLevel: number;
    regenBase: number;
    regenScaling: string;
  };

  // Starting items and abilities
  startingItems: string[];
  startingAbilities: string[];
  startingSkills: string[];

  // Equipment and ability restrictions
  restrictions: {
    armorTypes: {
      light: string;
      medium: string;
      heavy: string;
    };
    weaponTypes: {
      oneHanded: string;
      twoHanded: string;
      ranged: string;
      magical: string;
    };
    abilityCategories: {
      physical: string;
      magical: string;
      support: string;
      stealth: string;
    };
  };

  // Special class features
  classFeatures: {
    name: string;
    description: string;
    unlockedAtLevel: number;
  }[];

  recommendedPlaystyles: string[];
  iconUrl?: string;

  // Secondary attribute modifiers
  secondaryAttributeModifiers: {
    perception: number;
    willpower: number;
    luck: number;
    focus: number;
  };

  // Time bar attributes
  timeBarAttributes: {
    maxActionPoints: number;
    baseRegenerationRate: number;
    segmentTimeModifier: number;
    damageInterruptionChance: number;
    timeBarBehaviors: {
      name: string;
      description: string;
      triggerCondition: string;
      effect: string;
      magnitude: number;
    }[];
  };

  // Attribute modifiers
  attributeModifiers: {
    derivedAttributeModifiers: {
      attackPower: number;
      spellPower: number;
      defense: number;
      magicResistance: number;
      criticalChance: number;
      evasion: number;
      initiative: number;
    };
    specialAttributeBonuses: {
      stealth: number;
      persuasion: number;
      intimidation: number;
      crafting: number;
      survival: number;
    };
    elementalAffinityBonuses: {
      fire: number;
      water: number;
      earth: number;
      air: number;
      light: number;
      shadow: number;
    };
  };

  // Resource system
  resourceSystem: {
    primaryResourceType: string;
    baseResourceValue: number;
    resourceGrowthPerLevel: number;
    resourceRegenBase: number;
    resourceMechanics: {
      name: string;
      description: string;
      triggerType: string;
      effect: string;
      cooldown: number;
    }[];
    resourceApInteraction: {
      apGainEffect: string;
      apUseEffect: string;
      resourceThresholdEffects: {
        threshold: number;
        apEffect: string;
        magnitude: number;
      }[];
    };
  };

  // Movement attributes
  movementAttributes: {
    style: string;
    baseSpeed: number;
    terrainModifiers: {
      road: number;
      forest: number;
      mountain: number;
      water: number;
      swamp: number;
    };
    baseCooldown: number;
    staminaCost: number;
    specialMovementAbilities: {
      name: string;
      description: string;
      unlockLevel: number;
      effect: string;
      cooldown: number;
    }[];
  };
}
