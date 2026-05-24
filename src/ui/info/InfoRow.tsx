import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';

type InfoRowProps = {
  palette: AppPalette;
  icon: LucideIcon;
  label: string;
  value: string;
};

export function InfoRow({ palette, icon: Icon, label, value }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
      <View style={[styles.infoIcon, { backgroundColor: palette.rowBg }]}>
        <Icon size={17} color={palette.muted} />
      </View>
      <View style={styles.infoText}>
        <Text style={[styles.infoLabel, { color: palette.muted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: palette.text }]} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '600',
  },
});
