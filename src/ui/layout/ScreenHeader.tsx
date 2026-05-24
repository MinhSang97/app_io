import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { AppPalette } from '../palette';
import { spacing } from '../palette';

type ScreenHeaderProps = {
  palette: AppPalette;
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
};

export function ScreenHeader({ palette, eyebrow, title, description, right }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: palette.accent }]}>{eyebrow}</Text>
        ) : null}
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: palette.subText }]}>{description}</Text>
        ) : null}
      </View>
      {right ? <View style={styles.headerRight}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  headerRight: {
    marginTop: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
  },
});
