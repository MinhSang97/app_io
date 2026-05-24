import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import type { AppPalette } from '../palette';
import { radius, spacing } from '../palette';
import { pressedStyle } from '../shared/pressed';

type OAuthButtonProps = {
  palette: AppPalette;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant: 'google' | 'apple';
  icon: ReactNode;
};

export function OAuthButton({
  palette,
  label,
  onPress,
  disabled,
  variant,
  icon,
}: OAuthButtonProps) {
  const isApple = variant === 'apple';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.oauthButton,
        {
          opacity: disabled ? 0.55 : 1,
          backgroundColor: isApple ? palette.appleBtnBg : palette.googleBtnBg,
          borderColor: isApple ? palette.appleBtnBg : palette.googleBtnBorder,
        },
        pressed && !disabled && pressedStyle,
      ]}
    >
      {icon}
      <Text
        style={[styles.oauthLabel, { color: isApple ? palette.appleBtnText : palette.text }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  oauthButton: {
    minHeight: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  oauthLabel: {
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
});
