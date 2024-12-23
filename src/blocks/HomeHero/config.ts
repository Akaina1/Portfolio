import type { Block } from 'payload';
import { linkGroup } from '../../fields/linkGroup';

export const HomeHero: Block = {
  slug: 'homeHero', // Unique identifier for the block
  interfaceName: 'HomeHeroBlock',
  labels: {
    singular: 'Home Hero',
    plural: 'Home Heroes',
  },
  fields: [
    {
      name: 'mainText',
      type: 'text',
      label: 'Main Text',
      required: true,
      admin: {
        placeholder:
          "Hello, I'm {Your Name}, what kind of problems can I solve for you today?",
        description:
          'The large headline displayed prominently in the hero section.',
      },
    },
    {
      name: 'dynamicText',
      type: 'array',
      label: 'Dynamic Text',
      required: true,
      minRows: 1,
      admin: {
        description:
          'List of rotating text snippets displayed with typing animations.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Text',
          admin: {
            placeholder: 'e.g., Building scalable web applications.',
          },
        },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
};
