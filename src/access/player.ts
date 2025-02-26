import type { AccessArgs } from 'payload';

type isPlayerAccess = (args: AccessArgs) => boolean;

export const player: isPlayerAccess = ({ req: { user } }) => {
  // Grant access to admin users or authenticated players
  return Boolean(
    user && (user.collection === 'users' || user.collection === 'players')
  );
};
