import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';
import { pressedStyle } from '../shared/pressed';

type PrimaryButtonProps = {
  palette: AppPalette;
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
};

export function PrimaryButton({ palette, label, onPress, icon: Icon }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: palette.primaryBtnBg },
        pressed && pressedStyle,
      ]}
    >
      {Icon ? <Icon size={18} color={palette.primaryBtnText} /> : null}
      <Text style={[styles.primaryLabel, { color: palette.primaryBtnText }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    minHeight: 52,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
