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
  name: string; // Display name of the class
  description: string; // Detailed description of the class
  category: string; // Broad category (WARRIOR, MAGE, etc.)
  difficulty: number; // 1-10 rating of how difficult the class is to play

  // Base attributes for level 1 character of this class
  baseAttributes: {
    strength: number; // Physical power
    intelligence: number; // Magical aptitude
    dexterity: number; // Agility and precision
    constitution: number; // Health and stamina
    wisdom: number; // Insight and willpower
    charisma: number; // Social influence
  };

  // How attributes increase per level
  attributeGrowth: {
    strength: number; // Strength increase per level
    intelligence: number; // Intelligence increase per level
    dexterity: number; // Dexterity increase per level
    constitution: number; // Constitution increase per level
    wisdom: number; // Wisdom increase per level
    charisma: number; // Charisma increase per level
  };

  // Starting equipment and abilities
  startingItems: string[]; // Items given at creation
  startingAbilities: string[]; // Abilities available at level 1
  startingSkills: string[]; // Skills available at level 1

  // Equipment and ability restrictions
  restrictions: {
    armorTypes: {
      // Restrictions on armor types
      light: string; // How restricted (NONE, PENALTY, FORBIDDEN)
      medium: string;
      heavy: string;
    };
    weaponTypes: {
      // Restrictions on weapon types
      oneHanded: string;
      twoHanded: string;
      ranged: string;
      magical: string;
    };
    abilityCategories: {
      // Restrictions on ability categories
      physical: string;
      magical: string;
      support: string;
      stealth: string;
    };
  };

  // Special features of this class
  classFeatures: {
    name: string; // Name of the feature
    description: string; // Description of what it does
    unlockedAtLevel: number; // When it becomes available
  }[];

  // Recommended playstyles
  recommendedPlaystyles: string[];

  // Visual representation
  iconUrl: string; // URL to class icon

  // Secondary attribute modifiers
  secondaryAttributeModifiers: {
    perception: number; // Perception modifier
    willpower: number; // Willpower modifier
    luck: number; // Luck modifier
    focus: number; // Focus modifier
  };

  // Time bar attributes
  timeBarAttributes: {
    maxActionPoints: number; // Maximum AP this class can store
    baseRegenerationRate: number; // Base AP regeneration rate
    segmentTimeModifier: number; // Modifier to base segment time (1.0 = normal)
    damageInterruptionChance: number; // Chance that damage interrupts time bar (0-100%)
    timeBarBehaviors: {
      name: string; // Name of the behavior
      description: string; // Description of what it does
      triggerCondition: string; // When this behavior activates
      effect: string; // What happens when triggered
      magnitude: number; // How strong the effect is
    }[];
  };

  // Attribute modifiers
  attributeModifiers: {
    derivedAttributeModifiers: {
      attackPower: number; // Additional attack power modifier
      spellPower: number; // Additional spell power modifier
      defense: number; // Additional defense modifier
      magicResistance: number; // Additional magic resistance modifier
      criticalChance: number; // Additional critical chance modifier
      evasion: number; // Additional evasion modifier
      initiative: number; // Additional initiative modifier
    };
    specialAttributeBonuses: {
      stealth: number; // Stealth bonus
      persuasion: number; // Persuasion bonus
      intimidation: number; // Intimidation bonus
      crafting: number; // Crafting bonus
      survival: number; // Survival bonus
    };
    elementalAffinityBonuses: {
      fire: number; // Fire affinity bonus
      water: number; // Water affinity bonus
      earth: number; // Earth affinity bonus
      air: number; // Air affinity bonus
      light: number; // Light affinity bonus
      shadow: number; // Shadow affinity bonus
    };
  };

  health: {
    // Health stats
    current: number;
    max: number;
  };

  // Resource system
  resourceSystem: {
    primaryResourceType: (typeof RESOURCE_TYPE)[keyof typeof RESOURCE_TYPE]; // From RESOURCE_TYPE
    baseResourceValue: number; // Starting value at level 1
    resourceGrowthPerLevel: number; // How much it increases per level
    resourceRegenBase: number; // Base regeneration rate
    resourceMechanics: {
      name: string; // Name of the mechanic
      description: string; // Description of what it does
      triggerType: string; // "onUse", "onGain", "onDeplete", "passive"
      effect: string; // Effect when triggered
      cooldown: number; // Cooldown in ms before can trigger again
    }[];
    resourceApInteraction: {
      apGainEffect: string; // What happens to resource when AP is gained
      apUseEffect: string; // What happens to resource when AP is used
      resourceThresholdEffects: {
        threshold: number; // Resource threshold percentage
        apEffect: string; // Effect on AP when resource crosses threshold
        magnitude: number; // Magnitude of the effect
      }[];
    };
  };

  // Add movement attributes to the character class
  movementAttributes: {
    style: (typeof MOVEMENT_STYLE)[keyof typeof MOVEMENT_STYLE];
    baseSpeed: number; // Base movement speed for this class
    terrainModifiers: {
      // How different terrains affect this class
      road: number; // Modifier for road terrain (< 1.0 = faster)
      forest: number; // Modifier for forest terrain (> 1.0 = slower)
      mountain: number; // Modifier for mountain terrain
      water: number; // Modifier for water terrain
      swamp: number; // Modifier for swamp terrain
    };
    baseCooldown: number; // Base cooldown between movements in milliseconds
    staminaCost: number; // Stamina cost per movement (if applicable)
    specialMovementAbilities: {
      // Special movement abilities for this class
      name: string;
      description: string;
      unlockLevel: number;
      effect: string;
      cooldown: number;
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
}
