import type { Block } from 'payload';

export const AnimateMedia: Block = {
  slug: 'animateMedia',
  interfaceName: 'AnimateMedia',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'position',
      type: 'select',
      options: ['start', 'end'],
      defaultValue: 'start',
      required: true,
    },
  ],
};
