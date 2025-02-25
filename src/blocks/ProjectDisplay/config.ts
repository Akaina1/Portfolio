import type { Block, Field } from 'payload';

const projectFields: Field[] = [
  {
    name: 'displayImage',
    type: 'upload',
    relationTo: 'media',
    required: true,
    label: 'Project Image',
  },
  {
    name: 'title',
    type: 'text',
    required: true,
    label: 'Project Title',
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    label: 'Project Slug',
  },
];

export const ProjectDisplay: Block = {
  slug: 'projectDisplay',
  interfaceName: 'ProjectDisplayBlockType',
  labels: {
    singular: 'Project Display',
    plural: 'Project Displays',
  },
  fields: [
    {
      name: 'projects',
      type: 'array',
      label: 'Projects',
      admin: {
        initCollapsed: true,
      },
      fields: projectFields,
    },
  ],
};
