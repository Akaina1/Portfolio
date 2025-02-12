import type { Block } from 'payload';

export const Marquee: Block = {
  slug: 'marquee',
  fields: [
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
      ],
    },
  ],
  interfaceName: 'MarqueeBlockType',
};
