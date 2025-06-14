import type { Block } from 'payload';

export const HighlightText: Block = {
  slug: 'highlightText',
  interfaceName: 'HighlightTextBlock',
  labels: {
    singular: 'Highlight Text',
    plural: 'Highlight Texts',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      label: 'Text Content',
      required: true,
      admin: {
        description: 'Enter the text that will be highlighted on scroll',
        placeholder: 'Enter your text here...',
      },
    },
    {
      name: 'highlightStyleLight',
      type: 'text',
      label: 'Light Mode Highlight Style',
      required: true,
      admin: {
        description: 'Enter Tailwind classes for light mode highlight effect',
        placeholder:
          'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent',
      },
    },
    {
      name: 'highlightStyleDark',
      type: 'text',
      label: 'Dark Mode Highlight Style',
      required: true,
      admin: {
        description: 'Enter Tailwind classes for dark mode highlight effect',
        placeholder:
          'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
      },
    },
  ],
};
