import { ButtonProps } from '@/components/ui/button';

export interface KeybindButtonProps extends ButtonProps {
  actionId: string;
  label: string;
  keybind: string;
  onAction: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onKeybindChange?: (actionId: string, newKeybind: string) => void;
  showKeybindLabel?: boolean;
}
