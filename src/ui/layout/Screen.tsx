import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppPalette } from '../palette';
import { spacing } from '../palette';

type ScreenProps = {
  palette: AppPalette;
  children: ReactNode;
  footer?: ReactNode;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom')[];
};

export function Screen({
  palette,
  children,
  footer,
  scrollable = true,
  contentStyle,
  edges = ['top'],
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = footer ? spacing.md : Math.max(insets.bottom, spacing.lg);

  const body = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomPad },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.screenBg }]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.flex}>
          {body}
          {footer ? (
            <View
              style={[
                styles.footer,
                {
                  backgroundColor: palette.screenBg,
                  borderTopColor: palette.border,
                  paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xs,
                },
              ]}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
});
