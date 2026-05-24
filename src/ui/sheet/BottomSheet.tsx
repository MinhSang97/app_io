import type { ReactNode } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';

const SHEET_LIST_MAX_HEIGHT = Dimensions.get('window').height * 0.52;

type BottomSheetProps = {
  visible: boolean;
  palette: AppPalette;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ visible, palette, title, onClose, children }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable
          style={[styles.sheetBackdrop, { backgroundColor: palette.overlay }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <View style={[styles.sheet, { backgroundColor: palette.screenBg }]}>
          <View style={[styles.sheetHandle, { backgroundColor: palette.border }]} />
          <Text style={[styles.sheetTitle, { color: palette.text }]}>{title}</Text>
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator
            bounces
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    maxHeight: '72%',
  },
  sheetScroll: {
    maxHeight: SHEET_LIST_MAX_HEIGHT,
  },
  sheetScrollContent: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
});
