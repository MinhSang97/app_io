import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';

type AppCardProps = {
  palette: AppPalette;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppCard({ palette, children, style }: AppCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.cardBg, borderColor: palette.cardBorder },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
});
