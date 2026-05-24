import { StyleSheet, Text, View } from 'react-native';

import type { AppPalette } from '../palette';
import { spacing } from '../palette';

type AuthDividerProps = {
  label: string;
  palette: AppPalette;
};

export function AuthDivider({ label, palette }: AuthDividerProps) {
  return (
    <View style={styles.dividerRow}>
      <View style={[styles.dividerLine, { backgroundColor: palette.border }]} />
      <Text style={[styles.dividerText, { color: palette.muted }]}>{label}</Text>
      <View style={[styles.dividerLine, { backgroundColor: palette.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
