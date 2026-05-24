import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';
import { pressedStyle } from '../shared/pressed';
import { SectionLabel } from '../typography/SectionLabel';

type SelectFieldProps = {
  palette: AppPalette;
  label: string;
  value: string;
  onPress: () => void;
};

export function SelectField({ palette, label, value, onPress }: SelectFieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <SectionLabel palette={palette} label={label} />
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.selectField,
          { backgroundColor: palette.cardBg, borderColor: palette.border },
          pressed && pressedStyle,
        ]}
      >
        <Text style={[styles.selectValue, { color: palette.text }]} numberOfLines={1}>
          {value}
        </Text>
        <Text style={[styles.selectChevron, { color: palette.muted }]}>▾</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: spacing.lg,
  },
  selectField: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  selectValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  selectChevron: {
    fontSize: 14,
    fontWeight: '700',
  },
});
