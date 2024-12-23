export type SecretData = {
  code: string;
  title: string;
  content: string;
};

export const secretCodes: SecretData[] = [
  {
    code: 'HELLO',
    title: 'Hello Secret',
    content: 'You found the first secret!',
  },
  {
    code: 'DEV',
    title: 'Developer Mode',
    content: "You've unlocked developer insights.",
  },
  {
    code: 'PUZZLE',
    title: 'Puzzle Master',
    content: "You're getting good at this!",
  },
];
