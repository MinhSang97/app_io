import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';

type FeaturePillProps = {
  palette: AppPalette;
  icon: LucideIcon;
  title: string;
};

export function FeaturePill({ palette, icon: Icon, title }: FeaturePillProps) {
  return (
    <View style={[styles.featurePill, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
      <View style={[styles.featureIcon, { backgroundColor: palette.accentSoft }]}>
        <Icon size={15} color={palette.accent} />
      </View>
      <Text style={[styles.featureTitle, { color: palette.text }]} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  featurePill: {
    flex: 1,
    minWidth: 96,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
