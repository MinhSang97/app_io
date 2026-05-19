import { router } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Camera as CameraIcon, Image as ImageIcon, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../src/store/auth';
import { useMealPermissions } from '../src/hooks/useMealPermissions';
import { getLocale } from '../src/lib/localization';
import { savePermissionGateCompleted } from '../src/lib/permissionPersistence';

export default function PermissionsScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const locale = getLocale(selectedCountry);
  const completePermissionGate = useAuthStore((state) => state.completePermissionGate);
  const signOut = useAuthStore((state) => state.signOut);
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
    signOut();
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.glow} />
      <View style={styles.card}>
        <View style={styles.badge}>
          <Sparkles size={14} color="#A78BFA" />
          <Text style={styles.badgeText}>{locale.permissions.badge}</Text>
        </View>

        <View style={styles.heroIcon}>
          <ShieldAlert size={34} color="#F8FAFC" />
        </View>

        <Text style={styles.title}>{locale.permissions.title}</Text>
        <Text style={styles.description}>{message}</Text>

        <View style={styles.permissionList}>
          <View style={styles.permissionRow}>
            <View style={styles.permissionIcon}><CameraIcon size={18} color="#34D399" /></View>
            <View style={styles.permissionTextWrap}>
              <Text style={styles.permissionTitle}>{locale.permissions.camera}</Text>
              <Text style={styles.permissionText}>{locale.permissions.cameraDesc}</Text>
            </View>
            <CheckCircle2 size={18} color={permissions.cameraGranted ? '#34D399' : '#64748B'} />
          </View>

          <View style={styles.permissionRow}>
            <View style={styles.permissionIcon}><ImageIcon size={18} color="#60A5FA" /></View>
            <View style={styles.permissionTextWrap}>
              <Text style={styles.permissionTitle}>{locale.permissions.photo}</Text>
              <Text style={styles.permissionText}>{locale.permissions.photoDesc}</Text>
            </View>
            <CheckCircle2 size={18} color={permissions.mediaGranted ? '#34D399' : '#64748B'} />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleGrantPermissions}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.primaryButtonText}>{locale.permissions.grantButton}</Text>
            <ArrowRight size={18} color="#08111F" />
          </Pressable>

          <Pressable
            onPress={handleOpenSettings}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.secondaryButtonText}>{locale.permissions.openSettings}</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [styles.ghostButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.ghostButtonText}>{locale.permissions.logout}</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#050816',
    padding: 24,
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(124, 58, 237, 0.20)',
    opacity: 0.9,
  },
  card: {
    borderRadius: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    marginBottom: 18,
  },
  badgeText: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    color: 'rgba(226, 232, 240, 0.82)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  permissionList: {
    gap: 12,
    marginBottom: 24,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  permissionIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  permissionTextWrap: {
    flex: 1,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  permissionText: {
    color: 'rgba(148, 163, 184, 0.95)',
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 18,
    backgroundColor: '#A78BFA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#08111F',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  ghostButtonText: {
    color: 'rgba(226, 232, 240, 0.75)',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
