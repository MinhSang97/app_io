import { StyleSheet, Text } from 'react-native';

import type { AppPalette } from '../palette';
import { spacing } from '../palette';

type SectionLabelProps = {
  palette: AppPalette;
  label: string;
};

export function SectionLabel({ palette, label }: SectionLabelProps) {
  return <Text style={[styles.sectionLabel, { color: palette.muted }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
});
