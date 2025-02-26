import type { CollectionConfig } from 'payload';

import { player } from '../../access/player';
import { authenticated } from '../../access/authenticated';

export const Players: CollectionConfig = {
  slug: 'players',
  access: {
    admin: authenticated, // Only admins can access in admin panel
    create: authenticated, // Only admins can create players
    delete: authenticated, // Only admins can delete players
    read: player, // Both players and admins can read
    update: ({ req: { user }, id }) => {
      // Players can only update their own profile, admins can update any
      if (user?.collection === 'users') return true; // Admin users
      return user?.id === id; // The player themselves
    },
  },
  admin: {
    defaultColumns: ['username', 'email', 'createdAt'],
    useAsTitle: 'username',
  },
  auth: true, // Enable auth for players
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
    },
    // Add any other player-specific fields
  ],
  timestamps: true,
};
