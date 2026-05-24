import { router } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import {
  ArrowRight,
  Camera as CameraIcon,
  CheckCircle2,
  Image as ImageIcon,
  ShieldAlert,
  Sparkles,
} from 'lucide-react-native';
import { useAuthStore } from '../src/store/auth';
import { useMealPermissions } from '../src/hooks/use_meal_permissions';
import { getLocale } from '../src/lib/localization';
import { savePermissionGateCompleted } from '../src/lib/permission_persistence';
import { useAppTheme } from '../src/hooks/use_app_theme';
import {
  AppCard,
  GhostButton,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionLabel,
  spacing,
  type AppPalette,
} from '@/src/ui';
import { performSignOut } from '../src/lib/auth_session';

export default function PermissionsScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const locale = getLocale(selectedCountry);
  const { palette } = useAppTheme();
  const completePermissionGate = useAuthStore((state) => state.completePermissionGate);
  const { permissions, checking, syncPermissions, ensurePermissions, hasAllPermissions } = useMealPermissions();
  const hasCheckedRef = useRef(false);

  const message = useMemo(() => {
    if (checking) return locale.permissions.checking;
    if (hasAllPermissions) return locale.permissions.granted;
    return permissions.canAskAgain ? locale.permissions.needPermission : locale.permissions.blocked;
  }, [checking, hasAllPermissions, permissions.canAskAgain, locale]);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    void syncPermissions();
  }, [syncPermissions]);

  useEffect(() => {
    if (!hasAllPermissions) return;
    completePermissionGate();
    void savePermissionGateCompleted(true);
  }, [completePermissionGate, hasAllPermissions]);

  const handleGrantPermissions = async () => {
    const result = await ensurePermissions();

    if (result.cameraGranted && result.mediaGranted) {
      completePermissionGate();
      void savePermissionGateCompleted(true);
      return;
    }

    Alert.alert(locale.permissions.title, locale.permissions.notAvailable);
  };

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert('Settings', 'Please open Settings manually to enable permissions.');
    }
  };

  const handleLogout = () => {
    void performSignOut().then(() => router.replace('/'));
  };

  const footer = (
    <View style={styles.footer}>
      <PrimaryButton
        palette={palette}
        label={locale.permissions.grantButton}
        onPress={handleGrantPermissions}
        icon={ArrowRight}
      />
      <GhostButton palette={palette} label={locale.permissions.openSettings} onPress={handleOpenSettings} />
      <GhostButton palette={palette} label={locale.permissions.logout} onPress={handleLogout} />
    </View>
  );

  return (
    <Screen palette={palette} footer={footer} contentStyle={styles.centered}>
      <View style={[styles.badge, { backgroundColor: palette.accentSoft }]}>
        <Sparkles size={14} color={palette.accent} />
        <Text style={[styles.badgeText, { color: palette.accentText }]}>{locale.permissions.badge}</Text>
      </View>

      <ScreenHeader
        palette={palette}
        title={locale.permissions.title}
        description={message}
        right={
          <View style={[styles.heroIcon, { backgroundColor: palette.rowBg, borderColor: palette.border }]}>
            <ShieldAlert size={30} color={palette.accent} />
          </View>
        }
      />

      <AppCard palette={palette}>
        <SectionLabel palette={palette} label={locale.permissions.camera} />
        <PermissionRow
          palette={palette}
          icon={CameraIcon}
          title={locale.permissions.camera}
          description={locale.permissions.cameraDesc}
          granted={permissions.cameraGranted}
        />
        <View style={styles.permissionGap} />
        <PermissionRow
          palette={palette}
          icon={ImageIcon}
          title={locale.permissions.photo}
          description={locale.permissions.photoDesc}
          granted={permissions.mediaGranted}
        />
      </AppCard>
    </Screen>
  );
}

function PermissionRow({
  palette,
  icon: Icon,
  title,
  description,
  granted,
}: {
  palette: AppPalette;
  icon: typeof CameraIcon;
  title: string;
  description: string;
  granted: boolean;
}) {
  return (
    <View style={[styles.permissionRow, { backgroundColor: palette.rowBg }]}>
      <View style={[styles.permissionIcon, { backgroundColor: palette.cardBg }]}>
        <Icon size={18} color={palette.accent} />
      </View>
      <View style={styles.permissionText}>
        <Text style={[styles.permissionTitle, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.permissionDesc, { color: palette.subText }]}>{description}</Text>
      </View>
      <CheckCircle2 size={18} color={granted ? palette.accent : palette.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionGap: {
    height: spacing.sm,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: 14,
    padding: spacing.md,
  },
  permissionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  permissionDesc: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    gap: spacing.sm,
  },
});
