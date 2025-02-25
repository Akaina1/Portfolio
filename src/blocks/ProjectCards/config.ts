import type { Block } from 'payload';

export const ProjectCards: Block = {
  slug: 'projectCards',
  interfaceName: 'ProjectCardsBlockType',
  labels: {
    singular: 'Project Cards',
    plural: 'Project Cards',
  },
  fields: [
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum Projects to Display',
      defaultValue: 6,
      min: 1,
      max: 20,
    },
  ],
};
