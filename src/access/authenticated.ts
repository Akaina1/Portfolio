import type { AccessArgs } from 'payload';

import type { User } from '@/payload-types';

type isAuthenticated = (args: AccessArgs<User>) => boolean;

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  // Only grant access if user exists and is from the users collection (admin)
  return Boolean(user && user.collection === 'users');
};
