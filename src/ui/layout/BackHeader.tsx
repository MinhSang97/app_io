import { ArrowLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';
import { pressedStyle } from '../shared/pressed';

type BackHeaderProps = {
  palette: AppPalette;
  title: string;
  onBack: () => void;
};

export function BackHeader({ palette, title, onBack }: BackHeaderProps) {
  return (
    <View style={styles.backHeader}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.backButton,
          { backgroundColor: palette.cardBg, borderColor: palette.border },
          pressed && pressedStyle,
        ]}
      >
        <ArrowLeft size={20} color={palette.text} />
      </Pressable>
      <Text style={[styles.backTitle, { color: palette.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
  },
});
