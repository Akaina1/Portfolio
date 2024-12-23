export type MediaData = {
  type: 'image' | 'gif' | 'giphy';
  alt?: string;
} & (
  | {
      type: 'giphy';
      giphyId: string;
    }
  | {
      type: 'image' | 'gif';
      url: string;
    }
);

export type SecretData = {
  code: string;
  title: string;
  content?: string;
  achievementId?: string;
  media?: MediaData;
};

export const secretCodes: SecretData[] = [
  {
    code: 'HELLO',
    title: 'Hello Secret',
    content: 'You found the first secret!',
    achievementId: 'secret-hello',
  },
  {
    code: 'DEV',
    title: 'Developer Mode',
    content: "You've unlocked developer insights.",
    achievementId: 'secret-dev-mode',
  },
  {
    code: 'HELLOWORLD',
    title: 'Nerd Mode',
    content: 'You are a nerd!',
    achievementId: 'secret-nerd-mode',
  },
  {
    code: 'MORELETTERS',
    title: 'Alphabet Unlocked',
    content: 'You now have access to more letters!',
    achievementId: 'secret-alphabet',
  },
  {
    code: 'PUZZLE',
    title: 'Puzzle Master',
    content: "You're getting good at this!",
    achievementId: 'secret-puzzle-master',
  },
  {
    code: 'UWU',
    title: 'UwU Mode',
    media: {
      type: 'giphy',
      giphyId: 'GVtvJRr3sJDbkNdumY',
      alt: 'UwU kawaii animation',
    },
    achievementId: 'secret-uwu',
  },
  {
    code: 'KAWAII',
    title: 'Kawaii Mode',
    media: {
      type: 'giphy',
      giphyId: 'jFNTzpnwahSwg',
      alt: 'Kawaii animation',
    },
    achievementId: 'secret-kawaii',
  },
];
