import type { Block } from 'payload';

/**
 * Animation preset options
 * Each option represents a predefined animation configuration
 */
const ANIMATION_PRESETS = [
  {
    label: 'Fade In',
    value: 'fadeIn',
  },
  {
    label: 'Type Writer',
    value: 'typeWriter',
  },
  {
    label: 'Slide Up',
    value: 'slideUp',
  },
  {
    label: 'Slide Down',
    value: 'slideDown',
  },
  {
    label: 'Bounce In',
    value: 'bounceIn',
  },
  {
    label: 'Wave',
    value: 'wave',
  },
] as const;

/**
 * Text placement options
 */
const PLACEMENT_OPTIONS = [
  {
    label: 'Left',
    value: 'text-left',
  },
  {
    label: 'Center',
    value: 'text-center',
  },
  {
    label: 'Right',
    value: 'text-right',
  },
] as const;

export const AnimateText: Block = {
  slug: 'animateText',
  interfaceName: 'AnimateTextBlock',
  labels: {
    singular: 'Animate Text',
    plural: 'Animate Texts',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      label: 'Text to Animate',
      required: true,
      admin: {
        description: 'Enter the text content you want to animate',
      },
    },
    {
      name: 'placement',
      type: 'select',
      label: 'Text Placement',
      required: true,
      defaultValue: 'text-left',
      options: [...PLACEMENT_OPTIONS],
      admin: {
        description: 'Select the text alignment',
      },
    },
    {
      name: 'animation',
      type: 'select',
      label: 'Animation Preset',
      required: true,
      defaultValue: 'fadeIn',
      options: [...ANIMATION_PRESETS],
      admin: {
        description: 'Select the animation style to apply to the text',
      },
    },
  ],
};
