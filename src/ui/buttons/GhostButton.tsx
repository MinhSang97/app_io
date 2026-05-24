import { Pressable, StyleSheet, Text } from 'react-native';

import type { AppPalette } from '../palette';
import { pressedStyle } from '../shared/pressed';

type GhostButtonProps = {
  palette: AppPalette;
  label: string;
  onPress: () => void;
};

export function GhostButton({ palette, label, onPress }: GhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghostButton, pressed && pressedStyle]}
    >
      <Text style={[styles.ghostLabel, { color: palette.subText }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ghostButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
